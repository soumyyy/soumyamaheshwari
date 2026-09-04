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
