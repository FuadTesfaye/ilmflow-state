'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const auditLogs = [
    {
      id: 'aud-001',
      actor: 'Sheikh Dr. Tariq Al-Hashimi',
      role: 'superadmin',
      action: 'PUBLISH_EVENT',
      entity: 'Event: Global Quran & Sunnah Summit 2026',
      ip: '194.165.22.4',
      timestamp: '2026-09-27 11:30:15 UTC',
      detail: 'Status changed from DRAFT to REGISTRATION_OPEN with capacity 1,200.'
    },
    {
      id: 'aud-002',
      actor: 'Dr. Sheikh Ahmad Al-Mansoor',
      role: 'judge',
      action: 'SUBMIT_GRADE',
      entity: 'Submission: sub-quran-01 (Zayd Al-Ansari)',
      ip: '197.234.18.9',
      timestamp: '2026-09-27 10:14:02 UTC',
      detail: 'Awarded 94/100 points across Tajweed (29), Memorization (28), and Makharij (19).'
    },
    {
      id: 'aud-003',
      actor: 'Bilal Qureshi',
      role: 'staff',
      action: 'CHECK_IN',
      entity: 'Attendee: Zayd Al-Ansari (TKT-001)',
      ip: '185.190.140.2',
      timestamp: '2026-09-27 09:45:00 UTC',
      detail: 'QR scan verified at Gate A.'
    },
    {
      id: 'aud-004',
      actor: 'Ustadha Fatima Al-Zahra',
      role: 'admin',
      action: 'UPDATE_FORM',
      entity: 'Form: form-summit-standard',
      ip: '194.165.22.8',
      timestamp: '2026-09-26 16:20:00 UTC',
      detail: 'Released Form Version 2 with minor consent conditional rules.'
    }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Administrative Audit Logs</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cryptographic ledger of administrator dispatches, rubric grades, and gate check-in scans.
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft size={14} />
            <span>Back to Admin</span>
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target Entity</TableHead>
              <TableHead>Event Details</TableHead>
              <TableHead className="text-right">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
                  {log.timestamp}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{log.actor}</div>
                  <span className="text-[11px] text-slate-400 capitalize">{log.role}</span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-700">{log.entity}</TableCell>
                <TableCell className="text-xs text-slate-500 max-w-xs">{log.detail}</TableCell>
                <TableCell className="text-right font-mono text-xs text-slate-400">{log.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
