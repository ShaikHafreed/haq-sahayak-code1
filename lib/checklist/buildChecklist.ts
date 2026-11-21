// Checklist logic (SPEC §4, §7, §9–§11). Pure: no React, no storage.
import { getDocuments } from "../data";
import { evaluate, type Verdict } from "../engine/evaluate";
import { startBy } from "../engine/startBy";
import type { Bilingual, DocumentType, Profile, Scheme } from "../types";

export interface ChecklistItem {
  document: DocumentType;
  schemes: { id: string; name: Bilingual }[];
}

const ELIGIBLE: Verdict[] = ["likely", "check"];

function eligibleSchemes(schemes: Scheme[], profile: Profile): Scheme[] {
  return schemes.filter((s) => ELIGIBLE.includes(evaluate(profile, s).status));
}

// Unique documents from likely/check schemes, each with the schemes that need it.
// Document ids that are not in data/documents.json are skipped, never invented.
export function mergeDocuments(schemes: Scheme[], profile: Profile): ChecklistItem[] {
  const byId = new Map(getDocuments().map((d) => [d.id, d]));
  const items = new Map<string, ChecklistItem>();
  for (const scheme of eligibleSchemes(schemes, profile)) {
    for (const docId of scheme.documents) {
      const document = byId.get(docId);
      if (!document) continue;
      let item = items.get(docId);
      if (!item) {
        item = { document, schemes: [] };
        items.set(docId, item);
      }
      if (!item.schemes.some((s) => s.id === scheme.id)) {
        item.schemes.push({ id: scheme.id, name: scheme.name });
      }
    }
  }
  return Array.from(items.values());
}

// Longest typical time first; documents with no typical time go last.
export function sortDocuments(items: ChecklistItem[]): ChecklistItem[] {
  return [...items].sort((a, b) => {
    const da = a.document.typicalDays;
    const db = b.document.typicalDays;
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return db - da;
  });
}

// Earliest start-by date across likely/check schemes whose close date is after `today` (YYYY-MM-DD).
export function earliestStartBy(
  schemes: Scheme[],
  profile: Profile,
  tickedIds: string[],
  documents: DocumentType[],
  today: string,
): string | null {
  let earliest: string | null = null;
  for (const scheme of eligibleSchemes(schemes, profile)) {
    const closes = scheme.window.closes;
    if (!closes || closes <= today) continue;
    const { startBy: date } = startBy(closes, scheme.documents, tickedIds, documents);
    if (date !== null && (earliest === null || date < earliest)) earliest = date;
  }
  return earliest;
}
