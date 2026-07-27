import { getCloudflareContext } from "@opennextjs/cloudflare";

/** A D1 row. Only `email` is ever shown outside the server. */
export interface Subscriber {
  id: number;
  email: string;
  created_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
}

export interface SubscriberEnv {
  DB?: D1Database;
}

/** The D1 binding, or null when it isn't configured. Callers surface that as a
 *  clear "not set up on this deployment" rather than a crash — same shape as
 *  the editor's GitHub storage check. */
export async function getDb(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as SubscriberEnv).DB ?? null;
  } catch {
    return null;
  }
}

/** Reads a secret from the Workers env, falling back to process.env.
 *
 *  Route handlers see secrets on process.env, but a server component rendering
 *  on Workers may not — which is why the welcome email silently never sent
 *  while the confirmation email from the API route worked fine. */
export async function getSecret(name: string): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const value = (env as unknown as Record<string, unknown>)[name];
    if (typeof value === "string" && value.length > 0) return value;
  } catch {
    /* not running on Workers */
  }
  return process.env[name] || undefined;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** URL-safe random token. WebCrypto so it works on the Workers runtime. */
export function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Inserts a pending subscriber, or refreshes the confirm token if they signed
 *  up before without confirming. Returns null when they're already confirmed,
 *  so we don't re-send a confirmation to someone already on the list. */
export async function upsertPending(
  db: D1Database,
  email: string
): Promise<{ confirmToken: string } | null> {
  const existing = await db
    .prepare("SELECT id, confirmed_at, unsubscribed_at FROM subscribers WHERE email = ?")
    .bind(email)
    .first<{ id: number; confirmed_at: string | null; unsubscribed_at: string | null }>();

  if (existing?.confirmed_at && !existing.unsubscribed_at) return null;

  const confirmToken = newToken();

  if (existing) {
    // Re-subscribing after unsubscribing goes back through confirmation.
    await db
      .prepare(
        "UPDATE subscribers SET confirm_token = ?, confirmed_at = NULL, unsubscribed_at = NULL WHERE id = ?"
      )
      .bind(confirmToken, existing.id)
      .run();
  } else {
    await db
      .prepare("INSERT INTO subscribers (email, confirm_token, unsub_token) VALUES (?, ?, ?)")
      .bind(email, confirmToken, newToken())
      .run();
  }

  return { confirmToken };
}

/** Consumes a confirm token. Returns the unsubscribe token so the welcome mail
 *  can carry a working opt-out from the very first message. */
export async function confirmByToken(
  db: D1Database,
  token: string
): Promise<{ email: string; unsubToken: string } | null> {
  const row = await db
    .prepare("SELECT id, email, unsub_token FROM subscribers WHERE confirm_token = ?")
    .bind(token)
    .first<{ id: number; email: string; unsub_token: string }>();

  if (!row) return null;

  await db
    .prepare(
      "UPDATE subscribers SET confirmed_at = datetime('now'), unsubscribed_at = NULL, confirm_token = NULL WHERE id = ?"
    )
    .bind(row.id)
    .run();

  return { email: row.email, unsubToken: row.unsub_token };
}

/** Idempotent on purpose — clicking unsubscribe twice should still read as
 *  "you're unsubscribed", never as an error. */
export async function unsubscribeByToken(
  db: D1Database,
  token: string
): Promise<{ email: string } | null> {
  const row = await db
    .prepare("SELECT id, email FROM subscribers WHERE unsub_token = ?")
    .bind(token)
    .first<{ id: number; email: string }>();

  if (!row) return null;

  await db
    .prepare("UPDATE subscribers SET unsubscribed_at = datetime('now') WHERE id = ?")
    .bind(row.id)
    .run();

  return { email: row.email };
}

/** Everyone who confirmed and hasn't opted out. */
export async function listActive(
  db: D1Database
): Promise<{ email: string; unsub_token: string }[]> {
  const { results } = await db
    .prepare(
      "SELECT email, unsub_token FROM subscribers WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL ORDER BY confirmed_at"
    )
    .all<{ email: string; unsub_token: string }>();

  return results ?? [];
}

export async function counts(
  db: D1Database
): Promise<{ active: number; pending: number; unsubscribed: number }> {
  const row = await db
    .prepare(
      `SELECT
         SUM(CASE WHEN confirmed_at IS NOT NULL AND unsubscribed_at IS NULL THEN 1 ELSE 0 END) AS active,
         SUM(CASE WHEN confirmed_at IS NULL AND unsubscribed_at IS NULL THEN 1 ELSE 0 END) AS pending,
         SUM(CASE WHEN unsubscribed_at IS NOT NULL THEN 1 ELSE 0 END) AS unsubscribed
       FROM subscribers`
    )
    .first<{ active: number | null; pending: number | null; unsubscribed: number | null }>();

  return {
    active: row?.active ?? 0,
    pending: row?.pending ?? 0,
    unsubscribed: row?.unsubscribed ?? 0,
  };
}
