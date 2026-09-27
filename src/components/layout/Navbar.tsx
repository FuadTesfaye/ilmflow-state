'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { IslamicStarIcon } from '../common/IslamicPattern';
import {
  Calendar,
  Award,
  Clock,
  Compass,
  CheckCircle,
  Menu,
  X,
  Bell,
  Shield,
  QrCode,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, announcements } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navLinks = [
    { label: 'Summits', href: '/events', icon: Calendar },
    { label: 'Competitions', href: '/competitions', icon: Award },
    { label: 'Schedule', href: '/schedule', icon: Clock },
    { label: 'Scholars', href: '/speakers', icon: Compass },
    { label: 'Leaderboard', href: '/leaderboard', icon: Award },
    { label: 'Verify Credentials', href: '/certificates/verify', icon: CheckCircle }
  ];

  const getRolePortal = () => {
    switch (currentUser.role) {
      case 'judge':
        return { label: 'Judicial Chamber', href: '/judge', icon: Award, color: 'text-[#9e782f] border-[#9e782f]/40 bg-[#fbf8f2]' };
      case 'staff':
        return { label: 'Arrival Gate', href: '/staff', icon: QrCode, color: 'text-[#064e3b] border-[#064e3b]/30 bg-[#f0fdf4]' };
      case 'admin':
      case 'superadmin':
        return { label: 'Secretariat Admin', href: '/admin', icon: Shield, color: 'text-[#111827] border-[#111827]/20 bg-[#f9fafb]' };
      case 'participant':
      default:
        return { label: 'Delegate Portal', href: '/portal', icon: UserCheck, color: 'text-[#064e3b] border-[#064e3b]/30 bg-[#f0fdf4]' };
    }
  };

  const portal = getRolePortal();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#ffffff]/95 border-b border-[#e7e2d6] backdrop-blur-md">
      {/* Top Meta Bar */}
      <div className="bg-[#f4f0e6] border-b border-[#e7e2d6] px-4 py-1 text-xs text-[#6b7280]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#9e782f] font-arabic text-sm font-semibold">
              <IslamicStarIcon size={12} className="text-[#9e782f]" />
              ١٤ ربيع الأول ١٤٤٨ هـ
            </span>
            <span className="hidden sm:inline text-[#d4ccbd]">|</span>
            <span className="hidden sm:inline meta-tag text-[#4b5563]">
              14 Rabi‘ al-Awwal 1448 AH • Madinah Sanctuary Time
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[#6b7280] text-[11px]">Next Salah:</span>
              <span className="text-[#111827] font-semibold text-xs">Asr (03:38 PM)</span>
              <span className="meta-tag text-[#064e3b] bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#e7e2d6] font-bold">
                1h 24m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#faf8f5] flex items-center justify-center shadow-md group-hover:bg-[#043c2e] transition-colors">
              <IslamicStarIcon size={20} className="text-[#d4a94b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#0f172a] group-hover:text-[#064e3b] transition-colors">
                  ILM<span className="text-[#9e782f]">FLOW</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.14em] px-2 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] border border-[#e7e2d6]">
                  STATE
                </span>
              </div>
              <p className="font-arabic text-[11px] text-[#6b7280] -mt-1" dir="rtl">
                المَنْظُومَةُ الإِسْلَامِيَّةُ لِلْمُؤْتَمَرَاتِ وَالمُسَابَقَاتِ
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#f4f0e6] text-[#064e3b] border border-[#e7e2d6] font-semibold shadow-xs'
                      : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#faf8f5]'
                  }`}
                >
                  <link.icon size={13} className={isActive ? 'text-[#064e3b]' : 'text-[#6b7280]'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Announcements */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] hover:border-[#9e782f]/50 text-[#4b5563] hover:text-[#111827] relative transition-colors cursor-pointer"
                title="Broadcast Notifications"
              >
                <Bell size={15} />
                {announcements.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#064e3b] text-[#ffffff] text-[9px] font-bold flex items-center justify-center font-mono">
                    {announcements.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#ffffff] border border-[#e7e2d6] shadow-2xl p-4 text-[#111827] z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#e7e2d6]">
                    <span className="meta-tag text-[#064e3b] font-bold">
                      OFFICIAL DISPATCHES
                    </span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-xs text-[#6b7280] hover:text-[#111827] cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="divide-y divide-[#f4f0e6] mt-2 max-h-72 overflow-y-auto">
                    {announcements.map((item) => (
                      <div key={item.id} className="py-2.5">
                        <div className="flex items-center justify-between">
                          <span className="meta-tag text-[9px] px-1.5 py-0.5 rounded bg-[#f4f0e6] text-[#064e3b]">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-[#6b7280]">
                            {new Date(item.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-[#111827] mt-1">{item.title}</h4>
                        <p className="text-[11px] text-[#4b5563] mt-1 leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portal Destination */}
            <Link
              href={portal.href}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:shadow-xs ${portal.color}`}
            >
              <portal.icon size={14} />
              <span>{portal.label}</span>
              <span className="text-[10px] opacity-70 font-normal">
                ({currentUser.name.split(' ')[0]})
              </span>
            </Link>

            {/* Registration CTA */}
            <Link
              href="/events"
              className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] hover:bg-[#043c2e] text-xs font-semibold transition-all shadow-sm"
            >
              Enroll Pass
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href={portal.href}
              className="p-2 rounded-lg bg-[#faf8f5] border border-[#e7e2d6] text-[#064e3b]"
            >
              <portal.icon size={15} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#faf8f5] border border-[#e7e2d6] text-[#4b5563]"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#ffffff] border-b border-[#e7e2d6] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#4b5563] hover:text-[#064e3b] rounded-md"
            >
              <link.icon size={14} className="text-[#064e3b]" />
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#e7e2d6] space-y-2">
            <Link
              href={portal.href}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#f4f0e6] text-xs text-[#064e3b] font-semibold"
            >
              <portal.icon size={14} />
              Open {portal.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
