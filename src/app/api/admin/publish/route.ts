import { NextResponse } from "next/server";
import { authorize } from "@/lib/admin-auth";
import { IMAGES_PATH, POSTS_PATH, encodeContent, getFile, putFile, repoConfig } from "@/lib/github";
import { buildMarkdownFile, isValidSlug, type PostFrontmatter } from "@/lib/frontmatter";

export const runtime = "nodejs";

const MAX_MARKDOWN_BYTES = 100_000;
const MAX_IMAGE_BYTES = 2_000_000;
const MAX_IMAGES = 6;
const IMAGE_NAME = /^[a-z0-9][a-z0-9-]*\.(webp|png|jpe?g|gif)$/i;

interface PublishBody {
  slug?: unknown;
  frontmatter?: Partial<Record<keyof PostFrontmatter, unknown>>;
  markdown?: unknown;
  images?: unknown;
  overwrite?: unknown;
}

export async function POST(request: Request) {
  const auth = await authorize(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const config = repoConfig();
  if (!config) {
    return NextResponse.json({ error: "GitHub storage is not configured." }, { status: 503 });
  }

  let body: PublishBody;
  try {
    body = (await request.json()) as PublishBody;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { error: "Slug must be lowercase words separated by single dashes." },
      { status: 400 }
    );
  }

  const markdown = typeof body.markdown === "string" ? body.markdown : "";
  if (!markdown.trim()) {
    return NextResponse.json({ error: "Post body is empty." }, { status: 400 });
  }
  if (new TextEncoder().encode(markdown).length > MAX_MARKDOWN_BYTES) {
    return NextResponse.json({ error: "Post body is too large (100 KB limit)." }, { status: 413 });
  }

  const meta = body.frontmatter ?? {};
  const title = typeof meta.title === "string" ? meta.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const date = typeof meta.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(meta.date)
    ? meta.date
    : new Date().toISOString().slice(0, 10);

  const linkedin = typeof meta.linkedin === "string" ? meta.linkedin.trim() : "";
  if (linkedin && !/^https:\/\/(www\.)?linkedin\.com\//.test(linkedin)) {
    return NextResponse.json({ error: "LinkedIn URL must point at linkedin.com." }, { status: 400 });
  }

  const frontmatter: PostFrontmatter = {
    title,
    excerpt: typeof meta.excerpt === "string" ? meta.excerpt.trim() : "",
    date,
    readTime: typeof meta.readTime === "string" ? meta.readTime.trim() : "5 min",
    tags: Array.isArray(meta.tags) ? meta.tags.filter((t): t is string => typeof t === "string") : [],
    ...(linkedin ? { linkedin } : {}),
  };

  const rawImages = Array.isArray(body.images) ? body.images : [];
  if (rawImages.length > MAX_IMAGES) {
    return NextResponse.json({ error: `At most ${MAX_IMAGES} images per post.` }, { status: 400 });
  }

  const images: { name: string; base64: string }[] = [];
  for (const entry of rawImages) {
    const image = entry as { name?: unknown; base64?: unknown };
    if (typeof image.name !== "string" || typeof image.base64 !== "string") {
      return NextResponse.json({ error: "Malformed image payload." }, { status: 400 });
    }
    if (!IMAGE_NAME.test(image.name)) {
      return NextResponse.json({ error: `Unsupported image name: ${image.name}` }, { status: 400 });
    }
    // base64 inflates by ~4/3; check the decoded size against the real limit.
    if ((image.base64.length * 3) / 4 > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: `${image.name} is over the 2 MB limit.` }, { status: 413 });
    }
    images.push({ name: image.name, base64: image.base64 });
  }

  const postPath = `${POSTS_PATH}/${slug}.md`;

  try {
    const existing = await getFile(config, postPath);
    if (existing && body.overwrite !== true) {
      return NextResponse.json(
        { error: `A post with the slug "${slug}" already exists.`, code: "exists" },
        { status: 409 }
      );
    }

    for (const image of images) {
      const imagePath = `${IMAGES_PATH}/${slug}/${image.name}`;
      const current = await getFile(config, imagePath);
      await putFile(
        config,
        imagePath,
        image.base64,
        `content: add image ${image.name} for ${slug}`,
        current?.sha
      );
    }

    const { commitUrl } = await putFile(
      config,
      postPath,
      encodeContent(buildMarkdownFile(frontmatter, markdown)),
      existing ? `content: update post "${title}"` : `content: publish post "${title}"`,
      existing?.sha
    );

    return NextResponse.json({ ok: true, slug, url: `/writing/${slug}`, commitUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Publish failed." },
      { status: 502 }
    );
  }
}
