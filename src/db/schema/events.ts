import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  shortDescription: text('short_description'),
  type: text('type', {
    enum: [
      'CONFERENCE',
      'LECTURE',
      'COMPETITION',
      'QUIZ',
      'WORKSHOP',
      'CAMP',
      'SEMINAR',
      'HYBRID',
      'CUSTOM'
    ]
  }).notNull().default('CONFERENCE'),
  status: text('status', {
    enum: [
      'DRAFT',
      'REGISTRATION_OPEN',
      'REGISTRATION_CLOSED',
      'LIVE',
      'COMPLETED',
      'CANCELLED',
      'ARCHIVED'
    ]
  }).notNull().default('DRAFT'),
  coverImage: text('cover_image').notNull(),
  logo: text('logo'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  timezone: text('timezone').notNull().default('GMT+3 (Madinah Time)'),
  venueName: text('venue_name').notNull(),
  venueAddress: text('venue_address').notNull(),
  onlineUrl: text('online_url'),
  capacity: integer('capacity').notNull().default(500),
  registeredCount: integer('registered_count').notNull().default(0),
  waitlistCount: integer('waitlist_count').notNull().default(0),
  ageRestrictions: text('age_restrictions'),
  genderCategory: text('gender_category').default('all'),
  languages: text('languages'), // JSON string: ["Arabic", "English"]
  formId: text('form_id'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  createdBy: text('created_by'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

export const eventDays = sqliteTable('event_days', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  dayNumber: integer('day_number').notNull().default(1),
  title: text('title').notNull(),
  capacity: integer('capacity').notNull().default(300),
  registeredCount: integer('registered_count').notNull().default(0),
  registrationOpen: integer('registration_open', { mode: 'boolean' }).default(true)
});

export const speakers = sqliteTable('speakers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  organization: text('organization').notNull(),
  bio: text('bio').notNull(),
  photoUrl: text('photo_url').notNull(),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  socialLinks: text('social_links') // JSON string
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  eventDayId: text('event_day_id').references(() => eventDays.id, { onDelete: 'cascade' }),
  speakerId: text('speaker_id').references(() => speakers.id),
  title: text('title').notNull(),
  description: text('description'),
  startsAt: text('starts_at').notNull(),
  endsAt: text('ends_at').notNull(),
  location: text('location').notNull(),
  capacity: integer('capacity'),
  isPrayerBreak: integer('is_prayer_break', { mode: 'boolean' }).default(false),
  prayerName: text('prayer_name'),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true)
});
