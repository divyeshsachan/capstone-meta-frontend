import { useMemo, useRef, useState } from 'react';
import {
  MAX_GUESTS,
  MAX_REQUEST_LENGTH,
  MIN_GUESTS,
  OCCASIONS,
  SEATING_OPTIONS,
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
import '../styles/booking.css';

/**
 * Table reservation form.
 *
 * Validation strategy:
 *  - a field is validated when the visitor leaves it (onBlur) and, once it has an
 *    error, on every keystroke so the message clears as soon as the value is fixed;
 *  - the whole form is validated again on submit, and an error summary is focused
 *    so keyboard and screen-reader users are told what went wrong;
 *  - the submit button is disabled while the form is invalid, and every invalid
 *    field is linked to its message with aria-describedby + aria-invalid.
 *
 * @param {object} props
 * @param {string[]} props.availableTimes - times bookable on the selected date
 * @param {Function} props.dispatch - dispatch for the available-times reducer
 * @param {Function} props.onSubmit - called with the booking when the API accepts it
 */
const INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: '2',
  occasion: '',
  seating: 'Indoor',
  requests: '',
};

// Field order drives the order of messages in the error summary.
const FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone number',
  date: 'Date',
  time: 'Time',
  guests: 'Number of guests',
  occasion: 'Occasion',
  seating: 'Seating',
  requests: 'Special requests',
};

