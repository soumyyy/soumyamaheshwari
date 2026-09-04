# Homepage Interactivity Redesign

Date: 2026-09-04
Status: approved, pending implementation plan

## Problem

The site is well built but reads as AI-generated. The tells are specific and
enumerable: a `Hello.` fade into a typewriter into a 5-second auto-scroll; the
`text-xs uppercase tracking-widest text-neutral-500` label pattern; the
black + `neutral-900` + film-grain-at-0.028 + three-radial-blobs recipe; Space
Grotesk; a decorative satellite connected to nothing; and copy that would fit on
any developer's site.

The governing principle for every decision below:

> Decorative interactivity reads as AI. Load-bearing interactivity reads as human.

Anything that moves but does nothing is a template. Anything that does real work
cannot be faked.

## Audience

Both recruiters skimming for 40 seconds and peers evaluating craft. This rules
out any single-mechanic homepage: the page must be linearly skimmable, with
depth available but never mandatory. No content is ever gated behind a timer or
an interaction.

## Decisions locked

| Decision | Value |
|---|---|
| Display face | Zodiak (Fontshare, free commercial) |
| Body face | Instrument Sans Variable (OFL) |
| Mono face | Commit Mono (OFL) |
| Font delivery | Self-hosted via `next/font`, not CDN |
| Prose case | lowercase throughout |
| Labels | small caps, replacing all uppercase+tracking |
| Hero motion | Cursor-as-gravity-well orbital sim (approach A) |
| Hermes on site | Out of scope |
| Scope | Full homepage restructure |
| Copy | Drafted here, user edits |
| Hero shape | Layered (name / role / range / tail), not one sentence |
| Location | Mumbai, India, with live local time |
| Role line | agentic systems · product builder |
| Aesthetic pivot | Rejected — dark editorial system stays; warmth comes from real artifacts |

Removed: typewriter sequence, `Hello.` reveal, 5s auto-scroll, soumysphere
background text, Space Grotesk, `src/app/type/` (specimen), the two `* 2.tsx`
duplicates (already deleted).

## Architecture

### Font layer — `src/app/layout.tsx`, `src/app/globals.css`

Add `@fontsource-variable/instrument-sans` and `@fontsource/commit-mono` as
dependencies. Zodiak has no npm package; its woff2 (400 + 400 italic) goes in
`public/fonts/` behind `next/font/local`.

All three exposed as CSS variables on `<html>`:

    --font-display  Zodiak
    --font-body     Instrument Sans Variable
    --font-mono     Commit Mono

Body defaults to `--font-body`. Space Grotesk import deleted.

One new utility in `globals.css`:

    .label {
      font-family: var(--font-mono);
      font-variant-caps: small-caps;
      text-transform: lowercase;
      letter-spacing: 0.06em;
    }

This replaces every `text-xs uppercase tracking-widest` occurrence
(~12 sites across `page.tsx` and `ProjectCard.tsx`).

Note: none of these families ship an `smcp` table, so the browser synthesises
small caps by scaling capitals. This is standard practice and still reads
distinctly better than uppercase + letter-spacing. Accepted knowingly.

### Hero — `src/components/OrbitField.tsx` (replaces `SatelliteOrbit.tsx`)

Canvas 2D, DPR-aware, sized to its containing section.

**Orbit.** Ellipse a=450 b=200, rotated -10deg, matching the current visual.
The satellite's true anomaly advances at a rate proportional to 1/r², so it
visibly accelerates through perigee and coasts through apogee. That is Kepler's
second law, and it is the thing that makes the motion read as physical rather
than as a CSS animation.

**Cursor gravity.** The cursor is a gravity well. Each sampled point on the
ellipse is displaced toward the cursor with falloff `1/(1 + d²/k²)`, clamped to
a maximum displacement and eased over ~200ms so the path bends rather than
snaps. The rendered dashed path and the satellite both use displaced
coordinates, so the orbit visibly warps as the pointer moves.

**Satellite.** `ISS.svg`, rotated to the path tangent.

**Starfield.** Retained, but seeded. The current implementation calls
`Math.random()` during render and masks the resulting hydration mismatch with a
`mounted` flag, which costs a frame and a flash. A seeded PRNG makes it
SSR-safe and lets the `mounted` guard go.

**Lifecycle.** Single `requestAnimationFrame` loop, paused by
`IntersectionObserver` when off-screen and by `visibilitychange` when the tab is
hidden.

**Reduced motion.** Under `prefers-reduced-motion: reduce`, no rAF loop at all:
a static dashed ellipse with the satellite parked at a fixed anomaly. Cursor
gravity disabled.

