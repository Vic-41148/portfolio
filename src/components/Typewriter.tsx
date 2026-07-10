"use client";

import { useEffect, useState } from "react";

/**
 * Terminal-style typewriter: characters appear one at a time, blinking
 * cursor stays lit at the end. SSR renders the final text so no-JS/SEO
 * visitors see real content; typing only plays after hydration, and never
 * with reduced motion.
 */
export function Typewriter({
  text,
  delay = 0,
  speed = 45,
  className,
  cursorClassName,
  showCursor = true,
  onDone,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
  onDone?: () => void;
}) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      setDone(true);
      onDone?.();
      return;
    }

    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      i++;
      setOut(text.slice(0, i));
      if (i < text.length) {
        timeout = setTimeout(tick, speed);
      } else {
        setDone(true);
        onDone?.();
      }
    };

    const start = setTimeout(tick, delay * 1000);
    return () => {
      clearTimeout(start);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay, speed]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {out}
        {showCursor && (
          <span
            className={cursorClassName ?? "typewriter-cursor"}
            data-done={done || undefined}
          />
        )}
      </span>
    </span>
  );
}
