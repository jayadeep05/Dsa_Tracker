const fs = require('fs');
const path = require('path');
const vm = require('vm');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function enrichTextWithHighlights(text) {
  if (!text) return text;
  
  let enriched = text;
  
  // 1. First, bold key complexity formulas (using manual regex to avoid \b boundary mismatch with parenthesis)
  const formulaTerms = [
    'O\\(n log k\\)', 'O\\(n log n\\)', 'O\\(log n\\)', 'O\\(n\\^2\\)', 'O\\(H\\+k\\)',
    'O\\(1\\)', 'O\\(n\\)', 'O\\(N\\)', 'O\\(H\\)', 'O\\(N\\+M\\)', 'O\\(sz\\)'
  ];
  formulaTerms.forEach(term => {
    const regex = new RegExp(`(?<!\\*\\*)${term}(?!\\*\\*)`, 'gi');
    enriched = enriched.replace(regex, `**$&**`);
  });

  // 2. Bold key algorithms, paradigms, and patterns
  const boldTerms = [
    'Two Pointers', 'Two-Pointer', 'two pointers', 'two-pointer',
    'Sliding Window', 'sliding window', 'Binary Search', 'binary search',
    'Topological Sort', 'topological sort', 'topo sort', 'Union-Find',
    'Union Find', 'Dijkstra', 'Backtracking', 'backtracking',
    'Dynamic Programming', 'constant extra space', 'time complexity',
    'space complexity', 'prefix sum', 'suffix sum', 'prefix product', 'suffix product',
    'monotonic stack', 'monotonic queue', 'monotonic deque', 'in-place', 'in place',
    'Floyd cycle', 'Floyd\'s cycle', 'Kahn\'s algorithm', 'Kahn\'s BFS', 'Morris traversal',
    'DP', 'DSU', 'DFS', 'BFS'
  ];
  
  // Sort by length descending to ensure longer terms are matched first
  boldTerms.sort((a, b) => b.length - a.length);
  
  boldTerms.forEach(term => {
    const regex = new RegExp(`(?<![\\*\`])\\b${escapeRegExp(term)}\\b(?![\\*\`])`, 'gi');
    enriched = enriched.replace(regex, `**$&**`);
  });

  // 3. Code-style for key data structures and variable types
  const codeTerms = [
    'priority queue', 'priority queues', 'linked list', 'linked lists',
    'binary tree', 'binary trees', 'segment tree', 'segment trees',
    'hashmap', 'hashmaps', 'hash map', 'hash maps', 'hashset', 'hashsets',
    'hash set', 'hash sets', 'min-heap', 'min-heaps', 'max-heap', 'max-heaps',
    'stack', 'stacks', 'queue', 'queues', 'heap', 'heaps', 'deque', 'deques',
    'BST', 'BSTs', 'Trie', 'Tries'
  ];
  
  codeTerms.sort((a, b) => b.length - a.length);
  
  codeTerms.forEach(term => {
    const regex = new RegExp(`(?<![\\*\`])\\b${escapeRegExp(term)}\\b(?![\\*\`])`, 'gi');
    enriched = enriched.replace(regex, '`$&`');
  });

  return enriched;
}

