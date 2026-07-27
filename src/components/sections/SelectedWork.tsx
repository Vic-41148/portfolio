"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { ArrowUpRight, Eye, Shield, Cpu, Gamepad2, Gauge, Flame, Check } from "lucide-react";
import Link from "next/link";
import { cn, trackSpotlight } from "@/lib/utils";
import { Reveal, MaskText } from "@/components/Reveal";
import { Ghost } from "@/components/Ghost";
import { motion, useInView } from "motion/react";
import { useShortlist } from "@/lib/shortlist";
import { GitHubIcon } from "@/components/icons";
import { useDragScroll } from "@/lib/use-drag-scroll";

const STOP_MOTION_FRAMES = [Cpu, Shield, Gamepad2, Gauge] as const;

/** Stop-motion stand-in: on first scroll-into-view, the icon jump-cuts
 *  through a few frames — no easing, discrete steps — before settling on
 *  the real one. Runs once. */
function StopMotionIcon({ FinalIcon }: { FinalIcon: ComponentType<{ className?: string }> }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [frame, setFrame] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i >= STOP_MOTION_FRAMES.length) {
        clearInterval(id);
        setFrame(STOP_MOTION_FRAMES.length);
        return;
      }
      setFrame(i);
    }, 90);
    return () => clearInterval(id);
  }, [inView]);

  const Current = frame >= 0 && frame < STOP_MOTION_FRAMES.length ? STOP_MOTION_FRAMES[frame] : FinalIcon;

  return (
    <span ref={ref}>
      <Current className="w-7 h-7 text-accent" />
    </span>
  );
}

const allProjects = [
  {
    num: "01",
    slug: "webcam-transfer-learning",
    title: "Teach My Page to See",
    description: "Real-time computer vision on your webcam, fully in-browser — show it two gestures, it learns them in seconds flat. On-device. Nothing uploaded, nothing to trust me on.",
    icon: Eye,
    chips: ["MediaPipe", "KNN", "WebGPU"],
    tint: "bg-accent/15",
    href: "/work/webcam-transfer-learning",
    demo: "#demo",
    feature: true,
    difficulty: 3,
  },
  {
    num: "02",
    slug: "secure-llm-inference-platform",
    title: "Neuro-Sentry — LLM Threat Detection",
    description: "Red and blue team in one box: 217 regex rules + a fine-tuned DeBERTa v3 classifier stop prompt injection and jailbreaks. Evaluated against 150 unseen prompts (including 0-days) with 76% accuracy. I led the team and built the full backend.",
    icon: Shield,
    chips: ["FastAPI", "DeBERTa v3", "Groq API", "Docker"],
    tint: "bg-demo-success/15",
    href: "/work/secure-llm-inference-platform",
    repo: "https://github.com/Vic-41148/secure-llm-inference-platform",
    meta: "76% acc on 150 prompts",
    // TODO(real-cover): add a real architecture diagram (attack -> defense ->
    // eval flow) at /images/projects/secure-llm-arch.svg per handoff #3 B1
    // row 02. Do not fabricate a screenshot.
    difficulty: 4,
  },
  {
    num: "03",
    slug: "codeshield",
    title: "CodeShield",
    description: "Real-time log anomaly detection in raw C. I built the detection half — scoring, sliding-window analysis, and alerting — the parts that decide what counts as an anomaly. Three-person build for IBM ThinkFest 2026.",
    icon: Cpu,
    chips: ["C", "Systems"],
    tint: "bg-demo-warning/12",
    href: "/work/codeshield",
    repo: "https://github.com/Vic-41148/CodeShield-Distributed-Log-Anomaly-Detection-Engine",
    meta: "ThinkFest 2026",
    // TODO(real-cover): replace with real architecture diagram (concurrent streams ->
    // 5-min sliding window -> anomaly flag) or terminal capture at
    // /images/projects/codeshield-arch.svg per handoff #3 B1 row 03.
    difficulty: 5,
  },
  {
    num: "04",
    slug: "game-boy-emulator",
    title: "Game Boy Emulator",
    description: "A Game Boy emulator being built from scratch in C++ — memory bus, BIOS loading, and the register file so far; CPU core next. Early days, fully public: no tutorial, no borrowed code, every commit visible.",
    icon: Gamepad2,
    chips: ["C++"],
    meta: "early WIP",
    tint: "bg-accent/10",
    href: "/work/game-boy-emulator",
    repo: "https://github.com/Vic-41148/lint-game-boy-emu",
    // TODO(real-cover): replace with a real screenshot of a game running in the
    // emulator at /images/projects/emulator-shot.png per handoff #3 B1 row 04 —
    // the standout asset, get this one done first.
    difficulty: 5,
  },
  {
    num: "05",
    slug: "primetrade-mlops",
    title: "primetrade-mlops-round0",
    description: "An MLOps batch pipeline: rolling-signal generation, containerized with Docker and wired for structured observability.",
    icon: Gauge,
    chips: ["Python", "Docker", "MLOps"],
    tint: "bg-accent/10",
    href: "/work/primetrade-mlops",
    repo: "https://github.com/Vic-41148/primetrade-mlops-round0",
    // TODO(real-cover): replace with pipeline/observability screenshot or flow
    // diagram at /images/projects/mlops-arch.svg per handoff #3 B1 row 05.
    difficulty: 2,
  },
];

