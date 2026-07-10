import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("RESEND_API_KEY not set");
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Portfolio Contact <contact@adityashibu.com>",
      to: "adityashibu41148@gmail.com",
      subject: `Contact from ${name}`,
      replyTo: email,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
