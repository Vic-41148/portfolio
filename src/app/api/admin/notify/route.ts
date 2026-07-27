import { NextResponse } from "next/server";
import { Resend } from "resend";
import { authorize } from "@/lib/admin-auth";
import { CONTACT_FROM } from "@/lib/constants";
import { postAnnouncementEmail, unsubscribeUrl } from "@/lib/emails";
import { isValidSlug } from "@/lib/frontmatter";
import { getDb, getSecret, listActive } from "@/lib/subscribers";

export const runtime = "nodejs";

/** Resend's free tier allows 100 emails/day. Stop well short rather than
 *  half-sending a batch and leaving no record of who got it. */
const DAILY_SEND_CAP = 90;

export async function POST(request: Request) {
  const auth = await authorize(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Subscriptions aren't configured." }, { status: 503 });
  }

  const apiKey = await getSecret("RESEND_API_KEY");
  if (!apiKey) {
    return NextResponse.json({ error: "Email isn't configured." }, { status: 503 });
  }

  let slug = "";
  let title = "";
  let excerpt = "";
  try {
    const body = (await request.json()) as { slug?: unknown; title?: unknown; excerpt?: unknown };
    slug = typeof body.slug === "string" ? body.slug.trim() : "";
    title = typeof body.title === "string" ? body.title.trim() : "";
    excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!isValidSlug(slug) || !title) {
    return NextResponse.json({ error: "A published post slug and title are required." }, { status: 400 });
  }

  try {
    const subscribers = await listActive(db);

    if (subscribers.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, skipped: 0 });
    }

    if (subscribers.length > DAILY_SEND_CAP) {
      return NextResponse.json(
        {
          error: `${subscribers.length} subscribers is over the ${DAILY_SEND_CAP}/day cap this sends within. Upgrade the email plan before announcing to a list this size.`,
        },
        { status: 409 }
      );
    }

    const resend = new Resend(apiKey);
    let sent = 0;
    const failed: string[] = [];

    // One message per subscriber rather than a bulk BCC: each needs its own
    // unsubscribe link, and BCC would leak nothing but also opt everyone into
    // the same generic footer.
    for (const subscriber of subscribers) {
      const mail = postAnnouncementEmail({ title, excerpt, slug }, subscriber.unsub_token);
      const { error } = await resend.emails.send({
        from: CONTACT_FROM,
        to: subscriber.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: {
          // Lets Gmail/Outlook show a native unsubscribe control.
          "List-Unsubscribe": `<${unsubscribeUrl(subscriber.unsub_token)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      if (error) {
        failed.push(subscriber.email);
      } else {
        sent += 1;
      }
    }

    return NextResponse.json({ ok: true, sent, failed: failed.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sending failed." },
      { status: 500 }
    );
  }
}
