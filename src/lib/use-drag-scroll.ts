"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Grab-and-fling scrolling for a horizontal container — mouse drag moves
 *  scrollLeft directly, then releases into a momentum decay. Native touch
 *  and trackpad scrolling keep working untouched since this only hooks
 *  mouse events.
 *
 *  Pass `loop: true` when the container renders its content three times in
 *  a row (identical copies) — it starts centered on the middle copy and
 *  silently rewinds scrollLeft by one copy-width whenever the user drifts
 *  into an outer copy, so the drag/scroll never visibly hits an edge. */
export function useDragScroll<T extends HTMLElement>(options?: { loop?: boolean }): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const loop = options?.loop ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanups: Array<() => void> = [];

    if (loop) {
      let setWidth = el.scrollWidth / 3;

      // Set scroll position before the browser has painted, then reveal.
      // Without this the slider briefly shows copy 0 (scrollLeft=0) before
      // snapping to the center copy, which looks like a loading flash.
      el.style.visibility = "hidden";
      el.scrollLeft = setWidth;
      // Use rAF so the scroll settles before we make it visible.
      requestAnimationFrame(() => {
        el.style.visibility = "";
      });

      const onResize = () => {
        setWidth = el.scrollWidth / 3;
      };
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
    let momentumRaf = 0;

    const stopMomentum = () => {
      if (momentumRaf) cancelAnimationFrame(momentumRaf);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      isDown = true;
      stopMomentum();
      startX = e.clientX;
      startScroll = el.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      el.classList.add("dragging");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      el.scrollLeft = startScroll - dx;

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        velocity = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastT = now;
      }
    };

    const runMomentum = () => {
      if (Math.abs(velocity) < 0.02) return;
      el.scrollLeft -= velocity * 16;
      velocity *= 0.94;
      momentumRaf = requestAnimationFrame(runMomentum);
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
      stopMomentum();
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    });

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
