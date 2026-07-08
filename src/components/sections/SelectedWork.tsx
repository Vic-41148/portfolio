"use client";

import { ArrowUpRight, Eye, Shield, Cpu, Gamepad2, Gauge } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/Reveal";
import { motion } from "motion/react";

const allProjects = [
  {
    num: "01",
    slug: "webcam-transfer-learning",
    title: "Teach My Page to See",
    description: "Real-time computer vision on your webcam, fully in-browser — show it two gestures, it learns them in seconds. On-device, nothing uploaded.",
    shortDesc: "In-browser CV that learns from your webcam",
    icon: Eye,
    chips: ["MediaPipe", "TensorFlow.js", "WebGPU"],
    gradient: "from-accent/20 via-accent/5 to-transparent",
    href: "#demo",
    external: false,
    feature: true,
  },
  {
    num: "02",
    slug: "secure-llm-inference-platform",
    title: "Secure LLM Inference & Eval Platform",
    description: "Stress-tests LLMs against prompt-injection and jailbreak attacks, adds layered defenses, and measures how well they hold up.",
    shortDesc: "Systematic LLM security evaluation framework",
    icon: Shield,
    chips: ["Python", "Evals"],
    gradient: "from-demo-success/20 via-demo-success/5 to-transparent",
    href: "https://github.com/Vic-41148/secure-llm-inference-platform",
    external: true,
    meta: "\u26055 · 4 forks",
    feature: true,
  },
  {
    num: "03",
    slug: "codeshield",
    title: "CodeShield",
    description: "A real-time distributed log anomaly-detection engine in C — concurrent log streams, a 5-minute sliding window, security anomalies flagged as they happen. Built for IBM ThinkFest 2026.",
    shortDesc: "Real-time log anomaly engine in C",
    icon: Cpu,
    chips: ["C", "Systems"],
    gradient: "from-demo-warning/15 to-transparent",
    href: "https://github.com/Vic-41148/CodeShield-Distributed-Log-Anomaly-Detection-Engine",
    external: true,
    meta: "ThinkFest 2026",
  },
  {
    num: "04",
    slug: "game-boy-emulator",
    title: "Game Boy Emulator",
    description: "A Game Boy emulator written from scratch in C++ — CPU, PPU, APU, running real ROMs. The project that taught me how hardware actually works.",
    shortDesc: "CPU-to-APU emulator from scratch in C++",
    icon: Gamepad2,
    chips: ["C++"],
    gradient: "from-accent/10 to-transparent",
    href: "https://github.com/Vic-41148/lint-game-boy-emu",
    external: true,
  },
  {
    num: "05",
    slug: "primetrade-mlops",
    title: "primetrade-mlops-round0",
    description: "An MLOps batch pipeline: rolling-signal generation, containerized with Docker and wired for structured observability.",
    shortDesc: "MLOps batch pipeline with Docker",
    icon: Gauge,
    chips: ["Python", "Docker", "MLOps"],
    gradient: "from-accent/10 to-transparent",
    href: "https://github.com/Vic-41148/primetrade-mlops-round0",
    external: true,
  },
];

const featureProjects = allProjects.filter((p) => p.feature);
const smallProjects = allProjects.filter((p) => !p.feature);

function FeatureCard({ project, index }: { project: typeof allProjects[number]; index: number }) {
  const Component = project.external ? "a" : Link;
  const linkProps = project.external
    ? { href: project.href, target: "_blank", rel: "noopener noreferrer" as const }
    : { href: project.href };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Component
        {...linkProps}
        className={cn(
          "group relative flex flex-col rounded-2xl border border-border overflow-hidden",
          "card-hover card-accent-border h-full"
        )}
      >
        {/* Visual header area */}
        <div className={cn(
          "relative h-36 sm:h-44 bg-gradient-to-br flex items-center justify-center overflow-hidden",
          project.gradient
        )}>
          <span className="absolute top-3 left-4 project-num-large">
            {project.num}
          </span>
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/50 flex items-center justify-center">
            <project.icon className="w-7 h-7 text-accent" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-display font-semibold tracking-tight">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
          </div>

          <p className="mt-2 text-sm text-text-secondary leading-relaxed flex-1">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {project.chips.map((chip) => (
              <span
                key={chip}
                className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-elevated border border-border text-text-muted"
              >
                {chip}
              </span>
            ))}
            {project.meta && (
              <span className="text-[11px] font-mono text-accent ml-1">
                {project.meta}
              </span>
            )}
          </div>
        </div>
      </Component>
    </motion.div>
  );
}

function SmallCard({ project, index }: { project: typeof allProjects[number]; index: number }) {
  const Component = project.external ? "a" : Link;
  const linkProps = project.external
    ? { href: project.href, target: "_blank", rel: "noopener noreferrer" as const }
    : { href: project.href };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Component
        {...linkProps}
        className={cn(
          "group relative flex items-start gap-4 rounded-2xl border border-border overflow-hidden",
          "card-hover card-accent-border p-4 sm:p-5"
        )}
      >
        <span className="project-num mt-0.5 shrink-0 w-6">{project.num}</span>

        <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
          <project.icon className="w-[18px] h-[18px] text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-display font-semibold tracking-tight">
              {project.title}
            </h3>
            <ArrowUpRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-0.5" />
          </div>

          <p className="mt-1 text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2">
            {project.shortDesc}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {project.chips.map((chip) => (
              <span
                key={chip}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-elevated border border-border text-text-muted"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </Component>
    </motion.div>
  );
}

export function SelectedWork() {
  return (
    <section id="work" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16">
            <p className="section-eyebrow">
              <span className="motif-hash">#</span>Selected Work
            </p>
            <h2 className="section-heading">
              Things I&apos;ve built
            </h2>
            <p className="section-desc">
              Five projects, different stacks, one thread: shipping real
              things that work at the edge.
            </p>
          </div>
        </Reveal>

        {/* Feature cards: 2-column row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {featureProjects.map((project, index) => (
            <FeatureCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        {/* Small cards: 3-column row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {smallProjects.map((project, index) => (
            <SmallCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="motif-divider mt-16">
            <span>more</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
