"use client";

import { useEffect, useState } from "react";
import styles from "./Fig.module.css";

/* The caption under a plate, numbered like a figure in a paper.

   `boosted` is what the caption says while the reactor is being overdriven,
   which only happens to someone who already knows the code. */
export default function Fig({ n, children, boosted }: { n: string; children: string; boosted?: string }) {
    const [on, setOn] = useState(false);

    useEffect(() => {
        if (!boosted) return;
        const onBoost = (event: Event) => setOn(Boolean((event as CustomEvent).detail));
        window.addEventListener("reactor:boost", onBoost);
        return () => window.removeEventListener("reactor:boost", onBoost);
    }, [boosted]);

    return (
        <p className={styles.fig}>
            <span className={styles.n}>fig. {n}</span>
            <span>{on && boosted ? boosted : children}</span>
        </p>
    );
}
