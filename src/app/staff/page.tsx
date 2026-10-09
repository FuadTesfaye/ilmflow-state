'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AccessDeniedCard } from '../../components/common/PermissionGate';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import {
  QrCode,
  CheckCircle,
  AlertTriangle,
  Search,
  UserCheck,
  Sparkles
} from 'lucide-react';

export default function StaffCheckInGatePage() {
  const { registrations, checkInAttendee, hasRole } = useApp();

  if (!hasRole(['staff', 'admin', 'superadmin'])) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <AccessDeniedCard
          title="Gate & Attendee Check-In Terminal"
          description="Access to the physical arrival gate scanner and attendee admissions register is restricted to event staff and operations marshals."
          requiredRoles={['staff', 'admin', 'superadmin']}
        />
      </div>
    );
  }

  const [ticketInput, setTicketInput] = useState<string>('');
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    message: string;
    record?: any;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const playVerificationChime = (success: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(329.63, ctx.currentTime);
        osc.frequency.setValueAtTime(261.63, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {}
  };

  const handleScanOrSubmit = (codeToTest?: string) => {
    const code = codeToTest || ticketInput;
    if (!code.trim()) return;

    const res = checkInAttendee(code);
    setLastScanResult(res);
    playVerificationChime(res.success);
    setTicketInput('');
  };

  const totalAttendees = registrations.length;
  const checkedInCount = registrations.filter((r) => r.status === 'checked_in').length;
  const percentage = totalAttendees > 0 ? Math.round((checkedInCount / totalAttendees) * 100) : 0;

  const filteredRegistrations = registrations.filter(
    (r) =>
      r.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.participantEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      {/* Header */}
      <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-semibold">
              Event Operations
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-emerald-700">Gate Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Arrival Check-In Terminal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Validate attendee tickets via optical QR scan or manual ticket entry.
          </p>
        </div>

        {/* Throughput Metric */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Checked In
            </span>
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
              {checkedInCount} / {totalAttendees} ({percentage}%)
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <UserCheck size={22} />
          </div>
        </div>
      </Card>

      {/* Scanner Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Viewfinder & Manual Input */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4 border-slate-200 hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <QrCode size={16} className="text-emerald-600" />
                Optical Scanner
              </span>
              <Badge variant="neon" className="gap-1.5 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse" />
                <span>Camera Laser Active</span>
              </Badge>
            </div>

            {/* Viewfinder Target with Neon Laser */}
            <div className="aspect-video w-full rounded-xl bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden border border-emerald-500/30 shadow-[inset_0_0_30px_rgba(16,185,129,0.15)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.12)_0%,_transparent_70%)] pointer-events-none" />
              <div className="w-32 h-32 border-2 border-emerald-400/90 rounded-xl relative flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]" />
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,1)] animate-pulse" />
                {/* Corner markers */}
                <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-300" />
                <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-300" />
                <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-300" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-300" />
              </div>
              <p className="text-[11px] text-emerald-400/80 mt-4 font-mono">
                Position attendee QR badge within reticle
              </p>
            </div>

            {/* Manual Entry */}
            <div className="space-y-2 pt-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Manual Keycode Input
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="e.g. TKT-001"
                  className="uppercase font-mono text-xs focus-visible:ring-emerald-500/30"
                />
                <Button variant="gradient" size="sm" onClick={() => handleScanOrSubmit()}>
                  Verify Pass
                </Button>
              </div>

              {/* Quick test buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] font-semibold text-slate-400 mr-1">Demo Passes:</span>
                {registrations.slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleScanOrSubmit(r.ticketNumber)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {r.ticketNumber}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right 7 Cols: Scan Result & Attendee Card */}
        <div className="lg:col-span-7">
          <Card className="p-6 min-h-[340px] flex flex-col justify-center">
            {lastScanResult ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    lastScanResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  {lastScanResult.success ? (
                    <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold">
                      {lastScanResult.success ? 'Verification Successful — Admitted' : 'Entry Restricted'}
                    </h4>
                    <p className="text-xs mt-0.5">{lastScanResult.message}</p>
                  </div>
                </div>

                {lastScanResult.record && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <span className="font-bold text-base text-slate-900">
                        {lastScanResult.record.participantName}
                      </span>
                      <Badge variant="success" className="capitalize">
                        {lastScanResult.record.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Pass Tier
                        </span>
                        <span className="font-semibold text-slate-900">
                          {lastScanResult.record.ticketTierName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Ticket No.
                        </span>
                        <span className="font-mono font-bold text-emerald-800">
                          {lastScanResult.record.ticketNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Event
                        </span>
                        <span className="text-slate-800">{lastScanResult.record.eventTitle}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Check-in Timestamp
                        </span>
                        <span className="font-mono text-slate-600">
                          {lastScanResult.record.checkedInAt
                            ? new Date(lastScanResult.record.checkedInAt).toLocaleTimeString()
                            : 'Just Now'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2 text-slate-400">
                <QrCode size={36} className="mx-auto text-slate-300" />
                <h4 className="text-sm font-bold text-slate-900">Scanner Ready</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Scan an attendee barcode pass or enter ticket code to record gate admission.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Attendee Roster Table */}
      <Card className="overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Attendee Roster</CardTitle>
            <CardDescription className="text-xs">
              Live status across all registered participants.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search delegate or ticket..."
              className="pl-8 text-xs h-8"
            />
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket No.</TableHead>
              <TableHead>Delegate Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.map((r) => {
              const isCheckedIn = r.status === 'checked_in';
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs font-semibold">{r.ticketNumber}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{r.participantName}</div>
                    <div className="text-[11px] text-slate-400">{r.participantEmail}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{r.ticketTierName}</TableCell>
                  <TableCell>
                    <Badge variant={isCheckedIn ? 'success' : 'secondary'} className="text-[10px]">
                      {isCheckedIn ? 'Checked In' : 'Registered'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {!isCheckedIn ? (
                      <Button
                        size="sm"
                        className="h-7 text-xs px-2.5"
                        onClick={() => handleScanOrSubmit(r.ticketNumber)}
                      >
                        Check In
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-medium">
                        {r.checkedInAt ? new Date(r.checkedInAt).toLocaleTimeString() : 'Verified'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
