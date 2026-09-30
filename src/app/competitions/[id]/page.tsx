'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import {
  Award,
  Shield,
  ArrowLeft,
  Play,
  Volume2,
  CheckCircle,
  X
} from 'lucide-react';

export default function CompetitionDetailPage() {
  const params = useParams();
  const { getCompetitionById, currentUser, submitManualWork } = useApp();

  const compId = (params?.id as string) || 'comp-hadith-mastery';
  const comp = getCompetitionById(compId) || getCompetitionById('comp-hadith-mastery');

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [surahName, setSurahName] = useState('Al-Isra');
  const [surahNum, setSurahNum] = useState(17);
  const [ayahStart, setAyahStart] = useState(78);
  const [ayahEnd, setAyahEnd] = useState(85);
  const [qiraat, setQiraat] = useState('Hafs ‘an ‘Asim');
  const [essayText, setEssayText] = useState('');

  if (!comp) {
    return (
      <div className="min-h-screen py-16 text-center space-y-4">
        <h2 className="text-2xl text-slate-900 font-bold">Competition Not Found</h2>
        <Link href="/competitions">
          <Button variant="outline">Back to Competitions</Button>
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
        title: 'Academic Submission',
        essayContent: essayText
      });
    }

    setShowSubmitModal(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      <Link href="/competitions">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600 hover:text-slate-900">
          <ArrowLeft size={14} />
          <span>Back to Competitions</span>
        </Button>
      </Link>

      {/* Header Banner */}
      <Card className="p-8 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <Badge variant="secondary" className="text-xs">
              {comp.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight">
              {comp.title}
            </h1>
            {comp.arabicTitle && (
              <p className="font-arabic text-xl sm:text-2xl text-emerald-800" dir="rtl">
                {comp.arabicTitle}
              </p>
            )}
            <p className="text-sm text-slate-600 leading-relaxed">{comp.description}</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[220px] shrink-0 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Enrolled Participants
              </span>
              <span className="text-3xl font-extrabold text-slate-900 block tabular-nums">
                {comp.enrolledCount} <span className="text-base font-normal text-slate-400">/ {comp.maxParticipants}</span>
              </span>
            </div>

            {comp.format === 'online-quiz' ? (
              <Link href={`/test/${comp.id}`} className="block">
                <Button size="default" className="w-full gap-2">
                  <Play size={15} fill="currentColor" />
                  <span>Start Online Exam</span>
                </Button>
              </Link>
            ) : (
              <Button
                size="default"
                onClick={() => setShowSubmitModal(true)}
                className="w-full gap-2"
              >
                <Volume2 size={16} />
                <span>Submit Work</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Rules & Rubrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rules */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield size={18} className="text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">Competition Guidelines</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
            {comp.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Prizes */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award size={18} className="text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">Awards &amp; Merits</h3>
          </div>
          <div className="space-y-3">
            {comp.prizes.map((p) => (
              <div
                key={p.rank}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block text-sm">
                    {p.rank === 1 ? '🥇 1st Place' : p.rank === 2 ? '🥈 2nd Place' : '🥉 3rd Place'} — {p.title}
                  </span>
                  <p className="text-slate-600 mt-0.5">{p.award}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Submission Modal Dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 space-y-4 bg-white shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Submit Entry: {comp.title}
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4">
              {comp.format === 'quran-recitation' ? (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Surah Name</label>
                    <Input
                      type="text"
                      value={surahName}
                      onChange={(e) => setSurahName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">From Ayah</label>
                      <Input
                        type="number"
                        value={ayahStart}
                        onChange={(e) => setAyahStart(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">To Ayah</label>
                      <Input
                        type="number"
                        value={ayahEnd}
                        onChange={(e) => setAyahEnd(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Recitation Riwayah</label>
                    <Input
                      type="text"
                      value={qiraat}
                      onChange={(e) => setQiraat(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Essay Treatise Text</label>
                  <textarea
                    rows={6}
                    required
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    placeholder="Enter academic essay content..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setShowSubmitModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Confirm Submission
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
