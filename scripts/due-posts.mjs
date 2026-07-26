#!/usr/bin/env node
/**
 * Reports posts whose publishAt fell inside the last window — i.e. posts that
 * are now live but weren't at the previous run. Used by the scheduled workflow
 * to decide whether a rebuild is worth triggering.
 *
 * Exit code 0 with "due=true" on stdout when something needs publishing.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const WINDOW_MINUTES = Number(process.env.WINDOW_MINUTES ?? 70);
const dir = join(process.cwd(), "content", "writing");

if (!existsSync(dir)) {
  console.log("due=false");
  process.exit(0);
}

const now = Date.now();
const since = now - WINDOW_MINUTES * 60_000;
const due = [];

for (const file of readdirSync(dir).filter((name) => name.endsWith(".md"))) {
  const raw = readFileSync(join(dir, file), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) continue;

  const line = match[1].split(/\r?\n/).find((l) => l.startsWith("publishAt:"));
  if (!line) continue;

  const at = Date.parse(line.slice("publishAt:".length).trim());
  if (Number.isNaN(at)) continue;

  // Became live within the window: past now, but not before the previous run.
  if (at <= now && at > since) due.push({ slug: file.replace(/\.md$/, ""), at: new Date(at).toISOString() });
}

for (const post of due) console.error(`due: ${post.slug} (${post.at})`);
console.log(`due=${due.length > 0}`);