function ProductCard({ project, index }: { project: typeof allProjects[number]; index: number }) {
  // Cards open the case study; the repo and demo are separate links inside, so
  // clicking a project reads what you'd expect rather than leaving the site.
  const repo = "repo" in project ? project.repo : undefined;
  const demo = "demo" in project ? project.demo : undefined;
  const isSignature = index === 0;
  const { toggle, has } = useShortlist();
  const shortlisted = has(project.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="slider-item w-[19rem] sm:w-[22rem]"
    >
      <div
        onMouseMove={trackSpotlight}
        className={cn(
          "group relative flex flex-col rounded-2xl border border-border overflow-hidden bg-elevated h-full",
          "card-hover card-feature card-accent-border card-spotlight"
        )}
      >
        {/* Covers the card so the whole thing is one target, without wrapping
            the source and demo links in an outer anchor. */}
        <Link
          href={project.href}
          className="absolute inset-0 z-20 focus-ring rounded-2xl"
          aria-label={`${project.title} — read the case study`}
        />
        {/* Visual header area — the "product shot" */}
        <div className="relative h-44 sm:h-52 flex items-center justify-center overflow-hidden">
          <div className={cn("cover-zoom absolute inset-0", project.tint)} />
          <div className="cover-sweep absolute inset-0" aria-hidden="true" />
          <span className="absolute top-3 left-4 project-num-large">
            {project.num}
          </span>
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1">
            {isSignature ? (
              <StopMotionIcon FinalIcon={project.icon} />
            ) : (
              <project.icon className="w-7 h-7 text-accent" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-display font-normal">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-1" />
          </div>

          <p className="mt-2 text-sm text-text-secondary leading-relaxed flex-1">
            {project.description}
          </p>

          <div className="flex items-center gap-1 mt-4 font-mono text-[11px] uppercase tracking-wider text-text-muted">
            Difficulty
            <span className="flex gap-0.5 ml-1" aria-label={`${project.difficulty} out of 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Flame
                  key={n}
                  className={cn("w-3 h-3", n <= project.difficulty ? "text-accent fill-accent" : "text-text-muted/30")}
                />
              ))}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {project.chips.map((chip) => (
              <span
                key={chip}
                className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-elevated border border-border text-text-muted"
              >
                {chip}
              </span>
            ))}
            {"meta" in project && project.meta && (
              <span className="text-[11px] font-mono text-accent ml-1">
                {project.meta}
              </span>
            )}
          </div>
        </div>

        <div className="relative z-30 flex items-center gap-3 px-5 sm:px-6 pb-3 -mt-1 pointer-events-none">
          <span className="text-[11px] font-mono text-text-muted group-hover:text-accent transition-colors">
            Read the case study
          </span>
          {/* Nested inside a Link, so these stop propagation rather than
              letting the card navigation swallow the click. */}
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto pointer-events-auto inline-flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-text-primary transition-colors"
              aria-label={`${project.title} source on GitHub`}
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              Source
            </a>
          )}
          {demo && (
            <a
              href={demo}
              className="ml-auto pointer-events-auto inline-flex items-center gap-1 text-[11px] font-mono text-accent hover:brightness-110 transition-all"
            >
              Try it live
            </a>
          )}
        </div>

        <motion.button
          onClick={(e) => {
            e.preventDefault();
            toggle({ slug: project.slug, title: project.title, href: project.href });
          }}
          aria-pressed={shortlisted}
          title={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className={cn(
            "relative z-30 m-5 mt-0 sm:m-6 sm:mt-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider",
            shortlisted ? "bg-demo-success text-demo-success-foreground" : "bg-text-primary text-bg hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {shortlisted ? (
            <>
              Shortlisted <Check className="w-3.5 h-3.5" />
            </>
          ) : (
            "Add to shortlist"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export function SelectedWork() {
  const sliderRef = useDragScroll<HTMLDivElement>({ loop: true });

  return (
    <section id="work" className="py-24 sm:py-32 relative overflow-hidden">
      <Ghost word="Work" className="right-[-1%] top-8" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="section-eyebrow">
                <span className="motif-bracket" />Choose your stack
              </p>
              <h2 className="section-heading">
                <MaskText>Things I actually shipped</MaskText>
              </h2>
              <p className="section-desc">
                Five projects, five different stacks, zero tutorials followed
                to the letter. If it runs at the edge and doesn&apos;t need a
                server to feel alive, it&apos;s probably mine.
              </p>
            </div>
            <span className="hidden sm:block text-xs font-mono text-text-muted tracking-wider uppercase">
              &larr; scroll &rarr;
            </span>
          </div>
        </Reveal>
      </div>

      {/* Product-style horizontal slider — grab-to-fling on desktop, native
          swipe on touch, loops forever. Content renders three times so the
          drag can wrap seamlessly; the signature tilt-3D card exists in
          every copy so whichever one is on screen still carries it. */}
      <div className="relative mx-auto max-w-[100rem] px-6">
        <div ref={sliderRef} className="slider-row">
          {[0, 1, 2].map((copyIndex) =>
            allProjects.map((project, index) => (
              <ProductCard key={`${copyIndex}-${project.slug}`} project={project} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
