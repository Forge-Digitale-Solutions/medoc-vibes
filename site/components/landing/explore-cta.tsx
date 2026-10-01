"use client";

import { useState } from "react";

export function ExploreCta() {
  const [hov, setHov] = useState(false);

  return (
    <a
      href="#carte"
      className="flex flex-col gap-1 self-start text-ground no-underline"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onFocus={() => setHov(true)}
      onBlur={() => setHov(false)}
    >
      <span className="flex items-center gap-2.5 text-[17px] font-extrabold">
        Explorer sans compte
        <span
          aria-hidden
          className="inline-block text-accent transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
          style={{ transform: `translateX(${hov ? 8 : 0}px)` }}
        >
          →
        </span>
      </span>
      <span className="relative block h-2.5 w-full">
        <span
          className="absolute top-1 right-0 left-0 h-0.5 bg-accent transition-opacity duration-300"
          style={{ opacity: hov ? 0 : 1 }}
        />
        <svg
          viewBox="0 0 200 10"
          preserveAspectRatio="none"
          className="absolute inset-0 h-2.5 w-full overflow-visible"
          aria-hidden
        >
          <path
            d="M0 5 q12.5 -5 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0"
            fill="none"
            stroke="#86CF5E"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="260"
            className="transition-[stroke-dashoffset] duration-700 ease-[cubic-bezier(.2,.7,.2,1)]"
            style={{ strokeDashoffset: hov ? 0 : 260 }}
          />
        </svg>
      </span>
    </a>
  );
}
