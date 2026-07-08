"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/** Huge outlined word floating behind a section header, with slight scroll parallax. */
export function Ghost({ word, className }: { word: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [48, -48]);

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      style={{ y }}
      className={`ghost-word ${className ?? ""}`}
    >
      {word}
    </motion.span>
  );
}
