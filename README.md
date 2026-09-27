# IlmFlow State — Islamic Event & Competition Operating System 🌙

> **Enterprise-grade, data-driven Islamic Event OS inspired by the Flow State registration experience.**
> Built for international Islamic summits, Holy Quran recitation championships, Hadith mastery tournaments, accredited parchment diplomas, and real-time secretariat administration.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-blueviolet)](https://turbo.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle)](https://orm.drizzle.team/)
[![Bun](https://img.shields.io/badge/Bun-1.4.2-fbf0df?logo=bun)](https://bun.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🏛️ System Architecture

IlmFlow State is designed as a modular, data-driven Event OS where all events, registration fields, question banks, rubrics, and schedules are dynamically configured without modifying source code.

```text
                           ISLAMIC EVENT PLATFORM
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
             EVENT CMS          REGISTRATION        USER SYSTEM
                 │                   │                   │
             Schedule             Forms               8 Roles
             Speakers             Fields              22 Granular
             Sessions             Pricing Math        Permissions
                                  Waitlists & QR
                                     │
                             COMPETITION ENGINE
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
               PROCTORED TESTS              MANUAL SUBMISSIONS
               Authoritative Timers         Quran Audio Recitation
               Anti-Cheat Telemetry         Scholarly Essays
               Negative Marking Math        100-pt Rubric & Appeals
                                     │
                             ADMIN SECRETARIAT
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
                 ANALYTICS & AUDIT            ARRIVAL GATE
                 Question Discrimination      Mobile Audio Chime
                 Velocity & Logs              QR Scanner Terminal
```

---

## 💎 Design Philosophy & Aesthetic System

IlmFlow State rejects neon cliches and aggressive synthetic gradients in favor of an **enterprise academic sanctuary aesthetic**:
- **Alabaster Ivory Limestone (`#faf8f5`)**: Warm natural parchment canvas.
- **Deep Sanctuary Emerald (`#064e3b`)**: Scholarly dignity and institutional authority.
- **Burnished Antique Gold (`#9e782f`)**: Illuminated manuscripts, diploma borders, and decorative gilding.
- **Deep Ink Slate (`#0f172a`)**: High-contrast, crystal-clear typography.
- **Typography Pairing**:
  - **Plus Jakarta Sans**: Ultra-clean, geometric enterprise UI.
  - **Cinzel**: Formal Roman serifs for royal parchment diplomas.
  - **Amiri**: Traditional Naskh Arabic script for Quranic verses and Hadith citations.

---

## ✨ Key Platform Features

### 1. Flow State Multi-Day Registration Engine
- **Capacity Management**: Atomic per-day quotas with automatic overflow to waitlists.
- **Tiered Passes**: VIP, General, Academic, and Youth admissions.
- **Discount & Promo Matrix**: Multi-day bundling math, early-bird rates, and percentage/fixed discount codes.
- **Digital Lanyard Pass**: Live SVG QR codes with unique tokens for instantaneous gate check-in.

### 2. Zero-Code Visual Form Builder (`/admin/forms/[id]/builder`)
- **12 Dynamic Field Types**: Text, Textarea, Email, Phone, Number, Date, Dropdown, Radio, Checkboxes, File/Portfolio Upload, Gender Selection, and Digital Signature Canvas.
- **Conditional Visibility**: Show/hide questions based on previous answers (e.g., Parent Consent shown only if Age < 18).
- **Immutable Versioning**: Publishing creates incremental versions (`v1`, `v2`, `v3`) ensuring historical applicant records are never corrupted.
- **Live Canvas & Schema Exporter**: Instant split-screen preview and one-click JSON schema export.

### 3. Proctored Competition Engine (`/test/[id]`)
- **Islamic Question Bank**: Seeded with 20+ questions spanning Tajweed, Sahih al-Bukhari, Islamic jurisprudence, and Seerah.
- **Anti-Cheat Telemetry**: Authoritative server timer synchronization, blur/tab-switch detection, fullscreen enforcement, and violation counters.
- **Negative Marking Math**: Configurable deduction for incorrect attempts, zero-penalty skips, and 0-score flooring.
- **Interactive Exam Matrix**: Jump to questions, review flagged bookmarks, and view instant feedback on submission.

### 4. Hybrid 100-Point Rubric Grading & Appeals (`/admin/grading`)
- **Dual Review Workflows**: Automatic grading for objective quizzes; 100-pt rubric scoring for Quran audio recordings and scholarly essays.
- **Audio Waveform Player**: Integrated audio inspection for Tajweed accuracy, Makharij articulation, and vocal modulation.
- **Contestant Appeals**: Official rebuttal submission with audit trail review.

### 5. Staff Arrival Gate (`/staff/checkin`)
- **Mobile Camera & Manual Entry**: Fast lookup by ticket number or barcode token.
- **Web Audio Chimes**: Dual audio synthesizers (pleasant green harmonic chime for valid admission, low amber chord for double-entry or duplicate scans).
- **Real-Time Attendance Counter**: Live gate throughput velocity with timestamped records.

### 6. Central Secretariat Admin & RBAC (`/admin`)
- **8 Dedicated Personas**: Visitor, Participant, Parent/Guardian, Judge/Grader, Event Staff, Content Manager, Administrator, Super Admin.
- **Interactive Role Switcher**: Instant persona switching with contextual banner notification and permission guards.
- **Audit Logs**: Immutable event trail recording all ticket issues, grade modifications, and role updates.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- [Bun](https://bun.sh/) (v1.2+) or Node.js (v20+)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/FuadTesfaye/ilmflow-state.git
cd ilmflow-state
bun install
```

### 2. Seed SQLite Database
Populate conferences, schedules, speakers, tickets, and 20+ verified Hadith/Quran questions:
```bash
bun run src/db/seed.ts
```

### 3. Run Automated Unit Tests
```bash
bun test
```
*Expected: 9 passing unit tests covering RBAC permissions, multi-day discounts, and negative marking math.*

### 4. Start Development Server
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
bun run build
bun run start
```

---

## 📁 Repository Structure

```text
src/
├── app/                        # Next.js App Router (22 fully statically/dynamically rendered pages)
│   ├── admin/                  # Secretariat backoffice (analytics, audit logs, form builder, grading, users)
│   ├── certificates/           # Public cryptographic verification portal
│   ├── competitions/           # Competition listings and manual audio/essay submission
│   ├── dashboard/              # Participant cockpit (passes, active tests, diplomas)
│   ├── events/                 # Event showcase, multi-day ticket checkout modal
│   ├── judge/                  # Dedicated judge scoring portal
│   ├── leaderboard/            # Global leaderboard with tie-breaking badges
│   ├── staff/                  # Arrival gate check-in terminal with audio feedback
│   └── test/                   # Proctored exam engine with anti-cheat telemetry
├── components/                 # Reusable UI componentry (Flow registration, Parchment diplomas, Form Builder)
├── context/                    # AppContext state engine with local persistence & toast bus
├── data/                       # Comprehensive seed fixtures and initial configurations
├── db/                         # Drizzle ORM SQLite database schema and seeding script
├── features/                   # Core business logic services (events, forms, registrations, grading, exams)
├── lib/                        # Granular RBAC definitions and cryptographic verification helpers
└── types/                      # End-to-end TypeScript interfaces
```

---

## 📜 License
Distributed under the MIT License. Built with devotion and precision.
