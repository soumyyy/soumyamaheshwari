import { getContributions } from "@/lib/github";
import styles from "./ContributionGrid.module.css";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export default async function ContributionGrid() {
  const data = await getContributions();
  if (!data) return null;

  // One label per month, placed on the column holding that month's first cell.
  const found: { column: number; text: string }[] = [];
  data.days.forEach((day, index) => {
    if (index >= data.columns) return; // the first weekday row is enough to date every column
    const month = Number(day.date.slice(5, 7)) - 1;
    if (found.length === 0 || found[found.length - 1].text !== MONTHS[month]) {
      found.push({ column: index + 1, text: MONTHS[month] });
    }
  });
  // The window opens mid month, so the first month often owns a single column
  // and its label collides with the next one. Where two sit within three
  // columns, the later month is the one with room to be read.
  const labels = found.filter((label, index) => {
    const next = found[index + 1];
    return !next || next.column - label.column >= 3;
  });

  return (
    <section className={styles.section} aria-labelledby="contributions-heading">
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id="contributions-heading">what this looks like day to day</h2>
          <p>{data.total.toLocaleString("en-US")} contributions in the last year</p>
        </header>

        <div className={styles.plot}>
          <div className={styles.months} style={{ gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))` }}>
            {labels.map((label) => (
              <span key={label.text + label.column} style={{ gridColumn: label.column }}>
                {label.text}
              </span>
            ))}
          </div>
          <div
            className={styles.grid}
            style={{ gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))` }}
            role="img"
            aria-label={`github contribution grid for the last year, ${data.total} contributions in total`}
          >
            {data.days.map((day) => (
              <span key={day.date} className={styles.day} data-level={day.level} />
            ))}
          </div>
        </div>

        <p className={styles.foot}>
          <a href="https://github.com/soumyyy" target="_blank" rel="noopener noreferrer">
            github.com/soumyyy &rarr;
          </a>
        </p>
      </div>
    </section>
  );
}
