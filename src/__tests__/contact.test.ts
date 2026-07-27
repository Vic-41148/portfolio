import { describe, it, expect, vi, afterEach } from "vitest";
import { POST } from "@/app/api/contact/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  const originalEnv = process.env.RESEND_API_KEY;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.RESEND_API_KEY;
    } else {
      process.env.RESEND_API_KEY = originalEnv;
    }
    vi.restoreAllMocks();
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ email: "a@b.com", message: "hi" }));
    const json = (await res.json()) as { error?: string; ok?: boolean };

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/field is missing/i);
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ name: "Test", message: "hi" }));
    const json = (await res.json()) as { error?: string; ok?: boolean };

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/field is missing/i);
  });

  it("returns 400 when message is missing", async () => {
    const res = await POST(makeRequest({ name: "Test", email: "a@b.com" }));
    const json = (await res.json()) as { error?: string; ok?: boolean };

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/field is missing/i);
  });

  it("returns 400 when body is not valid JSON", async () => {
    const req = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });

    const res = await POST(req);
    const json = (await res.json()) as { error?: string; ok?: boolean };

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(
      makeRequest({ name: "Test", email: "not-an-email", message: "hi" })
    );
    const json = (await res.json()) as { error?: string; ok?: boolean };

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/email.*doesn't look right/i);
  });

  it("returns 500 when RESEND_API_KEY is not set", async () => {
    delete process.env.RESEND_API_KEY;

    const res = await POST(
      makeRequest({ name: "Test", email: "a@b.com", message: "hi" })
    );
    const json = (await res.json()) as { error?: string; ok?: boolean };

    expect(res.status).toBe(500);
    expect(json.error).toMatch(/email service/i);
  });

  it("returns 400 for empty string fields", async () => {
    const res = await POST(
      makeRequest({ name: "", email: "", message: "" })
    );
    const json = (await res.json()) as { error?: string; ok?: boolean };

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/field is missing/i);
  });

  it("rejects emails without a TLD", async () => {
    const res = await POST(
      makeRequest({ name: "Test", email: "user@localhost", message: "hi" })
    );
    const json = (await res.json()) as { error?: string; ok?: boolean };

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/email.*doesn't look right/i);
  });
});
