'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import { FlowRegistrationModal } from '../../components/registration/FlowRegistrationModal';
import { IslamicShaderBackground } from '../../components/shaders/IslamicShaderBackground';
import { ArabicCalligraphyGutter } from '../../components/common/IslamicPattern';
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Users,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function EventsListingPage() {
  const { events } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'community' | 'conference' | 'workshop' | 'prayer'>('all');
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Programs' },
    { id: 'community', label: 'Weekly Assemblies' },
    { id: 'conference', label: 'Academic Summits' },
    { id: 'workshop', label: 'Intensives & Arts' },
    { id: 'prayer', label: 'Congregational Salah' }
  ] as const;

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.speakers && ev.speakers.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = categoryFilter === 'all' || ev.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-transparent text-slate-800 font-sans py-10 sm:py-16 overflow-hidden">
      {/* Ambient Page Shader & Calligraphy */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">

        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#135B3E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#135B3E]" />
            <span>Masjid Al-Nabi • Community Calendar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Events &amp; Weekly Programs
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Congregational supplications, academic intensives, youth halaqas, and community dinners.
            Admission is free for community members with open family seating.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event, scholar, or venue..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#135B3E] focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#135B3E] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-[#135B3E]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No events found matching your criteria</h3>
            <p className="text-xs text-slate-500">Try adjusting your search terms or clearing filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 rounded-full bg-[#135B3E] text-white text-xs font-semibold mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((ev) => {
              const eventDate = new Date(ev.startDate);
              const monthStr = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
              const dayStr = eventDate.toLocaleDateString('en-US', { day: 'numeric' });
              const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
              const isFree = ev.tickets?.some((t) => t.price === 0) || !ev.tickets?.length;

              return (
                <div
                  key={ev.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Image & Date Badge */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={ev.coverImage}
                      alt={ev.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Clean Date Calendar Ribbon */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 text-center shadow-sm border border-slate-200/60 leading-none">
                      <span className="text-[10px] font-bold text-[#135B3E] uppercase block tracking-wider">
                        {monthStr}
                      </span>
                      <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                        {dayStr}
                      </span>
                    </div>

                    {/* Admission Badge */}
                    <div className="absolute top-3 right-3">
                      {isFree ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold tracking-wide shadow-sm">
                          Free Admission
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold tracking-wide">
                          From ${ev.tickets[0]?.price}
                        </span>
                      )}
                    </div>

                    {/* Time pill on bottom of image */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium">
                      <Clock size={13} className="text-emerald-300" />
                      <span>{dayOfWeek} • {ev.schedule?.[0]?.startTime || '5:30 PM'}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {/* Venue location */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin size={13} className="text-[#135B3E] shrink-0" />
                        <span className="truncate">{ev.venueName}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#135B3E] transition-colors leading-snug">
                        {ev.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>

                      {/* Lead Speaker / Faculty */}
                      {ev.speakers?.[0] && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <img
                            src={ev.speakers[0].avatar}
                            alt={ev.speakers[0].name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <span className="text-xs font-semibold text-slate-700 truncate">
                            {ev.speakers[0].name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Attendees & Action Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Users size={13} className="text-slate-400" />
                        <span>{ev.registeredCount} attending</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/events/${ev.id}`}
                          className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-300 text-xs font-semibold text-slate-600 hover:text-[#135B3E] transition-colors"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => setSelectedEventForModal(ev)}
                          className="px-4 py-1.5 rounded-full bg-[#135B3E] hover:bg-[#0e4831] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>RSVP</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
