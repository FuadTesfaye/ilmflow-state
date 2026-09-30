'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { FormBuilder } from '../../components/forms/FormBuilder';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
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
  X
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    events,
    createEvent,
    competitions,
    questions,
    addQuestion,
    forms,
    saveForm,
    registrations,
    updateRegistrationStatus,
    certificates,
    announcements,
    addAnnouncement,
    manualSubmissions
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'events' | 'competitions' | 'questions' | 'forms' | 'registrations' | 'announcements' | 'settings'
  >('overview');

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

  // Event modal state
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventFormTitle, setEventFormTitle] = useState('');
  const [eventFormCategory, setEventFormCategory] = useState<any>('conference');
  const [eventFormCapacity, setEventFormCapacity] = useState(500);
  const [eventFormVenue, setEventFormVenue] = useState('Main Hall');

  const pendingGradingCount = manualSubmissions.filter((s) => s.status === 'pending_review').length;
  const checkedInCount = registrations.filter((r) => r.status === 'checked_in').length;

  const handleExportCSV = () => {
    const headers = 'TicketNumber,ParticipantName,Email,Event,Tier,Status,RegisteredAt\n';
    const rows = registrations
      .map(
        (r) =>
          `"${r.ticketNumber}","${r.participantName}","${r.participantEmail}","${r.eventTitle}","${r.ticketTierName}","${r.status}","${r.registeredAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
      explanation: newQExplanation || 'Verified against authentic source materials.',
      sourceReference: newQSource || 'Sahih Collection',
      options: [
        { id: 'opt_1', text: 'Primary opinion', arabicText: 'القول المعتمد' },
        { id: 'opt_2', text: 'Secondary variant opinion', arabicText: 'القول المرجوح' }
      ],
      correctAnswer: 'opt_1'
    });

    setNewQText('');
    setNewQArabic('');
    setNewQExplanation('');
    setNewQSource('');
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAncTitle.trim() || !newAncContent.trim()) return;

    addAnnouncement({
      title: newAncTitle,
      arabicTitle: newAncArabic || undefined,
      content: newAncContent,
      category: newAncCategory,
      author: 'Administration',
      isPinned: true
    });

    setNewAncTitle('');
    setNewAncArabic('');
    setNewAncContent('');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      {/* Admin Masthead Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-semibold">
              Admin Console
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-emerald-700">Platform Health Normal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            System Administration
          </h1>
          <p className="text-sm text-slate-500">
            Manage summits, proctored question banks, attendee registries, and platform settings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5">
            <Download size={14} />
            <span>Export CSV</span>
          </Button>
          <Button size="sm" onClick={() => setShowCreateEventModal(true)} className="gap-1.5">
            <Plus size={15} />
            <span>Create Event</span>
          </Button>
        </div>
      </div>

      {/* Modern Horizontal Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 p-1 rounded-xl bg-slate-100 text-sm font-medium border border-slate-200/80">
        {[
          { id: 'overview', label: 'Overview', icon: Sliders },
          { id: 'events', label: `Events (${events.length})`, icon: Calendar },
          { id: 'competitions', label: `Competitions (${competitions.length})`, icon: Award },
          { id: 'questions', label: `Questions (${questions.length})`, icon: BookOpen },
          { id: 'forms', label: 'Forms', icon: FileCheck },
          { id: 'registrations', label: `Attendees (${registrations.length})`, icon: Users },
          { id: 'announcements', label: `Broadcasts (${announcements.length})`, icon: Bell },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-emerald-700' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-5 pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider">
                  Total Registrations
                </CardDescription>
                <CardTitle className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {registrations.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-slate-500">
                Active passes issued across summits
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-5 pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider">
                  Gate Check-In Rate
                </CardDescription>
                <CardTitle className="text-3xl font-extrabold text-emerald-700 tabular-nums">
                  {checkedInCount} / {registrations.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-slate-500">
                {registrations.length > 0
                  ? Math.round((checkedInCount / registrations.length) * 100)
                  : 0}% verified arrivals
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-5 pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider">
                  Awaiting Grading
                </CardDescription>
                <CardTitle className="text-3xl font-extrabold text-amber-700 tabular-nums">
                  {pendingGradingCount}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-slate-500">
                Submissions in judicial queue
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-5 pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider">
                  Certificates Issued
                </CardDescription>
                <CardTitle className="text-3xl font-extrabold text-teal-700 tabular-nums">
                  {certificates.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-slate-500">
                SHA-256 verified diplomas
              </CardContent>
            </Card>
          </div>

          {/* Operational Quick Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-slate-900">Event Capacity Tracker</h4>
                <Calendar size={16} className="text-slate-400" />
              </div>
              <p className="text-xs text-slate-600">
                {events[0]?.title}: <strong>{events[0]?.registeredCount} / {events[0]?.capacity}</strong> spots filled.
              </p>
              <Progress
                value={
                  events[0]
                    ? Math.round((events[0].registeredCount / events[0].capacity) * 100)
                    : 0
                }
              />
              <Link href="/admin/analytics">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  View Psychometrics &amp; Attendance
                </Button>
              </Link>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-slate-900">Tournaments &amp; Contests</h4>
                <Award size={16} className="text-slate-400" />
              </div>
              <p className="text-xs text-slate-600">
                {competitions.length} active tournaments configured with auto-grading and rubrics.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('competitions')}
                className="w-full text-xs"
              >
                Inspect Competitions
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-slate-900">Registration Form Schemas</h4>
                <FileCheck size={16} className="text-slate-400" />
              </div>
              <p className="text-xs text-slate-600">
                Custom conditional logic schemas active with minor consent rules.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('forms')}
                className="w-full text-xs"
              >
                Configure Forms
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2">
            <h3 className="text-lg font-bold text-slate-900">Summit Registry</h3>
            <Button size="sm" onClick={() => setShowCreateEventModal(true)}>
              + Add Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <Card key={ev.id} className="p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {ev.format}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">
                      {ev.registeredCount} / {ev.capacity} Seats Claimed
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{ev.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>
                  <p className="text-xs text-slate-500">
                    Venue: <strong className="text-slate-800">{ev.venueName}</strong>
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Starts: {new Date(ev.startDate).toLocaleDateString()}
                  </span>
                  <Link href={`/events/${ev.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <span>Preview</span>
                      <ExternalLink size={13} />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Competitions */}
      {activeTab === 'competitions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2">
            <h3 className="text-lg font-bold text-slate-900">Tournaments &amp; Contests</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitions.map((c) => (
              <Card key={c.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{c.category}</Badge>
                  <span className="text-xs text-slate-500">
                    Method: <strong className="text-slate-800 capitalize">{c.scoringMethod}</strong>
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{c.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Participants:</span>
                    <span className="font-semibold text-slate-900">{c.enrolledCount} / {c.maxParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rounds:</span>
                    <span className="font-semibold text-slate-900">{c.rounds.length} Round(s)</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Link href={`/competitions/${c.id}`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <span>Public Syllabus</span>
                      <ExternalLink size={13} />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Question Bank */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base">Add Exam Question</CardTitle>
                <CardDescription className="text-xs">
                  Create proctored question items with explanations and citations.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Question Prompt *</label>
                  <textarea
                    rows={2}
                    required
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    placeholder="Enter prompt text..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Arabic Text (Optional)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={newQArabic}
                    onChange={(e) => setNewQArabic(e.target.value)}
                    placeholder="نص السؤال بالعربية..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-arabic focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newQCategory}
                      onChange={(e) => setNewQCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                    >
                      <option value="hadith-mastery">Hadith Mastery</option>
                      <option value="quran-recitation">Quran Recitation</option>
                      <option value="seerah-knowledge">Seerah Knowledge</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Marks</label>
                    <Input
                      type="number"
                      value={newQMarks}
                      onChange={(e) => setNewQMarks(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Scholarly Explanation</label>
                  <textarea
                    rows={2}
                    value={newQExplanation}
                    onChange={(e) => setNewQExplanation(e.target.value)}
                    placeholder="Reasoning and source verification..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <Button type="submit" size="sm" className="w-full">
                  Save to Question Bank
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 pb-2">
              Question Bank Items ({questions.length})
            </h4>

            {questions.map((q) => (
              <Card key={q.id} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">
                    {q.category} ({q.marks} Marks)
                  </Badge>
                  <span className="text-[10px] text-slate-400 capitalize">{q.difficulty}</span>
                </div>
                {q.arabicText && (
                  <p className="font-arabic text-sm text-slate-800 text-right" dir="rtl">{q.arabicText}</p>
                )}
                <p className="text-xs font-bold text-slate-900">{q.questionText}</p>
                <p className="text-xs text-slate-500">{q.explanation}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Form Builder */}
      {activeTab === 'forms' && (
        <FormBuilder
          initialForm={forms[0]}
          onSave={(updatedForm) => saveForm(updatedForm)}
        />
      )}

      {/* TAB 6: Attendee Registry */}
      {activeTab === 'registrations' && (
        <Card className="overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Attendee Roster</CardTitle>
              <CardDescription className="text-xs">
                Total {registrations.length} registered delegates across all summits.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={handleExportCSV} className="gap-1.5">
              <Download size={14} />
              <span>Export CSV</span>
            </Button>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket No.</TableHead>
                <TableHead>Delegate Name</TableHead>
                <TableHead>Summit</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs font-semibold">{r.ticketNumber}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{r.participantName}</div>
                    <div className="text-[11px] text-slate-400">{r.participantEmail}</div>
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">{r.eventTitle}</TableCell>
                  <TableCell className="font-medium text-xs">{r.ticketTierName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.status === 'checked_in'
                          ? 'info'
                          : r.status === 'approved'
                          ? 'success'
                          : r.status === 'cancelled'
                          ? 'destructive'
                          : 'warning'
                      }
                      className="text-[10px]"
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1.5">
                    {r.status !== 'approved' && r.status !== 'checked_in' && (
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-xs px-2.5"
                        onClick={() => updateRegistrationStatus(r.id, 'approved')}
                      >
                        Approve
                      </Button>
                    )}
                    {r.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-2.5 text-red-600 hover:text-red-700"
                        onClick={() => updateRegistrationStatus(r.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* TAB 7: Announcements */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base">Broadcast Announcement</CardTitle>
                <CardDescription className="text-xs">
                  Send system notices to delegate portal notification drawers.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePublishAnnouncement} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Title *</label>
                  <Input
                    type="text"
                    required
                    value={newAncTitle}
                    onChange={(e) => setNewAncTitle(e.target.value)}
                    placeholder="Announcement title..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Arabic Title</label>
                  <Input
                    type="text"
                    dir="rtl"
                    value={newAncArabic}
                    onChange={(e) => setNewAncArabic(e.target.value)}
                    placeholder="العنوان بالعربية..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newAncCategory}
                    onChange={(e) => setNewAncCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  >
                    <option value="schedule">Schedule</option>
                    <option value="competition">Competition</option>
                    <option value="urgent">Urgent</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Message Content *</label>
                  <textarea
                    rows={3}
                    required
                    value={newAncContent}
                    onChange={(e) => setNewAncContent(e.target.value)}
                    placeholder="Message detail..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <Button type="submit" size="sm" className="w-full">
                  Broadcast Notice
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 pb-2">
              Broadcast Archive ({announcements.length})
            </h4>

            {announcements.map((anc) => (
              <Card key={anc.id} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">
                    {anc.category}
                  </Badge>
                  <span className="text-[10px] text-slate-400">
                    {new Date(anc.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-slate-900">{anc.title}</h5>
                {anc.arabicTitle && (
                  <p className="font-arabic text-sm text-slate-700" dir="rtl">{anc.arabicTitle}</p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">{anc.content}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: Settings */}
      {activeTab === 'settings' && (
        <Card className="max-w-xl p-6 space-y-5">
          <CardHeader className="p-0 pb-3 border-b border-slate-100">
            <CardTitle className="text-base">System Settings</CardTitle>
            <CardDescription className="text-xs">
              Configure astronomical prayer conventions and organization parameters.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Prayer Calculation Convention
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs">
                <option>Umm al-Qura University, Makkah</option>
                <option>Muslim World League (MWL)</option>
                <option>Egyptian General Authority of Survey</option>
                <option>Islamic Society of North America (ISNA)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Organization Display Name
              </label>
              <Input defaultValue="IlmFlow Global Secretariat" />
            </div>
          </div>
        </Card>
      )}

      {/* Create Event Dialog Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 space-y-4 bg-white shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base">Create New Event</CardTitle>
              <button
                onClick={() => setShowCreateEventModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Event Title *</label>
                <Input
                  type="text"
                  value={eventFormTitle}
                  onChange={(e) => setEventFormTitle(e.target.value)}
                  placeholder="e.g. Seerah & Leadership Summit"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={eventFormCategory}
                  onChange={(e) => setEventFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                >
                  <option value="conference">Conference</option>
                  <option value="competition">Competition</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Venue</label>
                  <Input
                    type="text"
                    value={eventFormVenue}
                    onChange={(e) => setEventFormVenue(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Capacity</label>
                  <Input
                    type="number"
                    value={eventFormCapacity}
                    onChange={(e) => setEventFormCapacity(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setShowCreateEventModal(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (!eventFormTitle.trim()) return;
                  createEvent({
                    slug: eventFormTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    title: eventFormTitle,
                    subtitle: 'Annual Academic Summit',
                    description: 'International symposium of lectures and research discussions.',
                    category: eventFormCategory,
                    format: 'in-person',
                    coverImage:
                      'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200',
                    startDate: new Date(Date.now() + 86400000 * 30).toISOString(),
                    endDate: new Date(Date.now() + 86400000 * 32).toISOString(),
                    timeZone: 'GMT',
                    venueName: eventFormVenue,
                    venueAddress: 'Al-Madinah Al-Munawwarah',
                    registrationDeadline: new Date(Date.now() + 86400000 * 25).toISOString(),
                    capacity: eventFormCapacity,
                    languages: ['English', 'Arabic'],
                    speakers: [],
                    schedule: [],
                    tickets: [
                      {
                        id: 'tkt-' + Date.now(),
                        name: 'General Admission',
                        price: 0,
                        currency: 'USD',
                        description: 'Full admission pass',
                        features: ['Access to all lectures', 'Delegate badge'],
                        capacity: eventFormCapacity,
                        registeredCount: 0,
                        available: true
                      }
                    ],
                    formId: 'form-summit-standard',
                    status: 'upcoming',
                    prayerTimes: {
                      fajr: '05:00 AM',
                      dhuhr: '12:00 PM',
                      asr: '03:30 PM',
                      maghrib: '06:00 PM',
                      isha: '07:30 PM',
                      nextPrayer: 'Asr',
                      timeRemaining: '1h 00m'
                    }
                  });
                  setShowCreateEventModal(false);
                  setEventFormTitle('');
                }}
              >
                Publish Event
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
