'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { FlowRegistrationModal } from '../../../components/registration/FlowRegistrationModal';
import { IslamicShaderBackground } from '../../../components/shaders/IslamicShaderBackground';
import { ArabicCalligraphyGutter } from '../../../components/common/IslamicPattern';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Check,
  Share2,
  Bookmark
} from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const { getEventById, addToast } = useApp();

  const eventId = (params?.id as string) || 'evt-summit-2026';
  const event = getEventById(eventId) || getEventById('evt-summit-2026');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState('');

  if (!event) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4 bg-[#f4f8f5] text-slate-800 font-sans">
        <h2 className="text-2xl text-slate-900 font-bold">Event Not Found</h2>
        <Link href="/events">
          <button className="px-6 py-2.5 rounded-full bg-[#135B3E] text-white text-xs font-semibold">
            Back to Events
          </button>
        </Link>
      </div>
    );
  }

  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  const handleOpenPass = (ticketId?: string) => {
    if (ticketId) setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Event link copied to clipboard!', 'info');
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-800 font-sans py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient Shader & Watermark */}
      <IslamicShaderBackground
        type="mesh"
        variant="ambient"
        speed={0.05}
        distortion={0.35}
        swirl={0.3}
        opacity={0.9}
        isPageBackground={true}
      />
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#135b3e_1.5px,transparent_1.5px)] [background-size:24px_24px] -z-0" />
      <ArabicCalligraphyGutter side="left" />
      <ArabicCalligraphyGutter side="right" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Back Link & Quick Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#135B3E] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Events</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#135B3E] hover:border-emerald-300 transition-colors shadow-2xs cursor-pointer"
              aria-label="Share event"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="rounded-[28px] overflow-hidden bg-white border border-slate-200/90 shadow-sm">
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-100">
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-3 text-white max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                  {event.format}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold capitalize">
                  {event.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {event.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {event.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Meta Row */}
          <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#135B3E] flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Date &amp; Time</span>
                <span className="font-bold text-slate-900 text-sm">
                  {new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#135B3E] flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Location</span>
                <span className="font-bold text-slate-900 text-sm truncate max-w-xs block">
                  {event.venueName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#135B3E] flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Attendance</span>
                <span className="font-bold text-slate-900 text-sm">
                  {event.registeredCount} confirmed ({event.capacity - event.registeredCount} seats left)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Description, Schedule & Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Description & Agenda */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">About this Gathering</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{event.description}</p>

              {event.venueAddress && (
                <div className="pt-2 text-xs text-slate-500">
                  <strong>Address:</strong> {event.venueAddress}
                </div>
              )}
            </div>

            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Clock size={18} className="text-[#135B3E]" />
                  <h3 className="text-base font-bold text-slate-900">Session Schedule</h3>
                </div>

                <div className="space-y-3">
                  {event.schedule.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.isPrayerBreak
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-slate-50 border-slate-200/70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{item.title}</span>
                          {item.isPrayerBreak && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                              Salah Break
                            </span>
                          )}
                        </div>
                        {item.speaker && <p className="text-slate-600 font-medium">{item.speaker}</p>}
                        {item.location && <span className="text-[11px] text-slate-400 block">{item.location}</span>}
                      </div>

                      <span className="font-mono font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200 shrink-0">
                        {item.startTime} – {item.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pass Selection */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4 sticky top-24">
              <h3 className="text-base font-bold text-slate-900">Select Admission Pass</h3>
              <div className="space-y-3">
                {event.tickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-sm text-slate-900">{tkt.name}</h4>
                      <span className="text-base font-bold text-[#135B3E]">
                        {tkt.price === 0 ? 'Free' : `$${tkt.price}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{tkt.description}</p>
                    <div className="space-y-1 pt-1">
                      {tkt.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Check size={13} className="text-[#135B3E] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleOpenPass(tkt.id)}
                      className="w-full mt-3 py-2.5 rounded-full bg-[#135B3E] hover:bg-[#0e4831] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                    >
                      {tkt.price === 0 ? 'Reserve Free RSVP' : `Register Pass ($${tkt.price})`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Registration Modal */}
      <FlowRegistrationModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedTicketId={selectedTicketId}
      />
    </div>
  );
}
