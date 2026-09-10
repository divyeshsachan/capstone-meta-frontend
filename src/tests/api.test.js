import { describe, expect, it } from 'vitest';
import { ALL_TIME_SLOTS, fetchAPI, submitAPI } from '../utils/api';

describe('fetchAPI', () => {
  it('returns only times the restaurant actually offers', () => {
    fetchAPI('2026-09-24').forEach((time) => {
      expect(ALL_TIME_SLOTS).toContain(time);
    });
  });

  it('never returns fewer than two slots, so the dropdown is never empty', () => {
    // Sample a month of dates to be sure the fallback holds.
    for (let day = 1; day <= 28; day += 1) {
      const date = `2026-09-${String(day).padStart(2, '0')}`;
      expect(fetchAPI(date).length).toBeGreaterThanOrEqual(2);
    }
  });

  it('is stable for a given date', () => {
    expect(fetchAPI('2026-12-31')).toEqual(fetchAPI('2026-12-31'));
  });

  it('handles a missing or invalid date without throwing', () => {
    expect(() => fetchAPI('')).not.toThrow();
    expect(() => fetchAPI('banana')).not.toThrow();
    expect(fetchAPI('').length).toBeGreaterThan(0);
  });
});

describe('submitAPI', () => {
  const booking = { date: '2026-09-24', time: '19:00', guests: 4 };

  it('accepts a complete booking', () => {
    expect(submitAPI(booking)).toBe(true);
  });

  it('rejects a booking with missing details', () => {
    expect(submitAPI({ ...booking, time: '' })).toBe(false);
    expect(submitAPI({ ...booking, date: '' })).toBe(false);
    expect(submitAPI({ ...booking, guests: 0 })).toBe(false);
    expect(submitAPI(undefined)).toBe(false);
  });
});
