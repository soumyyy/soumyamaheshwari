/// <reference types="react/canary" />
import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { projects } from "@/data/projects";
import { GROUPS, numberOf } from "@/data/work";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import styles from "./work.module.css";

export const metadata: Metadata = {
    title: "work · soumya maheshwari",
    description: "everything i built, grouped by who it was for.",
};

export default function Work() {
    return (
        <main className={styles.main}>
            <SiteNav />
            <header className={styles.masthead}>
                <p className={styles.kicker}>{`index · ${projects.length} entries`}</p>
                <h1>things i built</h1>
                <p>
                    grouped by who they were for. one i keep rebuilding, a few people paid for, and
                    some just answered a question and stopped.
                </p>
            </header>

            {GROUPS.map((group) => {
                const items = projects.filter((project) => project.section === group.section);
                if (items.length === 0) return null;
                return (
                    <section key={group.section} className={styles.group} aria-labelledby={`group-${group.section}`}>
                        <header className={styles.groupHead}>
                            <h2 id={`group-${group.section}`}>{group.title}</h2>
                            <p>{items.length === 1 ? group.blurb : `${items.length} projects, ${group.blurb}`}</p>
                        </header>
                        <ul className={styles.rows}>
                            {items.map((project) => (
                                <li key={project.id} className={`${styles.row} rise`}>
                                    <span className={styles.number}>{numberOf(project.id)}</span>
                                    <h3 className={styles.name}>
                                        <Link href={`/work/${project.id}`}>
                                            <ViewTransition name={`name-${project.id}`}>
                                                <span>{project.name}</span>
                                            </ViewTransition>
                                        </Link>
                                    </h3>
                                    <p className={styles.who}>{project.who}</p>
                                    <p className={styles.summary}>{project.summary || project.problem[0]}</p>
                                    <span className={styles.arrow} aria-hidden="true">→</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                );
            })}

            <SiteFooter />
        </main>
    );
}
