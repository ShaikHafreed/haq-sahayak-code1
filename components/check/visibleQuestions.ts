// Pure visibility rules for the /check wizard: profile -> ordered question keys.
import type { Profile } from "../../lib/types";

export type QuestionKey =
  | "stage"
  | "category"
  | "gender"
  | "disability"
  | "incomeBand"
  | "familyAssetRulesOk"
  | "childrenInClass1to12"
  | "girlsInFamilyOnPragati"
  | "residence"
  | "collegeType"
  | "admissionQuota"
  | "attendance75"
  | "class12Top20Percent"
  | "aicteApproved";

export const ALL_QUESTION_KEYS: QuestionKey[] = [
  "stage",
  "category",
  "gender",
  "disability",
  "incomeBand",
  "familyAssetRulesOk",
  "childrenInClass1to12",
  "girlsInFamilyOnPragati",
  "residence",
  "collegeType",
  "admissionQuota",
  "attendance75",
  "class12Top20Percent",
  "aicteApproved",
];

const COLLEGE_STAGES: string[] = ["iti", "diploma", "ug", "pg", "professional"];
const PRAGATI_STAGES: string[] = ["diploma", "ug", "professional"];
const SCHOOL_OR_PARENT_STAGES: string[] = ["class1to8", "class9to10", "inter"];

export function visibleQuestions(p: Profile): QuestionKey[] {
  const keys: QuestionKey[] = [
    "stage",
    "category",
    "gender",
    "disability",
    "incomeBand",
    "familyAssetRulesOk",
  ];
  const stage = p.stage;
  const isCollege = stage !== undefined && COLLEGE_STAGES.includes(stage);

  if (stage === undefined || SCHOOL_OR_PARENT_STAGES.includes(stage)) {
    keys.push("childrenInClass1to12");
  }
  if (p.gender === "female" && stage !== undefined && PRAGATI_STAGES.includes(stage)) {
    keys.push("girlsInFamilyOnPragati");
  }
  if (isCollege) {
    keys.push(
      "residence",
      "collegeType",
      "admissionQuota",
      "attendance75",
      "class12Top20Percent",
      "aicteApproved",
    );
  }
  return keys;
}
