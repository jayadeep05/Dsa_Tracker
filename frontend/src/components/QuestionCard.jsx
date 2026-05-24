import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { updateProgress } from '../api/client';
import { createPortal } from 'react-dom';
import EditorPackage from 'react-simple-code-editor';
const Editor = EditorPackage.default || EditorPackage;
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: '20px', background: 'black', zIndex: 9999 }}>CRASH: {this.state.error && this.state.error.toString()}</div>;
    }
    return this.props.children;
  }
}

const DIFF_CONFIG = {
  E: { label: 'Easy', color: '#00D4AA', bg: 'var(--tag-bg-green)', border: '#00D4AA40' },
  M: { label: 'Medium', color: '#F59E0B', bg: 'var(--tag-bg-amber)', border: '#F59E0B40' },
  H: { label: 'Hard', color: '#EF4444', bg: 'var(--tag-bg-red)', border: '#EF444440' },
};

const STATUS_CONFIG = {
  not_started: null,
  attempted: { label: 'Attempted', color: '#F59E0B', bg: '#F59E0B15', border: '#F59E0B40' },
  solved: { label: 'Solved', color: '#00D4AA', bg: '#00D4AA15', border: '#00D4AA40' },
  skipped: { label: 'Skipped', color: 'var(--text-muted)', bg: 'var(--text-muted)20', border: 'var(--text-muted)40' },
};

const TAG_COLORS = {
  'OA': { color: '#FCD34D', bg: 'var(--tag-bg-amber)', border: '#F59E0B40' },
  'pattern-defining': { color: '#60A5FA', bg: 'var(--tag-bg-blue)', border: '#3B82F640' },
  'interview-heavy': { color: '#A78BFA', bg: 'var(--tag-bg-purple)', border: '#8B5CF640' },
  'intuition-builder': { color: '#6EE7B7', bg: 'var(--tag-bg-green-alt)', border: '#10B98140' },
  'thinking-ability': { color: '#FDBA74', bg: 'var(--tag-bg-amber-alt)', border: '#F9731640' },
};

function parseInsight(insightText) {
  if (!insightText) {
    return {
      description: '',
      examples: [],
      constraints: '',
      hints: ''
    };
  }

  if (!insightText.includes('###')) {
    return {
      description: insightText,
      examples: [],
      constraints: '',
      hints: ''
    };
  }

  const sections = insightText.split(/(?=### )/);
  let description = '';
  const examples = [];
  let constraints = '';
  let hints = '';

  sections.forEach(sec => {
    const lines = sec.trim().split('\n');
    const headerLine = lines[0] || '';
    const title = headerLine.replace('###', '').trim();
    const content = lines.slice(1).join('\n').trim();

    const titleLower = title.toLowerCase();
    if (titleLower.startsWith('description') || titleLower.startsWith('insight')) {
      description = content;
    } else if (titleLower.startsWith('example')) {
      examples.push({ title, content });
    } else if (titleLower.startsWith('constraints')) {
      constraints = content;
    } else if (titleLower.startsWith('hint') || titleLower.startsWith('tag') || titleLower.startsWith('intuition')) {
      hints = content;
    } else {
      if (!description) description = sec;
      else description += '\n\n' + sec;
    }
  });

  return { description, examples, constraints, hints };
}

function enrichTextWithHighlights(text) {
  if (!text || typeof text !== 'string') return text;
  
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
  
  boldTerms.sort((a, b) => b.length - a.length);
  
  boldTerms.forEach(term => {
    const regex = new RegExp(`(?<![\\*\`])\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(?![\\*\`])`, 'gi');
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
    const regex = new RegExp(`(?<![\\*\`])\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(?![\\*\`])`, 'gi');
    enriched = enriched.replace(regex, '`$&`');
  });

  return enriched;
}

function parseInlineFormatting(text) {
  if (!text || typeof text !== 'string') return text;
  
  const enrichedText = enrichTextWithHighlights(text);
  const parts = [];
  let remaining = enrichedText;
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let match;
  let lastIndex = 0;
  let key = 0;

  while ((match = regex.exec(remaining)) !== null) {
    const matchText = match[0];
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push(remaining.substring(lastIndex, matchIndex));
    }

    if (matchText.startsWith('`')) {
      const codeVal = matchText.slice(1, -1);
      parts.push(
        <code key={key++} style={{
          background: 'rgba(var(--white-rgb),0.06)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#f43f5e'
        }}>{codeVal}</code>
      );
    } else if (matchText.startsWith('**')) {
      const boldVal = matchText.slice(2, -2);
      parts.push(
        <strong key={key++} style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{boldVal}</strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < remaining.length) {
    parts.push(remaining.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function renderFormattedText(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <li key={idx} style={{ marginLeft: '16px', marginBottom: '6px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5', listStyleType: 'disc' }}>
          {parseInlineFormatting(trimmed.substring(2))}
        </li>
      );
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/);
      return (
        <li key={idx} style={{ marginLeft: '16px', marginBottom: '6px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5', listStyleType: 'decimal' }}>
          {parseInlineFormatting(match[2])}
        </li>
      );
    }
    if (trimmed === '') {
      return <div key={idx} style={{ height: '8px' }} />;
    }
    return (
      <p key={idx} style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
        {parseInlineFormatting(line)}
      </p>
    );
  });
}

function HeaderActionBtn({ label, icon, active, activeBg, activeColor, inactiveBorder, hoverBg, onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <button
      onClick={(e) => {
        setClicked(true);
        setTimeout(() => setClicked(false), 150);
        onClick(e);
      }}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '4px 10px', borderRadius: '8px',
        border: `1px solid ${active ? 'transparent' : (hovered ? 'rgba(var(--white-rgb),0.15)' : inactiveBorder)}`,
        background: active ? activeBg : (hovered ? hoverBg : 'rgba(var(--white-rgb),0.03)'),
        color: active ? activeColor : 'var(--text-muted)',
        fontSize: '11px', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        transform: clicked ? 'scale(0.97)' : 'none',
      }}
    >
      <span style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      <span className="btn-label-desktop">{label}</span>
    </button>
  );
}

