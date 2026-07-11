# Unfinished Work Audit — Averix Portfolio

Generated: Sat Jul 11 2026

---

## 1. TODO Comments — Missing Project Cover Images (4)

All in `src/components/sections/SelectedWork.tsx`. Four of five project cards have no cover image or architecture diagram — they render with a plain tinted background + icon instead.

| Line | TODO |
|------|------|
| 73–75 | `TODO(real-cover): add real architecture diagram (attack -> defense -> eval flow) at /images/projects/secure-llm-arch.svg` |
| 89–91 | `TODO(real-cover): replace with real architecture diagram (concurrent streams -> 5-min sliding window -> anomaly flag) at /images/projects/codeshield-arch.svg` |
| 104–106 | `TODO(real-cover): replace with real screenshot of a game running in the emulator at /images/projects/emulator-shot.png` |
| 119–120 | `TODO(real-cover): replace with pipeline/observability screenshot or flow diagram at /images/projects/mlops-arch.svg` |

---

## 2. Console.log / Debug Statements in Production (4)

| File | Line | Statement | Severity |
|------|------|-----------|----------|
| `src/app/api/contact/route.ts` | 25 | `console.warn("[contact] RESEND_API_KEY not set")` | Low |
| `src/app/api/contact/route.ts` | 43 | `console.error("[contact] Resend API error:", error)` | Medium |
| `src/app/api/contact/route.ts` | 50 | `console.log("[contact] Email sent:", data)` | **High** — dumps full Resend API response on every send |
| `src/components/demo/TeachDemo.tsx` | 170 | `console.error("Camera/model init error:", err)` | Medium |

---

## 3. Commented-Out Code — R2 Cache Never Wired In (2)

In `open-next.config.ts`:

```ts
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2incremental-cache";
// incrementalCache: r2IncrementalCache,
```

The OpenNext Cloudflare deployment uses the default DynamoDB provider for caching instead of R2. The R2 integration was started but never completed.

---

## 4. Empty / Silent Catch Blocks (3)

| File | Line | Context | Severity |
|------|------|---------|----------|
| `src/app/api/contact/route.ts` | 52 | JSON parse failure — actual exception silently discarded | Low |
| `src/components/layout/Footer.tsx` | 49 | Newsletter signup — sets error state but never logs what went wrong | Low |
| `src/components/demo/TeachDemo.tsx` | 142 | GPU delegate failure — falls back to CPU, error silently discarded | Low |

---

## 5. Unused npm Dependencies (2)

| Package | Notes |
|---------|-------|
| `@tensorflow/tfjs-backend-webgl` | Zero imports in source. MediaPipe uses its own WebGL/WebGPU backend. |
| `@tensorflow/tfjs-core` | Zero imports in source. Added during early exploration, never removed. |

Both add significant weight to `node_modules` (~100MB+ combined).

---

## 6. Duplicated Icon Components (7 copies)

**GitHubIcon** — identical SVG copy-pasted in 4 files:
- `src/components/sections/Contact.tsx:11`
- `src/app/work/[slug]/page.tsx:6`
- `src/components/layout/Footer.tsx:9`
- `src/components/layout/Nav.tsx:14`

**LinkedInIcon** — identical SVG copy-pasted in 3 files:
- `src/components/sections/Contact.tsx:19`
- `src/components/layout/Footer.tsx:17`
- `src/components/layout/Nav.tsx:22`

Should be extracted to a shared component (e.g., `src/components/icons/`).

---

## 7. Hardcoded Email Addresses (8 occurrences, 2 addresses)

**`adityashibu275898@gmail.com`** — referenced in error messages & mailto links:
- `src/components/sections/Contact.tsx:172, 179`
- `src/components/layout/Footer.tsx:113`
- `src/lib/shortlist.tsx:69`
- `src/app/api/contact/route.ts:27, 45, 54`

**`adityashibu41148@gmail.com`** — actual contact form recipient:
- `src/app/api/contact/route.ts:36`

The fallback email in error messages is **different** from the operational recipient. Should be a single env var.

---

## 8. Hardcoded URLs That Should Be Environment Variables (7)

