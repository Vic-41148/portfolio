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

/** Feeds pointer position to a `.tilt-3d` element as --rx/--ry/--tz/--shine-pos.
 *  Mutates style directly — no re-render per mousemove. */
export function trackTilt(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  el.style.setProperty("--ry", `${(px - 0.5) * 18}deg`);
  el.style.setProperty("--rx", `${(0.5 - py) * 18}deg`);
  el.style.setProperty("--tz", "12px");
  el.style.setProperty("--shine-pos", `${px * 100}%`);
}

export function resetTilt(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
  el.style.setProperty("--tz", "0px");
}
