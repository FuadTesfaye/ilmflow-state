'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../../context/AppContext';
import { IslamicStarIcon } from '../../../../components/common/IslamicPattern';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  Clock,
  Layers,
  Award,
  FileCheck,
  Sparkles,
  Save
} from 'lucide-react';

export default function CreateEventWizardPage() {
  const router = useRouter();
  const { createEvent, addToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    type: 'CONFERENCE',
    format: 'hybrid' as const,
    coverImage: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-11-14T08:30:00Z',
    endDate: '2026-11-16T21:00:00Z',
    timezone: 'GMT+3 (Madinah Time)',
    venueName: 'The Grand Al-Mihrab Conference Palace',
    venueAddress: 'King Abdullah Cultural District, Al-Madinah Al-Munawwarah',
    capacity: 1000,
    ticketTierName: 'General Assembly Pass',
    ticketTierPrice: 0,
    ageRestrictions: 'All ages welcome',
    genderCategory: 'segregated-halls' as const,
    languages: ['Arabic', 'English']
  });

  const handleCreate = () => {
    if (!formData.title.trim()) {
      addToast('Please enter an event title', 'error');
      return;
    }

    createEvent({
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `event-${Date.now()}`,
      status: 'upcoming',
      subtitle: formData.subtitle || 'International Academic Convocation',
      description: formData.description || 'Scholarly gathering and competition assembly.',
      category: 'conference',
      format: formData.format,
      coverImage: formData.coverImage,
      startDate: formData.startDate,
      endDate: formData.endDate,
      timeZone: formData.timezone,
      venueName: formData.venueName,
      venueAddress: formData.venueAddress,
      registrationDeadline: formData.startDate,
      capacity: Number(formData.capacity),
      ageRestrictions: formData.ageRestrictions,
      genderCategory: formData.genderCategory,
      languages: formData.languages,
      speakers: [],
      formId: 'form-summit-standard',
      featured: true,
      prayerTimes: {
        fajr: '05:08 AM',
        dhuhr: '12:14 PM',
        asr: '03:38 PM',
        maghrib: '06:05 PM',
        isha: '07:35 PM',
        nextPrayer: 'Asr',
        timeRemaining: '1h 24m'
      },
      schedule: [],
      tickets: [
        {
          id: `tkt-${Date.now()}`,
          name: formData.ticketTierName,
          price: Number(formData.ticketTierPrice),
          currency: 'USD',
          description: 'Official admission pass to all plenary lectures and sessions.',
          features: ['All Sessions', 'Delegate Lanyard', 'Verified QR Pass'],
          capacity: Number(formData.capacity),
          registeredCount: 0,
          available: true
        }
      ]
    });

    addToast('Event created successfully in the central registry!', 'success');
    router.push('/admin');
  };

  const steps = [
    { num: 1, title: 'Basic Information' },
    { num: 2, title: 'Dates & Sanctuary Venue' },
    { num: 3, title: 'Capacities & Passes' },
    { num: 4, title: 'Review & Publish' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-[#0f172a]">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e7e2d6]">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs text-[#064e3b] font-semibold hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Exit Event Creator</span>
        </Link>
        <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
          7-STEP EVENT ARCHITECT WIZARD
        </span>
      </div>

      {/* Stepper Progress */}
      <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs">
        <div className="flex items-center justify-between">
          {steps.map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;

            return (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                    isDone
                      ? 'bg-[#064e3b] text-[#ffffff]'
                      : isActive
                      ? 'bg-[#9e782f] text-[#ffffff] ring-2 ring-[#9e782f]/30'
                      : 'bg-[#faf8f5] text-[#6b7280] border border-[#e7e2d6]'
                  }`}
                >
                  {isDone ? <Check size={14} /> : s.num}
                </div>
                <span
                  className={`text-xs hidden sm:inline ${
                    isActive ? 'font-bold text-[#064e3b]' : 'text-[#6b7280]'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-6">
          <div className="space-y-1 pb-4 border-b border-[#e7e2d6]">
            <h2 className="text-xl font-bold text-[#0f172a]">Step 1: Event Identity &amp; Classification</h2>
            <p className="text-xs text-[#6b7280]">Specify the official title, event category, and descriptive summary.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#0f172a] block mb-1">Convocation Title *</label>
              <input
                type="text"
                placeholder="e.g. The International Seerah &amp; Leadership Summit 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#0f172a] block mb-1">Subtitle / Epigram</label>
              <input
                type="text"
                placeholder="e.g. Preserving Sacred Tradition Through Contemporary Scholarship"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#0f172a] block mb-1">Comprehensive Description</label>
              <textarea
                rows={4}
                placeholder="Provide details regarding the curriculum, plenary sessions, scholars, and objectives..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#0f172a] block mb-1">Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                >
                  <option value="CONFERENCE">CONFERENCE</option>
                  <option value="LECTURE">LECTURE</option>
                  <option value="COMPETITION">COMPETITION</option>
                  <option value="QUIZ">QUIZ</option>
                  <option value="WORKSHOP">WORKSHOP</option>
                  <option value="SEMINAR">SEMINAR</option>
                  <option value="HYBRID">HYBRID</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#0f172a] block mb-1">Delivery Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                >
                  <option value="hybrid">Hybrid (On-Site &amp; Streamed)</option>
                  <option value="in-person">In-Person Only</option>
                  <option value="online">Online Virtual Gathering</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e7e2d6] flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Next: Dates &amp; Venue</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Dates & Venue */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-6">
          <div className="space-y-1 pb-4 border-b border-[#e7e2d6]">
            <h2 className="text-xl font-bold text-[#0f172a]">Step 2: Dates, Timezone &amp; Sanctuary Venue</h2>
            <p className="text-xs text-[#6b7280]">Configure schedule boundaries and physical location coordinates.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#0f172a] block mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate.split('T')[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: `${e.target.value}T08:30:00Z` })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0f172a] block mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate.split('T')[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: `${e.target.value}T21:00:00Z` })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#0f172a] block mb-1">Venue Palace Name</label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#0f172a] block mb-1">Physical Address</label>
              <input
                type="text"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#e7e2d6] flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#6b7280] hover:text-[#0f172a]"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Next: Capacities &amp; Passes</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Capacities & Passes */}
      {step === 3 && (
        <div className="p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-6">
          <div className="space-y-1 pb-4 border-b border-[#e7e2d6]">
            <h2 className="text-xl font-bold text-[#0f172a]">Step 3: Capacities &amp; Pass Allocation</h2>
            <p className="text-xs text-[#6b7280]">Define total seating quota and initial registration ticket tier.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#0f172a] block mb-1">Total Venue Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0f172a] block mb-1">Initial Ticket Tier Name</label>
                <input
                  type="text"
                  value={formData.ticketTierName}
                  onChange={(e) => setFormData({ ...formData, ticketTierName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#0f172a] block mb-1">Ticket Price (USD, enter 0 for Free)</label>
              <input
                type="number"
                value={formData.ticketTierPrice}
                onChange={(e) => setFormData({ ...formData, ticketTierPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#e7e2d6] flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#6b7280] hover:text-[#0f172a]"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Next: Review &amp; Publish</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && (
        <div className="p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-6">
          <div className="space-y-1 pb-4 border-b border-[#e7e2d6]">
            <h2 className="text-xl font-bold text-[#0f172a]">Step 4: Final Verification &amp; Release</h2>
            <p className="text-xs text-[#6b7280]">Review parameters before publishing to the global academic registry.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Title:</span>
              <span className="font-bold text-[#0f172a]">{formData.title || 'Untitled Event'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Category &amp; Format:</span>
              <span className="font-bold text-[#064e3b]">{formData.type} • {formData.format}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Dates:</span>
              <span className="font-bold text-[#0f172a]">{formData.startDate.split('T')[0]} to {formData.endDate.split('T')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Sanctuary Venue:</span>
              <span className="font-bold text-[#0f172a]">{formData.venueName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Allocated Quota:</span>
              <span className="font-bold text-[#064e3b]">{formData.capacity} Seats ({formData.ticketTierPrice === 0 ? 'Free' : `$${formData.ticketTierPrice}`})</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e7e2d6] flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#6b7280] hover:text-[#0f172a]"
            >
              Back
            </button>
            <button
              onClick={handleCreate}
              className="px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] transition-all flex items-center gap-1.5 shadow-md"
            >
              <Save size={14} />
              <span>Publish Event to Central Registry</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
