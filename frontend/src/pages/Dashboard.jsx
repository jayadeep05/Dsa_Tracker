import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, getDailyLog } from '../api/client';


function Heatmap({ logs }) {
  const cells = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const log = logs.find(l => l.logDate === ds);
    const qs = log ? log.qsSolved : 0;

    let bg = 'var(--bg-alpha-3)';
    let border = '1px solid var(--bg-alpha-5)';
    let glow = 'none';
    if (qs >= 8) { bg = '#34D399'; border = '1px solid #6EE7B7'; glow = '0 0 12px rgba(52,211,153,0.8)'; }
    else if (qs >= 5) { bg = '#10B981'; border = '1px solid #34D399'; glow = '0 0 8px rgba(16,185,129,0.5)'; }
    else if (qs >= 3) { bg = 'rgba(16,185,129,0.7)'; border = '1px solid rgba(52,211,153,0.5)'; glow = '0 0 4px rgba(16,185,129,0.2)'; }
    else if (qs >= 1) { bg = 'rgba(16,185,129,0.3)'; border = '1px solid rgba(52,211,153,0.2)'; }

    cells.push(
      <div key={ds} style={{ width: '16px', height: '16px', borderRadius: '4px', background: bg, border: border, boxShadow: glow, transition: 'all 0.2s ease', cursor: 'pointer' }} title={`${ds}: ${qs} solved`} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; if (qs >= 1) e.currentTarget.style.boxShadow = '0 0 16px rgba(52,211,153,1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = glow; }} />
    );
  }
  return <div style={{ display: 'flex', gap: '4px' }}>{cells}</div>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).catch(console.error);
    getDailyLog(14).then(r => setLogs(r.data)).catch(() => { });
  }, []);

  if (!data) return <div className="loading"><div className="spinner" /> Loading dashboard...</div>;

  const pct = data.percentComplete;
  const currentPattern = data.nextRecommended ? data.patternProgress.find(p => p.name === data.nextRecommended.patternName) : null;
  const barColor = pct < 33 ? 'red' : pct < 66 ? 'amber' : 'green';

  return (
    <div className="page">

      <style>{`
        .dashboard-top-row {
          display: grid;
          grid-template-columns: max-content 1fr 0.9fr 1.4fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 1000px) {
          .dashboard-top-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 700px) {
          .dashboard-top-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-top-row">

        {/* CARD 1 (left) — Streak + Today + Heatmap */}
        <div style={{ background: 'linear-gradient(145deg, var(--card-grad-start) 0%, var(--card-grad-end) 100%)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '12.5px 16px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px var(--shadow-alpha-20)' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(to right, rgba(139,92,246,0.15), rgba(139,92,246,0.05))', border: `1px solid ${data.currentStreak >= 3 ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.2)'}`, borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', color: '#C4B5FD', marginBottom: '16px', alignSelf: 'flex-start', boxShadow: '0 4px 12px rgba(139,92,246,0.1)' }}>
            🔥 {data.currentStreak} Day Streak
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '20px', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-darkgray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Today</div>
              <div style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.03em', color: '#34D399' }}>{data.todaySolved}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '6px', fontWeight: '500' }}>questions solved</div>
            </div>

            <div style={{ background: 'linear-gradient(to bottom, var(--border-alpha-10), var(--border-alpha-2))', width: '1px', alignSelf: 'stretch' }} />

            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-darkgray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Longest</div>
              <div style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.03em', color: '#A78BFA' }}>{data.longestStreak}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '6px', fontWeight: '500' }}>days streak</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px #34D399' }} />
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-light)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>14-Day Activity</div>
            </div>
            <Heatmap logs={logs} />
          </div>
        </div>

        {/* CARD 2 (middle) — Progress */}
        <div style={{ background: 'linear-gradient(145deg, var(--card-grad-start) 0%, var(--card-grad-end) 100%)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '12.5px 16px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px var(--shadow-alpha-20)' }}>



          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#34D399', letterSpacing: '-0.03em', lineHeight: '1' }}>{data.solved}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-gray)', fontWeight: '500' }}>/ {data.totalQuestions}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', marginBottom: '2px' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-light)', lineHeight: '1' }}>{pct}%</div>
              <div style={{ fontSize: '9px', color: 'var(--text-darkgray)', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Completed</div>
            </div>
          </div>

          <div style={{ height: '6px', background: 'var(--bg-alpha-5)', borderRadius: '99px', marginTop: '12px', overflow: 'hidden', border: '1px solid var(--border-alpha-2)', boxShadow: 'inset 0 1px 3px var(--shadow-alpha-30)' }}>
            <div style={{ background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)', height: '100%', width: `${pct}%`, borderRadius: '99px', boxShadow: '0 0 10px rgba(52,211,153,0.4)' }} />
          </div>


          <div style={{ marginTop: 'auto', paddingTop: '16px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>★ Must-do</div>
              <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>{data.mustSolved} / {data.mustTotal}</div>
            </div>
            <div style={{ height: '6px', background: 'var(--bg-alpha-5)', borderRadius: '99px', overflow: 'hidden', border: '1px solid var(--border-alpha-2)', boxShadow: 'inset 0 1px 3px var(--shadow-alpha-30)' }}>
              <div style={{ background: 'linear-gradient(90deg, #D97706 0%, #FBBF24 100%)', height: '100%', width: `${(data.mustSolved / data.mustTotal * 100) || 0}%`, borderRadius: '99px', boxShadow: '0 0 10px rgba(251,191,36,0.3)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>Needs revision</div>
              <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>{data.flaggedForRevision || 0} flagged</div>
            </div>
            <div style={{ height: '6px', background: 'var(--bg-alpha-5)', borderRadius: '99px', overflow: 'hidden', border: '1px solid var(--border-alpha-2)', boxShadow: 'inset 0 1px 3px var(--shadow-alpha-30)' }}>
              <div style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)', height: '100%', width: `${(data.flaggedForRevision / data.totalQuestions * 100) || 0}%`, borderRadius: '99px' }} />
            </div>
          </div>
        </div>

        {/* CARD 4 (rightmost) — Current Focus */}
        <div style={{ background: 'linear-gradient(145deg, var(--card-grad-start) 0%, var(--card-grad-end) 100%)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '12.5px 16px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px var(--shadow-alpha-20)' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

          <div style={{ fontSize: '11px', fontWeight: '800', color: '#A78BFA', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', zIndex: 1 }}>
            <span style={{ fontSize: '14px' }}>🎯</span> CURRENT FOCUS
          </div>

          {currentPattern ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', zIndex: 1 }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-white)', letterSpacing: '-0.02em', marginBottom: '24px', lineHeight: '1.2' }}>
                {currentPattern.name}
              </div>

              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '12px', padding: '16px', marginTop: 'auto', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Completion</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-light)', letterSpacing: '-0.03em', lineHeight: '1' }}>{currentPattern.solved}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-darkgray)', fontWeight: '600' }}>/ {currentPattern.totalQs}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-white)', lineHeight: '1', marginBottom: '2px', textShadow: '0 0 12px rgba(167,139,250,0.5)' }}>
                    {currentPattern.percentComplete}%
                  </div>
                </div>

                <div style={{ height: '8px', background: 'var(--bg-alpha-5)', borderRadius: '99px', overflow: 'hidden', border: '1px solid var(--bg-alpha-3)', boxShadow: 'inset 0 1px 3px var(--shadow-alpha-50)' }}>
                  <div style={{ background: 'linear-gradient(90deg, #8B5CF6 0%, #C4B5FD 100%)', height: '100%', width: `${currentPattern.percentComplete}%`, borderRadius: '99px', boxShadow: '0 0 10px rgba(167,139,250,0.5)', transition: 'width 1s ease-in-out' }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 'auto', zIndex: 1 }}>No active focus area.</div>
          )}
        </div>

        {/* CARD 3 (right, wider) — Next Recommended */}
        <div style={{ background: 'linear-gradient(145deg, var(--card-grad-start) 0%, var(--card-grad-end) 100%)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '12.5px 16px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px var(--shadow-alpha-20)' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

          <div style={{ fontSize: '11px', fontWeight: '800', color: '#FBBF24', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', zIndex: 1 }}>
            <span style={{ fontSize: '14px' }}>⚡</span> NEXT RECOMMENDED
          </div>

          {data.nextRecommended ? (
            <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-white)', letterSpacing: '-0.02em', marginBottom: '24px', lineHeight: '1.2' }}>
                {data.nextRecommended.name}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
                <span style={{ background: data.nextRecommended.difficulty === 'E' ? 'rgba(16,185,129,0.15)' : data.nextRecommended.difficulty === 'M' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: data.nextRecommended.difficulty === 'E' ? '#34D399' : data.nextRecommended.difficulty === 'M' ? '#FBBF24' : '#F87171', border: `1px solid ${data.nextRecommended.difficulty === 'E' ? 'rgba(16,185,129,0.3)' : data.nextRecommended.difficulty === 'M' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.02em' }}>
                  {data.nextRecommended.difficulty === 'E' ? 'Easy' : data.nextRecommended.difficulty === 'M' ? 'Medium' : 'Hard'}
                </span>

                <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.02em' }}>
                  ★ Must
                </span>

                <span style={{ background: 'var(--bg-alpha-5)', color: 'var(--text-gray)', border: '1px solid var(--border-alpha-10)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '500', letterSpacing: '0.02em' }}>
                  {data.nextRecommended.patternName}
                </span>
              </div>

              <button
                onClick={() => window.open(data.nextRecommended.lcUrl, '_blank')}
                style={{
                  marginTop: 'auto',
                  marginBottom: '9px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'rgba(59,130,246,0.1)',
                  color: '#60A5FA',
                  border: '1px solid rgba(59,130,246,0.4)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: 'fit-content',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(59,130,246,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3B82F6';
                  e.currentTarget.style.color = 'var(--text-white)';
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(59,130,246,0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                  e.currentTarget.style.color = '#60A5FA';
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Open on LeetCode ↗
              </button>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', zIndex: 1 }}>🎉 All must-do questions solved!</div>
          )}
        </div>

      </div>

      <div className="card-flat pattern-progress-list" style={{ padding: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Pattern Progress — Study Order
        </div>
        {data.patternProgress.map(p => {
          const pct2 = p.percentComplete;
          const c = 'green';
          const hoverBg = 'rgba(16,185,129,0.08)';
          const hoverBorder = 'rgba(16,185,129,0.3)';

          return (
            <div
              key={p.id}
              className="pattern-row"
              onClick={() => navigate('/study', { state: { patternId: p.id } })}
              onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.borderColor = hoverBorder; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; }}
            >
              <div className="pattern-row-name">{p.name}</div>
              <div className="pattern-row-week">Wk {p.weekStart}</div>
              <div className="pattern-row-bar">
                <div className="progress-track">
                  <div className={`progress-fill ${c}`} style={{ width: `${pct2}%` }} />
                </div>
              </div>
              <div className="pattern-row-count">{p.solved}/{p.totalQs}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
