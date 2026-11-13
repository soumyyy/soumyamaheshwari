import Link from "next/link";
import type { CSSProperties } from "react";
import NavDock from "./NavDock";
import styles from "./SiteNav.module.css";

/* `docking` is the landing page: the header starts out absent and the name in
   the hero travels up to become it. Everywhere else it is simply there. */
export default function SiteNav({ docking = false }: { docking?: boolean }) {
    return (
        <nav
            className={styles.nav}
            aria-label="site"
            data-site-nav=""
            data-docking={docking ? "" : undefined}
            style={docking ? ({ "--p": 0 } as CSSProperties) : undefined}
        >
            <Link href="/" className={styles.home} data-nav-name="">soumya maheshwari</Link>
            <div className={styles.links}>
                <a href="mailto:soumyamaheshwari1234@gmail.com" className={styles.open}>
                    <span className={styles.dot} aria-hidden="true" />
                    open to work
                </a>
            </div>
            {docking && <NavDock />}
        </nav>
    );
}
