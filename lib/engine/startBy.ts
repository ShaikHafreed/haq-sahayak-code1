// Start-by date (SPEC §7): closeDate − max(typicalDays of documents not yet ready, ignoring null) − 5 days.
// All date arithmetic is in UTC on ISO dates (YYYY-MM-DD).

import type { DocumentType } from '../types';

export interface StartByResult {
  startBy: string | null; // null when there is no close date or no known typical days
  longestDays: number | null; // longest known typicalDays among not-ready documents
}

const DAY_MS = 86_400_000;

export function startBy(
  closeDate: string | null,
  documentIds: string[],
  readyIds: string[],
  documents: DocumentType[],
): StartByResult {
  const ready = new Set(readyIds);
  const wanted = new Set(documentIds);
  const days = documents
    .filter((d) => wanted.has(d.id) && !ready.has(d.id) && typeof d.typicalDays === 'number')
    .map((d) => d.typicalDays as number);
  const longestDays = days.length > 0 ? Math.max(...days) : null;

  if (closeDate === null || longestDays === null) return { startBy: null, longestDays };

  const close = Date.parse(`${closeDate}T00:00:00Z`);
  if (Number.isNaN(close)) return { startBy: null, longestDays };

  const start = new Date(close - (longestDays + 5) * DAY_MS);
  return { startBy: start.toISOString().slice(0, 10), longestDays };
}
