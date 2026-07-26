import { Fragment, type ReactNode } from "react";

const INLINE_PATTERN = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
const IMAGE_ONLY = /^!\[([^\]]*)\]\(([^)]+)\)$/;

/** Inline markdown: **bold**, *italic*, `code`, [links](url), ![images](src). */
export function renderInline(text: string): ReactNode[] {
  return text
    .split(INLINE_PATTERN)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-text-primary font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-elevated text-text-primary"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      const image = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(part);
      if (image) {
        // eslint-disable-next-line @next/next/no-img-element
        return (
          <img
            key={i}
            src={image[2]}
            alt={image[1]}
            loading="lazy"
            className="inline-block max-w-full rounded-lg border border-border"
          />
        );
      }
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (link) {
        const external = /^https?:\/\//.test(link[2]);
        return (
          <a
            key={i}
            href={link[2]}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-accent hover-underline"
          >
            {link[1]}
          </a>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return <Fragment key={i}>{part}</Fragment>;
    });
}

/** Block-level markdown for post bodies: headings, ordered/unordered lists,
 *  standalone images (rendered as figures), and paragraphs. Deliberately small —
 *  it covers what the posts actually use, and the editor previews with the very
 *  same component so preview matches the published page. */
export function Markdown({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="prose-custom space-y-6">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-display font-normal mt-10 mb-4">
              {renderInline(trimmed.replace(/^## /, ""))}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-display font-normal mt-8 mb-3">
              {renderInline(trimmed.replace(/^### /, ""))}
            </h3>
          );
        }

        const image = IMAGE_ONLY.exec(trimmed);
        if (image) {
          return (
            <figure key={i} className="my-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image[2]}
                alt={image[1]}
                loading="lazy"
                className="w-full rounded-xl border border-border"
              />
              {image[1] && (
                <figcaption className="mt-2 text-xs font-mono text-text-muted text-center">
                  {image[1]}
                </figcaption>
              )}
            </figure>
          );
        }

        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="border-l-2 border-accent pl-4 text-text-secondary italic"
            >
              {renderInline(trimmed.replace(/^> /gm, ""))}
            </blockquote>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <ul key={i} className="space-y-2 list-disc list-inside text-text-secondary">
              {trimmed
                .split("\n")
                .filter((line) => line.trim().startsWith("- "))
                .map((item, j) => (
                  <li key={j} className="leading-relaxed">
                    {renderInline(item.trim().replace(/^- /, ""))}
                  </li>
                ))}
            </ul>
          );
        }

        if (/^\d+\. /.test(trimmed)) {
          return (
            <ol key={i} className="space-y-2 list-decimal list-inside text-text-secondary">
              {trimmed
                .split("\n")
                .filter((line) => /^\d+\. /.test(line.trim()))
                .map((item, j) => (
                  <li key={j} className="leading-relaxed">
                    {renderInline(item.trim().replace(/^\d+\. /, ""))}
                  </li>
                ))}
            </ol>
          );
        }

        return (
          <p key={i} className="text-text-secondary leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/** ~200 wpm, matching how the existing posts were labelled. */
export function estimateReadTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}
