import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
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
    description: project.subtitle,
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
            <div className="text-sm text-text-secondary leading-relaxed">{project.team}</div>
          </div>
        )}

        <div className="space-y-12">
          <section>
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-text-primary">
              The problem
            </h2>
            <div className="text-text-secondary leading-relaxed">{project.problem}</div>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-text-primary">
              Key decision
            </h2>
            <div className="text-text-secondary leading-relaxed">{project.decision}</div>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-text-primary">
              How it works
            </h2>
            <div className="text-text-secondary leading-relaxed">{project.architecture}</div>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-text-primary">
              Results
            </h2>
            <div className="text-text-secondary leading-relaxed">{project.results}</div>
          </section>

          <section className="p-6 rounded-2xl border border-demo-warning/20 bg-demo-warning/5">
            <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-demo-warning">
              What went wrong
            </h2>
            <div className="text-text-secondary leading-relaxed">{project.failure}</div>
          </section>

          {project.honestNote && (
            <section className="p-6 rounded-2xl border border-border bg-surface">
              <div className="text-sm text-text-muted italic">{project.honestNote}</div>
            </section>
          )}

          {/* ── Download grid ── */}
          {project.downloads && project.downloads.length > 0 && (
            <section>
              <h2 className="text-lg font-display font-semibold tracking-tight mb-1 text-text-primary">
                Download demo
              </h2>
              <p className="text-sm text-text-secondary mb-5">
                Fully functional demo builds — no setup required on most platforms. To activate a full
                license,{" "}
                <a
                  href="https://averixglobaltech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline underline-offset-2"
                >
                  contact Averix Global Tech
                </a>
                {" "}for a key.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {project.downloads.map((dl) => (
                  <a
                    key={dl.href}
                    href={dl.href}
                    download
                    className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:border-accent/40 hover:bg-accent/5 transition-all"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-elevated flex items-center justify-center">
                      {dl.platform === "windows" && (
                        <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8"/>
                        </svg>
                      )}
                      {dl.platform === "linux" && (
                        <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.504 0c-.155 0-.315.008-.48.021C7.576.185 3.976 2.58 2.132 6.15.285 9.72.346 13.963 2.3 17.467c.523.958 1.168 1.835 1.93 2.602L2.926 22.5a.667.667 0 00.57 1.007h.059l1.876-.244c.819.348 1.672.607 2.548.773L8.31 25.1a.667.667 0 001.312-.133l.283-1.697c.48.054.964.081 1.45.081.486 0 .97-.027 1.45-.081l.284 1.697a.667.667 0 001.312.133l.326-1.964a13.476 13.476 0 002.549-.773l1.876.244h.058a.667.667 0 00.571-1.007l-1.305-2.43a12.816 12.816 0 001.93-2.603c1.953-3.503 2.015-7.746.167-11.316C18.527 2.58 14.927.185 10.984.021A8.765 8.765 0 0012.504 0zm0 0"/>
                        </svg>
                      )}
                      {dl.platform === "android" && (
                        <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z"/>
                        </svg>
                      )}
                      {dl.platform === "macos" && (
                        <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 110 16A8 8 0 0112 4zm-.5 2v6.5l5.25 3.25-.75 1.23L10 13.5V6h1.5z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                        {dl.label}
                        {dl.badge && (
                          <span className="ml-2 text-xs font-mono px-1.5 py-0.5 rounded bg-demo-success/15 text-demo-success">
                            {dl.badge}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">{dl.sub}</p>
                    </div>
                    <svg className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </a>
                ))}
              </div>

              {project.licenseNote && (
                <div className="mt-5 flex gap-3 p-4 rounded-xl border border-border bg-surface/50">
                  <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    <strong className="text-text-primary">License key required for full access.</strong>{" "}
                    {project.licenseNote.replace("averixglobaltech.com", "").trimEnd()}{" "}
                    <a
                      href="https://averixglobaltech.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline underline-offset-2"
                    >
                      averixglobaltech.com
                    </a>
                    .
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
