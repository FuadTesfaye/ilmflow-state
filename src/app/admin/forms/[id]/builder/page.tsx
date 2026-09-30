'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../../../context/AppContext';
import { FormField, FormFieldType, RegistrationForm } from '../../../../../types';
import {
  ArrowLeft,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  Copy,
  Plus,
  Eye,
  FileCode,
  Layers,
  Settings2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Badge } from '../../../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../../components/ui/tabs';

export default function DedicatedFormBuilderPage() {
  const params = useParams();
  const { forms, saveForm, addToast } = useApp();

  const formId = (params?.id as string) || 'form-summit-standard';
  const existingForm = forms.find((f) => f.id === formId) || forms[0];

  const [form, setForm] = useState<RegistrationForm>(
    existingForm || {
      id: formId,
      title: 'New Registration Form',
      description: 'Custom data collection schema',
      fields: [{ id: 'f_name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' }]
    }
  );

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(form.fields[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'preview' | 'json'>('canvas');
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({ 'f_age': 16 });

  const selectedField = form.fields.find((f) => f.id === selectedFieldId);

  const fieldTypes: { type: FormFieldType; label: string; icon: string; desc: string }[] = [
    { type: 'text', label: 'Short Text', icon: 'Aa', desc: 'Single line text input' },
    { type: 'textarea', label: 'Long Text', icon: '¶', desc: 'Multi-line paragraph text' },
    { type: 'email', label: 'Email Address', icon: '@', desc: 'Email address with validation' },
    { type: 'phone', label: 'Phone Number', icon: '☎', desc: 'International telephone format' },
    { type: 'number', label: 'Number', icon: '#', desc: 'Numeric quantity or age' },
    { type: 'dropdown', label: 'Dropdown Select', icon: '▾', desc: 'Select from dropdown options' },
    { type: 'radio', label: 'Radio Group', icon: '◉', desc: 'Single choice list' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑', desc: 'Boolean confirmation' },
    { type: 'date', label: 'Date Picker', icon: '📅', desc: 'Calendar date selection' },
    { type: 'file', label: 'File Upload', icon: '⇪', desc: 'Document or ID attachment' },
    { type: 'section-header', label: 'Section Header', icon: 'H', desc: 'Visual section divider' },
    { type: 'signature', label: 'Signature', icon: '✍', desc: 'Digital signature line' }
  ];

  const handleAddField = (type: FormFieldType) => {
    const newId = `fld_${Date.now()}`;
    const newField: FormField = {
      id: newId,
      label: `New ${type.replace('-', ' ')} field`,
      type,
      required: false,
      placeholder: 'Enter answer...',
      options: type === 'dropdown' || type === 'radio'
        ? [{ label: 'Option A', value: 'opt_a' }, { label: 'Option B', value: 'opt_b' }]
        : undefined
    };
    setForm((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
    setSelectedFieldId(newId);
    addToast(`Added ${type} field`, 'info');
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setForm((prev) => ({ ...prev, fields: prev.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)) }));
  };

  const handleDeleteField = (id: string) => {
    setForm((prev) => ({ ...prev, fields: prev.fields.filter((f) => f.id !== id) }));
    if (selectedFieldId === id) setSelectedFieldId(form.fields[0]?.id || null);
    addToast('Field removed', 'info');
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= form.fields.length) return;
    const copy = [...form.fields];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setForm((prev) => ({ ...prev, fields: copy }));
  };

  const handlePublishVersion = () => {
    const nextVer = currentVersion + 1;
    setCurrentVersion(nextVer);
    saveForm(form);
    addToast(`Published Form schema v${nextVer} successfully!`, 'success');
  };

  const isFieldVisible = (f: FormField) => {
    if (!f.conditional) return true;
    const parentVal = previewAnswers[f.conditional.fieldId];
    if (f.conditional.operator === 'not_equals') return String(parentVal ?? '') !== String(f.conditional.value ?? '');
    return String(parentVal ?? '') === String(f.conditional.value ?? '');
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header bar */}
      <Card>
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/forms">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-stone-900">{form.title}</h1>
                <Badge variant="secondary">v{currentVersion}</Badge>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{form.fields.length} dynamic fields configured</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
              <TabsList>
                <TabsTrigger value="canvas" className="gap-1.5">
                  <Layers size={14} />
                  <span>Canvas</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1.5">
                  <Eye size={14} />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="json" className="gap-1.5">
                  <FileCode size={14} />
                  <span>Schema</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={handlePublishVersion} className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white">
              <Save size={15} />
              <span>Publish v{currentVersion + 1}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canvas View */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Field Palette */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Field Library
                </CardTitle>
                <CardDescription className="text-xs">Click any field to add to canvas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5 p-3 pt-0">
                {fieldTypes.map((ft) => (
                  <button
                    key={ft.type}
                    onClick={() => handleAddField(ft.type)}
                    className="w-full p-2.5 rounded-lg border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded bg-stone-100 text-xs font-mono font-medium flex items-center justify-center text-stone-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 shrink-0">
                        {ft.icon}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-stone-900 block truncate group-hover:text-emerald-950">
                          {ft.label}
                        </span>
                        <span className="text-[11px] text-stone-400 block truncate">{ft.desc}</span>
                      </div>
                    </div>
                    <Plus size={14} className="text-stone-300 group-hover:text-emerald-600 shrink-0" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Form Fields Canvas */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-medium text-stone-500">
                {form.fields.length} {form.fields.length === 1 ? 'field' : 'fields'} configured
              </span>
              <span className="text-xs text-stone-400">Click a card to edit properties</span>
            </div>

            <div className="space-y-2.5">
              {form.fields.map((f, idx) => {
                const isSelected = selectedFieldId === f.id;
                return (
                  <Card
                    key={f.id}
                    onClick={() => setSelectedFieldId(f.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-stone-100 text-stone-600 font-mono text-[11px] font-semibold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                            {f.type}
                          </Badge>
                          {f.required && (
                            <Badge variant="destructive" className="text-[10px]">
                              Required
                            </Badge>
                          )}
                          {f.conditional && (
                            <Badge variant="warning" className="text-[10px]">
                              Conditional
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveField(idx, 'up')}
                            disabled={idx === 0}
                            className="h-7 w-7 p-0 text-stone-400 hover:text-stone-700"
                          >
                            <MoveUp size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveField(idx, 'down')}
                            disabled={idx === form.fields.length - 1}
                            className="h-7 w-7 p-0 text-stone-400 hover:text-stone-700"
                          >
                            <MoveDown size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteField(f.id)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </div>

                      <div className="pt-1">
                        <h4 className="text-sm font-semibold text-stone-900">{f.label}</h4>
                        <p className="text-xs text-stone-400 mt-0.5 truncate">
                          {f.placeholder || 'No placeholder specified'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Property Inspector */}
          <div className="lg:col-span-4">
            {selectedField ? (
              <Card className="sticky top-20">
                <CardHeader className="pb-3 border-b border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings2 size={16} className="text-emerald-700" />
                      <CardTitle className="text-sm font-semibold text-stone-900">Field Properties</CardTitle>
                    </div>
                    <span className="font-mono text-xs text-stone-400">{selectedField.id}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Field Label *</label>
                    <Input
                      type="text"
                      value={selectedField.label}
                      onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Placeholder</label>
                    <Input
                      type="text"
                      value={selectedField.placeholder || ''}
                      onChange={(e) => handleUpdateField(selectedField.id, { placeholder: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200">
                    <div>
                      <span className="text-xs font-semibold text-stone-800 block">Required Field</span>
                      <span className="text-[11px] text-stone-500">Attendee must provide an answer</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedField.required}
                      onChange={(e) => handleUpdateField(selectedField.id, { required: e.target.checked })}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* Conditional Logic Section */}
                  <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-800 block">Conditional Display</span>
                      {selectedField.conditional && <Badge variant="warning" className="text-[10px]">Active</Badge>}
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-500 block mb-1">Only show when:</span>
                      <select
                        value={selectedField.conditional?.fieldId || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateField(selectedField.id, {
                            conditional: val
                              ? { fieldId: val, operator: 'equals', value: selectedField.conditional?.value ?? 'yes' }
                              : undefined
                          });
                        }}
                        className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">Always Visible</option>
                        {form.fields
                          .filter((f) => f.id !== selectedField.id)
                          .map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.label}
                            </option>
                          ))}
                      </select>
                    </div>

                    {selectedField.conditional && (
                      <div>
                        <span className="text-[11px] text-stone-500 block mb-1">Matches value:</span>
                        <Input
                          type="text"
                          value={String(selectedField.conditional.value ?? '')}
                          onChange={(e) =>
                            handleUpdateField(selectedField.id, {
                              conditional: {
                                fieldId: selectedField.conditional!.fieldId,
                                operator: selectedField.conditional!.operator || 'equals',
                                value: e.target.value
                              }
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center p-8">
                <CardContent className="space-y-2">
                  <p className="text-sm font-medium text-stone-500">No field selected</p>
                  <p className="text-xs text-stone-400">Click any field card in the middle canvas to edit its properties.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Badge variant="info">Live Dynamic Form</Badge>
            </div>
            <CardTitle className="text-xl mt-2">{form.title}</CardTitle>
            <CardDescription>{form.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {form.fields.map((f) => {
              if (!isFieldVisible(f)) return null;
              return (
                <div key={f.id} className="space-y-1.5">
                  <label className="text-sm font-medium text-stone-800 flex items-center gap-1">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={f.placeholder}
                      value={previewAnswers[f.id] || ''}
                      onChange={(e) => setPreviewAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  ) : f.type === 'dropdown' ? (
                    <select
                      value={previewAnswers[f.id] || ''}
                      onChange={(e) => setPreviewAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select option...</option>
                      {f.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <div className="flex items-center gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        checked={Boolean(previewAnswers[f.id])}
                        onChange={(e) => setPreviewAnswers((prev) => ({ ...prev, [f.id]: e.target.checked }))}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                      <span className="text-sm text-stone-600">I confirm and verify this response</span>
                    </div>
                  ) : (
                    <Input
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      placeholder={f.placeholder}
                      value={previewAnswers[f.id] || ''}
                      onChange={(e) => setPreviewAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
                    />
                  )}
                </div>
              );
            })}
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <Button onClick={() => addToast('Form submission simulated successfully!', 'success')} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                Simulate Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* JSON Schema Tab */}
      {activeTab === 'json' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <CardTitle className="text-base font-semibold">Form JSON Schema</CardTitle>
              <CardDescription>Exportable schema payload for API integration</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(form, null, 2));
                addToast('Schema JSON copied to clipboard!', 'success');
              }}
              className="gap-1.5"
            >
              <Copy size={13} />
              <span>Copy Schema</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="p-5 bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto max-h-[550px] leading-relaxed rounded-b-xl">
              {JSON.stringify(form, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
