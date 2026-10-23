export function Brand() {
  return (
    <span className="brand-lockup">
      <span className="brand-mark">
        <img
          src={`${import.meta.env.BASE_URL}img/brand/Sinnchem-logo.png`}
          alt="SINNCHEM Logo"
        />
      </span>
      <span className="brand-copy">
        <strong className="brand-name">SINNCHEM</strong>
        <small className="brand-sub">LIFE SCIENCES</small>
      </span>
    </span>
  );
}
