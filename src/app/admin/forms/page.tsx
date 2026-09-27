'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { IslamicStarIcon } from '../../../components/common/IslamicPattern';
import { Plus, FileText, ArrowRight, Layers, ExternalLink } from 'lucide-react';

export default function AdminFormsDirectoryPage() {
  const { forms, events } = useApp();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-[#0f172a]">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <IslamicStarIcon size={16} className="text-[#064e3b]" />
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
              FORM ARCHITECTURE &amp; SCHEMA REGISTRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mt-1 tracking-tight">
            Dynamic Registration &amp; Competition Forms
          </h1>
          <p className="text-xs text-[#475569]">
            Configure custom field schemas, conditional branching logic, and immutable version releases.
          </p>
        </div>

        <Link
          href="/admin/forms/new/builder"
          className="px-5 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] shadow-xs flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus size={15} />
          <span>Create New Form</span>
        </Link>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {forms.map((f) => {
          const linkedEvent = events.find((e) => e.formId === f.id || e.id === f.id);

          return (
            <div
              key={f.id}
              className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs hover:border-[#064e3b]/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b]">
                    {f.fields.length} Questions
                  </span>
                  <span className="text-[10px] font-semibold text-[#6b7280]">
                    Version 1 Active
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0f172a]">{f.title}</h3>
                  <p className="text-xs text-[#475569] line-clamp-2">
                    {f.description || 'Custom attendee registration schema.'}
                  </p>
                </div>

                {linkedEvent && (
                  <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[11px] text-[#6b7280]">
                    <span>Linked to: </span>
                    <span className="font-semibold text-[#0f172a]">{linkedEvent.title}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#e7e2d6] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#6b7280]">{f.id}</span>
                <Link
                  href={`/admin/forms/${f.id}/builder`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#064e3b] text-[#ffffff] hover:bg-[#043c2e] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Open Builder</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
