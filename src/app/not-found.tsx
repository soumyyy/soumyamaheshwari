import Link from "next/link";
import Plate from "@/components/Plate";
import SiteNav from "@/components/SiteNav";
import styles from "./work/work.module.css";

export default function NotFound() {
    return (
        <main className={styles.main}>
            <SiteNav />
            <div className={styles.lost}>
                <Plate kind="corona" boot label="a total eclipse, drawn in characters" className={styles.lostPlate} />
                <p className={styles.kicker}>404</p>
                <h1>roads? where we&rsquo;re going, we don&rsquo;t need roads.</h1>
                <p>this one does not exist, though. not yet.</p>
                <Link href="/" className={styles.back}>back to the start</Link>
            </div>
        </main>
    );
}
