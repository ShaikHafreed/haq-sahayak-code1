// SPEC §9.2: strips ID-like numbers before text is stored.
export function maskIds(text: string): string {
  return text
    .replace(/\b\d{4}[ -]\d{4}[ -]\d{4}\b/g, "••••")
    .replace(/\d{10,}/g, "••••");
}
