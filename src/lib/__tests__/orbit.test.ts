import { describe, it, expect } from "vitest";
import { mulberry32, ellipsePoint, radiusAt, keplerStep, gravityDisplace, makeStars } from "@/lib/orbit";

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

describe("radiusAt", () => {
    it("is at apogee (a) when theta = 0", () => {
        expect(radiusAt(450, 200, 0)).toBeCloseTo(450);
    });

    it("is at perigee (b) when theta = PI/2", () => {
        expect(radiusAt(450, 200, Math.PI / 2)).toBeCloseTo(200);
    });

    it("is between perigee and apogee at intermediate angles", () => {
        const atQuarter = radiusAt(450, 200, Math.PI / 4);
        expect(atQuarter).toBeGreaterThan(200);
        expect(atQuarter).toBeLessThan(450);
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

    it("follows inverse-square law (1/r²), not inverse-distance (1/r)", () => {
        const a = 450;
        const b = 200;
        const dt = 0.016;
        const k = 1;

        // At apogee (theta=0): r=450, scale = (a*b)/(r²) = 90000/202500
        const atApogee = keplerStep(0, a, b, dt, k) - 0;

        // At perigee (theta=π/2): r=200, scale = (a*b)/(r²) = 90000/40000
        const atPerigee = keplerStep(Math.PI / 2, a, b, dt, k) - Math.PI / 2;

        // Under 1/r² law, ratio of advances should be (90000/40000)/(90000/202500) = 202500/40000 ≈ 5.0625
        // Under 1/r law, ratio would instead be 450/200 = 2.25
        const expectedRatio = (a * b) / (b * b) / ((a * b) / (a * a));
        const actualRatio = atPerigee / atApogee;
        expect(actualRatio).toBeCloseTo(expectedRatio, 1);
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
