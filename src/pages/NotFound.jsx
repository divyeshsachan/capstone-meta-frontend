import { Link } from 'react-router-dom';

/** Fallback route so an unknown URL gets a helpful page rather than a blank screen. */
const NotFound = () => (
  <section className="not-found container" aria-labelledby="not-found-heading">
    <h1 id="not-found-heading">We couldn&apos;t find that page</h1>
    <p>The page you were looking for has moved or never existed. The menu and reservations are still right here.</p>
    <p className="not-found__actions">
      <Link className="button button--primary" to="/">
        Back to home
      </Link>
      <Link className="button button--secondary" to="/booking">
        Reserve a table
      </Link>
    </p>
  </section>
);

export default NotFound;
