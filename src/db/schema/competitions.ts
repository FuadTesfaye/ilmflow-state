import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { events } from './events';

export const competitions = sqliteTable('competitions', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  arabicTitle: text('arabic_title'),
  category: text('category', {
    enum: [
      'quran-memorization',
      'quran-recitation',
      'hadith-mastery',
      'seerah-knowledge',
      'arabic-language',
      'essay-writing',
      'general-knowledge'
    ]
  }).notNull(),
  format: text('format', {
    enum: ['online-quiz', 'quran-recitation', 'essay', 'live']
  }).notNull(),
  description: text('description').notNull(),
  rules: text('rules').notNull(), // JSON string: string[]
  eligibility: text('eligibility').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  registrationDeadline: text('registration_deadline').notNull(),
  winnerAnnouncementDate: text('winner_announcement_date'),
  maxParticipants: integer('max_participants').notNull().default(500),
  enrolledCount: integer('enrolled_count').notNull().default(0),
  scoringMethod: text('scoring_method', {
    enum: ['automatic', 'rubric-manual', 'hybrid']
  }).notNull().default('automatic'),
  coverImage: text('cover_image').notNull(),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  prizes: text('prizes').notNull(), // JSON string: [{rank, title, award}]
  status: text('status', {
    enum: [
      'DRAFT',
      'REGISTRATION_OPEN',
      'REGISTRATION_CLOSED',
      'SCHEDULED',
      'LIVE',
      'GRADING',
      'RESULTS_REVIEW',
      'RESULTS_PUBLISHED',
      'COMPLETED'
    ]
  }).notNull().default('DRAFT')
});

export const competitionRounds = sqliteTable('competition_rounds', {
  id: text('id').primaryKey(),
  competitionId: text('competition_id').notNull().references(() => competitions.id, { onDelete: 'cascade' }),
  roundNumber: integer('round_number').notNull(),
  title: text('title').notNull(),
  type: text('type', {
    enum: ['quiz', 'audio_submission', 'essay', 'practical']
  }).notNull(),
  passingScore: integer('passing_score').notNull().default(70),
  timeLimitMinutes: integer('time_limit_minutes'),
  advancementRule: text('advancement_rule', {
    enum: ['TOP_PERCENTAGE', 'TOP_N', 'MINIMUM_SCORE', 'MANUAL_SELECTION']
  }).notNull().default('MINIMUM_SCORE'),
  orderIndex: integer('order_index').notNull().default(1)
});

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  questionText: text('question_text').notNull(),
  arabicText: text('arabic_text'),
  type: text('type', {
    enum: [
      'multiple-choice',
      'true-false',
      'short-text',
      'essay',
      'audio',
      'fill-blank',
      'matching'
    ]
  }).notNull().default('multiple-choice'),
  marks: integer('marks').notNull().default(5),
  negativeMarks: integer('negative_marks').notNull().default(1),
  category: text('category').notNull(),
  difficulty: text('difficulty', {
    enum: ['beginner', 'intermediate', 'advanced', 'scholarly']
  }).notNull().default('intermediate'),
  timeLimitSeconds: integer('time_limit_seconds').default(60),
  explanation: text('explanation').notNull(),
  sourceReference: text('source_reference').notNull(),
  surahNumber: integer('surah_number'),
  ayahStart: integer('ayah_start'),
  ayahEnd: integer('ayah_end'),
  hadithCollection: text('hadith_collection'), // e.g. "Sahih al-Bukhari"
  hadithNumber: text('hadith_number'), // e.g. "71"
  bookReference: text('book_reference'), // e.g. "Book of Knowledge"
  options: text('options').notNull(), // JSON string: [{id, text, arabicText}]
  correctAnswer: text('correct_answer').notNull(),
  isArchived: integer('is_archived', { mode: 'boolean' }).default(false)
});

export const tests = sqliteTable('tests', {
  id: text('id').primaryKey(),
  roundId: text('round_id').notNull().references(() => competitionRounds.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  durationMinutes: integer('duration_minutes').notNull().default(20),
  passingScore: integer('passing_score').notNull().default(70),
  maxAttempts: integer('max_attempts').notNull().default(1),
  randomizeQuestions: integer('randomize_questions', { mode: 'boolean' }).default(true),
  randomizeAnswers: integer('randomize_answers', { mode: 'boolean' }).default(true),
  status: text('status', {
    enum: ['DRAFT', 'PUBLISHED', 'OPEN', 'CLOSED', 'GRADING', 'FINALIZED']
  }).notNull().default('DRAFT')
});

export const testSnapshots = sqliteTable('test_snapshots', {
  id: text('id').primaryKey(),
  testId: text('test_id').notNull().references(() => tests.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  questionsFrozen: text('questions_frozen').notNull(), // JSON string array of Question snapshots
  createdAt: text('created_at').notNull()
});

export const testAttempts = sqliteTable('test_attempts', {
  id: text('id').primaryKey(),
  testId: text('test_id').notNull().references(() => tests.id, { onDelete: 'cascade' }),
  testSnapshotId: text('test_snapshot_id').references(() => testSnapshots.id),
  userId: text('user_id').notNull(),
  participantName: text('participant_name').notNull(),
  participantEmail: text('participant_email').notNull(),
  startedAt: text('started_at').notNull(),
  deadlineAt: text('deadline_at').notNull(),
  submittedAt: text('submitted_at'),
  status: text('status', {
    enum: ['in_progress', 'submitted', 'auto_graded', 'in_review', 'finalized', 'timed_out']
  }).notNull().default('in_progress'),
  rawScore: integer('raw_score').default(0),
  finalScore: integer('final_score').default(0),
  percentage: real('percentage').default(0),
  isPassed: integer('is_passed', { mode: 'boolean' }).default(false),
  riskScore: integer('risk_score').default(0),
  tabSwitchCount: integer('tab_switch_count').default(0),
  focusLossCount: integer('focus_loss_count').default(0),
  infractions: text('infractions') // JSON string: [{timestamp, type, detail}]
});

export const attemptAnswers = sqliteTable('attempt_answers', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id').notNull().references(() => testAttempts.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull(),
  participantAnswer: text('participant_answer'),
  isCorrect: integer('is_correct', { mode: 'boolean' }),
  pointsAwarded: integer('points_awarded').default(0),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  graderFeedback: text('grader_feedback')
});
