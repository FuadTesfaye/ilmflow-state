'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { AccessDeniedCard } from '../../components/common/PermissionGate';
import {
  EventItem,
  RegistrationRecord,
  CertificateItem,
  ManualSubmission,
  RubricCriterion,
  CompetitionItem,
  CompetitionQuestion
} from '../../types';
import { EnterpriseSidebar } from '../../components/dashboard/EnterpriseSidebar';
import { EnterpriseTopbar } from '../../components/dashboard/EnterpriseTopbar';
import { MobileBottomNav } from '../../components/dashboard/MobileBottomNav';
import { ExecutiveKpiGrid } from '../../components/dashboard/ExecutiveKpiGrid';
import { PrayerTimeWidget } from '../../components/dashboard/PrayerTimeWidget';
import { CommandPaletteModal } from '../../components/dashboard/CommandPaletteModal';
import { ManualGradingModal } from '../../components/competition/ManualGradingModal';
import { FlowRegistrationModal } from '../../components/registration/FlowRegistrationModal';
import { CertificateView } from '../../components/certificates/CertificateView';
import { IslamicStarEmblem } from '../../components/common/IslamicPattern';

// UI Primitives
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';

// Icons
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
  Trash2,
  Eye,
  Heart,
  Volume2,
  Ticket,
  MapPin,
  Share2,
  Copy,
  Info,
  DollarSign,
  UserCheck,
  HelpCircle,
  Filter
} from 'lucide-react';

