"use client";

import { useState, useCallback } from "react";
import { Mail, Send, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { CONTACT_EMAIL } from "@/lib/constants";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

type SignupState = "idle" | "sending" | "success" | "error";

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SignupState>("idle");

  const [error, setError] = useState("");

  const handleSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Signup failed");
      setState("success");
      setEmail("");
      // Long enough to actually read "check your inbox" before it resets.
      setTimeout(() => setState("idle"), 8000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      setState("error");
      setTimeout(() => setState("idle"), 5000);
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
                {state === "success"
                  ? "Check your inbox — confirm the link and you're on the list."
                  : state === "error"
                    ? error
                    : "New posts only. One click to unsubscribe, in every email."}
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
                  <>Check your inbox <Check className="w-4 h-4" /></>
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
