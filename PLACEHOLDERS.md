# Placeholders & Stale Values — Averix Portfolio

Generated: Sat Jul 11 2026

---

## 1. TODO Comments — Missing Cover Images (4)

All in `src/components/sections/SelectedWork.tsx`. Projects 02–05 render with a tinted background + icon fallback.

| Line | Expected asset | Status |
|------|---------------|--------|
| 73–75 | `/images/projects/secure-llm-arch.svg` | Missing |
| 89–91 | `/images/projects/codeshield-arch.svg` | Missing |
| 104–106 | `/images/projects/emulator-shot.png` | Missing |
| 119–120 | `/images/projects/mlops-arch.svg` | Missing |

`/public/images/projects/` does not exist.

---

## 2. Hardcoded Emails (9 occurrences, 2 addresses)

| File | Line | Email | Purpose |
|------|------|-------|---------|
| `src/app/api/contact/route.ts` | 27, 45, 54 | `adityashibu275898@gmail.com` | Fallback error message |
| `src/app/api/contact/route.ts` | 35 | `contact@adityashibu.com` | Resend `from` address |
| `src/app/api/contact/route.ts` | 36 | `adityashibu41148@gmail.com` | Resend `to` recipient |
| `src/components/sections/Contact.tsx` | 172, 179 | `adityashibu275898@gmail.com` | mailto link + display |
| `src/components/layout/Footer.tsx` | 113 | `adityashibu275898@gmail.com` | mailto link |
| `src/lib/shortlist.tsx` | 69 | `adityashibu275898@gmail.com` | mailto link |

**Note:** Error messages reference `275898` but actual recipient is `41148`.

---

## 3. Hardcoded URLs / Domains (6)

| File | Line | URL | Should be |
|------|------|-----|-----------|
| `src/app/layout.tsx` | 35 | `https://adityashibu.dev` | env var |
| `src/app/robots.ts` | 9 | `https://adityashibu.dev/sitemap.xml` | env var |
| `src/app/sitemap.ts` | 4 | `https://adityashibu.dev` | env var |
| `src/lib/shortlist.tsx` | 65 | `https://adityashibu.dev` | env var |
| `src/app/api/contact/route.ts` | 35 | `contact@adityashibu.com` | env var |
| `src/components/demo/TeachDemo.tsx` | 127 | `cdn.jsdelivr.net/...@latest/wasm` | pinned version |

---

## 4. CDN Pinned to `@latest` (1)

| File | Line | URL | Risk |
|------|------|-----|------|
| `src/components/demo/TeachDemo.tsx` | 127 | `@mediapipe/tasks-vision@latest` | Breaking change = silent demo failure |

Should pin to `@0.10.35` (matches `package.json` version).

---

## 5. Stale OG Preview (5 mismatches)

`og-preview.html` — entire file uses old design system.

| Line | Property | Value in file | Current design system |
|------|----------|---------------|----------------------|
| 28 | glow color | `rgba(0,212,255,0.12)` (cyan) | `#EE5B28` (ember) |
| 36 | text color | `#EDEDED` | `#F5ECD9` |
| 42 | secondary text | `#8B8FA3` (cool gray) | `#B9A78F` (warm) |
| 53 | bottom text | `#5C6070` (cool gray) | `#B9A78F` |
| 7 | font | `cabinet-grotesk` | Anton, DM Sans, Space Mono |

---

## 6. Stale Icon Color (1)

| File | Line | Value | Issue |
|------|------|-------|-------|
| `src/app/icon.svg` | 3 | `fill="#00D4FF"` (cyan) | Should be `#EE5B28` (ember) |

---

## 7. Stale CSS Variable Names — Geist Legacy (4)

Layout and CSS still reference `--font-geist-sans` / `--font-geist-mono` from the `create-next-app` template. Actual fonts are DM Sans and Space Mono.

| File | Line | Variable |
|------|------|----------|
| `src/app/layout.tsx` | 19 | `variable: "--font-geist-sans"` |
| `src/app/layout.tsx` | 25 | `variable: "--font-geist-mono"` |
| `src/app/globals.css` | 20 | `--font-sans: var(--font-geist-sans)` |
| `src/app/globals.css` | 21 | `--font-mono: var(--font-geist-mono)` |

---

