import { describe, expect, it } from 'bun:test';

describe('Domain Logic: Negative Marking & Test Scoring', () => {
  function computeScore(
    questions: Array<{ id: string; marks: number; negativeMarks: number; correct: string }>,
    answers: Record<string, string>
  ) {
    let rawScore = 0;
    let maxScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    for (const q of questions) {
      maxScore += q.marks;
      const ans = answers[q.id];
      if (!ans) {
        unansweredCount++;
      } else if (ans === q.correct) {
        correctCount++;
        rawScore += q.marks;
      } else {
        incorrectCount++;
        rawScore -= q.negativeMarks;
      }
    }

    const finalScore = Math.max(0, rawScore);
    const percentage = maxScore > 0 ? Math.round((finalScore / maxScore) * 100) : 0;
    const isPassed = percentage >= 70;

    return {
      rawScore,
      finalScore,
      maxScore,
      percentage,
      isPassed,
      correctCount,
      incorrectCount,
      unansweredCount
    };
  }

  const sampleQuestions = [
    { id: 'q1', marks: 5, negativeMarks: 1, correct: 'A' },
    { id: 'q2', marks: 5, negativeMarks: 1, correct: 'B' },
    { id: 'q3', marks: 5, negativeMarks: 1, correct: 'C' },
    { id: 'q4', marks: 5, negativeMarks: 1, correct: 'D' }
  ];

  it('calculates 100% when all answers are correct', () => {
    const res = computeScore(sampleQuestions, { q1: 'A', q2: 'B', q3: 'C', q4: 'D' });
    expect(res.finalScore).toBe(20);
    expect(res.percentage).toBe(100);
    expect(res.isPassed).toBe(true);
    expect(res.correctCount).toBe(4);
    expect(res.incorrectCount).toBe(0);
  });

  it('correctly deducts negative points for incorrect answers', () => {
    // 3 correct (15 pts), 1 incorrect (-1 pt) = 14 pts out of 20 (70%)
    const res = computeScore(sampleQuestions, { q1: 'A', q2: 'B', q3: 'C', q4: 'WRONG' });
    expect(res.rawScore).toBe(14);
    expect(res.finalScore).toBe(14);
    expect(res.percentage).toBe(70);
    expect(res.isPassed).toBe(true);
    expect(res.incorrectCount).toBe(1);
  });

  it('does not penalize unanswered questions', () => {
    // 2 correct (10 pts), 2 unanswered (0 pts) = 10 pts out of 20 (50% -> fail)
    const res = computeScore(sampleQuestions, { q1: 'A', q2: 'B' });
    expect(res.finalScore).toBe(10);
    expect(res.percentage).toBe(50);
    expect(res.isPassed).toBe(false);
    expect(res.unansweredCount).toBe(2);
  });

  it('floors final score at 0 if negative penalties exceed positive marks', () => {
    // 4 wrong answers = -4 raw points, final score floored at 0
    const res = computeScore(sampleQuestions, { q1: 'X', q2: 'X', q3: 'X', q4: 'X' });
    expect(res.rawScore).toBe(-4);
    expect(res.finalScore).toBe(0);
    expect(res.percentage).toBe(0);
    expect(res.isPassed).toBe(false);
  });
});
