import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SYSTEM_DESIGN_DATA } from '../data/systemDesignData';
import { getSystemDesignTopicProgress, updateSystemDesignTopicProgress, getSystemDesignProgress } from '../api/systemDesignClient';
import SystemDesignVisualizer from '../components/SystemDesignVisualizer';
import SystemDesignIllustration from '../components/SystemDesignIllustration';

/* ─── Simple Markdown & List Renderer ──────────────────── */
function SimpleMarkdown({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  let insideCode = false;
  let codeLines = [];
  let codeLang = '';

  const elements = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code Block Check
    if (trimmed.startsWith('```')) {
      if (insideCode) {
        // close code block
        elements.push(<CodeBlock key={`code-${i}`} lines={codeLines} lang={codeLang} />);
        codeLines = [];
        insideCode = false;
      } else {
        // open code block
        codeLang = trimmed.substring(3).trim();
        insideCode = true;
      }
      continue;
    }

    if (insideCode) {
      codeLines.push(line);
      continue;
    }

    // Empty lines
    if (trimmed === '') {
      elements.push(<div key={`space-${i}`} style={{ height: 10 }} />);
      continue;
    }

    // Markdown tables
    if (trimmed.startsWith('|') && lines[i + 1]?.trim().startsWith('|') && lines[i + 1]?.includes('---')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      i--;
      elements.push(<MarkdownTable key={`table-${i}`} lines={tableLines} />);
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith('>')) {
      elements.push(
        <blockquote key={`quote-${i}`} style={{
          margin: '10px 0 14px',
          padding: '12px 14px',
          borderLeft: '3px solid #00d4aa',
          background: 'rgba(0,212,170,0.06)',
          borderRadius: 10,
          color: 'var(--text-light)',
          fontSize: 13.5,
          lineHeight: 1.6
        }}>
          {parseFormatting(trimmed.replace(/^>\s?/, ''))}
        </blockquote>
      );
      continue;
    }

    // Bullet Points
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={`bullet-${i}`} style={{ display: 'flex', gap: 10, marginBottom: 6, paddingLeft: 8 }}>
          <span style={{ color: '#00d4aa', flexShrink: 0, marginTop: 4, fontSize: 10 }}>▸</span>
          <span style={{ fontSize: 13.5, color: 'var(--text-light)', lineHeight: 1.6 }}>
            {parseFormatting(trimmed.substring(2))}
          </span>
        </div>
      );
      continue;
    }

    // Numbered list items
    if (/^\d+\.\s+/.test(trimmed)) {
      const [, num, body] = trimmed.match(/^(\d+)\.\s+(.*)$/);
      elements.push(
        <div key={`num-${i}`} style={{ display: 'flex', gap: 10, marginBottom: 8, paddingLeft: 2 }}>
          <span style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.25)',
            color: '#3b82f6',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 10,
            fontWeight: 800,
            marginTop: 2
          }}>{num}</span>
          <span style={{ fontSize: 13.5, color: 'var(--text-light)', lineHeight: 1.65 }}>
            {parseFormatting(body)}
          </span>
        </div>
      );
      continue;
    }

    // Standard Paragraph
    elements.push(
      <p key={`p-${i}`} style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-primary)', marginBottom: 12, margin: '6px 0' }}>
        {parseFormatting(line)}
      </p>
    );
  }

  return <div>{elements}</div>;
}

