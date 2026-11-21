# SPEC.md — Haq Sahayak (working name)

> Project context for Nexen. Read this file before planning any change.
> If a request conflicts with this file, stop and ask. When the plan changes, update this file first.

## 1. What we are building

**One line:** A Telugu + English web app that tells students from low-income families in Andhra Pradesh (and their parents) which education schemes and scholarships they are *likely* eligible for, why, which documents to start getting today, and how to apply and track the application until the money arrives.

**Hackathon:** Codebenders ACE Builders 2026, Problem Statement 5 "Claim What's Yours" (Citizens and Public Services).
Build window closes 22 Nov 2026, 11:59 PM IST. Submission: GitHub repo, demo video, short answers.

**Why it matters:** eligible students miss scholarships because information is scattered, rules are hard to read, scheme names change, certificates take days to weeks, and applications get marked "defective" for small errors (Aadhaar name mismatch, bank account not Aadhaar-seeded, expired income certificate). Many families pay agents for help that should be free.

## 2. Scope

| | v1 (this hackathon) | Later (design for it now, do not build) |
|---|---|---|
| Sector | Education (school + college) | Agriculture, Health |
| State | Andhra Pradesh | Tamil Nadu, others |
| Languages | Telugu (default) + English | Tamil |
| Users | Student, parent | Village/ward secretariat assistant, college scholarship cell |
| Reminders | In-app | SMS / WhatsApp |
| Accounts | None (data stays on the device) | Optional login |

Every scheme record carries `sector` and `state`, and every UI string comes from a language file, so agriculture, health, Tamil Nadu and Tamil are added as data, not rewrites.

## 3. Users and sample personas (synthetic — never real people)

1. **Lakshmi, 16, village in Nellore district.** Passed Class 10, joining a polytechnic diploma, day scholar. BC, family income under ₹1 lakh/year, white rice card. Father daily-wage worker. Younger brother in Class 6. Shares one Android phone, small data pack. Speaks Telugu.
2. **Ravi, 18, Guntur.** Passed Class 12 in the top 20% of his stream, joining B.Tech at a private engineering college affiliated to a state university (convener quota), college hostel. SC, family income ₹1–2.5 lakh. Bank account not yet Aadhaar-seeded. (Shows the "choose one: CSSS or AP RTF/MTF" notice.)
3. **Saroja, 38, mother in Kurnool.** BC family. Two children in Class 3 and Class 9 in a government school. Wants to know what the family gets.

All three: family asset conditions met, no ID numbers entered. These are sample people; the schemes they match are real.

What every user needs in 10 seconds: "What can I get, what do I do first, by when?"

## 4. Product flow and screens

```
Landing → Check (intake) → Quick questions (only missing fields that change a result)
       → Results (Likely / Check needed / Not eligible now, with rule-by-rule reasons)
       → Scheme detail → Checklist (documents + start-by dates) → My applications (tracker)
Admin (edit scheme rules as data) · Privacy · About
```

| Route | Screen | Purpose |
|---|---|---|
| `/` | Landing | Explain in 5 seconds, start check, language toggle, sample persona buttons |
| `/check` | Intake | Tap-chip questions |
| `/results` | Results | Scheme cards grouped by status, reasons per rule |
| `/scheme/[id]` | Scheme detail | Benefit, rules, documents, apply steps, official link, last verified |
| `/checklist` | Checklist | De-duplicated documents across matched schemes with start-by dates |
| `/track` | My applications | Status per scheme, reminders, defect fix steps |
| `/admin` | Admin | Edit scheme rules/dates/sources in the browser, re-run, export JSON |
| `/privacy` | Privacy | What we store (nothing on a server), delete my data |

Tracker note box is a separate feature, not the deferred free-text box.

Free-text box: deferred to Phase 10, optional. Not in the current build.

## 5. Tech stack (keep it small)

