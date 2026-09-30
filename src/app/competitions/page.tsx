'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { ArrowRight, Search, Award } from 'lucide-react';

export default function CompetitionsListingPage() {
  const { competitions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = competitions.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(competitions.map((c) => c.category)))];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-slate-900">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="outline" className="text-xs font-semibold px-3 py-1">
          Tournaments &amp; Contests
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Islamic Academic Competitions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Proctored examinations and adjudicated contests across Holy Quran recitation, Hadith mastery, and prophetic literature.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tournaments by keyword..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat.replace('-', ' ')}
            </button>
          ))}
        </div>
      </Card>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((comp) => {
          const quotaPercent = Math.min(100, Math.round((comp.enrolledCount / comp.maxParticipants) * 100));

          return (
            <Card
              key={comp.id}
              className="overflow-hidden flex flex-col justify-between hover:border-emerald-400 transition-all"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={comp.coverImage}
                  alt={comp.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <Badge variant="secondary" className="bg-white/95 text-slate-900 text-xs">
                    {comp.category}
                  </Badge>
                  <Badge variant="default" className="text-[10px]">
                    {comp.scoringMethod === 'automatic' ? 'Online Proctored' : 'Rubric Audited'}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {comp.title}
                  </h3>

                  {comp.arabicTitle && (
                    <p className="font-arabic text-sm text-emerald-800" dir="rtl">
                      {comp.arabicTitle}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {comp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Enrolled</span>
                    <span className="font-semibold text-slate-900">
                      {comp.enrolledCount} / {comp.maxParticipants}
                    </span>
                  </div>

                  <Progress value={quotaPercent} />

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <Link href={`/competitions/${comp.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Syllabus &amp; Rules
                      </Button>
                    </Link>

                    <Link
                      href={comp.format === 'online-quiz' ? `/test/${comp.id}` : `/competitions/${comp.id}`}
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full text-xs gap-1">
                        <span>{comp.format === 'online-quiz' ? 'Launch Exam' : 'Enter Contest'}</span>
                        <ArrowRight size={13} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
