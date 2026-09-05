# Projects Presentation Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the project grid's uniform text-wall cards with compact cards that enlarge on hover, carry a small clickable video thumbnail where a demo exists, and bloom into their own colour.

**Architecture:** `ProjectCard` becomes a client component owning collapsed/hover/expanded state with debounced hover. Expansion is absolutely positioned inside a fixed-height grid cell so nothing reflows. A separate `VideoLightbox` owns modal playback. Per-project tints move from baked `rgba` strings to `r,g,b` triples so alpha can vary by state.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, framer-motion 12, ffmpeg (poster extraction, confirmed available).

**Spec:** `docs/superpowers/specs/2026-09-05-projects-presentation-design.md`

## Global Constraints

- **No reflow on hover or expand.** The grid cell keeps a fixed height; the card surface is `position: absolute` with elevated `z-index`. If a card expands in normal flow, every card below jumps and the section becomes unusable. This is the most important constraint here.
- **Hover gated to `(hover: hover) and (pointer: fine)`** — read via `matchMedia` inside an effect, never during render, or hydration mismatches. Touch devices otherwise latch a hover state that never clears.
- **Hover delay:** 120ms to expand, 80ms to collapse, both cancellable, both cleared on unmount.
- **Accent colour** `#D9A441` (`--accent`) / `#8A6A2B` (`--accent-dim`), used ONLY for interactive affordances — play button, link hover, focus rings, expand indicator. Never for body prose.
- **Per-project tint:** ~0.05 alpha at rest, ~0.22 on hover.
- **Collapsed cards render `description`, NOT `longDescription`.** The long text appears only on hover-preview (clamped) and full expansion.
- **Reduced motion:** no scale, no transition, no video autoplay.
- **Accessibility:** the expand control needs `aria-expanded`, keyboard operation, and a visible accent focus ring. The same omission was a review finding on the experience accordion in the previous plan — do not repeat it.
- **Lint gate:** `npm run lint` fails on this branch with pre-existing errors in untouched files. Gate on `npx eslint <changed files>` only. Never fix unrelated files. Never touch `src/app/demo/[id]/page.tsx`.
- **Commit trailers:** every commit message ends with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` on one line and `Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ` on the next.

## File Structure

**Create:**
- `public/demo/posters/{shit,photocortex,eclipse-obsidian}.jpg` — extracted poster frames
- `src/components/VideoLightbox.tsx` — modal player with focus handling

**Modify:**
- `src/app/globals.css` — accent tokens
- `src/components/ProjectCard.tsx` — full rewrite
- `src/data/projects.ts` — add `poster?: string` to the interface and the three entries
- `src/app/page.tsx` — grid cells become fixed-height positioning contexts

---

### Task 1: Accent tokens and poster frames

**Files:**
- Modify: `src/app/globals.css`, `src/data/projects.ts`
- Create: `public/demo/posters/*.jpg`

**Interfaces:**
- Consumes: nothing
- Produces: CSS vars `--accent`, `--accent-dim`; `Project.poster?: string` populated for the three video-backed projects.

This is the direct fix for the black-void defect: the `<video>` currently has no `poster` and never paints a first frame, so those cards show ~380px of empty black.

- [ ] **Step 1: Extract poster frames**

```bash
mkdir -p public/demo/posters
ffmpeg -y -i public/demo/SHITdemo.mp4        -ss 00:00:01 -frames:v 1 -q:v 3 public/demo/posters/shit.jpg
ffmpeg -y -i public/demo/PhotoCortexDemo.mp4 -ss 00:00:01 -frames:v 1 -q:v 3 public/demo/posters/photocortex.jpg
ffmpeg -y -i public/demo/EclipseDemo.mp4     -ss 00:00:01 -frames:v 1 -q:v 3 public/demo/posters/eclipse-obsidian.jpg
ls -lh public/demo/posters/
```

**Open each extracted image and look at it.** A frame at 1s may be a black intro, a splash screen, or a loading state — any of which reproduces the exact problem being fixed. If a frame is not representative, pick a different timestamp (`-ss 00:00:03`, `00:00:05`, …) until it shows real UI. Report which timestamp you used per video and why.

- [ ] **Step 2: Add the accent tokens**

In `src/app/globals.css`, add to the `:root` block:

```css
    --accent: #D9A441;
    --accent-dim: #8A6A2B;
```

- [ ] **Step 3: Add `poster` to the data model**

In `src/data/projects.ts`, add to the `Project` interface:

```ts
  poster?: string;
```

Set it on the three video-backed entries:
- `eclipse-obsidian` → `poster: "/demo/posters/eclipse-obsidian.jpg"`
- `shit` → `poster: "/demo/posters/shit.jpg"`
- `photocortex` → `poster: "/demo/posters/photocortex.jpg"`

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
grep -c "poster:" src/data/projects.ts
ls public/demo/posters/ | wc -l
```

Expect `3` and `3`.

- [ ] **Step 5: Commit** the posters, `globals.css` and `projects.ts` with a message describing the black-void fix, ending in the two required trailers.

---

### Task 2: Compact card with tint bloom

**Files:**
- Modify: `src/components/ProjectCard.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `Project` (now with `poster`), accent tokens from Task 1
- Produces: `ProjectCard` rendering the COLLAPSED state only. Hover/expand mechanics land in Task 3.

Replace the glassmorphism treatment. The existing `gradientMap` bakes alpha into `rgba()` strings, which makes state-driven alpha impossible — convert to `r,g,b` triples.

- [ ] **Step 1: Convert the tint map**

Replace `gradientMap` with:

```tsx
const tintMap: Record<string, string> = {
  "hermes":           "235,220,195",
  "eclipsn":          "180,195,215",
  "eclipse-obsidian": "170,182,195",
  "eclipse":          "195,200,210",
  "jarvis":           "210,205,195",
  "billinsight":      "200,210,200",
  "fulcrum":          "232,218,195",
  "glai":             "210,220,210",
  "room":             "238,228,210",
  "shit":             "205,200,195",
  "kochimetro":       "195,188,182",
  "hft":              "230,215,185",
  "photocortex":      "235,225,215",
  "stockportfolio":   "215,220,210",
  "sih-bel":          "175,190,205",
  "imagenerve":       "225,215,215",
  "alphafold-nano":   "200,215,215",
  "ace-rl":           "185,198,215",
  "vanshita":         "240,232,220",
  "bykritika":        "238,228,218",
};
const DEFAULT_TINT = "255,255,255";
```

- [ ] **Step 2: Rewrite the collapsed card**

```tsx
"use client";

import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const tint = tintMap[project.id] ?? DEFAULT_TINT;

  return (
    <article
      style={{
        background: `linear-gradient(135deg, rgba(${tint},0.05) 0%, rgba(${tint},0.02) 100%)`,
      }}
      className="rounded-2xl border border-white/[0.07] p-5 md:p-6 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        {project.poster && (
          <div className="relative shrink-0 w-[88px] h-[50px] rounded-md overflow-hidden border border-white/10">
            <Image src={project.poster} alt="" fill sizes="88px" className="object-cover" />
          </div>
        )}
        <h3 className="label text-base text-white/90 leading-snug flex-1">{project.title}</h3>
        <div className="flex items-center gap-2 shrink-0 text-white/30">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
               className="hover:text-[var(--accent)] transition-colors" aria-label="Source">
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.link && project.link !== project.github && (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
               className="hover:text-[var(--accent)] transition-colors" aria-label="Live">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-white/45 leading-relaxed lowercase">{project.description}</p>

      <div className="label text-xs text-white/35">
        {project.techStack.slice(0, 4).join(" · ")}
      </div>
    </article>
  );
}
```

Note: `description`, not `longDescription`. Tech becomes mono small-caps text, not pills. The `index` prop is gone — remove it from the call sites in `page.tsx`.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npx eslint src/components/ProjectCard.tsx src/app/page.tsx
```

Load the page: cards markedly shorter, the three demo cards show a real poster thumbnail beside the title rather than a black block, no card renders an 80-word paragraph.

- [ ] **Step 4: Commit** with a message explaining the switch to `description` and the thumbnail treatment, ending in the two required trailers.

---

### Task 3: Hover-to-enlarge with delay, no reflow

**Files:**
- Modify: `src/components/ProjectCard.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: the collapsed card from Task 2
- Produces: `ProjectCard` with `hovered` / `expanded` state; `page.tsx` grid cells as fixed-height positioning contexts.

**This is the task the whole redesign hinges on.** Get the no-reflow structure right before anything else.

- [ ] **Step 1: Make EVERY ProjectCard call site a fixed-height positioning context**

**`ProjectCard` is used in THREE places, not one.** Once the card becomes `position: absolute`, any call site whose parent is not a sized, `relative` box will collapse to zero height and its cards will overlap. All three must be wrapped:

1. `page.tsx` ~line 146 — the "my personal agent" card (`hermes`), inside a `space-y-4` stack
2. `page.tsx` ~line 153 — the four cards inside `<PrimitivesToggle>`, in the same stack
3. `page.tsx` ~line 164 — the side-projects grid

Wrap each rendered card in `<div data-card-cell className="relative h-[220px]">`. For the two stacked sites the surrounding `space-y-4` still supplies the gap; only the height and positioning context are new.

**Verify all three sections visually before moving on** — the personal-agent card and the primitive-tech cards are the ones that will look obviously broken if this is missed, and the primitive-tech ones are hidden behind a toggle so they are easy to forget. Expand that toggle and look.

The side-projects grid becomes:

```tsx
<div className="grid md:grid-cols-2 gap-6 md:gap-8">
  {projects.filter(/* unchanged filter */).map((project) => (
    <div key={project.id} data-card-cell className="relative h-[220px]">
      <ProjectCard project={project} />
    </div>
  ))}
