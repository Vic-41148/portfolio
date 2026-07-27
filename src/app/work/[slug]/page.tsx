import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, Users } from "lucide-react";
import type { Metadata } from "next";
import { GitHubIcon } from "@/components/icons";
import { PROJECTS } from "@/lib/projects";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS[slug];
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.problem.slice(0, 160),
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS[slug];

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
