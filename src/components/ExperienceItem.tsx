"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ExperienceItem({ company, role, date, location, summary, bullets }: { company: string, role: string, date: string, location: string, summary: string, bullets: string[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="group border-l-2 border-neutral-900 pl-6 md:pl-8 py-2 transition-all hover:border-neutral-700 hover:bg-neutral-900/10 rounded-r-lg pr-4 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-neutral-200 transition-colors flex items-center gap-2">
                        {company}
                        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </h3>
                    <span className="text-xs font-mono text-neutral-500">{date}</span>
                </div>

                <div className="text-sm text-neutral-500 uppercase tracking-wider">{role} · {location}</div>

                <p className="text-neutral-400 leading-relaxed italic pr-4">
                    {summary}
                </p>
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
                        <ul className="pt-4 space-y-3 text-neutral-400 leading-relaxed list-disc list-outside ml-4 text-base border-t border-neutral-900/50 mt-4">
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
