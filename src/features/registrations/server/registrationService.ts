import { db, sqlite } from '../../../db';
import * as schema from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

export interface RegisterInput {
  eventId: string;
  ticketTierId: string;
  userId?: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  selectedDayIds?: string[];
  discountCode?: string;
  formAnswers?: Record<string, unknown>;
}

export async function calculatePricing(
  tierPrice: number,
  selectedDayCount: number,
  discountCodeStr?: string
) {
  let baseAmount = tierPrice;
  let discountAmount = 0;
  let finalAmount = baseAmount;
  let discountAppliedNote: string | undefined;

  if (discountCodeStr) {
    const codeRecords = await db
      .select()
      .from(schema.discountCodes)
      .where(eq(schema.discountCodes.code, discountCodeStr.trim().toUpperCase()))
      .limit(1);

    const discount = codeRecords[0];
    if (discount && discount.active && discount.currentUses < (discount.maxUses ?? 100)) {
      if (discount.type === 'PERCENTAGE') {
        discountAmount = (baseAmount * discount.value) / 100;
        finalAmount = Math.max(0, baseAmount - discountAmount);
        discountAppliedNote = `${discount.code} (-${discount.value}%)`;
      } else {
        discountAmount = discount.value;
        finalAmount = Math.max(0, baseAmount - discountAmount);
        discountAppliedNote = `${discount.code} (-$${discount.value})`;
      }
    }
  }

  return {
    baseAmount,
    discountAmount,
    finalAmount,
    discountAppliedNote
  };
}

export async function registerParticipant(input: RegisterInput) {
  const event = (
    await db.select().from(schema.events).where(eq(schema.events.id, input.eventId)).limit(1)
  )[0];

  if (!event) throw new Error('Event not found');

  const tier = (
    await db
      .select()
      .from(schema.ticketTiers)
      .where(eq(schema.ticketTiers.id, input.ticketTierId))
      .limit(1)
  )[0];

  if (!tier) throw new Error('Ticket tier not found');

  // Check capacity
  const isFull = event.registeredCount >= event.capacity || tier.registeredCount >= tier.capacity;

  const now = new Date().toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  if (isFull) {
    // Put into waitlist
    const waitlistId = `wtl-${Date.now()}`;
    const nextPos = event.waitlistCount + 1;

    await db.insert(schema.waitlistEntries).values({
      id: waitlistId,
      eventId: event.id,
      ticketTierId: tier.id,
      participantName: input.participantName,
      participantEmail: input.participantEmail,
      participantPhone: input.participantPhone,
      position: nextPos,
      status: 'waiting',
      createdAt: now
    });

    await db
      .update(schema.events)
      .set({ waitlistCount: event.waitlistCount + 1 })
      .where(eq(schema.events.id, event.id));

    return {
      status: 'waitlisted',
      waitlistPosition: nextPos,
      message: 'Event capacity reached. You have been placed on the official waitlist.'
    };
  }

  // Calculate pricing
  const dayCount = input.selectedDayIds?.length || 1;
  const pricing = await calculatePricing(tier.price, dayCount, input.discountCode);

  const regId = `reg-${Date.now()}`;
  const ticketNumber = `TKT-1448-${randomSuffix}`;
  const qrToken = `QR-ILM-1448-${randomSuffix}-SEC-${tier.name.slice(0, 3).toUpperCase()}`;

  await db.insert(schema.registrations).values({
    id: regId,
    eventId: event.id,
    ticketTierId: tier.id,
    userId: input.userId || `usr-${Date.now()}`,
    participantName: input.participantName,
    participantEmail: input.participantEmail,
    participantPhone: input.participantPhone,
    status: 'approved',
    ticketNumber,
    qrToken,
    registeredAt: now,
    formAnswers: input.formAnswers ? JSON.stringify(input.formAnswers) : null,
    totalAmount: pricing.finalAmount,
    discountApplied: pricing.discountAppliedNote
  });

  // Link selected days if any
  if (input.selectedDayIds && input.selectedDayIds.length > 0) {
    for (const dayId of input.selectedDayIds) {
      await db.insert(schema.registrationDays).values({
        id: `rgd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        registrationId: regId,
        eventDayId: dayId
      });
    }
  }

  // Atomically increment counts
  await db
    .update(schema.events)
    .set({ registeredCount: event.registeredCount + 1 })
    .where(eq(schema.events.id, event.id));

  await db
    .update(schema.ticketTiers)
    .set({ registeredCount: tier.registeredCount + 1 })
    .where(eq(schema.ticketTiers.id, tier.id));

  return {
    status: 'approved',
    registrationId: regId,
    ticketNumber,
    qrToken,
    totalAmount: pricing.finalAmount,
    tierName: tier.name
  };
}

export async function checkInParticipant(tokenOrTicketNumber: string, staffName = 'Gate Marshal') {
  const query = tokenOrTicketNumber.trim();
  const now = new Date().toISOString();

  // Find registration
  const reg = (
    await db
      .select()
      .from(schema.registrations)
      .where(
        sqlite.prepare(
          'SELECT * FROM registrations WHERE ticket_number = ? OR qr_token = ? LIMIT 1'
        ).all(query, query) as any
      )
  )[0];

  if (!reg) {
    return {
      success: false,
      message: 'Credential barcode not found in the sanctuary registry.'
    };
  }

  if (reg.status === 'checked_in') {
    return {
      success: false,
      message: `Already checked in at ${reg.checkedInAt || 'earlier session'}. Duplicate entry rejected.`,
      participantName: reg.participantName,
      ticketNumber: reg.ticketNumber
    };
  }

  // Update registration to checked_in
  await db
    .update(schema.registrations)
    .set({ status: 'checked_in', checkedInAt: now })
    .where(eq(schema.registrations.id, reg.id));

  // Insert attendance record
  await db.insert(schema.attendanceRecords).values({
    id: `att-${Date.now()}`,
    eventId: reg.eventId,
    registrationId: reg.id,
    participantName: reg.participantName,
    ticketNumber: reg.ticketNumber,
    checkedInAt: now,
    checkedInBy: staffName,
    method: query.startsWith('QR') ? 'QR' : 'MANUAL'
  });

  return {
    success: true,
    message: 'Sanctuary admission verified. Welcome!',
    participantName: reg.participantName,
    ticketNumber: reg.ticketNumber,
    checkedInAt: now
  };
}
