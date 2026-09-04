export type PushEvent = { repo: string; at: string };

/**
 * GitHub events payload -> push events.
 *
 * The events array from the GitHub API is NOT ordered by recency, and a
 * burst of commits to one repo can occupy every slot in the recent-events
 * window. So this: keeps only push events, sorts by created_at descending,
 * deduplicates by repo (keeping each repo's newest push), then takes the
 * top `limit`. Never throws; malformed entries are skipped silently.
 */
export function parsePushEvents(raw: unknown, limit: number): PushEvent[] {
    if (!Array.isArray(raw)) return [];

    const parsed: PushEvent[] = [];
    for (const item of raw) {
        if (!item || typeof item !== "object") continue;

        const e = item as Record<string, unknown>;
        if (e.type !== "PushEvent") continue;

        const repo = (e.repo as { name?: unknown } | undefined)?.name;
        const at = e.created_at;
        if (typeof repo !== "string" || repo.length === 0) continue;
        if (typeof at !== "string") continue;
        if (Number.isNaN(new Date(at).getTime())) continue;

        parsed.push({ repo: repo.split("/").pop() ?? repo, at });
    }

    parsed.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    const seenRepos = new Set<string>();
    const deduped: PushEvent[] = [];
    for (const e of parsed) {
        if (seenRepos.has(e.repo)) continue;
        seenRepos.add(e.repo);
        deduped.push(e);
    }

    return deduped.slice(0, limit);
}
