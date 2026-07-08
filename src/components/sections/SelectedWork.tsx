"use client";

import { ArrowUpRight, Eye, Shield, Cpu, Gamepad2, Gauge } from "lucide-react";
import Link from "next/link";
import { cn, trackSpotlight } from "@/lib/utils";
import { Reveal, MaskText } from "@/components/Reveal";
import { Ghost } from "@/components/Ghost";
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
    // TODO(real-cover): replace backdrop.webp fallback with a real architecture
    // diagram (attack -> defense -> eval flow) at /images/projects/secure-llm-arch.svg
    // per handoff #3 B1 row 02. Do not fabricate a screenshot.
    backdrop: true,
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
    // TODO(real-cover): replace with real architecture diagram (concurrent streams ->
    // 5-min sliding window -> anomaly flag) or terminal capture at
    // /images/projects/codeshield-arch.svg per handoff #3 B1 row 03.
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
    // TODO(real-cover): replace with a real screenshot of a game running in the
    // emulator at /images/projects/emulator-shot.png per handoff #3 B1 row 04 —
    // the standout asset, get this one done first.
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
    // TODO(real-cover): replace with pipeline/observability screenshot or flow
    // diagram at /images/projects/mlops-arch.svg per handoff #3 B1 row 05.
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
        onMouseMove={trackSpotlight}
        className={cn(
          "group relative flex flex-col rounded-2xl border border-border overflow-hidden bg-elevated",
          "card-hover card-feature card-accent-border card-spotlight h-full",
          index === 1 && "md:mt-8"
        )}
      >
        {/* Visual header area */}
        <div className="relative h-36 sm:h-44 flex items-center justify-center overflow-hidden">
          <div className={cn("cover-zoom absolute inset-0 bg-gradient-to-br", project.gradient)}>
            {"backdrop" in project && project.backdrop && (
              <img
                src="/images/projects/backdrop.webp"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
            )}
          </div>
          <div className="cover-sweep absolute inset-0" aria-hidden="true" />
          <span className="absolute top-3 left-4 project-num-large">
            {project.num}
          </span>
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1">
            <project.icon className="w-7 h-7 text-accent" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-display font-semibold tracking-tight">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-1" />
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
        onMouseMove={trackSpotlight}
        className={cn(
          "group relative flex items-start gap-4 rounded-2xl border border-border overflow-hidden bg-surface",
          "card-hover card-accent-border card-spotlight p-4 sm:p-5"
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
            <ArrowUpRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-0.5" />
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
    <section id="work" className="py-24 sm:py-32 relative overflow-hidden">
      <Ghost word="Work" className="right-[-1%] top-8" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16">
            <p className="section-eyebrow">
              <span className="motif-hash">#</span>Selected Work
            </p>
            <h2 className="section-heading">
              <MaskText>Things I&apos;ve built</MaskText>
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
