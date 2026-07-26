/** Frontmatter helpers with no filesystem imports, so route handlers running
 *  on the Workers runtime can use them without pulling node:fs into the bundle. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-06-14" -> "Jun 2026". Parsed by hand rather than via Date so the
 *  rendered month never shifts with the build machine's timezone. */
export function formatDate(iso: string): string {
  const [year, month] = iso.split("-");
  const index = Number(month) - 1;
  return MONTHS[index] ? `${MONTHS[index]} ${year}` : iso;
}

/** Minimal `key: value` frontmatter between --- fences. Values are plain
 *  strings (no nesting, no quoting rules) — enough for post metadata and one
 *  less dependency to keep current. */
export function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, content: raw.trim() };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();
    if (key) data[key] = value;
  }

  return { data, content: raw.slice(match[0].length).trim() };
}

export interface PostFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  linkedin?: string;
  /** ISO instant. Until it passes, the post is committed but not built. */
  publishAt?: string;
}

/** A post is live once its publishAt has passed (or it never had one).
 *  Everything is evaluated at build time, so a scheduled post appears on the
 *  first rebuild after its moment — that's what the hourly cron triggers. */
export function isLive(publishAt: string | undefined, now = Date.now()): boolean {
  if (!publishAt) return true;
  const at = Date.parse(publishAt);
  return Number.isNaN(at) ? true : at <= now;
}

/** Serializes frontmatter back to a markdown file body. Newlines are stripped
 *  from values because the parser is line-based — a stray one would silently
 *  truncate the field. */
export function buildMarkdownFile(frontmatter: PostFrontmatter, content: string): string {
  const clean = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

  const lines = [
    `title: ${clean(frontmatter.title)}`,
    `excerpt: ${clean(frontmatter.excerpt)}`,
    `date: ${clean(frontmatter.date)}`,
    `readTime: ${clean(frontmatter.readTime)}`,
    `tags: ${frontmatter.tags.map(clean).filter(Boolean).join(", ")}`,
  ];

  if (frontmatter.linkedin) lines.push(`linkedin: ${clean(frontmatter.linkedin)}`);
  if (frontmatter.publishAt) lines.push(`publishAt: ${clean(frontmatter.publishAt)}`);

  return `---\n${lines.join("\n")}\n---\n\n${content.trim()}\n`;
}

/** Lowercase, dash-separated, filesystem- and URL-safe. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 80 && SLUG_PATTERN.test(slug);
}
