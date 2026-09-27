import { db } from '../../../db';
import * as schema from '../../../db/schema';
import { eq } from 'drizzle-orm';

export interface StartAttemptInput {
  testId: string;
  userId: string;
  participantName: string;
  participantEmail: string;
}

export async function startTestAttempt(input: StartAttemptInput) {
  const test = (
    await db.select().from(schema.tests).where(eq(schema.tests.id, input.testId)).limit(1)
  )[0];

  if (!test) throw new Error('Test not found');

  // Fetch available questions for this test's round
  const allQuestions = await db
    .select()
    .from(schema.questions)
    .where(eq(schema.questions.isArchived, false));

  // Create an immutable Test Snapshot
  const now = new Date();
  const snapshotId = `snp-${test.id}-${Date.now()}`;
  const deadlineAt = new Date(now.getTime() + test.durationMinutes * 60 * 1000).toISOString();

  await db.insert(schema.testSnapshots).values({
    id: snapshotId,
    testId: test.id,
    versionNumber: 1,
    questionsFrozen: JSON.stringify(allQuestions.map((q) => q.id)),
    createdAt: now.toISOString()
  });

  const attemptId = `att-${Date.now()}`;

  await db.insert(schema.testAttempts).values({
    id: attemptId,
    testId: test.id,
    testSnapshotId: snapshotId,
    userId: input.userId,
    participantName: input.participantName,
    participantEmail: input.participantEmail,
    startedAt: now.toISOString(),
    deadlineAt,
    status: 'in_progress',
    riskScore: 0,
    tabSwitchCount: 0,
    focusLossCount: 0
  });

  // Prepare questions for client (strip correct answers)
  const clientQuestions = allQuestions.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    arabicText: q.arabicText,
    type: q.type,
    marks: q.marks,
    negativeMarks: q.negativeMarks,
    category: q.category,
    difficulty: q.difficulty,
    timeLimitSeconds: q.timeLimitSeconds,
    sourceReference: q.sourceReference,
    options: JSON.parse(q.options)
  }));

  return {
    attemptId,
    durationMinutes: test.durationMinutes,
    deadlineAt,
    questions: clientQuestions
  };
}

export async function recordRiskTelemetry(
  attemptId: string,
  type: 'tab_switch' | 'window_blur' | 'copy_paste'
) {
  const attempt = (
    await db.select().from(schema.testAttempts).where(eq(schema.testAttempts.id, attemptId)).limit(1)
  )[0];

  if (!attempt) return;

  const tabCount = type === 'tab_switch' ? (attempt.tabSwitchCount ?? 0) + 1 : (attempt.tabSwitchCount ?? 0);
  const blurCount = type === 'window_blur' ? (attempt.focusLossCount ?? 0) + 1 : (attempt.focusLossCount ?? 0);
  const riskIncrement = type === 'tab_switch' ? 15 : 5;
  const newRiskScore = Math.min(100, (attempt.riskScore ?? 0) + riskIncrement);

  await db
    .update(schema.testAttempts)
    .set({
      tabSwitchCount: tabCount,
      focusLossCount: blurCount,
      riskScore: newRiskScore
    })
    .where(eq(schema.testAttempts.id, attemptId));
}

export async function submitTestAttempt(
  attemptId: string,
  answers: Record<string, string> // questionId -> selectedOptionId
) {
  const attempt = (
    await db.select().from(schema.testAttempts).where(eq(schema.testAttempts.id, attemptId)).limit(1)
  )[0];

  if (!attempt) throw new Error('Attempt not found');
  if (attempt.status !== 'in_progress') return { alreadySubmitted: true };

  const now = new Date();
  const allQuestions = await db.select().from(schema.questions);
  const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

  let rawScore = 0;
  let maxPossibleScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  for (const [qId, q] of questionMap.entries()) {
    maxPossibleScore += q.marks;
    const participantAns = answers[qId];

    if (!participantAns) {
      unansweredCount++;
      await db.insert(schema.attemptAnswers).values({
        id: `aa-${attemptId}-${qId}`,
        attemptId,
        questionId: qId,
        participantAnswer: null,
        isCorrect: false,
        pointsAwarded: 0
      });
    } else if (participantAns === q.correctAnswer) {
      correctCount++;
      rawScore += q.marks;
      await db.insert(schema.attemptAnswers).values({
        id: `aa-${attemptId}-${qId}`,
        attemptId,
        questionId: qId,
        participantAnswer: participantAns,
        isCorrect: true,
        pointsAwarded: q.marks
      });
    } else {
      incorrectCount++;
      const penalty = q.negativeMarks ?? 1;
      rawScore -= penalty;
      await db.insert(schema.attemptAnswers).values({
        id: `aa-${attemptId}-${qId}`,
        attemptId,
        questionId: qId,
        participantAnswer: participantAns,
        isCorrect: false,
        pointsAwarded: -penalty
      });
    }
  }

  const finalScore = Math.max(0, rawScore);
  const percentage = maxPossibleScore > 0 ? Math.round((finalScore / maxPossibleScore) * 100) : 0;
  const isPassed = percentage >= 70;

  await db
    .update(schema.testAttempts)
    .set({
      submittedAt: now.toISOString(),
      status: 'auto_graded',
      rawScore,
      finalScore,
      percentage,
      isPassed
    })
    .where(eq(schema.testAttempts.id, attemptId));

  return {
    attemptId,
    rawScore,
    finalScore,
    maxPossibleScore,
    percentage,
    isPassed,
    correctCount,
    incorrectCount,
    unansweredCount,
    riskScore: attempt.riskScore
  };
}