## 8. Console.log / Debug Statements (4)

| File | Line | Statement |
|------|------|-----------|
| `src/app/api/contact/route.ts` | 25 | `console.warn("[contact] RESEND_API_KEY not set")` |
| `src/app/api/contact/route.ts` | 43 | `console.error("[contact] Resend API error:", error)` |
| `src/app/api/contact/route.ts` | 50 | `console.log("[contact] Email sent:", data)` |
| `src/components/demo/TeachDemo.tsx` | 170 | `console.error("Camera/model init error:", err)` |

---

## 9. Commented-Out / Dead Code (2)

`open-next.config.ts` — R2 cache started but never wired in.

```ts
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2incremental-cache";
// incrementalCache: r2IncrementalCache,
```

---

## 10. Empty / Silent Catch Blocks (3)

| File | Line | Context |
|------|------|---------|
| `src/app/api/contact/route.ts` | 52 | JSON parse failure — silently discarded |
| `src/components/layout/Footer.tsx` | 49 | Newsletter signup — no error logged |
| `src/components/demo/TeachDemo.tsx` | 142 | GPU delegate — silently falls back |

---

## 11. Unused Dependencies (2)

| Package | Size impact |
|---------|-------------|
| `@tensorflow/tfjs-backend-webgl` | ~50MB |
| `@tensorflow/tfjs-core` | ~50MB |

Zero imports in source. MediaPipe uses its own backend.

---

## 12. Boilerplate README (3 issues)

`README.md` — default `create-next-app` template, never customized.

| Line | Issue |
|------|-------|
| 1 | "bootstrapped with create-next-app" |
| 21 | References Geist font (project uses Anton, DM Sans, Space Mono) |
| 32–35 | "Deploy on Vercel" section (project deploys to Cloudflare via OpenNext) |

---

## 13. Missing `.env.example`

`RESEND_API_KEY` is required (`src/app/api/contact/route.ts:22`) but no `.env.example` exists.

---

## 14. HTML Injection Risk (1)

| File | Line | Issue |
|------|------|-------|
| `src/app/api/contact/route.ts` | 39 | `${name}`, `${email}`, `${message}` interpolated into HTML with no escaping |

---

## 15. Hardcoded Canvas Colors (3)

`src/components/demo/TeachDemo.tsx` — canvas-drawn, can't use CSS vars, but colors don't match design system.

| Line | Value | Purpose |
|------|-------|---------|
| 87 | `#22D3EE, #22D68C, #F5A623, #FF6B6B, #A78BFA` | Gesture class colors |
| 343 | `#22D3EE` | Hand landmark stroke |
| 365 | `#22D3EE` | Hand landmark fill |

---

## 16. Misleading Newsletter (1)

| File | Line | Issue |
|------|------|-------|
| `src/components/layout/Footer.tsx` | 36–43 | Posts to `/api/contact` with `name: "Newsletter signup"` — no real newsletter system |

---

## 17. ESLint Suppressions (2)

| File | Line | Rule suppressed |
|------|------|-----------------|
| `src/components/Typewriter.tsx` | 58 | `react-hooks/exhaustive-deps` |
| `src/lib/use-drag-scroll.ts` | 116 | `react-hooks/exhaustive-deps` |

---

## 18. Missing RetailForge Assets (2)

| File | Line / Usage | Issue |
|------|--------------|-------|
| `src/lib/projects.ts` | RetailForge demo link | `/downloads/RetailForge-Demo-1.0.0.exe` does not exist |
| `SelectedWork.tsx` | RetailForge card | No cover image provided |

---

## Summary

| Category | Count |
|----------|-------|
| Missing cover images | 4 |
| Hardcoded emails | 9 |
| Hardcoded URLs/domains | 6 |
| CDN pinned to @latest | 1 |
| Stale OG preview | 5 |
| Stale icon color | 1 |
| Stale CSS variable names | 4 |
| Console.log/debug | 4 |
| Dead code | 2 |
| Silent catch blocks | 3 |
| Unused dependencies | 2 |
| Boilerplate README | 3 |
| Missing .env.example | 1 |
| HTML injection | 1 |
| Hardcoded canvas colors | 3 |
| Misleading newsletter | 1 |
| ESLint suppressions | 2 |
| **Total** | **52** |
