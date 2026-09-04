# Homepage Interactivity Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage so it reads as made by a person — new typeface system, a layered hero with no timed reveals, a cursor-driven orbital simulation, live data, and rewritten copy.

**Architecture:** Pure logic (orbit math, time formatting, GitHub event parsing) lives in `src/lib/` behind unit tests. Components stay thin and consume those functions. `page.tsx` is rewritten rather than patched. One new client component owns the canvas; one new server component owns the live GitHub fetch.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19.2, Tailwind v4, framer-motion 12, Vitest (new).

**Spec:** `docs/superpowers/specs/2026-09-04-homepage-interactivity-redesign-design.md`

## Global Constraints

- **Typefaces:** Zodiak (display, self-hosted), Instrument Sans Variable (body), Commit Mono (mono). No CDN font links in shipped code.
- **Case:** all prose and headings lowercase. Labels use `.label` (small caps). The string `saas` is lowercase — never `SaaS`.
- **No timed gating:** no content may be hidden behind a `setTimeout`, typewriter, or scroll trigger. Hero text must be in the SSR payload.
- **Reduced motion:** every animation must check `prefers-reduced-motion: reduce` and degrade to a static state with no `requestAnimationFrame` loop scheduled.
- **Deleted for good:** typewriter sequence, `Hello.` reveal, 5s auto-scroll, `soumysphere` background text, Space Grotesk, `SatelliteOrbit.tsx`, `src/app/type/`.
- **Storage:** every `localStorage` access wrapped in try/catch; the page must render correctly when it throws or returns nothing.
- **Commit style:** end every commit message with the Co-Authored-By and Claude-Session trailers already used in this repo's history.
- **Lint gate (controller ruling):** `npm run lint` FAILS on the base commit with 20 pre-existing errors in files this plan never touches. Never run a whole-repo lint gate and never "fix" unrelated files. Gate on `npx eslint <only the files you changed>` — that must be clean.

## File Structure

**Create:**
- `src/lib/orbit.ts` — pure orbital math + seeded PRNG. No DOM.
- `src/lib/time.ts` — Mumbai clock formatting + relative time. No DOM.
- `src/lib/github.ts` — GitHub events response → typed push events. No fetch.
- `src/lib/__tests__/orbit.test.ts`, `time.test.ts`, `github.test.ts`
- `src/components/OrbitField.tsx` — canvas client component (replaces `SatelliteOrbit.tsx`)
- `src/components/LocalTime.tsx` — SSR-safe ticking clock
- `src/components/BuildLog.tsx` — React Server Component, live GitHub data
- `src/components/NowStrip.tsx` — reads `src/data/now.ts`
- `src/components/Portrait.tsx` — masked portrait
- `src/data/now.ts` — hand-edited current state
- `public/fonts/*.woff2` — Zodiak
- `public/soumya.png` — resized portrait
- `vitest.config.ts`

**Modify:**
- `src/app/layout.tsx` — font wiring, metadata
- `src/app/globals.css` — tokens, `.label`, remove Space Grotesk
- `src/app/page.tsx` — full rewrite of hero + section copy
- `src/components/ProjectCard.tsx` — two treatments, `.label` sweep
- `src/components/DotGrid.tsx` — replace slogan copy
- `src/data/projects.ts` — Glai description, duplicate title fix
- `package.json` — deps + `test` script

**Delete:**
- `src/components/SatelliteOrbit.tsx`
- `src/app/type/page.tsx` (throwaway specimen)

---

### Task 1: Test harness

**Files:**
- Create: `vitest.config.ts`, `src/lib/orbit.ts`, `src/lib/__tests__/orbit.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing
- Produces: `mulberry32(seed: number): () => number` — deterministic PRNG in [0,1). Used by Task 3.

The project has no test infrastructure. Add Vitest and prove it runs with the smallest real function in the system. Only pure logic gets unit tests; canvas rendering and layout are verified in the browser in Task 15.

- [ ] **Step 1: Install Vitest**

```bash
npm i -D vitest
```

- [ ] **Step 2: Add config and test script**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
    test: { environment: "node", include: ["src/**/*.test.ts"] },
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 3: Write the failing test**

Create `src/lib/__tests__/orbit.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { mulberry32 } from "@/lib/orbit";

describe("mulberry32", () => {
    it("is deterministic for a given seed", () => {
        const a = mulberry32(42);
        const b = mulberry32(42);
        expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    });

    it("returns values in [0, 1)", () => {
        const rand = mulberry32(7);
        for (let i = 0; i < 200; i++) {
            const v = rand();
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(1);
        }
    });

    it("gives different sequences for different seeds", () => {
        expect(mulberry32(1)()).not.toEqual(mulberry32(2)());
    });
});
```

- [ ] **Step 4: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/orbit`.

- [ ] **Step 5: Implement**

Create `src/lib/orbit.ts`:

```ts
/** Deterministic PRNG. Seeded so star positions are identical on server and client. */
export function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
```

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: PASS, 3 tests.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/orbit.ts src/lib/__tests__/orbit.test.ts
git commit -m "$(cat <<'EOF'
Add Vitest and seeded PRNG

The project had no test infrastructure. Vitest covers pure logic only;
canvas and layout behaviour is verified in the browser.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 2: Font system

**Files:**
- Create: `public/fonts/` (Zodiak woff2 files)
- Modify: `src/app/layout.tsx`, `src/app/globals.css`, `package.json`

**Interfaces:**
- Consumes: nothing
- Produces: CSS variables `--font-display`, `--font-body`, `--font-mono` on `<html>`; the `.label` utility class. Every later task uses these.

Fontshare serves Zodiak from rotating hashed URLs, so extract them at implementation time rather than hardcoding.

- [ ] **Step 1: Install body and mono faces**

```bash
npm i @fontsource-variable/instrument-sans @fontsource/commit-mono
```

- [ ] **Step 2: Download Zodiak**

```bash
mkdir -p public/fonts
curl -s "https://api.fontshare.com/v2/css?f%5B%5D=zodiak@400,401&display=swap" \
  | grep -oE "//cdn\.fontshare\.com[^']*\.woff2" | sed 's|^|https:|' | sort -u > /tmp/zodiak-urls.txt
i=0; while read -r u; do i=$((i+1)); curl -s -o "public/fonts/zodiak-$i.woff2" "$u"; done < /tmp/zodiak-urls.txt
file public/fonts/*.woff2
```

Expected: each file reports `Web Open Font Format (Version 2)`. Three files: latin, latin-ext, and italic. Open `/tmp/zodiak-urls.txt` against the CSS to see which `font-style` each URL belonged to, and rename the italic one to `zodiak-italic.woff2` and the primary latin one to `zodiak-regular.woff2`. Delete any you do not wire up.

- [ ] **Step 3: Wire fonts in layout**

