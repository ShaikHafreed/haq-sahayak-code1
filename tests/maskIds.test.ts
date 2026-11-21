import { describe, it, expect } from 'vitest';
import { maskIds } from '../lib/privacy/maskIds';

describe('maskIds', () => {
  it('masks a spaced Aadhaar-style 4-4-4 number', () => {
    const out = maskIds('my aadhaar 1234 5678 9012 is here');
    expect(out).not.toContain('1234');
    expect(out).not.toContain('9012');
    expect(out).toContain('••••');
  });

  it('masks runs of 10+ digits and leaves short numbers alone', () => {
    const out = maskIds('account 123456789012 and note');
    expect(out).not.toContain('123456789012');
    expect(out).toContain('••••');
    expect(maskIds('class 10 marks 95')).toBe('class 10 marks 95');
  });
});
