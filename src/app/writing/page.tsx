import Link from "next/link";
import { ArrowLeft, Calendar, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { KonamiDoor } from "@/components/KonamiDoor";

export const metadata: Metadata = {
  title: "Writing",
  description: "Posts about ML, computer vision, security, and systems engineering.",
};

// See src/app/page.tsx for why this is required on every route that calls
// getPosts()/getPost() — without it the Worker's background revalidation
// silently empties the post list a few minutes after each deploy.
export const dynamic = "force-static";
export const revalidate = false;

export default function WritingPage() {
  const posts = getPosts();

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

        <h1 className="text-4xl sm:text-5xl font-display font-normal mb-3">
          Writing
        </h1>
        <p className="text-lg text-text-secondary mb-16 max-w-xl">
          I write to explain things simply &mdash; ML, systems, and the
          occasional deep dive into something I had to debug for too long.
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group block p-6 rounded-2xl border border-border bg-surface card-hover"
            >
              <div className="flex items-center gap-3 text-xs text-text-muted font-mono mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.displayDate}
                </span>
                <span>{post.readTime}</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-accent-muted text-accent text-[10px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-display font-normal group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>

        <KonamiDoor />
      </div>
    </div>
  );
}
