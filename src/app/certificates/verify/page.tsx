'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { CertificateView } from '../../../components/certificates/CertificateView';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { ShieldCheck, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

function CertificateVerifyContent() {
  const { getCertificateByNumber } = useApp();
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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="outline" className="text-xs font-semibold px-3 py-1">
          Public Academic Registry
        </Badge>
        <h1 className="text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight">
          Verify Sanad &amp; Academic Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Verify tamper-evident certificates issued by IlmFlow State. Enter a certificate serial number below.
        </p>
      </div>

      {/* Lookup Bar */}
      <Card className="p-3 max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. CERT-ILM-2026-8842"
              className="pl-9 text-xs"
            />
          </div>
          <Button type="submit" size="sm">
            Verify Now
          </Button>
        </form>
      </Card>

      {/* Verification Status Card */}
      {hasSearched && (
        <div>
          {searchedCert ? (
            <Card className="border-emerald-300 bg-emerald-50/40 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cryptographic Credential Verified
                  </h3>
                  <p className="text-xs text-slate-600">
                    Matches authentic academic record in the official registry.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white border border-emerald-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Recipient</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{searchedCert.recipientName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Certificate #</span>
                  <span className="font-mono font-bold text-emerald-800 mt-0.5 block">{searchedCert.certificateNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Award Title</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">{searchedCert.eventOrCompetitionTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Issue Date</span>
                  <span className="text-slate-600 mt-0.5 block">{searchedCert.issueDate}</span>
                </div>
              </div>

              <div className="pt-2">
                <CertificateView certificate={searchedCert} />
              </div>
            </Card>
          ) : (
            <Card className="border-red-300 bg-red-50/40 p-6 flex items-center gap-3">
              <AlertCircle size={24} className="text-red-600 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Certificate Not Found</h3>
                <p className="text-xs text-slate-600">
                  No registered record matches &quot;{query}&quot;. Please verify the serial number and try again.
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function CertificateVerifyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Suspense fallback={<div className="text-center py-12 text-xs text-slate-400">Loading registry...</div>}>
        <CertificateVerifyContent />
      </Suspense>
    </div>
  );
}
