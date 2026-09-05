# Projects Section: An Audience of One

Date: 2026-09-05
Status: final, ready to implement
Reference build: the published artifact "An Audience of One"
Supersedes: `docs/superpowers/specs/2026-09-05-projects-presentation-design.md`

## What this replaces, and what to keep

The branch currently has four committed tasks implementing a compact card grid. That
design is abandoned. Salvage and discard as follows.

**Keep:**
- `public/demo/posters/{shit,photocortex,eclipse-obsidian}.jpg` and the `poster` field on
  `Project`. Three rounds of work went into choosing frames that are not near black.
- `VideoLightbox.tsx`. It becomes what the small preview opens.
- `--accent` in `globals.css`, retuned to the ledger red below.
- The `projects.ts` fixes: single "Eclipse" title, Glai leading with the mother detail.

**Discard:**
- `ProjectCard.tsx` in its current form. Rewritten entirely.
- The fixed cell height and hover-enlarge mechanics from that plan's Task 3.
- The `PrimitivesToggle` component. Grouping the agent iterations removes its reason to
  exist, and it was the source of the clipping defect.

## The idea

Every project is introduced by **who needed it**. The project name is the heading, and the
line naming its audience sits directly beneath as a subtitle. Six were built for one
person; several of those people are me. That is the argument, and it turns the least
impressive statistic in a portfolio into its opening claim.

Four sections, in order. All four groupings are factually true and none were invented to
fit the concept.

| Section | Count | Header line |
|---|---|---|
| the one i keep rebuilding | 1 | `five attempts, one question` |
| an audience of one | 4 | `four projects, one user each` |
| an audience of someone else | 4 | `four projects, real users` |
| sometimes the question was enough | 5 | `five projects, five questions` |

Never phrase the fourth as "no users at all".

## Data model

`src/data/projects.ts` changes shape. The five agent iterations collapse into one entry.

```ts
export interface Project {
  id: string;
  name: string;           // heading. lowercase.
  who: string;            // subtitle. who it was for, or the question it answered.
  summary: string;        // one or two lines, always visible
  problem: string[];      // 3 paragraphs, revealed on hover or tap
  stack: string;          // mono, dot separated, already formatted
  note?: string;          // "on testflight", "live at shitsort.com", "fully local"
  video?: string;
  poster?: string;
  github?: string;
  link?: string;
  section: "core" | "one" | "someone" | "question";
  lineage?: { v: string; t: string; d: string }[];   // core only
  pins?: string[];                                    // core only
}
```

Order within each section is authored, not derived. Keep the array order.

**Deleted entries:** `hermes`, `eclipsn`, `eclipse-obsidian`, `eclipse`, `jarvis` collapse
into a single `eclipse` entry carrying `lineage`. Fourteen entries total.

## Component structure

`page.tsx` stays a React Server Component. Nothing about the layout, the sections, the row
rules or the density needs the client.

```
ProjectsSection            server   section wrapper, renders the four groups
  CoreProject              server   the eclipse block, its own layout
  ProjectGroup             server   sticky header plus a two column grid
    ProjectEntry           client   one project. owns hover, delay, panel state
      VideoLightbox        client   existing component, unchanged
```

`ProjectEntry` is the only new client component. Pass its content in as props from the
server; the strings never need to reach the client bundle as data.

## Visual system

Ledger. The section inverts to paper while the rest of the site stays near black.

```css
--site-dark: #0A0A0B;   /* the rest of the page */
--ground:    #F5F3EA;
--lift:      #EEEBDD;
--ink:       #12100C;
--ink-soft:  #3A362E;
--ink-faint: #575249;   /* passes 4.5:1 on --ground. do not lighten it */
--rule:      #B4AD9B;
--hair:      #D6D0C1;
--red:       #9E241C;
```

Scope these to the section, not `:root`. The rest of the site keeps its own tokens.

**Type.** Zodiak for the name and the subtitle, Instrument Sans for summary and paragraphs,
Commit Mono for numbers, stack, notes and section headers. All prose lowercase.

**Rules carry meaning.** `3px double` closes the masthead and opens each section header.
`1px solid var(--rule)` is a subtotal line. `1px solid var(--hair)` separates rows and
columns. Do not use them interchangeably.

**Boundary with the dark site.** A 96px gradient band above and below, from `--site-dark`
to transparent. Short on purpose; 200px reads as haze rather than as an edge.

## Layout

**Desktop.** Two columns. Row separation is a top border on every cell, cleared for the
first row, with `row-gap: 0` and the spacing carried as vertical padding.

