import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHECKPOINT_ITEMS } from '../data/backendRoadmapData';
import { getCheckpointResults, submitCheckpoint } from '../api/backendClient';

export default function BackendCheckpoint() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const [checks, setChecks] = useState({});
  const [pastResults, setPastResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const items = CHECKPOINT_ITEMS[phaseId];

  useEffect(() => {
    getCheckpointResults(phaseId)
      .then(r => setPastResults(r.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [phaseId]);

  if (!items) return <div className="page"><h1>Checkpoint not found</h1></div>;

  const allItems = items.flatMap((cat, ci) => cat.items.map((item, ii) => ({ key: `${ci}-${ii}`, item, category: cat.category })));
  const totalItems = allItems.length;
  const checkedCount = Object.values(checks).filter(Boolean).length;
  const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const handleSubmit = async () => {
    try {
      await submitCheckpoint(phaseId, {
        score: checkedCount,
        totalItems,
        responses: JSON.stringify(checks),
      });
      setSubmitted(true);
    } catch (e) { console.error('Submit failed', e); }
  };

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <button onClick={() => navigate('/backend/roadmap')}
        style={{ background: 'none', border: 'none', color: 'var(--accent-green)', fontSize: 13, cursor: 'pointer', marginBottom: 16, padding: 0, fontWeight: 500 }}>
        ← Back to Roadmap
      </button>

      <h1 className="page-title">🏁 Phase 1 Final Checkpoint</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
        Answer each from memory, no notes. Check off items you can confidently answer.
      </p>

      {/* Score bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: pct === 100 ? 'var(--accent-green)' : pct >= 70 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>
            {checkedCount}/{totalItems}
          </div>
          <div style={{ flex: 1 }}>
            <div className="progress-track" style={{ height: 8, marginBottom: 4 }}>
              <div className={`progress-fill ${pct === 100 ? 'green' : pct >= 70 ? 'amber' : 'red'}`} style={{ width: `${pct}%` }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {pct === 100 ? '🎉 Ready for Phase 2!' : pct >= 70 ? 'Almost there — review weak areas' : 'Keep studying — not ready yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoint categories */}
      {items.map((cat, ci) => (
        <div key={ci} className="card" style={{ padding: '16px 20px', marginBottom: 12 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'var(--accent-blue)', marginBottom: 12,
          }}>
            {cat.category}
          </div>
          {cat.items.map((item, ii) => {
            const key = `${ci}-${ii}`;
            return (
              <label key={key} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '8px 0', cursor: 'pointer', borderBottom: ii < cat.items.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <input type="checkbox" checked={!!checks[key]} onChange={e => setChecks(prev => ({ ...prev, [key]: e.target.checked }))}
                  style={{ marginTop: 2, accentColor: 'var(--accent-green)', width: 16, height: 16, flexShrink: 0 }} />
                <span style={{
                  fontSize: 13, color: checks[key] ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: checks[key] ? 'line-through' : 'none', lineHeight: 1.5,
                  transition: 'all 0.15s',
                }}>{item}</span>
              </label>
            );
          })}
        </div>
      ))}

      {/* Submit */}
      <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 32 }}>
        {submitted ? (
          <div style={{
            padding: '16px 32px', borderRadius: 12,
            background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)',
            color: 'var(--accent-green)', fontSize: 14, fontWeight: 600,
          }}>
            ✅ Checkpoint submitted — Score: {checkedCount}/{totalItems}
          </div>
        ) : (
          <button onClick={handleSubmit}
            style={{
              padding: '12px 32px', borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent-green), #00a880)',
              border: 'none', color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
            Submit Checkpoint ({checkedCount}/{totalItems})
          </button>
        )}
      </div>

      {/* Past results */}
      {pastResults.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>
            Past Attempts
          </div>
          {pastResults.map((r, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 16px', background: 'var(--bg-surface)',
              border: '1px solid var(--border)', borderRadius: 8, marginBottom: 6,
            }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{r.score}/{r.totalItems}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {new Date(r.attemptedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
