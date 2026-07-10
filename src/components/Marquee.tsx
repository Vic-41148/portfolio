const ITEMS = [
  "No cloud dependency",
  "On-device ML",
  "No bloated frameworks",
  "Computer Vision",
  "No boilerplate tutorials",
  "C++ / Systems",
  "Nothing phoning home",
  "Ships in your browser",
];

/** Full-bleed scrolling benefits strip — the "no junk" moment, solid accent
 *  band. Pure CSS animation; pauses on hover, freezes into a static row
 *  under prefers-reduced-motion. */
export function Marquee() {
  return (
    <div className="marquee marquee-solid py-3" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {ITEMS.map((item) => (
              <span
                key={item}
                className="flex items-center text-base sm:text-lg font-display uppercase"
              >
                <span className="mx-5">{item}</span>
                <span aria-hidden="true">&#10022;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
