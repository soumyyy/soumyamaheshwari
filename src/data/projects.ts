export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  github?: string;
  image?: string;
  video?: string;
  poster?: string;
  longDescription: string;
}

export const projects: Project[] = [
  // --- The Jarvis Evolution Flow ---
  {
    id: "hermes",
    title: "Hermes",
    description: "My most capable personal agent — powered by Hermes, runs on a server, accessible via WhatsApp, Telegram, or a portal.",
    longDescription: "Powered by Hermes. Runs 24/7 on a server — I talk to it through WhatsApp, Telegram, or a web portal depending on where I am. It has long-term memory across every conversation, ingests my Gmail, Whoop recovery data, Strava activity, and Swiggy orders — and uses all of it to actually know me. It knows my projects, my portfolio, my schedule, my patterns. Not a chatbot, not a tool — closer to a persistent digital version of me that's always on.",
    techStack: ["WhatsApp API", "Telegram API", "Whoop API", "Gmail API", "Strava API", "Long-term Memory"],
    github: undefined,
  },
  {
    id: "eclipsn",
    title: "Eclipsn",
    description: "A personal agent inspired by Bind.ai and Poke, focusing on a single user's knowledge graph, Gmail, and long-term memory.",
    longDescription: "Eclipsn is my personal AI agent, designed to be the central ecosystem of my digital life. It connects via Whoop API to track recovery, ingests my Gmail to stay updated on conversations, and maintains a long-term memory graph. It learns about me, anticipates updates, and serves as a unified interface for my data.\n\n(P.S. While I was building this, Peter Steinberger(@steinpete) shipped OpenClaw (the 100x version). Great minds think alike lol, but he shipped faster.)",
    techStack: ["Next.js", "Graph Database", "Gmail API", "Whoop API"],
    github: "https://github.com/soumyyy/eclipsn",
  },
  {
    id: "eclipse-obsidian",
    title: "Eclipse Obsidian",
    description: "The next iteration of Eclipse, integrated with Obsidian for personal knowledge management.",
    longDescription: "I run this on a VPS, accessed via a custom PWA. Powered by Cerebras (3000 tokens/sec), it gives me instant access to my memories, past journals, and collections. Considering I treat Obsidian as my second brain, I have a GitHub hook that fetches and ingests my new memories at 2am every day. It bridges the gap between personal AI and my knowledge base beautifully.",
    techStack: ["TypeScript", "Obsidian API", "Cerebras", "PWA"],
    github: "https://github.com/soumyyy/eclipse-obsidian",
    video: "/demo/EclipseDemo.mp4",
    poster: "/demo/posters/eclipse-obsidian.jpg"
  },
  {
    id: "eclipse",
    title: "Eclipse",
    description: "Enhanced Cognitive Linguistic Interactive Personal Support Engine. A significant evolution in conversational AI integration.",
    longDescription: "Eclipse (Enhanced Cognitive Linguistic Interactive Personal Support Engine) represents the next step in personal AI, focusing on deeper cognitive linguistic understanding and interactive support.",
    techStack: ["Python", "NLP", "MySQL"],
    github: "https://github.com/soumyyy/Eclipse",
  },
  {
    id: "jarvis",
    title: "JARVIS V0",
    description: "A basic voice-controlled assistant that can process speech input, respond with text or speech, and perform simple system tasks.",
    longDescription: "Jarvis V0 is a basic voice-controlled assistant that can process speech input, respond with text or speech, and perform simple system tasks. It integrates speech recognition, text-to-speech, and basic automation to assist with everyday commands.",
    techStack: ["Python", "SpeechRecognition", "pyttsx3"],
    github: "https://github.com/soumyyy/Jarvis-V0",
  },
  // --- Client Work ---
  {
    id: "vanshita",
    title: "Vanshita's Portfolio",
    description: "A minimal, high-performance portfolio website built for Vanshita.",
    longDescription: "A minimal, high-performance portfolio website built for Vanshita. Designed to showcase her work.",
    techStack: ["Next.js", "TailwindCSS", "Framer Motion"],
    link: "https://vanshitakalra.com",
    github: "https://github.com/soumyyy/vanshita-portfolio",
  },
  {
    id: "bykritika",
    title: "Kritika's Portfolio",
    description: "A digital presence for Kritika, focusing on brand identity.",
    longDescription: "A digital presence for Kritika, focusing on brand identity and online reach.",
    techStack: ["React", "TailwindCSS"],
    link: "https://bykritika.com",
    github: "https://github.com/soumyyy/bykritika.com",
  },
  // --- Other Key Projects ---
  {
    id: "billinsight",
    title: "BillInsight",
    description: "AI invoice and expense management, built as client work. On-device receipt detection in front of a durable extraction pipeline.",
    longDescription: "A mobile expense-ingestion pipeline built for a client. A two-stage MobileNetV3 TensorFlow Lite classifier runs on-device to filter the camera roll, so only candidate receipts are ever sent up for multimodal extraction — cheaper, faster, and private by default. Behind it sits a durable FastAPI/Postgres processing system: idempotent uploads, job claims, exponential-backoff retries, background reconciliation, Clerk auth, and PII-scrubbed observability through Sentry and Grafana. Private repositories.",
    techStack: ["Expo", "React Native", "FastAPI", "Neon Postgres", "TensorFlow Lite", "Gemini", "PaddleOCR", "Clerk", "Sentry", "Grafana"],
  },
  {
    id: "fulcrum",
    title: "Fulcrum",
    description: "AI-powered annual report risk analysis system for the Indian credit market.",
    longDescription: "Upload any company's annual report PDF — Fulcrum extracts ~25 financial fields via Gemini, computes Tier-1A ratios, runs two ML models in parallel (trained on a cohort of wilful defaulters vs. controls), and synthesizes a structured analyst memo, streamed to the UI in real time. Built to replace manual ratio checks in Indian credit underwriting with a grounded, explainable scoring pipeline.",
    techStack: ["Next.js", "FastAPI", "Gemini", "Python", "ML"],
    github: "https://github.com/soumyyy/fulcrum",
  },
  {
    id: "glai",
    title: "Glai",
    description: "Built for my mom's diabetes management — photo-based meal logging with AI nutrition analysis.",
    longDescription: "Built for my mom's diabetes management. Snap a meal, and Glai runs a two-step OpenAI analysis — first identifying dishes, then estimating weights and nutrition ranges. Data is saved locally in SQLite with optional Supabase sync, with HealthKit/CGM integration planned. Shipped to TestFlight via EAS.",
    techStack: ["React Native", "Expo", "OpenAI", "SQLite", "Supabase"],
    github: "https://github.com/soumyyy/glai",
  },
  {
    id: "room",
    title: "Room",
    description: "iOS app to control my Wiz smart bulbs and IR blaster from one interface.",
    longDescription: "A personal home automation app that unifies control of my Wiz smart bulbs and IR blaster into a single native iOS interface. Built because the stock apps are slow and fragmented.",
    techStack: ["TypeScript", "Expo", "iOS", "Wiz API"],
    github: "https://github.com/soumyyy/Room",
  },
  {
    id: "shit",
    title: "SHIT",
    description: "An app for managing academic timetables and tracking attendance, with a native iOS UI.",
    longDescription: "[Student Helper Integrated Tool] A minimal native app for managing academic timetables and tracking attendance. All data stored locally on-device with no cloud dependencies. Features weekly timetable management, visual attendance tracking, and insights.",
    techStack: ["React Native", "Expo", "TypeScript", "MMKV"],
    link: "https://shitsort.com",
    github: "https://github.com/soumyyy/shit",
    video: "/demo/SHITdemo.mp4",
    poster: "/demo/posters/shit.jpg"
  },
  {
    id: "kochimetro",
    title: "Kochi Metro SIH",
    description: "Smart India Hackathon project for Kochi Metro.",
    longDescription: "A Smart India Hackathon (SIH) project developed for Kochi Metro, focusing on improving operational efficiency by solving ops problems like depot stabling & turnout order, and optimizes safety, service readiness, branding exposure and mileage balancing.",
    techStack: ["Python", "Optimization", "Operations Research", "Algorithm Design"],
    github: "https://github.com/soumyyy/kochimetro-sih",
  },
  {
    id: "hft",
    title: "HFT Backtesting Engine",
    description: "A high-frequency trading backtesting engine for XAU/USD built in Rust.",
    longDescription: "A high-frequency trading backtesting engine for XAU/USD built in Rust, designed to run efficiently on a Macbook. Optimized for speed and low-latency simulation.",
    techStack: ["Rust", "HFT", "Backtesting"],
    github: "https://github.com/soumyyy/hft-backtest-engine",
  },
  {
    id: "photocortex",
    title: "PhotoCortex",
    description: "AI-powered photo analysis and organization platform.",
    longDescription: "PhotoCortex is an AI-powered photo analysis and organization platform built on an ensemble of multimodal AI models to help you understand and explore your photo collection in new ways. It combines face, object, scene, and text detection with computer vision — Google Photos, but fully local.",
    techStack: ["Computer Vision", "AI"],
    github: "https://github.com/soumyyy/PhotoCortex",
    video: "/demo/PhotoCortexDemo.mp4",
    poster: "/demo/posters/photocortex.jpg"
  },
  {
    id: "stockportfolio",
    title: "Stock Portfolio Tracker",
    description: "A minimalistic, real-time stock portfolio tracker built for personal use.",
    longDescription: "A minimalistic, real-time stock portfolio tracker based on Zerodha's Kite platform. Track your investments with live updates — automatically fetches your portfolio across multiple Kite accounts so everything is in one place.",
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Yahoo Finance API"],
    github: "https://github.com/soumyyy/StockPortfolio",
  },
  {
    id: "sih-bel",
    title: "SIH-BEL Image Chatbot",
    description: "Smart India Hackathon 2024 project: Conversational Image Recognition Chatbot for Bharat Electronics Limited.",
    longDescription: "Developed for SIH 2024 (Bharat Electronics Limited). This system integrates YoloV8 for computer vision and Llama 3.1 for NLP to analyze images and generate contextual responses for component identification and retrieve information about the particular part from BEL's official documentation.",
    techStack: ["YOLOv8", "Llama 3.1", "Python", "Flask"],
    github: "https://github.com/soumyyy/SIH-BEL",
  },
  {
    id: "imagenerve",
    title: "ImageNerve",
    description: "A full-stack photo management application that fetches all your photos.",
    longDescription: "A native photo management application with AI-powered face recognition. Designed to organize and retrieve only your photos intelligently, Get your photos from any event in just one scan.",
    techStack: ["React Native", "Expo", "FastAPI", "Face Recognition"],
    github: "https://github.com/soumyyy/ImageNerve",
  },
  {
    id: "alphafold-nano",
    title: "AlphaFold Nano",
    description: "Protein structure tools mimicking and understanding DeepMind's AlphaFold project.",
    longDescription: "A compact repository implementing AlphaFold data preparation pipelines and Reinforcement Learning algorithms (Actor-Critic CartPole, Q-Learning FrozenLake). Features a dashboard for visualizing training metrics and comparing toy backbone inferences against AlphaFold traces.",
    techStack: ["Python", "Streamlit", "PyTorch", "AlphaFold"],
    github: "https://github.com/soumyyy/alphafold-nano",
  },
  {
    id: "ace-rl",
    title: "ACE + RL Agent",
    description: "A terminal-first Agentic Context Engineering agent that plans, executes, and self-tunes via RL.",
    longDescription: "A terminal-first ACE (Agentic Context Engineering) agent that plans, executes, validates, reflects, and self-tunes via a lightweight reinforcement-learning bandit.",
    techStack: ["Python", "Reinforcement Learning", "ACE Framework"],
    github: "https://github.com/soumyyy/ace-rl",
  }
];
