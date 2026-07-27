import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Shield, Brain, Terminal, Store } from "lucide-react";
import type { Metadata } from "next";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "A collection of case studies, ML pipelines, and production systems.",
};

// Map the slugs to their visual treatment since PROJECTS doesn't contain UI metadata
const allProjects = [
  {
    slug: "secure-llm-inference-platform",
    icon: Shield,
    tint: "text-demo-success bg-demo-success/15 border-demo-success/20",
  },
  {
    slug: "retailforge",
    icon: Store,
    tint: "text-accent bg-accent/15 border-accent/20",
  },
  {
    slug: "codeshield",
    icon: Terminal,
    tint: "text-accent bg-accent/15 border-accent/20",
  },
  {
    slug: "neuro-learn-visualizer",
    icon: Brain,
    tint: "text-demo-warning bg-demo-warning/15 border-demo-warning/20",
  },
];

export default function WorkIndexPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back home
        </Link>

        <div className="flex items-center justify-between gap-4 mb-3">
          <h1 className="text-4xl sm:text-5xl font-display font-normal">
            Selected Work
          </h1>
          <div className="flex gap-2">
            <Link
              href="/side-quests"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-secondary hover:text-accent hover:border-accent/30 transition-colors focus-ring"
            >
              Side Quests <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        
        <p className="text-lg text-text-secondary mb-16 max-w-xl">
          Deep dives into systems I've built.
        </p>

        <div className="space-y-6">
          {allProjects.map((p, i) => {
            const project = PROJECTS[p.slug as keyof typeof PROJECTS];
            if (!project) return null;

            return (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="group block p-6 rounded-2xl border border-border bg-surface card-hover relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex gap-4">
                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${p.tint}`}>
                      <p.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
                          0{i + 1}
                        </span>
                        <h3 className="text-xl font-display font-normal group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed mb-4">
                        {project.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.slice(0, 4).map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded border border-border/50 bg-elevated text-[10px] uppercase font-mono text-text-muted">
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
                  <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1 hidden sm:block" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
