'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MapPin, Clock, Calendar } from 'lucide-react';

export default function SchedulePage() {
  const { events } = useApp();
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 text-slate-900">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="text-xs font-semibold px-3 py-1">
          Conference Agenda
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Program Schedule
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Plenary lectures, oral recitations, and panel discussions synchronized with congregational Salah breaks.
        </p>
      </div>

      {/* Event Selector Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {events.map((ev) => (
          <button
            key={ev.id}
            onClick={() => setSelectedEventId(ev.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeEvent.id === ev.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            {ev.title}
          </button>
        ))}
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-4">
        {activeEvent?.schedule.map((session) => (
          <Card
            key={session.id}
            className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              session.isPrayerBreak
                ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20'
                : 'hover:border-slate-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-700 font-semibold font-mono bg-slate-100 px-2.5 py-1 rounded-md">
                  {session.startTime} – {session.endTime}
                </span>
                {session.isPrayerBreak && (
                  <Badge variant="default" className="text-[10px]">
                    Congregational Salah Break
                  </Badge>
                )}
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-900">{session.title}</h4>
              {session.speaker && (
                <p className="text-xs text-emerald-800 font-medium">Speaker: {session.speaker}</p>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 font-medium">
              <MapPin size={14} className="text-slate-400" />
              <span>{session.location}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
