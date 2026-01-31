"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SatelliteOrbit = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
            {/* Starry Background (Static for performance, can add twinkle if needed) */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            opacity: Math.random() * 0.5 + 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Orbital Path and Satellite */}
            {/* Using a large responsive SVG */}
            <svg
                className="absolute w-full h-full md:w-[80vw] md:h-[80vh] opacity-60 pointer-events-none"
                viewBox="0 0 1000 1000"
                style={{
                    // Rotate the whole system slightly for an angled view
                    transform: "rotate(-10deg)",
                }}
            >
                {/* The Elliptical Orbit Line */}
                <ellipse
                    cx="500"
                    cy="500"
                    rx="450"
                    ry="200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="10 20"
                    className="text-neutral-600"
                />

                {/* The Satellite (ISS) */}
                <motion.g
                    // Animate position along the ellipse
                    animate={{
                        x: Array.from({ length: 361 }, (_, i) => 500 + 450 * Math.cos((i * Math.PI) / 180)),
                        y: Array.from({ length: 361 }, (_, i) => 500 + 200 * Math.sin((i * Math.PI) / 180)),
                    }}
                    transition={{
                        duration: 50, // Slow, majestic orbit
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {/* Inner rotation to keep it oriented or spinning specifically if needed */}
                    {/* For now, just a slight rotation to match the path tangent would be cool, but simple translation is safer for 'floating' look */}
                    <g transform="translate(0, 0) scale(0.8)">
                        {/* ISS SVG Group - Centered at 0,0 for the motion group to move it */}
                        <g transform="rotate(30)"> {/* Slight tilt of the station itself */}
                            {/* Main Truss */}
                            <rect x="-40" y="-2" width="80" height="4" fill="#888" stroke="#444" strokeWidth="1" />

                            {/* Solar Arrays (Large, paired) */}
                            {/* Left Pair */}
                            <g transform="translate(-35, 0)">
                                <rect x="-10" y="-40" width="20" height="35" fill="#1a237e" stroke="#0d47a1" strokeWidth="1" />
                                <rect x="-10" y="5" width="20" height="35" fill="#1a237e" stroke="#0d47a1" strokeWidth="1" />
                                <line x1="0" y1="-40" x2="0" y2="40" stroke="#666" strokeWidth="1" />
                            </g>

                            {/* Right Pair */}
                            <g transform="translate(35, 0)">
                                <rect x="-10" y="-40" width="20" height="35" fill="#1a237e" stroke="#0d47a1" strokeWidth="1" />
                                <rect x="-10" y="5" width="20" height="35" fill="#1a237e" stroke="#0d47a1" strokeWidth="1" />
                                <line x1="0" y1="-40" x2="0" y2="40" stroke="#666" strokeWidth="1" />
                            </g>

                            {/* Radiators / Modules */}
                            <rect x="-10" y="-8" width="20" height="16" fill="#ccc" stroke="#666" strokeWidth="1" />
                            <rect x="-5" y="8" width="10" height="10" fill="#eee" stroke="#666" strokeWidth="1" />

                            {/* Red light */}
                            <circle cx="0" cy="0" r="2" fill="red" className="animate-pulse" />
                        </g>
                    </g>
                </motion.g>
            </svg>

            {/* 2nd Offset Orbit for depth */}
            <svg
                className="absolute w-[120vmin] h-[120vmin] opacity-5"
                viewBox="0 0 1000 1000"
                style={{
                    transform: "rotate(45deg)",
                }}
            >
                <circle cx="500" cy="500" r="490" fill="none" stroke="white" strokeWidth="0.5" />
            </svg>
        </div>
    );
};

export default SatelliteOrbit;
