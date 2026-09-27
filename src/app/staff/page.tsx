'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IslamicStarIcon } from '../../components/common/IslamicPattern';
import {
  QrCode,
  CheckCircle,
  AlertTriangle,
  Search,
  Users,
  Camera,
  UserCheck,
  Clock,
  Sparkles,
  Volume2,
  Printer
} from 'lucide-react';

export default function StaffCheckInGatePage() {
  const { registrations, checkInAttendee } = useApp();

  const [ticketInput, setTicketInput] = useState<string>('');
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    message: string;
    record?: any;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Pleasant Web Audio Verification Chime
  const playVerificationChime = (success: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 select-none text-[#111827]">
      {/* Staff Operations Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <IslamicStarIcon size={16} className="text-[#064e3b]" />
            <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] font-bold">
              ARRIVAL OPERATIONS &amp; ACCESS CONTROL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl text-[#0f172a] font-bold mt-1 tracking-tight">
            Gate Arrival Terminal • Marshal Check-In
          </h1>
          <p className="text-xs text-[#475569]">
            Optical scanning, credential validation, and attendance throughput monitoring.
          </p>
        </div>

        {/* Live Attendance Metric */}
        <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-2xl border border-[#e7e2d6]">
          <div className="text-right">
            <span className="meta-tag text-[#6b7280] block text-[9px]">TOTAL THROUGHPUT</span>
            <span className="font-display text-2xl font-bold text-[#064e3b] tabular-nums">
              {checkedInCount} / {totalAttendees} ({percentage}%)
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#064e3b] text-[#ffffff] flex items-center justify-center shadow-xs">
            <UserCheck size={22} />
          </div>
        </div>
      </div>

      {/* Scanner Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Scanner Viewfinder */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
              <span className="meta-tag text-[#064e3b] font-bold">
                OPTICAL BARCODE READER
              </span>
              <span className="meta-tag text-[#065f46] flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                ACTIVE
              </span>
            </div>

            {/* Viewfinder Reticle */}
            <div className="aspect-video w-full rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="w-28 h-28 border-2 border-[#064e3b] rounded-xl relative flex items-center justify-center shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#064e3b]" />
                <div className="absolute inset-x-0 h-0.5 bg-[#064e3b] animate-pulse" />
              </div>
              <p className="text-[11px] text-[#6b7280] mt-4 font-medium">
                Align delegate barcode or QR pass within target area
              </p>
            </div>

            {/* Manual Keycode Entry */}
            <div className="space-y-2 pt-2">
              <label className="meta-tag text-[#6b7280] block font-bold">
                MANUAL TICKET NUMBER ENTRY
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="e.g. TKT-SUMMIT-2026-001"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#111827] focus:border-[#064e3b] focus:outline-none uppercase font-mono"
                />
                <button
                  onClick={() => handleScanOrSubmit()}
                  className="px-5 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs transition-all"
                >
                  Verify
                </button>
              </div>

              {/* Sample Quick-Click Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="meta-tag text-[#6b7280] text-[9px]">TEST PAYLOADS:</span>
                {registrations.slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleScanOrSubmit(r.ticketNumber)}
                    className="meta-tag text-[9px] px-2.5 py-1 rounded-lg bg-[#faf8f5] border border-[#e7e2d6] hover:border-[#064e3b] text-[#064e3b] cursor-pointer transition-colors"
                  >
                    {r.ticketNumber} ({r.participantName.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Scan Result & Attendee Card */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] min-h-[340px] flex flex-col justify-center">
            {lastScanResult ? (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-2xl border flex items-start gap-3.5 ${
                    lastScanResult.success
                      ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {lastScanResult.success ? (
                    <CheckCircle size={22} className="text-[#065f46] shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={22} className="text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold">
                      {lastScanResult.success ? 'CREDENTIAL VALIDATED' : 'ACCESS RESTRICTION'}
                    </h4>
                    <p className="text-xs mt-0.5 opacity-90">{lastScanResult.message}</p>
                  </div>
                </div>

                {lastScanResult.record && (
                  <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-3.5 text-xs">
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#e7e2d6]">
                      <span className="font-bold text-base text-[#111827]">
                        {lastScanResult.record.participantName}
                      </span>
                      <span className="meta-tag px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] font-bold">
                        {lastScanResult.record.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="meta-tag text-[#6b7280] block text-[9px]">DELEGATE PASS</span>
                        <span className="font-semibold text-[#064e3b]">
                          {lastScanResult.record.ticketTierName}
                        </span>
                      </div>
                      <div>
                        <span className="meta-tag text-[#6b7280] block text-[9px]">TICKET NUMBER</span>
                        <span className="font-mono text-[#111827]">
                          {lastScanResult.record.ticketNumber}
                        </span>
                      </div>
                      <div>
                        <span className="meta-tag text-[#6b7280] block text-[9px]">EVENT ASSIGNMENT</span>
                        <span className="text-[#111827]">{lastScanResult.record.eventTitle}</span>
                      </div>
                      <div>
                        <span className="meta-tag text-[#6b7280] block text-[9px]">ARRIVAL TIMESTAMP</span>
                        <span className="text-[#065f46] font-mono font-semibold">
                          {lastScanResult.record.checkedInAt
                            ? new Date(lastScanResult.record.checkedInAt).toLocaleTimeString()
                            : 'Logged Just Now'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2 text-[#6b7280]">
                <QrCode size={40} className="mx-auto text-[#064e3b] opacity-50" />
                <h4 className="text-base font-bold text-[#111827]">Awaiting Ticket Scan</h4>
                <p className="text-xs">
                  Scan a QR code pass or select a test payload from the left console.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delegate Roster Table */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e7e2d6]">
          <div>
            <h3 className="font-display text-xl text-[#111827] font-bold">
              Delegate Roster &amp; Gate Verification History
            </h3>
            <p className="text-xs text-[#6b7280]">
              Real-time synchronization with centralized database.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-2.5 text-[#9ca3af]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search delegate or ticket..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#111827] focus:border-[#064e3b] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] text-[#6b7280] meta-tag border-b border-[#e7e2d6]">
              <tr>
                <th className="p-3.5">Ticket ID</th>
                <th className="p-3.5">Delegate Name</th>
                <th className="p-3.5">Pass Tier</th>
                <th className="p-3.5">Gate Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e2d6]">
              {filteredRegistrations.map((r) => {
                const isCheckedIn = r.status === 'checked_in';
                return (
                  <tr key={r.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                    <td className="p-3.5 font-mono text-[#064e3b] font-semibold">{r.ticketNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#111827]">{r.participantName}</div>
                      <div className="text-[11px] text-[#6b7280]">{r.participantEmail}</div>
                    </td>
                    <td className="p-3.5 text-[#4b5563]">{r.ticketTierName}</td>
                    <td className="p-3.5">
                      <span
                        className={`meta-tag px-2.5 py-0.5 rounded-full font-bold ${
                          isCheckedIn
                            ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                            : 'bg-[#f4f0e6] text-[#4b5563] border border-[#e7e2d6]'
                        }`}
                      >
                        {isCheckedIn ? 'CHECKED IN' : 'ENROLLED'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {!isCheckedIn ? (
                        <button
                          onClick={() => handleScanOrSubmit(r.ticketNumber)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#064e3b] hover:bg-[#043c2e] text-[#ffffff] text-xs font-semibold cursor-pointer shadow-2xs transition-all"
                        >
                          Check In
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#6b7280]">
                          Verified at {r.checkedInAt ? new Date(r.checkedInAt).toLocaleTimeString() : 'Arrival'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
