import { NextResponse } from "next/server";
import { authorize } from "@/lib/admin-auth";
import { POSTS_PATH, getFile, listDirectory, repoConfig } from "@/lib/github";
import { parseFrontmatter } from "@/lib/frontmatter";

export const runtime = "nodejs";

/** Lists posts straight from GitHub rather than the local content dir, so the
 *  editor sees a post the moment it's committed — not after the next deploy. */
export async function GET(request: Request) {
  const auth = await authorize(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const config = repoConfig();
  if (!config) {
    return NextResponse.json({ error: "GitHub storage is not configured." }, { status: 503 });
  }

  try {
    const files = (await listDirectory(config, POSTS_PATH)).filter((file) => file.name.endsWith(".md"));

    const posts = await Promise.all(
      files.map(async (file) => {
        const slug = file.name.replace(/\.md$/, "");
        const stored = await getFile(config, file.path);
        const { data } = parseFrontmatter(stored?.content ?? "");
        return {
          slug,
          title: data.title ?? slug,
          date: data.date ?? "",
          sha: file.sha,
        };
      })
    );

    posts.sort((a, b) => b.date.localeCompare(a.date));
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not reach GitHub." },
      { status: 502 }
    );
  }
}
