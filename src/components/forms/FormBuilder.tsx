'use client';

import React, { useState } from 'react';
import { RegistrationForm, FormField, FormFieldType } from '../../types';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  FileCode,
  Save,
  Sliders,
  Settings2,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

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
    'fld-age': 16
  });

  const fieldTypeOptions: { type: FormFieldType; label: string; icon: string }[] = [
    { type: 'text', label: 'Short Text', icon: 'Aa' },
    { type: 'textarea', label: 'Long Text', icon: '¶' },
    { type: 'number', label: 'Numeric Value', icon: '#' },
    { type: 'email', label: 'Email Address', icon: '@' },
    { type: 'phone', label: 'Phone Number', icon: '☎' },
    { type: 'dropdown', label: 'Select Dropdown', icon: '▾' },
    { type: 'radio', label: 'Radio Group', icon: '◉' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑' },
    { type: 'date', label: 'Date', icon: '📅' },
    { type: 'file', label: 'File Upload', icon: '⇪' },
    { type: 'section-header', label: 'Section Header', icon: 'H' },
    { type: 'signature', label: 'Signature', icon: '✍' }
  ];

  const handleAddField = (type: FormFieldType) => {
    const newId = `fld-${Date.now()}`;
    const newField: FormField = {
      id: newId,
      label: `New ${type.replace('-', ' ')}`,
      type,
      required: false,
      placeholder: 'Enter details...',
      helpText: '',
      options:
        type === 'dropdown' || type === 'radio'
          ? [
              { label: 'Option 1', value: 'opt_1' },
              { label: 'Option 2', value: 'opt_2' }
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
    <div className="w-full space-y-6 select-none text-stone-900">
      {/* Top Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block mb-1">
              Interactive Schema Builder
            </span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="text-xl sm:text-2xl font-bold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:outline-none w-full transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex p-1 bg-stone-100 rounded-lg border border-stone-200">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Eye size={13} />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'json'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileCode size={13} />
                <span>JSON</span>
              </button>
            </div>

            <Button
              onClick={() => onSave(form)}
              className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              <Save size={15} />
              <span>Save Schema</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Palette */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Field Library
                </CardTitle>
                <CardDescription className="text-xs">Click to add to canvas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5 p-3 pt-0">
                {fieldTypeOptions.map((f) => (
                  <button
                    key={f.type}
                    onClick={() => handleAddField(f.type)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-stone-50 border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/50 text-stone-800 text-xs font-medium flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs text-stone-400 w-4 block text-center group-hover:text-emerald-700">
                        {f.icon}
                      </span>
                      <span>{f.label}</span>
                    </div>
                    <Plus size={13} className="text-stone-400 group-hover:text-emerald-700" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Middle: Canvas */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-stone-700">
                Fields in Form ({form.fields.length})
              </span>
              <span className="text-xs text-stone-400">Drag or use arrows to order</span>
            </div>

            <div className="space-y-2.5">
              {form.fields.map((field, idx) => {
                const isSelected = selectedFieldId === field.id;
                return (
                  <Card
                    key={field.id}
                    onClick={() => setSelectedFieldId(field.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <CardContent className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-stone-400">#{idx + 1}</span>
                          <span className="text-sm font-semibold truncate text-stone-900">{field.label}</span>
                          {field.required && (
                            <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                              Required
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                            {field.type}
                          </Badge>
                          {field.conditional && (
                            <Badge variant="warning" className="text-[10px] py-0 px-1.5">
                              Conditional
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === 0}
                          onClick={() => handleMoveField(idx, 'up')}
                          className="h-7 w-7 p-0 text-stone-400 hover:text-stone-700"
                        >
                          <MoveUp size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === form.fields.length - 1}
                          onClick={() => handleMoveField(idx, 'down')}
                          className="h-7 w-7 p-0 text-stone-400 hover:text-stone-700"
                        >
                          <MoveDown size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteField(field.id)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right: Property Inspector */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="sticky top-20">
              <CardHeader className="pb-3 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings2 size={15} className="text-emerald-700" />
                    <CardTitle className="text-sm font-semibold">Field Properties</CardTitle>
                  </div>
                  {selectedField && (
                    <span className="font-mono text-xs text-stone-400">{selectedField.id}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {selectedField ? (
                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Field Label *</label>
                      <Input
                        type="text"
                        value={selectedField.label}
                        onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Placeholder</label>
                      <Input
                        type="text"
                        value={selectedField.placeholder || ''}
                        onChange={(e) =>
                          handleUpdateField(selectedField.id, { placeholder: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Help Text</label>
                      <Input
                        type="text"
                        value={selectedField.helpText || ''}
                        onChange={(e) =>
                          handleUpdateField(selectedField.id, { helpText: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200">
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">Required Field</span>
                        <span className="text-[11px] text-stone-500">Attendee cannot leave blank</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedField.required}
                        onChange={(e) =>
                          handleUpdateField(selectedField.id, { required: e.target.checked })
                        }
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>

                    {/* Conditional Logic */}
                    <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                          Conditional Rule
                        </span>
                        <Sliders size={13} className="text-stone-400" />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
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
                          className="w-4 h-4 accent-emerald-600 rounded"
                        />
                        <span className="font-medium text-stone-900 text-xs">Enable Visibility Logic</span>
                      </label>

                      {selectedField.conditional && (
                        <div className="space-y-2 pt-1">
                          <label className="block text-[11px] text-stone-500">Depends On Field:</label>
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
                            className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            {form.fields
                              .filter((f) => f.id !== selectedField.id)
                              .map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 py-4 text-center">
                    Select a field card to configure its properties.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="border-b border-stone-100">
            <Badge variant="info" className="w-fit">Live Form Preview</Badge>
            <CardTitle className="text-xl mt-2">{form.title}</CardTitle>
            {form.description && <CardDescription>{form.description}</CardDescription>}
          </CardHeader>

          <CardContent className="p-6 space-y-4">
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
                  <div key={field.id} className="pt-4 pb-1 border-b border-stone-200">
                    <h5 className="text-base font-bold text-stone-900">{field.label}</h5>
                  </div>
                );
              }

              return (
                <div key={field.id} className="space-y-1.5">
                  <label className="block text-stone-800 font-medium text-xs">
                    {field.label} {field.required && <span className="text-red-600">*</span>}
                  </label>
                  {field.helpText && <p className="text-[11px] text-stone-400">{field.helpText}</p>}

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={field.placeholder}
                      value={(previewValues[field.id] as string) || ''}
                      onChange={(e) =>
                        setPreviewValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  ) : field.type === 'dropdown' ? (
                    <select
                      value={(previewValues[field.id] as string) || ''}
                      onChange={(e) =>
                        setPreviewValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={field.type === 'number' ? 'number' : 'text'}
                      placeholder={field.placeholder}
                      value={(previewValues[field.id] as string) || ''}
                      onChange={(e) =>
                        setPreviewValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      className="h-8 text-xs"
                    />
                  )}
                </div>
              );
            })}

            <div className="pt-4 mt-4 border-t border-stone-100 flex justify-end">
              <Button onClick={() => alert('Submission simulated')} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                Simulate Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* JSON Schema */}
      {activeTab === 'json' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-3 border-b border-stone-100">
            <CardTitle className="text-sm font-semibold">Schema Definition JSON</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="text-xs font-mono text-stone-100 bg-stone-900 p-5 rounded-b-xl overflow-x-auto leading-relaxed max-h-[500px]">
              {JSON.stringify(form, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
