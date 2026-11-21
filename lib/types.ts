// Types for Haq Sahayak. Source of truth: SPEC.md §6.

export type Sector = "education" | "agriculture" | "health";
// "unknown" = we could not confirm the application window on an official page.
// The UI shows "Check dates on the official portal" and never claims open or closed.
export type Status = "open" | "closed" | "paused" | "unknown";

export type Bilingual = { en: string; te: string; ta?: string };

export interface Profile {
  state?: "AP";
  stage?:
    | "class1to8"
    | "class9to10"
    | "inter"
    | "iti"
    | "diploma"
    | "ug"
    | "pg"
    | "professional";
  category?: "SC" | "ST" | "BC" | "EBC" | "Kapu" | "Minority" | "OC";
  gender?: "female" | "male" | "other";
  disability?: boolean;
  incomeBand?: "lt1L" | "1to2_5L" | "2_5to4_5L" | "gt4_5L";
  residence?: "day" | "hostel";
  attendance75?: boolean;
  childrenInClass1to12?: number;
  familyAssetRulesOk?: boolean;
  collegeType?: "affiliated" | "private_or_deemed_university" | "distance";
  admissionQuota?: "convener" | "management_or_spot";
  class12Top20Percent?: boolean;
  aicteApproved?: boolean;
  // Number of girls in the family on Pragati, counting this student. Rule: at most 2.
  girlsInFamilyOnPragati?: number;
}

export interface Rule {
  field: keyof Profile;
  op: "eq" | "in" | "lte" | "gte" | "true";
  value?: string | number | string[];
  label: { en: string; te: string };
  // Rules that share the same orGroup pass if ANY of them passes.
  // Rules with no orGroup must all pass (AND). Added for "category OR disability".
  orGroup?: string;
}

export interface Scheme {
  id: string;
  sector: Sector;
  state: "AP" | "TN" | "IN";
  name: Bilingual;
  formerNames?: string[];
  benefit: Bilingual;
  paidTo: "student" | "mother" | "college";
  portalName: string;
  sourceUrl: string;
  lastVerified: string | null;
  window: { opens?: string; closes?: string; note?: { en: string; te: string } };
  status: Status;
  rules: Rule[];
  documents: string[];
  exclusiveWith?: string[];
  notStated?: { en: string; te: string }[];
  applySteps: { en: string[]; te: string[] };
}

export interface DocumentType {
  id: string;
  name: { en: string; te: string };
  issuedBy: { en: string; te: string };
  typicalDays: number | null;
  tip?: { en: string; te: string };
}

export interface TrackedApplication {
  schemeId: string;
  status: "not_started" | "applied" | "approved" | "rejected";
  appliedOn?: string;
  note?: string;
}

