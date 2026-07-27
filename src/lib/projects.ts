/** Case-study content. Lives here rather than in the route so the sitemap can
 *  derive its entries from the same source — the previous copy duplicated every
 *  slug by hand, which is exactly how a sitemap drifts out of sync. */
export interface Project {
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
}

export const PROJECTS: Record<string, Project> = {
  "retailforge": {
    title: "RetailForge POS",
    subtitle: "Modern, offline-first Point of Sale desktop application",
    problem: "Most billing software in retail shops is clunky, ancient, and relies heavily on constant internet connectivity. It often lacks modern ecosystem features like integrated customer loyalty, deep analytics, and smooth UI automation.",
    outcome: ["Full POS ecosystem", "Offline-first capability", "Built-in loyalty program"],
    links: { github: "https://codeberg.org/averix-global-tech/retailforge", demo: "/downloads/RetailForge-Demo-1.0.0.exe" },
    tech: ["Tauri v2", "Rust", "React 19", "SQLite", "TypeScript"],
    team: "I served as the Project Lead and the backbone for the backend and overall code quality during my internship at Averix Global Tech.",
    decision: "Tauri over Electron for the desktop shell. By using Rust for the backend and native system integrations, we massively reduced the memory footprint and bundle size. An offline-first approach using local SQLite ensures that intermittent internet connectivity never stops business operations.",
    architecture: "The application is split between a React 19 frontend and a Tauri (Rust) backend. It features barcode scanning, multi-tier pricing, GST calculations, and bill voiding with automatic stock restoration. The inventory module supports image galleries, variant matrices, and GRN tracking. I also built a self-hosted Ed25519 license key server (retailforge-keygen) in TypeScript to securely manage software activation.",
    results: "Delivered a fully functional production-ready POS system that modernizes retail operations while remaining resilient to network outages.",
    failure: "Building offline-first synchronization logic introduced complex state management challenges, particularly when resolving conflicts after the system comes back online.",
    honestNote: "This project was a deep dive into building serious desktop applications using web technologies paired with a systems programming language. (Averix Global Tech is a private org, but demo builds are available.)",
  },
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
    subtitle: "4-stage hybrid pipeline for prompt injection and jailbreak detection",
    problem: "LLM safety testing is mostly vibes: throw a few jailbreaks at the model, watch it refuse, call it secure. That tells you nothing about coverage, nothing about latency cost, and nothing about what happens when an attacker adapts. The goal was a system that both attacks and defends — and reports numbers for both sides.",
    outcome: ["76% acc on 150 unseen prompts", "217 rules · 14 categories", "9.4 ms avg pipeline latency"],
    links: { github: "https://github.com/Vic-41148/secure-llm-inference-platform", demo: null },
    tech: ["FastAPI", "DeBERTa v3", "PyTorch", "Groq API (Llama 3.3 70B)", "React 18 + Vite", "Docker Compose", "SQLAlchemy", "Nginx"],
    team: "Four-person university project (KR Mangalam University, BCA AI & DS, Sem 4). I led it as team leader and built the backend: the 4-stage detection pipeline, the 217-rule engine, and all attack simulation and red-team tooling. Akash Sharma handled blue-team defense logic. Bhavya Rattan and Lakshya Dangwal built the React frontend and visualization layer.",
    decision: "Rules first, ML second — not rules instead of ML. Stage 1 runs 217 regex patterns across 14 categories with input normalization (homoglyph collapse, zero-width stripping) in ~0.92 ms. Any prompt scoring ≥ 85 gets fast-blocked before touching the classifier. Everything else hits Stage 2: a fine-tuned DeBERTa v3 binary classifier (~7.3 ms warm GPU, ~50 ms CPU). Stage 3 fuses both scores at 0.4 rules / 0.6 model weight, with a dangerous-content floor at 75 so a confident-looking ML prediction can't override a categorical rule match.",
    architecture: "Five frontend tabs (Command Center, Attack Lab, Neural Link, Security Ops, Red Team) talk to a FastAPI backend. The detection pipeline has three stages: Stage 1 — Rule Engine with 217 regex rules across 14 categories: Jailbreak, Prompt Injection, Data Extraction, Encoding/Obfuscation, Social Engineering, Privilege Escalation, Roleplay, Manipulation, Dangerous Content, Token Manipulation, Context Overflow, Indirect Injection, Model Extraction, Multi-Agent Attack. Fast-block path short-circuits at score ≥ 85 (~0.92 ms). Stage 2 — fine-tuned DeBERTa v3 binary classifier, GPU or CPU. Stage 3 — weighted score fusion (0.4 rules / 0.6 ML) with a DC-category floor at risk 75, forcing auto-block regardless of ML output. Supporting systems: adaptive per-session risk escalation up to 2.0×, structured JSON audit log, API-key auth, SQLAlchemy for audit/session data, Groq for actual LLM responses. Red-team tooling: single-prompt Attack Lab with full pipeline breakdown, batch runs up to 200 prompts over SSE with live progress, export to CSV / JSON / styled PDF. Docker Compose runs backend + Nginx-fronted React frontend as a two-service stack.",
    results: "Rigorously evaluated on 150 strictly unseen prompts (100 benign from databricks-dolly-15k + 50 zero-day attack prompts crafted for the eval — no overlap with training data). Results: 11 blocked (7.3%), 5 flagged (3.3%), 134 allowed (89.3%). Accuracy: 76%. False negatives: 35. False positives: 1. Avg pipeline latency: ~9.4 ms. Rule engine: ~0.92 ms. Warm ML inference: ~7.3 ms. Cold start (model load): ~2960 ms. Configurable thresholds: BLOCK_THRESHOLD=65, FLAG_THRESHOLD=35.",
    failure: "35 false negatives on the rigorous eval — attacks that slipped through. All were highly creative zero-day obfuscation vectors not in the classifier's training distribution. The hybrid approach means the rule engine caught what it knew; the ML missed what it hadn't seen. This is the honest trade in any rule+ML system: coverage is bounded by what you've thought to write rules for, and generalization is bounded by what the model was trained on. The DC floor stops the worst-case failure (the model declaring a weapons prompt benign), but novel phrasing still leaks through.",
    honestNote: "The 76% accuracy figure is from a real evaluation against 150 unseen prompts — including adversarial zero-day attacks specifically designed to evade the defense. A production deployment would need continuous red-teaming and rule/model updates as attack patterns evolve.",
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

/** Ordering and weight for the sitemap. */
export const PROJECT_PRIORITY: Record<string, number> = {
  "webcam-transfer-learning": 0.9,
  "secure-llm-inference-platform": 0.9,
  codeshield: 0.8,
  "game-boy-emulator": 0.7,
  "primetrade-mlops": 0.7,
};
