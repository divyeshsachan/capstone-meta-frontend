/**
 * Hand-built SVG illustrations.
 *
 * The site uses inline SVG rather than bitmap photography so that the whole app
 * stays self-contained (no external image hosts, nothing to 404) and every
 * graphic scales crisply on any screen.
 *
 * Accessibility: each illustration takes a `title` prop and renders it inside an
 * SVG <title> element with role="img", which screen readers announce exactly the
 * way they announce an <img alt="...">. Purely decorative usages pass
 * `decorative` so the graphic is hidden from assistive technology instead.
 */

const svgProps = (title, decorative, className) =>
  decorative
    ? { className, viewBox: '0 0 400 300', 'aria-hidden': 'true', focusable: 'false' }
    : { className, viewBox: '0 0 400 300', role: 'img', 'aria-label': title };

/** A Greek salad in a bowl. */
export const GreekSaladArt = ({ title = 'A Greek salad in a white bowl', decorative = false, className = 'dish-art' }) => (
  <svg {...svgProps(title, decorative, className)}>
    {!decorative && <title>{title}</title>}
    <rect width="400" height="300" fill="#fbdabb" />
    <circle cx="200" cy="170" r="118" fill="#f0efe8" />
    <circle cx="200" cy="170" r="100" fill="#ffffff" />
    <path d="M110 170a90 90 0 0 0 180 0z" fill="#e9e7dd" />
    {/* lettuce */}
    <path d="M120 150c18-26 52-34 74-18 14-24 56-26 72-4 20-10 42 4 40 24-30 16-160 20-186-2z" fill="#5d8a3f" />
    <path d="M136 158c22-16 52-18 74-6 18-12 44-12 60 2-36 10-100 12-134 4z" fill="#79ab52" />
    {/* tomatoes */}
    <circle cx="158" cy="168" r="17" fill="#d9432f" />
    <circle cx="158" cy="168" r="9" fill="#ee6a54" />
    <circle cx="246" cy="176" r="15" fill="#d9432f" />
    <circle cx="246" cy="176" r="8" fill="#ee6a54" />
    {/* feta */}
    <rect x="184" y="160" width="26" height="24" rx="3" fill="#ffffff" stroke="#dcd8cb" strokeWidth="2" />
    <rect x="212" y="184" width="22" height="20" rx="3" fill="#fdfdfa" stroke="#dcd8cb" strokeWidth="2" />
    {/* olives */}
    <ellipse cx="176" cy="196" rx="11" ry="9" fill="#3c3a2e" />
    <ellipse cx="266" cy="152" rx="10" ry="8" fill="#3c3a2e" />
    {/* lemon wedge */}
    <path d="M268 200a26 26 0 0 1 26 26h-26z" fill="#f4ce14" />
    <path d="M270 204a20 20 0 0 1 20 20h-20z" fill="#fbe884" />
  </svg>
);

/** Tomato bruschetta on toasted bread. */
export const BruschettaArt = ({ title = 'Toasted bruschetta topped with tomato and basil', decorative = false, className = 'dish-art' }) => (
  <svg {...svgProps(title, decorative, className)}>
    {!decorative && <title>{title}</title>}
    <rect width="400" height="300" fill="#edefee" />
    <ellipse cx="200" cy="236" rx="150" ry="26" fill="#dfe3e0" />
    {/* back slice */}
    <g transform="rotate(-8 150 170)">
      <rect x="72" y="150" width="150" height="46" rx="23" fill="#c98a4b" />
      <rect x="80" y="146" width="138" height="34" rx="17" fill="#e8b877" />
      <circle cx="118" cy="152" r="13" fill="#d9432f" />
      <circle cx="152" cy="150" r="11" fill="#e2543c" />
      <circle cx="186" cy="154" r="12" fill="#d9432f" />
      <path d="M134 140c10-8 22-6 26 2-10 4-20 2-26-2z" fill="#5d8a3f" />
    </g>
    {/* front slice */}
    <g transform="rotate(6 250 190)">
      <rect x="178" y="176" width="160" height="48" rx="24" fill="#bd7f43" />
      <rect x="186" y="170" width="148" height="36" rx="18" fill="#e8b877" />
      <circle cx="226" cy="176" r="14" fill="#d9432f" />
      <circle cx="262" cy="174" r="12" fill="#e2543c" />
      <circle cx="298" cy="178" r="13" fill="#d9432f" />
      <path d="M244 162c12-9 26-7 30 3-12 5-23 2-30-3z" fill="#5d8a3f" />
      <path d="M276 190c9-7 19-5 22 2-9 4-17 2-22-2z" fill="#79ab52" />
    </g>
    {/* olive oil drizzle */}
    <path d="M96 214c40 16 120 20 200 6" stroke="#f4ce14" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
  </svg>
);

/** A slice of lemon dessert. */
export const LemonDessertArt = ({ title = 'A slice of lemon tart with cream and a lemon wedge', decorative = false, className = 'dish-art' }) => (
  <svg {...svgProps(title, decorative, className)}>
    {!decorative && <title>{title}</title>}
    <rect width="400" height="300" fill="#fdf3d7" />
    <ellipse cx="200" cy="240" rx="140" ry="24" fill="#f3e6bd" />
    {/* plate */}
    <ellipse cx="200" cy="230" rx="120" ry="28" fill="#ffffff" />
    <ellipse cx="200" cy="226" rx="104" ry="22" fill="#f7f6f0" />
    {/* tart slice */}
    <path d="M120 220 200 96l80 124z" fill="#f4ce14" />
    <path d="M134 210 200 108l66 102z" fill="#fbe884" />
    <path d="M120 220h160l-6 14H126z" fill="#c98a4b" />
    {/* cream swirl */}
    <circle cx="200" cy="132" r="20" fill="#ffffff" />
    <circle cx="200" cy="118" r="14" fill="#fdfdfa" />
    <circle cx="200" cy="108" r="9" fill="#ffffff" />
    {/* lemon wedge garnish */}
    <path d="M262 196a24 24 0 0 0 24 24 24 24 0 0 0-24-24z" fill="#f4ce14" />
    <circle cx="292" cy="212" r="16" fill="#f4ce14" />
    <circle cx="292" cy="212" r="11" fill="#fbe884" />
    <path d="M292 201v22M281 212h22" stroke="#f4ce14" strokeWidth="2" />
    {/* mint */}
    <path d="M158 208c-12-10-10-24 2-28 6 10 6 22-2 28z" fill="#5d8a3f" />
  </svg>
);

