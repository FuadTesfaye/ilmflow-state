'use client';

import React from 'react';
import Link from 'next/link';
import { IslamicStarIcon } from '../../../components/common/IslamicPattern';
import { BarChart3, ArrowLeft, TrendingUp, Users, Award, BookOpen, AlertCircle } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const questionDifficultyData = [
    {
      id: 'q-hadith-1',
      text: 'Monumental Sahih Collection by Imam Muhammad ibn Isma‘il al-Bukhari',
      attempts: 842,
      correct: 785,
      rate: '93.2%',
      difficulty: 'Beginner',
      status: 'Healthy'
    },
    {
      id: 'q-hadith-2',
      text: 'Mustalah Classification: Mutawatir vs Ahad isnad consensus',
      attempts: 842,
      correct: 412,
      rate: '48.9%',
      difficulty: 'Intermediate',
      status: 'Good Discriminator'
    },
    {
      id: 'q-hadith-3',
      text: 'Companion Narrator of the Hadith: "Actions are by Intentions"',
      attempts: 842,
      correct: 820,
      rate: '97.4%',
      difficulty: 'Beginner',
      status: 'High Accuracy'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-[#0f172a]">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <IslamicStarIcon size={16} className="text-[#064e3b]" />
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
              EXECUTIVE TELEMETRY &amp; PSYCHOMETRIC ANALYTICS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mt-1 tracking-tight">
            Academic Analytics &amp; Question Difficulty Index
          </h1>
          <p className="text-xs text-[#475569]">
            Psychometric evaluation of test questions, attendance velocity, and registration conversion funnels.
          </p>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#0f172a] hover:border-[#064e3b] flex items-center gap-1.5 self-start sm:self-center"
        >
          <ArrowLeft size={14} />
          <span>Back to Console</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-[#6b7280] uppercase block">
            AVERAGE TEST SCORE
          </span>
          <span className="text-3xl font-bold text-[#064e3b] block">82.4%</span>
          <span className="text-[11px] text-[#10b981]">+3.2% vs previous cohort</span>
        </div>
        <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-[#6b7280] uppercase block">
            QUALIFICATION RATE
          </span>
          <span className="text-3xl font-bold text-[#0f172a] block">74.6%</span>
          <span className="text-[11px] text-[#6b7280]">Passing threshold: 70%</span>
        </div>
        <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-[#6b7280] uppercase block">
            ATTENDANCE THROUGHPUT
          </span>
          <span className="text-3xl font-bold text-[#9e782f] block">68.7%</span>
          <span className="text-[11px] text-[#6b7280]">824 of 1,200 checked in</span>
        </div>
        <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-[#6b7280] uppercase block">
            FLAGGED ATTEMPTS
          </span>
          <span className="text-3xl font-bold text-red-600 block">4</span>
          <span className="text-[11px] text-red-600">3+ tab switches</span>
        </div>
      </div>

      {/* Question Difficulty Psychometrics Table */}
      <div className="rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
          <div>
            <h3 className="text-base font-bold text-[#0f172a]">
              Question Discrimination &amp; Success Rates
            </h3>
            <p className="text-xs text-[#6b7280]">
              Detect excessively easy questions (&gt;95%) or ambiguous questions (&lt;20%) for curriculum refinement.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] text-[10px] font-bold tracking-wider uppercase text-[#6b7280]">
              <tr>
                <th className="py-2.5 px-3">Question ID</th>
                <th className="py-2.5 px-3">Question Excerpt</th>
                <th className="py-2.5 px-3">Total Attempts</th>
                <th className="py-2.5 px-3">Correct Answers</th>
                <th className="py-2.5 px-3">Success Rate</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3">Psychometric Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f0e6]">
              {questionDifficultyData.map((q) => (
                <tr key={q.id} className="hover:bg-[#faf8f5]/50">
                  <td className="py-3 px-3 font-mono font-semibold text-[#064e3b]">{q.id}</td>
                  <td className="py-3 px-3 font-medium text-[#0f172a] max-w-sm">{q.text}</td>
                  <td className="py-3 px-3 tabular-nums">{q.attempts}</td>
                  <td className="py-3 px-3 tabular-nums text-[#064e3b] font-semibold">{q.correct}</td>
                  <td className="py-3 px-3 tabular-nums font-bold text-[#0f172a]">{q.rate}</td>
                  <td className="py-3 px-3">{q.difficulty}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
