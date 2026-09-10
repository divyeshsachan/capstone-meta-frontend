import { OwnersArt } from '../assets/illustrations';
import '../styles/home.css';

/** "About" section telling the story of the restaurant and its owners. */
const About = () => (
  <section className="about" id="about" aria-labelledby="about-heading">
    <div className="about__inner container">
      <div className="about__copy">
        <h2 id="about-heading" className="about__title">
          Little Lemon
        </h2>
        <p className="about__subtitle">Chicago</p>
        <p>
          Little Lemon was opened in 1995 by two Italian brothers, Adrian and Mario. Born in Sicily and raised in
          Chicago, they wanted a place where their mother&apos;s recipes could meet the produce of the Midwest.
        </p>
        <p>
          Today the menu changes with the seasons, but the kitchen still works from the same handwritten recipe book.
          Everything is cooked to order, and the bread is baked twice a day.
        </p>
      </div>
      <div className="about__media">
        <OwnersArt />
      </div>
    </div>
  </section>
);

export default About;
