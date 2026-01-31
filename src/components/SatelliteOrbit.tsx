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
                className="w-[85vmin] h-[85vmin] opacity-60 absolute"
                viewBox="0 0 1000 1000"
                style={{
                    transform: "rotate(-15deg)", // Tilted orbit
                }}
            >
                {/* The Orbit Line */}
                <circle
                    cx="500"
                    cy="500"
                    r="450" // Radius
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="10 20"
                    className="text-neutral-600"
                />

                {/* The Satellite (ISS) */}
                {/* We animate the rotation of a group focused at center */}
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 40, // Slow, majestic orbit
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{ originX: "500px", originY: "500px" }} // Rotate around center
                >
                    {/* Satellite Positioned on the ring (cx + r = 950) */}
                    <g transform="translate(950, 500) rotate(90)">
                        {/* ISS Style SVG */}

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
