import { describe, it, expect } from "vitest";
import { authorize, createToken, passwordMatches, verifyToken } from "@/lib/admin-auth";

const SECRET = "correct-horse-battery-staple";

describe("passwordMatches", () => {
  it("accepts the right password", async () => {
    expect(await passwordMatches(SECRET, SECRET)).toBe(true);
  });

  it("rejects wrong passwords, including prefixes", async () => {
    expect(await passwordMatches("wrong", SECRET)).toBe(false);
    expect(await passwordMatches("correct-horse", SECRET)).toBe(false);
    expect(await passwordMatches("", SECRET)).toBe(false);
  });
});

describe("tokens", () => {
  it("round-trips a freshly minted token", async () => {
    const { token } = await createToken(SECRET);

    expect(await verifyToken(token, SECRET)).toBe(true);
  });

  it("rejects a token signed with a different secret", async () => {
    const { token } = await createToken(SECRET);

    expect(await verifyToken(token, "another-secret")).toBe(false);
  });

  it("rejects expired tokens", async () => {
    const issuedAt = Date.now() - 5 * 60 * 60 * 1000;
    const { token } = await createToken(SECRET, issuedAt);

    expect(await verifyToken(token, SECRET)).toBe(false);
  });

  it("rejects tampered expiry claims", async () => {
    const { token } = await createToken(SECRET);
    const [, signature] = token.split(".");
    const forged = `${Date.now() + 10_000_000}.${signature}`;

    expect(await verifyToken(forged, SECRET)).toBe(false);
  });

  it("rejects malformed and missing tokens", async () => {
    expect(await verifyToken(null, SECRET)).toBe(false);
    expect(await verifyToken("", SECRET)).toBe(false);
    expect(await verifyToken("garbage", SECRET)).toBe(false);
    expect(await verifyToken("123.", SECRET)).toBe(false);
  });
});

describe("authorize", () => {
  it("reports 503 when no password is configured", async () => {
    delete process.env.ADMIN_PASSWORD;
    const result = await authorize(new Request("https://example.com"));

    expect(result).toMatchObject({ ok: false, status: 503 });
  });

  it("rejects a request with no bearer token", async () => {
    process.env.ADMIN_PASSWORD = SECRET;
    const result = await authorize(new Request("https://example.com"));

    expect(result).toMatchObject({ ok: false, status: 401 });
  });

  it("accepts a valid bearer token", async () => {
    process.env.ADMIN_PASSWORD = SECRET;
    const { token } = await createToken(SECRET);
    const result = await authorize(
      new Request("https://example.com", { headers: { authorization: `Bearer ${token}` } })
    );

    expect(result).toEqual({ ok: true });
  });

  it("rejects a token minted from a stale password", async () => {
    const { token } = await createToken("old-password");
    process.env.ADMIN_PASSWORD = SECRET;
    const result = await authorize(
      new Request("https://example.com", { headers: { authorization: `Bearer ${token}` } })
    );

    expect(result).toMatchObject({ ok: false, status: 401 });
  });
});
