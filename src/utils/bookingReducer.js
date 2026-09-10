import { fetchAPI } from './api';

/**
 * State management for the list of bookable times.
 *
 * The available times depend on the date the customer picks, so they are held in
 * a reducer rather than plain state: `initializeTimes` seeds today's slots and
 * `updateTimes` recalculates whenever the date changes. Keeping this logic in its
 * own module means it can be unit tested without rendering any components.
 */

/** Returns today's date as a YYYY-MM-DD string in the user's local timezone. */
export const getTodayString = () => {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offsetMinutes * 60 * 1000);
  return local.toISOString().split('T')[0];
};

/**
 * Initial state for the reducer: the times available today.
 * @returns {{ availableTimes: string[] }}
 */
export const initializeTimes = () => ({
  availableTimes: fetchAPI(getTodayString()),
});

/**
 * Reducer for available times.
 * @param {{ availableTimes: string[] }} state
 * @param {{ type: string, date?: string }} action
 */
export const updateTimes = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TIMES':
      // An empty or cleared date input should not wipe the dropdown; fall back to
      // today's availability so the form always has something selectable.
      return { availableTimes: fetchAPI(action.date || getTodayString()) };
    case 'RESET_TIMES':
      return initializeTimes();
    default:
      return state;
  }
};
