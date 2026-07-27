import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPosts } from "@/lib/posts";
import { PROJECTS, PROJECT_PRIORITY } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  // Posts carry a real publication date. Case studies don't track one, and
  // stamping them with the build time would tell search engines every page
  // changed on every deploy — lastmod is worth more when it's only set where
  // it's true, so it's omitted rather than invented.
  const projectEntries: MetadataRoute.Sitemap = Object.keys(PROJECTS).map((slug) => ({
    url: `${SITE_URL}/work/${slug}`,
    priority: PROJECT_PRIORITY[slug] ?? 0.7,
  }));

  const writingEntries: MetadataRoute.Sitemap = getPosts().map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/writing`, changeFrequency: "weekly", priority: 0.8 },
    ...projectEntries,
    ...writingEntries,
  ];
}
