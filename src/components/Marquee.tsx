const ITEMS = [
  "On-device ML",
  "Computer Vision",
  "C++ / Systems",
  "WebGPU",
  "Game Boy Emulator",
  "LLM Security",
  "Ships in your browser",
];

/** Full-bleed scrolling ticker strip. Pure CSS animation; pauses on hover,
 *  freezes into a static row under prefers-reduced-motion. */
export function Marquee() {
  return (
    <div className="marquee py-3 bg-bg-alt/60" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {ITEMS.map((item) => (
              <span
                key={item}
                className="flex items-center text-[11px] font-mono tracking-[0.22em] uppercase text-text-muted"
              >
                <span className="mx-7">{item}</span>
                <span className="w-1 h-1 bg-accent/40 rounded-[1px]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
