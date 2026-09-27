import { db } from '../../../db';
import * as schema from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export interface CreateEventInput {
  name: string;
  description: string;
  shortDescription?: string;
  type?: 'CONFERENCE' | 'LECTURE' | 'COMPETITION' | 'QUIZ' | 'WORKSHOP' | 'CAMP' | 'SEMINAR' | 'HYBRID' | 'CUSTOM';
  coverImage: string;
  startDate: string;
  endDate: string;
  timezone?: string;
  venueName: string;
  venueAddress: string;
  onlineUrl?: string;
  capacity?: number;
  languages?: string[];
  createdBy?: string;
}

export async function getAllEvents() {
  return await db.select().from(schema.events).orderBy(desc(schema.events.startDate));
}

export async function getEventBySlug(slug: string) {
  const result = await db.select().from(schema.events).where(eq(schema.events.slug, slug)).limit(1);
  if (!result[0]) return null;

  const event = result[0];
  const days = await db.select().from(schema.eventDays).where(eq(schema.eventDays.eventId, event.id));
  const sessions = await db.select().from(schema.sessions).where(eq(schema.sessions.eventId, event.id));
  const tiers = await db.select().from(schema.ticketTiers).where(eq(schema.ticketTiers.eventId, event.id));

  return {
    ...event,
    days,
    sessions,
    tiers
  };
}

export async function createEvent(input: CreateEventInput) {
  const id = `evt-${Date.now()}`;
  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const now = new Date().toISOString();

  await db.insert(schema.events).values({
    id,
    name: input.name,
    slug,
    description: input.description,
    shortDescription: input.shortDescription || input.description.slice(0, 120),
    type: input.type || 'CONFERENCE',
    status: 'REGISTRATION_OPEN',
    coverImage: input.coverImage,
    startDate: input.startDate,
    endDate: input.endDate,
    timezone: input.timezone || 'GMT+3 (Madinah Time)',
    venueName: input.venueName,
    venueAddress: input.venueAddress,
    onlineUrl: input.onlineUrl,
    capacity: input.capacity || 500,
    languages: JSON.stringify(input.languages || ['Arabic', 'English']),
    createdBy: input.createdBy || 'usr-admin',
    createdAt: now,
    updatedAt: now
  });

  // Create initial day 1
  await db.insert(schema.eventDays).values({
    id: `day-${id}-1`,
    eventId: id,
    date: input.startDate.split('T')[0],
    dayNumber: 1,
    title: 'Day 1: Opening & Assembly',
    capacity: input.capacity || 500,
    registeredCount: 0,
    registrationOpen: true
  });

  // Create default free General Pass tier
  await db.insert(schema.ticketTiers).values({
    id: `tkt-${id}-general`,
    eventId: id,
    name: 'General Assembly Pass',
    price: 0,
    currency: 'USD',
    description: 'Complimentary pass for open sanctuary seating and live lectures.',
    capacity: input.capacity || 500,
    registeredCount: 0,
    features: JSON.stringify(['General Seating', 'Program Folder', 'Attendance QR Pass']),
    available: true
  });

  return { id, slug };
}

export async function updateEventStatus(
  eventId: string,
  status: 'DRAFT' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'LIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED'
) {
  const now = new Date().toISOString();
  await db
    .update(schema.events)
    .set({ status, updatedAt: now })
    .where(eq(schema.events.id, eventId));
}
