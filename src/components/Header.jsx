import { Link } from 'react-router-dom';
import Logo from './Logo';
import Nav from './Nav';
import '../styles/header.css';

/** Site header: logo (links home) plus the main navigation. */
const Header = () => (
  <header className="header">
    <div className="header__inner container">
      <Link to="/" className="header__logo-link" aria-label="Little Lemon home">
        <Logo />
      </Link>
      <Nav />
    </div>
  </header>
);

export default Header;
