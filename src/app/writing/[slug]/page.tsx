import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getPost, getPosts } from "@/lib/posts";
import { Markdown } from "@/lib/markdown";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160).replace(/[#*\n]/g, "").trim(),
  };
}

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <article className="pt-28 pb-24">
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
