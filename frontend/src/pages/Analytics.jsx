import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, getDailyLog, searchQuestions } from '../api/client';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, ReferenceLine,
  AreaChart, Area, CartesianGrid,
} from 'recharts';

/* ─── Helpers ───────────────────────────────────────────── */
const dateStr = (d) =>
  d.getFullYear() + '-' +
  String(d.getMonth() + 1).padStart(2, '0') + '-' +
  String(d.getDate()).padStart(2, '0');

function computeReadiness(data) {
  const overall = data.totalQuestions > 0 ? data.solved / data.totalQuestions : 0;
  const must    = data.mustTotal > 0 ? data.mustSolved / data.mustTotal : 0;
  const cp      = data.patternProgress.filter(p => p.avgConfidence > 0);
  const avgConf = cp.length > 0 ? cp.reduce((s, p) => s + p.avgConfidence, 0) / cp.length : 0;
  const score   = Math.round((0.40 * overall + 0.40 * must + 0.20 * (avgConf / 5)) * 100);
  if (score >= 80) return { score, tier: 'Interview Ready',  emoji: '🎯', tierColor: '#00D4AA', glow: 'rgba(0,212,170,0.4)'  };
  if (score >= 60) return { score, tier: 'On Track',         emoji: '✅', tierColor: '#34D399', glow: 'rgba(52,211,153,0.35)' };
  if (score >= 40) return { score, tier: 'Building Up',      emoji: '📈', tierColor: '#F59E0B', glow: 'rgba(245,158,11,0.35)' };
  return              { score, tier: 'Early Stage',        emoji: '🌱', tierColor: '#EF4444', glow: 'rgba(239,68,68,0.3)'   };
}

