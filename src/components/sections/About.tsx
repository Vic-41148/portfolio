"use client";

import { Cpu, GraduationCap, Gamepad2, BookOpen, Code2, Globe } from "lucide-react";
import Image from "next/image";
import { Reveal, StaggerReveal, StaggerItem, MaskText } from "@/components/Reveal";
import { Ghost } from "@/components/Ghost";
import { trackSpotlight } from "@/lib/utils";

const tiles = [
  {
    title: "Bio",
    content:
      "Started in C++ writing low-level things nobody sees — emulators, a real-time anomaly-detection engine. Then ML got its hooks in me and didn't let go. Now I build models that actually run where you are: on-device, in the browser, no server standing between us. Computer vision is the deep end and I'm still swimming down.",
    icon: Cpu,
    span: "md:col-span-3 md:row-span-2",
  },
  {
    title: "Currently Learning",
    content: "PyTorch from scratch · CNNs · RAG + LangGraph · MLOps — nothing here is a checkbox",
    icon: GraduationCap,
    span: "md:col-span-3",
  },
  {
    title: "Stack",
    content: "Python · PyTorch · C++ · TypeScript · FastAPI · Docker · Linux — no drag-and-drop, no low-code",
    icon: Code2,
    span: "md:col-span-2",
  },
  {
    title: "Fun",
    content: "I build Game Boy emulators for fun and daily-drive Arch, because apparently things need to be hard on purpose. Currently breaking a Godot platformer.",
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
    content: "New Delhi, India · remote · will relocate for the right kind of trouble",
    icon: Globe,
    span: "md:col-span-2",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 border-t border-border relative overflow-hidden">
      <Ghost word="About" className="left-[-1%] top-10" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-12 md:text-right md:ml-auto md:max-w-xl">
            <p className="section-eyebrow">
              <span className="motif-bracket" />Engineer No. 001
            </p>
            <h2 className="section-heading">
              <MaskText>Not your average ML hire</MaskText>
            </h2>
            <p className="section-desc md:ml-auto">
              C++ and systems first, then ML — in that order, on purpose. I build
              computer vision that runs on-device: in the browser, at the edge,
              with nothing phoning home to a server.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <StaggerItem className="group md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden border border-border bg-surface md:-translate-y-4">
            <div className="aspect-[3/4] relative overflow-hidden">
              <Image
                src="/images/me/headshot.webp"
                alt="Aditya Shibu"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-[55%_center] transition-all duration-700 group-hover:scale-[1.03]"
              />
            </div>
          </StaggerItem>

          {tiles.map((tile) => (
            <StaggerItem
              key={tile.title}
              onMouseMove={trackSpotlight}
              className={`${tile.span} relative card-spotlight rounded-2xl border border-border bg-surface p-6 flex flex-col`}
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
