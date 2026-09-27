'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { CertificateItem, RegistrationRecord } from '../../types';
import { CertificateView } from '../../components/certificates/CertificateView';
import { IslamicStarIcon } from '../../components/common/IslamicPattern';
import {
  Calendar,
  Award,
  FileText,
  Shield,
  Download,
  Play,
  QrCode,
  CheckCircle,
  ExternalLink,
  Clock,
  Sparkles,
  LayoutDashboard,
  Bell,
  Settings,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Eye
} from 'lucide-react';

export default function ParticipantDashboardPage() {
  const { currentUser, registrations, competitions, certificates, manualSubmissions, quizAttempts } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'passes' | 'competitions' | 'certificates' | 'notifications'>('overview');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const myRegistrations = registrations.filter(
    (r) => r.userId === currentUser.id || r.participantEmail === currentUser.email
  );

  const myCertificates = certificates.filter(
    (c) => c.recipientEmail === currentUser.email || c.recipientName.includes(currentUser.name.split(' ')[0])
  );

  const mySubmissions = manualSubmissions.filter(
    (s) => s.participantId === currentUser.id || s.participantEmail === currentUser.email
  );

  const activeCompetition = competitions[0];
  const primaryRegistration = myRegistrations[0];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-[#0f172a]">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] overflow-hidden shrink-0 shadow-xs">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.14em] px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] uppercase">
                VERIFIED DELEGATE • {currentUser.role.toUpperCase()}
              </span>
              <span className="text-xs text-[#6b7280] font-mono">ID: {currentUser.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mt-1 tracking-tight">
              Assalamu Alaikum, {currentUser.name}
            </h1>
            <p className="text-xs text-[#475569]">
              Welcome back to your central Islamic event and competition dashboard.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[100px]">
            <span className="text-[9px] font-bold text-[#6b7280] uppercase block">ACTIVE PASSES</span>
            <span className="text-2xl font-bold text-[#064e3b] block mt-0.5">{myRegistrations.length}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[100px]">
            <span className="text-[9px] font-bold text-[#6b7280] uppercase block">SCORE / RANK</span>
            <span className="text-2xl font-bold text-[#9e782f] block mt-0.5">87% <span className="text-xs text-[#6b7280]">#18</span></span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[100px]">
            <span className="text-[9px] font-bold text-[#6b7280] uppercase block">DIPLOMAS</span>
            <span className="text-2xl font-bold text-[#064e3b] block mt-0.5">{myCertificates.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex rounded-2xl bg-[#f4f0e6] p-1.5 border border-[#e7e2d6] max-w-3xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-[#ffffff] text-[#064e3b] shadow-xs' : 'text-[#6b7280] hover:text-[#0f172a]'
          }`}
        >
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('passes')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'passes' ? 'bg-[#ffffff] text-[#064e3b] shadow-xs' : 'text-[#6b7280] hover:text-[#0f172a]'
          }`}
        >
          <QrCode size={14} />
          <span>My Passes ({myRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('competitions')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'competitions' ? 'bg-[#ffffff] text-[#064e3b] shadow-xs' : 'text-[#6b7280] hover:text-[#0f172a]'
          }`}
        >
          <Award size={14} />
          <span>Competitions ({competitions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'certificates' ? 'bg-[#ffffff] text-[#064e3b] shadow-xs' : 'text-[#6b7280] hover:text-[#0f172a]'
          }`}
        >
          <CheckCircle size={14} />
          <span>Certificates ({myCertificates.length})</span>
        </button>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Event Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase block">
                  UPCOMING CONVOCATION
                </span>
                <h3 className="text-xl font-bold text-[#0f172a]">
                  The Global Quran &amp; Sunnah Summit 2026
                </h3>
                <p className="text-xs text-[#475569]">
                  Convened at Al-Mihrab Sanctuary Palace, Al-Madinah Al-Munawwarah. Your General Assembly Pass is confirmed.
                </p>
              </div>

              <div className="pt-4 border-t border-[#e7e2d6] flex items-center justify-between">
                <span className="text-xs text-[#6b7280]">November 14–16, 2026</span>
                <Link
                  href="/events/evt-summit-2026"
                  className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span>View Event Program</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>

            {/* Active Competition Round Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#9e782f] uppercase block">
                    ACTIVE TOURNAMENT ROUND
                  </span>
                  <span className="text-[10px] font-bold text-[#10b981] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
                    Round 1 Live
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0f172a]">
                  Imam Al-Bukhari Hadith Mastery
                </h3>
                <p className="text-xs text-[#475569]">
                  Timed knowledge assessment with negative marking rules and anti-cheating window monitoring.
                </p>
              </div>

              <div className="pt-4 border-t border-[#e7e2d6] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
                  <Clock size={13} className="text-[#9e782f]" />
                  <span>15 Mins Window</span>
                </div>
                <Link
                  href="/test/comp-hadith-mastery"
                  className="px-4 py-2 rounded-xl bg-[#9e782f] text-[#ffffff] text-xs font-semibold hover:bg-[#856524] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Launch Online Test</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Performance Radar Summary */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
              <div>
                <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase block">
                  ACADEMIC PROFICIENCY BREAKDOWN
                </span>
                <h4 className="text-base font-bold text-[#0f172a]">Continuous Assessment Standing</h4>
              </div>
              <Link href="/leaderboard" className="text-xs font-semibold text-[#064e3b] hover:underline flex items-center gap-1">
                <span>View Full Leaderboard</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-1">
                <span className="text-[10px] text-[#6b7280] block">Quranic Sciences</span>
                <span className="text-xl font-bold text-[#064e3b] block">92%</span>
                <span className="text-[10px] text-[#10b981]">Top 5th Percentile</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-1">
                <span className="text-[10px] text-[#6b7280] block">Hadith Terminology</span>
                <span className="text-xl font-bold text-[#064e3b] block">84%</span>
                <span className="text-[10px] text-[#10b981]">Proficient</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-1">
                <span className="text-[10px] text-[#6b7280] block">Seerah &amp; Ethics</span>
                <span className="text-xl font-bold text-[#064e3b] block">81%</span>
                <span className="text-[10px] text-[#10b981]">Qualifying</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-1">
                <span className="text-[10px] text-[#6b7280] block">Classical Arabic</span>
                <span className="text-xl font-bold text-[#064e3b] block">90%</span>
                <span className="text-[10px] text-[#10b981]">Exemplary</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passes Tab */}
      {activeTab === 'passes' && (
        <div className="space-y-4">
          {myRegistrations.map((reg) => (
            <div
              key={reg.id}
              className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                    {reg.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-[#6b7280] font-mono">{reg.ticketNumber}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0f172a]">{reg.eventTitle}</h3>
                <p className="text-xs text-[#475569]">Tier: {reg.ticketTierName}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="p-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] font-mono text-xs text-[#064e3b]">
                  {reg.qrCodeValue || reg.ticketNumber}
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Print Lanyard Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Competitions Tab */}
      {activeTab === 'competitions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b]">
                    {comp.category}
                  </span>
                  <span className="text-[10px] font-semibold text-[#6b7280]">
                    {comp.scoringMethod}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0f172a]">{comp.title}</h3>
                <p className="text-xs text-[#475569] line-clamp-2">{comp.description}</p>
              </div>

              <div className="pt-4 border-t border-[#e7e2d6] flex items-center justify-between">
                <span className="text-xs text-[#6b7280]">
                  Prize: {comp.prizes[0]?.award}
                </span>
                <Link
                  href={comp.format === 'online-quiz' ? `/test/${comp.id}` : `/competitions/${comp.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] shadow-xs flex items-center gap-1"
                >
                  <span>{comp.format === 'online-quiz' ? 'Launch Exam' : 'Submit Audio'}</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {myCertificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-[#9e782f] uppercase block">
                  {cert.type.toUpperCase()} DIPLOMA
                </span>
                <h4 className="text-base font-bold text-[#0f172a]">{cert.eventOrCompetitionTitle}</h4>
                <p className="text-xs text-[#6b7280]">Credential ID: {cert.certificateNumber}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>View Parchment Diploma</span>
                </button>
              </div>
            </div>
          ))}

          {selectedCert && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 relative">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  ✕
                </button>
                <CertificateView certificate={selectedCert} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
