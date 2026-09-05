# An Audience of One: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the projects section with the "audience of one" design: every project introduced by who needed it, in four sections, with Eclipse given its own block.

**Architecture:** `page.tsx` stays a React Server Component. Only `ProjectEntry` becomes a client island, owning hover debounce and panel state. Data restructures so the five agent iterations collapse into one entry with a lineage.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, TypeScript.

**Spec:** `docs/superpowers/specs/2026-09-05-audience-of-one-design.md` — it carries all copy, tokens, CSS and reasoning. Read it before every task.

## Global Constraints

- **All copy comes from the spec verbatim.** Lowercase throughout. The copy is the product of a long design conversation; do not reword, recapitalise or "improve" it.
- **No em dashes anywhere in `src/`.** This includes pre-existing ones in `projects.ts`.
- **`page.tsx` stays a Server Component.** Only `ProjectEntry` carries `"use client"`.
- **Section colour tokens are scoped to the section, not `:root`.** The rest of the site keeps its palette.
- **`--ink-faint: #575249` is a floor, not a suggestion.** It is the lightest tone passing 4.5:1 on the paper ground.
- **No ancestor of the detail panel may set `transform`, `filter` or `overflow: hidden`** or the panel is clipped or mispositioned.
- **Hover gated to `(hover: hover) and (pointer: fine)`**, read via `matchMedia` inside an effect, never during render.
- **Lint gate:** `npm run lint` fails on this branch's base with pre-existing errors in untouched files. Gate on `npx eslint <changed files>` only. Never touch `src/app/demo/[id]/page.tsx`.
- **Commit trailers:** every commit ends with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ`.

---

### Task 1: Data model and copy

**Files:** Modify `src/data/projects.ts`

Restructure to the interface in the spec's "Data model" section. Fourteen entries. The five agent projects (`hermes`, `eclipsn`, `eclipse-obsidian`, `eclipse`, `jarvis`) collapse into one `eclipse` entry with `lineage` and `pins`.

Every `name`, `who`, `summary`, `problem[]`, `stack` and `note` is transcribed from the spec's Copy section exactly. `section` is one of `core | one | someone | question`.

Keep `video` and `poster` on the three demo-backed projects. Keep `github` and `link` where they exist.

- [ ] **Step 1** Rewrite `projects.ts` against the spec's Copy section.
- [ ] **Step 2** Sweep em dashes: `grep -rn "—" src/` must return nothing. Replace with commas, full stops or restructured sentences, never with a hyphen pretending to be one.
- [ ] **Step 3** Verify: `npx tsc --noEmit`; `grep -c "section:" src/data/projects.ts` returns 14; counts per section are 1, 4, 4, 5.
- [ ] **Step 4** Commit.

---

### Task 2: Section tokens and CSS

**Files:** Modify `src/app/globals.css`

Add the ledger palette scoped to a `.projects-paper` class, not `:root`. Add the boundary gradient bands. Everything else lives in component classes.

- [ ] **Step 1** Add the token block from the spec's "Visual system", scoped to `.projects-paper`.
- [ ] **Step 2** Add `.edge-top` / `.edge-bottom`, 96px, gradient from `--site-dark` to transparent.
- [ ] **Step 3** Verify the tokens do not leak: the hero and philosophy sections must be unchanged. Load the page and confirm.
- [ ] **Step 4** Commit.

---

### Task 3: ProjectEntry and ProjectGroup

**Files:** Create `src/components/ProjectEntry.tsx` (client), `src/components/ProjectGroup.tsx` (server)

`ProjectGroup` renders a sticky section header and the two column grid. `ProjectEntry` renders one project and owns hover, delay and panel state.

Follow the spec's "Layout", "The entry", "The detail panel" and "Mobile" sections precisely. The grid uses a top border cleared on the first row, `row-gap: 0`, padding carrying the separation.

- [ ] **Step 1** Build `ProjectGroup` (server): sticky `h2` with title and count line, then the grid.
- [ ] **Step 2** Build `ProjectEntry` (client): number, optional preview button, name link, subtitle, then a `position: relative` body wrapping summary, credit and disclosure button, with the panel absolutely positioned at `top: -6px` inside it.
- [ ] **Step 3** Hover debounce: 120ms in, 80ms out, both cancellable, both cleared on unmount. `canHover` from `matchMedia` inside an effect.
- [ ] **Step 4** Only one panel open at a time; document scroll and `Escape` both close it; a `✕` in the panel closes it.
- [ ] **Step 5** Mobile below 820px: single column, 2px solid rule above every entry including the first, inline red entry number, panel in flow, no hover handlers.
- [ ] **Step 6** **Verify no reflow.** Dispatch `mouseover` (NOT `mouseenter`, which React does not observe) on one entry and confirm a neighbour's `getBoundingClientRect().top` is unchanged, AND that the target actually opened. Both halves are required or the check passes falsely.
- [ ] **Step 7** Verify the delay: a fast sweep across the grid opens nothing.
- [ ] **Step 8** `npx tsc --noEmit`, `npx eslint` on changed files. Commit.

---

### Task 4: The core Eclipse section

**Files:** Create `src/components/CoreProject.tsx` (server)

Two columns per the spec's "The core section". Left: name, subtitle, three paragraphs. Right: the five-attempt ruled list and the integration chips, separated by a `1px --hair` rule.

- [ ] **Step 1** Build it, transcribing the lineage table and pins from the spec exactly.
- [ ] **Step 2** Below 820px it stacks, with the right column gaining a top rule instead of a left one.
- [ ] **Step 3** Verify all five iterations render with their descriptions, and that "backed by open source hermes" appears. There must be no reference to "maze".
- [ ] **Step 4** `npx tsc --noEmit`, `npx eslint`. Commit.

---

### Task 5: Wire up, delete dead code, verify

**Files:** Modify `src/app/page.tsx`; delete `src/components/ProjectCard.tsx`, `src/components/PrimitivesToggle.tsx`

- [ ] **Step 1** Replace the projects section in `page.tsx` with the edge bands, masthead, `CoreProject`, and three `ProjectGroup`s reading from `projects.ts` by `section`.
- [ ] **Step 2** Masthead: `an audience of one` and the italic subtitle from the spec. **No tally line.**
- [ ] **Step 3** Delete `ProjectCard.tsx` and `PrimitivesToggle.tsx`. Confirm no references remain.
- [ ] **Step 4** Keep `VideoLightbox.tsx`; the preview button opens it.
- [ ] **Step 5** Full sweep, reporting each actual result:
  - `npx tsc --noEmit` clean
  - `npm test` still passes
  - `npm run build`, and `/` still static with ISR
  - `grep -rn "—" src/` returns nothing
  - `grep -rn "ProjectCard\|PrimitivesToggle" src/` returns nothing
  - hero and philosophy sections visually unchanged
  - at 375px: no horizontal overflow, 2px rules between projects, inline red numbers
  - keyboard: tab to an entry, open, `aria-expanded` flips, `Escape` closes
  - all three previews show a real frame at 92x52, not black
- [ ] **Step 6** Commit.

---

## Notes carried from the previous plan

- Browser tooling in this environment is unreliable and has killed two agents. Budget three attempts per task, then fall back to static reasoning and say plainly what was and was not observed. An honest "not observed" is acceptable; a claimed observation is not.
- A dev server may already be running for this worktree. Do not start a competing one, and do not kill a process you did not start.
