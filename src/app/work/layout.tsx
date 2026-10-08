import type { Metadata } from "next";

// Server wrapper around the client /work index: "use client" pages can't
// export metadata, and without an explicit canonical here this route would
// inherit no canonical at all while every /work/[slug] child sets its own.
export const metadata: Metadata = {
  title: "Selected Work",
  description: "A collection of case studies, ML pipelines, and production systems.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected Work",
    description: "A collection of case studies, ML pipelines, and production systems.",
    url: "/work",
  },
};

export default function WorkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
