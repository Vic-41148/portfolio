import { NextResponse } from "next/server";
import { adminPassword, createToken, passwordMatches } from "@/lib/admin-auth";

export const runtime = "nodejs";

/** Per-isolate throttle. Not a distributed rate limiter — it just takes the
 *  cheapness out of scripted guessing; the real protection is a strong secret. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function throttled(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  const secret = adminPassword();
  if (!secret) {
    return NextResponse.json(
      { error: "Editor is not configured on this deployment." },
      { status: 503 }
    );
  }

  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "local";
  if (throttled(ip)) {
    return NextResponse.json({ error: "Too many attempts — wait a minute." }, { status: 429 });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!(await passwordMatches(password, secret))) {
    // Uniform delay so a wrong password can't be distinguished by timing.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const { token, exp } = await createToken(secret);
  return NextResponse.json({ token, exp });
}
