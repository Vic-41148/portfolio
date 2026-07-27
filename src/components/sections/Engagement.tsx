"use client";

import { ArrowRight } from "lucide-react";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/Reveal";
import { requestContact } from "@/lib/contact-intent";

const engagements = [
  {
    badge: "Open to",
    title: "Full-time",
    tagline: "One team, one problem, all the way through.",
    points: ["ML / CV engineering roles", "Systems-adjacent teams", "Relocation on the table"],
    cta: "Talk about a role",
    intent:
      "Hi Aditya — I'm reaching out about a full-time role.\n\nThe team and what we're working on:\n",
  },
  {
    badge: "Available",
    title: "Contract",
    tagline: "Scoped work — a model to ship, a pipeline to fix.",
    points: ["Fixed-scope engagements", "Short research spikes", "Remote, any timezone"],
    cta: "Scope a project",
    intent:
      "Hi Aditya — I'd like to scope a contract project.\n\nWhat needs building, and the rough timeline:\n",
  },
];

/** Packs-grid analog — engagement types instead of bundle pricing. No fake
 *  discounts; this isn't a store. Each card sends you to the contact form with
 *  the relevant intent already written, so "pick a lane" actually picks one. */
export function Engagement() {
  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center mb-14">
            <p className="section-eyebrow !text-center">
              <span className="motif-bracket" />How we could work together
            </p>
            <h2 className="section-heading">Pick a lane.</h2>
          </div>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {engagements.map((e) => (
            <StaggerItem
              key={e.title}
              className="engagement-card group relative rounded-2xl border border-border p-8 flex flex-col"
            >
              <span className="engagement-badge">{e.badge}</span>
              <h3 className="font-display text-3xl uppercase mb-1.5">{e.title}</h3>
              <p className="text-sm text-text-secondary mb-5">{e.tagline}</p>
              <ul className="space-y-2 mb-7">
                {e.points.map((point) => (
                  <li key={point} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-accent mt-0.5">&#10022;</span>
                    {point}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => requestContact({ message: e.intent })}
                className="btn-lift btn-sheen mt-auto inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-medium transition-all hover:brightness-110 focus-ring"
              >
                {e.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
