import { NextResponse } from "next/server";
import { authorize } from "@/lib/admin-auth";
import { counts, getDb } from "@/lib/subscribers";

export const runtime = "nodejs";

/** Counts only — the editor never needs the addresses themselves, and not
 *  shipping them to the browser keeps other people's emails out of a page that
 *  only a password protects. */
export async function GET(request: Request) {
  const auth = await authorize(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Subscriptions aren't configured." }, { status: 503 });
  }

  try {
    return NextResponse.json(await counts(db));
  } catch {
    return NextResponse.json({ error: "Could not read the subscriber list." }, { status: 500 });
  }
}
