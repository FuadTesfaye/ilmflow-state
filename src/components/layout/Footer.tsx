'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { ArabesqueCornerOrnament } from '../common/IslamicPattern';
import {
  Phone,
  Mail,
  MapPin,
  Send
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { addToast } = useApp();
  const [quickMsg, setQuickMsg] = useState('');
  const [sending, setSending] = useState(false);

  // Suppress public marketing footer on dashboard/admin console for full-height responsive canvas
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsg.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setQuickMsg('');
      addToast('Your message has been sent to Hejrat Foundation! We will respond shortly.', 'success');
    }, 600);
  };

  return (
    <footer className="w-full bg-[#f4f7f4] text-slate-700 text-sm border-t border-emerald-900/[0.08] pt-20 pb-12 relative overflow-hidden">
      {/* Corner Arabesque Watermark */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-20">
        <ArabesqueCornerOrnament size={220} className="text-emerald-800" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Intro, Contact Info & Socials */}
          <div className="md:col-span-4 space-y-5">
            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
              Feel free to contact us by email or leave a voicemail, and we will get back to you as soon as we can.
            </p>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#135B3E] shrink-0" />
                <span>(626) 480-7878</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#135B3E] shrink-0" />
                <span>info@hejrat.org</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[#135B3E] shrink-0 mt-0.5" />
                <span>1505 W Garvey Ave N, West Covina, CA 91790</span>
              </div>
            </div>

            {/* Social Icons matching Dribbble */}
            <div className="flex items-center gap-2 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#135B3E] hover:border-emerald-300 transition-colors shadow-2xs"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 6.46 11.82 5 14.54 5c1.3 0 2.66.23 2.66.23v2.93h-1.5c-1.51 0-1.98.94-1.98 1.9V12h3.3l-.53 3h-2.77v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#135B3E] hover:border-emerald-300 transition-colors shadow-2xs"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#135B3E] hover:border-emerald-300 transition-colors shadow-2xs"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#135B3E] hover:border-emerald-300 transition-colors shadow-2xs"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#135B3E] hover:border-emerald-300 transition-colors shadow-2xs"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Middle Columns: 3 Navigation Link Blocks */}
          <div className="md:col-span-5 grid grid-cols-3 gap-4 sm:gap-6 text-xs">
            {/* Column 1 */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs tracking-tight">Support Hejrat Foundation</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link href="/events" className="hover:text-[#135B3E] transition-colors">Get Involved</Link></li>
                <li><Link href="/#donate" className="hover:text-[#135B3E] transition-colors">Donate</Link></li>
                <li><Link href="/#donate" className="hover:text-[#135B3E] transition-colors">Sponsor Food</Link></li>
                <li><Link href="/#donate" className="hover:text-[#135B3E] transition-colors">Sponsor Fixed</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs tracking-tight">Start Learning</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link href="/competitions" className="hover:text-[#135B3E] transition-colors">Videos</Link></li>
                <li><Link href="/competitions" className="hover:text-[#135B3E] transition-colors">Audio Lectures</Link></li>
                <li><Link href="/events" className="hover:text-[#135B3E] transition-colors">Events</Link></li>
                <li><Link href="/schedule" className="hover:text-[#135B3E] transition-colors">Resources</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs tracking-tight">Hejrat Foundation</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link href="/#about" className="hover:text-[#135B3E] transition-colors">About Us</Link></li>
                <li><Link href="/speakers" className="hover:text-[#135B3E] transition-colors">Leadership</Link></li>
                <li><Link href="/certificates/verify" className="hover:text-[#135B3E] transition-colors">Accreditation</Link></li>
                <li><Link href="/portal" className="hover:text-[#135B3E] transition-colors">Community Hub</Link></li>
              </ul>
            </div>
          </div>

          {/* Right Column: Quick Message Form */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs tracking-tight">Quick Message</h4>
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Write your message..."
                  value={quickMsg}
                  onChange={(e) => setQuickMsg(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 pr-16 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#135B3E] text-slate-800 placeholder-slate-400 shadow-2xs transition-all"
                />
                <button
                  type="submit"
                  disabled={sending || !quickMsg.trim()}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#135B3E] hover:bg-[#0e4831] disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Send</span>
                  <Send size={11} />
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Our staff answers inquiries within 24 hours.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Hejrat Foundation | All Rights Reserved</p>
          <div className="flex items-center gap-4">
            <Link href="/#terms" className="hover:text-[#135B3E] transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>|</span>
            <Link href="/#privacy" className="hover:text-[#135B3E] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
