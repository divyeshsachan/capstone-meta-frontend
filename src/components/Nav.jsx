import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import '../styles/header.css';

/**
 * Site navigation.
 *
 * On small screens the links collapse behind a button. The button carries
 * aria-expanded / aria-controls so assistive technology knows the state of the
 * menu, and the menu closes on route change and on the Escape key.
 */
const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef(null);

  // Close the mobile menu whenever the visitor navigates to a new page.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Escape closes the menu and returns focus to the toggle, which is what
  // keyboard users expect from a disclosure widget.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/#specials', label: 'Menu' },
    { to: '/booking', label: 'Reservations' },
    { to: '/#about', label: 'About' },
  ];

  return (
    <nav className="nav" aria-label="Main navigation">
      <button
        ref={toggleRef}
        type="button"
        className="nav__toggle"
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="nav__toggle-bars" aria-hidden="true" />
        {isOpen ? 'Close menu' : 'Menu'}
      </button>

      <ul id="primary-navigation" className={`nav__list ${isOpen ? 'nav__list--open' : ''}`}>
        {links.map(({ to, label }) => (
          <li key={label} className="nav__item">
            {/* In-page anchors use a plain Link; route targets use NavLink so the
                current page can be marked with aria-current for screen readers. */}
            {to.includes('#') ? (
              <Link className="nav__link" to={to}>
                {label}
              </Link>
            ) : (
              <NavLink
                className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}
                to={to}
                end
              >
                {label}
              </NavLink>
            )}
          </li>
        ))}
        <li className="nav__item">
          <Link className="button button--primary nav__cta" to="/booking">
            Reserve a table
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
