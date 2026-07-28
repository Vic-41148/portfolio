"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, GitPullRequest, Wrench } from "lucide-react";
import { GitHubIcon } from "@/components/icons";

const QUESTS = [
  {
    category: "Open Source",
    items: [
      {
        title: "Hyprland — Workspace swipe layout fix",
        description:
          "Fixed a bug in Hyprland's scrolling layout where the top layer (like Waybar) wouldn't hide correctly when swiping into a fullscreen window. Traced it to fullscreen state checks relying on cached booleans rather than the active window state.",
        href: "/side-quests/hyprland-fullscreen-swipe",
        icon: GitPullRequest,
        internal: true,
      },
    ],
  },
  {
    category: "Hackathons",
    items: [
      {
        title: "Raksha — Safe Daily Decision",
        description:
          "Made for WeatherWise Hack. An AI-powered safety decision app for families, factoring in real-time weather, flood risks, and historical disaster data via FastAPI, React, and Groq LLaMA 3.3.",
        href: "/work/raksha",
        icon: Wrench,
        internal: true,
      },
      {
        title: "SmartDesk / NH26",
        description:
          "My first out-of-state hackathon at Surat, Gujarat. Travelled by train with two friends to build this workspace optimization application.",
        href: "/work/smartdesk",
        icon: Wrench,
        internal: true,
      },
      {
        title: "Legacy Modernizer",
        description:
          "A tool to modernize legacy systems, built for the IBM Bob Hackathon.",
        href: "/work/legacy-modernizer",
        icon: GitHubIcon,
        internal: true,
      },
    ],
  },
  {
    category: "Internships",
    items: [
      {
        title: "Smart Livestock Tracker",
        description:
          "An internship project building a smart tracking system for livestock through wearable tech and data pipelines.",
        href: "/work/smart-livestock-tracker",
        icon: GitHubIcon,
        internal: true,
      },
    ],
  },
  {
    category: "Fun & Tinkering",
    items: [
      {
        title: "Somn — Local-first Android Sleep Tracker",
        description:
          "Built a privacy-first sleep tracker in Kotlin/Jetpack Compose. It uses raw accelerometer data and 30-second epoch classification to detect sleep stages (Wake, Light, Deep, REM) entirely on-device, with zero network permissions. Includes age-calibrated scoring and biological profile support (menstrual cycles, ADHD consistency adjustments).",
        href: "/side-quests/somn",
        icon: Wrench,
        internal: true,
      },
      {
        title: "Discord Bot for Server Logs",
        description:
          "A small Go bot that pipes linux server ssh attempts into a private Discord channel.",
        href: "/side-quests/discord-bot",
        icon: GitHubIcon,
        internal: true,
      },
    ],
  },
];

// Flatten all items for global index (stagger across sections)
const allItems = QUESTS.flatMap((s) => s.items);

function QuestCard({
  item,
  globalIndex,
}: {
  item: (typeof allItems)[number];
  globalIndex: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  const Wrapper = item.internal ? Link : "a";
  const extraProps = item.internal
    ? {}
    : { target: "_blank", rel: "noopener noreferrer" };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, filter: "blur(3px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.5, delay: globalIndex * 0.06, ease: [0.22, 1, 0.36, 1] as const }}
    >

      <Wrapper
        href={item.href}
        {...extraProps}
        className="group relative block p-6 rounded-2xl border border-border bg-surface overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setSpotlight((s) => ({ ...s, visible: false }))}
      >
        {/* Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: spotlight.visible ? 1 : 0,
            background: `radial-gradient(240px circle at ${spotlight.x}px ${spotlight.y}px, var(--accent)14, transparent 70%)`,
          }}
        />

        {/* Bottom shimmer */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/25 transition-all duration-500" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <motion.div
              className="mt-1 flex-shrink-0"
              whileHover={{ scale: 1.2, rotate: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <item.icon className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
            </motion.div>
            <div>
              <h3 className="text-lg font-display font-normal group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
          <motion.div
            initial={{ x: 0, y: 0 }}
            whileHover={{ x: 3, y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
          </motion.div>
        </div>
      </Wrapper>
    </motion.div>
  );
}

const hdr = {
  hidden: { opacity: 0, y: -14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function SideQuestsPage() {
  let globalIdx = 0;

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div custom={0} variants={hdr} initial="hidden" animate="show">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back home
          </Link>
        </motion.div>

        <div className="flex items-center justify-between gap-4 mb-3">
          <motion.h1
            custom={1}
            variants={hdr}
            initial="hidden"
            animate="show"
            className="text-4xl sm:text-5xl font-display font-normal"
          >
            Side Quests
          </motion.h1>
          <motion.div custom={2} variants={hdr} initial="hidden" animate="show">
            <Link
              href="/writing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-secondary hover:text-accent hover:border-accent/30 transition-colors focus-ring"
            >
              Read writing <ArrowUpRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>

        <motion.p
          custom={3}
          variants={hdr}
          initial="hidden"
          animate="show"
          className="text-lg text-text-secondary mb-16 max-w-xl"
        >
          Not everything needs to be a massive ML pipeline. Here are open source
          contributions, late-night experiments, and things I built just for fun.
        </motion.p>

        <div className="space-y-16">
          {QUESTS.map((section, sIdx) => (
            <section key={section.category}>
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm font-mono text-text-muted uppercase tracking-wider mb-6"
              >
                {section.category}
              </motion.h2>
              <div className="grid gap-4">
                {section.items.map((item) => {
                  const idx = globalIdx++;
                  return <QuestCard key={item.title} item={item} globalIndex={idx} />;
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
