import { Link } from 'react-router-dom';
import { HeroArt } from '../assets/illustrations';
import '../styles/home.css';

/** Landing banner with the restaurant pitch and the primary call to action. */
const Hero = () => (
  <section className="hero" aria-labelledby="hero-heading">
    <div className="hero__inner container">
      <div className="hero__copy">
        <h1 id="hero-heading" className="hero__title">
          Little Lemon
        </h1>
        <p className="hero__subtitle">Chicago</p>
        <p className="hero__text">
          We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          Book a table and let our kitchen take care of the rest.
        </p>
        <Link className="button button--primary" to="/booking">
          Reserve a table
        </Link>
      </div>
      <div className="hero__media">
        <HeroArt />
      </div>
    </div>
  </section>
);

export default Hero;
