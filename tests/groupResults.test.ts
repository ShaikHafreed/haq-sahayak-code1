import { describe, it, expect } from 'vitest';
import schemesJson from '../data/schemes.json';
import { groupResults } from '../lib/engine/groupResults';
import { lakshmi, ravi, saroja } from '../lib/engine/personas';
import type { Scheme } from '../lib/types';

const schemes = schemesJson as unknown as Scheme[];

describe('groupResults on sample personas', () => {
  for (const [name, profile] of [
    ['Lakshmi', lakshmi],
    ['Ravi', ravi],
    ['Saroja', saroja],
  ] as const) {
    it(`${name}: every scheme is in exactly one group`, () => {
      const g = groupResults(profile, schemes);
      const all = [...g.likely, ...g.check, ...g.not_eligible, ...g.closedOrPaused];
      expect(all).toHaveLength(schemes.length);
      expect(new Set(all.map((r) => r.scheme.id)).size).toBe(schemes.length);
    });
  }

  it('closed or paused schemes land in closedOrPaused', () => {
    const g = groupResults(ravi, schemes);
    const closed = schemes.filter((s) => s.status === 'closed' || s.status === 'paused');
    expect(closed.length).toBeGreaterThan(0); // in-pm-usp-csss is closed in the data
    const ids = g.closedOrPaused.map((r) => r.scheme.id);
    for (const s of closed) expect(ids).toContain(s.id);
  });

  it('closedOrPaused contains only closed or paused schemes', () => {
    for (const profile of [lakshmi, ravi, saroja]) {
      const g = groupResults(profile, schemes);
      for (const r of g.closedOrPaused) {
        expect(['closed', 'paused']).toContain(r.scheme.status);
      }
    }
  });

});
