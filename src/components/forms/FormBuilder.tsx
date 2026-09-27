'use client';

import React, { useState } from 'react';
import { RegistrationForm, FormField, FormFieldType } from '../../types';
import { IslamicStarIcon } from '../common/IslamicPattern';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Settings,
  Eye,
  FileCode,
  Save,
  Sliders,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface FormBuilderProps {
  initialForm: RegistrationForm;
  onSave: (form: RegistrationForm) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ initialForm, onSave }) => {
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    initialForm.fields[0]?.id || null
  );
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'json'>('editor');
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({
    'fld-age': 16 // minor test default for conditional logic demo
  });

  const fieldTypeOptions: { type: FormFieldType; label: string; icon: string }[] = [
    { type: 'text', label: 'Short Text', icon: 'Aa' },
    { type: 'textarea', label: 'Long Text / Bio', icon: '¶' },
    { type: 'number', label: 'Numeric Value', icon: '#' },
    { type: 'email', label: 'Email Address', icon: '@' },
    { type: 'phone', label: 'Phone Number', icon: '☎' },
    { type: 'dropdown', label: 'Select Dropdown', icon: '▾' },
    { type: 'radio', label: 'Radio Option Group', icon: '◉' },
    { type: 'checkbox', label: 'Consent Checkbox', icon: '☑' },
    { type: 'date', label: 'Calendar Date', icon: '📅' },
    { type: 'file', label: 'Document / Sanad Upload', icon: '⇪' },
    { type: 'section-header', label: 'Section Heading', icon: 'H' },
    { type: 'signature', label: 'Digital Signature', icon: '✍' }
  ];

  const handleAddField = (type: FormFieldType) => {
    const newId = `fld-${Date.now()}`;
    const newField: FormField = {
      id: newId,
      label: `New ${type.replace('-', ' ')} Field`,
      type,
      required: false,
      placeholder: 'Enter details...',
      helpText: 'Official academic or admission record verification.',
      options:
        type === 'dropdown' || type === 'radio'
          ? [
              { label: 'Primary Option', value: 'opt_1' },
              { label: 'Secondary Option', value: 'opt_2' }
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
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= form.fields.length) return;

    const fieldsCopy = [...form.fields];
    const temp = fieldsCopy[index];
    fieldsCopy[index] = fieldsCopy[targetIndex];
    fieldsCopy[targetIndex] = temp;

    setForm((prev) => ({ ...prev, fields: fieldsCopy }));
  };

  const selectedField = form.fields.find((f) => f.id === selectedFieldId);

  return (
    <div className="w-full space-y-6 select-none text-[#111827]">
      {/* Top Bar */}
      <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <IslamicStarIcon size={14} className="text-[#064e3b]" />
            <span className="meta-tag text-[#064e3b] font-bold">
              DYNAMIC FORM SCHEMA ARCHITECT
            </span>
          </div>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="font-display text-2xl font-bold text-[#111827] bg-transparent border-b border-transparent hover:border-[#e7e2d6] focus:border-[#064e3b] focus:outline-none w-full mt-1 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-2xl bg-[#f4f0e6] p-1.5 border border-[#e7e2d6]">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              Schema Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              <Eye size={13} />
              <span>Live Test Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-[#ffffff] text-[#064e3b] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              <FileCode size={13} />
              <span>JSON</span>
            </button>
          </div>

          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] text-xs font-semibold hover:bg-[#043c2e] cursor-pointer shadow-xs transition-all"
          >
            <Save size={14} />
            <span>Save Schema</span>
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Palette */}
          <div className="lg:col-span-3 space-y-3">
            <div className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <span className="meta-tag text-[#064e3b] block mb-3 font-bold">AVAILABLE COMPONENTS</span>
              <div className="grid grid-cols-1 gap-1.5">
                {fieldTypeOptions.map((f) => (
                  <button
                    key={f.type}
                    onClick={() => handleAddField(f.type)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] hover:border-[#064e3b]/50 text-[#4b5563] hover:text-[#111827] text-xs flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs text-[#064e3b] font-bold w-4">
                        {f.icon}
                      </span>
                      <span>{f.label}</span>
                    </div>
                    <Plus size={13} className="text-[#9ca3af] group-hover:text-[#064e3b]" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle: Canvas */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-5 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d6]">
                <span className="meta-tag text-[#111827] font-bold">SEQUENCE ({form.fields.length} FIELDS)</span>
                <span className="text-[11px] text-[#6b7280]">Click field to inspect</span>
              </div>

              <div className="space-y-2">
                {form.fields.map((field, idx) => {
                  const isSelected = selectedFieldId === field.id;
                  return (
                    <div
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#f4f0e6] border-[#064e3b] text-[#111827] shadow-xs'
                          : 'bg-[#faf8f5] border-[#e7e2d6] text-[#4b5563] hover:border-[#064e3b]/30'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate">{field.label}</span>
                          {field.required && <span className="text-red-600 text-xs font-bold">*</span>}
                        </div>
                        <span className="meta-tag text-[9px] text-[#6b7280] block mt-0.5">
                          Type: {field.type} {field.conditional ? '• [CONDITIONAL]' : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveField(idx, 'up')}
                          className="p-1 rounded-lg bg-[#ffffff] border border-[#e7e2d6] text-[#6b7280] hover:text-[#111827] disabled:opacity-30 cursor-pointer"
                        >
                          <MoveUp size={12} />
                        </button>
                        <button
                          disabled={idx === form.fields.length - 1}
                          onClick={() => handleMoveField(idx, 'down')}
                          className="p-1 rounded-lg bg-[#ffffff] border border-[#e7e2d6] text-[#6b7280] hover:text-[#111827] disabled:opacity-30 cursor-pointer"
                        >
                          <MoveDown size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="p-1 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:text-red-700 ml-1 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Property Inspector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
              <span className="meta-tag text-[#064e3b] block pb-3 border-b border-[#e7e2d6] font-bold">
                PROPERTY CONFIGURATOR
              </span>

              {selectedField ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#4b5563] mb-1 font-bold">Field Label *</label>
                    <input
                      type="text"
                      value={selectedField.label}
                      onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4b5563] mb-1 font-bold">Placeholder Text</label>
                    <input
                      type="text"
                      value={selectedField.placeholder || ''}
                      onChange={(e) =>
                        handleUpdateField(selectedField.id, { placeholder: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4b5563] mb-1 font-bold">Subtext / Explanatory Advice</label>
                    <input
                      type="text"
                      value={selectedField.helpText || ''}
                      onChange={(e) =>
                        handleUpdateField(selectedField.id, { helpText: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={selectedField.required}
                      onChange={(e) =>
                        handleUpdateField(selectedField.id, { required: e.target.checked })
                      }
                      className="accent-[#064e3b] w-4 h-4 rounded"
                    />
                    <span className="text-[#111827] font-semibold">Enforce as Required Field</span>
                  </label>

                  {/* Conditional Logic Rule Config */}
                  <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6] space-y-2.5 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="meta-tag text-[#064e3b] font-bold">CONDITIONAL RULE</span>
                      <Sliders size={13} className="text-[#064e3b]" />
                    </div>
                    <p className="text-[11px] text-[#6b7280]">
                      Display this question conditionally based on attendee input (e.g. Minor &lt; 18).
                    </p>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedField.conditional)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleUpdateField(selectedField.id, {
                              conditional: {
                                fieldId: form.fields[0]?.id || '',
                                operator: 'less_than',
                                value: 18
                              }
                            });
                          } else {
                            handleUpdateField(selectedField.id, { conditional: undefined });
                          }
                        }}
                        className="accent-[#064e3b] w-4 h-4 rounded"
                      />
                      <span className="font-semibold text-[#111827]">Enable Rule Engine</span>
                    </label>

                    {selectedField.conditional && (
                      <div className="space-y-2 pt-2 text-[11px]">
                        <div>
                          <label className="block text-[#6b7280]">Depends On Field:</label>
                          <select
                            value={selectedField.conditional.fieldId}
                            onChange={(e) =>
                              handleUpdateField(selectedField.id, {
                                conditional: {
                                  ...selectedField.conditional!,
                                  fieldId: e.target.value
                                }
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-xl bg-[#ffffff] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b]"
                          >
                            {form.fields
                              .filter((f) => f.id !== selectedField.id)
                              .map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.label} ({f.id})
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#6b7280]">Select a component from the canvas to configure.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] relative">
          <div className="border-b border-[#e7e2d6] pb-4 mb-6">
            <span className="meta-tag text-[#064e3b] font-bold">
              INTERACTIVE TEST RUNNER PREVIEW
            </span>
            <h4 className="font-display text-2xl text-[#111827] font-bold mt-1.5">{form.title}</h4>
            <p className="text-xs text-[#6b7280] mt-1">{form.description}</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
            {form.fields.map((field) => {
              if (field.conditional) {
                const targetVal = Number(previewValues[field.conditional.fieldId]);
                if (field.conditional.operator === 'less_than') {
                  if (!(targetVal < Number(field.conditional.value))) {
                    return null;
                  }
                }
              }

              if (field.type === 'section-header') {
                return (
                  <div key={field.id} className="pt-4 pb-2 border-b border-[#e7e2d6]">
                    <h5 className="font-display text-base font-bold text-[#064e3b]">
                      {field.label}
                    </h5>
                  </div>
                );
              }

              return (
                <div key={field.id} className="space-y-1.5">
                  <label className="block text-[#111827] font-bold">
                    {field.label} {field.required && <span className="text-red-600">*</span>}
                  </label>
                  {field.helpText && <p className="text-[11px] text-[#6b7280]">{field.helpText}</p>}

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={field.placeholder}
                      value={(previewValues[field.id] as string) || ''}
                      onChange={(e) =>
                        setPreviewValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                    />
                  ) : field.type === 'dropdown' ? (
                    <select
                      value={(previewValues[field.id] as string) || ''}
                      onChange={(e) =>
                        setPreviewValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                    >
                      <option value="">Select option...</option>
                      {field.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'age' || field.type === 'number' ? 'number' : 'text'}
                      placeholder={field.placeholder}
                      value={(previewValues[field.id] as string) || ''}
                      onChange={(e) =>
                        setPreviewValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-[#111827] focus:border-[#064e3b] focus:outline-none"
                    />
                  )}
                </div>
              );
            })}

            <div className="pt-4 border-t border-[#e7e2d6] flex justify-end">
              <button
                type="submit"
                onClick={() => alert('Test Submission Validated Successfully!')}
                className="px-6 py-2.5 rounded-xl bg-[#064e3b] text-[#ffffff] font-bold text-xs hover:bg-[#043c2e] cursor-pointer shadow-xs"
              >
                Test Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* JSON Schema */}
      {activeTab === 'json' && (
        <div className="p-6 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <pre className="text-xs font-mono text-[#064e3b] overflow-x-auto p-5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d6]">
            {JSON.stringify(form, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
