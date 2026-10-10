# Master Build Plan: IlmFlow Platform Finalization

## Executive Overview
This build plan details the complete engineering strategy to finalize the **IlmFlow** platform. The plan covers four primary pillars:
1. **Airtight Role-Based Access Control (RBAC)** across all 7 platform roles with layout-level guards and workspace isolation.
2. **Interactive Admin Question & Form Choice Builder** enabling administrators and educators to construct rich bilingual test questions with custom choices, answer keys, marks, and explanations.
3. **End-to-End Competition & Learning Integration** binding question forms to tournament rounds, proctored exam sessions (`/test/[id]`), auto-grading, and Sanad diploma issuance.
4. **Dynamic Registration Form Schema Engine** linking event registration schemas dynamically into the delegate admission pipeline.

---

## Pillar 1: Airtight RBAC Architecture & Route Protection

### Current Gap Analysis
- While the main `/admin` route has a page-level gate, individual subroutes (`/admin/forms`, `/admin/forms/[id]/builder`, `/admin/users`, `/admin/audit-logs`, `/admin/analytics`, `/admin/grading`, `/admin/events/new`) lack layout-level barriers. Direct URL navigation could expose administrative tools to unauthorized roles.
- `/staff/checkin` and `/judge` rely on page-level state without route layout fallback guards.
- In `AppContext`, role switching is available, but layout-level boundary defense is needed to ensure strict defense-in-depth across the entire Next.js App Router tree.

### Solution Design
```
                       [ Incoming Request / Navigation ]
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
      /admin/* Routes          /judge/* Routes         /staff/* Routes
              │                       │                       │
     ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
     │  admin/layout  │      │  judge/layout  │      │  staff/layout  │
     │ RoleGate:      │      │ RoleGate:      │      │ RoleGate:      │
     │ admin,         │      │ judge, admin,  │      │ staff, admin,  │
     │ superadmin     │      │ superadmin     │      │ superadmin     │
     └───────┬────────┘      └───────┬────────┘      └───────┬────────┘
             │                       │                       │
      [Allowed / Denied]      [Allowed / Denied]      [Allowed / Denied]
             │                       │                       │
      Render Child Page       Render Child Page       Render Child Page
      or AccessDeniedCard     or AccessDeniedCard     or AccessDeniedCard
```

### Role Matrix & Workspace Boundaries
| Platform Role | Primary Workspace | Allowed Capabilities | Restricted Capabilities |
| :--- | :--- | :--- | :--- |
| **`superadmin`** | `/admin`, `/dashboard` | Complete unrestricted access: user governance, security audit logs, platform analytics, system settings, all event and competition management. | None. |
| **`admin`** | `/admin`, `/dashboard` | Event programming, registration management, form creation/editing, question bank authoring, competition publishing, Sanad diploma issuance. | Platform-wide user role escalation and system config deletion. |
| **`judge`** | `/judge`, `/dashboard` | Rubric-based scoring of Quranic recitations and essay treatises, leaderboard review, exam review. | Modifying ticket tiers, editing global event settings. |
| **`staff`** | `/staff`, `/staff/checkin` | Optical QR attendee check-in, real-time ticket scanning, attendee manifest search, venue capacity monitoring. | Editing exams, grading recitations, modifying financial waqf. |
| **`participant`** | `/portal`, `/dashboard` | Personal QR lanyard, active tournament quiz taking (`/test/[id]`), Sanad diploma downloads, registered event passes. | Accessing admin tables, editing questions, grading peers. |
| **`parent`** | `/portal`, `/dashboard` | Family attendance passes, dependent competition progress tracking, signed guardian consents, family diploma archives. | Direct administrative modifications. |
| **`visitor`** | `/`, `/events`, `/competitions` | Public conference viewing, tournament rules inspection, Waqf endowments, speaker and schedule browsing. | Accessing protected delegate portals or admin panels. |

---

## Pillar 2: Admin Interactive Question & Form Choice Builder

