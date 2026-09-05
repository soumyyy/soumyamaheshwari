# Projects Presentation Redesign

Date: 2026-09-05
Status: approved, pending implementation plan
Follows: docs/superpowers/specs/2026-09-04-homepage-interactivity-redesign-design.md

## Problem

Observed directly in the browser, not inferred:

1. **A wall of text.** Every card renders `longDescription` — 794 words across 20 cards,
   averaging 40 and peaking at 81. BillInsight runs six lines, Fulcrum five. A short
   `description` field (~15 words) already exists in `projects.ts` and goes unused.
2. **Video cards render as a black void.** The `<video>` has no `poster` and never paints
   a first frame, so `shit`, `photocortex` and `eclipse-obsidian` show roughly 380px of
   empty black above their title. This is worse than having no video at all.
3. **Dead space from row stretching.** The CSS grid stretches every card to the tallest in
   its row, so a short card like Kochi Metro carries a large empty region.
4. **No hierarchy and no colour.** Twenty near-identical glassmorphism cards. The existing
   `gradientMap` already assigns each project a tint, but at 0.11–0.14 alpha it is
   invisible, so the variety it encodes is wasted.

## Requirements (from Soumya, verbatim intent)

- A **small** video preview, only on projects that have a demo — not a banner, and not
  space reserved on every card.
- The preview is clickable and opens the video larger.
- **No separate screen** for long descriptions.
- Desktop: **hover enlarges the card slightly** — enough to show the content and a bit of
  the longer text — **with a delay**.
- Mobile: tap expands the card to reveal the full text.
- The design should be better than it is now. Tasteful colour is welcomed.

## Decisions

| Decision | Value |
|---|---|
| Collapsed card | Uniform, compact. Title, short `description`, tech, small video thumb if present |
| Hover (desktop) | Slight enlarge + reveal a clamped preview of `longDescription` |
| Hover delay | 120ms before expanding; 80ms before collapsing |
| Full text | Click/tap expands fully, in place |
| Video | ~88×50 thumbnail beside the title; click opens a lightbox |
| Reflow | None. Expansion is absolutely positioned; the grid slot never resizes |
| Colour | One warm accent + per-project tints raised to perceptible on hover |
| Out | Glassmorphism (gradient + backdrop-blur) card treatment |

## Colour

The site is currently pure monochrome on black. Introduce **one** accent, used only for
interactive affordances so it reads as intentional rather than decorative:

    --accent:       #D9A441   /* warm amber */
    --accent-dim:   #8A6A2B

Applied to: the video play affordance, link hover, focus rings, the expand indicator, and
the active phase marker. **Never** to body prose — prose stays monochrome, which is what
keeps a single accent from looking like a theme.

**Per-project tints.** `gradientMap` in `ProjectCard.tsx` already assigns each project a
colour. Keep those hues, but drive them by state rather than leaving them invisible:

- at rest: alpha ~0.05, essentially a dark card with a hint of temperature
- on hover: alpha ~0.22, so the card visibly "blooms" into its own colour

That gives twenty cards individual identity without a rainbow, and makes the hover state
mean something instead of being a generic brightness change.

## Card anatomy

**Collapsed** (all cards identical height, compact):

    ┌──────────────────────────────────────────┐
    │ [thumb]  project title            ↗ ⌥    │
    │                                          │
    │ short description, one or two lines,     │
    │ clamped                                  │
    │                                          │
    │ python · fastapi · postgres              │
    └──────────────────────────────────────────┘

`[thumb]` appears only when `project.video` exists. Roughly 88×50, rounded, showing a
real poster frame, with a small accent-coloured play affordance on hover.

**Hover (desktop, after 120ms)** — the card lifts on `z-index`, scales slightly
(~1.02), its tint blooms, and a clamped 3-line preview of `longDescription` appears.
Neighbours do not move.

**Expanded (click/tap)** — full `longDescription`, all links. Same absolute-positioning
rule: the grid slot is unchanged.

## Mechanics that must be right

1. **No reflow.** The grid cell keeps a fixed height. The expanding surface is
   `position: absolute` within a `position: relative` cell, with an elevated `z-index`.
   If the card expands in normal flow, every card below it jumps on hover and the section
   becomes unusable. This is the single most important constraint in this spec.
2. **Hover only where hover exists.** Gate hover behaviour behind
   `@media (hover: hover) and (pointer: fine)`. Touch devices otherwise latch into a
   hover state that never clears.
3. **Delay.** 120ms enter, 80ms leave, both cancellable. Without it, a cursor crossing the
   grid while scrolling fires a cascade of expansions.
4. **Poster frames.** Generate a still for each of the three demo videos so the thumbnail
   is a real frame. This is the direct fix for the black-void defect. Prefer extracting a
   frame with `ffmpeg` if available; otherwise a `#t=0.1` media fragment on the `src`
   makes most browsers paint the first frame.
5. **Accessibility.** The expand control needs real button semantics — `aria-expanded`,
   keyboard operable, visible focus ring in the accent colour. The same omission was a
   review finding on the experience accordion in the previous plan; do not repeat it.
6. **Reduced motion.** Under `prefers-reduced-motion: reduce`, no scale or transition —
   expansion appears instantly, and the video thumbnail does not autoplay.
7. **Lightbox.** Focus is trapped while open, `Esc` and backdrop click close it, focus
   returns to the thumbnail that opened it, and body scroll is locked.

## Verification

1. Hovering a card in a dense grid moves no other card — measure a neighbour's
   `getBoundingClientRect()` before and after.
2. A cursor dragged quickly across the grid triggers no expansion (delay works).
3. The three demo thumbnails show a real frame, not black.
4. The lightbox opens, plays, closes on `Esc`, and returns focus.
5. Card body text on the collapsed grid totals well under the current 794 words.
6. Keyboard alone can reach, expand, and collapse a card, and open a video.
7. `prefers-reduced-motion` disables scale and autoplay.
8. No horizontal overflow at 375px.

## Out of scope

The `/demo/[id]` route (kept; the lightbox does not replace it), the hero, the philosophy
section, and the visitor counter (separate work, blocked on Vercel KV provisioning).
