import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getPatterns, getPatternQuestions } from '../api/client';
import QuestionCard from '../components/QuestionCard';
import { useSuccess } from '../context/SuccessContext';

const PHASE_RANGES = [
  { key: 'PHASE 1', label: 'Weeks 1–4 · Core', range: [1, 8] },
  { key: 'PHASE 2', label: 'Weeks 5–8 · Data Structures', range: [9, 13] },
  { key: 'PHASE 3', label: 'Weeks 9–12 · Hard Patterns', range: [14, 18] },
  { key: 'PHASE 4', label: 'Weeks 13–16 · Elite', range: [19, 20] },
];

const PHASE_COLORS = {
  'PHASE 1': '#00D4AA',
  'PHASE 2': '#3B82F6',
  'PHASE 3': '#8B5CF6',
  'PHASE 4': '#F59E0B',
};

function getPhase(prepOrder) {
  return PHASE_RANGES.find(p => prepOrder >= p.range[0] && prepOrder <= p.range[1])?.key || 'PHASE 1';
}

function MiniRing({ pct, color = '#00D4AA' }) {
  const r = 10; const circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
      <circle cx="14" cy="14" r={r} fill="none" stroke="rgba(var(--white-rgb),0.06)" strokeWidth="3" />
      <circle
        cx="14" cy="14" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 14 14)"
        style={{ transition: 'stroke-dasharray 0.4s ease' }}
      />
    </svg>
  );
}

const FILTER_BTNS = [
  { v: 'all', l: 'All' }, { v: 'must', l: '★ Must' }, { v: 'strong', l: '◆ Strong' },
  { v: 'optional', l: '○ Optional' }, { v: 'oa', l: 'OA' }, { v: 'revision', l: '🟡 Revision' },
];
const DIFF_BTNS = [{ v: 'all', l: 'All' }, { v: 'E', l: 'Easy' }, { v: 'M', l: 'Med' }, { v: 'H', l: 'Hard' }];

