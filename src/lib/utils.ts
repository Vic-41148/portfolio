import { type ClassValue, clsx } from "clsx";
import type { MouseEvent } from "react";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Feeds the pointer position to a `.card-spotlight` element as --mx/--my.
 *  Mutates style directly — no re-render per mousemove. */
export function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
