"use client";

import { useState, useCallback } from "react";
import { Mail, Send, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { CONTACT_EMAIL } from "@/lib/constants";

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

type SignupState = "idle" | "sending" | "success" | "error";

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SignupState>("idle");

  const handleSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter signup",
          email,
          message: `New footer signup requesting updates: ${email}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setState("success");
      setEmail("");
      setTimeout(() => setState("idle"), 3000);
    } catch (err) {
      console.error("Newsletter signup failed:", err);
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }, [email]);

  return (
    <Reveal>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-10 border-b border-border">
            <div>
              <p className="font-display text-2xl sm:text-3xl uppercase leading-tight mb-2">
                Get pinged when I ship something new.
              </p>
              <p className="text-sm text-text-secondary">
                No spam, no newsletter platform — it just emails me and I&apos;ll follow up.
              </p>
            </div>
            <form onSubmit={handleSignup} className="flex gap-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="flex-1 min-w-0 px-4 py-3 rounded-full bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted input-glow"
              />
              <motion.button
                type="submit"
                disabled={state === "sending" || state === "success"}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground text-sm font-bold uppercase tracking-wide hover:brightness-110 disabled:cursor-not-allowed"
              >
                {state === "success" ? (
                  <>You&apos;re in <Check className="w-4 h-4" /></>
                ) : state === "sending" ? (
                  "..."
                ) : state === "error" ? (
                  "Retry"
                ) : (
                  <>Sign up <Send className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-display text-text-secondary hover:text-text-primary transition-colors"
              >
                AS
              </Link>
              <span className="text-sm text-text-muted">
                &copy; {year} Aditya Shibu
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/Vic-41148"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/adityashibu41148"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </Reveal>
  );
}
