'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualSubmission, RubricCriterion } from '../../types';
import {
  X,
  Play,
  Pause,
  CheckCircle,
  Volume2
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
      comments || 'Good submission.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-xl bg-white border border-stone-200 shadow-sm text-stone-900 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-md hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center justify-between pr-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-stone-500 block mb-1">
                Grading
              </span>
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                {submission.title}
              </h3>
              <p className="text-sm text-stone-500 mt-1">
                Candidate: <strong className="text-stone-900">{submission.participantName}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wide text-stone-500 block">Total Score</span>
              <span className="text-3xl font-bold text-stone-900 tabular-nums block mt-1">
                {totalCalculatedScore} <span className="text-sm text-stone-400 font-medium">/ 100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Audio Player or Essay Viewer */}
          {submission.type === 'audio' ? (
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                  <Volume2 size={18} className="text-stone-500" />
                  <span>
                    Audio: {submission.surahInfo?.surahName} (Ayah {submission.surahInfo?.ayahStart}–{submission.surahInfo?.ayahEnd})
                  </span>
                </div>
                <span className="text-xs font-medium text-stone-600 bg-white px-2 py-1 rounded border border-stone-200">
                  Style: {submission.surahInfo?.qiraatStyle}
                </span>
              </div>

              <audio
                ref={audioRef}
                src={submission.audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="p-4 rounded-lg bg-white border border-stone-200 flex items-center gap-4">
                <button
                  onClick={toggleAudio}
                  className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shrink-0"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>

                <div className="flex-1 flex items-center gap-1 h-8">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const h = Math.sin(i * 0.3) * 14 + 16;
                    return (
                      <span
                        key={i}
                        style={{ height: `${h}px` }}
                        className={`w-1 rounded-full transition-all ${
                          isPlaying && i < 18 ? 'bg-stone-900' : 'bg-stone-200'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 border border-stone-200 rounded-md p-1 text-xs font-medium">
                  {[0.75, 1.0, 1.25].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-2 py-1 rounded transition-colors ${
                        playbackSpeed === spd
                          ? 'bg-stone-900 text-white'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wide text-stone-900 block">Submission Content</span>
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-sm text-stone-700 leading-relaxed max-h-48 overflow-y-auto">
                {submission.essayContent || 'Submission text goes here.'}
              </div>
            </div>
          )}

          {/* Rubric */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wide text-stone-900 block">Scoring Rubric</span>

            <div className="space-y-4">
              {rubric.map((criterion) => {
                const currentVal = scores[criterion.id] ?? Math.round(criterion.maxScore * 0.9);
                return (
                  <div
                    key={criterion.id}
                    className="p-4 rounded-lg border border-stone-200 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-stone-900 text-sm block">{criterion.name}</span>
                        <p className="text-xs text-stone-500 mt-1">{criterion.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="text-lg font-bold text-stone-900 tabular-nums">
                          {currentVal}
                        </span>
                        <span className="text-xs text-stone-500"> / {criterion.maxScore} pts</span>
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
                      className="w-full accent-stone-900 h-1.5 rounded-lg cursor-pointer bg-stone-200 appearance-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wide text-stone-900">
              Comments & Feedback
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add feedback for the candidate..."
              className="w-full p-3 rounded-lg border border-stone-200 text-sm focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 bg-stone-50 flex items-center justify-between shrink-0 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveGrade}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            <span>Save Grade</span>
            <CheckCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
