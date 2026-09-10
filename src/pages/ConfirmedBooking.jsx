import { Link } from 'react-router-dom';
import '../styles/booking.css';

/** Formats "2026-09-24" as "Thursday, 24 September 2026". */
const formatDate = (isoDate) => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Confirmation page shown after a successful reservation.
 * The heading is focusable and announced via role="status" so a screen reader
 * confirms the booking rather than silently swapping pages.
 */
const ConfirmedBooking = ({ booking }) => (
  <section className="confirmation container" aria-labelledby="confirmation-heading">
    <div className="confirmation__card" role="status">
      <p className="confirmation__badge" aria-hidden="true">
        ✓
      </p>
      <h1 id="confirmation-heading">Your table is booked</h1>
      <p className="confirmation__lead">
        Thanks, {booking.name.split(' ')[0]}. We have sent a confirmation to {booking.email}.
      </p>

      <dl className="confirmation__details">
        <div className="confirmation__row">
          <dt>Date</dt>
          <dd>{formatDate(booking.date)}</dd>
        </div>
        <div className="confirmation__row">
          <dt>Time</dt>
          <dd>{booking.time}</dd>
        </div>
        <div className="confirmation__row">
          <dt>Guests</dt>
          <dd>
            {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
          </dd>
        </div>
        <div className="confirmation__row">
          <dt>Occasion</dt>
          <dd>{booking.occasion}</dd>
        </div>
        <div className="confirmation__row">
          <dt>Seating</dt>
          <dd>{booking.seating}</dd>
        </div>
        {booking.requests && (
          <div className="confirmation__row">
            <dt>Special requests</dt>
            <dd>{booking.requests}</dd>
          </div>
        )}
      </dl>

      <p className="confirmation__actions">
        <Link className="button button--primary" to="/">
          Back to home
        </Link>
        <Link className="button button--secondary" to="/booking">
          Book another table
        </Link>
      </p>
      <p className="confirmation__small">
        Need to change something? Call us on <a href="tel:+13125550100">(312) 555-0100</a> and quote your name.
      </p>
    </div>
  </section>
);

export default ConfirmedBooking;
