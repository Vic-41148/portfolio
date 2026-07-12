import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/lib/theme";

function TestConsumer() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

const storage: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => storage[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    storage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete storage[key];
  }),
  clear: vi.fn(() => {
    for (const key of Object.keys(storage)) delete storage[key];
  }),
  get length() {
    return Object.keys(storage).length;
  },
  key: vi.fn((i: number) => Object.keys(storage)[i] ?? null),
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorageMock.clear();
    for (const key of Object.keys(storage)) delete storage[key];
    document.documentElement.classList.remove("dark");

    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("defaults to dark (SSR default)", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("toggle switches between light and dark", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");

    act(() => {
      screen.getByRole("button", { name: /toggle/i }).click();
    });

    expect(screen.getByTestId("theme").textContent).toBe("light");

    act(() => {
      screen.getByRole("button", { name: /toggle/i }).click();
    });

    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("persists theme to localStorage", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    act(() => {
      screen.getByRole("button", { name: /toggle/i }).click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("adds dark class to documentElement for dark theme", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when toggled to light", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    act(() => {
      screen.getByRole("button", { name: /toggle/i }).click();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

describe("useTheme", () => {
  it("throws when used outside ThemeProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    function Bad() {
      useTheme();
      return null;
    }

    expect(() => render(<Bad />)).toThrow(/useTheme must be inside ThemeProvider/);

    consoleSpy.mockRestore();
  });
});
