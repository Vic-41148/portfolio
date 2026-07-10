"use client";

import { X, Send, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShortlist, buildShortlistMailto } from "@/lib/shortlist";

export function ShortlistDrawer() {
  const { items, isOpen, close, remove } = useShortlist();

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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[26rem] bg-surface border-l border-border z-[201] flex flex-col shadow-2xl"
            aria-label="Project shortlist"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="font-display text-2xl">Your shortlist</h3>
              <button
                onClick={close}
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Close shortlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-text-muted">
                  <p className="font-display text-2xl text-text-primary mb-2">Empty</p>
                  <p className="text-sm">Add a project you want to talk about.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.slug}
                      className="flex items-center gap-3 py-3 border-b border-border last:border-0"
                    >
                      <span className="flex-1 text-sm font-medium">{item.title}</span>
                      <button
                        onClick={() => remove(item.slug)}
                        className="text-text-muted hover:text-accent transition-colors"
                        aria-label={`Remove ${item.title} from shortlist`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-6 py-5 border-t border-border">
              <a
                href={items.length ? buildShortlistMailto(items) : undefined}
                aria-disabled={items.length === 0}
                className="btn-sheen inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium transition-all hover:brightness-110 aria-disabled:opacity-40 aria-disabled:pointer-events-none"
              >
                Send shortlist
                <Send className="w-4 h-4" />
              </a>
              <p className="mt-2 text-xs text-text-muted text-center">
                Opens your email client, prefilled. No account, no checkout.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