function formatQuestionInsight(q) {
  let markdown = '';
  
  // 1. Description
  if (q.desc) {
    markdown += `### Description\n${enrichTextWithHighlights(q.desc.trim())}\n\n`;
  }
  
  // 2. Examples
  if (q.examples && Array.isArray(q.examples) && q.examples.length > 0) {
    q.examples.forEach((ex, idx) => {
      markdown += `### Example ${idx + 1}\n`;
      if (ex.input) markdown += `Input: ${enrichTextWithHighlights(ex.input.trim())}\n`;
      if (ex.output) markdown += `Output: ${enrichTextWithHighlights(ex.output.trim())}\n`;
      const explanation = ex.explain || ex.explanation;
      if (explanation) markdown += `Explanation: ${enrichTextWithHighlights(explanation.trim())}\n`;
      if (!ex.input && !ex.output && !explanation && ex.content) {
        markdown += `${enrichTextWithHighlights(ex.content.trim())}\n`;
      }
      markdown += `\n`;
    });
  }
  
  // 3. Constraints
  if (q.constraints && Array.isArray(q.constraints) && q.constraints.length > 0) {
    markdown += `### Constraints\n`;
    q.constraints.forEach(c => {
      markdown += `- ${enrichTextWithHighlights(c.trim())}\n`;
    });
    markdown += `\n`;
  }
  
  // 4. Hints & Core Insight merged under "Intuition"
  if (q.insight || (q.hints && q.hints.length > 0)) {
    markdown += `### Intuition & Hints\n`;
    if (q.insight) {
      markdown += `**Core Insight:** ${enrichTextWithHighlights(q.insight.trim())}\n\n`;
    }
    if (q.hints && Array.isArray(q.hints) && q.hints.length > 0) {
      q.hints.forEach(h => {
        markdown += `- ${enrichTextWithHighlights(h.trim())}\n`;
      });
    }
    markdown += `\n`;
  }
  
  return markdown.trim();
}

try {
  const htmlPath = path.join(__dirname, '..', 'ultimate_dsa_sheet_v3.html');
  console.log(`Reading HTML file from: ${htmlPath}`);
  const content = fs.readFileSync(htmlPath, 'utf8');

  // Find the D array
  const dStart = content.indexOf('const D = [');
  if (dStart === -1) {
    throw new Error('Could not find const D = [ in HTML file.');
  }

  const dEnd = content.indexOf('function buildPatternFilters', dStart);
  if (dEnd === -1) {
    throw new Error('Could not find buildPatternFilters to identify end of D.');
  }

  let dText = content.substring(dStart, dEnd).trim();
  
  // Clean up trailing comma or semicolon if present
  if (dText.endsWith(';')) {
    dText = dText.substring(0, dText.length - 1);
  }

  console.log('Evaluating D array in sandbox...');
  const sandbox = {
    localStorage: {
      getItem: () => '[]',
      setItem: () => {}
    },
    document: {
      getElementById: () => ({ textContent: '', style: {} }),
      querySelectorAll: () => [],
      createElement: () => ({})
    },
    window: {},
    solvedKey: 'dsa_solved'
  };
  vm.createContext(sandbox);
  const D = vm.runInContext(dText + '\n; D;', sandbox);

  if (!D || !Array.isArray(D)) {
    throw new Error('Evaluation succeeded, but D is not a valid array.');
  }

  console.log(`Successfully parsed ${D.length} patterns.`);
  
  const enrichedQuestions = [];
  let totalQuestionsCount = 0;

  D.forEach(p => {
    const patternName = p.pattern;
    const patternSlug = p.slug;
    
    if (p.qs && Array.isArray(p.qs)) {
      p.qs.forEach(q => {
        totalQuestionsCount++;
        const formattedInsight = formatQuestionInsight(q);
        
        enrichedQuestions.push({
          name: q.n,
          lcUrl: q.lc,
          difficulty: q.d,
          importance: q.imp,
          companies: q.co || '',
          tags: (q.tags || []).join(','),
          insight: formattedInsight,
          patternName: patternName,
          patternSlug: patternSlug
        });
      });
    }
  });

  console.log(`Formed ${enrichedQuestions.length} enriched questions (expected ${totalQuestionsCount}).`);

  const outputPath = path.join(__dirname, '..', 'backend', 'src', 'main', 'resources', 'questions_enriched.json');
  console.log(`Writing JSON output to: ${outputPath}`);
  
  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(enrichedQuestions, null, 2), 'utf8');
  console.log('Success! JSON file generated successfully.');

} catch (err) {
  console.error('Error parsing questions data:', err);
  process.exit(1);
}
