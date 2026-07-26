# Aditya Shibu — Portfolio

Personal portfolio and blog. ML & Computer Vision Engineer focused on on-device inference, secure LLM systems, and browser-based demos.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion (`motion`)
- **Deployment:** Cloudflare Workers via OpenNext
- **Contact:** Resend API

## Getting Started

```bash
cp .env.example .env.local   # fill in RESEND_API_KEY
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run build:cloudflare` | Cloudflare Workers build |
| `npm run lint` | ESLint |
| `npm test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Environment Variables

See `.env.example` for required variables:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Site URL (default: `https://adityashibu.dev`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact email |
| `CONTACT_EMAIL` | Recipient for contact form |
| `CONTACT_FROM` | Resend sender address |
| `RESEND_API_KEY` | Resend API key (required for contact form) |
| `ADMIN_PASSWORD` | Password for the writing editor (see below) |
| `GITHUB_TOKEN` | Fine-grained PAT the editor commits posts with |
| `GITHUB_REPO` | `owner/repo` the editor writes to |
| `GITHUB_BRANCH` | Branch to commit posts on (default `main`) |

## Writing

Posts live in `content/writing/*.md` — frontmatter (`title`, `excerpt`, `date`,
`readTime`, `tags`, optional `linkedin`) plus a markdown body. Adding a file is
all it takes: the listing, homepage cards, sitemap, and static routes are all
derived from that directory.

There's also an in-site editor at `/writing/new` (reachable by entering the
Konami code on `/writing`). It renders a live preview with the same renderer as
the published page, and publishing commits the markdown — plus any images, as
webp under `public/images/writing/<slug>/` — straight to GitHub. Cloudflare
rebuilds and the post is live a couple of minutes later. It can delete posts
too; deletions are commits, so anything removed is recoverable from git history.

Setup (one time):

1. Create a fine-grained GitHub PAT scoped to this repo only, with
   **Contents: Read and write**.
2. Set `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_REPO`, and `GITHUB_BRANCH` as
   Cloudflare Worker secrets (`npx wrangler secret put NAME`, or the dashboard).
3. For local development, copy `.dev.vars.example` to `.dev.vars` and fill it in.

The Konami code is discovery only — the password is verified server-side and the
editor is useless without it.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/contact/  # Contact form API route
│   ├── work/         # Project detail pages
│   └── writing/      # Blog posts
├── components/       # React components
│   ├── demo/         # Interactive ML demos (TeachDemo)
│   ├── layout/       # Nav, Footer
│   └── sections/     # Homepage sections
└── lib/              # Utilities, hooks, constants
```
