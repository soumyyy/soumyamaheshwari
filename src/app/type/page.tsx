"use client";

// THROWAWAY — typeface specimen for picking a stack. Delete this route once chosen.

import { useState } from "react";

type Stack = {
    key: string;
    name: string;
    reads: string;
    display: string;
    displayWeight: number;
    displayTracking: string;
    body: string;
    bodyWeight: number;
    mono: string;
    sources: string;
};

const STACKS: Stack[] = [
    {
        key: "A",
        name: "editorial machine",
        reads: "precise, expensive, a bit cold",
        display: "'Zodiak', serif",
        displayWeight: 400,
        displayTracking: "-0.02em",
        body: "'Instrument Sans Variable', sans-serif",
        bodyWeight: 400,
        mono: "'Commit Mono', monospace",
        sources: "Zodiak — Fontshare (free commercial) · Instrument Sans + Commit Mono — OFL",
    },
    {
        key: "B",
        name: "warm wonk",
        reads: "characterful, human, warmer",
        display: "'Fraunces Variable', serif",
        displayWeight: 400,
        displayTracking: "-0.03em",
        body: "'Inter Tight Variable', sans-serif",
        bodyWeight: 400,
        mono: "'Commit Mono', monospace",
        sources: "all OFL / Google Fonts",
    },
    {
        key: "C",
        name: "swiss brutalist",
        reads: "loud, confident, high-risk",
        display: "'Archivo Variable', sans-serif",
        displayWeight: 800,
        displayTracking: "-0.045em",
        body: "'Archivo Variable', sans-serif",
        bodyWeight: 400,
        mono: "'Geist Mono Variable', monospace",
        sources: "all OFL",
    },
    {
        key: "D",
        name: "high drama",
        reads: "fashion-editorial, maximum contrast",
        display: "'Bodoni Moda Variable', serif",
        displayWeight: 500,
        displayTracking: "-0.015em",
        body: "'Instrument Sans Variable', sans-serif",
        bodyWeight: 400,
        mono: "'Commit Mono', monospace",
        sources: "all OFL",
    },
    {
        key: "E",
        name: "wildcard",
        reads: "odd, memorable, polarising",
        display: "'Gambarino', serif",
        displayWeight: 400,
        displayTracking: "-0.01em",
        body: "'Instrument Sans Variable', sans-serif",
        bodyWeight: 400,
        mono: "'Commit Mono', monospace",
        sources: "Gambarino — Fontshare (free commercial)",
    },
];

