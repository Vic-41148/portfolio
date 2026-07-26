"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Easter egg that reveals the editor link. Discovery only — the editor itself
 *  is gated by a server-checked password, so finding this in the bundle buys
 *  nothing. */
export function KonamiDoor() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let index = 0;

    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;

      const expected = SEQUENCE[index];
      const pressed = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (pressed === expected) {
        index += 1;
        if (index === SEQUENCE.length) {
          setOpen(true);
          index = 0;
        }
      } else {
        // A wrong key restarts, but still counts if it's a fresh first key.
        index = pressed === SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div className="mt-16 flex justify-center">
      <Link
        href="/writing/new"
        className="konami-door inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/40 bg-accent-muted font-mono text-xs text-accent hover:brightness-110 transition-all focus-ring"
      >
        <span aria-hidden="true">&gt;</span>
        new_post
      </Link>
    </div>
  );
}
