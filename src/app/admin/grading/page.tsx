'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { ManualSubmission, RubricCriterion } from '../../../types';
import { ManualGradingModal } from '../../../components/competition/ManualGradingModal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Sliders, ArrowLeft } from 'lucide-react';

export default function AdminGradingQueuePage() {
  const { manualSubmissions, competitions } = useApp();

  const [selectedSubmission, setSelectedSubmission] = useState<ManualSubmission | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'graded'>('all');
  const [selectedCompFilter, setSelectedCompFilter] = useState<string>('all');

  const filtered = manualSubmissions.filter((s) => {
    const matchesStatus =
      filterType === 'all' ||
      (filterType === 'pending' && s.status === 'pending_review') ||
      (filterType === 'graded' && s.status === 'graded');
    const matchesComp = selectedCompFilter === 'all' || s.competitionId === selectedCompFilter;
    return matchesStatus && matchesComp;
  });

  const pendingCount = manualSubmissions.filter((s) => s.status === 'pending_review').length;
  const gradedCount = manualSubmissions.filter((s) => s.status === 'graded').length;

  const getRubricForSubmission = (sub: ManualSubmission): RubricCriterion[] => {
    const comp = competitions.find((c) => c.id === sub.competitionId);
    const round = comp?.rounds.find((r) => r.id === sub.roundId) || comp?.rounds[0];
    return (
      round?.rubric || [
        { id: 'rub-tajweed', name: 'Tajweed Rules', description: 'Application of Ghunnah, Madd, Ikhfa, Idgham, and Qalqalah.', maxScore: 30 },
        { id: 'rub-memorization', name: 'Memorization & Fluency', description: 'Fluency without hesitation.', maxScore: 30 },
        { id: 'rub-makharij', name: 'Articulation (Makharij)', description: 'Phoneme clarity.', maxScore: 20 },
        { id: 'rub-voice', name: 'Vocal Quality', description: 'Natural resonance and melody.', maxScore: 10 },
        { id: 'rub-overall', name: 'Adab & Waqf', description: 'Respecting thematic pauses.', maxScore: 10 }
      ]
    );
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Adjudication &amp; Grading Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit candidate audio recitations and essay treatises using standardized rubrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] font-semibold text-amber-900 uppercase block">Pending</span>
            <span className="text-xl font-bold text-amber-700 block tabular-nums">{pendingCount}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] font-semibold text-emerald-900 uppercase block">Graded</span>
            <span className="text-xl font-bold text-emerald-700 block tabular-nums">{gradedCount}</span>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-1.5 ml-2">
              <ArrowLeft size={14} />
              <span>Back</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5">
          {(['all', 'pending', 'graded'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t === 'all' ? 'All Submissions' : t === 'pending' ? 'Pending Review' : 'Graded'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Filter Competition:</span>
          <select
            value={selectedCompFilter}
            onChange={(e) => setSelectedCompFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800"
          >
            <option value="all">All Competitions</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-xs text-slate-500">
            No submissions found matching this filter criteria.
          </Card>
        ) : (
          filtered.map((sub) => {
            const comp = competitions.find((c) => c.id === sub.competitionId);

            return (
              <Card
                key={sub.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={sub.status === 'graded' ? 'success' : 'warning'} className="text-[10px]">
                      {sub.status === 'graded' ? 'Graded' : 'Pending Review'}
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {comp?.title || 'Competition'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{sub.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{sub.participantName}</span>
                    <span>{sub.participantEmail}</span>
                    <span className="font-mono text-slate-400">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {sub.status === 'graded' && sub.grades?.[0] && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Score</span>
                      <span className="text-base font-extrabold text-emerald-700 font-mono">
                        {sub.grades[0].totalScore}/100
                      </span>
                    </div>
                  )}

                  <Button
                    size="sm"
                    onClick={() => setSelectedSubmission(sub)}
                    className="gap-1.5 text-xs"
                  >
                    <Sliders size={13} />
                    <span>{sub.status === 'graded' ? 'Review Grade' : 'Grade Entry'}</span>
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {selectedSubmission && (
        <ManualGradingModal
          submission={selectedSubmission}
          rubric={getRubricForSubmission(selectedSubmission)}
          isOpen={Boolean(selectedSubmission)}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
