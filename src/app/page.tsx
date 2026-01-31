"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import DotGrid from "@/components/DotGrid";
import { ChevronDown, ExternalLink } from "lucide-react";

const ExperienceItem = ({ company, role, date, location, summary, bullets }: { company: string, role: string, date: string, location: string, summary: string, bullets: string[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="group border-l-2 border-neutral-900 pl-6 md:pl-8 py-2 transition-all hover:border-neutral-700 hover:bg-neutral-900/10 rounded-r-lg pr-4 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-neutral-200 transition-colors flex items-center gap-2">
                        {company}
                        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </h3>
                    <span className="text-xs font-mono text-neutral-500">{date}</span>
                </div>

                <div className="text-sm text-neutral-500 uppercase tracking-wider">{role} · {location}</div>

                <p className="text-neutral-400 leading-relaxed italic pr-4">
                    {summary}
                </p>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <ul className="pt-4 space-y-3 text-neutral-400 leading-relaxed list-disc list-outside ml-4 text-base border-t border-neutral-900/50 mt-4">
                            {bullets.map((bullet, idx) => (
                                <li key={idx}><span className="text-neutral-300">{bullet}</span></li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Home() {
    const [showHello, setShowHello] = useState(false);
    const [hideHello, setHideHello] = useState(false);
    const [mainText, setMainText] = useState("");
    const [showButton, setShowButton] = useState(false);
    const [showPrimitives, setShowPrimitives] = useState(false);

    const mainContent = "I build cool stuff, break them, fix them along the way.";

    useEffect(() => {
        // Sequence animation
        setTimeout(() => {
            setShowHello(true);

            setTimeout(() => {
                setHideHello(true);

                let i = 0;
                const typeText = () => {
                    if (i <= mainContent.length) {
                        setMainText(mainContent.slice(0, i));
                        i++;
                        setTimeout(typeText, 30);
                    } else {
                        setShowButton(true);
                    }
                };

                // Start typing after "Hello" fades
                setTimeout(typeText, 800);
            }, 1500); // Wait for Hello to stay a bit
        }, 500);
    }, []);

    // Auto-scroll effect after main text is done (when showButton becomes true)
    useEffect(() => {
        if (showButton) {
            const timer = setTimeout(() => {
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [showButton]);

    const scrollToAbout = () => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="min-h-screen flex flex-col items-center bg-black selection:bg-white selection:text-black">

            {/* Scroll Progress - Optional, can add later */}

            {/* Navigation / Flip Buttons */}
            <nav className="fixed top-6 right-6 md:right-12 z-50 flex gap-4">
                {/* Blog Button - Commented out but codebase ready */}
                {/* 
         <a href="/blog" className="hidden md:flex items-center text-sm font-medium text-neutral-500 hover:text-white transition-colors">
            blog
         </a> 
         */}
                <FlipLink href="mailto:soumyamaheshwari1234@gmail.com">
                    open to work
                </FlipLink>
            </nav>

            {/* Hero Section */}
            <section className="h-screen w-full flex flex-col items-center justify-center px-6 text-center">
                <AnimatePresence>
                    {!hideHello && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showHello ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            className="text-6xl md:text-9xl font-bold tracking-tighter absolute"
                        >
                            Hello.
                        </motion.h1>
                    )}
                </AnimatePresence>

                <div className={`transition-opacity duration-1000 ${hideHello ? 'opacity-100' : 'opacity-0'}`}>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight w-full md:whitespace-nowrap leading-tight">
                        {mainText}
                        <span className="animate-pulse ml-1 text-neutral-500">|</span>
                    </h1>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
                    transition={{ duration: 0.5 }}
                    onClick={scrollToAbout}
                    className="mt-16 text-sm text-neutral-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                >
                    about me
                </motion.button>
            </section>

            {/* About Section */}
            <section id="about" className="w-full max-w-5xl px-4 md:px-6 py-24 md:py-40 border-t border-neutral-900">
                <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
                    <div>
                        <h2 className="text-neutral-500 font-medium text-sm tracking-widest uppercase mb-4 sticky top-24">Intro</h2>
                    </div>
                    <div className="space-y-8 text-xl md:text-2xl font-light text-neutral-200 leading-relaxed text-balance lowercase">
                        <p>
                            i’m soumya. i design, i build, and i mess with things just to see how they work. spent a couple years in startup ops & strategy, but recently i've put most of my energy in the deep end: ai tooling, agents, and the chaos of the new.
                        </p>
                        <p className="text-neutral-400">
                            i'm a compulsive tinkerer. obsessed with the entire process of how things are built, curious about any and everything. i dig into everything: cloud, infra, devops, ml. i don't just skim the surface; i live in the weeds.
                        </p>
                    </div>
                </div>
            </section>

            {/* Work Details Section */}
            <section className="w-full max-w-5xl px-4 md:px-6 py-20 border-t border-neutral-900">
                <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
                    <div>
                        <h2 className="text-neutral-500 font-medium text-sm tracking-widest uppercase mb-4 sticky top-24">Experience</h2>
                    </div>
                    <div className="space-y-16">
                        {/* Komma */}
                        <div className="group space-y-4">
                            <div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                                    <h3 className="text-xl font-semibold text-white group-hover:text-neutral-200 transition-colors">Komma Financial Technologies</h3>
                                    <span className="text-sm text-neutral-500 font-mono">Nov 2022 – Jan 2024</span>
                                </div>
                                <div className="text-sm text-neutral-500">Founder’s Office · Gurugram | Pune</div>
                            </div>

                            {/* Company Intro */}
                            <p className="text-neutral-400 leading-relaxed italic">
                                Simplifying investing by developing personal finance tools that make managing money easier.
                            </p>

                            {/* Bullets */}
                            <ul className="space-y-3 text-neutral-400 leading-relaxed list-disc list-outside ml-4 text-base">
                                <li>Worked directly with early-stage founders to drive day-to-day execution across operations and product, standardizing internal SOPs.</li>
                                <li>Owned the translation of business and financial requirements into product flows, collaborating closely with engineers to ship website and internal tool updates.</li>
                                <li>Spearheaded a cross-functional team of interns across analytics, marketing, and fintech research, setting workstreams, reviewing outputs, and driving execution against clear deliverables.</li>
                            </ul>
                        </div>

                        {/* BabyKavach */}
                        <div className="group space-y-4">
                            <div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                                    <h3 className="text-xl font-semibold text-white group-hover:text-neutral-200 transition-colors">BabyKavach</h3>
                                    <span className="text-sm text-neutral-500 font-mono">Jan 2024 – Jan 2025</span>
                                </div>
                                <div className="text-sm text-neutral-500">Founder’s Office · Gurugram</div>
                            </div>

                            {/* Company Intro */}
                            <p className="text-neutral-400 leading-relaxed italic">
                                Building a suite of digital healthcare services to help parents with vaccinations and medical records.
                            </p>

                            {/* Bullets */}
                            <ul className="space-y-3 text-neutral-400 leading-relaxed list-disc list-outside ml-4 text-base">
                                <li>Conceptualized and managed the roadmap for components, translating complex health metrics into actionable user insights via React.</li>
                                <li>Led the Go-to-Market strategy for the brand’s digital presence; managed ad budgets and content operations to drive initial user acquisition and engagement.</li>
                                <li>Worked the end-to-end development of the brand website and application, optimizing the User Journey (UX) to serve as the primary lead generation funnel.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section - Refesigned */}
            <section className="w-full px-4 md:px-6 py-24 md:py-40 border-t border-neutral-900 flex flex-col items-center">
                <div className="mb-24 text-center">
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white/80 mb-6">selected works</h2>
                    <p className="text-neutral-500 max-w-lg mx-auto">A collection of experiments, agents, and side-projects.</p>
                </div>

                {/* Evolution Flow - Vertical Timeline */}
                <div className="w-full max-w-4xl space-y-12 mb-40">
                    <div className="relative border-l-2 border-neutral-800 pl-3 md:pl-16 ml-0 md:ml-20 py-4">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-4 border-black box-content" />
                        <h3 className="text-sm font-bold tracking-widest text-neutral-500 uppercase mb-12">my personal agent timeline</h3>

                        <div className="space-y-8">
                            {/* The Latest / Hero Agent */}
                            {projects
                                .filter(p => ["eclipsn", "eclipse-obsidian"].includes(p.id))
                                .map((project, index) => (
                                    <div key={project.id}>
                                        <ProjectCard project={project} index={index} />
                                    </div>
                                ))}

                            {/* Toggle for Primitive Tech */}
                            <div className="pt-8">
                                <button
                                    onClick={() => setShowPrimitives(!showPrimitives)}
                                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-wider font-semibold"
                                >
                                    {showPrimitives ? "Hide the Primitive Tech" : "View the Primitive Tech that got me here"}
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showPrimitives ? "rotate-180" : ""}`} />
                                </button>
                            </div>

                            {/* Primitive Tech List */}
                            <AnimatePresence>
                                {showPrimitives && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-8 pt-8 border-l-2 border-neutral-800/50 -ml-[23px] md:-ml-[66px] pl-[21px] md:pl-[64px]">
                                            {projects
                                                .filter(p => ["eclipse", "jarvis"].includes(p.id))
                                                .map((project, index) => (
                                                    <ProjectCard key={project.id} project={project} index={index} />
                                                ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Other Projects - Grid Layout */}
                <div className="w-full max-w-7xl">
                    <h3 className="text-center text-sm font-bold tracking-widest text-neutral-500 uppercase mb-16">More Experiments</h3>
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {projects.filter(p => !["jarvis", "eclipse", "eclipse-obsidian", "eclipsn", "vanshita", "bykritika"].includes(p.id)).map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </div>
                </div>

                {/* Client Work - Minimalist Section */}
                <div className="w-full max-w-7xl mt-32">
                    <h3 className="text-center text-sm font-bold tracking-widest text-neutral-500 uppercase mb-16">Client Work</h3>
                    <div className="flex flex-col border-t border-neutral-900">
                        {projects.filter(p => ["vanshita", "bykritika"].includes(p.id)).map((project) => (
                            <a
                                key={project.id}
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between py-6 border-b border-neutral-900 hover:bg-neutral-900/20 transition-colors px-4"
                            >
                                <span className="text-xl md:text-2xl font-medium text-neutral-400 group-hover:text-white transition-colors">
                                    {project.title}
                                </span>
                                <div className="flex items-center gap-4 text-neutral-600 group-hover:text-neutral-400">
                                    <span className="hidden md:inline-block text-sm uppercase tracking-wider">{project.techStack[0]}</span>
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
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-6">
                    Got something cool to build?
                </h2>
                <a href="mailto:soumyamaheshwari1234@gmail.com" className="text-neutral-500 hover:text-white transition-colors text-lg mb-12">
                    &lt;mail me&gt;
                </a>

                <div className="flex gap-8 opacity-50 hover:opacity-100 transition-opacity">
                    <a href="https://twitter.com/soumymaheshwri" target="_blank" className="hover:text-white">X / Twitter</a>
                    <a href="https://github.com/soumyyy" target="_blank" className="hover:text-white">GitHub</a>
                    <a href="https://linkedin.com/in/soumya-maheshwari-b194161a3/" target="_blank" className="hover:text-white">LinkedIn</a>
                </div>
            </footer>
        </main >
    );
}

const FlipLink = ({ children, href }: { children: string; href: string }) => {
    return (
        <motion.a
            initial="initial"
            whileHover="hovered"
            href={href}
            className="relative block overflow-hidden whitespace-nowrap text-xs md:text-sm font-medium uppercase tracking-wider text-neutral-400 border border-neutral-800 rounded-full px-4 py-2 bg-black/50 backdrop-blur-sm hover:text-white hover:border-white transition-colors"
        >
            <motion.div
                variants={{
                    initial: { y: 0 },
                    hovered: { y: "-100%" },
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                }}
            >
                {children}
            </motion.div>
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                variants={{
                    initial: { y: "100%" },
                    hovered: { y: 0 },
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                }}
            >
                email me
            </motion.div>
        </motion.a>
    );
};
