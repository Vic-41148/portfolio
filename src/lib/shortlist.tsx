"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/constants";

const STORAGE_KEY = "shortlist";

export interface ShortlistItem {
  slug: string;
  title: string;
  href: string;
}

interface ShortlistContextValue {
  items: ShortlistItem[];
  isOpen: boolean;
  /** False until the stored shortlist has been read, so the badge doesn't
   *  flash 0 on load and the count never mismatches during hydration. */
  ready: boolean;
  add: (item: ShortlistItem) => void;
  remove: (slug: string) => void;
  toggle: (item: ShortlistItem) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  open: () => void;
  close: () => void;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Restore after mount rather than during render — localStorage doesn't exist
  // on the server, and reading it inline would break hydration.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ShortlistItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item) => item?.slug && item?.title && item?.href));
        }
      }
    } catch {
      /* corrupt or unavailable storage just means an empty shortlist */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* private mode / quota — the shortlist still works for this session */
    }
  }, [items, ready]);

  const add = useCallback((item: ShortlistItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.slug === item.slug)) return prev;
      // Only announce itself the first time. Yanking the drawer open on every
      // add interrupts someone who's still browsing.
      if (prev.length === 0) setIsOpen(true);
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const toggle = useCallback(
    (item: ShortlistItem) => {
      setItems((prev) => {
        if (prev.some((p) => p.slug === item.slug)) {
          return prev.filter((p) => p.slug !== item.slug);
        }
        if (prev.length === 0) setIsOpen(true);
        return [...prev, item];
      });
    },
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<ShortlistContextValue>(
    () => ({
      items,
      isOpen,
      ready,
      add,
      remove,
      toggle,
      clear,
      has: (slug: string) => items.some((p) => p.slug === slug),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [items, isOpen, ready, add, remove, toggle, clear]
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be inside ShortlistProvider");
  return ctx;
}

function itemLines(items: ShortlistItem[]) {
  return items.map((item) => `- ${item.title} — ${new URL(item.href, SITE_URL).toString()}`);
}

/** Body for the on-site contact form — the primary path, since it actually
 *  sends. */
export function buildShortlistMessage(items: ShortlistItem[]) {
  return `Hi Aditya — I'd like to talk about these:\n\n${itemLines(items).join("\n")}\n\nWhat I'm working on:\n`;
}

/** mailto: fallback for anyone who'd rather use their own mail client. Kept as
 *  a secondary option because mailto: silently does nothing for people on
 *  webmail with no handler registered. */
export function buildShortlistMailto(items: ShortlistItem[]) {
  const subject = encodeURIComponent("Projects I want to talk about");
  const body = encodeURIComponent(buildShortlistMessage(items));
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
