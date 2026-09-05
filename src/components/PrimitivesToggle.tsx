"use client";

import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function PrimitivesToggle({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    // Clipped while the height animation is in flight (both opening and
    // closing), unclipped once fully open and at rest — so a hovered card's
    // expanded preview isn't cut off by the height:auto container, but
    // content doesn't spill out while height is still interpolating.
    const [isAnimating, setIsAnimating] = useState(false);
    // AnimatePresence animates the *exit* using the last props the child had
    // while it was still mounted (`{open && <motion.div>}` stops rendering
    // the element the instant `open` goes false, so there's no later render
    // to pick up a fresh className). A ref — not `open` state, which would be
    // stale-captured by the exit element's frozen closure — tells the
    // completion handler whether we're finishing an open or a close.
    const openRef = useRef(false);

    const toggle = () => {
        if (openRef.current) {
            // Closing: force the clipped className to commit synchronously
            // *while the element is still mounted* (open still true), so the
            // props AnimatePresence freezes for the exit animation are
            // already "overflow-hidden" — flipping `open` first would remove
            // the element from this render before it could pick that up.
            flushSync(() => setIsAnimating(true));
            openRef.current = false;
            setOpen(false);
        } else {
            openRef.current = true;
            setIsAnimating(true);
            setOpen(true);
        }
    };

    return (
        <>
            <div className="pt-4">
                <button
                    onClick={toggle}
                    className="label flex items-center gap-2 text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                    {open ? "hide the primitive tech" : "view the primitive tech that got me here"}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                </button>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        onAnimationComplete={() => {
                            // Only the "opening" animation should unclip. If this
                            // fires for the exit animation instead, leave it
                            // clipped — it's about to unmount anyway.
                            if (openRef.current) setIsAnimating(false);
                        }}
                        className={isAnimating ? "overflow-hidden" : "overflow-visible"}
                    >
                        <div className="space-y-4 pt-4">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
