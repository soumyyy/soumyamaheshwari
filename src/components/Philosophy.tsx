import DotField from "./DotField";
import styles from "./Philosophy.module.css";

// Four true things, stated plainly. This section used to animate a grid of dots
// behind a heading; the dots were too faint to see and said nothing. The facts
// were always the content, so they are the type now.
const NOTES = [
  {
    n: "01",
    text: "everything i touch gets ingested overnight",
    gloss: "mail, sleep, orders, the journal. by morning the agent already knows",
  },
  {
    n: "02",
    text: "a rust backtester, on a macbook, because why not",
    gloss: "the point was never a profitable strategy",
  },
  {
    n: "03",
    text: "thirty days from an idea to the app store",
    gloss: "it started as something i thought only i would use",
  },
  {
    n: "04",
    text: "five attempts at the same agent, so far",
    gloss: "each rewrite kept the question and threw away the answer",
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
          <h2 id="philosophy-heading">working philosophy</h2>
          <p>four true things</p>
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