```css
.grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 0; row-gap: 0; }
.grid > .entry { border-top: 1px solid var(--hair); }
.grid > .entry:nth-child(1),
.grid > .entry:nth-child(2) { border-top: 0; padding-top: 0; }

.entry {
  position: relative; min-height: 13.5rem;
  padding: calc(var(--sep) / 2) 34px calc(var(--sep) / 2) 0;
  display: flex; flex-direction: column;
}
.entry:nth-child(even) {
  padding: calc(var(--sep) / 2) 0 calc(var(--sep) / 2) 34px;
  border-left: 1px solid var(--hair);
}
```

with `--sep: clamp(2rem, 5vh, 3.5rem)`.

**Why a top border and not a bottom one.** The middle sections have four projects and one
has five, so the last row can hold a single item. A bottom border would leave a stray rule
under it. A top border cleared on the first row is correct for any count.

**Why `min-height` survives.** It is what makes the credit rule land at the same height in
both columns when one summary wraps to two lines and the other to three. Without it the
alignment breaks and the section stops reading as a ledger.

## The entry

```
[num]                                    [preview, if a demo exists]
name                                     ← Zodiak, clamp(1.75rem, 3vw, 2.35rem)
who it was for.                          ← Zodiak italic, --red
summary, one or two lines                ← Instrument Sans, --ink-soft
──────────────────────────────           ← 1px --hair
stack · dot · separated      note        ← Commit Mono, --ink-faint
what i built ↓
```

`.summary` takes `margin-bottom: auto` so the credit rule sits at the bottom of the cell.
The entry number is boxed, absolutely positioned top right.

## The detail panel

The panel replaces the summary in place. It does **not** hang below the whole entry.

Wrap the summary, credit and button in a `position: relative` container. The panel is
`position: absolute; top: -6px; left: 0; right: 0` inside it, so it opens directly under
the subtitle and covers the short text. The name and the subtitle stay visible, so the
reader never loses which project they are in.

- Opaque `--ground`, `1px solid var(--rule)`, `3px double var(--red)` on top, a shadow.
- `z-index: 30`, with the entry raised to `40` while open. **No ancestor may set a
  transform, filter or `overflow: hidden`**, or the panel is clipped or mispositioned.
- The panel covers the button that opened it, so it carries a `✕` in its top right for
  keyboard and click users. `Escape` also closes.
- **Only one open at a time.**
- **Scrolling the document closes it.** Without this, a panel outlives its own entry and
  floats beside later projects.

**Hover delay: 120ms to open, 80ms to close, both cancellable.** Without it a cursor
crossing the grid fires a cascade. Gate hover behind
`matchMedia("(hover: hover) and (pointer: fine)")`, read inside an effect, never during
render.

## Mobile

Below 820px, one column, and the separation must be unmistakable.

- `border-top: 2px solid var(--rule)` on every entry, including the first.
- `padding: 1.7rem 0 1.9rem`.
- The entry number moves inline, at the top of the entry, in `--red` with a red underline.
  It becomes the marker that says a new project has started.
- The panel goes back in flow and expands in place. A floating overlay would cover the
  thing just tapped.
- The preview thumbnail moves inline above the name.
- Hover handlers do not attach at all.

## Video previews

Only the three projects with recordings. A 92x52 button beside the entry number, showing
the real poster frame, with a red play glyph on hover. Clicking opens `VideoLightbox`.
Never reserve the space on entries without a recording.

## The core section

Eclipse gets its own block above the three groups. Two columns.

**Left:** name at `clamp(2.6rem, 6vw, 4.2rem)`, the subtitle, then three paragraphs
covering what it is, what it ingests, and that it has been rebuilt five times.

**Right:** two blocks separated from the left by a `1px --hair` rule.

*five attempts* as a ruled list, each row a version number in red, an uppercase mono
title, and one line of description.

*what it is plugged into* as bordered mono chips: whatsapp, telegram, whoop, strava,
gmail, memory layer, codex, orchestrating agent, backed by open source hermes.

## Copy

Final. Lowercase throughout. **No em dashes anywhere on the site**, including in
`projects.ts` descriptions written earlier.

### Masthead

> **an audience of one**
> *six of these have exactly one user. i am usually that user. once, it was my mother.*

No tally line beneath it.

### Core: eclipse

*who:* `me. every day, for years.`

1. a personal agent that runs continuously on a server and is reachable wherever i already am, over whatsapp or telegram. it holds memory across every conversation rather than starting fresh each time, which is the single thing that decides whether an assistant becomes useful or gets abandoned.
2. it reads my mail, my recovery and sleep from whoop, my activity from strava, and my orders, so it has the context without being told it. a separate orchestrating agent decides what to actually do with a request, and codex handles the work that is really code.
3. i have rebuilt it five times over several years. each rewrite kept the same question and threw away the answer.

