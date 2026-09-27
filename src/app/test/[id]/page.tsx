'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { QuizEngine } from '../../../components/competition/QuizEngine';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TestRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const { getCompetitionById, questions } = useApp();

  const compId = (params?.id as string) || 'comp-hadith-mastery';
  const competition = getCompetitionById(compId) || getCompetitionById('comp-hadith-mastery');

  if (!competition) {
    return (
      <div className="min-h-screen py-16 px-4 text-center space-y-4 text-[#111827]">
        <AlertCircle size={36} className="mx-auto text-red-600" />
        <h2 className="font-display text-2xl text-[#111827] font-bold">Competition Not Found</h2>
        <Link href="/competitions" className="text-xs text-[#064e3b] font-semibold underline">
          Return to Competitions Catalog
        </Link>
      </div>
    );
  }

  // Filter or match questions for this competition round
  const roundQuestions = questions.filter(
    (q) =>
      competition.rounds[0]?.questionIds?.includes(q.id) ||
      q.category === competition.category
  );

  const activeQuestionsList = roundQuestions.length > 0 ? roundQuestions : questions.slice(0, 4);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 text-[#111827]">
      <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
        <Link
          href={`/competitions/${competition.id}`}
          className="flex items-center gap-1.5 text-xs text-[#064e3b] font-semibold hover:underline transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Exit Examination Environment</span>
        </Link>
        <span className="meta-tag px-3 py-1 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
          PROCTORED SESSION
        </span>
      </div>

      <QuizEngine
        competition={competition}
        questions={activeQuestionsList}
        onFinish={() => router.push('/portal')}
      />
    </div>
  );
}
