/* Procedural plates.

   Every picture on the site is a grid of characters. A photograph supplies its
   own brightness per cell; these functions supply it for the plates that are
   drawn rather than photographed. Each takes a point in a square space where
   the shorter side of the plate runs from -1 to 1, a time in seconds, and a
   seed, and returns how bright that cell is, 0 to 1.

   They are pure so they can be tested and so the canvas component stays a dumb
   loop over cells. */

export type PlateKind = "reactor" | "corona" | "chart" | "fulcrum" | "receipt" | "sigil" | "noise";

export type PlateFn = (x: number, y: number, t: number, seed: number, boot: number) => number;

const TAU = Math.PI * 2;

/** Darkest to brightest. The first entry is a space: nothing is drawn. */
export const RAMP = " .·:-~=+*x%#&@";

/** Deterministic 0..1 from an integer. */
export function hash(n: number): number {
    let h = (n | 0) * 374761393 + 668265263;
    h = (h ^ (h >>> 13)) * 1274126177;
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}

export function seedFrom(text: string): number {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

export function glyphFor(intensity: number): string {
    const i = Math.max(0, Math.min(1, intensity));
    return RAMP[Math.min(RAMP.length - 1, Math.floor(i * RAMP.length))];
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** 1 on the line, falling to 0 at `width` away from it. */
const band = (v: number, at: number, width: number) => clamp01(1 - Math.abs(v - at) / width);
const fract = (v: number) => v - Math.floor(v);

/* The arc reactor. A core, a winding of ten coils that turns one way, a ring of
   ticks that turns the other. `boot` sweeps each part in from the top the first
   time it is drawn: core first, then the coils, then the outer rings. */
export const reactor: PlateFn = (x, y, t, _seed, boot) => {
    const r = Math.hypot(x, y);
    if (r > 0.96) return 0;
    const a = Math.atan2(y, x);
    const turn = fract((a + Math.PI / 2) / TAU); // 0 at the top, clockwise

    const coreOn = clamp01(boot / 0.25);
    const coilSweep = clamp01((boot - 0.2) / 0.45);
    const ringSweep = clamp01((boot - 0.5) / 0.5);

    // Core and its halo. The pulse is slow enough to read as breathing.
    const pulse = 0.88 + 0.12 * Math.sin(t * 1.7);
    let v = r < 0.13 ? 1 : Math.exp(-(r - 0.13) * 13) * 0.8 * pulse;
    v *= coreOn;
    v = Math.max(v, band(r, 0.27, 0.016) * 0.7 * coreOn);

    // Ten coils. Flat fill with hard edges: fine texture turns to noise at
    // this resolution, and the gaps between coils are what make it a reactor.
    if (r > 0.36 && r < 0.6 && turn < coilSweep) {
        const seg = fract(((a + t * 0.2) / TAU) * 10);
        if (seg < 0.64) {
            const rim = r < 0.385 || r > 0.575 || seg < 0.05 || seg > 0.59;
            v = Math.max(v, rim ? 1 : 0.62);
        }
    }

    if (turn < ringSweep) {
        v = Math.max(v, band(r, 0.68, 0.014) * 0.55);
        // Sixty ticks, every fifth one longer, turning against the coils.
        if (r > 0.74 && r < 0.84) {
            const tick = ((a - t * 0.08) / TAU) * 60;
            const long = ((Math.floor(tick) % 5) + 5) % 5 === 0;
            if (fract(tick) < 0.3 && (long || r < 0.79)) v = Math.max(v, long ? 0.6 : 0.34);
        }
        v = Math.max(v, band(r, 0.92, 0.012) * 0.32);
    }

    return clamp01(v);
};

/* A total eclipse: a dark disc, a hard bright limb, streamers that drift, and
   one bead of direct light. */
export const corona: PlateFn = (x, y, t) => {
    const r = Math.hypot(x, y);
    const disc = 0.44;
    if (r < disc - 0.012) return 0;
    const a = Math.atan2(y, x);
    const e = Math.max(0, r - disc);

    const flicker =
        0.6 +
        0.22 * Math.sin(a * 7 + t * 0.35) +
        0.18 * Math.sin(a * 13 - t * 0.5 + 1.7);
    let v = Math.exp(-e * 6.5) * flicker;

    const streamers = Math.pow(Math.abs(Math.sin(a * 2 + 0.6 + Math.sin(t * 0.12) * 0.25)), 6);
    v += streamers * Math.exp(-e * 2.1) * 0.55;

    // The diamond ring, upper right.
    let d = a + 0.72;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    v += Math.exp(-d * d * 55) * Math.exp(-e * 4) * 1.2;

    if (e < 0.02) v = Math.max(v, 0.85);
    return clamp01(v);
};

/* Candles on a tick chart, drifting left. The path is a sum of sines keyed on
   the seed so the same project always draws the same market. */
export const chart: PlateFn = (x, y, t, seed) => {
    if (Math.abs(x) > 1.3 || Math.abs(y) > 0.92) return 0;
    const s = hash(seed) * 40;
    const price = (k: number) =>
        0.3 * Math.sin(k * 0.21 + s) +
        0.18 * Math.sin(k * 0.53 + s * 1.7) +
        0.1 * Math.sin(k * 1.31 + s * 0.4) -
        k * 0.0;

    const pos = (x + 1.3) * 11 + t * 0.6;
    const k = Math.floor(pos);
    const within = fract(pos);
    const open = price(k);
    const close = price(k + 1);
    const top = Math.max(open, close);
    const bottom = Math.min(open, close);
    const wick = 0.05 + hash(k * 7 + seed) * 0.12;
    const py = -y; // screen y runs down, price runs up

    if (within > 0.2 && within < 0.8 && py <= top + 0.012 && py >= bottom - 0.012) {
        return close >= open ? 0.95 : 0.5;
    }
    if (within > 0.44 && within < 0.56 && py <= top + wick && py >= bottom - wick) return 0.4;

    // Faint price levels behind the candles.
    if (fract((y + 0.92) * 2.5) < 0.05 && fract(pos * 2) < 0.3) return 0.12;
    return 0;
};

/* A beam on a pivot, carrying an annual report on one side and a verdict on
   the other, never quite settling. */
export const fulcrum: PlateFn = (x, y, t) => {
    const tilt = 0.13 * Math.sin(t * 0.55) + 0.04 * Math.sin(t * 1.3);
    const px = 0;
    const py = 0.02;

    // Pivot triangle.
    if (y > py && y < 0.62) {
        const half = (y - py) * 0.62;
        if (Math.abs(x) < half) {
            return Math.abs(x) > half - 0.035 || y > 0.585 ? 0.8 : 0.22;
        }
    }
    if (Math.abs(y - 0.66) < 0.012 && Math.abs(x) < 0.9) return 0.3;

    // Beam, in its own rotated frame.
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);
    const bx = (x - px) * cos + (y - py) * sin;
    const by = -(x - px) * sin + (y - py) * cos;
    if (Math.abs(bx) < 0.95 && Math.abs(by) < 0.022) return 1;

    // The report: a heavy block hanging on the left.
    const lx = bx + 0.74;
    const ly = by + 0.2;
    if (Math.abs(lx) < 0.17 && Math.abs(ly) < 0.17) {
        return fract((ly + 0.17) * 9) < 0.45 && Math.abs(lx) < 0.12 ? 0.75 : 0.3;
    }
    // The verdict: a small bright disc on the right.
    const rr = Math.hypot(bx - 0.74, by + 0.12);
    if (rr < 0.1) return rr > 0.07 ? 0.9 : 0.55;

    return 0;
};

/* A receipt with a scan line travelling down it. */
export const receipt: PlateFn = (x, y, t, seed) => {
    const halfWidth = 0.62;
    const top = -0.9;
    const bottom = 0.9;
    if (Math.abs(x) > halfWidth + 0.02 || y < top || y > bottom) return 0;

    // Torn bottom edge.
    const tooth = Math.abs(fract(x * 7) - 0.5) * 0.08;
    if (y > bottom - 0.02 - tooth) return 0;

    const scan = top + fract(t * 0.16) * (bottom - top);
    const lit = Math.exp(-Math.pow((y - scan) * 9, 2));
    if (Math.abs(y - scan) < 0.012) return 1;

    if (Math.abs(x) > halfWidth - 0.015) return 0.3 + lit * 0.4;

    const rowHeight = 0.105;
    const row = Math.floor((y - top) / rowHeight);
    const inRow = fract((y - top) / rowHeight);
    let v = 0.05;
    if (inRow > 0.3 && inRow < 0.7 && row > 0 && row < 16) {
        if (row === 2 || row === 13) {
            v = fract(x * 14) < 0.5 ? 0.3 : 0.05; // dashed rules
        } else {
            const length = 0.25 + hash(row * 31 + seed) * 0.4;
            const char = Math.floor((x + halfWidth) * 26);
            const gap = hash(char * 13 + row * 101 + seed) < 0.18;
            if (x > -0.52 && x < -0.52 + length && !gap) v = row === 1 ? 0.85 : 0.5;
            if (x > 0.28 && x < 0.52 && row > 2) v = row === 14 ? 0.95 : 0.6; // the amounts
        }
    }
    return clamp01(v + lit * 0.45);
};

/* The plate for a project that has no picture of its own: a small machine of
   rings whose proportions come from the project's name. */
export const sigil: PlateFn = (x, y, t, seed) => {
    const r = Math.hypot(x, y);
    if (r > 0.95) return 0;
    const a = Math.atan2(y, x);
    const segments = 3 + Math.floor(hash(seed) * 9);
    const inner = 0.2 + hash(seed + 1) * 0.12;
    const outer = inner + 0.2 + hash(seed + 2) * 0.16;
    const fill = 0.45 + hash(seed + 3) * 0.35;
    const speed = (hash(seed + 4) - 0.5) * 0.5;

    let v = r < 0.07 ? 0.95 : Math.exp(-(r - 0.07) * 11) * 0.6;
    if (r > inner && r < outer) {
        const seg = fract(((a + t * speed) / TAU) * segments);
        v = Math.max(v, seg < fill ? 0.55 + 0.3 * Math.abs(Math.sin(r * 50)) : 0.08);
    }
    v = Math.max(v, band(r, outer + 0.1, 0.016) * 0.5);
    const ticks = 24 + Math.floor(hash(seed + 5) * 4) * 12;
    if (r > outer + 0.16 && r < outer + 0.22 && fract(((a - t * speed * 0.5) / TAU) * ticks) < 0.3) {
        v = Math.max(v, 0.36);
    }
    return clamp01(v);
};

/* A screen tuned to nothing. */
export const noise: PlateFn = (x, y, t, seed) => {
    const cell = Math.floor(x * 46) * 131 + Math.floor(y * 46) * 977 + Math.floor(t * 11) * 7919 + seed;
    const band = 0.55 + 0.45 * Math.sin(y * 5 - t * 1.3);
    return hash(cell) * 0.75 * band;
};

export const PLATES: Record<PlateKind, PlateFn> = { reactor, corona, chart, fulcrum, receipt, sigil, noise };
