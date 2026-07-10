import { Ban, Wheat, HandMetal, Sprout } from "lucide-react";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/Reveal";

const benefits = [
  {
    icon: Ban,
    title: "No cloud lock-in",
    content: "If it needs a subscription to someone else's inference API to work, it doesn't ship. Models run where the user is.",
  },
  {
    icon: Wheat,
    title: "No black-box APIs",
    content: "No gluing together someone else's endpoint and calling it engineering. If I can't explain the pipeline, it's not done.",
  },
  {
    icon: HandMetal,
    title: "No untested claims",
    content: "Numbers come from evals, not vibes. If a project says it works, there's a benchmark backing it up.",
  },
  {
    icon: Sprout,
    title: "No bloated deps",
    content: "Systems background means I reach for the smallest tool that solves it, not the trendiest framework of the month.",
  },
];

/** Cream-block benefits section — the "what's not in the bottle" analog. */
export function Benefits() {
  return (
    <section className="py-20 bg-cream-block">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="section-eyebrow text-center !text-inherit opacity-70">What&apos;s not in the stack</p>
          <h2 className="section-heading text-center mb-12">Built like it&apos;s 1998, not a hackathon.</h2>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {benefits.map((benefit) => (
            <StaggerItem
              key={benefit.title}
              className="benefit-card p-6 rounded-2xl"
            >
              <div className="benefit-icon mb-4">
                <benefit.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl uppercase mb-2">{benefit.title}</h3>
              <p className="text-sm leading-relaxed opacity-75">{benefit.content}</p>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
