import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Marquee } from "@/components/Marquee";

describe("Marquee", () => {
  it("renders all marquee items (duplicated for loop)", () => {
    render(<Marquee />);

    const items = [
      "No cloud dependency",
      "On-device ML",
      "No bloated frameworks",
      "Computer Vision",
      "No boilerplate tutorials",
      "C++ / Systems",
      "Nothing phoning home",
      "Ships in your browser",
    ];

    for (const item of items) {
      const els = screen.getAllByText(item);
      expect(els.length).toBe(2); // each item appears in both copies
    }
  });

  it("is marked as aria-hidden for screen readers", () => {
    const { container } = render(<Marquee />);

    const wrapper = container.querySelector(".marquee");
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });

  it("renders duplicate content for seamless loop", () => {
    const { container } = render(<Marquee />);

    const tracks = container.querySelectorAll(".marquee-track > div");
    expect(tracks.length).toBe(2);
  });
});
