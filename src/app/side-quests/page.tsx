import type { Metadata } from "next";
import SideQuestsClient from "./client-page";

export const metadata: Metadata = {
  title: "Side Quests",
  description: "Open source contributions, random tinkering, and fun projects.",
  alternates: { canonical: "/side-quests" },
  openGraph: {
    title: "Side Quests",
    description: "Open source contributions, random tinkering, and fun projects.",
    url: "/side-quests",
  },
};

export default function SideQuestsPage() {
  return <SideQuestsClient />;
}
