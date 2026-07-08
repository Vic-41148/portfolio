"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Native scrolling for users who asked for less motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  // The CSS reduced-motion kill-switch doesn't reach framer's JS-driven
  // transforms; MotionConfig disables those for reduced-motion users too
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
