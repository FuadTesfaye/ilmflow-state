'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { FormBuilder } from '../../components/forms/FormBuilder';
import { EnterpriseSidebar } from '../../components/dashboard/EnterpriseSidebar';
import { EnterpriseTopbar } from '../../components/dashboard/EnterpriseTopbar';
import { CommandPaletteModal } from '../../components/dashboard/CommandPaletteModal';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../../components/ui/sheet';
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../../components/ui/dropdown-menu';
import { Select } from '../../components/ui/select';
import { AccessDeniedCard } from '../../components/common/PermissionGate';
import {
  Users,
  Calendar,
  Award,
  FileCheck,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Download,
  Bell,
  Settings,
  BookOpen,
  Sliders,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  QrCode,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Check,
  FileText,
  Sparkles,
  BarChart3,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  Send,
  UserCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    currentUser,
    hasRole,
    events,
    createEvent,
    competitions,
    questions,
    addQuestion,
    deleteQuestion,
    forms,
    saveForm,
    registrations,
    updateRegistrationStatus,
    certificates,
    announcements,
    addAnnouncement,
    manualSubmissions,
    gradeSubmission,
    addToast
  } = useApp();

  if (!hasRole(['admin', 'superadmin'])) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <AccessDeniedCard
          title="Administrative Command Center"
          description="Access to the institution's administrative operations console is restricted to certified administrators and executive trustees."
          requiredRoles={['admin', 'superadmin']}
        />
      </div>
    );
  }

  // Layout state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'events' | 'competitions' | 'questions' | 'forms' | 'registrations' | 'announcements' | 'settings' | 'grading'
  >('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Modals state
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [inspectedRegistration, setInspectedRegistration] = useState<any>(null);

  // Table filters & selection
  const [searchAttendee, setSearchAttendee] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'registered' | 'waitlisted' | 'cancelled'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'general' | 'vip' | 'student'>('all');
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<string[]>([]);

  // Question bank state
  const [newQText, setNewQText] = useState('');
  const [newQArabic, setNewQArabic] = useState('');
  const [newQExplanation, setNewQExplanation] = useState('');
  const [newQMarks, setNewQMarks] = useState(5);
  const [newQCategory, setNewQCategory] = useState<any>('hadith-mastery');
  const [newQSource, setNewQSource] = useState('');

  // Announcement state
  const [newAncTitle, setNewAncTitle] = useState('');
  const [newAncArabic, setNewAncArabic] = useState('');
  const [newAncContent, setNewAncContent] = useState('');
  const [newAncCategory, setNewAncCategory] = useState<'urgent' | 'schedule' | 'competition' | 'general'>('general');

  // Event creation form state
  const [eventFormTitle, setEventFormTitle] = useState('');
  const [eventFormCategory, setEventFormCategory] = useState<any>('conference');
  const [eventFormCapacity, setEventFormCapacity] = useState(600);
  const [eventFormVenue, setEventFormVenue] = useState('Main Musalla & Hall');
  const [eventFormDate, setEventFormDate] = useState('2026-11-15T18:00');

  // Grading queue state
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    manualSubmissions.find((s) => s.status === 'pending_review')?.id || null
  );
  const [gradingScore, setGradingScore] = useState(85);
  const [gradingFeedback, setGradingFeedback] = useState('Excellent precision in recitation and authentic isnad comprehension.');

  // KPI calculations
  const pendingGradingCount = manualSubmissions.filter((s) => s.status === 'pending_review').length;
  const checkedInCount = registrations.filter((r) => r.status === 'checked_in').length;
  const totalRegisteredCount = registrations.length;
  const attendanceRate = totalRegisteredCount > 0 ? Math.round((checkedInCount / totalRegisteredCount) * 100) : 0;

  // Filtered attendees
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.participantName.toLowerCase().includes(searchAttendee.toLowerCase()) ||
      r.participantEmail.toLowerCase().includes(searchAttendee.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchAttendee.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesTier = tierFilter === 'all' || r.ticketTierName.toLowerCase().includes(tierFilter);
    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAttendeeIds(filteredRegistrations.map((r) => r.id));
    } else {
      setSelectedAttendeeIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedAttendeeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const headers = 'TicketNumber,ParticipantName,Email,Phone,Event,Tier,Status,RegisteredAt\n';
    const rows = registrations
      .map(
        (r) =>
          `"${r.ticketNumber}","${r.participantName}","${r.participantEmail}","${r.participantPhone || ''}","${r.eventTitle}","${r.ticketTierName}","${r.status}","${r.registeredAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addToast('Attendee CSV report downloaded successfully', 'success');
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormTitle.trim()) return;

    createEvent({
      slug: eventFormTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: eventFormTitle,
      subtitle: 'Masjid Al-Nabi Program',
      category: eventFormCategory,
      format: 'in-person',
      capacity: Number(eventFormCapacity),
      venueName: eventFormVenue,
      venueAddress: 'West Covina, CA',
      startDate: new Date(eventFormDate).toISOString(),
      endDate: new Date(new Date(eventFormDate).getTime() + 3 * 3600000).toISOString(),
      registrationDeadline: new Date(new Date(eventFormDate).getTime() - 24 * 3600000).toISOString(),
      timeZone: 'America/Los_Angeles',
      description: 'Congregational assembly, spiritual contemplation, and community dinner at Masjid Al-Nabi.',
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      status: 'upcoming',
      languages: ['English', 'Arabic'],
      formId: 'default-registration',
      prayerTimes: {
        fajr: '05:00 AM',
        dhuhr: '01:30 PM',
        asr: '04:30 PM',
        maghrib: '06:00 PM',
        isha: '08:00 PM',
        nextPrayer: 'Maghrib',
        timeRemaining: '45m'
      },
      schedule: [],
      tickets: [
        {
          id: `t_${Date.now()}_1`,
          name: 'General Admission',
          price: 0,
          currency: 'USD',
          description: 'Open congregational seating',
          features: ['Hall Admission', 'Community Dinner'],
          capacity: Math.floor(eventFormCapacity * 0.8),
          registeredCount: 0,
          available: true
        },
        {
          id: `t_${Date.now()}_2`,
          name: 'Reserved Family Pass',
          price: 25,
          currency: 'USD',
          description: 'Reserved family table',
          features: ['Priority Seating', 'Dinner Table Reserved'],
          capacity: Math.floor(eventFormCapacity * 0.2),
          registeredCount: 0,
          available: true
        }
      ],
      speakers: []
    });

    setShowCreateEventModal(false);
    setEventFormTitle('');
    addToast('New event created and published to calendar', 'success');
  };

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;

    addQuestion({
      questionText: newQText,
      arabicText: newQArabic || undefined,
      type: 'multiple-choice',
      marks: Number(newQMarks),
      negativeMarks: 1,
      category: newQCategory,
      difficulty: 'intermediate',
      explanation: newQExplanation || 'Verified against authentic source materials and canonical commentaries.',
      sourceReference: newQSource || 'Sahih al-Bukhari & Muslim',
      options: [
        { id: 'opt_1', text: 'Primary authentic opinion (Majuur)', arabicText: 'القول المعتمد الصحيح' },
        { id: 'opt_2', text: 'Variant scholarly position', arabicText: 'قول مرجوح' },
        { id: 'opt_3', text: 'Historical grammatical distinction', arabicText: 'وجه إعرابي آخر' }
      ],
      correctAnswer: 'opt_1'
    });

    setShowAddQuestionModal(false);
    setNewQText('');
    setNewQArabic('');
    setNewQExplanation('');
    setNewQSource('');
    addToast('New question saved to central competition bank', 'success');
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAncTitle.trim() || !newAncContent.trim()) return;

    addAnnouncement({
      title: newAncTitle,
      arabicTitle: newAncArabic || undefined,
      content: newAncContent,
      category: newAncCategory,
      author: 'Masjid Administration',
      isPinned: true
    });

    setShowAnnouncementModal(false);
    setNewAncTitle('');
    setNewAncArabic('');
    setNewAncContent('');
    addToast('Announcement dispatched to all congregants', 'success');
  };

  const handleGradeSubmission = (submissionId: string) => {
    gradeSubmission(
      submissionId,
      'admin-judge-1',
      'Senior Academic Committee',
      { 'Tajweed & Memorization': gradingScore },
      gradingScore,
      gradingFeedback
    );
    addToast(`Submission evaluated with score ${gradingScore}%. Sanad released.`, 'success');
    setSelectedSubmissionId(null);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'create-event') setShowCreateEventModal(true);
    if (action === 'add-question') setShowAddQuestionModal(true);
    if (action === 'new-announcement') setShowAnnouncementModal(true);
    if (action === 'export-csv') handleExportCSV();
  };

  const tabLabels: Record<string, string> = {
    overview: 'Executive Overview',
    events: 'Events & Ticketing',
    registrations: 'Attendees & Check-in',
    competitions: 'Tournaments & Exams',
    questions: 'Question Bank',
    grading: 'Grading Queue',
    forms: 'Form Studio',
    announcements: 'Announcements',
    settings: 'Settings'
  };

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-900">
      {/* 1. Global Collapsible Enterprise Sidebar */}
      <EnterpriseSidebar
        currentTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Enterprise Topbar */}
        <EnterpriseTopbar
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onQuickAction={handleQuickAction}
          currentTabName={tabLabels[activeTab]}
        />

        {/* Global Keyboard Command Palette Modal (⌘K) */}
        <CommandPaletteModal
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onSelectTab={(tab) => setActiveTab(tab as any)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE OVERVIEW                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              {/* Executive Page Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Executive Command Center
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Real-time operational intelligence across Masjid Al-Nabi congregational events, admissions, and tournaments.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    className="gap-1.5"
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateEventModal(true)}
                    className="gap-1.5 bg-[#135B3E] hover:bg-[#0e4831]"
                  >
                    <Plus size={14} />
                    <span>New Event</span>
                  </Button>
                </div>
              </div>

              {/* KPI Metric Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1: Total Congregants */}
                <Card className="p-5 border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Active RSVPs</span>
                    <span className="p-2 rounded-xl bg-emerald-50 text-[#135B3E]">
                      <Users size={16} />
                    </span>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                      {totalRegisteredCount}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                      <TrendingUp size={13} />
                      <span>+12.4% vs last week</span>
                    </div>
                  </div>
                </Card>

                {/* Metric 2: Check-in Velocity */}
                <Card className="p-5 border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Check-in Velocity</span>
                    <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                      <UserCheck size={16} />
                    </span>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                      {checkedInCount} <span className="text-sm font-medium text-slate-400">/ {totalRegisteredCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={attendanceRate} className="h-1.5 flex-1" />
                      <span className="text-xs font-semibold text-slate-600">{attendanceRate}%</span>
                    </div>
                  </div>
                </Card>

                {/* Metric 3: Sadaqah & Event Revenue */}
                <Card className="p-5 border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Sadaqah &amp; Revenue</span>
                    <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                      <Sparkles size={16} />
                    </span>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                      $42,850
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                      <TrendingUp size={13} />
                      <span>+$6,200 this week</span>
                    </div>
                  </div>
                </Card>

                {/* Metric 4: Grading Queue */}
                <Card className="p-5 border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Grading Backlog</span>
                    <span className={`p-2 rounded-xl ${pendingGradingCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                      <Award size={16} />
                    </span>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                      {pendingGradingCount}
                    </div>
                    <div className="text-xs text-slate-500">
                      {pendingGradingCount > 0 ? 'Submissions require evaluation' : 'All submissions evaluated'}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Two Column Section: Velocity Curve & Live Ticker */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Attendance Curve */}
                <Card className="lg:col-span-8 p-6 border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Attendance Velocity &amp; Peak Congestion</h3>
                      <p className="text-xs text-slate-500">Hourly gate admissions leading to Asr, Maghrib, and Jumu'a prayers.</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-[#135B3E]">
                      Live Sensor Feeds
                    </Badge>
                  </div>

                  {/* SVG Line / Bar Graphic */}
                  <div className="pt-6 pb-2">
                    <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
                      {[
                        { time: '12 PM', val: 35, count: 140 },
                        { time: '1 PM', val: 95, count: 520, highlight: true },
                        { time: '2 PM', val: 65, count: 310 },
                        { time: '3 PM', val: 40, count: 180 },
                        { time: '4 PM', val: 55, count: 260 },
                        { time: '5 PM', val: 88, count: 480, highlight: true },
                        { time: '6 PM', val: 78, count: 410 },
                        { time: '7 PM', val: 30, count: 120 }
                      ].map((bar, bIdx) => (
                        <div key={bIdx} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                            {bar.count}
                          </div>
                          <div
                            style={{ height: `${bar.val}%` }}
                            className={`w-full rounded-t-lg transition-all group-hover:opacity-90 ${
                              bar.highlight
                                ? 'bg-gradient-to-t from-[#0e4830] to-[#10b981]'
                                : 'bg-slate-200 group-hover:bg-emerald-300'
                            }`}
                          />
                          <span className="text-[10px] font-medium text-slate-500">{bar.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Right: Live Operations Feed */}
                <Card className="lg:col-span-4 p-6 border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Live Operations Feed</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>

                  <div className="space-y-3.5 divide-y divide-slate-100">
                    {registrations.slice(0, 4).map((reg, idx) => (
                      <div key={reg.id} className="pt-2.5 first:pt-0 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-[#135B3E] flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle size={14} />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800 leading-snug">
                            <span className="font-bold">{reg.participantName}</span> checked in to{' '}
                            <span className="text-[#135B3E]">{reg.eventTitle}</span>
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span>Pass {reg.ticketNumber}</span>
                            <span>•</span>
                            <span>Just now</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Quick Jump Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('registrations')}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#135B3E] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#135B3E] transition-colors">
                    Manage Attendees
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    View active ticket passes, inspect QR check-in status, and trigger bulk email receipts.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('grading')}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#135B3E] transition-colors">
                    Grading &amp; Certification
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Review pending recitation recordings and hadith essays, assign rubric marks, and issue Sanad diplomas.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('forms')}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#135B3E] transition-colors">
                    Dynamic Form Studio
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Create custom registration schemas with custom questions, waivers, file uploads, and tiers.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EVENTS & TICKETING CONSOLE                                         */}
          {/* ========================================================================= */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Community Events &amp; Program Roster
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage capacity quotas, speaker assignments, and tier pricing for Masjid Al-Nabi assemblies.
                  </p>
                </div>
                <Button
                  onClick={() => setShowCreateEventModal(true)}
                  className="gap-2 bg-[#135B3E] hover:bg-[#0e4831]"
                >
                  <Plus size={16} />
                  <span>Create Event</span>
                </Button>
              </div>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map((evt) => {
                  const percentFilled = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
                  return (
                    <Card key={evt.id} className="overflow-hidden border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="relative h-44 w-full bg-slate-100">
                        <img
                          src={evt.coverImage}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[#135B3E] font-bold text-[10px] uppercase tracking-wider">
                          {evt.category}
                        </span>
                        <span className="absolute bottom-3 left-3 text-white text-xs font-semibold">
                          {new Date(evt.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                        </span>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                            {evt.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {evt.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-1">
                            <Building size={13} className="text-[#135B3E]" />
                            <span className="truncate">{evt.venueName}</span>
                          </div>
                        </div>

                        {/* Capacity Progress */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Admissions</span>
                            <span className="font-bold text-slate-900">{evt.registeredCount} / {evt.capacity}</span>
                          </div>
                          <Progress value={percentFilled} className="h-1.5" />
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-2 flex items-center justify-between">
                          <Link href={`/events/${evt.id}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              Public Page
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => {
                              setActiveTab('registrations');
                              setSearchAttendee(evt.title);
                            }}
                            className="text-xs bg-[#135B3E] hover:bg-[#0e4831]"
                          >
                            View Attendees
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ATTENDEES & REGISTRATIONS DATA TABLE                              */}
          {/* ========================================================================= */}
          {activeTab === 'registrations' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Attendee Directory &amp; Gate Admissions
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Search congregants, inspect barcode ticket passes, and manage check-in verification in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5">
                    <Download size={14} />
                    <span>Export CSV</span>
                  </Button>
                </div>
              </div>

              {/* Data Table Controls Toolbar */}
              <Card className="p-4 border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
                  {/* Search Input */}
                  <div className="relative w-full md:w-80">
                    <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search by name, email, or pass number..."
                      value={searchAttendee}
                      onChange={(e) => setSearchAttendee(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select
                      value={statusFilter}
                      onChange={(e: any) => setStatusFilter(e.target.value)}
                      className="text-xs h-9 min-w-[130px]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="checked_in">Checked In</option>
                      <option value="registered">Registered</option>
                      <option value="waitlisted">Waitlisted</option>
                      <option value="cancelled">Cancelled</option>
                    </Select>

                    <Select
                      value={tierFilter}
                      onChange={(e: any) => setTierFilter(e.target.value)}
                      className="text-xs h-9 min-w-[130px]"
                    >
                      <option value="all">All Tiers</option>
                      <option value="general">General Pass</option>
                      <option value="vip">VIP Reserved</option>
                      <option value="student">Student Pass</option>
                    </Select>

                    {(searchAttendee || statusFilter !== 'all' || tierFilter !== 'all') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchAttendee('');
                          setStatusFilter('all');
                          setTierFilter('all');
                        }}
                        className="text-xs text-slate-500"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>

                {/* Batch Action Toolbar */}
                {selectedAttendeeIds.length > 0 && (
                  <div className="flex items-center justify-between p-2.5 px-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-[#135B3E] font-medium animate-in fade-in-50">
                    <span>{selectedAttendeeIds.length} congregant(s) selected</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          selectedAttendeeIds.forEach((id) => updateRegistrationStatus(id, 'checked_in'));
                          setSelectedAttendeeIds([]);
                          addToast(`Marked ${selectedAttendeeIds.length} attendee(s) as checked in`, 'success');
                        }}
                        className="h-7 text-xs bg-[#135B3E] text-white"
                      >
                        Mark Checked In
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAttendeeIds([])}
                        className="h-7 text-xs"
                      >
                        Deselect
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* The Enterprise Table */}
              <Card className="border-slate-200/90 shadow-2xs overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                      <TableHead className="w-12 text-center">
                        <input
                          type="checkbox"
                          checked={selectedAttendeeIds.length > 0 && selectedAttendeeIds.length === filteredRegistrations.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </TableHead>
                      <TableHead className="text-xs">Pass Code</TableHead>
                      <TableHead className="text-xs">Congregant Name</TableHead>
                      <TableHead className="text-xs">Event Program</TableHead>
                      <TableHead className="text-xs">Ticket Tier</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-xs text-slate-400">
                          No matching attendee records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRegistrations.map((reg) => {
                        const isSelected = selectedAttendeeIds.includes(reg.id);
                        return (
                          <TableRow key={reg.id} className={isSelected ? 'bg-emerald-50/40' : ''}>
                            <TableCell className="text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectOne(reg.id)}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                            </TableCell>
                            <TableCell className="font-mono text-xs font-bold text-slate-900">
                              {reg.ticketNumber}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-semibold text-xs text-slate-900">{reg.participantName}</span>
                                <span className="text-[11px] text-slate-400">{reg.participantEmail}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-slate-700 max-w-[200px] truncate">
                              {reg.eventTitle}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                                {reg.ticketTierName}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={reg.status === 'checked_in' ? 'success' : reg.status === 'waitlisted' ? 'warning' : 'outline'}
                                className="text-[10px]"
                              >
                                {reg.status === 'checked_in' ? 'Checked In' : reg.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setInspectedRegistration(reg)}
                                  className="h-8 text-xs gap-1 text-slate-600 hover:text-[#135B3E]"
                                >
                                  <Eye size={13} />
                                  <span>Pass</span>
                                </Button>
                                {reg.status !== 'checked_in' && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      updateRegistrationStatus(reg.id, 'checked_in');
                                      addToast(`Checked in ${reg.participantName}`, 'success');
                                    }}
                                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                  >
                                    Check In
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: MANUAL GRADING QUEUE                                               */}
          {/* ========================================================================= */}
          {activeTab === 'grading' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Scholarly Grading &amp; Sanad Evaluation Queue
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Accredited evaluation of recitation auditions, matn memorization, and jurisprudential essays.
                  </p>
                </div>
              </div>

              {manualSubmissions.length === 0 ? (
                <Card className="p-12 text-center border-slate-200/90 shadow-2xs space-y-2">
                  <CheckCircle size={36} className="text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">Grading Queue Empty</h3>
                  <p className="text-xs text-slate-500">All student submissions have been evaluated and certified.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Submissions Queue List */}
                  <div className="lg:col-span-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                      Submissions ({manualSubmissions.length})
                    </h3>
                    <div className="space-y-2">
                      {manualSubmissions.map((sub) => {
                        const isSelected = selectedSubmissionId === sub.id;
                        return (
                          <div
                            key={sub.id}
                            onClick={() => setSelectedSubmissionId(sub.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white border-[#135B3E] shadow-sm ring-2 ring-emerald-500/20'
                                : 'bg-white border-slate-200/90 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{sub.participantName}</span>
                              <Badge variant={sub.status === 'pending_review' ? 'warning' : 'success'} className="text-[10px]">
                                {sub.status === 'pending_review' ? 'Needs Review' : 'Graded'}
                              </Badge>
                            </div>
                            <h4 className="text-xs font-medium text-emerald-800 mt-1 truncate">
                              {sub.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {sub.essayContent || (sub.surahInfo ? `Surah ${sub.surahInfo.surahName} (${sub.surahInfo.qiraatStyle})` : 'Recitation audition recording')}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-100">
                              <span>Submitted {new Date(sub.submittedAt).toLocaleDateString()}</span>
                              <span className="font-semibold text-slate-700">{sub.finalScore ? `${sub.finalScore}%` : 'Unassigned'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Rubric Evaluation Workspace */}
                  <div className="lg:col-span-7">
                    {selectedSubmissionId ? (
                      (() => {
                        const currentSub = manualSubmissions.find((s) => s.id === selectedSubmissionId);
                        if (!currentSub) return null;
                        return (
                          <Card className="p-6 border-slate-200/90 shadow-2xs space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                              <div>
                                <span className="text-[10px] font-bold uppercase text-[#135B3E]">Evaluation Sheet</span>
                                <h3 className="text-lg font-bold text-slate-900">{currentSub.participantName}</h3>
                                <span className="text-xs text-slate-400">{currentSub.title}</span>
                              </div>
                              <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                                {currentSub.id}
                              </span>
                            </div>

                            {/* Student Submission Content Box */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-700 block">Candidate Submission</label>
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                                {currentSub.essayContent || (
                                  <div className="flex items-center gap-3">
                                    <Clock size={20} className="text-emerald-700" />
                                    <div>
                                      <span className="font-bold text-slate-900 block font-sans">Recitation Audio Recording</span>
                                      <span className="text-xs text-slate-500 font-sans">
                                        {currentSub.surahInfo
                                          ? `Surah ${currentSub.surahInfo.surahName} (Ayat ${currentSub.surahInfo.ayahStart}-${currentSub.surahInfo.ayahEnd}) • ${currentSub.surahInfo.qiraatStyle}`
                                          : 'Audio recording submitted'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Score Slider (0 - 100) */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-slate-700">Rubric Mark Allocation</span>
                                <span className="text-lg font-bold text-[#135B3E] tabular-nums">{gradingScore}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={gradingScore}
                                onChange={(e) => setGradingScore(Number(e.target.value))}
                                className="w-full accent-[#135B3E] cursor-pointer"
                              />
                              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                                <span>0% (Fail)</span>
                                <span>60% (Pass)</span>
                                <span>85% (Distinction)</span>
                                <span>100% (Ijaza Sanad)</span>
                              </div>
                            </div>

                            {/* Scholarly Commentary */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 block">Scholarly Feedback &amp; Tajweed Notes</label>
                              <textarea
                                rows={3}
                                value={gradingFeedback}
                                onChange={(e) => setGradingFeedback(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-[#135B3E]"
                              />
                            </div>

                            {/* Submission Approval Action */}
                            <div className="pt-2 flex justify-end gap-2">
                              <Button
                                onClick={() => handleGradeSubmission(currentSub.id)}
                                className="bg-[#135B3E] hover:bg-[#0e4831] text-white"
                              >
                                Commit Evaluation &amp; Issue Sanad
                              </Button>
                            </div>
                          </Card>
                        );
                      })()
                    ) : (
                      <Card className="p-12 text-center text-xs text-slate-400 border-slate-200/90">
                        Select a candidate submission from the queue to evaluate.
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: COMPETITIONS & QUESTION BANK                                       */}
          {/* ========================================================================= */}
          {activeTab === 'competitions' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Tournaments &amp; Examination Programs
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage active academic competitions, registration deadlines, and question banks.
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddQuestionModal(true)}
                  className="gap-2 bg-[#135B3E] hover:bg-[#0e4831]"
                >
                  <Plus size={16} />
                  <span>Add Question to Bank</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {competitions.map((comp) => (
                  <Card key={comp.id} className="p-6 border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-[#135B3E] px-2 py-0.5 rounded-full bg-emerald-50">
                          {comp.category}
                        </span>
                        <Badge variant="success" className="text-[10px]">
                          Active Round
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{comp.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{comp.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>{comp.enrolledCount} Candidates</span>
                      <span>Prize: {comp.prizes?.[0]?.award || 'Sanad Diploma'}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2">
                      <Link href={`/test/${comp.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                          <span>Launch Exam</span>
                          <ArrowUpRight size={13} />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: QUESTION BANK                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'questions' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Question Bank &amp; Item Registry
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Canonical test items with Arabic matn, isnad classifications, and psychometric discrimination indices.
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddQuestionModal(true)}
                  className="gap-2 bg-[#135B3E] hover:bg-[#0e4831]"
                >
                  <Plus size={16} />
                  <span>Add Question</span>
                </Button>
              </div>

              <div className="space-y-3">
                {questions.map((q) => (
                  <Card key={q.id} className="p-5 border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-emerald-800">
                          {q.category}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500 capitalize">{q.difficulty}</span>
                        <span className="text-xs text-slate-400">• {q.marks} Marks</span>
                      </div>
                      <button
                        onClick={() => {
                          deleteQuestion(q.id);
                          addToast('Question removed from bank', 'info');
                        }}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{q.questionText}</h4>
                    {q.arabicText && (
                      <p className="text-base text-right text-emerald-950 font-arabic leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                        {q.arabicText}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Source: {q.sourceReference}</span>
                      <span className="text-emerald-700 font-semibold">{q.options?.length || 0} Options</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: DYNAMIC FORM BUILDER                                               */}
          {/* ========================================================================= */}
          {activeTab === 'forms' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Dynamic Registration Form Studio
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Design custom registration schemas with waiver agreements, custom demographic prompts, and admission tiers.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                <FormBuilder
                  initialForm={forms[0]}
                  onSave={(saved) => {
                    saveForm(saved);
                    addToast('Form schema committed and live', 'success');
                  }}
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: ANNOUNCEMENTS                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Community Announcements &amp; Advisories
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Dispatch live updates to all congregants via portal headers and mobile notifications.
                  </p>
                </div>
                <Button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="gap-2 bg-[#135B3E] hover:bg-[#0e4831]"
                >
                  <Plus size={16} />
                  <span>Broadcast Notice</span>
                </Button>
              </div>

              <div className="space-y-3">
                {announcements.map((anc) => (
                  <Card key={anc.id} className="p-5 border-slate-200/90 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#135B3E] px-2 py-0.5 rounded-full bg-emerald-50">
                        {anc.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">By {anc.author}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{anc.title}</h3>
                    {anc.arabicTitle && (
                      <h4 className="text-sm font-bold text-right text-emerald-900 font-arabic">{anc.arabicTitle}</h4>
                    )}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{anc.content}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: SETTINGS                                                           */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  System Settings &amp; Center Profile
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Configure prayer calculation parameters, currency formats, and institutional credentials.
                </p>
              </div>

              <Card className="p-6 border-slate-200/90 shadow-2xs space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Masjid Identity</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Institution Legal Name</label>
                      <Input defaultValue="Hejrat Foundation Masjid Al-Nabi" className="text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Physical Address</label>
                      <Input defaultValue="West Covina, California, USA" className="text-xs" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Adhan &amp; Calculation Parameters</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Calculation Method</label>
                      <Select defaultValue="isna" className="text-xs">
                        <option value="isna">Islamic Society of North America (ISNA)</option>
                        <option value="mwl">Muslim World League (MWL)</option>
                        <option value="makkah">Umm al-Qura University, Makkah</option>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Juristic Method (Asr)</label>
                      <Select defaultValue="standard" className="text-xs">
                        <option value="standard">Standard (Shafi'i, Maliki, Hanbali)</option>
                        <option value="hanafi">Hanafi</option>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    onClick={() => addToast('System preferences saved successfully', 'success')}
                    className="bg-[#135B3E] hover:bg-[#0e4831]"
                  >
                    Save Changes
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE EVENT DIALOG                                                */}
      {/* ========================================================================= */}
      <Dialog open={showCreateEventModal} onOpenChange={setShowCreateEventModal}>
        <DialogContent onClose={() => setShowCreateEventModal(false)}>
          <DialogHeader>
            <DialogTitle>Create New Community Event</DialogTitle>
            <DialogDescription>
              Publish a new assembly, halaqa, or competition to the public calendar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEventSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Event Title</label>
              <Input
                placeholder="e.g. Weekly Quranic Recitation & Tafseer Intensive"
                value={eventFormTitle}
                onChange={(e) => setEventFormTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Program Category</label>
                <Select
                  value={eventFormCategory}
                  onChange={(e: any) => setEventFormCategory(e.target.value)}
                >
                  <option value="conference">Conference / Intensive</option>
                  <option value="quran-recitation">Quran Recitation</option>
                  <option value="islamic-studies">Islamic Studies</option>
                  <option value="youth-assembly">Youth Assembly</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Capacity Limit</label>
                <Input
                  type="number"
                  value={eventFormCapacity}
                  onChange={(e) => setEventFormCapacity(Number(e.target.value))}
                  min={10}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Venue</label>
                <Input
                  value={eventFormVenue}
                  onChange={(e) => setEventFormVenue(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Start Date &amp; Time</label>
                <Input
                  type="datetime-local"
                  value={eventFormDate}
                  onChange={(e) => setEventFormDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateEventModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#135B3E] hover:bg-[#0e4831]">
                Publish Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL: ADD QUESTION TO BANK DIALOG                                        */}
      {/* ========================================================================= */}
      <Dialog open={showAddQuestionModal} onOpenChange={setShowAddQuestionModal}>
        <DialogContent onClose={() => setShowAddQuestionModal(false)}>
          <DialogHeader>
            <DialogTitle>Add Test Item to Question Bank</DialogTitle>
            <DialogDescription>
              Create a multiple choice or essay prompt with canonical references.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddQuestionSubmit} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">English Question Prompt</label>
              <Input
                placeholder="e.g. Which companion transmitted the Hadith of Jibreel explaining Islam, Iman, and Ihsan?"
                value={newQText}
                onChange={(e) => setNewQText(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Arabic Matn (Optional)</label>
              <Input
                placeholder="نص السؤال باللغة العربية"
                value={newQArabic}
                onChange={(e) => setNewQArabic(e.target.value)}
                className="text-right font-arabic"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <Select
                  value={newQCategory}
                  onChange={(e: any) => setNewQCategory(e.target.value)}
                >
                  <option value="hadith-mastery">Hadith Mastery</option>
                  <option value="quranic-studies">Quranic Studies</option>
                  <option value="fiqh-jurisprudence">Fiqh / Jurisprudence</option>
                  <option value="seerah">Prophetic Seerah</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Source Reference</label>
                <Input
                  placeholder="e.g. Sahih Muslim (Book 1)"
                  value={newQSource}
                  onChange={(e) => setNewQSource(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Explanation &amp; Commentary</label>
              <textarea
                rows={2}
                placeholder="Scholarly commentary and proof for the correct option..."
                value={newQExplanation}
                onChange={(e) => setNewQExplanation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-[#135B3E]"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddQuestionModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#135B3E] hover:bg-[#0e4831]">
                Save to Bank
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL: BROADCAST ANNOUNCEMENT DIALOG                                      */}
      {/* ========================================================================= */}
      <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
        <DialogContent onClose={() => setShowAnnouncementModal(false)}>
          <DialogHeader>
            <DialogTitle>Broadcast Community Notice</DialogTitle>
            <DialogDescription>
              Send an alert to congregant portal feeds.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePublishAnnouncement} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Title</label>
              <Input
                placeholder="e.g. Salat al-Jumu'a Timing Advisory"
                value={newAncTitle}
                onChange={(e) => setNewAncTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Content</label>
              <textarea
                rows={3}
                placeholder="Full notice text..."
                value={newAncContent}
                onChange={(e) => setNewAncContent(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-[#135B3E]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <Select
                value={newAncCategory}
                onChange={(e: any) => setNewAncCategory(e.target.value)}
              >
                <option value="general">General Community</option>
                <option value="urgent">Urgent Advisory</option>
                <option value="schedule">Schedule Adjustment</option>
                <option value="competition">Competition / Exam</option>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAnnouncementModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#135B3E] hover:bg-[#0e4831]">
                Dispatch Notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* SHEET: INSPECT ATTENDEE & TICKET PASS DRAWER                              */}
      {/* ========================================================================= */}
      <Sheet open={!!inspectedRegistration} onOpenChange={(open) => !open && setInspectedRegistration(null)}>
        {inspectedRegistration && (
          <div className="space-y-6">
            <SheetHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono text-[#135B3E]">
                  {inspectedRegistration.ticketNumber}
                </Badge>
                <Badge variant={inspectedRegistration.status === 'checked_in' ? 'success' : 'outline'} className="text-[10px]">
                  {inspectedRegistration.status}
                </Badge>
              </div>
              <SheetTitle>{inspectedRegistration.participantName}</SheetTitle>
              <SheetDescription>{inspectedRegistration.eventTitle}</SheetDescription>
            </SheetHeader>

            {/* Visual Digital Ticket Pass Preview */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c4427] to-[#072517] text-white shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200">
                  HEJRAT FOUNDATION PASS
                </span>
                <span className="text-xs font-bold text-white">
                  {inspectedRegistration.ticketTierName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-bold text-white block">{inspectedRegistration.eventTitle}</span>
                <span className="text-xs text-emerald-100/80 block">Masjid Al-Nabi • West Covina Hall</span>
              </div>

              {/* Barcode & Mock QR */}
              <div className="p-4 bg-white rounded-xl flex items-center justify-between text-slate-900">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono block">GATE ADMISSION CODE</span>
                  <span className="text-sm font-black font-mono tracking-wider block">{inspectedRegistration.ticketNumber}</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                  <QrCode size={32} />
                </div>
              </div>
            </div>

            {/* Attendee Details */}
            <div className="space-y-3 pt-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Email Address</span>
                <span className="font-semibold text-slate-800">{inspectedRegistration.participantEmail}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Phone Number</span>
                <span className="font-semibold text-slate-800">{inspectedRegistration.participantPhone || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Registration Date</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {new Date(inspectedRegistration.registeredAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <SheetFooter>
              {inspectedRegistration.status !== 'checked_in' ? (
                <Button
                  onClick={() => {
                    updateRegistrationStatus(inspectedRegistration.id, 'checked_in');
                    setInspectedRegistration({ ...inspectedRegistration, status: 'checked_in' });
                    addToast(`Checked in ${inspectedRegistration.participantName}`, 'success');
                  }}
                  className="w-full bg-[#135B3E] hover:bg-[#0e4831] text-white"
                >
                  Verify &amp; Admit Attendee
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    updateRegistrationStatus(inspectedRegistration.id, 'approved');
                    setInspectedRegistration({ ...inspectedRegistration, status: 'approved' });
                    addToast(`Reverted check-in for ${inspectedRegistration.participantName}`, 'info');
                  }}
                  className="w-full text-xs text-slate-600"
                >
                  Undo Check-in
                </Button>
              )}
            </SheetFooter>
          </div>
        )}
      </Sheet>
    </div>
  );
}
