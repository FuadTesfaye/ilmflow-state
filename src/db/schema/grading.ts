import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { competitions, competitionRounds } from './competitions';

export const gradingRubrics = sqliteTable('grading_rubrics', {
  id: text('id').primaryKey(),
  roundId: text('round_id').notNull().references(() => competitionRounds.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  criteria: text('criteria').notNull(), // JSON string: [{id, name, description, maxScore}]
  totalMaxScore: integer('total_max_score').notNull().default(100)
});

export const manualSubmissions = sqliteTable('manual_submissions', {
  id: text('id').primaryKey(),
  competitionId: text('competition_id').notNull().references(() => competitions.id, { onDelete: 'cascade' }),
  roundId: text('round_id').notNull().references(() => competitionRounds.id, { onDelete: 'cascade' }),
  participantId: text('participant_id').notNull(),
  participantName: text('participant_name').notNull(),
  participantEmail: text('participant_email').notNull(),
  type: text('type', { enum: ['audio', 'essay', 'portfolio'] }).notNull(),
  title: text('title').notNull(),
  audioUrl: text('audio_url'),
  essayContent: text('essay_content'),
  surahInfo: text('surah_info'), // JSON string: {surahName, surahNumber, ayahStart, ayahEnd, qiraatStyle}
  status: text('status', {
    enum: ['pending_review', 'assigned', 'in_review', 'graded', 'review_requested']
  }).notNull().default('pending_review'),
  assignedGraderId: text('assigned_grader_id'),
  lockedAt: text('locked_at'),
  submittedAt: text('submitted_at').notNull()
});

export const gradingRecords = sqliteTable('grading_records', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').notNull().references(() => manualSubmissions.id, { onDelete: 'cascade' }),
  graderId: text('grader_id').notNull(),
  graderName: text('grader_name').notNull(),
  rubricScores: text('rubric_scores').notNull(), // JSON string: [{criterionId, score, notes}]
  totalScore: integer('total_score').notNull(),
  feedback: text('feedback').notNull(),
  internalNotes: text('internal_notes'),
  gradedAt: text('graded_at').notNull()
});

export const gradeAppeals = sqliteTable('grade_appeals', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').references(() => manualSubmissions.id, { onDelete: 'cascade' }),
  participantId: text('participant_id').notNull(),
  participantName: text('participant_name').notNull(),
  reason: text('reason').notNull(),
  status: text('status', {
    enum: ['pending', 'in_review', 'accepted', 'rejected']
  }).notNull().default('pending'),
  reviewerNotes: text('reviewer_notes'),
  resolvedAt: text('resolved_at'),
  createdAt: text('created_at').notNull()
});

export const leaderboardEntries = sqliteTable('leaderboard_entries', {
  id: text('id').primaryKey(),
  competitionId: text('competition_id').notNull().references(() => competitions.id, { onDelete: 'cascade' }),
  roundId: text('round_id').references(() => competitionRounds.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  participantName: text('participant_name').notNull(),
  country: text('country').notNull().default('International'),
  score: integer('score').notNull(),
  timeSpentFormatted: text('time_spent_formatted').notNull(),
  rank: integer('rank').notNull(),
  badge: text('badge'),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  updatedAt: text('updated_at').notNull()
});
