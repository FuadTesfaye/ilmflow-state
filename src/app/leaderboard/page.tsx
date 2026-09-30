'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const { competitions } = useApp();
  const [selectedCompId, setSelectedCompId] = useState(competitions[0]?.id || '');

  const mockLeaderboard = [
    { rank: 1, name: 'Zayd Al-Ansari', country: 'Canada', score: 95, time: '08m 14s', badge: '1st Place' },
    { rank: 2, name: 'Bilal Ibn Rabah Al-Habashi', country: 'Saudi Arabia', score: 94, time: '09m 22s', badge: '2nd Place' },
    { rank: 3, name: 'Tariq ibn Ziyad', country: 'Morocco', score: 90, time: '10m 05s', badge: '3rd Place' },
    { rank: 4, name: 'Amina Al-Fassi', country: 'United Kingdom', score: 88, time: '11m 40s', badge: 'Finalist' },
    { rank: 5, name: 'Ibrahim Al-Dimashqi', country: 'Turkey', score: 85, time: '12m 10s', badge: 'Finalist' }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-slate-900">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="outline" className="text-xs font-semibold px-3 py-1">
          Standings
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Tournament Leaderboard
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Publicly authenticated rankings adjudicated under certified rubrics and computer-based proctoring.
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
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* Rank 2 (Silver) */}
        <Card className="order-2 md:order-1 p-6 text-center space-y-3.5 border-slate-200 hover:border-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_0_20px_rgba(148,163,184,0.2)] transition-all">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-extrabold mx-auto flex items-center justify-center text-lg shadow-inner border border-slate-200">
            2
          </div>
          <Badge variant="secondary" className="text-[10px] font-semibold">
            2nd Place Silver
          </Badge>
          <h3 className="text-base font-bold text-slate-900">{mockLeaderboard[1].name}</h3>
          <p className="text-xs text-slate-500">{mockLeaderboard[1].country}</p>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Score</span>
            <span className="text-slate-800 font-mono text-sm">{mockLeaderboard[1].score} pts</span>
          </div>
        </Card>

        {/* Rank 1 (Gold Laureate with Neon Emerald Glow) */}
        <Card className="order-1 md:order-2 p-8 border-2 border-emerald-400 bg-gradient-to-b from-emerald-50/70 via-white to-white shadow-[0_0_35px_rgba(16,185,129,0.25)] rounded-2xl text-center space-y-4 relative transform md:-translate-y-2 transition-all">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <Badge variant="gradient" className="text-[10px] gap-1.5 py-0.5 px-3 font-bold uppercase tracking-wider">
              <Trophy size={12} className="text-amber-300" />
              <span>1st Place Gold Laureate</span>
            </Badge>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white font-extrabold mx-auto flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)] mt-1">
            1
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{mockLeaderboard[0].name}</h3>
            <p className="text-xs text-emerald-800 font-semibold mt-0.5">{mockLeaderboard[0].country}</p>
          </div>
          <div className="pt-3 border-t border-emerald-100 flex justify-between text-xs font-bold">
            <span className="text-slate-500">Score</span>
            <span className="text-emerald-700 font-mono text-base">{mockLeaderboard[0].score} pts</span>
          </div>
        </Card>

        {/* Rank 3 (Bronze) */}
        <Card className="order-3 p-6 text-center space-y-3.5 border-amber-200/80 bg-gradient-to-b from-amber-50/20 to-white hover:border-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 font-extrabold mx-auto flex items-center justify-center text-lg border border-amber-200 shadow-inner">
            3
          </div>
          <Badge variant="warning" className="text-[10px] font-semibold">
            3rd Place Bronze
          </Badge>
          <h3 className="text-base font-bold text-slate-900">{mockLeaderboard[2].name}</h3>
          <p className="text-xs text-slate-500">{mockLeaderboard[2].country}</p>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Score</span>
            <span className="text-amber-900 font-mono text-sm">{mockLeaderboard[2].score} pts</span>
          </div>
        </Card>
      </div>

      {/* Full Leaderboard Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Competitor</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Award</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLeaderboard.map((entry) => (
              <TableRow key={entry.rank}>
                <TableCell className="font-mono font-bold text-xs">#{entry.rank}</TableCell>
                <TableCell className="font-semibold text-slate-900">{entry.name}</TableCell>
                <TableCell className="text-slate-600 text-xs">{entry.country}</TableCell>
                <TableCell className="font-bold text-emerald-700 font-mono text-xs">{entry.score} pts</TableCell>
                <TableCell className="text-slate-400 font-mono text-xs">{entry.time}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={entry.rank === 1 ? 'default' : entry.rank <= 3 ? 'warning' : 'secondary'} className="text-[10px]">
                    {entry.badge}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
