"use client";

import { useState } from "react";
import { ChevronDown, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, MaskText } from "@/components/Reveal";
import { motion } from "motion/react";
import { TeachDemo } from "@/components/demo/TeachDemo";

export function LiveDemo() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section id="demo" className="py-24 sm:py-32 border-t border-border relative overflow-hidden">
      {/* This is the loud cyan moment — the rest of the site keeps accent scarce, this section commits */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_55%_at_50%_25%,var(--accent-muted)_0%,transparent_65%)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04] bg-repeat"
        style={{ backgroundImage: "url(/images/textures/scanline.png)", backgroundSize: "512px 512px" }}
      />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <Reveal>
          <div className="mb-12">
            <p className="section-eyebrow">
              <span className="text-accent">&#9733;</span> Live Demo
            </p>
            <h2 className="section-heading">
              <MaskText>Teach my page to see you</MaskText>
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <p className="section-desc !mt-0 flex-1 min-w-[260px]">
                Turn on your camera, show it two hand gestures, and my model learns to tell
                them apart — live, in your browser, in seconds.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-muted border border-accent/20 text-xs font-mono text-accent shrink-0">
                <Shield className="w-3 h-3" />
                Nothing leaves your device
              </span>
            </div>
          </div>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="demo-frame glow-accent"
        >
          <div className="overflow-hidden">
            <TeachDemo />
          </div>
        </motion.div>

        <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors focus-ring rounded-sm"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform", showDetails && "rotate-180")} />
            How this works
          </button>

          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Zap className="w-3 h-3" />
            <span>Powered by MediaPipe + WebGPU — 30+ fps on-device</span>
          </div>
        </div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-6 rounded-xl border border-border bg-elevated text-sm text-text-secondary leading-relaxed space-y-3"
          >
            <p>
              <strong className="text-text-primary">Pipeline:</strong>{" "}
              MediaPipe Tasks extracts 21 hand landmarks from each video frame.
              Landmarks are normalized relative to the wrist and L2-normalized
              for scale/position invariance. A K-Nearest Neighbors classifier
              compares new frames to your captured examples.
            </p>
            <p>
              <strong className="text-text-primary">How it runs:</strong>{" "}
              Landmark detection uses the WebGPU delegate when available, falling
              back to WebGL. The entire pipeline — capture, train, classify —
              happens in the browser with zero server round-trips.
            </p>
            <p>
              <strong className="text-text-primary">Limitations:</strong>{" "}
              Works best in good lighting with the hand clearly visible. Occlusion,
              extreme angles, and motion blur reduce accuracy. The KNN classifier
              is simple — a production system would use a learned feature
              extractor + neural network.
            </p>
            <p>
              <strong className="text-text-primary">Stack:</strong>{" "}
              MediaPipe Tasks Vision · KNN Classifier · WebGPU · TypeScript
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
