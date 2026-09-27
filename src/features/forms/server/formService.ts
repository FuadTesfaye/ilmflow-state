import { db } from '../../../db';
import * as schema from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export interface FormFieldInput {
  fieldKey: string;
  type: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  options?: Array<{ label: string; value: string }>;
  conditionalRules?: {
    fieldKey: string;
    operator: 'equals' | 'not_equals' | 'less_than' | 'greater_than';
    value: unknown;
    action: 'show' | 'hide';
  };
  orderIndex: number;
  width?: 'full' | 'half' | 'third';
}

export async function getFormWithLatestVersion(formId: string) {
  const formRecords = await db.select().from(schema.forms).where(eq(schema.forms.id, formId)).limit(1);
  if (!formRecords[0]) return null;

  const form = formRecords[0];

  const versionRecords = await db
    .select()
    .from(schema.formVersions)
    .where(eq(schema.formVersions.formId, form.id))
    .orderBy(desc(schema.formVersions.versionNumber))
    .limit(1);

  const activeVersion = versionRecords[0];
  if (!activeVersion) return { form, version: null, fields: [] };

  const fieldRecords = await db
    .select()
    .from(schema.formFields)
    .where(eq(schema.formFields.formVersionId, activeVersion.id));

  // Parse JSON options & conditionalRules
  const fields = fieldRecords
    .map((f) => ({
      ...f,
      options: f.options ? JSON.parse(f.options) : [],
      conditionalRules: f.conditionalRules ? JSON.parse(f.conditionalRules) : null
    }))
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return {
    form,
    version: activeVersion,
    fields
  };
}

export async function saveNewFormVersion(formId: string, fields: FormFieldInput[]) {
  const formRecords = await db.select().from(schema.forms).where(eq(schema.forms.id, formId)).limit(1);
  if (!formRecords[0]) throw new Error('Form not found');

  const form = formRecords[0];
  const nextVersionNumber = form.currentVersion + 1;
  const now = new Date().toISOString();
  const newVersionId = `fv-${formId}-v${nextVersionNumber}`;

  // Insert new immutable form version
  await db.insert(schema.formVersions).values({
    id: newVersionId,
    formId: form.id,
    versionNumber: nextVersionNumber,
    isPublished: true,
    publishedAt: now
  });

  // Insert form fields
  for (let idx = 0; idx < fields.length; idx++) {
    const f = fields[idx];
    await db.insert(schema.formFields).values({
      id: `fld-${newVersionId}-${idx + 1}`,
      formVersionId: newVersionId,
      fieldKey: f.fieldKey,
      type: f.type as any,
      label: f.label,
      description: f.description,
      placeholder: f.placeholder,
      required: f.required ?? false,
      defaultValue: f.defaultValue,
      options: f.options ? JSON.stringify(f.options) : null,
      conditionalRules: f.conditionalRules ? JSON.stringify(f.conditionalRules) : null,
      orderIndex: idx + 1,
      width: f.width || 'full'
    });
  }

  // Update current version pointer on form
  await db
    .update(schema.forms)
    .set({ currentVersion: nextVersionNumber, updatedAt: now })
    .where(eq(schema.forms.id, form.id));

  return {
    formId,
    versionNumber: nextVersionNumber,
    versionId: newVersionId
  };
}

export async function submitFormAnswers(
  formId: string,
  formVersionId: string,
  userId: string,
  answers: Record<string, unknown>,
  registrationId?: string
) {
  const submissionId = `fsub-${Date.now()}`;
  const now = new Date().toISOString();

  await db.insert(schema.formSubmissions).values({
    id: submissionId,
    formId,
    formVersionId,
    registrationId,
    userId,
    submittedAt: now
  });

  for (const [key, value] of Object.entries(answers)) {
    await db.insert(schema.submissionAnswers).values({
      id: `ans-${submissionId}-${key}`,
      submissionId,
      fieldKey: key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')
    });
  }

  return { submissionId, submittedAt: now };
}
