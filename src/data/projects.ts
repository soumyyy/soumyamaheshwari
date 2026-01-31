export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link: string;
  github?: string;
  image?: string;
  video?: string;
  longDescription: string;
}

export const projects: Project[] = [
  // --- The Jarvis Evolution Flow ---
  {
    id: "eclipsn",
    title: "Eclipsn",
    description: "A personal agent inspired by Bind.ai and Poke, focusing on a single user’s knowledge graph, Gmail, and long-term memory.",
    longDescription: "Eclipsn is my personal AI agent, designed to be the central ecosystem of my digital life. It connects via Whoop API to track recovery, ingests my Gmail to stay updated on conversations, and maintains a long-term memory graph. It learns about me, anticipates updates, and serves as a unified interface for my data.\n\n(P.S. While I was building this, Peter Steinberger shipped OpenClaw (the 100x version). Great minds think alike, but he shipped faster.)",
    techStack: ["Next.js", "Graph Database", "Gmail API", "Whoop API"],
    link: "https://github.com/soumyyy/eclipsn",
    github: "https://github.com/soumyyy/eclipsn",
    image: undefined
  },
  {
    id: "eclipse-obsidian",
    title: "Eclipse Obsidian",
    description: "The next iteration of Eclipse, integrated with Obsidian for personal knowledge management.",
    longDescription: "I run this on a VPS, accessed via a custom PWA. Powered by Cerebras (3000 tokens/sec), it gives me instant access to my memories, past journals, and collections. It bridges the gap between personal AI and my knowledge base.",
    techStack: ["TypeScript", "Obsidian API", "Cerebras", "PWA"],
    link: "https://github.com/soumyyy/eclipse-obsidian",
    github: "https://github.com/soumyyy/eclipse-obsidian",
    image: undefined,
    video: "/demo/EclipseDemo.mp4"
  },
  {
    id: "eclipse",
    title: "Eclipse",
    description: "Enhanced Cognitive Linguistic Interactive Personal Support Engine. A significant evolution in conversational AI integration.",
    longDescription: "Eclipse (Enhanced Cognitive Linguistic Interactive Personal Support Engine) represents the next step in personal AI, focusing on deeper cognitive linguistic understanding and interactive support.",
    techStack: ["Python", "NLP", "MySQL"],
    link: "https://github.com/soumyyy/Eclipse",
    github: "https://github.com/soumyyy/Eclipse",
    image: undefined,
  },
  {
    id: "jarvis",
    title: "JARVIS V0",
    description: "A basic voice-controlled assistant that can process speech input, respond with text or speech, and perform simple system tasks.",
    longDescription: "Jarvis V0 is a basic voice-controlled assistant that can process speech input, respond with text or speech, and perform simple system tasks. It integrates speech recognition, text-to-speech, and basic automation to assist with everyday commands.",
    techStack: ["Python", "SpeechRecognition", "pyttsx3"],
    link: "https://github.com/soumyyy/Jarvis-V0",
    github: "https://github.com/soumyyy/Jarvis-V0",
    image: undefined
  },
  // --- Client Work ---
  {
    id: "vanshita",
    title: "Vanshita's Portfolio",
    description: "A minimal, high-performance portfolio website built for Vanshita.",
    longDescription: "A minimal, high-performance portfolio website built for Vanshita. Designed to showcase her work.",
    techStack: ["Next.js", "TailwindCSS", "Framer Motion"],
    link: "https://github.com/soumyyy/vanshita-portfolio",
    github: "https://github.com/soumyyy/vanshita-portfolio",
    image: undefined
  },
  {
    id: "bykritika",
    title: "Kritika's Portfolio",
    description: "A digital presence for Kritika, focusing on brand identity.",
    longDescription: "A digital presence for Kritika, focusing on brand identity and online reach.",
    techStack: ["React", "TailwindCSS"],
    link: "https://github.com/soumyyy/bykritika.com",
    github: "https://github.com/soumyyy/bykritika.com",
    image: undefined
  },
  // --- Other Key Projects ---
  {
    id: "shit",
    title: "SHIT",
    description: "An app for managing academic timetables and tracking attendance, with iOS apt UI.",
    longDescription: "[Student Helper Integrated Tool] A minimal native app for managing academic timetables and tracking attendance. All data stored locally on-device with no cloud dependencies. Features weekly timetable management, visual attendance tracking, and insights.",
    techStack: ["React Native", "Expo", "TypeScript", "MMKV"],
    link: "https://shitsort.com",
    github: "https://github.com/soumyyy/shit",
    image: undefined,
    video: "/demo/SHITdemo.mp4"
  },
  {
    id: "kochimetro",
    title: "Kochi Metro SIH",
    description: "Smart India Hackathon project for Kochi Metro.",
    longDescription: "A Smart India Hackathon (SIH) project developed for Kochi Metro, focusing on improving operational efficiency by solving the queuing and entire backend work of metro operations.",
    techStack: ["SIH", "Hackathon"],
    link: "https://github.com/soumyyy/kochimetro-sih",
    github: "https://github.com/soumyyy/kochimetro-sih",
    image: undefined
  },
  {
    id: "hft",
    title: "HFT Backtesting Engine",
    description: "A high-frequency trading backtesting engine for XAU/USD built in Rust.",
    longDescription: "A high-frequency trading backtesting engine for XAU/USD built in Rust, designed to run efficiently on a Macbook. Optimized for speed and low-latency simulation.",
    techStack: ["Rust", "HFT", "Backtesting"],
    link: "https://github.com/soumyyy/hft-backtest-engine",
    github: "https://github.com/soumyyy/hft-backtest-engine",
    image: undefined
  },
  {
    id: "photocortex",
    title: "PhotoCortex",
    description: "AI-powered photo analysis and organization platform.",
    longDescription: "PhotoCortex is an AI-powered photo analysis and organization platform that made on top of ensemble of multimodal AI modals to helps you understand and explore your photo collection in new ways. It combines face, object, scene, text detection with computer vision (Google photos without the scale).",
    techStack: ["Computer Vision", "AI"],
    link: "https://github.com/soumyyy/PhotoCortex",
    github: "https://github.com/soumyyy/PhotoCortex",
    image: undefined
  },
  {
    id: "stockportfolio",
    title: "Stock Portfolio Tracker",
    description: "A minimalistic, real-time stock portfolio tracker built for personal use.",
    longDescription: "A minimalistic, real-time stock portfolio tracker based on Zerodha's Kite platform. Track your stock market investments with live updates, llaso it automaticaly fetches your stock portfolio from mulitple kite accounts so you can keep a track of your portfolio at one place.",
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Yahoo Finance API"],
    link: "https://github.com/soumyyy/StockPortfolio",
    github: "https://github.com/soumyyy/StockPortfolio",
    image: undefined
  },
  {
    id: "sih-bel",
    title: "SIH-BEL Image Chatbot",
    description: "Smart India Hackathon 2024 project: Conversational Image Recognition Chatbot for Bharat Electronics Limited.",
    longDescription: "Developed for SIH 2024 (Bharat Electronics Limited). This system integrates YoloV8 for computer vision and Llama 3.1 for NLP to analyze images and generate contextual responses for component identification and retrieve information about the particular part from BEL's official documentation.",
    techStack: ["YOLOv8", "Llama 3.1", "Python", "Flask"],
    link: "https://github.com/soumyyy/SIH-BEL",
    github: "https://github.com/soumyyy/SIH-BEL",
    image: undefined
  },
  {
    id: "imagenerve",
    title: "ImageNerve",
    description: "A full-stack photo management application that fetches all your photos.",
    longDescription: "A native photo management application with AI-powered face recognition. Designed to organize and retrieve only your photos intelligently, Get your photos from any event in just one scan.",
    techStack: ["React Native", "Expo", "FastAPI", "Face Recognition"],
    link: "https://github.com/soumyyy/ImageNerve",
    github: "https://github.com/soumyyy/ImageNerve",
    image: undefined
  },
  {
    id: "alphafold-nano",
    title: "AlphaFold Nano",
    description: "Protein structure tools mimicing and understanding DeepMind's AlphaFold project.",
    longDescription: "A compact repository implementing AlphaFold data preparation pipelines and Reinforcement Learning algorithms (Actor-Critic CartPole, Q-Learning FrozenLake). Features a dashboard for visualizing training metrics and comparing toy backbone inferences against AlphaFold traces.",
    techStack: ["Python", "Streamlit", "PyTorch", "AlphaFold"],
    link: "https://github.com/soumyyy/alphafold-nano",
    github: "https://github.com/soumyyy/alphafold-nano",
    image: undefined
  },
  {
    id: "ace-rl",
    title: "ACE + RL Agent",
    description: "A terminal-first Agentic Context Engineering agent that plans, executes, and self-tunes via RL.",
    longDescription: "A terminal-first ACE (Agentic Context Engineering) agent that plans, executes, validates, reflects, and self-tunes via a lightweight reinforcement-learning bandit.",
    techStack: ["Python", "Reinforcement Learning", "ACE Framework"],
    link: "https://github.com/soumyyy/ace-rl",
    github: "https://github.com/soumyyy/ace-rl",
    image: undefined
  }
];