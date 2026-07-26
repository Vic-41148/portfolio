import { describe, it, expect } from "vitest";
import {
  buildMarkdownFile,
  formatDate,
  isLive,
  isValidSlug,
  parseFrontmatter,
  slugify,
} from "@/lib/frontmatter";
import { getPost, getPosts } from "@/lib/posts";
import { estimateReadTime } from "@/lib/markdown";
import { linkedInDraft } from "@/lib/share";

describe("parseFrontmatter", () => {
  it("splits frontmatter from body", () => {
    const { data, content } = parseFrontmatter("---\ntitle: Hello\ntags: A, B\n---\n\n## Body\n\ntext");

    expect(data.title).toBe("Hello");
    expect(data.tags).toBe("A, B");
    expect(content).toBe("## Body\n\ntext");
  });

  it("keeps colons inside values", () => {
    const { data } = parseFrontmatter("---\nlinkedin: https://linkedin.com/posts/x\n---\nbody");

    expect(data.linkedin).toBe("https://linkedin.com/posts/x");
  });

  it("treats a file with no frontmatter as pure content", () => {
    const { data, content } = parseFrontmatter("just text");

    expect(data).toEqual({});
    expect(content).toBe("just text");
  });
});

describe("buildMarkdownFile", () => {
  it("round-trips through the parser", () => {
    const file = buildMarkdownFile(
      {
        title: "Round Trip",
        excerpt: "An excerpt",
        date: "2026-07-26",
        readTime: "4 min",
        tags: ["One", "Two"],
        linkedin: "https://linkedin.com/posts/abc",
      },
      "## Heading\n\nBody text."
    );

    const { data, content } = parseFrontmatter(file);

    expect(data.title).toBe("Round Trip");
    expect(data.tags).toBe("One, Two");
    expect(data.linkedin).toBe("https://linkedin.com/posts/abc");
    expect(content).toBe("## Heading\n\nBody text.");
  });

  it("flattens newlines so a multi-line value can't truncate the block", () => {
    const file = buildMarkdownFile(
      { title: "Bad\nTitle", excerpt: "", date: "2026-01-01", readTime: "1 min", tags: [] },
      "body"
    );

    expect(parseFrontmatter(file).data.title).toBe("Bad Title");
  });

  it("omits the linkedin key when absent", () => {
    const file = buildMarkdownFile(
      { title: "T", excerpt: "", date: "2026-01-01", readTime: "1 min", tags: [] },
      "body"
    );

    expect(file).not.toContain("linkedin:");
  });
});

describe("slugs", () => {
  it("slugifies titles", () => {
    expect(slugify("Building a Game Boy Emulator, the Slow Way")).toBe(
      "building-a-game-boy-emulator-the-slow-way"
    );
    expect(slugify("  Trailing --- dashes  ")).toBe("trailing-dashes");
  });

  it("rejects unsafe slugs", () => {
    expect(isValidSlug("good-slug")).toBe(true);
    expect(isValidSlug("../etc/passwd")).toBe(false);
    expect(isValidSlug("Has Spaces")).toBe(false);
    expect(isValidSlug("double--dash")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});

describe("formatDate", () => {
  it("renders a human month and year", () => {
    expect(formatDate("2026-06-14")).toBe("Jun 2026");
  });

  it("does not shift across timezones", () => {
    expect(formatDate("2026-01-01")).toBe("Jan 2026");
    expect(formatDate("2026-12-31")).toBe("Dec 2026");
  });
});

describe("estimateReadTime", () => {
  it("scales with word count", () => {
    expect(estimateReadTime("word ".repeat(200))).toBe("1 min");
    expect(estimateReadTime("word ".repeat(1200))).toBe("6 min");
  });

  it("never reports zero", () => {
    expect(estimateReadTime("short")).toBe("1 min");
  });
});

describe("post loading", () => {
  it("reads the content directory newest first", () => {
    const posts = getPosts();

    expect(posts.length).toBeGreaterThanOrEqual(3);
    const dates = posts.map((p) => p.date);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });

  it("exposes parsed metadata", () => {
    const post = getPost("building-a-game-boy-emulator");

    expect(post).toBeDefined();
    expect(post!.title).toBe("Building a Game Boy Emulator, the Slow Way");
    expect(post!.displayDate).toBe("May 2026");
    expect(post!.tags).toEqual(["Systems", "C++"]);
    expect(post!.content).toContain("## Why an emulator?");
  });

  it("returns undefined for unknown or traversing slugs", () => {
    expect(getPost("nope")).toBeUndefined();
    expect(getPost("../../package")).toBeUndefined();
  });
});

describe("scheduling", () => {
  it("treats a post with no publishAt as live", () => {
    expect(isLive(undefined)).toBe(true);
  });

  it("hides a post until its publishAt passes", () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    const past = new Date(Date.now() - 60_000).toISOString();

    expect(isLive(future)).toBe(false);
    expect(isLive(past)).toBe(true);
  });

  it("falls back to live on an unparseable date rather than hiding forever", () => {
    expect(isLive("not-a-date")).toBe(true);
  });

  it("round-trips publishAt through the file format", () => {
    const at = "2026-08-01T03:30:00.000Z";
    const file = buildMarkdownFile(
      { title: "T", excerpt: "", date: "2026-08-01", readTime: "1 min", tags: [], publishAt: at },
      "body"
    );

    expect(parseFrontmatter(file).data.publishAt).toBe(at);
  });

  it("omits publishAt when the post is immediate", () => {
    const file = buildMarkdownFile(
      { title: "T", excerpt: "", date: "2026-08-01", readTime: "1 min", tags: [] },
      "body"
    );

    expect(file).not.toContain("publishAt:");
  });
});

describe("linkedInDraft", () => {
  it("builds a plain-text post with the link and hashtags", () => {
    const text = linkedInDraft(
      "Teaching a CV Model in Your Browser",
      "How hand landmarks + a KNN classifier learn gestures in seconds.",
      "https://adityashibu.dev/writing/on-device-transfer-learning",
      ["CV", "Web ML"]
    );

    expect(text).toContain("Teaching a CV Model in Your Browser");
    expect(text).toContain("Full post: https://adityashibu.dev/writing/on-device-transfer-learning");
    expect(text).toContain("#CV #WebML");
    expect(text).not.toContain("**");
  });

  it("drops the hashtag line when there are no tags", () => {
    const text = linkedInDraft("Title", "Excerpt", "https://example.com/x", []);

    expect(text.endsWith("Full post: https://example.com/x")).toBe(true);
  });

  it("collapses the gap when the excerpt is empty", () => {
    const text = linkedInDraft("Title", "", "https://example.com/x", []);

    expect(text).toBe("Title\n\nFull post: https://example.com/x");
  });
});
