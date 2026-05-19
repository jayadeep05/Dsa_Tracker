import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdFile1 = path.resolve(__dirname, '../../../Session_1_Content_Chapters_1_2_3.md');
const mdFile2 = path.resolve(__dirname, '../../../Session2_Chapters4_5_LearningContent.md');
const outputPath = path.resolve(__dirname, './systemDesignData.js');

const files = [mdFile1, mdFile2];
const chapters = [];

files.forEach((mdPath, fileIdx) => {
    if (!fs.existsSync(mdPath)) {
        console.error(`Error: File not found at ${mdPath}`);
        return;
    }

    console.log(`Parsing file: ${mdPath}`);
    const fileContent = fs.readFileSync(mdPath, 'utf-8');
    const lines = fileContent.split('\n');

    let currentChapter = null;
    let currentSection = null;
    let currentSubsection = null;
    let state = 'ROOT'; // ROOT, CONCEPT_MAP

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // 1. Match Chapter Headers: # === CHAPTER 1: SCALE FROM ZERO TO MILLIONS OF USERS ===
        // Or # === CHAPTER 4: DESIGN A RATE LIMITER ===
        const chapterMatch = line.match(/^#\s+===\s+(CHAPTER\s+\d+:\s+[^=]+)\s+===/i);
        if (chapterMatch) {
            const title = chapterMatch[1].trim();
            const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            currentChapter = {
                id,
                title,
                conceptMap: [],
                sections: []
            };
            chapters.push(currentChapter);
            currentSection = null;
            currentSubsection = null;
            state = 'ROOT';
            continue;
        }

        // 2. Match Section Headers: ## --- 1. Single Server Setup --- or ## === CHAPTER 1 RECAP ===
        const sectionMatch = line.match(/^##\s+(?:---\s*|===\s*)?([^-\s=].*?)(?:\s*---|\s*===)?$/);
        if (sectionMatch) {
            let title = sectionMatch[1].trim();
            title = title.replace(/(^-|-$)/g, '').trim(); // clean trailing dashes
            
            let type = 'topic';
            let number = null;
            
            if (title.toUpperCase().includes('RECAP')) {
                type = 'recap';
            } else if (title.toUpperCase().includes('CHEAT SHEET')) {
                type = 'cheat-sheet';
            } else if (title.toUpperCase().includes('SELF-CHECK BANK')) {
                type = 'self-check';
            } else if (title.toUpperCase().includes('SELF-CHECK')) {
                type = 'self-check';
            } else {
                // Check if starts with a number like "1. Single Server Setup"
                const numMatch = title.match(/^(\d+)\.\s+(.*)$/);
                if (numMatch) {
                    number = parseInt(numMatch[1], 10);
                    title = numMatch[2].trim();
                }
            }

            const sectionId = currentChapter 
                ? `${currentChapter.id}-s${number || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            currentSection = {
                id: sectionId,
                number,
                title,
                type,
                subsections: []
            };

            if (currentChapter) {
                currentChapter.sections.push(currentSection);
            }

            if (type === 'recap' || type === 'cheat-sheet' || type === 'self-check') {
                currentSubsection = {
                    title: title,
                    type: type,
                    lines: []
                };
                currentSection.subsections.push(currentSubsection);
            } else {
                currentSubsection = null;
            }
            state = 'ROOT';
            continue;
        }

        // 3. Match Subsection Headers: ### 🔴 THE PROBLEM, ### 🟢 THE CONCEPT, etc.
        const subsectionMatch = line.match(/^###\s+(.*)$/);
        if (subsectionMatch && currentSection) {
            const title = subsectionMatch[1].trim();
            let type = 'general';
            
            if (title.includes('PROBLEM')) type = 'problem';
            else if (title.includes('NAIVE')) type = 'naive';
            else if (title.includes('BREAKS')) type = 'breaks';
            else if (title.includes('CONCEPT')) type = 'concept';
            else if (title.includes('HOW IT WORKS')) type = 'how-it-works';
            else if (title.includes('TRADE-OFFS')) type = 'trade-offs';
            else if (title.includes('REAL-WORLD')) type = 'real-world';
            else if (title.includes('BEYOND THE BOOK')) type = 'beyond-book';
            else if (title.includes('RECAP')) type = 'recap';
            else if (title.includes('SELF-CHECK')) type = 'self-check';

            currentSubsection = {
                title,
                type,
                lines: []
            };
            currentSection.subsections.push(currentSubsection);
            continue;
        }

        // 4. Match Visualization Specs: **Visualization Spec:** or **VISUALIZATION SPEC — Sub-topic X**
        const isVizSpec = trimmedLine.toUpperCase().startsWith('**VISUALIZATION SPEC');
        if (isVizSpec) {
            currentSubsection = {
                title: 'Visualization Spec',
                type: 'viz-spec',
                lines: [line]
            };
            if (currentSection) {
                currentSection.subsections.push(currentSubsection);
            }
            continue;
        }

        // 5. Accumulate content inside subsections
        if (currentSubsection) {
            currentSubsection.lines.push(line);
            continue;
        }

        // 6. Accumulate concept maps in chapters
        if (currentChapter && trimmedLine.startsWith('**CONCEPT MAP')) {
            state = 'CONCEPT_MAP';
            continue;
        }

        if (state === 'CONCEPT_MAP' && currentChapter) {
            if (trimmedLine === '' || trimmedLine.startsWith('---')) {
                state = 'ROOT';
            } else {
                currentChapter.conceptMap.push(trimmedLine);
            }
        }
    }
});

// Post-process to join lines and clean up subsections
chapters.forEach(ch => {
    ch.sections.forEach(sec => {
        sec.subsections.forEach(sub => {
            sub.content = sub.lines.join('\n').trim();
            delete sub.lines;

            // Extra parsing for self-check blocks to separate questions and answers
            if (sec.type === 'self-check' || sub.type === 'self-check') {
                const qaList = [];
                const blocks = sub.content.split(/\n\s*\n/);
                blocks.forEach(block => {
                    const qMatch = block.match(/(?:\d+\.\s*)?\*\*Q:\*\*\s*(.*?)(?=\*\*A\s*\(hidden\):\*\*|\*\*A:\*\*|$)/is);
                    const aMatch = block.match(/\*\*A\s*\(hidden\):\*\*\s*(.*?)$/is) || block.match(/\*\*A:\*\*\s*(.*?)$/is);
                    if (qMatch) {
                        qaList.push({
                            question: qMatch[1].trim(),
                            answer: aMatch ? aMatch[1].trim() : ''
                        });
                    }
                });
                if (qaList.length > 0) {
                    sub.qaList = qaList;
                }
            }

            // Extra parsing for viz-spec blocks to parse key-value configurations
            if (sub.type === 'viz-spec') {
                const spec = {};
                sub.content.split('\n').forEach(l => {
                    const m = l.match(/-\s+\*\*([^:]+):\*\*\s*(.*)$/);
                    if (m) {
                        spec[m[1].trim().toLowerCase()] = m[2].trim();
                    }
                });
                sub.spec = spec;
            }
        });
    });
});

// Output javascript file
const jsContent = `// Auto-generated from Chapters 1-5 Learning Content
// Contains all structured content for chapters 1, 2, 3, 4, and 5

export const SYSTEM_DESIGN_DATA = ${JSON.stringify(chapters, null, 2)};

export default SYSTEM_DESIGN_DATA;
`;

fs.writeFileSync(outputPath, jsContent, 'utf-8');
console.log(`Successfully generated system design data at ${outputPath}`);
console.log(`Found ${chapters.length} chapters.`);
chapters.forEach(ch => {
    console.log(`  - ${ch.title} with ${ch.sections.length} sections`);
});
