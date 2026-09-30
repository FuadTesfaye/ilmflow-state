'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Plus, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminFormsDirectoryPage() {
  const { forms, events } = useApp();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Registration Form Schemas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage conditional logic questionnaires, guardian consents, and versioned form schemas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft size={14} />
              <span>Back to Admin</span>
            </Button>
          </Link>
          <Link href="/admin/forms/new/builder">
            <Button size="sm" className="gap-1.5">
              <Plus size={15} />
              <span>Create Form</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {forms.map((f) => {
          const linkedEvent = events.find((e) => e.formId === f.id || e.id === f.id);

          return (
            <Card
              key={f.id}
              className="p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">
                    {f.fields.length} Fields
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">v1 Active</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {f.description || 'Custom registration form schema.'}
                  </p>
                </div>

                {linkedEvent && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    <span className="text-slate-400">Linked Summit: </span>
                    <strong className="text-slate-900 font-semibold">{linkedEvent.title}</strong>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">{f.id}</span>
                <Link href={`/admin/forms/${f.id}/builder`}>
                  <Button size="sm" variant="default" className="text-xs gap-1">
                    <span>Open Builder</span>
                    <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