Replace the whole of `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@fontsource-variable/instrument-sans';
import '@fontsource/commit-mono';
import './globals.css';

const zodiak = localFont({
    src: [
        { path: '../../public/fonts/zodiak-regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/zodiak-italic.woff2', weight: '400', style: 'italic' },
    ],
    variable: '--font-display',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Soumya Maheshwari',
    description:
        'agentic systems and product building — agents, trading engines, ios apps, infra and saas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`dark ${zodiak.variable}`}>
            <body>{children}</body>
        </html>
    );
}
```

- [ ] **Step 4: Add tokens and the label utility**

In `src/app/globals.css`, replace the `body` rule's `font-family` line and add to `:root`:

```css
:root {
    --background: #000000;
    --foreground: #ffffff;
    --accent: #555555;
    --visited: #999999;
    --font-body: 'Instrument Sans Variable', system-ui, sans-serif;
    --font-mono: 'Commit Mono', ui-monospace, monospace;
    /* --font-display is injected by next/font in layout.tsx */
}

body {
    font-family: var(--font-body);
}
```

Then add inside `@layer utilities`:

```css
.label {
    font-family: var(--font-mono);
    font-variant-caps: small-caps;
    text-transform: lowercase;
    letter-spacing: 0.06em;
}

.font-display {
    font-family: var(--font-display), Georgia, serif;
}

.font-mono {
    font-family: var(--font-mono);
}
```

- [ ] **Step 5: Verify the fonts actually load**

Start the dev server, then in the browser console on `http://localhost:3000`:

```js
await document.fonts.ready;
const fams = new Set();
document.fonts.forEach(f => { if (f.status === 'loaded') fams.add(f.family.replace(/['"]/g,'')); });
[...fams];
```

Expected: includes a Zodiak-derived family, `Instrument Sans Variable`, and `Commit Mono`. Must NOT include `Space Grotesk`.

- [ ] **Step 6: Confirm Space Grotesk is gone**

Run: `grep -rn "Space_Grotesk\|Space Grotesk" src/`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json public/fonts src/app/layout.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
Replace Space Grotesk with Zodiak / Instrument Sans / Commit Mono

Self-hosted via next/font so there is no third-party request and no
swap flash. Adds the .label small-caps utility that replaces the
uppercase+tracking label pattern.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 3: Orbital math

**Files:**
- Modify: `src/lib/orbit.ts`, `src/lib/__tests__/orbit.test.ts`

**Interfaces:**
- Consumes: `mulberry32` from Task 1
- Produces:
  - `ellipsePoint(a: number, b: number, theta: number): {x: number, y: number}`
  - `radiusAt(a: number, b: number, theta: number): number`
  - `keplerStep(theta: number, a: number, b: number, dt: number, k: number): number`
  - `gravityDisplace(p: {x,y}, cursor: {x,y} | null, strength: number, radius: number): {x,y}`
  - `makeStars(count: number, seed: number): {x: number, y: number, r: number, o: number}[]`

Kepler's second law is what makes the motion read as physical rather than as a CSS animation: the satellite must sweep equal areas in equal time, so angular velocity scales as `1/r²`.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/__tests__/orbit.test.ts`:

```ts
import { ellipsePoint, radiusAt, keplerStep, gravityDisplace, makeStars } from "@/lib/orbit";

describe("ellipsePoint", () => {
    it("is at (a, 0) for theta = 0", () => {
        const p = ellipsePoint(450, 200, 0);
        expect(p.x).toBeCloseTo(450);
        expect(p.y).toBeCloseTo(0);
    });

    it("is at (0, b) for theta = PI/2", () => {
        const p = ellipsePoint(450, 200, Math.PI / 2);
        expect(p.x).toBeCloseTo(0);
        expect(p.y).toBeCloseTo(200);
    });
});

describe("keplerStep", () => {
    it("advances faster at perigee than at apogee", () => {
        // For a=450 b=200, radius is smallest at theta=PI/2 (r=200, perigee)
        // and largest at theta=0 (r=450, apogee).
        const atPerigee = keplerStep(Math.PI / 2, 450, 200, 0.016, 1) - Math.PI / 2;
        const atApogee = keplerStep(0, 450, 200, 0.016, 1) - 0;
        expect(atPerigee).toBeGreaterThan(atApogee);
    });

    it("always advances forward", () => {
        let theta = 0;
        for (let i = 0; i < 50; i++) {
            const next = keplerStep(theta, 450, 200, 0.016, 1);
            expect(next).toBeGreaterThan(theta);
            theta = next;
        }
    });
});

describe("gravityDisplace", () => {
    it("returns the point unchanged when there is no cursor", () => {
        const p = { x: 100, y: 100 };
        expect(gravityDisplace(p, null, 60, 300)).toEqual(p);
    });

    it("pulls the point toward the cursor", () => {
        const moved = gravityDisplace({ x: 0, y: 0 }, { x: 100, y: 0 }, 60, 300);
        expect(moved.x).toBeGreaterThan(0);
        expect(moved.x).toBeLessThanOrEqual(60);
    });

    it("falls off with distance", () => {
        const near = gravityDisplace({ x: 0, y: 0 }, { x: 50, y: 0 }, 60, 300);
        const far = gravityDisplace({ x: 0, y: 0 }, { x: 2000, y: 0 }, 60, 300);
        expect(near.x).toBeGreaterThan(far.x);
    });

    it("never displaces further than strength", () => {
        const m = gravityDisplace({ x: 0, y: 0 }, { x: 1, y: 1 }, 60, 300);
        expect(Math.hypot(m.x, m.y)).toBeLessThanOrEqual(60 + 1e-9);
    });
});

describe("makeStars", () => {
    it("is deterministic for a seed", () => {
        expect(makeStars(20, 5)).toEqual(makeStars(20, 5));
    });

    it("produces the requested count within bounds", () => {
        const stars = makeStars(30, 1);
        expect(stars).toHaveLength(30);
        for (const s of stars) {
            expect(s.x).toBeGreaterThanOrEqual(0);
            expect(s.x).toBeLessThanOrEqual(1);
            expect(s.y).toBeGreaterThanOrEqual(0);
            expect(s.y).toBeLessThanOrEqual(1);
        }
    });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test`
Expected: FAIL — the new exports do not exist.

- [ ] **Step 3: Implement**

Append to `src/lib/orbit.ts`:

