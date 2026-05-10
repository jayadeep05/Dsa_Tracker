import { useState, useEffect, useCallback } from 'react';
import { getSpecialList } from '../api/client';
import QuestionCard from '../components/QuestionCard';

const LISTS = [
  { key: 'revision20', icon: '📋', name: 'Revision-20', desc: 'Do ONLY these 20 in 3–4 hours the day before every interview. No new questions.', color: 'var(--accent-amber)' },
  { key: 'top50', icon: '🏆', name: 'Top-50 Must-Do', desc: 'The absolute must-do questions from patterns 1–13 in study order. Your interview backbone.', color: 'var(--accent-green)' },
  { key: 'oa-prep', icon: '💻', name: 'OA Prep List', desc: 'Questions tagged OA with must/strong importance. Optimised for Flipkart, Razorpay, Cred, Amazon OAs.', color: 'var(--accent-blue)' },
  { key: 'skipped-gems', icon: '💎', name: 'Skipped Gems', desc: 'Questions people skip but shouldn\'t. High interview frequency, low preparation rate.', color: 'var(--accent-purple)' },
];

function ListPanel({ listKey, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const info = LISTS.find(l => l.key === listKey);

  useEffect(() => {
    getSpecialList(listKey).then(r => { setQuestions(r.data); setLoading(false); }).catch(()=>setLoading(false));
  }, [listKey]);

  const handleUpdate = useCallback((updated) => {
    setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));
  }, []);

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="slide-panel">
        <div className="panel-header">
          <div>
            <div style={{fontSize:'20px', fontWeight:'700'}}>{info.icon} {info.name}</div>
            <div style={{fontSize:'12px', color:'var(--text-muted)', marginTop:'4px'}}>{info.desc}</div>
          </div>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        {loading
          ? <div className="loading"><div className="spinner" /> Loading...</div>
          : questions.map(q => <QuestionCard key={q.id} question={q} onUpdate={handleUpdate} />)
        }
        {!loading && questions.length === 0 && <div className="loading">No questions found.</div>}
      </div>
    </>
  );
}

export default function Lists() {
  const [activeList, setActiveList] = useState(null);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    LISTS.forEach(l => {
      getSpecialList(l.key).then(r => setCounts(c => ({...c, [l.key]: r.data.length}))).catch(()=>{});
    });
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Special Lists</h1>
      <div className="lists-grid">
        {LISTS.map(l => (
          <div key={l.key} className="card list-trigger-card" onClick={() => setActiveList(l.key)}>
            <div className="list-trigger-icon">{l.icon}</div>
            <div className="list-trigger-name" style={{color: l.color}}>{l.name}</div>
            <div className="list-trigger-desc">{l.desc}</div>
            <div className="list-trigger-count">{counts[l.key] ? `${counts[l.key]} questions` : 'Loading...'}</div>
          </div>
        ))}
      </div>
      {activeList && <ListPanel listKey={activeList} onClose={() => setActiveList(null)} />}
    </div>
  );
}
