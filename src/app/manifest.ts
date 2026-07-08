import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aditya Shibu — ML & Computer Vision Engineer",
    short_name: "Aditya Shibu",
    description: "ML systems engineer focused on secure LLM inference, computer vision, and on-device AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0B0F",
    theme_color: "#0A0B0F",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
