import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import DotGrid from "@/components/DotGrid";
import OrbitField from "@/components/OrbitField";
import LocalTime from "@/components/LocalTime";
import VisitBadge from "@/components/VisitBadge";
import KonamiBoost from "@/components/KonamiBoost";
import ExperienceItem from "@/components/ExperienceItem";
import NowStrip from "@/components/NowStrip";
import BuildLog from "@/components/BuildLog";
import PrimitivesToggle from "@/components/PrimitivesToggle";
import FlipLink from "@/components/FlipLink";
import Portrait from "@/components/Portrait";
import { ExternalLink } from "lucide-react";

export default function Home() {
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
                        <VisitBadge />
                    </div>

                    <h1 className="font-display text-balance text-4xl lowercase leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
                        agents, trading engines, ios apps, infra and saas.
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
                    <div className="space-y-8 text-xl md:text-2xl font-light leading-relaxed text-neutral-200 text-balance lowercase">
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

            <NowStrip />

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

            {/* Projects Section - Refesigned */}
            <section id="projects" className="w-full px-4 md:px-6 py-24 md:py-40 border-t border-neutral-900 flex flex-col items-center">
                <div className="mb-24 text-center">
                    <h2 className="font-display text-5xl md:text-7xl lowercase tracking-tight text-white/80 mb-6">
                        selected work
                    </h2>
                    <p className="max-w-lg mx-auto text-neutral-500 lowercase">
                        curiosity is the only through-line here. everything else is a side effect.
                    </p>
                </div>

                {/* Personal Agent Timeline */}
                <div className="w-full max-w-4xl mb-16 md:mb-40">
                    <h3 className="label text-neutral-600 mb-6">my personal agent</h3>

                    <div className="space-y-4">
                        {projects
                            .filter(p => ["hermes"].includes(p.id))
                            .map((project) => (
                                <div key={project.id} data-card-cell className="relative h-[200px]">
                                    <ProjectCard project={project} />
                                </div>
                            ))}

                        <PrimitivesToggle>
                            {projects
                                .filter(p => ["eclipsn", "eclipse-obsidian", "eclipse", "jarvis"].includes(p.id))
                                .map((project) => (
                                    <div key={project.id} data-card-cell className="relative h-[200px]">
                                        <ProjectCard project={project} />
                                    </div>
                                ))}
                        </PrimitivesToggle>
                    </div>
                </div>

                {/* Other Projects - Grid Layout */}
                <div className="w-full max-w-7xl">
                    <h3 className="label text-center text-neutral-500 mb-16">side projects</h3>
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {projects.filter(p => !["hermes", "jarvis", "eclipse", "eclipse-obsidian", "eclipsn", "vanshita", "bykritika"].includes(p.id)).map((project) => (
                            <div key={project.id} data-card-cell className="relative h-[200px]">
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client Work - Minimalist Section */}
                <div className="w-full max-w-7xl mt-32">
                    <h3 className="label text-center text-neutral-500 mb-16">client work</h3>
                    <div className="flex flex-col border-t border-neutral-900">
                        {projects.filter(p => ["vanshita", "bykritika"].includes(p.id)).map((project) => (
                            <a
                                key={project.id}
                                href={project.link || project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between py-6 border-b border-neutral-900 hover:bg-neutral-900/20 transition-colors px-4"
                            >
                                <span className="text-xl md:text-2xl font-medium text-neutral-400 group-hover:text-white transition-colors">
                                    {project.title}
                                </span>
                                <div className="flex items-center gap-4 text-neutral-600 group-hover:text-neutral-400">
                                    <span className="label hidden md:inline-block">{project.techStack[0]}</span>
                                    <ExternalLink className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brain Section (Disabled) */}
            {/* <BrainSection /> */}

            {/* Philosophy Section */}
            <section id="philosophy" className="w-full py-20 border-t border-neutral-900 bg-neutral-950/30">
                <DotGrid />
            </section>

            {/* Footer */}
            <footer className="w-full py-20 border-t border-neutral-900 flex flex-col items-center justify-center text-center px-6">
                <h2 className="font-display text-2xl md:text-4xl lowercase tracking-tight text-white mb-6">
                    building something strange? i&rsquo;d like to hear about it.
                </h2>
                <a href="mailto:soumyamaheshwari1234@gmail.com" className="text-neutral-500 hover:text-white transition-colors text-lg mb-8">
                    &lt;mail me&gt;
                </a>

                <a
                    href="/SoumyaMaheshwariResume.pdf"
                    target="_blank"
                    className="label inline-block text-black bg-white rounded-lg px-4 py-2 md:px-12 hover:bg-neutral-200 transition-colors mb-8"
                >
                    view resume
                </a>

                <BuildLog />

                <div className="mt-8 flex gap-8 opacity-50 hover:opacity-100 transition-opacity">
                    <a href="https://twitter.com/soumymaheshwri" target="_blank" className="hover:text-white">X / Twitter</a>
                    <a href="https://github.com/soumyyy" target="_blank" className="hover:text-white">GitHub</a>
                    <a href="https://linkedin.com/in/soumya-maheshwari-b194161a3/" target="_blank" className="hover:text-white">LinkedIn</a>
                </div>
            </footer>
        </main >
    );
}
