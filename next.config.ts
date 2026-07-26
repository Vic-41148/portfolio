import type { NextConfig } from "next";
import { generatePosts } from "./scripts/generate-posts.mjs";

// Bake content/writing/*.md into a bundled module before Next compiles. The
// Workers runtime has no filesystem, so anything read with fs is unavailable
// the moment a page renders at request time rather than during the build.
generatePosts();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
