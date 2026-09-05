"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ExperienceItem({ company, role, date, location, summary, bullets }: { company: string, role: string, date: string, location: string, summary: string, bullets: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const bulletsId = useId();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    return (
        <div
            className="group border-l-2 border-neutral-900 pl-6 md:pl-8 py-2 transition-all hover:border-neutral-700 hover:bg-neutral-900/10 rounded-r-lg pr-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-500"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-controls={bulletsId}
        >
            <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-neutral-200 transition-colors">
                        {company}
                    </h3>
                    <span className="text-xs font-mono text-neutral-500">{date}</span>
                </div>

                <div className="label text-neutral-500">{role} · {location}</div>

                <p className="text-neutral-400 leading-relaxed italic pr-4">
                    {summary}
                </p>

                {/* A lone chevron beside the company name was the only sign these
                    rows opened, and nobody reads a 16px grey icon as an invitation.
                    This names what is behind the row instead. */}
                <span className="label inline-flex items-center gap-1.5 text-neutral-600 group-hover:text-white transition-colors">
                    {isOpen ? "close" : "what i did here"}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                </span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <ul id={bulletsId} className="pt-4 space-y-3 text-neutral-400 leading-relaxed list-disc list-outside ml-4 text-base border-t border-neutral-900/50 mt-4">
                            {bullets.map((bullet, idx) => (
                                <li key={idx}><span className="text-neutral-300">{bullet}</span></li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
