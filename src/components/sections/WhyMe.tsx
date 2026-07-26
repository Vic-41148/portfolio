"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal, MaskText } from "@/components/Reveal";
import { Star } from "lucide-react";

const reasons = [
  {
    num: "01",
    title: "Systems-first",
    content:
      "C++, an emulator mid-build, a real-time anomaly-detection engine — before I ever touched ML. The foundation is real, not a bootcamp certificate.",
  },
  {
    num: "02",
    title: "Ships on-device",
    content:
      "Not a wrapper around someone else's API. Vision runs in-browser via WebGPU and MediaPipe — nothing round-trips to a server to work.",
  },
  {
    num: "03",
    title: "Documented in the open",
    content:
      "Every project's a public repo — real commits, real history, half-finished parts included. Nothing here is a private codebase you have to take my word for.",
  },
];

/** Number scrubs directly against scroll position instead of firing once —
 *  it grows and sharpens as the cell rises through the viewport. */
function ScrubNum({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 40%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.55, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className="why-cell-num origin-left">
      {children}
    </motion.div>
  );
}

export function WhyMe() {
  return (
    <section id="why" className="why-block py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow why-kicker">
            <span className="motif-bracket" />Why me
          </p>
          <h2 className="section-heading max-w-2xl mb-12">
            <MaskText>Not a checkbox hire.</MaskText>
          </h2>
        </Reveal>

        <div className="why-grid">
          {reasons.map((reason) => (
            <div key={reason.num} className="why-cell">
              <ScrubNum>{reason.num}</ScrubNum>
              <h3 className="font-display text-xl uppercase mb-2.5">{reason.title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{reason.content}</p>
            </div>
          ))}
          <div className="why-cell why-cell-award">
            <ScrubNum>
              <Star className="w-9 h-9 fill-current" />
            </ScrubNum>
            <h3 className="font-display text-xl uppercase mb-2.5">Oh, this?</h3>
            <p className="text-sm leading-relaxed opacity-80">
              Built for IBM ThinkFest 2026. Not bad for a systems guy moonlighting in ML.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
