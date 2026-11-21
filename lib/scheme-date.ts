const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function latestLastVerified(schemes: { lastVerified: string | null }[]): string | null {
  let latest: string | null = null;
  for (const s of schemes) {
    const d = s.lastVerified;
    if (d && (latest === null || d > latest)) latest = d;
  }
  return latest;
}

export function formatCheckedDate(iso: string | null): string | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${m[3]} ${MONTHS[month - 1]} ${m[1]}`;
}
