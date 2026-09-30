'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CompetitionItem, CompetitionQuestion } from '../../types';
import {
  Clock,
  Flag,
  CheckCircle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

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
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none text-stone-900">
      {/* Session Top Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="info">Active Exam</Badge>
              <span className="text-xs text-stone-500">
                Candidate: <strong className="text-stone-900">{currentUser.name}</strong>
              </span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mt-1">
              {competition.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {antiCheatWarnings > 0 && (
              <Badge variant="destructive" className="gap-1.5 py-1 px-2.5">
                <ShieldAlert size={14} />
                <span>{antiCheatWarnings} Tab switch detected</span>
              </Badge>
            )}

            {!isSubmitted && (
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-sm font-mono font-bold ${
                  timeLeft < 180
                    ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
                    : 'bg-stone-50 border-stone-200 text-stone-900'
                }`}
              >
                <Clock size={15} className={timeLeft < 180 ? 'text-red-600' : 'text-stone-500'} />
                <span>{formatMinutes(timeLeft)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Testing View */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Question Canvas */}
          <div className="lg:col-span-8 space-y-4">
            <Card>
              <CardHeader className="pb-4 border-b border-stone-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-semibold">
                    Question {currentIndex + 1} of {questions.length}
                  </Badge>
                  <span className="text-xs text-stone-500">
                    ({activeQuestion?.marks} marks{activeQuestion?.negativeMarks ? `, -${activeQuestion.negativeMarks} penalty` : ''})
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleFlag(activeQuestion?.id || '')}
                  className={`gap-1.5 text-xs ${
                    flagged[activeQuestion?.id || '']
                      ? 'border-amber-400 bg-amber-50 text-amber-800'
                      : 'text-stone-600'
                  }`}
                >
                  <Flag size={13} fill={flagged[activeQuestion?.id || ''] ? 'currentColor' : 'none'} />
                  <span>Flag for review</span>
                </Button>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Question Prompt */}
                <div className="space-y-4">
                  {activeQuestion?.arabicText && (
                    <p
                      className="font-arabic text-2xl text-stone-800 leading-relaxed text-right p-4 rounded-lg bg-stone-50/70 border border-stone-200/60"
                      dir="rtl"
                    >
                      {activeQuestion.arabicText}
                    </p>
                  )}
                  <h4 className="text-lg font-semibold text-stone-900 leading-snug">
                    {activeQuestion?.questionText}
                  </h4>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
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
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-50/50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 border ${
                              isSelected
                                ? 'bg-emerald-700 text-white border-emerald-700'
                                : 'bg-stone-100 text-stone-600 border-stone-200'
                            }`}
                          >
                            {letters[optIdx] || optIdx + 1}
                          </span>
                          <span className={`text-sm font-medium ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                            {option.text}
                          </span>
                        </div>
                        {option.arabicText && (
                          <span className="font-arabic text-lg text-stone-800 shrink-0" dir="rtl">
                            {option.arabicText}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-stone-100 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="gap-1.5"
                >
                  <ChevronLeft size={15} />
                  <span>Previous</span>
                </Button>

                {currentIndex < questions.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="gap-1.5 bg-stone-900 hover:bg-stone-800 text-white"
                  >
                    <span>Next Question</span>
                    <ChevronRight size={15} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleSubmitQuiz}
                    className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    <span>Submit Exam</span>
                    <CheckCircle size={15} />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Right Question Palette */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Question Palette
                </CardTitle>
                <CardDescription className="text-xs">
                  {Object.keys(answers).length} of {questions.length} answered
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-5 gap-2">
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
                        className={`h-9 rounded-lg text-xs font-semibold transition-all relative cursor-pointer border ${
                          isCurrent
                            ? 'ring-2 ring-emerald-600 bg-emerald-700 text-white border-emerald-700'
                            : isAnswered
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {idx + 1}
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white ring-1 ring-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-stone-100 pt-3 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                    <span>Answered ({Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-white border border-stone-300" />
                    <span>Unanswered ({questions.length - Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Flagged for Review</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleSubmitQuiz}
                  className="w-full mt-2 text-stone-800 border-stone-300 hover:bg-stone-50"
                >
                  Finish & Submit Test
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          <Card className="text-center overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600" />
            <CardHeader className="pt-8 pb-4">
              <Badge variant="success" className="mx-auto">
                Exam Completed
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-bold mt-2">
                Official Examination Results
              </CardTitle>
              <CardDescription>
                Candidate: <strong className="text-stone-900 font-semibold">{currentUser.name}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block">Total Score</span>
                  <span className="text-2xl font-bold text-stone-900 mt-1 block">
                    {scoreResult?.score} / {scoreResult?.totalMarks}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block">Percentage</span>
                  <span className="text-2xl font-bold text-emerald-700 mt-1 block">
                    {scoreResult?.percentage}%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block">Correct Answers</span>
                  <span className="text-2xl font-bold text-stone-900 mt-1 block">
                    {scoreResult?.correctCount} / {questions.length}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block">Academic Status</span>
                  <span className="text-sm font-bold text-stone-900 block mt-2">
                    {(scoreResult?.percentage || 0) >= 80 ? 'Distinction Pass' : 'Completed'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Explanations List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-700" />
              <h4 className="text-lg font-bold text-stone-900">Review & Explanations</h4>
            </div>

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
                <Card
                  key={q.id}
                  className={`border-l-4 ${
                    isCorrect ? 'border-l-emerald-600' : 'border-l-red-500'
                  }`}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <span className="text-sm font-semibold text-stone-900">
                        Question {i + 1} ({q.marks} marks)
                      </span>
                      <Badge variant={isCorrect ? 'success' : 'destructive'}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>

                    <p className="text-base font-medium text-stone-900">
                      {q.questionText}
                    </p>

                    <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-sm space-y-1.5">
                      <span className="font-semibold text-stone-900 block text-xs uppercase tracking-wide">
                        Scholarly Explanation:
                      </span>
                      <p className="text-stone-700 leading-relaxed text-xs">{q.explanation}</p>
                      {q.sourceReference && (
                        <span className="text-[11px] text-stone-500 block pt-1 font-mono">
                          Source Reference: {q.sourceReference}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center pt-4 pb-10">
            <Button
              onClick={() => {
                if (onFinish) onFinish();
                window.location.href = '/portal';
              }}
              className="gap-2 bg-stone-900 hover:bg-stone-800 text-white"
            >
              <span>Return to Participant Portal</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
