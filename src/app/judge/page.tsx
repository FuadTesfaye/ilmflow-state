'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualSubmission, RubricCriterion } from '../../types';
import { ManualGradingModal } from '../../components/competition/ManualGradingModal';
import { IslamicStarIcon } from '../../components/common/IslamicPattern';
import {
  Award,
  Clock,
  CheckCircle,
  Volume2,
  FileText,
  Sliders,
  Filter,
  UserCheck
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

  // Retrieve rubric for selected submission's competition round
  const getRubricForSubmission = (sub: ManualSubmission): RubricCriterion[] => {
    const comp = competitions.find((c) => c.id === sub.competitionId);
    const round = comp?.rounds.find((r) => r.id === sub.roundId) || comp?.rounds[0];
    return (
      round?.rubric || [
        { id: 'rub-tajweed', name: 'Tajweed Rules & Characteristics', description: 'Application of Ghunnah, Madd, Ikhfa, Idgham, and Qalqalah.', maxScore: 30 },
        { id: 'rub-memorization', name: 'Memorization & Fluency', description: 'Fluency without hesitation or stumble.', maxScore: 30 },
        { id: 'rub-makharij', name: 'Articulation Points (Makharij)', description: 'Pristine phoneme clarity.', maxScore: 20 },
        { id: 'rub-voice', name: 'Vocal Quality & Tone', description: 'Natural resonance and melodic cadence.', maxScore: 10 },
        { id: 'rub-overall', name: 'Adab & Waqf / Ibtida', description: 'Respecting Quranic thematic pauses.', maxScore: 10 }
      ]
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 select-none text-[#111827]">
      {/* Judge Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <IslamicStarIcon size={16} className="text-[#064e3b]" />
            <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
              JUDICIAL CHAMBER &amp; EVALUATION BENCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl text-[#0f172a] font-bold mt-1 tracking-tight">
            Judge Adjudication Queue: {currentUser.name}
          </h1>
          <p className="text-xs text-[#475569]">
            Official rubric assessments for Holy Quran recitation audio recordings and academic treatises.
          </p>
        </div>

        {/* Stats cards */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[120px]">
            <span className="meta-tag text-[#6b7280] block text-[9px]">AWAITING GRADE</span>
            <span className="font-display text-2xl font-bold text-[#9e782f]">{pendingCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[120px]">
            <span className="meta-tag text-[#6b7280] block text-[9px]">COMPLETED</span>
            <span className="font-display text-2xl font-bold text-[#064e3b]">{gradedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-2xl bg-[#f4f0e6] p-1.5 border border-[#e7e2d6]">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            All Submissions ({manualSubmissions.length})
          </button>
          <button
            onClick={() => setFilterType('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'pending'
                ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            onClick={() => setFilterType('graded')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'graded'
                ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Graded ({gradedCount})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((sub) => {
          const isGraded = sub.status === 'graded';
          return (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] hover:border-[#064e3b]/50 transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                  <span className="flex items-center gap-1.5 text-xs text-[#064e3b] font-semibold">
                    {sub.type === 'audio' ? <Volume2 size={16} /> : <FileText size={16} />}
                    <span className="capitalize">{sub.type} Entry</span>
                  </span>
                  <span
                    className={`meta-tag px-2.5 py-1 rounded-full ${
                      isGraded
                        ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                        : 'bg-[#fefce8] text-[#854d0e] border border-[#fef08a]'
                    }`}
                  >
                    {isGraded ? `GRADED: ${sub.finalScore}/100` : 'PENDING EVALUATION'}
                  </span>
                </div>

                <h4 className="font-display text-xl font-bold text-[#111827] mt-3">{sub.title}</h4>
                <p className="text-xs text-[#6b7280] mt-1">
                  Candidate: <strong className="text-[#111827]">{sub.participantName}</strong>
                </p>

                {sub.surahInfo && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-xs space-y-1.5">
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Surah &amp; Verses:</span>
                      <span className="font-semibold text-[#111827]">
                        {sub.surahInfo.surahName} ({sub.surahInfo.ayahStart}–{sub.surahInfo.ayahEnd})
                      </span>
                    </div>
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Riwayah Tradition:</span>
                      <span className="font-semibold text-[#064e3b]">{sub.surahInfo.qiraatStyle}</span>
                    </div>
                  </div>
                )}

                {isGraded && sub.grades?.[0] && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-xs">
                    <span className="meta-tag text-[#065f46] font-bold block">
                      Judge Feedback:
                    </span>
                    <p className="text-[#065f46] italic mt-0.5">{sub.grades[0].comments}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#e7e2d6] flex items-center justify-between">
                <span className="text-xs text-[#6b7280]">
                  Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setSelectedSubmission(sub)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs transition-all"
                >
                  <Sliders size={13} />
                  <span>{isGraded ? 'Review / Re-grade' : 'Score with Rubric'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubric Grading Modal */}
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
