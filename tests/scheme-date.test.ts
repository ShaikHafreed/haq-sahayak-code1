import { describe, it, expect } from 'vitest';
import { latestLastVerified, formatCheckedDate } from '../lib/scheme-date';
import { getSchemes } from '../lib/data';

describe('latestLastVerified', () => {
  it('returns null for an empty list', () => {
    expect(latestLastVerified([])).toBeNull();
  });

  it('returns null when every lastVerified is null', () => {
    expect(latestLastVerified([{ lastVerified: null }, { lastVerified: null }])).toBeNull();
  });

  it('returns the latest non-null date and ignores nulls', () => {
    const list = [
      { lastVerified: '2026-01-10' },
      { lastVerified: null },
      { lastVerified: '2026-11-21' },
      { lastVerified: '2026-03-05' },
    ];
    expect(latestLastVerified(list)).toBe('2026-11-21');
  });

  it('works on the real scheme data without a hardcoded date', () => {
    const result = latestLastVerified(getSchemes());
    expect(result).not.toBeNull();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('formatCheckedDate', () => {
  it('formats an ISO date as day, short month, year', () => {
    expect(formatCheckedDate('2026-11-21')).toBe('21 Nov 2026');
  });

  it('returns null for null input', () => {
    expect(formatCheckedDate(null)).toBeNull();
  });

  it('returns null for a malformed date', () => {
    expect(formatCheckedDate('not-a-date')).toBeNull();
  });
});
