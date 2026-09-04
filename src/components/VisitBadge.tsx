"use client";

import { useEffect, useState } from "react";

export default function VisitBadge() {
    const [visits, setVisits] = useState<number | null>(null);

    useEffect(() => {
        try {
            const n = Number(localStorage.getItem("visits") ?? "0") + 1;
            localStorage.setItem("visits", String(n));
            // One-time sync from an external system (localStorage) on mount, guarded
            // so SSR/first paint render nothing and hydration always matches — not a
            // cascading update loop, so the set-state-in-effect rule is a false positive here.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (n > 1) setVisits(n);
        } catch {
            // Private windows and blocked site data both throw on access.
            // The badge is a nicety; the page must not care.
        }
    }, []);

    if (visits === null) return null;
    return <span className="label text-neutral-700">welcome back · visit {visits}</span>;
}
