"use client";

import { useEffect } from "react";

const SEQUENCE = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

export default function KonamiBoost() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let i = 0;
        let boosted = false;

        const onKey = (e: KeyboardEvent) => {
            if (boosted) {
                boosted = false;
                window.dispatchEvent(new CustomEvent("orbit:boost", { detail: false }));
                i = 0;
                return;
            }
            const want = SEQUENCE[i];
            if (e.key === want || e.key.toLowerCase() === want) {
                i++;
                if (i === SEQUENCE.length) {
                    boosted = true;
                    i = 0;
                    window.dispatchEvent(new CustomEvent("orbit:boost", { detail: true }));
                }
            } else {
                i = e.key === SEQUENCE[0] ? 1 : 0;
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return null;
}
