"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/constants";

export interface ShortlistItem {
  slug: string;
  title: string;
  href: string;
}

interface ShortlistContextValue {
  items: ShortlistItem[];
  isOpen: boolean;
  add: (item: ShortlistItem) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  open: () => void;
  close: () => void;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const add = useCallback((item: ShortlistItem) => {
    setIsOpen(true);
    setItems((prev) => (prev.some((p) => p.slug === item.slug) ? prev : [...prev, item]));
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const has = useCallback((slug: string) => items.some((p) => p.slug === slug), [items]);

  return (
    <ShortlistContext.Provider
      value={{
        items,
        isOpen,
        add,
        remove,
        has,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be inside ShortlistProvider");
  return ctx;
}

/** Builds a mailto: link listing the shortlisted projects — the honest
 *  stand-in for a cart checkout. No fake commerce, just a prefilled email. */
export function buildShortlistMailto(items: ShortlistItem[]) {
  const subject = encodeURIComponent("Projects I want to talk about");
  const lines = items.map((item) => `- ${item.title}: ${new URL(item.href, SITE_URL).toString()}`);
  const body = encodeURIComponent(
    `Hey Aditya,\n\nI looked through your work and want to talk about:\n\n${lines.join("\n")}\n\n`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
