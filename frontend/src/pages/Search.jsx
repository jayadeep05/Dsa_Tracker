import { useState, useEffect, useCallback, useRef } from 'react';
import { searchQuestions, getPatterns } from '../api/client';
import QuestionCard from '../components/QuestionCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patterns, setPatterns] = useState([]);
  const [patternFilter, setPatternFilter] = useState('');
  const [diffFilter, setDiffFilter] = useState('');
  const [impFilter, setImpFilter] = useState('');
  const [sort, setSort] = useState('pattern');
  const debounceRef = useRef(null);

  useEffect(() => { getPatterns().then(r => setPatterns(r.data)).catch(()=>{}); }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch();
    }, 300);
  }, [query, patternFilter, diffFilter, impFilter]);

  const doSearch = async () => {
    setLoading(true);
    try {
      const res = await searchQuestions({ q: query || undefined, pattern: patternFilter || undefined, difficulty: diffFilter || undefined, importance: impFilter || undefined });
      let data = res.data;
      if (sort === 'difficulty') data = [...data].sort((a,b) => 'EMH'.indexOf(a.difficulty) - 'EMH'.indexOf(b.difficulty));
      if (sort === 'importance') data = [...data].sort((a,b) => ['must','strong','optional'].indexOf(a.importance) - ['must','strong','optional'].indexOf(b.importance));
      setResults(data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleUpdate = useCallback((updated) => {
    setResults(prev => prev.map(q => q.id === updated.id ? updated : q));
  }, []);

  useEffect(() => { if (results.length) doSearch(); }, [sort]);

  return (
    <div className="page">
      <h1 className="page-title">Search</h1>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search question names, insights, companies..."
          autoFocus
        />
        {query && <button onClick={() => setQuery('')} style={{background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'16px'}}>✕</button>}
      </div>

      <div className="filter-bar" style={{marginBottom:'20px'}}>
        <select className="filter-btn" value={patternFilter} onChange={e => setPatternFilter(e.target.value)} style={{cursor:'pointer'}}>
          <option value="">All Patterns</option>
          {patterns.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="filter-btn" value={diffFilter} onChange={e => setDiffFilter(e.target.value)}>
          <option value="">All Difficulties</option>
          <option value="E">Easy</option>
          <option value="M">Medium</option>
          <option value="H">Hard</option>
        </select>
        <select className="filter-btn" value={impFilter} onChange={e => setImpFilter(e.target.value)}>
          <option value="">All Importance</option>
          <option value="must">Must-Do</option>
          <option value="strong">Strong</option>
          <option value="optional">Optional</option>
        </select>
        <div className="filter-sep" />
        <span style={{fontSize:'12px', color:'var(--text-muted)'}}>Sort:</span>
        {[['pattern','By Pattern'],['difficulty','By Difficulty'],['importance','By Importance']].map(([v,l]) => (
          <button key={v} className={`filter-btn ${sort===v?'active':''}`} onClick={() => setSort(v)}>{l}</button>
        ))}
        <span style={{marginLeft:'auto', fontSize:'12px', color:'var(--text-muted)'}}>
          {loading ? 'Searching...' : `${results.length} results`}
        </span>
      </div>

      {loading
        ? <div className="loading"><div className="spinner" /> Searching...</div>
        : results.map(q => <QuestionCard key={q.id} question={q} onUpdate={handleUpdate} />)
      }
      {!loading && results.length === 0 && query && (
        <div className="loading">No results for "{query}"</div>
      )}
      {!loading && results.length === 0 && !query && (
        <div className="loading" style={{flexDirection:'column', gap:'8px'}}>
          <span style={{fontSize:'32px'}}>🔍</span>
          <span>Type to search across 248 questions</span>
        </div>
      )}
    </div>
  );
}
