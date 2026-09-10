import { AvatarArt } from '../assets/illustrations';
import '../styles/home.css';

/** Customer reviews. Ratings are rendered as text plus a visual star row. */
const REVIEWS = [
  {
    id: 1,
    name: 'Amara O.',
    initials: 'AO',
    rating: 5,
    quote: 'The bruschetta is the best I have had outside of Italy. We booked online and were seated straight away.',
  },
  {
    id: 2,
    name: 'Daniel K.',
    initials: 'DK',
    rating: 5,
    quote: 'Warm service, generous portions and a lemon dessert I am still thinking about a week later.',
  },
  {
    id: 3,
    name: 'Priya S.',
    initials: 'PS',
    rating: 4,
    quote: 'Lovely patio for a summer evening. Reserving a table took less than a minute on my phone.',
  },
  {
    id: 4,
    name: 'Tomás R.',
    initials: 'TR',
    rating: 5,
    quote: 'We celebrated our anniversary here. They noted the occasion from the booking form — a really nice touch.',
  },
];

const Stars = ({ rating }) => (
  <p className="testimonial__rating">
    {/* The stars are decorative; the rating itself is exposed as text. */}
    <span aria-hidden="true">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
    <span className="visually-hidden">{`Rated ${rating} out of 5`}</span>
  </p>
);

const Testimonials = () => (
  <section className="testimonials" id="testimonials" aria-labelledby="testimonials-heading">
    <div className="container">
      <h2 id="testimonials-heading" className="testimonials__heading">
        What our guests say
      </h2>
      <ul className="testimonials__grid">
        {REVIEWS.map(({ id, name, initials, rating, quote }) => (
          <li key={id} className="testimonial">
            <Stars rating={rating} />
            <figure className="testimonial__figure">
              <div className="testimonial__person">
                <AvatarArt initials={initials} />
                <figcaption className="testimonial__name">{name}</figcaption>
              </div>
              <blockquote className="testimonial__quote">
                <p>{quote}</p>
              </blockquote>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Testimonials;
export { REVIEWS };
