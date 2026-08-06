---
title: How Do You Know Your LLM Defense Actually Works?
excerpt: A four-stage defense pipeline for prompt injection — 217 rules, a fine-tuned classifier, and what 150 unseen prompts actually proved.
date: 2026-04-12
readTime: 6 min
tags: Security, LLMs
---

## The problem

Every LLM deployment needs safety guardrails. But most teams test their defenses ad-hoc — throw a few jailbreak prompts at the model, see if it refuses, call it done.

That's not testing. That's hoping.

## Building a framework

Neuro-Sentry is the answer we built for that — a four-person university project where I led the backend, the detection pipeline, and the red-team side. It runs every prompt through four stages:

1. **Rule engine** — 217 regex patterns across 14 categories (jailbreak, injection, extraction, encoding, social engineering, privilege escalation, and more), with input normalization to defeat homoglyphs and zero-width padding. Roughly 0.9ms.
2. **Local classifier** — a fine-tuned DistilBERT binary model, ~7-9ms warm.
3. **Score fusion** — weighted 0.4 rules to 0.6 model, with a critical-rule floor and an obfuscation penalty.
4. **Decision** — block, flag, or allow, with the whole thing written to an audit log.

Anything the rules score at 85 or above short-circuits straight to a block without touching the model. Most obvious attacks never reach the expensive stage.

## What we found

Two things worth writing down.

**Score fusion will happily dilute a real threat.** A confidently benign-looking model score kept dragging genuinely dangerous prompts under the block threshold. Averaging is a reasonable default, but it treats every signal as negotiable. The fix was a floor: dangerous-content rules force a minimum risk of 75 regardless of what the classifier thinks.

**Cheap checks first changes the economics.** Putting regex ahead of the model wasn't about accuracy, it was about cost — the median request never pays for inference at all.

On a 150-prompt unseen evaluation (100 benign from databricks-dolly-15k, 50 zero-day attacks crafted for the test): 11 blocked, 5 flagged, 134 allowed. That's 76% accuracy — 35 false negatives and just 1 false positive.

## The honest part

The 35 false negatives are the interesting part: every one was a novel zero-day obfuscation vector the model had never been trained on. That's the honest trade in any rule-plus-ML system — rules catch what you've thought to write rules for, the model catches what it was trained on, and the gap between the two is where zero-days live. Real security needs adversaries who adapt once they learn how the defense behaves; a static test set only proves you catch the attacks you already thought of.

Every defense has blind spots. The goal isn't 100%, which is unreachable. It's knowing where the blind spots are and shrinking them on purpose.
