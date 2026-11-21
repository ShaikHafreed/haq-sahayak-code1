// Profile storage: localStorage only. No server calls, no fetch.
import type { Profile } from "../types";

export const PROFILE_KEY = "haq.profile";

export function loadProfile(): Profile {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Profile;
  } catch {
    return {};
  }
}

export function saveProfile(p: Profile): void {
  if (typeof window === "undefined") return;
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(p)) {
    if (value !== undefined) clean[key] = value;
  }
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(clean));
  } catch {
    // Storage full or blocked: the wizard keeps working in memory.
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    // Nothing to clear if storage is blocked.
  }
}
