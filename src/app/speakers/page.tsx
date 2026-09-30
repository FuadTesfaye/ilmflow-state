'use client';

import React from 'react';
import { INITIAL_SPEAKERS } from '../../data/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { CheckCircle } from 'lucide-react';

export default function SpeakersPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-slate-900">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="outline" className="text-xs font-semibold px-3 py-1">
          Faculty &amp; Judges
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Senior Scholars &amp; Reciters
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Eminent Hadith researchers, Qira’at reciters, and professors presiding over plenaries and judging rounds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_SPEAKERS.map((spk) => (
          <Card
            key={spk.id}
            className="p-6 flex flex-col sm:flex-row items-start gap-6 hover:border-emerald-300 transition-colors"
          >
            <Avatar
              src={spk.avatar}
              alt={spk.name}
              fallback={spk.name}
              className="w-20 h-20 shrink-0 border-2 border-emerald-100"
            />

            <div className="space-y-2 flex-1 min-w-0">
              <Badge variant="secondary" className="text-xs">
                {spk.organization}
              </Badge>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {spk.name}
                </h3>
                <CheckCircle size={15} className="text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-emerald-700 font-semibold">{spk.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">{spk.bio}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