*lineage:*

| | | |
|---|---|---|
| 01 | jarvis v0 | the first attempt. scripted commands, no memory, and it forgot everything the moment it closed. it taught me the problem was never the interface. |
| 02 | eclipse | enhanced cognitive linguistic interactive personal support engine. python, nlp and mysql. the first version with a real store behind it, and the first that could answer a question about last week. |
| 03 | eclipse obsidian | moved onto a vps behind a custom pwa, running on cerebras at roughly three thousand tokens a second. a github hook ingested my obsidian journal every night at 2am, so my second brain and the agent were finally the same thing. |
| 04 | eclipsn | rebuilt around a knowledge graph instead of a flat store, with gmail and whoop feeding it. the graph made connections between things i had never explicitly linked. |
| 05 | eclipse | the current one. always on, reachable over whatsapp and telegram, with an orchestrating agent above it and a memory layer underneath. |

### an audience of one

**glai** · *my mother.* · demo · `react native · expo · openai · sqlite` · on testflight
Summary: photo based meal logging with nutrition analysis, built for her diabetes management.
1. every diabetes app assumes you will weigh your food and look up each ingredient. she was never going to do that, and neither would i.
2. so it takes a photograph. one pass identifies the dishes, a second estimates weights and nutrition ranges. ranges rather than fake precision, because a photograph cannot tell you grams.
3. everything stays on the device. sync is optional and off by default. a health record for one person did not need a backend.

**photocortex** · *me, and eleven years of photographs.* · demo · `computer vision · python` · fully local
Summary: face, object, scene and text detection across a personal photo library.
1. google photos is genuinely excellent and the price is handing over every photograph you have ever taken.
2. this runs the same class of analysis locally, so the library becomes searchable by what is in it rather than only by when it was taken.
3. it is slower than the cloud version and always will be. that is the trade, stated plainly.

**room** · *me, at one in the morning.* · `typescript · expo · ios · wiz api · ir`
Summary: one native ios interface for my whole room. lights, the ac, and everything behind the ir blaster.
1. three apps, two remotes, and a four second cold start to switch off a light or drop the ac two degrees. the hardware was fine. the software between me and the hardware was the problem.
2. wiz bulbs speak a simple protocol on the local network, so talking to them directly skips the round trip to a cloud service entirely. the ir blaster covers the ac and everything else older than wifi, so one interface reaches the whole room.
3. one screen, one tap, no account. the smallest useful thing i have built, and the one i use most.

**stock portfolio tracker** · *me, and three brokerage accounts.* · `next.js · typescript · yahoo finance api`
Summary: a real time tracker pulling several kite accounts into a single view.
1. holdings split across accounts means no single screen shows what you actually own, so you do the arithmetic in your head and get it wrong.
2. this fetches all of them and shows one position list with live prices. no advice, no charts, no engagement mechanics.
3. it is deliberately boring. that is why it still gets opened.

### an audience of someone else

**shit** · *every student who has lost track of their attendance.* · demo · `react native · expo · typescript · mmkv` · live at shitsort.com
Summary: timetable management and attendance tracking, entirely on device.
1. the college portal tells you your attendance percentage but not the thing everyone actually wants to know, which is how many more classes you can afford to miss.
2. so it computes that directly, per subject and combined, and lets you correct a wrong record with a long press instead of an email to an administrator.
3. nothing leaves the phone. an attendance record is not worth a server, an account system, or a privacy policy, and a student should not have to trust one.

**billinsight** · *a client, and a camera roll full of receipts.* · `expo · fastapi · neon postgres · tflite` · private repositories
Summary: an ai invoice and expense pipeline with a durable server behind it.
1. uploading an entire camera roll to find the receipts in it is expensive, slow, and a privacy problem you then have to explain to a client.
2. so a mobilenetv3 classifier runs on the device and filters first. only likely receipts are sent up, which cuts the bill and means holiday photos never leave the phone.
3. behind it sits the unglamorous half: idempotent uploads, job claims, backoff retries, background reconciliation, and observability with the personal data scrubbed out. that is what makes it survive real users.

**sih-bel chatbot** · *a technician holding an unfamiliar part.* · `yolov8 · llama 3.1 · python · flask`
Summary: detection and language together, identifying a component and finding its documentation.
1. you have to identify a component before you can look anything up, and the identifying marks are often worn away or facing the wrong direction.
2. yolov8 handles recognition, llama 3.1 handles the conversation, and the answer is grounded in bharat electronics own manuals rather than invented.
3. the constraint that shaped it: a confident wrong answer about a defence component is far worse than admitting uncertainty.

