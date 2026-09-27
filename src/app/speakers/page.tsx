'use client';

import React from 'react';
import { INITIAL_SPEAKERS } from '../../data/mockData';
import { IslamicStarIcon } from '../../components/common/IslamicPattern';
import { Compass, BookOpen, Award } from 'lucide-react';

export default function SpeakersPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none text-[#111827]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#064e3b] shadow-xs">
          <IslamicStarIcon size={13} className="text-[#9e782f]" />
          <span className="meta-tag font-bold">FACULTY &amp; ADJUDICATION BENCH</span>
        </div>
        <h1 className="text-3xl sm:text-5xl text-[#0f172a] font-bold tracking-tight">
          Distinguished Scholars &amp; Reciters
        </h1>
        <p className="text-xs sm:text-sm text-[#475569]">
          Senior authorities presiding over plenary lectures, classical seminars, and the evaluation of Quran recitations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_SPEAKERS.map((spk) => (
          <div
            key={spk.id}
            className="p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-start gap-6 hover:border-[#064e3b]/40 transition-all"
          >
            <div className="w-24 h-24 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] overflow-hidden shrink-0 shadow-xs">
              <img src={spk.avatar} alt={spk.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 flex-1">
              <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold inline-block">
                {spk.organization}
              </span>
              <h3 className="text-lg font-bold text-[#0f172a]">{spk.name}</h3>
              <p className="text-xs text-[#064e3b] font-semibold">{spk.title}</p>
              <p className="text-xs text-[#475569] leading-relaxed pt-1">{spk.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
