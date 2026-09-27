'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { CertificateView } from '../../../components/certificates/CertificateView';
import { IslamicStarIcon } from '../../../components/common/IslamicPattern';
import { ShieldCheck, Search, AlertCircle, Award, CheckCircle2 } from 'lucide-react';

function CertificateVerifyContent() {
  const { getCertificateByNumber, certificates } = useApp();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('id') || '';

  const [query, setQuery] = useState<string>(initialQuery);
  const [searchedCert, setSearchedCert] = useState(
    initialQuery ? getCertificateByNumber(initialQuery) : getCertificateByNumber('CERT-ILM-2026-8842')
  );
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const cert = getCertificateByNumber(query);
    setSearchedCert(cert);
    setHasSearched(true);
  };

  return (
    <div className="space-y-8 text-[#111827]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#064e3b] shadow-xs">
          <ShieldCheck size={14} className="text-[#064e3b]" />
          <span className="meta-tag font-bold">OFFICIAL ACADEMIC REGISTRY &amp; VERIFICATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl text-[#0f172a] font-bold tracking-tight">
          Verify Certificate of Merit
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto leading-relaxed">
          Authenticate credentials issued by the IlmFlow Islamic Event &amp; Competition Council. Enter a certificate number or scan its QR code to inspect permanent records.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3.5 text-[#9ca3af]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. CERT-ILM-2026-8842"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#ffffff] border border-[#e7e2d6] text-xs sm:text-sm text-[#111827] focus:border-[#064e3b] focus:outline-none placeholder:text-[#9ca3af] shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] shadow-md transition-all shrink-0 cursor-pointer"
          >
            Verify Credential
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center gap-2 mt-3 text-xs text-[#6b7280]">
          <span>Try sample IDs:</span>
          {certificates.slice(0, 2).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setQuery(c.certificateNumber);
                setSearchedCert(c);
                setHasSearched(true);
              }}
              className="underline text-[#064e3b] font-mono hover:text-[#043c2e] cursor-pointer"
            >
              {c.certificateNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Search Result Display */}
      {hasSearched && (
        <div className="space-y-6">
          {searchedCert ? (
            <div className="space-y-6">
              {/* Authenticity Banner */}
              <div className="p-5 rounded-3xl bg-[#ecfdf5] border border-[#a7f3d0] flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-[#064e3b] text-[#ffffff]">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#065f46]">
                      Authentic Credential Verified
                    </h4>
                    <p className="text-xs text-[#065f46]/80 mt-0.5">
                      Issued to <strong>{searchedCert.recipientName}</strong> for{' '}
                      <strong>{searchedCert.eventOrCompetitionTitle}</strong>.
                    </p>
                  </div>
                </div>

                <span className="meta-tag px-3 py-1.5 rounded-full bg-[#ffffff] text-[#065f46] border border-[#a7f3d0] shrink-0 font-bold">
                  STATUS: PERMANENTLY VALID
                </span>
              </div>

              {/* Render Full Ornate Certificate */}
              <CertificateView certificate={searchedCert} />
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#ffffff] border border-red-200 text-center space-y-2 shadow-xs">
              <AlertCircle size={28} className="mx-auto text-red-600" />
              <h4 className="text-sm font-bold text-[#111827]">
                No Matching Certificate Found
              </h4>
              <p className="text-xs text-[#6b7280]">
                Please double-check the certificate ID or hash code entered.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CertificateVerificationPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto select-none">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-[#6b7280]">
            Loading Academic Registry...
          </div>
        }
      >
        <CertificateVerifyContent />
      </Suspense>
    </div>
  );
}
