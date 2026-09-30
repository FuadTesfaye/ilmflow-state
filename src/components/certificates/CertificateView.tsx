'use client';

import React from 'react';
import { CertificateItem } from '../../types';
import { BismillahEmblem, OrnateCorner } from '../common/IslamicPattern';
import { Download, ShieldCheck } from 'lucide-react';

interface CertificateViewProps {
  certificate: CertificateItem;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none text-stone-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-stone-700" />
          <span className="text-sm text-stone-600">
            Official Record: <strong className="text-stone-900 font-mono">{certificate.certificateNumber}</strong>
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm"
        >
          <Download size={16} />
          <span>Print Document</span>
        </button>
      </div>

      {/* Diploma Frame */}
      <div className="relative p-12 sm:p-16 md:p-20 bg-[#fffdfa] border-[3px] border-stone-800 text-center overflow-hidden">
        {/* Corners */}
        <OrnateCorner position="tl" className="absolute top-5 left-5 text-stone-400 scale-125" />
        <OrnateCorner position="tr" className="absolute top-5 right-5 text-stone-400 scale-125" />
        <OrnateCorner position="bl" className="absolute bottom-5 left-5 text-stone-400 scale-125" />
        <OrnateCorner position="br" className="absolute bottom-5 right-5 text-stone-400 scale-125" />

        <div className="absolute inset-5 border border-stone-300 pointer-events-none" />
        <div className="absolute inset-6 border border-stone-200 pointer-events-none" />

        <BismillahEmblem className="mb-6" />

        <div className="space-y-2 mt-4">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-500 block">
            {certificate.organizationName}
          </span>
          <h2 className="text-3xl sm:text-4xl text-stone-900 font-bold tracking-tight uppercase mt-2">
            CERTIFICATE OF {certificate.type === 'winner' ? 'EXCELLENCE' : 'COMPLETION'}
          </h2>
          <p className="font-arabic text-xl text-stone-600 mt-2" dir="rtl">
            شَهَادَةُ تَقْدِيرٍ
          </p>
        </div>

        {/* Details */}
        <div className="my-10 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            THIS CERTIFICATE IS AWARDED TO
          </p>
          <div className="py-2 border-b-2 border-stone-300 inline-block min-w-[280px] sm:min-w-[420px]">
            <h3 className="text-4xl font-bold text-stone-900 tracking-tight">
              {certificate.recipientName}
            </h3>
          </div>
          <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed pt-4">
            In recognition of exemplary scholarship and participation demonstrated during{' '}
            <strong className="text-stone-900 font-semibold">{certificate.eventOrCompetitionTitle}</strong>
            {certificate.score ? ` with a final score of ${certificate.score}/100.` : '.'}
          </p>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-12 border-t border-stone-300 items-end">
          <div className="text-left space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Date</span>
            <span className="text-sm font-medium text-stone-900 block">{certificate.issueDate}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block pt-3">ID</span>
            <span className="font-mono text-sm font-medium text-stone-900 block">
              {certificate.certificateNumber}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-stone-400 flex flex-col items-center justify-center p-2 bg-stone-50">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">
                Official
              </span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Signatory</span>
            <span className="text-lg italic font-medium text-stone-900 block border-b border-stone-300 pb-1">Dr. Sheikh Ahmad</span>
            <span className="text-xs text-stone-600 block pt-1">Board President</span>
          </div>
        </div>
      </div>
    </div>
  );
};
