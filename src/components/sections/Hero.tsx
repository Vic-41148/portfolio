"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Generated ambient gradient texture, low opacity so it enhances rather than replaces the CSS gradient */}
      <Image
        src="/images/textures/hero-gradient.webp"
        alt=""
        aria-hidden="true"
        fill
        preload
        fetchPriority="high"
        sizes="100vw"
        className="object-cover opacity-30 mix-blend-screen pointer-events-none select-none"
      />
      {/* Signature scanline motif, very restrained */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.05] bg-repeat"
        style={{ backgroundImage: "url(/images/textures/scanline.png)", backgroundSize: "512px 512px" }}
      />
      {/* Dense ambient gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,var(--accent-muted)_0%,transparent_60%),radial-gradient(ellipse_40%_30%_at_80%_30%,color-mix(in_srgb,var(--accent)_6%,transparent)_0%,transparent_50%),radial-gradient(ellipse_30%_40%_at_20%_70%,color-mix(in_srgb,var(--accent)_4%,transparent)_0%,transparent_50%)]" />
      {/* Soft accent glow behind the name */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[20rem] rounded-full bg-accent/10 blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm font-mono text-accent mb-6 tracking-widest uppercase"
        >
          <span className="text-accent/50">#</span> ML &amp; Systems Engineer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.9] text-balance flex items-center justify-center flex-wrap gap-x-[0.1em]"
        >
          <span className="gradient-text">Aditya Shibu</span>
          <motion.span
            className="inline-block w-[3px] h-[0.7em] bg-accent ml-1 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed text-balance"
        >
          I build machine learning that runs on the device in front of you &mdash;
          computer vision in your browser, models packaged to actually ship.
          I came up through C++ and systems, and I&apos;m going deep on
          computer vision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="#work"
            className="btn-lift inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-base font-medium transition-all hover:brightness-110 active:scale-[0.98] focus-ring glow-accent"
          >
            See my work
            <ArrowDown className="w-4 h-4" />
          </Link>
          <Link
            href="#demo"
            className="btn-lift inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-text-secondary font-medium transition-all hover:text-text-primary hover:border-text-muted active:scale-[0.98] focus-ring"
          >
            Try the demo
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-8 text-sm text-text-muted"
        >
          Based in Bangalore, India &middot; open to relocating
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border border-border flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-text-muted animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
