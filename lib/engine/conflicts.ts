// Conflicts (SPEC §7): two likely schemes that list each other in exclusiveWith.

import type { Scheme, Verdict } from './evaluate';

export interface SchemeResult {
  scheme: Scheme;
  status: Verdict;
}

// Returns each conflicting pair once, as [idA, idB] with idA < idB.
export function conflictPairs(results: SchemeResult[]): [string, string][] {
  const likely = new Map<string, Scheme>();
  for (const r of results) {
    if (r.status === 'likely') likely.set(r.scheme.id, r.scheme);
  }
  const schemes = Array.from(likely.values());
  const pairs: [string, string][] = [];
  for (let i = 0; i < schemes.length; i++) {
    for (let j = i + 1; j < schemes.length; j++) {
      const a = schemes[i];
      const b = schemes[j];
      const aListsB = (a.exclusiveWith ?? []).includes(b.id);
      const bListsA = (b.exclusiveWith ?? []).includes(a.id);
      if (aListsB && bListsA) {
        pairs.push(a.id < b.id ? [a.id, b.id] : [b.id, a.id]);
      }
    }
  }
  return pairs;
}
