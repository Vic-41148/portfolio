---
title: How Do You Know Your LLM Defense Actually Works?
excerpt: Building a systematic evaluation framework for prompt injection and jailbreak detection — and why pass/fail isn't enough.
date: 2026-04-12
readTime: 12 min
tags: Security, LLMs
---

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
