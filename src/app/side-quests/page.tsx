import Link from "next/link";
import { ArrowLeft, ArrowUpRight, GitPullRequest, Wrench } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Side Quests",
  description: "Open source contributions, random tinkering, and fun projects.",
};

const QUESTS = [
  {
    category: "Open Source",
    items: [
      {
        title: "Hyprland — Workspace swipe layout fix",
        description: "Fixed a bug in Hyprland's scrolling layout where the top layer (like Waybar) wouldn't hide correctly when swiping into a fullscreen window. Traced it to fullscreen state checks relying on cached booleans rather than the active window state.",
        href: "/side-quests/hyprland-fullscreen-swipe",
        icon: GitPullRequest,
        internal: true,
      }
    ]
  },
  {
    category: "Professional Work (Internship)",
    items: [
      {
        title: "Averix ERP & Web Projects",
        description: "Served as Project Lead and the backend/quality backbone for a suite of internal ERP systems (Averix ERP, Classics Express) and client-facing Astro/HTML sites (VISA WEB, Immigration) built during my internship at Averix Global Tech.",
        href: "/side-quests/averix-web",
        icon: GitPullRequest,
        internal: true,
      }
    ]
  },
  {
    category: "Fun & Tinkering",
    items: [
      {
        title: "Somn — Local-first Android Sleep Tracker",
        description: "Built a privacy-first sleep tracker in Kotlin/Jetpack Compose. It uses raw accelerometer data and 30-second epoch classification to detect sleep stages (Wake, Light, Deep, REM) entirely on-device, with zero network permissions. Includes age-calibrated scoring and biological profile support (menstrual cycles, ADHD consistency adjustments).",
        href: "/side-quests/somn",
        icon: Wrench,
        internal: true,
      },
      {
        title: "Discord Bot for Server Logs",
        description: "A small Go bot that pipes linux server ssh attempts into a private Discord channel.",
        href: "/side-quests/discord-bot",
        icon: GitHubIcon,
        internal: true,
      },
    ]
  }
];

export default function SideQuestsPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back home
        </Link>

        <div className="flex items-center justify-between gap-4 mb-3">
          <h1 className="text-4xl sm:text-5xl font-display font-normal">
            Side Quests
          </h1>
          <Link
            href="/writing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-secondary hover:text-accent hover:border-accent/30 transition-colors focus-ring"
          >
            Read writing <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        
        <p className="text-lg text-text-secondary mb-16 max-w-xl">
          Not everything needs to be a massive ML pipeline. Here are open source contributions, late-night experiments, and things I built just for fun.
        </p>

        <div className="space-y-16">
          {QUESTS.map((section) => (
            <section key={section.category}>
              <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-6">
                {section.category}
              </h2>
              <div className="grid gap-4">
                {section.items.map((item) => {
                  const isInternal = item.internal;
                  const Wrapper = isInternal ? Link : "a";
                  const props = isInternal 
                    ? { href: item.href } 
                    : { href: item.href, target: "_blank", rel: "noopener noreferrer" };

                  return (
                    <Wrapper
                      key={item.title}
                      {...props}
                      className="group block p-6 rounded-2xl border border-border bg-surface card-hover"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="mt-1 flex-shrink-0">
                            <item.icon className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                          </div>
                          <div>
                            <h3 className="text-lg font-display font-normal group-hover:text-accent transition-colors">
                              {item.title}
                            </h3>
                            <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
