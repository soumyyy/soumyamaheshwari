"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Play } from "lucide-react";
import { Project } from "@/data/projects";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative md:border-l-2 md:border-neutral-900 pl-2 md:pl-10 py-3 md:py-6 transition-colors md:hover:border-neutral-700"
        >
            <div className="hidden md:block absolute -left-[9px] top-8 h-4 w-4 rounded-full bg-neutral-900 group-hover:bg-neutral-500 transition-colors" />

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
                            <a
                                href={`/demo/${project.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors font-medium text-xs uppercase tracking-wider"
                                title="Watch Demo"
                            >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Demo</span>
                            </a>
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
                <p className="text-sm md:text-base text-neutral-400 leading-relaxed line-clamp-3 md:line-clamp-none">
                    {project.longDescription}
                </p>
            </div>
        </motion.div>
    );
}
