'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { Trophy, Clock, Medal } from 'lucide-react';

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
    <div className="page-enter min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 text-slate-900">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="outline" className="text-xs font-semibold px-3 py-1 text-[#135B3E] border-emerald-200 bg-emerald-50">
          Official Standings
        </Badge>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          Tournament Leaderboard
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          Publicly authenticated rankings adjudicated under certified rubrics and computer-based proctoring.
        </p>
      </div>

      {/* Competition Tabs (Smooth Horizontal Scroll on Mobile) */}
      <div className="w-full overflow-x-auto hide-scrollbar pb-2">
        <div className="flex items-center sm:justify-center gap-2 min-w-max px-1">
          {competitions.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCompId(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCompId === c.id
                  ? 'bg-[#135B3E] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end pt-2">
        {/* Rank 2 (Silver) */}
        <Card className="order-2 md:order-1 p-5 sm:p-6 text-center space-y-3 bg-white border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-extrabold mx-auto flex items-center justify-center text-lg shadow-inner border border-slate-200">
            2
          </div>
          <Badge variant="secondary" className="text-[10px] font-semibold">
            2nd Place Silver
          </Badge>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">{mockLeaderboard[1].name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{mockLeaderboard[1].country}</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Score</span>
            <span className="text-slate-800 font-mono text-sm">{mockLeaderboard[1].score} pts</span>
          </div>
        </Card>

        {/* Rank 1 (Gold Laureate with Sanctuary Emerald & Antique Gold) */}
        <Card className="order-1 md:order-2 p-6 sm:p-8 border-2 border-emerald-500 bg-gradient-to-b from-emerald-50/80 via-white to-white shadow-sanctuary rounded-2xl text-center space-y-3.5 relative transform md:-translate-y-2">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <Badge className="text-[10px] gap-1.5 py-0.5 px-3 font-bold uppercase tracking-wider bg-[#135B3E] text-white">
              <Trophy size={12} className="text-[#9E782F]" />
              <span>1st Place Gold</span>
            </Badge>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#0c4427] to-[#135b3e] text-white font-extrabold mx-auto flex items-center justify-center text-xl sm:text-2xl shadow-md mt-1">
            1
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">{mockLeaderboard[0].name}</h3>
            <p className="text-xs text-[#135B3E] font-semibold mt-0.5">{mockLeaderboard[0].country}</p>
          </div>
          <div className="pt-3 border-t border-emerald-100 flex justify-between text-xs font-bold">
            <span className="text-slate-500">Score</span>
            <span className="text-[#135B3E] font-mono text-base">{mockLeaderboard[0].score} pts</span>
          </div>
        </Card>

        {/* Rank 3 (Bronze) */}
        <Card className="order-3 p-5 sm:p-6 text-center space-y-3 bg-white border-amber-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 font-extrabold mx-auto flex items-center justify-center text-lg border border-amber-200 shadow-inner">
            3
          </div>
          <Badge variant="warning" className="text-[10px] font-semibold text-amber-800 bg-amber-100">
            3rd Place Bronze
          </Badge>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">{mockLeaderboard[2].name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{mockLeaderboard[2].country}</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Score</span>
            <span className="text-amber-900 font-mono text-sm">{mockLeaderboard[2].score} pts</span>
          </div>
        </Card>
      </div>

      {/* Full Leaderboard Table (Responsive Horizontal Scroll) */}
      <Card className="overflow-hidden bg-white border-slate-200/90 shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="text-xs font-bold text-slate-700">Rank</TableHead>
                <TableHead className="text-xs font-bold text-slate-700">Competitor</TableHead>
                <TableHead className="text-xs font-bold text-slate-700">Country</TableHead>
                <TableHead className="text-xs font-bold text-slate-700">Score</TableHead>
                <TableHead className="text-xs font-bold text-slate-700 hidden sm:table-cell">Duration</TableHead>
                <TableHead className="text-xs font-bold text-slate-700 text-right">Award</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 text-xs">
              {mockLeaderboard.map((entry) => (
                <TableRow key={entry.rank} className="hover:bg-slate-50/60">
                  <TableCell className="font-mono font-bold">#{entry.rank}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{entry.name}</TableCell>
                  <TableCell className="text-slate-600">{entry.country}</TableCell>
                  <TableCell className="font-bold text-[#135B3E] font-mono">{entry.score} pts</TableCell>
                  <TableCell className="text-slate-400 font-mono hidden sm:table-cell">{entry.time}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={entry.rank === 1 ? 'default' : entry.rank <= 3 ? 'warning' : 'secondary'}
                      className="text-[10px]"
                    >
                      {entry.badge}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
