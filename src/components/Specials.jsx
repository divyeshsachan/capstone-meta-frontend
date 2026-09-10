import SpecialCard from './SpecialCard';
import { GreekSaladArt, BruschettaArt, LemonDessertArt } from '../assets/illustrations';
import '../styles/home.css';

/**
 * "This week's specials" section.
 *
 * The dishes are kept in a data array and rendered through a single card
 * component, so adding a dish is a one-line change rather than a copy/paste of
 * markup.
 */
const SPECIALS = [
  {
    id: 'greek-salad',
    name: 'Greek Salad',
    price: '$12.99',
    description:
      'Crispy lettuce, peppers, olives and our Chicago-style feta cheese, garnished with crunchy garlic and rosemary croutons.',
    Art: GreekSaladArt,
    artTitle: 'A Greek salad of lettuce, tomato, feta and olives in a white bowl',
  },
  {
    id: 'bruschetta',
    name: 'Bruschetta',
    price: '$5.99',
    description:
      'Grilled bread rubbed with garlic and salted with olive oil, topped with vine tomatoes and fresh basil from our garden.',
    Art: BruschettaArt,
    artTitle: 'Two slices of toasted bruschetta topped with tomato and basil',
  },
  {
    id: 'lemon-dessert',
    name: 'Lemon Dessert',
    price: '$5.00',
    description:
      "Our grandmother's recipe: a light lemon tart with a buttery crust, whipped cream and a candied lemon wedge.",
    Art: LemonDessertArt,
    artTitle: 'A slice of lemon tart with cream and a candied lemon wedge',
  },
];

const Specials = () => (
  <section className="specials" id="specials" aria-labelledby="specials-heading">
    <div className="container">
      <div className="specials__header">
        <h2 id="specials-heading">This week&apos;s specials!</h2>
        <a className="button button--primary" href="#specials">
          Online Menu
        </a>
      </div>
      <ul className="specials__grid">
        {SPECIALS.map(({ id, ...dish }) => (
          <SpecialCard key={id} {...dish} />
        ))}
      </ul>
    </div>
  </section>
);

export default Specials;
export { SPECIALS };