/** Hero graphic: a Mediterranean plate on a table. */
export const HeroArt = ({ title = 'A Mediterranean sharing plate with bread, olives and lemon', decorative = false, className = 'hero__art' }) => (
  <svg {...svgProps(title, decorative, className)}>
    {!decorative && <title>{title}</title>}
    <rect width="400" height="300" rx="16" fill="#3f5049" />
    <circle cx="200" cy="150" r="112" fill="#495e57" />
    {/* plate */}
    <circle cx="200" cy="160" r="92" fill="#f7f6f0" />
    <circle cx="200" cy="160" r="76" fill="#ffffff" />
    {/* grilled fish */}
    <path d="M138 160c20-26 62-30 86-8-24 22-66 26-86 8z" fill="#e8b877" />
    <path d="M224 152c14-8 26-6 30 4-8 8-22 8-30-4z" fill="#c98a4b" />
    <circle cx="156" cy="156" r="3" fill="#3f5049" />
    {/* couscous mound */}
    <path d="M198 196c8-18 34-22 46-8 8 10 2 22-12 24-16 2-30-6-34-16z" fill="#f4ce14" opacity="0.85" />
    {/* olives */}
    <ellipse cx="240" cy="196" rx="9" ry="7" fill="#3c3a2e" />
    <ellipse cx="164" cy="192" rx="9" ry="7" fill="#3c3a2e" />
    {/* herbs */}
    <path d="M176 178c10-10 24-8 28 2-10 5-21 3-28-2z" fill="#79ab52" />
    {/* lemon halves */}
    <circle cx="304" cy="86" r="26" fill="#f4ce14" />
    <circle cx="304" cy="86" r="17" fill="#fbe884" />
    <path d="M304 69v34M287 86h34" stroke="#f4ce14" strokeWidth="3" />
    <circle cx="86" cy="228" r="20" fill="#f4ce14" />
    <circle cx="86" cy="228" r="13" fill="#fbe884" />
    {/* cutlery */}
    <rect x="318" y="176" width="7" height="72" rx="3.5" fill="#edefee" />
    <rect x="74" y="96" width="7" height="66" rx="3.5" fill="#edefee" />
    <path d="M74 96h7v18h-7zM66 96h5v14h-5zM84 96h5v14h-5z" fill="#edefee" />
  </svg>
);

/**
 * Monogram used by the testimonial cards.
 * Decorative (aria-hidden): the reviewer's name is already in the caption next
 * to it, so announcing the initials as well would just repeat information.
 */
export const AvatarArt = ({ initials, className = 'testimonial__avatar' }) => (
  <svg className={className} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
    <circle cx="48" cy="48" r="48" fill="#495e57" />
    <text
      x="48"
      y="59"
      textAnchor="middle"
      fontSize="34"
      fontWeight="700"
      fill="#f4ce14"
      fontFamily="Karla, Helvetica, Arial, sans-serif"
    >
      {initials}
    </text>
  </svg>
);

/** Owners' photo placeholder for the About section. */
export const OwnersArt = ({ title = 'Adrian and Mario, the owners of Little Lemon, in the restaurant kitchen', decorative = false, className = 'about__art' }) => (
  <svg {...svgProps(title, decorative, className)}>
    {!decorative && <title>{title}</title>}
    <rect width="400" height="300" rx="16" fill="#edefee" />
    <rect x="0" y="210" width="400" height="90" fill="#dfe3e0" />
    {/* left figure */}
    <circle cx="150" cy="120" r="40" fill="#e8b877" />
    <path d="M150 74c22 0 34 14 34 30-8-10-22-14-34-14s-26 4-34 14c0-16 12-30 34-30z" fill="#3c3a2e" />
    <path d="M92 300c0-40 26-64 58-64s58 24 58 64z" fill="#495e57" />
    <circle cx="138" cy="120" r="3.5" fill="#3c3a2e" />
    <circle cx="162" cy="120" r="3.5" fill="#3c3a2e" />
    <path d="M140 136c6 6 14 6 20 0" stroke="#3c3a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* right figure */}
    <circle cx="258" cy="134" r="36" fill="#c98a4b" />
    <path d="M258 94c20 0 30 12 30 26-8-8-20-12-30-12s-22 4-30 12c0-14 10-26 30-26z" fill="#2f2d24" />
    <path d="M206 300c0-36 24-58 52-58s52 22 52 58z" fill="#f4ce14" />
    <circle cx="248" cy="134" r="3.5" fill="#2f2d24" />
    <circle cx="268" cy="134" r="3.5" fill="#2f2d24" />
    <path d="M249 148c5 5 13 5 18 0" stroke="#2f2d24" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* lemon crate */}
    <rect x="24" y="240" width="70" height="46" rx="6" fill="#c98a4b" />
    <circle cx="44" cy="238" r="12" fill="#f4ce14" />
    <circle cx="70" cy="236" r="12" fill="#f4ce14" />
    <circle cx="58" cy="224" r="11" fill="#fbe884" />
  </svg>
);
