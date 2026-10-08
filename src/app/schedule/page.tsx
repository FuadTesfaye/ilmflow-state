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
    <div className="page-enter min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-10 text-slate-900">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="text-xs font-semibold px-3 py-1 text-[#135B3E] border-emerald-200 bg-emerald-50">
          Conference Agenda
        </Badge>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          Program Schedule
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          Plenary lectures, oral recitations, and panel discussions synchronized with congregational Salah breaks.
        </p>
      </div>

      {/* Event Selector Chips (Horizontally Scrollable on Mobile with Smooth Drag) */}
      <div className="w-full overflow-x-auto hide-scrollbar pb-2">
        <div className="flex items-center sm:justify-center gap-2 min-w-max px-1">
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeEvent.id === ev.id
                  ? 'bg-[#135B3E] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {ev.title}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-3.5 sm:space-y-4">
        {activeEvent?.schedule && activeEvent.schedule.length > 0 ? (
          activeEvent.schedule.map((session) => (
            <Card
              key={session.id}
              className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all ${
                session.isPrayerBreak
                  ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] sm:text-xs text-slate-700 font-semibold font-mono bg-slate-100 px-2.5 py-1 rounded-md">
                    {session.startTime} – {session.endTime}
                  </span>
                  {session.isPrayerBreak && (
                    <Badge variant="default" className="text-[10px] bg-[#135B3E] text-white">
                      Congregational Salah Break
                    </Badge>
                  )}
                </div>

                <h4 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 leading-snug">
                  {session.title}
                </h4>
                {session.speaker && (
                  <p className="text-xs text-[#135B3E] font-medium">Speaker: {session.speaker}</p>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 font-medium pt-1 sm:pt-0">
                <MapPin size={14} className="text-[#135B3E]" />
                <span>{session.location}</span>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center bg-white border-slate-200">
            <p className="text-xs sm:text-sm text-slate-500">
              Session agenda is being finalized by the organizing committee. Check back shortly.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
