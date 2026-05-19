import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WEEKS } from '../data/backendRoadmapData';
import TOPICS from '../data/topics';
import { getBackendProgress } from '../api/backendClient';

const STATUS_ICON = { DONE: '✅', IN_PROGRESS: '🔵', NOT_STARTED: '○' };
const STATUS_LABEL = { DONE: 'Done', IN_PROGRESS: 'In Progress', NOT_STARTED: 'Not Started' };

export default function BackendWeek() {
  const { weekId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const week = WEEKS[weekId];

  useEffect(() => {
    getBackendProgress().then(r => setProgress(r.data)).finally(() => setLoading(false));
  }, [weekId]);

  if (!week) return <div className="page"><h1>Week not found</h1></div>;

  const done = week.days.filter(tid => progress[tid]?.status === 'DONE').length;
  const pct = Math.round((done / week.days.length) * 100);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 24px 60px' }}>
      {/* Back nav */}
      <button
        onClick={() => navigate('/backend/roadmap')}
        style={{
          background: 'none', border: 'none', color: 'var(--accent-green)',
          fontSize: 13, cursor: 'pointer', marginBottom: 16, padding: 0,
          display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500,
        }}
      >
        ← Back to Roadmap
      </button>

      {/* Week header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>
          Week {week.number} — {week.title}
        </h1>
        <div className="pattern-callout" style={{ marginBottom: 16 }}>
          <strong>Goal:</strong> {week.goal}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="progress-track" style={{ flex: 1, height: 6 }}>
            <div className="progress-fill green" style={{ width: `${pct}%` }} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{done}/{week.days.length} days</span>
        </div>
      </div>

      {/* What gets built */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-amber)', marginBottom: 10 }}>
          What gets built this week
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {week.builds.map((b, i) => (
            <div key={i} style={{ fontSize: 13, color: 'var(--text-light)', display: 'flex', gap: 8 }}>
              <span style={{ color: 'var(--accent-green)' }}>▸</span> {b}
            </div>
          ))}
        </div>
      </div>

      {/* Day list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {week.days.map((topicId) => {
          const topic = TOPICS[topicId];
          if (!topic) return null;
          const status = progress[topicId]?.status || 'NOT_STARTED';
          const failureDone = progress[topicId]?.failureSimDone || false;

          return (
            <div
              key={topicId}
              className="card"
              onClick={() => navigate(`/backend/topic/${topicId}`)}
              style={{
                padding: '16px 20px', cursor: 'pointer',
                borderLeft: status === 'DONE' ? '3px solid var(--accent-green)' :
                            status === 'IN_PROGRESS' ? '3px solid var(--accent-amber)' :
                            '3px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>
                  {STATUS_ICON[status]}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>
                      DAY {topic.dayNumber} • {topic.dayLabel}
                    </span>
                    <span style={{
                      fontSize: 10, padding: '1px 8px', borderRadius: 20,
                      background: 'var(--bg-elevated)', color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}>
                      {topic.estimatedMinutes >= 120 ? `${(topic.estimatedMinutes / 60).toFixed(1)}h` : `${topic.estimatedMinutes} min`}
                    </span>
                    {failureDone && (
                      <span style={{
                        fontSize: 10, padding: '1px 8px', borderRadius: 20,
                        background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)',
                        border: '1px solid rgba(239,68,68,0.3)',
                      }}>💥 Failure sim done</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{topic.title}</div>
                  {topic.subtitle && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{topic.subtitle}</div>
                  )}
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: 18 }}>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
