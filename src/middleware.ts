import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APEX = "adityashibu.com";
const WWW = `www.${APEX}`;

/** Canonical-host enforcement: apex + https everywhere.
 *
 *  Without this, www.adityashibu.com serves every page with a 200 (the
 *  indexed list mixes apex and www hosts) and http:// never upgrades to
 *  https. Search engines then split signals across duplicate URLs instead
 *  of consolidating on one canonical host.
 *
 *  Runs at the edge, so it covers every route — pages, sitemap, robots —
 *  on both the apex and www hosts. Localhost and preview deployments pass
 *  through untouched: only the two production hosts are ever redirected.
 */
export function middleware(req: NextRequest) {
  const target = resolveCanonicalTarget(
    req.url,
    req.headers.get("host"),
    req.headers.get("x-forwarded-proto")
  );
  if (!target) return NextResponse.next();
  return NextResponse.redirect(target, 301);
}

/** Pure redirect decision, kept outside `middleware` so it's unit-testable
 *  without edge-runtime request construction.
 *
 *  The Host header is the source of truth — `req.nextUrl.hostname` is not
 *  reliable here (locally it resolves to the server's own address rather
 *  than the incoming Host). Falls back to the request URL only when the
 *  header is absent, as in unit tests. Returns the redirect target, or
 *  null when the request already canonical. */
export function resolveCanonicalTarget(
  rawUrl: string,
  hostHeader: string | null,
  protoHeader: string | null
): string | null {
  const url = new URL(rawUrl);
  const host = (hostHeader ?? url.hostname).toLowerCase().split(":")[0];
  const proto = (
    protoHeader ?? url.protocol.replace(":", "")
  ).toLowerCase();

  if (host !== WWW && !(host === APEX && proto === "http")) {
    return null;
  }

  return `https://${APEX}${url.pathname}${url.search}`;
}

export const config = {
  // Page, data, and metadata routes. Versioned static assets and PWA files
  // are same-origin requests, so skipping them avoids edge overhead on
  // every asset load without affecting the canonical-host guarantee.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest).*)",
  ],
};
