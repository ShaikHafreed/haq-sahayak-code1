// Groups scheme results for the results screen (SPEC §4, §7). Pure: no I/O, no UI.

import { evaluate, type Evaluation } from './evaluate';
import type { Profile, Scheme } from '../types';

export interface Result {
  scheme: Scheme;
  evaluation: Evaluation;
}

export interface GroupedResults {
  likely: Result[];
  check: Result[];
  not_eligible: Result[];
  closedOrPaused: Result[];
}

export function groupResults(profile: Profile, schemes: Scheme[]): GroupedResults {
  const groups: GroupedResults = { likely: [], check: [], not_eligible: [], closedOrPaused: [] };
  for (const scheme of schemes) {
    const evaluation = evaluate(profile, scheme);
    const result: Result = { scheme, evaluation };
    if (scheme.status === 'closed' || scheme.status === 'paused') {
      groups.closedOrPaused.push(result);
    } else {
      groups[evaluation.status].push(result);
    }
  }
  return groups;
}