- Next.js (App Router) + TypeScript + Tailwind CSS. No other UI library unless asked.
- **No database for v1.** Scheme data = JSON files in `data/`. User profile and tracker = browser `localStorage`.
- Optional server route `app/api/extract/route.ts` for AI text-to-profile extraction, only if the organisers confirm runtime AI calls are allowed. The app must work fully without it.
- Fonts: Noto Sans, Noto Sans Telugu, Noto Sans Tamil.
- Tests: Vitest for `lib/engine`.
- Deploy: Vercel (frontend + optional API route). Code on GitHub.

### Folder structure

```
app/                 routes (see §4)
components/          small UI pieces (SchemeCard, RuleRow, LangToggle, ChipQuestion, StatusBadge…)
lib/engine/          evaluate.ts, startBy.ts, types.ts  (pure functions, no UI)
lib/i18n/            dictionary loader, t() helper, fallback ta → en
lib/storage/         localStorage helpers (profile, tracker, admin overrides)
lib/privacy/         maskIds.ts (strip 12-digit and other ID-like numbers)
data/                schemes.json, documents.json, fields.json
messages/            en.json, te.json, ta.json (ta may be empty; falls back to en)
tests/               engine tests with the 3 personas
```

## 6. Data model

```ts
type Sector = 'education' | 'agriculture' | 'health';
type Status = 'open' | 'closed' | 'paused' | 'unknown'; // unknown = window not confirmed on an official page → show "Check dates on the official portal"

interface Scheme {
  id: string;                 // 'ap-pms-rtf'
  sector: Sector;
  state: 'AP' | 'TN' | 'IN';  // IN = central scheme
  name: { en: string; te: string; ta?: string };
  formerNames?: string[];     // e.g. 'Jagananna Vidya Deevena'
  benefit: { en: string; te: string; ta?: string };
  paidTo: 'student' | 'mother' | 'college';
  portalName: string;
  sourceUrl: string;          // official page
  lastVerified: string | null;// ISO date; null = not yet verified → show "Verify before applying"
  window: { opens?: string; closes?: string; note?: { en: string; te: string } };
  status: Status;
  rules: Rule[];
  documents: string[];        // ids in documents.json
  exclusiveWith?: string[];   // scheme ids that cannot be combined with this one
  notStated?: { en: string; te: string }[]; // facts the official source does not state, shown as "check on portal"
  applySteps: { en: string[]; te: string[] };
}

interface Rule {
  field: keyof Profile;
  op: 'eq' | 'in' | 'lte' | 'gte' | 'true';
  value?: string | number | string[];
  label: { en: string; te: string };   // shown to the user as the reason
  orGroup?: string;                    // rules sharing an orGroup pass if ANY passes; rules without it must all pass
}

interface DocumentType {
  id: string;                 // 'income-cert'
  name: { en: string; te: string };
  issuedBy: { en: string; te: string };  // 'Village/Ward Secretariat (Tahsildar)'
  typicalDays: number | null; // official service days; null = unknown, ignored by startBy
  tip?: { en: string; te: string };
}

interface Profile {            // the ONLY user data we hold
  state?: 'AP';
  stage?: 'class1to8' | 'class9to10' | 'inter' | 'iti' | 'diploma' | 'ug' | 'pg' | 'professional';
  category?: 'SC' | 'ST' | 'BC' | 'EBC' | 'Kapu' | 'Minority' | 'OC';
  gender?: 'female' | 'male' | 'other';
  disability?: boolean;
  incomeBand?: 'lt1L' | '1to2_5L' | '2_5to4_5L' | 'gt4_5L';
  residence?: 'day' | 'hostel';
  attendance75?: boolean;
  childrenInClass1to12?: number; // for parent-side schemes
  familyAssetRulesOk?: boolean;  // no govt employee/pensioner, no four-wheeler (taxi/tractor/auto ok), no income-tax payee, land within limits (§8.1)
  collegeType?: 'affiliated' | 'private_or_deemed_university' | 'distance';
  admissionQuota?: 'convener' | 'management_or_spot';
  class12Top20Percent?: boolean; // above 80th percentile in Class XII (CSSS)
  aicteApproved?: boolean;       // technical course in an AICTE-approved institution (Pragati)
  girlsInFamilyOnPragati?: number;
}
```