### Projects — `src/components/ProjectCard.tsx`

Only 3 of 18 projects have demo video (`eclipse-obsidian`, `shit`,
`photocortex`). A hover-to-play treatment applied universally would leave 15
cards looking broken, so the card branches:

- **With video:** muted, looping, `playsInline` autoplay on hover, in place, no
  navigation. Poster frame when idle. Pauses on mouse-out.
- **Without video:** hover reveals the tech stack in mono small caps over a
  subtle background state change. Reads as a deliberate second treatment, not
  an absence.

Also fixes: `projects.ts` ids `hermes` and `eclipse` are both titled "Eclipse".
The `hermes` entry is retitled to match the section that presents it.

### Build log — `src/components/BuildLog.tsx`

React Server Component. `fetch` against
`https://api.github.com/users/soumyyy/events/public` with
`next: { revalidate: 3600 }`. Caching means the unauthenticated 60/hr limit is
never approached and no token is needed.

Renders the most recent 3 push events as
`pushed to <repo> · <relative time>` in Commit Mono.

**Failure mode:** on non-200 or network failure the component renders `null`.
The section is absent rather than showing an error — a broken widget is worse
for credibility than no widget.

### Small, high-signal

- **`now` strip.** Hand-edited `src/data/now.ts` with three fields — building,
  reading, listening — plus an `updated` date rendered in mono small caps. Sits
  between the intro and experience sections. Datedness reads as human; a stale
  `now` strip is worse than none, so the date is shown deliberately.
- **Return-visitor state.** `localStorage` visit counter, wrapped in try/catch
  (private windows and blocked site data both throw). On visit 2+, the hero
  label reads `welcome back · visit <n>` instead of its default. Nothing else
  changes, and the page must render correctly when the counter is absent or the
  accessor throws.
- **One easter egg.** The Konami sequence puts `OrbitField` into a high-energy
  state: orbital period drops ~4x, the satellite draws a decaying trail, and the
  starfield density triples. Reverts on any subsequent keypress. Reuses the
  existing canvas, adds no new component, and is skipped entirely under
  `prefers-reduced-motion`. Deliberately undocumented on the page.

## Copy draft

To be edited by Soumya. Written to be unusable on anyone else's site — that is
the whole point, and the reason a draft is only a starting position.

### Hero — FINAL

Layered, not one sentence. This was the breakthrough: several attempts failed
because identity, range and humility were being crammed into a single line. The
reference (jackiezhang.co.za) layers them instead — name, role, thesis, location
— and each piece does one job.

    [mono, small caps, neutral-500]
    soumya maheshwari

    [mono, small caps, neutral-600]
    agentic systems · product builder
    mumbai, india · <live local time>

    [Zodiak, ~5rem, lowercase, white]
    agents, trading engines, ios apps, infra and saas.

    [Instrument Sans, ~1.25rem, neutral-400]
    i start building because i'm curious and stop when it works.

The hierarchy inverts the usual move deliberately: **the range is set large, the
humility is set quiet.** Big brag, small voice reads as confident. The reverse
would read as insecure.

Present in the SSR payload — no reveal, no typewriter, no timer.

The closing line is Soumya's own, in the humble register he asked for: it makes
no claim a reader can audit, which lets the projects grid do the proving on its
own. "saas" is now evidenced by BillInsight (Clerk auth, Neon Postgres, durable
job pipeline, Sentry/Grafana observability) — the earlier objection to that word
is resolved.

Casing: `saas` lowercase, consistent with the system.

### Intro

> i'm soumya. i spent two years in founders' offices at a fintech and a
> healthtech startup, translating what the business needed into what the
> engineers built. somewhere in there i got tired of writing the spec and
> handing it over.
>
> now most of my energy goes into agents, ai tooling, and prototypes that take a
> weekend. i'm a compulsive tinkerer — cloud, infra, webdev, ios, ml, whatever
> the thing needs. i mostly want to know how it works.

### Section labels

`intro` · `experience` · `selected work` · `side projects` · `client work`

### Projects intro

Replacing "A collection of experiments, agents, and side-projects":

> curiosity is the only through-line here. everything else is a side effect.

Placement is deliberate. This sits immediately above the grid, which is the
first point where a reader confronts eighteen unrelated projects and might read
the range as a lack of focus. The line preempts that reading, and "side effect"
lands directly above the "side projects" heading.

The existing "view the primitive tech that got me here" toggle copy is already
good and human. Keep it.

### Philosophy section — `DotGrid.tsx`

The four cycling phrases are the weakest copy on the site:

    'think different'
    'think bigger'
    'skip the perfect plan. start. adjust. repeat'
    'build, break, outgrow. then do it again'

