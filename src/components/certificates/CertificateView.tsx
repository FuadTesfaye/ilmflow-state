'use client';

import React from 'react';
import { CertificateItem } from '../../types';
import { IslamicStarIcon, OrnateCorner, BismillahEmblem } from '../common/IslamicPattern';
import { Download, ShieldCheck, Award } from 'lucide-react';

interface CertificateViewProps {
  certificate: CertificateItem;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 select-none text-[#111827]">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between no-print bg-[#ffffff] p-4 rounded-2xl border border-[#e7e2d6] shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#065f46]" />
          <span className="text-xs text-[#6b7280]">
            Cryptographically Authenticated Record: <strong className="text-[#111827] font-mono">{certificate.certificateNumber}</strong>
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] transition-all cursor-pointer shadow-xs"
        >
          <Download size={14} />
          <span>Print / Export High-Res Document</span>
        </button>
      </div>

      {/* Museum-Grade Archival Diploma Frame */}
      <div className="relative p-8 sm:p-14 md:p-16 rounded-3xl bg-[#fffdfa] border-4 border-[#064e3b] shadow-2xl text-center overflow-hidden">
        {/* Architectural Fine Hairline Corners */}
        <OrnateCorner position="tl" className="absolute top-4 left-4 text-[#9e782f] scale-125" />
        <OrnateCorner position="tr" className="absolute top-4 right-4 text-[#9e782f] scale-125" />
        <OrnateCorner position="bl" className="absolute bottom-4 left-4 text-[#9e782f] scale-125" />
        <OrnateCorner position="br" className="absolute bottom-4 right-4 text-[#9e782f] scale-125" />

        {/* Double Inner Hairlines */}
        <div className="absolute inset-4 sm:inset-6 border border-[#9e782f]/30 pointer-events-none rounded-2xl" />
        <div className="absolute inset-5 sm:inset-7 border border-[#9e782f]/15 pointer-events-none rounded-xl" />

        {/* Bismillah Header */}
        <BismillahEmblem className="mb-4" />

        <div className="space-y-1.5 mt-2">
          <span className="meta-tag text-[#9e782f] tracking-widest block font-bold">
            {certificate.organizationName}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-[#064e3b] font-bold tracking-wide uppercase">
            CERTIFICATE OF {certificate.type === 'winner' ? 'TRIUMPH & EXCELLENCE' : 'ACADEMIC MERIT'}
          </h2>
          <p className="font-arabic text-xl text-[#9e782f] mt-1" dir="rtl">
            شَهَادَةُ تَقْدِيرٍ وَإِتْقَانٍ أَكَادِيمِيٍّ
          </p>
        </div>

        {/* Recipient Details */}
        <div className="my-8 sm:my-10 space-y-4">
          <p className="meta-tag text-[#6b7280]">
            THIS CREDENTIAL IS PROUDLY AND FORMALLY CONFERRED UPON
          </p>
          <div className="py-2 border-b-2 border-[#9e782f] inline-block min-w-[280px] sm:min-w-[420px]">
            <h3 className="font-display text-3xl sm:text-5xl font-bold text-[#111827] tracking-wide">
              {certificate.recipientName}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#4b5563] max-w-xl mx-auto leading-relaxed pt-2">
            In recognition of exemplary scholarship and adherence to classical standards demonstrated during{' '}
            <strong className="text-[#111827]">{certificate.eventOrCompetitionTitle}</strong>
            {certificate.score ? ` achieving a final examination score of ${certificate.score}/100.` : '.'}
          </p>
        </div>

        {/* Signatures & Seal Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#9e782f]/30 items-end">
          {/* Left: Date & Registry */}
          <div className="text-left space-y-1 text-xs">
            <span className="meta-tag text-[#6b7280] block text-[9px]">CONFERRAL DATE</span>
            <span className="font-semibold text-[#111827]">{certificate.issueDate}</span>
            <span className="meta-tag text-[#6b7280] block text-[9px] pt-1">REGISTRY ID</span>
            <span className="font-mono text-xs text-[#064e3b] font-bold">
              {certificate.certificateNumber}
            </span>
          </div>

          {/* Middle: Gold Medallion Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#f4f0e6] border-2 border-[#9e782f] shadow-lg flex flex-col items-center justify-center p-2 text-center">
              <IslamicStarIcon size={24} className="text-[#9e782f]" />
              <span className="meta-tag text-[7px] text-[#064e3b] font-bold tracking-widest mt-1">
                SEAL OF ILM
              </span>
            </div>
            <span className="meta-tag text-[9px] text-[#6b7280] mt-1.5 font-bold">Authenticity Endorsed</span>
          </div>

          {/* Right: Signature */}
          <div className="text-right space-y-1 text-xs">
            <span className="meta-tag text-[#6b7280] block text-[9px]">EXAMINER SANAD</span>
            <span className="font-display italic text-lg text-[#111827] block">Dr. Sheikh Ahmad Al-Mansoor</span>
            <span className="text-[10px] text-[#6b7280] block">Grand Muqri’ &amp; Board President</span>
          </div>
        </div>
      </div>
    </div>
  );
};
