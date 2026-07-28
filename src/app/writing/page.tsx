import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import WritingClient from "./client-page";

export const metadata: Metadata = {
  title: "Writing",
  description: "Posts about ML, computer vision, security, and systems engineering.",
};

export default function WritingPage() {
  const posts = getPosts();
  return <WritingClient posts={posts} />;
}
