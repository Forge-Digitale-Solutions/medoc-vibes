"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  dx?: number;
  className?: string;
  as?: "div" | "span" | "p" | "h2" | "h3";
};

export function Reveal({
  children,
  delay = 0,
  dx = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    el.style.opacity = "0";
    el.style.transform = `translate(${dx}px, 34px)`;
    el.style.transition = `opacity .9s cubic-bezier(.2,.7,.2,1) ${delay}s, transform 1.1s cubic-bezier(.2,.7,.2,1) ${delay}s`;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.style.opacity = "1";
          el.style.transform = "none";
          io.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, dx]);

  return (
    <Tag ref={ref as never} className={`mv-reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
