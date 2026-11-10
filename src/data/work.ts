import { projects, type Project } from "./projects";
import { seedFrom, type PlateKind } from "@/lib/plates";

/* Everything the redesign needs that projects.ts does not already say: which
   projects sit on the homepage, what each one's plate is, and the longer text
   for its own page. Kept apart from projects.ts so the short copy there stays
   the single place it is edited.

   The longer text is drafted from each repository's readme. Nothing here is a
   claim the readme does not make. */

export type Section = { h: string; p: string[] };

/** Homepage order. */
export const FEATURED = ["shit", "billinsight", "fulcrum", "room", "hft"];

export const GROUPS: { section: Project["section"]; title: string; blurb: string }[] = [
    { section: "core", title: "the one i keep rebuilding", blurb: "five attempts, one question" },
    { section: "one", title: "an audience of one", blurb: "one user each" },
    { section: "someone", title: "an audience of someone else", blurb: "real users" },
    { section: "client", title: "client work", blurb: "paid for" },
    { section: "hackathon", title: "hackathon bs", blurb: "two smart india hackathons" },
    { section: "question", title: "sometimes the question was enough", blurb: "built to find out" },
];

/** Every project in the order the index lists it, which is also its number. */
export const ordered: Project[] = GROUPS.flatMap((group) =>
    projects.filter((project) => project.section === group.section),
);

export const numberOf = (id: string) =>
    String(ordered.findIndex((project) => project.id === id) + 1).padStart(2, "0");

export const find = (id: string) => projects.find((project) => project.id === id);

export type PlateSpec = {
    kind: PlateKind | "image";
    src?: string;
    fit?: "cover" | "contain";
    seed: number;
    label: string;
    caption: string;
};

const PLATE: Record<string, Omit<PlateSpec, "seed">> = {
    eclipse: {
        kind: "image", src: "/projects/eclipse/logo.jpg", fit: "contain",
        label: "the eclipse mark, a chrome head in profile, drawn in characters", caption: "eclipse, as it sees itself",
    },
    shit: {
        kind: "image", src: "/demo/posters/shit.jpg", fit: "contain",
        label: "the shit app, drawn in characters", caption: "the app, mid semester",
    },
    billinsight: { kind: "receipt", label: "a receipt being scanned, drawn in characters", caption: "one receipt, read once" },
    fulcrum: { kind: "fulcrum", label: "a beam balancing on a pivot, drawn in characters", caption: "a report against a verdict" },
    room: {
        kind: "image", src: "/projects/room/app.png", fit: "contain",
        label: "the room app, drawn in characters", caption: "the whole room, one screen",
    },
    hft: { kind: "chart", label: "a candlestick chart drawn in characters", caption: "xau/usd, tick by tick" },
    photocortex: {
        kind: "image", src: "/demo/posters/photocortex.jpg", fit: "cover",
        label: "photocortex, drawn in characters", caption: "eleven years, indexed",
    },
};

export function plateFor(project: Project): PlateSpec {
    const seed = seedFrom(project.id);
    const spec = PLATE[project.id];
    if (spec) return { ...spec, seed };
    return {
        kind: "sigil", seed,
        label: `a small ring machine standing in for ${project.name}`,
        caption: "no photograph survives",
    };
}

/** What each eclipse attempt was actually made of. Keyed by lineage `v`. */
export const LINEAGE_DETAIL: Record<string, string> = {
    "01": "speech in and speech out, on google's speech api and gtts. it could open applications, tell me the weather, play something on spotify and read my calendar.",
    "02": "flask, mysql and llama 3.1, with a login and a chat history in a side panel. still speech to text and back, but now it remembered who was talking.",
    "03": "faiss and sentence transformers over my notes. cerebras for the main model with openai as the backup. redis for sessions, sqlite for long term memory. fastapi on a digitalocean vps behind nginx, next.js on vercel, github actions to deploy. similar questions were answered from a five minute cache.",
    "04": "split in three: a next.js front, a node gateway that owned the gmail oauth, and a python brain on fastapi and langchain. postgres with pgvector underneath. gmail was read only, and its tokens were encrypted with aes-256-gcm.",
};

