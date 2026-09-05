export interface Project {
  id: string;
  name: string; // heading. lowercase.
  who: string; // subtitle. who it was for, or the question it answered.
  summary: string; // one or two lines, always visible
  problem: string[]; // 3 paragraphs, revealed on hover or tap
  stack: string; // mono, dot separated, already formatted
  note?: string; // "on testflight", "live at shitsort.com", "fully local"
  video?: string;
  poster?: string;
  github?: string;
  link?: string;
  section: "core" | "one" | "someone" | "hackathon" | "client" | "question";
  writing?: { title: string; excerpt: string; handle: string; date: string; url: string }[];
  lineage?: { v: string; t: string; d: string }[]; // core only
  pins?: string[]; // core only
}

export const projects: Project[] = [
  // --- Core ---
  {
    id: "eclipse",
    name: "eclipse",
    who: "me. every day, for years.",
    summary: "",
    problem: [
      "a personal agent that runs continuously on a server and is reachable wherever i already am, over whatsapp or telegram. it holds memory across every conversation rather than starting fresh each time, which is the single thing that decides whether an assistant becomes useful or gets abandoned.",
      "it reads my mail, my recovery and sleep from whoop, my activity from strava, and my orders, so it has the context without being told it. a separate orchestrating agent decides what to actually do with a request, and codex handles the work that is really code.",
      "i have rebuilt it five times over several years. each rewrite kept the same question and threw away the answer.",
    ],
    stack: "",
    github: "https://github.com/soumyyy/eclipse-obsidian",
    video: "/demo/EclipseDemo.mp4",
    poster: "/demo/posters/eclipse-obsidian.jpg",
    section: "core",
    writing: [
      {
        title: "the agent is not the product: a guide to tinkering your way into hermes",
        excerpt: "most people install hermes or openclaw for the same reason they install any cool new developer tool. it looks interesting. it feels fresh. you want to poke around and see what happens. i did the same.",
        handle: "@soumymaheshwri",
        date: "16 june 2026",
        url: "https://x.com/Soumymaheshwri/status/2066821397624873257"
      }
    ],
    lineage: [
      {
        v: "01",
        t: "jarvis v0",
        d: "the first attempt. scripted commands, no memory, and it forgot everything the moment it closed. it taught me the problem was never the interface.",
      },
      {
        v: "02",
        t: "eclipse",
        d: "enhanced cognitive linguistic interactive personal support engine. python, nlp and mysql. the first version with a real store behind it, and the first that could answer a question about last week.",
      },
      {
        v: "03",
        t: "eclipse obsidian",
        d: "moved onto a vps behind a custom pwa, running on cerebras at roughly three thousand tokens a second. a github hook ingested my obsidian journal every night at 2am, so my second brain and the agent were finally the same thing.",
      },
      {
        v: "04",
        t: "eclipsn",
        d: "rebuilt around a knowledge graph instead of a flat store, with gmail and whoop feeding it. the graph made connections between things i had never explicitly linked.",
      },
      {
        v: "05",
        t: "eclipse",
        d: "the current one. always on, reachable over whatsapp and telegram, with an orchestrating agent above it and a memory layer underneath.",
      },
    ],
    pins: [
      "whatsapp",
      "telegram",
      "whoop",
      "strava",
      "gmail",
      "memory layer",
      "codex",
      "orchestrating agent",
      "backed by open source hermes",
    ],
  },
  // --- an audience of one ---
  {
    id: "glai",
    name: "glai",
    who: "my mother.",
    summary:
      "photo based meal logging with nutrition analysis, built for her diabetes management.",
    problem: [
      "every diabetes app assumes you will weigh your food and look up each ingredient. she was never going to do that, and neither would i.",
      "so it takes a photograph. one pass identifies the dishes, a second estimates weights and nutrition ranges. ranges rather than fake precision, because a photograph cannot tell you grams.",
      "everything stays on the device. sync is optional and off by default. a health record for one person did not need a backend.",
    ],
    stack: "react native · expo · openai · sqlite",
    note: "on testflight",
    github: "https://github.com/soumyyy/glai",
    section: "one",
  },
  {
    id: "photocortex",
    name: "photocortex",
    who: "me, and eleven years of photographs.",
    summary: "face, object, scene and text detection across a personal photo library.",
    problem: [
      "google photos is genuinely excellent and the price is handing over every photograph you have ever taken.",
      "this runs the same class of analysis locally, so the library becomes searchable by what is in it rather than only by when it was taken.",
      "it is slower than the cloud version and always will be. that is the trade, stated plainly.",
    ],
    stack: "computer vision · python",
    note: "fully local",
    github: "https://github.com/soumyyy/PhotoCortex",
    video: "/demo/PhotoCortexDemo.mp4",
    poster: "/demo/posters/photocortex.jpg",
    section: "one",
  },
  {
    id: "room",
    name: "room",
    who: "me, at one in the morning.",
    summary:
      "one native ios interface for my whole room. lights, the ac, and everything behind the ir blaster.",
    problem: [
      "three apps, two remotes, and a four second cold start to switch off a light or drop the ac two degrees. the hardware was fine. the software between me and the hardware was the problem.",
      "wiz bulbs speak a simple protocol on the local network, so talking to them directly skips the round trip to a cloud service entirely. the ir blaster covers the ac and everything else older than wifi, so one interface reaches the whole room.",
      "one screen, one tap, no account. the smallest useful thing i have built, and the one i use most.",
    ],
    stack: "typescript · expo · ios · wiz api · ir",
    github: "https://github.com/soumyyy/Room",
    section: "one",
  },
  {
    id: "stockportfolio",
    name: "stock portfolio tracker",
    who: "me, and three brokerage accounts.",
    summary: "a real time tracker pulling several kite accounts into a single view.",
    problem: [
      "holdings split across accounts means no single screen shows what you actually own, so you do the arithmetic in your head and get it wrong.",
      "this fetches all of them and shows one position list with live prices. no advice, no charts, no engagement mechanics.",
      "it is deliberately boring. that is why it still gets opened.",
    ],
    stack: "next.js · typescript · yahoo finance api",
    github: "https://github.com/soumyyy/StockPortfolio",
    section: "one",
  },
  // --- an audience of someone else ---
  {
    id: "shit",
    name: "shit",
    who: "every student who has lost track of their attendance.",
    summary: "timetable management and attendance tracking, entirely on device.",
    problem: [
      "the college portal tells you your attendance percentage but not the thing everyone actually wants to know, which is how many more classes you can afford to miss.",
      "so it computes that directly, per subject and combined, and lets you correct a wrong record with a long press instead of an email to an administrator.",
      "nothing leaves the phone. an attendance record is not worth a server, an account system, or a privacy policy, and a student should not have to trust one.",
    ],
    stack: "react native · expo · typescript · mmkv",
    note: "live at shitsort.com",
    link: "https://shitsort.com",
    github: "https://github.com/soumyyy/shit",
    video: "/demo/SHITdemo.mp4",
    poster: "/demo/posters/shit.jpg",
    section: "someone",
  },
  {
    id: "billinsight",
    name: "billinsight",
    who: "a client, and a camera roll full of receipts.",
    summary: "an ai invoice and expense pipeline with a durable server behind it.",
    problem: [
      "uploading an entire camera roll to find the receipts in it is expensive, slow, and a privacy problem you then have to explain to a client.",
      "so a mobilenetv3 classifier runs on the device and filters first. only likely receipts are sent up, which cuts the bill and means holiday photos never leave the phone.",
      "behind it sits the unglamorous half: idempotent uploads, job claims, backoff retries, background reconciliation, and observability with the personal data scrubbed out. that is what makes it survive real users.",
    ],
    stack: "expo · fastapi · neon postgres · tflite",
    note: "private repositories",
    section: "client",
  },
  {
    id: "sih-bel",
    name: "sih-bel chatbot",
    who: "a technician holding an unfamiliar part.",
    summary:
      "detection and language together, identifying a component and finding its documentation.",
    problem: [
      "you have to identify a component before you can look anything up, and the identifying marks are often worn away or facing the wrong direction.",
      "yolov8 handles recognition, llama 3.1 handles the conversation, and the answer is grounded in bharat electronics own manuals rather than invented.",
      "the constraint that shaped it: a confident wrong answer about a defence component is far worse than admitting uncertainty.",
    ],
    stack: "yolov8 · llama 3.1 · python · flask",
    github: "https://github.com/soumyyy/SIH-BEL",
    section: "hackathon",
  },
  {
    id: "imagenerve",
    name: "imagenerve",
    who: "a wedding party, and two thousand photographs.",
    summary: "face recognition across an event so you get only the photos you are in.",
    problem: [
      "after any large event there is a shared drive with two thousand photographs in it, and finding the eleven you appear in means scrolling all two thousand.",
      "one scan returns only yours. the recognition is the easy part now; the useful part is framing it around a person rather than an album.",
      "built after a wedding, for the obvious reason.",
    ],
    stack: "react native · expo · fastapi",
    github: "https://github.com/soumyyy/ImageNerve",
    section: "someone",
  },
  // --- sometimes the question was enough ---
  {
    id: "hft",
    name: "hft backtesting engine",
    who: "how much of the latency story is real?",
    summary: "a high frequency backtester for gold against the dollar, written in rust.",
    problem: [
      "backtesting at tick resolution is where a personal project usually dies. the naive version takes hours per run, so you stop iterating, so you stop learning anything.",
      "rust turned it into something i could run between edits. the point was never a profitable strategy.",
      "scoped to one instrument on purpose. gold against the dollar is volatile enough to be interesting and liquid enough that the fills are not fiction.",
    ],
    stack: "rust · backtesting",
    note: "runs on a macbook",
    github: "https://github.com/soumyyy/hft-backtest-engine",
    section: "question",
  },
  {
    id: "fulcrum",
    name: "fulcrum",
    who: "can a model explain why it doubts a company?",
    summary: "annual report in, structured credit risk memo out, streamed as it is written.",
    problem: [
      "indian credit underwriting still runs on an analyst reading a pdf and typing ratios into a spreadsheet. it is slow, inconsistent, and the reasoning evaporates the moment it is finished.",
      "this pulls around 25 financial fields from any annual report, computes tier 1a ratios, then runs two models trained on a cohort of wilful defaulters against matched controls.",
      "the output is a memo, not a score. a number nobody can interrogate is worse than no number.",
    ],
    stack: "next.js · fastapi · gemini · ml",
    github: "https://github.com/soumyyy/fulcrum",
    section: "question",
  },
  {
    id: "kochimetro",
    name: "kochi metro sih",
    who: "where should a fleet sleep?",
    summary: "depot stabling and turnout order, balancing four competing objectives.",
    problem: [
      "every night a metro depot decides where each train parks and in what order they leave. get it wrong and you are shunting trains at four in the morning.",
      "certificates and maintenance windows constrain what can run at all. branding contracts want particular trains on particular lines. mileage wants to stay even so nothing wears out first.",
      "real constraints and no clean optimum, which is exactly why it was worth doing.",
    ],
    stack: "python · operations research",
    github: "https://github.com/soumyyy/kochimetro-sih",
    section: "hackathon",
  },
  {
    id: "alphafold-nano",
    name: "alphafold nano",
    who: "what is the pipeline actually doing?",
    summary:
      "a compact reimplementation of alphafold's data preparation, plus reinforcement learning.",
    problem: [
      "reading the alphafold paper and understanding it turned out to be different activities, and the gap between them was code.",
      "so this rebuilds the data preparation pipeline at a scale that fits on one machine, with a dashboard comparing its toy inferences against real traces.",
      "it does not fold proteins competitively and never intended to. it answers a narrower question.",
    ],
    stack: "python · pytorch · streamlit",
    github: "https://github.com/soumyyy/alphafold-nano",
    section: "question",
  },
  {
    id: "ace-rl",
    name: "ace + rl agent",
    who: "can an agent notice its own bad habits?",
    summary: "a terminal first agent that plans, executes, validates, reflects, then adjusts.",
    problem: [
      "most agent frameworks fix the strategy at design time. when it fails it fails the same way forever, and you are the one who has to notice.",
      "this keeps a lightweight reinforcement learning bandit over its own approaches, so tactics that keep working get chosen more often.",
      "a small idea tested honestly rather than a framework. the interesting result was how fast it learned to stop doing the thing that never worked.",
    ],
    stack: "python · reinforcement learning",
    github: "https://github.com/soumyyy/ace-rl",
    section: "question",
  },
  {
    id: "vanshita",
    name: "vanshita's portfolio",
    who: "vanshita, and the work she wanted seen.",
    summary: "a minimal, fast portfolio site built to put her work in front of people.",
    problem: [
      "a portfolio is a strange brief. the work is the point, so anything the site does to draw attention to itself is working against the person paying for it.",
      "so this is deliberately quiet. fast to load, easy to read, and structured so the work is the first thing you see rather than an intro animation.",
      "built in next.js with the motion kept to almost nothing. the only thing it needs to do well is get out of the way."
    ],
    stack: "next.js · tailwindcss · framer motion",
    link: "https://vanshitakalra.com",
    github: "https://github.com/soumyyy/vanshita-portfolio",
    section: "client"
  },
  {
    id: "bykritika",
    name: "kritika's portfolio",
    who: "kritika, and a brand that needed a front door.",
    summary: "a digital presence built around brand identity rather than a project list.",
    problem: [
      "this one was not a portfolio in the usual sense. the brief was a brand, so a list of projects would have been the wrong shape entirely.",
      "the site is built around identity first: the tone, the palette and the way it reads matter more here than any feature.",
      "kept simple on purpose, because a brand site that needs explaining has already failed."
    ],
    stack: "react · tailwindcss",
    link: "https://bykritika.com",
    github: "https://github.com/soumyyy/bykritika.com",
    section: "client"
  },
];