function MarkdownTable({ lines }) {
  const rows = lines
    .filter(line => !/^\|\s*-+/.test(line))
    .map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
  if (!rows.length) return null;
  const [header, ...body] = rows;

  return (
    <div style={{ overflowX: 'auto', margin: '14px 0 20px', border: '1px solid var(--border)', borderRadius: 14 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520, background: 'var(--bg-elevated)' }}>
        <thead>
          <tr>
            {header.map((cell, idx) => (
              <th key={idx} style={{
                textAlign: 'left',
                padding: '11px 13px',
                fontSize: 10.5,
                color: 'var(--accent-blue)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: '1px solid var(--border)'
              }}>
                {parseFormatting(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} style={{
                  padding: '11px 13px',
                  fontSize: 12.8,
                  color: 'var(--text-light)',
                  lineHeight: 1.55,
                  borderTop: idx === 0 ? 'none' : '1px solid var(--border)'
                }}>
                  {parseFormatting(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Parses bold **text** and inline `code`
function parseFormatting(text) {
  // Simple regex-like parser for formatting
  let regex = /(\*\*.*?\*\*|`.*?`)/g;
  let matches = text.split(regex);

  return matches.map((match, idx) => {
    if (match.startsWith('**') && match.endsWith('**')) {
      return <strong key={idx} style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{match.slice(2, -2)}</strong>;
    }
    if (match.startsWith('`') && match.endsWith('`')) {
      return (
        <code key={idx} style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 4, padding: '2px 6px', fontSize: 12,
          fontFamily: "monospace", color: '#ff79c6'
        }}>
          {match.slice(1, -1)}
        </code>
      );
    }
    return match;
  });
}

/* ─── Syntax-colored code block ─────────────────────────── */
function CodeBlock({ lines, lang }) {
  const [copied, setCopied] = useState(false);
  const text = lines.join('\n');
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };
  return (
    <div style={{ position: 'relative', marginBottom: 18, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#161b22', padding: '8px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          {lang && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--text-dim)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang}</span>}
        </div>
        <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: copied ? '#00d4aa' : 'var(--text-dim)', fontWeight: 600, transition: 'color 0.2s' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: 'var(--code-bg)', margin: 0, padding: '16px 20px', fontSize: 12.5, lineHeight: 1.7, overflowX: 'auto', fontFamily: "monospace", color: 'var(--text-primary)' }}>
        <code>{text}</code>
      </pre>
    </div>
  );
}

/* ─── Circular progress ring ─────────────────────────────── */
/* ─── Pomodoro Timer ─────────────────────────────────────── */
function FocusTimer() {
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const setTimer = (m) => {
    setMode(m);
    setTimeLeft(m === 'focus' ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const total = mode === 'focus' ? 25 * 60 : 5 * 60;
  const pct = ((total - timeLeft) / total) * 100;

  return (
    <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>Focus Timer</div>
        <button onClick={resetTimer} style={{ background: 'none', border: 'none', fontSize: 10, color: 'var(--text-dim)', cursor: 'pointer', padding: 0, fontWeight: 600 }}>↻ Reset</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 26, fontWeight: 300, color: 'var(--text-primary)', fontFamily: "monospace", letterSpacing: '-1px' }}>
          {mins}:{secs}
        </div>
        <button onClick={() => setIsRunning(!isRunning)} style={{ width: 34, height: 34, borderRadius: '50%', background: isRunning ? 'rgba(239,68,68,0.1)' : 'rgba(0,212,170,0.1)', border: 'none', color: isRunning ? '#ef4444' : '#00d4aa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', fontSize: 12 }}>
          {isRunning ? '⏸' : '▶'}
        </button>
      </div>
      <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: isRunning ? '#00d4aa' : 'var(--text-muted)', transition: 'width 1s linear' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <button onClick={() => setTimer('focus')} style={{ background: 'none', border: 'none', fontSize: 10, color: mode === 'focus' ? '#00d4aa' : 'var(--text-dim)', cursor: 'pointer', padding: 0, fontWeight: 600 }}>25m Focus</button>
        <button onClick={() => setTimer('break')} style={{ background: 'none', border: 'none', fontSize: 10, color: mode === 'break' ? '#00d4aa' : 'var(--text-dim)', cursor: 'pointer', padding: 0, fontWeight: 600 }}>5m Break</button>
      </div>
    </div>
  );
}

/* ─── Self-check block renderer ────────────────────────── */
function SelfCheckItem({ question, answer }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-light)', lineHeight: 1.5 }}>
        ❓ {question}
      </div>
      
      {show ? (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', animation: 'slideDown 0.25s' }}>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', color: '#00d4aa', marginBottom: 4 }}>Correct Answer:</div>
          <p style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{answer}</p>
        </div>
      ) : (
        <button onClick={() => setShow(true)} style={{
          marginTop: 14, padding: '8px 14px', fontSize: 11.5, fontWeight: 700, borderRadius: 8,
          border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: '#00d4aa',
          cursor: 'pointer', transition: 'all 0.15s'
        }}>
          Show Answer
        </button>
      )}
    </div>
  );
}

/* ─── Content Subsection rendering styles ───────────────── */
function SubsectionBlock({ subsection }) {
  if (subsection.type === 'viz-spec') {
    if (subsection.spec) {
      const type = subsection.spec.type || subsection.spec['interaction type'] || subsection.spec['interaction-type'];
      if (type) {
        return <SystemDesignVisualizer type={type} spec={subsection.spec} />;
      }
    }
    return null;
  }

  if (subsection.type === 'self-check' && subsection.qaList) {
    return (
      <div style={{ margin: '24px 0' }}>
        {subsection.qaList.map((qa, i) => (
          <SelfCheckItem key={i} question={qa.question} answer={qa.answer} />
        ))}
      </div>
    );
  }

  // Border theme colors based on block type
  const theme = {
    problem: { border: '#ef4444', bg: 'rgba(239,68,68,0.03)', badge: '🔴 THE PROBLEM' },
    naive: { border: '#eab308', bg: 'rgba(234,179,8,0.02)', badge: '🟡 NAIVE SOLUTION' },
    breaks: { border: '#f97316', bg: 'rgba(249,115,22,0.03)', badge: '🟠 WHERE IT BREAKS' },
    concept: { border: '#10b981', bg: 'rgba(16,185,129,0.03)', badge: '🟢 THE CONCEPT' },
    'how-it-works': { border: '#3b82f6', bg: 'rgba(59,130,246,0.03)', badge: '🔵 HOW IT WORKS' },
    'trade-offs': { border: '#64748b', bg: 'rgba(100,116,139,0.03)', badge: '⚪ TRADE-OFFS' },
    'real-world': { border: '#8b5cf6', bg: 'rgba(139,92,246,0.03)', badge: '🌍 REAL-WORLD CASE' },
    'beyond-book': { border: '#06b6d4', bg: 'rgba(6,182,212,0.03)', badge: '💡 BEYOND THE BOOK' },
    recap: { border: '#f59e0b', bg: 'rgba(245,158,11,0.03)', badge: '📝 RECAP' }
  }[subsection.type] || { border: 'var(--border)', bg: 'transparent', badge: subsection.title };

  return (
    <div style={{
      background: theme.bg,
      border: '1px solid var(--border)',
      borderLeft: `4px solid ${theme.border}`,
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 20,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.border, marginBottom: 12 }}>
        {theme.badge}
      </div>
      <SimpleMarkdown text={subsection.content} />
    </div>
  );
}

/* ─── Left Sidebar list of topics ───────────────────────── */
function TopicSidebar({ chapter, currentSectionId, allProgress, onNavigate, onCollapse }) {
  const total = chapter.sections.length;
  const done = chapter.sections.filter(sec => allProgress[sec.id]?.status === 'DONE').length;
  const pct = Math.round((done / total) * 100);

  return (
    <aside style={{ width: 280, flexShrink: 0, height: '100%', overflowY: 'auto', paddingBottom: 32, paddingRight: 8 }}>
      {/* Header phase card */}
      <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8b5cf6' }}>Chapter Progress</div>
          <button
            onClick={onCollapse}
            title="Collapse sidebar"
            style={{
              width: '24px', height: '24px', borderRadius: '7px', border: '1px solid rgba(var(--white-rgb),0.09)',
              background: 'rgba(var(--white-rgb),0.04)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--white-rgb),0.09)'; e.currentTarget.style.color = '#8b5cf6'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(var(--white-rgb),0.04)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-light)', lineHeight: 1.4, marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {chapter.title}
        </div>
        <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#8b5cf6,#00d4aa)', borderRadius: 4, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5 }}>
          <span style={{ color: 'var(--text-dim)' }}>{done}/{total} sections completed</span>
          <span style={{ color: '#8b5cf6', fontWeight: 800 }}>{pct}%</span>
        </div>
      </div>

      {/* List of sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {chapter.sections.map((sec) => {
          const st = allProgress[sec.id]?.status || 'NOT_STARTED';
          const isActive = sec.id === currentSectionId;
          const statusColor = st === 'DONE' ? '#00d4aa' : st === 'IN_PROGRESS' ? '#f59e0b' : 'var(--border)';
          
          return (
            <div 
              key={sec.id} 
              onClick={() => onNavigate(sec.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                background: isActive ? 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.06))' : 'transparent',
                border: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
              }}
            >
              {/* Checkbox circle status indicator */}
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                border: `2.5px solid ${statusColor}`,
                background: st === 'DONE' ? '#00d4aa' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: '#000', fontWeight: 800
              }}>
                {st === 'DONE' && '✓'}
              </div>
              
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#a78bfa' : 'var(--text-gray)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {sec.number ? `${sec.number}. ` : ''}{sec.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <FocusTimer />
    </aside>
  );
}

