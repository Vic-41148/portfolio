"use client";

import { ArrowUpRight, Calendar } from "lucide-react";
import Link from "next/link";
import { Reveal, StaggerReveal, StaggerItem, MaskText } from "@/components/Reveal";
import { trackSpotlight } from "@/lib/utils";

const posts = [
  {
    slug: "on-device-transfer-learning",
    title: "Training a CV Model in Your Browser",
    excerpt: "How MobileNet feature extraction + a tiny classifier can learn new gestures in under 10 seconds — all in JavaScript, no server.",
    date: "Jun 2026",
    readTime: "8 min",
  },
  {
    slug: "building-a-game-boy-emulator",
    title: "What I Learned Building a Game Boy Emulator",
    excerpt: "CPU cycles, memory timing, audio synchronization — the deep systems lessons from writing an emulator from scratch in C++.",
    date: "May 2026",
    readTime: "10 min",
  },
  {
    slug: "measuring-llm-defenses",
    title: "How Do You Know Your LLM Defense Actually Works?",
    excerpt: "Building a systematic evaluation framework for prompt injection and jailbreak detection — and why pass/fail isn't enough.",
    date: "Apr 2026",
    readTime: "12 min",
  },
];

export function Writing() {
  return (
    <section id="writing" className="py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">
                <span className="motif-bracket" />Writing
              </p>
              <h2 className="section-heading">
                <MaskText>Things I learned the hard way</MaskText>
              </h2>
            </div>
            <Link
              href="/writing"
              className="hidden sm:flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors shrink-0"
            >
              View all
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/writing/${post.slug}`}
                onMouseMove={trackSpotlight}
                className="group relative block rounded-2xl border border-border bg-surface p-6 card-hover card-spotlight"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-5 right-6 font-mono text-xs text-text-muted/70 transition-colors group-hover:text-accent"
                >
                  0{i + 1}
                </span>
                <div className="flex items-center gap-3 text-xs text-text-muted font-mono mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-lg font-display font-normal mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <Reveal>
          <Link
            href="/writing"
            className="sm:hidden mt-6 flex items-center justify-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            View all posts
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
