import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://adityashibu.dev";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/writing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/work/webcam-transfer-learning`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/work/secure-llm-inference-platform`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/work/codeshield`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/work/game-boy-emulator`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/work/primetrade-mlops`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/writing/on-device-transfer-learning`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/writing/building-a-game-boy-emulator`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/writing/measuring-llm-defenses`, lastModified: new Date(), priority: 0.7 },
  ];
}