/* ─── Topic Footer ───────────────────────────────────────── */
function TopicFooter({ notes, onNotesChange, saving }) {
  return (
    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 22, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>System Design Takeaways</div>
          {saving && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'pulse 1s infinite' }} />
              Saving…
            </div>
          )}
        </div>
        <textarea 
          value={notes} 
          onChange={e => onNotesChange(e.target.value)}
          placeholder="Write down personal notes, architecture highlights, or trade-offs..."
          style={{
            flex: 1, width: '100%', resize: 'vertical', boxSizing: 'border-box', minHeight: 120,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '14px 16px', fontSize: 13, lineHeight: 1.6,
            color: 'var(--text-primary)', fontFamily: "'Inter',sans-serif", outline: 'none',
          }} 
        />
        <div style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 8, textAlign: 'right' }}>auto-saves automatically</div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function SystemDesignTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('NOT_STARTED');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [allProgress, setAllProgress] = useState({});
  const [isNarrow, setIsNarrow] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 920 : false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('system_design_sidebar_collapsed');
      return stored === 'true';
    }
    return false;
  });

  const handleSidebarCollapseToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('system_design_sidebar_collapsed', collapsed ? 'true' : 'false');
  };

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 920);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lookup chapter and section
  let activeChapter = null;
  let activeSection = null;

  for (const ch of SYSTEM_DESIGN_DATA) {
    const sec = ch.sections.find(s => s.id === topicId);
    if (sec) {
      activeChapter = ch;
      activeSection = sec;
      break;
    }
  }

  useEffect(() => {
    if (!topicId) return;
    getSystemDesignTopicProgress(topicId).then(r => {
      const d = r.data;
      setStatus(d.status || 'NOT_STARTED');
      setNotes(d.notes || '');
      setLoaded(true);
    }).catch(() => setLoaded(true));
    getSystemDesignProgress().then(r => setAllProgress(r.data)).catch(() => { });
  }, [topicId]);

  const save = useCallback(async (updates) => {
    setSaving(true);
    try {
      await updateSystemDesignTopicProgress(topicId, updates);
      if (updates.status) {
        setAllProgress(prev => ({ 
          ...prev, 
          [topicId]: { ...prev[topicId], status: updates.status } 
        }));
      }
    } catch (e) { 
      console.error('Save failed', e); 
    } finally { 
      setSaving(false); 
    }
  }, [topicId]);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      save({ notes });
    }, 1000);
    return () => clearTimeout(timer);
  }, [notes, loaded, save]);

  const handleStatusChange = (s) => {
    setStatus(s);
    save({ status: s });
  };

  if (!activeSection || !activeChapter) {
    return <div style={{ padding: 40, color: 'var(--text-primary)' }}>Section topic not found.</div>;
  }

  const sectionIdx = activeChapter.sections.indexOf(activeSection);
  const prevSection = sectionIdx > 0 ? activeChapter.sections[sectionIdx - 1] : null;
  const nextSection = sectionIdx < activeChapter.sections.length - 1 ? activeChapter.sections[sectionIdx + 1] : null;

  const statuses = [
    { key: 'NOT_STARTED', label: 'Not Started', icon: '○', color: 'var(--text-muted)', activeColor: 'var(--text-light)', bg: 'transparent', activeBg: 'var(--bg-elevated)' },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: '◉', color: '#f59e0b', activeColor: '#f59e0b', bg: 'transparent', activeBg: 'rgba(245,158,11,0.15)' },
    { key: 'DONE', label: 'Done', icon: '✓', color: '#00d4aa', activeColor: '#00d4aa', bg: 'transparent', activeBg: 'rgba(0,212,170,0.15)' },
  ];

  return (
    <div style={{ position: 'fixed', top: 56, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1450, display: 'flex', gap: isNarrow || sidebarCollapsed ? 0 : 20, padding: isNarrow ? '16px 12px 0' : '24px 20px 0' }}>

        {/* LEFT SIDEBAR */}
        {!isNarrow && (
          <div style={{
            width: sidebarCollapsed ? 0 : 280,
            overflow: 'hidden',
            flexShrink: 0,
            height: '100%',
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
            opacity: sidebarCollapsed ? 0 : 1,
          }}>
            <TopicSidebar 
              chapter={activeChapter} 
              currentSectionId={topicId} 
              allProgress={allProgress} 
              onNavigate={id => navigate(`/system-design/topic/${id}`, { replace: true })} 
              onCollapse={() => handleSidebarCollapseToggle(true)}
            />
          </div>
        )}

        {/* CENTER CONTENT */}
        <main style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', padding: isNarrow ? '0 4px 24px' : '0 40px 24px' }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            {!isNarrow && sidebarCollapsed && (
              <button
                onClick={() => handleSidebarCollapseToggle(false)}
                title="Expand sidebar"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  border: '1px solid rgba(var(--white-rgb),0.09)',
                  background: 'rgba(var(--white-rgb),0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8b5cf6',
                  transition: 'all 0.15s',
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(var(--white-rgb),0.09)';
                  e.currentTarget.style.color = '#00d4aa';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(var(--white-rgb),0.04)';
                  e.currentTarget.style.color = '#8b5cf6';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => navigate('/system-design/roadmap')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 12, cursor: 'pointer', padding: 0, fontWeight: 500 }}>System Design</button>
              <span style={{ color: 'var(--border-strong)' }}>/</span>
              <span style={{ fontSize: 12, color: 'var(--text-gray)', fontWeight: 500 }}>{activeChapter.title}</span>
            </div>
          </div>

          {isNarrow && (
            <select
              value={topicId}
              onChange={e => navigate(`/system-design/topic/${e.target.value}`, { replace: true })}
              style={{
                width: '100%',
                marginBottom: 18,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: 12,
                padding: '11px 12px',
                fontSize: 13,
                outline: 'none'
              }}
            >
              {activeChapter.sections.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.number ? `${sec.number}. ` : ''}{sec.title}</option>
              ))}
            </select>
          )}

          {/* Hero header */}
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(139,92,246,0.3)' }}>
                  {activeSection.number ? `Section ${activeSection.number}` : activeSection.type}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'var(--bg-elevated)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border)' }}>
                  Retain: High priority
                </span>
              </div>

              {/* Status checklist bar */}
              <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: 6, borderRadius: 16 }}>
                {statuses.map(s => (
                  <button key={s.key} onClick={() => handleStatusChange(s.key)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                    borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s', border: 'none',
                    background: status === s.key ? s.activeBg : s.bg,
                    color: status === s.key ? s.activeColor : s.color,
                  }}>
                    <span style={{ fontSize: 14 }}>{s.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: status === s.key ? 700 : 500 }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.25, marginBottom: 8, color: 'var(--text-primary)' }}>
              {activeSection.number ? `${activeSection.number}. ` : ''}{activeSection.title}
            </h1>
          </div>

          <SystemDesignIllustration chapter={activeChapter} section={activeSection} />

          {/* Render subsections dynamically */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeSection.subsections.map((sub, i) => (
              <SubsectionBlock key={i} subsection={sub} />
            ))}
          </div>

          {/* Footer Takeaways textarea */}
          <TopicFooter notes={notes} onNotesChange={setNotes} saving={saving} />

          {/* Bottom Next/Prev buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            {prevSection ? (
              <button 
                onClick={() => navigate(`/system-design/topic/${prevSection.id}`, { replace: true })} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '14px 20px', borderRadius: 14, background: 'var(--bg-surface)', border: '1px solid var(--border)', cursor: 'pointer', gap: 3, transition: 'all 0.15s' }}
              >
                <span style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Previous Section</span>
                <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500 }}>
                  {prevSection.number ? `${prevSection.number}. ` : ''}{prevSection.title}
                </span>
              </button>
            ) : <div />}
            {nextSection && (
              <button 
                onClick={() => navigate(`/system-design/topic/${nextSection.id}`, { replace: true })} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '14px 20px', borderRadius: 14, background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(139,92,246,0.06))', border: '1px solid rgba(139,92,246,0.3)', cursor: 'pointer', gap: 3, transition: 'all 0.15s' }}
              >
                <span style={{ fontSize: 9, color: '#a78bfa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Next Section →</span>
                <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500 }}>
                  {nextSection.number ? `${nextSection.number}. ` : ''}{nextSection.title}
                </span>
              </button>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
