import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getPost } from "@/lib/posts";
import { Markdown } from "@/lib/markdown";
import { SITE_URL } from "@/lib/constants";
import WritingPostClient from "./writing-client";

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <WritingPostClient post={post} />
    </>
  );
}