export default function Study() {
  const location = useLocation();
  const [patterns, setPatterns] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { triggerSuccess } = useSuccess();
  const prevQuestionsRef = useRef({});

  useEffect(() => {
    getPatterns().then(r => {
      setPatterns(r.data);
      const initId = location.state?.patternId || r.data[0]?.id;
      setActiveId(initId);
    });
  }, []);

  useEffect(() => {
    if (!activeId) return;
    setLoading(true);
    getPatternQuestions(activeId).then(r => {
      setQuestions(r.data);
      const snap = {};
      r.data.forEach(q => { snap[q.id] = q.status; });
      prevQuestionsRef.current = snap;
      setLoading(false);
    });
  }, [activeId]);

  const activePattern = patterns.find(p => p.id === activeId);
  const activePhase = activePattern ? getPhase(activePattern.prepOrder) : 'PHASE 1';
  const phaseColor = PHASE_COLORS[activePhase] || '#00D4AA';

  const handleUpdate = useCallback((updated) => {
    const prevStatus = prevQuestionsRef.current[updated.id];
    const nowSolved = updated.status === 'solved';
    const wasSolved = prevStatus === 'solved';

    prevQuestionsRef.current[updated.id] = updated.status;

    setQuestions(prev => {
      const newQs = prev.map(q => q.id === updated.id ? updated : q);
      if (nowSolved && !wasSolved) {
        triggerSuccess(updated, activePattern, newQs);
      }
      return newQs;
    });
  }, [activePattern, triggerSuccess]);

  const filtered = questions.filter(q => {
    if (filter === 'must' && q.importance !== 'must') return false;
    if (filter === 'strong' && q.importance !== 'strong') return false;
    if (filter === 'optional' && q.importance !== 'optional') return false;
    if (filter === 'oa' && !(q.tags || '').toLowerCase().includes('oa')) return false;
    if (filter === 'revision' && !q.needsRevision) return false;
    if (diffFilter !== 'all' && q.difficulty !== diffFilter) return false;
    return true;
  });

  const solvedCount = filtered.filter(q => q.status === 'solved').length;

  // Build sidebar with phase headers
  let lastPhase = null;
  const sidebarItems = patterns.map(p => {
    const phase = getPhase(p.prepOrder);
    const header = phase !== lastPhase ? phase : null;
    lastPhase = phase;
    return { p, header };
  });

  return (
    <>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)', marginTop: '56px' }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: sidebarCollapsed ? '52px' : '268px',
          flexShrink: 0, position: 'sticky', top: '56px',
          height: 'calc(100vh - 56px)', overflowY: 'auto', overflowX: 'hidden',
          background: 'var(--sidebar-bg)', borderRight: '1px solid rgba(var(--white-rgb),0.06)',
          padding: '12px 0',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Sidebar header: title + collapse button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            padding: sidebarCollapsed ? '4px 0 8px' : '2px 10px 10px 16px',
            borderBottom: '1px solid rgba(var(--white-rgb),0.05)',
            marginBottom: '4px',
          }}>
            {/* "DSA Patterns" label — hidden when collapsed */}
            {!sidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <svg width="15" height="15" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: 0.7 }}>
                  <rect x="1" y="1" width="4" height="4" rx="1" fill="#00D4AA"/>
                  <rect x="9" y="1" width="4" height="4" rx="1" fill="#3B82F6"/>
                  <rect x="1" y="9" width="4" height="4" rx="1" fill="#8B5CF6"/>
                  <rect x="9" y="9" width="4" height="4" rx="1" fill="#F59E0B"/>
                </svg>
                <span style={{
                  fontSize: '13px', fontWeight: '800', textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'rgba(var(--white-rgb),0.55)',
                }}>DSA Patterns</span>
              </div>
            )}
            {/* Collapse toggle button */}
            <button
              onClick={() => setSidebarCollapsed(c => !c)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                width: '26px', height: '26px', borderRadius: '7px', border: '1px solid rgba(var(--white-rgb),0.09)',
                background: 'rgba(var(--white-rgb),0.04)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(var(--white-rgb),0.35)', transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--white-rgb),0.09)'; e.currentTarget.style.color = 'rgba(var(--white-rgb),0.75)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(var(--white-rgb),0.04)'; e.currentTarget.style.color = 'rgba(var(--white-rgb),0.35)'; }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d={sidebarCollapsed ? 'M4 2l4 4-4 4' : 'M8 2L4 6l4 4'}
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {sidebarItems.map(({ p, header }) => {
            const pc = PHASE_COLORS[getPhase(p.prepOrder)];
            const isActive = p.id === activeId;
            const solvedQ = p.solved || 0;
            const pctQ = p.totalQs > 0 ? (solvedQ / p.totalQs) * 100 : 0;
            return (
              <div key={p.id}>
                {/* Phase header — hidden when collapsed */}
                {header && !sidebarCollapsed && (
                  <div style={{
                    padding: '14px 16px 5px',
                    fontSize: '10px', fontWeight: '800', textTransform: 'uppercase',
                    letterSpacing: '0.12em', color: pc, opacity: 0.7,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <div style={{ flex: 1, height: '1px', background: `${pc}30` }} />
                    {header}
                    <div style={{ flex: 1, height: '1px', background: `${pc}30` }} />
                  </div>
                )}
                {/* Phase divider dot when collapsed */}
                {header && sidebarCollapsed && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 2px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: `${pc}60` }} />
                  </div>
                )}
                <div
                  onClick={() => setActiveId(p.id)}
                  title={sidebarCollapsed ? `${p.prepOrder}. ${p.name}` : undefined}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: sidebarCollapsed ? '0' : '10px',
                    padding: sidebarCollapsed ? '6px 0' : '9px 16px',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    cursor: 'pointer',
                    borderLeft: `3px solid ${isActive ? pc : 'transparent'}`,
                    background: isActive ? `${pc}0D` : 'transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-alpha-3)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {sidebarCollapsed ? (
                    // Collapsed: just show mini-ring with order number centered
                    <div style={{ position: 'relative', width: '28px', height: '28px' }}>
                      <MiniRing pct={pctQ} color={pc} />
                      <span style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '8px', fontWeight: '800', color: isActive ? pc : 'rgba(var(--white-rgb),0.3)',
                      }}>{p.prepOrder}</span>
                    </div>
                  ) : (
                    // Expanded: full row
                    <>
                      <span style={{ fontSize: '11px', color: isActive ? pc : 'rgba(var(--white-rgb),0.2)', fontWeight: '700', width: '18px' }}>{p.prepOrder}.</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px', fontWeight: isActive ? '600' : '500',
                          color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{p.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '1px' }}>
                          Wk {p.weekStart} · {solvedQ}/{p.totalQs}
                        </div>
                      </div>
                      <MiniRing pct={pctQ} color={pc} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>

          {/* Pattern header */}
          {activePattern && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em',
                      color: phaseColor, background: `${phaseColor}15`, border: `1px solid ${phaseColor}30`,
                      padding: '2px 10px', borderRadius: '20px',
                    }}>{activePhase}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Week {activePattern.weekStart}</span>
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                    {activePattern.name}
                  </h2>
                </div>
                {/* Progress summary */}
                <div style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '5px 20px',
                  display: 'flex', gap: '20px', alignItems: 'center',
                }}>
                  {[
                    { label: 'Solved', val: questions.filter(q => q.status === 'solved').length, color: '#00D4AA' },
                    { label: 'Attempted', val: questions.filter(q => q.status === 'attempted').length, color: '#F59E0B' },
                    { label: 'Must-do', val: questions.filter(q => q.importance === 'must').length, color: phaseColor },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── FILTER BAR ── */}
          <div style={{
            display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center',
            marginBottom: '16px', background: 'var(--bg-surface)',
            border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px',
          }}>
            {FILTER_BTNS.map(({ v, l }) => (
              <FilterPill key={v} label={l} active={filter === v} onClick={() => setFilter(v)} color={phaseColor} />
            ))}
            <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 4px' }} />
            {DIFF_BTNS.map(({ v, l }) => (
              <FilterPill key={v} label={l} active={diffFilter === v} onClick={() => setDiffFilter(v)}
                color={v === 'E' ? '#00D4AA' : v === 'M' ? '#F59E0B' : v === 'H' ? '#EF4444' : phaseColor} />
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#00D4AA', fontWeight: '700' }}>{solvedCount}</span>/{filtered.length} solved
            </span>
          </div>

          {/* Question list */}
          {loading
            ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: 'var(--text-muted)', gap: '12px' }}>
              <div className="spinner" /> Loading questions...
            </div>
            : filtered.length === 0
              ? <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>No questions match the current filters.</div>
              : filtered.map(q => <QuestionCard key={q.id} question={q} onUpdate={handleUpdate} />)
          }
        </div>
      </div>
    </>
  );
}

function FilterPill({ label, active, onClick, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '4px 12px', borderRadius: '20px', border: `1px solid ${active ? color : hovered ? 'rgba(var(--white-rgb),0.15)' : 'var(--border)'}`,
        background: active ? `${color}18` : hovered ? 'rgba(var(--white-rgb),0.04)' : 'transparent',
        color: active ? color : hovered ? 'var(--text-primary)' : 'var(--text-muted)',
        fontSize: '12px', fontWeight: active ? '700' : '500', cursor: 'pointer', transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >{label}</button>
  );
}
