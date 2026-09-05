"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* The nav pill is fixed, so it crosses the paper section on the way down and a
   black translucent chip with grey type turns into a smudge on cream. CSS
   cannot see what is behind a fixed element, so this measures: while the pill's
   own band overlaps the paper sheet, it wears the paper palette instead. */
function useOnPaper(ref: React.RefObject<HTMLElement | null>) {
    const [onPaper, setOnPaper] = useState(false);

    useEffect(() => {
        const paper = document.querySelector(".projects-paper");
        if (!paper) return;

        let frame = 0;
        const measure = () => {
            frame = 0;
            const el = ref.current;
            if (!el) return;
            const pill = el.getBoundingClientRect();
            const sheet = paper.getBoundingClientRect();
            setOnPaper(pill.bottom > sheet.top && pill.top < sheet.bottom);
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, [ref]);

    return onPaper;
}

const DARK = "text-neutral-400 border-neutral-800 bg-black/50 hover:text-white hover:border-white";
const PAPER = "text-[#3A362E] border-[#B4AD9B] bg-[#F5F3EA]/75 hover:text-[#12100C] hover:border-[#12100C]";

export default function FlipLink({ children, href }: { children: string; href: string }) {
    const ref = useRef<HTMLAnchorElement>(null);
    const onPaper = useOnPaper(ref);

    return (
        <motion.a
            ref={ref}
            initial="initial"
            whileHover="hovered"
            href={href}
            className={`label relative block overflow-hidden whitespace-nowrap border rounded-lg px-4 py-2 md:px-12 backdrop-blur-sm transition-colors duration-300 ${onPaper ? PAPER : DARK}`}
        >
            <motion.div
                variants={{
                    initial: { y: 0 },
                    hovered: { y: "-100%" },
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                }}
            >
                {children}
            </motion.div>
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                variants={{
                    initial: { y: "100%" },
                    hovered: { y: 0 },
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                }}
            >
                email me
            </motion.div>
        </motion.a>
    );
}
