import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { PROJECTS } from "@/lib/projects";
import { getPosts } from "@/lib/posts";
import robots from "@/app/robots";
import manifest from "@/app/manifest";

describe("sitemap", () => {
  it("returns an array of entries with required fields", () => {
    const entries = sitemap();

    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);

    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\/adityashibu\.com/);
      expect(entry.priority).toBeGreaterThanOrEqual(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
      // Only set where a real date exists — a build-time stamp would claim
      // every page changed on every deploy.
      if (entry.lastModified !== undefined) {
        expect(entry.lastModified).toBeInstanceOf(Date);
      }
    }
  });

  it("dates posts but not case studies", () => {
    const entries = sitemap();
    const post = entries.find((e) => e.url.includes("/writing/building-a-game-boy-emulator"));
    const project = entries.find((e) => e.url.includes("/work/codeshield"));

    expect(post!.lastModified).toBeInstanceOf(Date);
    expect(project!.lastModified).toBeUndefined();
  });

  it("has the root URL with priority 1", () => {
    const entries = sitemap();
    const root = entries.find((e) => e.url === "https://adityashibu.com");

    expect(root).toBeDefined();
    expect(root!.priority).toBe(1);
    expect(root!.changeFrequency).toBe("monthly");
  });

  it("lists every case study, derived rather than hand-listed", () => {
    const urls = sitemap().map((e) => e.url);

    for (const slug of Object.keys(PROJECTS)) {
      expect(urls).toContain(`https://adityashibu.com/work/${slug}`);
    }
  });

  it("lists every published post", () => {
    const urls = sitemap().map((e) => e.url);

    for (const post of getPosts()) {
      expect(urls).toContain(`https://adityashibu.com/writing/${post.slug}`);
    }
  });
});

describe("robots", () => {
  it("returns rules allowing all user agents", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rules.userAgent).toBe("*");
    expect(rules.allow).toBe("/");
  });

  it("includes a sitemap URL", () => {
    const result = robots();

    expect(result.sitemap).toBe("https://adityashibu.com/sitemap.xml");
  });
});

describe("manifest", () => {
  it("returns valid manifest metadata", () => {
    const result = manifest();

    expect(result.name).toContain("Aditya Shibu");
    expect(result.short_name).toBe("Aditya Shibu");
    expect(result.display).toBe("standalone");
    expect(result.start_url).toBe("/");
    expect(result.background_color).toBe("#0A0B0F");
    expect(result.theme_color).toBe("#0A0B0F");
  });

  it("includes at least one icon", () => {
    const result = manifest();

    expect(result.icons).toBeDefined();
    expect(result.icons!.length).toBeGreaterThan(0);
    expect(result.icons![0].src).toBe("/icon.svg");
  });
});