**imagenerve** · *a wedding party, and two thousand photographs.* · `react native · expo · fastapi`
Summary: face recognition across an event so you get only the photos you are in.
1. after any large event there is a shared drive with two thousand photographs in it, and finding the eleven you appear in means scrolling all two thousand.
2. one scan returns only yours. the recognition is the easy part now; the useful part is framing it around a person rather than an album.
3. built after a wedding, for the obvious reason.

### sometimes the question was enough

**hft backtesting engine** · *how much of the latency story is real?* · `rust · backtesting` · runs on a macbook
Summary: a high frequency backtester for gold against the dollar, written in rust.
1. backtesting at tick resolution is where a personal project usually dies. the naive version takes hours per run, so you stop iterating, so you stop learning anything.
2. rust turned it into something i could run between edits. the point was never a profitable strategy.
3. scoped to one instrument on purpose. gold against the dollar is volatile enough to be interesting and liquid enough that the fills are not fiction.

**fulcrum** · *can a model explain why it doubts a company?* · `next.js · fastapi · gemini · ml`
Summary: annual report in, structured credit risk memo out, streamed as it is written.
1. indian credit underwriting still runs on an analyst reading a pdf and typing ratios into a spreadsheet. it is slow, inconsistent, and the reasoning evaporates the moment it is finished.
2. this pulls around 25 financial fields from any annual report, computes tier 1a ratios, then runs two models trained on a cohort of wilful defaulters against matched controls.
3. the output is a memo, not a score. a number nobody can interrogate is worse than no number.

**kochi metro sih** · *where should a fleet sleep?* · `python · operations research`
Summary: depot stabling and turnout order, balancing four competing objectives.
1. every night a metro depot decides where each train parks and in what order they leave. get it wrong and you are shunting trains at four in the morning.
2. certificates and maintenance windows constrain what can run at all. branding contracts want particular trains on particular lines. mileage wants to stay even so nothing wears out first.
3. real constraints and no clean optimum, which is exactly why it was worth doing.

**alphafold nano** · *what is the pipeline actually doing?* · `python · pytorch · streamlit`
Summary: a compact reimplementation of alphafold's data preparation, plus reinforcement learning.
1. reading the alphafold paper and understanding it turned out to be different activities, and the gap between them was code.
2. so this rebuilds the data preparation pipeline at a scale that fits on one machine, with a dashboard comparing its toy inferences against real traces.
3. it does not fold proteins competitively and never intended to. it answers a narrower question.

**ace + rl agent** · *can an agent notice its own bad habits?* · `python · reinforcement learning`
Summary: a terminal first agent that plans, executes, validates, reflects, then adjusts.
1. most agent frameworks fix the strategy at design time. when it fails it fails the same way forever, and you are the one who has to notice.
2. this keeps a lightweight reinforcement learning bandit over its own approaches, so tactics that keep working get chosen more often.
3. a small idea tested honestly rather than a framework. the interesting result was how fast it learned to stop doing the thing that never worked.

## Accessibility

- The entry name is a link. The disclosure is a real `<button>` with `aria-expanded` and
  `aria-controls` pointing at the panel's id. Do not wrap a heading in a button; it
  flattens the structure for screen readers.
- The `✕` needs `aria-label="Close"`.
- The preview button needs `aria-label="Play <name> demo"`.
- Focus rings in `--red`, `outline-offset: 3px`.
- Under `prefers-reduced-motion: reduce`, drop every transition and make the section
  headers static rather than sticky.
- Hover must never be the only route to the detail. The button covers keyboard and touch.

## Verification

1. Hovering an entry moves nothing else on the page. Measure a neighbour's
   `getBoundingClientRect().top` before and after. Dispatch `mouseover`, not `mouseenter`;
   React synthesises `onMouseEnter` from delegated `mouseover` and a raw `mouseenter`
   fires nothing, giving a false pass.
2. A cursor swept quickly across the grid opens nothing.
3. Opening a panel then scrolling closes it.
4. All three previews show a real frame, not black. Check at 92x52, not full size.
5. Keyboard alone: tab to an entry, open with the button, `aria-expanded` flips, `Escape`
   closes, focus is not stranded.
6. At 375px: no horizontal overflow, every project separated by a visible 2px rule, the
   number inline and red, the panel expanding in flow.
7. `npm test` still passes and `/` still builds as static with ISR.
8. Grep for em dashes across `src/` and remove any found.

## Out of scope

The hero, the philosophy section, the build log, the `/demo/[id]` route, and the visitor
counter, which still needs a Vercel KV store provisioned before it can be built.
