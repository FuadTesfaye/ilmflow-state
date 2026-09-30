'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { CertificateItem, RegistrationRecord } from '../../types';
import { CertificateView } from '../../components/certificates/CertificateView';
import { IslamicStarEmblem } from '../../components/common/IslamicPattern';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../../components/ui/sheet';
import {
  Calendar,
  Award,
  FileText,
  Play,
  QrCode,
  CheckCircle,
  ExternalLink,
  Clock,
  Sparkles,
  Ticket,
  MapPin,
  Building,
  Download,
  Share2,
  Heart,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  DollarSign,
  Receipt,
  UserCheck,
  ChevronRight,
  Check,
  Copy,
  Info,
  Eye
} from 'lucide-react';

export default function ParticipantPortalPage() {
  const {
    currentUser,
    registrations,
    competitions,
    certificates,
    manualSubmissions,
    quizAttempts,
    announcements,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'passes' | 'competitions' | 'certificates' | 'giving' | 'announcements'>('passes');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [inspectedPass, setInspectedPass] = useState<RegistrationRecord | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateAmount, setDonateAmount] = useState(100);

  // User-scoped data
  const myRegistrations = registrations.filter(
    (r) => r.userId === currentUser.id || r.participantEmail === currentUser.email
  );

  const myCertificates = certificates.filter(
    (c) => c.recipientEmail === currentUser.email || c.recipientName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  );

  const mySubmissions = manualSubmissions.filter(
    (s) => s.participantId === currentUser.id || s.participantEmail === currentUser.email
  );

  const myAttempts = quizAttempts.filter(
    (a) => a.participantId === currentUser.id
  );

  const handleCopyMemberId = () => {
    navigator.clipboard?.writeText(currentUser.id);
    setCopiedId(true);
    addToast('Member ID copied to clipboard', 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadICS = (reg: RegistrationRecord) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hejrat Foundation//Masjid Al-Nabi Event//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${reg.eventTitle}`,
      'DESCRIPTION:Hejrat Foundation Masjid Al-Nabi Program Pass',
      'LOCATION:Balishira Resort & Masjid Al-Nabi Hall, West Covina, CA',
      `UID:pass-${reg.ticketNumber}@hejrat.org`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reg.ticketNumber}_event.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Calendar event downloaded (.ics)', 'success');
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900 font-sans">
      {/* ========================================================================= */}
      {/* 1. DIGITAL ISLAMIC MEMBER IDENTITY CARD (ENTERPRISE BADGE)               */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0c4427] via-[#135b3e] to-[#08301c] text-white p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(19,91,62,0.22)] border border-emerald-400/25 overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
          {/* Left: User Profile & Campus Credentials */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-white text-[#135B3E] shadow-md">
                <IslamicStarEmblem size={18} />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 border-emerald-400/40 bg-emerald-950/40">
                  {currentUser.role === 'admin' ? 'Super Administrator' : 'Active Congregant / Student'}
                </Badge>
                <button
                  onClick={handleCopyMemberId}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-200/80 hover:text-white transition-colors cursor-pointer bg-black/20 px-2 py-0.5 rounded-md"
                  title="Click to copy ID"
                >
                  <span>{currentUser.id}</span>
                  {copiedId ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {currentUser.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100/80">
                <span className="flex items-center gap-1">
                  <Building size={13} className="text-emerald-300" />
                  <span>Masjid Al-Nabi (West Covina)</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <span>{currentUser.email}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Fast Check-in Gate QR Code Pass */}
          <div className="w-full lg:w-auto flex sm:flex-row lg:flex-col items-center justify-between sm:justify-start lg:items-end gap-3 p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-md shrink-0">
                <QrCode size={40} className="text-[#135B3E]" />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200 block">
                  FAST GATE PASS
                </span>
                <span className="text-xs font-bold text-white block">
                  Scan at Entrance
                </span>
                <span className="text-[10px] text-emerald-100/70 block">
                  Musalla &amp; Event Halls
                </span>
              </div>
            </div>

            {currentUser.role === 'admin' && (
              <Link href="/admin" className="w-full sm:w-auto">
                <Button size="sm" className="w-full text-xs font-semibold bg-white text-[#135B3E] hover:bg-emerald-50 shadow-sm gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Admin Console</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PORTAL KPI COUNTER CARDS                                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Event Passes</span>
            <Ticket size={16} className="text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {myRegistrations.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Confirmed bookings</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Competitions</span>
            <Award size={16} className="text-blue-700" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {competitions.length}
          </div>
          <span className="text-[11px] text-blue-700 font-medium">Active tournaments</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Accredited Sanad</span>
            <Sparkles size={16} className="text-amber-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {myCertificates.length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Verifiable diplomas</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Contributions</span>
            <Heart size={16} className="text-rose-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            $650
          </div>
          <span className="text-[11px] text-rose-700 font-medium">Sadaqah &amp; Zakat YTD</span>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. NAVIGATION TABS                                                        */}
      {/* ========================================================================= */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs max-w-3xl scrollbar-none">
        {[
          { id: 'passes', label: 'My Event Passes', icon: Ticket, count: myRegistrations.length },
          { id: 'competitions', label: 'Academic Exams', icon: Award, count: competitions.length },
          { id: 'certificates', label: 'Sanad Diplomas', icon: Sparkles, count: myCertificates.length },
          { id: 'giving', label: 'Sadaqah & Giving', icon: Heart },
          { id: 'announcements', label: 'Advisories', icon: Info, count: announcements.length }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-[#135B3E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                    isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MY PASSES & TICKET WALLET                                          */}
      {/* ========================================================================= */}
      {activeTab === 'passes' && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Active Event Passes &amp; Reserved Tickets
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Present your barcode ticket for rapid admission check-in at Masjid Al-Nabi halls.
              </p>
            </div>
            <Link href="/events">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs text-[#135B3E]">
                <span>Browse Calendar</span>
                <ChevronRight size={14} />
              </Button>
            </Link>
          </div>

          {myRegistrations.length === 0 ? (
            <Card className="p-12 text-center border-slate-200/90 shadow-2xs space-y-3">
              <Ticket size={36} className="text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Active Event Passes</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You have not registered for any upcoming events. Explore our weekly congregational assemblies and halaqas.
              </p>
              <Link href="/events" className="inline-block pt-2">
                <Button className="bg-[#135B3E] hover:bg-[#0e4831]">
                  Discover Events
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myRegistrations.map((reg) => (
                <Card
                  key={reg.id}
                  className="overflow-hidden border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Ticket Header Graphic */}
                  <div className="p-6 bg-gradient-to-r from-[#0c4427] to-[#125537] text-white space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-200">
                        CONFIRMED PASS
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold text-[10px]">
                        {reg.ticketTierName}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {reg.eventTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-100/90">
                        <MapPin size={13} className="text-emerald-300 shrink-0" />
                        <span>Balishira Resort &amp; Main Musalla, West Covina</span>
                      </div>
                    </div>
                  </div>

                  {/* Body: Barcode & Check-in Badge */}
                  <div className="p-6 space-y-5">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">
                          Barcode Pass Number
                        </span>
                        <span className="text-base font-black font-mono tracking-wider text-slate-900 block">
                          {reg.ticketNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Attendee: {reg.participantName}
                        </span>
                      </div>
                      <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#135B3E] shadow-2xs">
                        <QrCode size={36} />
                      </div>
                    </div>

                    {/* Quick Ticket Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadICS(reg)}
                        className="text-xs gap-1.5 text-slate-700"
                      >
                        <Calendar size={13} />
                        <span>Add to Calendar</span>
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => setInspectedPass(reg)}
                        className="text-xs bg-[#135B3E] hover:bg-[#0e4831] text-white gap-1.5"
                      >
                        <QrCode size={13} />
                        <span>View Pass</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ACADEMIC EXAMINATIONS & COMPETITIONS                               */}
      {/* ========================================================================= */}
      {activeTab === 'competitions' && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Academic Competitions &amp; Examination Testing
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Participate in accredited Hadith, Tajweed, and Fiqh examination rounds powered by IlmFlow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {competitions.map((comp) => (
              <Card
                key={comp.id}
                className="p-6 border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#135B3E] px-2.5 py-0.5 rounded-full bg-emerald-50">
                      {comp.category}
                    </span>
                    <Badge variant="success" className="text-[10px]">
                      Open Round
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{comp.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{comp.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Format</span>
                    <span className="font-semibold text-slate-800 capitalize">{comp.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accreditation</span>
                    <span className="font-semibold text-emerald-800">{comp.prizes?.[0]?.award || 'Sanad Diploma'}</span>
                  </div>
                </div>

                <Link href={`/test/${comp.id}`} className="w-full">
                  <Button className="w-full bg-[#135B3E] hover:bg-[#0e4831] text-white text-xs gap-1.5">
                    <Play size={13} />
                    <span>Launch Examination</span>
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ACCREDITED SANAD VAULT & DIPLOMAS                                  */}
      {/* ========================================================================= */}
      {activeTab === 'certificates' && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Accredited Sanad Vault &amp; Verifiable Diplomas
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Authentic scholarly certifications cryptographically verified against the IlmFlow registry.
              </p>
            </div>
            <Link href="/certificates/verify">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs text-[#135B3E]">
                <ShieldCheck size={14} />
                <span>Public Verification Portal</span>
              </Button>
            </Link>
          </div>

          {myCertificates.length === 0 ? (
            <Card className="p-12 text-center border-slate-200/90 shadow-2xs space-y-2">
              <Sparkles size={36} className="text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Issued Diplomas Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Complete an examination or tournament round with an 80%+ rubric score to earn an authentic Sanad diploma.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCertificates.map((cert) => (
                <Card
                  key={cert.id}
                  className="p-6 border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 bg-gradient-to-b from-amber-50/20 via-white to-white border-t-4 border-t-amber-600"
                >
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-amber-700 font-mono tracking-wider">
                        SANAD DIPLOMA
                      </span>
                      <Badge variant="outline" className="text-[10px] text-emerald-800 border-emerald-300 bg-emerald-50">
                        SHA-256 Verified
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {cert.eventOrCompetitionTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Conferred upon <span className="font-semibold text-slate-800">{cert.recipientName}</span>
                    </p>

                    <div className="pt-2 text-[10px] font-mono text-slate-400 truncate">
                      Serial: {cert.certificateNumber}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedCert(cert)}
                      className="w-full text-xs bg-[#135B3E] hover:bg-[#0e4831] text-white gap-1.5"
                    >
                      <Eye size={13} />
                      <span>Inspect Sanad</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SADAQAH & GIVING HISTORY                                          */}
      {/* ========================================================================= */}
      {activeTab === 'giving' && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Sadaqah, Zakat &amp; Contribution Records
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Download tax-deductible receipts and manage ongoing community pledges for Masjid Al-Nabi.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowDonateModal(true)}
              className="gap-1.5 bg-[#135B3E] hover:bg-[#0e4831]"
            >
              <Heart size={14} />
              <span>Make Contribution</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-6 border-slate-200/90 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Total YTD Giving</span>
              <div className="text-3xl font-extrabold text-slate-900">$650.00</div>
              <p className="text-xs text-emerald-700">100% Tax Deductible (501c3)</p>
            </Card>

            <Card className="p-6 border-slate-200/90 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Active Monthly Pledge</span>
              <div className="text-3xl font-extrabold text-slate-900">$50.00 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
              <p className="text-xs text-slate-500">Masjid Sustainer Circle</p>
            </Card>

            <Card className="p-6 border-slate-200/90 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Tax Statement</span>
              <div className="text-sm font-bold text-slate-900">2026 Annual Receipt Ready</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToast('Annual tax receipt PDF generated and sent to email', 'success')}
                className="text-xs gap-1.5 mt-1"
              >
                <Download size={13} />
                <span>Download Statement</span>
              </Button>
            </Card>
          </div>

          {/* Contribution History Table */}
          <Card className="border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Recent Contributions
              </h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {[
                { date: 'Oct 15, 2026', fund: 'Masjid Expansion Sadaqah Jariyah', amount: 250, method: 'Direct Bank Transfer', receipt: 'REC-9014' },
                { date: 'Sep 28, 2026', fund: 'Weekly Jumu’a Congregational Fund', amount: 150, method: 'Apple Pay', receipt: 'REC-8842' },
                { date: 'Sep 01, 2026', fund: 'Monthly Sustainer Pledge', amount: 50, method: 'Recurring Card', receipt: 'REC-8719' },
                { date: 'Aug 01, 2026', fund: 'Monthly Sustainer Pledge', amount: 50, method: 'Recurring Card', receipt: 'REC-8411' }
              ].map((tx, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{tx.fund}</span>
                    <span className="text-slate-400">{tx.date} • {tx.method}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-sm text-slate-900 tabular-nums">
                      ${tx.amount.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addToast(`Receipt ${tx.receipt} downloaded`, 'info')}
                      className="text-xs text-[#135B3E] gap-1"
                    >
                      <Receipt size={13} />
                      <span className="hidden sm:inline">Receipt</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ADVISORIES & ANNOUNCEMENTS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'announcements' && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Community Notices &amp; Program Advisories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live updates regarding prayer timings, parking advisories, and guest scholars.
            </p>
          </div>

          <div className="space-y-3">
            {announcements.map((anc) => (
              <Card key={anc.id} className="p-5 border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#135B3E] px-2.5 py-0.5 rounded-full bg-emerald-50">
                    {anc.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Masjid Administration</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{anc.title}</h3>
                {anc.arabicTitle && (
                  <h4 className="text-sm font-bold text-right text-emerald-950 font-arabic">{anc.arabicTitle}</h4>
                )}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{anc.content}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SHEET: INSPECT EVENT PASS DRAWER                                          */}
      {/* ========================================================================= */}
      <Sheet open={!!inspectedPass} onOpenChange={(open) => !open && setInspectedPass(null)}>
        {inspectedPass && (
          <div className="space-y-6">
            <SheetHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono text-[#135B3E]">
                  {inspectedPass.ticketNumber}
                </Badge>
                <Badge variant="success" className="text-[10px]">
                  Confirmed
                </Badge>
              </div>
              <SheetTitle>{inspectedPass.eventTitle}</SheetTitle>
              <SheetDescription>Gate admission pass for Masjid Al-Nabi halls</SheetDescription>
            </SheetHeader>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c4427] to-[#072517] text-white shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200">
                  HEJRAT FOUNDATION PASS
                </span>
                <span className="text-xs font-bold text-white">
                  {inspectedPass.ticketTierName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-base font-bold text-white block">{inspectedPass.eventTitle}</span>
                <span className="text-xs text-emerald-100/80 block">Balishira Resort &amp; Main Musalla</span>
              </div>

              <div className="p-4 bg-white rounded-xl flex items-center justify-between text-slate-900">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono block">GATE ADMISSION CODE</span>
                  <span className="text-base font-black font-mono tracking-wider block">{inspectedPass.ticketNumber}</span>
                </div>
                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
                  <QrCode size={38} className="text-[#135B3E]" />
                </div>
              </div>
            </div>

            <SheetFooter>
              <Button
                onClick={() => handleDownloadICS(inspectedPass)}
                className="w-full bg-[#135B3E] hover:bg-[#0e4831] text-white"
              >
                Add to Calendar (.ics)
              </Button>
            </SheetFooter>
          </div>
        )}
      </Sheet>

      {/* ========================================================================= */}
      {/* MODAL: VERIFIED SANAD VIEWER                                              */}
      {/* ========================================================================= */}
      {selectedCert && (
        <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
          <DialogContent className="max-w-2xl" onClose={() => setSelectedCert(null)}>
            <CertificateView certificate={selectedCert} />
          </DialogContent>
        </Dialog>
      )}

      {/* ========================================================================= */}
      {/* MODAL: QUICK CONTRIBUTION MODAL                                           */}
      {/* ========================================================================= */}
      <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
        <DialogContent onClose={() => setShowDonateModal(false)}>
          <DialogHeader>
            <DialogTitle>Make a Community Contribution</DialogTitle>
            <DialogDescription>
              Support Masjid Al-Nabi educational and congregational programs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDonateAmount(amt)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    donateAmount === amt
                      ? 'bg-[#135B3E] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDonateModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowDonateModal(false);
                  addToast(`JazakAllah Khair! Contribution of $${donateAmount} processed.`, 'success');
                }}
                className="bg-[#135B3E] hover:bg-[#0e4831]"
              >
                Complete ${donateAmount} Contribution
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