function CompanyPill({ label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--card-bg-hover)' : 'var(--bg-elevated)',
        border: `1px solid ${hovered ? 'rgba(var(--white-rgb),0.15)' : 'rgba(var(--white-rgb),0.08)'}`,
        borderRadius: '6px', padding: '2px 8px', fontSize: '11px', color: 'var(--text-muted)',
        transition: 'all 0.15s'
      }}
    >{label}</span>
  )
}

function LCLink({ url }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={url} target="_blank" rel="noreferrer"
      onClick={e => e.stopPropagation()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '6px',
        color: '#3B82F6', background: hovered ? 'var(--tag-bg-blue-light)' : 'var(--tag-bg-blue-alt)',
        border: '1px solid #3B82F630',
        textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap',
      }}
    >↗ LC</a>
  )
}

function ActionBtn({ label, icon, active, activeIconColor, defaultColor, defaultBg, defaultBorder, hoverBg, hoverBorder, hoverShadow, hoverColor, onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <button
      onClick={(e) => {
        setClicked(true);
        setTimeout(() => setClicked(false), 150);
        onClick(e);
      }}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        padding: '6px 12px', borderRadius: '8px',
        border: `1px solid ${hovered || active ? hoverBorder : defaultBorder}`,
        background: hovered || active ? hoverBg : defaultBg,
        color: hovered && hoverColor && !active ? hoverColor : defaultColor,
        fontSize: '12px', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        transform: clicked ? 'scale(0.97)' : 'none',
        filter: active ? 'brightness(1.1)' : 'none',
        boxShadow: (hovered || active) && hoverShadow ? hoverShadow : 'none',
        width: '100%'
      }}
    >
      <span style={{ color: active && activeIconColor ? activeIconColor : 'inherit', fontSize: '14px' }}>{icon}</span>
      {label}
    </button>
  );
}

