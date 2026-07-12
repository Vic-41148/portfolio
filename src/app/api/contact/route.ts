import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_RECIPIENT, CONTACT_FROM, CONTACT_EMAIL } from "@/lib/constants";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Looks like a field is missing — please fill in your name, email, and message." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "That email address doesn't look right. Double-check it and try again." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: `The email service isn't set up yet on my end — reach me directly at ${CONTACT_EMAIL} instead.` },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_RECIPIENT,
      subject: `Contact from ${escapeHtml(name)}`,
      replyTo: email,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message)}</p>`,
    });

    if (error) {
      return NextResponse.json(
        { error: `Couldn't send your message right now — try again in a minute, or email me directly at ${CONTACT_EMAIL}.` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: `Something broke on my end — try again, or just email me at ${CONTACT_EMAIL}.` },
      { status: 400 }
    );
  }
}
