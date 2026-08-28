# Aditya Shibu — Portfolio

Personal portfolio and blog. ML & Computer Vision Engineer focused on on-device inference, secure LLM systems, and browser-based demos. Features comprehensive case studies of production-grade systems built during my time at Averix Global Tech (Averix ERP, Romoc, AGT Visa CRM) and award-winning hackathon builds (Raksha, ResolveIQ, Legacy Modernizer).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion (`motion`)
- **Deployment:** Cloudflare Workers via OpenNext
- **Database:** Cloudflare D1 (Subscribers)
- **Contact:** Resend API

## Getting Started

```bash
cp .env.example .env.local   # fill in the blanks — comments say where each value comes from
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
| `NEXT_PUBLIC_SITE_URL` | Site URL (default: `https://adityashibu.com`) |
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
3. For local development, `cp .env.example .env.local` and fill in the blanks —
   that file documents where each value comes from.

The Konami code is discovery only, the password is verified server-side and the
editor is useless without it.

### Scheduling

Posts can be scheduled for any date and time. A scheduled post commits
immediately with a `publishAt` instant in its frontmatter and is filtered out of
the build until that moment passes — so it exists in the repo but not on the
site, and its URL 404s.

Nothing rebuilds the site on its own, so `.github/workflows/publish-scheduled.yml`
checks hourly and triggers a deploy when a post has just come due. That needs one
more secret, on the **GitHub** side this time:

- `CLOUDFLARE_DEPLOY_HOOK` — a deploy hook URL from the Worker's
  Settings → Builds. Add it under repo Settings → Secrets and variables →
  Actions.

Without it the workflow fails loudly rather than silently skipping a post. You
can also run it by hand from the Actions tab ("Publish scheduled posts" →
Run workflow) to release anything that's due right now.

Because the repo is public, a scheduled post's text is visible in git before it
goes live. Scheduling controls *when it appears on the site*, not secrecy.

### Newsletter

Signups are stored in Cloudflare D1 with double opt-in: the form only creates a
pending row and emails a confirmation link, so someone typing a stranger's
address in can't subscribe them. Every email after that carries a one-click
unsubscribe link and the `List-Unsubscribe` header Gmail and Outlook look for.

The editor shows the confirmed count and, next to each published post, a
**Notify** button that emails the list about it.

Setup (one time):

```bash
npx wrangler d1 create portfolio-subscribers   # copy the database_id it prints
# paste that id into wrangler.jsonc (replacing PLACEHOLDER_RUN_WRANGLER_D1_CREATE)
npx wrangler d1 migrations apply portfolio-subscribers --remote
```

Until that's done the signup form reports that subscriptions aren't available
rather than failing silently — nothing else on the site is affected.

Sending is capped at 90 emails per announcement, just under Resend's free tier
limit of 100/day. Past that the notify button refuses rather than half-sending;
raise `DAILY_SEND_CAP` once the email plan allows it.

### Sharing to LinkedIn

Publishing doesn't post to LinkedIn — it hands you the text to paste. After a
successful publish the editor shows a ready-to-paste post (title, excerpt,
canonical link, hashtags from your tags) with a copy button. Once it's up on
LinkedIn, drop the post URL into the LinkedIn field and republish: the article
then renders a "Discuss on LinkedIn" link.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API endpoints (contact, subscribe, admin controls)
│   ├── work/         # Case studies & Project details (RetailForge, Romoc, Raksha, etc.)
│   └── writing/      # Blog listing & Konami-code writing editor
├── components/       # React components
│   ├── demo/         # Interactive ML demos (TeachDemo)
│   ├── layout/       # Nav, Footer, Shortlist
│   └── sections/     # Homepage sections (Hero, SelectedWork, WhyMe, LinkedIn)
└── lib/              # Constant registries (projects.tsx, side-quests.tsx), hooks, utils
```
