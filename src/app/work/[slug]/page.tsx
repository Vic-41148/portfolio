import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS } from "@/lib/projects";
import CaseStudyClient from "./case-study-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS[slug];
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.subtitle,
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS[slug];

  if (!project) notFound();

  return <CaseStudyClient project={project} />;
}
