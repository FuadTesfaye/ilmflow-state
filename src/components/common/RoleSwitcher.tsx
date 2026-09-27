'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { Shield, UserCheck, Award, QrCode, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { IslamicStarIcon } from './IslamicPattern';

const ROLES: { id: Role; label: string; name: string; icon: React.ElementType; badge: string; desc: string }[] = [
  {
    id: 'participant',
    label: 'Participant',
    name: 'Zayd Al-Ansari',
    icon: UserCheck,
    badge: 'Attendee & Competitor',
    desc: 'Take online tests, view digital passes, submit Quran audio & essays, download certificates.'
  },
  {
    id: 'judge',
    label: 'Judge / Grader',
    name: 'Dr. Sheikh Ahmad Al-Mansoor',
    icon: Award,
    badge: 'Senior Qira’at Scholar',
    desc: 'Access judging portal, listen to recitation audio, grade submissions with 100-point rubric.'
  },
  {
    id: 'staff',
    label: 'Event Staff',
    name: 'Bilal Qureshi',
    icon: QrCode,
    badge: 'Gate & Check-in Marshal',
    desc: 'Operate gate QR scanner, check-in attendees, monitor live sanctuary capacity.'
  },
  {
    id: 'admin',
    label: 'Administrator',
    name: 'Fatima Al-Zahra',
    icon: Shield,
    badge: 'Academic Secretariat',
    desc: 'Full administrative access: Form Builder, Question Bank, Capacity, Event & Competition setup.'
  },
  {
    id: 'visitor',
    label: 'Visitor',
    name: 'Prospective Guest',
    icon: Eye,
    badge: 'Public Explorer',
    desc: 'Browse public summit agendas, explore competition categories, view speakers and verify certificates.'
  }
];

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const activeRoleConfig = ROLES.find((r) => r.id === currentUser.role) || ROLES[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {isOpen && (
        <div className="mb-2 w-80 sm:w-96 rounded-2xl bg-[#ffffff] border border-[#e7e2d6] shadow-2xl p-4 text-[#111827] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
            <div className="flex items-center gap-2">
              <IslamicStarIcon size={16} className="text-[#064e3b]" />
              <span className="font-sans text-xs tracking-wider text-[#064e3b] font-bold uppercase">
                SYSTEM PERSONA SWITCHER
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#6b7280] hover:text-[#111827] text-xs px-2.5 py-0.5 rounded-lg border border-[#e7e2d6] bg-[#faf8f5] hover:bg-[#f4f0e6] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-[#6b7280] mt-2 mb-3">
            Switch your active role instantly to test each specialized enterprise portal and workflow:
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
                      ? 'bg-[#f4f0e6] border-[#064e3b] text-[#111827] shadow-xs'
                      : 'bg-[#faf8f5] border-[#e7e2d6] hover:border-[#064e3b]/40 text-[#4b5563]'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-[#064e3b] text-[#ffffff]' : 'bg-[#e7e2d6]/60 text-[#064e3b]'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827]">{r.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffffff] text-[#064e3b] border border-[#e7e2d6] font-semibold">
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#064e3b] font-medium mt-0.5 truncate">{r.name}</p>
                    <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#ffffff] border border-[#e7e2d6] text-[#111827] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] hover:border-[#064e3b] transition-all group cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
        <activeRoleConfig.icon size={15} className="text-[#064e3b]" />
        <div className="text-left text-xs">
          <span className="text-[9px] uppercase tracking-wider text-[#6b7280] block leading-none font-bold">
            VIEWING AS
          </span>
          <span className="font-semibold text-[#111827] block leading-tight">
            {activeRoleConfig.label} ({currentUser.name.split(' ')[0]})
          </span>
        </div>
        {isOpen ? <ChevronDown size={14} className="text-[#6b7280]" /> : <ChevronUp size={14} className="text-[#6b7280]" />}
      </button>
    </div>
  );
};
