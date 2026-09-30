'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table';
import { BarChart3, ArrowLeft } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const questionDifficultyData = [
    {
      id: 'q-hadith-1',
      text: 'Monumental Sahih Collection by Imam Muhammad ibn Isma\'il al-Bukhari',
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Psychometrics &amp; Exam Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Statistical item discrimination and psychometric difficulty curves across tournament question banks.
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft size={14} />
            <span>Back to Admin</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Avg Test Score
          </span>
          <span className="text-3xl font-extrabold text-slate-900 block tabular-nums">82.4%</span>
          <span className="text-xs text-emerald-600 font-medium">+3.2% vs previous cohort</span>
        </Card>
        <Card className="p-5 space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Pass Rate
          </span>
          <span className="text-3xl font-extrabold text-emerald-700 block tabular-nums">74.6%</span>
          <span className="text-xs text-slate-500">Threshold: 70%</span>
        </Card>
        <Card className="p-5 space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Check-In Rate
          </span>
          <span className="text-3xl font-extrabold text-slate-900 block tabular-nums">68.7%</span>
          <span className="text-xs text-slate-500">824 of 1,200</span>
        </Card>
        <Card className="p-5 space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Flagged Attempts
          </span>
          <span className="text-3xl font-extrabold text-red-600 block tabular-nums">4</span>
          <span className="text-xs text-red-600">3+ tab switches</span>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100">
          <CardTitle className="text-base">Question Success Rates</CardTitle>
          <CardDescription className="text-xs">
            Identify excessively easy (&gt;95%) or ambiguous (&lt;20%) questions for syllabus refinement.
          </CardDescription>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item ID</TableHead>
              <TableHead>Question Item</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Correct</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Psychometric State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questionDifficultyData.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-mono text-xs text-slate-600">{q.id}</TableCell>
                <TableCell className="font-medium text-slate-900 max-w-sm">{q.text}</TableCell>
                <TableCell className="font-mono text-xs">{q.attempts}</TableCell>
                <TableCell className="font-mono text-xs font-semibold text-slate-900">{q.correct}</TableCell>
                <TableCell className="font-mono text-xs font-bold text-emerald-800">{q.rate}</TableCell>
                <TableCell className="text-xs text-slate-600 capitalize">{q.difficulty}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="success" className="text-[10px]">
                    {q.status}
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
