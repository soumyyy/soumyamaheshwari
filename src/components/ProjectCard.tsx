"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Code2, Play, X } from "lucide-react";
import { Project } from "@/data/projects";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Close modal on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsModalOpen(false);
        };
        if (isModalOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isModalOpen]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isModalOpen]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative border-l-2 border-neutral-900 pl-6 md:pl-10 py-6 transition-colors hover:border-neutral-700"
            >
                <div className="absolute -left-[9px] top-8 h-4 w-4 rounded-full bg-neutral-900 group-hover:bg-neutral-500 transition-colors" />

                <div className="flex flex-col gap-3 w-full">
                    {/* Row 1: Title & Buttons */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-white">
                            {project.title}
                        </h3>

                        <div className="flex items-center gap-3">
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-500 hover:text-white transition-colors"
                                    title="View Source"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                            )}
                            {project.link && project.link !== project.github && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-500 hover:text-white transition-colors"
                                    title="Visit Project"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            )}
                            {project.video && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors font-medium text-xs uppercase tracking-wider group/btn"
                                    title="Watch Demo"
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>Demo</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Tags */}
                    <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                        {project.techStack?.map((tech) => (
                            <span key={tech} className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800">
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Row 3: Description */}
                    <p className="text-base text-neutral-400 leading-relaxed text-balance">
                        {project.longDescription}
                    </p>
                </div>
            </motion.div>

            {/* Video Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-neutral-800"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <video
                                src={project.video}
                                className="w-full h-full object-contain"
                                controls
                                autoPlay
                                playsInline
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
