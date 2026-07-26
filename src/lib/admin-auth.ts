/**
 * Session tokens for the hidden writing editor.
 *
 * The password is only ever checked here, on the server, against a secret that
 * never reaches the client. The Konami easter egg on /writing is discovery UX,
 * not access control — anyone can read the bundle and find the editor route,
 * and that's fine, because the route is useless without a valid token.
 *
 * Uses WebCrypto only (no node:crypto) so the same code runs on the Cloudflare
 * Workers runtime that serves the deployed site.
 */

const TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const encoder = new TextEncoder();

function base64url(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

export function adminPassword(): string | undefined {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length > 0 ? value : undefined;
}

/** Compares digests rather than raw strings so the comparison cost doesn't
 *  depend on how many leading characters happen to match. */
export async function passwordMatches(candidate: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([hmac(expected, candidate), hmac(expected, expected)]);
  return a === b;
}

export async function createToken(secret: string, now = Date.now()): Promise<{ token: string; exp: number }> {
  const exp = now + TOKEN_TTL_MS;
  const signature = await hmac(secret, String(exp));
  return { token: `${exp}.${signature}`, exp };
}

export async function verifyToken(token: string | null | undefined, secret: string, now = Date.now()): Promise<boolean> {
  if (!token) return false;
  const [expPart, signature] = token.split(".");
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || !signature) return false;
  if (exp < now) return false;
  return (await hmac(secret, expPart)) === signature;
}

/** Pulls the bearer token off a request and checks it. Returns the reason for
 *  failure so routes can answer 401 vs 503 (misconfigured) distinctly. */
export async function authorize(request: Request): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const secret = adminPassword();
  if (!secret) {
    return { ok: false, status: 503, error: "Editor is not configured on this deployment." };
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : null;

  if (!(await verifyToken(token, secret))) {
    return { ok: false, status: 401, error: "Session expired — sign in again." };
  }

  return { ok: true };
}
