import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const projects: Record<string, {
  title: string;
  subtitle: string;
  problem: string;
  outcome: string[];
  links: { github: string | null; demo: string | null };
  tech: string[];
  decision: string;
  architecture: string;
  results: string;
  failure: string;
  honestNote?: string;
}> = {
  "webcam-transfer-learning": {
    title: "Teach My Page to See",
    subtitle: "Real-time webcam CV with in-browser training",
    problem: "Most web CV demos run a pre-trained model. That's fine for demoing inference, but it doesn't show you understand the training pipeline. We wanted a demo where the model learns from scratch — from the visitor's own camera feed, in real time, in the browser.",
    outcome: ["30+ fps on-device", "Trains in ~10 seconds", "Zero server round-trips"],
    links: { github: null, demo: "/#demo" },
    tech: ["MediaPipe Tasks", "TensorFlow.js", "WebGPU", "MobileNet"],
    decision: "MediaPipe for landmark extraction (21 hand keypoints) over a full CNN — the landmark-based approach is faster and the features are more transferable across lighting conditions. The feature extractor is small enough (4.2MB) to load on mobile.",
    architecture: "MediaPipe extracts hand landmarks → landmarks feed into a MobileNet feature vector → a 2-layer classifier trains via SGD. Training uses ~20 captured frames per class. Inference runs the same pipeline but only the forward pass through the tiny classifier.",
    results: "The model converges in 3-5 SGD epochs (~8-12 seconds on a modern laptop, ~20s on phone). WebGPU gives a 2-3x speedup over WebGL on supported devices.",
    failure: "Initial version used full MobileNet fine-tuning, which took 40+ seconds and produced frequent catastrophic forgetting. The frozen-features + tiny-classifier approach was an order of magnitude faster and more stable.",
    honestNote: "Accuracy drops significantly in poor lighting or with motion blur. It's a demo, not a product — but the pipeline architecture is real and the on-device training is genuine.",
  },
  "secure-llm-inference-platform": {
    title: "Secure LLM Inference & Eval Platform",
    subtitle: "Systematic LLM security evaluation framework",
    problem: "LLM safety evaluation is ad-hoc. Most teams manually try a few jailbreaks and call it done. We needed a systematic framework that generates adversarial prompts, tests across multiple defense layers, and gives actionable metrics — not a pass/fail score.",
    outcome: ["5 stars · 4 forks", "Full-stack platform", "Active development"],
    links: { github: "https://github.com/Vic-41148/secure-llm-inference-platform", demo: null },
    tech: ["Python", "FastAPI", "React", "Groq API", "Docker"],
    decision: "Template-based generation over pure LLM-based generation. Templates give us interpretable attack categories while seeded LLM variations cover novel cases. The hybrid approach is more maintainable than either alone.",
    architecture: "Attack generator (templates + LLM seeding) → prompt sanitizer → target model → response classifier → scoring pipeline. A React frontend provides real-time dashboards with per-category breakdown and regression tracking.",
    results: "First open-source release received 5 stars and 4 forks. The platform has been used internally to evaluate multiple defense configurations and identify blind spots in single-layer approaches.",
    failure: "The first classifier overfit to template patterns. Switching to a rubric-based scoring approach generalized better to novel attacks at the cost of higher per-evaluation latency.",
    honestNote: "The attack generator can itself produce harmful content during development — we built an airlock pipeline with human review before any generated attack reaches the target model.",
  },
  "codeshield": {
    title: "CodeShield",
    subtitle: "Distributed log anomaly-detection engine in C",
    problem: "System logs grow faster than any human can review them. Security anomalies hide in the noise — a single unusual log line among millions. We needed a real-time engine that ingests concurrent log streams, maintains a sliding window, and flags threats without drowning operators in false positives.",
    outcome: ["ThinkFest 2026", "Multi-threaded C", "5-min sliding window"],
    links: { github: "https://github.com/Vic-41148/CodeShield-Distributed-Log-Anomaly-Detection-Engine", demo: null },
    tech: ["C", "POSIX Threads", "Custom Hashmaps"],
    decision: "Built in C for performance — log analysis at scale needs to be fast and memory-efficient. POSIX threads for concurrent ingestion and analysis. A custom hashmap implementation for O(1) lookups during pattern matching.",
    architecture: "Log ingestion via concurrent readers → parser extracts structured events → analyzer maintains a 5-minute sliding window of events → custom scoring logic evaluates each event against known threat patterns → alerts generated for high-scoring events. All synchronization via pthreads mutexes.",
    results: "Built for IBM ThinkFest 2026. The engine processes thousands of log lines per second and generates real-time alerts with configurable sensitivity thresholds.",
    failure: "Initial scoring used a simple threshold approach that generated too many false positives. We iterated to a weighted scoring model that considers event frequency, severity, and recency — more accurate but required careful tuning.",
    honestNote: "The current version uses hand-tuned scoring rules rather than learned thresholds. A production version would benefit from ML-based anomaly scoring on top of the real-time pipeline.",
  },
  "game-boy-emulator": {
    title: "Game Boy Emulator",
    subtitle: "A CPU-to-APU emulator from scratch in C++",
    problem: "I wanted to understand how computers work at the lowest level — not through a textbook, but by building one. A Game Boy emulator is the perfect scope: complex enough to be interesting, constrained enough to finish.",
    outcome: ["From scratch in C++", "CPU + PPU + APU"],
    links: { github: "https://github.com/Vic-41148/lint-game-boy-emu", demo: null },
    tech: ["C++", "SDL2"],
    decision: "Cycle-accuracy over instruction-accuracy. Cycle-accurate emulation accounts for every machine cycle, not just instruction boundaries — this matters for raster effects that games depend on.",
    architecture: "CPU core (SM83 instruction set) → Memory Bus (cartridge MBC, HRAM, VRAM, OAM) → PPU (tiles, sprites, window, pixel pipeline) → APU (4 channels: 2 pulse, 1 wave, 1 noise) → SDL2 frontend.",
    results: "Runs real Game Boy ROMs. The CPU core implements the SM83 instruction set with documented opcodes and known undocumented behavior. PPU rendering produces correct graphics for several tested titles.",
    failure: "The APU was rewritten multiple times. The Game Boy's audio mixing has subtle channel interaction behaviors that aren't documented — I had to trace through a reference emulator to get the audio phase correct.",
    honestNote: "Not every game works perfectly. Some MBC3 RTC games and a few obscure titles have graphical glitches. It's an ongoing project — the PPU timing needs further refinement for full compatibility.",
  },
  "primetrade-mlops": {
    title: "primetrade-mlops-round0",
    subtitle: "MLOps batch pipeline with Docker observability",
    problem: "ML models don't exist in isolation — they need pipelines that ingest data, generate features, produce signals, and log everything for debugging. This project was about building a minimal, deterministic MLOps pipeline from scratch.",
    outcome: ["Containerized with Docker", "Structured observability"],
    links: { github: "https://github.com/Vic-41148/primetrade-mlops-round0", demo: null },
    tech: ["Python", "Docker", "YAML Config"],
    decision: "Docker for reproducibility — the pipeline runs identically locally and in production. Configuration-driven (YAML) so the pipeline behavior changes without code changes.",
    architecture: "YAML config loader → OHLCV CSV ingestion → rolling mean computation on close prices → binary signal generation (close > rolling_mean) → structured metrics JSON output + detailed logging.",
    results: "Produces deterministic, reproducible outputs. The rolling mean signal generation is simple by design — the project's value is in the pipeline structure (config-driven, containerized, observable) rather than the ML complexity.",
    failure: "The first version had hardcoded parameters and no structured output. Adding YAML config and metrics JSON made the pipeline actually useful for iteration and debugging.",
    honestNote: "This is a technical assessment project, not a production system. But the patterns — config-driven pipelines, containerized runs, structured observability — are directly transferable to production MLOps.",
  },
};

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Metadata {
  const { slug } = params as unknown as { slug: string };
  const project = projects[slug];
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.problem.slice(0, 160),
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = params as unknown as { slug: string };
  const project = projects[slug];

  if (!project) notFound();

  return (
    <article className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to work
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-3">
            {project.title}
          </h1>
          <p className="text-xl text-text-secondary">{project.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-elevated border border-border text-text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {project.outcome.map((o) => (
            <span
              key={o}
              className="text-sm px-3 py-1.5 rounded-lg bg-accent-muted border border-accent/30 text-accent font-mono"
            >
              {o}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mb-16">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary hover:border-text-muted transition-all"
            >
              <GitHubIcon className="w-4 h-4" />
              Source
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:brightness-110 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Live demo
            </a>
          )}
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-text-primary">
              The problem
            </h2>
            <p className="text-text-secondary leading-relaxed">{project.problem}</p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-text-primary">
              Key decision
            </h2>
            <p className="text-text-secondary leading-relaxed">{project.decision}</p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-text-primary">
              How it works
            </h2>
            <p className="text-text-secondary leading-relaxed">{project.architecture}</p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-text-primary">
              Results
            </h2>
            <p className="text-text-secondary leading-relaxed">{project.results}</p>
          </section>

          <section className="p-6 rounded-2xl border border-demo-warning/20 bg-demo-warning/5">
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-demo-warning">
              What went wrong
            </h2>
            <p className="text-text-secondary leading-relaxed">{project.failure}</p>
          </section>

          {project.honestNote && (
            <section className="p-6 rounded-2xl border border-border bg-surface">
              <p className="text-sm text-text-muted italic">{project.honestNote}</p>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
