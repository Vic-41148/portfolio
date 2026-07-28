"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowLeft, ArrowUpRight,
  Shield, Brain, Terminal, Store,
  Globe, Smartphone, Database, Briefcase, Cpu, LineChart
} from "lucide-react";
import { PROJECTS } from "@/lib/projects";
import { cn } from "@/lib/utils";

// Map the slugs to their visual treatment since PROJECTS doesn't contain UI metadata
const allProjects = [
  {
    slug: "retailforge",
    icon: Store,
    tint: "text-accent bg-accent/15 border-accent/20",
    color: "var(--accent)",
  },
  {
    slug: "romoc",
    icon: Smartphone,
    tint: "text-demo-success bg-demo-success/15 border-demo-success/20",
    color: "var(--demo-success)",
  },
  {
    slug: "averix-website",
    icon: Globe,
    tint: "text-accent bg-accent/15 border-accent/20",
    color: "var(--accent)",
  },
  {
    slug: "averix-erp",
    icon: Database,
    tint: "text-demo-warning bg-demo-warning/15 border-demo-warning/20",
    color: "var(--demo-warning)",
  },
  {
    slug: "agt-visa-crm",
    icon: Briefcase,
    tint: "text-demo-success bg-demo-success/15 border-demo-success/20",
    color: "var(--demo-success)",
  },
  {
    slug: "raksha",
    icon: Shield,
    tint: "text-demo-warning bg-demo-warning/15 border-demo-warning/20",
    color: "var(--demo-warning)",
  },
  {
    slug: "smartdesk",
    icon: Globe,
    tint: "text-accent bg-accent/15 border-accent/20",
    color: "var(--accent)",
  },
  {
    slug: "legacy-modernizer",
    icon: Terminal,
    tint: "text-demo-success bg-demo-success/15 border-demo-success/20",
    color: "var(--demo-success)",
  },
  {
    slug: "smart-livestock-tracker",
    icon: Cpu,
    tint: "text-demo-warning bg-demo-warning/15 border-demo-warning/20",
    color: "var(--demo-warning)",
  },
  {
    slug: "secure-llm-inference-platform",
    icon: Shield,
    tint: "text-demo-success bg-demo-success/15 border-demo-success/20",
    color: "var(--demo-success)",
  },
  {
    slug: "webcam-transfer-learning",
    icon: Brain,
    tint: "text-demo-warning bg-demo-warning/15 border-demo-warning/20",
    color: "var(--demo-warning)",
  },
  {
    slug: "codeshield",
    icon: Terminal,
    tint: "text-accent bg-accent/15 border-accent/20",
    color: "var(--accent)",
  },
  {
    slug: "game-boy-emulator",
    icon: Cpu,
    tint: "text-accent bg-accent/15 border-accent/20",
    color: "var(--accent)",
  },
  {
    slug: "primetrade-mlops",
    icon: LineChart,
    tint: "text-demo-warning bg-demo-warning/15 border-demo-warning/20",
    color: "var(--demo-warning)",
  },
];

function ProjectRow({
  p,
  i,
  project,
}: {
  p: (typeof allProjects)[number];
  i: number;
  project: NonNullable<(typeof PROJECTS)[string]>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    });
  };

  const num = String(i + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.55,
        delay: i * 0.055,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
    >
      <Link
        href={`/work/${p.slug}`}
        className="group relative block rounded-2xl border border-border bg-surface overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setSpotlight((s) => ({ ...s, visible: false }))}
      >
        {/* Spotlight glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: spotlight.visible ? 1 : 0,
            background: `radial-gradient(280px circle at ${spotlight.x}px ${spotlight.y}px, ${p.color}18, transparent 70%)`,
          }}
        />

        {/* Left accent bar — scales in on hover */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl origin-left"
          style={{ backgroundColor: p.color }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        />

        <div className="relative z-10 flex items-start justify-between gap-4 p-6 sm:p-7">
          <div className="flex gap-4 sm:gap-5 min-w-0">
            {/* Icon + number */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <motion.div
                className={cn(
                  "w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border",
                  p.tint
                )}
                whileHover={{ scale: 1.1, rotate: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <p.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[9px] font-mono tracking-widest text-text-muted/50 select-none">
                {num}
              </span>
            </div>

            {/* Text */}
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-display font-normal mb-1.5 group-hover:text-accent transition-colors duration-200 leading-snug">
                {project.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 max-w-xl">
                {project.subtitle}
              </p>

              {/* Tech chips */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded border border-border/50 bg-elevated text-[10px] uppercase font-mono text-text-muted"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 4 && (
                  <span className="px-2 py-0.5 rounded border border-border/50 bg-elevated text-[10px] uppercase font-mono text-text-muted">
                    +{project.tech.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Arrow — slides diagonally on hover */}
          <motion.div
            className="shrink-0 mt-1 hidden sm:block"
            initial={{ x: 0, y: 0 }}
            whileHover={{ x: 3, y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors duration-200" />
          </motion.div>
        </div>

        {/* Bottom border shimmer on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/30 transition-all duration-500" />
      </Link>
    </motion.div>
  );
}

const headerVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function WorkIndexPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div custom={0} variants={headerVariants} initial="hidden" animate="visible">
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
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl font-display font-normal"
          >
            Selected Work
          </motion.h1>

          <motion.div
            custom={2}
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-2"
          >
            <Link
              href="/side-quests"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-secondary hover:text-accent hover:border-accent/30 transition-colors focus-ring"
            >
              Side Quests <ArrowUpRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>

        <motion.p
          custom={3}
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-lg text-text-secondary mb-16 max-w-xl"
        >
          Deep dives into systems I&apos;ve built.
        </motion.p>

        {/* Project list */}
        <div className="space-y-4">
          {allProjects.map((p, i) => {
            const project = PROJECTS[p.slug as keyof typeof PROJECTS];
            if (!project) return null;
            return <ProjectRow key={p.slug} p={p} i={i} project={project} />;
          })}
        </div>
      </div>
    </div>
  );
}