## 7. Rule engine contract (`lib/engine/evaluate.ts`)

- `evaluate(profile, scheme) → { status: 'likely' | 'check' | 'not_eligible', rules: { label, result: 'pass' | 'fail' | 'unknown' }[], missingFields: string[] }`
- Rules with no `orGroup` are AND. Rules sharing an `orGroup` form one OR-group (pass if any rule passes; fail only if all fail; otherwise unknown). Each OR-group counts as one rule.
- Any `fail` → `not_eligible`. All `pass` → `likely`. Otherwise → `check`, and `missingFields` lists what to ask.
- A scheme with `status: 'paused'` is shown separately as "Currently paused" even if rules pass.
- A scheme with `status: 'unknown'` shows "Check dates on the official portal"; `status: 'closed'` shows the closed notice and the window note.
- Pure function, no I/O, fully unit-tested.
- `startBy(closeDate, documentIds) = closeDate − max(typicalDays of documents not yet marked ready, ignoring null) − 5 days`. If no close date is known, show the document's typical days only ("takes about 30 days — start early").
- Conflicts: if two `likely` schemes are marked `exclusiveWith` each other (CSSS vs AP RTF/MTF), show a "Choose one" notice on both cards.
- The model (if used) only fills `Profile`. **Eligibility is always decided by this engine, never by the model.**

## 8. Scheme data — real data only

### 8.0 Real-data policy (hard rule)

- **Scheme facts are real, never invented.** Every value in `data/schemes.json` and `data/documents.json` (names, eligibility rules, amounts, dates, documents, portals) must come from an official source: a `.gov.in` / `.nic.in` portal, a Government Order (G.O.), official scheme guidelines, or myScheme. Each scheme stores `sourceUrl` and `lastVerified`.
- **If a fact is not confirmed on an official source, leave it out.** Do not guess or fill a default. The rule becomes `unknown` and the UI shows "Check this on the official portal". Never use buddy4study, sarkariyojana or similar sites as a source.
- **Only user data is synthetic:** the 3 personas in §3 are sample people and the UI labels them "Sample".
- **Statistics shown in the app** (e.g. on the About section) must carry a source link.
- The owner supplies the verified facts; Nexen converts them to JSON exactly as given and does not add, round or "improve" them.

### 8.1 Verified scheme facts (checked on official sources, 21 Nov 2026)

Use exactly these values. `lastVerified: "2026-11-21"` for every scheme below. Anything marked **not stated** stays out of the rules (the rule is not created; the UI says "Check this on the official portal").

**1. `ap-pms-rtf` — AP Post Matric Scholarship, RTF (fee reimbursement)** · formerly "Jagananna Vidya Deevena" · source: https://jnanabhumi.ap.gov.in
- Categories: SC, ST, BC, EBC (other than Kapu), Kapu, Minority, Differently Abled.
- Family annual income ≤ ₹2,50,000 (one limit for all categories).
- Family asset conditions: land under 10 acres wet, or 25 acres dry, or 25 acres wet and dry combined; no family member a government employee or pensioner (sanitary workers exempt); no four-wheeler (taxi, tractor, auto exempt); no income-tax payee. (Urban property limit: not stated clearly — leave out.)
- Courses covered: ITI, Polytechnic, Degree and above, in Government, Aided or Private colleges affiliated to State Universities/Boards. Day scholars, College Attached Hostels, Department Attached Hostels.
- Not covered: Intermediate (not listed), Private and Deemed Universities, correspondence/distance education, management or spot admissions.
- 75% aggregate attendance is mandatory for release.
- Benefit: full fee — tuition, special, other and exam fees (as defined in G.O.Ms.No.66, SW(Edn) Dept., 8-9-2010). Paid to: **college account**.
- Application window: not stated on the portal → show "Check dates on Jnanabhumi".

