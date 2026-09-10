import '../styles/home.css';

/**
 * A single dish card in the "This week's specials" list.
 *
 * @param {object} props
 * @param {string} props.name - dish name
 * @param {string} props.price - formatted price, e.g. "$12.99"
 * @param {string} props.description - short dish description
 * @param {React.ComponentType} props.Art - illustration component for the dish
 * @param {string} props.artTitle - accessible description of the illustration
 */
const SpecialCard = ({ name, price, description, Art, artTitle }) => (
  <li className="special-card">
    <div className="special-card__media">
      <Art title={artTitle} />
    </div>
    <div className="special-card__body">
      <div className="special-card__header">
        <h3 className="special-card__name">{name}</h3>
        <p className="special-card__price">
          {/* The price is read as a price, not as a bare number. */}
          <span className="visually-hidden">Price: </span>
          {price}
        </p>
      </div>
      <p className="special-card__description">{description}</p>
      <a className="special-card__link" href="#specials">
        Order a delivery
        <span className="visually-hidden"> of {name}</span>
        <span aria-hidden="true"> →</span>
      </a>
    </div>
  </li>
);

export default SpecialCard;
