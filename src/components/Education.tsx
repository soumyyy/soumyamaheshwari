import styles from "./Education.module.css";

// Two degrees from one integrated programme, so the school is stated once in
// the header rather than repeated on both rows.
const DEGREES = [
  { name: "b.tech", field: "artificial intelligence and machine learning" },
  { name: "mba (tech)", field: "finance" },
];

export default function Education() {
  return (
    <section className={styles.section} aria-labelledby="education-heading">
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id="education-heading">education</h2>
          <p>nmims mpstme, mumbai</p>
        </header>
        <ul className={styles.list}>
          {DEGREES.map((degree) => (
            <li key={degree.name}>
              <span className={styles.name}>{degree.name}</span>
              <span className={styles.field}>{degree.field}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
