/**
 * Little Lemon wordmark.
 *
 * Rendered as inline SVG with role="img" and an accessible name, so screen
 * readers announce "Little Lemon logo" the same way they would read an
 * <img alt="Little Lemon logo">.
 */
const Logo = ({ className = 'logo', variant = 'dark' }) => {
  // The footer sits on the dark green background, so the wordmark switches to
  // the light palette there to keep enough contrast.
  const isLight = variant === 'light';
  const topColor = isLight ? '#f4ce14' : '#495e57';
  const bottomColor = isLight ? '#edefee' : '#333333';

  return (
    <svg className={className} viewBox="0 0 210 48" role="img" aria-label="Little Lemon logo">
      <title>Little Lemon logo</title>
      {/* lemon mark */}
      <ellipse cx="24" cy="24" rx="20" ry="15" transform="rotate(-30 24 24)" fill="#f4ce14" />
      <ellipse cx="24" cy="24" rx="13" ry="9" transform="rotate(-30 24 24)" fill="#fbe884" />
      <path d="M36 8c3-2 6-2 7 0-1 3-4 5-7 4z" fill="#5d8a3f" />
      {/* wordmark */}
      <text x="54" y="22" fontFamily="Markazi Text, Georgia, serif" fontSize="21" fontWeight="600" fill={topColor}>
        LITTLE
      </text>
      <text x="54" y="41" fontFamily="Markazi Text, Georgia, serif" fontSize="21" fontWeight="500" fill={bottomColor}>
        LEMON
      </text>
    </svg>
  );
};

export default Logo;
