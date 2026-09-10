import { useReducer, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BookingPage from './pages/BookingPage';
import ConfirmedBooking from './pages/ConfirmedBooking';
import NotFound from './pages/NotFound';
import { initializeTimes, updateTimes } from './utils/bookingReducer';
import { saveBooking } from './utils/storage';

/**
 * Root component.
 *
 * The available-times reducer is owned here rather than inside BookingForm so
 * that the reservation state survives navigation between the booking form and
 * the confirmation page, and so the reducer can be passed down and asserted on
 * in tests.
 */
function App() {
  const [{ availableTimes }, dispatch] = useReducer(updateTimes, undefined, initializeTimes);

  // The most recently completed reservation, shown on the confirmation page.
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  /** Called by BookingForm when the API accepts a reservation. */
  const handleBookingConfirmed = (booking) => {
    setConfirmedBooking(booking);
    saveBooking(booking);
  };

  return (
    <>
      {/* Keyboard and screen-reader users can jump straight past the nav. */}
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/booking"
            element={
              <BookingPage
                availableTimes={availableTimes}
                dispatch={dispatch}
                onBookingConfirmed={handleBookingConfirmed}
              />
            }
          />
          <Route
            path="/confirmed"
            element={
              // Landing here directly (e.g. a refresh) has no booking to show,
              // so send the visitor back to the form instead of an empty page.
              confirmedBooking ? (
                <ConfirmedBooking booking={confirmedBooking} />
              ) : (
                <Navigate to="/booking" replace />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
