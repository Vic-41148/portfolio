/** The post text to paste into LinkedIn. Deliberately plain — LinkedIn strips
 *  markdown, and the point is a native-looking post that links back here. */
export function linkedInDraft(
  title: string,
  excerpt: string,
  url: string,
  tags: string[]
): string {
  const hashtags = tags
    .map((tag) => `#${tag.replace(/[^a-zA-Z0-9]/g, "")}`)
    .filter((tag) => tag.length > 1)
    .join(" ");

  return [title, "", excerpt, "", `Full post: ${url}`, hashtags]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n")
    .trim();
}
