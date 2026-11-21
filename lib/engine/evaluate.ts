// Rule engine (SPEC §6, §7). Pure: no I/O, no UI.

export type Status = 'open' | 'closed' | 'paused' | 'unknown';
export type Verdict = 'likely' | 'check' | 'not_eligible';
export type RuleResult = 'pass' | 'fail' | 'unknown';
export type Op = 'eq' | 'in' | 'lte' | 'gte' | 'true';

export interface Label {
  en: string;
  te: string;
}

export interface Profile {
  state?: 'AP';
  stage?: 'class1to8' | 'class9to10' | 'inter' | 'iti' | 'diploma' | 'ug' | 'pg' | 'professional';
  category?: 'SC' | 'ST' | 'BC' | 'EBC' | 'Kapu' | 'Minority' | 'OC';
  gender?: 'female' | 'male' | 'other';
  disability?: boolean;
  incomeBand?: 'lt1L' | '1to2_5L' | '2_5to4_5L' | 'gt4_5L';
  residence?: 'day' | 'hostel';
  attendance75?: boolean;
  childrenInClass1to12?: number;
  familyAssetRulesOk?: boolean;
  collegeType?: 'affiliated' | 'private_or_deemed_university' | 'distance';
  admissionQuota?: 'convener' | 'management_or_spot';
  class12Top20Percent?: boolean;
  aicteApproved?: boolean;
  girlsInFamilyOnPragati?: number;
}

export interface Rule {
  field: keyof Profile;
  op: Op;
  value?: string | number | string[];
  label: Label;
  orGroup?: string;
}

export interface Scheme {
  id: string;
  state: 'AP' | 'TN' | 'IN';
  name: Label;
  status: Status;
  window: { opens?: string; closes?: string; note?: Label };
  rules: Rule[];
  documents: string[];
  exclusiveWith?: string[];
  lastVerified: string | null;
  sourceUrl: string;
}

export interface DocumentType {
  id: string;
  name: Label;
  typicalDays: number | null;
}

export interface RuleOutcome {
  // For an OR-group with several members, en/te are the member labels joined with ' / '.
  label: Label;
  result: RuleResult;
}

export interface Evaluation {
  status: Verdict;
  schemeStatus: Status;
  rules: RuleOutcome[];
  missingFields: string[];
}

function checkRule(profile: Profile, rule: Rule): RuleResult {
  const v = profile[rule.field];
  if (v === undefined) return 'unknown';
  switch (rule.op) {
    case 'eq':
      return v === rule.value ? 'pass' : 'fail';
    case 'in':
      return Array.isArray(rule.value) && (rule.value as unknown[]).includes(v) ? 'pass' : 'fail';
    case 'lte':
      return typeof v === 'number' && typeof rule.value === 'number' && v <= rule.value ? 'pass' : 'fail';
    case 'gte':
      return typeof v === 'number' && typeof rule.value === 'number' && v >= rule.value ? 'pass' : 'fail';
    case 'true':
      return v === true ? 'pass' : 'fail';
  }
}

export function evaluate(profile: Profile, scheme: Scheme): Evaluation {
  // Group rules into units: a plain rule is its own unit; rules sharing an orGroup form one unit.
  const units: Rule[][] = [];
  const byGroup = new Map<string, Rule[]>();
  for (const rule of scheme.rules) {
    if (!rule.orGroup) {
      units.push([rule]);
      continue;
    }
    let group = byGroup.get(rule.orGroup);
    if (!group) {
      group = [];
      byGroup.set(rule.orGroup, group);
      units.push(group);
    }
    group.push(rule);
  }

  const outcomes: RuleOutcome[] = [];
  const missing = new Set<string>();
  for (const unit of units) {
    const results = unit.map((r) => checkRule(profile, r));
    let result: RuleResult;
    if (results.includes('pass')) result = 'pass';
    else if (results.every((r) => r === 'fail')) result = 'fail';
    else result = 'unknown';

    const label =
      unit.length === 1
        ? unit[0].label
        : {
            en: unit.map((r) => r.label.en).join(' / '),
            te: unit.map((r) => r.label.te).join(' / '),
          };
    outcomes.push({ label, result });

    // Only ask for fields that could still change the answer: an unknown unit's unknown members.
    if (result === 'unknown') {
      unit.forEach((r, i) => {
        if (results[i] === 'unknown') missing.add(r.field);
      });
    }
  }

  const anyFail = outcomes.some((o) => o.result === 'fail');
  const allPass = outcomes.every((o) => o.result === 'pass');
  const status: Verdict = anyFail ? 'not_eligible' : allPass ? 'likely' : 'check';

  return {
    status,
    schemeStatus: scheme.status,
    rules: outcomes,
    // Once a rule fails there is nothing left to ask, so no missing fields are reported.
    missingFields: anyFail ? [] : Array.from(missing),
  };
}
