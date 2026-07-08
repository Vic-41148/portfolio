"use client";

import { useEffect, useState } from "react";

const GLYPHS = "▚▞▟▙#01<>/_\\";

/**
 * Scramble-to-text decode effect for short mono labels.
 * SSR renders the final text, so SEO and no-JS visitors see real content;
 * the scramble only plays after hydration, and never with reduced motion.
 */
export function Decode({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const total = 26;
    let frame = 0;
    let raf: number;
    const start = performance.now() + delay * 1000;

    const tick = (t: number) => {
      if (t < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      frame++;
      const settled = Math.floor((frame / total) * text.length);
      setOut(
        text
          .split("")
          .map((c, i) =>
            i < settled || c === " "
              ? c
              : GLYPHS[(Math.random() * GLYPHS.length) | 0]
          )
          .join("")
      );
      if (frame < total) {
        raf = requestAnimationFrame(tick);
      } else {
        setOut(text);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);

  // aria-label is prohibited on generic spans; expose the text via sr-only instead
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
