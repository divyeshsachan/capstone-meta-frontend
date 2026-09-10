import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Specials from '../components/Specials';
import Testimonials from '../components/Testimonials';
import About from '../components/About';

/**
 * Home page — a single scrolling page made of four sections.
 *
 * Because the nav links to in-page anchors (/#specials, /#about), the hash has
 * to be handled manually: React Router does not scroll to anchors by itself.
 */
const Home = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <Specials />
      <Testimonials />
      <About />
    </>
  );
};

export default Home;
