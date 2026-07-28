"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import { KonamiDoor } from "@/components/KonamiDoor";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  displayDate: string;
  readTime: string;
  tags: string[];
};

function PostCard({ post, index }: { post: Post; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, filter: "blur(3px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <Link
        href={`/writing/${post.slug}`}
        className="group relative block p-6 rounded-2xl border border-border bg-surface overflow-hidden"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setSpotlight({ x: e.clientX - r.left, y: e.clientY - r.top, visible: true });
        }}
        onMouseLeave={() => setSpotlight((s) => ({ ...s, visible: false }))}
      >
        {/* Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: spotlight.visible ? 1 : 0,
            background: `radial-gradient(240px circle at ${spotlight.x}px ${spotlight.y}px, var(--accent)12, transparent 70%)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/25 transition-all duration-500" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-xs text-text-muted font-mono mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {post.displayDate}
            </span>
            <span>{post.readTime}</span>
            {post.tags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.06 }}
                className="px-2 py-0.5 rounded-full bg-accent-muted text-accent text-[10px]"
              >
                {tag}
              </motion.span>
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
            <motion.div
              initial={{ x: 0, y: 0 }}
              whileHover={{ x: 3, y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const hdr = {
  hidden: { opacity: 0, y: -14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function WritingClient({ posts }: { posts: Post[] }) {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div custom={0} variants={hdr} initial="hidden" animate="show">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back home
          </Link>
        </motion.div>

        <motion.h1
          custom={1}
          variants={hdr}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-5xl font-display font-normal mb-3"
        >
          Writing
        </motion.h1>
        <motion.p
          custom={2}
          variants={hdr}
          initial="hidden"
          animate="show"
          className="text-lg text-text-secondary mb-16 max-w-xl"
        >
          I write to explain things simply &mdash; ML, systems, and the occasional
          deep dive into something I had to debug for too long.
        </motion.p>

        <div className="space-y-6">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        <KonamiDoor />
      </div>
    </div>
  );
}
