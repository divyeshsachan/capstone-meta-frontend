import { describe, expect, it } from 'vitest';
import {
  isBookingFormValid,
  validateBookingForm,
  validateDate,
  validateEmail,
  validateGuests,
  validateName,
  validateOccasion,
  validatePhone,
  validateRequests,
  validateSeating,
  validateTime,
} from '../utils/validation';
import { getTodayString } from '../utils/bookingReducer';

/** Helper: a date n days from today as YYYY-MM-DD. */
const dateOffsetBy = (days) => {
  const date = new Date(`${getTodayString()}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const validValues = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '(312) 555-0100',
  date: dateOffsetBy(3),
  time: '19:00',
  guests: 4,
  occasion: 'Birthday',
  seating: 'Indoor',
  requests: '',
};

describe('validateName', () => {
  it('accepts a normal name', () => {
    expect(validateName('Ada Lovelace')).toBe('');
  });

  it('accepts hyphens, apostrophes and accents', () => {
    expect(validateName("Anne-Marie O'Brien")).toBe('');
    expect(validateName('Tomás Rodríguez')).toBe('');
  });

  it('rejects an empty name', () => {
    expect(validateName('')).toMatch(/enter the name/i);
    expect(validateName('   ')).toMatch(/enter the name/i);
  });

  it('rejects a single character', () => {
    expect(validateName('A')).toMatch(/at least 2 characters/i);
  });

  it('rejects digits and symbols', () => {
    expect(validateName('Table 4')).toMatch(/only contain letters/i);
  });
});

describe('validateEmail', () => {
  it('accepts a valid address', () => {
    expect(validateEmail('ada@example.com')).toBe('');
  });

  it.each(['ada', 'ada@', 'ada@example', 'ada example.com', 'ada@@example.com'])(
    'rejects the malformed address %s',
    (email) => {
      expect(validateEmail(email)).not.toBe('');
    }
  );

  it('explains what is missing when empty', () => {
    expect(validateEmail('')).toMatch(/confirmation/i);
  });
});

describe('validatePhone', () => {
  it.each(['(312) 555-0100', '+234 803 123 4567', '08031234567'])('accepts %s', (phone) => {
    expect(validatePhone(phone)).toBe('');
  });

  it('rejects letters', () => {
    expect(validatePhone('call me')).toMatch(/valid phone number/i);
  });

  it('rejects a number that is too short', () => {
    expect(validatePhone('12345')).toMatch(/too short/i);
  });

  it('rejects a number that is too long', () => {
    expect(validatePhone('1234567890123456789')).toMatch(/too long/i);
  });
});

describe('validateDate', () => {
  it('accepts today', () => {
    expect(validateDate(getTodayString())).toBe('');
  });

  it('accepts a date later this year', () => {
    expect(validateDate(dateOffsetBy(30))).toBe('');
  });

  it('rejects yesterday with a clear message', () => {
    expect(validateDate(dateOffsetBy(-1))).toMatch(/cannot be made in the past/i);
  });

  it('rejects a date more than 12 months ahead', () => {
    expect(validateDate(dateOffsetBy(400))).toMatch(/12 months/i);
  });

  it('rejects an empty date', () => {
    expect(validateDate('')).toMatch(/choose a date/i);
  });

  it('rejects an unparseable date', () => {
    expect(validateDate('not-a-date')).not.toBe('');
  });
});

describe('validateTime', () => {
  it('accepts a time that is on offer', () => {
    expect(validateTime('19:00', ['18:00', '19:00'])).toBe('');
  });

  it('rejects an empty time', () => {
    expect(validateTime('', ['19:00'])).toMatch(/select a time/i);
  });

  it('rejects a time that is no longer available', () => {
    expect(validateTime('23:30', ['18:00', '19:00'])).toMatch(/no longer available/i);
  });
});

describe('validateGuests', () => {
  it('accepts a party within range', () => {
    expect(validateGuests(1)).toBe('');
    expect(validateGuests(10)).toBe('');
    expect(validateGuests('6')).toBe('');
  });

  it('rejects zero and negative numbers', () => {
    expect(validateGuests(0)).toMatch(/at least 1 guest/i);
    expect(validateGuests(-3)).toMatch(/at least 1 guest/i);
  });

  it('rejects more than 10 guests and points to the phone number', () => {
    expect(validateGuests(11)).toMatch(/555-0100/);
  });

  it('rejects fractions', () => {
    expect(validateGuests(2.5)).toMatch(/whole number/i);
  });

  it('rejects an empty value', () => {
    expect(validateGuests('')).toMatch(/how many guests/i);
  });
});

describe('validateOccasion and validateSeating', () => {
  it('accept listed options', () => {
    expect(validateOccasion('Birthday')).toBe('');
    expect(validateSeating('Outdoor')).toBe('');
  });

  it('reject unlisted options', () => {
    expect(validateOccasion('Coronation')).not.toBe('');
    expect(validateSeating('Rooftop')).not.toBe('');
  });

  it('reject empty values', () => {
    expect(validateOccasion('')).toMatch(/choose an occasion/i);
    expect(validateSeating('')).toMatch(/indoor or outdoor/i);
  });
});

describe('validateRequests', () => {
  it('accepts an empty value because the field is optional', () => {
    expect(validateRequests('')).toBe('');
  });

  it('accepts a short note', () => {
    expect(validateRequests('Nut allergy, please.')).toBe('');
  });

  it('rejects a note over the character limit', () => {
    expect(validateRequests('x'.repeat(251))).toMatch(/250 characters or fewer/i);
  });
});

describe('validateBookingForm', () => {
  it('returns no errors for a complete, valid booking', () => {
    expect(validateBookingForm(validValues, ['19:00'])).toEqual({});
    expect(isBookingFormValid(validValues, ['19:00'])).toBe(true);
  });

  it('collects one message per invalid field', () => {
    const errors = validateBookingForm(
      { ...validValues, name: '', email: 'nope', guests: 99 },
      ['19:00']
    );

    expect(Object.keys(errors)).toEqual(['name', 'email', 'guests']);
  });

  it('reports every required field on a blank form', () => {
    const errors = validateBookingForm({}, []);

    // requests is optional, so it must not appear.
    expect(Object.keys(errors).sort()).toEqual(
      ['date', 'email', 'guests', 'name', 'occasion', 'phone', 'seating', 'time'].sort()
    );
    expect(isBookingFormValid({}, [])).toBe(false);
  });
});
