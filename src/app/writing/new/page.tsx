import type { Metadata } from "next";
import { Editor } from "./Editor";

export const metadata: Metadata = {
  title: "New post",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return <Editor />;
}
