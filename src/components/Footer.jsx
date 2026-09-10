import { Link } from 'react-router-dom';
import Logo from './Logo';
import '../styles/footer.css';

/**
 * Site footer: sitemap, contact details and social links.
 * Each column is a <nav> with its own accessible name so screen-reader users can
 * tell the three link groups apart.
 */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <Logo variant="light" className="logo logo--footer" />
          <p className="footer__tagline">
            A family-owned Mediterranean restaurant serving traditional recipes with a modern twist since 1995.
          </p>
        </div>

        <nav className="footer__column" aria-label="Sitemap">
          <h2 className="footer__heading">Sitemap</h2>
          <ul className="footer__list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/#specials">Menu</Link>
            </li>
            <li>
              <Link to="/booking">Reservations</Link>
            </li>
            <li>
              <Link to="/#about">About</Link>
            </li>
          </ul>
        </nav>

        <div className="footer__column">
          <h2 className="footer__heading">Contact</h2>
          <address className="footer__list">
            <p>331 Rockford Road, Chicago, IL 60601</p>
            <p>
              <a href="tel:+13125550100">(312) 555-0100</a>
            </p>
            <p>
              <a href="mailto:hello@littlelemon.example">hello@littlelemon.example</a>
            </p>
          </address>
        </div>

        <nav className="footer__column" aria-label="Social media">
          <h2 className="footer__heading">Follow us</h2>
          <ul className="footer__list">
            <li>
              <a href="https://instagram.com" rel="noreferrer noopener" target="_blank">
                Instagram
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://facebook.com" rel="noreferrer noopener" target="_blank">
                Facebook
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://x.com" rel="noreferrer noopener" target="_blank">
                X
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="footer__bottom container">
        <p>&copy; {year} David Owele. Built for the Meta Front-End Developer Capstone.</p>
      </div>
    </footer>
  );
};

export default Footer;
