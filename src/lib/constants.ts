/** The live domain. Every absolute URL the site emits derives from this —
 *  sitemap entries, OG tags, and the confirm/unsubscribe links in emails — so
 *  a wrong value here ships dead links straight to people's inboxes. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://adityashibu.com";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "adityashibu275898@gmail.com";
export const CONTACT_RECIPIENT = process.env.CONTACT_EMAIL || "adityashibu275898@gmail.com";
export const CONTACT_FROM = process.env.CONTACT_FROM || "Aditya Shibu <contact@adityashibu.com>";
export const MEDIAPIPE_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
