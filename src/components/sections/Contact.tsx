"use client";

import { useState, useCallback } from "react";
import { Send, Check, Mail, Sun, Moon, FileText } from "lucide-react";
import { cn, trackSpotlight } from "@/lib/utils";
import { Reveal, StaggerReveal, StaggerItem, MaskText } from "@/components/Reveal";
import { Ghost } from "@/components/Ghost";
import { motion } from "motion/react";
import { useTheme } from "@/lib/theme";
import { CONTACT_EMAIL } from "@/lib/constants";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

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
              href={`mailto:${CONTACT_EMAIL}`}
              onMouseMove={trackSpotlight}
              className="relative card-spotlight flex items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-text-muted transition-all group"
            >
              <Mail className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-text-muted">{CONTACT_EMAIL}</p>
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
