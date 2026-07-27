import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_FROM } from "@/lib/constants";
import { confirmEmail } from "@/lib/emails";
import { getDb, getSecret, isValidEmail, normalizeEmail, upsertPending } from "@/lib/subscribers";

export const runtime = "nodejs";

/** Per-isolate throttle, same approach as the editor's password route: it takes
 *  the cheapness out of scripted signups without pretending to be a real
 *  distributed rate limiter. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function throttled(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "local";
  if (throttled(ip)) {
    return NextResponse.json({ error: "Too many attempts — wait a minute." }, { status: 429 });
  }

  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Subscriptions aren't set up on this deployment yet." },
      { status: 503 }
    );
  }

  const apiKey = await getSecret("RESEND_API_KEY");
  if (!apiKey) {
    return NextResponse.json({ error: "Email isn't configured on this deployment." }, { status: 503 });
  }

  let pending: { confirmToken: string } | null;
  try {
    pending = await upsertPending(db, email);
  } catch {
    // Binding present but unusable — an unapplied migration or a placeholder
    // database id. Don't dress that up as a generic server error.
    return NextResponse.json(
      { error: "The subscriber database isn't reachable yet — try again later." },
      { status: 503 }
    );
  }

  try {

    // Already confirmed. Say the same thing either way so the endpoint can't be
    // used to test whether an address is on the list.
    if (!pending) {
      return NextResponse.json({ ok: true });
    }


    const mail = confirmEmail(pending.confirmToken);
    const { error } = await new Resend(apiKey).emails.send({
      from: CONTACT_FROM,
      to: email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });

    if (error) {
      return NextResponse.json(
        { error: "Couldn't send the confirmation email — try again in a minute." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something broke on my end — try again." }, { status: 500 });
  }
}
