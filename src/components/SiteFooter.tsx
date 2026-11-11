import BuildLog from "./BuildLog";
import LocalTime from "./LocalTime";
import Plate from "./Plate";
import styles from "./SiteFooter.module.css";

/* The way out. The page ends on the view from a ridge, drawn in characters
   over the photograph itself. The figure stands left of centre looking into
   open sky, so the question sits in that open half. */

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.view}>
        <Plate kind="image" src="/footer/ridge.webp" tone="paper" size={7} focus={0.36}
          label="a figure on a ridge looking out over cloud, drawn in characters"
          className={styles.photo} />
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.over}>
          <div className={`${styles.content} rise`}>
            <p className={styles.kicker}>one more thing.</p>
            <h2 className={styles.heading}>
              got something half built? i&rsquo;d like to see it.
            </h2>
            <div className={styles.actions}>
              <a className={styles.mail} href="mailto:soumyamaheshwari1234@gmail.com">say hello</a>
              <a className={styles.resume} href="/SoumyaMaheshwariResume.pdf" target="_blank" rel="noopener noreferrer">
                resume
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.columns}>
          <div>
            <h3>elsewhere</h3>
            <ul>
              <li><a href="https://twitter.com/soumymaheshwri" target="_blank" rel="noopener noreferrer">x / twitter</a></li>
              <li><a href="https://github.com/soumyyy" target="_blank" rel="noopener noreferrer">github</a></li>
              <li><a href="https://linkedin.com/in/soumya-maheshwari-b194161a3/" target="_blank" rel="noopener noreferrer">linkedin</a></li>
            </ul>
          </div>
          <div className={styles.log}>
            <BuildLog />
          </div>
          <div>
            <h3>here</h3>
            <LocalTime />
          </div>
        </div>
      </div>

      <p className={styles.colophon}>
        <span>soumya maheshwari, 2026</span>
        <span>every picture here is drawn in characters.</span>
      </p>
    </footer>
  );
}
