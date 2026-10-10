'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { IslamicStarEmblem } from '../common/IslamicPattern';
import {
  Search,
  Menu,
  X,
  Bell,
  Heart,
  Calendar,
  BookOpen,
  Award,
  Users,
  Compass
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, announcements } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  // Exact links from the Dribbble design
  const navLinks = [
    { label: 'About us', href: '/#about' },
    { label: 'News', href: '/#news' },
    { label: 'Educational', href: '/competitions' },
    { label: 'Event', href: '/events' },
    { label: 'Donate', href: '/#donate' },
    { label: 'Services', href: '/#services' }
  ];

  const getRoleDestination = () => {
    switch (currentUser.role) {
      case 'judge':
        return { label: 'Judge Portal', href: '/dashboard' };
      case 'staff':
        return { label: 'Staff Check-in', href: '/dashboard' };
      case 'admin':
      case 'superadmin':
        return { label: 'Command Center', href: '/dashboard' };
      case 'participant':
      default:
        return { label: 'My Dashboard', href: '/dashboard' };
    }
  };

  const portal = getRoleDestination();

  // Suppress public marketing navbar on dedicated dashboard/admin routes to prevent duplicate headers
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-emerald-900/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Exact Brand Logo matching Dribbble */}
          <Link href="/" className="flex items-center gap-3 group">
            <IslamicStarEmblem className="text-[#135B3E] group-hover:scale-105 transition-transform" size={36} />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-wider text-slate-900 group-hover:text-[#135B3E] transition-colors leading-tight">
                HEJRAT FOUNDATION
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-[#135B3E]/80 uppercase">
                MASJID AL-NABI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  prefetch={true}
                  className={`text-sm font-medium transition-colors hover:text-[#135B3E] ${
                    isActive ? 'text-[#135B3E] font-semibold' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Search Icon + "Get Involved" Pill Button */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Search Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-500 hover:text-[#135B3E] rounded-full hover:bg-emerald-50/60 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Quick Search Popover */}
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in-50 duration-150">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
                    <Search size={15} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search events, prayers, programs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs bg-transparent outline-none text-slate-800 placeholder-slate-400"
                      autoFocus
                    />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      Press enter to find &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 text-slate-500 hover:text-[#135B3E] rounded-full hover:bg-emerald-50/60 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#135B3E] ring-2 ring-white" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 text-slate-900 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Foundation Announcements</span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="mt-2 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {announcements.map((item) => (
                      <div key={item.id} className="py-2 space-y-0.5">
                        <span className="text-[10px] font-semibold text-[#135B3E]">{item.category}</span>
                        <h4 className="text-xs font-semibold text-slate-800">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portal destination link */}
            <Link
              href={portal.href}
              prefetch={true}
              className="text-xs font-medium text-slate-600 hover:text-[#135B3E] transition-colors hidden lg:block"
            >
              {portal.label}
            </Link>

            {/* Exact "Get Involved" Pill Button from Dribbble */}
            <Link href="/events" prefetch={true}>
              <button className="px-5 py-2.5 rounded-full bg-[#135B3E] hover:bg-[#0f4931] text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow-md cursor-pointer">
                Get Involved
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#135B3E]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-5 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm font-medium text-slate-700 hover:text-[#135B3E]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={portal.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold text-[#135B3E]"
            >
              {portal.label}
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-100">
            <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <button className="w-full py-3 rounded-full bg-[#135B3E] text-white text-sm font-semibold text-center shadow-sm">
                Get Involved
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
