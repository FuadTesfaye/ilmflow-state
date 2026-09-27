'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { FlowRegistrationModal } from '../components/registration/FlowRegistrationModal';
import { IslamicStarIcon } from '../components/common/IslamicPattern';
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Volume2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Check,
  Building,
  QrCode,
  FileCheck,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const { events, competitions } = useApp();
  const flagshipEvent = events[0];

  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedTicketTier, setSelectedTicketTier] = useState<string>('tkt-tier-general');
  const [activeZone, setActiveZone] = useState<'musalla' | 'mezzanine' | 'vip'>('musalla');

  const targetDate = new Date('2026-11-14T08:30:00Z').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 48,
    hours: 14,
    minutes: 32,
    seconds: 10
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleOpenRegistration = (tierId?: string) => {
    if (tierId) setSelectedTicketTier(tierId);
    setIsRegModalOpen(true);
  };

  const handleSelectZone = (zone: 'musalla' | 'mezzanine' | 'vip', tierId: string) => {
    setActiveZone(zone);
    setSelectedTicketTier(tierId);
  };

  const percentFilled = Math.min(
    100,
    Math.round((flagshipEvent.registeredCount / flagshipEvent.capacity) * 100)
  );

  return (
    <div className="w-full space-y-20 pb-24">
      {/* 1. HERO SECTION: Royal Architectural Editorial Header with Flow State Pass Allocator */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#e7e2d6] overflow-hidden">
        {/* Subtle Architectural Atmosphere Layer */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=2000"
            alt="Madinah Sanctuary"
            className="w-full h-full object-cover object-top opacity-10 filter saturate-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/80 via-[#faf8f5]/95 to-[#faf8f5]" />
        </div>

        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Monumental Proclamation */}
            <div className="lg:col-span-7 space-y-6">
              {/* Sovereign Accreditation Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#ffffff] border border-[#e7e2d6] shadow-xs text-xs text-[#064e3b]">
                <IslamicStarIcon size={14} className="text-[#9e782f]" />
                <span className="font-semibold tracking-[0.16em] uppercase text-[10px]">
                  CONVOCATION NO. 1448 • MADINAH SANCTUARY
                </span>
                <span className="text-[#d4ccbd]">•</span>
                <span className="text-[#6b7280] font-medium text-[11px]">
                  AZHARITE &amp; MADINAN ACCREDITED
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0f172a] leading-[1.04]">
                  The Global Quran &amp; Sunnah Summit <span className="text-[#9e782f]">2026</span>
                </h1>

                <p
                  className="font-arabic text-2xl sm:text-3xl text-[#9e782f] font-normal leading-relaxed pt-1"
                  dir="rtl"
                >
                  حِفْظُ التُّرَاثِ النَّبَوِيِّ الشَّرِيفِ: مَنْظُومَةُ الإِسْنَادِ وَالمُعَاصَرَةِ
                </p>
              </div>

              {/* Dignified Editorial Expository */}
              <p className="text-base text-[#475569] leading-relaxed max-w-2xl font-normal">
                The premier international convocation of senior Hadith authorities, certified Ten Qira’at reciters, and international researchers. Three days of rigorous academic discourse, oral competitions, and live adjudication at the Cultural Palace in Al-Madinah Al-Munawwarah.
              </p>

              {/* Convocational Metadata Trio */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#e7e2d6] text-xs">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#6b7280] uppercase block">
                    CONVOCATION DATES
                  </span>
                  <span className="font-semibold text-[#0f172a] mt-1 block">
                    November 14–16, 2026
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#6b7280] uppercase block">
                    CONVENED AT
                  </span>
                  <span className="font-semibold text-[#0f172a] mt-1 block">
                    Al-Mihrab Sanctuary Palace
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#6b7280] uppercase block">
                    ACCREDITATION
                  </span>
                  <span className="font-semibold text-[#064e3b] mt-1 block">
                    Azharite &amp; Madinan Board
                  </span>
                </div>
              </div>

              {/* Horological Hijri Countdown Ribbon */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs">
                  <Clock size={16} className="text-[#9e782f]" />
                  <span className="text-xs font-semibold text-[#6b7280]">Starts in:</span>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#0f172a]">
                    <span className="px-1.5 py-0.5 rounded bg-[#f4f0e6] text-[#064e3b]">
                      {timeLeft.days}d
                    </span>
                    <span>:</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#f4f0e6] text-[#064e3b]">
                      {timeLeft.hours}h
                    </span>
                    <span>:</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#f4f0e6] text-[#064e3b]">
                      {timeLeft.minutes}m
                    </span>
                    <span>:</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#f4f0e6] text-[#064e3b]">
                      {timeLeft.seconds}s
                    </span>
                  </div>
                </div>

                <Link
                  href="/schedule"
                  className="text-xs font-semibold text-[#064e3b] hover:text-[#043c2e] hover:underline flex items-center gap-1"
                >
                  <span>View 3-Day Program Agenda</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Column: Flow State Interactive Pass Allocator Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.08)] p-7 space-y-6 relative overflow-hidden">
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#064e3b]" />

                {/* Live Status Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#e7e2d6]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                    <span className="text-[11px] font-bold tracking-[0.12em] text-[#064e3b] uppercase">
                      LIVE PASS ALLOCATOR
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#6b7280] bg-[#faf8f5] px-2.5 py-0.5 rounded-full border border-[#e7e2d6]">
                    CAPACITY: {flagshipEvent.capacity}
                  </span>
                </div>

                {/* Progress Metric */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold text-[#0f172a] tabular-nums tracking-tight">
                      {flagshipEvent.registeredCount}{' '}
                      <span className="text-sm font-normal text-[#6b7280]">
                        / {flagshipEvent.capacity} Claimed
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-[#064e3b] tabular-nums">
                      {percentFilled}% Filled
                    </span>
                  </div>

                  <div className="w-full bg-[#f4f0e6] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#e7e2d6]">
                    <div
                      className="bg-[#064e3b] h-full rounded-full transition-all duration-700"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-[#6b7280]">
                    <span>Official gate reservations active</span>
                    <span className="text-[#9e782f] font-semibold">
                      {flagshipEvent.capacity - flagshipEvent.registeredCount} seats remaining
                    </span>
                  </div>
                </div>

                {/* Sanctuary Seating Tier Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#6b7280] uppercase block">
                    SELECT SANCTUARY DELEGATION TIER
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: 'musalla',
                        tierId: 'tkt-tier-general',
                        label: 'Musalla',
                        badge: 'General',
                        price: 'Free'
                      },
                      {
                        id: 'mezzanine',
                        tierId: 'tkt-tier-academic',
                        label: 'Mezzanine',
                        badge: 'Academic',
                        price: '$45'
                      },
                      {
                        id: 'vip',
                        tierId: 'tkt-tier-patron',
                        label: 'Majlis',
                        badge: 'Patron',
                        price: '$150'
                      }
                    ].map((zone) => (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => handleSelectZone(zone.id as any, zone.tierId)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          activeZone === zone.id
                            ? 'bg-[#f4f0e6] border-[#064e3b] text-[#0f172a] shadow-xs ring-1 ring-[#064e3b]'
                            : 'bg-[#faf8f5] border-[#e7e2d6] text-[#6b7280] hover:border-[#9e782f]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold tracking-wider text-[#9e782f] uppercase block">
                            {zone.badge}
                          </span>
                          <span className="text-[10px] font-semibold text-[#064e3b]">
                            {zone.price}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#0f172a] block mt-1">
                          {zone.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Action Trigger */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleOpenRegistration(selectedTicketTier)}
                    className="w-full py-3.5 rounded-xl bg-[#064e3b] text-[#ffffff] font-semibold text-sm hover:bg-[#043c2e] transition-all flex items-center justify-center gap-2 shadow-md group cursor-pointer"
                  >
                    <span>Proceed to Flow Registration</span>
                    <ArrowRight
                      size={16}
                      className="text-[#d4a94b] group-hover:translate-x-1 transition-transform"
                    />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#6b7280] pt-1">
                    <QrCode size={13} className="text-[#064e3b]" />
                    <span>Instant cryptographic QR pass &amp; delegate lanyard issued.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL METRICS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#6b7280] uppercase block">
              CONFIRMED DELEGATES
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#0f172a] block tabular-nums tracking-tight">
              1,114
            </span>
            <span className="text-xs text-[#475569]">Across 38 sovereign nations</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#6b7280] uppercase block">
              SCHOLARLY FACULTY
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#064e3b] block tabular-nums tracking-tight">
              24
            </span>
            <span className="text-xs text-[#475569]">Accredited Grand Muqri’een</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#6b7280] uppercase block">
              MUTAWATIR QIRA’AT
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#9e782f] block tabular-nums tracking-tight">
              10
            </span>
            <span className="text-xs text-[#475569]">Traditional recitation chains</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#6b7280] uppercase block">
              WAQF PRIZE ENDOWMENT
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#10b981] block tabular-nums tracking-tight">
              $28,500
            </span>
            <span className="text-xs text-[#475569]">In merit &amp; research awards</span>
          </div>
        </div>
      </section>

      {/* 3. SYNCHRONIZED SALAH & PROGRAM TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#e7e2d6]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#064e3b]" />
              <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
                SACRED RHYTHM
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
              Program Architecture Synced with Congregational Salah
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6b7280]">
            <Clock size={14} className="text-[#9e782f]" />
            <span>Madinah Astronomical Coordinates • Umm al-Qura Standard</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              prayer: 'Fajr',
              time: flagshipEvent.prayerTimes.fajr,
              title: 'Adhkar Circle & Sanad Recitations',
              hall: 'Grand Sanctuary Musalla',
              isNext: false
            },
            {
              prayer: 'Dhuhr',
              time: flagshipEvent.prayerTimes.dhuhr,
              title: 'Communal Sunnah Luncheon',
              hall: 'Sanctuary Courtyard',
              isNext: false
            },
            {
              prayer: 'Asr',
              time: flagshipEvent.prayerTimes.asr,
              title: 'Hadith Methodology Plenary',
              hall: 'Imam Malik Auditorium',
              isNext: true
            },
            {
              prayer: 'Maghrib',
              time: flagshipEvent.prayerTimes.maghrib,
              title: 'Ten Qira’at Showcase',
              hall: 'Imam Malik Auditorium',
              isNext: false
            },
            {
              prayer: 'Isha',
              time: flagshipEvent.prayerTimes.isha,
              title: 'Scholarly Majlis & Adjudication',
              hall: 'Al-Andalus Seminar Wing',
              isNext: false
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border space-y-2 text-left transition-all ${
                item.isNext
                  ? 'bg-[#ffffff] border-[#064e3b] shadow-md ring-2 ring-[#064e3b]/20'
                  : 'bg-[#ffffff] border-[#e7e2d6] shadow-xs hover:border-[#064e3b]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider">
                    {item.prayer}
                  </span>
                  {item.isNext && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#064e3b] text-[#ffffff]">
                      Upcoming
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs font-semibold text-[#0f172a]">{item.time}</span>
              </div>
              <h4 className="text-xs font-bold text-[#0f172a] leading-snug">{item.title}</h4>
              <span className="text-[11px] text-[#6b7280] block">{item.hall}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPETITIONS & OBJECTIVE TESTS ENGINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e7e2d6]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#064e3b]" />
              <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
                ADJUDICATED TOURNAMENTS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
              International Competition Categories
            </h2>
            <p className="text-xs text-[#6b7280]">
              Rigorous examinations featuring objective auto-grading, tab-monitoring anti-cheating, and 100-point rubric Qira’at evaluations.
            </p>
          </div>

          <Link
            href="/competitions"
            className="text-xs font-semibold text-[#064e3b] hover:underline flex items-center gap-1.5"
          >
            <span>View All Competition Criteria</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className="rounded-3xl bg-[#ffffff] border border-[#e7e2d6] hover:border-[#064e3b]/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Visual Photography Header */}
              <div className="relative h-44 w-full overflow-hidden bg-[#f4f0e6]">
                <img
                  src={comp.coverImage}
                  alt={comp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-[#ffffff]/90 backdrop-blur-xs text-[#064e3b]">
                    {comp.category}
                  </span>
                  <span className="text-[10px] font-semibold text-[#ffffff] bg-[#000000]/40 backdrop-blur-xs px-2 py-0.5 rounded">
                    {comp.scoringMethod === 'automatic' ? 'Online Proctored' : 'Rubric Audited'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-bold text-[#d4a94b] tracking-wider uppercase">
                    LAUREATE PRIZE
                  </span>
                  <p className="text-xs font-bold text-[#ffffff] truncate">
                    {comp.prizes[0]?.award}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#0f172a] leading-snug group-hover:text-[#064e3b] transition-colors">
                    {comp.title}
                  </h3>
                  {comp.arabicTitle && (
                    <p className="font-arabic text-sm text-[#9e782f]" dir="rtl">
                      {comp.arabicTitle}
                    </p>
                  )}
                  <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                    {comp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e7e2d6] space-y-3">
                  <div className="flex justify-between items-center text-xs text-[#6b7280]">
                    <span>Enrollment Quota</span>
                    <span className="font-semibold text-[#0f172a]">
                      {comp.enrolledCount} / {comp.maxParticipants} Registered
                    </span>
                  </div>

                  <div className="w-full bg-[#f4f0e6] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#064e3b] h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((comp.enrolledCount / comp.maxParticipants) * 100))}%`
                      }}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <Link
                      href={`/competitions/${comp.id}`}
                      className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#475569] hover:text-[#0f172a] hover:border-[#9e782f]/50 transition-all flex items-center gap-1"
                    >
                      <span>Syllabus &amp; Rules</span>
                    </Link>

                    <Link
                      href={comp.format === 'online-quiz' ? `/test/${comp.id}` : `/competitions/${comp.id}`}
                      className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] hover:bg-[#043c2e] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{comp.format === 'online-quiz' ? 'Launch Exam' : 'Submit Work'}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DISTINGUISHED FACULTY & KEYNOTE QARIS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1 pb-4 border-b border-[#e7e2d6]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#064e3b]" />
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
              ADJUDICATION BENCH
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
            Senior Scholars &amp; Recitation Authorities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flagshipEvent.speakers.map((spk) => (
            <div
              key={spk.id}
              className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs flex items-start gap-4 hover:border-[#064e3b]/40 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#f4f0e6] border border-[#e7e2d6] overflow-hidden shrink-0">
                <img src={spk.avatar} alt={spk.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="text-base font-bold text-[#0f172a] truncate">{spk.name}</h4>
                <p className="text-xs text-[#064e3b] font-semibold">{spk.title}</p>
                <p className="text-[11px] text-[#6b7280]">{spk.organization}</p>
                <p className="text-xs text-[#475569] line-clamp-2 pt-1">{spk.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ETHICAL PROTOCOLS & CHILD SAFEGUARDING */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#064e3b]">
            <ShieldCheck size={18} className="text-[#064e3b]" />
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase">
              SANCTUARY CODE OF ETHICS &amp; SAFEGUARDING CHARTER
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#475569] leading-relaxed">
            <div className="space-y-1">
              <h5 className="font-bold text-[#0f172a]">Minor Protection Standard</h5>
              <p>
                Competitors under 18 years require verifiable parental or legal guardian consent before taking tests or entering recitation rounds.
              </p>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-[#0f172a]">Modest Decorum &amp; Seating</h5>
              <p>
                Respecting Islamic tradition with dignified attire and designated segregated halls for prayer and audience seating.
              </p>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-[#0f172a]">Tamper-Evident Credentials</h5>
              <p>
                All certificates carry cryptographic SHA-256 validation hashes permanently verifiable via our public academic registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flow State Registration Modal */}
      <FlowRegistrationModal
        event={flagshipEvent}
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        preselectedTicketId={selectedTicketTier}
      />
    </div>
  );
}
