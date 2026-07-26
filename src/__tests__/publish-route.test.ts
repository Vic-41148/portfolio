import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createToken } from "@/lib/admin-auth";

const SECRET = "test-editor-password";

async function authHeaders() {
  const { token } = await createToken(SECRET);
  return { authorization: `Bearer ${token}`, "content-type": "application/json" };
}

function request(body: unknown, headers: Record<string, string>) {
  return new Request("https://example.com/api/admin/publish", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

const VALID = {
  slug: "a-new-post",
  markdown: "## Hello\n\nBody.",
  frontmatter: { title: "A New Post", excerpt: "x", tags: ["T"] },
};

describe("publish route", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = SECRET;
    process.env.GITHUB_TOKEN = "gh-token";
    process.env.GITHUB_REPO = "owner/repo";
    process.env.GITHUB_BRANCH = "main";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects unauthenticated requests before touching GitHub", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { POST } = await import("@/app/api/admin/publish/route");

    const res = await POST(request(VALID, { "content-type": "application/json" }));

    expect(res.status).toBe(401);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects path-traversal slugs", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { POST } = await import("@/app/api/admin/publish/route");

    const res = await POST(request({ ...VALID, slug: "../../etc/passwd" }, await authHeaders()));

    expect(res.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects an oversized body", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const { POST } = await import("@/app/api/admin/publish/route");

    const res = await POST(request({ ...VALID, markdown: "x".repeat(200_000) }, await authHeaders()));

    expect(res.status).toBe(413);
  });

  it("rejects a non-LinkedIn discussion URL", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const { POST } = await import("@/app/api/admin/publish/route");

    const res = await POST(
      request(
        { ...VALID, frontmatter: { ...VALID.frontmatter, linkedin: "https://evil.example/x" } },
        await authHeaders()
      )
    );

    expect(res.status).toBe(400);
  });

  it("refuses to clobber an existing post unless overwrite is set", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ sha: "abc", content: btoa("---\ntitle: Existing\n---\nbody") }, { status: 200 })
      )
    );
    const { POST } = await import("@/app/api/admin/publish/route");

    const res = await POST(request(VALID, await authHeaders()));
    const body = (await res.json()) as { code?: string };

    expect(res.status).toBe(409);
    expect(body.code).toBe("exists");
  });

  it("commits the post when the slug is free", async () => {
    const calls: { url: string; method: string }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        calls.push({ url: String(url), method: init?.method ?? "GET" });
        if (!init?.method || init.method === "GET") return new Response("", { status: 404 });
        return Response.json({ commit: { html_url: "https://github.com/owner/repo/commit/1" } });
      })
    );
    const { POST } = await import("@/app/api/admin/publish/route");

    const res = await POST(request(VALID, await authHeaders()));
    const body = (await res.json()) as { ok?: boolean; url?: string };

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.url).toBe("/writing/a-new-post");
    expect(calls.some((c) => c.method === "PUT" && c.url.includes("content/writing/a-new-post.md"))).toBe(true);
  });
});

describe("delete route", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = SECRET;
    process.env.GITHUB_TOKEN = "gh-token";
    process.env.GITHUB_REPO = "owner/repo";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requires the typed confirmation to match the slug", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { POST } = await import("@/app/api/admin/delete/route");

    const res = await POST(
      new Request("https://example.com/api/admin/delete", {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ slug: "a-post", confirm: "not-the-slug" }),
      })
    );

    expect(res.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("deletes the markdown file once confirmed", async () => {
    const calls: { url: string; method: string }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        const method = init?.method ?? "GET";
        calls.push({ url: String(url), method });
        if (method === "GET" && String(url).includes("content/writing")) {
          return Response.json({ sha: "sha-1", content: btoa("---\ntitle: X\n---\nbody") });
        }
        if (method === "GET") return new Response("", { status: 404 });
        return Response.json({ commit: { html_url: "https://github.com/x" } });
      })
    );
    const { POST } = await import("@/app/api/admin/delete/route");

    const res = await POST(
      new Request("https://example.com/api/admin/delete", {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ slug: "a-post", confirm: "a-post" }),
      })
    );

    expect(res.status).toBe(200);
    expect(calls.some((c) => c.method === "DELETE" && c.url.includes("content/writing/a-post.md"))).toBe(true);
  });
});
