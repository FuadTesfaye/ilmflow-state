import { db } from '../../../db';
import * as schema from '../../../db/schema';
import { eq } from 'drizzle-orm';

export interface RubricScoreInput {
  criterionId: string;
  score: number;
  notes?: string;
}

export async function getGradingQueue(graderId?: string) {
  const submissions = await db.select().from(schema.manualSubmissions);
  const rubrics = await db.select().from(schema.gradingRubrics);

  const rubricMap = new Map(rubrics.map((r) => [r.roundId, r]));

  return submissions.map((sub) => {
    const rubricRecord = rubricMap.get(sub.roundId) || rubrics[0];
    const criteria = rubricRecord?.criteria ? JSON.parse(rubricRecord.criteria) : [];

    return {
      ...sub,
      surahInfo: sub.surahInfo ? JSON.parse(sub.surahInfo) : null,
      rubricCriteria: criteria,
      isAssignedToCurrent: graderId ? sub.assignedGraderId === graderId : true
    };
  });
}

export async function lockSubmissionForGrading(submissionId: string, graderId: string) {
  const sub = (
    await db
      .select()
      .from(schema.manualSubmissions)
      .where(eq(schema.manualSubmissions.id, submissionId))
      .limit(1)
  )[0];

  if (!sub) throw new Error('Submission not found');

  const now = new Date().toISOString();

  // If already locked by someone else in the last 15 minutes
  if (sub.assignedGraderId && sub.assignedGraderId !== graderId && sub.lockedAt) {
    const lockAgeMs = Date.now() - new Date(sub.lockedAt).getTime();
    if (lockAgeMs < 15 * 60 * 1000) {
      return {
        locked: false,
        message: 'Submission is currently being graded by another judge.'
      };
    }
  }

  await db
    .update(schema.manualSubmissions)
    .set({
      assignedGraderId: graderId,
      status: 'in_review',
      lockedAt: now
    })
    .where(eq(schema.manualSubmissions.id, submissionId));

  return { locked: true, submissionId };
}

export async function submitRubricGrade(
  submissionId: string,
  graderId: string,
  graderName: string,
  rubricScores: RubricScoreInput[],
  feedback: string,
  internalNotes?: string
) {
  const sub = (
    await db
      .select()
      .from(schema.manualSubmissions)
      .where(eq(schema.manualSubmissions.id, submissionId))
      .limit(1)
  )[0];

  if (!sub) throw new Error('Submission not found');

  let totalScore = 0;
  for (const s of rubricScores) {
    totalScore += s.score;
  }

  const now = new Date().toISOString();
  const recordId = `grd-${Date.now()}`;

  await db.insert(schema.gradingRecords).values({
    id: recordId,
    submissionId: sub.id,
    graderId,
    graderName,
    rubricScores: JSON.stringify(rubricScores),
    totalScore,
    feedback,
    internalNotes,
    gradedAt: now
  });

  await db
    .update(schema.manualSubmissions)
    .set({
      status: 'graded',
      lockedAt: null
    })
    .where(eq(schema.manualSubmissions.id, sub.id));

  // Log audit
  await db.insert(schema.auditLogs).values({
    id: `aud-${Date.now()}`,
    actorId: graderId,
    actorName: graderName,
    actorRole: 'judge',
    action: 'SUBMIT_RUBRIC_GRADE',
    entityType: 'submission',
    entityId: sub.id,
    details: JSON.stringify({ totalScore, rubricScores }),
    createdAt: now
  });

  return {
    recordId,
    submissionId: sub.id,
    totalScore,
    status: 'graded'
  };
}

export async function fileGradeAppeal(
  submissionId: string,
  participantId: string,
  participantName: string,
  reason: string
) {
  const appealId = `apl-${Date.now()}`;
  const now = new Date().toISOString();

  await db.insert(schema.gradeAppeals).values({
    id: appealId,
    submissionId,
    participantId,
    participantName,
    reason,
    status: 'pending',
    createdAt: now
  });

  return { appealId, status: 'pending' };
}