### Current Gap Analysis
- In `src/app/admin/page.tsx` and `src/app/dashboard/page.tsx`, the `Add Question` modal only collects a question prompt and category, hardcoding static choices (`opt_1`, `opt_2`, `opt_3`) and marking `opt_1` as correct without any admin choice editor.
- Admins cannot specify custom option text, bilingual Arabic translations for options, multiple correct answers, true/false options, or fill-in-the-blank keys.
- In `src/app/admin/forms/[id]/builder/page.tsx`, navigating to `/admin/forms/new/builder` incorrectly falls back to `forms[0]` instead of instantiating a clean new form schema.

### Solution Design: `QuestionBuilderModal`
A dedicated, reusable question builder component featuring:
1. **Question Types**:
   - `multiple-choice` (Single choice with radio selection for correct answer).
   - `multiple-select` (Multiple choices with checkboxes for multiple correct answers).
   - `true-false` (Auto-populates True/False with Arabic translations: صحيح / خطأ).
   - `fill-blank` (Single text input specifying accepted exact answer).
2. **Bilingual Question Prompt**:
   - English prompt with placeholder and validation.
   - Arabic Matn input with RTL direction, font styling, and optional diacritics.
3. **Dynamic Choice Management**:
   - Add new option / delete option (minimum 2 options for multiple-choice).
   - Edit option text in English.
   - Edit option text in Arabic (`arabicText`).
   - Radio / Checkbox to select which option is correct.
4. **Scoring, Difficulty & Taxonomy**:
   - Marks (1 to 100) and Negative Marks (0 to 50).
   - Category picker: `hadith-mastery`, `quran-memorization`, `quran-recitation`, `seerah-knowledge`, `islamic-quiz`, `arabic-language`, `fiqh-jurisprudence`.
   - Difficulty: `beginner`, `intermediate`, `advanced`.
   - Time limit in seconds (optional).
5. **Scholarly Verification & References**:
   - Source reference (e.g., *Sahih al-Bukhari, Hadith 1*, *Tafsir Ibn Kathir*).
   - Detailed scholarly explanation/commentary displayed to participants during review.
6. **Direct Assignment**:
   - Option to assign the question directly to a specific competition round or save it to the general question bank.

---

## Pillar 3: End-to-End Competition & Learning Flow

### Architecture & Data Flow
```
 ┌──────────────────────────────────────────────────────────────┐
 │                    Admin Question Builder                    │
 │    (Creates questions with choices, marks, & correct key)    │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │                      Question Bank &                         │
 │                   Competition Assignment                     │
 │          CompetitionRound.questionIds = ['q-1', 'q-2']       │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │                 Participant Exam Runner                      │
 │                       (/test/[id])                           │
 │     - Proctored environment with countdown timer             │
 │     - Dynamic Question Palette & Question Flagging           │
 │     - Anti-cheat tab blur detection & warning counts         │
 │     - Interactive choices selection (Single/Multi/TF/Fill)   │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │               Submission & Auto-Grading Engine               │
 │     - Compare submitted choices against correctAnswer        │
 │     - Calculate total score, percentage, passed status       │
 │     - Record QuizAttempt in AppContext                       │
 │     - Trigger celebratory confetti & Sanad Diploma issuance │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │             Participant Portal & Public Leaderboard          │
 │     - View exam scorecard and question review                │
 │     - Verified Sanad certificate with cryptographic hash     │
 │     - Live leaderboard ranking with badges                   │
 └──────────────────────────────────────────────────────────────┘
```

### Proctored Quiz Engine Enhancements
- Support all question types (`multiple-choice`, `multiple-select`, `true-false`, `fill-blank`) cleanly in `QuizEngine.tsx`.
- Connect `/test/[id]` directly to active competition round questions created by admins.
- Auto-generate a verified `CertificateItem` when a participant passes the competition round with a score $\ge$ passing threshold.

---

