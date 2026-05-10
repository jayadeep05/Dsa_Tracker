import React, { useState, useEffect, useCallback } from 'react';
import { updateProgress } from '../api/client';
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
        color: hover ? '#E4E4E7' : '#A1A1AA',
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

export default function QuestionCard({ question: initialQ, onUpdate }) {
  const [q, setQ] = useState(initialQ);
  const [expanded, setExpanded] = useState(false);
  const [editorExpanded, setEditorExpanded] = useState(false);
  const [note, setNote] = useState(initialQ.personalNote || '');
  const [bruteNote, setBruteNote] = useState(initialQ.bruteNotes || '');
  const [optimalNote, setOptimalNote] = useState(initialQ.optimalNotes || '');
  const [activeTab, setActiveTab] = useState('optimal'); // Default to Optimal
  const [timeMin, setTimeMin] = useState(initialQ.timeMinutes || 0);
  const [timeSec, setTimeSec] = useState(initialQ.timeSeconds || 0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setQ(initialQ);
    setBruteNote(initialQ.bruteNotes || '');
    setOptimalNote(initialQ.optimalNotes || '');
    setNote(initialQ.personalNote || '');
    setTimeMin(initialQ.timeMinutes || 0);
    setTimeSec(initialQ.timeSeconds || 0);
  }, [initialQ]);

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
      setBruteNote(res.data.bruteNotes || '');
      setOptimalNote(res.data.optimalNotes || '');
      setNote(res.data.personalNote || '');
      setTimeMin(res.data.timeMinutes || 0);
      setTimeSec(res.data.timeSeconds || 0);
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
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        indent = Math.max(0, indent - 1);
      }
      const result = '  '.repeat(indent) + trimmed;
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
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

  return (
    <div
      id={`question-${q.id}`}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${cardBorderColor}`,
        borderRadius: '12px',
        marginBottom: '12px',
        overflow: 'hidden',
        boxShadow: expanded ? '0 12px 48px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.2)',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <style>{`
        .premium-editor-textarea:focus { outline: none !important; }
        .split-layout { display: grid; grid-template-columns: 3fr 7fr; }
        @media (max-width: 900px) { .split-layout { grid-template-columns: 1fr; } }
        .time-input {
          width: 32px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px; color: #fff; font-size: 11px; padding: 4px 2px; outline: none;
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
      `}</style>

      {/* ── HEADER ROW ── */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
          padding: '14px 18px', background: expanded ? 'rgba(var(--white-rgb),0.02)' : 'transparent',
          borderBottom: expanded ? '1px solid rgba(var(--white-rgb),0.06)' : 'none'
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

        <span style={{ fontSize: '15px', fontWeight: '600', flex: 1, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {q.name}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {statusConfig && (
            <span style={{
              background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}`,
              borderRadius: '999px', padding: '2px 8px', fontSize: '10px', fontWeight: '600'
            }}>{statusConfig.label}</span>
          )}

          <span style={{
            background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`,
            borderRadius: '999px', padding: '2px 8px', fontSize: '10px', fontWeight: '600'
          }}>{diff.label}</span>

          {q.importance === 'must' && (
            <span style={{
              background: 'var(--tag-bg-green)', color: '#00D4AA', border: '1px solid #00D4AA50',
              borderRadius: '999px', padding: '2px 8px', fontSize: '10px', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              <span style={{ fontSize: '9px' }}>★</span> Must
            </span>
          )}

          <LCLink url={q.lcUrl} />

          <span style={{
            color: 'var(--text-dim)', fontSize: '12px', marginLeft: '6px',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
          }}>▾</span>
        </div>
      </div>

      {/* ── EXPANDED SPLIT VIEW ── */}
      {expanded && (
        <ErrorBoundary>
          <div className="split-layout">
            {/* LEFT PANEL (30%) */}
            <div style={{ padding: '20px', borderRight: '1px solid rgba(var(--white-rgb),0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* INSIGHT */}
              {q.insight && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--tag-bg-green) 0%, var(--tag-bg-green-alt) 100%)',
                  border: '1px solid rgba(0,212,170,0.15)', borderRadius: '8px', padding: '12px',
                  display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '-6px'
                }}>
                  <span style={{ color: 'var(--accent-green)', fontSize: '13px' }}>💡</span>
                  <span style={{ fontSize: '12px', color: 'var(--callout-text)', lineHeight: '1.6' }}>{q.insight}</span>
                </div>
              )}

              {/* METADATA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {companies.length > 0 && (
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '8px' }}>ASKED AT</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {companies.map(c => <CompanyPill key={c} label={c} />)}
                    </div>
                  </div>
                )}
                {tags.length > 0 && (
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '8px' }}>TAGS</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {tags.map(t => {
                        const tc = TAG_COLORS[t] || { color: 'var(--text-dim)', bg: 'var(--bg-elevated)', border: 'rgba(var(--white-rgb),0.08)' };
                        return (
                          <span key={t} style={{
                            background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                            borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: '500'
                          }}>{t.replace(/-/g, ' ')}</span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ height: '1px', background: 'rgba(var(--white-rgb),0.06)' }} />

              {/* TRACKING ACTIONS */}
              <div>
                <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '10px' }}>PROGRESS TRACKING</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <ActionBtn
                    label="Solved" icon="✓" active={isSolved}
                    defaultColor="#00D4AA" defaultBg="var(--tag-bg-green-alt)" defaultBorder="#00D4AA40"
                    hoverBg="var(--tag-bg-green)" hoverBorder="#00D4AA80" hoverShadow="0 0 12px #00D4AA20"
                    disabled={saving}
                    onClick={() => doUpdate({ status: isSolved ? 'not_started' : 'solved', timeMinutes: Number(timeMin) || 0 })}
                  />
                  <ActionBtn
                    label="Attempted" icon="~" active={isAttempted}
                    defaultColor="#F59E0B" defaultBg="var(--tag-bg-amber)" defaultBorder="#F59E0B40"
                    hoverBg="var(--tag-bg-amber-alt)" hoverBorder="#F59E0B80"
                    disabled={saving}
                    onClick={() => doUpdate({ status: isAttempted ? 'not_started' : 'attempted' })}
                  />
                  <ActionBtn
                    label="Skip" icon="⊘" active={isSkipped}
                    defaultColor="var(--text-muted)" defaultBg="var(--bg-elevated)" defaultBorder="rgba(var(--white-rgb),0.07)"
                    hoverBg="var(--card-bg-hover)" hoverBorder="rgba(var(--white-rgb),0.07)" hoverColor="var(--text-dim)"
                    disabled={saving}
                    onClick={() => doUpdate({ status: isSkipped ? 'not_started' : 'skipped' })}
                  />
                  <ActionBtn
                    label="Revision" icon="●" active={q.needsRevision} activeIconColor="#FCD34D"
                    defaultColor="#A78BFA" defaultBg="var(--tag-bg-purple)" defaultBorder="#8B5CF640"
                    hoverBg="var(--tag-bg-purple-alt)" hoverBorder="#8B5CF680" hoverShadow="0 0 12px #8B5CF620"
                    disabled={saving}
                    onClick={() => doUpdate({ status: q.status, needsRevision: !q.needsRevision })}
                  />
                </div>
              </div>

              {/* CONFIDENCE & TIME */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {isSolved && (
                  <div style={{
                    background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)',
                    borderRadius: '8px', padding: '12px'
                  }}>
                    <ConfidenceStars value={q.confidence || 0} onChange={v => doUpdate({ confidence: v })} />
                  </div>
                )}

              </div>

            </div>

            {/* RIGHT PANEL (70%) - EDITOR */}
            <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--code-bg)', position: 'relative' }}>

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
                        color: activeTab === 'optimal' ? '#00D4AA' : '#A1A1AA',
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
                        color: activeTab === 'brute' ? '#F59E0B' : '#A1A1AA',
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
                        color: activeTab === 'notes' ? '#E4E4E7' : '#A1A1AA',
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
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: 'bold' }}>:</span>
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
                  <EditorToolbarBtn icon={editorExpanded ? '↑' : '↓'} label={editorExpanded ? 'Collapse' : 'Expand'} onClick={() => setEditorExpanded(!editorExpanded)} />
                </div>
              </div>

              {/* Editor Container */}
              <div style={{
                flex: 1, overflowY: 'auto',
                height: editorExpanded ? '600px' : '320px',
                transition: 'height 0.3s cubic-bezier(0.4,0,0.2,1)',
                padding: '16px 8px'
              }}>
                <Editor
                  value={activeTab === 'optimal' ? optimalNote : activeTab === 'brute' ? bruteNote : note}
                  onValueChange={activeTab === 'optimal' ? setOptimalNote : activeTab === 'brute' ? setBruteNote : setNote}
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
                    color: '#D4D4D8'
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
  );
}
