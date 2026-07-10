"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/lib/use-scroll";
import { useTheme } from "@/lib/theme";
import { useShortlist } from "@/lib/shortlist";
import { motion, AnimatePresence } from "motion/react";
import Lenis from "lenis";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#writing", label: "Writing" },
  { href: "/#about", label: "About" },
  { href: "/resume.pdf", label: "R\u00e9sum\u00e9" },
];

function scrollToHash(href: string) {
  if (!href.includes("#")) return;
  const hash = href.split("#")[1];
  if (!hash) return;
  const el = document.getElementById(hash);
  if (!el) return;

  const lenisInstance = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -80, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Nav() {
  const pathname = usePathname();
  const scrolled = useScroll(20);
  const { theme, toggle } = useTheme();
  const { items, open: openShortlist } = useShortlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on navigation (hash click)
  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    if (href.includes("#")) {
      scrollToHash(href);
    }
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Focus trap
  // Lock scroll when open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 glass-strong transition-shadow duration-500",
        scrolled && "shadow-lg"
      )}
    >
      <div className="mx-auto h-full max-w-6xl px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-text-primary transition-colors hover:text-accent focus-ring rounded-sm"
        >
          <span className="font-display text-lg">AS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8" role="navigation" aria-label="Main navigation">
          {links.map((link) => {
            const isHash = link.href.includes("#");
            const Component = isHash ? "a" : Link;

            return (
              <Component
                key={link.href}
                href={link.href}
                onClick={isHash ? (e) => { e.preventDefault(); scrollToHash(link.href); } : undefined}
                className={cn(
                  "text-sm text-text-secondary transition-colors hover-underline",
                  "hover:text-text-primary focus-ring rounded-sm py-0.5",
                  pathname === link.href && "text-text-primary"
                )}
              >
                {link.label}
              </Component>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {/* Desktop social */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={toggle}
              className="text-text-muted hover:text-text-primary transition-colors focus-ring rounded-sm"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href="https://github.com/Vic-41148"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors focus-ring rounded-sm"
              aria-label="GitHub profile"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/adityashibu41148"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors focus-ring rounded-sm"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={openShortlist}
            className="btn-lift inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 focus-ring"
            aria-label="Open project shortlist"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Shortlist ({items.length})
          </button>

          {/* Mobile hamburger */}
          <button
            ref={toggleRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden text-text-muted hover:text-text-primary transition-colors focus-ring rounded-sm p-1"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 sm:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-surface border-l border-border p-6 flex flex-col shadow-2xl"
            >
              <nav className="flex flex-col gap-2" role="navigation" aria-label="Mobile navigation">
                {links.map((link) => {
                  const isHash = link.href.includes("#");
                  const Component = isHash ? "a" : Link;

                  return (
                    <Component
                      key={link.href}
                      href={link.href}
                      onClick={(e: React.MouseEvent) => {
                        if (isHash) { e.preventDefault(); }
                        handleNavClick(link.href);
                      }}
                      className="text-lg font-display font-normal py-3 px-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
                    >
                      {link.label}
                    </Component>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-border pt-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => { toggle(); }}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors w-full"
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span className="text-sm">{theme === "dark" ? "Light" : "Dark"} mode</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-4 px-2">
                  <a
                    href="https://github.com/Vic-41148"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-text-primary transition-colors"
                    aria-label="GitHub profile"
                  >
                    <GitHubIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/adityashibu41148"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-text-primary transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    <LinkedInIcon className="w-5 h-5" />
                  </a>
                  <span className="text-xs text-text-muted ml-auto">&copy; {new Date().getFullYear()}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
