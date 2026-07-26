"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal, StaggerReveal, StaggerItem, MaskText } from "@/components/Reveal";
import { trackSpotlight } from "@/lib/utils";
import { LinkedInIcon } from "@/components/icons";

const LINKEDIN_URL = "https://linkedin.com/in/adityashibu41148";

// TODO(real-posts): paste real LinkedIn posts here — url must be the actual
// post permalink, title/excerpt your own words. Do NOT invent posts; the
// section shows only the follow card until entries exist.
const posts: {
  title: string;
  excerpt: string;
  date: string;
  url: string;
}[] = [];

export function LinkedInPosts() {
  return (
    <section id="linkedin" className="py-24 sm:py-32 border-t border-border relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">
                <span className="motif-hash">#</span>LinkedIn
              </p>
              <h2 className="section-heading">
                <MaskText>Short-form, shipped daily-ish</MaskText>
              </h2>
              <p className="section-desc">
                Longer writing lives above. The build-in-public updates, hot takes,
                and progress notes land on LinkedIn first.
              </p>
            </div>
          </div>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <StaggerItem key={post.url}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={trackSpotlight}
                className="group relative block rounded-2xl border border-border bg-surface p-6 card-hover card-spotlight h-full"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-5 right-6 font-mono text-xs text-text-muted/70 transition-colors group-hover:text-accent"
                >
                  0{i + 1}
                </span>
                <div className="flex items-center gap-2 text-xs text-text-muted font-mono mb-3">
                  <LinkedInIcon className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                </div>
                <h3 className="text-lg font-display font-semibold tracking-tight mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{post.excerpt}</p>
              </a>
            </StaggerItem>
          ))}

          <StaggerItem className={posts.length === 0 ? "md:col-span-3" : ""}>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={trackSpotlight}
              className="group relative flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6 card-hover card-spotlight h-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent-muted border border-accent/20 flex items-center justify-center shrink-0">
                  <LinkedInIcon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold tracking-tight group-hover:text-accent transition-colors">
                    Follow along on LinkedIn
                  </h3>
                  <p className="text-sm text-text-secondary">
                    The feed gets it first — posts syndicate here once they exist.
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </a>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  );
}
