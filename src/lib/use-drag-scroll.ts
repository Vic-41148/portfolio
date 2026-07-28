"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Grab-and-fling with revolver-spin physics:
 *
 *  Phase 1 — Momentum: slow decay (0.975/frame) for a long, weighted coast.
 *             Slow drags get a minimum fling so there's always some spin.
 *  Phase 2 — Settle: once velocity bleeds out, ease-out-expo to the nearest
 *             card boundary. Loop correction is paused during this phase so
 *             the copy-wrap jump can't interrupt the settle animation.
 *
 *  Pass `loop: true` when the container renders its content three times —
 *  starts on the middle copy and silently rewinds at copy boundaries. */
export function useDragScroll<T extends HTMLElement>(options?: { loop?: boolean }): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const loop = options?.loop ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanups: Array<() => void> = [];

    let rafId = 0;
    // When true, the loop-correction scroll listener is suspended so it
    // can't jump scrollLeft mid-settle and break the animation.
    let isSettling = false;

    const cancelRaf = () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      isSettling = false;
    };

    if (loop) {
      let setWidth = el.scrollWidth / 3;

      el.style.visibility = "hidden";
      el.scrollLeft = setWidth;
      requestAnimationFrame(() => { el.style.visibility = ""; });

      const onResize = () => { setWidth = el.scrollWidth / 3; };

      const onScroll = () => {
        // Skip while we're in the settle animation — a mid-animation wrap
        // would teleport scrollLeft and make the ease look like a snap.
        if (setWidth === 0 || isSettling) return;
        if (el.scrollLeft < setWidth * 0.5) {
          el.scrollLeft += setWidth;
        } else if (el.scrollLeft > setWidth * 1.5) {
          el.scrollLeft -= setWidth;
        }
      };

      window.addEventListener("resize", onResize);
      el.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("resize", onResize);
        el.removeEventListener("scroll", onScroll);
      });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => cleanups.forEach((fn) => fn());
    }

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let velocity = 0;
    let lastX = 0;
    let lastT = 0;

    // Fast in, very slow out — gives the card-landing a buttery deceleration.
    const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const findNearestCard = (): HTMLElement | null => {
      const items = Array.from(el.querySelectorAll<HTMLElement>(".slider-item"));
      if (!items.length) return null;
      const origin = el.getBoundingClientRect().left;
      let best: HTMLElement = items[0];
      let bestDist = Infinity;
      for (const item of items) {
        const dist = Math.abs(item.getBoundingClientRect().left - origin);
        if (dist < bestDist) { bestDist = dist; best = item; }
      }
      return best;
    };

    const settleToNearest = () => {
      const nearest = findNearestCard();
      if (!nearest) return;

      const origin = el.getBoundingClientRect().left;
      const offset = nearest.getBoundingClientRect().left - origin;

      // Already landed — nothing to do.
      if (Math.abs(offset) < 1) return;

      const from = el.scrollLeft;
      const target = from + offset;

      // Suspend loop correction for the duration of this animation.
      isSettling = true;

      // Scale duration so a 1-card settle (~350px) ≈ 380ms; a tiny nudge ≈ 180ms.
      const duration = Math.min(560, Math.max(180, Math.abs(offset) * 1.1));
      const t0 = performance.now();

      const frame = (now: number) => {
        const t = Math.min((now - t0) / duration, 1);
        el.scrollLeft = from + offset * easeOutExpo(t);
        if (t < 1) {
          rafId = requestAnimationFrame(frame);
        } else {
          isSettling = false;
          // Re-trigger loop correction now that we're done.
          el.dispatchEvent(new Event("scroll"));
        }
      };
      rafId = requestAnimationFrame(frame);
    };

    // Phase 1: Spin with slow decay. Hands off to settleToNearest when
    // velocity bleeds out below the threshold.
    const runMomentum = () => {
      if (Math.abs(velocity) < 0.07) {
        settleToNearest();
        return;
      }
      el.scrollLeft -= velocity * 16;
      velocity *= 0.975; // ~0.975^60 ≈ 0.21 after one second — long coast
      rafId = requestAnimationFrame(runMomentum);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      isDown = true;
      cancelRaf();
      startX = e.clientX;
      startScroll = el.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      el.classList.add("dragging");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        // EMA smoothing: reduces jitter from sudden direction micro-changes.
        velocity = velocity * 0.55 + ((e.clientX - lastX) / dt) * 0.45;
        lastX = e.clientX;
        lastT = now;
      }
    };

    const onPointerUp = () => {
      if (!isDown) return;
      isDown = false;
      el.classList.remove("dragging");

      // Slow drags: give a minimum fling so there's always *some* coast.
      // Without this, a gentle drag releases with velocity ≈ 0 and
      // goes straight to settle with no spin at all.
      const MIN_FLING = 0.28; // px/ms
      if (Math.abs(velocity) > 0.008 && Math.abs(velocity) < MIN_FLING) {
        velocity = Math.sign(velocity) * MIN_FLING;
      }

      runMomentum();
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    cleanups.push(() => {
      cancelRaf();
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    });

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
