import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Metadata } from "next";

const posts: Record<string, { title: string; date: string; readTime: string; content: string }> = {
  "on-device-transfer-learning": {
    title: "Teaching a CV Model in Your Browser",
    date: "Jun 2026",
    readTime: "6 min",
    content: `
## The idea

Most people think a computer-vision model learning something new requires a GPU cluster, CUDA, and a lot of patience. It doesn't have to — at least not for small problems.

The trick is picking the right features. If the input representation is good enough, the "learning" on top of it can be almost trivially simple — simple enough to run instantly, in a browser tab, on whatever device is in front of you.

## Why in the browser?

Running this in the browser isn't just a neat demo trick. It means:

- **Zero infrastructure.** No server, no GPU rental, no Docker. The user's device does everything.
- **Privacy by design.** The camera frames never leave the device. This isn't a feature — it's a fundamental architectural property.
- **Instant onboarding.** No installs, no accounts, no API keys. Open a URL and teach it.

## The pipeline

1. **Extract:** MediaPipe Tasks pulls 21 hand landmarks from each video frame — on the WebGPU delegate where available, WebGL otherwise.
2. **Normalize:** Landmarks are re-centered on the wrist and L2-normalized, so hand size and position in frame stop mattering.
3. **Capture:** "Training" is just storing normalized landmark vectors for each gesture you show it.
4. **Classify:** A K-Nearest-Neighbors comparison against your captured examples, every frame, in real time.

## Key insight

The heavy lifting is all in the features. MediaPipe's landmark extractor is the pretrained model doing the real perception work; once frames become normalized landmark vectors, a KNN with a handful of examples per class is enough to separate gestures reliably. No training loop, no epochs, no loss curve — and it still feels like magic to teach.

The honest trade: KNN memorizes rather than generalizes. Two similar gestures can collide, and a production system would learn a proper feature space. For a teach-it-in-seconds demo, the simplicity is the point.

## Limitations

Lighting and motion blur are the main failure modes. The landmark extractor needs a clearly visible hand, and rapid movement produces jittery landmarks. Occlusion and extreme angles degrade it further — it's a demo of a real pipeline, not a product.
    `.trim(),
  },
  "building-a-game-boy-emulator": {
    title: "Building a Game Boy Emulator, the Slow Way",
    date: "May 2026",
    readTime: "6 min",
    content: `
## Why an emulator?

I wanted to understand how computers work at the lowest level — not through a textbook, but by building one. A Game Boy emulator is the right scope: complex enough to be interesting, constrained enough that finishing is plausible.

This is a progress report, not a victory lap. The emulator is early — memory bus, BIOS loading, register file. The CPU core is next. I'm writing about it anyway, because learning in public beats pretending in private.

## Scope lesson one: I started with the wrong console

The first attempt was a Game Boy Advance emulator. The GBA's memory map alone — external memory, internal work RAM, display memory regions — swallowed days before a single instruction could execute. Bigger console, bigger mistake.

Restarting on the original Game Boy wasn't giving up; it was picking a fight I could actually win. Smaller memory map, one CPU, decades of documentation.

## Why the bus comes first

The tempting starting point is the CPU — it feels like the "real" work. But everything on the Game Boy talks through the memory bus: the cartridge, video RAM, high RAM, I/O registers. Get addressing wrong and every component you build afterward inherits the bug.

So the bus went in first, then BIOS loading, then the register file. The CPU core lands on ground that's already solid.

## The register file is sneakily educational

The SM83's registers pair up — B and C become BC, H and L become HL — and the AF pair is the weird one: the low byte is the flag register, and its bottom four bits are hard-wired to zero. Encoding that in C++ types, so illegal flag states are unrepresentable instead of merely avoided, taught me more about hardware-faithful modeling than any tutorial.

## What's next

The SM83 CPU core, opcode by opcode — with a proper test harness from day one, because debugging a CPU against real ROMs with no tests is how people lose weekends. Then the PPU. The repo is public the whole way: half-finished parts, dead ends, and all.
    `.trim(),
  },
  "measuring-llm-defenses": {
    title: "How Do You Know Your LLM Defense Actually Works?",
    date: "Apr 2026",
    readTime: "12 min",
    content: `
## The problem

Every LLM deployment needs safety guardrails. But most teams test their defenses ad-hoc — throw a few jailbreak prompts at the model, see if it refuses, call it done.

That's not testing. That's hoping.

## Building a framework

The secure-llm-inference-platform project is a systematic evaluation framework. It:

1. **Generates attacks** from templates (role-play, hypothetical framing, encoding, context manipulation) and mutates them for variety
2. **Tests across defense layers** — input filtering, prompt sanitization, output classification
3. **Scores each attack** on a rubric: blocked, partial bypass, full bypass
4. **Produces a report** with per-category breakdown, regression tracking, and a summary

## What we found

The most effective single attack type? Combining role-play with hypothetical framing — a compound attack that neither category alone catches. A single-layer defense caught about 60% of attacks. Layered defenses (input filter + output classifier) caught 90%+.

## The honest part

The attack generator itself can produce harmful content during development. We built an airlock — generated attacks go through a human review gate before reaching the target model.

Also: every defense has blind spots. The goal isn't 100% (impossible) — it's knowing where your blind spots are and shrinking them.
    `.trim(),
  },
};

/** Minimal inline markdown: **bold**, *italic*, `code`. The old regex
 *  special-cases only matched bold-with-trailing-colon and duplicated the
 *  matched text into the tail of each list item. */
function renderInline(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-text-primary font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-elevated text-text-primary">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
}

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.content.slice(0, 160).replace(/[#*\n]/g, "").trim(),
  };
}

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) notFound();

  const paragraphs = post.content.split("\n\n");

  return (
    <article className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to writing
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-normal mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-text-muted font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="prose-custom space-y-6">
          {paragraphs.map((para, i) => {
            if (para.startsWith("## ")) {
              return (
                <h2 key={i} className="text-xl font-display font-normal mt-10 mb-4">
                  {renderInline(para.replace("## ", ""))}
                </h2>
              );
            }
            if (para.startsWith("- ")) {
              return (
                <ul key={i} className="space-y-2 list-disc list-inside text-text-secondary">
                  {para.split("\n").filter((l) => l.startsWith("- ")).map((item, j) => (
                    <li key={j} className="leading-relaxed">
                      {renderInline(item.replace(/^- /, ""))}
                    </li>
                  ))}
                </ul>
              );
            }
            if (/^\d+\. /.test(para)) {
              return (
                <ol key={i} className="space-y-2 list-decimal list-inside text-text-secondary">
                  {para.split("\n").filter((l) => /^\d+\. /.test(l)).map((item, j) => (
                    <li key={j} className="leading-relaxed">
                      {renderInline(item.replace(/^\d+\. /, ""))}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={i} className="text-text-secondary leading-relaxed">
                {renderInline(para)}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}
