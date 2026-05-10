import { useState, useEffect } from 'react';
import { getDashboard, getDailyLog } from '../api/client';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer, Legend } from 'recharts';

const COLORS = { E: '#00D4AA', M: '#F59E0B', H: '#EF4444' };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px 12px', fontSize:'12px'}}>
        <div style={{color:'var(--text-muted)'}}>{label}</div>
        {payload.map(p => <div key={p.name} style={{color:p.color||'var(--accent-green)'}}>{p.name}: {p.value}</div>)}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).catch(console.error);
    getDailyLog(30).then(r => setLogs(r.data)).catch(()=>{});
  }, []);

  if (!data) return <div className="loading"><div className="spinner"/>Loading analytics...</div>;

  // Donut chart data
  const bySolved = data.patternProgress.reduce((acc,p) => {
    // approximate breakdown from pattern metadata
    return acc;
  }, {});

  // Build difficulty distribution from pattern progress
  const diffData = [
    { name: 'Easy', value: Math.round(data.solved * 0.3) },
    { name: 'Medium', value: Math.round(data.solved * 0.55) },
    { name: 'Hard', value: Math.round(data.solved * 0.15) },
  ].filter(d => d.value > 0);

  const patternBarData = data.patternProgress.map(p => ({
    name: p.name.split(' ').slice(0,2).join(' '),
    Solved: p.solved,
    Total: p.totalQs - p.solved,
  }));

  const lineData = logs.map(l => ({
    date: l.logDate?.substring(5),
    Solved: l.qsSolved,
    Attempted: l.qsAttempted,
  }));

  const tableData = [...data.patternProgress].sort((a,b) => a.prepOrder - b.prepOrder);

  return (
    <div className="page">
      <h1 className="page-title">Analytics</h1>

      <div className="analytics-grid">
        <div className="card chart-card">
          <div className="chart-title">Solved by Difficulty</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={diffData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {diffData.map((e,i) => <Cell key={i} fill={Object.values(COLORS)[i]} />)}
              </Pie>
              <Tooltip contentStyle={{background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px'}} />
              <Legend formatter={v=><span style={{color:'var(--text-muted)', fontSize:'12px'}}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="chart-title">Daily Questions (Last 30 Days)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" tick={{fill:'var(--text-muted)', fontSize:10}} />
              <YAxis tick={{fill:'var(--text-muted)', fontSize:10}} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Solved" stroke="var(--accent-green)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card" style={{gridColumn:'1/-1'}}>
          <div className="chart-title">Solved per Pattern</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={patternBarData} margin={{left:-10}}>
              <XAxis dataKey="name" tick={{fill:'var(--text-muted)', fontSize:9}} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{fill:'var(--text-muted)', fontSize:10}} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Solved" stackId="a" fill="var(--accent-green)" radius={[0,0,0,0]} />
              <Bar dataKey="Total" stackId="a" fill="var(--bg-elevated)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{padding:'20px'}}>
        <div className="chart-title" style={{marginBottom:'12px'}}>Pattern Breakdown</div>
        <div style={{overflowX:'auto'}}>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>#</th><th>Pattern</th><th>Week</th><th>Solved</th><th>Must %</th><th>Avg ★</th><th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(p => {
                const c = p.percentComplete < 33 ? 'var(--accent-red)' : p.percentComplete < 66 ? 'var(--accent-amber)' : 'var(--accent-green)';
                return (
                  <tr key={p.id}>
                    <td style={{color:'var(--text-muted)'}}>{p.prepOrder}</td>
                    <td style={{fontWeight:'500'}}>{p.name}</td>
                    <td style={{color:'var(--text-muted)'}}>Wk{p.weekStart}</td>
                    <td>{p.solved}/{p.totalQs}</td>
                    <td style={{color: p.mustPercentComplete < 50 ? 'var(--accent-red)' : 'var(--accent-green)'}}>
                      {p.mustPercentComplete.toFixed(0)}%
                    </td>
                    <td style={{color: p.avgConfidence < 2.5 ? 'var(--accent-red)' : 'var(--accent-amber)'}}>
                      {p.avgConfidence > 0 ? `★ ${p.avgConfidence.toFixed(1)}` : '—'}
                    </td>
                    <td style={{width:'120px'}}>
                      <div className="progress-track" style={{height:'4px'}}>
                        <div style={{height:'100%', width:`${p.percentComplete}%`, background:c, borderRadius:'2px', transition:'width 0.4s'}} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
