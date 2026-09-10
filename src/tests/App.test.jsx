import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { getTodayString } from '../utils/bookingReducer';
import { getBookings } from '../utils/storage';

const renderApp = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

const futureDate = () => {
  const date = new Date(`${getTodayString()}T00:00:00`);
  date.setDate(date.getDate() + 4);
  return date.toISOString().split('T')[0];
};

describe('page structure and landmarks', () => {
  it('renders the banner, main and contentinfo landmarks', () => {
    renderApp();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('offers a skip link as the first focusable element', () => {
    renderApp();

    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
  });

  it('has exactly one level-one heading on the home page', () => {
    renderApp();

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('names the main navigation', () => {
    renderApp();

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('credits the author in the footer', () => {
    renderApp();

    expect(within(screen.getByRole('contentinfo')).getByText(/David Owele/i)).toBeInTheDocument();
  });
});

describe('home page content', () => {
  it('shows the three weekly specials with their prices', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: /greek salad/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /bruschetta/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /lemon dessert/i })).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('gives every dish illustration an accessible description', () => {
    renderApp();

    // role="img" + aria-label is the inline-SVG equivalent of <img alt="...">.
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    images.forEach((image) => {
      expect(image).toHaveAccessibleName();
    });
  });

  it('shows customer testimonials with their ratings as text', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: /what our guests say/i })).toBeInTheDocument();
    expect(screen.getAllByText(/rated \d out of 5/i).length).toBeGreaterThan(0);
  });
});

describe('navigation', () => {
  it('takes the visitor from the home page to the booking form', async () => {
    const user = userEvent.setup();
    renderApp();

    const [reserveLink] = screen.getAllByRole('link', { name: /reserve a table/i });
    await user.click(reserveLink);

    expect(await screen.findByRole('heading', { level: 1, name: /reserve a table/i })).toBeInTheDocument();
  });

  it('shows a helpful page for an unknown URL', () => {
    renderApp('/menu/pasta');

    expect(screen.getByRole('heading', { level: 1, name: /couldn.t find that page/i })).toBeInTheDocument();
  });

  it('redirects to the form when the confirmation page is opened directly', () => {
    renderApp('/confirmed');

    expect(screen.getByRole('heading', { level: 1, name: /reserve a table/i })).toBeInTheDocument();
  });
});

describe('end-to-end booking flow', () => {
  it('confirms the reservation and shows the details back to the visitor', async () => {
    const user = userEvent.setup();
    renderApp('/booking');

    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: futureDate() } });

    // Pick the first real slot the reducer offers for that date.
    const timeSelect = screen.getByLabelText(/choose time/i);
    const firstSlot = within(timeSelect)
      .getAllByRole('option')
      .map((option) => option.value)
      .find((value) => value !== '');
    await user.selectOptions(timeSelect, firstSlot);

    await user.selectOptions(screen.getByLabelText(/occasion/i), 'Anniversary');
    await user.click(screen.getByRole('radio', { name: /outdoor/i }));

    const guests = screen.getByLabelText(/number of guests/i);
    await user.clear(guests);
    await user.type(guests, '3');

    await user.type(screen.getByLabelText(/full name/i), 'Grace Hopper');
    await user.type(screen.getByLabelText(/email/i), 'grace@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '+1 312 555 0142');
    await user.type(screen.getByLabelText(/special requests/i), 'Window table if possible.');

    await user.click(screen.getByRole('button', { name: /reserve your table/i }));

    expect(await screen.findByRole('heading', { level: 1, name: /your table is booked/i })).toBeInTheDocument();
    expect(screen.getByText(/thanks, grace/i)).toBeInTheDocument();
    expect(screen.getByText('grace@example.com', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(firstSlot)).toBeInTheDocument();
    expect(screen.getByText('3 guests')).toBeInTheDocument();
    expect(screen.getByText('Anniversary')).toBeInTheDocument();
    expect(screen.getByText('Outdoor')).toBeInTheDocument();
    expect(screen.getByText(/window table if possible/i)).toBeInTheDocument();

    // The reservation is also kept locally so it survives a refresh.
    expect(getBookings()).toHaveLength(1);
    expect(getBookings()[0]).toEqual(expect.objectContaining({ name: 'Grace Hopper', guests: 3 }));
  });
});