## Pillar 4: Dynamic Form Builder & Live Registration Engine

### Form Builder Enhancements
- Fix `src/app/admin/forms/[id]/builder/page.tsx` so `/new` initializes a pristine form with a unique ID, default title, and base schema.
- Allow live editing of fields, field reordering, conditional display rules, and JSON import/export.
- Persist saved forms to `AppContext` and allow linking to any event.

### Registration Modal Dynamic Rendering
- Update `FlowRegistrationModal.tsx` to read `getFormById(event.formId)`.
- Dynamically render the form's custom fields in Step 2 (e.g., custom dropdowns, text fields, checkboxes, guardian consent, special needs).
- Store custom answers directly in the `RegistrationRecord.formAnswers` map, visible in the admin attendee table and inspector drawer.

---

## Phased Execution Plan (3-Change Cadence)

Following the project constraint to commit and push every 3 changes:

### Batch 1: Route-Level RBAC Protection & Form Builder Fixes
- **Change 1**: Create `src/app/admin/layout.tsx` enforcing `<RoleGate allowedRoles={['admin', 'superadmin']}>` with `AccessDeniedCard` fallback across all admin subroutes.
- **Change 2**: Create `src/app/staff/layout.tsx` (allowing `staff`, `admin`, `superadmin`) and `src/app/judge/layout.tsx` (allowing `judge`, `admin`, `superadmin`).
- **Change 3**: Fix `src/app/admin/forms/[id]/builder/page.tsx` to properly handle `new` form creation and state saving.
- 🚀 **Commit 1 & Push to GitHub**: `feat(rbac): enforce layout guards across admin, staff, judge and fix new form builder`

### Batch 2: Question & Choices Builder Component & Admin Integration
- **Change 4**: Create `src/components/forms/QuestionBuilderModal.tsx` supporting question types, dynamic bilingual choices, correct answer selection, marks, and explanations.
- **Change 5**: Integrate `QuestionBuilderModal` into `src/app/admin/page.tsx` and `src/app/dashboard/page.tsx`, replacing hardcoded stubs.
- **Change 6**: Add question assignment UI to competitions in the admin panel so admins can attach questions to competition rounds.
- 🚀 **Commit 2 & Push to GitHub**: `feat(questions): implement comprehensive bilingual question builder and competition round assignment`

### Batch 3: Competition Quiz Runner, Registration Schema & Verification
- **Change 7**: Enhance `src/components/competition/QuizEngine.tsx` and `src/app/test/[id]/page.tsx` to support all question types and auto-certify upon passing.
- **Change 8**: Connect dynamic form schemas in `src/components/registration/FlowRegistrationModal.tsx` to render event-specific fields.
- **Change 9**: Run full TypeScript check (`bun x tsc --noEmit`), production build (`bun run build`), end-to-end audit, and push finalized code.
- 🚀 **Commit 3 & Push to GitHub**: `feat(engine): connect dynamic forms to registration, enhance quiz runner, and finalize platform`

---

## Verification & Acceptance Criteria
1. **RBAC Security**:
   - Navigating to `/admin`, `/admin/forms`, `/admin/users`, `/staff/checkin`, or `/judge` as a `visitor` or `participant` immediately renders `AccessDeniedCard`.
   - Switching roles seamlessly unblocks appropriate views.
2. **Question Authoring**:
   - Admin can open the Question Builder modal, add multiple custom choices with English & Arabic text, pick the correct choice, set marks and explanation, and save to bank or round.
3. **Competition Flow**:
   - Participant can launch `/test/[id]`, answer the custom choices created by admin, submit, and receive auto-graded results and a verified certificate.
4. **Registration Forms**:
   - Admin can build a form with custom fields, link it to an event, and attendees filling out the registration modal will see and submit those dynamic fields.
5. **Clean Build**:
   - Zero TypeScript compiler errors (`bun x tsc --noEmit`).
   - Production build compiles 100% of routes successfully (`bun run build`).
