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

/** Coarse relative time. Deliberately vague past a day, precision would be noise. */
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
