"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Grab-and-fling scrolling with a "revolver spin" feel:
 *  - Fling carries with high velocity and slow decay (~0.975 per frame)
 *  - When momentum bleeds out, a smooth ease-out-quint settle glides to
 *    the nearest card boundary — no CSS scroll-snap, fully JS-controlled.
 *
 *  Pass `loop: true` when the container renders its content three times —
 *  starts on the middle copy and silently rewinds whenever you drift to an
 *  outer copy so the scroll never visibly hits an edge. */
export function useDragScroll<T extends HTMLElement>(options?: { loop?: boolean }): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const loop = options?.loop ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanups: Array<() => void> = [];

    if (loop) {
      let setWidth = el.scrollWidth / 3;

      el.style.visibility = "hidden";
      el.scrollLeft = setWidth;
      requestAnimationFrame(() => {
        el.style.visibility = "";
      });

      const onResize = () => { setWidth = el.scrollWidth / 3; };
      const onScroll = () => {
        if (setWidth === 0) return;
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
    let rafId = 0;

    const cancelRaf = () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    };

    /** Ease-out quint: fast start, very gradual stop — the "settling" curve. */
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    /** After momentum bleeds out, find the nearest .slider-item left edge
     *  and ease to it smoothly over `duration` ms. */
    const settleToNearest = () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>(".slider-item"));
      if (!items.length) return;

      const containerLeft = el.getBoundingClientRect().left;
      // Snap reference: aim for whichever card's left edge is closest to the
      // left side of the viewport/container.
      let best = items[0];
      let bestDist = Infinity;
      for (const item of items) {
        const dist = Math.abs(item.getBoundingClientRect().left - containerLeft);
        if (dist < bestDist) { bestDist = dist; best = item; }
      }

      const target = el.scrollLeft + (best.getBoundingClientRect().left - containerLeft);
      const from = el.scrollLeft;
      const delta = target - from;
      if (Math.abs(delta) < 1) return;

      const duration = Math.min(500, Math.max(280, Math.abs(delta) * 0.6));
      const startTime = performance.now();

      const frame = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        el.scrollLeft = from + delta * easeOutQuint(t);
        if (t < 1) { rafId = requestAnimationFrame(frame); }
      };
      rafId = requestAnimationFrame(frame);
    };

    /** Spin phase: high carry, slow decay. When velocity is exhausted,
     *  hand off to settleToNearest for the clean landing. */
    const runMomentum = () => {
      if (Math.abs(velocity) < 0.05) {
        // Velocity bled out — settle to nearest card.
        settleToNearest();
        return;
      }
      el.scrollLeft -= velocity * 18;
      velocity *= 0.975; // slow decay = long revolver spin
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
        // Exponential moving average for smoother velocity reading.
        velocity = velocity * 0.5 + ((e.clientX - lastX) / dt) * 0.5;
        lastX = e.clientX;
        lastT = now;
      }
    };

    const onPointerUp = () => {
      if (!isDown) return;
      isDown = false;
      el.classList.remove("dragging");
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
