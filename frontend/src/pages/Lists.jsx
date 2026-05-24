import { useState, useEffect, useCallback } from 'react';
import { getSpecialList, getNeedsRevision } from '../api/client';
import QuestionCard from '../components/QuestionCard';
import { useSuccess } from '../context/SuccessContext';

/* ─── List Definitions ───────────────────────────────── */
const LISTS = [
  {
    key: 'revision20',
    fetchFn: () => getSpecialList('revision20'),
    icon: '📋',
    name: 'Revision-20',
    desc: 'Do ONLY these 20 in 3–4 hours the day before every interview. No new questions.',
    color: 'var(--accent-amber)',
    colorRgb: '245,158,11',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.04) 100%)',
    glowColor: 'rgba(245,158,11,0.25)',
  },
  {
    key: 'top50',
    fetchFn: () => getSpecialList('top50'),
    icon: '🏆',
    name: 'Top-50 Must-Do',
    desc: 'The absolute must-do questions from patterns 1–13 in study order. Your interview backbone.',
    color: 'var(--accent-green)',
    colorRgb: '0,212,170',
    gradient: 'linear-gradient(135deg, rgba(0,212,170,0.15) 0%, rgba(0,212,170,0.04) 100%)',
    glowColor: 'rgba(0,212,170,0.25)',
  },
  {
    key: 'oa-prep',
    fetchFn: () => getSpecialList('oa-prep'),
    icon: '💻',
    name: 'OA Prep List',
    desc: 'Questions tagged OA with must/strong importance. Optimised for Flipkart, Razorpay, Cred, Amazon OAs.',
    color: 'var(--accent-blue)',
    colorRgb: '59,130,246',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.04) 100%)',
    glowColor: 'rgba(59,130,246,0.25)',
  },
  {
    key: 'skipped-gems',
    fetchFn: () => getSpecialList('skipped-gems'),
    icon: '💎',
    name: 'Skipped Gems',
    desc: "Questions people skip but shouldn't. High interview frequency, low preparation rate.",
    color: 'var(--accent-purple)',
    colorRgb: '139,92,246',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.04) 100%)',
    glowColor: 'rgba(139,92,246,0.25)',
  },
  {
    key: 'needs-revision',
    fetchFn: () => getNeedsRevision(),
    icon: '🟡',
    name: 'Needs Revision',
    desc: "Questions you've flagged for review. Go through these regularly to cement your understanding.",
    color: '#F59E0B',
    colorRgb: '251,191,36',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.04) 100%)',
    glowColor: 'rgba(251,191,36,0.25)',
  },
];

/* ─── Circular Progress Ring ─────────────────────────── */
function ProgressRing({ solved, total, color, size = 56 }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = total > 0 ? solved / total : 0;
  const filled = circumference * pct;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4.5" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="4.5"
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: '800', color: pct >= 1 ? color : 'var(--text-light)',
      }}>
        {total > 0 ? `${Math.round(pct * 100)}%` : '—'}
      </div>
    </div>
  );
}

/* ─── List Panel ─────────────────────────────────────── */
const SORT_OPTIONS = [
  { key: 'order', label: 'Study Order' },
  { key: 'unsolved', label: 'Unsolved First' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'confidence', label: 'Confidence ↑' },
];

