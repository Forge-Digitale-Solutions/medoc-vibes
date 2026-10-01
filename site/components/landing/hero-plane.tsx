"use client";

import { useEffect, useRef } from "react";

function waveClosed(width: number, height: number, period: number, amp: number, base: number) {
  let d = `M0 ${base}`;
  for (let x = 0; x < width; x += period) {
    d += ` q${period / 4} ${-amp} ${period / 2} 0 t${period / 2} 0`;
  }
  return `${d} L${width} ${height} L0 ${height} Z`;
}

function treePath() {
  let s = 11;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let x = 0;
  let d = "M0 160 L0 70";
  while (x < 1440) {
    const nx = Math.min(1440, x + 38 + r() * 74);
    const top = 6 + r() * 48;
    d += ` Q${(x + nx) / 2} ${top - 22} ${nx} ${top + 26 + r() * 24}`;
    x = nx;
  }
  return `${d} L1440 160 Z`;
}

export function HeroPlane() {
  const treeRef = useRef<HTMLDivElement>(null);
  const w1Ref = useRef<HTMLDivElement>(null);
  const w2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onScroll = () => {
      const y = Math.min(window.scrollY, 1200);
      if (treeRef.current) treeRef.current.style.transform = `translateY(${y * 0.22}px)`;
      if (w1Ref.current) w1Ref.current.style.transform = `translateY(${y * 0.1}px)`;
      if (w2Ref.current) w2Ref.current.style.transform = `translateY(${y * 0.03}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        ref={treeRef}
        className="absolute top-0 right-0 left-0 h-[78%] will-change-transform"
      >
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="block h-full w-full"
        >
          <path d={treePath()} fill="#86CF5E" />
        </svg>
      </div>
      <div
        ref={w1Ref}
        className="absolute right-0 bottom-0 left-0 h-[52%] will-change-transform"
      >
        <svg
          viewBox="0 0 2880 100"
          preserveAspectRatio="none"
          className="mv-drift block h-full w-[200%]"
        >
          <path d={waveClosed(2880, 100, 240, 14, 16)} fill="#2F7F86" />
        </svg>
      </div>
      <div
        ref={w2Ref}
        className="absolute right-0 bottom-0 left-0 h-[30%] will-change-transform"
      >
        <svg
          viewBox="0 0 2880 100"
          preserveAspectRatio="none"
          className="mv-drift-fast block h-full w-[200%]"
        >
          <path d={waveClosed(2880, 100, 180, 16, 18)} fill="#235F65" />
        </svg>
      </div>
    </div>
  );
}
