import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import manifest from "@/app/manifest";

describe("sitemap", () => {
  it("returns an array of entries with required fields", () => {
    const entries = sitemap();

    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);

    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\/adityashibu\.dev/);
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(entry.priority).toBeGreaterThanOrEqual(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    }
  });

  it("has the root URL with priority 1", () => {
    const entries = sitemap();
    const root = entries.find((e) => e.url === "https://adityashibu.dev");

    expect(root).toBeDefined();
    expect(root!.priority).toBe(1);
    expect(root!.changeFrequency).toBe("monthly");
  });

  it("includes all work pages", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain("https://adityashibu.dev/work/webcam-transfer-learning");
    expect(urls).toContain("https://adityashibu.dev/work/secure-llm-inference-platform");
    expect(urls).toContain("https://adityashibu.dev/work/codeshield");
    expect(urls).toContain("https://adityashibu.dev/work/game-boy-emulator");
    expect(urls).toContain("https://adityashibu.dev/work/primetrade-mlops");
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

    expect(result.sitemap).toBe("https://adityashibu.dev/sitemap.xml");
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
