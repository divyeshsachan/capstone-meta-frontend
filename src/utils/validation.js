/**
 * Booking form validation.
 *
 * Every rule lives here as a pure function so it can be unit tested in isolation
 * and reused by both the live (on-blur) validation and the final submit check.
 * Each validator returns an error string, or an empty string when the value is valid.
 */

import { getTodayString } from './bookingReducer';

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 10;
export const MAX_REQUEST_LENGTH = 250;
/** The restaurant only takes reservations up to 12 months ahead. */
export const MAX_DAYS_AHEAD = 365;

export const OCCASIONS = ['Birthday', 'Anniversary', 'Engagement', 'Business meal', 'Other'];
export const SEATING_OPTIONS = ['Indoor', 'Outdoor'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
// Accepts international formats: +234 803 123 4567, (312) 555-0100, 08031234567.
// Only the allowed *characters* are checked here; length is checked separately by
// counting digits, so "12345" gets a "too short" message rather than a generic one.
const PHONE_PATTERN = /^\+?[\d\s()-]+$/;
const NAME_PATTERN = /^[a-zÀ-ɏ' -]+$/i;

export const validateName = (value) => {
  const name = (value || '').trim();
  if (!name) return 'Please enter the name for the reservation.';
  if (name.length < 2) return 'Name must be at least 2 characters long.';
  if (name.length > 60) return 'Name must be 60 characters or fewer.';
  if (!NAME_PATTERN.test(name)) return 'Name can only contain letters, spaces, hyphens and apostrophes.';
  return '';
};

export const validateEmail = (value) => {
  const email = (value || '').trim();
  if (!email) return 'Please enter an email address so we can send your confirmation.';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address, for example name@example.com.';
  return '';
};

export const validatePhone = (value) => {
  const phone = (value || '').trim();
  if (!phone) return 'Please enter a phone number in case we need to reach you.';
  if (!PHONE_PATTERN.test(phone)) return 'Enter a valid phone number, digits only with optional +, spaces or dashes.';
  const digitCount = phone.replace(/\D/g, '').length;
  if (digitCount < 7) return 'Phone number looks too short — please include the area code.';
  if (digitCount > 15) return 'Phone number looks too long — please check it.';
  return '';
};

export const validateDate = (value) => {
  if (!value) return 'Please choose a date for your reservation.';

  const chosen = new Date(`${value}T00:00:00`);
  if (Number.isNaN(chosen.getTime())) return 'That date is not valid. Please pick another.';

  const today = new Date(`${getTodayString()}T00:00:00`);
  if (chosen < today) return 'Reservations cannot be made in the past. Please choose today or a later date.';

  const latest = new Date(today);
  latest.setDate(latest.getDate() + MAX_DAYS_AHEAD);
  if (chosen > latest) return 'We only accept reservations up to 12 months in advance.';

  return '';
};

/**
 * @param {string} value - the chosen time
 * @param {string[]} availableTimes - times currently offered for the chosen date
 */
export const validateTime = (value, availableTimes = []) => {
  if (!value) return 'Please select a time.';
  if (availableTimes.length && !availableTimes.includes(value)) {
    return 'That time is no longer available for this date. Please choose another slot.';
  }
  return '';
};

export const validateGuests = (value) => {
  if (value === '' || value === null || value === undefined) return 'Please tell us how many guests are coming.';

  const guests = Number(value);
  if (!Number.isInteger(guests)) return 'Number of guests must be a whole number.';
  if (guests < MIN_GUESTS) return `A reservation needs at least ${MIN_GUESTS} guest.`;
  if (guests > MAX_GUESTS) {
    return `We can seat up to ${MAX_GUESTS} guests online — please call us on (312) 555-0100 for larger parties.`;
  }
  return '';
};

export const validateOccasion = (value) => {
  if (!value) return 'Please choose an occasion.';
  if (!OCCASIONS.includes(value)) return 'Please choose one of the listed occasions.';
  return '';
};

export const validateSeating = (value) => {
  if (!value) return 'Please choose indoor or outdoor seating.';
  if (!SEATING_OPTIONS.includes(value)) return 'Please choose one of the listed seating options.';
  return '';
};

export const validateRequests = (value) => {
  const requests = value || '';
  if (requests.length > MAX_REQUEST_LENGTH) {
    return `Special requests must be ${MAX_REQUEST_LENGTH} characters or fewer.`;
  }
  return '';
};

/**
 * Validate the whole form at once.
 * @returns {object} a map of field name -> error message (only invalid fields appear)
 */
export const validateBookingForm = (values, availableTimes = []) => {
  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    phone: validatePhone(values.phone),
    date: validateDate(values.date),
    time: validateTime(values.time, availableTimes),
    guests: validateGuests(values.guests),
    occasion: validateOccasion(values.occasion),
    seating: validateSeating(values.seating),
    requests: validateRequests(values.requests),
  };

  // Strip the empty strings so callers can simply check Object.keys(errors).length
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message !== ''));
};

/** Convenience helper used by the submit button's disabled state. */
export const isBookingFormValid = (values, availableTimes = []) =>
  Object.keys(validateBookingForm(values, availableTimes)).length === 0;