export default function TypeSpecimen() {
    const [active, setActive] = useState(STACKS[0]);
    const [smallCaps, setSmallCaps] = useState(true);
    const [scale, setScale] = useState(1);

    const label: React.CSSProperties = smallCaps
        ? { fontVariantCaps: "small-caps", letterSpacing: "0.06em", textTransform: "lowercase" }
        : { textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "0.72em" };

    return (
        <>
            <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f%5B%5D=zodiak@400,401&f%5B%5D=gambarino@400&display=swap" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/instrument-sans/index.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/fraunces/index.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/inter-tight/index.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/archivo/index.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/bodoni-moda/index.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/geist-mono/index.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/commit-mono/index.css" />

            <main className="min-h-screen bg-black text-white" style={{ fontFamily: active.body, fontWeight: active.bodyWeight }}>

                {/* switcher */}
                <div className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-neutral-900">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <div className="flex gap-2">
                            {STACKS.map((s) => (
                                <button
                                    key={s.key}
                                    onClick={() => setActive(s)}
                                    className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${active.key === s.key
                                        ? "bg-white text-black border-white"
                                        : "border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600"
                                        }`}
                                >
                                    {s.key} · {s.name}
                                </button>
                            ))}
                        </div>
                        <label className="flex items-center gap-2 text-sm text-neutral-500 cursor-pointer">
                            <input type="checkbox" checked={smallCaps} onChange={(e) => setSmallCaps(e.target.checked)} />
                            small caps labels
                        </label>
                        <label className="flex items-center gap-2 text-sm text-neutral-500">
                            display size
                            <input type="range" min={0.6} max={1.6} step={0.05} value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))} />
                        </label>
                    </div>
                    <div className="max-w-5xl mx-auto px-6 pb-3 text-xs text-neutral-600"
                        style={{ fontFamily: active.mono }}>
                        {active.reads} — {active.sources}
                    </div>
                </div>

                {/* hero */}
                <section className="max-w-5xl mx-auto px-6 pt-28 pb-24 border-b border-neutral-900">
                    <div style={{ ...label, fontFamily: active.mono }} className="text-neutral-600 mb-10">
                        hero — no typewriter, present on load
                    </div>
                    <h1
                        className="lowercase leading-[0.95] text-balance"
                        style={{
                            fontFamily: active.display,
                            fontWeight: active.displayWeight,
                            letterSpacing: active.displayTracking,
                            fontSize: `${5.5 * scale}rem`,
                        }}
                    >
                        i break things, fix them, and build cool stuff along the way.
                    </h1>
                    <div className="mt-14 flex items-center gap-3 max-w-xl border border-neutral-800 rounded-xl px-5 py-4">
                        <span style={{ fontFamily: active.mono }} className="text-neutral-600 text-sm">&gt;</span>
                        <span className="text-neutral-500 lowercase">ask my agent anything</span>
                        <span style={{ fontFamily: active.mono }} className="ml-auto text-neutral-700 text-xs">↵</span>
                    </div>
                </section>

                {/* intro */}
                <section className="max-w-5xl mx-auto px-6 py-24 border-b border-neutral-900 grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
                    <div style={{ ...label, fontFamily: active.mono }} className="text-neutral-500">intro</div>
                    <div className="space-y-8 lowercase text-balance"
                        style={{ fontSize: `${1.5 * scale}rem`, lineHeight: 1.5, fontWeight: 300 }}>
                        <p className="text-neutral-200">
                            i&rsquo;m soumya. i design, i build, and i mess with things just to see how they work. spent a couple years in startup ops &amp; strategy, but recently i&rsquo;ve put most of my energy in the deep end: ai tooling, agents, frontier coding tools, and rapid prototyping.
                        </p>
                        <p className="text-neutral-400">
                            i&rsquo;m a compulsive tinkerer. obsessed with the entire process of how things are built, curious about any and everything.
                        </p>
                    </div>
                </section>

                {/* experience */}
                <section className="max-w-5xl mx-auto px-6 py-24 border-b border-neutral-900 grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
                    <div style={{ ...label, fontFamily: active.mono }} className="text-neutral-500">experience</div>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
                            <h3 className="text-2xl lowercase" style={{ fontFamily: active.display, fontWeight: active.displayWeight, letterSpacing: "-0.01em" }}>
                                komma financial technologies
                            </h3>
                            <span style={{ fontFamily: active.mono }} className="text-sm text-neutral-500">nov 2022 — jan 2024</span>
                        </div>
                        <div style={{ ...label, fontFamily: active.mono }} className="text-neutral-500">
                            founder&rsquo;s office · gurugram
                        </div>
                        <p className="text-neutral-400 leading-relaxed lowercase pt-2">
                            owned the translation of business and financial requirements into product flows, collaborating closely with engineers to ship website and internal tool updates.
                        </p>
                    </div>
                </section>

                {/* section head + project card */}
                <section className="max-w-5xl mx-auto px-6 py-24 border-b border-neutral-900">
                    <h2 className="lowercase mb-16 text-white/80"
                        style={{ fontFamily: active.display, fontWeight: active.displayWeight, letterSpacing: active.displayTracking, fontSize: `${4.5 * scale}rem` }}>
                        selected works
                    </h2>
                    <div className="border border-neutral-900 rounded-2xl p-8 max-w-xl bg-neutral-950/40">
                        <h3 className="text-3xl lowercase mb-3" style={{ fontFamily: active.display, fontWeight: active.displayWeight, letterSpacing: "-0.02em" }}>
                            hermes
                        </h3>
                        <p className="text-neutral-400 lowercase leading-relaxed mb-6">
                            a personal agent that reads my mail, my calendar, and my notes, then acts on them.
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {["python", "fastapi", "postgres", "pgvector"].map((t) => (
                                <span key={t} style={{ ...label, fontFamily: active.mono }}
                                    className="px-2.5 py-1 rounded-md border border-neutral-800 text-neutral-500 text-sm">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* pangram + numerals */}
                <section className="max-w-5xl mx-auto px-6 py-24 space-y-10">
                    <div style={{ ...label, fontFamily: active.mono }} className="text-neutral-600">character set</div>
                    <p className="lowercase text-neutral-300" style={{ fontFamily: active.display, fontSize: `${2.2 * scale}rem`, letterSpacing: active.displayTracking }}>
                        abcdefghijklmnopqrstuvwxyz &amp; 0123456789
                    </p>
                    <p className="text-neutral-400" style={{ fontFamily: active.body, fontSize: "1.05rem" }}>
                        the quick brown fox jumps over the lazy dog — 0123456789 — @ # $ % &amp; * ( ) [ ] { } / \ &lt; &gt;
                    </p>
                    <p style={{ fontFamily: active.mono }} className="text-neutral-500 text-sm">
                        const hermes = await agent.run({'{'} query, tools: [mail, cal, notes] {'}'}); // 1234567890
                    </p>
                </section>
            </main>
        </>
    );
}
