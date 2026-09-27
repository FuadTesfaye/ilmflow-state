'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CompetitionItem, CompetitionQuestion } from '../../types';
import { IslamicStarIcon } from '../common/IslamicPattern';
import {
  Clock,
  Flag,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Award,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizEngineProps {
  competition: CompetitionItem;
  questions: CompetitionQuestion[];
  onFinish?: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ competition, questions, onFinish }) => {
  const { currentUser, recordQuizAttempt } = useApp();

  const initialTimeSeconds = (competition.rounds[0]?.timeLimitMinutes || 15) * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeSeconds);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [antiCheatWarnings, setAntiCheatWarnings] = useState<number>(0);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    totalMarks: number;
    percentage: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
  } | null>(null);

  const activeQuestion = questions[currentIndex];

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  useEffect(() => {
    const handleBlur = () => {
      if (!isSubmitted) {
        setAntiCheatWarnings((prev) => prev + 1);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [isSubmitted]);

  const handleSelectOption = (qId: string, optionId: string, isMulti: boolean) => {
    if (isSubmitted) return;
    if (isMulti) {
      const current = (answers[qId] as string[]) || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setAnswers((prev) => ({ ...prev, [qId]: updated }));
    } else {
      setAnswers((prev) => ({ ...prev, [qId]: optionId }));
    }
  };

  const handleToggleFlag = (qId: string) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitQuiz = () => {
    if (isSubmitted) return;

    let totalScore = 0;
    let totalMaxMarks = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach((q) => {
      totalMaxMarks += q.marks;
      const userAns = answers[q.id];

      if (!userAns || (Array.isArray(userAns) && userAns.length === 0)) {
        unanswered++;
        return;
      }

      let isCorrect = false;
      if (Array.isArray(q.correctAnswer)) {
        const uArr = Array.isArray(userAns) ? userAns.sort() : [userAns];
        const cArr = [...q.correctAnswer].sort();
        isCorrect = JSON.stringify(uArr) === JSON.stringify(cArr);
      } else {
        isCorrect = userAns === q.correctAnswer;
      }

      if (isCorrect) {
        correct++;
        totalScore += q.marks;
      } else {
        incorrect++;
        if (q.negativeMarks) {
          totalScore -= q.negativeMarks;
        }
      }
    });

    totalScore = Math.max(0, totalScore);
    const percentage = totalMaxMarks > 0 ? Math.round((totalScore / totalMaxMarks) * 100) : 0;

    const result = {
      score: totalScore,
      totalMarks: totalMaxMarks,
      percentage,
      correctCount: correct,
      incorrectCount: incorrect,
      unansweredCount: unanswered
    };

    setScoreResult(result);
    setIsSubmitted(true);

    recordQuizAttempt({
      competitionId: competition.id,
      roundId: competition.rounds[0]?.id || 'round-1',
      participantId: currentUser.id,
      participantName: currentUser.name,
      answers,
      flaggedQuestionIds: Object.keys(flagged).filter((k) => flagged[k]),
      score: totalScore,
      totalMarks: totalMaxMarks,
      percentage,
      startedAt: new Date(Date.now() - (initialTimeSeconds - timeLeft) * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      timeSpentSeconds: initialTimeSeconds - timeLeft,
      antiCheatFlags: antiCheatWarnings > 0 ? [`Tab switched ${antiCheatWarnings} times`] : [],
      status: 'submitted'
    });

    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const formatMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none text-[#111827]">
      {/* Enterprise Proctored Header */}
      <div className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
              PROCTORED ACADEMIC BENCH
            </span>
            <span className="text-[#e7e2d6]">•</span>
            <span className="text-xs text-[#6b7280]">
              Candidate: <strong className="text-[#111827]">{currentUser.name}</strong>
            </span>
          </div>
          <h3 className="font-display text-xl text-[#111827] font-bold mt-1">
            {competition.title}
          </h3>
        </div>

        {/* Time Remaining & Anti-Cheat Monitor */}
        <div className="flex items-center gap-3">
          {antiCheatWarnings > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              <ShieldAlert size={14} className="text-red-600" />
              <span>{antiCheatWarnings} Tab Alert Logged</span>
            </div>
          )}

          {!isSubmitted && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold tabular-nums ${
                timeLeft < 180
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-[#faf8f5] border-[#e7e2d6] text-[#064e3b]'
              }`}
            >
              <Clock size={15} />
              <span>{formatMinutes(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Testing Canvas */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: Question Canvas */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-7 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] space-y-6 relative">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                <div className="flex items-center gap-2">
                  <span className="meta-tag px-2.5 py-1 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
                    QUESTION {currentIndex + 1} OF {questions.length}
                  </span>
                  <span className="text-xs text-[#6b7280]">
                    ({activeQuestion?.marks} Marks{activeQuestion?.negativeMarks ? `, -${activeQuestion.negativeMarks} Negative` : ''})
                  </span>
                </div>

                <button
                  onClick={() => handleToggleFlag(activeQuestion?.id || '')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all border cursor-pointer ${
                    flagged[activeQuestion?.id || '']
                      ? 'bg-[#fefce8] border-[#fef08a] text-[#854d0e] font-semibold'
                      : 'bg-[#faf8f5] border-[#e7e2d6] text-[#6b7280] hover:text-[#111827]'
                  }`}
                >
                  <Flag size={12} fill={flagged[activeQuestion?.id || ''] ? 'currentColor' : 'none'} />
                  <span>{flagged[activeQuestion?.id || ''] ? 'Flagged' : 'Flag'}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <div className="space-y-3">
                {activeQuestion?.arabicText && (
                  <p
                    className="font-arabic text-2xl text-[#9e782f] leading-relaxed text-right font-normal"
                    dir="rtl"
                  >
                    {activeQuestion.arabicText}
                  </p>
                )}
                <h4 className="text-base sm:text-lg font-bold text-[#111827] leading-relaxed">
                  {activeQuestion?.questionText}
                </h4>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3 pt-2">
                {activeQuestion?.options?.map((option, optIdx) => {
                  const isMulti = activeQuestion.type === 'multiple-select';
                  const isSelected = isMulti
                    ? ((answers[activeQuestion.id] as string[]) || []).includes(option.id)
                    : answers[activeQuestion.id] === option.id;

                  const letters = ['A', 'B', 'C', 'D', 'E'];

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(activeQuestion.id, option.id, isMulti)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#f4f0e6] border-2 border-[#064e3b] text-[#111827] shadow-xs'
                          : 'bg-[#ffffff] border border-[#e7e2d6] text-[#4b5563] hover:border-[#064e3b]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-[#064e3b] text-[#ffffff] border-[#064e3b]'
                              : 'bg-[#faf8f5] text-[#6b7280] border-[#e7e2d6]'
                          }`}
                        >
                          {letters[optIdx] || optIdx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[#111827]">{option.text}</span>
                      </div>
                      {option.arabicText && (
                        <span className="font-arabic text-base text-[#9e782f] shrink-0" dir="rtl">
                          {option.arabicText}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-[#e7e2d6] pt-5">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#6b7280] hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs transition-all"
                  >
                    <span>Next Question</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-bold hover:bg-[#043c2e] cursor-pointer shadow-md transition-all"
                  >
                    <span>Complete &amp; Submit</span>
                    <CheckCircle size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Question Navigator */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
              <span className="meta-tag text-[#064e3b] block font-bold">QUESTION MATRIX</span>

              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered =
                    answers[q.id] &&
                    (!Array.isArray(answers[q.id]) || (answers[q.id] as string[]).length > 0);
                  const isFlagged = flagged[q.id];
                  const isCurrent = currentIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-xl text-xs font-mono font-bold transition-all relative cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-[#064e3b] bg-[#064e3b] text-[#ffffff]'
                          : isAnswered
                          ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                          : 'bg-[#faf8f5] text-[#6b7280] border border-[#e7e2d6] hover:border-[#064e3b]/40'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#9e782f]" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-[#e7e2d6] pt-3.5 space-y-2 text-[11px] text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-[#ecfdf5] border border-[#a7f3d0]" />
                  <span>Answered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-[#faf8f5] border border-[#e7e2d6]" />
                  <span>Unanswered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-[#fefce8] border border-[#fef08a]" />
                  <span>Flagged for Review</span>
                </div>
              </div>

              <button
                onClick={handleSubmitQuiz}
                className="w-full mt-4 py-3 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-bold hover:bg-[#043c2e] transition-all cursor-pointer shadow-xs"
              >
                Submit Examination
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results & Scholarly Explanations */
        <div className="space-y-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] text-center space-y-4 relative shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)]">
            <span className="meta-tag px-3 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] font-bold">
              EXAMINATION CONCLUDED • AUTO-GRADING REPORT
            </span>

            <h3 className="font-display text-3xl sm:text-4xl text-[#111827] font-bold">
              Official Assessment Results
            </h3>

            <p className="text-xs text-[#6b7280]">
              Candidate: <strong>{currentUser.name}</strong> • Recorded in Academic Ledger
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto my-6 text-left">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6]">
                <span className="meta-tag text-[#6b7280] block text-[9px]">TOTAL MARKS</span>
                <span className="font-display text-2xl font-bold text-[#064e3b] tabular-nums">
                  {scoreResult?.score} / {scoreResult?.totalMarks}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6]">
                <span className="meta-tag text-[#6b7280] block text-[9px]">PERCENTAGE</span>
                <span className="font-display text-2xl font-bold text-[#065f46] tabular-nums">
                  {scoreResult?.percentage}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6]">
                <span className="meta-tag text-[#6b7280] block text-[9px]">CORRECT ITEMS</span>
                <span className="font-display text-2xl font-bold text-[#111827] tabular-nums">
                  {scoreResult?.correctCount} / {questions.length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6]">
                <span className="meta-tag text-[#6b7280] block text-[9px]">ACADEMIC HONORS</span>
                <span className="font-display text-sm font-bold text-[#064e3b] block mt-1">
                  {(scoreResult?.percentage || 0) >= 80 ? 'Distinction (Mumtaz)' : 'Qualified'}
                </span>
              </div>
            </div>
          </div>

          {/* Scholarly Explanations List */}
          <div className="space-y-4">
            <h4 className="font-display text-xl text-[#111827] font-bold flex items-center gap-2">
              <BookOpen size={18} className="text-[#064e3b]" />
              <span>Scholarly Commentary &amp; Authentic Citations</span>
            </h4>

            {questions.map((q, i) => {
              const userAns = answers[q.id];
              let isCorrect = false;
              if (Array.isArray(q.correctAnswer)) {
                const uArr = Array.isArray(userAns) ? userAns.sort() : [userAns];
                const cArr = [...q.correctAnswer].sort();
                isCorrect = JSON.stringify(uArr) === JSON.stringify(cArr);
              } else {
                isCorrect = userAns === q.correctAnswer;
              }

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-3xl border bg-[#ffffff] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] ${
                    isCorrect ? 'border-[#a7f3d0]' : 'border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                    <span className="meta-tag text-[#064e3b] font-bold">
                      ITEM {i + 1} ({q.marks} MARKS)
                    </span>
                    <span
                      className={`meta-tag px-2.5 py-0.5 rounded-full font-bold ${
                        isCorrect
                          ? 'bg-[#ecfdf5] text-[#065f46]'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-[#111827] mt-3">
                    {q.questionText}
                  </p>

                  <div className="mt-3.5 p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-xs space-y-1">
                    <span className="meta-tag text-[#064e3b] block font-bold">
                      Scholarly Commentary &amp; Hadith Reference:
                    </span>
                    <p className="text-[#4b5563] leading-relaxed">{q.explanation}</p>
                    {q.sourceReference && (
                      <span className="meta-tag text-[#6b7280] block pt-1">
                        Primary Source: {q.sourceReference}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                if (onFinish) onFinish();
                window.location.href = '/portal';
              }}
              className="px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs"
            >
              Return to Participant Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
