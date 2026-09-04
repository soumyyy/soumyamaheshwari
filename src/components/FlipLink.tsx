"use client";

import { motion } from "framer-motion";

export default function FlipLink({ children, href }: { children: string; href: string }) {
    return (
        <motion.a
            initial="initial"
            whileHover="hovered"
            href={href}
            className="relative block overflow-hidden whitespace-nowrap text-xs md:text-sm font-medium uppercase tracking-wider text-neutral-400 border border-neutral-800 rounded-lg px-4 py-2 md:px-12 bg-black/50 backdrop-blur-sm hover:text-white hover:border-white transition-colors"
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
