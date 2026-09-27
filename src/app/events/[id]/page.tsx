'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { FlowRegistrationModal } from '../../../components/registration/FlowRegistrationModal';
import { IslamicStarIcon } from '../../../components/common/IslamicPattern';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ArrowLeft,
  Share2,
  Video,
  CheckCircle2
} from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const { getEventById } = useApp();

  const eventId = (params?.id as string) || 'evt-summit-2026';
  const event = getEventById(eventId) || getEventById('evt-summit-2026');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState('');

  if (!event) {
    return (
      <div className="min-h-screen py-16 text-center space-y-3">
        <h2 className="font-display text-2xl text-[#111827] font-bold">Event Not Found</h2>
        <Link href="/events" className="text-xs text-[#064e3b] font-semibold underline">
          Back to Events Catalog
        </Link>
      </div>
    );
  }

  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  const handleOpenPass = (ticketId?: string) => {
    if (ticketId) setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none text-[#111827]">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064e3b] hover:underline"
      >
        <ArrowLeft size={14} />
        <span>Back to All Summits</span>
      </Link>

      {/* Hero Banner Card */}
      <div className="rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] overflow-hidden relative">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 via-[#111827]/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 space-y-2 text-[#ffffff]">
            <div className="flex flex-wrap gap-2">
              <span className="meta-tag px-2.5 py-1 rounded bg-[#ffffff]/20 backdrop-blur-md text-[#ffffff] font-bold">
                {event.format}
              </span>
              <span className="meta-tag px-2.5 py-1 rounded bg-[#ffffff]/20 backdrop-blur-md text-[#ffffff]">
                {event.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl text-[#ffffff] font-bold tracking-tight">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#e7e2d6] font-medium">{event.subtitle}</p>
          </div>
        </div>

        {/* Quick Meta Row */}
        <div className="p-6 bg-[#faf8f5] border-t border-[#e7e2d6] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-[#064e3b]">
              <Calendar size={18} />
            </div>
            <div>
              <span className="meta-tag text-[#6b7280] block">CONFERENCE DATES</span>
              <span className="font-semibold text-[#111827]">
                {new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-[#064e3b]">
              <MapPin size={18} />
            </div>
            <div>
              <span className="meta-tag text-[#6b7280] block">SANCTUARY VENUE</span>
              <span className="font-semibold text-[#111827]">{event.venueName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-[#064e3b]">
              <Users size={18} />
            </div>
            <div>
              <span className="meta-tag text-[#6b7280] block">ALLOCATION STATUS</span>
              <span className="font-semibold text-[#064e3b]">
                {event.registeredCount} / {event.capacity} Filled ({percentFilled}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Agenda & Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Description & Agenda */}
        <div className="lg:col-span-8 space-y-8">
          {/* About */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-3">
            <h3 className="text-xl font-bold text-[#0f172a]">
              About the Convocation
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">{event.description}</p>
          </div>

          {/* Session Schedule around Salah */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e7e2d6]">
              <Clock size={16} className="text-[#064e3b]" />
              <h3 className="text-xl font-bold text-[#0f172a]">
                Program Schedule Synchronized with Salah
              </h3>
            </div>

            <div className="space-y-3">
              {event.schedule.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.isPrayerBreak
                      ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                      : 'bg-[#faf8f5] border-[#e7e2d6] text-[#111827]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#111827] block text-sm">{item.title}</span>
                    {item.speaker && (
                      <span className="text-xs text-[#064e3b] font-medium block">Keynote Scholar: {item.speaker}</span>
                    )}
                    <span className="text-[11px] text-[#6b7280]">Hall: {item.location}</span>
                  </div>

                  <span className="font-mono text-xs px-3 py-1 rounded-xl bg-[#ffffff] text-[#064e3b] border border-[#e7e2d6] font-semibold shrink-0 shadow-2xs">
                    {item.startTime} – {item.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pass Options */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] space-y-4 sticky top-24">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="meta-tag text-[#064e3b] font-bold">SANCTUARY ACCESS PASSES</span>
            </div>
            <p className="text-xs text-[#6b7280]">
              Select a delegate category to launch the Flow State registration sequence.
            </p>

            <div className="space-y-3">
              {event.tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-3 text-xs hover:border-[#064e3b]/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#111827] text-sm">{t.name}</h4>
                      <span className="text-[11px] text-[#6b7280]">
                        {t.capacity - t.registeredCount} spots remaining
                      </span>
                    </div>
                    <span className="font-display font-bold text-base text-[#064e3b]">
                      {t.price === 0 ? 'Complimentary' : `$${t.price}`}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenPass(t.id)}
                    className="w-full py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] font-semibold text-xs hover:bg-[#043c2e] transition-all cursor-pointer shadow-xs"
                  >
                    Register for {t.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FlowRegistrationModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedTicketId={selectedTicketId}
      />
    </div>
  );
}
