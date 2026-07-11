import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Typewriter } from "@/components/Typewriter";

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Typewriter", () => {
  it("renders the full text immediately in the sr-only span for SSR/SEO", () => {
    render(<Typewriter text="Hello World" />);

    const srOnly = screen.getByText("Hello World");
    expect(srOnly).toBeInTheDocument();
    expect(srOnly.closest(".sr-only")).toBeInTheDocument();
  });

  it("starts with empty visible text before typing begins", () => {
    render(<Typewriter text="Hi" speed={50} />);

    const ariaHidden = document.querySelector('[aria-hidden="true"]');
    expect(ariaHidden?.textContent).toBe("");
  });

  it("types characters one by one after delay", () => {
    render(<Typewriter text="ABC" delay={1} speed={100} />);

    // Nothing typed yet (still in delay period)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    const ariaHidden = document.querySelector('[aria-hidden="true"]');
    expect(ariaHidden?.textContent).toBe("");

    // Delay period over, first tick fires (delay=1s, so at t=1000)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(ariaHidden?.textContent).toBe("A");

    // Second character (at t=1100)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(ariaHidden?.textContent).toBe("AB");

    // Third character (at t=1200)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(ariaHidden?.textContent).toBe("ABC");
  });

  it("calls onDone when typing completes", () => {
    const onDone = vi.fn();

    render(<Typewriter text="Hi" delay={0} speed={50} onDone={onDone} />);

    expect(onDone).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("sets data-done attribute on cursor when finished", () => {
    render(<Typewriter text="X" delay={0} speed={50} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const cursor = document.querySelector(".typewriter-cursor");
    expect(cursor).toHaveAttribute("data-done", "true");
  });

  it("hides cursor when showCursor is false", () => {
    render(<Typewriter text="Hi" showCursor={false} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const cursor = document.querySelector(".typewriter-cursor");
    expect(cursor).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Typewriter text="Hi" className="custom-class" />
    );

    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("applies custom cursorClassName", () => {
    render(<Typewriter text="Hi" cursorClassName="my-cursor" />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const cursor = document.querySelector(".my-cursor");
    expect(cursor).toBeInTheDocument();
  });
});
