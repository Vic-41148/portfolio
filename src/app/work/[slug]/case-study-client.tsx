"use client";

import { useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import type { Project } from "@/lib/projects";

const ease = [0.22, 1, 0.36, 1] as const;

function FadeSection({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CaseStudyClient({
  project,
}: {
  project: Project & { title: string };
}) {
  return (
    <article className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            href="/#work"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to work
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease }}
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-3">
            {project.title}
          </h1>
          <p className="text-xl text-text-secondary">{project.subtitle}</p>
        </motion.div>

        {/* Tech chips — stagger in */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
          }}
        >
          {project.tech.map((t) => (
            <motion.span
              key={t}
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                show: { opacity: 1, scale: 1, transition: { ease } },
              }}
              whileHover={{ scale: 1.08, y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-elevated border border-border text-text-muted cursor-default"
            >
              {t}
            </motion.span>
          ))}
        </motion.div>

        {/* Outcome badges */}
        <motion.div
          className="flex flex-wrap gap-3 mb-12"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
          }}
        >
          {project.outcome.map((o) => (
            <motion.span
              key={o}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0, transition: { ease } },
              }}
              className="text-sm px-3 py-1.5 rounded-lg bg-accent-muted border border-accent/30 text-accent font-mono"
            >
              {o}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA links */}
        <motion.div
          className="flex gap-4 mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45, ease }}
        >
          {project.links.github && (
            <motion.a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary hover:border-text-muted transition-all"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <GitHubIcon className="w-4 h-4" />
              Source
            </motion.a>
          )}
          {project.links.demo && (
            <motion.a
              href={project.links.demo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:brightness-110 transition-all"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <ExternalLink className="w-4 h-4" />
              Live demo
            </motion.a>
          )}
        </motion.div>

        {/* Team note */}
        {project.team && (
          <FadeSection delay={0.1} className="mb-12">
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-accent" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-text-muted">
                  Team project
                </h2>
              </div>
              <div className="text-sm text-text-secondary leading-relaxed">
                {project.team}
              </div>
            </div>
          </FadeSection>
        )}

        {/* Content sections */}
        <div className="space-y-12">
          {(
            [
              { key: "problem", label: "The problem", content: project.problem },
              { key: "decision", label: "Key decision", content: project.decision },
              { key: "architecture", label: "How it works", content: project.architecture },
              { key: "results", label: "Results", content: project.results },
            ] as const
          ).map(({ key, label, content }, i) => (
            <FadeSection key={key} delay={i * 0.05}>
              <section>
                <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-text-primary">
                  {label}
                </h2>
                <div className="text-text-secondary leading-relaxed">{content}</div>
              </section>
            </FadeSection>
          ))}

          {/* What went wrong — amber highlight */}
          <FadeSection delay={0.2}>
            <section className="p-6 rounded-2xl border border-demo-warning/20 bg-demo-warning/5">
              <h2 className="text-lg font-display font-semibold tracking-tight mb-3 text-demo-warning">
                What went wrong
              </h2>
              <div className="text-text-secondary leading-relaxed">{project.failure}</div>
            </section>
          </FadeSection>

          {project.honestNote && (
            <FadeSection delay={0.1}>
              <section className="p-6 rounded-2xl border border-border bg-surface">
                <div className="text-sm text-text-muted italic">{project.honestNote}</div>
              </section>
            </FadeSection>
          )}

          {/* Download grid */}
          {project.downloads && project.downloads.length > 0 && (
            <FadeSection delay={0.1}>
              <section>
                <h2 className="text-lg font-display font-semibold tracking-tight mb-1 text-text-primary">
                  Download demo
                </h2>
                <p className="text-sm text-text-secondary mb-5">
                  Fully functional demo builds — no setup required on most platforms.
                  To activate a full license,{" "}
                  <a
                    href="https://averixglobaltech.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline underline-offset-2"
                  >
                    contact Averix Global Tech
                  </a>{" "}
                  for a key.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {project.downloads.map((dl, i) => (
                    <motion.a
                      key={dl.href}
                      href={dl.href}
                      download
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06, ease }}
                      whileHover={{ y: -2, borderColor: "var(--accent)" }}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-surface transition-colors hover:bg-accent/5"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-elevated flex items-center justify-center">
                        {dl.platform === "windows" && (
                          <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8" />
                          </svg>
                        )}
                        {dl.platform === "linux" && (
                          <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.504 0c-.155 0-.315.008-.48.021C7.576.185 3.976 2.58 2.132 6.15.285 9.72.346 13.963 2.3 17.467c.523.958 1.168 1.835 1.93 2.602L2.926 22.5a.667.667 0 00.57 1.007h.059l1.876-.244c.819.348 1.672.607 2.548.773L8.31 25.1a.667.667 0 001.312-.133l.283-1.697c.48.054.964.081 1.45.081.486 0 .97-.027 1.45-.081l.284 1.697a.667.667 0 001.312.133l.326-1.964a13.476 13.476 0 002.549-.773l1.876.244h.058a.667.667 0 00.571-1.007l-1.305-2.43a12.816 12.816 0 001.93-2.603c1.953-3.503 2.015-7.746.167-11.316C18.527 2.58 14.927.185 10.984.021A8.765 8.765 0 0012.504 0zm0 0" />
                          </svg>
                        )}
                        {dl.platform === "android" && (
                          <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z" />
                          </svg>
                        )}
                        {dl.platform === "macos" && (
                          <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 110 16A8 8 0 0112 4zm-.5 2v6.5l5.25 3.25-.75 1.23L10 13.5V6h1.5z" />
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </motion.a>
                  ))}
                </div>

                {project.licenseNote && (
                  <div className="mt-5 flex gap-3 p-4 rounded-xl border border-border bg-surface/50">
                    <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      <strong className="text-text-primary">License key required for full access.</strong>{" "}
                      {project.licenseNote.replace("averixglobaltech.com", "").trimEnd()}{" "}
                      <a href="https://averixglobaltech.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline underline-offset-2">
                        averixglobaltech.com
                      </a>
                      .
                    </p>
                  </div>
                )}
              </section>
            </FadeSection>
          )}
        </div>
      </div>
    </article>
  );
}
