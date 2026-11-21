import { describe, it, expect, vi, afterEach } from 'vitest';
import { loadTracker, saveTracker, clearTracker, daysRemaining } from '../lib/storage/tracker';
import type { TrackedApplication } from '../lib/types';

function fakeWindow() {
  const map = new Map<string, string>();
  return {
    localStorage: {
      getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
      setItem: (k: string, v: string) => {
        map.set(k, v);
      },
      removeItem: (k: string) => {
        map.delete(k);
      },
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('tracker storage', () => {
  it('round-trips an entry through localStorage', () => {
    vi.stubGlobal('window', fakeWindow());
    const entry: TrackedApplication = {
      schemeId: 'in-pm-usp-csss',
      status: 'applied',
      appliedOn: '2026-06-01',
      note: 'submitted',
    };
    saveTracker(entry);
    expect(loadTracker()).toEqual({ 'in-pm-usp-csss': entry });
    clearTracker();
    expect(loadTracker()).toEqual({});
  });

  it('loadTracker returns {} when there is no window', () => {
    vi.stubGlobal('window', undefined);
    expect(loadTracker()).toEqual({});
  });
});

describe('daysRemaining', () => {
  const today = new Date(2026, 5, 10);

  it('future date is positive', () => {
    expect(daysRemaining('2026-06-15', today)).toBe(5);
  });

  it('today is zero', () => {
    expect(daysRemaining('2026-06-10', today)).toBe(0);
  });

  it('past date is negative', () => {
    expect(daysRemaining('2026-06-01', today)).toBe(-9);
  });

  it('unparseable date is NaN', () => {
    expect(daysRemaining('bad', today)).toBeNaN();
  });
});
