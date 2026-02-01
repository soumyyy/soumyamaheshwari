const fs = require('fs');
const path = require('path');

const readmeDir = path.join(__dirname, '../src/data/readmes');
const outputHeader = `export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link: string;
  github?: string;
  image?: string;
  longDescription: string;
}

export const projects: Project[] = [
`;

const outputFooter = `];`;

const files = fs.readdirSync(readmeDir);
const projects = [];

files.forEach(file => {
    if (!file.endsWith('.md')) return;
    const content = fs.readFileSync(path.join(readmeDir, file), 'utf8');
    const id = file.replace('.md', '');

    // Basic parsing logic
    const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^(.+)\n={3,}$/m);
    const title = titleMatch ? titleMatch[1].trim() : id;

    // Description: First paragraph that isn't a header or image
    const paragraphs = content.split(/\n\n+/);
    let description = '';
    for (const p of paragraphs) {
        if (!p.startsWith('#') && !p.startsWith('!') && !p.startsWith('<') && p.trim().length > 0) {
            description = p.replace(/\n/g, ' ').trim();
            break;
        }
    }

    // Tech Stack: Look for "Tech Stack" or "Technologies" section
    let techStack = [];
    const techSection = content.match(/##\s*(Tech Stack|Technologies|Built With)([\s\S]*?)(##|$)/i);
    if (techSection) {
        const lines = techSection[2].split('\n');
        lines.forEach(line => {
            const match = line.match(/[-*]\s+(.+)/);
            if (match) techStack.push(match[1].replace(/`/g, '').trim());
        });
    }

    // Image: First image
    const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
    let image = imageMatch ? imageMatch[1] : null;
    // Fix relative images to raw github url if needed (simplified assumption for now)

    const github = `https://github.com/soumyyy/${getErrorCorrectedRepoName(id)}`;

    projects.push({
        id,
        title,
        description: description.slice(0, 150) + '...',
        longDescription: description, // simplified
        techStack,
        link: github, // default to github
        github,
        image
    });
});

function getErrorCorrectedRepoName(id) {
    const map = {
        'jarvis': 'Jarvis-V0',
        'eclipse': 'Eclipse',
        'eclipse-obsidian': 'eclipse-obsidian',
        'eclipsn': 'eclipsn',
        'stockportfolio': 'StockPortfolio',
        'sih-bel': 'SIH-BEL',
        'photocortex': 'PhotoCortex',
        'imagenerve': 'ImageNerve',
        'ace-rl': 'ace-rl',
        'hft': 'hft-backtest-engine'
    };
    return map[id] || id;
}

// Generate TS Content
let tsContent = outputHeader;
projects.forEach(p => {
    tsContent += `  {
    id: "${p.id}",
    title: ${JSON.stringify(p.title)},
    description: ${JSON.stringify(p.description)},
    longDescription: ${JSON.stringify(p.longDescription)},
    techStack: ${JSON.stringify(p.techStack)},
    link: "${p.link}",
    github: "${p.github}",
    image: ${p.image ? `"${p.image}"` : "undefined"}
  },\n`;
});
tsContent += outputFooter;

fs.writeFileSync(path.join(__dirname, '../src/data/projects.ts'), tsContent);
console.log('Generated projects.ts');
