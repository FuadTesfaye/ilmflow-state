'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty
} from '../ui/command';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Award,
  FileCheck,
  Plus,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  Search
} from 'lucide-react';

interface CommandPaletteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTab?: (tab: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  open,
  onOpenChange,
  onSelectTab
}) => {
  const router = useRouter();
  const { events, competitions, users } = useApp();
  const [query, setQuery] = useState('');

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleAction = (callback: () => void) => {
    callback();
    onOpenChange(false);
    setQuery('');
  };

  const navItems = [
    { label: 'Executive Overview', icon: LayoutDashboard, action: () => onSelectTab?.('overview') },
    { label: 'Events & Ticketing', icon: Calendar, action: () => onSelectTab?.('events') },
    { label: 'Attendee Registrations & Check-in', icon: Users, action: () => onSelectTab?.('registrations') },
    { label: 'Competitions & Tournaments', icon: Award, action: () => onSelectTab?.('competitions') },
    { label: 'Question Bank Management', icon: FileText, action: () => onSelectTab?.('questions') },
    { label: 'Manual Grading Queue', icon: Award, action: () => onSelectTab?.('grading') },
    { label: 'Dynamic Form Studio', icon: FileText, action: () => onSelectTab?.('forms') },
    { label: 'Audit Trail & Compliance Logs', icon: ShieldCheck, action: () => router.push('/admin/audit-logs') },
    { label: 'Prayers & Adhan Schedule', icon: Clock, action: () => router.push('/schedule') },
    { label: 'Switch to Member Portal', icon: Sparkles, action: () => router.push('/portal') }
  ];

  const filteredNav = navItems.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command, event, or search congregants..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <CommandList>
        {filteredNav.length === 0 && filteredEvents.length === 0 && filteredUsers.length === 0 && (
          <CommandEmpty>No matching results found for &ldquo;{query}&rdquo;</CommandEmpty>
        )}

        {filteredNav.length > 0 && (
          <CommandGroup heading="Navigation & System Consoles">
            {filteredNav.map((item, idx) => (
              <CommandItem key={idx} onClick={() => handleAction(item.action)}>
                <item.icon size={16} className="text-[#135B3E] shrink-0" />
                <span className="flex-1 font-medium">{item.label}</span>
                <span className="text-[10px] text-slate-400">Jump</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredEvents.length > 0 && (
          <CommandGroup heading="Active Events & Programs">
            {filteredEvents.map((evt) => (
              <CommandItem
                key={evt.id}
                onClick={() =>
                  handleAction(() => {
                    router.push(`/events/${evt.id}`);
                  })
                }
              >
                <Calendar size={16} className="text-emerald-600 shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate">{evt.title}</span>
                  <span className="text-[10px] text-slate-400 truncate">{evt.venueName} • {evt.registeredCount} RSVPs</span>
                </div>
                <ArrowRight size={13} className="text-slate-400" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredUsers.length > 0 && (
          <CommandGroup heading="Congregants & Community Staff">
            {filteredUsers.map((usr) => (
              <CommandItem
                key={usr.id}
                onClick={() =>
                  handleAction(() => {
                    onSelectTab?.('registrations');
                  })
                }
              >
                <img src={usr.avatar} alt={usr.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate">{usr.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{usr.email} • {usr.role}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {usr.role}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
