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

/* Contribution data for the grid under the projects ledger.

   This reads the public contributions fragment that github renders for a
   profile page, rather than the graphql api, because graphql needs a personal
   access token and this page has no secrets and no server of its own. The
   fragment is public, unauthenticated, and already carries a level per day.

   It is markup, so it can change without warning. Every failure here is soft:
   a parse that finds nothing returns null and the section does not render. A
   build must never fail because github changed a class name. */

const SOURCE = "https://github.com/users/soumyyy/contributions";

export type ContributionDay = {
  date: string;
  level: number;
};

export type Contributions = {
  total: number;
  columns: number;
  days: ContributionDay[];
};

// Matched as a whole tag with the attributes pulled out separately, because
// github does not emit them in a fixed order: data-date lands before id, which
// lands before data-level.
const CELL_PATTERN = /<td\b[^>]*\bdata-date="[^"]*"[^>]*>/g;
const DATE_ATTR = /\bdata-date="(\d{4}-\d{2}-\d{2})"/;
const LEVEL_ATTR = /\bdata-level="(\d)"/;
const ID_ATTR = /\bid="(contribution-day-component-\d+-(\d+))"/;
const TOTAL_PATTERN = /([\d,]+)\s*\n?\s*contributions?\s*\n?\s*in the last year/i;

export async function getContributions(): Promise<Contributions | null> {
  let html: string;
  try {
    const response = await fetch(SOURCE, {
      headers: { "user-agent": "soumyamaheshwari.com" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    html = await response.text();
  } catch {
    return null;
  }

  const days: ContributionDay[] = [];
  let columns = 0;
  for (const [tag] of html.matchAll(CELL_PATTERN)) {
    const date = DATE_ATTR.exec(tag);
    const id = ID_ATTR.exec(tag);
    if (!date || !id) continue;
    const level = LEVEL_ATTR.exec(tag);
    days.push({ date: date[1], level: level ? Number(level[1]) : 0 });
    columns = Math.max(columns, Number(id[2]) + 1);
  }

  const total = TOTAL_PATTERN.exec(html);
  // No cells or no headline figure means the markup moved. Render nothing
  // rather than a grid with an invented total under it.
  if (days.length === 0 || columns === 0 || !total) return null;

  return { total: Number(total[1].replace(/,/g, "")), columns, days };
}
