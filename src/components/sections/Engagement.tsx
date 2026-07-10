import { Reveal, StaggerReveal, StaggerItem } from "@/components/Reveal";

const engagements = [
  {
    badge: "Open to",
    title: "Full-time",
    tagline: "One team, one problem, all the way through.",
    points: ["ML / CV engineering roles", "Systems-adjacent teams", "Relocation on the table"],
  },
  {
    badge: "Available",
    title: "Contract",
    tagline: "Scoped work — a model to ship, a pipeline to fix.",
    points: ["Fixed-scope engagements", "Short research spikes", "Remote, any timezone"],
  },
];

/** Packs-grid analog — engagement types instead of bundle pricing. No fake
 *  discounts; this isn't a store. */
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
              className="engagement-card relative rounded-2xl border border-border p-8"
            >
              <span className="engagement-badge">{e.badge}</span>
              <h3 className="font-display text-3xl uppercase mb-1.5">{e.title}</h3>
              <p className="text-sm text-text-secondary mb-5">{e.tagline}</p>
              <ul className="space-y-2">
                {e.points.map((point) => (
                  <li key={point} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-accent mt-0.5">&#10022;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
