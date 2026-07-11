import { describe, it, expect } from "vitest";
import { cn, trackSpotlight, trackTilt, resetTilt } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("concatenates multiple classes", () => {
    expect(cn("px-4", "mt-2")).toBe("px-4 mt-2");
  });

  it("handles falsy values", () => {
    expect(cn("foo", false, null, undefined, "")).toBe("foo");
  });

  it("returns empty string for no args", () => {
    expect(cn()).toBe("");
  });
});

describe("trackSpotlight", () => {
  it("sets --mx and --my on the current target", () => {
    const el = document.createElement("div");
    el.getBoundingClientRect = () => ({
      top: 100,
      left: 50,
      width: 200,
      height: 150,
      right: 250,
      bottom: 250,
      x: 50,
      y: 100,
      toJSON: () => {},
    });

    const e = {
      currentTarget: el,
      clientX: 120,
      clientY: 180,
    } as unknown as React.MouseEvent<HTMLElement>;

    trackSpotlight(e);

    expect(el.style.getPropertyValue("--mx")).toBe("70px");
    expect(el.style.getPropertyValue("--my")).toBe("80px");
  });
});

describe("trackTilt", () => {
  it("sets --rx, --ry, --tz, --shine-pos based on pointer position", () => {
    const el = document.createElement("div");
    el.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const e = {
      currentTarget: el,
      clientX: 150,
      clientY: 25,
    } as unknown as React.MouseEvent<HTMLElement>;

    trackTilt(e);

    const ry = parseFloat(el.style.getPropertyValue("--ry"));
    const rx = parseFloat(el.style.getPropertyValue("--rx"));
    const tz = el.style.getPropertyValue("--tz");
    const shine = parseFloat(el.style.getPropertyValue("--shine-pos"));

    // px = 150/200 = 0.75, ry = (0.75 - 0.5) * 18 = 4.5
    expect(ry).toBeCloseTo(4.5, 1);
    // py = 25/100 = 0.25, rx = (0.5 - 0.25) * 18 = 4.5
    expect(rx).toBeCloseTo(4.5, 1);
    expect(tz).toBe("12px");
    // shine = 0.75 * 100 = 75
    expect(shine).toBeCloseTo(75, 1);
  });
});

describe("resetTilt", () => {
  it("resets --rx, --ry, --tz to zero", () => {
    const el = document.createElement("div");
    el.style.setProperty("--rx", "10deg");
    el.style.setProperty("--ry", "10deg");
    el.style.setProperty("--tz", "12px");

    const e = {
      currentTarget: el,
    } as unknown as React.MouseEvent<HTMLElement>;

    resetTilt(e);

    expect(el.style.getPropertyValue("--rx")).toBe("0deg");
    expect(el.style.getPropertyValue("--ry")).toBe("0deg");
    expect(el.style.getPropertyValue("--tz")).toBe("0px");
  });
});