| File | Line | URL | Issue |
|------|------|-----|-------|
| `src/app/api/contact/route.ts` | 35 | `Portfolio Contact <contact@adityashibu.com>` | Hardcoded Resend sender |
| `src/app/api/contact/route.ts` | 36 | `adityashibu41148@gmail.com` | Hardcoded recipient |
| `src/app/layout.tsx` | 35 | `https://adityashibu.dev` | Hardcoded domain in metadataBase |
| `src/app/robots.ts` | 9 | `https://adityashibu.dev/sitemap.xml` | Hardcoded sitemap URL |
| `src/app/sitemap.ts` | 4 | `https://adityashibu.dev` | Hardcoded base URL |
| `src/lib/shortlist.tsx` | 65 | `https://adityashibu.dev` | Hardcoded domain |
| `src/components/demo/TeachDemo.tsx` | 127 | `cdn.jsdelivr.net/...@latest/...` | Pinned to `@latest` — breaking changes would silently break demo |

---

## 9. Missing `.env.example`

The project requires `RESEND_API_KEY` but there is no `.env.example`, `.env.template`, or any documentation listing required env vars.

---

## 10. README Is Default Boilerplate

`README.md` is the untouched `create-next-app` template. It:
- References Geist font (project uses Anton, DM Sans, Space Mono)
- Mentions Vercel deployment (project deploys to Cloudflare Workers via OpenNext)
- Has zero mention of: env vars, MediaPipe demo, contact form, Cloudflare setup

---

## 11. No Tests Whatsoever

- Zero test files (`*.test.*`, `*.spec.*`) anywhere in the codebase
- No test runner (Jest, Vitest, Playwright) in `package.json`
- No `test` script in `package.json`
- No `__tests__` directories

---

## 12. ESLint Suppressions (2)

| File | Line | Reason |
|------|------|--------|
| `src/components/Typewriter.tsx` | 58 | `react-hooks/exhaustive-deps` — `onDone` intentionally excluded to prevent animation re-trigger |
| `src/lib/use-drag-scroll.ts` | 116 | `react-hooks/exhaustive-deps` — effect runs once on mount, ignores changing deps |

Both are deliberate tradeoffs but create maintenance risk if callback signatures change.

---

## 13. Potential HTML Injection in Contact Route

`src/app/api/contact/route.ts:39` — user-supplied `name`, `email`, and `message` are interpolated directly into an HTML string with **no sanitization or escaping**:

```ts
html: `<p><strong>Name:</strong> ${name}</p>...`
```

A submission of `<script>alert(1)</script>` as the name would be embedded verbatim in the email HTML.

---

## 14. Stale OG Preview File

`og-preview.html` references a cyan glow color (`rgba(0,212,255,0.12)`) that doesn't match the current design system (`--accent: #EE5B28` dark / `#7A1F1C` light). Leftover from an earlier design iteration — should be updated or removed.

---

## 15. Newsletter Signup — Misleading Implementation

`src/components/layout/Footer.tsx:36-43` — the "newsletter" form posts to `/api/contact` with `name: "Newsletter signup"`. There is no actual newsletter system — it just sends a contact-form email. No way to distinguish signups from real messages on the backend.

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Missing cover images (TODOs) | 4 | Medium |
| Console.log/debug in production | 4 | Medium |
| Commented-out / dead code | 2 | Low |
| Silent catch blocks | 3 | Low |
| Unused dependencies | 2 | Low |
| Duplicated icon components | 7 copies | Low |
| Hardcoded emails | 8 occurrences | Medium |
| Hardcoded URLs | 7 | Medium |
| Missing .env.example | 1 | Medium |
| Boilerplate README | 1 | Medium |
| No tests | N/A | **High** |
| ESLint suppressions | 2 | Low |
| HTML injection risk | 1 | Medium |
| Stale OG preview file | 1 | Low |
| Misleading newsletter | 1 | Low |
| `@latest` CDN pinning | 1 | Medium |

**Total: 39 distinct issues across the codebase.**

### Priority Recommendations

1. **High** — Add a test framework (Vitest) and write at least unit tests for core logic (contact route, demo, shortlist)
2. **High** — Sanitize HTML interpolation in the contact route to prevent injection
3. **Medium** — Create the 4 missing project cover images/architecture diagrams
4. **Medium** — Extract hardcoded emails/URLs to environment variables, create `.env.example`
5. **Medium** — Remove unused `@tensorflow/*` dependencies
6. **Medium** — Complete the R2 cache integration for Cloudflare deployment
7. **Medium** — Pin MediaPipe CDN to a specific version instead of `@latest`
8. **Low** — Extract shared icon components, remove console.logs, update README
