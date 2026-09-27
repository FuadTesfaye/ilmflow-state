'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { IslamicStarIcon } from '../../../components/common/IslamicPattern';
import {
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Shield,
  ArrowLeft,
  Play,
  FileText,
  Volume2,
  Users
} from 'lucide-react';

export default function CompetitionDetailPage() {
  const params = useParams();
  const { getCompetitionById, currentUser, submitManualWork } = useApp();

  const compId = (params?.id as string) || 'comp-hadith-mastery';
  const comp = getCompetitionById(compId) || getCompetitionById('comp-hadith-mastery');

  // Audio / essay submission modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [surahName, setSurahName] = useState('Al-Isra');
  const [surahNum, setSurahNum] = useState(17);
  const [ayahStart, setAyahStart] = useState(78);
  const [ayahEnd, setAyahEnd] = useState(85);
  const [qiraat, setQiraat] = useState('Hafs ‘an ‘Asim');
  const [essayText, setEssayText] = useState('');

  if (!comp) {
    return (
      <div className="min-h-screen py-16 text-center space-y-3">
        <h2 className="font-display text-2xl text-[#111827] font-bold">Competition Not Found</h2>
        <Link href="/competitions" className="text-xs text-[#064e3b] font-semibold underline">
          Back to Competitions Catalog
        </Link>
      </div>
    );
  }

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();

    if (comp.format === 'quran-recitation') {
      submitManualWork({
        competitionId: comp.id,
        roundId: comp.rounds[0]?.id || 'round-1',
        participantId: currentUser.id,
        participantName: currentUser.name,
        participantEmail: currentUser.email,
        type: 'audio',
        title: `Surah ${surahName} (${ayahStart}–${ayahEnd}) - ${qiraat}`,
        surahInfo: {
          surahName,
          surahNumber: surahNum,
          ayahStart,
          ayahEnd,
          qiraatStyle: qiraat
        },
        audioUrl: 'https://cdn.islamicnetwork.com/quran/audio-surah/128/ar.alafasy/17.mp3'
      });
    } else {
      submitManualWork({
        competitionId: comp.id,
        roundId: comp.rounds[0]?.id || 'round-1',
        participantId: currentUser.id,
        participantName: currentUser.name,
        participantEmail: currentUser.email,
        type: 'essay',
        title: 'Academic Treatise on Prophetic Ethics',
        essayContent: essayText
      });
    }

    setShowSubmitModal(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none text-[#111827]">
      <Link
        href="/competitions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064e3b] hover:underline"
      >
        <ArrowLeft size={14} />
        <span>Back to Competitions Catalog</span>
      </Link>

      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <span className="meta-tag px-3 py-1 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
              {comp.category}
            </span>
            <h1 className="text-3xl sm:text-5xl text-[#0f172a] font-bold tracking-tight">
              {comp.title}
            </h1>
            {comp.arabicTitle && (
              <p className="font-arabic text-xl sm:text-2xl text-[#9e782f]" dir="rtl">
                {comp.arabicTitle}
              </p>
            )}
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">{comp.description}</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[220px] shrink-0 space-y-3">
            <span className="meta-tag text-[#6b7280] block">
              ENROLLED COMPETITORS
            </span>
            <span className="font-display text-3xl font-bold text-[#064e3b] block">
              {comp.enrolledCount} / {comp.maxParticipants}
            </span>
            {comp.format === 'online-quiz' ? (
              <Link
                href={`/test/${comp.id}`}
                className="w-full py-3 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-bold hover:bg-[#043c2e] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Play size={14} fill="currentColor" />
                <span>Start Online Test</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-3 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-bold hover:bg-[#043c2e] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Volume2 size={14} />
                <span>Submit Work</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rules & Rubrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rules */}
        <div className="p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#e7e2d6]">
            <Shield size={18} className="text-[#064e3b]" />
            <h3 className="text-xl font-bold text-[#0f172a]">
              Rules of Adjudication &amp; Integrity
            </h3>
          </div>
          <ul className="space-y-3 text-xs text-[#475569]">
            {comp.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#064e3b] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prizes */}
        <div className="p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#e7e2d6]">
            <Award size={18} className="text-[#9e782f]" />
            <h3 className="text-xl font-bold text-[#0f172a]">
              Awards &amp; Academic Distinctions
            </h3>
          </div>
          <div className="space-y-3">
            {comp.prizes.map((p) => (
              <div
                key={p.rank}
                className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-[#111827] text-sm block">
                    {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : '🥉'} {p.title}
                  </span>
                  <p className="text-[11px] text-[#064e3b] font-medium mt-0.5">{p.award}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submission Modal for Quran audio / Essay */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#ffffff] border border-[#e7e2d6] p-7 text-[#111827] space-y-5 text-xs shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
              <h4 className="font-display text-xl font-bold text-[#111827]">
                {comp.format === 'quran-recitation' ? 'Submit Quran Recitation Recording' : 'Submit Written Essay'}
              </h4>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-[#6b7280] hover:text-[#111827] p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4">
              {comp.format === 'quran-recitation' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#4b5563] font-semibold mb-1">Surah Selection</label>
                      <input
                        type="text"
                        value={surahName}
                        onChange={(e) => setSurahName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#4b5563] font-semibold mb-1">Riwayah / Qira’at Tradition</label>
                      <select
                        value={qiraat}
                        onChange={(e) => setQiraat(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                      >
                        <option>Hafs ‘an ‘Asim</option>
                        <option>Warsh ‘an Nafi’</option>
                        <option>Qalun ‘an Nafi’</option>
                        <option>Al-Duri ‘an Abi ‘Amr</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[11px] text-[#6b7280]">
                    Audio recorded in studio standard with no digital reverbs or pitch corrections.
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[#4b5563] font-semibold mb-1">Essay Content / Thesis</label>
                  <textarea
                    rows={6}
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    placeholder="Enter or paste your academic treatise..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#e7e2d6]">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e7e2d6] text-[#6b7280] hover:text-[#111827] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] font-semibold cursor-pointer hover:bg-[#043c2e] shadow-xs"
                >
                  Submit for Judicial Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
