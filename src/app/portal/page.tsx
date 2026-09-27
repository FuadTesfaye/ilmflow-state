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
  Sparkles
} from 'lucide-react';

export default function ParticipantPortalPage() {
  const { currentUser, registrations, competitions, certificates, manualSubmissions, quizAttempts } = useApp();

  const [activeTab, setActiveTab] = useState<'passes' | 'competitions' | 'submissions' | 'certificates'>('passes');
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 select-none text-[#111827]">
      {/* Participant Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] overflow-hidden shrink-0 shadow-xs">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
                VERIFIED DELEGATE
              </span>
              <span className="text-xs text-[#6b7280] font-mono">ID: {currentUser.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl text-[#0f172a] font-bold mt-1 tracking-tight">
              Ahlan wa Sahlan, {currentUser.name}
            </h1>
            <p className="text-xs text-[#475569]">
              Manage your sanctuary access passes, scheduled tests, competition work, and accredited certificates.
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[100px]">
            <span className="meta-tag text-[#6b7280] block text-[9px]">ACTIVE PASSES</span>
            <span className="font-display text-2xl font-bold text-[#064e3b]">
              {myRegistrations.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-center min-w-[100px]">
            <span className="meta-tag text-[#6b7280] block text-[9px]">CERTIFICATES</span>
            <span className="font-display text-2xl font-bold text-[#9e782f]">
              {myCertificates.length}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-2xl bg-[#f4f0e6] p-1.5 border border-[#e7e2d6] max-w-2xl">
        <button
          onClick={() => setActiveTab('passes')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'passes'
              ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <QrCode size={14} />
          <span>My Passes ({myRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('competitions')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'competitions'
              ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <Award size={14} />
          <span>Active Tests</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <FileText size={14} />
          <span>My Work ({mySubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <Sparkles size={14} />
          <span>Certificates ({myCertificates.length})</span>
        </button>
      </div>

      {/* TAB 1: Passes & Digital Tickets */}
      {activeTab === 'passes' && (
        <div className="space-y-4">
          {myRegistrations.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] text-center space-y-3">
              <Calendar size={36} className="mx-auto text-[#064e3b] opacity-60" />
              <h3 className="font-display text-xl text-[#111827] font-bold">No Event Passes Yet</h3>
              <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
                Explore our upcoming conferences and register to receive your verified digital sanctuary pass.
              </p>
              <Link
                href="/events"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold shadow-xs"
              >
                Browse Conferences
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="rounded-3xl bg-[#ffffff] border border-[#e7e2d6] p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                      <div className="flex items-center gap-2">
                        <IslamicStarIcon size={16} className="text-[#064e3b]" />
                        <span className="meta-tag text-[#064e3b] font-bold">
                          SANCTUARY DELEGATE PASS
                        </span>
                      </div>
                      <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] font-bold">
                        {reg.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-display text-xl font-bold text-[#111827] mt-3">
                      {reg.eventTitle}
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-4">
                      <div>
                        <span className="meta-tag text-[#6b7280] block text-[9px]">DELEGATE</span>
                        <span className="font-semibold text-[#111827]">{reg.participantName}</span>
                      </div>
                      <div>
                        <span className="meta-tag text-[#6b7280] block text-[9px]">PASS TIER</span>
                        <span className="font-semibold text-[#064e3b]">{reg.ticketTierName}</span>
                      </div>
                      <div>
                        <span className="meta-tag text-[#6b7280] block text-[9px]">TICKET #</span>
                        <span className="font-mono text-xs text-[#4b5563]">{reg.ticketNumber}</span>
                      </div>
                      <div>
                        <span className="meta-tag text-[#6b7280] block text-[9px]">DATE</span>
                        <span className="text-xs text-[#4b5563]">{reg.eventDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR & Barcode Section */}
                  <div className="mt-6 pt-4 border-t border-dashed border-[#e7e2d6] flex items-center justify-between">
                    <div>
                      <span className="meta-tag text-[#064e3b] block text-[9px]">GATE ADMISSION CODE</span>
                      <span className="text-[11px] text-[#6b7280]">
                        Present at gate scanner for arrival validation
                      </span>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] p-1.5 flex items-center justify-center">
                      <QrCode size={36} className="text-[#111827]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Competitions & Tests */}
      {activeTab === 'competitions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((comp) => {
            const attempt = quizAttempts.find(
              (a) => a.competitionId === comp.id && a.participantId === currentUser.id
            );

            return (
              <div
                key={comp.id}
                className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                    <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
                      {comp.category}
                    </span>
                    <span className="text-xs text-[#6b7280] flex items-center gap-1 font-mono">
                      <Clock size={12} />
                      {comp.rounds[0]?.timeLimitMinutes || 15} Mins
                    </span>
                  </div>

                  <h4 className="font-display text-xl font-bold text-[#111827] mt-3">
                    {comp.title}
                  </h4>
                  <p className="text-xs text-[#4b5563] mt-1 line-clamp-2">{comp.description}</p>

                  {attempt && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#065f46] font-bold block">Examination Completed</span>
                        <span className="text-[#4b5563]">Score: {attempt.score}/{attempt.totalMarks} ({attempt.percentage}%)</span>
                      </div>
                      <span className="meta-tag px-2.5 py-1 rounded bg-[#ffffff] text-[#065f46] font-bold">
                        {attempt.percentage >= 70 ? 'Passed' : 'Needs Review'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#e7e2d6] flex items-center justify-between">
                  <span className="text-xs text-[#6b7280]">
                    Rounds: {comp.rounds.length}
                  </span>

                  <Link
                    href={`/test/${comp.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] shadow-xs transition-all"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>{attempt ? 'Retake Examination' : 'Start Online Test'}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Submissions */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {mySubmissions.map((sub) => (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-3"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                <h4 className="text-sm font-bold text-[#111827]">{sub.title}</h4>
                <span
                  className={`meta-tag px-2.5 py-1 rounded-full ${
                    sub.status === 'graded'
                      ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                      : 'bg-[#fefce8] text-[#854d0e] border border-[#fef08a]'
                  }`}
                >
                  {sub.status === 'graded' ? `SCORE: ${sub.finalScore}/100` : 'UNDER JUDICIAL REVIEW'}
                </span>
              </div>

              {sub.grades?.[0] && (
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-xs space-y-1">
                  <span className="meta-tag text-[#064e3b] font-bold block">
                    Review Remarks from {sub.grades[0].judgeName}:
                  </span>
                  <p className="text-[#4b5563] italic leading-relaxed">{sub.grades[0].comments}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Certificates */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCertificates.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                    <span className="meta-tag text-[#065f46] flex items-center gap-1">
                      <CheckCircle size={12} />
                      ACADEMICALLY VERIFIED
                    </span>
                    <span className="font-mono text-xs text-[#6b7280]">
                      {cert.certificateNumber}
                    </span>
                  </div>

                  <h4 className="font-display text-xl font-bold text-[#111827] mt-3">
                    {cert.eventOrCompetitionTitle}
                  </h4>
                  <p className="text-xs text-[#4b5563] mt-1">Conferred upon: {cert.recipientName}</p>
                  <p className="text-[11px] text-[#6b7280] mt-2">Issued on: {cert.issueDate}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e7e2d6] flex items-center justify-between">
                  <Link
                    href={`/certificates/verify?id=${cert.certificateNumber}`}
                    className="text-xs font-semibold text-[#064e3b] hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    <span>Public Ledger</span>
                  </Link>

                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs"
                  >
                    View Official Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Certificate Modal View */}
          {selectedCert && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111827]/70 backdrop-blur-md p-4 flex items-center justify-center">
              <div className="relative w-full max-w-4xl">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute -top-10 right-0 text-white text-xs px-3 py-1 rounded-lg bg-[#111827] border border-[#e7e2d6]/30 cursor-pointer"
                >
                  Close
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
