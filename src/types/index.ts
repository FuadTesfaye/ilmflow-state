export type Role = 'visitor' | 'participant' | 'judge' | 'staff' | 'admin' | 'superadmin' | 'parent';

export type EventFormat = 'in-person' | 'online' | 'hybrid';

export type EventCategory = 
  | 'conference' 
  | 'competition' 
  | 'workshop' 
  | 'youth-summit' 
  | 'ramadan-program' 
  | 'quran-intensive';

export type CompetitionCategory = 
  | 'quran-memorization'
  | 'quran-recitation'
  | 'hadith-mastery'
  | 'seerah-knowledge'
  | 'islamic-quiz'
  | 'arabic-language'
  | 'nasheed'
  | 'essay-writing'
  | 'calligraphy'
  | 'public-speaking';

export type QuestionType = 
  | 'multiple-choice'
  | 'multiple-select'
  | 'true-false'
  | 'fill-blank'
  | 'ordering';

export type RegistrationStatus = 
  | 'draft'
  | 'submitted'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'waitlisted'
  | 'checked_in'
  | 'completed'
  | 'cancelled';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldCondition {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
  value: string | number | boolean;
}

export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'gender'
  | 'age'
  | 'guardian-consent'
  | 'section-header'
  | 'signature';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: FormFieldOption[];
  conditional?: FormFieldCondition;
  defaultValue?: string | number | boolean;
}

export interface RegistrationForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  avatar: string;
  featured?: boolean;
}

export interface PrayerSchedule {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: string;
  timeRemaining: string;
}

export interface SessionSchedule {
  id: string;
  title: string;
  speaker?: string;
  startTime: string;
  endTime: string;
  location: string;
  isPrayerBreak?: boolean;
  prayerName?: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  capacity: number;
  registeredCount: number;
  available: boolean;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: EventCategory;
  format: EventFormat;
  coverImage: string;
  startDate: string;
  endDate: string;
  timeZone: string;
  venueName: string;
  venueAddress: string;
  onlineMeetingUrl?: string;
  registrationDeadline: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  ageRestrictions?: string;
  genderCategory?: 'all' | 'brothers' | 'sisters' | 'segregated-halls';
  languages: string[];
  speakers: Speaker[];
  schedule: SessionSchedule[];
  tickets: TicketTier[];
  formId: string;
  prayerTimes: PrayerSchedule;
  featured?: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface QuestionOption {
  id: string;
  text: string;
  arabicText?: string;
}

export interface CompetitionQuestion {
  id: string;
  questionText: string;
  arabicText?: string;
  type: QuestionType;
  options?: QuestionOption[];
  correctAnswer: string | string[]; // option id, boolean string, or fill-blank string
  explanation: string;
  marks: number;
  negativeMarks?: number;
  category: CompetitionCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimitSeconds?: number;
  sourceReference?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface CompetitionRound {
  id: string;
  roundNumber: number;
  title: string;
  type: 'quiz' | 'audio_submission' | 'essay_submission' | 'live_presentation';
  timeLimitMinutes?: number;
  passingScore: number;
  questionIds?: string[];
  rubric?: RubricCriterion[];
}

export interface CompetitionItem {
  id: string;
  slug: string;
  title: string;
  arabicTitle?: string;
  category: CompetitionCategory;
  format: 'online-quiz' | 'quran-recitation' | 'written-essay' | 'live-performance';
  description: string;
  rules: string[];
  eligibility: string;
  rounds: CompetitionRound[];
  prizes: { rank: number; title: string; award: string }[];
  judges: Speaker[];
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  winnerAnnouncementDate: string;
  maxParticipants: number;
  enrolledCount: number;
  scoringMethod: 'automatic' | 'rubric-manual' | 'hybrid';
  coverImage: string;
  featured?: boolean;
}

export interface QuizAttempt {
  id: string;
  competitionId: string;
  roundId: string;
  participantId: string;
  participantName: string;
  answers: Record<string, string | string[]>;
  flaggedQuestionIds: string[];
  score: number;
  totalMarks: number;
  percentage: number;
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds: number;
  antiCheatFlags?: string[];
  status: 'in-progress' | 'submitted' | 'timed-out';
}

export interface ManualSubmission {
  id: string;
  competitionId: string;
  roundId: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  type: 'audio' | 'essay';
  title: string;
  surahInfo?: {
    surahName: string;
    surahNumber: number;
    ayahStart: number;
    ayahEnd: number;
    qiraatStyle: string;
  };
  audioUrl?: string;
  essayContent?: string;
  submittedAt: string;
  status: 'pending_review' | 'graded';
  grades?: {
    judgeId: string;
    judgeName: string;
    criteriaScores: Record<string, number>;
    totalScore: number;
    comments: string;
    gradedAt: string;
  }[];
  finalScore?: number;
}

export interface LeaderboardEntry {
  rank: number;
  participantId: string;
  participantName: string;
  avatar?: string;
  country: string;
  score: number;
  maxScore: number;
  timeSpentFormatted: string;
  tieBreakerNotes?: string;
  badge?: 'Gold' | 'Silver' | 'Bronze' | 'Top 10';
}

export interface CertificateItem {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientEmail: string;
  eventOrCompetitionTitle: string;
  type: 'winner' | 'excellence' | 'participation' | 'completion';
  rank?: number;
  score?: number;
  issueDate: string;
  verificationHash: string;
  issuerTitle: string;
  issuerSignatureName: string;
  organizationName: string;
}

export interface RegistrationRecord {
  id: string;
  ticketNumber: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  userId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  ticketTierId: string;
  ticketTierName: string;
  status: RegistrationStatus;
  formAnswers: Record<string, unknown>;
  registeredAt: string;
  checkedInAt?: string;
  qrCodeValue: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  arabicTitle?: string;
  content: string;
  category: 'urgent' | 'schedule' | 'competition' | 'general';
  publishedAt: string;
  author: string;
  isPinned?: boolean;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  title?: string;
  guardianOf?: string[];
  phone?: string;
}
