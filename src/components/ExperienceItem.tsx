import styles from "./ExperienceItem.module.css";

/* A native disclosure. It opens without script, is keyboard operable for free,
   and the browser animates the height where it can. */
export default function ExperienceItem({ company, role, date, location, summary, bullets }: {
    company: string; role: string; date: string; location: string; summary: string; bullets: string[];
}) {
    return (
        <details className={styles.item}>
            <summary>
                <span className={styles.head}>
                    <span className={styles.company}>{company}</span>
                    <span className={styles.date}>{date}</span>
                </span>
                <span className={styles.role}>{role} · {location}</span>
                <span className={styles.summary}>{summary}</span>
                <span className={styles.more}>what i did here</span>
            </summary>
            <ul>
                {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
        </details>
    );
}
