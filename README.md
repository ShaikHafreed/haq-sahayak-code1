# Haq Sahayak: "Claim What's Yours"

A plain-language eligibility checker for Andhra Pradesh education schemes, in Telugu and English.

Live site: https://haq-sahayak.vercel.app

Built for Codebenders ACE Builders 2026, Problem Statement 5.

## The problem

Scheme rules are long, scattered across several portals, and hard to read. Many families do not know which education schemes they can claim, so money and support go unclaimed.

## What it does

A student or parent answers a few simple questions, one at a time. Every question can be skipped. The app then shows:

- which schemes the family is likely eligible for
- which schemes are closed or paused
- every rule of each scheme, and whether the answers meet it
- the official source link and the date the scheme was last verified

A checklist and a tracker help the family follow up on the official portal.

## How it works

- Eligibility is decided by a rule engine that follows each scheme's published rules. AI does not decide eligibility.
- Scheme data lives in `data/schemes.json`. Each scheme carries its source link and a verified date.
- There are no accounts. Answers stay on the device in local storage. A "Clear my data" button removes them.
- The interface is available in Telugu and English.

## Schemes covered (v1)

- AP Post Matric Scholarship, Fee Reimbursement (RTF)
- AP Post Matric Scholarship, Food and Hostel (MTF)
- Thalliki Vandanam
- AP Pre-Matric Scholarship
- PM-USP Central Sector Scheme of Scholarship for College and University Students
- AICTE Pragati Scholarship for Girls (technical education)

Scheme status on the site is checked against the official sources listed on each scheme page. Final decisions are always taken by the department.

## Honest notes

- Sample students shown in the app (for example "Sample Lakshmi") are made up and labelled as samples.
- This is an independent project. It is not affiliated with the Government of Andhra Pradesh.
- Telugu text should be reviewed by a native speaker. Some landing-page text still appears in English when Telugu is selected.
- Planned next: a results view with answers-used chips and a rule-by-rule comparison table.

## Tech

Next.js 15 (App Router), TypeScript, Tailwind CSS, Vitest. Deployed on Vercel.

## Run locally

```
npm install
npm run dev
```

Run the tests with `npm test`.

## Author

Shaik Hafreed, solo builder.
