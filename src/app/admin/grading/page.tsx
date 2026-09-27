'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { ManualSubmission, RubricCriterion } from '../../../types';
import { ManualGradingModal } from '../../../components/competition/ManualGradingModal';
import { IslamicStarIcon } from '../../../components/common/IslamicPattern';
import {
  Award,
  Clock,
  CheckCircle,
  Volume2,
  FileText,
  Sliders,
  Filter,
  UserCheck,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AdminGradingQueuePage() {
  const { manualSubmissions, competitions, currentUser } = useApp();

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
        { id: 'rub-tajweed', name: 'Tajweed Rules & Characteristics', description: 'Application of Ghunnah, Madd, Ikhfa, Idgham, and Qalqalah.', maxScore: 30 },
        { id: 'rub-memorization', name: 'Memorization & Fluency', description: 'Fluency without hesitation or stumble.', maxScore: 30 },
        { id: 'rub-makharij', name: 'Articulation Points (Makharij)', description: 'Pristine phoneme clarity.', maxScore: 20 },
        { id: 'rub-voice', name: 'Vocal Quality & Melody', description: 'Natural resonance and melodic cadence.', maxScore: 10 },
        { id: 'rub-overall', name: 'Adab & Waqf / Ibtida', description: 'Respecting Quranic thematic pauses.', maxScore: 10 }
      ]
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-[#0f172a]">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <IslamicStarIcon size={16} className="text-[#064e3b]" />
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
              JUDICIAL SECRETARIAT &amp; ADJUDICATION BENCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mt-1 tracking-tight">
            Central Grading Queue &amp; Evaluation Backlog
          </h1>
          <p className="text-xs text-[#475569]">
            Assign audio recitations and written treatises to certified Qira’at judges and track 100-point rubric marks.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[120px]">
            <span className="text-[10px] font-bold tracking-wider text-[#9e782f] uppercase block">
              AWAITING SCORE
            </span>
            <span className="text-2xl font-bold text-[#9e782f] block mt-0.5">{pendingCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[120px]">
            <span className="text-[10px] font-bold tracking-wider text-[#064e3b] uppercase block">
              GRADED ENTRIES
            </span>
            <span className="text-2xl font-bold text-[#064e3b] block mt-0.5">{gradedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['all', 'pending', 'graded'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-[#064e3b] text-[#ffffff] shadow-xs'
                  : 'bg-[#faf8f5] border border-[#e7e2d6] text-[#6b7280] hover:text-[#0f172a]'
              }`}
            >
              {t === 'all' ? 'All Submissions' : t === 'pending' ? 'Pending Review' : 'Completed Grades'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#6b7280]">Filter Tournament:</span>
          <select
            value={selectedCompFilter}
            onChange={(e) => setSelectedCompFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a]"
          >
            <option value="all">All Tournaments</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#6b7280]">
            No submissions matching this filter criterion.
          </div>
        ) : (
          filtered.map((sub) => {
            const comp = competitions.find((c) => c.id === sub.competitionId);

            return (
              <div
                key={sub.id}
                className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs hover:border-[#064e3b]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        sub.status === 'graded'
                          ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                          : 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                      }`}
                    >
                      {sub.status === 'graded' ? 'Graded & Approved' : 'Awaiting Judge Evaluation'}
                    </span>
                    <span className="text-xs text-[#6b7280]">•</span>
                    <span className="text-xs font-semibold text-[#064e3b]">
                      {comp?.title || 'Quran & Sunnah Contest'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0f172a]">{sub.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b7280]">
                    <span className="font-semibold text-[#0f172a]">Delegate: {sub.participantName}</span>
                    <span>Email: {sub.participantEmail}</span>
                    <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {sub.status === 'graded' && sub.grades?.[0] && (
                    <div className="text-right pr-2">
                      <span className="text-[10px] text-[#6b7280] block">Final Score</span>
                      <span className="text-xl font-bold text-[#064e3b]">
                        {sub.grades[0].totalScore} / 100
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedSubmission(sub)}
                    className="px-4 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sliders size={14} />
                    <span>{sub.status === 'graded' ? 'Review / Edit Grade' : 'Open Rubric Scoring'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
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
