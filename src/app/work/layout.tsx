import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "A collection of case studies, ML pipelines, and production systems.",
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
