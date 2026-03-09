import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import DemoPlayer from "./DemoPlayer";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return projects
    .filter((p) => p.video)
    .map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project?.video) return {};
  return {
    title: `${project.title} — Demo`,
    description: project.description,
  };
}

export default async function DemoPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project?.video) notFound();

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Demo</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-white">
              {project.title}
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">{project.description}</p>
          </div>
          <a
            href="/"
            className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-4"
          >
            soumyamaheshwari.com
          </a>
        </div>

        {/* Video */}
        <div className="w-full aspect-video bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl">
          <DemoPlayer src={project.video} />
        </div>

        {/* Footer links */}
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub →
            </a>
          )}
          {project.link && project.link !== project.github && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Project →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
