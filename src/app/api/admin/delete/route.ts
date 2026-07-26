import { NextResponse } from "next/server";
import { authorize } from "@/lib/admin-auth";
import { IMAGES_PATH, POSTS_PATH, deleteFile, getFile, listDirectory, repoConfig } from "@/lib/github";
import { isValidSlug } from "@/lib/frontmatter";

export const runtime = "nodejs";

/** Removes a post and any images committed alongside it. The commits stay in
 *  git history, so a mistaken delete is recoverable with a revert. */
export async function POST(request: Request) {
  const auth = await authorize(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const config = repoConfig();
  if (!config) {
    return NextResponse.json({ error: "GitHub storage is not configured." }, { status: 503 });
  }

  let slug = "";
  let confirm = "";
  try {
    const body = (await request.json()) as { slug?: unknown; confirm?: unknown };
    slug = typeof body.slug === "string" ? body.slug.trim() : "";
    confirm = typeof body.confirm === "string" ? body.confirm.trim() : "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  // Server-side re-check of the typed confirmation, so a stray click can never
  // delete a post even if the client-side guard is bypassed.
  if (confirm !== slug) {
    return NextResponse.json({ error: "Confirmation does not match the slug." }, { status: 400 });
  }

  const postPath = `${POSTS_PATH}/${slug}.md`;

  try {
    const post = await getFile(config, postPath);
    if (!post) {
      return NextResponse.json({ error: "That post no longer exists." }, { status: 404 });
    }

    const images = await listDirectory(config, `${IMAGES_PATH}/${slug}`);
    for (const image of images) {
      await deleteFile(config, image.path, image.sha, `content: remove image ${image.name} (${slug})`);
    }

    await deleteFile(config, postPath, post.sha, `content: delete post "${slug}"`);

    return NextResponse.json({ ok: true, slug, removedImages: images.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed." },
      { status: 502 }
    );
  }
}
