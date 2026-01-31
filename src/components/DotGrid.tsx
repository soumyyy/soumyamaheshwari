"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DotGrid = () => {
    const [dots, setDots] = useState<any[]>([]);
    const [currentPhase, setCurrentPhase] = useState<string | null>(null);
    const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const animationStarted = useRef(false);

    const phases = useMemo(() => [
        { id: 'thinkDifferent', text: 'think different' },
        { id: 'thinkBigger', text: 'think bigger' },
        { id: 'skipPerfect', text: 'skip the perfect plan. start. adjust. repeat' },
        { id: 'buildBreak', text: 'build, break, outgrow. then do it again' }
    ], []);

    const generateDots = useMemo(() => {
        const newDots = [];
        const isMobile = (typeof window !== 'undefined') ? window.innerWidth <= 768 : false;
        const spacing = isMobile ? 20 : 25;
        const rows = isMobile ? 12 : 20;
        const columns = isMobile ? 12 : 20;
        const centerX = columns / 2;
        const centerY = rows / 2;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                const xPos = x * spacing;
                const yPos = y * spacing;
                const distanceFromCenter = Math.hypot(x - centerX, y - centerY);

                newDots.push({
                    id: `${x}-${y}`,
                    x: xPos,
                    y: yPos,
                    originalX: xPos,
                    originalY: yPos,
                    distanceFromCenter,
                    row: y,
                    col: x,
                    centerX,
                    centerY,
                    angle: Math.atan2(y - centerY, x - centerX),
                });
            }
        }
        return newDots;
    }, []);

    const dotVariants = useMemo(() => ({
        initial: {
            opacity: 0,
            scale: 0
        },
        animate: (dot: any) => {
            if (!currentPhase) {
                return {
                    x: 0,
                    y: 0,
                    opacity: 0.3,
                    scale: 1,
                    transition: {
                        duration: 0.5,
                        ease: "easeInOut"
                    }
                };
            }

            switch (currentPhase) {
                case 'thinkDifferent':
                    return {
                        scale: 1,
                        opacity: 0.5,
                        x: Math.sin((dot.row - dot.col) * 0.5) * 20,
                        y: Math.cos((dot.row + dot.col) * 0.5) * 20,
                        transition: {
                            duration: 0.8,
                            ease: "easeInOut"
                        }
                    };

                case 'thinkBigger':
                    return {
                        scale: 1,
                        opacity: 0.5,
                        x: Math.cos(dot.angle) * (dot.distanceFromCenter * 4),
                        y: Math.sin(dot.angle) * (dot.distanceFromCenter * 4),
                        transition: {
                            duration: 0.8,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 120,
                            damping: 12
                        }
                    };

                case 'skipPerfect':
                    return {
                        scale: 1,
                        opacity: 0.5,
                        x: Math.sin((dot.row + dot.col) * 0.5) * 30,
                        y: Math.cos((dot.row - dot.col) * 0.5) * 30,
                        transition: {
                            duration: 1.2,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                        }
                    };

                case 'buildBreak':
                    const progress = (dot.angle + Math.PI) / (2 * Math.PI);
                    return {
                        scale: [1, 0],
                        opacity: [0.5, 0],
                        x: Math.cos(dot.angle) * 50,
                        y: Math.sin(dot.angle) * 50,
                        transition: {
                            duration: 0.8,
                            delay: progress * 0.3,
                            ease: [0.4, 0, 0.2, 1]
                        }
                    };

                default:
                    return {
                        x: 0,
                        y: 0,
                        opacity: 0.3,
                        scale: 1
                    };
            }
        }
    }), [currentPhase]);

    const renderDot = useCallback((dot: any) => (
        <motion.div
            key={dot.id}
            className="absolute w-[2px] h-[2px] bg-neutral-400/80 rounded-full"
            initial={dotVariants.initial}
            animate={dotVariants.animate(dot) as any}
            exit={{ opacity: 0, scale: 0 }}
            style={{
                left: `${dot.originalX}px`,
                top: `${dot.originalY}px`,
                willChange: 'transform, opacity'
            }}
        />
    ), [dotVariants]);

    useEffect(() => {
        setDots(generateDots);
    }, [generateDots]);

    const startInitialAnimation = useCallback(() => {
        const runSequence = async () => {
            setCurrentPhase(null);
            await new Promise(resolve => setTimeout(resolve, 300));
            for (const phase of phases) {
                setCurrentPhase(phase.id);
                await new Promise(resolve => setTimeout(resolve, 1800));
            }
            setCurrentPhase(null);
            setIsInitialAnimationComplete(true);
        };
        runSequence();
    }, [phases]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animationStarted.current) {
                    setIsInView(true);
                    animationStarted.current = true;
                    startInitialAnimation();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, [startInitialAnimation]);

    return (
        <div ref={sectionRef} className="w-full max-w-7xl mx-auto min-h-[50vh] flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-12 items-center px-6 py-12 md:py-0">
            {/* Mobile Title - Visible only on mobile */}
            <h2 className="md:hidden text-4xl font-bold tracking-tighter text-white leading-tight text-left w-full mb-4">
                working <br />
                <span className="text-neutral-500">philosophy</span>
            </h2>

            {/* Left: Interactive Grid */}
            <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] flex items-center justify-center overflow-hidden mb-4 md:mb-0">
                <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px] mx-auto">
                    <AnimatePresence>
                        {dots.map(renderDot)}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right: Philosophy & Controls */}
            <div className="flex flex-col justify-center items-start space-y-6 md:space-y-10 pl-0 md:pl-10 w-full">
                {/* Desktop Title - Visible only on desktop */}
                <h2 className="hidden md:block text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight text-left">
                    working <br />
                    <span className="text-neutral-500">philosophy</span>
                </h2>

                <div className="flex flex-col items-start gap-3 border-l border-neutral-900 pl-6 w-full">
                    {phases.map((phase) => (
                        <button
                            key={phase.id}
                            onClick={() => isInitialAnimationComplete && setCurrentPhase(phase.id)}
                            disabled={!isInitialAnimationComplete}
                            className={`text-left text-base md:text-xl transition-all duration-300 font-light hover:translate-x-2
                ${currentPhase === phase.id
                                    ? 'text-white font-medium scale-105 origin-left'
                                    : 'text-neutral-600 hover:text-neutral-300'
                                }
                ${!isInitialAnimationComplete ? 'cursor-not-allowed opacity-30 px-0' : 'cursor-pointer'}
              `}
                        >
                            {phase.text}
                        </button>
                    ))}
                </div>

                {!isInitialAnimationComplete && (
                    <div className="text-xs font-mono text-neutral-800 animate-pulse pl-6">
                      // initializing neural grid...
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(DotGrid);
