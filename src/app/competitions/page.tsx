'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { IslamicStarIcon } from '../../components/common/IslamicPattern';
import { Award, Clock, ArrowRight, Search, ShieldCheck } from 'lucide-react';

export default function CompetitionsListingPage() {
  const { competitions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = competitions.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-[#0f172a]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#064e3b] shadow-xs">
          <IslamicStarIcon size={13} className="text-[#9e782f]" />
          <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#064e3b]">
            ACADEMIC &amp; SACRED TOURNAMENTS
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0f172a]">
          International Holy Quran &amp; Hadith Competitions
        </h1>
        <p className="text-sm text-[#475569] leading-relaxed">
          Rigorous academic challenges testing memorization, Tajweed articulation, Hadith chains of transmission, and prophetic ethics.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search size={16} className="absolute left-4 top-3 text-[#94a3b8]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by competition category or topic..."
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#064e3b] focus:outline-none shadow-xs transition-colors"
        />
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((comp) => (
          <div
            key={comp.id}
            className="rounded-3xl bg-[#ffffff] border border-[#e7e2d6] hover:border-[#064e3b]/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group transition-all overflow-hidden"
          >
            {/* Rich Photography Header */}
            <div className="relative h-48 w-full overflow-hidden bg-[#f4f0e6]">
              <img
                src={comp.coverImage}
                alt={comp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-[#ffffff]/90 backdrop-blur-xs text-[#064e3b]">
                  {comp.category}
                </span>
                <span className="text-[10px] font-semibold text-[#ffffff] bg-[#000000]/40 backdrop-blur-xs px-2 py-0.5 rounded">
                  {comp.scoringMethod === 'automatic' ? 'Online Proctored' : 'Rubric Audited'}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[9px] font-bold text-[#d4a94b] tracking-wider uppercase">
                  LAUREATE PRIZE
                </span>
                <p className="text-xs font-bold text-[#ffffff] truncate">
                  {comp.prizes[0]?.award}
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#064e3b] transition-colors leading-snug">
                  {comp.title}
                </h3>

                {comp.arabicTitle && (
                  <p className="font-arabic text-sm text-[#9e782f]" dir="rtl">
                    {comp.arabicTitle}
                  </p>
                )}

                <p className="text-xs text-[#475569] line-clamp-3 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e7e2d6] space-y-3">
                <div className="flex justify-between items-center text-xs text-[#6b7280]">
                  <span>Quota Enrolled</span>
                  <span className="font-semibold text-[#0f172a]">
                    {comp.enrolledCount} / {comp.maxParticipants} Registered
                  </span>
                </div>

                <div className="w-full bg-[#f4f0e6] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#064e3b] h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((comp.enrolledCount / comp.maxParticipants) * 100))}%`
                    }}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <Link
                    href={`/competitions/${comp.id}`}
                    className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#475569] hover:text-[#0f172a] hover:border-[#9e782f]/50 transition-all flex items-center gap-1"
                  >
                    <span>Syllabus</span>
                  </Link>

                  <Link
                    href={comp.format === 'online-quiz' ? `/test/${comp.id}` : `/competitions/${comp.id}`}
                    className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] hover:bg-[#043c2e] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{comp.format === 'online-quiz' ? 'Launch Exam' : 'Enter Submission'}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
