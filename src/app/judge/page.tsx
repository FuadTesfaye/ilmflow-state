'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualSubmission, RubricCriterion } from '../../types';
import { ManualGradingModal } from '../../components/competition/ManualGradingModal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Volume2,
  FileText,
  Sliders,
  Award,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function JudgeDashboardPage() {
  const { manualSubmissions, competitions, currentUser } = useApp();

  const [selectedSubmission, setSelectedSubmission] = useState<ManualSubmission | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'graded'>('all');

  const filtered = manualSubmissions.filter((s) => {
    if (filterType === 'pending') return s.status === 'pending_review';
    if (filterType === 'graded') return s.status === 'graded';
    return true;
  });

  const pendingCount = manualSubmissions.filter((s) => s.status === 'pending_review').length;
  const gradedCount = manualSubmissions.filter((s) => s.status === 'graded').length;

  const getRubricForSubmission = (sub: ManualSubmission): RubricCriterion[] => {
    const comp = competitions.find((c) => c.id === sub.competitionId);
    const round = comp?.rounds.find((r) => r.id === sub.roundId) || comp?.rounds[0];
    return (
      round?.rubric || [
        { id: 'rub-tajweed', name: 'Tajweed Rules & Characteristics', description: 'Application of Ghunnah, Madd, Ikhfa, Idgham, and Qalqalah.', maxScore: 30 },
        { id: 'rub-memorization', name: 'Memorization & Fluency', description: 'Fluency without hesitation.', maxScore: 30 },
        { id: 'rub-makharij', name: 'Articulation Points (Makharij)', description: 'Phoneme clarity.', maxScore: 20 },
        { id: 'rub-voice', name: 'Vocal Resonance & Melody', description: 'Natural melodic cadence.', maxScore: 10 },
        { id: 'rub-overall', name: 'Adab & Thematic Pauses (Waqf)', description: 'Respecting Quranic pauses.', maxScore: 10 }
      ]
    );
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      {/* Header */}
      <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-semibold">
              Judges Workstation
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-amber-700">Official Adjudication</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Adjudication Docket: {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review oral recitation recordings and written treatises against standardized rubrics.
          </p>
        </div>

        {/* Docket Stats */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 px-5 rounded-xl bg-amber-50 border border-amber-200 text-center min-w-[110px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-900 block">
              Pending
            </span>
            <span className="text-2xl font-bold text-amber-700 tabular-nums">
              {pendingCount}
            </span>
          </div>

          <div className="p-3.5 px-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center min-w-[110px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900 block">
              Graded
            </span>
            <span className="text-2xl font-bold text-emerald-700 tabular-nums">
              {gradedCount}
            </span>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 max-w-md">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({manualSubmissions.length})
        </button>
        <button
          onClick={() => setFilterType('pending')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            filterType === 'pending'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilterType('graded')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            filterType === 'graded'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Graded ({gradedCount})
        </button>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((sub) => {
          const isGraded = sub.status === 'graded';
          return (
            <Card
              key={sub.id}
              className="p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                    {sub.type === 'audio' ? (
                      <Volume2 size={16} className="text-emerald-600" />
                    ) : (
                      <FileText size={16} className="text-blue-600" />
                    )}
                    <span className="capitalize">{sub.type === 'audio' ? 'Audio Recitation' : 'Essay Submission'}</span>
                  </span>
                  <Badge variant={isGraded ? 'success' : 'warning'}>
                    {isGraded ? `Score: ${sub.finalScore}/100` : 'Pending Review'}
                  </Badge>
                </div>

                <h4 className="text-base font-bold text-slate-900">{sub.title}</h4>
                <p className="text-xs text-slate-600">
                  Candidate: <strong className="text-slate-900">{sub.participantName}</strong> ({sub.participantEmail})
                </p>

                {sub.surahInfo && (
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span>Surah &amp; Verses:</span>
                      <strong className="text-slate-900">
                        {sub.surahInfo.surahName} (Ayat {sub.surahInfo.ayahStart}–{sub.surahInfo.ayahEnd})
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Qira’at Style:</span>
                      <strong className="text-slate-900">{sub.surahInfo.qiraatStyle}</strong>
                    </div>
                  </div>
                )}

                {isGraded && sub.grades?.[0] && (
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-900 block">Feedback Remarks:</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{sub.grades[0].comments}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                </span>
                <Button
                  size="sm"
                  onClick={() => setSelectedSubmission(sub)}
                  className="gap-1.5 text-xs"
                >
                  <Sliders size={14} />
                  <span>{isGraded ? 'Review Grade' : 'Score Submission'}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Manual Grading Modal */}
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