export const MORE: Record<string, Section[]> = {
    shit: [
        {
            h: "what it grew into",
            p: [
                "it started as a way to stop panic-calculating at eight in the morning. it is now on the app store, on ios and android, with a site at shitsort.com.",
                "the name stands for smart heuristic intelligent timetable. the app store listing calls it student helper tool. both are true.",
            ],
        },
        {
            h: "the parts people use",
            p: [
                "photograph a timetable and gemini parses it into slots. or take a friend's eight character code and import theirs, which is how a timetable actually travels through a class.",
                "attendance is weighted by minutes, so a two hour lab is one lecture and half of it counts as half. the app turns that into the number everyone wants, which is how many you can still miss.",
                "you can also upload the attendance pdf from the college portal on the website, check it subject by subject, and hand it to the app as a ready made semester.",
                "tap a room and it shows you where it is on the floor plan. it forgives however you typed the room name.",
            ],
        },
        {
            h: "where the data lives",
            p: [
                "the timetable and the attendance sit on the phone in mmkv, one store per semester. a small supabase backend does the things a phone cannot do alone: share codes, the scanning proxy, promo codes and subscription state. every table is deny-all and reached only through functions.",
                "for a while, deleting from storage did nothing. mmkv v4 had renamed the method and the old call never removed anything.",
            ],
        },
    ],
    fulcrum: [
        {
            h: "the pipeline",
            p: [
                "upload an annual report. gemini pulls around 25 fields out of it: revenue, pat, ebitda, borrowings, cash from operations, contingent liabilities. everything is reconciled into inr crore, and anything inconsistent is flagged rather than quietly fixed.",
                "ten tier 1a ratios come out of that. two models score them in parallel, a primary engine and a benchmark that audits it, and the result is a risk score from 0 to 100 and a decision bucket.",
                "then a model writes the memo, grounded in what was extracted. if the model is unavailable the memo falls back to deterministic sections, so a report always finishes.",
            ],
        },
        {
            h: "what it was trained on",
            p: [
                "100 companies across three financial years, 300 rows. fifty wilful defaulters and fifty controls. companies where the outcome is already known.",
                "there is a dashboard that exists only for calibration. it shows how scores spread across that cohort, so a 70 means something before you read a new report.",
            ],
        },
        {
            h: "what it is not",
            p: [
                "a replacement for an analyst. it is a first read that surfaces what is worth investigating, so the analyst spends the time on judgment instead of typing numbers out of a pdf.",
                "the report streams to the page as each stage finishes. jobs are flat files on disk. there is no database, and it did not need one.",
            ],
        },
    ],
    hft: [
        {
            h: "what it runs on",
            p: [
                "one week of real ticks, gold against the dollar, january 1 to 7, 2025, from dukascopy. 733,538 ticks, about 22 megabytes. a full run takes roughly a second on an 8gb macbook.",
            ],
        },
        {
            h: "what the strategies did",
            p: [
                "two strategies, scalping and mean reversion. the scalper traded on nearly every tick, 733,526 trades, and lost $179,153.58. mean reversion made 127,802 trades and lost $4.38.",
                "neither won a single trade. the engine was the point, and an engine that reports a bad strategy plainly is working.",
            ],
        },
        {
            h: "how it is put together",
            p: [
                "rust for ingestion, the engine and the analysis, behind a small cli. strategies are yaml configs, so trying a new one means editing a file. a python script reads the run directories afterwards.",
            ],
        },
    ],
    glai: [
        {
            h: "why two passes",
            p: [
                "the analysis is split on purpose. one call identifies the visible dishes, a second estimates weight and nutrition ranges for only those dishes. the output is structured json, validated before the app accepts it, with timeouts and bounded retries around both calls.",
            ],
        },
        {
            h: "after the photograph",
            p: [
                "she reviews what it found and corrects it, then it saves to sqlite on the phone. supabase sync runs in the background only if it is configured. left blank, nothing leaves the device and everything still works.",
                "cgm and healthkit integration is not in the shipped build. that was deferred until the testflight line is stable.",
            ],
        },
    ],
    kochimetro: [
        {
            h: "the shape of the problem",
            p: [
                "25 four car trainsets, one depot at muttom, a service day from 06:00 to 22:30. every night seven to nine trains are marked active and the rest go to standby or the inspection bay, whose jobs have to fit between 21:00 and 05:30.",
            ],
        },
        {
            h: "how it decides",
            p: [
                "in stages, solved with cp-sat from or-tools. first the assignment, minimising risk, branding shortfall, mileage variance, cleaning penalties and shunting. then the inspection bay schedule, so every job is finished by 05:30 with as few moves as possible. then stabling and the morning turnout order.",
                "it is offline and single depot. no live integrations, no mid day rescheduling, no crew rostering. every decision comes with an explanation, and there is a what-if mode.",
            ],
        },
    ],
    "alphafold-nano": [
        {
            h: "what is in it",
            p: [
                "three things in one streamlit dashboard, all on cpu. an actor critic agent on cartpole, tabular q-learning on frozenlake over 60,000 episodes, and a toy transformer that turns a sequence into backbone coordinates for n, cα and c.",
                "ten structures come from alphafold's e. coli bundle. the dashboard overlays the real alphafold trace on the toy backbone for the same protein, so the gap is something you look at rather than read about.",
            ],
        },
    ],
    "ace-rl": [
        {
            h: "the loop",
            p: [
                "planner, implementer, reviewer. the planner emits a json plan that says how it should be validated. the implementer writes python with tests, using openai when it is available and templates when it is not. the reviewer runs it through pytest.",
            ],
        },
        {
            h: "the bandit",
            p: [
                "an epsilon greedy bandit picks between three modes, fast, safe and detailed, and keeps reward statistics for each. every episode is logged with its task, mode, reward and reflection.",
                "questions that are not code get graded by the model against a rubric, from 0 to 1, with 0.6 counting as success. a failure writes a reflection the next plan can read.",
            ],
        },
    ],
    stockportfolio: [
        {
            h: "what it does",
            p: [
                "prices refresh every five minutes from yahoo finance. one overview with p&l, the sensex and nifty 50, and the day's gainers and losers. it installs to a home screen as a pwa.",
                "there is also a read only endpoint that returns the summary and holdings as json, so a model or a script can read the portfolio too.",
            ],
        },
    ],
    "sih-bel": [
        {
            h: "how it works",
            p: [
                "upload a photograph of a component. yolov8 detects what it is, the details come from a structured database, and llama 3.1 turns that into a conversation. flask and mysql underneath. built for bharat electronics at smart india hackathon 2024.",
            ],
        },
    ],
    imagenerve: [
        {
            h: "what it is built from",
            p: [
                "expo on the phone, fastapi behind it, insightface for the recognition, postgres for the records and s3 for the photographs. the face model takes thirty to sixty seconds to load when the backend starts.",
            ],
        },
    ],
};
