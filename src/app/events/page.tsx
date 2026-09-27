'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import { FlowRegistrationModal } from '../../components/registration/FlowRegistrationModal';
import { IslamicStarIcon } from '../../components/common/IslamicPattern';
import { Calendar, MapPin, Users, ArrowRight, Search, Filter } from 'lucide-react';

export default function EventsListingPage() {
  const { events } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState<'all' | 'in-person' | 'online' | 'hybrid'>('all');
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.venueName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = formatFilter === 'all' || ev.format === formatFilter;
    return matchesSearch && matchesFormat;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none text-[#111827]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#064e3b] shadow-xs">
          <IslamicStarIcon size={13} className="text-[#9e782f]" />
          <span className="meta-tag font-bold">ACADEMIC CALENDAR &amp; CONVOCATIONS</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl text-[#111827] font-bold tracking-tight">
          Islamic Summits, Conferences &amp; Intensives
        </h1>
        <p className="text-xs sm:text-sm text-[#4b5563]">
          Explore international gatherings of scholarship, Ten Qira’at recitation assemblies, and academic intensives across the Islamic world.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-2.5 text-[#9ca3af]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search summit by title, city or venue..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#111827] placeholder:text-[#9ca3af] focus:border-[#064e3b] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'in-person', 'online', 'hybrid'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                formatFilter === fmt
                  ? 'bg-[#064e3b] text-[#ffffff] shadow-xs'
                  : 'bg-[#faf8f5] border border-[#e7e2d6] text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              {fmt === 'all' ? 'All Formats' : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => {
          const percentFilled = Math.min(100, Math.round((ev.registeredCount / ev.capacity) * 100));
          return (
            <div
              key={ev.id}
              className="rounded-3xl bg-[#ffffff] border border-[#e7e2d6] hover:border-[#064e3b]/50 transition-all overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
            >
              {/* Event Image Banner */}
              <div className="relative h-48 w-full bg-[#f4f0e6] overflow-hidden">
                <img
                  src={ev.coverImage}
                  alt={ev.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="meta-tag px-2.5 py-1 rounded bg-[#ffffff]/90 backdrop-blur-md text-[#064e3b] border border-[#e7e2d6] font-bold">
                    {ev.format}
                  </span>
                  <span className="meta-tag px-2.5 py-1 rounded bg-[#ffffff]/90 backdrop-blur-md text-[#111827] border border-[#e7e2d6]">
                    {ev.category}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-[#9e782f]" />
                      {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#9e782f]" />
                      {ev.venueName.split(' ')[0]}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#111827] leading-snug">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-[#4b5563] line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 pt-4 border-t border-[#e7e2d6]">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6b7280]">Capacity Status:</span>
                    <span className="text-[#064e3b] font-semibold">{percentFilled}% Filled</span>
                  </div>
                  <div className="w-full bg-[#f4f0e6] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#064e3b] h-full rounded-full" style={{ width: `${percentFilled}%` }} />
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 flex items-center justify-between gap-2">
                  <Link
                    href={`/events/${ev.id}`}
                    className="text-xs font-semibold text-[#064e3b] hover:underline"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => setSelectedEventForModal(ev)}
                    className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Register Pass</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      {selectedEventForModal && (
        <FlowRegistrationModal
          event={selectedEventForModal}
          isOpen={Boolean(selectedEventForModal)}
          onClose={() => setSelectedEventForModal(null)}
        />
      )}
    </div>
  );
}
