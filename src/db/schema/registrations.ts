import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { events, eventDays } from './events';

export const ticketTiers = sqliteTable('ticket_tiers', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: real('price').notNull().default(0),
  currency: text('currency').notNull().default('USD'),
  description: text('description').notNull(),
  capacity: integer('capacity').notNull().default(500),
  registeredCount: integer('registered_count').notNull().default(0),
  features: text('features').notNull(), // JSON string: string[]
  available: integer('available', { mode: 'boolean' }).default(true)
});

export const registrations = sqliteTable('registrations', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  ticketTierId: text('ticket_tier_id').notNull().references(() => ticketTiers.id),
  userId: text('user_id').notNull(),
  participantName: text('participant_name').notNull(),
  participantEmail: text('participant_email').notNull(),
  participantPhone: text('participant_phone').notNull(),
  status: text('status', {
    enum: [
      'draft',
      'submitted',
      'pending_review',
      'approved',
      'rejected',
      'waitlisted',
      'checked_in',
      'completed',
      'cancelled'
    ]
  }).notNull().default('approved'),
  ticketNumber: text('ticket_number').notNull().unique(),
  qrToken: text('qr_token').notNull(),
  registeredAt: text('registered_at').notNull(),
  checkedInAt: text('checked_in_at'),
  formAnswers: text('form_answers'), // JSON string
  totalAmount: real('total_amount').default(0),
  discountApplied: text('discount_applied')
});

export const registrationDays = sqliteTable('registration_days', {
  id: text('id').primaryKey(),
  registrationId: text('registration_id').notNull().references(() => registrations.id, { onDelete: 'cascade' }),
  eventDayId: text('event_day_id').notNull().references(() => eventDays.id, { onDelete: 'cascade' })
});

export const waitlistEntries = sqliteTable('waitlist_entries', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  eventDayId: text('event_day_id').references(() => eventDays.id, { onDelete: 'cascade' }),
  ticketTierId: text('ticket_tier_id').references(() => ticketTiers.id),
  participantName: text('participant_name').notNull(),
  participantEmail: text('participant_email').notNull(),
  participantPhone: text('participant_phone'),
  position: integer('position').notNull(),
  status: text('status', {
    enum: ['waiting', 'invited', 'converted', 'expired', 'cancelled']
  }).notNull().default('waiting'),
  notifiedAt: text('notified_at'),
  createdAt: text('created_at').notNull()
});

export const discountCodes = sqliteTable('discount_codes', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  type: text('type', { enum: ['PERCENTAGE', 'FIXED'] }).notNull().default('PERCENTAGE'),
  value: real('value').notNull(),
  minDaysRequired: integer('min_days_required').default(1),
  maxUses: integer('max_uses').default(100),
  currentUses: integer('current_uses').notNull().default(0),
  validFrom: text('valid_from'),
  validUntil: text('valid_until'),
  active: integer('active', { mode: 'boolean' }).default(true)
});
