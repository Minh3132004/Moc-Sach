import { Link } from "react-router-dom";

/**
 * Mộc Sách brand logo — stylised open book with botanical leaf motif.
 * Colours follow the site's teal palette (#2a8190 / #1e616d).
 */
function BrandLogo() {
  return (
    <Link to="/" className="brand" aria-label="Mộc Sách – Trang chủ">
      <svg
        className="brand-icon"
        viewBox="0 0 44 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* ── Book (left page) ── */}
        <path
          d="M4 34 C4 34 4 14 4 12 C4 9 6 8 9 8 L20 8 L20 32 L9 32 C6 32 4 33 4 34 Z"
          fill="#e0f3f6"
          stroke="#2a8190"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* ── Book (right page) ── */}
        <path
          d="M36 34 C36 34 36 14 36 12 C36 9 34 8 31 8 L20 8 L20 32 L31 32 C34 32 36 33 36 34 Z"
          fill="#e0f3f6"
          stroke="#2a8190"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* ── Book spine ── */}
        <line
          x1="20" y1="8"
          x2="20" y2="32"
          stroke="#2a8190"
          strokeWidth="1.6"
        />
        {/* ── Page lines (left) ── */}
        <line x1="8" y1="14" x2="17" y2="14" stroke="#9dd0d8" strokeWidth="1" strokeLinecap="round" />
        <line x1="8" y1="18" x2="16" y2="18" stroke="#9dd0d8" strokeWidth="1" strokeLinecap="round" />
        <line x1="8" y1="22" x2="15" y2="22" stroke="#9dd0d8" strokeWidth="1" strokeLinecap="round" />
        {/* ── Page lines (right) ── */}
        <line x1="23" y1="14" x2="32" y2="14" stroke="#9dd0d8" strokeWidth="1" strokeLinecap="round" />
        <line x1="23" y1="18" x2="31" y2="18" stroke="#9dd0d8" strokeWidth="1" strokeLinecap="round" />
        <line x1="23" y1="22" x2="30" y2="22" stroke="#9dd0d8" strokeWidth="1" strokeLinecap="round" />
        {/* ── Leaf / sprout stem ── */}
        <path
          d="M20 12 C20 6 20 4 20 2"
          stroke="#2a8190"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* ── Left leaf ── */}
        <path
          d="M20 6 C16 3 12 4 11 6 C12 7 16 8 20 6 Z"
          fill="#3aafa9"
          stroke="#2a8190"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* ── Right leaf ── */}
        <path
          d="M20 3.5 C24 0.5 28 1.5 29 3.5 C28 4.5 24 5.5 20 3.5 Z"
          fill="#2a8190"
          stroke="#1e616d"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* ── Leaf vein (left) ── */}
        <path
          d="M20 6 C17 5.2 14 5.5 12.5 6"
          stroke="#1e916d"
          strokeWidth="0.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        {/* ── Leaf vein (right) ── */}
        <path
          d="M20 3.5 C23 2.7 26 3 27.5 3.5"
          stroke="#e0f3f6"
          strokeWidth="0.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        {/* ── Book bottom cover curve ── */}
        <path
          d="M4 34 C4 35 6 36 9 36 L31 36 C34 36 36 35 36 34"
          stroke="#2a8190"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="brand-text">Mộc Sách</span>
    </Link>
  );
}

export default BrandLogo;
