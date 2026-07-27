import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { GitHubIcon } from "@/components/icons";
import { SIDE_QUESTS } from "@/lib/side-quests";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const quest = SIDE_QUESTS[slug];
  if (!quest) return { title: "Quest Not Found" };

  return {
    title: `${quest.title} — Side Quest`,
    description: quest.subtitle,
  };
}

export default async function SideQuestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quest = SIDE_QUESTS[slug];

  if (!quest) notFound();

  return (
    <article className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/side-quests"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to side quests
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-3">
            {quest.title}
          </h1>
          <p className="text-xl text-text-secondary">{quest.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
            {quest.date}
          </span>
          {quest.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-elevated border border-border text-text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        {quest.github && (
          <div className="flex gap-4 mb-16">
            <a
              href={quest.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary hover:border-text-muted transition-all"
            >
              <GitHubIcon className="w-4 h-4" />
              Source on GitHub
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        )}

        <div className="prose prose-invert prose-p:text-text-secondary prose-headings:text-text-primary max-w-none">
          {quest.content}
        </div>
      </div>
    </article>
  );
}
