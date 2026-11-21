// Sample personas from SPEC §3. Synthetic people, labelled "Sample" in the UI.
// Only facts SPEC §3 states are mapped; everything else is left undefined (unknown).

import type { Profile } from './evaluate';

export const SAMPLE_LABEL = 'Sample' as const;

export const lakshmi: Profile = {
  state: 'AP',
  stage: 'diploma',
  category: 'BC',
  incomeBand: 'lt1L',
  residence: 'day',
  familyAssetRulesOk: true,
};

export const ravi: Profile = {
  state: 'AP',
  stage: 'ug',
  category: 'SC',
  incomeBand: '1to2_5L',
  residence: 'hostel',
  collegeType: 'affiliated',
  admissionQuota: 'convener',
  class12Top20Percent: true,
  familyAssetRulesOk: true,
};

export const saroja: Profile = {
  state: 'AP',
  category: 'BC',
  childrenInClass1to12: 2,
  familyAssetRulesOk: true,
};

export const SAMPLE_PERSONAS = [
  { name: 'Lakshmi', label: SAMPLE_LABEL, profile: lakshmi },
  { name: 'Ravi', label: SAMPLE_LABEL, profile: ravi },
  { name: 'Saroja', label: SAMPLE_LABEL, profile: saroja },
] as const;
