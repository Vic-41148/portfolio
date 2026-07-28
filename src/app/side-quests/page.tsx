import type { Metadata } from "next";
import SideQuestsClient from "./client-page";

export const metadata: Metadata = {
  title: "Side Quests",
  description: "Open source contributions, random tinkering, and fun projects.",
};

export default function SideQuestsPage() {
  return <SideQuestsClient />;
}
