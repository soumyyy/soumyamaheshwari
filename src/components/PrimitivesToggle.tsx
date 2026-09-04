"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function PrimitivesToggle({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="pt-4">
                <button
                    onClick={() => setOpen(!open)}
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
                        className="overflow-hidden"
                    >
                        <div className="space-y-4 pt-4">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
