/**
 * Thin wrapper around localStorage for keeping a history of reservations.
 *
 * Every call is wrapped in try/catch: localStorage throws in private browsing
 * modes and when a site's storage quota is full, and a failed "nice to have"
 * write must never break the booking flow.
 */

const STORAGE_KEY = 'littleLemonBookings';

/** @returns {object[]} previously saved bookings, or [] if none/unavailable. */
export const getBookings = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Append a booking to the saved history.
 * @returns {boolean} whether the write succeeded.
 */
export const saveBooking = (booking) => {
  try {
    const bookings = getBookings();
    bookings.push({ ...booking, savedAt: new Date().toISOString() });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return true;
  } catch {
    return false;
  }
};
