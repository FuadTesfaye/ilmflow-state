'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { IslamicStarEmblem } from '../common/IslamicPattern';
import { Clock, Compass, Bell, Volume2, Sparkles, MapPin } from 'lucide-react';

interface PrayerTime {
  id: string;
  name: string;
  arabic: string;
  time: string;
  iqamah: string;
  hour: number;
  minute: number;
}

const PRAYERS: PrayerTime[] = [
  { id: 'fajr', name: 'Fajr', arabic: 'الفجر', time: '05:32 AM', iqamah: '06:00 AM', hour: 5, minute: 32 },
  { id: 'shuruq', name: 'Sunrise', arabic: 'الشروق', time: '06:48 AM', iqamah: '—', hour: 6, minute: 48 },
  { id: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر', time: '12:45 PM', iqamah: '01:15 PM', hour: 12, minute: 45 },
  { id: 'asr', name: 'Asr', arabic: 'العصر', time: '04:12 PM', iqamah: '04:30 PM', hour: 16, minute: 12 },
  { id: 'maghrib', name: 'Maghrib', arabic: 'المغرب', time: '06:38 PM', iqamah: '06:48 PM', hour: 18, minute: 38 },
  { id: 'isha', name: 'Isha', arabic: 'العشاء', time: '07:54 PM', iqamah: '08:15 PM', hour: 19, minute: 54 }
];

interface PrayerTimeWidgetProps {
  compact?: boolean;
  className?: string;
}

export const PrayerTimeWidget: React.FC<PrayerTimeWidgetProps> = ({
  compact = false,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(2); // Dhuhr default
  const [timeUntilNext, setTimeUntilNext] = useState<string>('00:00:00');

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      // Find next prayer
      let nextIdx = PRAYERS.findIndex((p) => p.hour * 60 + p.minute > nowMinutes);
      if (nextIdx === -1) nextIdx = 0; // Wraps around to Fajr next day
      setNextPrayerIndex(nextIdx);

      // Countdown
      const targetPrayer = PRAYERS[nextIdx];
      let diffMinutes = targetPrayer.hour * 60 + targetPrayer.minute - nowMinutes;
      if (diffMinutes < 0) diffMinutes += 24 * 60;

      const hrs = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      const secs = 60 - now.getSeconds();
      setTimeUntilNext(
        `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs < 60 ? `${secs}s` : ''}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const nextPrayer = PRAYERS[nextPrayerIndex];

  if (compact) {
    return (
      <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs ${className}`}>
        <div className="flex items-center gap-1.5 font-semibold text-[#135B3E]">
          <Clock size={13} className="text-[#135B3E] animate-pulse" />
          <span>Next: {nextPrayer.name}</span>
        </div>
        <span className="text-slate-400">•</span>
        <span className="font-mono text-[11px] text-emerald-950 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200/50">
          {timeUntilNext}
        </span>
      </div>
    );
  }

  return (
    <Card className={`p-4 sm:p-5 bg-white border-slate-200 shadow-xs relative overflow-hidden ${className}`}>
      {/* Subtle Ambient Emerald Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#135B3E]">
            <IslamicStarEmblem size={17} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              Congregational Prayer Times
            </h3>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <MapPin size={11} className="text-[#135B3E]" />
              Masjid Al-Nabi • West Covina Campus (Adhan Sync)
            </p>
          </div>
        </div>

        {/* Next Prayer Highlight Pill */}
        <div className="flex items-center gap-2 bg-[#135B3E]/10 border border-[#135B3E]/20 px-3 py-1.5 rounded-xl text-xs text-[#135B3E] self-start sm:self-auto">
          <Clock size={13} className="animate-spin text-[#135B3E]" style={{ animationDuration: '8s' }} />
          <span>Next: <strong className="font-bold">{nextPrayer.name}</strong> in {timeUntilNext}</span>
        </div>
      </div>

      {/* Prayer Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-4">
        {PRAYERS.map((prayer, idx) => {
          const isNext = idx === nextPrayerIndex;

          return (
            <div
              key={prayer.id}
              className={`p-3 rounded-xl border text-center transition-all ${
                isNext
                  ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/20'
                  : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {prayer.name}
                </span>
                <span className="font-arabic text-xs text-slate-400 font-semibold" dir="rtl">
                  {prayer.arabic}
                </span>
              </div>

              <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                {prayer.time}
              </div>

              <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-slate-500">
                <span className="text-slate-400">Iqamah:</span>
                <span className="font-semibold text-emerald-800">{prayer.iqamah}</span>
              </div>

              {isNext && (
                <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Upcoming
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info / Qibla */}
      <div className="relative z-10 mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Compass size={13} className="text-[#9E782F]" />
          <span>Qibla Direction: <strong>18.4° NNE</strong> from Southern California</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>Calculation: ISNA (North America) • Asr: Hanafi/Shafi&apos;i</span>
        </div>
      </div>
    </Card>
  );
};
