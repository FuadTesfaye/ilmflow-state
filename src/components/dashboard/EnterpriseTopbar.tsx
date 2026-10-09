'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PrayerTimeWidget } from './PrayerTimeWidget';
import { IslamicStarEmblem } from '../common/IslamicPattern';
import {
  Menu,
  Search,
  Plus,
  Bell,
  CheckCircle,
  Building,
  Sparkles,
  ChevronDown,
  Calendar,
  FileText,
  Award,
  Download,
  ExternalLink,
  Shield,
  UserCheck,
  ArrowLeft,
  QrCode,
  ShieldAlert,
  Users,
  Ticket,
  Eye
} from 'lucide-react';

interface EnterpriseTopbarProps {
  onToggleMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onQuickAction: (action: string) => void;
  currentTabName?: string;
}

export const EnterpriseTopbar: React.FC<EnterpriseTopbarProps> = ({
  onToggleMobileMenu,
  onOpenCommandPalette,
  onQuickAction,
  currentTabName = 'Overview'
}) => {
  const { currentUser, switchRole, announcements, can, currentRoleMeta } = useApp();
  const [selectedBranch, setSelectedBranch] = useState<'West Covina Campus' | 'Madinah Virtual Hub'>('West Covina Campus');
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8">
      {/* Left: Mobile Drawer Trigger + Website Backlink + Branch Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Sidebar Drawer Trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg md:hidden hover:bg-slate-100 cursor-pointer shrink-0"
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>

        {/* Return to Public Website link */}
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#135B3E] hover:bg-emerald-50/60 transition-colors shrink-0"
          title="Return to public portal homepage"
        >
          <ArrowLeft size={13} />
          <span>Website</span>
        </Link>

        <span className="hidden sm:inline text-slate-300">|</span>

        {/* Branch Selector Dropdown */}
        <DropdownMenu
          align="left"
          trigger={
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 transition-all text-xs font-semibold text-slate-800 shrink-0">
              <Building size={14} className="text-[#135B3E]" />
              <span className="truncate max-w-[110px] sm:max-w-[170px]">{selectedBranch}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </div>
          }
        >
          <DropdownMenuLabel>Active Islamic Campus</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setSelectedBranch('West Covina Campus')}>
            <span className={selectedBranch === 'West Covina Campus' ? 'font-bold text-[#135B3E]' : ''}>
              Masjid Al-Nabi (West Covina)
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedBranch('Madinah Virtual Hub')}>
            <span className={selectedBranch === 'Madinah Virtual Hub' ? 'font-bold text-[#135B3E]' : ''}>
              Madinah Al-Munawwarah Virtual Hub
            </span>
          </DropdownMenuItem>
        </DropdownMenu>

        {/* Active Tab Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400 pl-1 shrink-0">
          <span>/</span>
          <span className="text-slate-800 font-semibold">{currentTabName}</span>
        </div>
      </div>

      {/* Center: Compact Prayer Ticker + Search ⌘K */}
      <div className="flex items-center gap-3 flex-1 max-w-xl mx-2 sm:mx-4 justify-center sm:justify-end lg:justify-between">
        {/* Compact Prayer Times Ticker (Visible on md+) */}
        <div className="hidden xl:block">
          <PrayerTimeWidget compact />
        </div>

        {/* Command Palette Trigger (Search ⌘K) */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex flex-1 max-w-xs items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Search size={14} className="text-slate-400 group-hover:text-[#135B3E]" />
            <span className="truncate">Search commands, events, guests...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-3xs ml-1">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Notifications & User Role Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="sm:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
          aria-label="Search command palette"
        >
          <Search size={18} />
        </button>

        {/* + Quick Action Menu */}
        <DropdownMenu
          trigger={
            <Button size="sm" className="gap-1.5 bg-[#135B3E] hover:bg-[#0c4427] text-white rounded-xl shadow-xs px-2.5 sm:px-3">
              <Plus size={15} />
              <span className="hidden sm:inline text-xs font-semibold">Action</span>
            </Button>
          }
        >
          <DropdownMenuLabel>Contextual Actions</DropdownMenuLabel>
          {can('event:create') && (
            <DropdownMenuItem onClick={() => onQuickAction('create-event')}>
              <Calendar size={14} className="text-emerald-700" />
              <span>New Community Event</span>
            </DropdownMenuItem>
          )}
          {can('question:create') && (
            <DropdownMenuItem onClick={() => onQuickAction('add-question')}>
              <FileText size={14} className="text-emerald-700" />
              <span>Add Question to Bank</span>
            </DropdownMenuItem>
          )}
          {can('announcement:create') && (
            <DropdownMenuItem onClick={() => onQuickAction('new-announcement')}>
              <Bell size={14} className="text-emerald-700" />
              <span>Broadcast Announcement</span>
            </DropdownMenuItem>
          )}
          {can('submission:grade') && (
            <DropdownMenuItem onClick={() => onQuickAction('grade-next')}>
              <Award size={14} className="text-amber-600" />
              <span>Grade Next Submission</span>
            </DropdownMenuItem>
          )}
          {can('attendance:scan') && (
            <DropdownMenuItem onClick={() => onQuickAction('scan-gate')}>
              <QrCode size={14} className="text-blue-600" />
              <span>Gate Optical Scanner</span>
            </DropdownMenuItem>
          )}
          {can('pass:view_own') && (
            <DropdownMenuItem onClick={() => onQuickAction('view-passes')}>
              <Ticket size={14} className="text-purple-600" />
              <span>My Delegate Pass</span>
            </DropdownMenuItem>
          )}
          {can('registration:export') && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onQuickAction('export-csv')}>
                <Download size={14} className="text-slate-600" />
                <span>Export Attendees (CSV)</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenu>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#135B3E] ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-100 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Operational Alerts</span>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="mt-2 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {announcements.map((item) => (
                  <div key={item.id} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#135B3E] uppercase">{item.category}</span>
                      <span className="text-[10px] text-slate-400">Recent</span>
                    </div>
                    <h5 className="text-xs font-semibold text-slate-900 leading-snug">{item.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Persona Switcher */}
        <DropdownMenu
          trigger={
            <div className="flex items-center gap-2 pl-1 cursor-pointer">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#135B3E]/30"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</span>
                <span className="text-[10px] text-[#135B3E] font-semibold capitalize mt-0.5">
                  {currentUser.role} • {currentRoleMeta.badge}
                </span>
              </div>
            </div>
          }
        >
          <DropdownMenuLabel>Active Persona Switcher</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => switchRole('superadmin')}>
            <ShieldAlert size={14} className="text-amber-700" />
            <div className="flex flex-col">
              <span className="font-semibold">Super Administrator</span>
              <span className="text-[10px] text-slate-400">Supreme governance &amp; audit</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole('admin')}>
            <Shield size={14} className="text-emerald-700" />
            <div className="flex flex-col">
              <span className="font-semibold">Platform Administrator</span>
              <span className="text-[10px] text-slate-400">Events, exams &amp; admissions</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole('judge')}>
            <Award size={14} className="text-[#9E782F]" />
            <div className="flex flex-col">
              <span className="font-semibold">Scholar Adjudicator</span>
              <span className="text-[10px] text-slate-400">Grading rubric workstation</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole('staff')}>
            <QrCode size={14} className="text-blue-600" />
            <div className="flex flex-col">
              <span className="font-semibold">Gate &amp; Arrival Staff</span>
              <span className="text-[10px] text-slate-400">Check-in barcode terminal</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole('participant')}>
            <UserCheck size={14} className="text-purple-600" />
            <div className="flex flex-col">
              <span className="font-semibold">Attendee / Competitor</span>
              <span className="text-[10px] text-slate-400">Passes &amp; certificates hub</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole('parent')}>
            <Users size={14} className="text-indigo-600" />
            <div className="flex flex-col">
              <span className="font-semibold">Family Guardian</span>
              <span className="text-[10px] text-slate-400">Dependent badges &amp; sanads</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole('visitor')}>
            <Eye size={14} className="text-slate-600" />
            <div className="flex flex-col">
              <span className="font-semibold">Public Community Visitor</span>
              <span className="text-[10px] text-slate-400">Public program catalog</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/" className="w-full flex items-center justify-between text-xs font-semibold text-[#135B3E]">
              <span>Visit Public Website</span>
              <ExternalLink size={12} />
            </Link>
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
};
