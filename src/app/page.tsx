import { projects } from "@/data/projects";
import CoreProject from "@/components/CoreProject";
import ProjectGroup from "@/components/ProjectGroup";
import styles from "./projects.module.css";
import Philosophy from "@/components/Philosophy";
import ContributionGrid from "@/components/ContributionGrid";
import Education from "@/components/Education";
import SiteFooter from "@/components/SiteFooter";
import OrbitField from "@/components/OrbitField";
import LocalTime from "@/components/LocalTime";
import KonamiBoost from "@/components/KonamiBoost";
import ExperienceItem from "@/components/ExperienceItem";
import FlipLink from "@/components/FlipLink";
import Portrait from "@/components/Portrait";


const GROUPS = [
    { section: "one" as const, id: "audience-one", title: "an audience of one",
      count: (n: number) => `${n === 4 ? "four" : n} projects, one user each` },
    { section: "someone" as const, id: "audience-someone", title: "an audience of someone else",
      count: (n: number) => `${n === 2 ? "two" : n} projects, real users` },
    { section: "hackathon" as const, id: "hackathon", title: "hackathon bs",
      count: () => "two smart india hackathons" },
    { section: "client" as const, id: "client-work", title: "client work",
      count: (n: number) => `${n === 3 ? "three" : n} projects, paid for` },
    { section: "question" as const, id: "audience-question", title: "sometimes the question was enough",
      count: (n: number) => `${n === 4 ? "four" : n} projects, four questions` },
];

export default function Home() {
    let running = 1 + projects.filter(p => p.section === "core").length;
    const startNumbers: Record<string, number> = {};
    for (const group of GROUPS) {
        startNumbers[group.section] = running;
        running += projects.filter(p => p.section === group.section).length;
    }

    return (
        <main className="min-h-screen flex flex-col items-center bg-black selection:bg-white selection:text-black">
            <KonamiBoost />

            {/* Background texture blobs. give backdrop-blur something to blur */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-60 -right-60 w-[800px] h-[800px] rounded-full opacity-[0.045]"
                    style={{ background: 'radial-gradient(circle, rgba(218,196,148,1) 0%, transparent 65%)' }} />
                <div className="absolute top-[40%] -left-80 w-[700px] h-[700px] rounded-full opacity-[0.03]"
                    style={{ background: 'radial-gradient(circle, rgba(160,178,210,1) 0%, transparent 65%)' }} />
                <div className="absolute -bottom-60 right-[20%] w-[600px] h-[600px] rounded-full opacity-[0.03]"
                    style={{ background: 'radial-gradient(circle, rgba(190,175,155,1) 0%, transparent 65%)' }} />
            </div>

            {/* Navigation / Flip Buttons */}
            <nav className="fixed top-6 left-6 right-6 md:left-12 md:right-12 z-50 flex justify-end items-center gap-4">
                <div className="flex gap-4">
                    {/* Blog Button - Commented out but codebase ready */}
                    {/*
             <a href="/blog" className="hidden md:flex items-center text-sm font-medium text-neutral-500 hover:text-white transition-colors">
                blog
             </a>
             */}
                    <FlipLink href="mailto:soumyamaheshwari1234@gmail.com">
                        open to work
                    </FlipLink>
                </div>
            </nav>

            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6">
                <OrbitField />

                <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8">
                    <div className="flex flex-col gap-1">
                        <span className="label text-neutral-500">soumya maheshwari</span>
                        <span className="label text-neutral-600">agentic systems · product builder</span>
                        <LocalTime />
                                </div>

                    {/* No `lowercase` class here: the line is written lowercase, so the
                        one word that carries capitals keeps them. */}
                    <h1 className="font-display text-balance text-4xl leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
                        agents, ios apps, infra, SaaS, backtester and finance.
                    </h1>

                    <p className="max-w-xl text-base leading-relaxed text-neutral-400 lowercase md:text-lg">
                        i start building because i&rsquo;m curious and stop when it works.
                    </p>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="w-full max-w-5xl px-4 md:px-6 py-24 md:py-40 border-t border-neutral-900">
                <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
                    <div className="flex flex-col gap-8">
                        <h2 className="label sticky top-24 text-neutral-500">intro</h2>
                        <Portrait />
                    </div>
                    <div className="space-y-8 text-lg md:text-2xl font-light leading-relaxed text-neutral-200 text-balance lowercase">
                        <p>
                            i&rsquo;m soumya. i spent two years in founders&rsquo; offices at a fintech and a
                            healthtech startup, translating what the business needed into what the engineers
                            built. somewhere in there i got tired of writing the spec and handing it over.
                        </p>
                        <p className="text-neutral-400">
                            now most of my energy goes into agents, ai tooling, and prototypes that take a
                            weekend. i&rsquo;m a compulsive tinkerer, cloud, infra, webdev, ios, ml, whatever
                            the thing needs. i mostly want to know how it works.
                        </p>
                    </div>
                </div>
            </section>

            {/* Work Details Section */}
            <section id="experience" className="w-full max-w-5xl px-4 md:px-6 py-20 border-t border-neutral-900">
                <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
                    <div>
                        <h2 className="label sticky top-24 text-neutral-500 mb-4">experience</h2>
                    </div>
                    <div className="space-y-16">
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
                    </div>
                </div>
            </section>

            <section id="projects" className={`projects-paper ${styles.projects}`} aria-labelledby="projects-heading">
                <div className="edge-top" aria-hidden="true" />
                <div className={styles.ledger}>
                    <header className={styles.masthead}>
                        <h2 id="projects-heading">things i built</h2>
                        <p>grouped by who they were for. one i keep rebuilding, a few people paid for, and some just answered a question and stopped.</p>
                    </header>
                    {projects.filter(project => project.section === "core").map(project => (
                        <CoreProject key={project.id} project={project} />
                    ))}
                    {GROUPS.map(group => {
                        const items = projects.filter(project => project.section === group.section);
                        const start = startNumbers[group.section];
                        return items.length === 0 ? null : (
                            <ProjectGroup
                                key={group.section}
                                id={group.id}
                                title={group.title}
                                count={group.count(items.length)}
                                projects={items}
                                startNumber={start}
                            />
                        );
                    })}
                </div>
                <div className="edge-bottom" aria-hidden="true" />
            </section>

            <ContributionGrid />

            {/* Brain Section (Disabled) */}
            {/* <BrainSection /> */}

            {/* Philosophy Section */}
            <Philosophy />

            <Education />

            <SiteFooter />
        </main >
    );
}
