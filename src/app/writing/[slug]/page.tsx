import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Metadata } from "next";

const posts: Record<string, { title: string; date: string; readTime: string; content: string }> = {
  "on-device-transfer-learning": {
    title: "Training a CV Model in Your Browser",
    date: "Jun 2026",
    readTime: "8 min",
    content: `
## The idea

Most people think training ML models requires a GPU cluster, CUDA, and a lot of patience. It doesn't have to — at least not for small problems.

Transfer learning lets you take a model that already knows how to see (MobileNet, trained on ImageNet) and repurpose its feature extraction layers for a new task. The features MobileNet learned — edges, textures, shapes — are universal. You just need to teach the final classifier what *your* specific classes look like.

## Why in the browser?

Running this in the browser isn't just a neat demo trick. It means:

- **Zero infrastructure.** No server, no GPU rental, no Docker. The user's device does everything.
- **Privacy by design.** The training data never leaves the device. This isn't a feature — it's a fundamental architectural property.
- **Instant onboarding.** No installs, no accounts, no API keys. Open a URL and train.

## The pipeline

1. **Capture:** MediaPipe Tasks extracts 21 hand landmarks from each video frame. These landmarks are normalized and centered.
2. **Feature extraction:** The landmarks pass through MobileNet's convolutional base (up to the final average pooling layer), producing a 1280-dimensional feature vector.
3. **Train:** A small classifier (Dense → 128 → ReLU → Dense → 64 → ReLU → Dense → num_classes → Softmax) trains via SGD on ~20 captured examples per class.
4. **Inference:** Same forward path, but only through the classifier. The frozen MobileNet base caches its outputs.

## Key insight

The frozen-features approach is the difference between "works" and "doesn't." Full fine-tuning of MobileNet takes 40+ seconds in the browser and frequently suffers from catastrophic forgetting. A frozen base + a tiny classifier converges in under 10 seconds and is more stable.

MobileNet features are surprisingly good few-shot descriptors straight out of the box. The ImageNet pretraining generalized better than we had any right to expect.

## Limitations

Lighting and motion blur are the main failure modes. The landmark extractor needs a clearly visible hand, and rapid movement produces jittery landmarks. Accuracy drops from ~90% to ~60% in poor conditions.
    `.trim(),
  },
  "building-a-game-boy-emulator": {
    title: "What I Learned Building a Game Boy Emulator",
    date: "May 2026",
    readTime: "10 min",
    content: `
## Why an emulator?

I wanted to understand how computers work at the lowest level — not through a textbook, but by building one. A Game Boy emulator is the perfect scope: complex enough to be interesting, constrained enough to finish.

## The CPU

The Game Boy uses a Sharp SM83 processor, a hybrid between the Intel 8080 and the Z80. It has 8-bit registers, 16-bit addressing, and a hilariously small instruction set compared to modern x86. Writing the CPU core means implementing each opcode cycle-accurately — every fetch, decode, execute, and interrupt must match the original timing.

The hardest part? The undocumented behavior. Some instructions have side effects that aren't in the official documentation — you discover them when a game glitches and you spend three days tracing through a reference emulator.

## The PPU

The Picture Processing Unit is where the magic happens. It renders tiles, sprites, and backgrounds on a 160×144 pixel LCD. The PPU has four modes (OAM scan, drawing, HBlank, VBlank), and each must be timed to the 4.19MHz clock cycle.

Getting the pixel FIFO pipeline right was the single hardest part of the entire project. A single cycle off and every game has graphical corruption.

## The APU

The Audio Processing Unit has four channels: two pulse waves, one wave channel, and one noise channel. Each has its own envelope, sweep, and length counter. The audio mixing in the original hardware has subtle analog behaviors — channel interaction, DC offset, phase cancellation — that aren't documented anywhere.

I rewrote the APU three times before the audio sounded right.

## What I'd do differently

Test-driven development for opcodes. I wrote the CPU core first and tested against ROMs, which meant debugging everything at once. A proper test harness with Blargg's test ROMs from day one would have saved weeks.
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

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Metadata {
  const { slug } = params as unknown as { slug: string };
  const post = posts[slug];
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.content.slice(0, 160).replace(/[#*\n]/g, "").trim(),
  };
}

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = params as unknown as { slug: string };
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
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">
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
                <h2 key={i} className="text-xl font-display font-semibold tracking-tight mt-10 mb-4">
                  {para.replace("## ", "")}
                </h2>
              );
            }
            if (para.startsWith("- **")) {
              const items = para.split("\n").filter((l) => l.startsWith("-"));
              return (
                <ul key={i} className="space-y-2 list-disc list-inside text-text-secondary">
                  {items.map((item, j) => {
                    const boldText = item.replace(/^- \*\*(.+?)\*\*:/, "$1:");
                    const rest = item.replace(/^- \*\*(.+?)\*\*:/, "");
                    return (
                      <li key={j} className="leading-relaxed">
                        <strong className="text-text-primary">{boldText}</strong>
                        {rest}
                      </li>
                    );
                  })}
                </ul>
              );
            }
            if (para.startsWith("1. **") || para.startsWith("2. **") || para.startsWith("3. **") || para.startsWith("4. **")) {
              const items = para.split("\n").filter((l) => /^\d+\./.test(l));
              return (
                <ol key={i} className="space-y-2 list-decimal list-inside text-text-secondary">
                  {items.map((item, j) => {
                    const text = item.replace(/^\d+\. \*\*(.+?)\*\*:/, "$1:");
                    const rest = item.replace(/^\d+\. \*\*(.+?)\*\*:/, "");
                    return (
                      <li key={j} className="leading-relaxed">
                        <strong className="text-text-primary">{text}</strong>
                        {rest}
                      </li>
                    );
                  })}
                </ol>
              );
            }
            if (para.startsWith("- ")) {
              return (
                <ul key={i} className="space-y-1 list-disc list-inside text-text-secondary">
                  {para.split("\n").map((item, j) => (
                    <li key={j} className="leading-relaxed">{item.replace(/^- /, "")}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-text-secondary leading-relaxed">
                {para}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}
