---
title: Building a Game Boy Emulator, the Slow Way
excerpt: A progress report from the memory bus up — why the CPU comes last, and the case for learning in public.
date: 2026-05-16
readTime: 6 min
tags: Systems, C++
---

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
