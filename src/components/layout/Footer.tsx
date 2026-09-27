'use client';

import React from 'react';
import Link from 'next/link';
import { IslamicStarIcon, IslamicDivider } from '../common/IslamicPattern';
import { ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f4f0e6] border-t border-[#e7e2d6] text-[#6b7280] text-xs pt-14 pb-10 no-print select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#064e3b] text-[#ffffff] flex items-center justify-center">
                <IslamicStarIcon size={16} className="text-[#d4a94b]" />
              </div>
              <span className="font-display text-lg tracking-tight text-[#111827] font-bold">
                ILM<span className="text-[#9e782f]">FLOW</span> STATE
              </span>
            </div>
            <p className="font-arabic text-base text-[#9e782f]" dir="rtl">
              وَقُل رَّبِّ زِدْنِي عِلْمًا
            </p>
            <p className="text-xs text-[#4b5563] leading-relaxed">
              Global Islamic convocations, Holy Quran recitation adjudication, and authenticated academic accreditation under classical Isnad.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#111827] font-medium">
              <MapPin size={12} className="text-[#9e782f]" />
              <span>Secretariat: Al-Madinah Al-Munawwarah</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <span className="meta-tag text-[#111827] font-bold block mb-3">CONVOCATIONS &amp; CONTESTS</span>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="hover:text-[#064e3b] transition-colors">
                  Flagship Summits &amp; Intensives
                </Link>
              </li>
              <li>
                <Link href="/competitions" className="hover:text-[#064e3b] transition-colors">
                  Quran Hifdh &amp; Tarteel Award
                </Link>
              </li>
              <li>
                <Link href="/competitions" className="hover:text-[#064e3b] transition-colors">
                  Imam Al-Bukhari Hadith Tournament
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-[#064e3b] transition-colors">
                  Salah Synchronized Schedule
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-[#064e3b] transition-colors">
                  Academic Standings &amp; Rankings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <span className="meta-tag text-[#064e3b] font-bold block mb-3">ENTERPRISE CONSOLES</span>
            <ul className="space-y-2">
              <li>
                <Link href="/portal" className="hover:text-[#064e3b] transition-colors">
                  Delegate Portal &amp; Passes
                </Link>
              </li>
              <li>
                <Link href="/judge" className="hover:text-[#064e3b] transition-colors">
                  Judicial Chamber (Rubric Evaluation)
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-[#064e3b] transition-colors">
                  Arrival Gate QR Barcode Scanner
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#064e3b] transition-colors">
                  Central Secretariat Administration
                </Link>
              </li>
              <li>
                <Link href="/certificates/verify" className="hover:text-[#064e3b] transition-colors">
                  Public Academic Registry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <span className="meta-tag text-[#111827] font-bold block mb-3">GOVERNANCE &amp; STANDARDS</span>
            <p className="text-xs text-[#4b5563] leading-relaxed">
              Calculated via Umm al-Qura coordinates. Quran recitation evaluated in strict adherence to the Ten Mutawatir Qira’at through Shatibiyyah and Tayyibah.
            </p>
            <div className="p-3 rounded-xl bg-[#ffffff] border border-[#e7e2d6] space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#064e3b] font-semibold">
                <ShieldCheck size={14} />
                <span>Child Protection Standard</span>
              </div>
              <p className="text-[11px] text-[#6b7280]">
                Parental authorization enforced for all delegates under 18 years.
              </p>
            </div>
          </div>
        </div>

        <IslamicDivider className="opacity-40 my-2" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-[11px] text-[#6b7280]">
          <p>© 1448 AH / 2026 CE IlmFlow State — Global Islamic Council. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/certificates/verify" className="hover:text-[#111827]">
              Verify Credentials
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
