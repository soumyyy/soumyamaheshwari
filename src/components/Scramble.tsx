"use client";

import { useEffect, useRef } from "react";

/* A label that resolves out of loose characters the first time it is seen.

   The server renders the finished text, so nothing depends on this running.
   It is only used on monospace labels: every glyph is the same width there, so
   the text can change character without the line moving. */

const GLYPHS = ".·:-~=+*x%#&@";

export default function Scramble({ children, className }: { children: string; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const text = children;
        let raf = 0;
        let start = 0;
        const duration = 420 + text.length * 14;

        const step = (now: number) => {
            if (!start) start = now;
            const p = Math.min(1, (now - start) / duration);
            const settled = Math.floor(p * text.length);
            let out = text.slice(0, settled);
            for (let i = settled; i < text.length; i++) {
                out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            el.textContent = out;
            if (p < 1) raf = requestAnimationFrame(step);
        };

        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            raf = requestAnimationFrame(step);
        }, { threshold: 0.6 });
        io.observe(el);

        return () => {
            io.disconnect();
            if (raf) cancelAnimationFrame(raf);
            el.textContent = text;
        };
    }, [children]);

    return <span ref={ref} className={className}>{children}</span>;
}
