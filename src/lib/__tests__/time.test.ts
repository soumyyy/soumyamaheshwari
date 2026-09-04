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
