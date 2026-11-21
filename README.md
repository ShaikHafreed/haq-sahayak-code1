# Haq Sahayak — "Claim What's Yours"

A plain-language eligibility matcher for government education schemes in Andhra Pradesh,
in **Telugu and English**.

A student or parent answers a few simple questions. The app tells them which scholarships
they are likely eligible for, **why**, which documents to start collecting, and when to start.

Built for Codebenders ACE Builders 2026, Problem Statement 5.

---

## The problem

Scholarship money goes unclaimed every year — not because families are ineligible, but because
nobody tells them in a language they read, in words they understand, that they qualify.
Portals are in English, written in scheme-speak, and never say *"you, specifically, can apply for this."*

## What it does

1. **Answers, not forms.** One question per screen, with "Not sure" on every single question.
   Nothing is mandatory.
2. **A verdict with reasons.** Each scheme comes back as *likely eligible*, *needs checking*, or
   *not eligible*, and every verdict lists the rules that produced it.
3. **A document checklist.** Merges the documents needed across all matching schemes, sorted by how
   long each one takes to obtain, with tick boxes and a print view.
4. **A tracker.** Record what was applied for and when, so nothing is forgotten mid-deadline.

## Real data only

Every scheme fact in this app comes from an official source and is recorded with the date it was
checked. **Nothing is generated or guessed.**

Where an official portal does not state something, the app shows "Check on official portal"
rather than inventing an answer. Scheme statuses are marked `unknown` unless the portal states
otherwise.

The six schemes in v1:

| Scheme | Level |
|---|---|
| AP Post Matric Scholarship — Reimbursement of Tuition Fee (RTF) | State |
| AP Post Matric Scholarship — Maintenance / Mess & Hostel (MTF) | State |
| Thalliki Vandanam | State |
| AP Pre-Matric Scholarship | State |
| PM-USP Central Sector Scheme of Scholarship (CSSS) | Central |
| AICTE Pragati Scholarship for Girls | Central |

Only the **sample personas** (Lakshmi, Ravi, Saroja) are synthetic, and they are labelled
"Sample" everywhere they appear.

## Privacy

- **Nothing leaves the device.** No accounts, no server, no analytics. Answers live in the
  browser's own storage and a "Clear my data" button wipes them.
- **ID numbers are stripped before storage.** Free-text notes pass through a masking function
  that removes Aadhaar-style and other long digit sequences, so an ID typed by mistake is never
  written to storage.

## Eligibility is rules, not AI

Eligibility is decided by a pure, auditable rule engine — plain data in `data/schemes.json`,
evaluated in `lib/engine/`. There is no model in the decision path, so every verdict can be
traced to a rule and explained to the person it affects.

Rules combine with AND. Rules sharing an `orGroup` form an OR-group: the group passes if any
rule passes, and only fails if all of them fail. Anything unresolved stays *unknown* rather than
being resolved to a guess.

## Tech

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Vitest
Custom lightweight i18n (`t(key, lang)`), no i18n dependency.

## Run it

```bash
npm install
npm run dev -- -p 3005
```

Then open http://localhost:3005

```bash
npm test          # unit tests for the engine, checklist, tracker and masking
npm run build     # production build
```

## Structure

```
app/              routes: /, /check, /results, /scheme/[id], /checklist, /track
components/       UI per route
lib/types.ts      all shared types
lib/engine/       eligibility evaluation, start-by dates, conflicts, grouping
lib/data/         loaders for the scheme and document data
lib/storage/      browser storage for profile, checklist and tracker
lib/privacy/      ID masking
data/             schemes.json and documents.json — the real, sourced data
messages/         en.json, te.json
tests/            Vitest suites
```

## Scope of v1

Education schemes, Andhra Pradesh, Telugu and English.

The data model is sector- and state-agnostic, so agriculture and health schemes, and other
states and languages, are additions to the data rather than rewrites of the code.

## Known limits

- Telugu strings are a first draft and need a native speaker's review before real use.
- Document processing times are only recorded where an official source states them; the rest are
  left blank rather than estimated.
- Scheme open/closed status is `unknown` unless the portal states it, so the app points users to
  the official portal to confirm.
