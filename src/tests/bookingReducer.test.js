import { describe, expect, it } from 'vitest';
import { getTodayString, initializeTimes, updateTimes } from '../utils/bookingReducer';
import { fetchAPI } from '../utils/api';

describe('initializeTimes', () => {
  it('returns the available times for today', () => {
    const state = initializeTimes();

    expect(state).toHaveProperty('availableTimes');
    expect(Array.isArray(state.availableTimes)).toBe(true);
    expect(state.availableTimes.length).toBeGreaterThan(0);
    // Must match what the API reports for today, not a hard-coded list.
    expect(state.availableTimes).toEqual(fetchAPI(getTodayString()));
  });

  it('returns times in HH:MM format', () => {
    initializeTimes().availableTimes.forEach((time) => {
      expect(time).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});

describe('updateTimes', () => {
  const initialState = { availableTimes: ['17:00'] };

  it('returns the times provided by the API for the dispatched date', () => {
    const result = updateTimes(initialState, { type: 'UPDATE_TIMES', date: '2026-10-15' });

    expect(result.availableTimes).toEqual(fetchAPI('2026-10-15'));
  });

  it('is deterministic: the same date always gives the same times', () => {
    const first = updateTimes(initialState, { type: 'UPDATE_TIMES', date: '2026-11-20' });
    const second = updateTimes(initialState, { type: 'UPDATE_TIMES', date: '2026-11-20' });

    expect(first.availableTimes).toEqual(second.availableTimes);
  });

  it('gives different dates their own availability', () => {
    const dates = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05'];
    const results = dates.map((date) => updateTimes(initialState, { type: 'UPDATE_TIMES', date }).availableTimes.join());

    // Availability is date-dependent, so not every day should be identical.
    expect(new Set(results).size).toBeGreaterThan(1);
  });

  it("falls back to today's times when the date is empty", () => {
    const result = updateTimes(initialState, { type: 'UPDATE_TIMES', date: '' });

    expect(result.availableTimes).toEqual(fetchAPI(getTodayString()));
  });

  it('resets to the initial times on RESET_TIMES', () => {
    const result = updateTimes({ availableTimes: [] }, { type: 'RESET_TIMES' });

    expect(result.availableTimes).toEqual(initializeTimes().availableTimes);
  });

  it('returns the state unchanged for an unknown action', () => {
    const result = updateTimes(initialState, { type: 'SOMETHING_ELSE' });

    expect(result).toBe(initialState);
  });
});

describe('getTodayString', () => {
  it("returns today's date as YYYY-MM-DD", () => {
    expect(getTodayString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
