"use client";

import { ArrowUpRight, Star, GitMerge, Wrench } from "lucide-react";
import Link from "next/link";
import { Reveal, StaggerReveal, StaggerItem, MaskText } from "@/components/Reveal";
import { Ghost } from "@/components/Ghost";
import { GitHubIcon } from "@/components/icons";
import { trackSpotlight } from "@/lib/utils";

const PREVIEW_QUESTS = [
  {
    title: "Hyprland: Fix fullscreen workspace swipes",
    description: "Merged C++ PR to fix a bug where the top layer wasn't hidden during workspace gestures over scrolling fullscreen layouts.",
    type: "Hyprland PR #15137",
    icon: GitMerge,
    link: "/side-quests/hyprland-fullscreen-swipe",
  },
  {
    title: "Somn: Local-first Android sleep tracker",
    description: "An open-source sleep tracker using accelerometer data and age-calibrated scoring. 100% offline, zero network permissions.",
    type: "Android / Kotlin",
    icon: Star,
    link: "/side-quests/somn",
  },
  {
    title: "Averix Web & ERP Projects",
    description: "Served as Project Lead and the backend backbone for internal ERP systems and client-facing Astro sites at Averix Global Tech.",
    type: "Internship",
    icon: GitMerge,
    link: "/side-quests/averix-web",
  },
];

export function SideQuests() {
  return (
    <section id="side-quests" className="py-24 sm:py-32 border-t border-border relative overflow-hidden">
      <Ghost word="Fun" className="top-10 left-[-2%]" />
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">
                <span className="motif-bracket" />Side Quests
              </p>
              <h2 className="section-heading">
                <MaskText>OSS & tinkering</MaskText>
              </h2>
            </div>
            <Link
              href="/side-quests"
              className="hidden sm:flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors shrink-0"
            >
              View all
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PREVIEW_QUESTS.map((quest, i) => (
            <StaggerItem key={quest.title}>
              <Link
                href={quest.link}
                onMouseMove={trackSpotlight}
                className="group relative block rounded-2xl border border-border bg-surface p-6 card-hover card-spotlight h-full"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-5 right-6 font-mono text-xs text-text-muted/70 transition-colors group-hover:text-accent"
                >
                  0{i + 1}
                </span>
                <div className="flex items-center gap-3 text-xs text-text-muted font-mono mb-3">
                  <span className="flex items-center gap-1">
                    <quest.icon className="w-3 h-3" />
                    {quest.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-display font-normal mb-2 group-hover:text-accent transition-colors">
                  {quest.title}
                </h3>
                
                <p className="text-sm text-text-secondary leading-relaxed">
                  {quest.description}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <Reveal>
          <Link
            href="/side-quests"
            className="sm:hidden mt-6 flex items-center justify-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            View all quests
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
