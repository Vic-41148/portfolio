import React from "react";

/** Case-study content. Lives here rather than in the route so the sitemap can
 *  derive its entries from the same source — the previous copy duplicated every
 *  slug by hand, which is exactly how a sitemap drifts out of sync. */
export interface DownloadEntry {
  label: string;
  sub: string;
  href: string;
  platform: "windows" | "linux" | "android" | "macos";
  badge?: string;
}

export interface Project {
  title: string;
  subtitle: string;
  problem: string | React.ReactNode;
  outcome: string[];
  links: { github: string | null; demo: string | null };
  tech: string[];
  decision: string | React.ReactNode;
  architecture: string | React.ReactNode;
  results: string | React.ReactNode;
  failure: string | React.ReactNode;
  honestNote?: string | React.ReactNode;
  /** Collaborators and the split of work. Omitted on solo projects — stating
   *  it only where it applies keeps it meaningful rather than boilerplate. */
  team?: string | React.ReactNode;
  /** Optional multi-platform download entries rendered as a grid at the bottom
   *  of the case study. Only set this when real builds exist. */
  downloads?: DownloadEntry[];
  /** Shown below the download grid when downloads is set. */
  licenseNote?: string;
}

export const PROJECTS: Record<string, Project> = {
  "retailforge": {
    title: "RetailForge POS",
    subtitle: "Modern, offline-first Point of Sale desktop application",
    problem: (
      <>
        <p className="mb-4">
          During my internship at{" "}
          <a
            href="https://averixglobaltech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-2"
          >
            Averix Global Tech
          </a>
          , I developed RetailForge — a modern, offline-first Point of Sale and Business Management desktop application tailored for Indian retail shops. It replaces traditional, clunky billing software with a complete ecosystem combining POS, inventory management, customer loyalty, and analytics.
        </p>
        <p>
          Most billing software in retail shops is ancient and relies heavily on constant internet connectivity. It often lacks modern ecosystem features like integrated customer loyalty, deep analytics, and smooth UI automation.
        </p>
      </>
    ),
    outcome: ["Full POS ecosystem", "Offline-first capability", "Built-in loyalty program"],
    links: { github: "https://codeberg.org/averix-global-tech/retailforge", demo: null },
    tech: ["Tauri v2", "Rust", "React 19", "SQLite", "TypeScript"],
    team: (
      <>
        I served as the Project Lead and the backbone for the backend and overall code quality during my internship at Averix Global Tech. I also designed, built, and shipped the{" "}
        <a
          href="https://averixglobaltech.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline underline-offset-2"
        >
          Averix Global Tech website
        </a>{" "}
        end-to-end.
      </>
    ),
    decision: "Tauri over Electron for the desktop shell. By using Rust for the backend and native system integrations, we massively reduced the memory footprint and bundle size. An offline-first approach using local SQLite ensures that intermittent internet connectivity never stops business operations.",
    architecture: (
      <>
        <p className="mb-4">
          The application is split between a React 19 frontend and a Tauri (Rust) backend. It features barcode scanning, multi-tier pricing, GST calculations, Cash/Card/UPI support, and bill voiding with automatic stock restoration. The inventory module supports image galleries, variant matrices, and GRN tracking.
        </p>
        <p className="mb-4">
          The Customer Retention module includes a built-in points-based loyalty system, customer tier badges (Silver/Gold/Platinum), and win-back campaigns.
        </p>
        <p>
          I also built a self-hosted Ed25519 license key server (<code>retailforge-keygen</code>) in TypeScript to securely manage software activation.
        </p>
      </>
    ),
    results: "Delivered a fully functional production-ready POS system that modernizes retail operations while remaining resilient to network outages.",
    failure: "Building offline-first synchronization logic introduced complex state management challenges, particularly when resolving conflicts after the system comes back online.",
    honestNote: "This project was a deep dive into building serious desktop applications using web technologies paired with a systems programming language. (Averix Global Tech is a private org — demo builds below.)",
    downloads: [
      { label: "Windows — Installer",      sub: ".exe · 5.9 MB · Windows 10/11 x64",          href: "/downloads/RetailForge-Demo-1.0.0.exe",        platform: "windows" },
      { label: "Windows — MSI Package",    sub: ".msi · 8.2 MB · Enterprise / IT deployment",  href: "/downloads/RetailForge_1.0.0_x64_en-US.msi",        platform: "windows" },
      { label: "Linux — AppImage",         sub: ".AppImage · 5.4 MB · Universal, just run it",  href: "/downloads/RetailForge_1.0.0_amd64.AppImage",        platform: "linux" },
      { label: "Linux — Debian / Ubuntu",  sub: ".deb · 4.9 MB · Ubuntu 20.04+, Debian 11+",   href: "/downloads/RetailForge_1.0.0_amd64.deb",             platform: "linux" },
      { label: "Linux — Fedora / RHEL",   sub: ".rpm · 4.9 MB · Fedora 38+, RHEL 9+",         href: "/downloads/RetailForge-1.0.0-1.x86_64.rpm",          platform: "linux" },
      { label: "Android",                  sub: "Temporarily unavailable (too large)",                  href: "#",                  platform: "android", badge: "Coming soon" },
    ],
    licenseNote: "The demo runs with limited functionality. For a full activation key, contact Averix Global Tech at averixglobaltech.com.",
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
    tech: ["FastAPI", "DistilBERT", "PyTorch", "Groq API (Llama 3.3 70B)", "React 18 + Vite", "Docker Compose", "SQLAlchemy", "Nginx"],
    team: "Four-person university project (KR Mangalam University, BCA AI & DS, Sem 4). I led it as team leader and built the backend: the 4-stage detection pipeline, the 217-rule engine, and all attack simulation and red-team tooling. Akash Sharma handled blue-team defense logic. Bhavya Rattan and Lakshya Dangwal built the React frontend and visualization layer.",
    decision: "Rules first, ML second — not rules instead of ML. Stage 1 runs 217 regex patterns across 14 categories with input normalization (homoglyph collapse, zero-width stripping) in ~0.92 ms. Any prompt scoring ≥ 85 gets fast-blocked before touching the classifier. Everything else hits Stage 2: a fine-tuned DistilBERT binary classifier (~7.3 ms warm GPU, ~50 ms CPU). Stage 3 fuses both scores at 0.4 rules / 0.6 model weight, with a dangerous-content floor at 75 so a confident-looking ML prediction can't override a categorical rule match.",
    architecture: "Five frontend tabs (Command Center, Attack Lab, Neural Link, Security Ops, Red Team) talk to a FastAPI backend. The detection pipeline has three stages: Stage 1 — Rule Engine with 217 regex rules across 14 categories: Jailbreak, Prompt Injection, Data Extraction, Encoding/Obfuscation, Social Engineering, Privilege Escalation, Roleplay, Manipulation, Dangerous Content, Token Manipulation, Context Overflow, Indirect Injection, Model Extraction, Multi-Agent Attack. Fast-block path short-circuits at score ≥ 85 (~0.92 ms). Stage 2 — fine-tuned DistilBERT binary classifier (distilbert-base-uncased), GPU or CPU. Stage 3 — weighted score fusion (0.4 rules / 0.6 ML) with a DC-category floor at risk 75, forcing auto-block regardless of ML output. Supporting systems: adaptive per-session risk escalation up to 2.0×, structured JSON audit log, API-key auth, SQLAlchemy for audit/session data, Groq for actual LLM responses. Red-team tooling: single-prompt Attack Lab with full pipeline breakdown, batch runs up to 200 prompts over SSE with live progress, export to CSV / JSON / styled PDF. Docker Compose runs backend + Nginx-fronted React frontend as a two-service stack.",
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
    failure: "C lacks built-in bounds checking or memory safety, meaning a lot of time was spent tracking down segfaults and race conditions rather than iterating on the core logic.",
  },
  "romoc": {
    title: "Romoc",
    subtitle: "Verified, trust-first roommate platform for India",
    problem: "Finding a roommate in India involves massive trust gaps. Existing platforms lack rigorous verification and leave users open to fraud. The goal was to build a trust-first platform with robust KYC, automated verification, and a unified architecture across web, mobile, and admin surfaces.",
    outcome: ["4-app Turborepo monorepo", "Unified Expo/Next.js UI", "Strict bundle budgets"],
    links: { github: null, demo: null },
    tech: ["Next.js", "Expo SDK 52", "React Native", "Fastify", "Zod", "Turborepo", "Docker"],
    decision: "A pnpm workspace/Turborepo monorepo with `apps/{api,web,admin,mobile}` and shared `packages/*`. By bridging React Native primitives to the web via `react-native-web`, screens share components with mobile natively. Strict gzip/Hermes bundle-size budgets were enforced in CI.",
    architecture: (
      <>
        <p className="mb-4">
          The backend is powered by Fastify + Zod, running alongside Postgres (via Drizzle). The frontend consists of a Next.js App Router for web/admin, and an Expo (SDK 52) / React Native app for mobile using Expo Router.
        </p>
        <p>
          Instead of tightly coupling vendor APIs, the architecture uses swappable provider adapters (<code>packages/kyc-adapter</code>, chat, push, analytics) allowing deterministic fakes in development and one-line swaps for production contracts. 
        </p>
      </>
    ),
    results: "Delivered a scalable cross-platform architecture where the mobile, web, and admin dashboards share a unified design system and types. The entire stack is containerized via Docker Compose for easy local provisioning.",
    failure: "The biggest bottleneck was the Expo-Next.js code sharing via react-native-web. Trying to force mobile-first touch gestures to map cleanly onto desktop mouse hover states created a mountain of edge cases that we eventually solved, but it proved that write-once-run-anywhere always has hidden UI tax.",
    honestNote: "This project heavily relies on swappable provider fakes in development until vendor contracts (e.g. KYC, SMS) are finalized, demonstrating a highly decoupled and testable architecture.",
  },
  "averix-website": {
    title: "Averix Global Tech — Website",
    subtitle: "Full-service digital and software studio marketing site",
    problem: "Averix needed a blazing fast, visually impressive marketing site to showcase their services, case studies, and studio story. It had to be SEO-optimized, highly interactive, and maintainable.",
    outcome: ["Astro static-first", "View Transitions API", "Netlify SSR Form"],
    links: { github: null, demo: "https://averixglobaltech.com" },
    tech: ["Astro 7", "Tailwind CSS v4", "GSAP", "Netlify"],
    decision: "Astro 7 was chosen for its static-first, zero-JS-by-default architecture, providing immediate load times. Tailwind v4 was used with custom @theme tokens for a strict design system, and animations were powered by CSS scroll-driven animations, View Transitions, and GSAP.",
    architecture: "Static pages are generated at build time, with a hybrid SSR endpoint (`@astrojs/netlify`) handling the contact form submission and integrating with Resend and Google Sheets webhooks. The design system leverages brand colors (brand-royal, azure) and complex timing easing tokens.",
    results: "A highly performant marketing site with seamless page transitions and rich scroll animations. Form submissions are validated and piped directly into the company's CRM/email systems.",
    failure: "Nothing went wrong technically, but we spent three days arguing over whether the brand blue should be 'royal blue' or 'slightly more royal blue'. Design bikeshedding is the ultimate developer latency.",
  },
  "averix-erp": {
    title: "Averix ERP",
    subtitle: "Internal employee management and Courier ERP systems",
    problem: "Managing internal employees, projects, and courier shipments across Averix's operations and clients (like Classic Express International Courier) required bespoke, fast, and scalable management systems.",
    outcome: ["Monorepo restructure", "Express/React split", "Custom UI badges"],
    links: { github: null, demo: null },
    tech: ["Node.js", "Express", "MongoDB", "React", "Vite", "Tailwind CSS"],
    decision: "Split into focused architectures: `averix-erp` uses npm workspaces/modules pattern with CI, while `AGT Classics Express ERP` relies on a clean Express/MongoDB API and a React/Vite client using React Hook Form.",
    architecture: (
      <>
        <p className="mb-4">
          The ERPs feature secure JWT auth, Cloudinary uploads, and Role-Based Access Control (RBAC). The codebase enforces strict separation between client (React + Vite) and server (Express + Mongoose).
        </p>
        <p>
          Features include dynamic streaks, AI chat integration, attendance tracking, grievance modules, and complex shipment forms.
        </p>
      </>
    ),
    results: "Consolidated internal tools into streamlined, high-performance web applications, dramatically reducing operational friction and improving data visibility for admins.",
    failure: "Managing the real-time calendar syncing for multiple employees concurrently generated database race conditions in MongoDB when we didn't enforce transactions. Moving database writes behind a lock pattern fixed the corruption, but it highlighted MongoDB's weakness in high-contention relational operations.",
  },
  "agt-visa-crm": {
    title: "AGT Visa CRM & Web",
    subtitle: "Website + CRM platform for visa consultancy operations",
    problem: "Visa consultancy operations needed a unified public face and an internal CRM. Juggling separate auth systems and deploy pipelines was inefficient and error-prone.",
    outcome: ["Unified auth", "Caddy reverse proxy", "Dockerized stack"],
    links: { github: null, demo: null },
    tech: ["Astro", "Tailwind", "Express", "MongoDB", "Redis", "Caddy", "Docker"],
    decision: "One domain, one login, one deploy. The public marketing site and the client/staff CRM sit behind the same authentication, routed cleanly via Caddy.",
    architecture: "A multi-container Docker Compose stack consisting of a Caddy reverse proxy, an Astro + Tailwind public website, a Node/Express API (handling auth, RBAC, and data models), a background worker, MongoDB, and Redis. Caddy dynamically routes `/api` and `/` traffic.",
    results: "Delivered a fully integrated, containerized platform that simplifies deployment and provides a seamless experience for both public leads and internal staff.",
    failure: "The Caddy routing configuration was initially too strict, dropping WebSocket connections needed for background worker updates due to missing header forwards. We spent hours debugging why updates were stalling until we fixed the reverse-proxy configuration.",
  },
  "raksha": {
    title: "Raksha — Safe Daily Decision",
    subtitle: "AI-powered safety decision app for families",
    problem: (
      <>
        <p className="mb-4">
          Developed for the <strong>WeatherWise Hack</strong> (Team Code: <code>WWH-RHV8D6</code>). In disaster-prone zones, checking scattered weather forecasts, elevation maps, and historical flood datasets is slow and error-prone.
        </p>
        <p>
          Families need a single, instantly readable, and customized answer to the daily question: <em>"Is it safe to go outside today?"</em>—factoring in household vulnerabilities like children or elderly members.
        </p>
      </>
    ),
    outcome: ["WeatherWise Hack · Team WWH-RHV8D6", "0-10 Live Threat Risk Index", "Groq-LLaMA 3.3 Safety Context Chat"],
    links: { github: "https://github.com/Vic-41148/Raksha", demo: "https://raksha-3x5w.vercel.app/" },
    tech: ["FastAPI", "React", "TypeScript", "Vite", "Groq API (LLaMA 3.3-70b-versatile)", "OpenWeatherMap API", "scikit-learn", "SQLite", "Material 3 CSS"],
    decision: "I chose a decoupled dual-model architecture: a scikit-learn Random Forest Classifier running locally in Python to evaluate mathematical risks (humidity, wind, precipitation, and elevation), paired with Groq's LLaMA 3.3-70b-versatile for generating natural language recommendations. Standard heuristics fail to communicate nuance; an LLM ensures safety advice is context-aware and clear.",
    architecture: (
      <>
        <p className="mb-4">
          The application follows a clean frontend/backend split:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Frontend (React + Vite):</strong> A Material 3 web app featuring five tabs: Safety, Chat, Risk Zones Map, Local Helplines, and Settings. Includes a family profile modifier toggle (adjusts threat scores by 1.4x-1.6x for children/elderly) and a dynamic color palette shifting with risk level.</li>
          <li><strong>Backend (FastAPI):</strong> Handles routing (risk calculation, OpenWeatherMap data, GPS geolocation, and chat history). Includes <code>ml.py</code> running the Random Forest classifier and <code>api.py</code> interfacing with Groq.</li>
          <li><strong>Data Store:</strong> SQLite for storing local alert history.</li>
        </ul>
      </>
    ),
    results: "Provides one clear, actionable safety decision every morning. Won a spot in the WeatherWise Hack (Team Code: WWH-RHV8D6).",
    failure: "The app works fine, but it told my teammate not to go out to buy snacks because of a 0.2mm drizzle. It turns out LLaMA is highly risk-averse when you toggle the family profile modifier to maximum.",
  },
  "smartdesk": {
    title: "ResolveIQ (SmartDesk / NH26)",
    subtitle: "AI-Powered Customer Support & Escalation Engine",
    problem: (
      <>
        <p className="mb-4">
          Built during my first out-of-state hackathon at Surat, Gujarat (National 2026 Hackathon, Team Spark-AI, submission 80-spark-ai). Customer support desks struggle with high ticket volumes, failing to classify issue severity or escalate high-risk tickets to human agents in real time.
        </p>
        <p>
          We needed an instant-escalation workspace chat application that bridges automated AI query resolution and live human agent socket queues.
        </p>
      </>
    ),
    outcome: ["National 2026 Hackathon (Surat)", "Real-time Socket.io ticket escalation", "Tailwind CSS v4 & React 19 Stack"],
    links: { github: "https://github.com/Vic-41148/NH26", demo: "https://smartdesk-neon.vercel.app/" },
    tech: ["React 19", "Vite", "Tailwind CSS v4", "Socket.io-client", "Axios", "Node.js", "Express"],
    decision: "We used React 19's virtual DOM paired with Tailwind v4's build-time engine for blazing fast UI renders. For real-time state syncing across users and support agents, we chose Socket.io to establish persistent, bi-directional TCP connections instead of polling.",
    architecture: (
      <>
        <p className="mb-4">
          The code is structured as an interactive SPA within <code>submissions/80-spark-ai/</code>:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Views:</strong> <code>LandingPage.jsx</code> (ResolveIQ onboarding), <code>ChatPage.jsx</code> (client chat interface), <code>AgentLogin.jsx</code>, and <code>AgentDashboard.jsx</code> (real-time ticket queue management).</li>
          <li><strong>Components:</strong> <code>MessageBubble.jsx</code>, <code>TicketCard.jsx</code> (metadata visualizations), <code>SeverityBadge.jsx</code>, and <code>TypingIndicator.jsx</code>.</li>
          <li><strong>State:</strong> Global user metadata handled via <code>UserContext.jsx</code>.</li>
        </ul>
      </>
    ),
    results: "Delivered a fully responsive support portal containing smart severity detection badges, typing indicators, and seamless Socket.io-driven handoffs from AI replies to the Agent dashboard ticket list.",
    failure: "Nothing broke permanently, but we ran out of coffee at 3 AM in Surat, and my buddy started naming variables in Gujarati. Clean code guidelines do not survive sleep deprivation.",
  },
  "legacy-modernizer": {
    title: "Legacy Modernizer",
    subtitle: "Real-time Java AST modernization platform",
    problem: (
      <>
        <p className="mb-4">
          Built for the <strong>IBM Bob Hackathon</strong>. Enterprise code migration (e.g. Spring Boot 1.5.4 to 3.2.0) is slow and highly prone to regression, requiring manual namespace updates and dependency configuration.
        </p>
        <p>
          The goal was to construct a real-time modernization tracker that lets developers upload legacy Java directories and watch Bob AI refactor imports, entities, and tests in real-time.
        </p>
      </>
    ),
    outcome: ["IBM Bob Hackathon Project", "Automated pom.xml Dependency Upgrade", "Interactive Monaco Code Diff Panel"],
    links: { github: "https://github.com/Vic-41148/Legacy-Modernizer---IBM-Bob-Hackathon", demo: null },
    tech: ["React", "Express", "Node.js", "WebSockets (Socket.io)", "Monaco Editor", "Java Parser / AST"],
    decision: "I integrated the Monaco Editor directly into the React frontend to display split-screen and unified diffs. The architecture streams modernization steps (Configuration → Model Layer → Controllers → Tests → Validation) over WebSockets from an Express runner so developers have complete visibility into the compiler pipeline.",
    architecture: (
      <>
        <p className="mb-4">
          The system operates over a real-time event pipeline:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Runner:</strong> Express server executing Java migrations, upgrading libraries, and outputting structured compiler logs.</li>
          <li><strong>Interactive Panel:</strong> Live color-coded terminal log stream, dynamic File Tree (transitions files from pending to completed states), and Monaco Diff Editor displaying old vs modern namespaces (like <code>javax.persistence</code> to <code>jakarta.persistence</code>).</li>
          <li><strong>Compiler Phases:</strong> Tracked dynamically via a bottom Progress Rail showing five stages of system validation.</li>
        </ul>
      </>
    ),
    results: "Created a working demo that migrates a Spring PetClinic project (33 Java files, 2,000+ lines of code) in under a minute, replacing namespaces, updating Date objects to LocalDate, and verifying compile status.",
    failure: "The tool modernizes legacy code so fast it made our hackathon presentation look fake. We had to add a simulated loading delay just so the judges believed Bob was actually rewriting the files.",
  },
  "smart-livestock-tracker": {
    title: "Cattle Monitoring Collar (Smart Livestock Tracker)",
    subtitle: "IoT wearable bovine health tracker & data pipeline",
    problem: (
      <>
        <p className="mb-4">
          Developed during an internship at <strong>ROTORS</strong> in collaboration with the <strong>KEIC Foundation</strong> (KR Mangalam University). Livestock management in off-grid rural regions suffers from lack of health metrics and live location tracking, making early illness detection and theft prevention nearly impossible.
        </p>
        <p>
          We needed to design a low-power, wearable collar prototype with on-device telemetry and an remote monitoring dashboard.
        </p>
      </>
    ),
    outcome: ["ROTORS & KEIC Foundation Internship", "Animated On-Device OLED UI", "Multi-Sensor Telemetry Pipeline"],
    links: { github: "https://github.com/Vic-41148/smart-livestock-tracker", demo: null },
    tech: ["ESP32 Microcontroller", "C++ (Arduino)", "Python", "I2C Communication Protocol", "OLED Display (128x64)", "GPS Protocol"],
    decision: "We chose the ESP32 for its built-in Wi-Fi/Bluetooth capabilities and low-power sleep modes. We integrated multiple digital sensors over I2C and OneWire, opting for local memory-buffered queue telemetry to prevent data loss in rural blind spots.",
    architecture: (
      <>
        <p className="mb-4">
          The hardware-software stack consists of:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Wearable Hardware (ESP32):</strong> Controls data collection in <code>finalproject.ino</code>. Interfaces with a <code>MAX30100</code> (Heart Rate & SpO2), a <code>DS18B20</code> (body temperature probe), and a <code>Neo-6M</code> GPS module. Power is regulated by a Li-ion battery via a boost converter.</li>
          <li><strong>Device UI:</strong> 128x64 I2C OLED display cycling through data screens (BPM, humidity, temperature comparisons, GPS coordinates, and animated status icons).</li>
          <li><strong>Ingestion & Dashboard:</strong> Python ingestion scripts (like <code>geolocate.py</code>) that parse incoming sensor payloads, store alert logs, and plot location coordinates on a web mapping dashboard.</li>
        </ul>
        <p className="mt-2 text-xs text-text-muted">
          Team Alpha Q: Aditya (Leader), Akash Sharma, Lakshya, Anurag. Mentorship: KEIC Foundation & K.R. Mangalam University.
        </p>
      </>
    ),
    results: "Built a fully wired, working breadboard prototype collar that cycles live health readings, formats location updates on an animated OLED display, and transmits maps data to a remote Python monitoring client.",
    failure: "Honestly? Cows are terrible beta testers. They don't respect geofences, they try to chew on the breadboard, and they have absolutely zero interest in tracking their real-time heart rate.",
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