export default function MasterDashboardPage() {
  const {
    currentUser,
    can,
    isTabPermitted,
    currentRoleMeta,
    events,
    createEvent,
    competitions,
    questions,
    addQuestion,
    deleteQuestion,
    registrations,
    updateRegistrationStatus,
    certificates,
    announcements,
    addAnnouncement,
    manualSubmissions,
    quizAttempts,
    addToast
  } = useApp();

  // Layout state
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Auto-switch to authorized homeTab if activeTab is not permitted for the active role
  useEffect(() => {
    if (!isTabPermitted(activeTab)) {
      setActiveTab(currentRoleMeta.homeTab);
    }
  }, [currentUser.role, isTabPermitted, activeTab, currentRoleMeta.homeTab]);

  // Modals state
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<EventItem | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<ManualSubmission | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [inspectedAttendee, setInspectedAttendee] = useState<RegistrationRecord | null>(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateAmount, setDonateAmount] = useState(100);
  const [copiedId, setCopiedId] = useState(false);

  // Filter & Search states
  const [searchAttendee, setSearchAttendee] = useState('');
  const [attendeeStatusFilter, setAttendeeStatusFilter] = useState<'all' | 'checked_in' | 'registered' | 'waitlisted'>('all');
  const [attendeeTierFilter, setAttendeeTierFilter] = useState<'all' | 'general' | 'vip' | 'student'>('all');

  const [searchEvent, setSearchEvent] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('all');

  const [questionCategoryFilter, setQuestionCategoryFilter] = useState<string>('all');
  const [gradingFilter, setGradingFilter] = useState<'all' | 'pending' | 'graded'>('all');

  // Form states
  const [eventFormTitle, setEventFormTitle] = useState('');
  const [eventFormCapacity, setEventFormCapacity] = useState(300);
  const [eventFormCategory, setEventFormCategory] = useState<any>('conference');

  const [newQText, setNewQText] = useState('');
  const [newQArabic, setNewQArabic] = useState('');
  const [newQExplanation, setNewQExplanation] = useState('');
  const [newQMarks, setNewQMarks] = useState(5);
  const [newQCategory, setNewQCategory] = useState<any>('hadith-mastery');
  const [newQSource, setNewQSource] = useState('');

  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState<'urgent' | 'schedule' | 'competition' | 'general'>('general');

  // User-scoped data
  const myRegistrations = registrations.filter(
    (r) => r.userId === currentUser.id || r.participantEmail === currentUser.email
  );

  // Filtered Attendees
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.participantName.toLowerCase().includes(searchAttendee.toLowerCase()) ||
      r.participantEmail.toLowerCase().includes(searchAttendee.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchAttendee.toLowerCase());
    const matchesStatus = attendeeStatusFilter === 'all' || r.status === attendeeStatusFilter;
    const matchesTier = attendeeTierFilter === 'all' || r.ticketTierName.toLowerCase().includes(attendeeTierFilter);
    return matchesSearch && matchesStatus && matchesTier;
  });

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchEvent.toLowerCase()) || e.subtitle.toLowerCase().includes(searchEvent.toLowerCase());
    const matchesCat = eventCategoryFilter === 'all' || e.category === eventCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    return questionCategoryFilter === 'all' || q.category === questionCategoryFilter;
  });

  // Filtered Grading
  const filteredGrading = manualSubmissions.filter((s) => {
    if (gradingFilter === 'pending') return s.status === 'pending_review';
    if (gradingFilter === 'graded') return s.status === 'graded';
    return true;
  });

  // Helpers
  const handleCopyMemberId = () => {
    navigator.clipboard?.writeText(currentUser.id);
    setCopiedId(true);
    addToast('Member ID copied to clipboard', 'info');
    setTimeout(() => setCopiedId(false), 2000);
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
      venueName: 'Masjid Al-Nabi Banquet Hall',
      venueAddress: '1505 W Garvey Ave N, West Covina, CA 91790',
      startDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 7 + 4 * 3600000).toISOString(),
      registrationDeadline: new Date(Date.now() + 86400000 * 6).toISOString(),
      timeZone: 'America/Los_Angeles',
      description: 'Congregational assembly, spiritual contemplation, and community dinner at Masjid Al-Nabi.',
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      status: 'upcoming',
      languages: ['English', 'Arabic'],
      formId: 'default-registration',
      prayerTimes: {
        fajr: '05:32 AM',
        dhuhr: '12:45 PM',
        asr: '04:12 PM',
        maghrib: '06:38 PM',
        isha: '07:54 PM',
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
      explanation: newQExplanation || 'Verified against authentic source commentaries.',
      sourceReference: newQSource || 'Sahih al-Bukhari & Muslim',
      options: [
        { id: 'opt_1', text: 'Primary authentic opinion (Mu’tamad)', arabicText: 'القول المعتمد' },
        { id: 'opt_2', text: 'Secondary variant opinion', arabicText: 'وجه آخر' },
        { id: 'opt_3', text: 'Grammatical distinction', arabicText: 'وجه إعرابي' }
      ],
      correctAnswer: 'opt_1'
    });

    setShowAddQuestionModal(false);
    setNewQText('');
    setNewQArabic('');
    setNewQExplanation('');
    setNewQSource('');
    addToast('Question successfully added to Islamic question repository', 'success');
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim()) return;

    addAnnouncement({
      title: announcementTitle,
      content: announcementContent,
      category: announcementCategory,
      author: currentUser.name,
      isPinned: true
    });

    setShowAnnouncementModal(false);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    addToast('Secretariat announcement broadcasted successfully', 'success');
  };

  const handleQuickAction = (action: string) => {
    if (action === 'create-event') setShowCreateEventModal(true);
    if (action === 'add-question') setShowAddQuestionModal(true);
    if (action === 'new-announcement') setShowAnnouncementModal(true);
    if (action === 'export-csv') handleExportCSV();
  };

  const getRubricForSubmission = (sub: ManualSubmission): RubricCriterion[] => {
    const comp = competitions.find((c) => c.id === sub.competitionId);
    const round = comp?.rounds.find((r) => r.id === sub.roundId) || comp?.rounds[0];
    return (
      round?.rubric || [
        { id: 'rub-tajweed', name: 'Tajweed Rules & Characteristics', description: 'Application of Ghunnah, Madd, Ikhfa, Idgham, and Qalqalah.', maxScore: 30 },
        { id: 'rub-memorization', name: 'Memorization & Fluency', description: 'Fluency without hesitation.', maxScore: 30 },
        { id: 'rub-makharij', name: 'Articulation Points (Makharij)', description: 'Phoneme clarity.', maxScore: 20 },
        { id: 'rub-voice', name: 'Vocal Resonance & Melody', description: 'Natural melodic cadence.', maxScore: 10 },
        { id: 'rub-overall', name: 'Adab & Thematic Pauses (Waqf)', description: 'Respecting Quranic pauses.', maxScore: 10 }
      ]
    );
  };

  const tabLabels: Record<string, string> = {
    overview: 'Executive Overview',
    events: 'Events & Programs',
    registrations: 'Attendees & Check-in Gate',
    competitions: 'Tournaments & Exams',
    grading: 'Grading Queue',
    questions: 'Islamic Question Bank',
    passes: 'My Passes & Lanyard',
    certificates: 'Sanad Diplomas',
    giving: 'Waqf & Giving Hub',
    announcements: 'Announcements',
    settings: 'System Settings'
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5] font-sans text-slate-900">
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        {/* Global Topbar */}
        <EnterpriseTopbar
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onQuickAction={handleQuickAction}
          currentTabName={tabLabels[activeTab] || 'Dashboard'}
        />

        {/* Command Palette Modal (⌘K) */}
        <CommandPaletteModal
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* Dynamic Canvas Container */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {!isTabPermitted(activeTab) ? (
            <AccessDeniedCard
              title={`Access Restricted: ${tabLabels[activeTab] || activeTab}`}
              description={`Your active persona '${currentUser.role}' (${currentRoleMeta.label}) does not have permission to access the ${tabLabels[activeTab] || activeTab} module.`}
              onReturnHome={() => setActiveTab(currentRoleMeta.homeTab)}
            />
          ) : (
            <>
              {/* ========================================================================= */}
              {/* TAB 1: EXECUTIVE OVERVIEW                                                 */}
              {/* ========================================================================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in-50 duration-150">
                  {/* Executive Header Banner */}
                  <div className="relative rounded-2xl bg-gradient-to-r from-[#0c4427] via-[#135b3e] to-[#0a3820] text-white p-5 sm:p-7 shadow-sanctuary border border-emerald-400/20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                            Hejrat Foundation • Masjid Al-Nabi
                          </span>
                          <span className="text-emerald-300/60 text-xs">•</span>
                          <span className="text-emerald-200 text-xs font-arabic">١٤٤٨ هـ</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                          Executive Command Center
                        </h1>
                        <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
                          Real-time operational intelligence across Masjid Al-Nabi congregational summits, gate admissions, Quranic tournaments, and accredited diplomas.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {can('event:create') && (
                          <Button
                            size="sm"
                            onClick={() => setShowCreateEventModal(true)}
                            className="bg-white text-[#135B3E] hover:bg-emerald-50 font-bold rounded-xl shadow-xs"
                          >
                            <Plus size={15} className="mr-1" />
                            Create Program
                          </Button>
                        )}
                        {can('attendance:scan') && (
                          <Button
                            size="sm"
                            onClick={() => setActiveTab('registrations')}
                            className="bg-emerald-800 text-white hover:bg-emerald-900 font-bold rounded-xl shadow-xs border border-emerald-400/30"
                          >
                            <QrCode size={15} className="mr-1" />
                            Gate Scanner
                          </Button>
                        )}
                        {can('submission:grade') && (
                          <Button
                            size="sm"
                            onClick={() => setActiveTab('grading')}
                            className="bg-amber-600 text-white hover:bg-amber-700 font-bold rounded-xl shadow-xs"
                          >
                            <Award size={15} className="mr-1" />
                            Grading Queue
                          </Button>
                        )}
                        {can('pass:view_own') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveTab('passes')}
                            className="text-white border-white/20 hover:bg-white/10 rounded-xl"
                          >
                            <Ticket size={15} className="mr-1" />
                            My Delegate Pass
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

              {/* 5-Column Responsive KPI Grid */}
              <ExecutiveKpiGrid onNavigateTab={(tab) => setActiveTab(tab)} />

              {/* Dual Pane: Congregational Prayers & Gate Velocity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 cols: Live Prayer Times Widget */}
                <div className="lg:col-span-7">
                  <PrayerTimeWidget />
                </div>

                {/* Right 5 cols: Live Gate Attendance Velocity */}
                <div className="lg:col-span-5">
                  <Card className="p-5 bg-white border-slate-200/90 shadow-xs h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                          <h3 className="text-sm font-bold text-slate-900">Live Gate Attendance</h3>
                        </div>
                        <Badge variant="outline" className="text-[10px] text-emerald-800 bg-emerald-50 border-emerald-200">
                          Active Terminal
                        </Badge>
                      </div>

                      <div className="py-4 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-extrabold text-slate-900">
                            {registrations.filter((r) => r.status === 'checked_in').length}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            of {registrations.length} Total Admitted ({registrations.length > 0 ? Math.round((registrations.filter((r) => r.status === 'checked_in').length / registrations.length) * 100) : 0}%)
                          </span>
                        </div>

                        <Progress
                          value={registrations.length > 0 ? (registrations.filter((r) => r.status === 'checked_in').length / registrations.length) * 100 : 0}
                          className="h-2.5 bg-slate-100"
                        />

                        <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-semibold">HALL CAPACITY</span>
                            <span className="font-bold text-slate-800">500 Seats</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-semibold">VELOCITY</span>
                            <span className="font-bold text-emerald-700">~14 scans / min</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Optical scanner active</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setActiveTab('registrations')}
                        className="text-xs text-[#135B3E] font-semibold hover:bg-emerald-50 p-0 h-auto"
                      >
                        Open Scanner Terminal →
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Recent Activity & Secretariat Notices */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Registrations Feed */}
                <Card className="p-5 bg-white border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Latest Attendees Registered</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveTab('registrations')}
                      className="text-xs text-[#135B3E] font-semibold"
                    >
                      View All ({registrations.length})
                    </Button>
                  </div>
                  <div className="divide-y divide-slate-100 mt-2">
                    {registrations.slice(0, 4).map((reg) => (
                      <div key={reg.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                            {reg.participantName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 truncate block">
                              {reg.participantName}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate block">
                              {reg.eventTitle} • {reg.ticketTierName}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={reg.status === 'checked_in' ? 'success' : 'outline'}
                          className="text-[10px] shrink-0"
                        >
                          {reg.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Secretariat Announcements */}
                <Card className="p-5 bg-white border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Secretariat Broadcasts</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowAnnouncementModal(true)}
                      className="text-xs text-[#135B3E] font-semibold"
                    >
                      + New Broadcast
                    </Button>
                  </div>
                  <div className="divide-y divide-slate-100 mt-2">
                    {announcements.slice(0, 3).map((item) => (
                      <div key={item.id} className="py-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#135B3E] uppercase">{item.category}</span>
                          <span className="text-[10px] text-slate-400">Published</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EVENTS & TICKETING                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Events &amp; Programs</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage congregational summits, youth intensives, and ticketing quotas.
                  </p>
                </div>
                {can('event:create') && (
                  <Button
                    onClick={() => setShowCreateEventModal(true)}
                    className="bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl shadow-xs self-start sm:self-auto"
                  >
                    <Plus size={16} className="mr-1.5" />
                    Create New Event
                  </Button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search events by title..."
                    value={searchEvent}
                    onChange={(e) => setSearchEvent(e.target.value)}
                    className="pl-9 bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={eventCategoryFilter}
                    onChange={(e) => setEventCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="conference">Conference</option>
                    <option value="competition">Competition</option>
                    <option value="workshop">Workshop</option>
                    <option value="youth-summit">Youth Summit</option>
                  </select>
                </div>
              </div>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvents.map((evt) => {
                  const capacityPercent = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));

                  return (
                    <Card key={evt.id} className="bg-white border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-[#135B3E] border-emerald-200 bg-emerald-50">
                            {evt.category}
                          </Badge>
                          <span className="text-[11px] text-slate-400 capitalize">{evt.format}</span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-900 leading-tight">
                            {evt.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2">{evt.subtitle}</p>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Capacity Occupancy</span>
                            <span className="font-semibold text-slate-800">
                              {evt.registeredCount} / {evt.capacity} ({capacityPercent}%)
                            </span>
                          </div>
                          <Progress value={capacityPercent} className="h-2 bg-slate-100" />
                        </div>

                        <div className="pt-2 text-xs text-slate-500 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#135B3E]" />
                            <span className="truncate">{evt.venueName}, {evt.venueAddress}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-700">
                          {evt.tickets[0]?.price === 0 ? 'Free Admission' : `$${evt.tickets[0]?.price}`}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setSelectedEventForRegister(evt)}
                          className="bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl text-xs font-semibold"
                        >
                          Register Guest
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ATTENDEES & GATE CHECK-IN                                          */}
          {/* ========================================================================= */}
          {activeTab === 'registrations' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Attendees &amp; Gate Terminal</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Live arrivals, barcode token scanning, and credential badges.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportCSV}
                    className="border-slate-200 text-slate-700 rounded-xl"
                  >
                    <Download size={14} className="mr-1.5" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search attendee by name, email, or ticket #..."
                    value={searchAttendee}
                    onChange={(e) => setSearchAttendee(e.target.value)}
                    className="pl-9 bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={attendeeStatusFilter}
                    onChange={(e) => setAttendeeStatusFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="checked_in">Checked In</option>
                    <option value="registered">Registered</option>
                    <option value="waitlisted">Waitlisted</option>
                  </select>
                </div>
              </div>

              {/* Attendees Table / Mobile Responsive Cards */}
              <Card className="bg-white border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow>
                        <TableHead className="text-xs font-bold text-slate-700">Ticket #</TableHead>
                        <TableHead className="text-xs font-bold text-slate-700">Attendee</TableHead>
                        <TableHead className="text-xs font-bold text-slate-700 hidden md:table-cell">Program</TableHead>
                        <TableHead className="text-xs font-bold text-slate-700">Status</TableHead>
                        <TableHead className="text-xs font-bold text-slate-700 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100 text-xs">
                      {filteredRegistrations.map((reg) => (
                        <TableRow key={reg.id} className="hover:bg-slate-50/60">
                          <TableCell className="font-mono font-bold text-emerald-900">
                            {reg.ticketNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-bold text-slate-900 block">{reg.participantName}</span>
                              <span className="text-[11px] text-slate-400 font-mono block">{reg.participantEmail}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-slate-600">
                            <span className="truncate block max-w-xs">{reg.eventTitle}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{reg.ticketTierName}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={reg.status === 'checked_in' ? 'success' : 'outline'}
                              className="text-[10px]"
                            >
                              {reg.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {can('registration:checkin') && reg.status !== 'checked_in' && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    updateRegistrationStatus(reg.id, 'checked_in');
                                    addToast(`${reg.participantName} checked in at arrival gate`, 'success');
                                  }}
                                  className="h-7 text-xs bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-lg px-2"
                                >
                                  Check In
                                </Button>
                              )}
                              {reg.status === 'checked_in' && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold px-2 py-1 bg-emerald-50 rounded-lg">
                                  <Check size={12} />
                                  Admitted
                                </span>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setInspectedAttendee(reg)}
                                className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                                title="View pass"
                              >
                                <Eye size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: COMPETITIONS & EXAMS                                               */}
          {/* ========================================================================= */}
          {activeTab === 'competitions' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Academic Tournaments &amp; Contests</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Proctored tests, Quran recitation championships, and Hadith tournaments.
                  </p>
                </div>
                <Link href="/competitions">
                  <Button className="bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl shadow-xs">
                    Browse All Brackets
                  </Button>
                </Link>
              </div>

              {/* Competitions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {competitions.map((comp) => (
                  <Card key={comp.id} className="p-5 bg-white border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] font-bold text-[#9E782F] border-amber-200 bg-amber-50">
                          {comp.category}
                        </Badge>
                        <span className="text-xs text-slate-400 font-semibold">{comp.rounds.length} Rounds</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">{comp.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{comp.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Passing: <strong>{comp.rounds[0]?.passingScore || 80} pts</strong></span>
                        <span className="text-emerald-700 font-semibold">
                          {comp.rounds[0]?.questionIds?.length || 20} Questions
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link href={`/test/${comp.id}`} className="w-full">
                        <Button size="sm" className="w-full bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl text-xs font-semibold">
                          Launch Contest Engine →
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: GRADING QUEUE                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'grading' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Adjudication &amp; Grading Queue</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Audit Quran recitation audio recordings and scholarly treatises using 100-point standardized rubrics.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={gradingFilter}
                    onChange={(e) => setGradingFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="all">All Submissions</option>
                    <option value="pending">Pending Review Only</option>
                    <option value="graded">Graded Only</option>
                  </select>
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-3">
                {filteredGrading.map((sub) => {
                  return (
                    <Card key={sub.id} className="p-4 sm:p-5 bg-white border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#9E782F] shrink-0">
                          {sub.type === 'audio' ? <Volume2 size={20} /> : <FileText size={20} />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{sub.participantName}</span>
                            <Badge
                              variant={sub.status === 'pending_review' ? 'destructive' : 'success'}
                              className="text-[10px]"
                            >
                              {sub.status === 'pending_review' ? 'Pending Audit' : 'Graded'}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            {sub.title} • Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                          </p>
                          {sub.surahInfo && (
                            <p className="text-[11px] text-slate-400 italic">
                              Surah {sub.surahInfo.surahName} (Ayahs {sub.surahInfo.ayahStart}-{sub.surahInfo.ayahEnd}) • {sub.surahInfo.qiraatStyle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {sub.grades && sub.grades.length > 0 && (
                          <div className="text-right mr-2">
                            <span className="text-xs text-slate-400 block">Final Score</span>
                            <span className="text-sm font-extrabold text-[#135B3E]">
                              {sub.grades[0].totalScore} / 100
                            </span>
                          </div>
                        )}
                        {can('submission:grade') ? (
                          <Button
                            size="sm"
                            onClick={() => setGradingSubmission(sub)}
                            className="bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl text-xs font-semibold"
                          >
                            {sub.status === 'pending_review' ? 'Audit & Score' : 'Edit Score'}
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded-lg">
                            Read-only
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                })}
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
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Islamic Question Bank</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Repository of vetted questions covering Tajweed, Hadith, Jurisprudence, and Seerah.
                  </p>
                </div>
                {can('question:create') && (
                  <Button
                    onClick={() => setShowAddQuestionModal(true)}
                    className="bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl shadow-xs self-start sm:self-auto"
                  >
                    <Plus size={16} className="mr-1.5" />
                    Add Question
                  </Button>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {filteredQuestions.map((q) => (
                  <Card key={q.id} className="p-5 bg-white border-slate-200/90 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold text-[#135B3E] bg-emerald-50 border-emerald-200">
                          {q.category}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {q.difficulty}
                        </Badge>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{q.marks} Marks</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">{q.questionText}</p>
                      {q.arabicText && (
                        <p className="font-arabic text-base text-emerald-900 pt-1" dir="rtl">
                          {q.arabicText}
                        </p>
                      )}
                    </div>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {q.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                              opt.id === q.correctAnswer
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>{opt.text}</span>
                            {opt.id === q.correctAnswer && <Check size={14} className="text-[#135B3E]" />}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Source: <strong>{q.sourceReference}</strong></span>
                      {can('question:delete') && (
                        <button
                          onClick={() => {
                            deleteQuestion(q.id);
                            addToast('Question removed from bank', 'info');
                          }}
                          className="text-rose-600 hover:text-rose-800 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: MY PASSES & DIGITAL LANYARD                                        */}
          {/* ========================================================================= */}
          {activeTab === 'passes' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              {/* Member Identity Badge */}
              <div className="relative rounded-3xl bg-gradient-to-r from-[#0c4427] via-[#135b3e] to-[#08301c] text-white p-6 sm:p-8 shadow-sanctuary border border-emerald-400/25 overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] text-emerald-200 border-emerald-400/40 bg-emerald-950/40">
                          {currentUser.role} credential
                        </Badge>
                        <button
                          onClick={handleCopyMemberId}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-200/80 hover:text-white bg-black/20 px-2 py-0.5 rounded cursor-pointer"
                        >
                          <span>{currentUser.id}</span>
                          {copiedId ? <Check size={11} className="text-emerald-300" /> : <Copy size={11} />}
                        </button>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">{currentUser.name}</h2>
                      <p className="text-xs text-emerald-100/80">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-md">
                      <QrCode size={28} />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-white block">Fast Check-in Pass</span>
                      <span className="text-[10px] text-emerald-200 block">Scan at Masjid Al-Nabi Gate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Passes List */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">Enrolled Passes &amp; Admissions</h3>
                {myRegistrations.length === 0 ? (
                  <Card className="p-8 text-center bg-white border-slate-200 space-y-3">
                    <Ticket size={36} className="mx-auto text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">No active passes under this account yet</p>
                    <Button
                      onClick={() => setActiveTab('events')}
                      className="bg-[#135B3E] text-white rounded-xl text-xs"
                    >
                      Browse Programs &amp; Register
                    </Button>
                  </Card>
                ) : (
                  myRegistrations.map((reg) => (
                    <Card key={reg.id} className="p-5 bg-white border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#135B3E]">{reg.ticketNumber}</span>
                          <Badge variant={reg.status === 'checked_in' ? 'success' : 'outline'} className="text-[10px]">
                            {reg.status}
                          </Badge>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">{reg.eventTitle}</h4>
                        <p className="text-xs text-slate-500">{reg.ticketTierName} • Masjid Al-Nabi Campus</p>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => setInspectedAttendee(reg)}
                        className="bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl text-xs font-semibold self-end sm:self-auto"
                      >
                        <QrCode size={14} className="mr-1.5" />
                        View QR Lanyard Pass
                      </Button>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: CERTIFICATES & SANAD DIPLOMAS                                      */}
          {/* ========================================================================= */}
          {activeTab === 'certificates' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Sanad Diplomas &amp; Certificates</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Officially accredited parchment diplomas with cryptographic hash verification.
                  </p>
                </div>
                <Link href="/certificates/verify">
                  <Button variant="outline" className="border-slate-200 text-slate-700 rounded-xl">
                    <ShieldCheck size={16} className="mr-1.5 text-[#135B3E]" />
                    Public Verification Portal
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="p-5 bg-white border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] font-bold text-[#9E782F] border-amber-200 bg-amber-50">
                          {cert.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-mono text-slate-400">{cert.certificateNumber}</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">{cert.eventOrCompetitionTitle}</h3>
                        <p className="text-xs text-slate-500">Awarded to: <strong>{cert.recipientName}</strong></p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 space-y-0.5">
                        <span className="block truncate font-mono">Hash: {cert.verificationHash}</span>
                        <span className="block">Issuer: {cert.issuerSignatureName}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <Button
                        size="sm"
                        onClick={() => setSelectedCert(cert)}
                        className="w-full bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl text-xs font-semibold"
                      >
                        <Award size={14} className="mr-1.5" />
                        Preview Parchment Diploma
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: GIVING & ZAKAT                                                     */}
          {/* ========================================================================= */}
          {activeTab === 'giving' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Waqf &amp; Community Giving</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Tax-deductible endowments, Quran student sponsorships, and Masjid expansion.
                  </p>
                </div>
                <Button
                  onClick={() => setShowDonateModal(true)}
                  className="bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl shadow-xs self-start sm:self-auto"
                >
                  <Heart size={15} className="mr-1.5" />
                  Make Contribution
                </Button>
              </div>

              {/* Giving Campaigns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: 'Masjid Expansion & Sound System', target: 50000, raised: 42100, donors: 124 },
                  { title: 'Holy Quran Student Scholarships', target: 20000, raised: 17400, donors: 88 },
                  { title: 'Community Iftar & Ramadan Relief', target: 15000, raised: 12850, donors: 156 }
                ].map((camp, idx) => {
                  const pct = Math.round((camp.raised / camp.target) * 100);

                  return (
                    <Card key={idx} className="p-5 bg-white border-slate-200/90 shadow-xs space-y-3">
                      <h3 className="text-sm font-bold text-slate-900">{camp.title}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>${camp.raised.toLocaleString()} raised</span>
                          <span className="font-semibold text-slate-800">{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-2 bg-slate-100" />
                      </div>
                      <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Goal: ${camp.target.toLocaleString()}</span>
                        <span>{camp.donors} Donors</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 10: SYSTEM SETTINGS                                                   */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">System Governance &amp; Campus Settings</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Role permissions, campus branch configuration, and notification preferences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 bg-white border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Campus Branch Information</h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><strong>Primary Venue:</strong> Masjid Al-Nabi Hall</p>
                    <p><strong>Address:</strong> 1505 W Garvey Ave N, West Covina, CA 91790</p>
                    <p><strong>Phone:</strong> (626) 480-7878</p>
                    <p><strong>Calculation Method:</strong> Islamic Society of North America (ISNA)</p>
                  </div>
                </Card>

                <Card className="p-5 bg-white border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Security &amp; Audit Trail</h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><strong>Session Active:</strong> {currentUser.name} ({currentUser.role})</p>
                    <p><strong>Encryption:</strong> SHA-256 Diplomatic Sanad Verification</p>
                    <p><strong>Adhan Auto-Sync:</strong> Enabled (GPS Lat: 34.0686°, Long: -117.9390°)</p>
                  </div>
                  <Link href="/admin/audit-logs">
                    <Button size="sm" variant="outline" className="text-xs rounded-xl mt-2">
                      View Full Audit Trail Logs →
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          )}
          </>
        )}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (Phones) */}
      <MobileBottomNav
        currentTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

      {/* ========================================================================= */}
      {/* GLOBAL MODALS                                                             */}
      {/* ========================================================================= */}

      {/* Modal 1: Create Event */}
      <Dialog open={showCreateEventModal} onOpenChange={setShowCreateEventModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Create New Community Program</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Publish a new summit or tournament to the congregational calendar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEventSubmit} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Program Title</label>
              <Input
                value={eventFormTitle}
                onChange={(e) => setEventFormTitle(e.target.value)}
                placeholder="e.g. Annual Holy Quran Recitation Championship"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={eventFormCategory}
                  onChange={(e) => setEventFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
                >
                  <option value="conference">Conference</option>
                  <option value="competition">Competition</option>
                  <option value="workshop">Workshop</option>
                  <option value="youth-summit">Youth Summit</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Capacity</label>
                <Input
                  type="number"
                  value={eventFormCapacity}
                  onChange={(e) => setEventFormCapacity(Number(e.target.value))}
                  min={10}
                />
              </div>
            </div>
            <DialogFooter className="pt-3">
              <Button type="button" variant="ghost" onClick={() => setShowCreateEventModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#135B3E] text-white">
                Publish Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Add Question */}
      <Dialog open={showAddQuestionModal} onOpenChange={setShowAddQuestionModal}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Add Question to Islamic Bank</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Seed a vetted question into the competition engine.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddQuestionSubmit} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Question Text (English)</label>
              <Input
                value={newQText}
                onChange={(e) => setNewQText(e.target.value)}
                placeholder="e.g. What is the primary articulation point for the letter Qaf?"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Arabic Text (Optional)</label>
              <Input
                value={newQArabic}
                onChange={(e) => setNewQArabic(e.target.value)}
                placeholder="النص العربي"
                dir="rtl"
                className="font-arabic"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newQCategory}
                  onChange={(e) => setNewQCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
                >
                  <option value="hadith-mastery">Hadith Mastery</option>
                  <option value="quran-recitation">Quran &amp; Tajweed</option>
                  <option value="seerah-knowledge">Seerah Knowledge</option>
                  <option value="islamic-quiz">Islamic Jurisprudence</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Source Citation</label>
                <Input
                  value={newQSource}
                  onChange={(e) => setNewQSource(e.target.value)}
                  placeholder="e.g. Sahih al-Bukhari #1"
                />
              </div>
            </div>
            <DialogFooter className="pt-3">
              <Button type="button" variant="ghost" onClick={() => setShowAddQuestionModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#135B3E] text-white">
                Save Question
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Post Announcement */}
      <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Broadcast Secretariat Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePostAnnouncement} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Title</label>
              <Input
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g. Congregation Hall Gate Schedule Update"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Content</label>
              <textarea
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                placeholder="Detailed announcement details..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none"
                required
              />
            </div>
            <DialogFooter className="pt-3">
              <Button type="button" variant="ghost" onClick={() => setShowAnnouncementModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#135B3E] text-white">
                Broadcast Now
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 4: Flow Registration Modal */}
      {selectedEventForRegister && (
        <FlowRegistrationModal
          event={selectedEventForRegister}
          isOpen={!!selectedEventForRegister}
          onClose={() => setSelectedEventForRegister(null)}
        />
      )}

      {/* Modal 5: Manual Grading Rubric Modal */}
      {gradingSubmission && (
        <ManualGradingModal
          submission={gradingSubmission}
          rubric={getRubricForSubmission(gradingSubmission)}
          isOpen={!!gradingSubmission}
          onClose={() => setGradingSubmission(null)}
        />
      )}

      {/* Modal 6: View Parchment Certificate */}
      {selectedCert && (
        <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#faf8f5]">
            <CertificateView certificate={selectedCert} />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal 7: Attendee Lanyard QR Pass Inspection */}
      {inspectedAttendee && (
        <Dialog open={!!inspectedAttendee} onOpenChange={() => setInspectedAttendee(null)}>
          <DialogContent className="sm:max-w-sm bg-white text-center">
            <div className="p-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#135B3E] mx-auto">
                <IslamicStarEmblem size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{inspectedAttendee.participantName}</h3>
                <span className="text-xs font-mono font-bold text-[#135B3E]">{inspectedAttendee.ticketNumber}</span>
                <p className="text-xs text-slate-500 mt-1">{inspectedAttendee.eventTitle}</p>
              </div>
              <div className="w-48 h-48 mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-center">
                <QrCode size={140} className="text-slate-900" />
              </div>
              <p className="text-[11px] text-slate-400">
                Present this digital lanyard pass at the Masjid Al-Nabi arrival gate.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal 8: Community Donation Modal */}
      <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Make a Tax-Deductible Contribution</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Hejrat Foundation 501(c)(3) Waqf Endowment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDonateAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    donateAmount === amt
                      ? 'bg-[#135B3E] text-white border-[#135B3E]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Custom Amount (USD)</label>
              <Input
                type="number"
                value={donateAmount}
                onChange={(e) => setDonateAmount(Number(e.target.value))}
                min={5}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowDonateModal(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowDonateModal(false);
                  addToast(`JazakAllah Khair! Contribution of $${donateAmount} recorded.`, 'success');
                }}
                className="bg-[#135B3E] text-white"
              >
                Complete Contribution
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
