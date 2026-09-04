"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Play } from "lucide-react";
import { Project } from "@/data/projects";

const gradientMap: Record<string, [string, string]> = {
  "hermes":           ["rgba(235,220,195,0.14)", "rgba(235,220,195,0.03)"], // warm gold parchment
  "eclipsn":          ["rgba(180,195,215,0.12)", "rgba(180,195,215,0.03)"], // steel blue
  "eclipse-obsidian": ["rgba(170,182,195,0.12)", "rgba(170,182,195,0.03)"], // slate
  "eclipse":          ["rgba(195,200,210,0.11)", "rgba(195,200,210,0.03)"], // silver
  "jarvis":           ["rgba(210,205,195,0.11)", "rgba(210,205,195,0.03)"], // warm silver
  "billinsight":      ["rgba(200,210,200,0.12)", "rgba(200,210,200,0.03)"], // pale eucalyptus
  "fulcrum":          ["rgba(232,218,195,0.12)", "rgba(232,218,195,0.03)"], // champagne
  "glai":             ["rgba(210,220,210,0.11)", "rgba(210,220,210,0.03)"], // sage linen
  "room":             ["rgba(238,228,210,0.12)", "rgba(238,228,210,0.03)"], // warm linen
  "shit":             ["rgba(205,200,195,0.11)", "rgba(205,200,195,0.03)"], // warm ash
  "kochimetro":       ["rgba(195,188,182,0.12)", "rgba(195,188,182,0.03)"], // taupe
  "hft":              ["rgba(230,215,185,0.12)", "rgba(230,215,185,0.03)"], // wheat
  "photocortex":      ["rgba(235,225,215,0.12)", "rgba(235,225,215,0.03)"], // parchment
  "stockportfolio":   ["rgba(215,220,210,0.11)", "rgba(215,220,210,0.03)"], // celadon
  "sih-bel":          ["rgba(175,190,205,0.12)", "rgba(175,190,205,0.03)"], // cool steel
  "imagenerve":       ["rgba(225,215,215,0.12)", "rgba(225,215,215,0.03)"], // blush
  "alphafold-nano":   ["rgba(200,215,215,0.11)", "rgba(200,215,215,0.03)"], // mist
  "ace-rl":           ["rgba(185,198,215,0.12)", "rgba(185,198,215,0.03)"], // steel
  "vanshita":         ["rgba(240,232,220,0.11)", "rgba(240,232,220,0.03)"], // cream
  "bykritika":        ["rgba(238,228,218,0.11)", "rgba(238,228,218,0.03)"], // ecru
};

const defaultGradient: [string, string] = ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"];

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [from, to] = gradientMap[project.id] ?? defaultGradient;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      viewport={{ once: true }}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      className="rounded-2xl border border-white/[0.07] overflow-hidden"
    >
      <div className="p-5 md:p-6 flex flex-col gap-4">

        {/* Title + action buttons */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base md:text-lg font-semibold tracking-widest uppercase text-white/90 leading-snug">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/70 transition-colors"
                title="Source"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.link && project.link !== project.github && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/70 transition-colors"
                title="Live"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.video && (
              <a
                href={`/demo/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.14] transition-all text-xs font-medium uppercase tracking-wider"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                Demo
              </a>
            )}
          </div>
        </div>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs text-white/45 border border-white/[0.08] bg-white/[0.04]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-white/45 leading-relaxed">
          {project.longDescription}
        </p>

      </div>
    </motion.div>
  );
}
