import { describe, it, expect } from 'vitest';
import schemesJson from '../data/schemes.json';
import documentsJson from '../data/documents.json';
import { evaluate, type Verdict } from '../lib/engine/evaluate';
import type { Scheme, DocumentType, Profile } from '../lib/types';
import { startBy } from '../lib/engine/startBy';
import { conflictPairs } from '../lib/engine/conflicts';
import { lakshmi, ravi, saroja } from '../lib/engine/personas';

const schemes = schemesJson as unknown as Scheme[];
const documents = documentsJson as unknown as DocumentType[];
const byId = (id: string) => schemes.find((s) => s.id === id)!;
const verdict = (p: Profile, id: string): Verdict => evaluate(p, byId(id)).status;

describe('sample personas against data/schemes.json', () => {
  // Expectations follow the data rules: a fail on any rule => not_eligible; unknown fields => check.
  it('Lakshmi (diploma, BC): RTF/MTF check (college, quota, attendance unknown); Thalliki/Prematric/CSSS fail on stage', () => {
    expect(verdict(lakshmi, 'ap-pms-rtf')).toBe('check');
    expect(verdict(lakshmi, 'ap-pms-mtf')).toBe('check');
    expect(verdict(lakshmi, 'ap-thalliki-vandanam')).toBe('not_eligible'); // stage not class1to8/9to10/inter
    expect(verdict(lakshmi, 'ap-prematric')).toBe('not_eligible'); // stage not class1to8/9to10
    expect(verdict(lakshmi, 'in-pm-usp-csss')).toBe('not_eligible'); // stage not ug/pg/professional
    expect(verdict(lakshmi, 'in-aicte-pragati')).toBe('check'); // gender, aicteApproved unknown
  });

  it('Ravi (ug, SC): CSSS likely; Thalliki/Prematric fail on stage; RTF/MTF/Pragati check', () => {
    expect(verdict(ravi, 'ap-pms-rtf')).toBe('check'); // attendance75 unknown
    expect(verdict(ravi, 'ap-pms-mtf')).toBe('check'); // attendance75 unknown
    expect(verdict(ravi, 'ap-thalliki-vandanam')).toBe('not_eligible'); // stage ug not in list
    expect(verdict(ravi, 'ap-prematric')).toBe('not_eligible'); // stage ug not class1to8/9to10
    expect(verdict(ravi, 'in-pm-usp-csss')).toBe('likely'); // all four CSSS rules pass
    expect(verdict(ravi, 'in-aicte-pragati')).toBe('check'); // gender, aicteApproved, girls unknown
  });

  it('Saroja (BC, 2 children): no stage, so stage-based rules are check; Thalliki check on stage only', () => {
    expect(verdict(saroja, 'ap-pms-rtf')).toBe('check');
    expect(verdict(saroja, 'ap-pms-mtf')).toBe('check');
    expect(verdict(saroja, 'ap-thalliki-vandanam')).toBe('check'); // childrenInClass1to12 gte 1 passes; stage unknown
    expect(verdict(saroja, 'ap-prematric')).toBe('check'); // BC group passes; stage unknown
    expect(verdict(saroja, 'in-pm-usp-csss')).toBe('check');
    expect(verdict(saroja, 'in-aicte-pragati')).toBe('check');
  });

  it('passes scheme.status through (CSSS is closed in data)', () => {
    expect(evaluate(ravi, byId('in-pm-usp-csss')).schemeStatus).toBe('closed');
    expect(evaluate(ravi, byId('ap-pms-rtf')).schemeStatus).toBe('unknown');
  });
});

