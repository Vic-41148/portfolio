import type Lenis from "lenis";

/** Fired when something elsewhere on the page wants the contact form filled in
 *  and focused — the engagement cards, for now. A DOM event keeps Contact from
 *  needing a provider just to accept a nudge from one section. */
export const CONTACT_INTENT_EVENT = "contact:intent";

export interface ContactIntent {
  message: string;
}

/** Smooth-scrolls to an element id, matching the nav's behaviour (Lenis when
 *  it's running, native scroll otherwise). */
export function scrollToId(id: string, offset = -80) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function requestContact(intent: ContactIntent) {
  scrollToId("contact");
  window.dispatchEvent(new CustomEvent<ContactIntent>(CONTACT_INTENT_EVENT, { detail: intent }));
}
