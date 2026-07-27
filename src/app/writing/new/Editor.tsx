"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  Check,
  Copy,
  Eye,
  ImagePlus,
  Loader2,
  Lock,
  Send,
  LogOut,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { Markdown, estimateReadTime } from "@/lib/markdown";
import { LinkedInIcon } from "@/components/icons";
import { linkedInDraft } from "@/lib/share";
import { SITE_URL } from "@/lib/constants";
import { slugify } from "@/lib/frontmatter";
import { cn } from "@/lib/utils";
import { useEditorSession } from "./useEditorSession";

const DRAFT_KEY = "writing-editor-draft";
const MAX_IMAGE_EDGE = 1600;
const MAX_IMAGES = 6;

interface PendingImage {
  name: string;
  base64: string;
  previewUrl: string;
}

interface ListedPost {
  slug: string;
  title: string;
  date: string;
  publishAt?: string;
  live?: boolean;
  excerpt?: string;
}

interface SubscriberCounts {
  active: number;
  pending: number;
  unsubscribed: number;
}

interface Draft {
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  tags: string;
  linkedin: string;
  markdown: string;
  /** datetime-local value ("2026-08-01T09:00"); empty means publish now */
  scheduleAt: string;
}

const EMPTY_DRAFT: Draft = {
  title: "",
  slug: "",
  slugTouched: false,
  excerpt: "",
  tags: "",
  linkedin: "",
  markdown: "",
  scheduleAt: "",
};

/** Slug used for image paths before the post has a title. Rewritten to the real
 *  slug as soon as there is one, so a rename never strands an image path. */
const DRAFT_SLUG = "draft";

/** datetime-local gives a value with no timezone; it means local time, which is
 *  what you'd expect when you pick "9am". Converted to an instant here. */
