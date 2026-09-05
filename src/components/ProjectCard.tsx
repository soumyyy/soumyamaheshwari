"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import { Project } from "@/data/projects";

const tintMap: Record<string, string> = {
  "hermes":           "235,220,195",
  "eclipsn":          "180,195,215",
  "eclipse-obsidian": "170,182,195",
  "eclipse":          "195,200,210",
  "jarvis":           "210,205,195",
  "billinsight":      "200,210,200",
  "fulcrum":          "232,218,195",
  "glai":             "210,220,210",
  "room":             "238,228,210",
  "shit":             "205,200,195",
  "kochimetro":       "195,188,182",
  "hft":              "230,215,185",
  "photocortex":      "235,225,215",
  "stockportfolio":   "215,220,210",
  "sih-bel":          "175,190,205",
  "imagenerve":       "225,215,215",
  "alphafold-nano":   "200,215,215",
  "ace-rl":           "185,198,215",
  "vanshita":         "240,232,220",
  "bykritika":        "238,228,218",
};
const DEFAULT_TINT = "255,255,255";

export default function ProjectCard({ project }: { project: Project }) {
  const tint = tintMap[project.id] ?? DEFAULT_TINT;

  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const enterT = useRef<number | null>(null);
  const leaveT = useRef<number | null>(null);

  useEffect(() => {
    // Reading matchMedia must happen post-mount, not during render, to avoid a
    // server/client hydration mismatch — this one-time sync from a browser API
    // into state is exactly what this effect is for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    return () => {
      if (enterT.current) window.clearTimeout(enterT.current);
      if (leaveT.current) window.clearTimeout(leaveT.current);
    };
  }, []);

  const onEnter = () => {
    if (!canHover) return;
    if (leaveT.current) window.clearTimeout(leaveT.current);
    enterT.current = window.setTimeout(() => setHovered(true), 120);
  };

  const onLeave = () => {
    if (!canHover) return;
    if (enterT.current) window.clearTimeout(enterT.current);
    leaveT.current = window.setTimeout(() => { setHovered(false); setExpanded(false); }, 80);
  };

  const open = hovered || expanded;

  return (
    <article
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: `linear-gradient(135deg, rgba(${tint},${open ? 0.22 : 0.05}) 0%, rgba(${tint},0.02) 100%)`,
      }}
      className={`absolute inset-x-0 top-0 rounded-2xl border p-5 md:p-6 flex flex-col gap-3
        transition-[transform,background,border-color,box-shadow] duration-200 ease-out
        motion-reduce:transition-none
        ${open
          ? "z-20 border-white/20 shadow-2xl shadow-black/60 md:scale-[1.02] motion-reduce:md:scale-100"
          : "z-0 border-white/[0.07]"}`}
    >
      <div className="flex items-start gap-3">
        {project.poster && (
          <div className="relative shrink-0 w-[88px] h-[50px] rounded-md overflow-hidden border border-white/10">
            <Image src={project.poster} alt="" fill sizes="88px" className="object-cover" />
          </div>
        )}
        <h3 className="label text-base text-white/90 leading-snug flex-1">{project.title}</h3>
        <div className="flex items-center gap-2 shrink-0 text-white/30">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
               className="hover:text-[var(--accent)] transition-colors" aria-label="Source">
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.link && project.link !== project.github && (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
               className="hover:text-[var(--accent)] transition-colors" aria-label="Live">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-white/45 leading-relaxed lowercase">{project.description}</p>

      <div className="label text-xs text-white/35">
        {project.techStack.slice(0, 4).join(" · ")}
      </div>

      {open && (
        <p className="text-sm text-white/55 leading-relaxed lowercase line-clamp-3">
          {project.longDescription}
        </p>
      )}
    </article>
  );
}
