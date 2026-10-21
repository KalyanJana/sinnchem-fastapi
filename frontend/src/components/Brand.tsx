export function Brand() {
  return (
    <span className="brand-lockup">
      <span className="brand-mark" aria-hidden="true">
        <svg className="brand-symbol" viewBox="0 0 48 48" fill="none">
          <path
            className="brand-funnel"
            d="M6 6h36L29 22v18h-10V22L6 6Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2.6"
          />
          <path
            className="brand-benzene"
            d="m24 12 5 2.9v5.8L24 23.6l-5-2.9v-5.8l5-2.9Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            className="brand-bond"
            d="m21 16 3-1.7m3 3.7v2.1m-6 0 1.8 1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.2"
          />
        </svg>
      </span>
      <span>
        <strong className="brand-name">SINNCHEM</strong>
        <small className="brand-sub">LIFE SCIENCES</small>
      </span>
    </span>
  );
}
