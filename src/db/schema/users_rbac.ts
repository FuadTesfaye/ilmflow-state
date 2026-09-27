import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { events, eventDays } from './events';
import { registrations } from './registrations';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', {
    enum: [
      'superadmin',
      'admin',
      'event_manager',
      'competition_manager',
      'judge',
      'moderator',
      'staff',
      'participant',
      'visitor'
    ]
  }).notNull().default('participant'),
  avatar: text('avatar').notNull(),
  title: text('title'),
  phone: text('phone'),
  status: text('status', {
    enum: ['active', 'pending_verification', 'suspended', 'banned']
  }).notNull().default('active'),
  createdAt: text('created_at').notNull()
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').notNull(),
  actorName: text('actor_name').notNull(),
  actorRole: text('actor_role').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(), // 'event' | 'competition' | 'grade' | 'user' | 'registration'
  entityId: text('entity_id').notNull(),
  details: text('details'), // JSON string: {oldValue, newValue, reason}
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull()
});

export const attendanceRecords = sqliteTable('attendance_records', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  eventDayId: text('event_day_id').references(() => eventDays.id, { onDelete: 'cascade' }),
  registrationId: text('registration_id').references(() => registrations.id, { onDelete: 'cascade' }),
  participantName: text('participant_name').notNull(),
  ticketNumber: text('ticket_number').notNull(),
  checkedInAt: text('checked_in_at').notNull(),
  checkedInBy: text('checked_in_by').notNull(),
  method: text('method', { enum: ['QR', 'MANUAL'] }).notNull().default('QR')
});

export const certificates = sqliteTable('certificates', {
  id: text('id').primaryKey(),
  certificateNumber: text('certificate_number').notNull().unique(),
  recipientName: text('recipient_name').notNull(),
  recipientEmail: text('recipient_email').notNull(),
  eventTitle: text('event_title').notNull(),
  competitionTitle: text('competition_title'),
  awardType: text('award_type', {
    enum: ['COMPLETION', 'MERIT', 'TOP_10', 'LAUREATE', 'PARTICIPATION']
  }).notNull(),
  issueDate: text('issue_date').notNull(),
  verificationHash: text('verification_hash').notNull(),
  qrCodeUrl: text('qr_code_url').notNull(),
  issuerName: text('issuer_name').notNull(),
  issuerTitle: text('issuer_title').notNull()
});

export const announcements = sqliteTable('announcements', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  arabicTitle: text('arabic_title'),
  content: text('content').notNull(),
  category: text('category', {
    enum: ['urgent', 'schedule', 'competition', 'general']
  }).notNull().default('general'),
  author: text('author').notNull(),
  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull()
});
