"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Typewriter } from "@/components/Typewriter";

const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_CARDS = [
  { num: "01", label: "C++ / Systems", x: -88, y: 10, rotate: -9 },
  { num: "02", label: "On-device CV", x: 0, y: -13, rotate: 0 },
  { num: "03", label: "WebGPU", x: 88, y: 10, rotate: 9 },
] as const;

function HeroCard({ num, label, x, y, rotate, z }: { num: string; label: string; x: number; y: number; rotate: number; z: number }) {
  const [dragging, setDragging] = useState(false);

  return (
    <motion.div
      className={cn("hero-card", dragging && "hero-card-dragging")}
      style={{ zIndex: z }}
      initial={{ x, y, rotate, opacity: 0 }}
      animate={{ opacity: 1 }}
      drag
      dragElastic={0.3}
      dragSnapToOrigin
      dragTransition={{ bounceStiffness: 400, bounceDamping: 18 }}
      whileDrag={{ scale: 1.08 }}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
    >
      <span className="hero-card-num">{num}</span>
      <span className="hero-card-label">{label}</span>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Content slides away slightly faster than the backdrop — cheap depth
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden"
    >
      {/* Signature scanline motif, very restrained */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.05] bg-repeat"
        style={{ backgroundImage: "url(/images/textures/scanline.png)", backgroundSize: "512px 512px" }}
      />
      {/* One-shot CRT sweep down the hero on load */}
      <div aria-hidden="true" className="hero-sweep z-10" />

      {/* Fanned stack of stat cards — the hero's one physical prop. Grab one
          and drag it; it springs back to its place on release. */}
      <div
        className="hero-stack hidden lg:flex absolute right-[8%] top-1/2 -translate-y-1/2 z-10 items-center justify-center"
      >
        {HERO_CARDS.map((card, i) => (
          <HeroCard key={card.num} {...card} z={i === 1 ? 2 : 1} />
        ))}
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-16"
      >
        <Typewriter
          text="> ML THAT ACTUALLY SHIPS"
          delay={0.25}
          speed={35}
          className="block text-sm font-mono text-accent mb-8 tracking-widest"
        />

        {/* Stacked lines concatenate without a space, so name the heading explicitly */}
        <h1
          aria-label="Aditya Shibu"
          className="font-display font-normal tracking-normal leading-[0.98] text-[clamp(4.25rem,13vw,10.5rem)] text-text-primary"
        >
          <Typewriter
            text="Aditya"
            delay={1.1}
            speed={80}
            showCursor={false}
            className="block"
          />
          <Typewriter
            text="Shibu"
            delay={1.75}
            speed={80}
            className="block"
          />
        </h1>

        <div className="mt-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
              className="text-lg sm:text-xl text-text-secondary leading-relaxed"
            >
              Most &ldquo;AI engineers&rdquo; wire up someone else&apos;s API and call it done.
              I write the model, run it on the device in front of you &mdash;
              computer vision in your browser, no server in the loop. Came up
              through C++ and systems. Going all-in on computer vision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.58, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="#work"
                className="btn-lift btn-sheen inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-base font-medium transition-all hover:brightness-110 active:scale-[0.98] focus-ring glow-accent"
              >
                See my work
                <ArrowDown className="w-4 h-4" />
              </Link>
              <Link
                href="#demo"
                className="btn-lift inline-flex items-center gap-2 px-6 py-3 rounded-full border border-text-muted/40 text-text-secondary font-medium transition-all hover:text-text-primary hover:border-text-muted active:scale-[0.98] focus-ring"
              >
                Try the demo
              </Link>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] uppercase text-text-muted shrink-0 lg:pb-1.5"
          >
            <span className="relative flex w-2 h-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-demo-success opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-demo-success" />
            </span>
            Bangalore, India &middot; will relocate for the right chaos
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-6 inset-x-0 z-10"
      >
        <div className="mx-auto max-w-6xl px-6 flex items-end justify-between font-mono text-[11px] tracking-[0.18em] uppercase text-text-muted">
          <span className="flex items-center gap-3">
            Scroll
            <span className="scroll-line" aria-hidden="true" />
          </span>
          <span className="hidden sm:block">12.97&deg;N &middot; 77.59&deg;E &middot; IST</span>
        </div>
      </motion.div>
    </section>
  );
}
