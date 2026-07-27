import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, Users } from "lucide-react";
import type { Metadata } from "next";
import { GitHubIcon } from "@/components/icons";

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
  /** Collaborators and the split of work. Omitted on solo projects — stating
   *  it only where it applies keeps it meaningful rather than boilerplate. */
  team?: string;
}> = {
  "webcam-transfer-learning": {
    title: "Teach My Page to See",
    subtitle: "Real-time webcam CV with in-browser training",
    problem: "Most web CV demos run a pre-trained model. That's fine for demoing inference, but it doesn't show you understand the training pipeline. We wanted a demo where the model learns from scratch — from the visitor's own camera feed, in real time, in the browser.",
    outcome: ["30+ fps on-device", "Learns in seconds", "Zero server round-trips"],
    links: { github: null, demo: "/#demo" },
    tech: ["MediaPipe Tasks", "KNN Classifier", "WebGPU", "TypeScript"],
    decision: "Hand landmarks over raw pixels — MediaPipe's 21 keypoints, normalized to the wrist and L2-normalized, stay stable across lighting and hand position. On top of that, a KNN classifier: no training loop to babysit, learning is effectively instant.",
    architecture: "MediaPipe Tasks extracts 21 hand landmarks per frame (WebGPU delegate, WebGL fallback) → landmarks normalized relative to the wrist and L2-normalized for scale/position invariance → KNN compares each incoming frame against your captured examples. Capture, learn, classify — all in the browser.",
    results: "Learns two gestures from a handful of captured frames in seconds and classifies live at 30+ fps on-device. The WebGPU delegate carries the heavy landmark extraction; the KNN itself is negligible.",
    failure: "KNN's weakness is real: it memorizes rather than generalizes, so two similar gestures can collide. A production system would learn a feature space instead — but for a teach-it-in-ten-seconds browser demo, KNN is the honest trade.",
    honestNote: "Accuracy drops significantly in poor lighting or with motion blur. It's a demo, not a product — but the pipeline architecture is real and the on-device training is genuine.",
  },
  "secure-llm-inference-platform": {
    title: "Neuro-Sentry — LLM Threat Detection",
    subtitle: "A layered defense pipeline for prompt injection and jailbreaks",
    problem: "LLM safety testing is mostly vibes: throw a few jailbreaks at the model, watch it refuse, call it secure. That tells you nothing about coverage, nothing about latency cost, and nothing about what happens when an attacker adapts. The goal was a system that both attacks and defends, and reports numbers for each.",
    outcome: ["217 rules · 14 categories", "0 false negatives on the eval set", "~8-13ms warm inference"],
    links: { github: "https://github.com/Vic-41148/secure-llm-inference-platform", demo: null },
    tech: ["FastAPI", "DeBERTa v3", "PyTorch", "Groq (Llama 3.3 70B)", "React", "Docker"],
    team: "Four-person university project (KR Mangalam, BCA AI & DS). I led it and built the backend — the detection pipeline, the rule engine, and the attack-simulation and red-team tooling. Akash Sharma worked on blue-team defense logic; Bhavya Rattan and Lakshya Dangwal built the frontend and visualization.",
    decision: "Rules before the model, not instead of it. A regex engine catches known attack shapes in about 0.1ms, so obvious attempts never reach the classifier at all — anything scoring 85 or above short-circuits straight to a block. The fine-tuned DeBERTa only runs on what survives, which keeps the median request cheap while still catching novel phrasing.",
    architecture: "Stage 1: 217 regex rules across 14 categories (jailbreak, injection, extraction, encoding, social engineering, privilege escalation, and more) with input normalization to defeat homoglyphs and zero-width padding. Stage 2: a fine-tuned DeBERTa v3 binary classifier on GPU or CPU. Stage 3: weighted score fusion (0.4 rules / 0.6 model) with a critical-rule floor and an obfuscation penalty. The result blocks, flags, or allows. Around it: adaptive per-session escalation for repeat probers, structured audit logging, API-key auth, and Groq for the actual LLM response.",
    results: "On a 23-prompt adversarial and benign set: 18 blocked, 3 flagged, 2 allowed — both of the allowed ones genuinely benign. Zero false negatives, 91% accuracy, average risk score 74.2. Warm inference runs 8-13ms; cold start is about 3.4 seconds while the model loads. Batch red-team runs stream results over SSE and export to CSV, JSON, or PDF.",
    failure: "Dangerous-content rules kept getting diluted by the classifier — a confidently benign-looking ML score would drag a genuinely harmful prompt under the block threshold. The fix was a floor: DC-category matches force a minimum risk of 75 regardless of what the model thinks. Score fusion is a good default, not something to trust unconditionally.",
    honestNote: "The 91% figure comes from 23 prompts. That is an honest sanity check, not a benchmark — a real evaluation needs hundreds of examples and adversaries who adapt to the defense. The public GitHub repo is an earlier version of this system; the current one isn't published yet.",
  },
  "codeshield": {
    title: "CodeShield",
    subtitle: "Real-time log anomaly detection in C",
    problem: "Logs grow faster than anyone can read them, and an intrusion looks like one odd line among millions. The interesting problem isn't reading logs — it's deciding, in real time and without drowning an operator in false positives, which handful of events actually matter.",
    outcome: ["ThinkFest 2026", "Multi-threaded C", "Sliding-window scoring"],
    links: { github: "https://github.com/Vic-41148/CodeShield-Distributed-Log-Anomaly-Detection-Engine", demo: null },
    tech: ["C", "POSIX Threads", "Custom Hashmaps"],
    team: "Three-person build for IBM ThinkFest 2026. I wrote the detection half — the scoring engine, the sliding-window analysis, the alerting, and the log generator used to test all of it. Rakesh G handled the core engine and integration; Ujjwal Chauhan built ingestion and the data structures underneath it.",
    decision: "Score on behaviour over time, not on single lines. One failed login is noise; forty in five minutes from one source is a pattern. That meant the scorer couldn't be a simple matcher — it needed a time-windowed view of what each actor had been doing, which is what pushed the sliding window to the centre of the design.",
    architecture: "Ingestion reads concurrent log streams and parses them into structured events. Those feed a sliding time-window that groups activity per actor, so the scorer sees behaviour rather than isolated lines. Scoring weighs frequency, severity, and recency into a single threat number, and anything past the threshold goes to the alert writer. Threads throughout, synchronized with pthreads mutexes.",
    results: "Runs as a single multi-threaded process over concurrent log streams, flagging suspicious patterns as they appear and writing them to an alert log. Ships with a log generator so the whole pipeline can be exercised against synthetic traffic rather than waiting for real incidents.",
    failure: "The first scorer used a flat threshold and buried the operator in false positives — exactly the failure mode the project existed to avoid. Weighting by frequency, severity, and recency fixed it, but the weights are hand-tuned, and tuning them is the part that took the longest.",
    honestNote: "Written for a hackathon, and it shows in places: scoring rules are hand-tuned rather than learned, and it reads from files rather than a live stream. The repo name says distributed; it's honestly multi-threaded on one machine.",
  },
  "game-boy-emulator": {
    title: "Game Boy Emulator",
    subtitle: "An in-progress emulator from scratch in C++",
    problem: "I wanted to understand how computers work at the lowest level — not through a textbook, but by building one. A Game Boy emulator is the right scope: complex enough to be interesting, constrained enough that finishing is plausible.",
    outcome: ["Early WIP", "From scratch in C++", "Public from day one"],
    links: { github: "https://github.com/Vic-41148/lint-game-boy-emu", demo: null },
    tech: ["C++"],
    decision: "Start at the memory bus, not the CPU. Everything on the Game Boy talks through the bus, so getting addressing and the register file right first gives the CPU core solid ground to land on.",
    architecture: "What exists today: BIOS loading, the memory bus, and the CPU register file — including the AF pair's flag-register special cases. Next: the SM83 CPU core, then the PPU. The full CPU → bus → PPU → APU map is the destination, not the current state.",
    results: "Honestly? Early. The bus routes reads and writes and the BIOS loader is in place. Nothing playable yet — that milestone arrives with the CPU core, and it'll be public the day it happens.",
    failure: "The first attempt was a GBA emulator — bigger console, bigger mistake. It stalled at the memory map within days. Scoping down to the original Game Boy is what made 'actually finish this' believable.",
    honestNote: "This is the long-haul learning project, not a shipped artifact. Progress is public — every commit visible, half-finished parts and all.",
  },
  "primetrade-mlops": {
    title: "primetrade-mlops-round0",
    subtitle: "MLOps batch pipeline with Docker observability",
    problem: "ML models don't exist in isolation — they need pipelines that ingest data, generate features, produce signals, and log everything for debugging. This project was about building a minimal, deterministic MLOps pipeline from scratch.",
    outcome: ["Containerized with Docker", "Structured observability"],
    links: { github: "https://github.com/Vic-41148/primetrade-mlops-round0", demo: null },
    tech: ["Python", "Docker", "YAML Config"],
    decision: "Docker for reproducibility — the pipeline runs identically locally and in production. Configuration-driven (YAML) so the pipeline behavior changes without code changes.",
    architecture: "YAML config loader → OHLCV CSV ingestion (a 10,000-row dataset) → rolling mean on close prices → binary signal where close exceeds that mean → structured metrics JSON plus a detailed run log. The same command runs locally or inside the container and produces identical output.",
    results: "Produces deterministic, reproducible outputs. The rolling mean signal generation is simple by design — the project's value is in the pipeline structure (config-driven, containerized, observable) rather than the ML complexity.",
    failure: "The first version had hardcoded parameters and no structured output. Adding YAML config and metrics JSON made the pipeline actually useful for iteration and debugging.",
    honestNote: "This is a technical assessment project, not a production system. But the patterns — config-driven pipelines, containerized runs, structured observability — are directly transferable to production MLOps.",
  },
};

/** Same reason as the writing detail route: OpenNext's prerendered-page cache
 *  isn't configured on this deployment, so SSG pages 404 on Workers once the
 *  edge cache lapses. Rendering on demand reads from a bundled object literal. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.problem.slice(0, 160),
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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

        {/* Sits above the write-up rather than in a footnote: who did what is
            context for everything below it, and burying it reads as hiding it. */}
        {project.team && (
          <div className="mb-12 rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Team project
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{project.team}</p>
          </div>
        )}

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