**2. `ap-pms-mtf` — AP Post Matric Scholarship, MTF (food and hostel)** · formerly "Jagananna Vasathi Deevena" · source: https://jnanabhumi.ap.gov.in
- Same eligibility as RTF.
- Benefit per year: ITI ₹10,000 · Polytechnic ₹15,000 · Degree and above ₹20,000.
- Paid to: **mother's account** (if mother is no more or absent, the natural guardian).

**3. `ap-thalliki-vandanam` — Thalliki Vandanam** · source: G.O.Ms.No.26, School Education (Ser.I) Dept., 10-10-2026 (revised sanction, AY 2026-27), which refers to the scheme criteria in G.O.Ms.No.15 dated 16-07-2026 · official mention: https://tirupati.ap.gov.in/intermediate-education/
- Benefit: ₹15,000 per year per child, to each eligible mother/guardian, regardless of the number of children.
- Classes I to XII, including Intermediate, in recognised Government, Private Aided and Private Unaided schools / junior colleges, including residential.
- Other eligibility conditions: **not stated in the GO we read** — create no further rules; show "Other conditions: check at your village/ward secretariat".
- AY 2026-27 scale (for the About section only): 68,05,791 eligible beneficiaries; ₹10,208.69 crore sanctioned.

**4. `ap-prematric` — AP Pre-Matric Scholarship** · source: https://jnanabhumi.ap.gov.in
- SC, ST and Disabled: Classes 5 to 10. BC: Classes 9 and 10.
- Schools: Government, local body (Mandal, Zilla Parishad, Municipal) and Government-aided.
- Income limit and amount: **not stated** — no rule, show "Check on Jnanabhumi".

