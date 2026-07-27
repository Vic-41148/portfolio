import { SITE_URL } from "@/lib/constants";

export function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function confirmUrl(token: string) {
  return `${SITE_URL}/subscribe/confirm?token=${encodeURIComponent(token)}`;
}

export function unsubscribeUrl(token: string) {
  return `${SITE_URL}/subscribe/unsubscribe?token=${encodeURIComponent(token)}`;
}

const shell = (body: string) => `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#14161B;max-width:34rem">${body}</div>`;

/** Double opt-in. Deliberately does not include an unsubscribe link — there is
 *  nothing to unsubscribe from until this is clicked. */
export function confirmEmail(token: string) {
  const url = confirmUrl(token);

  return {
    subject: "Confirm your subscription",
    html: shell(`
      <p>Someone (hopefully you) asked for an email whenever I publish something new.</p>
      <p><a href="${url}" style="display:inline-block;padding:10px 18px;background:#14161B;color:#fff;border-radius:8px;text-decoration:none">Confirm subscription</a></p>
      <p style="color:#5A606B;font-size:13px">If that wasn't you, ignore this — nothing happens without the click, and you won't hear from me again.</p>
      <p style="color:#5A606B;font-size:13px">Or paste this into your browser:<br><span style="word-break:break-all">${url}</span></p>
    `),
    text: `Someone (hopefully you) asked for an email whenever I publish something new.\n\nConfirm: ${url}\n\nIf that wasn't you, ignore this — nothing happens without the click.`,
  };
}

export function welcomeEmail(unsubToken: string) {
  const unsub = unsubscribeUrl(unsubToken);

  return {
    subject: "You're on the list",
    html: shell(`
      <p>Confirmed — I'll email you when I publish something new. Not often, and never anything else.</p>
      <p><a href="${SITE_URL}/writing" style="color:#0E7490">Read what's there already</a></p>
      <p style="color:#5A606B;font-size:13px"><a href="${unsub}" style="color:#5A606B">Unsubscribe</a></p>
    `),
    text: `Confirmed — I'll email you when I publish something new.\n\nRead what's there already: ${SITE_URL}/writing\n\nUnsubscribe: ${unsub}`,
  };
}

export function postAnnouncementEmail(post: {
  title: string;
  excerpt: string;
  slug: string;
}, unsubToken: string) {
  const url = `${SITE_URL}/writing/${post.slug}`;
  const unsub = unsubscribeUrl(unsubToken);

  return {
    subject: post.title,
    html: shell(`
      <h1 style="font-size:22px;margin:0 0 8px">${escapeHtml(post.title)}</h1>
      ${post.excerpt ? `<p style="color:#5A606B">${escapeHtml(post.excerpt)}</p>` : ""}
      <p><a href="${url}" style="display:inline-block;padding:10px 18px;background:#14161B;color:#fff;border-radius:8px;text-decoration:none">Read it</a></p>
      <p style="color:#5A606B;font-size:13px"><a href="${unsub}" style="color:#5A606B">Unsubscribe</a></p>
    `),
    text: `${post.title}\n\n${post.excerpt}\n\nRead it: ${url}\n\nUnsubscribe: ${unsub}`,
  };
}
