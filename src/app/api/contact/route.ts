import { NextResponse } from "next/server";
import { Resend } from "resend";

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
      console.warn("[contact] RESEND_API_KEY not set");
      return NextResponse.json(
        { error: "The email service isn't set up yet on my end — reach me directly at adityashibu275898@gmail.com instead." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <contact@adityashibu.com>",
      to: "adityashibu41148@gmail.com",
      subject: `Contact from ${name}`,
      reply_to: email,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    if (error) {
      console.error("[contact] Resend API error:", error);
      return NextResponse.json(
        { error: "Couldn't send your message right now — try again in a minute, or email me directly at adityashibu275898@gmail.com." },
        { status: 500 }
      );
    }

    console.log("[contact] Email sent:", data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something broke on my end — try again, or just email me at adityashibu275898@gmail.com." },
      { status: 400 }
    );
  }
}
