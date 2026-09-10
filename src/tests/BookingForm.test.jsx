import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from '../components/BookingForm';
import { getTodayString } from '../utils/bookingReducer';

const AVAILABLE_TIMES = ['17:00', '18:30', '19:00', '20:30', '21:00'];

/** A date three days from today, which is always valid. */
const futureDate = () => {
  const date = new Date(`${getTodayString()}T00:00:00`);
  date.setDate(date.getDate() + 3);
  return date.toISOString().split('T')[0];
};

/** A date in the past, used for the edge-case tests. */
const pastDate = () => {
  const date = new Date(`${getTodayString()}T00:00:00`);
  date.setDate(date.getDate() - 5);
  return date.toISOString().split('T')[0];
};

const renderForm = (props = {}) => {
  const dispatch = props.dispatch ?? vi.fn();
  // Default: the API accepts the booking. Tests can pass their own spy to
  // simulate a rejection.
  const onSubmit = props.onSubmit ?? vi.fn(() => true);
  const utils = render(
    <BookingForm availableTimes={AVAILABLE_TIMES} {...props} dispatch={dispatch} onSubmit={onSubmit} />
  );
  return { dispatch, onSubmit, ...utils };
};

/** Fill in every field with valid data. */
const fillValidForm = async (user) => {
  fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: futureDate() } });
  await user.selectOptions(screen.getByLabelText(/choose time/i), '19:00');
  await user.selectOptions(screen.getByLabelText(/occasion/i), 'Birthday');

  const guests = screen.getByLabelText(/number of guests/i);
  await user.clear(guests);
  await user.type(guests, '4');

  await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
  await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
  await user.type(screen.getByLabelText(/phone number/i), '(312) 555-0100');
};

describe('BookingForm rendering', () => {
  it('renders every field with an accessible label', () => {
    renderForm();

    expect(screen.getByLabelText(/choose date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
  });

  it('groups the fields under Reservation details and Contact details legends', () => {
    renderForm();

    expect(screen.getByRole('group', { name: /reservation details/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /contact details/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /seating preference/i })).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderForm();

    expect(screen.getByRole('button', { name: /reserve your table/i })).toBeInTheDocument();
  });

  it('lists one option per available time', () => {
    renderForm();

    const options = screen.getAllByRole('option', { name: /^\d{2}:\d{2}$/ });
    expect(options).toHaveLength(AVAILABLE_TIMES.length);
    AVAILABLE_TIMES.forEach((time) => {
      expect(screen.getByRole('option', { name: time })).toBeInTheDocument();
    });
  });

  it('stops the visitor picking a past date at browser level too', () => {
    renderForm();

    expect(screen.getByLabelText(/choose date/i)).toHaveAttribute('min', getTodayString());
  });

  it('warns when a date has very little availability', () => {
    renderForm({ availableTimes: ['17:00', '18:00'] });

    expect(screen.getByText(/only 2 slots left/i)).toBeInTheDocument();
  });
});

describe('BookingForm validation', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('reports every missing field when an empty form is submitted', async () => {
    renderForm();

    await user.click(screen.getByRole('button', { name: /reserve your table/i }));

    const summary = await screen.findByRole('alert');
    expect(summary).toHaveTextContent(/problems with your reservation/i);
    expect(summary).toHaveTextContent(/name/i);
    expect(summary).toHaveTextContent(/email/i);
    expect(summary).toHaveTextContent(/date/i);
    expect(summary).toHaveTextContent(/time/i);
  });

  it('does not submit an invalid form', async () => {
    const { onSubmit } = renderForm();

    await user.click(screen.getByRole('button', { name: /reserve your table/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('marks an invalid field with aria-invalid and links its message', async () => {
    renderForm();

    const email = screen.getByLabelText(/email/i);
    await user.type(email, 'not-an-email');
    await user.tab();

    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAttribute('aria-describedby', 'email-error');
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
  });

  it('clears the error as soon as the value is corrected', async () => {
    renderForm();

    const name = screen.getByLabelText(/full name/i);
    await user.type(name, 'A');
    await user.tab();
    expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();

    await user.type(name, 'da Lovelace');
    await waitFor(() => {
      expect(screen.queryByText(/at least 2 characters/i)).not.toBeInTheDocument();
    });
    expect(name).toHaveAttribute('aria-invalid', 'false');
  });

  it('rejects a booking in the past with a meaningful message', async () => {
    renderForm();

    const date = screen.getByLabelText(/choose date/i);
    fireEvent.change(date, { target: { value: pastDate() } });
    fireEvent.blur(date);

    expect(await screen.findByText(/cannot be made in the past/i)).toBeInTheDocument();
  });

  it('points parties larger than ten to the phone number', async () => {
    renderForm();

    const guests = screen.getByLabelText(/number of guests/i);
    await user.clear(guests);
    await user.type(guests, '12');
    await user.tab();

    // Scoped to the field's own message: the form footnote also mentions the number.
    const message = await screen.findByText(/we can seat up to 10 guests online/i);
    expect(message).toHaveTextContent(/555-0100/);
    expect(guests).toHaveAttribute('aria-invalid', 'true');
  });

  it('rejects a party of zero', async () => {
    renderForm();

    const guests = screen.getByLabelText(/number of guests/i);
    await user.clear(guests);
    await user.type(guests, '0');
    await user.tab();

    expect(await screen.findByText(/at least 1 guest/i)).toBeInTheDocument();
  });
});

describe('BookingForm submission', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('submits the completed booking', async () => {
    const { onSubmit } = renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /reserve your table/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: '(312) 555-0100',
        date: futureDate(),
        time: '19:00',
        guests: 4,
        occasion: 'Birthday',
        seating: 'Indoor',
      })
    );
  });

  it('passes the number of guests as a number, not a string', async () => {
    const { onSubmit } = renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /reserve your table/i }));

    expect(typeof onSubmit.mock.calls[0][0].guests).toBe('number');
  });

  it('shows no error summary for a valid submission', async () => {
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /reserve your table/i }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('explains the problem when the API rejects the booking', async () => {
    const { onSubmit } = renderForm({ onSubmit: vi.fn(() => false) });

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /reserve your table/i }));

    expect(onSubmit).toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not confirm your reservation/i);
  });

  it('records the visitor’s seating choice', async () => {
    const { onSubmit } = renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('radio', { name: /outdoor/i }));
    await user.click(screen.getByRole('button', { name: /reserve your table/i }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ seating: 'Outdoor' }));
  });
});

describe('BookingForm and the available-times reducer', () => {
  it('asks for new times when the date changes', () => {
    const { dispatch } = renderForm();

    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: '2026-10-15' } });

    expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_TIMES', date: '2026-10-15' });
  });

  it('clears a chosen time when the date changes, so a stale slot is never submitted', async () => {
    const user = userEvent.setup();
    renderForm();

    const time = screen.getByLabelText(/choose time/i);
    await user.selectOptions(time, '19:00');
    expect(time).toHaveValue('19:00');

    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: futureDate() } });

    expect(time).toHaveValue('');
  });
});
