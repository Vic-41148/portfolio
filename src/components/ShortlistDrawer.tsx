"use client";

import { useEffect, useRef } from "react";
import { X, Send, Trash2, Mail, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShortlist, buildShortlistMailto, buildShortlistMessage } from "@/lib/shortlist";
import { requestContact, scrollToId } from "@/lib/contact-intent";

export function ShortlistDrawer() {
  const { items, isOpen, close, remove, clear } = useShortlist();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Escape to close, and keep the page behind from scrolling — the same
  // treatment the mobile nav already gets.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  const discuss = () => {
    const message = buildShortlistMessage(items);
    close();
    // Let the drawer finish leaving before scrolling, or the scroll fights the
    // exit animation.
    window.setTimeout(() => requestContact({ message }), 220);
  };

  const browseWork = () => {
    close();
    window.setTimeout(() => scrollToId("work"), 220);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            onClick={close}
          />
          <motion.aside
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[26rem] bg-surface border-l border-border z-[201] flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Project shortlist"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h3 className="font-display text-2xl leading-none">Your shortlist</h3>
                {items.length > 0 && (
                  <p className="mt-1 text-xs font-mono text-text-muted">
                    {items.length} project{items.length === 1 ? "" : "s"}
                  </p>
                )}
              </div>
              <button
                ref={closeRef}
                onClick={close}
                className="text-text-muted hover:text-text-primary transition-colors focus-ring rounded-sm"
                aria-label="Close shortlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <p className="font-display text-2xl text-text-primary mb-2">Nothing yet</p>
                  <p className="text-sm text-text-muted mb-6">
                    Add the projects you want to talk about and send them over in one go.
                  </p>
                  <button
                    onClick={browseWork}
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:brightness-110 transition-all focus-ring rounded-sm"
                  >
                    Browse the work
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <ul className="relative">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.slug}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 py-3 border-b border-border last:border-0 overflow-hidden"
                      >
                        <a
                          href={item.href}
                          className="flex-1 text-sm font-medium hover:text-accent transition-colors"
                        >
                          {item.title}
                        </a>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => remove(item.slug)}
                          className="text-text-muted hover:text-accent transition-colors focus-ring rounded-sm"
                          aria-label={`Remove ${item.title} from shortlist`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={discuss}
                  className="btn-sheen inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium transition-all hover:brightness-110 focus-ring"
                >
                  Start the conversation
                  <Send className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center justify-between">
                  <a
                    href={buildShortlistMailto(items)}
                    className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors focus-ring rounded-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Use my email app instead
                  </a>
                  <button
                    onClick={clear}
                    className="text-xs text-text-muted hover:text-demo-warning transition-colors focus-ring rounded-sm"
                  >
                    Clear all
                  </button>
                </div>

                <p className="text-xs text-text-muted text-center">
                  Fills in the contact form with these projects. No account, no checkout.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
