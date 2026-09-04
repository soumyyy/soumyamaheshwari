"use client";

import { useEffect, useState } from "react";

export default function VisitBadge() {
    const [visits, setVisits] = useState<number | null>(null);

    useEffect(() => {
        const sync = () => {
            const n = Number(localStorage.getItem("visits") ?? "0") + 1;
            localStorage.setItem("visits", String(n));
            if (n > 1) setVisits(n);
        };
        try {
            sync();
        } catch {
            // Private windows and blocked site data both throw on access.
            // The badge is a nicety; the page must not care.
        }
    }, []);

    if (visits === null) return null;
    return <span className="label text-neutral-700">welcome back · visit {visits}</span>;
}
