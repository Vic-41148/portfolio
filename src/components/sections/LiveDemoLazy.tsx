"use client";

import dynamic from "next/dynamic";

// Defers the @mediapipe/tasks-vision bundle (and its wasm loader) out of the
// main JS payload entirely — it's a below-the-fold, click-to-activate demo,
// so there's no reason to parse or SSR it on first load.
export const LiveDemo = dynamic(
  () => import("@/components/sections/LiveDemo").then((mod) => mod.LiveDemo),
  {
    ssr: false,
    loading: () => <div className="py-24 sm:py-32" aria-hidden="true" />,
  }
);
