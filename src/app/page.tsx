"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import DotGrid from "@/components/DotGrid";
// import BrainSection from "@/components/BrainSection"; // Commented out as requested

export default function Home() {
    const [showHello, setShowHello] = useState(false);
    const [hideHello, setHideHello] = useState(false);
    const [mainText, setMainText] = useState("");
    const [showButton, setShowButton] = useState(false);

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
                <a
                    href="mailto:soumyamaheshwari1234@gmail.com"
                    className="px-4 py-2 border border-neutral-800 rounded-full text-xs md:text-sm text-neutral-400 hover:text-white hover:border-neutral-600 transition-all bg-black/50 backdrop-blur-sm"
                >
                    open to work
                </a>
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
                    <h1 className="text-3xl md:text-6xl font-medium tracking-tight max-w-4xl leading-tight">
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
            <section id="about" className="w-full max-w-5xl px-6 py-24 md:py-40 border-t border-neutral-900">
                <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
                    <div>
                        <h2 className="text-neutral-500 font-medium text-sm tracking-widest uppercase mb-4 sticky top-24">Intro</h2>
                    </div>
                    <div className="space-y-8 text-xl md:text-3xl font-light text-neutral-200 leading-relaxed text-balance">
                        <p>
                            I'm Soumya, an AI undergrad based out of India. I design and I build, working at the intersection of <span className="text-white font-normal">tech and creative strategy</span>.
                        </p>
                        <p className="text-neutral-400">
                            I believe the problems worth solving don't come with instructions. They require experimenting, questioning assumptions, and sometimes breaking things to build them better from the ground up.
                        </p>
                    </div>
                </div>
            </section>

            {/* Work Details Section */}
            <section className="w-full max-w-5xl px-6 py-20 border-t border-neutral-900">
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
                                <div className="text-sm text-neutral-500">Founder’s Office · Gurugram</div>
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

            {/* Projects Section */}
            <section className="w-full max-w-6xl px-6 py-24 md:py-40 border-t border-neutral-900">
                <div className="mb-20">
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white/50">projects</h2>
                </div>

                {/* Render Ordered/Flow Projects First */}
                <div className="space-y-20 md:space-y-32">

                    {/* The Jarvis Evolution Section */}
                    <div className="relative border-l border-neutral-800 pl-8 md:pl-16 ml-4 md:ml-8 py-8">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-neutral-800 border-2 border-black" />
                        <div className="mb-12">
                            <h3 className="text-xl text-neutral-500 uppercase tracking-widest font-medium">The Evolution of Personal AI</h3>
                            <p className="text-neutral-600 mt-2 text-sm">From basic automation to cognitive architectures.</p>
                        </div>

                        <div className="space-y-16">
                            {projects
                                .filter(p => ["jarvis", "eclipse", "eclipse-obsidian", "eclipsn"].includes(p.id))
                                .slice()
                                .reverse()
                                .map((project, index) => (
                                    <ProjectCard key={project.id} project={project} index={index} />
                                ))}
                        </div>
                    </div>

                    {/* Other Projects */}
                    <div className="space-y-16">
                        {projects.filter(p => !["jarvis", "eclipse", "eclipse-obsidian", "eclipsn"].includes(p.id)).map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
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
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
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
        </main>
    );
}