function scheduleToIso(value: string): string {
  if (!value) return "";
  const at = new Date(value);
  return Number.isNaN(at.getTime()) || at.getTime() <= Date.now() ? "" : at.toISOString();
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function imagePath(slug: string, name: string): string {
  return `/images/writing/${slug || DRAFT_SLUG}/${name}`;
}

/** Matches an image reference by filename regardless of which slug directory it
 *  currently sits in — that's what makes retitling safe. */
function imagePathPattern(name: string): RegExp {
  return new RegExp(`/images/writing/[^)\\s]*?/${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g");
}

function rewriteImagePaths(markdown: string, names: string[], slug: string): string {
  return names.reduce(
    (body, name) => body.replace(imagePathPattern(name), imagePath(slug, name)),
    markdown
  );
}

/** Re-encodes a picked file to webp at a sane max edge, entirely client-side.
 *  Keeps commits small and means the repo never receives a 12 MP phone photo. */
async function prepareImage(file: File): Promise<PendingImage> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable in this browser.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.9)
  );
  if (!blob) throw new Error("Could not encode the image.");

  const buffer = await blob.arrayBuffer();
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);

  const name = `${slugify(file.name.replace(/\.[^.]+$/, "")) || "image"}-${Date.now().toString(36)}.webp`;

  return { name, base64: btoa(binary), previewUrl: URL.createObjectURL(blob) };
}

export function Editor() {
  const { session, ready, signIn, signOut, authedFetch } = useEditorSession();

  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [images, setImages] = useState<PendingImage[]>([]);
  const [posts, setPosts] = useState<ListedPost[]>([]);
  const [editingExisting, setEditingExisting] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "error" | "done"; message?: string; url?: string }>({
    kind: "idle",
  });
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [published, setPublished] = useState<{
    title: string;
    excerpt: string;
    url: string;
    tags: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [subscribers, setSubscribers] = useState<SubscriberCounts | null>(null);
  const [notifying, setNotifying] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slugRef = useRef("");

  // Falls back to the title whenever the slug field is empty, so clearing it
  // doesn't strand the post without one.
  const slug = draft.slugTouched && draft.slug ? draft.slug : slugify(draft.title);
  const previewMarkdown = images.reduce(
    (body, image) => body.replace(imagePathPattern(image.name), image.previewUrl),
    draft.markdown
  );

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setDraft({ ...EMPTY_DRAFT, ...(JSON.parse(raw) as Draft) });
    } catch {
      /* ignore malformed drafts */
    }
  }, []);

  // Autosave draft
  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)), 400);
    return () => clearTimeout(id);
  }, [draft]);

  // Retitling changes the slug, and images live under it — repoint any already
  // inserted references so the body never points at a directory that won't exist.
  useEffect(() => {
    const previous = slugRef.current;
    slugRef.current = slug;
    if (previous === slug || images.length === 0) return;

    setDraft((current) => {
      const names = images.map((image) => image.name);
      const rewritten = rewriteImagePaths(current.markdown, names, slug);
      return rewritten === current.markdown ? current : { ...current, markdown: rewritten };
    });
  }, [slug, images]);

  const loadPosts = useCallback(async () => {
    try {
      const res = await authedFetch("/api/admin/list");
      const body = (await res.json().catch(() => ({}))) as { posts?: ListedPost[] };
      if (res.ok && body.posts) setPosts(body.posts);
    } catch {
      /* list is a convenience; publishing still works without it */
    }
  }, [authedFetch]);

  const loadSubscribers = useCallback(async () => {
    try {
      const res = await authedFetch("/api/admin/subscribers");
      if (res.ok) setSubscribers((await res.json()) as SubscriberCounts);
    } catch {
      /* subscriber counts are informational; the editor works without them */
    }
  }, [authedFetch]);

  useEffect(() => {
    if (session) {
      void loadPosts();
      void loadSubscribers();
    }
  }, [session, loadPosts, loadSubscribers]);

  const notify = async (post: ListedPost) => {
    if (!subscribers?.active) return;
    const ok = window.confirm(
      `Email ${subscribers.active} subscriber${subscribers.active === 1 ? "" : "s"} about "${post.title}"? This can't be taken back.`
    );
    if (!ok) return;

    setNotifying(post.slug);
    setStatus({ kind: "busy", message: `Emailing subscribers about "${post.title}"…` });
    try {
      const res = await authedFetch("/api/admin/notify", {
        method: "POST",
        body: JSON.stringify({ slug: post.slug, title: post.title, excerpt: post.excerpt ?? "" }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; sent?: number; failed?: number };
      if (!res.ok) throw new Error(body.error ?? "Sending failed.");
      setStatus({
        kind: "done",
        message: `Sent to ${body.sent ?? 0} subscriber${body.sent === 1 ? "" : "s"}${body.failed ? `, ${body.failed} failed` : ""}.`,
      });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Sending failed." });
    } finally {
      setNotifying(null);
    }
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try {
      await signIn(password);
      setPassword("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Sign-in failed.");
    } finally {
      setAuthBusy(false);
    }
  };

  const insertAtCursor = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setDraft((d) => ({ ...d, markdown: `${d.markdown}\n\n${snippet}` }));
      return;
    }
    const { selectionStart: start, selectionEnd: end, value } = textarea;
    const next = `${value.slice(0, start)}${snippet}${value.slice(end)}`;
    setDraft((d) => ({ ...d, markdown: next }));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    });
  };

  const handleImages = async (files: File[]) => {
    if (!files.length) return;

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setStatus({ kind: "error", message: `That's the ${MAX_IMAGES}-image limit for one post.` });
      return;
    }

    for (const file of files.slice(0, room)) {
      try {
        const image = await prepareImage(file);
        setImages((current) => [...current, image]);
        // Clipboard images arrive named "image.png" or unnamed, so fall back to
        // a caption worth reading rather than echoing a meaningless filename.
        const stem = file.name.replace(/\.[^.]+$/, "");
        const alt = !stem || /^image$/i.test(stem) ? "screenshot" : stem.replace(/[-_]+/g, " ");
        insertAtCursor(`\n\n![${alt}](${imagePath(slug, image.name)})\n\n`);
      } catch (error) {
        setStatus({ kind: "error", message: error instanceof Error ? error.message : "Image failed." });
      }
    }
  };

  /** Screenshots pasted straight into the body. Only intercepts the paste when
   *  the clipboard actually carries image files, so pasting text is untouched. */
  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.clipboardData.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (!files.length) return;

    event.preventDefault();
    void handleImages(files);
  };

  const publish = async (overwrite = false) => {
    if (!draft.title.trim() || !draft.markdown.trim()) {
      setStatus({ kind: "error", message: "Title and body are both required." });
      return;
    }

    const publishAt = scheduleToIso(draft.scheduleAt);
    if (draft.scheduleAt && !publishAt) {
      setStatus({ kind: "error", message: "That schedule time is in the past." });
      return;
    }

    setStatus({ kind: "busy", message: "Committing to GitHub…" });

    // Belt and braces: images upload under the final slug, so make sure every
    // reference in the body points there even if a rename raced the rewrite.
    const markdown = rewriteImagePaths(draft.markdown, images.map((image) => image.name), slug);

    try {
      const res = await authedFetch("/api/admin/publish", {
        method: "POST",
        body: JSON.stringify({
          slug,
          overwrite,
          markdown,
          images: images.map(({ name, base64 }) => ({ name, base64 })),
          frontmatter: {
            title: draft.title,
            excerpt: draft.excerpt,
            date: (publishAt ? new Date(publishAt) : new Date()).toISOString().slice(0, 10),
            readTime: estimateReadTime(draft.markdown),
            tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
            linkedin: draft.linkedin,
            publishAt,
          },
        }),
      });

      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        url?: string;
        commitUrl?: string;
      };

      if (res.status === 409 && body.code === "exists") {
        setEditingExisting(true);
        setStatus({ kind: "error", message: `"${slug}" already exists — publish again to replace it.` });
        return;
      }

      if (!res.ok) throw new Error(body.error ?? "Publish failed.");

      localStorage.removeItem(DRAFT_KEY);
      setStatus({
        kind: "done",
        message: publishAt
          ? `Scheduled for ${formatWhen(publishAt)} — it goes live on the first rebuild after that.`
          : "Committed — live in ~2 minutes.",
        url: body.commitUrl,
      });
      setPublished({
        title: draft.title,
        excerpt: draft.excerpt,
        // Canonical URL, not the current origin — a post published from
        // localhost still needs a shareable link.
        url: `${SITE_URL}/writing/${slug}`,
        tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setImages([]);
      void loadPosts();
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Publish failed." });
    }
  };

  const remove = async (target: string) => {
    setStatus({ kind: "busy", message: `Deleting ${target}…` });
    try {
      const res = await authedFetch("/api/admin/delete", {
        method: "POST",
        body: JSON.stringify({ slug: target, confirm: confirmText.trim() }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Delete failed.");

      setConfirmSlug(null);
      setConfirmText("");
      setStatus({ kind: "done", message: `Deleted "${target}" — gone from the site after the next deploy.` });
      void loadPosts();
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Delete failed." });
    }
  };

  if (!ready) return null;

  if (!session) {
    return (
      <div className="pt-32 pb-24 min-h-screen">
        <div className="mx-auto max-w-sm px-6">
          <form onSubmit={handleSignIn} className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2 mb-1 text-accent">
              <Lock className="w-4 h-4" />
              <span className="font-mono text-xs uppercase tracking-wider">Restricted</span>
            </div>
            <h1 className="font-display text-2xl mb-4">Writing mode</h1>

            <input
              type="password"
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm placeholder:text-text-muted transition-all input-glow"
            />

            {authError && <p className="mt-3 text-sm text-demo-warning">{authError}</p>}

            <button
              type="submit"
              disabled={authBusy || !password}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-medium disabled:opacity-50 btn-sheen focus-ring"
            >
              {authBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Unlock
            </button>

            <Link
              href="/writing"
              className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to writing
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="section-eyebrow !mb-1">
              <span className="motif-hash">#</span>Writing mode
            </p>
            <h1 className="font-display text-3xl">New post</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/writing"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Writing
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors focus-ring rounded-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <input
            value={draft.title}
            onChange={(event) => setDraft((d) => ({ ...d, title: event.target.value }))}
            placeholder="Title"
            className="lg:col-span-2 px-4 py-3 rounded-xl bg-surface border border-border text-sm placeholder:text-text-muted input-glow"
          />
          <input
            value={slug}
            onChange={(event) =>
              setDraft((d) => ({ ...d, slug: slugify(event.target.value), slugTouched: true }))
            }
            placeholder="slug"
            className="px-4 py-3 rounded-xl bg-surface border border-border text-sm font-mono placeholder:text-text-muted input-glow"
          />
          <input
            value={draft.tags}
            onChange={(event) => setDraft((d) => ({ ...d, tags: event.target.value }))}
            placeholder="Tags, comma separated"
            className="px-4 py-3 rounded-xl bg-surface border border-border text-sm placeholder:text-text-muted input-glow"
          />
          <input
            value={draft.excerpt}
            onChange={(event) => setDraft((d) => ({ ...d, excerpt: event.target.value }))}
            placeholder="Excerpt — shown on cards"
            className="lg:col-span-3 px-4 py-3 rounded-xl bg-surface border border-border text-sm placeholder:text-text-muted input-glow"
          />
          <input
            value={draft.linkedin}
            onChange={(event) => setDraft((d) => ({ ...d, linkedin: event.target.value }))}
            placeholder="LinkedIn post URL (optional)"
            className="px-4 py-3 rounded-xl bg-surface border border-border text-sm placeholder:text-text-muted input-glow"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4 rounded-xl border border-border bg-surface px-4 py-3">
          <label htmlFor="schedule" className="inline-flex items-center gap-2 text-sm text-text-secondary">
            <CalendarClock className="w-4 h-4 text-text-muted" />
            Schedule
          </label>
          <input
            id="schedule"
            type="datetime-local"
            value={draft.scheduleAt}
            onChange={(event) => setDraft((d) => ({ ...d, scheduleAt: event.target.value }))}
            className="px-3 py-1.5 rounded-lg bg-bg border border-border text-sm font-mono input-glow"
          />
          {draft.scheduleAt ? (
            <>
              <span className="text-xs text-text-muted">
                Commits now, appears at the first rebuild after this time (checked hourly).
              </span>
              <button
                onClick={() => setDraft((d) => ({ ...d, scheduleAt: "" }))}
                className="text-xs text-text-muted hover:text-text-primary transition-colors focus-ring rounded-sm"
              >
                Clear
              </button>
            </>
          ) : (
            <span className="text-xs text-text-muted">Leave empty to publish immediately.</span>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="font-mono text-xs uppercase tracking-wider text-text-muted">Markdown</span>
              <label
                title="Or paste a screenshot straight into the editor"
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                Add image
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    void handleImages(Array.from(event.target.files ?? []));
                    event.target.value = "";
                  }}
                />
              </label>
            </div>
            <textarea
              ref={textareaRef}
              value={draft.markdown}
              onChange={(event) => setDraft((d) => ({ ...d, markdown: event.target.value }))}
              onPaste={handlePaste}
              placeholder={"## A heading\n\nWrite the post here. **Bold**, *italic*, `code`, - lists, and images all render in the preview exactly as they will on the live page.\n\nPaste a screenshot straight in and it uploads with the post."}
              spellCheck
              className="flex-1 min-h-[28rem] w-full px-4 py-4 bg-transparent font-mono text-sm leading-relaxed resize-y outline-none placeholder:text-text-muted"
            />
            <div className="px-4 py-2 border-t border-border flex items-center justify-between text-xs font-mono text-text-muted">
              <span>{estimateReadTime(draft.markdown)} read</span>
              <span>{images.length} image{images.length === 1 ? "" : "s"} pending</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface overflow-hidden flex flex-col">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
              <Eye className="w-3.5 h-3.5 text-text-muted" />
              <span className="font-mono text-xs uppercase tracking-wider text-text-muted">Preview</span>
            </div>
            <div className="flex-1 overflow-auto px-5 py-6">
              <h2 className="text-2xl sm:text-3xl font-display font-normal mb-2">
                {draft.title || "Untitled"}
              </h2>
              <p className="text-xs font-mono text-text-muted mb-6">
                {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })} · {estimateReadTime(draft.markdown)}
              </p>
              {draft.markdown.trim() ? (
                <Markdown content={previewMarkdown} />
              ) : (
                <p className="text-sm text-text-muted">Preview appears as you type.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            onClick={() => void publish(editingExisting)}
            disabled={status.kind === "busy"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-medium disabled:opacity-50 btn-sheen focus-ring"
          >
            {status.kind === "busy" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {editingExisting ? "Replace published post" : "Publish"}
          </button>

          {status.message && (
            <p
              className={cn(
                "text-sm flex items-center gap-2",
                status.kind === "error" && "text-demo-warning",
                status.kind === "done" && "text-demo-success",
                status.kind === "busy" && "text-text-muted"
              )}
            >
              {status.kind === "done" && <Check className="w-4 h-4" />}
              {status.message}
              {status.url && (
                <a
                  href={status.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent"
                >
                  commit
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </p>
          )}
        </div>

        {published && (
          <section className="mt-8 rounded-2xl border border-accent/30 bg-surface p-5">
            <div className="flex items-center gap-2 mb-1">
              <LinkedInIcon className="w-4 h-4 text-accent" />
              <h2 className="font-display text-lg">Share it on LinkedIn</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Paste this over there, then drop the LinkedIn post URL back in the field above
              and republish — the article will link to the discussion.
            </p>

            <textarea
              readOnly
              value={linkedInDraft(published.title, published.excerpt, published.url, published.tags)}
              className="w-full min-h-[9rem] px-4 py-3 rounded-xl bg-bg border border-border text-sm leading-relaxed resize-y outline-none"
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    linkedInDraft(published.title, published.excerpt, published.url, published.tags)
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium btn-sheen focus-ring"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy post text"}
              </button>
              <a
                href="https://www.linkedin.com/feed/?shareActive=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Open LinkedIn
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setPublished(null)}
                className="ml-auto text-xs text-text-muted hover:text-text-primary transition-colors focus-ring rounded-sm"
              >
                Dismiss
              </button>
            </div>
          </section>
        )}

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <h2 className="font-display text-xl">Published posts</h2>
            {subscribers && (
              <p className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted">
                <Users className="w-3.5 h-3.5" />
                {subscribers.active} subscriber{subscribers.active === 1 ? "" : "s"}
                {subscribers.pending > 0 && ` · ${subscribers.pending} unconfirmed`}
              </p>
            )}
          </div>
          <div className="space-y-2">
            {posts.length === 0 && (
              <p className="text-sm text-text-muted">No posts found in the repo yet.</p>
            )}
            {posts.map((post) => (
              <div
                key={post.slug}
                className="rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {post.title}
                      {post.live === false && (
                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-muted text-accent text-[10px] font-mono align-middle">
                          <CalendarClock className="w-3 h-3" />
                          scheduled
                        </span>
                      )}
                    </p>
                    <p className="text-xs font-mono text-text-muted">
                      {post.slug} · {post.publishAt ? formatWhen(post.publishAt) : post.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {post.live !== false && (
                      <Link
                        href={`/writing/${post.slug}`}
                        target="_blank"
                        className="text-xs text-text-muted hover:text-text-primary transition-colors"
                      >
                        View
                      </Link>
                    )}
                    {post.live !== false && !!subscribers?.active && (
                      <button
                        onClick={() => void notify(post)}
                        disabled={notifying !== null}
                        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors disabled:opacity-40 focus-ring rounded-sm"
                        title={`Email ${subscribers.active} subscribers about this post`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        {notifying === post.slug ? "Sending…" : "Notify"}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setConfirmSlug(confirmSlug === post.slug ? null : post.slug);
                        setConfirmText("");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-demo-warning transition-colors focus-ring rounded-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>

                {confirmSlug === post.slug && (
                  <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-3">
                    <p className="text-xs text-text-secondary">
                      Type <code className="font-mono text-text-primary">{post.slug}</code> to confirm.
                      This commits a deletion to the repo (recoverable from git history).
                    </p>
                    <input
                      value={confirmText}
                      onChange={(event) => setConfirmText(event.target.value)}
                      placeholder={post.slug}
                      className="px-3 py-1.5 rounded-lg bg-bg border border-border text-xs font-mono input-glow"
                    />
                    <button
                      onClick={() => void remove(post.slug)}
                      disabled={confirmText.trim() !== post.slug || status.kind === "busy"}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-demo-warning/40 text-demo-warning text-xs disabled:opacity-40 focus-ring"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete permanently
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