</div>
```

The wrapper's fixed height is what the grid lays out; the card inside is absolutely positioned and free to grow past it.

- [ ] **Step 2: Add state and debounced hover**

First add the React import — after Task 2 the file imports nothing from react, so without this the task cannot compile:

```tsx
import { useState, useEffect, useRef } from "react";
```

Then:

```tsx
const [hovered, setHovered] = useState(false);
const [expanded, setExpanded] = useState(false);
const [canHover, setCanHover] = useState(false);
const enterT = useRef<number | null>(null);
const leaveT = useRef<number | null>(null);

useEffect(() => {
  setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  return () => {
    if (enterT.current) window.clearTimeout(enterT.current);
    if (leaveT.current) window.clearTimeout(leaveT.current);
  };
}, []);

const onEnter = () => {
  if (!canHover) return;
  if (leaveT.current) window.clearTimeout(leaveT.current);
  enterT.current = window.setTimeout(() => setHovered(true), 120);
};

const onLeave = () => {
  if (!canHover) return;
  if (enterT.current) window.clearTimeout(enterT.current);
  leaveT.current = window.setTimeout(() => { setHovered(false); setExpanded(false); }, 80);
};
```

`canHover` is read in an effect, never during render — reading `matchMedia` during render causes a hydration mismatch.

- [ ] **Step 3: Absolutely position the card surface**

```tsx
const open = hovered || expanded;

