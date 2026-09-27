'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IslamicStarIcon } from '../../components/common/IslamicPattern';
import { Clock, MapPin, Calendar, Compass } from 'lucide-react';

export default function SchedulePage() {
  const { events } = useApp();
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 select-none text-[#111827]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#064e3b] shadow-xs">
          <IslamicStarIcon size={13} className="text-[#9e782f]" />
          <span className="meta-tag font-bold">PROGRAM CALENDAR</span>
        </div>
        <h1 className="text-3xl sm:text-5xl text-[#0f172a] font-bold tracking-tight">
          Synchronized Session Schedule
        </h1>
        <p className="text-xs sm:text-sm text-[#475569]">
          Academic lectures, Qira’at recitals, and research panels structured around congregational Salah.
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
                ? 'bg-[#064e3b] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4b5563] border border-[#e7e2d6] hover:text-[#111827]'
            }`}
          >
            {ev.title}
          </button>
        ))}
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-4">
        {activeEvent.schedule.map((session) => (
          <div
            key={session.id}
            className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] ${
              session.isPrayerBreak
                ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                : 'bg-[#ffffff] border-[#e7e2d6]'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#064e3b] font-bold bg-[#faf8f5] px-2.5 py-0.5 rounded-lg border border-[#e7e2d6]">
                  {session.startTime} – {session.endTime}
                </span>
                {session.isPrayerBreak && (
                  <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] font-bold">
                    CONGREGATIONAL SALAH
                  </span>
                )}
              </div>

              <h4 className="text-base font-bold text-[#0f172a]">{session.title}</h4>
              {session.speaker && (
                <p className="text-xs text-[#064e3b] font-medium">Keynote Scholar: {session.speaker}</p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#6b7280] shrink-0">
              <MapPin size={15} className="text-[#9e782f]" />
              <span className="font-medium">{session.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
