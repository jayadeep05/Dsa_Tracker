const fs = require('fs');
const path = require('path');

const markdownFile = path.join(__dirname, '..', 'Session_1_Content_Chapters_1_2_3.md');
const content = fs.readFileSync(markdownFile, 'utf8');

const lines = content.split('\n');
let chapters = [];
let currentChapter = null;
let currentTopic = null;
let currentContent = [];
let inVisSpec = false;
let currentVisSpec = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();

    if (line.startsWith('# === CHAPTER') || line.startsWith('# === THREE-CHAPTER MASTER SUMMARY')) {
        // Save previous topic and chapter
        if (currentTopic) {
            currentTopic.content = currentContent.join('\n');
            if (currentVisSpec) currentTopic.visSpec = currentVisSpec;
            currentChapter.topics.push(currentTopic);
        }
        if (currentChapter) {
            chapters.push(currentChapter);
        }

        const title = line.replace(/# === /g, '').replace(/ ===/g, '').trim();
        currentChapter = {
            id: `chapter_${chapters.length + 1}`,
            title: title,
            topics: []
        };
        currentTopic = null;
        currentContent = [];
        inVisSpec = false;
        currentVisSpec = null;
        continue;
    }

    if (line.startsWith('## --- ') && line.endsWith(' ---')) {
        if (currentTopic) {
            currentTopic.content = currentContent.join('\n');
            if (currentVisSpec) currentTopic.visSpec = currentVisSpec;
            currentChapter.topics.push(currentTopic);
        }
        
        const title = line.replace(/## --- /g, '').replace(/ ---/g, '').trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        currentTopic = {
            id: id,
            title: title,
            content: '',
            visSpec: null
        };
        currentContent = [];
        inVisSpec = false;
        currentVisSpec = null;
        continue;
    }

    if (line.startsWith('**Visualization Spec:**')) {
        inVisSpec = true;
        currentVisSpec = {};
        continue;
    }

    if (inVisSpec) {
        if (line.startsWith('- **Type:**')) currentVisSpec.type = line.replace('- **Type:**', '').trim();
        else if (line.startsWith('- **Priority:**')) currentVisSpec.priority = line.replace('- **Priority:**', '').trim();
        else if (line.startsWith('- **Components:**')) currentVisSpec.components = line.replace('- **Components:**', '').trim();
        else if (line.startsWith('- **Animation:**')) currentVisSpec.animation = line.replace('- **Animation:**', '').trim();
        else if (line.startsWith('- **Interaction type:**')) currentVisSpec.interaction = line.replace('- **Interaction type:**', '').trim();
        else if (line.startsWith('- **Left panel')) currentVisSpec.leftPanel = line.replace('- **Left panel', '').trim();
        else if (line.startsWith('- **Right panel')) currentVisSpec.rightPanel = line.replace('- **Right panel', '').trim();
        else if (line.startsWith('- **Layout:**')) currentVisSpec.layout = line.replace('- **Layout:**', '').trim();
        else if (line.startsWith('---') || line === '') {
            inVisSpec = false;
        } else {
            if (!currentVisSpec.other) currentVisSpec.other = [];
            currentVisSpec.other.push(line);
        }
        continue;
    }

    if (currentTopic) {
        currentContent.push(line);
    }
}

if (currentTopic) {
    currentTopic.content = currentContent.join('\n');
    if (currentVisSpec) currentTopic.visSpec = currentVisSpec;
    currentChapter.topics.push(currentTopic);
}
if (currentChapter) {
    chapters.push(currentChapter);
}

const outputFile = path.join(__dirname, '..', 'frontend', 'src', 'data', 'systemDesignData.json');
fs.writeFileSync(outputFile, JSON.stringify(chapters, null, 2));

console.log('Successfully wrote parsed data to', outputFile);