function EditorToolbarBtn({ icon, label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: hover ? 'var(--bg-elevated)' : 'transparent',
        border: '1px solid transparent',
        borderColor: hover ? 'rgba(var(--white-rgb),0.08)' : 'transparent',
        color: hover ? 'var(--text-primary)' : 'var(--text-muted)',
        padding: '4px 10px', borderRadius: '6px',
        fontSize: '11px', fontWeight: '600', cursor: 'pointer',
        transition: 'all 0.15s'
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

function ConfidenceStars({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ['', 'Shaky', 'Getting there', 'Decent', 'Solid', 'Crystal clear'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: '#00D4AA', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CONFIDENCE</span>
        <span style={{ fontSize: '10px', color: '#00D4AA', fontWeight: '600' }}>{labels[hover || value] || ''}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            style={{
              width: '18%', height: '26px', border: 'none', borderRadius: '6px', cursor: 'pointer',
              background: n <= (hover || value) ? 'rgba(0,212,170,0.2)' : 'rgba(var(--white-rgb),0.04)',
              color: n <= (hover || value) ? '#00D4AA' : 'rgba(var(--white-rgb),0.2)',
              fontSize: '14px', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >★</button>
        ))}
      </div>
    </div>
  );
}

function DragHandle({ onMouseDown, isDragging }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '6px',
        cursor: 'col-resize',
        background: (hovered || isDragging) ? 'rgba(0, 212, 170, 0.15)' : 'transparent',
        borderLeft: '1px solid rgba(var(--white-rgb), 0.08)',
        borderRight: '1px solid rgba(var(--white-rgb), 0.08)',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        zIndex: 50,
        position: 'relative',
        userSelect: 'none'
      }}
    >
      <div style={{
        width: '2px',
        height: '24px',
        borderRadius: '1px',
        background: (hovered || isDragging) ? '#00D4AA' : 'rgba(var(--white-rgb), 0.25)',
        transition: 'background 0.2s'
      }} />
    </div>
  );
}