```ts
export type Point = { x: number; y: number };

/** Point on an ellipse centred at the origin. */
export function ellipsePoint(a: number, b: number, theta: number): Point {
    return { x: a * Math.cos(theta), y: b * Math.sin(theta) };
}

/** Distance from centre to the ellipse at this angle. */
export function radiusAt(a: number, b: number, theta: number): number {
    const p = ellipsePoint(a, b, theta);
    return Math.hypot(p.x, p.y);
}

/**
 * Advance the orbital angle by dt, sweeping equal areas in equal time.
 * Angular velocity scales as 1/r², so the satellite visibly accelerates
 * where the orbit is tight and coasts where it is wide.
 */
export function keplerStep(theta: number, a: number, b: number, dt: number, k: number): number {
    const r = radiusAt(a, b, theta);
    const scale = (a * b) / (r * r);
    return theta + k * scale * dt;
}

/**
 * Pull a point toward the cursor. Falloff is 1/(1 + d²/radius²), so nearby
 * points bend hard and distant ones barely move. Displacement is capped at
 * `strength` so the path warps without ever collapsing onto the pointer.
 */
export function gravityDisplace(
    p: Point,
    cursor: Point | null,
    strength: number,
    radius: number,
): Point {
    if (!cursor) return p;
    const dx = cursor.x - p.x;
    const dy = cursor.y - p.y;
    const d = Math.hypot(dx, dy);
    if (d < 1e-6) return p;
    const falloff = 1 / (1 + (d * d) / (radius * radius));
    const pull = Math.min(strength * falloff, d);
    return { x: p.x + (dx / d) * pull, y: p.y + (dy / d) * pull };
}

/** Star positions in normalised [0,1] space. Seeded so SSR and client agree. */
export function makeStars(count: number, seed: number) {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, () => ({
        x: rand(),
        y: rand(),
        r: rand() * 1.4 + 0.5,
        o: rand() * 0.45 + 0.2,
    }));
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS, all orbit tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/orbit.ts src/lib/__tests__/orbit.test.ts
git commit -m "$(cat <<'EOF'
Add orbital math with Kepler's second law

Angular velocity scales as 1/r² so the satellite accelerates through
perigee — the detail that makes the motion read as physics rather than
as a CSS animation. Cursor gravity uses inverse-square falloff with a
hard displacement cap.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 4: OrbitField canvas

**Files:**
- Create: `src/components/OrbitField.tsx`
- Delete: `src/components/SatelliteOrbit.tsx`
- Modify: `src/app/page.tsx` (swap the import only — the hero rewrite is Task 7)

**Interfaces:**
- Consumes: `ellipsePoint`, `keplerStep`, `gravityDisplace`, `makeStars` from Task 3
- Produces: `<OrbitField />` — a self-contained absolutely-positioned canvas layer. No props.

The existing `SatelliteOrbit.tsx` calls `Math.random()` during render and masks the resulting hydration mismatch with a `mounted` flag. The seeded PRNG removes the need for that guard entirely.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { ellipsePoint, keplerStep, gravityDisplace, makeStars, type Point } from "@/lib/orbit";

const ROTATION = (-10 * Math.PI) / 180;
const STARS = makeStars(28, 20260904);
const SAMPLES = 220;
const PULL_STRENGTH = 70;
const PULL_RADIUS = 320;

export default function OrbitField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursor = useRef<Point | null>(null);
    const eased = useRef<Point | null>(null);
    const theta = useRef(0);
    const raf = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const iss = new Image();
        iss.src = "/ISS.svg";

        let w = 0;
        let h = 0;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        /** Local ellipse space -> screen space. */
        const toScreen = (p: Point): Point => ({
            x: w / 2 + (p.x * Math.cos(ROTATION) - p.y * Math.sin(ROTATION)),
            y: h / 2 + (p.x * Math.sin(ROTATION) + p.y * Math.cos(ROTATION)),
        });

        const draw = () => {
            const a = w * 0.42;
            const b = h * 0.3;
            const c = eased.current;

            ctx.clearRect(0, 0, w, h);

            // starfield
            ctx.save();
            for (const s of STARS) {
                ctx.globalAlpha = s.o;
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // warped orbit path
            ctx.save();
            ctx.strokeStyle = "rgba(160,160,160,0.5)";
            ctx.lineWidth = 0.6;
            ctx.setLineDash([10, 20]);
            ctx.beginPath();
            for (let i = 0; i <= SAMPLES; i++) {
                const t = (i / SAMPLES) * Math.PI * 2;
                const p = gravityDisplace(toScreen(ellipsePoint(a, b, t)), c, PULL_STRENGTH, PULL_RADIUS);
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

            // satellite, oriented to the (warped) path tangent
            const here = gravityDisplace(toScreen(ellipsePoint(a, b, theta.current)), c, PULL_STRENGTH, PULL_RADIUS);
            const ahead = gravityDisplace(
                toScreen(ellipsePoint(a, b, theta.current + 0.02)),
                c, PULL_STRENGTH, PULL_RADIUS,
            );
            const angle = Math.atan2(ahead.y - here.y, ahead.x - here.x);

            if (iss.complete && iss.naturalWidth > 0) {
                ctx.save();
                ctx.globalAlpha = 0.85;
                ctx.translate(here.x, here.y);
                ctx.rotate(angle);
                ctx.drawImage(iss, -40, -40, 80, 80);
                ctx.restore();
            }
        };

        resize();

        if (reduced) {
            // Static frame only. No rAF loop is ever scheduled.
            iss.onload = draw;
            draw();
            window.addEventListener("resize", resize);
            return () => window.removeEventListener("resize", resize);
        }

        let last = performance.now();
        let running = true;

        const frame = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            const a = w * 0.42;
            const b = h * 0.3;
            theta.current = keplerStep(theta.current, a, b, dt, 0.11) % (Math.PI * 2);

            // ease the cursor so the path bends instead of snapping
            const target = cursor.current;
            if (target) {
                eased.current = eased.current
                    ? {
                        x: eased.current.x + (target.x - eased.current.x) * 0.12,
                        y: eased.current.y + (target.y - eased.current.y) * 0.12,
                    }
                    : target;
            } else if (eased.current) {
                eased.current = null;
            }

            draw();
            if (running) raf.current = requestAnimationFrame(frame);
        };

        const start = () => {
            if (running || reduced) return;
            running = true;
            last = performance.now();
            raf.current = requestAnimationFrame(frame);
        };
        const stop = () => {
            running = false;
            if (raf.current !== null) cancelAnimationFrame(raf.current);
            raf.current = null;
        };

        const onMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            cursor.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const onLeave = () => { cursor.current = null; };
        const onVisibility = () => (document.hidden ? stop() : start());

        const io = new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? start() : stop()),
            { threshold: 0 },
        );
        io.observe(canvas);

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerleave", onLeave);
        document.addEventListener("visibilitychange", onVisibility);
        raf.current = requestAnimationFrame(frame);

        return () => {
            stop();
            io.disconnect();
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 z-0 h-full w-full pointer-events-none"
        />
    );
}
```

- [ ] **Step 2: Swap the import in `page.tsx`**

Replace `import SatelliteOrbit from "@/components/SatelliteOrbit";` with `import OrbitField from "@/components/OrbitField";`, and the `<SatelliteOrbit />` element with `<OrbitField />`.

- [ ] **Step 3: Delete the old component**

```bash
rm src/components/SatelliteOrbit.tsx
grep -rn "SatelliteOrbit" src/ || echo "clean"
```