/* ─── Readiness Arc (SVG) ───────────────────────────────── */
function ReadinessArc({ score, color, glow }) {
  const r   = 68, cx = 90, cy = 90;
  const C   = 2 * Math.PI * r;
  const arc = C * 0.75;
  const filled = arc * (score / 100);
  const off = C * 0.25;
  return (
    <svg width="180" height="168" viewBox="0 0 180 180" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="1"   />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9"
        strokeDasharray={`${arc} ${C - arc}`} strokeDashoffset={-off} strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }} />
      {/* Fill */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#arcGrad)" strokeWidth="9"
        strokeDasharray={`${filled} ${C - filled}`} strokeDashoffset={-off} strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px`,
          transition: 'stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)',
          filter: `drop-shadow(0 0 10px ${glow})` }} />
      {/* Inner glow dot at endpoint */}
      <text x={cx} y={cy - 8}  textAnchor="middle" fill="white" fontSize="34" fontWeight="800"
        fontFamily="Inter,sans-serif" letterSpacing="-2">{score}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize="11"
        fontWeight="600" fontFamily="Inter,sans-serif">out of 100</text>
    </svg>
  );
}

/* ─── Custom Bar Tooltip ────────────────────────────────── */
const VelocityTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const solved = payload.find(p => p.dataKey === 'Solved')?.value ?? 0;
  const avg    = payload.find(p => p.dataKey === '7d Avg')?.value ?? 0;
  return (
    <div style={{ background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
      padding: '10px 14px', fontSize: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(12px)', minWidth: '130px' }}>
      <div style={{ color: 'rgba(255,255,255,0.45)', fontWeight: '700', marginBottom: '8px', fontSize: '11px' }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#00D4AA', display: 'inline-block' }} />Solved
          </span>
          <span style={{ color: '#00D4AA', fontWeight: '800' }}>{solved}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '2px', background: '#FBBF24', display: 'inline-block', borderRadius: '1px' }} />7d avg
          </span>
          <span style={{ color: '#FBBF24', fontWeight: '800' }}>{avg}</span>
        </div>
      </div>
    </div>
  );
};

/* ─── 90-Day Heatmap Grid ───────────────────────────────── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW    = ['S','M','T','W','T','F','S'];

function getHeatColor(qs) {
  if (qs === 0) return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.06)', glow: 'none' };
  if (qs >= 8)  return { bg: '#34D399', border: 'rgba(52,211,153,0.6)',  glow: '0 0 8px rgba(52,211,153,0.7)' };
  if (qs >= 5)  return { bg: '#10B981', border: 'rgba(16,185,129,0.5)',  glow: '0 0 6px rgba(16,185,129,0.5)' };
  if (qs >= 3)  return { bg: '#047857', border: 'rgba(4,120,87,0.5)',    glow: 'none' };
  return              { bg: '#064e3b', border: 'rgba(6,78,59,0.4)',    glow: 'none' };
}

function ActivityHeatmap({ logMap, today }) {
  // Build 13-week grid
  const start = new Date(today);
  start.setDate(start.getDate() - 90);
  // Align to Sunday
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let cur = new Date(start);
  while (cur <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const ds   = dateStr(cur);
      const qs   = logMap[ds] ?? 0;
      const future = cur > today;
      week.push({ ds, qs, future, month: cur.getMonth(), dom: cur.getDate() });
      cur = new Date(cur); cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  // Month label: show when first cell of that month in this week
  const monthLabels = weeks.map((week, wi) => {
    const first = week.find(c => !c.future);
    if (!first) return null;
    const prev  = wi > 0 ? weeks[wi - 1].find(c => !c.future) : null;
    if (wi === 0 || (prev && prev.month !== first.month)) return MONTHS[first.month];
    return null;
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-start', minWidth: 'max-content' }}>
        {/* Day-of-week labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '18px', marginRight: '5px' }}>
          {DOW.map((d, i) => (
            <div key={i} style={{ width: '10px', height: '13px', fontSize: '9px', color: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{d}</div>
          ))}
        </div>
        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ height: '15px', fontSize: '9px', color: 'rgba(255,255,255,0.28)', fontWeight: '700',
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
              {monthLabels[wi] || ''}
            </div>
            {week.map((cell, di) => {
              const c = getHeatColor(cell.future ? -1 : cell.qs);
              return (
                <div key={di}
                  title={cell.future ? '' : `${cell.ds}: ${cell.qs} solved`}
                  style={{ width: '13px', height: '13px', borderRadius: '3px',
                    background: cell.future ? 'transparent' : c.bg,
                    border:     cell.future ? 'none' : `1px solid ${c.border}`,
                    boxShadow:  cell.future ? 'none' : c.glow,
                    opacity:    cell.future ? 0 : 1,
                    transition: 'transform 0.12s, box-shadow 0.12s', cursor: cell.future ? 'default' : 'pointer',
                  }}
                  onMouseEnter={e => { if (!cell.future) { e.currentTarget.style.transform = 'scale(1.45)'; if (cell.qs >= 5) e.currentTarget.style.boxShadow = '0 0 12px rgba(52,211,153,0.9)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = cell.qs >= 5 ? '0 0 8px rgba(52,211,153,0.7)' : 'none'; }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', fontWeight: '700', marginRight: '2px' }}>Less</span>
        {[0, 1, 3, 5, 8].map((v, i) => {
          const c = getHeatColor(v);
          return <div key={i} style={{ width: '11px', height: '11px', borderRadius: '2px', background: c.bg, border: `1px solid ${c.border}` }} />;
        })}
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', fontWeight: '700', marginLeft: '2px' }}>More</span>
      </div>
    </div>
  );
}

/* ─── Day-of-Week Activity Chart ────────────────────────── */
const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function DayOfWeekBars({ logMap }) {
  const totals = [0, 0, 0, 0, 0, 0, 0];
  const counts = [0, 0, 0, 0, 0, 0, 0];
  Object.entries(logMap).forEach(([ds, qs]) => {
    if (qs > 0) {
      const dow = new Date(ds + 'T00:00:00').getDay();
      totals[dow] += qs;
      counts[dow] += 1;
    }
  });
  const maxTotal = Math.max(...totals, 1);
  const bestDow  = totals.indexOf(Math.max(...totals));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {DOW_LABELS.map((label, i) => {
        const pct = Math.round((totals[i] / maxTotal) * 100);
        const isBest = i === bestDow && totals[i] > 0;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', fontSize: '10px', fontWeight: '700',
              color: isBest ? '#34D399' : 'rgba(255,255,255,0.35)', textAlign: 'right', flexShrink: 0 }}>
              {label}
            </div>
            <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`,
                background: isBest
                  ? 'linear-gradient(90deg, #10B981, #34D399)'
                  : 'linear-gradient(90deg, rgba(0,212,170,0.35), rgba(0,212,170,0.55))',
                borderRadius: '99px',
                boxShadow: isBest ? '0 0 8px rgba(52,211,153,0.5)' : 'none',
                transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)'
              }} />
            </div>
            <div style={{ width: '24px', fontSize: '10px', fontWeight: '700',
              color: isBest ? '#34D399' : 'rgba(255,255,255,0.3)', textAlign: 'left', flexShrink: 0 }}>
              {totals[i]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────── */
function StatCard({ label, value, sub, color, icon, borderColor }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      border: `1px solid ${borderColor || 'rgba(255,255,255,0.08)'}`,
      borderRadius: '14px', padding: '18px 20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      display: 'flex', flexDirection: 'column', gap: '6px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '42px', opacity: 0.07, userSelect: 'none', lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>{label}</div>
      <div style={{ fontSize: '30px', fontWeight: '800', color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>{sub}</div>}
    </div>
  );
}

/* ─── Pattern Row ───────────────────────────────────────── */
function PatternRow({ p, navigate }) {
  const [hov, setHov] = useState(false);
  const hasMustGap  = p.mustPercentComplete < 50 && p.mustCount > 0;
  const confColor   = p.avgConfidence === 0 ? 'rgba(255,255,255,0.2)' : p.avgConfidence < 2.5 ? '#EF4444' : p.avgConfidence < 3.5 ? '#F59E0B' : '#00D4AA';
  const progColor   = p.percentComplete < 33 ? '#EF4444' : p.percentComplete < 66 ? '#F59E0B' : '#00D4AA';
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? 'rgba(255,255,255,0.025)' : 'transparent', transition: 'background 0.12s', cursor: 'default' }}>
      <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: '700', width: '30px' }}>{p.prepOrder}</td>
      <td style={{ padding: '10px 12px', maxWidth: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{p.name}</span>
          {hasMustGap && (
            <span style={{ fontSize: '9px', fontWeight: '800', background: 'rgba(239,68,68,0.12)',
              color: '#F87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px',
              padding: '1px 6px', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>⚠ MUST GAP</span>
          )}
        </div>
      </td>
      <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.3)', fontSize: '11px', whiteSpace: 'nowrap' }}>Wk {p.weekStart}</td>
      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-light)' }}>{p.solved}</span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>/{p.totalQs}</span>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <span style={{ fontSize: '12px', fontWeight: '800',
          color: p.mustPercentComplete < 50 ? '#EF4444' : '#00D4AA' }}>
          {p.mustPercentComplete.toFixed(0)}%
        </span>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: confColor }}>
          {p.avgConfidence > 0 ? `★ ${p.avgConfidence.toFixed(1)}` : '—'}
        </span>
      </td>
      <td style={{ padding: '10px 12px', width: '140px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${p.percentComplete}%`, background: progColor,
              borderRadius: '99px', boxShadow: `0 0 6px ${progColor}60`, transition: 'width 0.6s' }} />
          </div>
          <span style={{ fontSize: '10px', fontWeight: '700', color: progColor, minWidth: '30px', textAlign: 'right' }}>
            {p.percentComplete.toFixed(0)}%
          </span>
        </div>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <button onClick={() => navigate('/study', { state: { patternId: p.id } })}
          style={{ fontSize: '11px', fontWeight: '700', padding: '5px 12px', borderRadius: '7px',
            background: hov ? 'rgba(0,212,170,0.18)' : 'rgba(0,212,170,0.08)',
            color: '#00D4AA', border: '1px solid rgba(0,212,170,0.3)',
            cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
            transform: hov ? 'translateX(2px)' : 'none' }}>
          Study →
        </button>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function Analytics() {
  const [data,          setData]          = useState(null);
  const [logs,          setLogs]          = useState([]);
  const [patternFilter,  setPatternFilter]  = useState('all');
  const [patternSort,    setPatternSort]    = useState('order');
  const [chartMode,      setChartMode]      = useState('bar'); // 'bar' | 'line'
  const [breakdownView,  setBreakdownView]  = useState('pattern'); // 'pattern' | 'difficulty'
  const [analyticsMode,  setAnalyticsMode]  = useState('pattern'); // 'pattern' | 'question'
  const [allQuestions,   setAllQuestions]   = useState([]);
  const [qLoading,       setQLoading]       = useState(false);
  const [qFilter,        setQFilter]        = useState('all'); // 'all' | 'hard' | 'revision' | 'attempted'
  const navigate = useNavigate();

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).catch(console.error);
    getDailyLog(90).then(r => setLogs(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (analyticsMode === 'question' && allQuestions.length === 0 && !qLoading) {
      setQLoading(true);
      searchQuestions({}).then(r => setAllQuestions(r.data || [])).catch(() => {}).finally(() => setQLoading(false));
    }
  }, [analyticsMode]);

  if (!data) return (
    <div className="loading" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
      <div className="spinner" style={{ width: '32px', height: '32px' }} />
      <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Crunching your analytics...</div>
    </div>
  );

  /* ── Build log lookup map ── */
  const logMap = {};
  logs.forEach(l => { logMap[l.logDate] = l.qsSolved || 0; });

  /* ── Stats ── */
  const readiness = computeReadiness(data);
  const mustLeft  = Math.max(0, data.mustTotal - data.mustSolved);
  const today     = new Date();
  today.setHours(0, 0, 0, 0);

  /* ── Build COMPLETE 30-day velocity timeline (fill zeros for missing days) ── */
  const velocity30 = [];
  for (let i = 29; i >= 0; i--) {
    const d  = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    velocity30.push({ date: ds.substring(5), fullDate: ds, Solved: logMap[ds] ?? 0 });
  }
  // Add 7-day rolling average
  const velocityData = velocity30.map((pt, i) => {
    const slice = velocity30.slice(Math.max(0, i - 6), i + 1);
    const avg   = slice.reduce((s, x) => s + x.Solved, 0) / slice.length;
    return { ...pt, '7d Avg': Math.round(avg * 10) / 10 };
  });

  const avgLast7   = velocity30.slice(-7).reduce((s, x) => s + x.Solved, 0) / 7;
  const totalLast30 = velocity30.reduce((s, x) => s + x.Solved, 0);
  const bestDay     = velocity30.reduce((b, x) => x.Solved > (b?.Solved ?? 0) ? x : b, null);

  /* ── Activity stats ── */
  const activeDays90  = Object.values(logMap).filter(v => v > 0).length;
  const consistency   = Math.round((activeDays90 / 90) * 100);
  const totalSolved90 = Object.values(logMap).reduce((s, v) => s + v, 0);

  // Monthly totals (last 3 months from logs)
  const monthTotals = {};
  Object.entries(logMap).forEach(([ds, qs]) => {
    const key = ds.substring(0, 7); // YYYY-MM
    monthTotals[key] = (monthTotals[key] || 0) + qs;
  });
  const recentMonths = Object.entries(monthTotals)
    .sort((a, b) => a[0] > b[0] ? 1 : -1)
    .slice(-3)
    .map(([k, v]) => ({ month: MONTHS[parseInt(k.split('-')[1]) - 1], total: v }));

  /* ── Pattern table ── */
  const tableData      = [...data.patternProgress].map(p => ({
    ...p, priorityScore: (1 - p.mustPercentComplete / 100) * 2 + (1 - p.avgConfidence / 5),
  }));
  const filteredPats   = patternFilter === 'weak'
    ? tableData.filter(p => p.mustPercentComplete < 66 || p.avgConfidence < 3) : tableData;
  const sortedPats     = [...filteredPats].sort((a, b) =>
    patternSort === 'weak' ? b.priorityScore - a.priorityScore : a.prepOrder - b.prepOrder);
  const weakCount      = tableData.filter(p => p.mustPercentComplete < 66 || p.avgConfidence < 3).length;

  /* ── Diff breakdown ── */
  const diffData   = [
    { name: 'Easy',   value: Math.round(data.solved * 0.28) },
    { name: 'Medium', value: Math.round(data.solved * 0.57) },
    { name: 'Hard',   value: Math.round(data.solved * 0.15) },
  ].filter(d => d.value > 0);
  const DIFF_COLS  = ['#00D4AA', '#F59E0B', '#EF4444'];

  const mustPct = data.mustTotal > 0 ? Math.round(data.mustSolved / data.mustTotal * 100) : 0;
  const confPatterns = data.patternProgress.filter(p => p.avgConfidence > 0);
  const globalAvgConf = confPatterns.length > 0
    ? (confPatterns.reduce((s, p) => s + p.avgConfidence, 0) / confPatterns.length).toFixed(1) : '—';

  return (
    <div className="page">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #EF444480; }
          50%       { opacity: 0.6; box-shadow: 0 0 16px #EF4444cc; }
        }
        .az { animation: fadeUp 0.45s ease both; }
        .az:nth-child(1){animation-delay:0s}
        .az:nth-child(2){animation-delay:0.06s}
        .az:nth-child(3){animation-delay:0.12s}
        .az:nth-child(4){animation-delay:0.18s}
        .az:nth-child(5){animation-delay:0.24s}

        .pfbtn {
          padding: 5px 13px; border-radius: 20px; font-size: 11px; font-weight: 700;
          cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: transparent;
          color: rgba(255,255,255,0.35); transition: all 0.15s; letter-spacing: 0.02em;
        }
        .pfbtn.on { background: rgba(0,212,170,0.14); color: #00D4AA; border-color: rgba(0,212,170,0.4); }
        .pfbtn:not(.on):hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.04); }

        .analytics-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .analytics-table th {
          text-align: left; padding: 8px 12px; color: rgba(255,255,255,0.28);
          font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(255,255,255,0.07); font-weight: 800;
        }
        .analytics-table td { border-bottom: 1px solid rgba(255,255,255,0.05); }
        .analytics-table tr:last-child td { border-bottom: none; }

        @media(max-width:1000px){
          .an-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .an-charts-row { grid-template-columns: 1fr !important; }
          .an-hero-grid  { grid-template-columns: 1fr !important; }
          .an-heat-row   { flex-direction: column !important; }
        }
        @media(max-width:600px){
          .an-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.6px', color: '#fff', marginBottom: '4px' }}>
          Analytics
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
          Your complete preparation picture — where you are and what needs work
        </p>
        {/* ── Mode Tab Switcher ── */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '14px', padding: '4px', width: 'fit-content' }}>
          {[
            { key: 'pattern',  label: 'Pattern Analytics',  icon: '≡' },
            { key: 'question', label: 'Question Analytics', icon: '◑' },
          ].map(m => (
            <button key={m.key} onClick={() => setAnalyticsMode(m.key)} style={{
              padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: analyticsMode === m.key
                ? 'linear-gradient(135deg, rgba(0,212,170,0.22), rgba(0,212,170,0.1))'
                : 'transparent',
              color: analyticsMode === m.key ? '#00D4AA' : 'rgba(255,255,255,0.35)',
              boxShadow: analyticsMode === m.key ? '0 2px 12px rgba(0,212,170,0.2), inset 0 1px 0 rgba(0,212,170,0.15)' : 'none',
              letterSpacing: '0.01em',
            }}>{m.icon} {m.label}</button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          ZONE 1 — READINESS HERO
          ════════════════════════════════════════════ */}
      <div className="az an-hero-grid" style={{
        display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0',
        background: 'linear-gradient(135deg, #12121F 0%, #0D0D18 100%)',
        border: `1px solid ${readiness.tierColor}28`,
        borderRadius: '20px', marginBottom: '16px', overflow: 'hidden',
        boxShadow: `0 12px 48px rgba(0,0,0,0.4), 0 0 0 1px ${readiness.tierColor}10`,
      }}>
        {/* Left — Arc */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '28px 20px', position: 'relative',
          borderRight: `1px solid ${readiness.tierColor}15`,
          background: `radial-gradient(ellipse at 50% 40%, ${readiness.glow.replace('0.4','0.12')} 0%, transparent 70%)`,
        }}>
          <ReadinessArc score={readiness.score} color={readiness.tierColor} glow={readiness.glow} />
          <div style={{ textAlign: 'center', marginTop: '-4px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: readiness.tierColor, letterSpacing: '-0.01em' }}>
              {readiness.emoji} {readiness.tier}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Readiness Score
            </div>
          </div>
        </div>

        {/* Right — breakdown grid */}
        <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignContent: 'center' }}>
          {[
            { label: 'Overall Progress', value: `${data.percentComplete}%`, sub: `${data.solved} / ${data.totalQuestions} solved`, color: '#34D399', weight: '40%' },
            { label: 'Must-Do Coverage', value: `${mustPct}%`, sub: `${data.mustSolved} / ${data.mustTotal} must-do`, color: '#FBBF24', weight: '40%' },
            { label: 'Avg Confidence', value: globalAvgConf !== '—' ? `★ ${globalAvgConf}` : '—', sub: 'across solved problems', color: '#A78BFA', weight: '20%' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px', padding: '16px',
            }}>
              <div style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: item.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '4px' }}>
                {item.value}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{item.sub}</div>
              <div style={{ marginTop: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: '700' }}>
                Weight: {item.weight}
              </div>
            </div>
          ))}

          {/* Second row of 3 cards */}
          <StatCard label="Today Solved"    value={data.todaySolved}  sub={`🔥 ${data.currentStreak}-day streak`}         color="#34D399" icon="✓" borderColor="rgba(52,211,153,0.15)"  />
          <StatCard label="Must-Do Left"    value={mustLeft}          sub={`${mustPct}% complete`}                        color={mustLeft > 20 ? '#F87171' : mustLeft > 5 ? '#FBBF24' : '#34D399'} icon="★" borderColor={mustLeft > 20 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.12)'} />
          <StatCard label="Needs Revision"  value={data.flaggedForRevision || 0} sub="flagged for review"               color="#A78BFA" icon="🟡" borderColor="rgba(167,139,250,0.15)" />
        </div>
      </div>

      {/* ════════════════════════════════════════════
          PATTERN MODE — ZONES 2, 3, 4
          ════════════════════════════════════════════ */}
      {analyticsMode === 'pattern' && (<>

      {/* ZONE 2 — VELOCITY CHART + DIFFICULTY DONUT */}
      <div className="az an-charts-row" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '14px', marginBottom: '14px' }}>

        {/* Velocity */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        }}>
          {/* ── Chart Header ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
                {chartMode === 'bar' ? 'Daily Velocity — Last 30 Days' : 'Cumulative Progress — Last 30 Days'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                {chartMode === 'bar' ? (
                  <>
                    Best day:{' '}
                    <strong style={{ color: '#34D399' }}>
                      {bestDay && bestDay.Solved > 0 ? `${bestDay.Solved} solved on ${bestDay.date}` : 'No data yet'}
                    </strong>
                    {avgLast7 > 0 && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '10px' }}>
                        · 7d avg: <strong style={{ color: '#FBBF24' }}>{avgLast7.toFixed(1)}</strong>
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <strong style={{ color: '#34D399' }}>{totalLast30}</strong>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}> questions solved over 30 days</span>
                  </>
                )}
              </div>
            </div>

            {/* Single icon toggle — shows the OTHER chart type as a hint */}
            <button
              onClick={() => setChartMode(m => m === 'bar' ? 'line' : 'bar')}
              title={chartMode === 'bar' ? 'Switch to Line chart' : 'Switch to Bar chart'}
              style={{
                background: 'rgba(0,212,170,0.08)',
                border: '1px solid rgba(0,212,170,0.2)',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,212,170,0.18)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0,212,170,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(0,212,170,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {chartMode === 'bar' ? (
                /* Line chart icon — shown when in bar mode */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 7 13 13 8 9 2 14" />
                </svg>
              ) : (
                /* Bar chart icon — shown when in line mode */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2"  y="10" width="4" height="12" rx="1" fill="rgba(0,212,170,0.25)" stroke="#00D4AA"/>
                  <rect x="10" y="5"  width="4" height="17" rx="1" fill="rgba(0,212,170,0.25)" stroke="#00D4AA"/>
                  <rect x="18" y="2"  width="4" height="20" rx="1" fill="rgba(0,212,170,0.25)" stroke="#00D4AA"/>
                </svg>
              )}
            </button>
          </div>

          {/* ── Bar Chart ── */}
          {chartMode === 'bar' && (
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={velocityData} margin={{ left: -18, right: 4, top: 4, bottom: 0 }} barCategoryGap="20%">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#00D4AA" stopOpacity="1" />
                    <stop offset="100%" stopColor="#00D4AA" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9, fontWeight: 600 }}
                  interval={4} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
                  axisLine={false} tickLine={false} allowDecimals={false}
                  domain={[0, d => Math.max(d + 1, 4)]} />
                <Tooltip content={<VelocityTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 4 }} />
                {avgLast7 > 0 && (
                  <ReferenceLine y={avgLast7} stroke="rgba(251,191,36,0.28)" strokeDasharray="4 3" strokeWidth={1} />
                )}
                <Bar dataKey="Solved" radius={[4, 4, 0, 0]} maxBarSize={18}>
                  {velocityData.map((entry, i) => (
                    <Cell key={i}
                      fill={entry.Solved === 0
                        ? 'rgba(255,255,255,0.05)'
                        : entry.Solved >= avgLast7
                          ? 'url(#barGrad)'
                          : 'rgba(0,212,170,0.45)'}
                    />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="7d Avg" stroke="#FBBF24" strokeWidth={2}
                  dot={false} strokeDasharray="5 3" connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {/* ── Cumulative Line Chart ── */}
          {chartMode === 'line' && (() => {
            // Build cumulative data
            let running = 0;
            const cumulativeData = velocityData.map(pt => {
              running += pt.Solved;
              return { date: pt.date, 'Total Solved': running, Daily: pt.Solved };
            });
            const maxCumul = running;
            return (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={cumulativeData} margin={{ left: -18, right: 4, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#00D4AA" stopOpacity="0.35" />
                      <stop offset="60%"  stopColor="#00D4AA" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#00D4AA" stopOpacity="0" />
                    </linearGradient>
                    <filter id="lineGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9, fontWeight: 600 }}
                    interval={4} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
                    axisLine={false} tickLine={false} allowDecimals={false}
                    domain={[0, maxCumul > 0 ? maxCumul + 1 : 5]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const total  = payload.find(p => p.dataKey === 'Total Solved')?.value ?? 0;
                      const daily  = payload.find(p => p.dataKey === 'Daily')?.value ?? 0;
                      return (
                        <div style={{ background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px', padding: '10px 14px', fontSize: '12px',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: '140px' }}>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', marginBottom: '8px', fontSize: '11px' }}>{label}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D4AA', display: 'inline-block', boxShadow: '0 0 6px #00D4AA' }} />Total
                              </span>
                              <span style={{ color: '#00D4AA', fontWeight: '800' }}>{total}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(0,212,170,0.5)', display: 'inline-block' }} />Today
                              </span>
                              <span style={{ color: 'rgba(0,212,170,0.8)', fontWeight: '800' }}>+{daily}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 3' }}
                  />
                  <Area
                    type="monotone" dataKey="Total Solved"
                    stroke="#00D4AA" strokeWidth={2.5}
                    fill="url(#lineAreaGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#00D4AA', strokeWidth: 2, stroke: 'rgba(0,212,170,0.4)', boxShadow: '0 0 12px #00D4AA' }}
                    filter="url(#lineGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            );
          })()}
        </div>

        {/* Difficulty Donut */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
            By Difficulty
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
            <strong style={{ color: '#fff', fontSize: '20px', fontWeight: '800' }}>{data.solved}</strong>
            <span style={{ marginLeft: '6px' }}>total solved</span>
          </div>
          {data.solved > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={diffData} cx="50%" cy="50%" innerRadius={36} outerRadius={58}
                    paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                    {diffData.map((e, i) => (
                      <Cell key={i} fill={DIFF_COLS[i]}
                        style={{ filter: `drop-shadow(0 0 6px ${DIFF_COLS[i]}80)` }} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '8px' }}>
                {diffData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: DIFF_COLS[i], boxShadow: `0 0 6px ${DIFF_COLS[i]}80` }} />
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: '600' }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: DIFF_COLS[i] }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          ZONE 3 — PATTERN / DIFFICULTY TABLE
          ════════════════════════════════════════════ */}
      <div className="az" style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)', marginBottom: '14px',
      }}>
        {/* ── Header row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          {/* Left: title + subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
                {breakdownView === 'pattern' ? 'Pattern Breakdown' : 'Difficulty Breakdown'}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                {breakdownView === 'pattern'
                  ? (weakCount > 0
                    ? <><span style={{ color: '#F87171', fontWeight: '700' }}>{weakCount} patterns</span> need attention</>
                    : 'All patterns on track')
                  : 'Per-pattern Easy / Medium / Hard progress'}
              </div>
            </div>
            {/* View toggle — Pattern | Difficulty */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '3px', gap: '2px',
            }}>
              {[
                { key: 'pattern',    label: 'Pattern',    icon: '≡' },
                { key: 'difficulty', label: 'Difficulty', icon: '◑' },
              ].map(v => (
                <button
                  key={v.key}
                  onClick={() => setBreakdownView(v.key)}
                  style={{
                    padding: '5px 13px', borderRadius: '7px', fontSize: '11px', fontWeight: '700',
                    cursor: 'pointer', border: 'none', transition: 'all 0.18s',
                    background: breakdownView === v.key
                      ? 'linear-gradient(135deg,rgba(0,212,170,0.22),rgba(0,212,170,0.1))'
                      : 'transparent',
                    color: breakdownView === v.key ? '#00D4AA' : 'rgba(255,255,255,0.3)',
                    boxShadow: breakdownView === v.key ? '0 2px 8px rgba(0,212,170,0.18)' : 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  {v.icon} {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: filter/sort (only for pattern view) */}
          {breakdownView === 'pattern' && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button className={`pfbtn ${patternFilter === 'all'  ? 'on' : ''}`} onClick={() => setPatternFilter('all')}>All</button>
              <button className={`pfbtn ${patternFilter === 'weak' ? 'on' : ''}`} onClick={() => setPatternFilter('weak')}>
                ⚠ Needs Attention {weakCount > 0 && `(${weakCount})`}
              </button>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
              <button className={`pfbtn ${patternSort === 'order' ? 'on' : ''}`} onClick={() => setPatternSort('order')}>Study Order</button>
              <button className={`pfbtn ${patternSort === 'weak'  ? 'on' : ''}`} onClick={() => setPatternSort('weak')}>Weakest First</button>
            </div>
          )}
        </div>

        {/* ── Pattern view ── */}
        {breakdownView === 'pattern' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="analytics-table">
              <thead>
                <tr>
                  {['#', 'Pattern', 'Week', 'Solved', 'Must-Do', 'Confidence', 'Progress', ''].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedPats.map(p => <PatternRow key={p.id} p={p} navigate={navigate} />)}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Difficulty view ── */}
        {breakdownView === 'difficulty' && (() => {
          // Difficulty distribution per pattern:
          // Estimate from solved count using industry-typical Easy:Medium:Hard = 25:55:20 split
          // Applied proportionally to p.solved and remaining (p.totalQs - p.solved)
          const E_RATIO = 0.25, M_RATIO = 0.55, H_RATIO = 0.20;
          const diffRows = sortedPats.map(p => {
            const es = Math.round(p.solved  * E_RATIO);
            const ms = Math.round(p.solved  * M_RATIO);
            const hs = p.solved - es - ms;
            const et = Math.max(es, Math.round(p.totalQs * E_RATIO));
            const mt = Math.max(ms, Math.round(p.totalQs * M_RATIO));
            const ht = Math.max(hs, p.totalQs - et - mt);
            return { ...p, es, ms, hs: Math.max(0, hs), et, mt, ht: Math.max(0, ht) };
          });

          const DCOLS = { E: '#00D4AA', M: '#F59E0B', H: '#EF4444' };

          const DiffBar = ({ solved, total, color }) => {
            const pct = total > 0 ? Math.min(100, Math.round(solved / total * 100)) : 0;
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
                <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: '99px',
                    background: color, boxShadow: `0 0 5px ${color}70`,
                    transition: 'width 0.7s cubic-bezier(0.34,1.56,0.64,1)',
                  }} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', color, minWidth: '28px' }}>{solved}/{total}</span>
              </div>
            );
          };

          return (
            <div style={{ overflowX: 'auto' }}>
              <table className="analytics-table">
                <thead>
                  <tr>
                    {['#', 'Pattern', 'Wk', 'Total', 'Easy', 'Medium', 'Hard', 'Overall'].map(h => (
                      <th key={h} style={{ whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {diffRows.map((p, idx) => {
                    const progColor = p.percentComplete < 33 ? '#EF4444' : p.percentComplete < 66 ? '#F59E0B' : '#00D4AA';
                    return (
                      <tr key={p.id}
                        style={{ transition: 'background 0.12s', cursor: 'default' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: '700', width: '30px' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap' }}>
                          {p.name}
                          {p.mustPercentComplete < 50 && p.mustCount > 0 && (
                            <span style={{ marginLeft: '7px', fontSize: '9px', fontWeight: '800',
                              background: 'rgba(239,68,68,0.12)', color: '#F87171',
                              border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px',
                              padding: '1px 5px', letterSpacing: '0.04em' }}>⚠ MUST GAP</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>Wk {p.weekStart}</td>
                        <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: '800', color: '#fff', fontSize: '13px' }}>{p.solved}</span>
                          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>/{p.totalQs}</span>
                        </td>
                        <td style={{ padding: '10px 14px' }}><DiffBar solved={p.es} total={p.et} color={DCOLS.E} /></td>
                        <td style={{ padding: '10px 14px' }}><DiffBar solved={p.ms} total={p.mt} color={DCOLS.M} /></td>
                        <td style={{ padding: '10px 14px' }}><DiffBar solved={p.hs} total={p.ht} color={DCOLS.H} /></td>
                        <td style={{ padding: '10px 12px', width: '120px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${p.percentComplete}%`,
                                background: progColor, borderRadius: '99px',
                                boxShadow: `0 0 6px ${progColor}60`, transition: 'width 0.6s' }} />
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: progColor, minWidth: '30px', textAlign: 'right' }}>
                              {p.percentComplete.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Difficulty legend */}
              <div style={{ display: 'flex', gap: '18px', marginTop: '14px', paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontWeight: '700', letterSpacing: '0.05em' }}>DIFFICULTY</span>
                {[['Easy', DCOLS.E], ['Medium', DCOLS.M], ['Hard', DCOLS.H]].map(([label, col]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: col, boxShadow: `0 0 5px ${col}80` }} />
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>{label}</span>
                  </div>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(255,255,255,0.18)', fontStyle: 'italic' }}>
                  *Difficulty split estimated at 25/55/20 ratio
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ════════════════════════════════════════════
          ZONE 4 — 90-DAY HEATMAP + ACTIVITY INSIGHTS
          ════════════════════════════════════════════ */}
      <div className="az" style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '22px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>90-Day Activity</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
              {activeDays90} active {activeDays90 === 1 ? 'day' : 'days'} · {consistency}% consistency
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { label: '90d total', value: totalSolved90, color: '#34D399' },
              { label: 'best streak', value: data.longestStreak, color: '#A78BFA' },
              { label: 'current', value: data.currentStreak, color: '#FBBF24' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', marginTop: '2px', letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-column: heatmap | insights */}
        <div className="an-heat-row" style={{ display: 'flex', gap: '0', padding: '0 22px 22px' }}>
          {/* Left — Heatmap */}
          <div style={{ flex: '0 0 auto', marginRight: '28px' }}>
            <ActivityHeatmap logMap={logMap} today={today} />
          </div>

          {/* Divider */}
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)', flexShrink: 0, alignSelf: 'stretch', marginRight: '28px' }} />

          {/* Right — Activity Insights */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>

            {/* Consistency score */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { label: 'Consistency', value: `${consistency}%`, sub: 'of days active (90d)', color: consistency >= 50 ? '#34D399' : consistency >= 25 ? '#FBBF24' : '#F87171' },
                { label: 'Active Days', value: activeDays90, sub: 'in past 90 days', color: '#60A5FA' },
                { label: '30d Total', value: totalLast30, sub: 'questions solved', color: '#A78BFA' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px', padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>{s.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Day of week pattern */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>
                Most Active Days of Week
              </div>
              <DayOfWeekBars logMap={logMap} />
            </div>

            {/* Recent monthly totals */}
            {recentMonths.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>
                  Monthly Volume
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(() => {
                    const maxM = Math.max(...recentMonths.map(m => m.total), 1);
                    return recentMonths.map(m => (
                      <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#34D399' }}>{m.total}</div>
                        <div style={{ width: '100%', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                          <div style={{ width: '100%', height: `${Math.round((m.total / maxM) * 100)}%`,
                            background: 'linear-gradient(180deg, rgba(0,212,170,0.7), rgba(0,212,170,0.4))',
                            borderRadius: '4px 4px 0 0', transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                          }} />
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)' }}>{m.month}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close pattern mode fragment */}
      </>)}

      {/* ════════════════════════════════════════════
          QUESTION MODE — FULL QUESTION ANALYTICS
          ════════════════════════════════════════════ */}
      {analyticsMode === 'question' && (() => {
        const DC = { E: '#00D4AA', M: '#F59E0B', H: '#EF4444' };
        const SC = { solved: '#34D399', attempted: '#60A5FA', not_started: 'rgba(255,255,255,0.18)', skipped: '#6B7280' };
        const DL = { E: 'Easy', M: 'Medium', H: 'Hard' };

        if (qLoading) return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '14px' }}>
            <div className="spinner" style={{ width: '28px', height: '28px' }} />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>Loading question analytics...</span>
          </div>
        );

        if (allQuestions.length === 0) return (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.25)' }}>
            No question data available yet.
          </div>
        );

        /* ── Computed metrics ── */
        const solved    = allQuestions.filter(q => q.status === 'solved');
        const attempted = allQuestions.filter(q => q.status === 'attempted');
        const notStart  = allQuestions.filter(q => !q.status || q.status === 'not_started');
        const revision  = allQuestions.filter(q => q.needsRevision);
        const skipped   = allQuestions.filter(q => q.status === 'skipped');

        const confSolved  = solved.filter(q => q.confidence > 0);
        const avgConf     = confSolved.length > 0 ? (confSolved.reduce((s,q) => s + q.confidence, 0) / confSolved.length).toFixed(1) : '—';
        const timedSolved = solved.filter(q => q.timeMinutes > 0);
        const avgTime     = timedSolved.length > 0 ? Math.round(timedSolved.reduce((s,q) => s + q.timeMinutes, 0) / timedSolved.length) : 0;

        // Per-difficulty counts
        const byDiff = { E: { total: 0, solved: 0 }, M: { total: 0, solved: 0 }, H: { total: 0, solved: 0 } };
        allQuestions.forEach(q => {
          const d = q.difficulty || 'M';
          if (byDiff[d]) {
            byDiff[d].total++;
            if (q.status === 'solved') byDiff[d].solved++;
          }
        });

        // Per-importance
        const byImp = { must: { total: 0, solved: 0 }, strong: { total: 0, solved: 0 }, optional: { total: 0, solved: 0 } };
        allQuestions.forEach(q => {
          const imp = q.importance || 'optional';
          if (byImp[imp]) { byImp[imp].total++; if (q.status === 'solved') byImp[imp].solved++; }
        });

        // Confidence distribution matrix (difficulty × confidence 1–5)
        const confMatrix = { E: {}, M: {}, H: {} };
        solved.forEach(q => {
          const d = q.difficulty || 'M';
          const c = q.confidence || 0;
          if (c > 0 && confMatrix[d]) confMatrix[d][c] = (confMatrix[d][c] || 0) + 1;
        });

        // Time by difficulty
        const timeByDiff = { E: [], M: [], H: [] };
        timedSolved.forEach(q => { const d = q.difficulty||'M'; if (timeByDiff[d]) timeByDiff[d].push(q.timeMinutes); });
        const avgTimeD = { E: 0, M: 0, H: 0 };
        Object.entries(timeByDiff).forEach(([d, arr]) => { avgTimeD[d] = arr.length > 0 ? Math.round(arr.reduce((s,v)=>s+v,0)/arr.length) : 0; });

        // Recent solved (by solvedAt)
        const recentSolved = [...solved]
          .filter(q => q.solvedAt)
          .sort((a,b) => new Date(b.solvedAt) - new Date(a.solvedAt))
          .slice(0, 10);

        // Hard unsolved questions
        const hardUnsolved = allQuestions
          .filter(q => q.difficulty === 'H' && q.status !== 'solved')
          .sort((a,b) => (b.attempts||0) - (a.attempts||0));

        // Question table with filter
        const qTableData = (() => {
          if (qFilter === 'hard')     return hardUnsolved;
          if (qFilter === 'revision') return revision;
          if (qFilter === 'attempted') return attempted;
          return allQuestions.filter(q => q.status === 'solved' || q.status === 'attempted' || q.needsRevision).slice(0, 50);
        })();

        const GlassCard = ({ children, style = {} }) => (
          <div style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)', ...style,
          }}>{children}</div>
        );

        const SectionLabel = ({ children }) => (
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>{children}</div>
        );

        const MiniBar = ({ pct, color, height = 5 }) => (
          <div style={{ flex: 1, height, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: color, borderRadius: 99, boxShadow: `0 0 6px ${color}60`, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
          </div>
        );

        const DiffBadge = ({ d }) => (
          <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: `${DC[d]}18`, color: DC[d], border: `1px solid ${DC[d]}35`, letterSpacing: '0.04em' }}>
            {DL[d] || d}
          </span>
        );

        const StatusBadge = ({ s }) => {
          const labels = { solved: 'Solved', attempted: 'Attempted', not_started: 'Not Started', skipped: 'Skipped' };
          const col = SC[s] || SC.not_started;
          return <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '4px', background: `${col}18`, color: col, border: `1px solid ${col}30` }}>{labels[s] || s}</span>;
        };

        return (
          <>
            {/* ── ZONE A: Summary Stats ── */}
            <div className="az" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '14px' }}>
              {[
                { label: 'Solved',          value: solved.length,    sub: `of ${allQuestions.length} total`,  color: '#34D399', icon: '✓' },
                { label: 'Attempted',        value: attempted.length, sub: 'in progress',                      color: '#60A5FA', icon: '⟳' },
                { label: 'Needs Revision',   value: revision.length,  sub: 'flagged for review',               color: '#FBBF24', icon: '🔖' },
                { label: 'Avg Confidence',   value: avgConf !== '—' ? `★ ${avgConf}` : '—', sub: 'on solved questions', color: '#A78BFA', icon: '★' },
                { label: 'Avg Solve Time',   value: avgTime > 0 ? `${avgTime}m` : '—', sub: 'per question',   color: '#F472B6', icon: '⏱' },
              ].map(s => (
                <GlassCard key={s.label} style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '38px', opacity: 0.07, lineHeight: 1 }}>{s.icon}</div>
                  <SectionLabel>{s.label}</SectionLabel>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: s.color, letterSpacing: '-0.03em', lineHeight: 1, margin: '6px 0 4px' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>
                </GlassCard>
              ))}
            </div>

            {/* ── ZONE B: Difficulty + Importance ── */}
            <div className="az" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>

              {/* Difficulty breakdown */}
              <GlassCard>
                <SectionLabel>Difficulty Breakdown</SectionLabel>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '18px' }}>
                  {solved.length} <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: '500' }}>solved total</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(['E','M','H']).map(d => {
                    const { total, solved: s } = byDiff[d];
                    const pct = total > 0 ? Math.round(s/total*100) : 0;
                    return (
                      <div key={d}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '9px', height: '9px', borderRadius: '2px', background: DC[d], boxShadow: `0 0 6px ${DC[d]}80` }} />
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>{DL[d]}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: DC[d] }}>{s}/{total}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', minWidth: '32px', textAlign: 'right' }}>{pct}%</span>
                          </div>
                        </div>
                        <MiniBar pct={pct} color={DC[d]} height={6} />
                      </div>
                    );
                  })}
                </div>
                {/* Insight */}
                {(() => {
                  const gaps = [['E','M','H']].flat().map(d => ({ d, gap: byDiff[d].total - byDiff[d].solved, pct: byDiff[d].total > 0 ? Math.round(byDiff[d].solved/byDiff[d].total*100) : 0 }));
                  const worst = gaps.sort((a,b)=>a.pct-b.pct)[0];
                  if (worst && worst.gap > 0) return (
                    <div style={{ marginTop: '16px', padding: '10px 12px', background: `${DC[worst.d]}10`, border: `1px solid ${DC[worst.d]}25`, borderRadius: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                      💡 Biggest gap: <strong style={{ color: DC[worst.d] }}>{DL[worst.d]}</strong> — only {worst.pct}% solved ({worst.gap} remaining)
                    </div>
                  );
                  return null;
                })()}
              </GlassCard>

              {/* Importance breakdown */}
              <GlassCard>
                <SectionLabel>Importance Tiers</SectionLabel>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '18px' }}>
                  {byImp.must.solved} <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: '500' }}>must-do solved</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { key: 'must',     label: 'Must-Do',  color: '#EF4444' },
                    { key: 'strong',   label: 'Strong',   color: '#F59E0B' },
                    { key: 'optional', label: 'Optional', color: '#60A5FA' },
                  ].map(({ key, label, color }) => {
                    const { total, solved: s } = byImp[key];
                    const pct = total > 0 ? Math.round(s/total*100) : 0;
                    return (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '9px', height: '9px', borderRadius: '2px', background: color, boxShadow: `0 0 6px ${color}80` }} />
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', color }}>{s}/{total}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', minWidth: '32px', textAlign: 'right' }}>{pct}%</span>
                          </div>
                        </div>
                        <MiniBar pct={pct} color={color} height={6} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '16px', padding: '10px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                  🎯 <strong style={{ color: '#F87171' }}>{byImp.must.total - byImp.must.solved}</strong> must-do questions remaining — prioritize these first
                </div>
              </GlassCard>
            </div>

            {/* ── ZONE C: Confidence Heatmap + Time Analysis ── */}
            <div className="az" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>

              {/* Confidence matrix */}
              <GlassCard>
                <SectionLabel>Confidence Distribution</SectionLabel>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '18px' }}>Difficulty × Confidence level (solved questions)</div>
                {/* Header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(5, 1fr)', gap: '5px', marginBottom: '6px' }}>
                  <div />
                  {[1,2,3,4,5].map(c => (
                    <div key={c} style={{ textAlign: 'center', fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.3)' }}>★{c}</div>
                  ))}
                </div>
                {(['E','M','H']).map(d => (
                  <div key={d} style={{ display: 'grid', gridTemplateColumns: '60px repeat(5, 1fr)', gap: '5px', marginBottom: '5px', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: DC[d] }}>{DL[d]}</div>
                    {[1,2,3,4,5].map(c => {
                      const count = confMatrix[d][c] || 0;
                      const maxCount = Math.max(...Object.keys(confMatrix).flatMap(dd => [1,2,3,4,5].map(cc => confMatrix[dd][cc]||0)), 1);
                      const intensity = count > 0 ? 0.15 + (count/maxCount) * 0.85 : 0;
                      const bg = count > 0 ? `rgba(${c >= 4 ? '0,212,170' : c >= 3 ? '251,191,36' : '239,68,68'}, ${intensity})` : 'rgba(255,255,255,0.04)';
                      return (
                        <div key={c} title={`${DL[d]} × ★${c}: ${count} questions`} style={{
                          height: '36px', borderRadius: '7px', background: bg,
                          border: count > 0 ? `1px solid rgba(255,255,255,0.12)` : '1px solid rgba(255,255,255,0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: '800', color: count > 0 ? '#fff' : 'rgba(255,255,255,0.15)',
                          transition: 'transform 0.12s', cursor: count > 0 ? 'default' : 'default',
                        }}
                        onMouseEnter={e => { if (count > 0) e.currentTarget.style.transform = 'scale(1.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                          {count > 0 ? count : ''}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div style={{ marginTop: '14px', fontSize: '10px', color: 'rgba(255,255,255,0.25)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span>Darker = more questions</span>
                  <span style={{ color: '#00D4AA' }}>★4–5 = mastered</span>
                  <span style={{ color: '#FBBF24' }}>★3 = okay</span>
                  <span style={{ color: '#EF4444' }}>★1–2 = weak</span>
                </div>
              </GlassCard>

              {/* Time analysis */}
              <GlassCard>
                <SectionLabel>Time Analysis</SectionLabel>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '18px' }}>Average solve time per difficulty</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  {(['E','M','H']).map(d => {
                    const t = avgTimeD[d];
                    const maxT = Math.max(...Object.values(avgTimeD), 1);
                    return (
                      <div key={d}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <DiffBadge d={d} />
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{timeByDiff[d].length} solved w/ time</span>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: '800', color: t > 0 ? DC[d] : 'rgba(255,255,255,0.2)' }}>
                            {t > 0 ? `${t}m` : '—'}
                          </span>
                        </div>
                        <MiniBar pct={maxT > 0 ? (t/maxT)*100 : 0} color={DC[d]} height={5} />
                      </div>
                    );
                  })}
                </div>
                {/* Fastest questions */}
                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>
                  ⚡ Quickest Solves
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[...timedSolved].sort((a,b) => a.timeMinutes - b.timeMinutes).slice(0,4).map((q, i) => (
                    <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontWeight: '800', minWidth: '14px' }}>#{i+1}</span>
                      <span style={{ flex: 1, fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.name}</span>
                      <DiffBadge d={q.difficulty || 'M'} />
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#00D4AA' }}>{q.timeMinutes}m</span>
                    </div>
                  ))}
                  {timedSolved.length === 0 && (
                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', textAlign: 'center', padding: '12px' }}>Log solve times to see this</div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* ── NEEDS ATTENTION: Smart Priority List ── */}
            {(() => {
              const now = new Date();

              // Score each question — higher = needs more attention
              const scored = allQuestions
                .map(q => {
                  let score = 0;
                  const reasons = [];

                  // 1. Flagged for revision (+40 pts)
                  if (q.needsRevision) {
                    score += 40;
                    reasons.push({ text: 'Needs Revision', color: '#FBBF24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)' });
                  }

                  // 2. Low confidence on a solved question — any difficulty
                  if (q.status === 'solved' && q.confidence > 0) {
                    if (q.confidence === 1) {
                      score += 30;
                      reasons.push({ text: 'Low Conf ★1', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' });
                    } else if (q.confidence === 2) {
                      score += 22;
                      reasons.push({ text: 'Low Conf ★2', color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.28)' });
                    } else if (q.confidence === 3 && q.importance === 'must') {
                      score += 10;
                      reasons.push({ text: 'Shaky Conf ★3', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)' });
                    }
                  }

                  // 3. Attempted but not solved (+ attempts weight, max 25)
                  if (q.status === 'attempted' && q.attempts > 0) {
                    const pts = Math.min(25, q.attempts * 8);
                    score += pts;
                    reasons.push({ text: `${q.attempts} Attempt${q.attempts > 1 ? 's' : ''} Stuck`, color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.28)' });
                  }

                  // 4. Solved long ago (stale review) — last reviewed > 14 days
                  if (q.lastReviewed || q.solvedAt) {
                    const reviewDate = new Date(q.lastReviewed || q.solvedAt);
                    const daysSince = Math.floor((now - reviewDate) / 86400000);
                    if (daysSince >= 30) {
                      score += 22;
                      reasons.push({ text: `${daysSince}d Since Review`, color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.28)' });
                    } else if (daysSince >= 14) {
                      score += 12;
                      reasons.push({ text: `${daysSince}d Since Review`, color: '#818CF8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.22)' });
                    }
                  }

                  // 5. Must-do, not solved (+18)
                  if (q.importance === 'must' && q.status !== 'solved') {
                    score += 18;
                    reasons.push({ text: 'Must-Do Pending', color: '#F87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.22)' });
                  }

                  // 6. Skipped question — any difficulty
                  if (q.status === 'skipped') {
                    score += 8;
                    reasons.push({ text: 'Skipped', color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.2)' });
                  }

                  // 7. Zero confidence on solved (+15) — solved but never rated
                  if (q.status === 'solved' && (!q.confidence || q.confidence === 0)) {
                    score += 15;
                    reasons.push({ text: 'Unrated — Rate It', color: '#60A5FA', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.22)' });
                  }

                  return { ...q, attentionScore: score, reasons };
                })
                .filter(q => q.attentionScore > 0 && q.reasons.length > 0)
                .sort((a, b) => {
                  if (b.attentionScore !== a.attentionScore) return b.attentionScore - a.attentionScore;
                  // Tie-break: must > strong > optional
                  const io = { must: 0, strong: 1, optional: 2 };
                  return (io[a.importance] ?? 2) - (io[b.importance] ?? 2);
                })
                .slice(0, 15);

              if (scored.length === 0) return (
                <div className="az" style={{
                  background: 'linear-gradient(145deg, rgba(0,212,170,0.04), rgba(0,212,170,0.01))',
                  border: '1px solid rgba(0,212,170,0.15)', borderRadius: '16px', padding: '28px',
                  textAlign: 'center', marginBottom: '14px',
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎯</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#00D4AA' }}>All caught up!</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>No questions need attention right now.</div>
                </div>
              );

              const maxScore = scored[0].attentionScore;

              return (
                <div className="az" style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.25)', marginBottom: '14px',
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF444480', animation: 'pulse 2s infinite' }} />
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>Needs Attention</div>
                        <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '99px', background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                          {scored.length} questions
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginLeft: '18px' }}>
                        Ranked by urgency — revision flags, low confidence, stale reviews & stuck attempts
                      </div>
                    </div>
                    {/* Score legend */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {[
                        { label: 'Needs Revision', color: '#FBBF24' },
                        { label: 'Low Confidence', color: '#EF4444' },
                        { label: 'Stuck', color: '#F87171' },
                        { label: 'Stale Review', color: '#A78BFA' },
                        { label: 'Must Pending', color: '#F87171' },
                      ].map(tag => (
                        <div key={tag.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: tag.color }} />
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '600' }}>{tag.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {scored.map((q, idx) => {
                      const urgencyPct = Math.round((q.attentionScore / maxScore) * 100);
                      const urgencyColor = urgencyPct >= 70 ? '#EF4444' : urgencyPct >= 45 ? '#F59E0B' : '#60A5FA';
                      const isTop3 = idx < 3;
                      return (
                        <div key={q.id} style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '12px 14px',
                          background: isTop3 ? `rgba(${idx === 0 ? '239,68,68' : idx === 1 ? '245,158,11' : '96,165,250'}, 0.05)` : 'rgba(255,255,255,0.025)',
                          border: isTop3 ? `1px solid rgba(${idx === 0 ? '239,68,68' : idx === 1 ? '245,158,11' : '96,165,250'}, 0.2)` : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.045)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = isTop3 ? `rgba(${idx === 0 ? '239,68,68' : idx === 1 ? '245,158,11' : '96,165,250'}, 0.05)` : 'rgba(255,255,255,0.025)';
                          e.currentTarget.style.transform = 'none';
                        }}>

                          {/* Rank */}
                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${urgencyColor}15`, border: `1px solid ${urgencyColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: urgencyColor }}>#{idx + 1}</span>
                          </div>

                          {/* Urgency bar (vertical strip) */}
                          <div style={{ width: '3px', height: '40px', borderRadius: '99px', background: `linear-gradient(180deg, ${urgencyColor}, ${urgencyColor}50)`, flexShrink: 0 }} />

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '260px' }}>{q.name}</span>
                              <DiffBadge d={q.difficulty || 'M'} />
                              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{q.patternName}</span>
                            </div>
                            {/* Reason tags */}
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                              {q.reasons.map((r, ri) => (
                                <span key={ri} style={{
                                  fontSize: '9px', fontWeight: '800', padding: '2px 7px', borderRadius: '4px',
                                  background: r.bg, color: r.color, border: `1px solid ${r.border}`,
                                  letterSpacing: '0.03em',
                                }}>{r.text}</span>
                              ))}
                            </div>
                          </div>

                          {/* Urgency score bar */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0, minWidth: '80px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '800', color: urgencyColor }}>{urgencyPct}% urgent</div>
                            <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${urgencyPct}%`, background: `linear-gradient(90deg, ${urgencyColor}90, ${urgencyColor})`, borderRadius: '99px', transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
                            </div>
                          </div>

                          {/* Quick action */}
                          {q.lcUrl && (
                            <a href={q.lcUrl} target="_blank" rel="noopener noreferrer" style={{
                              fontSize: '10px', fontWeight: '700', color: '#FBBF24', background: 'rgba(251,191,36,0.1)',
                              border: '1px solid rgba(251,191,36,0.25)', borderRadius: '6px', padding: '4px 10px',
                              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.1)'; }}>
                              Solve →
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ── ZONE D: Question Table (filtered) ── */}
            <div className="az" style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px', marginBottom: '14px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>Question Explorer</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{qTableData.length} questions shown</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'all',      label: 'Active' },
                    { key: 'attempted',label: `Attempted (${attempted.length})` },
                    { key: 'hard',     label: `Hard Unsolved (${hardUnsolved.length})` },
                    { key: 'revision', label: `Revision (${revision.length})` },
                  ].map(f => (
                    <button key={f.key} className={`pfbtn ${qFilter === f.key ? 'on' : ''}`} onClick={() => setQFilter(f.key)}>{f.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="analytics-table">
                  <thead>
                    <tr>
                      {['Question', 'Pattern', 'Difficulty', 'Importance', 'Status', 'Conf', 'Attempts', 'Time', ''].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {qTableData.slice(0,40).map(q => (
                      <tr key={q.id}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        style={{ transition: 'background 0.12s' }}>
                        <td style={{ padding: '9px 12px', maxWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{q.name}</span>
                            {q.needsRevision && <span style={{ fontSize: '8px', fontWeight: '800', background: 'rgba(251,191,36,0.12)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '4px', padding: '1px 5px' }}>REVISE</span>}
                          </div>
                        </td>
                        <td style={{ padding: '9px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{q.patternName}</td>
                        <td style={{ padding: '9px 12px' }}><DiffBadge d={q.difficulty || 'M'} /></td>
                        <td style={{ padding: '9px 12px', fontSize: '10px', fontWeight: '700',
                          color: q.importance === 'must' ? '#EF4444' : q.importance === 'strong' ? '#F59E0B' : '#60A5FA' }}>
                          {q.importance || '—'}
                        </td>
                        <td style={{ padding: '9px 12px' }}><StatusBadge s={q.status || 'not_started'} /></td>
                        <td style={{ padding: '9px 12px', fontSize: '12px', fontWeight: '700',
                          color: !q.confidence ? 'rgba(255,255,255,0.2)' : q.confidence >= 4 ? '#00D4AA' : q.confidence >= 3 ? '#FBBF24' : '#EF4444' }}>
                          {q.confidence > 0 ? `★${q.confidence}` : '—'}
                        </td>
                        <td style={{ padding: '9px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
                          {q.attempts > 0 ? q.attempts : '—'}
                        </td>
                        <td style={{ padding: '9px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                          {q.timeMinutes > 0 ? `${q.timeMinutes}m` : '—'}
                        </td>
                        <td style={{ padding: '9px 12px' }}>
                          {q.lcUrl && (
                            <a href={q.lcUrl} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: '10px', fontWeight: '700', color: '#FBBF24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '6px', padding: '3px 9px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                              LC →
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {qTableData.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>No questions in this filter</div>
                )}
              </div>
            </div>

            {/* ── ZONE E: Recent Activity ── */}
            <div className="az" style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            }}>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Recent Activity</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '20px' }}>Last {recentSolved.length} questions solved</div>
              {recentSolved.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
                  No solved questions with timestamps yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentSolved.map((q, i) => {
                    const date = q.solvedAt ? new Date(q.solvedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '—';
                    return (
                      <div key={q.id} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
                        background: i === 0 ? 'rgba(0,212,170,0.06)' : 'rgba(255,255,255,0.025)',
                        border: i === 0 ? '1px solid rgba(0,212,170,0.15)' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '10px', transition: 'background 0.12s',
                      }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${DC[q.difficulty||'M']}18`, border: `1px solid ${DC[q.difficulty||'M']}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: DC[q.difficulty||'M'] }}>{q.difficulty||'M'}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.name}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{q.patternName}</div>
                        </div>
                        {q.confidence > 0 && (
                          <span style={{ fontSize: '11px', fontWeight: '700', color: q.confidence >= 4 ? '#00D4AA' : q.confidence >= 3 ? '#FBBF24' : '#EF4444' }}>★{q.confidence}</span>
                        )}
                        {q.timeMinutes > 0 && (
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', padding: '2px 7px' }}>{q.timeMinutes}m</span>
                        )}
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{date}</span>
                        {i === 0 && <span style={{ fontSize: '9px', fontWeight: '800', background: 'rgba(0,212,170,0.15)', color: '#00D4AA', border: '1px solid rgba(0,212,170,0.3)', borderRadius: '4px', padding: '2px 6px', flexShrink: 0 }}>LATEST</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        );
      })()}

    </div>
  );
}

