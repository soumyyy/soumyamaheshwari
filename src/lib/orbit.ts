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
