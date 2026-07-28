import React from "react";

export interface SideQuest {
  title: string;
  subtitle: string;
  date: string;
  content: React.ReactNode;
  github?: string;
  tags: string[];
}

export const SIDE_QUESTS: Record<string, SideQuest> = {
  "hyprland-fullscreen-swipe": {
    title: "Hyprland: Fullscreen Workspace Swipes",
    subtitle: "Fixing a bug in Wayland's most popular compositor",
    date: "Jun 2026",
    tags: ["C++", "Wayland", "Hyprland"],
    github: "https://github.com/hyprwm/Hyprland/pull/15137",
    content: (
      <>
        <h2 className="text-xl font-display font-semibold mt-8 mb-4">The Bug</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          When using the scrolling layout in Hyprland and using touchpad gestures to switch workspaces, the top layer (like Waybar) wouldn't disappear when moving into a fullscreen application. This broke the immersion of fullscreen apps and left the bar floating over content.
        </p>

        <h2 className="text-xl font-display font-semibold mt-8 mb-4">The Fix</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          The issue stemmed from the fullscreen checks relying on <code>m_fullscreenMode</code> and <code>m_hasFullscreenWindow</code> boolean state flags that were cached at the workspace level. During a swipe gesture, these flags could become desynced depending on the animation state.
        </p>
        <p className="mb-4 text-text-secondary leading-relaxed">
          I updated the codebase to determine the fullscreen state dynamically through <code>getFullscreenWindow()</code> rather than relying on the cached booleans. I also added an <code>isDirection(char)</code> overload and handled empty string views (<code>sv.empty()</code>) to make the layout engine more robust.
        </p>

        <h2 className="text-xl font-display font-semibold mt-8 mb-4">Impact</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          The pull request was merged into Hyprland's main branch, fixing #15053 and closing #14721. It was a great opportunity to dive into a modern C++ codebase and understand the intricacies of Wayland compositing and animation layers.
        </p>
      </>
    ),
  },
  "somn": {
    title: "Somn",
    subtitle: "A privacy-first, open-source sleep tracker for Android",
    date: "2026",
    tags: ["Android", "Kotlin", "Jetpack Compose", "Room"],
    github: "https://github.com/Vic-41148/somn",
    content: (
      <>
        <p className="mb-6 text-text-secondary leading-relaxed text-lg italic">
          Somn uses your phone's accelerometer to track sleep stages overnight — no wearable required. It scores your sleep with age-calibrated algorithms, supports biological profile adjustments, and keeps everything on-device.
        </p>

        <h2 className="text-xl font-display font-semibold mt-8 mb-4">Why I built it</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          Most sleep trackers require a $300 wearable or a recurring subscription. The free ones are often data brokers in disguise, harvesting your intimate health data. I wanted a privacy-first alternative that worked just by placing the phone on the mattress.
        </p>

        <h2 className="text-xl font-display font-semibold mt-8 mb-4">Architecture & Tech Stack</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          Built with Kotlin and Jetpack Compose, following Clean Architecture and unidirectional data flow. The app is divided into layers:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6 text-text-secondary">
          <li><strong>Data:</strong> Room database, DAOs, entities</li>
          <li><strong>Domain:</strong> Pure Kotlin use cases and models</li>
          <li><strong>UI:</strong> Compose, Material 3, dynamic theming</li>
          <li><strong>Tracking Service:</strong> A foreground service that reads raw accelerometer data, calculating movement magnitude and variability.</li>
        </ul>

        <h2 className="text-xl font-display font-semibold mt-8 mb-4">Smart Scoring Algorithm</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          The sleep scoring isn't just a generic percentage. It uses an age-calibrated algorithm that adjusts deep sleep targets from 27.5% for teens down to 10% for seniors. It also supports biological profiles, meaning the algorithm is lenient during specific menstrual cycle phases or for neurodivergent profiles (like ADHD), where consistency is naturally disrupted.
        </p>

        <h2 className="text-xl font-display font-semibold mt-8 mb-4">Zero Telemetry</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          The application literally does not have the <code>INTERNET</code> permission in its manifest. Every calculation, from epoch classification to sleep debt analysis, happens entirely on-device. Your sleep data is yours.
        </p>
      </>
    ),
  },
  "discord-bot": {
    title: "Discord Bot for Server Logs",
    subtitle: "Piping SSH attempts into a Discord channel",
    date: "2024",
    tags: ["Go", "Linux", "Discord API"],
    github: "https://github.com/Vic-41148",
    content: (
      <>
        <h2 className="text-xl font-display font-semibold mt-8 mb-4">The Idea</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          I got tired of tailing <code>auth.log</code> to see who was trying to brute-force my VPS. I wrote a small Go daemon that uses <code>fsnotify</code> to watch the log files, regex-matches failed SSH attempts, resolves the IP via a GeoIP database, and fires a webhook into a private Discord channel.
        </p>
      </>
    )
  },
};
