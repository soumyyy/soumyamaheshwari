import Image from "next/image";
import BuildLog from "./BuildLog";
import styles from "./SiteFooter.module.css";

/* The page ends on the view rather than on a rule. The photograph is blurred
   in the asset itself, not with a css filter, so nothing is repainted while
   the page scrolls and the file stays under 30kb.

   The subject stands left of centre looking into open sky, so on a wide screen
   the type sits in that open half and the figure keeps its own. Below 820px
   there is no room for two halves, so the frame crops to the figure and the
   scrim turns vertical, with the type under it. */

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.photo} aria-hidden="true">
        <Image
          src="/footer/ridge.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={70}
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <h2 className={styles.heading}>
            building something strange? i&rsquo;d like to hear about it.
          </h2>

          <a className={styles.mail} href="mailto:soumyamaheshwari1234@gmail.com">
            &lt;mail me&gt;
          </a>

          <a className={styles.resume} href="/SoumyaMaheshwariResume.pdf" target="_blank" rel="noopener noreferrer">
            view resume
          </a>

          <div className={styles.log}>
            <BuildLog />
          </div>

          <ul className={styles.social}>
            <li>
              <a href="https://twitter.com/soumymaheshwri" target="_blank" rel="noopener noreferrer">x / twitter</a>
            </li>
            <li>
              <a href="https://github.com/soumyyy" target="_blank" rel="noopener noreferrer">github</a>
            </li>
            <li>
              <a href="https://linkedin.com/in/soumya-maheshwari-b194161a3/" target="_blank" rel="noopener noreferrer">linkedin</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
