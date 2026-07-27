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
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { scrollToId } from "@/lib/contact-intent";

function scrollToHash(href: string) {
  const hash = href.split("#")[1];
  if (hash) scrollToId(hash);
}

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#writing", label: "Writing" },
  { href: "/#about", label: "About" },
  { href: "/resume.pdf", label: "R\u00e9sum\u00e9" },
];

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
