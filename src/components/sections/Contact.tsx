"use client";

import { useState, useCallback } from "react";
import { Send, Check, Mail, Sun, Moon, FileText } from "lucide-react";
import { cn, trackSpotlight } from "@/lib/utils";
import { Reveal, StaggerReveal, StaggerItem, MaskText } from "@/components/Reveal";
import { Ghost } from "@/components/Ghost";
import { motion } from "motion/react";
import { useTheme } from "@/lib/theme";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

type SubmitState = "idle" | "sending" | "success" | "error";

export function Contact() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const { theme, toggle } = useTheme();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong");
      }

      setState("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setState("idle"), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  }, [formData]);

  return (
    <section id="contact" className="py-24 sm:py-32 border-t border-border relative overflow-hidden">
      <Ghost word="Say hi" className="right-[-1%] top-10" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-12">
            <p className="section-eyebrow">
              <span className="motif-bracket" />Say something
            </p>
            <h2 className="section-heading">
              <MaskText>Let&apos;s build something real</MaskText>
            </h2>
            <p className="section-desc">
              Hard problems, research rabbit holes, the right opportunity —
              I&apos;m in. Drop a line, skip the small talk. I reply within 48
              hours, not &ldquo;within 2 business days.&rdquo;
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <StaggerItem className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  id="name"
                  type="text"
                  required
                  aria-label="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted transition-all input-glow"
                />
                <input
                  id="email"
                  type="email"
                  required
                  aria-label="Your email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted transition-all input-glow"
                />
              </div>

              <textarea
                id="message"
                required
                aria-label="Your message"
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="What are you working on?"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted transition-all input-glow resize-none"
              />

              <motion.button
                type="submit"
                disabled={state === "sending" || state === "success"}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all",
                  "focus-ring btn-sheen",
                  state === "success"
                    ? "bg-demo-success text-demo-success-foreground"
                    : "bg-accent text-accent-foreground hover:brightness-110",
                  (state === "sending" || state === "success") &&
                    "cursor-not-allowed"
                )}
              >
                {state === "idle" && (
                  <>
                    Send message
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
                {state === "sending" && (
                  <>
                    Sending
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </>
                )}
                {state === "success" && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    Sent! I&apos;ll reply within 48h
                    <Check className="w-3.5 h-3.5" />
                  </motion.span>
                )}
                {state === "error" && (
                  <>
                    {errorMsg || "Something went wrong — try again"}
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            </form>
          </StaggerItem>

          <StaggerItem className="md:col-span-2 flex flex-col gap-4">
            <a
              href="mailto:adityashibu275898@gmail.com"
              onMouseMove={trackSpotlight}
              className="relative card-spotlight flex items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-text-muted transition-all group"
            >
              <Mail className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-text-muted">adityashibu275898@gmail.com</p>
              </div>
            </a>
            <a
              href="https://github.com/Vic-41148"
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={trackSpotlight}
              className="relative card-spotlight flex items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-text-muted transition-all group"
            >
              <GitHubIcon className="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
              <div>
                <p className="text-sm font-medium">GitHub</p>
                <p className="text-xs text-text-muted">@Vic-41148</p>
              </div>
            </a>
            <a
              href="https://linkedin.com/in/adityashibu41148"
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={trackSpotlight}
              className="relative card-spotlight flex items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-text-muted transition-all group"
            >
              <LinkedInIcon className="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
              <div>
                <p className="text-sm font-medium">LinkedIn</p>
                <p className="text-xs text-text-muted">/in/adityashibu41148</p>
              </div>
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={trackSpotlight}
              className="relative card-spotlight flex items-center gap-3 p-4 rounded-xl border border-accent/30 bg-accent-muted hover:border-accent/50 transition-all group"
            >
              <FileText className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium">The full bundle</p>
                <p className="text-xs text-text-muted">Résumé + every project, one PDF</p>
              </div>
            </a>

            <button
              onClick={toggle}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-text-muted transition-all group mt-2"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              )}
              <div>
                <p className="text-sm font-medium">{theme === "dark" ? "Light" : "Dark"} mode</p>
                <p className="text-xs text-text-muted">Toggle theme</p>
              </div>
            </button>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  );
}