`think different` is Apple's trademarked slogan. The other three are generic
motivational filler. This is the emotional climax of the page and currently the
most templated thing on it.

**Direction:** replace the four slogans with four *true, specific facts*. The
inversion is the point — a motivational-poster component that refuses to be
motivational and states plain facts instead is distinctive in a way no slogan
can be. Candidate material already in the repo:

- a github hook ingests my journal at 2am
- a rust backtester, on a macbook, because why not
- built for my mom
- five attempts at the same agent

Soumya writes the final four; the direction is what matters here.

### Glai

`glai`'s `longDescription` contains "built for my mom's diabetes management" —
the most human detail in the repo, currently buried where nobody reads it. Pull
it into the card's visible description.

### Footer

Replacing "Got something cool to build?":

1. *"building something strange? i'd like to hear about it."* — recommended
2. *"if it's weird and half-broken, that's usually my favourite kind of project."*

### Metadata

`layout.tsx` description, replacing "AI Engineer & Builder. I build cool stuff,
break them, fix them along the way.":

> agentic systems and product building — agents, trading engines, ios apps,
> infra and saas.

**Superseded note:** an earlier draft here read "i build personal ai agents, and
i've rewritten mine five times." That belonged to the agent-lineage hero, which
was rejected for making the site about one project. The description must track
the final hero, not the abandoned one.

Note on voice: the `eclipsn` entry in `projects.ts` already contains the best
line on the site — admitting Peter Steinberger shipped OpenClaw faster. That
self-aware specificity is exactly the register the rest of the copy should
match, and it is worth more than any animation in this document.

## Making it personal

Explicitly NOT an aesthetic pivot. Soumya rejected moving to a warm, illustrated,
handmade direction and wants the dark editorial system to feel personal instead.

The reference's warmth comes from visible human labour — someone drew those
illustrations. That cannot be installed, and generating doodles neither of us
drew would be precisely the failure mode this whole redesign exists to avoid.
So the warmth has to come from real artifacts and real specifics:

1. **A real signature.** Soumya writes his name once; it is traced to SVG and
   set as a white stroke above the hero. This is the single highest-leverage
   personal element available — it is genuine evidence of a human hand, costs
   one afternoon, and requires no change to the visual system. Requires Soumya
   to actually produce it.
2. **Live local time.** `mumbai, india · 11:47 pm`, ticking, client-side after
   hydration with a static server fallback to avoid a mismatch. Real data about
   a real person in a real place.
3. **A photograph.** One honest, non-corporate photo. Nothing establishes a
   person faster, and a dark editorial layout carries a single image well.
   Optional — Soumya's call.
4. **People in the copy.** Glai is "built for my mom's diabetes management."
   Room exists because "the stock apps are slow and fragmented." These already
   exist in `projects.ts` and are simply buried.
5. **The `now` strip** (already specified above).

### Observation worth surfacing somewhere

Six projects — Glai (his mom), Room (his bulbs), Eclipse (himself),
StockPortfolio (his Kite accounts), SHIT (his timetable), PhotoCortex (his
photos) — have exactly one user. That is a stance, not a coincidence, and the
grid proves it without any assertion needed. Candidate framing for the projects
section if the current intro line ever needs replacing:

> most of my software has one user.

Not adopted; recorded because it is true and unusually specific.

## Verification

Type check and lint must pass. Beyond that, each claim in this spec is checked
against the running site, not assumed:

1. **Fonts.** `document.fonts` reports Zodiak, Instrument Sans Variable and
   Commit Mono `loaded` — confirming self-hosting works and nothing silently
   falls back to a system face.
2. **No timed gating.** Hero text present in the SSR HTML payload, verified by
   reading the response body before any JS executes.
3. **Reduced motion.** Under an emulated `prefers-reduced-motion: reduce`, no
   rAF loop is scheduled.
4. **Orbit.** Cursor movement measurably displaces the rendered path.
5. **Build log.** Renders live events; and renders `null` rather than throwing
   when the fetch is forced to fail.
6. **Return visitor.** Page renders correctly with `localStorage` throwing.
7. **Dead patterns gone.** `grep` for `uppercase tracking-widest`, `Space
   Grotesk`, `soumysphere`, and the typewriter state returns nothing.
8. **Responsive.** No horizontal body scroll at 375px.

## Out of scope

Hermes on the site (explicitly cut — revisit separately), the soumysphere
spatial canvas, the blog (route exists, stays dormant), `BrainSection.tsx`
(stays commented out), and any change to `/demo/[id]`.
