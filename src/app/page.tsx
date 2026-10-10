'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useApp } from '../context/AppContext';

const FlowRegistrationModal = dynamic(
  () => import('../components/registration/FlowRegistrationModal').then((mod) => mod.FlowRegistrationModal),
  { ssr: false }
);

import { IslamicShaderBackground, ShaderVariant } from '../components/shaders/IslamicShaderBackground';
import {
  ArabicCalligraphyGutter,
  HeroMosqueIllustration,
  SunriseLandscapeGraphic,
  ArabesqueCornerOrnament,
  ArabesqueGeometricBackdrop
} from '../components/common/IslamicPattern';
import {
  Calendar,
  BookOpen,
  Heart,
  Users,
  Building,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  MapPin,
  ArrowUp,
  X,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const { events, addToast } = useApp();
  const flagshipEvent = events[0] || {
    id: 'evt-summit-2026',
    title: 'Weekly Community Assembly & Dua Kumayl',
    capacity: 1200,
    registeredCount: 1114,
    prayerTimes: {
      nextPrayer: 'Asr',
      asr: '04:30 PM',
      timeRemaining: '1h 24m'
    },
    speakers: []
  };

  // State management for modals, sliders, and interactivity
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Hero carousel slide
  const [heroSlide, setHeroSlide] = useState(0);

  // Quote carousel slide
  const [quoteSlide, setQuoteSlide] = useState(0);

  // Upcoming lecture carousel
  const [lectureSlide, setLectureSlide] = useState(0);

  // City selection for prayer times
  const [selectedCity, setSelectedCity] = useState<'West Covina, California' | 'Madinah, Saudi Arabia'>('West Covina, California');

  // Newsletter email state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Donation state
  const [donationAmount, setDonationAmount] = useState<number | string>(100);
  const [donationFrequency, setDonationFrequency] = useState<'one-time' | 'monthly'>('one-time');

  // Scroll to top visibility & live section tracking
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [shaderAmbiance, setShaderAmbiance] = useState<ShaderVariant>('ambient');
  const [activeSection, setActiveSection] = useState<string>('hero');

  const shaderLabels: Record<string, string> = {
    ambient: 'Serene Mint',
    sage: 'Meadow Sage',
    dawn: 'Fajr Dawn',
    aurora: 'Midnight Aurora'
  };

  useEffect(() => {
    const sectionIds = ['hero', 'quick-links', 'prayer-times', 'events', 'quote', 'gallery', 'donate'];
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const scrollPosition = window.scrollY + 220;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quotes dataset
  const quotes = [
    {
      text: 'Wake up knowing that Allah is Greater than any obstacle you may face today',
      speaker: 'Mūsā al-Kāzim, (Speaker)',
      location: 'Mashhad, Iran',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
    },
    {
      text: 'Acquiring sacred knowledge is an act of worship; contemplating it is a glorification of God.',
      speaker: 'Shaykh Dr. Abdur-Rahman Al-Badr',
      location: 'Madinah Al-Munawwarah',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'
    },
    {
      text: 'The best among you are those who learn the Quran and teach it to others.',
      speaker: 'Qari Muhammad Tariq Al-Azhari',
      location: 'Cairo, Egypt',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    }
  ];

  // Upcoming lectures dataset
  const upcomingLectures = [
    {
      title: 'The Ten Most Common Misconceptions about Islam',
      date: 'Feb 26, 2026',
      speaker: 'Shaykh Ahmad Al-Mansoor',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Etiquette of the Seeker of Sacred Knowledge',
      date: 'March 2, 2026',
      speaker: 'Dr. Maryam bint Sultan',
      image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Mastery of Quranic Tajweed & Makharij',
      date: 'March 8, 2026',
      speaker: 'Qari Muhammad Tariq',
      image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&q=80&w=600'
    }
  ];

  // Events list matching Dribbble
  const eventRows = [
    {
      id: 'evt-dua-tawwasul',
      dateMonth: 'Feb 22',
      dayOfWeek: 'Tues',
      title: 'Dua Tawwasul & Spiritual Halaqa',
      timeAndLocation: '5:30 pm, Convention City Bashundhara',
      isPrimaryAction: false
    },
    {
      id: 'evt-dua-kumayl',
      dateMonth: 'Feb 23',
      dayOfWeek: 'Thurs',
      title: 'Dua Kumayl & Community Dinner',
      timeAndLocation: '5:30 pm, Balishira Resort & West Covina',
      isPrimaryAction: true
    },
    {
      id: 'evt-jumuah-assembly',
      dateMonth: 'Feb 24',
      dayOfWeek: 'Fri',
      title: "Salat al-Jumu'a & Weekly Khutbah",
      timeAndLocation: '1:30 pm, Convention City & Main Musalla',
      isPrimaryAction: false
    },
    {
      id: 'evt-summit-2026',
      dateMonth: 'Feb 25',
      dayOfWeek: 'Satur',
      title: 'Weekly Community Assembly',
      timeAndLocation: '5:30 pm, Balishira Resort',
      isPrimaryAction: false
    }
  ];

  // Prayer times dataset
  const prayerSchedule = selectedCity === 'West Covina, California'
    ? [
        { name: 'FAJR', time: '5:00am', icon: Sunrise, active: false },
        { name: 'ZUHR', time: '1:30pm', icon: Sun, active: false },
        { name: 'ASR', time: '4:30pm', icon: Sun, active: true },
        { name: 'MAGHRIB', time: '6:00pm', icon: Sunset, active: false },
        { name: 'ISHA', time: '8:00pm', icon: Moon, active: false }
      ]
    : [
        { name: 'FAJR', time: '5:08am', icon: Sunrise, active: false },
        { name: 'ZUHR', time: '12:18pm', icon: Sun, active: false },
        { name: 'ASR', time: '3:42pm', icon: Sun, active: true },
        { name: 'MAGHRIB', time: '6:12pm', icon: Sunset, active: false },
        { name: 'ISHA', time: '7:42pm', icon: Moon, active: false }
      ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'info');
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setNewsletterEmail('');
      addToast('Thank you! You are now subscribed to Hejrat Foundation updates.', 'success');
    }, 500);
  };

  const handleDonateConfirm = () => {
    setIsDonateModalOpen(false);
    addToast(`JazakAllah Khair! Your donation of $${donationAmount} (${donationFrequency}) was processed successfully.`, 'success');
  };

  const currentLecture = upcomingLectures[lectureSlide];
  const currentQuote = quotes[quoteSlide];

  return (
    <div className="page-enter relative w-full overflow-hidden text-slate-800 font-sans min-h-screen">
      {/* Skip to Main Content Link for Keyboard and Screen-Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#135B3E] focus:text-white focus:rounded-xl focus:shadow-xl focus:font-semibold focus:text-xs"
      >
        Skip to main content
      </a>

      {/* 1. IMPRESSIVE LIVING ISLAMIC BACKGROUND SHADER (FIXED CANVAS - FAST 60FPS, NOT BLANK WHITE) */}
      <IslamicShaderBackground
        type="mesh"
        variant={shaderAmbiance}
        speed={0.06}
        distortion={0.42}
        swirl={0.32}
        fixed={true}
        opacity={0.92}
      />

      {/* Delicate Islamic 8-Point Star Geometric Lattice Overlay (Authentic architectural texture, zero blur) */}
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#135b3e_1.5px,transparent_1.5px)] [background-size:24px_24px] -z-0" />

      {/* Subtle Atmospheric Vignette */}
      <div className="fixed inset-0 bg-radial from-transparent via-transparent to-[#135b3e]/[0.05] pointer-events-none -z-0" />

      {/* Subtle Ambient Arabic Calligraphy Side Watermarks */}
      <ArabicCalligraphyGutter side="left" />
      <ArabicCalligraphyGutter side="right" />

      {/* Main Container */}
      <div id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-32 space-y-16 sm:space-y-24 relative z-10">

        {/* 1. HERO BANNER: EXACT CLONE OF DRIBBLE HERO WITH LIVING ISLAMIC WARP SILK SHADER */}
        <section
          id="hero"
          className="relative w-full rounded-[28px] sm:rounded-[36px] bg-[#0c4427] overflow-hidden shadow-[0_24px_55px_rgba(19,91,62,0.28)] border border-emerald-400/25"
        >
          {/* Living Islamic Warp Silk Shader inside the Hero Banner */}
          <IslamicShaderBackground
            type="warp"
            variant="aurora"
            speed={0.08}
            distortion={0.35}
            swirl={0.4}
            opacity={0.65}
            className="rounded-[28px] sm:rounded-[36px]"
          />

          {/* Architectural Arabesque vignette & glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#072d1a]/85 via-[#0b3e24]/70 to-[#062415]/80 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-6 sm:p-12 lg:p-16 text-white min-h-[460px] sm:min-h-[520px]">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                  Are you ready to start learning?
                </h1>
                <p className="text-emerald-100/90 text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed font-normal">
                  We strive to congregate at least once a week to discuss, share, and learn.
                </p>
              </div>

              {/* Action Buttons: White Pill "Read More" & Outline Pill "Get Involved" */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <button
                  onClick={() => setIsReadMoreOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-white text-[#135B3E] font-semibold text-xs sm:text-sm shadow-md hover:bg-emerald-50 hover:shadow-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
                >
                  Read More
                </button>
                <button
                  onClick={() => setIsRegModalOpen(true)}
                  className="px-8 py-3.5 rounded-full border border-white/80 text-white font-semibold text-xs sm:text-sm hover:bg-white/10 hover:border-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
                >
                  Get Involved
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="flex items-center gap-2 pt-4">
                {[0, 1, 2, 3].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroSlide(idx)}
                    className={`h-2 transition-all rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-white ${
                      heroSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Architectural Masjid Illustration */}
            <div className="lg:col-span-6 flex items-center justify-center relative min-h-[340px] sm:min-h-[380px]">
              <div className="relative z-10 w-full max-w-[480px] transform hover:scale-[1.02] transition-transform duration-500 drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
                <HeroMosqueIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* 2. QUICK LINKS: EXACT CLONE */}
        <section className="space-y-6" id="quick-links">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Quick Links
            </h2>
            <Link href="/events" className="focus-visible:ring-2 rounded-full">
              <span className="px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 text-[#135B3E] text-xs font-semibold hover:bg-emerald-50 transition-colors shadow-2xs">
                Show all
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. News/Blog */}
            <Link
              href="/#news"
              className="group p-5 rounded-2xl bg-white/95 border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-3 min-h-[145px] focus-visible:ring-2"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-700 group-hover:text-[#135B3E] transition-colors">
                <FileText size={22} />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#135B3E] transition-colors">
                News/Blog
              </span>
            </Link>

            {/* 2. Educational Content (Highlighted in Dribbble) */}
            <Link
              href="/competitions"
              className="group p-5 rounded-2xl bg-emerald-50/60 backdrop-blur-md border-2 border-[#135B3E]/30 hover:border-[#135B3E] shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-2 min-h-[145px] focus-visible:ring-2"
            >
              <div className="w-11 h-11 rounded-xl bg-[#135B3E]/10 flex items-center justify-center text-[#135B3E]">
                <BookOpen size={22} />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#135B3E] block">
                  Educational Content
                </span>
                <span className="text-[11px] font-semibold text-[#135B3E]/80 group-hover:underline block">
                  View Details
                </span>
              </div>
            </Link>

            {/* 3. Events */}
            <Link
              href="/events"
              className="group p-5 rounded-2xl bg-white/95 border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-3 min-h-[145px] focus-visible:ring-2"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-700 group-hover:text-[#135B3E] transition-colors">
                <Calendar size={22} />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#135B3E] transition-colors">
                Events
              </span>
            </Link>

            {/* 4. Donate */}
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="group p-5 rounded-2xl bg-white/95 border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-3 min-h-[145px] cursor-pointer focus-visible:ring-2"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-700 group-hover:text-[#135B3E] transition-colors">
                <Heart size={22} />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#135B3E] transition-colors">
                Donate
              </span>
            </button>

            {/* 5. Services */}
            <Link
              href="/schedule"
              className="group p-5 rounded-2xl bg-white/95 border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-3 min-h-[145px] focus-visible:ring-2"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-700 group-hover:text-[#135B3E] transition-colors">
                <Building size={22} />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#135B3E] transition-colors">
                Services
              </span>
            </Link>

            {/* 6. Get Involved */}
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="group p-5 rounded-2xl bg-white/95 border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-3 min-h-[145px] cursor-pointer focus-visible:ring-2"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-700 group-hover:text-[#135B3E] transition-colors">
                <Users size={22} />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#135B3E] transition-colors">
                Get involved
              </span>
            </button>
          </div>
        </section>

        {/* 3. PRAYER TIMES WIDGET: EXACT CLONE */}
        <section
          id="prayer-times"
          className="relative rounded-[24px] sm:rounded-[32px] bg-white/95 border border-slate-200/90 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-sm"
        >
          {/* Top-Right Arabesque Corner Ornament */}
          <div className="absolute top-0 right-0 pointer-events-none opacity-30">
            <ArabesqueCornerOrnament size={100} className="text-[#135B3E]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Sunrise Landscape Graphic + City */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-32 h-20 shrink-0">
                <SunriseLandscapeGraphic />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin size={13} className="text-[#135B3E]" />
                  <span>Sanctuary Location</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {selectedCity}
                </h3>
                <button
                  onClick={() =>
                    setSelectedCity(
                      selectedCity === 'West Covina, California'
                        ? 'Madinah, Saudi Arabia'
                        : 'West Covina, California'
                    )
                  }
                  className="text-[11px] text-[#135B3E] font-semibold hover:underline mt-0.5 cursor-pointer block focus-visible:ring-2"
                >
                  Switch to {selectedCity === 'West Covina, California' ? 'Madinah' : 'West Covina'}
                </button>
              </div>
            </div>

            {/* Right: Prayer Times & Sunrise Callout */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                  Prayer Times
                </h4>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 mt-0.5">
                  <Sunrise size={14} />
                  <span>5:15 Sunrise</span>
                </div>
              </div>

              {/* 5 Salah Columns */}
              <div className="grid grid-cols-5 gap-2 sm:gap-4 text-center">
                {prayerSchedule.map((prayer) => {
                  const Icon = prayer.icon;
                  return (
                    <div
                      key={prayer.name}
                      className={`relative flex flex-col items-center p-2 rounded-xl transition-all ${
                        prayer.active
                          ? 'bg-emerald-50 border border-emerald-300 shadow-2xs'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <Icon
                        size={17}
                        className={`mb-1 ${
                          prayer.active ? 'text-[#135B3E]' : 'text-amber-500'
                        }`}
                      />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {prayer.name}
                      </span>
                      <span className={`text-xs font-bold mt-0.5 ${prayer.active ? 'text-[#135B3E]' : 'text-slate-800'}`}>
                        {prayer.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. EVENTS & UPCOMING PROGRAM: EXACT CLONE */}
        <section className="space-y-6" id="events">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Events
            </h2>
            <Link href="/events" className="focus-visible:ring-2 rounded-full">
              <span className="px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 text-[#135B3E] text-xs font-semibold hover:bg-emerald-50 transition-colors shadow-2xs">
                Show all
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 4 Event Schedule Rows */}
            <div className="lg:col-span-7 space-y-3">
              {eventRows.map((event) => (
                <div
                  key={event.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-slate-200/90 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                >
                  {/* Date badge */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center border-r border-slate-200/80 pr-4 shrink-0">
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {event.dateMonth}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        {event.dayOfWeek}
                      </span>
                    </div>

                    {/* Title and details */}
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {event.timeAndLocation}
                      </p>
                    </div>
                  </div>

                  {/* Button matching Dribbble */}
                  <div className="sm:self-center shrink-0">
                    {event.isPrimaryAction ? (
                      <Link href={`/events/${event.id}`}>
                        <button className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#135B3E] hover:bg-[#0e4831] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer focus-visible:ring-2">
                          View Details
                        </button>
                      </Link>
                    ) : (
                      <Link href={`/events/${event.id}`}>
                        <button className="w-full sm:w-auto px-5 py-2 rounded-full border border-slate-300 hover:border-[#135B3E] text-slate-700 hover:text-[#135B3E] text-xs font-medium hover:bg-emerald-50/50 transition-all cursor-pointer focus-visible:ring-2">
                          View Details
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Upcoming Lecture / Program Carousel Card */}
            <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Upcoming Events
                </span>
                {/* Pager controls `< 4/3 >` */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <button
                    onClick={() => setLectureSlide((prev) => (prev > 0 ? prev - 1 : upcomingLectures.length - 1))}
                    className="p-1 hover:text-[#135B3E] cursor-pointer focus-visible:ring-2 rounded-md"
                    aria-label="Previous lecture"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-mono text-xs text-slate-600">
                    {lectureSlide + 1} / {upcomingLectures.length}
                  </span>
                  <button
                    onClick={() => setLectureSlide((prev) => (prev < upcomingLectures.length - 1 ? prev + 1 : 0))}
                    className="p-1 hover:text-[#135B3E] cursor-pointer focus-visible:ring-2 rounded-md"
                    aria-label="Next lecture"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Lecture Visual */}
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-100 shadow-inner group">
                <img
                  src={currentLecture.image}
                  alt={currentLecture.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[11px] font-semibold bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full shadow-xs">
                  {currentLecture.date}
                </span>
              </div>

              {/* Lecture Description & Pagination */}
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {currentLecture.title}
                </h4>
                <p className="text-xs text-slate-500">
                  Presented by {currentLecture.speaker}
                </p>
              </div>

              {/* Bottom Carousel Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {upcomingLectures.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLectureSlide(idx)}
                    className={`h-1.5 transition-all rounded-full cursor-pointer focus-visible:ring-2 ${
                      lectureSlide === idx ? 'w-5 bg-[#135B3E]' : 'w-1.5 bg-slate-300'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. INSPIRATIONAL QUOTE BANNER: WITH SACRED LIVING SHADER */}
        <section
          id="quote"
          className="relative w-full rounded-[28px] sm:rounded-[36px] bg-[#0c4327] overflow-hidden text-white shadow-[0_20px_45px_rgba(19,91,62,0.24)] border border-emerald-400/25"
        >
          {/* Living Waves Shader inside Quote Banner */}
          <IslamicShaderBackground
            type="waves"
            variant="gold"
            speed={0.06}
            opacity={0.45}
            className="rounded-[28px] sm:rounded-[36px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#093520]/80 via-[#0e4830]/75 to-[#082d1c]/80 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-14 min-h-[280px]">
            {/* Left: Inspiring Quotation */}
            <div className="md:col-span-8 space-y-4 text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                &ldquo;{currentQuote.text}&rdquo;
              </h3>
              <div className="space-y-0.5">
                <span className="text-xs sm:text-sm font-semibold text-emerald-100 block">
                  {currentQuote.speaker}
                </span>
                <span className="text-xs text-emerald-200/80 block">
                  {currentQuote.location}
                </span>
              </div>
            </div>

            {/* Right: Distinguished Scholar Portrait */}
            <div className="md:col-span-4 flex items-center justify-center md:justify-end">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl">
                <img
                  src={currentQuote.image}
                  alt={currentQuote.speaker}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Carousel Slide Switcher `< 5/1 >` */}
          <div className="relative z-10 pb-5 flex items-center justify-center gap-2 text-xs text-emerald-100/90 font-mono">
            <button
              onClick={() => setQuoteSlide((prev) => (prev > 0 ? prev - 1 : quotes.length - 1))}
              className="p-1 hover:text-white cursor-pointer focus-visible:ring-2 rounded-md"
              aria-label="Previous quote"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              {quoteSlide + 1} / {quotes.length}
            </span>
            <button
              onClick={() => setQuoteSlide((prev) => (prev < quotes.length - 1 ? prev + 1 : 0))}
              className="p-1 hover:text-white cursor-pointer focus-visible:ring-2 rounded-md"
              aria-label="Next quote"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* 6. PHOTO GALLERY: EXACT CLONE */}
        <section className="space-y-6" id="gallery">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Photo Gallery
            </h2>
            <Link href="/events" className="focus-visible:ring-2 rounded-full">
              <span className="px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 text-[#135B3E] text-xs font-semibold hover:bg-emerald-50 transition-colors shadow-2xs">
                Show all
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {/* Photo 1: Alhambra / Islamic Architecture */}
            <div className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80">
              <img
                src="https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&q=80&w=600"
                alt="Historic Islamic Architecture"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                  Heritage &amp; History
                </span>
                <h4 className="text-sm font-bold text-white">
                  Moorish Architecture &amp; Calligraphy
                </h4>
              </div>
            </div>

            {/* Photo 2: Pilgrims at Kaaba / Hajj */}
            <div className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80">
              <img
                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600"
                alt="Pilgrims at Hajj"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                  Sacred Gathering
                </span>
                <h4 className="text-sm font-bold text-white">
                  Pilgrims Congregated in Ihram
                </h4>
              </div>
            </div>

            {/* Photo 3: Dome of the Rock / Al-Aqsa */}
            <div className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
                alt="Dome of the Rock Sanctuary"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                  Sanctuary
                </span>
                <h4 className="text-sm font-bold text-white">
                  Al-Aqsa &amp; The Dome of the Rock
                </h4>
              </div>
            </div>
          </div>
        </section>

        {/* 7. "HELP US BETTER SERVE YOU" DONATION SECTION: WITH LIVING ISLAMIC SHADER */}
        <section
          id="donate"
          className="relative w-full rounded-[28px] sm:rounded-[36px] bg-[#0c4327] overflow-hidden text-center text-white py-16 sm:py-24 px-6 sm:px-12 shadow-[0_24px_55px_rgba(19,91,62,0.26)] border border-emerald-400/25"
        >
          {/* Living Emerald Mesh Shader */}
          <IslamicShaderBackground
            type="mesh"
            variant="emerald"
            speed={0.07}
            distortion={0.4}
            swirl={0.3}
            opacity={0.55}
            className="rounded-[28px] sm:rounded-[36px]"
          />
          {/* Intricate Islamic Geometric Arabesque Pattern Overlay */}
          <ArabesqueGeometricBackdrop opacity={0.16} />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Help us Better Serve You
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              Hejrat Foundation provides all services and programming to the community through your support.
              Click the button below to donate any amount you wish on a one-time or monthly recurring basis.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsDonateModalOpen(true)}
                className="px-9 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-[#135B3E] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
              >
                Donate Today!
              </button>
            </div>
          </div>
        </section>

        {/* 8. SUBSCRIBE NOW FLOATING CARD: EXACT CLONE */}
        <div className="-mt-8 sm:-mt-12 relative z-20 max-w-3xl mx-auto">
          <div className="rounded-[24px] sm:rounded-[30px] bg-white/95 border border-slate-200/90 shadow-[0_15px_35px_rgba(0,0,0,0.08)] p-6 sm:p-10 text-center space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Subscribe Now to Receive Updates!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                As always, the best way to keep in touch is to join our mailing list
              </p>
            </div>

            {/* Email Input & Green "Subscribe" Pill Button */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#135B3E] focus:bg-white transition-all shadow-inner"
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#135B3E] hover:bg-[#0f4931] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#135B3E]"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* FLOATING ACCESSIBLE QUICK-NAVIGATION DOCK WITH LIVE TRACKING & SHADER SWITCHER */}
      <nav
        aria-label="Quick section navigation"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 border border-emerald-900/10 shadow-[0_16px_50px_rgba(19,91,62,0.18)] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-slate-700 max-w-[94vw] overflow-x-auto scrollbar-none"
      >
        {/* Interactive Ambiance Switcher */}
        <button
          onClick={() => {
            const cycle: ShaderVariant[] = ['ambient', 'sage', 'dawn', 'aurora'];
            const nextIdx = (cycle.indexOf(shaderAmbiance) + 1) % cycle.length;
            const next = cycle[nextIdx];
            setShaderAmbiance(next);
            addToast(`Islamic Ambiance: ${shaderLabels[next]}`, 'info');
          }}
          className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#135B3E] flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 mr-1 shrink-0"
          title="Click to toggle living shader ambiance"
          aria-label={`Current ambiance: ${shaderLabels[shaderAmbiance]}. Click to toggle`}
        >
          <Sparkles size={14} className="text-amber-500 animate-pulse" />
          <span className="text-[11px] font-bold">
            {shaderLabels[shaderAmbiance]}
          </span>
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block mr-1 shrink-0" />

        {/* Section Navigation Items with Live Highlight */}
        {[
          { id: 'hero', label: 'Home' },
          { id: 'quick-links', label: 'Links' },
          { id: 'prayer-times', label: 'Prayers' },
          { id: 'events', label: 'Events' },
          { id: 'quote', label: 'Wisdom' },
          { id: 'gallery', label: 'Gallery' },
          { id: 'donate', label: 'Donate', isAction: true }
        ].map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  setActiveSection(item.id);
                }
              }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all shrink-0 cursor-pointer focus-visible:ring-2 ${
                isActive
                  ? 'bg-[#135B3E] text-white shadow-xs'
                  : item.isAction
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'hover:bg-emerald-50 hover:text-[#135B3E] text-slate-600'
              }`}
              aria-current={isActive ? 'true' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 rounded-full bg-white/95 border border-slate-200/90 shadow-lg text-slate-700 hover:text-[#135B3E] hover:border-emerald-300 flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 animate-in fade-in-50 duration-200"
          aria-label="Scroll back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* MODAL 1: FlowRegistrationModal */}
      {isRegModalOpen && (
        <FlowRegistrationModal
          event={flagshipEvent}
          isOpen={isRegModalOpen}
          onClose={() => setIsRegModalOpen(false)}
        />
      )}

      {/* MODAL 2: Interactive Donation Modal */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50 duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Heart className="text-[#135B3E]" size={20} />
                <h3 className="text-lg font-bold text-slate-900">Support Hejrat Foundation</h3>
              </div>
              <button
                onClick={() => setIsDonateModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer focus-visible:ring-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Frequency Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setDonationFrequency('one-time')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  donationFrequency === 'one-time'
                    ? 'bg-white text-[#135B3E] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                One-Time
              </button>
              <button
                onClick={() => setDonationFrequency('monthly')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  donationFrequency === 'monthly'
                    ? 'bg-white text-[#135B3E] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Recurring
              </button>
            </div>

            {/* Donation Preset Amounts */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">Select Amount</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[25, 50, 100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDonationAmount(amt)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      donationAmount === amt
                        ? 'bg-[#135B3E] text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-[#135B3E] border border-slate-200'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 block">Or Custom Amount ($)</label>
              <input
                type="number"
                min="5"
                placeholder="Enter custom amount"
                value={typeof donationAmount === 'number' ? donationAmount : ''}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#135B3E]"
              />
            </div>

            {/* Submit Action */}
            <button
              onClick={handleDonateConfirm}
              className="w-full py-3.5 rounded-full bg-[#135B3E] hover:bg-[#0e4831] text-white font-bold text-sm shadow-md transition-all cursor-pointer focus-visible:ring-2"
            >
              Complete ${donationAmount} Contribution
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Read More Modal */}
      {isReadMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50 duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">About Hejrat Foundation &amp; Masjid Al-Nabi</h3>
              <button
                onClick={() => setIsReadMoreOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer focus-visible:ring-2"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hejrat Foundation Masjid Al-Nabi is an esteemed Islamic center located in West Covina, California.
              We are committed to providing educational programs, daily congregational prayers, Quranic recitation mastery,
              and community support services for individuals and families.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Through our global partnership with IlmFlow, we also host competitive recitation tournaments, accredited
              Hadith examinations, and verify authentic Sanad diplomas worldwide.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsReadMoreOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#135B3E] text-white text-xs font-semibold cursor-pointer focus-visible:ring-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
