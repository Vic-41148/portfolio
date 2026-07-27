import { describe, it, expect } from "vitest";
import { isValidEmail, newToken, normalizeEmail } from "@/lib/subscribers";
import { confirmEmail, confirmUrl, postAnnouncementEmail, unsubscribeUrl, welcomeEmail } from "@/lib/emails";

describe("email validation", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("a@b.com")).toBe(true);
    expect(isValidEmail("first.last+tag@sub.example.co.uk")).toBe(true);
  });

  it("rejects malformed ones", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("nope")).toBe(false);
    expect(isValidEmail("no@domain")).toBe(false);
    expect(isValidEmail("spaces in@example.com")).toBe(false);
  });

  it("rejects absurdly long addresses", () => {
    expect(isValidEmail(`${"a".repeat(250)}@example.com`)).toBe(false);
  });

  it("normalizes case and whitespace so signups dedupe", () => {
    expect(normalizeEmail("  Aditya@Example.COM ")).toBe("aditya@example.com");
  });
});

describe("tokens", () => {
  it("are URL-safe", () => {
    for (let i = 0; i < 20; i++) {
      expect(newToken()).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });

  it("are unique across calls", () => {
    const tokens = new Set(Array.from({ length: 200 }, () => newToken()));
    expect(tokens.size).toBe(200);
  });

  it("survive a round trip through a URL", () => {
    const token = newToken();
    const parsed = new URL(unsubscribeUrl(token)).searchParams.get("token");
    expect(parsed).toBe(token);
  });
});

describe("emails", () => {
  it("confirmation carries the confirm link and no unsubscribe", () => {
    const mail = confirmEmail("tok123");

    expect(mail.html).toContain(confirmUrl("tok123"));
    // Nothing to unsubscribe from until they confirm.
    expect(mail.html).not.toContain("/subscribe/unsubscribe");
  });

  it("welcome carries a working unsubscribe from the first message", () => {
    const mail = welcomeEmail("unsub123");

    expect(mail.html).toContain(unsubscribeUrl("unsub123"));
    expect(mail.text).toContain(unsubscribeUrl("unsub123"));
  });

  it("announcement links the post and includes unsubscribe", () => {
    const mail = postAnnouncementEmail(
      { title: "A Post", excerpt: "Short blurb", slug: "a-post" },
      "unsub456"
    );

    expect(mail.subject).toBe("A Post");
    expect(mail.html).toContain("https://adityashibu.com/writing/a-post");
    expect(mail.html).toContain(unsubscribeUrl("unsub456"));
  });

  it("escapes post titles so a stray angle bracket can't inject markup", () => {
    const mail = postAnnouncementEmail(
      { title: '<img src=x onerror="alert(1)">', excerpt: "", slug: "x" },
      "t"
    );

    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;img");
  });

  it("omits the excerpt paragraph when there isn't one", () => {
    const mail = postAnnouncementEmail({ title: "T", excerpt: "", slug: "s" }, "t");

    expect(mail.html).not.toContain("<p style=\"color:#5A606B\"></p>");
  });
});
