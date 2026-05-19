import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WEEKS } from '../data/backendRoadmapData';
import TOPICS from '../data/topics';
import { getTopicProgress, updateTopicProgress, getBackendProgress } from '../api/backendClient';

/* ─── Syntax-colored code block ─────────────────────────── */
function CodeBlock({ lines, lang }) {
  const [copied, setCopied] = useState(false);
  const text = lines.join('\n');
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };
  return (
    <div style={{ position: 'relative', marginBottom: 18, borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#161b22', padding: '8px 16px', borderBottom: '1px solid var(--bg-elevated)' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          {lang && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--text-dim)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang}</span>}
        </div>
        <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: copied ? '#00d4aa' : 'var(--text-dim)', fontWeight: 600, transition: 'color 0.2s' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#0d1117', margin: 0, padding: '16px 20px', fontSize: 12.5, lineHeight: 1.7, overflowX: 'auto', fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace", color: '#e6edf3' }}>
        <code>{text}</code>
      </pre>
    </div>
  );
}

/* ─── Content block renderer ─────────────────────────────── */
function ContentBlock({ block }) {
  switch (block.type) {
    case 'study': return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, marginBottom: 16, background: 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(59,130,246,0.08))', border: '1px solid rgba(59,130,246,0.35)', color: '#60a5fa', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        📖 Study — {block.value}
      </div>
    );
    case 'exercise': return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, marginBottom: 16, background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.08))', border: '1px solid rgba(139,92,246,0.35)', color: '#a78bfa', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        ⚡ {block.label}
      </div>
    );
    case 'p': return <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(230,237,243,0.85)', marginBottom: 14 }}>{block.value}</p>;
    case 'bold': return (
      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 22, marginBottom: 10, color: '#e6edf3', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 3, height: 16, background: 'linear-gradient(180deg,#00d4aa,#00a880)', borderRadius: 3, flexShrink: 0, display: 'inline-block' }} />
        {block.value}
      </div>
    );
    case 'bullet': return (
      <div style={{ display: 'flex', gap: 12, marginBottom: 8, paddingLeft: 8 }}>
        <span style={{ color: '#00d4aa', flexShrink: 0, marginTop: 2, fontSize: 12 }}>▸</span>
        <span style={{ fontSize: 13.5, color: 'rgba(230,237,243,0.8)', lineHeight: 1.7 }}>{block.value}</span>
      </div>
    );
    case 'code': return <CodeBlock lines={block.lines} lang={block.lang} />;
    case 'done': return (
      <div style={{ background: 'linear-gradient(135deg,rgba(0,212,170,0.08),rgba(0,168,128,0.04))', border: '1px solid rgba(0,212,170,0.3)', borderLeft: '3px solid #00d4aa', borderRadius: 12, padding: '16px 20px', marginTop: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#00d4aa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.12em' }}>✅ Done when</div>
        <div style={{ fontSize: 13.5, color: 'rgba(230,237,243,0.85)', lineHeight: 1.7 }}>{block.value}</div>
      </div>
    );
    case 'tip': return (
      <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.25)', borderLeft: '3px solid #3b82f6', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#60a5fa', marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>💡 Tip</div>
        <div style={{ fontSize: 13.5, color: 'rgba(230,237,243,0.85)', lineHeight: 1.7 }}>{block.value}</div>
      </div>
    );
    case 'warn': return (
      <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderLeft: '3px solid #f59e0b', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>⚠️ Warning</div>
        <div style={{ fontSize: 13.5, color: 'rgba(230,237,243,0.85)', lineHeight: 1.7 }}>{block.value}</div>
      </div>
    );
    case 'market': return (
      <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.25)', borderLeft: '3px solid #8b5cf6', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#a78bfa', marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>📊 Market Insight</div>
        <div style={{ fontSize: 13.5, color: 'rgba(230,237,243,0.85)', lineHeight: 1.7 }}>{block.value}</div>
      </div>
    );
    default: return null;
  }
}

