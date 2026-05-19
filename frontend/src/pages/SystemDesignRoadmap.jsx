import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SYSTEM_DESIGN_DATA } from '../data/systemDesignData';
import { getSystemDesignProgress, getSystemDesignStats } from '../api/systemDesignClient';
import { SYSTEM_DESIGN_TIPS } from '../data/systemDesignTips';

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

export default function SystemDesignRoadmap() {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getDailyTipIndex = () => {
    const today = new Date();
    const dayCount = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    return dayCount % SYSTEM_DESIGN_TIPS.length;
  };

  const [tipIndex, setTipIndex] = useState(getDailyTipIndex());
  const activeTip = SYSTEM_DESIGN_TIPS[tipIndex];

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % SYSTEM_DESIGN_TIPS.length);
  };


  useEffect(() => {
    Promise.all([
      getSystemDesignProgress().then(r => setProgress(r.data)).catch(() => { }),
      getSystemDesignStats().catch(() => { }),
    ]).finally(() => setLoading(false));
  }, []);

  const getChapterProgress = (chapter) => {
    const total = chapter.sections.length;
    const done = chapter.sections.filter(sec => progress[sec.id]?.status === 'DONE').length;
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  const totalSections = SYSTEM_DESIGN_DATA.reduce((s, ch) => s + ch.sections.length, 0);
  const totalDone = SYSTEM_DESIGN_DATA.reduce((s, ch) =>
    s + ch.sections.filter(sec => progress[sec.id]?.status === 'DONE').length, 0);
  const inProgress = Object.values(progress).filter(p => p.status === 'IN_PROGRESS').length;
  const overallPct = totalSections > 0 ? Math.round((totalDone / totalSections) * 100) : 0;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Loading system design roadmap…</div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', top: 56, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1600, display: 'flex', gap: 40, padding: '32px 32px 0', height: '100%', boxSizing: 'border-box' }}>
        {/* ── LEFT SIDEBAR (FIXED & NON-SCROLLABLE) ── */}
        <aside style={{
          flex: '0 0 340px',
          maxWidth: 380,
          height: '100%',
          overflowY: 'hidden', // STRICTLY disable vertical scrollbars!
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          paddingBottom: 32
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8b5cf6', marginBottom: 10 }}>Specialist Track</div>
            <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1.1, marginBottom: 16, background: 'linear-gradient(135deg, var(--text-primary), var(--text-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              System Design
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Study architectural scaling (0 to 1B users), back-of-the-envelope capacity estimations, and the 4-step interview system.
            </p>
          </div>

          {/* Overall Progress Card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: 68, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ring pct={overallPct} size={68} stroke={5} color={overallPct === 100 ? '#00d4aa' : '#8b5cf6'} />
              <span style={{ position: 'absolute', fontSize: 15, fontWeight: 800, color: overallPct === 100 ? '#00d4aa' : '#8b5cf6' }}>{overallPct}%</span>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-dim)', marginBottom: 6 }}>Track Progress</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{totalDone} of {totalSections} topics</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{SYSTEM_DESIGN_DATA.length} chapters compiled</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 20, padding: '16px 18px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#00d4aa', lineHeight: 1 }}>{totalDone}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>Completed</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 20, padding: '16px 18px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{inProgress}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>In Progress</div>
            </div>
          </div>

          {/* Daily System Design Axiom Card */}
          <div style={{
            background: 'linear-gradient(135deg, var(--bg-surface), rgba(139, 92, 246, 0.03))',
            borderLeft: '4px solid var(--accent-purple)',
            borderTop: '1px solid var(--border)',
            borderRight: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            flexShrink: 0,
            transition: 'all 0.3s ease'
          }}>
            {/* Title & Cycle Button Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--text-light)',
                margin: 0,
                letterSpacing: '-0.2px'
              }}>
                {activeTip.title}
              </h4>
              <button
                onClick={handleNextTip}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--accent-green)';
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 170, 0.3)';
                  e.currentTarget.style.background = 'rgba(0, 212, 170, 0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 10px',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                Next →
              </button>
            </div>

            {/* Axiom text */}
            <p style={{
              fontSize: '13.5px',
              fontStyle: 'italic',
              color: 'var(--text-gray)',
              lineHeight: 1.5,
              margin: 0
            }}>
              "{activeTip.axiom}"
            </p>
          </div>
        </aside>

        {/* ── RIGHT MAIN AREA (SCROLLABLE) ── */}
        <main style={{ flex: '3 1 600px', minWidth: 0, height: '100%', overflowY: 'auto', paddingRight: 16, paddingBottom: 40 }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {SYSTEM_DESIGN_DATA.map((chapter, idx) => {
              const cp = getChapterProgress(chapter);
              const palette = ['#00d4aa', '#8b5cf6', '#f59e0b', '#3b82f6', '#ef4444', '#06b6d4'];
              const chapterTheme = palette[idx % palette.length];
              const chapterBgGlow = `${chapterTheme}08`;

              return (
                <div
                  key={chapter.id}
                  onClick={() => {
                    if (chapter.sections && chapter.sections.length > 0) {
                      navigate(`/system-design/topic/${chapter.sections[0].id}`);
                    }
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = chapterTheme;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 12px 30px -10px ${chapterTheme}1a`;
                    const arrow = e.currentTarget.querySelector('.chapter-arrow');
                    if (arrow) arrow.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    const arrow = e.currentTarget.querySelector('.chapter-arrow');
                    if (arrow) arrow.style.transform = 'translateX(0)';
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${chapterBgGlow}, rgba(0,0,0,0))`,
                    border: '1px solid var(--border)',
                    borderRadius: 24,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Chapter Card Content */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                      <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Ring pct={cp.pct} size={56} stroke={4.5} color={chapterTheme} />
                        <span style={{ position: 'absolute', fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{cp.pct}%</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: chapterTheme, marginBottom: 4 }}>
                          MODULE 0{idx + 1}
                        </div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-light)', margin: 0 }}>
                          {chapter.title}
                        </h2>
                        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                          Contains {chapter.sections.length} critical architectural topics.
                        </p>
                      </div>
                    </div>
                    <span
                      className="chapter-arrow"
                      style={{
                        color: chapterTheme,
                        fontSize: 20,
                        marginLeft: 16,
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      →
                    </span>
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
