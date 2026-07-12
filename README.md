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
