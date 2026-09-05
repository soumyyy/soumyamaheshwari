import type { Project } from "@/data/projects";
import ProjectEntry from "./ProjectEntry";
import groupStyles from "./ProjectGroup.module.css";
import styles from "./CoreProject.module.css";

type Core = Pick<Project, "id" | "name" | "who" | "problem" | "lineage" | "pins" | "writing" | "link" | "github" | "video" | "poster">;

export default function CoreProject({ project }: { project: Core }) {
  return (
    <section className={groupStyles.group} aria-labelledby="core-heading">
      <header className={groupStyles.header}>
        <h2 id="core-heading">the one i keep rebuilding</h2>
        <p>five attempts, one question</p>
      </header>
      <div id={`project-${project.id}`} className={styles.core}>
        <div className={styles.lead}>
          <div className={styles.markers}>
            <span className={styles.number}>01</span>
            <ProjectEntry previewOnly name={project.name} video={project.video} poster={project.poster} />
          </div>
          <h3 className={styles.name}>
            <a href={project.link || project.github || `#project-${project.id}`}>{project.name}</a>
          </h3>
          <p className={styles.who}>{project.who}</p>
          <div className={styles.prose}>
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
          </div>
        </div>
        <div className={styles.history}>
          <h4 className={styles.label}>five attempts</h4>
          <ol className={styles.lineage}>
            {project.lineage?.map((attempt) => (
              <li key={attempt.v}>
                <span className={styles.version}>{attempt.v}</span>
                <div><h5>{attempt.t}</h5><p>{attempt.d}</p></div>
              </li>
            ))}
          </ol>
          <h4 className={styles.label}>what it is plugged into</h4>
          <ul className={styles.pins}>
            {project.pins?.map((pin) => <li key={pin}>{pin}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
