type BrandMarkProps = {
  className?: string;
  /** Icon size in px (square). */
  size?: number;
};

/** Variante logo 1a — Marée : M + ligne de houle. */
export function BrandMark({ className = "", size = 28 }: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect width="32" height="32" rx="7" fill="#0F2A1D" />
      <text
        x="16"
        y="20.5"
        textAnchor="middle"
        fontFamily="var(--font-anton), Anton, Arial Black, sans-serif"
        fontSize="18"
        fill="#86CF5E"
      >
        M
      </text>
      <path
        d="M8 24.5 q4 -3.2 8 0 t8 0"
        fill="none"
        stroke="#86CF5E"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
