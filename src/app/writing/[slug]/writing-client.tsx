"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowUpRight } from "lucide-react";
import { Markdown } from "@/lib/markdown";

type Post = {
  slug: string;
  title: string;
  displayDate: string;
  readTime: string;
  content: string;
  linkedin?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function WritingPostClient({ post }: { post: Post }) {
  return (
    <article className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            href="/writing"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to writing
          </Link>
        </motion.div>

        <header className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="text-3xl sm:text-4xl font-display font-normal mb-4"
          >
            {post.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease }}
            className="flex flex-wrap items-center gap-3 text-sm text-text-muted font-mono"
          >
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
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
        >
          <Markdown content={post.content} />
        </motion.div>
      </div>
    </article>
  );
}
