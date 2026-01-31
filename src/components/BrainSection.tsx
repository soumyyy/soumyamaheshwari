"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Mock data to replace the json file for now
const ideas = [
    { id: 1, title: "The Singularity", description: "When AI escapes the box.", position: "top-left" },
    { id: 2, title: "Consciousness", description: "Is the ghost in the machine real?", position: "top-right" },
    { id: 3, title: "Entropy", description: "Ordering the chaos.", position: "bottom-left" },
    { id: 4, title: "Recursion", description: "Dreams within dreams.", position: "bottom-right" },
];

const BrainSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative min-h-screen py-20 flex flex-col items-center justify-center overflow-hidden">
            <div className="z-10 text-center max-w-2xl px-6 mb-12">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-neutral-800">
                    inside my brain
                </h2>
                <p className="text-neutral-500 leading-relaxed">
                    Welcome to the part of the internet where my raw, unfiltered thoughts exist.
                    Disclaimer: This isn't a structured blog or a polished portfolio: it's a space for
                    the ideas in my head, the tech experiments I think of, the books that
                    push me in a spiral and the questions I keep asking myself.
                </p>
            </div>

            <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center border border-neutral-800 rounded-lg p-10">
                {/* Placeholder for Brain Canvas/Image */}
                <div className="text-neutral-700 font-mono text-sm border-2 border-dashed border-neutral-800 p-10 rounded-full animate-pulse">
                    [ BRAIN VISUALIZATION ]
                </div>
            </div>
        </section>
    );
};

export default BrainSection;
