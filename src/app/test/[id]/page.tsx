'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { QuizEngine } from '../../../components/competition/QuizEngine';
import { ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';

export default function TestRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const { getCompetitionById, questions } = useApp();

  const compId = (params?.id as string) || 'comp-hadith-mastery';
  const competition = getCompetitionById(compId) || getCompetitionById('comp-hadith-mastery');

  if (!competition) {
    return (
      <div className="min-h-screen py-16 px-4 text-center space-y-4 max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 space-y-4">
            <AlertCircle size={40} className="mx-auto text-red-600" />
            <h2 className="text-xl text-stone-900 font-semibold">Test Session Not Found</h2>
            <p className="text-sm text-stone-500">
              The competition you are looking for is either unpublished or invalid.
            </p>
            <Link href="/competitions">
              <Button className="mt-2">Return to Competitions</Button>
            </Link>
          </CardContent>
        </Card>
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
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <Link href={`/competitions/${competition.id}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-stone-600 hover:text-stone-900">
            <ArrowLeft size={16} />
            <span>Exit Exam Environment</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="gap-1.5 py-1 px-2.5">
            <ShieldCheck size={13} />
            <span>Proctored Secure Session</span>
          </Badge>
        </div>
      </div>

      <QuizEngine
        competition={competition}
        questions={activeQuestionsList}
        onFinish={() => router.push('/portal')}
      />
    </div>
  );
}