export default function QuestionCard({ question: initialQ, onUpdate, isNarrow }) {
  const [q, setQ] = useState(initialQ);
  const [currentId, setCurrentId] = useState(initialQ.id);
  const [expanded, setExpanded] = useState(false);
  const [editorExpanded, setEditorExpanded] = useState(false);
  const [note, setNote] = useState(initialQ.personalNote || '');
  const [bruteNote, setBruteNote] = useState(initialQ.bruteNotes || '');
  const [optimalNote, setOptimalNote] = useState(initialQ.optimalNotes || '');
  const [activeTab, setActiveTab] = useState('optimal'); // Default to Optimal
  const [timeMin, setTimeMin] = useState(initialQ.timeMinutes || 0);
  const [timeSec, setTimeSec] = useState(initialQ.timeSeconds || 0);
  const [saving, setSaving] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [maxHovered, setMaxHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [leftWidth, setLeftWidth] = useState(30); // Default to 30%
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const splitContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (moveEvent) => {
      const container = splitContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      let newWidth = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      if (newWidth < 15) newWidth = 15;
      if (newWidth > 75) newWidth = 75;
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const editorRef = useRef(null);
  const cursorPositionsRef = useRef({
    optimal: { start: 0, end: 0 },
    brute: { start: 0, end: 0 },
    notes: { start: 0, end: 0 }
  });

  const captureCursor = useCallback((e) => {
    const textarea = e.currentTarget;
    if (textarea) {
      cursorPositionsRef.current[activeTab] = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd
      };
    }
  }, [activeTab]);

  useLayoutEffect(() => {
    if (editorRef.current) {
      const pos = cursorPositionsRef.current[activeTab];
      if (pos && document.activeElement === editorRef.current) {
        editorRef.current.setSelectionRange(pos.start, pos.end);
      }
    }
  }); // Run after every single render to keep cursor position perfectly synchronized

  useEffect(() => {
    if (initialQ.id !== currentId) {
      setCurrentId(initialQ.id);
      setBruteNote(initialQ.bruteNotes || '');
      setOptimalNote(initialQ.optimalNotes || '');
      setNote(initialQ.personalNote || '');
      setTimeMin(initialQ.timeMinutes || 0);
      setTimeSec(initialQ.timeSeconds || 0);
      setIsMaximized(false);
      setShowInfo(false);
    }
    setQ(initialQ);
  }, [initialQ, currentId]);

  useEffect(() => {
    if (!isMaximized) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMaximized(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMaximized]);

  // Use a ref for the latest q so the doUpdate callback never goes stale
  // and we don't need q in its dependency array (which caused re-creation loops).
  const qRef = React.useRef(q);
  qRef.current = q;

  const onUpdateRef = React.useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const doUpdate = useCallback(async (patch) => {
    const current = qRef.current;
    const previousQ = current;
    const optimisticQ = { ...current, ...patch };
    setQ(optimisticQ);

    setSaving(true);
    try {
      const res = await updateProgress(current.id, patch);
      // API response is the single source of truth
      setQ(res.data);
      onUpdateRef.current?.(res.data);
    } catch (e) {
      console.error(e);
      setQ(previousQ);
    }
    setSaving(false);
  }, []); // stable — no dependencies, uses refs

  const saveNote = useCallback(async () => {
    const patch = {
      status: q.status,
      timeMinutes: Number(timeMin) || 0,
      timeSeconds: Number(timeSec) || 0,
      bruteNotes: bruteNote,
      optimalNotes: optimalNote,
      personalNote: note
    };
    await doUpdate(patch);
  }, [q.status, timeMin, timeSec, bruteNote, optimalNote, note, doUpdate]);

  // Auto-save effect
  useEffect(() => {
    const hasChanges =
      bruteNote !== (q.bruteNotes || '') ||
      optimalNote !== (q.optimalNotes || '') ||
      note !== (q.personalNote || '') ||
      Number(timeMin) !== (q.timeMinutes || 0) ||
      Number(timeSec) !== (q.timeSeconds || 0);

    if (hasChanges && !saving) {
      const timer = setTimeout(() => {
        saveNote();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [bruteNote, optimalNote, note, timeMin, timeSec, q, saving, saveNote]);

  const handleFormat = () => {
    let currentNote = '';
    if (activeTab === 'brute') currentNote = bruteNote;
    else if (activeTab === 'optimal') currentNote = optimalNote;
    else currentNote = note;

    let indent = 0;
    const lines = currentNote.split('\n');
    const formatted = lines.map(line => {
      let trimmed = line.trim();
      if (trimmed === '') return '';

      // Strip single-line and multi-line comments for brace matching
      let cleanLine = trimmed;
      cleanLine = cleanLine.replace(/\/\*[\s\S]*?\*\//g, '').trim();
      const commentIdx = cleanLine.indexOf('//');
      if (commentIdx !== -1) {
        cleanLine = cleanLine.substring(0, commentIdx).trim();
      }

      if (cleanLine.startsWith('}') || cleanLine.startsWith(']') || cleanLine.startsWith(')')) {
        indent = Math.max(0, indent - 1);
      }
      const result = '    '.repeat(indent) + trimmed;
      if (cleanLine.endsWith('{') || cleanLine.endsWith('[') || cleanLine.endsWith('(')) {
        indent++;
      }
      return result;
    });
    const formattedStr = formatted.join('\n');
    if (activeTab === 'brute') setBruteNote(formattedStr);
    else if (activeTab === 'optimal') setOptimalNote(formattedStr);
    else setNote(formattedStr);
  };

  const tags = (q.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const companies = (q.companies || '').split(',').map(c => c.trim()).filter(Boolean);
  const diff = DIFF_CONFIG[q.difficulty] || DIFF_CONFIG.M;
  const statusConfig = STATUS_CONFIG[q.status];

  const isSolved = q.status === 'solved';
  const isAttempted = q.status === 'attempted';
  const isSkipped = q.status === 'skipped';

  const cardBorderColor = isSolved ? 'rgba(0,212,170,0.3)' : isAttempted ? 'rgba(245,158,11,0.3)' : 'rgba(var(--white-rgb),0.06)';

  const cardStyle = {
    background: 'var(--bg-surface)',
    border: `1px solid ${cardBorderColor}`,
    borderRadius: '12px',
    marginBottom: '11px',
    overflow: isMaximized ? 'hidden' : 'visible',
    boxShadow: isMaximized
      ? '0 24px 64px rgba(0,0,0,0.6)'
      : (expanded ? '0 12px 48px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.2)'),
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    ...(isMaximized ? {
      position: 'fixed',
      top: '15px',
      left: '15px',
      right: '15px',
      bottom: '15px',
      zIndex: 9999,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fullscreen-fade 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    } : {})
  };

  const cardLayout = (
    <>
      {isMaximized && (
        <div
          onClick={() => setIsMaximized(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 5, 10, 0.82)',
            backdropFilter: 'blur(12px)',
            zIndex: 9998,
            animation: 'fade-in 0.2s ease-out',
          }}
        />
      )}

      <div id={`question-${q.id}`} className={isNarrow ? "narrow-card" : ""} style={cardStyle}>
        <style>{`
          .premium-editor-textarea:focus { outline: none !important; }
          .split-layout { display: grid; grid-template-columns: 3fr 7fr; }
          @media (max-width: 900px) { .split-layout { grid-template-columns: 1fr; } }
          @media (max-width: 1280px) {
            .btn-label-desktop { display: none !important; }
            .col-toggles { width: 105px !important; }
          }
          .narrow-card .btn-label-desktop { display: none !important; }
          .narrow-card .col-toggles { width: 105px !important; }
          .time-input {
            width: 32px; background: rgba(var(--white-rgb),0.05); border: 1px solid var(--border);
            border-radius: 4px; color: var(--text-primary); font-size: 11px; padding: 4px 2px; outline: none;
            text-align: center; transition: all 0.2s;
          }
          .time-input:focus { border-color: rgba(0,212,170,0.5); background: rgba(0,212,170,0.05); }
          .time-input::-webkit-outer-spin-button, .time-input::-webkit-inner-spin-button {
            -webkit-appearance: none; margin: 0;
          }
          .saving-dot {
            width: 6px; height: 6px; background: #00D4AA; border-radius: 50%;
            animation: saving-pulse 1.5s infinite;
          }
          @keyframes saving-pulse {
            0% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0.3; transform: scale(0.8); }
          }
          @keyframes fullscreen-fade {
            from { transform: scale(0.96); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .header-actions-container {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: flex-end;
            flex-shrink: 0;
          }
          .col-toggles {
            display: flex;
            gap: 6px;
            align-items: center;
            width: 248px;
            flex-shrink: 0;
          }
          .col-difficulty {
            width: 70px;
            display: flex;
            justify-content: center;
            flex-shrink: 0;
          }
          .col-importance {
            width: 80px;
            display: flex;
            justify-content: center;
            flex-shrink: 0;
          }
          .col-lc {
            width: 50px;
            display: flex;
            justify-content: center;
            flex-shrink: 0;
          }
          .col-maximize {
            width: 32px;
            display: flex;
            justify-content: center;
            flex-shrink: 0;
          }
          @media (max-width: 1280px) {
            .col-toggles {
              width: 105px;
            }
          }
        `}</style>

        {/* ── HEADER ROW ── */}
        <div
          onClick={() => {
            if (!isMaximized) {
              setExpanded(e => !e);
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', cursor: isMaximized ? 'default' : 'pointer',
            padding: '10px 16px', background: expanded ? 'rgba(var(--white-rgb),0.02)' : 'transparent',
            borderBottom: expanded ? '1px solid rgba(var(--white-rgb),0.06)' : 'none',
            borderTopLeftRadius: '12px', borderTopRightRadius: '12px',
            flexShrink: 0
          }}
        >
          <div
            onClick={e => {
              e.stopPropagation();
              doUpdate({ status: isSolved ? 'not_started' : 'solved', timeMinutes: Number(timeMin) || 0 });
            }}
            style={{
              width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
              border: `2px solid ${isSolved ? '#00D4AA' : 'rgba(var(--white-rgb),0.2)'}`,
              background: isSolved ? '#00D4AA' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', color: '#000', fontSize: '11px', fontWeight: '900',
            }}
          >
            {isSolved && '✓'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.01em', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {q.name}
            </span>
            {(companies.length > 0 || tags.length > 0) && (
              <div style={{ position: 'relative', display: 'inline-flex' }} onClick={e => e.stopPropagation()}>
                <button
                  onMouseEnter={() => setShowInfo(true)}
                  onMouseLeave={() => setShowInfo(false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(prev => !prev);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: showInfo ? '#00D4AA' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px',
                    borderRadius: '50%',
                    transition: 'all 0.15s ease',
                  }}
                  title="Show question details (Asked at & Tags)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </button>
                {showInfo && (
                  <div
                    onMouseEnter={() => setShowInfo(true)}
                    onMouseLeave={() => setShowInfo(false)}
                    style={{
                      position: 'absolute',
                      top: '22px',
                      left: '0',
                      zIndex: 1000,
                      width: '260px',
                      padding: '12px 14px',
                      background: 'var(--bg-surface)',
                      border: '1px solid rgba(var(--white-rgb),0.12)',
                      borderRadius: '10px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      pointerEvents: 'auto',
                      animation: 'fade-in 0.15s ease-out',
                      cursor: 'default'
                    }}
                  >
                    {companies.length > 0 && (
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '6px', textTransform: 'uppercase' }}>ASKED AT</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {companies.map(c => <CompanyPill key={c} label={c} />)}
                        </div>
                      </div>
                    )}
                    {tags.length > 0 && (
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '6px', textTransform: 'uppercase' }}>TAGS</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {tags.map(t => {
                            const tc = TAG_COLORS[t] || { color: 'var(--text-dim)', bg: 'var(--bg-elevated)', border: 'rgba(var(--white-rgb),0.08)' };
                            return (
                              <span key={t} style={{
                                background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                                borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: '600'
                              }}>{t.replace(/-/g, ' ')}</span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="header-actions-container">
            {/* Header Progress Toggles */}
            <div className="col-toggles" onClick={e => e.stopPropagation()}>
              <HeaderActionBtn
                label="Solved" icon="✓" active={isSolved}
                activeBg="rgba(0, 212, 170, 0.2)" activeColor="#00D4AA"
                inactiveBorder="rgba(0, 212, 170, 0.15)" hoverBg="rgba(0, 212, 170, 0.1)"
                disabled={saving}
                onClick={() => doUpdate({ status: isSolved ? 'not_started' : 'solved', timeMinutes: Number(timeMin) || 0 })}
              />
              <HeaderActionBtn
                label="Attempted" icon="~" active={isAttempted}
                activeBg="rgba(245, 158, 11, 0.2)" activeColor="#F59E0B"
                inactiveBorder="rgba(245, 158, 11, 0.15)" hoverBg="rgba(245, 158, 11, 0.1)"
                disabled={saving}
                onClick={() => doUpdate({ status: isAttempted ? 'not_started' : 'attempted' })}
              />
              <HeaderActionBtn
                label="Revision" icon="●" active={q.needsRevision}
                activeBg="rgba(139, 92, 246, 0.2)" activeColor="#A78BFA"
                inactiveBorder="rgba(139, 92, 246, 0.15)" hoverBg="rgba(139, 92, 246, 0.1)"
                disabled={saving}
                onClick={() => doUpdate({ status: q.status, needsRevision: !q.needsRevision })}
              />
            </div>

            {/* Difficulty Pill Container */}
            <div className="col-difficulty">
              <span style={{
                background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`,
                borderRadius: '999px', padding: '2px 8px', fontSize: '10px', fontWeight: '600',
                display: 'inline-block', textAlign: 'center', width: '100%'
              }}>{diff.label}</span>
            </div>

            {/* Importance Pill Container */}
            <div className="col-importance">
              {q.importance === 'must' && (
                <span style={{
                  background: 'rgba(0, 212, 170, 0.1)', color: '#00D4AA', border: '1px solid rgba(0, 212, 170, 0.3)',
                  borderRadius: '999px', padding: '2px 1px', fontSize: '10px', fontWeight: '600',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%'
                }}>
                  <span style={{ fontSize: '9px' }}>★</span> Must
                </span>
              )}
              {q.importance === 'strong' && (
                <span style={{
                  background: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '999px', padding: '2px 1px', fontSize: '10px', fontWeight: '600',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%'
                }}>
                  <span style={{ fontSize: '9px' }}>◆</span> Strong
                </span>
              )}
              {q.importance === 'optional' && (
                <span style={{
                  background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-muted)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px', padding: '2px 5px', fontSize: '10px', fontWeight: '600',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%'
                }}>
                  <span style={{ fontSize: '10px' }}>○</span> Optional
                </span>
              )}
            </div>

            {/* LC Link Container */}
            <div className="col-lc">
              <LCLink url={q.lcUrl} />
            </div>

            {/* Maximize Button Container */}
            <div className="col-maximize">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setIsMaximized(!isMaximized);
                  setExpanded(true); // Force expanded
                }}
                onMouseEnter={() => setMaxHovered(true)}
                onMouseLeave={() => setMaxHovered(false)}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '6px', borderRadius: '6px',
                  border: `1px solid ${maxHovered ? 'rgba(var(--white-rgb),0.15)' : 'rgba(var(--white-rgb),0.06)'}`,
                  background: maxHovered ? 'rgba(var(--white-rgb),0.08)' : 'rgba(var(--white-rgb),0.03)',
                  color: maxHovered ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  height: '24px', width: '24px', flexShrink: 0
                }}
                title={isMaximized ? "Exit Fullscreen" : "Fullscreen Workspace"}
              >
                {isMaximized ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── EXPANDED SPLIT VIEW ── */}
        {expanded && (
          <ErrorBoundary>
            <div
              ref={splitContainerRef}
              className="split-layout"
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : `${leftWidth}% auto 1fr`,
                width: '100%',
                ...(isMaximized ? { flex: 1, minHeight: 0, overflow: 'hidden' } : {})
              }}
            >
              {/* LEFT PANEL */}
              <div style={{
                padding: '16px 16px 12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflowY: 'auto',
                height: isMaximized ? '100%' : 'auto',
                maxHeight: isMaximized ? 'none' : '500px',
              }}>



                {/* LEETCODE PROBLEM DETAILS */}
                {(() => {
                  const { description, examples, constraints, hints } = parseInsight(q.insight);

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                      {/* Description Block */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Description</span>
                        </div>

                        {description ? (
                          <div style={{ color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.6' }}>
                            {renderFormattedText(description)}
                          </div>
                        ) : (
                          <div style={{
                            background: 'rgba(var(--white-rgb),0.02)', border: '1px dashed rgba(var(--white-rgb),0.1)',
                            borderRadius: '8px', padding: '16px', textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              No problem statement or examples added yet.
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Examples Block */}
                      {examples.length > 0 && (
                        <div>
                          {examples.map((ex, i) => {
                            const lines = ex.content.split('\n');
                            let input = '';
                            let output = '';
                            let explanation = '';

                            lines.forEach(line => {
                              const trimmed = line.trim();
                              if (trimmed.toLowerCase().startsWith('input:')) {
                                input = trimmed.substring(6).trim();
                              } else if (trimmed.toLowerCase().startsWith('output:')) {
                                output = trimmed.substring(7).trim();
                              } else if (trimmed.toLowerCase().startsWith('explanation:')) {
                                explanation = trimmed.substring(12).trim();
                              } else {
                                if (!input && !output && !explanation) {
                                  input = trimmed;
                                } else if (input && !output && !explanation) {
                                  input += '\n' + trimmed;
                                } else if (output && !explanation) {
                                  output += '\n' + trimmed;
                                } else if (explanation) {
                                  explanation += '\n' + trimmed;
                                }
                              }
                            });

                            return (
                              <div key={i} style={{ marginBottom: '14px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>{ex.title}</div>
                                <div style={{
                                  background: 'rgba(0, 0, 0, 0.2)',
                                  border: '1px solid rgba(var(--white-rgb), 0.05)',
                                  borderRadius: '8px',
                                  padding: '10px 12px',
                                  fontFamily: 'monospace',
                                  fontSize: '12px',
                                  color: 'var(--text-primary)',
                                  lineHeight: '1.5'
                                }}>
                                  {input && (
                                    <div style={{ marginBottom: '4px' }}>
                                      <strong style={{ color: '#60A5FA' }}>Input:</strong> {input}
                                    </div>
                                  )}
                                  {output && (
                                    <div style={{ marginBottom: '4px' }}>
                                      <strong style={{ color: '#00D4AA' }}>Output:</strong> {output}
                                    </div>
                                  )}
                                  {explanation && (
                                    <div>
                                      <strong style={{ color: '#F59E0B' }}>Explanation:</strong> {explanation}
                                    </div>
                                  )}
                                  {!input && !output && !explanation && (
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{ex.content}</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Constraints Block */}
                      {constraints && (
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>Constraints</div>
                          <div style={{
                            background: 'rgba(var(--white-rgb), 0.02)',
                            border: '1px solid rgba(var(--white-rgb), 0.06)',
                            borderRadius: '8px',
                            padding: '10px 12px'
                          }}>
                            <ul style={{ margin: 0, paddingLeft: '4px', listStyleType: 'none' }}>
                              {renderFormattedText(constraints)}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Hints Block */}
                      {hints && (
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>Hints & Intuitions</div>
                          <div style={{
                            background: 'rgba(139, 92, 246, 0.05)',
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                            borderRadius: '8px',
                            padding: '10px 12px'
                          }}>
                            {renderFormattedText(hints)}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })()}

                {/* CONFIDENCE STARS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '0px' }}>
                  {isSolved && (
                    <div style={{
                      background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)',
                      borderRadius: '8px', padding: '10px 12px'
                    }}>
                      <ConfidenceStars value={q.confidence || 0} onChange={v => doUpdate({ confidence: v })} />
                    </div>
                  )}
                </div>

                {/* Bottom Spacer to prevent scrolling crop */}
                <div style={{ height: '12px', flexShrink: 0 }} />

              </div>

              {!isMobile && <DragHandle onMouseDown={handleMouseDown} isDragging={isDragging} />}

              {/* RIGHT PANEL - EDITOR */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--code-bg)',
                position: 'relative',
                height: isMaximized ? '100%' : 'auto',
              }}>

                {/* Editor Toolbar */}
                <div style={{
                  padding: '8px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid rgba(var(--white-rgb),0.06)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  position: 'sticky', top: 0, zIndex: 10
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      display: 'flex',
                      background: 'rgba(var(--white-rgb),0.04)',
                      padding: '2px',
                      borderRadius: '8px',
                      border: '1px solid rgba(var(--white-rgb),0.06)'
                    }}>
                      <button
                        onClick={() => setActiveTab('optimal')}
                        style={{
                          padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                          cursor: 'pointer', transition: 'all 0.2s',
                          background: activeTab === 'optimal' ? '#00D4AA20' : 'transparent',
                          color: activeTab === 'optimal' ? '#00D4AA' : 'var(--text-muted)',
                          border: 'none',
                          letterSpacing: '0.02em'
                        }}
                      >OPTIMAL</button>
                      <button
                        onClick={() => setActiveTab('brute')}
                        style={{
                          padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                          cursor: 'pointer', transition: 'all 0.2s',
                          background: activeTab === 'brute' ? 'rgba(245,158,11,0.2)' : 'transparent',
                          color: activeTab === 'brute' ? '#F59E0B' : 'var(--text-muted)',
                          border: 'none',
                          letterSpacing: '0.02em'
                        }}
                      >BRUTE FORCE</button>
                      <button
                        onClick={() => setActiveTab('notes')}
                        style={{
                          padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                          cursor: 'pointer', transition: 'all 0.2s',
                          background: activeTab === 'notes' ? 'rgba(var(--white-rgb), 0.1)' : 'transparent',
                          color: activeTab === 'notes' ? 'var(--text-primary)' : 'var(--text-muted)',
                          border: 'none',
                          letterSpacing: '0.02em'
                        }}
                      >NOTES</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {saving && (
                      <span style={{
                        fontSize: '10px', color: '#00D4AA', marginRight: '8px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <span className="saving-dot"></span> Auto-saving...
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '10px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>TIME:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="number"
                          value={timeMin}
                          onChange={(e) => setTimeMin(e.target.value)}
                          className="time-input"
                          placeholder="MM"
                        />
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>:</span>
                        <input
                          type="number"
                          value={timeSec}
                          onChange={(e) => setTimeSec(e.target.value)}
                          className="time-input"
                          placeholder="SS"
                        />
                      </div>
                    </div>
                    <EditorToolbarBtn icon="✨" label="Format" onClick={handleFormat} />
                    {!isMaximized && (
                      <EditorToolbarBtn icon={editorExpanded ? '↑' : '↓'} label={editorExpanded ? 'Collapse' : 'Expand'} onClick={() => setEditorExpanded(!editorExpanded)} />
                    )}
                  </div>
                </div>

                {/* Editor Container */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  minHeight: 0,
                  height: isMaximized ? 'auto' : (editorExpanded ? '600px' : '320px'),
                  transition: 'height 0.3s cubic-bezier(0.4,0,0.2,1)',
                  padding: '16px 8px'
                }}>
                  <Editor
                    ref={editorRef}
                    onKeyUp={captureCursor}
                    onClick={captureCursor}
                    onSelect={captureCursor}
                    value={activeTab === 'optimal' ? optimalNote : activeTab === 'brute' ? bruteNote : note}
                    onValueChange={(val) => {
                      const setFn = activeTab === 'optimal' ? setOptimalNote : activeTab === 'brute' ? setBruteNote : setNote;
                      setFn(val);
                      if (editorRef.current) {
                        cursorPositionsRef.current[activeTab] = {
                          start: editorRef.current.selectionStart,
                          end: editorRef.current.selectionEnd
                        };
                      }
                    }}
                    tabSize={4}
                    highlight={code => {
                      try {
                        return Prism.highlight(code, Prism.languages.javascript || Prism.languages.clike || {}, 'javascript');
                      } catch (err) {
                        return code;
                      }
                    }}
                    padding={16}
                    style={{
                      fontFamily: '"Fira Code", "JetBrains Mono", Consolas, Monaco, "Courier New", monospace',
                      fontSize: 13,
                      lineHeight: '1.6',
                      outline: 'none',
                      minHeight: '100%',
                      color: 'var(--text-primary)'
                    }}
                    textareaClassName="premium-editor-textarea"
                    placeholder="Paste your solution code, logic, or notes here..."
                  />
                </div>
              </div>
            </div>
          </ErrorBoundary>
        )}
      </div>
    </>
  );

  return isMaximized ? createPortal(cardLayout, document.body) : cardLayout;
}
