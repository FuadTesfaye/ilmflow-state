'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../../../context/AppContext';
import { FormField, FormFieldType, RegistrationForm } from '../../../../../types';
import { IslamicStarIcon } from '../../../../../components/common/IslamicPattern';
import {
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  FileCode,
  Save,
  CheckCircle,
  Copy,
  Clock,
  Sparkles,
  Layers,
  HelpCircle,
  Check
} from 'lucide-react';

export default function DedicatedFormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { forms, saveForm, addToast } = useApp();

  const formId = (params?.id as string) || 'form-summit-standard';
  const existingForm = forms.find((f) => f.id === formId) || forms[0];

  const [form, setForm] = useState<RegistrationForm>(
    existingForm || {
      id: formId,
      title: 'New Delegate Application Form',
      description: 'Custom attendee data collection schema',
      fields: [
        {
          id: 'f_name',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter full name'
        }
      ]
    }
  );

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(form.fields[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'preview' | 'json' | 'versions'>('canvas');
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({
    'f_age': 16
  });

  const selectedField = form.fields.find((f) => f.id === selectedFieldId);

  const fieldTypes: { type: FormFieldType; label: string; icon: string; desc: string }[] = [
    { type: 'text', label: 'Short Text', icon: 'Aa', desc: 'Single line text input' },
    { type: 'textarea', label: 'Long Text / Essay', icon: '¶', desc: 'Multi-line commentary or bio' },
    { type: 'email', label: 'Email Address', icon: '@', desc: 'Validated email input' },
    { type: 'phone', label: 'Phone Number', icon: '☎', desc: 'International phone formatting' },
    { type: 'number', label: 'Numeric Value', icon: '#', desc: 'Age, years, or counts' },
    { type: 'dropdown', label: 'Select Dropdown', icon: '▾', desc: 'Single pick from options' },
    { type: 'radio', label: 'Radio Button Group', icon: '◉', desc: 'Mutually exclusive options' },
    { type: 'checkbox', label: 'Consent Checkbox', icon: '☑', desc: 'Boolean acknowledgement' },
    { type: 'date', label: 'Date Picker', icon: '📅', desc: 'Calendar date selector' },
    { type: 'file', label: 'Document / Ijazah Upload', icon: '⇪', desc: 'PDF or image attachment' },
    { type: 'section-header', label: 'Section Divider', icon: 'H', desc: 'Group related questions' },
    { type: 'signature', label: 'Digital Signature', icon: '✍', desc: 'Cryptographic confirmation' }
  ];

  const handleAddField = (type: FormFieldType) => {
    const newId = `fld_${Date.now()}`;
    const newField: FormField = {
      id: newId,
      label: `New ${type.replace('-', ' ')} Question`,
      type,
      required: false,
      placeholder: 'Enter answer...',
      helpText: 'Official academic or admission record verification.',
      options:
        type === 'dropdown' || type === 'radio'
          ? [
              { label: 'Option A', value: 'opt_a' },
              { label: 'Option B', value: 'opt_b' }
            ]
          : undefined
    };

    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedFieldId(newId);
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    }));
  };

  const handleDeleteField = (id: string) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id)
    }));
    if (selectedFieldId === id) {
      setSelectedFieldId(form.fields[0]?.id || null);
    }
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= form.fields.length) return;
    const copy = [...form.fields];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setForm((prev) => ({ ...prev, fields: copy }));
  };

  const handlePublishVersion = () => {
    const nextVer = currentVersion + 1;
    setCurrentVersion(nextVer);
    saveForm(form);
    addToast(`Published Form Version ${nextVer} successfully! Historical submissions preserved.`, 'success');
  };

  const isFieldVisible = (f: FormField) => {
    if (!f.conditional) return true;
    const parentVal = previewAnswers[f.conditional.fieldId];
    if (f.conditional.operator === 'not_equals') {
      return String(parentVal ?? '') !== String(f.conditional.value ?? '');
    }
    return String(parentVal ?? '') === String(f.conditional.value ?? '');
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-[#0f172a]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#6b7280] hover:text-[#0f172a] transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#0f172a]">{form.title}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4f0e6] text-[#064e3b] border border-[#e7e2d6]">
                Version {currentVersion}
              </span>
            </div>
            <p className="text-xs text-[#6b7280]">{form.fields.length} questions configured • Immutable schema versioning active</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[#f4f0e6] p-1 border border-[#e7e2d6] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'canvas' ? 'bg-[#ffffff] text-[#064e3b] shadow-xs' : 'text-[#6b7280]'
              }`}
            >
              Canvas
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'preview' ? 'bg-[#ffffff] text-[#064e3b] shadow-xs' : 'text-[#6b7280]'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'json' ? 'bg-[#ffffff] text-[#064e3b] shadow-xs' : 'text-[#6b7280]'
              }`}
            >
              Schema JSON
            </button>
          </div>

          <button
            onClick={handlePublishVersion}
            className="px-4 py-2 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save size={14} />
            <span>Publish Version {currentVersion + 1}</span>
          </button>
        </div>
      </div>

      {/* Main Builder Workstation */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Field Types Palette */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-3">
              <span className="text-[10px] font-bold tracking-[0.14em] text-[#6b7280] uppercase block">
                FIELD LIBRARY PALETTE
              </span>
              <p className="text-xs text-[#6b7280]">
                Click any component type to append to your registration canvas.
              </p>

              <div className="space-y-1.5 pt-2">
                {fieldTypes.map((ft) => (
                  <button
                    key={ft.type}
                    onClick={() => handleAddField(ft.type)}
                    className="w-full p-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4f0e6] border border-[#e7e2d6] text-left transition-colors flex items-center gap-3 cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#ffffff] border border-[#e7e2d6] text-xs font-bold font-mono flex items-center justify-center text-[#064e3b] group-hover:border-[#064e3b]">
                      {ft.icon}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#0f172a] block truncate">
                        {ft.label}
                      </span>
                      <span className="text-[10px] text-[#6b7280] block truncate">
                        {ft.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column: Visual Canvas */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] flex items-center justify-between text-xs text-[#6b7280]">
              <span>Questions in Canvas: {form.fields.length}</span>
              <span className="text-[#064e3b] font-semibold">Click any question to configure settings</span>
            </div>

            <div className="space-y-3">
              {form.fields.map((f, idx) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFieldId(f.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedFieldId === f.id
                      ? 'bg-[#ffffff] border-[#064e3b] shadow-md ring-2 ring-[#064e3b]/20'
                      : 'bg-[#ffffff] border-[#e7e2d6] shadow-xs hover:border-[#9e782f]/50'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#f4f0e6]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#f4f0e6] text-[#064e3b] text-[10px] font-bold flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#faf8f5] border border-[#e7e2d6] text-[#6b7280]">
                        {f.type}
                      </span>
                      {f.required && (
                        <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          Required
                        </span>
                      )}
                      {f.conditional && (
                        <span className="text-[10px] font-semibold text-[#9e782f] bg-[#fbf8f2] px-1.5 py-0.5 rounded">
                          Conditional
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleMoveField(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-[#f4f0e6] disabled:opacity-30 text-[#6b7280]"
                      >
                        <MoveUp size={13} />
                      </button>
                      <button
                        onClick={() => handleMoveField(idx, 'down')}
                        disabled={idx === form.fields.length - 1}
                        className="p-1 rounded hover:bg-[#f4f0e6] disabled:opacity-30 text-[#6b7280]"
                      >
                        <MoveDown size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteField(f.id)}
                        className="p-1 rounded hover:bg-red-50 text-red-600 ml-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-[#0f172a] block">{f.label}</span>
                    <span className="text-[11px] text-[#6b7280] block mt-0.5">
                      {f.placeholder || 'No placeholder specified'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Field Settings Inspector */}
          <div className="lg:col-span-4 space-y-4">
            {selectedField ? (
              <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-4 sticky top-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
                    FIELD INSPECTOR
                  </span>
                  <span className="font-mono text-xs text-[#6b7280]">{selectedField.id}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#0f172a] block mb-1">Question Label</label>
                    <input
                      type="text"
                      value={selectedField.label}
                      onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#0f172a] block mb-1">Placeholder Text</label>
                    <input
                      type="text"
                      value={selectedField.placeholder || ''}
                      onChange={(e) =>
                        handleUpdateField(selectedField.id, { placeholder: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-[#f4f0e6]">
                    <div>
                      <span className="font-semibold text-[#0f172a] block">Mandatory Field</span>
                      <span className="text-[11px] text-[#6b7280]">Participant cannot skip</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedField.required}
                      onChange={(e) =>
                        handleUpdateField(selectedField.id, { required: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#064e3b] cursor-pointer"
                    />
                  </div>

                  {/* Conditional Logic Section */}
                  <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-2">
                    <span className="text-[10px] font-bold tracking-wider text-[#9e782f] uppercase block">
                      CONDITIONAL VISIBILITY LOGIC
                    </span>
                    <p className="text-[11px] text-[#6b7280]">
                      Only show this question if a previous answer matches a criterion.
                    </p>

                    <div className="space-y-2 pt-1">
                      <div>
                        <span className="text-[10px] text-[#6b7280] block">Depends on Question:</span>
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
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#0f172a]"
                        >
                          <option value="">No Condition (Always Show)</option>
                          {form.fields
                            .filter((f) => f.id !== selectedField.id)
                            .map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.label} ({f.id})
                              </option>
                            ))}
                        </select>
                      </div>

                      {selectedField.conditional && (
                        <div>
                          <span className="text-[10px] text-[#6b7280] block">Show When Value Equals:</span>
                          <input
                            type="text"
                            value={String(selectedField.conditional.value ?? '')}
                            onChange={(e) => {
                              handleUpdateField(selectedField.id, {
                                conditional: {
                                  fieldId: selectedField.conditional!.fieldId,
                                  operator: selectedField.conditional!.operator || 'equals',
                                  value: e.target.value
                                }
                              });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#ffffff] border border-[#e7e2d6] text-xs text-[#0f172a]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] text-center text-xs text-[#6b7280]">
                Select a question on the canvas to configure its settings.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Preview Mode */}
      {activeTab === 'preview' && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-md space-y-6">
          <div className="space-y-1 pb-4 border-b border-[#e7e2d6]">
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
              LIVE FORM TEST PREVIEW
            </span>
            <h3 className="text-xl font-bold text-[#0f172a]">{form.title}</h3>
            <p className="text-xs text-[#6b7280]">{form.description}</p>
          </div>

          <div className="space-y-4">
            {form.fields.map((f) => {
              const visible = isFieldVisible(f);
              if (!visible) return null;

              return (
                <div key={f.id} className="space-y-1.5 text-xs">
                  <label className="font-semibold text-[#0f172a] flex items-center gap-1">
                    <span>{f.label}</span>
                    {f.required && <span className="text-red-500">*</span>}
                  </label>

                  {f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={f.placeholder}
                      value={previewAnswers[f.id] || ''}
                      onChange={(e) =>
                        setPreviewAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                    />
                  ) : f.type === 'dropdown' ? (
                    <select
                      value={previewAnswers[f.id] || ''}
                      onChange={(e) =>
                        setPreviewAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                    >
                      <option value="">Select option...</option>
                      {f.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        checked={Boolean(previewAnswers[f.id])}
                        onChange={(e) =>
                          setPreviewAnswers((prev) => ({ ...prev, [f.id]: e.target.checked }))
                        }
                        className="w-4 h-4 accent-[#064e3b]"
                      />
                      <span className="text-xs text-[#475569]">I confirm this declaration</span>
                    </div>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      placeholder={f.placeholder}
                      value={previewAnswers[f.id] || ''}
                      onChange={(e) =>
                        setPreviewAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#e7e2d6] flex justify-end">
            <button
              onClick={() => addToast('Form submission simulated successfully!', 'success')}
              className="px-5 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer"
            >
              Simulate Submit
            </button>
          </div>
        </div>
      )}

      {/* JSON Schema View */}
      {activeTab === 'json' && (
        <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
              EXPORTABLE FORM SCHEMA JSON
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(form, null, 2));
                addToast('Schema copied to clipboard!', 'success');
              }}
              className="text-xs font-semibold text-[#064e3b] hover:underline flex items-center gap-1"
            >
              <Copy size={13} />
              <span>Copy JSON</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-mono text-[#0f172a] overflow-x-auto max-h-[500px]">
            {JSON.stringify(form, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