Expected: `clean`.

- [ ] **Step 4: Verify in the browser**

With the dev server running, load `http://localhost:3000` and confirm the satellite orbits and visibly speeds up where the ellipse is tight.

Then confirm cursor gravity actually displaces the path:

```js
// Move the pointer into the hero and compare the rendered canvas before and
// after. Different pixel data proves the path is warping.
const c = document.querySelector('canvas');
const ctx = c.getContext('2d');
// Count non-transparent pixels across the WHOLE canvas — do not sample a slice.
const snap = () => {
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  let sum = 0;
  for (let i = 3; i < d.length; i += 4) sum += d[i];
  return sum;
};
const before = snap();
window.dispatchEvent(new PointerEvent('pointermove', { clientX: c.width / 4, clientY: c.height / 2 }));
await new Promise(r => setTimeout(r, 600));
Math.abs(snap() - before) > 0;
```

Expected: `true`.

**Do not sample a slice of the pixel buffer.** An earlier version of this step
read `.data.slice(0, 20000)`, which covers only the topmost rows of the canvas —
a region that sits above the ellipse and never contains orbit content. That
probe returns `false` even when the component is working perfectly.

Note also that an automated/headless browser tab may never register as visible
to Chrome, in which case native `requestAnimationFrame` is throttled and the
canvas will not advance on its own. If that happens, drive the comparison from
explicit pointer events as above rather than concluding the component is
broken.

- [ ] **Step 5: Verify reduced motion schedules no loop**

In DevTools, open the Rendering panel and set `prefers-reduced-motion: reduce`, then hard-reload and run:

```js
let count = 0;
const orig = window.requestAnimationFrame;
window.requestAnimationFrame = (cb) => { count++; return orig(cb); };
await new Promise(r => setTimeout(r, 1500));
count;
```

Expected: `0`.

- [ ] **Step 6: Typecheck and commit**

```bash
npx tsc --noEmit
git add src/components/OrbitField.tsx src/app/page.tsx
git rm src/components/SatelliteOrbit.tsx
git commit -m "$(cat <<'EOF'
Replace SatelliteOrbit with cursor-driven OrbitField

The cursor is a gravity well: the orbit path bends toward it with
inverse-square falloff and eased tracking. Seeded stars remove the
hydration mismatch the old component masked with a mounted flag.
Loop pauses off-screen and on tab hide; reduced motion draws one
static frame and never schedules rAF.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 5: Time utilities

**Files:**
- Create: `src/lib/time.ts`, `src/lib/__tests__/time.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `formatMumbaiTime(d: Date): string` — e.g. `"11:47 pm"`
  - `relativeTime(iso: string, now: Date): string` — e.g. `"3 hours ago"`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/__tests__/time.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { formatMumbaiTime, relativeTime } from "@/lib/time";

describe("formatMumbaiTime", () => {
    it("converts UTC to IST (+5:30)", () => {
        // 12:00 UTC -> 17:30 IST
        expect(formatMumbaiTime(new Date("2026-09-04T12:00:00Z"))).toBe("5:30 pm");
    });

    it("handles the midnight rollover", () => {
        // 19:00 UTC -> 00:30 IST next day
        expect(formatMumbaiTime(new Date("2026-09-04T19:00:00Z"))).toBe("12:30 am");
    });

    it("uses lowercase meridiem", () => {
        const out = formatMumbaiTime(new Date("2026-09-04T04:00:00Z"));
        expect(out).toBe(out.toLowerCase());
    });
});

describe("relativeTime", () => {
    const now = new Date("2026-09-04T12:00:00Z");

    it("reports seconds as just now", () => {
        expect(relativeTime("2026-09-04T11:59:30Z", now)).toBe("just now");
    });

    it("reports minutes", () => {
        expect(relativeTime("2026-09-04T11:45:00Z", now)).toBe("15 minutes ago");
    });

    it("singularises", () => {
        expect(relativeTime("2026-09-04T11:00:00Z", now)).toBe("1 hour ago");
    });

    it("reports hours", () => {
        expect(relativeTime("2026-09-04T09:00:00Z", now)).toBe("3 hours ago");
    });

    it("reports days", () => {
        expect(relativeTime("2026-09-01T12:00:00Z", now)).toBe("3 days ago");
    });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test`
Expected: FAIL — `@/lib/time` does not exist.

- [ ] **Step 3: Implement**

Create `src/lib/time.ts`:

```ts
/** Current wall-clock time in Mumbai, e.g. "11:47 pm". */
export function formatMumbaiTime(d: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })
        .format(d)
        .toLowerCase()
        .replace(/\s+/g, " ");
}

/** Coarse relative time. Deliberately vague past a day — precision would be noise. */
export function relativeTime(iso: string, now: Date): string {
    const secs = Math.floor((now.getTime() - new Date(iso).getTime()) / 1000);
    if (secs < 60) return "just now";

    const units: [number, string][] = [
        [60, "minute"],
        [3600, "hour"],
        [86400, "day"],
    ];

    for (let i = units.length - 1; i >= 0; i--) {
        const [size, name] = units[i];
        if (secs >= size) {
            const n = Math.floor(secs / size);
            return `${n} ${name}${n === 1 ? "" : "s"} ago`;
        }
    }
    return "just now";
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/time.ts src/lib/__tests__/time.test.ts
git commit -m "$(cat <<'EOF'
Add Mumbai clock and relative time formatting

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 6: LocalTime component

**Files:**
- Create: `src/components/LocalTime.tsx`

**Interfaces:**
- Consumes: `formatMumbaiTime` from Task 5
- Produces: `<LocalTime />` — renders `mumbai, india · 11:47 pm`, ticking each minute.

Server and client must render identical HTML on the first pass or React will log a hydration error. Render a stable placeholder on both, then fill in after mount.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useState } from "react";
import { formatMumbaiTime } from "@/lib/time";

export default function LocalTime() {
    // Identical on server and first client render — no hydration mismatch.
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const tick = () => setTime(formatMumbaiTime(new Date()));
        tick();
        const id = setInterval(tick, 30_000);
        return () => clearInterval(id);
    }, []);

    return (
        <span className="label text-neutral-600">
            mumbai, india
            <span aria-hidden={time === null}>{time ? ` · ${time}` : ""}</span>
        </span>
    );
}
```

- [ ] **Step 2: Verify no hydration error**

Load the page with the dev server running and check the browser console.
Expected: no "Hydration failed" or "Text content did not match" warnings. The location renders immediately; the time appears on the next frame.

- [ ] **Step 3: Commit**

```bash
git add src/components/LocalTime.tsx
git commit -m "$(cat <<'EOF'
Add live Mumbai local time

Renders a stable placeholder on server and first client render, then
fills in after mount, so there is no hydration mismatch.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 7: Server-component page + layered hero