function ListPanel({ listKey, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('order');
  const info = LISTS.find(l => l.key === listKey);
  const { triggerSuccess } = useSuccess();

  useEffect(() => {
    setLoading(true);
    info.fetchFn()
      .then(r => { setQuestions(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [listKey]);

  const handleUpdate = useCallback((updated) => {
    setQuestions(prev => {
      const existing = prev.find(q => q.id === updated.id);
      const nowSolved = updated.status === 'solved';
      const wasSolved = existing?.status === 'solved';
      const newQs = prev.map(q => q.id === updated.id ? updated : q);
      if (nowSolved && !wasSolved) triggerSuccess(updated, null, newQs);
      return newQs;
    });
  }, [triggerSuccess]);

  // Stats
  const solved = questions.filter(q => q.status === 'solved').length;
  const remaining = questions.length - solved;
  const mustTotal = questions.filter(q => q.importance === 'must').length;
  const mustSolved = questions.filter(q => q.importance === 'must' && q.status === 'solved').length;
  const mustPct = mustTotal > 0 ? Math.round(mustSolved / mustTotal * 100) : null;

  // Sorting
  const sorted = [...questions].sort((a, b) => {
    if (sortBy === 'unsolved') {
      const aS = a.status === 'solved' ? 1 : 0;
      const bS = b.status === 'solved' ? 1 : 0;
      return aS - bS;
    }
    if (sortBy === 'difficulty') {
      const order = { E: 0, M: 1, H: 2 };
      return (order[a.difficulty] || 1) - (order[b.difficulty] || 1);
    }
    if (sortBy === 'confidence') {
      return (a.confidence || 0) - (b.confidence || 0);
    }
    return (a.displayOrder || 0) - (b.displayOrder || 0);
  });

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="slide-panel" style={{ paddingTop: '0' }}>
        {/* Panel Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          padding: '20px 24px 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: info.color, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {info.icon} {info.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', maxWidth: '420px' }}>{info.desc}</div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text-muted)', padding: '6px 12px',
                cursor: 'pointer', fontSize: '16px', transition: 'all 0.15s', flexShrink: 0
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >✕</button>
          </div>

          {/* Stats bar */}
          {!loading && questions.length > 0 && (
            <div style={{
              display: 'flex', gap: '0', marginBottom: '16px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px', overflow: 'hidden'
            }}>
              {[
                { label: 'Solved', value: solved, color: '#00D4AA' },
                { label: 'Remaining', value: remaining, color: remaining === 0 ? '#00D4AA' : 'var(--text-light)' },
                mustPct !== null && { label: 'Must-Do', value: `${mustPct}%`, color: mustPct >= 80 ? '#00D4AA' : mustPct >= 50 ? '#F59E0B' : '#EF4444' },
              ].filter(Boolean).map((stat, i, arr) => (
                <div key={stat.label} style={{
                  flex: 1, padding: '12px 16px', textAlign: 'center',
                  borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '3px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Sort controls */}
          {!loading && questions.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', paddingBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', marginRight: '4px' }}>Sort:</span>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  style={{
                    padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                    border: `1px solid ${sortBy === opt.key ? info.color + '50' : 'rgba(255,255,255,0.08)'}`,
                    background: sortBy === opt.key ? `rgba(${info.colorRgb},0.15)` : 'transparent',
                    color: sortBy === opt.key ? info.color : 'var(--text-muted)',
                    transition: 'all 0.15s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px 24px 24px' }}>
          {loading
            ? <div className="loading"><div className="spinner" /> Loading...</div>
            : sorted.map(q => <QuestionCard key={q.id} question={q} onUpdate={handleUpdate} isNarrow={true} />)
          }
          {!loading && questions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>Nothing here yet</div>
              <div style={{ fontSize: '13px' }}>This list will populate as you track your progress.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── List Card ──────────────────────────────────────── */
function ListCard({ list, solved, total, loading, onClick }) {
  const [hovered, setHovered] = useState(false);
  const pct = total > 0 ? Math.round(solved / total * 100) : 0;
  const isComplete = total > 0 && solved === total;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? list.gradient.replace('0.15', '0.22').replace('0.04', '0.08')
          : list.gradient,
        border: `1px solid rgba(${list.colorRgb}, ${hovered ? '0.35' : '0.18'})`,
        borderRadius: '16px', padding: '22px',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(${list.colorRgb},0.2), 0 6px 20px ${list.glowColor}`
          : '0 4px 20px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', gap: '14px',
        position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Completion shimmer for 100% lists */}
      {isComplete && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, rgba(${list.colorRgb},0.08) 0%, transparent 60%)`,
          borderRadius: '16px', pointerEvents: 'none'
        }} />
      )}

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '28px', filter: hovered ? `drop-shadow(0 0 8px ${list.glowColor})` : 'none', transition: 'filter 0.25s' }}>
          {list.icon}
        </div>
        {!loading && total > 0 && (
          <ProgressRing solved={solved} total={total} color={list.color} size={54} />
        )}
        {loading && (
          <div style={{ width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{ width: '20px', height: '20px', borderTopColor: list.color }} />
          </div>
        )}
      </div>

      {/* Name & desc */}
      <div>
        <div style={{ fontSize: '16px', fontWeight: '800', color: list.color, marginBottom: '6px', letterSpacing: '-0.01em' }}>{list.name}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.55' }}>{list.desc}</div>
      </div>

      {/* Progress bar + count */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: list.color }}>
            {loading ? '...' : isComplete ? '✓ Complete' : `${solved}/${total} solved`}
          </span>
          {!loading && total > 0 && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{pct}%</span>
          )}
        </div>
        {!loading && total > 0 && (
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: `linear-gradient(90deg, rgba(${list.colorRgb},0.8), rgba(${list.colorRgb},1))`,
              borderRadius: '99px',
              boxShadow: `0 0 8px rgba(${list.colorRgb},0.5)`,
              transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </div>
        )}
      </div>

      {/* CTA arrow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', fontWeight: '700', color: list.color,
        opacity: hovered ? 1 : 0.6, transition: 'all 0.2s'
      }}>
        Open list
        <span style={{ transform: hovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.2s', display: 'inline-block' }}>→</span>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export default function Lists() {
  const [activeList, setActiveList] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    LISTS.forEach(l => {
      setLoading(prev => ({ ...prev, [l.key]: true }));
      l.fetchFn()
        .then(r => {
          const questions = r.data;
          const total = questions.length;
          const solved = questions.filter(q => q.status === 'solved').length;
          setStats(prev => ({ ...prev, [l.key]: { total, solved } }));
        })
        .catch(() => {
          setStats(prev => ({ ...prev, [l.key]: { total: 0, solved: 0 } }));
        })
        .finally(() => setLoading(prev => ({ ...prev, [l.key]: false })));
    });
  }, []);

  const totalSolvedAll = Object.values(stats).reduce((s, v) => s + (v?.solved || 0), 0);
  const totalQsAll = Object.values(stats).reduce((s, v) => s + (v?.total || 0), 0);

  return (
    <div className="page">
      <style>{`
        @keyframes listFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .list-card-anim {
          animation: listFadeIn 0.35s ease both;
        }
        .list-card-anim:nth-child(1) { animation-delay: 0s; }
        .list-card-anim:nth-child(2) { animation-delay: 0.07s; }
        .list-card-anim:nth-child(3) { animation-delay: 0.14s; }
        .list-card-anim:nth-child(4) { animation-delay: 0.21s; }
        .list-card-anim:nth-child(5) { animation-delay: 0.28s; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-white)', marginBottom: '4px' }}>
          Special Lists
        </h1>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Curated question sets for focused, high-impact preparation
        </div>
      </div>

      {/* Summary strip */}
      {totalQsAll > 0 && (
        <div style={{
          display: 'flex', gap: '0', marginBottom: '24px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px', overflow: 'hidden'
        }}>
          {[
            { label: 'Total across all lists', value: totalQsAll, color: 'var(--text-light)' },
            { label: 'Solved overall', value: totalSolvedAll, color: '#00D4AA' },
            { label: 'Remaining', value: totalQsAll - totalSolvedAll, color: 'var(--text-muted)' },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1, padding: '14px 20px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {LISTS.map(l => (
          <div key={l.key} className="list-card-anim">
            <ListCard
              list={l}
              solved={stats[l.key]?.solved || 0}
              total={stats[l.key]?.total || 0}
              loading={loading[l.key] !== false}
              onClick={() => setActiveList(l.key)}
            />
          </div>
        ))}
      </div>

      {/* Panel */}
      {activeList && <ListPanel listKey={activeList} onClose={() => setActiveList(null)} />}
    </div>
  );
}
