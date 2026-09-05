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
            heading={project.link ? <a href={project.link} target="_blank" rel="noopener noreferrer">{project.name}</a> : project.name}
            github={project.github}
            liveUrl={project.link}
            subtitle={project.who}
            summary={project.summary}
            credit={<><span>{project.stack}</span>{project.note && <span>{project.note}</span>}</>}
          >
            {project.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {project.writing?.map((piece) => (
              <a key={piece.url} className={styles.writing} href={piece.url}
                 target="_blank" rel="noopener noreferrer">
                <span className={styles.writingLabel}>wrote about this</span>
                <span className={styles.writingTitle}>{piece.title}</span>
                <span className={styles.writingExcerpt}>{piece.excerpt}</span>
                <span className={styles.writingMeta}>
                  {piece.handle} &middot; {piece.date} &middot; read on x &rarr;
                </span>
              </a>
            ))}
          </ProjectEntry>
        ))}
      </div>
    </section>
  );
}