<article
  onMouseEnter={onEnter}
  onMouseLeave={onLeave}
  style={{
    background: `linear-gradient(135deg, rgba(${tint},${open ? 0.22 : 0.05}) 0%, rgba(${tint},0.02) 100%)`,
  }}
  className={`absolute inset-x-0 top-0 rounded-2xl border p-5 md:p-6 flex flex-col gap-3
    transition-[transform,background,border-color,box-shadow] duration-200 ease-out
    motion-reduce:transition-none
    ${open
      ? "z-20 border-white/20 shadow-2xl shadow-black/60 md:scale-[1.02] motion-reduce:md:scale-100"
      : "z-0 border-white/[0.07]"}`}
>
```

- [ ] **Step 4: Add the clamped hover preview**

After the tech line, inside the card:

```tsx
{open && (
  <p className="text-sm text-white/55 leading-relaxed lowercase line-clamp-3">
    {project.longDescription}
  </p>
)}
```

Three clamped lines is the "a bit of text" the spec calls for — enough to decide whether to click, not the whole paragraph.

- [ ] **Step 5: Verify no reflow — the critical check**

With the dev server running, in the browser console:

```js
const cells = [...document.querySelectorAll('#projects [data-card-cell]')];
const target = cells[2], neighbour = cells[5];
const before = neighbour.getBoundingClientRect().top;
target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
await new Promise(r => setTimeout(r, 400));
const after = neighbour.getBoundingClientRect().top;
({ before, after, moved: before !== after });
```

Expected `moved: false`. **If a neighbour moves, the absolute positioning is wrong — fix it before continuing.**

- [ ] **Step 6: Verify the delay**

Move the pointer quickly across several cards without pausing — nothing should expand. Rest on one for ~200ms — it should expand. Report what you observed.

- [ ] **Step 7: Commit** after `npx tsc --noEmit` and `npx eslint` on both changed files, with the two required trailers.

---

### Task 4: Video lightbox

**Files:**
- Create: `src/components/VideoLightbox.tsx`
- Modify: `src/components/ProjectCard.tsx`

**Interfaces:**
- Consumes: `project.video`, `project.poster`
- Produces: `<VideoLightbox src open onClose />`

- [ ] **Step 1: Create the lightbox**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function VideoLightbox({
  src, open, onClose,
}: { src: string; open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project demo video"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-6 right-6 text-white/60 hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded"
      >
        <X className="w-6 h-6" />
      </button>
      <video
        src={src}
        controls
        autoPlay
        playsInline
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-lg"
      />
    </div>
  );
}
```

