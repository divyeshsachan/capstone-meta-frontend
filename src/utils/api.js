/**
 * Mock restaurant booking API.
 *
 * In production these two functions would be network requests to the Little Lemon
 * backend. For the capstone they are simulated locally so the app is fully
 * functional offline and the unit tests stay deterministic.
 *
 * `fetchAPI` returns a *stable* list of times for a given date: the same date
 * always produces the same availability, which is what a real booking system
 * would do and what makes the UI testable.
 */

// All slots the restaurant could theoretically offer on any given day.
const ALL_TIME_SLOTS = [
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
];

/**
 * Small deterministic pseudo-random generator.
 * Given the same seed it always yields the same sequence, so availability for a
 * particular date never changes between renders or test runs.
 */
const seededRandom = (seed) => {
  const m = 2 ** 35 - 31;
  const a = 185852;
  let s = seed % m;
  return () => {
    s = (s * a) % m;
    return s / m;
  };
};

/**
 * Turn a date string ("2026-09-24") into a numeric seed.
 * Falls back to 0 for an empty/invalid value so callers never crash.
 */
const seedFromDate = (dateString) => {
  if (!dateString) return 0;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 0;
  return date.getDate() + date.getFullYear() * (date.getMonth() + 1);
};

/**
 * Fetch the available booking times for a date.
 * @param {string} dateString - date in YYYY-MM-DD format.
 * @returns {string[]} available times, e.g. ['17:00', '18:30', ...]
 */
export const fetchAPI = (dateString) => {
  const random = seededRandom(seedFromDate(dateString));
  const available = ALL_TIME_SLOTS.filter(() => random() < 0.6);

  // Edge case: a fully booked day would leave the customer with an empty select
  // and no explanation, so guarantee at least two slots and let the UI show a
  // "limited availability" note instead.
  return available.length >= 2 ? available : ALL_TIME_SLOTS.slice(0, 3);
};

/**
 * Submit a booking.
 * @param {object} formData - the completed booking form values.
 * @returns {boolean} true when the reservation was accepted.
 */
export const submitAPI = (formData) => {
  // A real endpoint would reject malformed payloads, so mirror that here: the
  // form should never be able to submit without these four fields.
  if (!formData || !formData.date || !formData.time || !formData.guests) {
    return false;
  }
  return true;
};

export { ALL_TIME_SLOTS };
