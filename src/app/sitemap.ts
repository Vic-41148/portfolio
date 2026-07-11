import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/writing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/work/webcam-transfer-learning`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/work/secure-llm-inference-platform`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/work/codeshield`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/work/game-boy-emulator`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/work/primetrade-mlops`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/writing/on-device-transfer-learning`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/writing/building-a-game-boy-emulator`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/writing/measuring-llm-defenses`, lastModified: new Date(), priority: 0.7 },
  ];
}