function FocusTimer() {
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

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
    <div style={{ marginTop: 24, padding: '16px 16px 6px 16px', background: 'var(--bg-surface)', border: '1px solid var(--bg-elevated)', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>Focus Timer</div>
        <button onClick={resetTimer} style={{ background: 'none', border: 'none', fontSize: 10, color: 'var(--text-dim)', cursor: 'pointer', padding: 0, fontWeight: 600 }}>↻ Reset</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 300, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-1px' }}>
          {mins}:{secs}
        </div>
        <button onClick={() => setIsRunning(!isRunning)} style={{ width: 36, height: 36, borderRadius: '50%', background: isRunning ? 'rgba(239,68,68,0.1)' : 'rgba(0,212,170,0.1)', border: 'none', color: isRunning ? '#ef4444' : '#00d4aa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', fontSize: 14 }}>
          {isRunning ? '⏸' : '▶'}
        </button>
      </div>
      <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: isRunning ? '#00d4aa' : 'var(--text-muted)', transition: 'width 1s linear' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <button onClick={() => setTimer('focus')} style={{ background: 'none', border: 'none', fontSize: 10, color: mode === 'focus' ? '#00d4aa' : 'var(--text-dim)', cursor: 'pointer', padding: 0, fontWeight: 600, transition: 'color 0.2s' }}>25m Focus</button>
        <button onClick={() => setTimer('break')} style={{ background: 'none', border: 'none', fontSize: 10, color: mode === 'break' ? '#00d4aa' : 'var(--text-dim)', cursor: 'pointer', padding: 0, fontWeight: 600, transition: 'color 0.2s' }}>5m Break</button>
      </div>
    </div>
  );
}

/* ─── Left sidebar ───────────────────────────────────────── */
function WeekSidebar({ week, currentTopicId, allProgress, onNavigate }) {
  const done = week.days.filter(t => allProgress[t]?.status === 'DONE').length;
  const pct = Math.round((done / week.days.length) * 100);

  return (
    <aside style={{ width: 260, flexShrink: 0, height: '100%', overflowY: 'auto', paddingBottom: 32, paddingRight: 8 }}>
      {/* Week header */}
      <div style={{ padding: '14px 14px 10px', background: 'var(--bg-surface)', border: '1px solid var(--bg-elevated)', borderRadius: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#00d4aa', marginBottom: 2 }}>Week {week.number}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 10 }}>{week.title.split('+')[0].trim()}</div>
        <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#00d4aa,#00a880)', borderRadius: 4, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{done}/{week.days.length} days</span>
          <span style={{ fontSize: 10, color: '#00d4aa', fontWeight: 700 }}>{pct}%</span>
        </div>
      </div>

      {/* Day list */}
      {week.days.map((tid) => {
        const t = TOPICS[tid];
        if (!t) return null;
        const st = allProgress[tid]?.status || 'NOT_STARTED';
        const isActive = tid === currentTopicId;
        return (
          <div key={tid} onClick={() => onNavigate(tid)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 10, marginBottom: 2, cursor: 'pointer', transition: 'all 0.15s',
              background: isActive ? 'linear-gradient(135deg,rgba(0,212,170,0.15),rgba(0,212,170,0.06))' : 'transparent',
              border: isActive ? '1px solid rgba(0,212,170,0.3)' : '1px solid transparent',
            }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
              background: st === 'DONE' ? 'rgba(0,212,170,0.2)' : st === 'IN_PROGRESS' ? 'rgba(245,158,11,0.2)' : 'var(--bg-elevated)',
              border: `1px solid ${st === 'DONE' ? 'rgba(0,212,170,0.4)' : st === 'IN_PROGRESS' ? 'rgba(245,158,11,0.4)' : 'var(--border)'}`,
            }}>
              {st === 'DONE' ? '✓' : st === 'IN_PROGRESS' ? '◉' : t.dayNumber}
            </div>
            <div style={{ minWidth: 0, padding: '2px 0' }}>
              <div style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? '#00d4aa' : 'var(--text-gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.title}
              </div>
            </div>
          </div>
        );
      })}

      {/* Focus Timer Widget */}
      <FocusTimer />

    </aside>
  );
}

/* ─── Topic Footer ───────────────────────────────────────── */
function TopicFooter({ notes, onNotesChange, saving }) {
  return (
    <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--bg-elevated)' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-elevated)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Personal Notes</div>
          {saving && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              Saving…
            </div>
          )}
        </div>
        <textarea value={notes} onChange={e => onNotesChange(e.target.value)}
          placeholder="Jot down key takeaways, commands, or concepts you want to remember..."
          style={{
            flex: 1, width: '100%', resize: 'vertical', boxSizing: 'border-box', minHeight: 120,
            background: 'var(--bg-elevated)', border: '1px solid var(--bg-elevated)',
            borderRadius: 12, padding: '14px 16px', fontSize: 13, lineHeight: 1.6,
            color: 'var(--text-primary)', fontFamily: "'Inter',sans-serif", outline: 'none',
          }} />
        <div style={{ fontSize: 11, color: 'var(--border-strong)', marginTop: 8, textAlign: 'right' }}>auto-saves automatically</div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function BackendTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('NOT_STARTED');
  const [notes, setNotes] = useState('');
  const [failureSimDone, setFailureSimDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [allProgress, setAllProgress] = useState({});

  const topic = TOPICS[topicId];
  const week = topic ? WEEKS[topic.weekId] : null;

  useEffect(() => {
    if (!topicId) return;
    setLoaded(false);
    getTopicProgress(topicId).then(r => {
      const d = r.data;
      setStatus(d.status || 'NOT_STARTED');
      setNotes(d.notes || '');
      setFailureSimDone(d.failureSimDone || false);
      setLoaded(true);
    }).catch(() => setLoaded(true));
    getBackendProgress().then(r => setAllProgress(r.data)).catch(() => { });
  }, [topicId]);

  const save = useCallback(async (updates) => {
    setSaving(true);
    try {
      await updateTopicProgress(topicId, updates);
      if (updates.status) setAllProgress(prev => ({ ...prev, [topicId]: { ...prev[topicId], status: updates.status } }));
    } catch (e) { console.error('Save failed', e); }
    finally { setSaving(false); }
  }, [topicId]);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => { if (notes !== '') save({ notes }); }, 1000);
    return () => clearTimeout(timer);
  }, [notes, loaded]);

  const handleStatusChange = (s) => { setStatus(s); save({ status: s }); };
  const handleFailureSim = (v) => { setFailureSimDone(v); save({ failureSimDone: v }); };

  if (!topic || !week) return <div style={{ padding: 40, color: 'var(--text-primary)' }}>Topic not found</div>;

  const dayIdx = week.days.indexOf(topicId);
  const prevTopic = dayIdx > 0 ? week.days[dayIdx - 1] : null;
  const nextTopic = dayIdx < week.days.length - 1 ? week.days[dayIdx + 1] : null;
  const hasFailureSim = topic.content.some(b => b.type === 'bold' && b.value.toLowerCase().includes('failure simulation'));

  const statuses = [
    { key: 'NOT_STARTED', label: 'Not Started', icon: '○', color: 'var(--text-muted)', activeColor: 'var(--text-light)', bg: 'transparent', activeBg: 'var(--bg-elevated)' },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: '◉', color: '#f59e0b', activeColor: '#f59e0b', bg: 'transparent', activeBg: 'rgba(245,158,11,0.15)' },
    { key: 'DONE', label: 'Done', icon: '✓', color: '#00d4aa', activeColor: '#00d4aa', bg: 'transparent', activeBg: 'rgba(0,212,170,0.15)' },
  ];

  return (
    <div style={{ position: 'fixed', top: 56, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1400, display: 'flex', gap: 20, padding: '24px 20px 0' }}>

        {/* LEFT */}
        <WeekSidebar week={week} currentTopicId={topicId} allProgress={allProgress} onNavigate={tid => navigate(`/backend/topic/${tid}`, { replace: true })} />

        {/* CENTER */}
        <main style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', padding: '0 40px 80px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <button onClick={() => navigate('/backend/roadmap')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 12, cursor: 'pointer', padding: 0, fontWeight: 500, transition: 'color 0.15s' }}>Roadmap</button>
            <span style={{ color: 'var(--border-strong)' }}>/</span>
            <span style={{ fontSize: 12, color: 'var(--text-gray)', fontWeight: 500 }}>Week {week.number} · Day {topic.dayNumber}</span>
          </div>

          {/* Hero header */}
          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--bg-elevated)' }}>
            {/* Top Row: Tags & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', background: 'linear-gradient(135deg,rgba(0,212,170,0.2),rgba(0,212,170,0.1))', color: '#00d4aa', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(0,212,170,0.3)' }}>
                  Day {topic.dayNumber}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'var(--bg-elevated)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: 20, border: '1px solid var(--card-border)' }}>
                  {topic.estimatedMinutes >= 120 ? `${(topic.estimatedMinutes / 60).toFixed(1)} hrs` : `${topic.estimatedMinutes} min`}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface)', border: '1px solid var(--bg-elevated)', padding: 6, borderRadius: 16 }}>
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

                {hasFailureSim && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', borderRadius: 12, cursor: 'pointer', background: failureSimDone ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.05)', border: `1px solid ${failureSimDone ? 'rgba(239,68,68,0.35)' : 'rgba(239,68,68,0.15)'}`, transition: 'all 0.15s', height: 44 }}>
                    <input type="checkbox" checked={failureSimDone} onChange={e => handleFailureSim(e.target.checked)} style={{ accentColor: '#ef4444', width: 14, height: 14 }} />
                    <span style={{ fontSize: 12, color: failureSimDone ? '#f87171' : 'var(--text-muted)', fontWeight: failureSimDone ? 700 : 500 }}>💥 Failure sim</span>
                  </label>
                )}
              </div>
            </div>

            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.25, marginBottom: 8, background: 'linear-gradient(135deg,var(--text-primary),rgba(var(--white-rgb),0.75))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {topic.title}
            </h1>
            {topic.subtitle && <div style={{ fontSize: 13, color: 'var(--text-dim)', fontStyle: 'italic', letterSpacing: '0.01em' }}>{topic.subtitle}</div>}
          </div>

          {/* Content */}
          <div style={{ lineHeight: 1.75 }}>
            {topic.content.map((block, i) => <ContentBlock key={i} block={block} />)}
          </div>

          {/* Footer actions */}
          <TopicFooter notes={notes} onNotesChange={setNotes} saving={saving} />

          {/* Bottom nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--bg-elevated)' }}>
            {prevTopic ? (
              <button onClick={() => navigate(`/backend/topic/${prevTopic}`, { replace: true })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '14px 20px', borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--bg-elevated)', cursor: 'pointer', gap: 3, transition: 'all 0.15s' }}>
                <span style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Previous</span>
                <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500 }}>Day {TOPICS[prevTopic]?.dayNumber} — {TOPICS[prevTopic]?.title}</span>
              </button>
            ) : <div />}
            {nextTopic && (
              <button onClick={() => navigate(`/backend/topic/${nextTopic}`, { replace: true })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '14px 20px', borderRadius: 12, background: 'linear-gradient(135deg,rgba(0,212,170,0.12),rgba(0,168,128,0.08))', border: '1px solid rgba(0,212,170,0.3)', cursor: 'pointer', gap: 3, transition: 'all 0.15s' }}>
                <span style={{ fontSize: 9, color: '#00d4aa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Next →</span>
                <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500 }}>Day {TOPICS[nextTopic]?.dayNumber} — {TOPICS[nextTopic]?.title}</span>
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
