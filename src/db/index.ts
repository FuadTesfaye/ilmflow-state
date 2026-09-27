import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';
import path from 'path';

// Use on-disk SQLite database file in current working directory
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'ilmflow.db');
export const sqlite = new Database(dbPath, { create: true });

// Optimize SQLite for concurrent reads & transactional integrity
sqlite.exec('PRAGMA journal_mode = WAL;');
sqlite.exec('PRAGMA foreign_keys = ON;');

export const db = drizzle(sqlite, { schema });

// Auto-bootstrap schema tables if not existing
export function initializeDatabaseSchema() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      short_description TEXT,
      type TEXT NOT NULL DEFAULT 'CONFERENCE',
      status TEXT NOT NULL DEFAULT 'DRAFT',
      cover_image TEXT NOT NULL,
      logo TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      timezone TEXT NOT NULL DEFAULT 'GMT+3 (Madinah Time)',
      venue_name TEXT NOT NULL,
      venue_address TEXT NOT NULL,
      online_url TEXT,
      capacity INTEGER NOT NULL DEFAULT 500,
      registered_count INTEGER NOT NULL DEFAULT 0,
      waitlist_count INTEGER NOT NULL DEFAULT 0,
      age_restrictions TEXT,
      gender_category TEXT DEFAULT 'all',
      languages TEXT,
      form_id TEXT,
      featured INTEGER DEFAULT 0,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS event_days (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      day_number INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 300,
      registered_count INTEGER NOT NULL DEFAULT 0,
      registration_open INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS speakers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      organization TEXT NOT NULL,
      bio TEXT NOT NULL,
      photo_url TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      social_links TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      event_day_id TEXT REFERENCES event_days(id) ON DELETE CASCADE,
      speaker_id TEXT REFERENCES speakers(id),
      title TEXT NOT NULL,
      description TEXT,
      starts_at TEXT NOT NULL,
      ends_at TEXT NOT NULL,
      location TEXT NOT NULL,
      capacity INTEGER,
      is_prayer_break INTEGER DEFAULT 0,
      prayer_name TEXT,
      is_published INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS ticket_tiers (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      description TEXT NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 500,
      registered_count INTEGER NOT NULL DEFAULT 0,
      features TEXT NOT NULL,
      available INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      ticket_tier_id TEXT NOT NULL REFERENCES ticket_tiers(id),
      user_id TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      participant_email TEXT NOT NULL,
      participant_phone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved',
      ticket_number TEXT NOT NULL UNIQUE,
      qr_token TEXT NOT NULL,
      registered_at TEXT NOT NULL,
      checked_in_at TEXT,
      form_answers TEXT,
      total_amount REAL DEFAULT 0,
      discount_applied TEXT
    );

    CREATE TABLE IF NOT EXISTS registration_days (
      id TEXT PRIMARY KEY,
      registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
      event_day_id TEXT NOT NULL REFERENCES event_days(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS waitlist_entries (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      event_day_id TEXT REFERENCES event_days(id) ON DELETE CASCADE,
      ticket_tier_id TEXT REFERENCES ticket_tiers(id),
      participant_name TEXT NOT NULL,
      participant_email TEXT NOT NULL,
      participant_phone TEXT,
      position INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'waiting',
      notified_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS discount_codes (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'PERCENTAGE',
      value REAL NOT NULL,
      min_days_required INTEGER DEFAULT 1,
      max_uses INTEGER DEFAULT 100,
      current_uses INTEGER NOT NULL DEFAULT 0,
      valid_from TEXT,
      valid_until TEXT,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS forms (
      id TEXT PRIMARY KEY,
      event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'event_registration',
      current_version INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS form_versions (
      id TEXT PRIMARY KEY,
      form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      is_published INTEGER DEFAULT 1,
      published_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS form_fields (
      id TEXT PRIMARY KEY,
      form_version_id TEXT NOT NULL REFERENCES form_versions(id) ON DELETE CASCADE,
      field_key TEXT NOT NULL,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      description TEXT,
      placeholder TEXT,
      required INTEGER DEFAULT 0,
      default_value TEXT,
      options TEXT,
      conditional_rules TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      width TEXT DEFAULT 'full'
    );

    CREATE TABLE IF NOT EXISTS form_submissions (
      id TEXT PRIMARY KEY,
      form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
      form_version_id TEXT NOT NULL REFERENCES form_versions(id),
      registration_id TEXT REFERENCES registrations(id) ON DELETE SET NULL,
      user_id TEXT NOT NULL,
      submitted_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS submission_answers (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
      field_key TEXT NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS competitions (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      arabic_title TEXT,
      category TEXT NOT NULL,
      format TEXT NOT NULL,
      description TEXT NOT NULL,
      rules TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      registration_deadline TEXT NOT NULL,
      winner_announcement_date TEXT,
      max_participants INTEGER NOT NULL DEFAULT 500,
      enrolled_count INTEGER NOT NULL DEFAULT 0,
      scoring_method TEXT NOT NULL DEFAULT 'automatic',
      cover_image TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      prizes TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'DRAFT'
    );

    CREATE TABLE IF NOT EXISTS competition_rounds (
      id TEXT PRIMARY KEY,
      competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
      round_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      passing_score INTEGER NOT NULL DEFAULT 70,
      time_limit_minutes INTEGER,
      advancement_rule TEXT NOT NULL DEFAULT 'MINIMUM_SCORE',
      order_index INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      question_text TEXT NOT NULL,
      arabic_text TEXT,
      type TEXT NOT NULL DEFAULT 'multiple-choice',
      marks INTEGER NOT NULL DEFAULT 5,
      negative_marks INTEGER NOT NULL DEFAULT 1,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'intermediate',
      time_limit_seconds INTEGER DEFAULT 60,
      explanation TEXT NOT NULL,
      source_reference TEXT NOT NULL,
      surah_number INTEGER,
      ayah_start INTEGER,
      ayah_end INTEGER,
      hadith_collection TEXT,
      hadith_number TEXT,
      book_reference TEXT,
      options TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      is_archived INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      round_id TEXT NOT NULL REFERENCES competition_rounds(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      duration_minutes INTEGER NOT NULL DEFAULT 20,
      passing_score INTEGER NOT NULL DEFAULT 70,
      max_attempts INTEGER NOT NULL DEFAULT 1,
      randomize_questions INTEGER DEFAULT 1,
      randomize_answers INTEGER DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'DRAFT'
    );

    CREATE TABLE IF NOT EXISTS test_snapshots (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      questions_frozen TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS test_attempts (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
      test_snapshot_id TEXT REFERENCES test_snapshots(id),
      user_id TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      participant_email TEXT NOT NULL,
      started_at TEXT NOT NULL,
      deadline_at TEXT NOT NULL,
      submitted_at TEXT,
      status TEXT NOT NULL DEFAULT 'in_progress',
      raw_score INTEGER DEFAULT 0,
      final_score INTEGER DEFAULT 0,
      percentage REAL DEFAULT 0,
      is_passed INTEGER DEFAULT 0,
      risk_score INTEGER DEFAULT 0,
      tab_switch_count INTEGER DEFAULT 0,
      focus_loss_count INTEGER DEFAULT 0,
      infractions TEXT
    );

    CREATE TABLE IF NOT EXISTS attempt_answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL,
      participant_answer TEXT,
      is_correct INTEGER,
      points_awarded INTEGER DEFAULT 0,
      time_spent_seconds INTEGER DEFAULT 0,
      grader_feedback TEXT
    );

    CREATE TABLE IF NOT EXISTS grading_rubrics (
      id TEXT PRIMARY KEY,
      round_id TEXT NOT NULL REFERENCES competition_rounds(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      criteria TEXT NOT NULL,
      total_max_score INTEGER NOT NULL DEFAULT 100
    );

    CREATE TABLE IF NOT EXISTS manual_submissions (
      id TEXT PRIMARY KEY,
      competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
      round_id TEXT NOT NULL REFERENCES competition_rounds(id) ON DELETE CASCADE,
      participant_id TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      participant_email TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      audio_url TEXT,
      essay_content TEXT,
      surah_info TEXT,
      status TEXT NOT NULL DEFAULT 'pending_review',
      assigned_grader_id TEXT,
      locked_at TEXT,
      submitted_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS grading_records (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL REFERENCES manual_submissions(id) ON DELETE CASCADE,
      grader_id TEXT NOT NULL,
      grader_name TEXT NOT NULL,
      rubric_scores TEXT NOT NULL,
      total_score INTEGER NOT NULL,
      feedback TEXT NOT NULL,
      internal_notes TEXT,
      graded_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS grade_appeals (
      id TEXT PRIMARY KEY,
      submission_id TEXT REFERENCES manual_submissions(id) ON DELETE CASCADE,
      participant_id TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      reviewer_notes TEXT,
      resolved_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leaderboard_entries (
      id TEXT PRIMARY KEY,
      competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
      round_id TEXT REFERENCES competition_rounds(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'International',
      score INTEGER NOT NULL,
      time_spent_formatted TEXT NOT NULL,
      rank INTEGER NOT NULL,
      badge TEXT,
      is_published INTEGER DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'participant',
      avatar TEXT NOT NULL,
      title TEXT,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attendance_records (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      event_day_id TEXT REFERENCES event_days(id) ON DELETE CASCADE,
      registration_id TEXT REFERENCES registrations(id) ON DELETE CASCADE,
      participant_name TEXT NOT NULL,
      ticket_number TEXT NOT NULL,
      checked_in_at TEXT NOT NULL,
      checked_in_by TEXT NOT NULL,
      method TEXT NOT NULL DEFAULT 'QR'
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      certificate_number TEXT NOT NULL UNIQUE,
      recipient_name TEXT NOT NULL,
      recipient_email TEXT NOT NULL,
      event_title TEXT NOT NULL,
      competition_title TEXT,
      award_type TEXT NOT NULL,
      issue_date TEXT NOT NULL,
      verification_hash TEXT NOT NULL,
      qr_code_url TEXT NOT NULL,
      issuer_name TEXT NOT NULL,
      issuer_title TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      arabic_title TEXT,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      author TEXT NOT NULL,
      is_pinned INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
}

// Ensure schema is created on initial load
initializeDatabaseSchema();
