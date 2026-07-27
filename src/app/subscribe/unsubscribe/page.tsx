import Link from "next/link";
import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { getDb, unsubscribeByToken } from "@/lib/subscribers";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let done = false;

  if (token) {
    const db = await getDb();
    // Idempotent: a second click still reads as "you're unsubscribed".
    if (db) done = (await unsubscribeByToken(db, token).catch(() => null)) !== null;
  }

  return (
    <div className="pt-32 pb-24 min-h-[70vh]">
      <div className="mx-auto max-w-md px-6 text-center">
        <div
          className={`mx-auto mb-5 w-12 h-12 rounded-2xl border flex items-center justify-center ${
            done ? "bg-elevated border-border text-text-secondary" : "bg-elevated border-border text-text-muted"
          }`}
        >
          {done ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
        </div>

        <h1 className="font-display text-3xl mb-3">
          {done ? "Unsubscribed" : "Link didn't work"}
        </h1>

        <p className="text-text-secondary mb-8">
          {done
            ? "You won't get any more emails from me. If that was a mistake, you can sign up again from the footer."
            : "That unsubscribe link is invalid. If you're still getting emails, reply to one and I'll take you off by hand."}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm text-text-secondary hover:text-text-primary hover:border-text-muted transition-all focus-ring"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
