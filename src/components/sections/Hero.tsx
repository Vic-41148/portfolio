"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Decode } from "@/components/Decode";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Content slides away slightly faster than the backdrop — cheap depth
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden"
    >
      {/* Generated ambient gradient: parallax on the outer layer, slow drift on the inner */}
      {/* Blend lives on the outermost layer: the transformed wrappers isolate
          their descendants, so a blend set on the Image would stop compositing
          against the page background */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30"
      >
        <div className="gradient-drift absolute -inset-[6%]">
          <Image
            src="/images/textures/hero-gradient.webp"
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="object-cover select-none"
          />
        </div>
      </motion.div>
      {/* Signature scanline motif, very restrained */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.05] bg-repeat"
        style={{ backgroundImage: "url(/images/textures/scanline.png)", backgroundSize: "512px 512px" }}
      />
      {/* Dense ambient gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,var(--accent-muted)_0%,transparent_60%),radial-gradient(ellipse_40%_30%_at_80%_30%,color-mix(in_srgb,var(--accent)_6%,transparent)_0%,transparent_50%),radial-gradient(ellipse_30%_40%_at_20%_70%,color-mix(in_srgb,var(--accent)_4%,transparent)_0%,transparent_50%)]" />
      {/* Soft accent glow behind the name, offset left to match the type */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[28%] -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[22rem] rounded-full bg-accent/10 blur-[100px] pointer-events-none"
      />
      {/* One-shot CRT sweep down the hero on load */}
      <div aria-hidden="true" className="hero-sweep z-10" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-16"
      >
        <Decode
          text="# ML & SYSTEMS ENGINEER"
          delay={0.25}
          className="block text-sm font-mono text-accent mb-8 tracking-widest"
        />

        {/* Stacked lines concatenate without a space, so name the heading explicitly */}
        <h1
          aria-label="Aditya Shibu"
          className="font-display font-extrabold tracking-[-0.03em] leading-[0.88] text-[clamp(4.25rem,13vw,10.5rem)] text-text-primary"
        >
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            >
              Aditya
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
            >
              Shibu
              <motion.span
                aria-hidden="true"
                className="inline-block w-[0.05em] h-[0.72em] bg-accent ml-[0.08em]"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.4 }}
              />
            </motion.span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
              className="text-lg sm:text-xl text-text-secondary leading-relaxed"
            >
              I build machine learning that runs on the device in front of you &mdash;
              computer vision in your browser, models packaged to actually ship.
              I came up through C++ and systems, and I&apos;m going deep on
              computer vision.
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
            Bangalore, India &middot; open to relocating
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
