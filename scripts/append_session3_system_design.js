const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'Session3_Chapters6_7_Learning_Content.md');
const dataPath = path.join(root, 'frontend', 'src', 'data', 'systemDesignData.js');

const source = fs.readFileSync(sourcePath, 'utf8').replace(/^\uFEFF/, '');
const dataSource = fs.readFileSync(dataPath, 'utf8');

const dataMatch = dataSource.match(/export const SYSTEM_DESIGN_DATA = ([\s\S]*?);\s*\n\s*export default SYSTEM_DESIGN_DATA;/);
if (!dataMatch) {
  throw new Error('Could not locate SYSTEM_DESIGN_DATA export in systemDesignData.js');
}

const existing = JSON.parse(dataMatch[1]);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanChapterTitle(line) {
  return line.replace(/^# ===\s*/, '').replace(/\s*===\s*$/, '').trim();
}

function cleanTopicTitle(line) {
  return line.replace(/^## ---\s*/, '').replace(/\s*---\s*$/, '').trim();
}

function cleanMetaTitle(line) {
  return line.replace(/^## ===\s*/, '').replace(/\s*===\s*$/, '').trim();
}

function detectType(title) {
  const lower = title.toLowerCase();
  if (lower.includes('problem')) return 'problem';
  if (lower.includes('naive')) return 'naive';
  if (lower.includes('where it breaks')) return 'breaks';
  if (lower.includes('concept')) return 'concept';
  if (lower.includes('how it works') || lower.includes('requirements') || lower.includes('clock synchronization') || lower.includes('section length tuning') || lower.includes('high availability') || lower.includes('full component map') || lower.includes('concrete scenarios')) return 'how-it-works';
  if (lower.includes('trade-off')) return 'trade-offs';
  if (lower.includes('real-world')) return 'real-world';
  if (lower.includes('beyond')) return 'beyond-book';
  if (lower.includes('recap')) return 'recap';
  if (lower.includes('self-check')) return 'self-check';
  if (lower.includes('cheat sheet')) return 'cheat-sheet';
  return 'overview';
}

function parseNumberedTitle(raw) {
  const match = raw.match(/^(\d+)\.\s*(.+)$/);
  if (!match) return { number: null, title: raw };
  return { number: Number(match[1]), title: match[2].trim() };
}

function parseSpec(lines, titleLine) {
  const titleMatch = titleLine.match(/VISUALIZATION SPEC\s*(?:—|-)\s*"([^"]+)"/i);
  const spec = {
    title: titleMatch ? titleMatch[1] : 'Visualization',
  };

  for (const raw of lines) {
    const line = raw.trim();
    const match = line.match(/^-\s+\*\*([^*]+):\*\*\s*(.*)$/);
    if (!match) continue;
    const key = match[1].trim().toLowerCase();
    spec[key] = match[2].trim();
    if (key === 'interaction type') spec.type = match[2].trim();
    if (key === 'visual priority') spec.priority = match[2].trim();
  }

  if (!spec.type) spec.type = spec['interaction type'] || spec.title;
  return spec;
}

function extractQa(content) {
  const qaList = [];
  const re = /\*\*(?:Q\d*:|(?:\d+\.\s*)?Q:)\*\*\s*([\s\S]*?)(?:\n>\s*\*\*A:\*\*|\n\s*\*\*A \(hidden\):\*\*|\n>\s*A:)\s*([\s\S]*?)(?=\n\*\*(?:Q\d*:|(?:\d+\.\s*)?Q:)\*\*|\n---|\s*$)/g;
  let match;
  while ((match = re.exec(content))) {
    qaList.push({
      question: match[1].trim().replace(/\n+/g, ' '),
      answer: match[2].trim().replace(/^>\s?/gm, '').replace(/\n+/g, ' '),
    });
  }
  return qaList;
}

function finalizeSubsection(section, subsection) {
  if (!section || !subsection) return;
  subsection.content = subsection.lines.join('\n').trim();
  delete subsection.lines;
  if (subsection.type === 'self-check') {
    subsection.qaList = extractQa(subsection.content);
  }
  if (subsection.content || subsection.type === 'viz-spec') {
    section.subsections.push(subsection);
  }
}

function finalizeSection(chapter, section, subsection) {
  if (!chapter || !section) return;
  finalizeSubsection(section, subsection);
  if (section.subsections.length === 1 && section.type === 'self-check') {
    section.subsections[0].qaList = section.subsections[0].qaList?.length
      ? section.subsections[0].qaList
      : extractQa(section.subsections[0].content);
  }
  chapter.sections.push(section);
}

function parseSession3(markdown) {
  const lines = markdown.split(/\r?\n/);
  const chapters = [];
  let chapter = null;
  let section = null;
  let subsection = null;
  let collectingConceptMap = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^# === CHAPTER \d+:/i.test(trimmed)) {
      finalizeSection(chapter, section, subsection);
      if (chapter) chapters.push(chapter);
      const title = cleanChapterTitle(trimmed);
      const chapterNum = (title.match(/CHAPTER\s+(\d+)/i) || [null, chapters.length + 1])[1];
      chapter = {
        id: `chapter-${chapterNum}-${slugify(title.replace(/^CHAPTER\s+\d+:\s*/i, ''))}`,
        title,
        conceptMap: [],
        sections: [],
      };
      section = null;
      subsection = null;
      collectingConceptMap = false;
      continue;
    }

    if (!chapter) continue;

    if (trimmed === '**CONCEPT MAP:**') {
      collectingConceptMap = true;
      continue;
    }

    if (collectingConceptMap) {
      if (/^\d+\.\s+/.test(trimmed)) {
        chapter.conceptMap.push(trimmed);
        continue;
      }
      if (trimmed === '---' || /^## ---/.test(trimmed)) {
        collectingConceptMap = false;
      } else {
        continue;
      }
    }

    if (/^## ---/.test(trimmed)) {
      finalizeSection(chapter, section, subsection);
      const rawTitle = cleanTopicTitle(trimmed);
      const parsed = parseNumberedTitle(rawTitle);
      section = {
        id: `${chapter.id}-s${parsed.number || slugify(parsed.title)}`,
        number: parsed.number,
        title: parsed.title,
        type: 'topic',
        subsections: [],
      };
      subsection = null;
      continue;
    }

    if (/^## ===/.test(trimmed)) {
      finalizeSection(chapter, section, subsection);
      const title = cleanMetaTitle(trimmed);
      section = {
        id: `${chapter.id}-s${slugify(title)}`,
        number: null,
        title,
        type: detectType(title),
        subsections: [],
      };
      subsection = {
        title,
        type: detectType(title),
        lines: [],
      };
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      if (!section) continue;
      finalizeSubsection(section, subsection);
      const title = trimmed.replace(/^###\s+/, '').trim();
      subsection = {
        title,
        type: detectType(title),
        lines: [],
      };
      continue;
    }

    if (/^\*\*VISUALIZATION SPEC/i.test(trimmed)) {
      if (!section) continue;
      finalizeSubsection(section, subsection);
      const specLines = [];
      i += 1;
      while (i < lines.length) {
        const next = lines[i];
        const nextTrimmed = next.trim();
        if (nextTrimmed === '---' || /^## ---/.test(nextTrimmed) || /^## ===/.test(nextTrimmed) || /^# === CHAPTER/.test(nextTrimmed) || /^###\s+/.test(nextTrimmed)) {
          i -= 1;
          break;
        }
        specLines.push(next);
        i += 1;
      }
      const spec = parseSpec(specLines, trimmed);
      section.subsections.push({
        title: spec.title,
        type: 'viz-spec',
        content: [trimmed, ...specLines].join('\n').trim(),
        spec,
      });
      subsection = null;
      continue;
    }

    if (section) {
      if (!subsection && trimmed && trimmed !== '---') {
        subsection = {
          title: 'Overview',
          type: section.type === 'topic' ? 'overview' : section.type,
          lines: [],
        };
      }
      if (subsection) subsection.lines.push(line);
    }
  }

  finalizeSection(chapter, section, subsection);
  if (chapter) chapters.push(chapter);
  return chapters;
}

const session3 = parseSession3(source);
const chapterIds = new Set(session3.map((chapter) => chapter.id));
const merged = [...existing.filter((chapter) => !chapterIds.has(chapter.id)), ...session3];

const banner = '// Auto-generated from Chapters 1-7 Learning Content\n// Contains all structured content for chapters 1 through 7\n\n';
fs.writeFileSync(
  dataPath,
  `${banner}export const SYSTEM_DESIGN_DATA = ${JSON.stringify(merged, null, 2)};\n\nexport default SYSTEM_DESIGN_DATA;\n`,
  'utf8',
);

console.log(`Imported ${session3.length} chapters and ${session3.reduce((sum, chapter) => sum + chapter.sections.length, 0)} sections from Session 3.`);
