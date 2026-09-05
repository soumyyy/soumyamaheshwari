import type { Project } from "@/data/projects";
import ProjectEntry from "./ProjectEntry";
import styles from "./ProjectGroup.module.css";

export default function ProjectGroup({
  id, title, count, projects, startNumber,
}: {
  id: string;
  title: string;
  count: string;
  projects: Project[];
  startNumber: number;
}) {
  return (
    <section className={styles.group} aria-labelledby={`${id}-heading`}>
      <header className={styles.header}>
        <h2 id={`${id}-heading`}>{title}</h2>
        <p>{count}</p>
      </header>
      <div className={styles.grid}>
        {projects.map((project, index) => (
          <ProjectEntry
            key={project.id}
            id={project.id}
            number={startNumber + index}
            name={project.name}
            video={project.video}
            poster={project.poster}
            heading={<a href={project.link || project.github || `#project-${project.id}`}>{project.name}</a>}
            subtitle={project.who}
            summary={project.summary}
            credit={<><span>{project.stack}</span>{project.note && <span>{project.note}</span>}</>}
          >
            {project.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </ProjectEntry>
        ))}
      </div>
    </section>
  );
}
