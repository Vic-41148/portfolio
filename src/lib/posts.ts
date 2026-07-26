import fs from "node:fs";
import path from "node:path";
import { formatDate, isLive, parseFrontmatter } from "@/lib/frontmatter";

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
  /** ISO instant; while it's in the future the post stays out of the build */
  publishAt?: string;
  content: string;
}

/** Where the markdown lives, resolved defensively.
 *
 *  A Cloudflare build once produced a site with zero posts and no error: the
 *  directory wasn't found from process.cwd() there, and the old code treated
 *  "missing" as "no posts yet" and happily prerendered empty pages. Falling
 *  back to a module-relative path covers a build that runs from somewhere
 *  other than the project root, and resolvePostsDir() throws rather than
 *  returning nothing, so a broken build fails loudly instead of silently
 *  shipping an empty blog. */
function candidatePostsDirs(): string[] {
  const dirs = [path.join(process.cwd(), "content", "writing")];

  try {
    // Only meaningful when this module isn't bundled; harmless when it is.
    const here = path.dirname(new URL(import.meta.url).pathname);
    dirs.push(path.resolve(here, "..", "..", "content", "writing"));
  } catch {
    /* import.meta unavailable in this context */
  }

  return dirs;
}

let cachedPostsDir: string | undefined;

function resolvePostsDir(): string {
  if (cachedPostsDir) return cachedPostsDir;

  const candidates = candidatePostsDirs();
  const found = candidates.find((dir) => fs.existsSync(dir));

  if (!found) {
    throw new Error(
      `content/writing not found — the build would have shipped a site with no posts.\n` +
        `cwd: ${process.cwd()}\n` +
        `looked in:\n${candidates.map((dir) => `  ${dir}`).join("\n")}`
    );
  }

  cachedPostsDir = found;
  return found;
}

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
    ...(data.publishAt ? { publishAt: data.publishAt } : {}),
    content,
  };
}

/** Every post on disk, scheduled ones included. */
export function getAllPosts(): Post[] {
  const dir = resolvePostsDir();

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => toPost(file.replace(/\.md$/, ""), fs.readFileSync(path.join(dir, file), "utf8")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Published posts, newest first. Build-time only — never call from a route
 *  handler. Scheduled posts are filtered out here, which is why a scheduled
 *  post needs a rebuild to appear. */
export function getPosts(): Post[] {
  return getAllPosts().filter((post) => isLive(post.publishAt));
}

export function getPost(slug: string): Post | undefined {
  const dir = resolvePostsDir();
  const file = path.join(dir, `${slug}.md`);
  if (!file.startsWith(dir) || !fs.existsSync(file)) return undefined;

  const post = toPost(slug, fs.readFileSync(file, "utf8"));
  // Guard the detail route too: without this a scheduled post would still be
  // reachable directly by URL even though it's absent from every listing.
  return isLive(post.publishAt) ? post : undefined;
}