Body scroll is locked while open and restored on close; focus moves to the close button and returns to whatever opened it.

- [ ] **Step 2: Make the thumbnail open it**

In `ProjectCard.tsx` — import `Play` from `lucide-react` and `VideoLightbox`, then:

```tsx
const [lightbox, setLightbox] = useState(false);

{project.poster && (
  <button
    onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
    aria-label={`Play ${project.title} demo`}
    className="relative shrink-0 w-[88px] h-[50px] rounded-md overflow-hidden border border-white/10 group/thumb focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
  >
    <Image src={project.poster} alt="" fill sizes="88px" className="object-cover" />
    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
      <Play className="w-4 h-4 fill-current text-[var(--accent)]" />
    </span>
  </button>
)}

{project.video && (
  <VideoLightbox src={project.video} open={lightbox} onClose={() => setLightbox(false)} />
)}
```

- [ ] **Step 3: Verify**

Click a thumbnail — the lightbox opens and plays. Press `Esc` — it closes and focus returns to the thumbnail. Click the backdrop — it closes. Confirm the page behind does not scroll while open. Report each result.

- [ ] **Step 4: Commit** after typecheck and scoped lint, with the two required trailers.

---

### Task 5: Tap-to-expand, accessibility, and verification

**Files:**
- Modify: `src/components/ProjectCard.tsx`

- [ ] **Step 1: Make the card a real expand control**

Add to the `<article>`:

```tsx
role="button"
tabIndex={0}
aria-expanded={expanded}
onClick={() => setExpanded((v) => !v)}
onKeyDown={(e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded((v) => !v); }
}}
```

and add `focus:outline-none focus:ring-2 focus:ring-[var(--accent)]` to its className.

**Do NOT convert the wrapper to a `<button>` element** — it contains an `<h3>` and nested interactive controls, which is invalid inside a button and would break the nested links. `role="button"` plus `tabIndex` is correct for this structure. Space must call `preventDefault()` or the page scrolls on every activation.

The GitHub/live links and the thumbnail button inside the card must call `e.stopPropagation()` so activating them does not also toggle the card.

- [ ] **Step 2: Show the full text when expanded**

Hover preview stays clamped; explicit expansion removes the clamp:

```tsx
<p className={`text-sm text-white/55 leading-relaxed lowercase ${expanded ? "" : "line-clamp-3"}`}>
```

- [ ] **Step 3: Full verification sweep**

```bash
npx tsc --noEmit
npx eslint src/components/ProjectCard.tsx src/components/VideoLightbox.tsx src/app/page.tsx
npm test
npm run build
```

Expect 32 tests passing and `/` still Static with 1h revalidate.

In the browser, report the actual result of each:
1. **No reflow** — the neighbour-position probe from Task 3 Step 5 still returns `moved: false`.
2. **Delay** — a fast pointer sweep expands nothing.
3. **Posters** — all three thumbnails show real frames, no black.
4. **Lightbox** — opens, plays, `Esc` closes, focus returns, body scroll locked.
5. **Keyboard** — Tab reaches a card, Enter expands, `aria-expanded` flips, Space toggles without scrolling the page.
6. **Reduced motion** — with `prefers-reduced-motion: reduce`, no scale and no transition.
7. **Mobile** — at 375px there is no horizontal overflow, and tapping a card expands it.
8. **Word count** — the collapsed grid's body text is far below the previous 794 words.

- [ ] **Step 4: Commit** with the two required trailers.

---

## Deliberate behaviour changes

These are intentional, not regressions — a reviewer should not flag them as defects:

1. **The scroll-reveal animation is dropped.** The current card is a `motion.div` with
   `initial`/`whileInView` fade-and-slide plus a per-index stagger delay. The rewrite
   removes framer-motion from the card entirely. Reason: the card now animates on hover,
   and stacking a scroll-reveal on top of that makes a dense grid feel busy — plus the
   staggered fade-in-on-scroll grid is itself a stock portfolio motion pattern. If it is
   wanted back, it belongs on the fixed-height wrapper in `page.tsx`, not on the
   absolutely-positioned card surface, or the two transforms will fight.
2. **Tech chips become a mono line, not pills.** Twenty cards of rounded pills was a
   significant share of the visual noise.
3. **Only the first four tech items are shown** (`techStack.slice(0, 4)`). BillInsight has
   ten, which alone consumed two lines of the card.

## Open dependency

The fixed cell height in Task 3 (`h-[220px]`) is a starting value. Once real content is in, check the tallest collapsed card and adjust so no card's collapsed content is clipped. Report the value you settle on.
