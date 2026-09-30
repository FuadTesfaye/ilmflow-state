'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
  UserCheck
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
  const { currentUser, switchRole, announcements } = useApp();
  const [selectedBranch, setSelectedBranch] = useState<'West Covina Campus' | 'Madinah Virtual Hub'>('West Covina Campus');
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Branch Switcher */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg md:hidden hover:bg-slate-100"
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>

        {/* Branch Selector Dropdown */}
        <DropdownMenu
          align="left"
          trigger={
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 transition-all text-xs font-semibold text-slate-800">
              <Building size={14} className="text-[#135B3E]" />
              <span className="truncate max-w-[130px] sm:max-w-[180px]">{selectedBranch}</span>
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

        {/* Active View Title for Desktop */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400 pl-2">
          <span>/</span>
          <span className="text-slate-700 font-semibold">{currentTabName}</span>
        </div>
      </div>

      {/* Center: Command Palette Trigger (Search ⌘K) */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="text-slate-400 group-hover:text-[#135B3E]" />
            <span>Search events, attendees, questions...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-3xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Action Menu + Notifications + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Search Icon Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="sm:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
          aria-label="Quick search"
        >
          <Search size={18} />
        </button>

        {/* + Quick Action Menu */}
        <DropdownMenu
          trigger={
            <Button size="sm" className="gap-1.5 bg-[#135B3E] hover:bg-[#0e4831] text-white rounded-xl shadow-xs">
              <Plus size={15} />
              <span className="hidden sm:inline text-xs font-semibold">Action</span>
            </Button>
          }
        >
          <DropdownMenuLabel>Create &amp; Dispatch</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onQuickAction('create-event')}>
            <Calendar size={14} className="text-emerald-700" />
            <span>New Community Event</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onQuickAction('add-question')}>
            <FileText size={14} className="text-emerald-700" />
            <span>Add Question to Bank</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onQuickAction('new-announcement')}>
            <Bell size={14} className="text-emerald-700" />
            <span>Broadcast Announcement</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onQuickAction('export-csv')}>
            <Download size={14} className="text-slate-600" />
            <span>Export Attendees (CSV)</span>
          </DropdownMenuItem>
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-100 text-left">
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

        {/* User Role Switcher Dropdown */}
        <DropdownMenu
          trigger={
            <div className="flex items-center gap-2 pl-1 cursor-pointer">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 capitalize mt-0.5">{currentUser.role}</span>
              </div>
            </div>
          }
        >
          <DropdownMenuLabel>Simulation Role Switcher</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => switchRole('admin')}>
            <Shield size={14} className="text-emerald-700" />
            <div className="flex flex-col">
              <span className="font-semibold">Super Administrator</span>
              <span className="text-[10px] text-slate-400">Full system &amp; financial access</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole('judge')}>
            <Award size={14} className="text-amber-600" />
            <div className="flex flex-col">
              <span className="font-semibold">Scholar / Judge</span>
              <span className="text-[10px] text-slate-400">Grading &amp; sanad evaluations</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole('staff')}>
            <UserCheck size={14} className="text-blue-600" />
            <div className="flex flex-col">
              <span className="font-semibold">Gate &amp; Event Staff</span>
              <span className="text-[10px] text-slate-400">Barcode QR scanner check-in</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole('participant')}>
            <Sparkles size={14} className="text-purple-600" />
            <div className="flex flex-col">
              <span className="font-semibold">Community Member</span>
              <span className="text-[10px] text-slate-400">Switch to Participant Portal</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/portal" className="w-full flex items-center justify-between text-xs font-semibold text-[#135B3E]">
              <span>Visit Member Portal</span>
              <ExternalLink size={12} />
            </Link>
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
};
