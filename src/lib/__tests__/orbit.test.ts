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