**Files:**
- Create: `src/components/ExperienceItem.tsx`, `src/components/PrimitivesToggle.tsx`, `src/components/FlipLink.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `<OrbitField />` (Task 4), `<LocalTime />` (Task 6)
- Produces: `page.tsx` as a **React Server Component**. `<ExperienceItem company role date location summary bullets />` and `<PrimitivesToggle>{children}</PrimitivesToggle>` as client islands.

`page.tsx` is currently `"use client"`, which would make the RSC BuildLog in Task 11 impossible to nest. Converting the page to a server component and pushing interactivity into islands is a prerequisite, not a nicety.

- [ ] **Step 1: Extract the client islands**

Move the existing `ExperienceItem` component out of `page.tsx` into `src/components/ExperienceItem.tsx` verbatim, adding `"use client";` at the top and `export default`. Do the same for `FlipLink` into `src/components/FlipLink.tsx`.

Create `src/components/PrimitivesToggle.tsx`, which owns the `showPrimitives` state currently in `page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function PrimitivesToggle({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="pt-4">
                <button
                    onClick={() => setOpen(!open)}
                    className="label flex items-center gap-2 text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                    {open ? "hide the primitive tech" : "view the primitive tech that got me here"}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                </button>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-4 pt-4">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
```

- [ ] **Step 2: Rewrite the hero**

In `src/app/page.tsx`: delete the `"use client"` directive, all `useState`/`useEffect` imports, the `showHello`/`hideHello`/`mainText`/`showButton`/`showPrimitives` state, both `useEffect` blocks, `scrollToAbout`, the `soumysphere` background `<div>`, and the entire scroll-prompt block.

Also delete the now-unused `framer-motion` import (`motion`, `AnimatePresence`) and the `ChevronDown`/`ExternalLink` lucide imports if nothing in the file still references them — every animated element has moved into a client island, and leaving the imports behind fails `npm run lint`. Keep `ExternalLink` only if the client-work list still uses it.

Replace the hero `<section>` with:

```tsx
<section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6">
    <OrbitField />

    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-1">
            <span className="label text-neutral-500">soumya maheshwari</span>
            <span className="label text-neutral-600">agentic systems · product builder</span>
            <LocalTime />
        </div>

        <h1 className="font-display text-balance text-4xl lowercase leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            agents, trading engines, ios apps, infra and saas.
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-neutral-400 lowercase md:text-lg">
            i start building because i&rsquo;m curious and stop when it works.
        </p>
    </div>
</section>
```

Wrap the existing primitive-tech project cards in `<PrimitivesToggle>…</PrimitivesToggle>` and delete the old inline toggle button and `AnimatePresence` block.

- [ ] **Step 3: Verify the hero is in the SSR payload**

```bash
curl -s http://localhost:3000 | grep -c "agents, trading engines, ios apps, infra and saas"
```

Expected: `1` or more. This proves the text ships in the HTML with no JS-driven reveal.

- [ ] **Step 4: Confirm the removed patterns are gone**

```bash
grep -rn "soumysphere\|setShowHello\|mainContent\|scrollToAbout\|Scroll to explore" src/ || echo "clean"
```

Expected: `clean`.

- [ ] **Step 5: Typecheck and commit**

```bash
npx tsc --noEmit && npx eslint <the files you changed>
git add src/app/page.tsx src/components/ExperienceItem.tsx src/components/PrimitivesToggle.tsx src/components/FlipLink.tsx
git commit -m "$(cat <<'EOF'
Rewrite hero as layered server-rendered content

Removes the typewriter, the Hello reveal, the 5s auto-scroll and the
soumysphere text. The hero is now four layered pieces — name, role,
location, range, tail — with the range set large and the humility set
quiet. page.tsx becomes a server component; interactivity moves into
client islands so a server-side BuildLog can nest inside it.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 8: Portrait

**Files:**
- Create: `public/soumya.png`, `src/components/Portrait.tsx`
- Modify: `src/app/page.tsx` (intro section)

**Interfaces:**
- Consumes: nothing
- Produces: `<Portrait />`

Source image is 3022×2971, 8.6 MB, with alpha. Two problems to solve: the file is far too large to ship, and the background removal left a warm fringe around the hair and shoulders that would read as an accidental glow against pure black. A radial mask dissolves the cutout edge entirely, which fixes the fringe rather than hiding it.

- [ ] **Step 1: Resize**

```bash
sips --resampleWidth 1000 "/Users/soumya/.claude/uploads/060f2c85-c295-4602-815e-d3a4958f1f3b/8c578c73-image.png" \
  --out public/soumya.png
ls -lh public/soumya.png
```

Expected: well under 1 MB. `next/image` handles WebP/AVIF negotiation from here, so no manual format conversion is needed.

- [ ] **Step 2: Create the component**

```tsx
import Image from "next/image";

export default function Portrait() {
    return (
        <div className="relative w-40 md:w-full md:max-w-[220px]">
            <Image
                src="/soumya.png"
                alt="Soumya Maheshwari"
                width={1000}
                height={983}
                className="w-full select-none grayscale-[0.35] contrast-[1.05]"
                style={{
                    // Dissolves the cutout edge so the matting fringe never meets the black ground.
                    maskImage:
                        "radial-gradient(ellipse 68% 72% at 50% 42%, #000 52%, transparent 100%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 68% 72% at 50% 42%, #000 52%, transparent 100%)",
                }}
                priority={false}
            />
        </div>
    );
}
```

- [ ] **Step 3: Place it in the intro section**

The intro's left column currently holds only a sticky `intro` label and is otherwise empty — that is where the portrait goes. In `page.tsx`, replace that column's contents with:

```tsx
<div className="flex flex-col gap-8">
    <h2 className="label sticky top-24 text-neutral-500">intro</h2>
    <Portrait />
</div>
```

- [ ] **Step 4: Verify**

Load the page and confirm: the portrait's edges fade to black with no visible halo, and the layout does not shift as the image loads (`next/image` reserves the box from `width`/`height`).

- [ ] **Step 5: Commit**

```bash
git add public/soumya.png src/components/Portrait.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
Add portrait to the intro section

Resized from 8.6MB to a shippable asset. A radial mask dissolves the
background-removal fringe rather than letting it read as a halo
against the black ground.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 9: Copy rewrite and label sweep

**Files:**
- Modify: `src/app/page.tsx`, `src/components/ProjectCard.tsx`

**Interfaces:**
- Consumes: `.label` from Task 2
- Produces: no new exports.

Copy is from the spec's "Copy draft" section. Soumya may edit any line; use these as written unless he has said otherwise.

- [ ] **Step 1: Replace the intro prose**

```tsx
<div className="space-y-8 text-xl md:text-2xl font-light leading-relaxed text-neutral-200 text-balance lowercase">
    <p>
        i&rsquo;m soumya. i spent two years in founders&rsquo; offices at a fintech and a
        healthtech startup, translating what the business needed into what the engineers
        built. somewhere in there i got tired of writing the spec and handing it over.
    </p>
    <p className="text-neutral-400">
        now most of my energy goes into agents, ai tooling, and prototypes that take a
        weekend. i&rsquo;m a compulsive tinkerer — cloud, infra, webdev, ios, ml, whatever
        the thing needs. i mostly want to know how it works.
    </p>
</div>
```

- [ ] **Step 2: Replace the projects and footer copy**

Projects heading block:

```tsx
<h2 className="font-display text-5xl md:text-7xl lowercase tracking-tight text-white/80 mb-6">
    selected work
</h2>
<p className="max-w-lg mx-auto text-neutral-500 lowercase">
    curiosity is the only through-line here. everything else is a side effect.
</p>
```

Footer heading:

```tsx
<h2 className="font-display text-2xl md:text-4xl lowercase tracking-tight text-white mb-6">
    building something strange? i&rsquo;d like to hear about it.
</h2>
```

- [ ] **Step 3: Sweep every label to `.label`**

Replace all remaining `text-xs uppercase tracking-widest`, `text-sm ... uppercase tracking-wider`, and `uppercase tracking-[0.2em]` class strings in `page.tsx` and `ProjectCard.tsx` with the `label` class, lowercasing the literal text. Section headings become `intro`, `experience`, `selected work`, `side projects`, `client work`.

In `ProjectCard.tsx` the project title currently uses `tracking-widest uppercase`; change it to:

```tsx
<h3 className="label text-base md:text-lg text-white/90 leading-snug">
```

- [ ] **Step 4: Verify the pattern is gone**

```bash
grep -rn "uppercase tracking" src/ || echo "clean"
```

Expected: `clean`.

- [ ] **Step 5: Commit**

```bash
npx tsc --noEmit
git add src/app/page.tsx src/components/ProjectCard.tsx
git commit -m "$(cat <<'EOF'
Rewrite copy and replace uppercase labels with small caps

Every uppercase+tracking label becomes .label. Copy is rewritten to be
specific enough that it could not appear on anyone else's site.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 10: Project card treatments and data fixes

**Files:**
- Modify: `src/components/ProjectCard.tsx`, `src/data/projects.ts`

**Interfaces:**
- Consumes: `Project` type from `src/data/projects.ts`
- Produces: no new exports.

Only 3 of 19 projects have video, so a universal hover-to-play treatment would leave 16 cards looking broken. The card branches on `project.video`.

- [ ] **Step 1: Fix the duplicate title and surface the Glai detail**

In `src/data/projects.ts`: the entries with `id: "hermes"` and `id: "eclipse"` are both `title: "Eclipse"`. Change the `hermes` entry to `title: "Hermes"`.

Change the `glai` entry's `description` to lead with the human fact:

```ts
description: "Built for my mom's diabetes management — photo-based meal logging with AI nutrition analysis.",
```

- [ ] **Step 2: Add inline video playback**

In `ProjectCard.tsx`, add `"use client"` (already present) and a ref-driven hover handler. Insert above the title block, inside the outer `motion.div`:

```tsx
{project.video && (
    <video
        ref={videoRef}
        src={project.video}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full aspect-video object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-100"
    />
)}
```

Add the React import at the top of the file (the file currently imports nothing from react, so without this the task cannot typecheck):

```tsx
import { useRef } from "react";
```

Add to the component body:

```tsx
const videoRef = useRef<HTMLVideoElement>(null);

const onEnter = () => { videoRef.current?.play().catch(() => {}); };
const onLeave = () => { const v = videoRef.current; if (v) { v.pause(); v.currentTime = 0; } };
```

Add `className="group ..."`, `onMouseEnter={onEnter}` and `onMouseLeave={onLeave}` to the outer `motion.div`. The `.catch(() => {})` matters: `play()` rejects if the browser blocks autoplay or the element unmounts mid-promise, and an unhandled rejection would surface in the console.

- [ ] **Step 3: Give video-less cards their own treatment**

The tech chips already act as the second treatment. Make them respond to hover so those cards feel intentional rather than empty — on the chip container add:

```tsx
className="flex flex-wrap gap-2 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
```

- [ ] **Step 4: Verify**

Load the page. Confirm: `eclipse-obsidian`, `shit` and `photocortex` play muted video on hover and reset on mouse-out; every other card shows chips brightening; no console errors; only one card is titled "Eclipse".

```bash
grep -c 'title: "Eclipse"' src/data/projects.ts
```

Expected: `1`.

- [ ] **Step 5: Commit**

```bash
npx tsc --noEmit
git add src/components/ProjectCard.tsx src/data/projects.ts
git commit -m "$(cat <<'EOF'
Play demo video inline on hover; fix duplicate Eclipse title

Only 3 of 19 projects have video, so the card branches rather than
applying one treatment that would leave 16 cards looking broken.
Surfaces Glai's "built for my mom" detail from longDescription into
the visible description.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 11: Build log

**Files:**
- Create: `src/lib/github.ts`, `src/lib/__tests__/github.test.ts`, `src/components/BuildLog.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `relativeTime` from Task 5; server-component `page.tsx` from Task 7
- Produces:
  - `type PushEvent = { repo: string; at: string }`
  - `parsePushEvents(raw: unknown, limit: number): PushEvent[]`
  - `<BuildLog />` — async React Server Component

Caching with `revalidate: 3600` means the unauthenticated GitHub limit of 60 requests/hour is never approached and no token is required.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/__tests__/github.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parsePushEvents } from "@/lib/github";

const raw = [
    { type: "PushEvent", repo: { name: "soumyyy/eclipsn" }, created_at: "2026-09-04T09:00:00Z" },
    { type: "WatchEvent", repo: { name: "soumyyy/other" }, created_at: "2026-09-04T08:00:00Z" },
    { type: "PushEvent", repo: { name: "soumyyy/hft-backtest-engine" }, created_at: "2026-09-03T09:00:00Z" },
    { type: "PushEvent", repo: { name: "soumyyy/fulcrum" }, created_at: "2026-09-02T09:00:00Z" },
    { type: "PushEvent", repo: { name: "soumyyy/glai" }, created_at: "2026-09-01T09:00:00Z" },
];

describe("parsePushEvents", () => {
    it("keeps only push events", () => {
        expect(parsePushEvents(raw, 10).map(e => e.repo)).not.toContain("other");
    });

    it("strips the owner prefix", () => {
        expect(parsePushEvents(raw, 1)[0].repo).toBe("eclipsn");
    });

    it("respects the limit", () => {
        expect(parsePushEvents(raw, 2)).toHaveLength(2);
    });

    it("returns an empty array for a non-array payload", () => {
        expect(parsePushEvents(null, 3)).toEqual([]);
        expect(parsePushEvents({ message: "rate limited" }, 3)).toEqual([]);
    });

    it("skips malformed entries rather than throwing", () => {
        const messy = [{ type: "PushEvent" }, { type: "PushEvent", repo: {}, created_at: "x" }];
        expect(() => parsePushEvents(messy, 3)).not.toThrow();
        expect(parsePushEvents(messy, 3)).toEqual([]);
    });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test`
Expected: FAIL — `@/lib/github` does not exist.

- [ ] **Step 3: Implement the parser**

Create `src/lib/github.ts`:

```ts
export type PushEvent = { repo: string; at: string };

/** GitHub events payload -> push events. Never throws; bad input yields []. */
export function parsePushEvents(raw: unknown, limit: number): PushEvent[] {
    if (!Array.isArray(raw)) return [];

    const out: PushEvent[] = [];
    for (const item of raw) {
        if (out.length >= limit) break;
        if (!item || typeof item !== "object") continue;

        const e = item as Record<string, unknown>;
        if (e.type !== "PushEvent") continue;

        const repo = (e.repo as { name?: unknown } | undefined)?.name;
        const at = e.created_at;
        if (typeof repo !== "string" || typeof at !== "string") continue;
        if (Number.isNaN(new Date(at).getTime())) continue;

        out.push({ repo: repo.split("/").pop() ?? repo, at });
    }
    return out;
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Create the server component**

```tsx
import { parsePushEvents } from "@/lib/github";
import { relativeTime } from "@/lib/time";

export default async function BuildLog() {
    let events: ReturnType<typeof parsePushEvents> = [];

    try {
        const res = await fetch("https://api.github.com/users/soumyyy/events/public", {
            headers: { Accept: "application/vnd.github+json" },
            next: { revalidate: 3600 },
        });
        if (res.ok) events = parsePushEvents(await res.json(), 3);
    } catch {
        // Network failure: render nothing. A broken widget costs more
        // credibility than an absent one.
    }

    if (events.length === 0) return null;

    const now = new Date();

    return (
        <div className="flex flex-col gap-1">
            <span className="label text-neutral-600">recently</span>
            {events.map((e) => (
                <span key={`${e.repo}-${e.at}`} className="font-mono text-xs text-neutral-500">
                    pushed to {e.repo} · {relativeTime(e.at, now)}
                </span>
            ))}
        </div>
    );
}
```

- [ ] **Step 6: Mount it**

Import `BuildLog` in `page.tsx` and render `{/* @ts-expect-error async server component */}` is NOT needed on Next 16 — render it directly inside the footer section, above the social links:

```tsx
<BuildLog />
```

- [ ] **Step 7: Verify both paths**

Live data:

```bash
curl -s http://localhost:3000 | grep -c "pushed to"
```

Expected: at least `1`.

Failure path — temporarily change the fetch URL to `https://api.github.com/users/soumyyy/events/public-does-not-exist`, reload, and confirm the page still renders with the build log simply absent and no error overlay. Then revert the URL.

- [ ] **Step 8: Commit**

```bash
npx tsc --noEmit
git add src/lib/github.ts src/lib/__tests__/github.test.ts src/components/BuildLog.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
Add live GitHub build log

Server component, cached for an hour so the unauthenticated rate limit
is never approached and no token is needed. Renders null on any failure
rather than showing a broken widget.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 12: Now strip

**Files:**
- Create: `src/data/now.ts`, `src/components/NowStrip.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<NowStrip />`

A stale `now` strip is worse than none, so the date is shown deliberately — it makes staleness visible to Soumya rather than quietly misleading a reader.

- [ ] **Step 1: Create the data file**

```ts
export const now = {
    building: "an agent that reads my inbox before i do",
    reading: "the rust performance book",
    listening: "whatever the algorithm gave me this week",
    updated: "2026-09-04",
};
```

- [ ] **Step 2: Create the component**

```tsx
import { now } from "@/data/now";

export default function NowStrip() {
    return (
        <section className="w-full max-w-5xl px-4 md:px-6 py-16 border-t border-neutral-900">
            <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-24">
                <h2 className="label text-neutral-500">now</h2>
                <dl className="space-y-3 lowercase">
                    {([["building", now.building], ["reading", now.reading], ["listening", now.listening]] as const).map(
                        ([k, v]) => (
                            <div key={k} className="flex flex-col gap-1 md:flex-row md:gap-4">
                                <dt className="label w-28 shrink-0 text-neutral-600">{k}</dt>
                                <dd className="text-neutral-300">{v}</dd>
                            </div>
                        ),
                    )}
                </dl>
            </div>
            <p className="label mt-8 text-neutral-700 md:ml-[calc(33%+6rem)]">
                updated {now.updated}
            </p>
        </section>
    );
}
```

- [ ] **Step 3: Mount between intro and experience**

In `page.tsx`, render `<NowStrip />` immediately after the `#about` section and before `#experience`.

- [ ] **Step 4: Verify**

```bash
curl -s http://localhost:3000 | grep -c "updated 2026-09-04"
```

Expected: `1`.

- [ ] **Step 5: Commit**

```bash
git add src/data/now.ts src/components/NowStrip.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
Add now strip

Shows its own updated date deliberately — a stale now strip is worse
than none, and visible staleness prompts a fix.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 13: Philosophy copy

**Files:**
- Modify: `src/components/DotGrid.tsx:15-18`

**Interfaces:**
- Consumes: nothing
- Produces: no new exports.

`think different` is Apple's trademarked slogan; the other three are generic motivational filler sitting at the emotional climax of the page. Replace them with true, specific facts — the inversion is the point.

- [ ] **Step 1: Replace the phrases**

Replace the `phases` array contents (keeping the `id` keys unchanged, since the animation `switch` in `dotVariants` matches on them):

```ts
const phases = useMemo(() => [
    { id: 'thinkDifferent', text: 'a github hook ingests my journal at 2am' },
    { id: 'thinkBigger', text: 'a rust backtester, on a macbook, because why not' },
    { id: 'skipPerfect', text: 'most of my software has exactly one user' },
    { id: 'buildBreak', text: 'five attempts at the same agent, so far' }
], []);
```

**Do not rename the `id` values.** `dotVariants` switches on those exact strings; renaming them silently disables every dot animation.

- [ ] **Step 2: Verify the animation still runs**

Scroll to the philosophy section and confirm the dots still animate through all four phases and the new text renders.

- [ ] **Step 3: Confirm the slogan is gone**

```bash
grep -rn "think different\|think bigger\|skip the perfect plan" src/ || echo "clean"
```

Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add src/components/DotGrid.tsx
git commit -m "$(cat <<'EOF'
Replace philosophy slogans with true facts

"think different" is Apple's slogan and the rest were generic filler,
sitting at the emotional climax of the page. Four specific facts
instead — a motivational component that refuses to be motivational.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 14: Return visitor and easter egg

**Files:**
- Create: `src/components/VisitBadge.tsx`, `src/components/KonamiBoost.tsx`
- Modify: `src/components/OrbitField.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `<OrbitField />` from Task 4
- Produces: `<VisitBadge />`, `<KonamiBoost />`. They communicate with `OrbitField` through a `window` event named `orbit:boost` carrying `{ detail: boolean }`, so neither component needs a shared store.

- [ ] **Step 1: Create the visit badge**

```tsx
"use client";

import { useEffect, useState } from "react";

export default function VisitBadge() {
    const [visits, setVisits] = useState<number | null>(null);

    useEffect(() => {
        try {
            const n = Number(localStorage.getItem("visits") ?? "0") + 1;
            localStorage.setItem("visits", String(n));
            if (n > 1) setVisits(n);
        } catch {
            // Private windows and blocked site data both throw on access.
            // The badge is a nicety; the page must not care.
        }
    }, []);

    if (visits === null) return null;
    return <span className="label text-neutral-700">welcome back · visit {visits}</span>;
}
```

- [ ] **Step 2: Create the Konami listener**

```tsx
"use client";

import { useEffect } from "react";

const SEQUENCE = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

export default function KonamiBoost() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let i = 0;
        let boosted = false;

        const onKey = (e: KeyboardEvent) => {
            if (boosted) {
                boosted = false;
                window.dispatchEvent(new CustomEvent("orbit:boost", { detail: false }));
                i = 0;
                return;
            }
            const want = SEQUENCE[i];
            if (e.key === want || e.key.toLowerCase() === want) {
                i++;
                if (i === SEQUENCE.length) {
                    boosted = true;
                    i = 0;
                    window.dispatchEvent(new CustomEvent("orbit:boost", { detail: true }));
                }
            } else {
                i = e.key === SEQUENCE[0] ? 1 : 0;
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return null;
}
```

- [ ] **Step 3: Teach OrbitField to listen**

In `OrbitField.tsx`, add near the other refs:

```tsx
const boost = useRef(false);
```

Inside the main `useEffect`, alongside the other listeners:

```tsx
const onBoost = (e: Event) => { boost.current = (e as CustomEvent<boolean>).detail; };
window.addEventListener("orbit:boost", onBoost);
```

Add `window.removeEventListener("orbit:boost", onBoost);` to the cleanup. In `frame`, change the Kepler call to scale the rate:

```tsx
theta.current = keplerStep(theta.current, a, b, dt, boost.current ? 0.44 : 0.11) % (Math.PI * 2);
```

And in `draw`, triple the star count when boosted by drawing each star plus two seeded offsets:

```tsx
const density = boost.current ? 3 : 1;
for (const s of STARS) {
    for (let d = 0; d < density; d++) {
        ctx.globalAlpha = s.o / (d + 1);
        ctx.beginPath();
        ctx.arc(((s.x + d * 0.31) % 1) * w, ((s.y + d * 0.47) % 1) * h, s.r, 0, Math.PI * 2);
        ctx.fill();
    }
}
```

- [ ] **Step 4: Mount both**

In `page.tsx`, render `<KonamiBoost />` once inside `<main>`, and `<VisitBadge />` in the hero's label stack under `<LocalTime />`.

- [ ] **Step 5: Verify**

- Reload twice; confirm `welcome back · visit 2` appears on the second load.
- In DevTools, set `localStorage` to blocked (or use a private window) and confirm the page renders normally with no badge and no console error.
- Enter the Konami sequence and confirm the orbit speeds up and the starfield thickens; press any key and confirm it reverts.

- [ ] **Step 6: Commit**

```bash
npx tsc --noEmit
git add src/components/VisitBadge.tsx src/components/KonamiBoost.tsx src/components/OrbitField.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
Add return-visitor badge and Konami orbit boost

Components talk to OrbitField through a window event so neither needs a
shared store. localStorage access is wrapped — private windows and
blocked site data both throw, and the page must not care.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

### Task 15: Cleanup and full verification

**Files:**
- Delete: `src/app/type/page.tsx`
- Modify: none

Runs every check from the spec's Verification section against the built site, not the dev server — production build behaviour is what ships.

- [ ] **Step 1: Delete the throwaway specimen**

```bash
rm -rf src/app/type
grep -rn "fontshare\|jsdelivr\|fontsource-variable/fraunces\|bodoni" src/ || echo "no CDN font refs remain"
```

Expected: `no CDN font refs remain`. (The `@fontsource` *imports* in `layout.tsx` are npm packages, not CDN links — those are correct and stay.)

- [ ] **Step 2: Build and run production**

```bash
npm run build && npm start &
```

Wait for `Ready`, then run the checks below against `http://localhost:3000`.

- [ ] **Step 3: Run the automated sweep**

```bash
echo "--- hero in SSR payload (no JS) ---"
curl -s http://localhost:3000 | grep -c "agents, trading engines, ios apps, infra and saas"
echo "--- dead patterns ---"
grep -rn "uppercase tracking\|Space Grotesk\|soumysphere\|think different" src/ || echo "clean"
echo "--- unit tests ---"
npm test
echo "--- types + lint ---"
npx tsc --noEmit && npx eslint <the files you changed>
```

Expected: hero count ≥ 1; `clean`; all tests pass; no type or lint errors.

- [ ] **Step 4: Run the browser checks**

In the browser console on the production build:

```js
// 1. fonts really loaded, nothing fell back
await document.fonts.ready;
const fams = new Set(); document.fonts.forEach(f => f.status === 'loaded' && fams.add(f.family.replace(/['"]/g,'')));
console.log('fonts:', [...fams]);

// 2. no horizontal overflow at mobile width (resize to 375px first)
console.log('overflow:', document.documentElement.scrollWidth > window.innerWidth);
```

Expected: fonts include Zodiak, Instrument Sans Variable and Commit Mono, and NOT Space Grotesk. Overflow at 375px: `false`.

- [ ] **Step 5: Reduced-motion check on the production build**

Enable `prefers-reduced-motion: reduce` in the Rendering panel, hard-reload, and confirm no `requestAnimationFrame` is scheduled (same probe as Task 4, Step 5). Expected: `0`.

- [ ] **Step 6: Commit**

```bash
git rm -r src/app/type
git commit -m "$(cat <<'EOF'
Remove typeface specimen route

Served its purpose selecting the Zodiak / Instrument Sans / Commit Mono
stack. Verification sweep passes on the production build.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KYWRNmfBWfhVP1gF31pnrZ
EOF
)"
```

---

## Open dependencies on Soumya

These are specified but cannot be implemented without him. None blocks any task above.

1. **Signature SVG.** The spec's highest-leverage personal element. He writes his name once, it gets traced to SVG and set as a white stroke above the hero. Deliberately not faked — manufacturing a "handwritten" mark neither of us wrote is the exact failure this redesign exists to avoid. Add as a follow-up task when the file arrives.
2. **`now.ts` contents.** Task 12 ships placeholder values in his voice. He should replace all three lines and the date with what is actually true.
3. **Copy review.** Every line in Task 9 and Task 13 is a draft for him to edit.
