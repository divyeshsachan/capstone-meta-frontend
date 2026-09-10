import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { submitAPI } from '../utils/api';
import '../styles/booking.css';

/**
 * Reservations page: wraps the form with page furniture and owns the submit
 * handshake with the API.
 *
 * @param {object} props
 * @param {string[]} props.availableTimes - from the App-level reducer
 * @param {Function} props.dispatch - reducer dispatch, passed through to the form
 * @param {Function} props.onBookingConfirmed - lifts the confirmed booking to App
 */
const BookingPage = ({ availableTimes, dispatch, onBookingConfirmed }) => {
  const navigate = useNavigate();

  /**
   * Send the booking to the API.
   * @returns {boolean} true when accepted — the form uses this to decide whether
   * to show its failure message.
   */
  const handleSubmit = (booking) => {
    const accepted = submitAPI(booking);
    if (!accepted) return false;

    onBookingConfirmed(booking);
    navigate('/confirmed');
    return true;
  };

  return (
    <section className="booking-page" aria-labelledby="booking-heading">
      <div className="booking-page__inner container">
        <header className="booking-page__header">
          <h1 id="booking-heading">Reserve a table</h1>
          <p className="booking-page__intro">
            Tell us when you are coming and we will have your table ready. Reservations are held for 15 minutes past the
            booked time.
          </p>
        </header>

        <div className="booking-page__layout">
          <BookingForm availableTimes={availableTimes} dispatch={dispatch} onSubmit={handleSubmit} />

          <aside className="booking-page__aside" aria-labelledby="opening-hours-heading">
            <h2 id="opening-hours-heading">Opening hours</h2>
            <dl className="hours">
              <div className="hours__row">
                <dt>Monday – Thursday</dt>
                <dd>17:00 – 22:00</dd>
              </div>
              <div className="hours__row">
                <dt>Friday – Saturday</dt>
                <dd>17:00 – 23:00</dd>
              </div>
              <div className="hours__row">
                <dt>Sunday</dt>
                <dd>16:00 – 21:00</dd>
              </div>
            </dl>
            <h2>Good to know</h2>
            <ul className="booking-page__notes">
              <li>Tables of up to 10 can be booked online.</li>
              <li>The patio is first come, first served in bad weather.</li>
              <li>Step-free access and an accessible bathroom are available.</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default BookingPage;
