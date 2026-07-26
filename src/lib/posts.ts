import fs from "node:fs";
import path from "node:path";
import { formatDate, parseFrontmatter } from "@/lib/frontmatter";

export { formatDate, parseFrontmatter };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date (YYYY-MM-DD), used for sorting */
  date: string;
  /** Human display form, e.g. "Jun 2026" */
  displayDate: string;
  readTime: string;
  tags: string[];
  /** Optional permalink to the matching LinkedIn post */
  linkedin?: string;
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "writing");

function toPost(slug: string, raw: string): Post {
  const { data, content } = parseFrontmatter(raw);
  const date = data.date ?? "1970-01-01";

  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    date,
    displayDate: formatDate(date),
    readTime: data.readTime ?? "5 min",
    tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    ...(data.linkedin ? { linkedin: data.linkedin } : {}),
    content,
  };
}

/** All posts, newest first. Build-time only — never call from a route handler. */
export function getPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => toPost(file.replace(/\.md$/, ""), fs.readFileSync(path.join(POSTS_DIR, file), "utf8")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!file.startsWith(POSTS_DIR) || !fs.existsSync(file)) return undefined;
  return toPost(slug, fs.readFileSync(file, "utf8"));
}
