import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PHASES, WEEKS, PROJECT_MAP, isWeekUnlocked } from '../data/backendRoadmapData';
import { getBackendProgress, getBackendStats } from '../api/backendClient';

/* ─── Circular progress ring ─────────────────────────────── */
function Ring({ pct, size = 48, stroke = 4, color = '#00d4aa' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  );
}

export default function BackendRoadmap() {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [mapExpanded, setMapExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getBackendProgress().then(r => setProgress(r.data)),
      getBackendStats().catch(() => { }),
    ]).finally(() => setLoading(false));
  }, []);

  const getWeekProgress = (weekId) => {
    const week = WEEKS[weekId];
    if (!week) return { done: 0, total: 0, pct: 0 };
    const total = week.days.length;
    const done = week.days.filter(tid => progress[tid]?.status === 'DONE').length;
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  const totalDays = Object.values(WEEKS).reduce((s, w) => s + w.days.length, 0);
  const totalDone = Object.values(WEEKS).reduce((s, w) =>
    s + w.days.filter(tid => progress[tid]?.status === 'DONE').length, 0);
  const inProgress = Object.values(progress).filter(p => p.status === 'IN_PROGRESS').length;
  const overallPct = totalDays > 0 ? Math.round((totalDone / totalDays) * 100) : 0;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Loading roadmap…</div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', top: 56, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1600, display: 'flex', gap: 40, padding: '32px 32px 0' }}>

        {/* ── LEFT SIDEBAR (FIXED) ── */}
        <aside style={{ flex: '1 1 340px', maxWidth: 400, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 32, paddingRight: 8 }}>

          {/* Header Info */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#00d4aa', marginBottom: 12 }}>Phase 1</div>
            <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1.1, marginBottom: 16, background: 'linear-gradient(135deg,var(--text-primary),var(--text-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Backend<br />Foundations
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Master Java internals, Spring Boot, Concurrency, and System Design. Build a production-grade Payment Wallet.
            </p>
          </div>

          {/* Overall Progress Card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--card-border)', borderRadius: 24, padding: 22, display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ position: 'relative', width: 78, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ring pct={overallPct} size={78} stroke={5} color={overallPct === 100 ? '#00d4aa' : '#8b5cf6'} />
              <span style={{ position: 'absolute', fontSize: 16, fontWeight: 800, color: overallPct === 100 ? '#00d4aa' : '#8b5cf6' }}>{overallPct}%</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 6 }}>Overall Progress</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{totalDone} of {totalDays} days</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{PHASES[0].weeks.length} weeks total</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 20, padding: '18px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#00d4aa', lineHeight: 1 }}>{totalDone}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>Completed</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '18px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{inProgress}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>In Progress</div>
            </div>
          </div>

          {/* Checkpoint CTA */}
          <button onClick={() => navigate('/backend/checkpoint/phase1')} style={{
            padding: '18px 20px', borderRadius: 20, fontSize: 15, fontWeight: 800,
            cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', border: 'none',
            background: overallPct === 100 ? 'linear-gradient(135deg,#00d4aa,#00a880)' : 'var(--bg-elevated)',
            color: overallPct === 100 ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: overallPct === 100 ? '0 12px 40px rgba(0,212,170,0.35)' : 'none',
            outline: `1px solid ${overallPct === 100 ? 'transparent' : 'var(--border)'}`,
            marginTop: 8, letterSpacing: '0.02em',
          }}>
            🏁 Phase 1 Checkpoint
          </button>
        </aside>

        {/* ── RIGHT MAIN AREA (SCROLLABLE) ── */}
        <main style={{ flex: '3 1 600px', minWidth: 0, height: '100%', overflowY: 'auto', paddingRight: 16, paddingBottom: 40 }}>

          {/* Project Map collapsible */}
          <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 24, marginBottom: 32, overflow: 'hidden', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', cursor: 'pointer' }} onClick={() => setMapExpanded(v => !v)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📁</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a78bfa', marginBottom: 4 }}>Read First</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(var(--white-rgb),0.9)' }}>{PROJECT_MAP.title}</div>
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 18, transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', transform: mapExpanded ? 'rotate(180deg)' : 'none' }}>▼</span>
            </div>
            {mapExpanded && (
              <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
                <p style={{ fontSize: 14, color: 'var(--text-gray)', lineHeight: 1.7, margin: '20px 0' }}>{PROJECT_MAP.description}</p>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Package root: <span style={{ color: '#a78bfa', textTransform: 'none', letterSpacing: 'normal', fontFamily: 'monospace', fontSize: 12 }}>{PROJECT_MAP.packageRoot}</span></div>
                <pre style={{ background: 'var(--code-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '16px 20px', fontSize: 12.5, lineHeight: 1.8, overflowX: 'auto', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono','Fira Code',monospace", marginBottom: 24, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)' }}>
                  {PROJECT_MAP.structure.join('\n')}
                </pre>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#00d4aa', marginBottom: 16 }}>Deliverables by Phase 1 end</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px 24px' }}>
                  {PROJECT_MAP.deliverables.map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 10 }}>
                      <span style={{ color: '#00d4aa', flexShrink: 0, marginTop: 1, fontSize: 14 }}>✓</span>
                      <span style={{ fontSize: 13.5, color: 'rgba(var(--white-rgb),0.75)', lineHeight: 1.5 }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Week Cards Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 24 }}>
            {PHASES[0].weeks.map((weekId) => {
              const week = WEEKS[weekId];
              const wp = getWeekProgress(weekId);
              const unlocked = isWeekUnlocked(weekId, progress);

              const borderColor = wp.pct === 100 ? '#00d4aa' : wp.done > 0 ? '#f59e0b' : 'var(--card-border)';
              const glowColor = wp.pct === 100 ? 'rgba(0,212,170,0.1)' : wp.done > 0 ? 'rgba(245,158,11,0.08)' : 'transparent';

              return (
                <div key={weekId} onClick={() => unlocked && navigate(`/backend/topic/${week.days[0]}`)}
                  style={{
                    display: 'flex', flexDirection: 'column', padding: '28px',
                    background: `linear-gradient(135deg, ${glowColor}, var(--bg-surface))`,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 24, cursor: unlocked ? 'pointer' : 'not-allowed',
                    opacity: unlocked ? 1 : 0.5, position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: wp.pct === 100 ? '0 8px 32px rgba(0,212,170,0.15)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (unlocked) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      if (wp.pct !== 100) e.currentTarget.style.borderColor = 'var(--border-strong)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (unlocked) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = borderColor;
                    }
                  }}
                >
                  {/* Top Row: Ring + Title */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Ring pct={wp.pct} size={56} stroke={4.5} color={wp.pct === 100 ? '#00d4aa' : '#f59e0b'} />
                        <span style={{ position: 'absolute', fontSize: 13, fontWeight: 800, color: wp.pct === 100 ? '#00d4aa' : wp.done > 0 ? '#f59e0b' : 'var(--text-dim)' }}>
                          {wp.pct === 100 ? '✓' : `W${week.number}`}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Week {week.number}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'rgba(var(--white-rgb),0.9)', lineHeight: 1.25, letterSpacing: '-0.3px' }}>{week.title}</div>
                      </div>
                    </div>
                    {!unlocked && <span style={{ fontSize: 18, background: 'var(--bg-elevated)', padding: 8, borderRadius: 12 }}>🔒</span>}
                  </div>

                  {/* Goal */}
                  <div style={{ fontSize: 14, color: 'var(--text-gray)', lineHeight: 1.6, marginBottom: 24, flex: 1 }}>
                    {week.goal}
                  </div>

                  {/* Bottom: Progress + Tags */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{wp.done} / {wp.total} DAYS</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: wp.pct === 100 ? '#00d4aa' : 'var(--text-gray)' }}>{wp.pct}%</div>
                    </div>

                    {/* Progress bar line */}
                    <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${wp.pct}%`, height: '100%', background: wp.pct === 100 ? '#00d4aa' : 'linear-gradient(90deg,#f59e0b,#fbbf24)', borderRadius: 3, transition: 'width 0.5s ease' }} />
                    </div>

                    {/* Build tags */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                      {week.builds.slice(0, 3).map((b, i) => (
                        <span key={i} style={{ fontSize: 10.5, padding: '4px 10px', borderRadius: 8, background: 'var(--bg-surface)', color: 'rgba(var(--white-rgb),0.45)', border: '1px solid var(--card-border)' }}>{b}</span>
                      ))}
                      {week.builds.length > 3 && <span style={{ fontSize: 10.5, color: 'var(--text-dim)', padding: '4px 2px' }}>+{week.builds.length - 3}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
