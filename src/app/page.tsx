/// <reference types="react/canary" />
import Link from "next/link";
import { ViewTransition } from "react";
import { find, plateFor } from "@/data/work";
import Plate from "@/components/Plate";
import Reel from "@/components/Reel";
import Fig from "@/components/Fig";
import Scramble from "@/components/Scramble";
import SiteNav from "@/components/SiteNav";
import ContributionGrid from "@/components/ContributionGrid";
import Education from "@/components/Education";
import SiteFooter from "@/components/SiteFooter";
import LocalTime from "@/components/LocalTime";
import KonamiBoost from "@/components/KonamiBoost";
import ExperienceItem from "@/components/ExperienceItem";
import styles from "./home.module.css";

export default function Home() {
    const eclipse = find("eclipse")!;

    return (
        <main className={styles.main}>
            <KonamiBoost />
            <SiteNav docking />

            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <div className={styles.ident}>
                        <span className={styles.nameSlot} data-name-slot="">soumya maheshwari</span>
                        <LocalTime />
                    </div>

                    <h1 className={styles.headline}>
                        i build things now and then. come in.
                    </h1>

                    <p className={styles.lede}>
                        agents, ios apps, saas tools, backtesting engines, a few things for
                        clients and a few for myself. plus the plumbing they all ended up needing.
                    </p>
                </div>

                <figure className={styles.reactor}>
                    <div className={styles.glow} aria-hidden="true" />
                    <Plate kind="reactor" boot size={8} label="an arc reactor drawn in characters, turning slowly" className={styles.reactorPlate} />
                    <Fig n="01" boosted="1.21 gigawatts.">power source.</Fig>
                </figure>
            </section>

            <section id="about" className={styles.section}>
                <h2 className={styles.kicker}><Scramble>who lives here</Scramble></h2>
                <div className={styles.about}>
                    <figure className={styles.portrait}>
                        <Plate kind="image" src="/portrait-wide.webp" tone="paper" size={7}
                            label="a portrait of soumya, drawn in characters" className={styles.portraitPlate} />
                        <Fig n="02">the tenant.</Fig>
                    </figure>
                    <div className={`${styles.prose} rise`}>
                        <p>
                            i&rsquo;m soumya. i spent two years in founders&rsquo; offices at a fintech and a
                            healthtech startup, translating what the business needed into what the engineers
                            built. somewhere in there i got tired of writing the spec and handing it over.
                        </p>
                        <p className={styles.quiet}>
                            now most of my energy goes into agents, ai tooling, and prototypes that take a
                            weekend. cloud, infra, web, ios, ml, whatever the thing needs. i mostly want to
                            know how it works.
                        </p>
                    </div>
                </div>
            </section>

            <section id="eclipse" className={styles.section}>
                <h2 className={styles.kicker}><Scramble>the one i keep rebuilding</Scramble></h2>
                <div className={styles.core}>
                    <figure className={styles.corePlate}>
                        <Plate {...plateFor(eclipse)} tone="paper" size={7} className={styles.squarePlate} />
                        <Fig n="03">the fifth one.</Fig>
                    </figure>
                    <div className="rise">
                        <h3 className={styles.coreName}>
                            <Link href="/work/eclipse">
                                <ViewTransition name="name-eclipse"><span>eclipse</span></ViewTransition>
                            </Link>
                        </h3>
                        <p className={styles.who}>{eclipse.who}</p>
                        <p className={styles.coreBody}>{eclipse.problem[0]}</p>
                        <p className={styles.coreBody}>
                            every part of it has been replaced at least once. i still call it the same agent.
                        </p>
                        <Link href="/work/eclipse" className={styles.go}>the five rewrites</Link>
                    </div>
                </div>
            </section>

            <section id="work" className={styles.reelSection}>
                <h2 className={`${styles.kicker} ${styles.reelKicker}`}><Scramble>on the wall</Scramble></h2>
                <Reel />
            </section>

            <section id="experience" className={styles.section}>
                <h2 className={styles.kicker}><Scramble>experience</Scramble></h2>
                <div className={`${styles.experience} rise`}>
                    <ExperienceItem
                        company="Komma Financial Technologies"
                        role="Founder’s Office"
                        date="Nov 2022 – Jan 2024"
                        location="Gurugram | Pune"
                        summary="Simplifying investing by developing personal finance tools that make managing money easier."
                        bullets={[
                            "Worked directly with early-stage founders to drive day-to-day execution across operations and product, standardizing internal SOPs.",
                            "Owned the translation of business and financial requirements into product flows, collaborating closely with engineers to ship website and internal tool updates.",
                            "Spearheaded a cross-functional team of interns across analytics, marketing, and fintech research, setting workstreams, reviewing outputs, and driving execution against clear deliverables.",
                        ]}
                    />
                    <ExperienceItem
                        company="BabyKavach"
                        role="Founder’s Office"
                        date="Jan 2024 – Jan 2025"
                        location="Gurugram"
                        summary="Building a suite of digital healthcare services to help parents with vaccinations and medical records."
                        bullets={[
                            "Conceptualized and managed the roadmap for components, translating complex health metrics into actionable user insights in React.",
                            "Worked on Go-to-Market strategy for the brand’s digital presence; managed ad budgets and content operations to drive initial user acquisition and engagement.",
                            "Worked the end-to-end development of the brand website and application, optimizing the User Journey (UX) to serve as the primary lead generation funnel.",
                        ]}
                    />
                    <ExperienceItem
                        company="Freelance"
                        role="Product & engineering"
                        date="Ongoing"
                        location="Remote"
                        summary="Websites, apps and tools for clients who needed something built end to end."
                        bullets={[
                            "Built and shipped websites and mobile apps for individual clients, from first conversation to launch.",
                            "Turned loosely described needs into working products: an invoice and expense pipeline, a photo archive, brand sites for independent creators.",
                            "Owned design, build and hand-over, so each client ended up with something they could run without me.",
                        ]}
                    />
                    <ExperienceItem
                        company="Financial modeling & valuation"
                        role="Freelance · for a client"
                        date="Jul – Aug 2026"
                        location="Remote"
                        summary="Financial models and valuations for startups getting ready to raise money."
                        bullets={[
                            "Built financial models for startups that were about to raise, so their numbers could stand up to an investor's questions.",
                            "Valued the businesses to help set what they could ask for and how to defend it.",
                            "Wrote up the assumptions behind every figure in plain language, so the founders could explain them without me.",
                        ]}
                    />
                </div>
            </section>

            <ContributionGrid />
            <Education />
            <SiteFooter />
        </main>
    );
}
