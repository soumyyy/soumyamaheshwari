import DotField from "./DotField";
import styles from "./Philosophy.module.css";

// This section sits between the project ledger and the contact line, so its job
// is the question the ledger leaves open: not what he built, but what he is like
// to build with. Earlier drafts listed facts about individual projects, which
// the ledger above already covers at length. These are habits instead, and each
// one is falsifiable against the record.
const NOTES = [
  {
    n: "01",
    text: "i build the smallest thing i would use myself",
    gloss: "an audience of one is a low bar, and a very honest one",
  },
  {
    n: "02",
    text: "i rewrite instead of patching",
    gloss: "the same agent five times over, each rewrite keeping the question and dropping the answer",
  },
  {
    n: "03",
    text: "the problem picks the language",
    gloss: "rust for the backtester, typescript for the screens, python for anything with a model in it",
  },
  {
    n: "04",
    text: "i would rather run it than rent it",
    gloss: "the photos on my own machine, the agent on my own server. slower, and mine.",
  },
];

export default function Philosophy() {
  return (
    <section id="philosophy" className={styles.section} aria-labelledby="philosophy-heading">
      <div className={styles.field} aria-hidden="true">
        <DotField />
      </div>
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id="philosophy-heading">how i work</h2>
          <p>not values, habits</p>
        </header>
        <ol className={styles.notes}>
          {NOTES.map((note) => (
            <li key={note.n}>
              <span className={styles.n} aria-hidden="true">{note.n}</span>
              <p className={styles.text}>{note.text}</p>
              <p className={styles.gloss}>{note.gloss}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