describe('disability and category (orGroup category-or-disability)', () => {
  // ap-prematric: category in [SC,ST,BC] OR disability true; stage in [class1to8,class9to10].
  it('disabled OC student in class 9 passes the group and is likely', () => {
    const p: Profile = { state: 'AP', category: 'OC', disability: true, stage: 'class9to10' };
    expect(verdict(p, 'ap-prematric')).toBe('likely');
  });

  it('non-disabled OC student fails the group => not_eligible', () => {
    const p: Profile = { state: 'AP', category: 'OC', disability: false, stage: 'class9to10' };
    expect(verdict(p, 'ap-prematric')).toBe('not_eligible');
  });

  it('OR-group with unknown disability is one rule: check, and only disability is missing', () => {
    const p: Profile = { state: 'AP', category: 'OC', stage: 'class9to10' };
    const r = evaluate(p, byId('ap-prematric'));
    expect(r.status).toBe('check');
    expect(r.rules).toHaveLength(2); // group counts as one rule + stage
    expect(r.rules[0].result).toBe('unknown');
    expect(r.missingFields).toEqual(['disability']);
  });
});

describe('unknown fields', () => {
  it('Saroja on RTF: check, lists each unknown field once, not the disability member of a passing group', () => {
    const r = evaluate(saroja, byId('ap-pms-rtf'));
    expect(r.status).toBe('check');
    expect(r.missingFields).toEqual(
      expect.arrayContaining(['incomeBand', 'stage', 'collegeType', 'admissionQuota', 'attendance75']),
    );
    expect(new Set(r.missingFields).size).toBe(r.missingFields.length);
    expect(r.missingFields).not.toContain('disability');
  });

  it('Saroja on Thalliki: check, missingFields is exactly stage', () => {
    const r = evaluate(saroja, byId('ap-thalliki-vandanam'));
    expect(r.status).toBe('check');
    expect(r.missingFields).toEqual(['stage']);
  });
});

describe('conflicts (CSSS vs AP RTF/MTF, exclusiveWith in data)', () => {
  const results = (p: Profile) => schemes.map((s) => ({ scheme: s, status: evaluate(p, s).status }));

  it('Ravi as sample: RTF is check (attendance unknown), so no pair is reported', () => {
    expect(conflictPairs(results(ravi))).toEqual([]);
  });

  it('Ravi with attendance75 true (test-only variant): RTF and CSSS both likely => pair reported', () => {
    const withAttendance: Profile = { ...ravi, attendance75: true };
    const pairs = conflictPairs(results(withAttendance));
    expect(pairs).toHaveLength(2); // RTF–CSSS and MTF–CSSS; RTF and MTF do not list each other
    expect(pairs).toContainEqual(['ap-pms-rtf', 'in-pm-usp-csss']);
    expect(pairs).toContainEqual(['ap-pms-mtf', 'in-pm-usp-csss']);
  });
});

describe('startBy (SPEC §7, documents.json typicalDays)', () => {
  it('ignores null typicalDays and uses the longest not-ready document: 30 days + 5', () => {
    // closeDate 2026-10-31 − 35 days = 2026-09-26; bank-seeded is null and ignored
    const r = startBy('2026-10-31', ['income-cert', 'bank-seeded', 'caste-cert'], [], documents);
    expect(r).toEqual({ startBy: '2026-09-26', longestDays: 30 });
  });

  it('a document marked ready is excluded: caste-cert ready, so 7 days + 5', () => {
    // 2026-10-31 − 12 days = 2026-10-19
    const r = startBy('2026-10-31', ['income-cert', 'caste-cert'], ['caste-cert'], documents);
    expect(r).toEqual({ startBy: '2026-10-19', longestDays: 7 });
  });

  it('only null typicalDays documents => no date and no longest days', () => {
    const r = startBy('2026-10-31', ['bank-seeded'], [], documents);
    expect(r).toEqual({ startBy: null, longestDays: null });
  });

  it('no close date: returns longest days only', () => {
    const r = startBy(null, ['caste-cert', 'income-cert'], [], documents);
    expect(r).toEqual({ startBy: null, longestDays: 30 });
  });
});

describe('not_eligible', () => {
  it('Lakshmi on CSSS: stage diploma fails the regular-degree rule', () => {
    const r = evaluate(lakshmi, byId('in-pm-usp-csss'));
    expect(r.status).toBe('not_eligible');
    expect(r.schemeStatus).toBe('closed');
  });
});
