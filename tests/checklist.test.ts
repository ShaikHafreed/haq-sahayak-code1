import { describe, it, expect } from 'vitest';
import {
  earliestStartBy,
  mergeDocuments,
  sortDocuments,
  type ChecklistItem,
} from '../lib/checklist/buildChecklist';
import { getDocuments } from '../lib/data';
import type { DocumentType, Profile, Scheme } from '../lib/types';

// Synthetic scheme: with no rules it is "likely"; a gender rule decides likely / not_eligible / check.
function scheme(id: string, over: Partial<Scheme> = {}): Scheme {
  return {
    id,
    state: 'AP',
    name: { en: id, te: id },
    status: 'open',
    window: { closes: '2030-01-31' },
    rules: [],
    documents: [],
    lastVerified: null,
    sourceUrl: 'https://example.invalid',
    ...over,
  } as Scheme;
}

const femaleRule = { field: 'gender' as const, op: 'eq' as const, value: 'female', label: { en: 'F', te: 'F' } };
const femaleProfile: Profile = { gender: 'female' };

describe('mergeDocuments', () => {
  it('returns unique document ids only from likely or check schemes', () => {
    const schemes = [
      scheme('A', { documents: ['income-cert', 'caste-cert'] }), // likely
      scheme('B', {
        rules: [{ ...femaleRule, value: 'male' }], // not_eligible for a female profile
        documents: ['caste-cert'],
      }),
      scheme('C', {
        rules: [{ field: 'disability', op: 'true', label: { en: 'D', te: 'D' } }], // unknown -> check
        documents: ['income-cert'],
      }),
    ];
    const items = mergeDocuments(schemes, femaleProfile);
    const ids = items.map((i) => i.document.id).sort();
    expect(ids).toEqual(['caste-cert', 'income-cert']);

    const income = items.find((i) => i.document.id === 'income-cert');
    expect(income?.schemes.map((s) => s.id).sort()).toEqual(['A', 'C']);
    const caste = items.find((i) => i.document.id === 'caste-cert');
    expect(caste?.schemes.map((s) => s.id)).toEqual(['A']);
  });

  it('returns nothing when every scheme is not_eligible', () => {
    const schemes = [scheme('X', { rules: [{ ...femaleRule, value: 'male' }], documents: ['income-cert'] })];
    expect(mergeDocuments(schemes, femaleProfile)).toEqual([]);
  });
});

describe('sortDocuments', () => {
  it('puts highest typicalDays first and nulls last', () => {
    const doc = (id: string, typicalDays: number | null): DocumentType => ({
      id,
      name: { en: id, te: id },
      issuedBy: { en: '', te: '' },
      typicalDays,
    });
    const items: ChecklistItem[] = [
      { document: doc('none', null), schemes: [] },
      { document: doc('seven', 7), schemes: [] },
      { document: doc('thirty', 30), schemes: [] },
      { document: doc('fourteen', 14), schemes: [] },
    ];
    const ids = sortDocuments(items).map((i) => i.document.id);
    expect(ids).toEqual(['thirty', 'fourteen', 'seven', 'none']);
  });
});

describe('earliestStartBy', () => {
  const documents = getDocuments();
  const schemes = [scheme('S', { documents: ['income-cert', 'caste-cert'] })];
  const today = '2026-01-01';

  it('uses the longest document (30 days) when nothing is ticked', () => {
    // 2030-01-31 minus (30 + 5) days
    expect(earliestStartBy(schemes, femaleProfile, [], documents, today)).toBe('2029-12-27');
  });

  it('moves later when the 30-day document is ticked (7 days becomes longest)', () => {
    // 2030-01-31 minus (7 + 5) days
    expect(earliestStartBy(schemes, femaleProfile, ['caste-cert'], documents, today)).toBe('2030-01-19');
  });

  it('returns null when every needed document is ticked', () => {
    expect(
      earliestStartBy(schemes, femaleProfile, ['caste-cert', 'income-cert'], documents, today),
    ).toBeNull();
  });

  it('returns null when no eligible scheme has a future close date', () => {
    const past = [scheme('P', { window: { closes: '2020-01-01' }, documents: ['caste-cert'] })];
    expect(earliestStartBy(past, femaleProfile, [], documents, today)).toBeNull();
  });
});
