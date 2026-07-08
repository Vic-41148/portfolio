"use client";

import { Cpu, GraduationCap, Gamepad2, BookOpen, Code2, Globe } from "lucide-react";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/Reveal";

const tiles = [
  {
    title: "Bio",
    content:
      "I started in C++ and systems programming — emulators, a real-time anomaly-detection engine, low-level things. Machine learning pulled me in and stuck, so now I build ML that actually runs: on-device, in the browser, at the edge. I'm going deep on computer vision while keeping one foot in the systems world that got me here.",
    icon: Cpu,
    span: "md:col-span-3 md:row-span-2",
  },
  {
    title: "Currently Learning",
    content: "PyTorch from scratch · CNNs · RAG + LangGraph · MLOps",
    icon: GraduationCap,
    span: "md:col-span-3",
  },
  {
    title: "Stack",
    content: "Python · PyTorch · C++ · TypeScript · FastAPI · Docker · Linux",
    icon: Code2,
    span: "md:col-span-2",
  },
  {
    title: "Fun",
    content: "I build Game Boy emulators for fun and daily-drive Arch. Currently poking at a Godot platformer.",
    icon: Gamepad2,
    span: "md:col-span-2",
  },
  {
    title: "Reading",
    content: "Deep Learning (Goodfellow) · Designing Data-Intensive Apps · Grokking Deep Learning",
    icon: BookOpen,
    span: "md:col-span-2",
  },
  {
    title: "Location",
    content: "Bangalore, India · remote · open to relocating",
    icon: Globe,
    span: "md:col-span-2",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-12 md:text-right md:ml-auto md:max-w-xl">
            <p className="section-eyebrow">
              <span className="motif-hash">#</span>About
            </p>
            <h2 className="section-heading">
              Who I am
            </h2>
            <p className="section-desc md:ml-auto">
              C++ and systems first, then ML. Now I build computer vision that
              runs on-device — in the browser, at the edge, without the server.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <StaggerItem className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden border border-border bg-surface md:-translate-y-4">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src="/images/me/headshot.jpg"
                alt="Aditya Shibu"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </StaggerItem>

          {tiles.map((tile) => (
            <StaggerItem
              key={tile.title}
              className={`${tile.span} rounded-2xl border border-border bg-surface p-6 flex flex-col`}
            >
              <div className="flex items-center gap-2 mb-3">
                <tile.icon className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono text-text-muted tracking-wider uppercase">
                  {tile.title}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed flex-1">
                {tile.content}
              </p>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
