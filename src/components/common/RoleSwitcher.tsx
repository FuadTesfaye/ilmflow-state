'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Shield, UserCheck, Award, QrCode, Eye, ChevronUp, ChevronDown } from 'lucide-react';

const ROLES: {
  id: Role;
  label: string;
  name: string;
  icon: React.ElementType;
  badge: string;
  desc: string;
}[] = [
  {
    id: 'participant',
    label: 'Participant',
    name: 'Zayd Al-Ansari',
    icon: UserCheck,
    badge: 'Attendee',
    desc: 'Access delegate pass, launch online tests, submit entries, view certificates.'
  },
  {
    id: 'judge',
    label: 'Judge',
    name: 'Dr. Sheikh Ahmad Al-Mansoor',
    icon: Award,
    badge: 'Adjudicator',
    desc: 'Audit audio recitations and essay treatises using 100-point standardized rubrics.'
  },
  {
    id: 'staff',
    label: 'Event Staff',
    name: 'Bilal Qureshi',
    icon: QrCode,
    badge: 'Gate Operations',
    desc: 'Operate optical barcode scanner, check-in attendees, and track capacity.'
  },
  {
    id: 'admin',
    label: 'Administrator',
    name: 'Fatima Al-Zahra',
    icon: Shield,
    badge: 'Admin Console',
    desc: 'Full administrative access: Form builder, question bank, and event management.'
  },
  {
    id: 'visitor',
    label: 'Public Visitor',
    name: 'Guest User',
    icon: Eye,
    badge: 'Public View',
    desc: 'Browse public event programs, examine competitions, and verify credentials.'
  }
];

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const activeRoleConfig = ROLES.find((r) => r.id === currentUser.role) || ROLES[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {isOpen && (
        <Card className="mb-3 w-80 sm:w-96 p-4 bg-white/95 backdrop-blur-md border-slate-200 shadow-xl animate-in fade-in-50 slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Role Switcher
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 text-xs px-2"
            >
              Close
            </Button>
          </div>

          <p className="text-xs text-slate-500 mt-2 mb-3">
            Switch active persona to preview specialized enterprise dashboard views:
          </p>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = currentUser.role === r.id;

              return (
                <button
                  key={r.id}
                  onClick={() => {
                    switchRole(r.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{r.label}</span>
                      <Badge variant={isSelected ? 'success' : 'secondary'} className="text-[10px]">
                        {r.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">{r.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/95 backdrop-blur-xl border border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] hover:border-emerald-400 transition-all cursor-pointer group"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse" />
        <activeRoleConfig.icon size={15} className="text-emerald-400" />
        <div className="text-left text-xs">
          <span className="text-[9px] uppercase tracking-wider text-emerald-400/80 block font-bold leading-none font-mono">
            PERSONA
          </span>
          <span className="font-bold text-white block leading-tight">
            {activeRoleConfig.label}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown size={14} className="text-slate-400 group-hover:text-white" />
        ) : (
          <ChevronUp size={14} className="text-slate-400 group-hover:text-white" />
        )}
      </button>
    </div>
  );
};
