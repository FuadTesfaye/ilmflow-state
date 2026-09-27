'use client';

import React from 'react';
import Link from 'next/link';
import { IslamicStarIcon } from '../../../components/common/IslamicPattern';
import { ShieldCheck, ArrowLeft, Clock, User, Filter, Search } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const auditLogs = [
    {
      id: 'aud-001',
      actor: 'Sheikh Dr. Tariq Al-Hashimi',
      role: 'superadmin',
      action: 'PUBLISH_CONVOCATION',
      entity: 'Event: Global Quran & Sunnah Summit 2026',
      ip: '194.165.22.4',
      timestamp: '2026-09-27 11:30:15 UTC',
      detail: 'Status changed from DRAFT to REGISTRATION_OPEN with capacity 1,200.'
    },
    {
      id: 'aud-002',
      actor: 'Dr. Sheikh Ahmad Al-Mansoor',
      role: 'judge',
      action: 'SUBMIT_RUBRIC_GRADE',
      entity: 'Submission: sub-quran-01 (Zayd Al-Ansari)',
      ip: '197.234.18.9',
      timestamp: '2026-09-27 10:14:02 UTC',
      detail: 'Awarded 94/100 points across Tajweed (29), Memorization (28), and Makharij (19).'
    },
    {
      id: 'aud-003',
      actor: 'Bilal Qureshi',
      role: 'staff',
      action: 'CHECKIN_ATTENDEE',
      entity: 'Attendee: Zayd Al-Ansari (TKT-1448-8842)',
      ip: '185.190.140.2',
      timestamp: '2026-09-27 09:45:00 UTC',
      detail: 'Optical QR barcode scan verified at Gate A (Musalla Ground Floor).'
    },
    {
      id: 'aud-004',
      actor: 'Ustadha Fatima Al-Zahra',
      role: 'admin',
      action: 'UPDATE_FORM_SCHEMA',
      entity: 'Form: form-summit-standard',
      ip: '194.165.22.8',
      timestamp: '2026-09-26 16:20:00 UTC',
      detail: 'Released Form Version 2 with minor parental consent conditional rules.'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-[#0f172a]">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <IslamicStarIcon size={16} className="text-[#064e3b]" />
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
              IMMUTABLE AUDIT TRAIL &amp; GOVERNANCE LEDGER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mt-1 tracking-tight">
            Security &amp; Administrative Audit Logs
          </h1>
          <p className="text-xs text-[#475569]">
            Cryptographically indexed historical record of every grading change, user permission update, and test publication.
          </p>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#0f172a] hover:border-[#064e3b] flex items-center gap-1.5 self-start sm:self-center"
        >
          <ArrowLeft size={14} />
          <span>Back to Console</span>
        </Link>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] border-b border-[#e7e2d6] text-[10px] font-bold tracking-wider uppercase text-[#6b7280]">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Operational Detail</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f0e6]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#6b7280] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#0f172a] whitespace-nowrap">
                    <div>{log.actor}</div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#064e3b]">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#f4f0e6] text-[#064e3b] border border-[#e7e2d6]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#0f172a] font-medium">{log.entity}</td>
                  <td className="py-3.5 px-4 text-[#475569] max-w-xs">{log.detail}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#6b7280]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
