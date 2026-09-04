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

    it("deduplicates by repo, keeping only the newest entry per repo", () => {
        const sameRepo = [
            { type: "PushEvent", repo: { name: "soumyyy/Room" }, created_at: "2026-09-04T06:42:00Z" },
            { type: "PushEvent", repo: { name: "soumyyy/Room" }, created_at: "2026-09-04T08:27:00Z" },
            { type: "PushEvent", repo: { name: "soumyyy/Room" }, created_at: "2026-09-04T07:16:00Z" },
        ];
        const result = parsePushEvents(sameRepo, 10);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({ repo: "Room", at: "2026-09-04T08:27:00Z" });
    });

    it("orders output newest-first even when input is shuffled", () => {
        const shuffled = [
            { type: "PushEvent", repo: { name: "soumyyy/a" }, created_at: "2026-09-04T07:16:00Z" },
            { type: "PushEvent", repo: { name: "soumyyy/b" }, created_at: "2026-09-04T06:42:00Z" },
            { type: "PushEvent", repo: { name: "soumyyy/c" }, created_at: "2026-09-04T08:27:00Z" },
        ];
        const result = parsePushEvents(shuffled, 10);
        expect(result.map(e => e.repo)).toEqual(["c", "a", "b"]);
    });
});
