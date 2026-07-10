"use client";

import { BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const facts = [
  { headline: "Real stars, not seeded.", detail: "★5 · 4 forks on the LLM eval platform.", source: "GitHub" },
  { headline: "Not a class project.", detail: "CodeShield was built and shipped for IBM ThinkFest 2026.", source: "ThinkFest" },
  { headline: "30+ fps, zero round-trips.", detail: "Hand tracking runs fully in-browser, on-device.", source: "Live demo" },
  { headline: "Five for five.", detail: "5 projects, 5 public repos — nothing private, nothing hidden.", source: "GitHub" },
  { headline: "No drag-and-drop.", detail: "C++, PyTorch, WebGPU. No low-code builder in sight.", source: "Stack" },
  { headline: "No borrowed core.", detail: "CPU, PPU, and APU emulation written from scratch.", source: "Game Boy Emulator" },
];

/** Truthful stand-in for a "reviews wall" — verifiable project facts,
 *  formatted like testimonials, instead of invented quotes from people who
 *  don't exist. */
export function ProofWall() {
  return (
    <section className="py-16 sm:py-20 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 mb-10">
        <Reveal>
          <p className="section-eyebrow !text-center">
            <span className="motif-bracket" />Proof, not vibes
          </p>
          <h2 className="section-heading text-center">Verified, not vouched for.</h2>
        </Reveal>
      </div>
      <div className="marquee marquee-lg" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-stretch">
              {facts.map((fact) => (
                <div key={`${copy}-${fact.source}-${fact.headline}`} className="proof-chip">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent mb-1">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified
                  </div>
                  <p className="font-display text-lg uppercase leading-[1.05]">{fact.headline}</p>
                  <p className="text-sm text-text-secondary leading-snug mt-1">{fact.detail}</p>
                  <p className="mt-3 font-mono text-xs text-accent">— {fact.source}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
