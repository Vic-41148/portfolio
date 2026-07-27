import Link from "next/link";
import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { Resend } from "resend";
import { CONTACT_FROM } from "@/lib/constants";
import { welcomeEmail } from "@/lib/emails";
import { confirmByToken, getDb, getSecret } from "@/lib/subscribers";

export const metadata: Metadata = {
  title: "Confirm subscription",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let state: "ok" | "invalid" | "unavailable" = "invalid";

  if (token) {
    const db = await getDb();
    if (!db) {
      state = "unavailable";
    } else {
      // A binding that errors (unapplied migration, placeholder id) should read
      // as "not available", never as a crashed page.
      const confirmed = await confirmByToken(db, token).catch(() => {
        state = "unavailable";
        return null;
      });
      if (confirmed) {
        state = "ok";
        // Welcome mail doubles as proof the address works and carries the
        // unsubscribe link from the first message onward.
        const apiKey = await getSecret("RESEND_API_KEY");
        if (apiKey) {
          const mail = welcomeEmail(confirmed.unsubToken);
          const { error } = await new Resend(apiKey).emails
            .send({
              from: CONTACT_FROM,
              to: confirmed.email,
              subject: mail.subject,
              html: mail.html,
              text: mail.text,
            })
            // The subscription is already saved, so a failed welcome isn't
            // fatal — but it must not vanish silently either.
            .catch((cause) => ({ error: cause as Error }));

          if (error) console.error("welcome email failed:", error);
        } else {
          console.error("welcome email skipped: RESEND_API_KEY unavailable");
        }
      }
    }
  }

  return (
    <div className="pt-32 pb-24 min-h-[70vh]">
      <div className="mx-auto max-w-md px-6 text-center">
        <div
          className={`mx-auto mb-5 w-12 h-12 rounded-2xl border flex items-center justify-center ${
            state === "ok"
              ? "bg-demo-success/10 border-demo-success/30 text-demo-success"
              : "bg-elevated border-border text-text-muted"
          }`}
        >
          {state === "ok" ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
        </div>

        <h1 className="font-display text-3xl mb-3">
          {state === "ok" ? "You're on the list" : state === "unavailable" ? "Not available" : "Link didn't work"}
        </h1>

        <p className="text-text-secondary mb-8">
          {state === "ok"
            ? "I'll email you when I publish something new. Every email has an unsubscribe link — no hard feelings."
            : state === "unavailable"
              ? "Subscriptions aren't set up on this deployment yet."
              : "That confirmation link is invalid or has already been used. Try signing up again from the footer."}
        </p>

        <Link
          href={state === "ok" ? "/writing" : "/"}
          className="btn-sheen inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:brightness-110 focus-ring"
        >
          {state === "ok" ? "Read the posts" : "Back home"}
        </Link>
      </div>
    </div>
  );
}
