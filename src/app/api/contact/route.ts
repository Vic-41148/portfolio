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

    console.log("[contact] Resend client created, attempting send...", { to: "adityashibu41148@gmail.com", from: "contact@adityashibu.com" });

    try {
      const { data, error } = await resend.emails.send({
        from: "Portfolio Contact <contact@adityashibu.com>",
        to: "adityashibu41148@gmail.com",
        subject: `Contact from ${name}`,
        replyTo: email,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
      });

      if (error) {
        console.error("[contact] Resend API returned error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log("[contact] Email sent successfully:", data);
      return NextResponse.json({ ok: true });
    } catch (sendErr) {
      console.error("[contact] Resend send() threw:", sendErr);
      return NextResponse.json({ error: "Send failed" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
