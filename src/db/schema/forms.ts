import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { events } from './events';
import { registrations } from './registrations';

export const forms = sqliteTable('forms', {
  id: text('id').primaryKey(),
  eventId: text('event_id').references(() => events.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category', {
    enum: ['event_registration', 'competition_registration', 'feedback', 'custom']
  }).notNull().default('event_registration'),
  currentVersion: integer('current_version').notNull().default(1),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

export const formVersions = sqliteTable('form_versions', {
  id: text('id').primaryKey(),
  formId: text('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  publishedAt: text('published_at').notNull()
});

export const formFields = sqliteTable('form_fields', {
  id: text('id').primaryKey(),
  formVersionId: text('form_version_id').notNull().references(() => formVersions.id, { onDelete: 'cascade' }),
  fieldKey: text('field_key').notNull(),
  type: text('type', {
    enum: [
      'text',
      'long_text',
      'email',
      'phone',
      'number',
      'select',
      'multi_select',
      'radio',
      'checkbox',
      'date',
      'time',
      'file',
      'country',
      'consent',
      'section',
      'info'
    ]
  }).notNull(),
  label: text('label').notNull(),
  description: text('description'),
  placeholder: text('placeholder'),
  required: integer('required', { mode: 'boolean' }).default(false),
  defaultValue: text('default_value'),
  options: text('options'), // JSON string: [{label, value}]
  conditionalRules: text('conditional_rules'), // JSON string: {fieldKey: string, operator: 'equals'|'not_equals', value: any, action: 'show'|'hide'}
  orderIndex: integer('order_index').notNull().default(0),
  width: text('width', { enum: ['full', 'half', 'third'] }).default('full')
});

export const formSubmissions = sqliteTable('form_submissions', {
  id: text('id').primaryKey(),
  formId: text('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  formVersionId: text('form_version_id').notNull().references(() => formVersions.id),
  registrationId: text('registration_id').references(() => registrations.id, { onDelete: 'set null' }),
  userId: text('user_id').notNull(),
  submittedAt: text('submitted_at').notNull()
});

export const submissionAnswers = sqliteTable('submission_answers', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').notNull().references(() => formSubmissions.id, { onDelete: 'cascade' }),
  fieldKey: text('field_key').notNull(),
  value: text('value').notNull() // JSON string representation
});
