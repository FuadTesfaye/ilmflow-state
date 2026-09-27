'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FormBuilder } from '../../components/forms/FormBuilder';
import { IslamicStarIcon } from '../../components/common/IslamicPattern';
import {
  Users,
  Calendar,
  Award,
  FileCheck,
  CheckCircle,
  Clock,
  Shield,
  Plus,
  Search,
  Download,
  Bell,
  Settings,
  BookOpen,
  Sliders,
  Sparkles,
  ExternalLink
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

  // Question bank form state
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
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventFormTitle, setEventFormTitle] = useState('');
  const [eventFormCategory, setEventFormCategory] = useState<any>('conference');
  const [eventFormCapacity, setEventFormCapacity] = useState(500);
  const [eventFormVenue, setEventFormVenue] = useState('Grand Sanctuary Hall');

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
    a.download = `IlmFlow_Attendees_${new Date().toISOString().split('T')[0]}.csv`;
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
        { id: 'opt_1', text: 'Primary scholarly opinion', arabicText: 'القول المعتمد' },
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
      author: 'Academic Secretariat',
      isPinned: true
    });

    setNewAncTitle('');
    setNewAncArabic('');
    setNewAncContent('');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 select-none text-[#111827]">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <IslamicStarIcon size={16} className="text-[#064e3b]" />
            <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
              CENTRAL SECRETARIAT ADMINISTRATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl text-[#0f172a] font-bold mt-1 tracking-tight">
            Global Academic &amp; Operations Console
          </h1>
          <p className="text-xs text-[#475569]">
            Comprehensive control over conferences, Holy Quran competitions, question banks, attendee gates, and accredited certificates.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#111827] hover:border-[#064e3b] cursor-pointer transition-colors shadow-2xs"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowCreateEventModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs transition-all"
          >
            <Plus size={15} />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[#f4f0e6] border border-[#e7e2d6] text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview', icon: Sliders },
          { id: 'events', label: `Events (${events.length})`, icon: Calendar },
          { id: 'competitions', label: `Competitions (${competitions.length})`, icon: Award },
          { id: 'questions', label: `Question Bank (${questions.length})`, icon: BookOpen },
          { id: 'forms', label: 'Form Builder', icon: FileCheck },
          { id: 'registrations', label: `Attendees (${registrations.length})`, icon: Users },
          { id: 'announcements', label: `Broadcasts (${announcements.length})`, icon: Bell },
          { id: 'settings', label: 'System Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#ffffff] text-[#064e3b] shadow-xs font-bold'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Executive Overview & KPIs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
              <span className="meta-tag text-[#6b7280] block text-[9px]">TOTAL REGISTRATIONS</span>
              <span className="font-display text-3xl font-bold text-[#111827] mt-1 block">
                {registrations.length}
              </span>
              <span className="text-[11px] text-[#065f46] mt-1 block font-medium">Active across all summits</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
              <span className="meta-tag text-[#6b7280] block text-[9px]">GATE CHECK-IN RATE</span>
              <span className="font-display text-3xl font-bold text-[#064e3b] mt-1 block">
                {checkedInCount} / {registrations.length}
              </span>
              <span className="text-[11px] text-[#6b7280] mt-1 block">Arrival marshal verified</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
              <span className="meta-tag text-[#6b7280] block text-[9px]">AWAITING JUDICIAL GRADE</span>
              <span className="font-display text-3xl font-bold text-[#9e782f] mt-1 block">
                {pendingGradingCount}
              </span>
              <span className="text-[11px] text-[#6b7280] mt-1 block">Quran &amp; essay submissions</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
              <span className="meta-tag text-[#6b7280] block text-[9px]">CERTIFICATES ISSUED</span>
              <span className="font-display text-3xl font-bold text-[#065f46] mt-1 block">
                {certificates.length}
              </span>
              <span className="text-[11px] text-[#065f46] mt-1 block font-medium">Cryptographically verifiable</span>
            </div>
          </div>

          {/* Quick Operational Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-3">
              <h4 className="font-display text-lg font-bold text-[#111827] flex items-center gap-2">
                <Calendar size={18} className="text-[#064e3b]" />
                <span>Flagship Summit Capacity</span>
              </h4>
              <p className="text-xs text-[#4b5563]">
                Global Quran &amp; Sunnah Summit 2026: <strong>{events[0]?.registeredCount} / {events[0]?.capacity}</strong> spots reserved.
              </p>
              <div className="w-full bg-[#f4f0e6] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#064e3b] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((events[0]?.registeredCount || 0) / (events[0]?.capacity || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-3">
              <h4 className="font-display text-lg font-bold text-[#111827] flex items-center gap-2">
                <Award size={18} className="text-[#9e782f]" />
                <span>Active Competitions</span>
              </h4>
              <p className="text-xs text-[#4b5563]">
                {competitions.length} international categories active (Hadith Mastery, Quran Hifdh, Prophetic Ethics).
              </p>
              <button
                onClick={() => setActiveTab('competitions')}
                className="text-xs font-semibold text-[#064e3b] hover:underline cursor-pointer block"
              >
                Inspect Competition Rounds →
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-3">
              <h4 className="font-display text-lg font-bold text-[#111827] flex items-center gap-2">
                <FileCheck size={18} className="text-[#064e3b]" />
                <span>Dynamic Form Logic</span>
              </h4>
              <p className="text-xs text-[#4b5563]">
                Custom form builder with minor protection rules active across all registration flows.
              </p>
              <button
                onClick={() => setActiveTab('forms')}
                className="text-xs font-semibold text-[#064e3b] hover:underline cursor-pointer block"
              >
                Open Visual Schema Builder →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e7e2d6]">
            <h3 className="font-display text-xl font-bold text-[#111827]">
              Active Conferences &amp; Summits
            </h3>
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs transition-all"
            >
              + New Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                    <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
                      {ev.format.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-[#065f46]">
                      {ev.registeredCount} / {ev.capacity} Seats Filled
                    </span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-[#111827] mt-3">{ev.title}</h4>
                  <p className="text-xs text-[#4b5563] mt-1 line-clamp-2">{ev.description}</p>
                  <p className="text-xs text-[#6b7280] mt-3">Venue: <strong className="text-[#111827]">{ev.venueName}</strong></p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e7e2d6] flex items-center justify-between">
                  <span className="text-xs text-[#6b7280]">
                    Starts: {new Date(ev.startDate).toLocaleDateString()}
                  </span>
                  <a
                    href={`/events/${ev.id}`}
                    className="text-xs font-semibold text-[#064e3b] hover:underline flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Competitions Management */}
      {activeTab === 'competitions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e7e2d6]">
            <h3 className="font-display text-xl font-bold text-[#111827]">
              Competition Systems &amp; Scoring Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitions.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                  <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
                    Format: {c.format}
                  </span>
                  <span className="text-xs text-[#6b7280]">
                    Method: <strong className="text-[#111827]">{c.scoringMethod}</strong>
                  </span>
                </div>
                <h4 className="font-display text-xl font-bold text-[#111827]">{c.title}</h4>
                <p className="text-xs text-[#4b5563] line-clamp-2">{c.description}</p>

                <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-xs space-y-1.5">
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Enrolled Participants:</span>
                    <span className="text-[#111827] font-semibold">{c.enrolledCount} / {c.maxParticipants}</span>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Rounds Configured:</span>
                    <span className="text-[#064e3b] font-semibold">{c.rounds.length} Round(s)</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <a
                    href={`/competitions/${c.id}`}
                    className="text-xs font-semibold text-[#064e3b] hover:underline flex items-center gap-1"
                  >
                    <span>View Public Rules</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Question Bank Manager */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question Creation Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h4 className="font-display text-xl font-bold text-[#111827] mb-4 pb-2 border-b border-[#e7e2d6]">
                Add Question to Question Bank
              </h4>

              <form onSubmit={handleAddQuestionSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Question Text (English) *</label>
                  <textarea
                    rows={2}
                    required
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    placeholder="Enter question wording..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Arabic Text (Optional)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={newQArabic}
                    onChange={(e) => setNewQArabic(e.target.value)}
                    placeholder="نص السؤال بالعربية..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#9e782f] font-arabic text-sm focus:border-[#064e3b] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#4b5563] mb-1 font-bold">Category</label>
                    <select
                      value={newQCategory}
                      onChange={(e) => setNewQCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                    >
                      <option value="hadith-mastery">Hadith Mastery</option>
                      <option value="quran-recitation">Quran Recitation</option>
                      <option value="seerah-knowledge">Seerah Knowledge</option>
                      <option value="arabic-language">Arabic Language</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#4b5563] mb-1 font-bold">Marks Awarded</label>
                    <input
                      type="number"
                      value={newQMarks}
                      onChange={(e) => setNewQMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Scholarly Explanation &amp; Commentary</label>
                  <textarea
                    rows={2}
                    value={newQExplanation}
                    onChange={(e) => setNewQExplanation(e.target.value)}
                    placeholder="Cite classical commentaries, rulings or historical context..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Primary Source Reference</label>
                  <input
                    type="text"
                    value={newQSource}
                    onChange={(e) => setNewQSource(e.target.value)}
                    placeholder="e.g. Fath al-Bari, Sahih Muslim #194"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#064e3b] text-[#ffffff] font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs transition-all"
                >
                  Save Question to Bank
                </button>
              </form>
            </div>
          </div>

          {/* Question List */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="font-display text-xl font-bold text-[#111827] pb-2 border-b border-[#e7e2d6]">
              Registered Questions ({questions.length})
            </h4>

            {questions.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
                    {q.category} ({q.marks} Marks)
                  </span>
                  <span className="text-xs text-[#6b7280] font-mono">{q.difficulty}</span>
                </div>
                {q.arabicText && (
                  <p className="font-arabic text-base text-[#9e782f] text-right" dir="rtl">
                    {q.arabicText}
                  </p>
                )}
                <p className="font-bold text-sm text-[#111827]">{q.questionText}</p>
                <p className="text-[11px] text-[#4b5563] leading-relaxed">{q.explanation}</p>
              </div>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
            <div>
              <h3 className="font-display text-xl font-bold text-[#111827]">
                Confirmed Attendees &amp; Ticket Holders
              </h3>
              <p className="text-xs text-[#6b7280]">
                Total: {registrations.length} registered delegates across all summits.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs transition-all"
            >
              <Download size={14} />
              <span>Export CSV Table</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#e7e2d6] bg-[#ffffff] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-[#6b7280] font-mono uppercase text-[10px] border-b border-[#e7e2d6]">
                <tr>
                  <th className="p-3.5">Ticket #</th>
                  <th className="p-3.5">Delegate Name</th>
                  <th className="p-3.5">Event</th>
                  <th className="p-3.5">Pass Tier</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e2d6]">
                {registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                    <td className="p-3.5 font-mono text-[#064e3b] font-bold">{r.ticketNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#111827]">{r.participantName}</div>
                      <div className="text-[11px] text-[#6b7280]">{r.participantEmail}</div>
                    </td>
                    <td className="p-3.5 text-[#4b5563]">{r.eventTitle}</td>
                    <td className="p-3.5 font-semibold text-[#064e3b]">{r.ticketTierName}</td>
                    <td className="p-3.5">
                      <span
                        className={`meta-tag px-2.5 py-0.5 rounded-full font-bold ${
                          r.status === 'checked_in'
                            ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                            : 'bg-[#f4f0e6] text-[#4b5563] border border-[#e7e2d6]'
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => updateRegistrationStatus(r.id, 'approved')}
                          className="px-2.5 py-1 rounded-lg bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] text-[10px] font-semibold cursor-pointer hover:bg-[#d1fae5]"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'cancelled' && (
                        <button
                          onClick={() => updateRegistrationStatus(r.id, 'cancelled')}
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200 text-[10px] font-semibold cursor-pointer hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: Broadcast Announcements */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h4 className="font-display text-xl font-bold text-[#111827] mb-4 pb-2 border-b border-[#e7e2d6]">
                Broadcast Official Announcement
              </h4>

              <form onSubmit={handlePublishAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Notice Title *</label>
                  <input
                    type="text"
                    required
                    value={newAncTitle}
                    onChange={(e) => setNewAncTitle(e.target.value)}
                    placeholder="e.g. Schedule Update for Asr Lecture"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Arabic Title (Optional)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={newAncArabic}
                    onChange={(e) => setNewAncArabic(e.target.value)}
                    placeholder="العنوان بالعربية..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#9e782f] font-arabic focus:border-[#064e3b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Notice Category</label>
                  <select
                    value={newAncCategory}
                    onChange={(e) => setNewAncCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                  >
                    <option value="schedule">Schedule &amp; Prayer</option>
                    <option value="competition">Competition Alert</option>
                    <option value="urgent">Urgent Notice</option>
                    <option value="general">General Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Notice Content *</label>
                  <textarea
                    rows={3}
                    required
                    value={newAncContent}
                    onChange={(e) => setNewAncContent(e.target.value)}
                    placeholder="Detailed advisory text..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#064e3b] text-[#ffffff] font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs transition-all"
                >
                  Broadcast Notice to Platform
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h4 className="font-display text-xl font-bold text-[#111827] pb-2 border-b border-[#e7e2d6]">
              Active Broadcasts ({announcements.length})
            </h4>

            {announcements.map((anc) => (
              <div key={anc.id} className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
                    {anc.category}
                  </span>
                  <span className="text-[11px] text-[#6b7280]">
                    {new Date(anc.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h5 className="font-bold text-[#111827] text-base">{anc.title}</h5>
                {anc.arabicTitle && (
                  <p className="font-arabic text-base text-[#9e782f]" dir="rtl">
                    {anc.arabicTitle}
                  </p>
                )}
                <p className="text-[#4b5563] leading-relaxed">{anc.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: Settings */}
      {activeTab === 'settings' && (
        <div className="p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] max-w-2xl space-y-5 text-xs">
          <h4 className="font-display text-xl font-bold text-[#111827] pb-3 border-b border-[#e7e2d6]">
            Platform Regional &amp; Astronomical Settings
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[#4b5563] mb-1 font-bold">Prayer Time Astronomical Convention</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]">
                <option>Umm al-Qura University, Makkah</option>
                <option>Muslim World League (MWL)</option>
                <option>Egyptian General Authority of Survey</option>
                <option>Islamic Society of North America (ISNA)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#4b5563] mb-1 font-bold">Hijri Calendar Offset Adjustment</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]">
                <option>Astronomical Sighting Standard (0 Days)</option>
                <option>Local Moon Sighting Committee (+1 Day)</option>
                <option>Local Moon Sighting Committee (-1 Day)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#4b5563] mb-1 font-bold">Organization Endowment (Waqf) Title</label>
              <input
                type="text"
                defaultValue="IlmFlow Global Islamic Council"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#ffffff] border border-[#e7e2d6] p-7 text-[#111827] space-y-5 text-xs shadow-2xl animate-in fade-in duration-200">
            <h4 className="font-display text-xl font-bold text-[#111827]">
              Create New Islamic Event / Summit
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-[#4b5563] mb-1 font-bold">Event Title *</label>
                <input
                  type="text"
                  value={eventFormTitle}
                  onChange={(e) => setEventFormTitle(e.target.value)}
                  placeholder="e.g. International Hadith Symposium 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#4b5563] mb-1 font-bold">Event Format</label>
                <select
                  value={eventFormCategory}
                  onChange={(e) => setEventFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                >
                  <option value="conference">Conference / Summit</option>
                  <option value="competition">Championship / Competition</option>
                  <option value="workshop">Academic Workshop</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Venue Name</label>
                  <input
                    type="text"
                    value={eventFormVenue}
                    onChange={(e) => setEventFormVenue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                  />
                </div>
                <div>
                  <label className="block text-[#4b5563] mb-1 font-bold">Capacity Limit</label>
                  <input
                    type="number"
                    value={eventFormCapacity}
                    onChange={(e) => setEventFormCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#e7e2d6]">
              <button
                onClick={() => setShowCreateEventModal(false)}
                className="px-4 py-2 rounded-xl border border-[#e7e2d6] text-[#6b7280] hover:text-[#111827] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!eventFormTitle.trim()) return;
                  createEvent({
                    slug: eventFormTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    title: eventFormTitle,
                    subtitle: 'Annual Academic Discourse & Sacred Knowledge Assembly',
                    description: 'Official gathering convened under the auspices of the Academic Secretariat.',
                    category: eventFormCategory,
                    format: 'in-person',
                    coverImage: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200',
                    startDate: new Date(Date.now() + 86400000 * 30).toISOString(),
                    endDate: new Date(Date.now() + 86400000 * 32).toISOString(),
                    timeZone: 'GMT+3 (Madinah Time)',
                    venueName: eventFormVenue,
                    venueAddress: 'Sanctuary District, Al-Madinah Al-Munawwarah',
                    registrationDeadline: new Date(Date.now() + 86400000 * 25).toISOString(),
                    capacity: eventFormCapacity,
                    languages: ['Arabic', 'English'],
                    speakers: [],
                    schedule: [],
                    tickets: [
                      {
                        id: 'tkt-' + Date.now(),
                        name: 'General Access',
                        price: 0,
                        currency: 'USD',
                        description: 'Full pass to open sessions',
                        features: ['Auditorium Entry', 'Digital Certificate'],
                        capacity: eventFormCapacity,
                        registeredCount: 0,
                        available: true
                      }
                    ],
                    formId: 'form-summit-standard',
                    status: 'upcoming',
                    prayerTimes: {
                      fajr: '05:08 AM',
                      dhuhr: '12:14 PM',
                      asr: '03:38 PM',
                      maghrib: '06:05 PM',
                      isha: '07:35 PM',
                      nextPrayer: 'Asr',
                      timeRemaining: '1h 24m'
                    }
                  });
                  setShowCreateEventModal(false);
                  setEventFormTitle('');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs"
              >
                Publish Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
