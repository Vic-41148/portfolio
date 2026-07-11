import { describe, it, expect } from "vitest";
import { buildShortlistMailto } from "@/lib/shortlist";
import type { ShortlistItem } from "@/lib/shortlist";

describe("buildShortlistMailto", () => {
  it("returns a mailto URL with encoded subject and body", () => {
    const items: ShortlistItem[] = [
      { slug: "project-a", title: "Project A", href: "/work/project-a" },
    ];

    const result = buildShortlistMailto(items);

    expect(result).toMatch(/^mailto:adityashibu275898@gmail\.com/);
    expect(result).toContain("subject=");
    expect(result).toContain("body=");
  });

  it("includes all item titles in the body", () => {
    const items: ShortlistItem[] = [
      { slug: "a", title: "Alpha", href: "/work/a" },
      { slug: "b", title: "Beta", href: "/work/b" },
    ];

    const result = buildShortlistMailto(items);
    const decoded = decodeURIComponent(result);

    expect(decoded).toContain("Alpha");
    expect(decoded).toContain("Beta");
  });

  it("resolves relative hrefs against the base domain", () => {
    const items: ShortlistItem[] = [
      { slug: "x", title: "X", href: "/work/x" },
    ];

    const result = buildShortlistMailto(items);
    const decoded = decodeURIComponent(result);

    expect(decoded).toContain("https://adityashibu.dev/work/x");
  });

  it("handles empty items array", () => {
    const result = buildShortlistMailto([]);

    expect(result).toMatch(/^mailto:/);
    const decoded = decodeURIComponent(result);
    expect(decoded).toContain("I looked through your work");
  });
});
