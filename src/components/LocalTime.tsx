"use client";

import { useEffect, useState } from "react";
import { formatMumbaiTime } from "@/lib/time";

export default function LocalTime() {
    // Identical on server and first client render — no hydration mismatch.
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const tick = () => setTime(formatMumbaiTime(new Date()));
        tick();
        const id = setInterval(tick, 30_000);
        return () => clearInterval(id);
    }, []);

    return (
        <span className="label text-neutral-600">
            mumbai, india
            <span aria-hidden={time === null}>{time ? ` · ${time}` : ""}</span>
        </span>
    );
}
