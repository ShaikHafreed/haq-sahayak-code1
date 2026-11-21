// Application tracker storage: localStorage only. No server calls, no fetch.
import type { TrackedApplication } from "../types";
import { maskIds } from "../privacy/maskIds";

export const TRACKER_KEY = "haq.tracker";

export function loadTracker(): Record<string, TrackedApplication> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(TRACKER_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, TrackedApplication>;
  } catch {
    return {};
  }
}

export function saveTracker(entry: TrackedApplication): void {
  if (typeof window === "undefined") return;
  const all = loadTracker();
  const stored: TrackedApplication =
    entry.note === undefined ? entry : { ...entry, note: maskIds(entry.note) };
  all[entry.schemeId] = stored;
  try {
    window.localStorage.setItem(TRACKER_KEY, JSON.stringify(all));
  } catch {
    // Storage full or blocked: the tracker keeps working in memory.
  }
}

export function clearTracker(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TRACKER_KEY);
  } catch {
    // Nothing to clear if storage is blocked.
  }
}

// Days from today (local calendar date) to closeDate ('YYYY-MM-DD').
// Future = positive, today = 0, past = negative, unparseable = NaN.
export function daysRemaining(closeDate: string, today: Date): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(closeDate);
  if (!m) return NaN;
  const close = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((close - now) / 86400000);
}
