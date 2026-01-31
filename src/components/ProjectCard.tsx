"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Code2 } from "lucide-react";
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
            className="group relative border-l-2 border-neutral-900 pl-6 md:pl-10 py-6 transition-colors hover:border-neutral-700"
        >
            <div className="absolute -left-[9px] top-8 h-4 w-4 rounded-full bg-neutral-900 group-hover:bg-neutral-500 transition-colors" />

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-white">
                                {project.title}
                            </h3>

                            {/* Icons moved here */}
                            <div className="flex items-center gap-2">
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
                            </div>
                        </div>

                        <div className="hidden md:block h-1 w-1 bg-neutral-800 rounded-full" />

                        <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                            {project.techStack?.map((tech) => (
                                <span key={tech} className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-base text-neutral-400 leading-relaxed text-balance">
                        {project.longDescription}
                    </p>

                    {project.video && (
                        <div className="mt-6 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/50">
                            <video
                                src={project.video}
                                controls
                                className="w-full h-auto max-h-[400px] object-cover"
                                poster={project.image}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
