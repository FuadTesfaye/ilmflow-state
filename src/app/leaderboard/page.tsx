'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { IslamicStarIcon } from '../../components/common/IslamicPattern';
import { Award, Trophy, Medal, Search, CheckCircle } from 'lucide-react';

export default function LeaderboardPage() {
  const { competitions, quizAttempts, manualSubmissions } = useApp();
  const [selectedCompId, setSelectedCompId] = useState(competitions[0]?.id || '');

  // Sample static leaderboard entries combined with active state
  const mockLeaderboard = [
    { rank: 1, name: 'Zayd Al-Ansari', country: 'Canada', score: 95, time: '08m 14s', badge: 'Gold Laureate' },
    { rank: 2, name: 'Bilal Ibn Rabah Al-Habashi', country: 'Saudi Arabia', score: 94, time: '09m 22s', badge: 'Silver Medal' },
    { rank: 3, name: 'Tariq ibn Ziyad', country: 'Morocco', score: 90, time: '10m 05s', badge: 'Bronze Medal' },
    { rank: 4, name: 'Amina Al-Fassi', country: 'United Kingdom', score: 88, time: '11m 40s', badge: 'Top 10' },
    { rank: 5, name: 'Ibrahim Al-Dimashqi', country: 'Turkey', score: 85, time: '12m 10s', badge: 'Top 10' }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 select-none text-[#111827]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#064e3b] shadow-xs">
          <IslamicStarIcon size={13} className="text-[#9e782f]" />
          <span className="meta-tag font-bold">ACADEMIC STANDINGS &amp; HONORS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl text-[#0f172a] font-bold tracking-tight">
          Official Tournament Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-[#475569]">
          Publicly authenticated scores adjudicated under standardized rubrics and negative marking rules.
        </p>
      </div>

      {/* Competition Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {competitions.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCompId(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCompId === c.id
                ? 'bg-[#064e3b] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4b5563] border border-[#e7e2d6] hover:text-[#111827]'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Podium Showcase (Top 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 items-end">
        {/* 2nd Place */}
        <div className="p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] text-center space-y-2 flex flex-col justify-end order-2 sm:order-1 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="w-12 h-12 rounded-full bg-[#f4f0e6] border border-[#e7e2d6] text-[#4b5563] flex items-center justify-center mx-auto text-base font-bold">
            2
          </div>
          <h4 className="font-display text-lg font-bold text-[#111827]">
            {mockLeaderboard[1].name}
          </h4>
          <span className="text-[11px] text-[#6b7280] block">{mockLeaderboard[1].country}</span>
          <span className="font-display text-2xl font-bold text-[#064e3b]">
            {mockLeaderboard[1].score} pts
          </span>
          <span className="text-[10px] font-mono text-[#6b7280] block">
            Pacing: {mockLeaderboard[1].time}
          </span>
        </div>

        {/* 1st Place */}
        <div className="p-8 rounded-3xl bg-[#ffffff] border-2 border-[#064e3b] text-center space-y-3 shadow-[0_10px_35px_-5px_rgba(6,78,59,0.15)] relative order-1 sm:order-2">
          <div className="w-16 h-16 rounded-full bg-[#064e3b] text-[#ffffff] flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
            👑
          </div>
          <span className="meta-tag px-3 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] font-bold inline-block">
            {mockLeaderboard[0].badge}
          </span>
          <h3 className="font-display text-2xl font-bold text-[#111827]">
            {mockLeaderboard[0].name}
          </h3>
          <span className="text-xs text-[#6b7280] block">{mockLeaderboard[0].country}</span>
          <span className="font-display text-4xl font-extrabold text-[#064e3b] block">
            {mockLeaderboard[0].score} pts
          </span>
          <span className="text-xs font-mono text-[#065f46] font-semibold block">
            Pacing: {mockLeaderboard[0].time}
          </span>
        </div>

        {/* 3rd Place */}
        <div className="p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] text-center space-y-2 flex flex-col justify-end order-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="w-12 h-12 rounded-full bg-[#f4f0e6] border border-[#e7e2d6] text-[#9e782f] flex items-center justify-center mx-auto text-base font-bold">
            3
          </div>
          <h4 className="font-display text-lg font-bold text-[#111827]">
            {mockLeaderboard[2].name}
          </h4>
          <span className="text-[11px] text-[#6b7280] block">{mockLeaderboard[2].country}</span>
          <span className="font-display text-2xl font-bold text-[#9e782f]">
            {mockLeaderboard[2].score} pts
          </span>
          <span className="text-[10px] font-mono text-[#6b7280] block">
            Pacing: {mockLeaderboard[2].time}
          </span>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#faf8f5] text-[#6b7280] font-mono uppercase text-[10px] border-b border-[#e7e2d6]">
            <tr>
              <th className="p-3.5">Rank</th>
              <th className="p-3.5">Competitor</th>
              <th className="p-3.5">Origin</th>
              <th className="p-3.5">Score (100)</th>
              <th className="p-3.5">Pacing</th>
              <th className="p-3.5 text-right">Award Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e2d6]">
            {mockLeaderboard.map((entry) => (
              <tr key={entry.rank} className="hover:bg-[#faf8f5]/60 transition-colors">
                <td className="p-3.5 font-mono font-bold text-[#064e3b]">#{entry.rank}</td>
                <td className="p-3.5 font-bold text-[#111827]">{entry.name}</td>
                <td className="p-3.5 text-[#4b5563]">{entry.country}</td>
                <td className="p-3.5 font-mono font-bold text-[#064e3b] text-sm">{entry.score}</td>
                <td className="p-3.5 text-[#6b7280] font-mono">{entry.time}</td>
                <td className="p-3.5 text-right">
                  <span className="meta-tag px-2.5 py-1 rounded-full bg-[#f4f0e6] border border-[#e7e2d6] text-[#064e3b] font-bold">
                    {entry.badge}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