**5. `in-pm-usp-csss` — PM-USP Central Sector Scheme of Scholarship for College and University Students** · source: https://scholarships.gov.in/public/schemeGuidelines/CSSS_GUIDLINES_06022024.pdf
- Above the 80th percentile of successful candidates in the relevant stream, Class XII, from the respective Board.
- Gross family income ≤ ₹4,50,000 a year (income certificate for fresh applicants only).
- Regular degree courses only — no correspondence/distance, **no diploma courses**. Institution recognised by AICTE / relevant regulators.
- **Cannot be combined** with any other scholarship, including state scholarships and fee waiver/reimbursement schemes → show a "Choose one: this or AP Post Matric RTF/MTF" notice when both match.
- Amount per year: UG years 1–3 ₹12,000; PG ₹20,000; 4th/5th year of professional/integrated courses ₹20,000; B.Tech/B.E. ₹12,000 for years 1–3 and ₹20,000 in year 4.
- Renewal: ≥ 50% marks and ≥ 75% attendance.
- AY 2026-27 on NSP (https://scholarships.gov.in/Students): student applications closed 31-10-2026; institute verification till 15-11-2026; L2 verification till 30-11-2026. One Time Registration (OTR) is mandatory. A student may apply for one merit-based scheme and one or more welfare-based schemes.

**6. `in-aicte-pragati` — AICTE Pragati Scholarship for Girls (technical education)** · sources: https://aicte.gov.in/sites/default/files/pragatisaksham.pdf and https://www.education.gov.in/sites/upload_files/mhrd/files/ru1125.pdf
- Girl students admitted to 1st year of a technical Degree/Diploma, or 2nd year through lateral entry, in an AICTE-approved institution.
- Maximum two girls per family. Family income < ₹8,00,000 a year.
- Amount: **not confirmed on an official page we opened** → show "Amount: check on NSP".
- Applied on NSP; window for AY 2026-27: not confirmed on an official page → status "closed for this year (check NSP)" is NOT to be claimed; show "Check dates on NSP".

**Deliberately left out of v1 (and why):** central Post-Matric Scholarship for SC and PM-YASASVI Post-Matric (OBC/EBC/DNT) are implemented through State Governments, so in AP a student applies once on Jnanabhumi — listing them separately would double-count. Minority post-matric is out because its current status is only reported in news, not on an official page we opened.

### Documents (`data/documents.json`)

Only the service times below are official (AP GSWS CSP user manual, https://vswsonline.ap.gov.in/assets/User-Manuals/CSP-User-Manual.pdf). For every other document `typicalDays: null` → it does not affect start-by dates and the UI says "Time varies".

| id | Document | Issued by | typicalDays |
|---|---|---|---|
| income-cert | Income certificate | Village/Ward Secretariat → Deputy Tahsildar/Tahsildar | 7 |
| caste-cert | Integrated certificate (caste, nativity, date of birth) | Village/Ward Secretariat → Tahsildar | 30 |
| rice-card | Rice card | Held by the family; changes via Village/Ward Secretariat | null |
| ssc-memo | SSC marks memo | School / Board | null |
| class12-marks | Class XII marks memo (for CSSS percentile) | Board | null |
| bank-seeded | Bank account, Aadhaar-seeded and active (bank details are entered on the portal, never in this app) | Your bank branch | null |
| aadhaar-card | Aadhaar card (bring the card; this app never asks for the number) | — | null |
| photo | Passport-size photo | — | null |
| attendance | Attendance record ≥ 75% | College | null |

### Defect reasons and fixes (tracker)

| Reason | Fix steps |
|---|---|
| Name/DOB on Aadhaar does not match | Correct at Aadhaar centre or match the form to Aadhaar exactly; re-submit |
| Bank account not Aadhaar-seeded / inactive | Visit bank branch, request Aadhaar seeding (NPCI mapping), make one transaction |
| Income certificate missing/expired | Apply at village/ward secretariat (about 7 days), re-upload |
| IFSC / account number error | Copy from passbook front page, re-submit |
| Institute not verified | Ask college scholarship cell to verify on portal |

## 9. Guardrails (hard rules — never break)

1. Never say "guaranteed", "you will get", "approved". Use "likely eligible", "check needed", "not eligible now". Every result screen shows: "Final decision is by the department."
2. Never ask for or store Aadhaar, PAN, bank account, ration card or any ID **number**. Run `maskIds()` on all free text before processing or storing; show "We removed an ID number for your safety" if anything was masked.
3. Only public scheme information. Every scheme shows its official link and `lastVerified` (or "Verify before applying").
4. Scheme rules live in `data/*.json`, editable in `/admin`. No eligibility logic hard-coded in UI.
5. Sample personas only. Show a small "Demo uses sample data" note.
6. Category and income are asked as choices, kept on the device, with a one-line "why we ask".
7. No name, phone or address is required anywhere.

## 10. Design rules

- Mobile first (360 px wide), works on a slow phone: no heavy images, no animation libraries.
- Telugu is the default language; toggle te / en on every screen (ta wired, hidden until filled).
- Large tap targets (≥ 44 px), high contrast, one primary action per screen.
- Status colours: Likely = green, Check needed = amber, Not eligible now = grey, Paused = muted. Never red for a person.
- Plain words. Telugu should read like a person speaking, not a translated form.
- Calm, trustworthy look (government-adjacent but friendly): white background, deep teal primary, warm accent.

## 11. How to work in this repo (to save credits and avoid regressions)

1. One slice per request. Propose a short plan first; wait for approval before writing code.
2. Change only the files the plan names. Do not rewrite or reformat unrelated files.
3. No new dependency without saying why in the plan.
4. Never invent scheme facts. Use only `data/*.json`; if something is missing, add `TODO(verify)`.
5. After each slice: run `npm run build` and `npm test`; report results in 3 lines.
6. Keep components under ~150 lines; reuse existing components before creating new ones.
7. When an error appears, fix the root cause; if the same fix fails twice, stop and propose a new plan.
8. Update this SPEC.md when a decision changes.
9. Keep replies short: plan in at most 8 bullets; after building, report in at most 5 lines (files changed, build/test result, anything for the owner to check). No code dumps in chat.

## 12. Definition of done (whole app)

- The three personas run end to end in Telugu and English on a 360 px screen.
- Every result shows reasons, official link and verify status; no screen says "guaranteed".
- An ID number typed in free text is masked.
- Changing a rule in `/admin` changes results with no code change.
- Engine tests pass; `npm run build` passes; deployed URL works on a phone.
