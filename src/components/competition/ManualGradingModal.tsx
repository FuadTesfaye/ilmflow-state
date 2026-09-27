'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualSubmission, RubricCriterion } from '../../types';
import { IslamicStarIcon } from '../common/IslamicPattern';
import {
  X,
  Play,
  Pause,
  Award,
  CheckCircle,
  FileText,
  Volume2,
  Sliders,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ManualGradingModalProps {
  submission: ManualSubmission;
  rubric: RubricCriterion[];
  isOpen: boolean;
  onClose: () => void;
}

export const ManualGradingModal: React.FC<ManualGradingModalProps> = ({
  submission,
  rubric,
  isOpen,
  onClose
}) => {
  const { gradeSubmission, currentUser } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [comments, setComments] = useState<string>(
    submission.grades?.[0]?.comments || ''
  );

  const [scores, setScores] = useState<Record<string, number>>(() => {
    if (submission.grades?.[0]?.criteriaScores) {
      return submission.grades[0].criteriaScores;
    }
    const initial: Record<string, number> = {};
    rubric.forEach((r) => {
      initial[r.id] = Math.round(r.maxScore * 0.9);
    });
    return initial;
  });

  if (!isOpen) return null;

  const totalCalculatedScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (criterionId: string, val: number, max: number) => {
    const clamped = Math.max(0, Math.min(max, val));
    setScores((prev) => ({ ...prev, [criterionId]: clamped }));
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(true);
        });
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleSaveGrade = () => {
    gradeSubmission(
      submission.id,
      currentUser.id,
      currentUser.name,
      scores,
      totalCalculatedScore,
      comments || 'MashaAllah, pristine recitation with exemplary adherence to the rules of Tajweed.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-2xl text-[#111827] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-[#e7e2d6] bg-[#faf8f5] relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-[#6b7280] hover:text-[#111827] cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center justify-between pr-10">
            <div>
              <div className="flex items-center gap-2">
                <IslamicStarIcon size={14} className="text-[#064e3b]" />
                <span className="meta-tag text-[#064e3b] font-bold">
                  JUDICIAL EVALUATION BENCH
                </span>
              </div>
              <h3 className="font-display text-2xl text-[#111827] font-bold mt-1">
                {submission.title}
              </h3>
              <p className="text-xs text-[#6b7280] mt-0.5">
                Candidate: <strong className="text-[#111827]">{submission.participantName}</strong> ({submission.participantEmail})
              </p>
            </div>

            <div className="text-right">
              <span className="meta-tag text-[#6b7280] block text-[9px]">TOTAL EVALUATION</span>
              <span className="font-display text-3xl font-bold text-[#064e3b] tabular-nums">
                {totalCalculatedScore} <span className="text-xs text-[#6b7280] font-normal">/ 100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Audio Recitation Player Box */}
          {submission.type === 'audio' ? (
            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#064e3b]">
                  <Volume2 size={16} />
                  <span>
                    Audio Recitation: {submission.surahInfo?.surahName} (Ayah {submission.surahInfo?.ayahStart}–{submission.surahInfo?.ayahEnd})
                  </span>
                </div>
                <span className="meta-tag text-[#6b7280] bg-[#ffffff] px-2.5 py-0.5 rounded-full border border-[#e7e2d6]">
                  Riwayah: {submission.surahInfo?.qiraatStyle}
                </span>
              </div>

              {/* Real Audio Element */}
              <audio
                ref={audioRef}
                src={submission.audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              {/* Master Audio Controller */}
              <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e7e2d6] flex items-center gap-4">
                <button
                  onClick={toggleAudio}
                  className="w-10 h-10 rounded-full bg-[#064e3b] text-[#ffffff] flex items-center justify-center hover:bg-[#043c2e] transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>

                {/* Animated Waveform Bars */}
                <div className="flex-1 flex items-center gap-1 h-8">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const h = Math.sin(i * 0.3) * 14 + 16;
                    return (
                      <span
                        key={i}
                        style={{ height: `${h}px` }}
                        className={`w-1 rounded-full transition-all ${
                          isPlaying && i < 18 ? 'bg-[#064e3b]' : 'bg-[#e7e2d6]'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Playback speed selector */}
                <div className="flex items-center gap-1 border border-[#e7e2d6] rounded-lg p-0.5 text-[10px] font-mono">
                  {[0.75, 1.0, 1.25].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        playbackSpeed === spd
                          ? 'bg-[#064e3b] text-[#ffffff] font-bold'
                          : 'text-[#6b7280] hover:text-[#111827]'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-2">
              <span className="meta-tag text-[#064e3b] block font-bold">WRITTEN TREATISE EXCERPT</span>
              <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#4b5563] leading-relaxed max-h-36 overflow-y-auto">
                {submission.essayContent ||
                  'The diplomatic covenants established by the Prophet ﷺ in the Charter of Madinah (Sahifat al-Madinah) constitute an indelible foundation for contractual governance and religious pluralism in Islamic constitutional thought.'}
              </div>
            </div>
          )}

          {/* 100-Point Scoring Rubric */}
          <div className="space-y-3">
            <span className="meta-tag text-[#064e3b] block font-bold">100-POINT FORMAL RUBRIC</span>

            <div className="space-y-3">
              {rubric.map((criterion) => {
                const currentVal = scores[criterion.id] ?? Math.round(criterion.maxScore * 0.9);
                return (
                  <div
                    key={criterion.id}
                    className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#111827]">{criterion.name}</span>
                        <p className="text-[11px] text-[#6b7280] mt-0.5">{criterion.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="font-display text-base font-bold text-[#064e3b] tabular-nums">
                          {currentVal}
                        </span>
                        <span className="text-[10px] text-[#6b7280]"> / {criterion.maxScore} pts</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={criterion.maxScore}
                      value={currentVal}
                      onChange={(e) =>
                        handleScoreChange(criterion.id, Number(e.target.value), criterion.maxScore)
                      }
                      className="w-full accent-[#064e3b] bg-[#e7e2d6] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Judge Comments */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111827]">
              Judicial Commentary &amp; Scholarly Recommendations
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Cite notes on Ghunnah length, letter articulation, or academic citations..."
              className="w-full p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#111827] focus:border-[#064e3b] focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-[#e7e2d6] bg-[#faf8f5] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#6b7280] hover:text-[#111827] cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveGrade}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] transition-all cursor-pointer shadow-md"
          >
            <span>Endorse &amp; Publish Score ({totalCalculatedScore}/100)</span>
            <CheckCircle size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
