import { formatDate, isLive, parseFrontmatter } from "@/lib/frontmatter";
import { RAW_POSTS } from "@/lib/posts.data";

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

/** Every post, scheduled ones included.
 *
 *  Reads from the generated module rather than the filesystem: this runs on
 *  Cloudflare Workers, where there is no fs, and a page can be rendered at
 *  request time and not only during the build. */
export function getAllPosts(): Post[] {
  return RAW_POSTS.map((entry) => toPost(entry.slug, entry.raw)).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

/** Published posts, newest first. Scheduled posts are filtered out here, which
 *  is why a scheduled post needs a rebuild to appear. */
export function getPosts(): Post[] {
  return getAllPosts().filter((post) => isLive(post.publishAt));
}

export function getPost(slug: string): Post | undefined {
  const post = getAllPosts().find((entry) => entry.slug === slug);
  // Guard the detail route too: without this a scheduled post would still be
  // reachable directly by URL even though it's absent from every listing.
  return post && isLive(post.publishAt) ? post : undefined;
}
