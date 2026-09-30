'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../../context/AppContext';
import { ArrowLeft, ArrowRight, Check, Save, Calendar, MapPin, Users, Ticket, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';

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
    venueName: 'King Abdullah Cultural & Convention Center',
    venueAddress: 'King Abdullah Cultural District, Al-Madinah Al-Munawwarah',
    capacity: 1000,
    ticketTierName: 'General Admission',
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
      subtitle: formData.subtitle || 'International Academic Event',
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
        fajr: '05:08 AM', dhuhr: '12:14 PM', asr: '03:38 PM',
        maghrib: '06:05 PM', isha: '07:35 PM', nextPrayer: 'Asr', timeRemaining: '1h 24m'
      },
      schedule: [],
      tickets: [{
        id: `tkt-${Date.now()}`,
        name: formData.ticketTierName,
        price: Number(formData.ticketTierPrice),
        currency: 'USD',
        description: 'Official admission pass to all sessions.',
        features: ['All Sessions', 'Delegate Lanyard', 'Verified QR Pass'],
        capacity: Number(formData.capacity),
        registeredCount: 0,
        available: true
      }]
    });

    addToast('Event created successfully!', 'success');
    router.push('/admin');
  };

  const steps = [
    { num: 1, title: 'Basic Info', icon: Sparkles },
    { num: 2, title: 'Dates & Venue', icon: Calendar },
    { num: 3, title: 'Capacity & Tickets', icon: Ticket },
    { num: 4, title: 'Review & Publish', icon: Check }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="gap-1.5 text-stone-600 hover:text-stone-900">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
        <Badge variant="info">Event Wizard</Badge>
      </div>

      {/* Step indicator */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {steps.map((s) => {
              const isDone = step > s.num;
              const isCurrent = step === s.num;
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                      : isDone
                      ? 'bg-stone-50 border-stone-200 text-stone-700'
                      : 'border-transparent text-stone-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {isDone ? <Check size={14} /> : s.num}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-stone-400 block">Step {s.num}</span>
                    <span className="text-xs sm:text-sm truncate block font-medium">{s.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the title, category, format, and description of your event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1.5">Event Title *</label>
              <Input
                type="text"
                placeholder="e.g. International Hadith & Sunnah Conference 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1.5">Subtitle</label>
              <Input
                type="text"
                placeholder="e.g. Exploring classical scholarship in the modern age"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1.5">Description</label>
              <textarea
                rows={4}
                placeholder="Provide a detailed description of the event, learning objectives, and agenda..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="CONFERENCE">Conference</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="COMPETITION">Competition</option>
                  <option value="SEMINAR">Seminar</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Delivery Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="hybrid">Hybrid (In-person & Virtual)</option>
                  <option value="in-person">In-Person Only</option>
                  <option value="online">Online / Virtual Only</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => setStep(2)} className="gap-1.5">
              <span>Next: Dates & Venue</span>
              <ArrowRight size={15} />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Dates & Venue */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Dates & Venue</CardTitle>
            <CardDescription>Specify the event schedule and physical location details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, startDate: `${e.target.value}T08:30:00Z` })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, endDate: `${e.target.value}T21:00:00Z` })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1.5">Venue Name</label>
              <Input
                type="text"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                placeholder="e.g. King Abdullah Cultural & Convention Center"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1.5">Street Address</label>
              <Input
                type="text"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                placeholder="Full address, city, country"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1.5">Time Zone</label>
              <Input
                type="text"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="gap-1.5">
              <span>Next: Capacity & Tickets</span>
              <ArrowRight size={15} />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Capacity & Tickets */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Capacity & Tickets</CardTitle>
            <CardDescription>Configure seat capacity and primary ticket tier pricing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Total Capacity</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Primary Ticket Name</label>
                <Input
                  type="text"
                  value={formData.ticketTierName}
                  onChange={(e) => setFormData({ ...formData, ticketTierName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1.5">Ticket Price (USD, 0 = Free Admission)</label>
              <Input
                type="number"
                value={formData.ticketTierPrice}
                onChange={(e) => setFormData({ ...formData, ticketTierPrice: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Age Restrictions</label>
                <Input
                  type="text"
                  value={formData.ageRestrictions}
                  onChange={(e) => setFormData({ ...formData, ageRestrictions: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Gender Arrangement</label>
                <select
                  value={formData.genderCategory}
                  onChange={(e) => setFormData({ ...formData, genderCategory: e.target.value as any })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="segregated-halls">Segregated Halls & Seating</option>
                  <option value="family-friendly">Family Friendly Shared Hall</option>
                  <option value="all">Open Admission</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => setStep(4)} className="gap-1.5">
              <span>Next: Review & Publish</span>
              <ArrowRight size={15} />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Publish</CardTitle>
            <CardDescription>Confirm event specifications before publishing to the live catalogue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-stone-50 border border-stone-200 divide-y divide-stone-200 text-sm">
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Event Title</span>
                <span className="font-semibold text-stone-900">{formData.title || 'Untitled Event'}</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Type & Format</span>
                <span className="font-semibold text-stone-900">
                  {formData.type} · {formData.format}
                </span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Dates</span>
                <span className="font-semibold text-stone-900">
                  {formData.startDate.split('T')[0]} to {formData.endDate.split('T')[0]}
                </span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Venue</span>
                <span className="font-semibold text-stone-900">{formData.venueName}</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Capacity & Price</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{formData.capacity} seats</Badge>
                  <Badge variant={formData.ticketTierPrice === 0 ? 'success' : 'default'}>
                    {formData.ticketTierPrice === 0 ? 'Free' : `$${formData.ticketTierPrice}`}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button onClick={handleCreate} className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white">
              <Save size={16} />
              <span>Publish Event</span>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