const BookingForm = ({ availableTimes = [], dispatch, onSubmit }) => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // The error summary is only shown once the visitor has tried to submit, so the
  // form does not shout at someone who is still filling it in.
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const summaryRef = useRef(null);
  const today = useMemo(() => getTodayString(), []);

  /** Validate one field in isolation. */
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'date':
        return validateDate(value);
      case 'time':
        return validateTime(value, availableTimes);
      case 'guests':
        return validateGuests(value);
      case 'occasion':
        return validateOccasion(value);
      case 'seating':
        return validateSeating(value);
      case 'requests':
        return validateRequests(value);
      default:
        return '';
    }
  };

  const setFieldError = (field, message) => {
    setErrors((previous) => {
      const next = { ...previous };
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };

    // Changing the date changes what is bookable, so ask the reducer for the new
    // slots and drop a previously chosen time that may no longer be offered.
    if (name === 'date') {
      nextValues.time = '';
      dispatch({ type: 'UPDATE_TIMES', date: value });
    }

    setValues(nextValues);
    setSubmitError('');

    // Re-validate as the visitor types, but only for a field already showing an
    // error — validating untouched fields on the first keystroke is hostile.
    if (touched[name] || errors[name]) {
      setFieldError(name, validateField(name, value));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
    setFieldError(name, validateField(name, value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const formErrors = validateBookingForm(values, availableTimes);
    setErrors(formErrors);
    setTouched(Object.keys(FIELD_LABELS).reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    if (Object.keys(formErrors).length > 0) {
      // Move focus to the summary so the problem is announced immediately.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setIsSubmitting(true);
    const booking = { ...values, guests: Number(values.guests) };
    const accepted = onSubmit(booking);
    setIsSubmitting(false);

    if (!accepted) {
      // The API rejected the reservation — tell the visitor rather than failing silently.
      setSubmitError(
        'Sorry, we could not confirm your reservation just now. Please try again, or call us on (312) 555-0100.'
      );
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  };

  const errorList = Object.keys(FIELD_LABELS).filter((field) => errors[field]);
  const hasErrors = errorList.length > 0;
  const isValid = Object.keys(validateBookingForm(values, availableTimes)).length === 0;

  /** Shared props for an input: wires up its error message and invalid state. */
  const fieldProps = (field) => ({
    id: field,
    name: field,
    value: values[field],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': errors[field] ? 'true' : 'false',
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  /** The inline error message for a field, if any. */
  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="field__error" id={`${field}-error`}>
        <span aria-hidden="true">⚠ </span>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate aria-labelledby="booking-heading">
      {/* Error summary. role="alert" makes screen readers announce it as soon as
          it appears; tabIndex allows focus to be moved here programmatically. */}
      {((hasAttemptedSubmit && hasErrors) || submitError) && (
        <div className="booking-form__summary" role="alert" tabIndex={-1} ref={summaryRef}>
          {submitError ? (
            <p className="booking-form__summary-title">{submitError}</p>
          ) : (
            <>
              <p className="booking-form__summary-title">
                {`There ${errorList.length === 1 ? 'is 1 problem' : `are ${errorList.length} problems`} with your reservation:`}
              </p>
              <ul>
                {errorList.map((field) => (
                  <li key={field}>
                    <a href={`#${field}`}>
                      {FIELD_LABELS[field]}: {errors[field]}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <fieldset className="booking-form__fieldset">
        <legend className="booking-form__legend">Reservation details</legend>

        <div className="field">
          <label className="field__label" htmlFor="date">
            Choose date <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <input className="field__input" type="date" min={today} required {...fieldProps('date')} />
          <FieldError field="date" />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="time">
            Choose time <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <select className="field__input" required {...fieldProps('time')}>
            <option value="">Select a time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {/* Edge case: a nearly-full day gets an explanation instead of a short,
              unexplained list of times. */}
          {availableTimes.length > 0 && availableTimes.length <= 3 && !errors.time && (
            <p className="field__hint" id="time-hint">
              Only {availableTimes.length} slots left on this date. Try another day for more options.
            </p>
          )}
          <FieldError field="time" />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="guests">
            Number of guests <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <input
            className="field__input"
            type="number"
            min={MIN_GUESTS}
            max={MAX_GUESTS}
            step="1"
            required
            {...fieldProps('guests')}
          />
          <FieldError field="guests" />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="occasion">
            Occasion <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <select className="field__input" required {...fieldProps('occasion')}>
            <option value="">Select an occasion</option>
            {OCCASIONS.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
          <FieldError field="occasion" />
        </div>

        {/* Radio groups need their own fieldset/legend so the group has a name. */}
        <fieldset className="field field--radio">
          <legend className="field__label">
            Seating preference <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </legend>
          <div className="field__radios">
            {SEATING_OPTIONS.map((option) => (
              <label key={option} className="radio">
                <input
                  type="radio"
                  name="seating"
                  value={option}
                  checked={values.seating === option}
                  onChange={handleChange}
                  aria-describedby={errors.seating ? 'seating-error' : undefined}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <FieldError field="seating" />
        </fieldset>
      </fieldset>

      <fieldset className="booking-form__fieldset">
        <legend className="booking-form__legend">Contact details</legend>

        <div className="field">
          <label className="field__label" htmlFor="name">
            Full name <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <input
            className="field__input"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            required
            {...fieldProps('name')}
          />
          <FieldError field="name" />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="email">
            Email <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <input
            className="field__input"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            {...fieldProps('email')}
          />
          <FieldError field="email" />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="phone">
            Phone number <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <input
            className="field__input"
            type="tel"
            autoComplete="tel"
            placeholder="(312) 555-0100"
            required
            {...fieldProps('phone')}
          />
          <FieldError field="phone" />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="requests">
            Special requests <span className="field__optional">(optional)</span>
          </label>
          <textarea
            className="field__input field__input--textarea"
            rows="3"
            maxLength={MAX_REQUEST_LENGTH}
            placeholder="Allergies, high chair, wheelchair access…"
            {...fieldProps('requests')}
          />
          <p className="field__hint" aria-live="polite">
            {MAX_REQUEST_LENGTH - values.requests.length} characters remaining
          </p>
          <FieldError field="requests" />
        </div>
      </fieldset>

      {/* The submit button stays operable while the form is incomplete, on purpose.
          A disabled button gives no explanation and cannot receive focus, so a
          screen-reader user is left guessing; pressing it here runs full validation
          and announces exactly what is missing via the summary above. The
          --incomplete class styles it as not-yet-ready without disabling it. */}
      <button
        className={`button button--primary booking-form__submit ${isValid ? '' : 'booking-form__submit--incomplete'}`}
        type="submit"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? 'Reserving…' : 'Reserve your table'}
      </button>

      <p className="booking-form__note">
        Fields marked <span aria-hidden="true">*</span>
        <span className="visually-hidden">with an asterisk</span> are required. Parties larger than {MAX_GUESTS} should
        call <a href="tel:+13125550100">(312) 555-0100</a>.
      </p>
    </form>
  );
};

export default BookingForm;
export { INITIAL_VALUES, FIELD_LABELS };
