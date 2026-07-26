/** Thin wrapper over the GitHub Contents API — the storage layer for posts.
 *  Everything the editor publishes lands as a real commit on the configured
 *  branch, so posts stay in git and the deploy pipeline is unchanged. */

const API = "https://api.github.com";

export interface RepoConfig {
  repo: string;
  branch: string;
  token: string;
}

export function repoConfig(): RepoConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  return { token, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

function headers(config: RepoConfig) {
  return {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-writing-editor",
    "Content-Type": "application/json",
  };
}

/** Base64 for arbitrary UTF-8 text (btoa alone throws on non-Latin1). */
export function encodeContent(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function decodeContent(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function getFile(
  config: RepoConfig,
  path: string
): Promise<{ sha: string; content: string } | null> {
  const url = `${API}/repos/${config.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(config.branch)}`;
  const res = await fetch(url, { headers: headers(config), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);

  const body = (await res.json()) as { sha: string; content?: string };
  return { sha: body.sha, content: body.content ? decodeContent(body.content) : "" };
}

export async function listDirectory(
  config: RepoConfig,
  path: string
): Promise<{ name: string; path: string; sha: string }[]> {
  const url = `${API}/repos/${config.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(config.branch)}`;
  const res = await fetch(url, { headers: headers(config), cache: "no-store" });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub list failed (${res.status})`);

  const body = (await res.json()) as { name: string; path: string; sha: string; type: string }[];
  return Array.isArray(body) ? body.filter((entry) => entry.type === "file") : [];
}

export async function putFile(
  config: RepoConfig,
  path: string,
  base64Content: string,
  message: string,
  sha?: string
): Promise<{ commitUrl: string }> {
  const url = `${API}/repos/${config.repo}/contents/${encodeURI(path)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: headers(config),
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub write failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }

  const body = (await res.json()) as { commit?: { html_url?: string } };
  return { commitUrl: body.commit?.html_url ?? `https://github.com/${config.repo}` };
}

export async function deleteFile(
  config: RepoConfig,
  path: string,
  sha: string,
  message: string
): Promise<void> {
  const url = `${API}/repos/${config.repo}/contents/${encodeURI(path)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: headers(config),
    body: JSON.stringify({ message, sha, branch: config.branch }),
  });

  if (!res.ok) {
    throw new Error(`GitHub delete failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }
}

export const POSTS_PATH = "content/writing";
export const IMAGES_PATH = "public/images/writing";
