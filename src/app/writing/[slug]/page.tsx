import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getPost } from "@/lib/posts";
import { Markdown } from "@/lib/markdown";
import { SITE_URL } from "@/lib/constants";

/** Rendered per request rather than prerendered.
 *
 *  OpenNext keeps prerendered SSG pages in an incremental cache that isn't
 *  configured here (no R2 binding), so on Workers those pages come back 404
 *  with NoFallbackError — reproducible locally with `wrangler dev`. Post
 *  content is bundled via posts.data.ts, so rendering on demand costs a
 *  markdown parse from memory and always reflects what was deployed.
 *
 *  Wiring up an R2 incremental cache would allow prerendering again. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post Not Found" };

  const description = post.excerpt || post.content.slice(0, 160).replace(/[#*\n]/g, "").trim();

  return {
    title: post.title,
    description,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/writing/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  // Marks the page as an article authored by the same Person entity declared in
  // the root layout, rather than a page that merely mentions a name.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    mainEntityOfPage: `${SITE_URL}/writing/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <article className="pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to writing
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-normal mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.displayDate}
            </span>
            <span>{post.readTime}</span>
            {post.linkedin && (
              <a
                href={post.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:brightness-110 transition-all"
              >
                Discuss on LinkedIn
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </header>

        <Markdown content={post.content} />
      </div>
    </article>
  );
}
