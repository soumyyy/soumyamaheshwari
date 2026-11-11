/// <reference types="react/canary" />
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { projects } from "@/data/projects";
import { GROUPS, LINEAGE_DETAIL, MORE, find, numberOf, plateFor } from "@/data/work";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Plate from "@/components/Plate";
import Fig from "@/components/Fig";
import Scramble from "@/components/Scramble";
import Reel from "@/components/Reel";
import styles from "../work.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
    return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = find(slug);
    if (!project) return {};
    return {
        title: `${project.name} · soumya maheshwari`,
        description: project.summary || project.problem[0],
    };
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = find(slug);
    if (!project) notFound();

    const plate = plateFor(project);
    const group = GROUPS.find((entry) => entry.section === project.section)!;
    const more = MORE[project.id] ?? [];
    const [lead, ...problem] = project.problem;

    return (
        <main className={styles.main}>
            <SiteNav />

            <header className={styles.projectHead}>
                <Link href="/work" className={styles.back}>all work</Link>
                <div className={styles.projectTitle}>
                    <p className={styles.kicker}>
                        <Scramble>{`${numberOf(project.id)} · ${group.title}`}</Scramble>
                    </p>
                    <h1>
                        <ViewTransition name={`name-${project.id}`}>
                            <span>{project.name}</span>
                        </ViewTransition>
                    </h1>
                    <p className={styles.projectWho}>{project.who}</p>

                    <dl className={styles.meta}>
                        {project.stack && <div><dt>built with</dt><dd>{project.stack}</dd></div>}
                        {project.note && <div><dt>status</dt><dd className={styles.lit}>{project.note}</dd></div>}
                        {(project.github || project.link) && (
                            <div>
                                <dt>links</dt>
                                <dd className={styles.links}>
                                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">live</a>}
                                    {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">source</a>}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>

                <figure className={`${styles.projectPlate} ${project.id === "eclipse" ? styles.mark : ""}`}>
                    <Plate {...plate} tone={plate.kind === "image" ? "paper" : "light"} boot
                        size={project.id === "eclipse" ? 7 : 9} className={styles.plate} />
                    <Fig n={numberOf(project.id)}>{plate.caption}</Fig>
                </figure>
            </header>

            <article className={styles.body}>
                <p className={styles.lead}>{lead}</p>
                {problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

                {project.lineage && (
                    <section className="rise">
                        <h2>five attempts</h2>
                        <ol className={styles.lineage}>
                            {project.lineage.map((attempt) => (
                                <li key={attempt.v}>
                                    <span className={styles.version}>{attempt.v}</span>
                                    <div>
                                        <h3>{attempt.t}</h3>
                                        <p>{attempt.d}</p>
                                        {LINEAGE_DETAIL[attempt.v] && <p className={styles.detail}>{LINEAGE_DETAIL[attempt.v]}</p>}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}

                {project.pins && (
                    <section className="rise">
                        <h2>what it is plugged into</h2>
                        <ul className={styles.pins}>
                            {project.pins.map((pin) => <li key={pin}>{pin}</li>)}
                        </ul>
                    </section>
                )}

                {more.map((section) => (
                    <section key={section.h} className="rise">
                        <h2>{section.h}</h2>
                        {section.p.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </section>
                ))}

                {project.video && (
                    <section className="rise">
                        <h2>watch it</h2>
                        <video
                            className={styles.video}
                            data-orientation={project.videoOrientation ?? "landscape"}
                            src={project.video}
                            poster={project.poster}
                            controls
                            playsInline
                            preload="none"
                        />
                    </section>
                )}

                {project.shots && (
                    <section className="rise">
                        <h2>what it looks like</h2>
                        <div className={styles.shots}>
                            {project.shots.map((shot) => (
                                <figure key={shot.src}>
                                    <Image src={shot.src} alt={shot.alt} width={shot.w} height={shot.h}
                                        sizes="(min-width: 860px) 360px, 80vw" />
                                    <figcaption>{shot.caption}</figcaption>
                                </figure>
                            ))}
                        </div>
                    </section>
                )}

                {project.writing?.map((piece) => (
                    <a key={piece.url} className={`${styles.writing} rise`} href={piece.url}
                        target="_blank" rel="noopener noreferrer">
                        <span className={styles.writingLabel}>wrote about this</span>
                        <span className={styles.writingTitle}>{piece.title}</span>
                        <span className={styles.writingExcerpt}>{piece.excerpt}</span>
                        <span className={styles.writingMeta}>{piece.handle} · {piece.date} · read on x →</span>
                    </a>
                ))}
            </article>

            <section className={styles.reel} aria-label="more work">
                <Reel current={project.id} />
            </section>

            <SiteFooter />
        </main>
    );
}
