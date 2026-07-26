---
title: Teaching a CV Model in Your Browser
excerpt: How hand landmarks + a KNN classifier learn new gestures in seconds — all in the browser, no training loop, no server.
date: 2026-06-14
readTime: 6 min
tags: CV, Web ML
---

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
