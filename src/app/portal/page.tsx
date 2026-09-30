'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { CertificateView } from '../../components/certificates/CertificateView';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
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
  Ticket
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      {/* Participant Profile Banner */}
      <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-[0_4px_25px_rgba(16,185,129,0.08)] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-300 transition-all">
        <div className="flex items-center gap-5">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            fallback={currentUser.name}
            className="w-16 h-16 border-2 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="neon" className="text-[10px]">
                Active Participant
              </Badge>
              <span className="text-xs text-slate-400 font-mono">ID: {currentUser.id}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your event passes, active examinations, submissions, and accredited certificates.
            </p>
          </div>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 px-5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[110px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Active Passes
            </span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {myRegistrations.length}
            </span>
          </div>

          <div className="p-3.5 px-5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[110px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Certificates
            </span>
            <span className="text-2xl font-bold text-emerald-700 tabular-nums">
              {myCertificates.length}
            </span>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 p-1 rounded-xl bg-slate-100 text-sm font-medium border border-slate-200 max-w-2xl">
        <button
          onClick={() => setActiveTab('passes')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'passes'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket size={15} />
          <span>My Passes ({myRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('competitions')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'competitions'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award size={15} />
          <span>Active Exams</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText size={15} />
          <span>Submissions ({mySubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles size={15} />
          <span>Certificates ({myCertificates.length})</span>
        </button>
      </div>

      {/* TAB 1: Passes & Digital Tickets */}
      {activeTab === 'passes' && (
        <div className="space-y-4">
          {myRegistrations.length === 0 ? (
            <Card className="p-12 text-center space-y-4">
              <Calendar size={36} className="mx-auto text-slate-400" />
              <div>
                <h3 className="text-base font-bold text-slate-900">No Active Event Passes</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse upcoming summits and conferences to register your delegate seat.
                </p>
              </div>
              <Link href="/events">
                <Button size="sm">Explore Events</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myRegistrations.map((reg) => (
                <Card key={reg.id} className="p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <Badge variant="secondary">{reg.ticketTierName}</Badge>
                      <Badge variant="success" className="capitalize">
                        {reg.status}
                      </Badge>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{reg.eventTitle}</h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Delegate</span>
                        <span className="font-semibold text-slate-900">{reg.participantName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Ticket No.</span>
                        <span className="font-mono font-semibold text-emerald-800">{reg.ticketNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Date</span>
                        <span className="text-slate-600">{reg.eventDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Gate</span>
                        <span className="text-slate-600">Main Entrance</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Barcode Section */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Gate Verification Code
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {reg.qrCodeValue.slice(0, 20)}...
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                      <QrCode size={28} className="text-slate-900" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Competitions & Exams */}
      {activeTab === 'competitions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((comp) => {
            const attempt = quizAttempts.find(
              (a) => a.competitionId === comp.id && a.participantId === currentUser.id
            );

            return (
              <Card key={comp.id} className="p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <Badge variant="secondary">{comp.category}</Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Clock size={13} className="text-amber-600" />
                      {comp.rounds[0]?.timeLimitMinutes || 15} Mins
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{comp.title}</h4>
                  {comp.arabicTitle && (
                    <p className="font-arabic text-sm text-emerald-800" dir="rtl">{comp.arabicTitle}</p>
                  )}
                  <p className="text-xs text-slate-600 line-clamp-2">{comp.description}</p>

                  {attempt && (
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">Exam Completed</span>
                        <span className="text-slate-600">Score: {attempt.score}/{attempt.totalMarks} ({attempt.percentage}%)</span>
                      </div>
                      <Badge variant={attempt.percentage >= 70 ? 'success' : 'warning'}>
                        {attempt.percentage >= 70 ? 'Passed' : 'Needs Review'}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {comp.rounds.length} Round(s) • {comp.scoringMethod}
                  </span>

                  <Link href={`/test/${comp.id}`}>
                    <Button variant="gradient" size="sm" className="gap-1.5 text-xs font-semibold">
                      <Play size={13} fill="currentColor" />
                      <span>{attempt ? 'Retake Exam' : 'Start Test'}</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 3: Submissions */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {mySubmissions.length === 0 ? (
            <Card className="p-12 text-center space-y-2">
              <FileText size={36} className="mx-auto text-slate-400" />
              <h3 className="text-base font-bold text-slate-900">No Submissions Yet</h3>
              <p className="text-xs text-slate-500">Enter a competition to upload recitations or essays.</p>
            </Card>
          ) : (
            mySubmissions.map((sub) => (
              <Card key={sub.id} className="p-6 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {sub.type === 'audio' ? 'Audio Recitation Entry' : 'Essay Treatise'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{sub.title}</h4>
                  </div>
                  <Badge variant={sub.status === 'graded' ? 'success' : 'warning'}>
                    {sub.status === 'graded' ? `Score: ${sub.finalScore}/100` : 'Pending Review'}
                  </Badge>
                </div>

                {sub.grades?.[0] && (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="font-semibold text-slate-900 block">
                      Remarks from {sub.grades[0].judgeName}:
                    </span>
                    <p className="text-slate-600 leading-relaxed">{sub.grades[0].comments}</p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Certificates */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCertificates.map((cert) => (
              <Card key={cert.id} className="p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <Badge variant="success" className="gap-1">
                      <CheckCircle size={12} />
                      <span>Verified Sanad</span>
                    </Badge>
                    <span className="font-mono text-xs text-slate-400">{cert.certificateNumber}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{cert.eventOrCompetitionTitle}</h4>
                  <p className="text-xs text-slate-600">
                    Recipient: <strong className="text-slate-900">{cert.recipientName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">Issued: {cert.issueDate}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link href={`/certificates/verify?id=${cert.certificateNumber}`}>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <ExternalLink size={13} />
                      <span>Public Ledger</span>
                    </Button>
                  </Link>

                  <Button size="sm" onClick={() => setSelectedCert(cert)}>
                    View Certificate
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Certificate Modal Dialog */}
          {selectedCert && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-4 flex items-center justify-center">
              <div className="relative w-full max-w-4xl animate-in zoom-in-95 duration-150">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCert(null)}
                  className="absolute -top-11 right-0 text-white bg-slate-800 border-slate-700 hover:bg-slate-700"
                >
                  Close
                </Button>
                <CertificateView certificate={selectedCert} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
