import { useState, useEffect } from 'react';

/* =========================================================================
   1. RequestFlowWidget (step-by-step request flow)
   ========================================================================= */
function RequestFlowWidget() {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const steps = [
        {
            title: "1. DNS Resolution",
            desc: "The browser looks up the domain name (e.g. example.com) via DNS servers to retrieve the IP address of the server.",
            activeNodes: ["Browser", "DNS"],
            activePath: "browser-to-dns"
        },
        {
            title: "2. Send HTTP Request",
            desc: "The browser initiates a TCP connection and sends an HTTP request to the web server's IP address.",
            activeNodes: ["Browser", "Web Server"],
            activePath: "browser-to-web"
        },
        {
            title: "3. Query Database",
            desc: "The web server processes the request, realizes it needs user profile data, and queries the relational database.",
            activeNodes: ["Web Server", "Database"],
            activePath: "web-to-db"
        },
        {
            title: "4. Return Database Result",
            desc: "The database executes the query and returns the record (e.g., a SQL row) back to the web server.",
            activeNodes: ["Database", "Web Server"],
            activePath: "db-to-web"
        },
        {
            title: "5. Return HTTP Response",
            desc: "The web server compiles the HTML/JSON page and sends the HTTP response back to the client's browser.",
            activeNodes: ["Web Server", "Browser"],
            activePath: "web-to-browser"
        }
    ];

    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setInterval(() => {
                setStep(s => (s + 1) % steps.length);
            }, 3000);
        }
        return () => clearInterval(timer);
    }, [isPlaying, steps.length]);

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🌐 Step-by-Step Request Flow Simulator</div>
            
            {/* Diagram Area */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: 180, margin: '20px 0', position: 'relative' }}>
                {/* Browser Node */}
                <div style={getNodeStyle("Browser", steps[step].activeNodes)}>
                    <div style={{ fontSize: 24 }}>💻</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Client Browser</div>
                </div>

                {/* DNS Node */}
                <div style={getNodeStyle("DNS", steps[step].activeNodes)}>
                    <div style={{ fontSize: 24 }}>📖</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>DNS Server</div>
                </div>

                {/* Web Server Node */}
                <div style={getNodeStyle("Web Server", steps[step].activeNodes)}>
                    <div style={{ fontSize: 24 }}>⚙️</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Web Server</div>
                </div>

                {/* Database Node */}
                <div style={getNodeStyle("Database", steps[step].activeNodes)}>
                    <div style={{ fontSize: 24 }}>🗄️</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Database</div>
                </div>

                {/* Visual Connection Indicators */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', top: 0, left: 0 }}>
                    {/* Active flow lines can be represented by SVG overlay */}
                    <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                        {/* Browser to DNS */}
                        <line x1="15%" y1="50%" x2="40%" y2="50%" stroke={steps[step].activePath.includes('dns') ? '#00d4aa' : '#334155'} strokeWidth="3" strokeDasharray={steps[step].activePath.includes('dns') ? "6 4" : "none"} />
                        {/* Browser to Web Server */}
                        <path d="M 15% 55% Q 30% 85% 65% 55%" fill="none" stroke={steps[step].activePath === 'browser-to-web' || steps[step].activePath === 'web-to-browser' ? '#00d4aa' : '#334155'} strokeWidth="3" strokeDasharray={steps[step].activePath === 'browser-to-web' || steps[step].activePath === 'web-to-browser' ? "6 4" : "none"} />
                        {/* Web Server to DB */}
                        <line x1="65%" y1="50%" x2="90%" y2="50%" stroke={steps[step].activePath.includes('db') ? '#00d4aa' : '#334155'} strokeWidth="3" strokeDasharray={steps[step].activePath.includes('db') ? "6 4" : "none"} />
                    </svg>
                </div>
            </div>

            {/* Explanation Card */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#00d4aa', marginBottom: 6 }}>{steps[step].title}</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-gray)', lineHeight: 1.5, margin: 0 }}>{steps[step].desc}</p>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button style={btnStyle} onClick={() => { setIsPlaying(false); setStep(s => (s - 1 + steps.length) % steps.length); }}>◀ Back</button>
                <button style={{ ...btnStyle, background: isPlaying ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,170,0.15)', color: isPlaying ? '#ef4444' : '#00d4aa' }} onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? '⏸ Pause' : '▶ Auto Play'}
                </button>
                <button style={btnStyle} onClick={() => { setIsPlaying(false); setStep(s => (s + 1) % steps.length); }}>Next ▶</button>
            </div>
        </div>
    );
}

function getNodeStyle(nodeName, activeNodes) {
    const isActive = activeNodes.includes(nodeName);
    return {
        width: 100,
        height: 100,
        borderRadius: 20,
        background: isActive ? 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,212,170,0.05))' : 'var(--bg-surface)',
        border: `2px solid ${isActive ? '#00d4aa' : 'var(--border)'}`,
        boxShadow: isActive ? '0 0 24px rgba(0,212,170,0.2)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.3s ease',
        zIndex: 2,
        color: isActive ? '#00d4aa' : 'var(--text-primary)'
    };
}


/* =========================================================================
   2. RelationalNoSqlWidget (cards/table comparison)
   ========================================================================= */
function RelationalNoSqlWidget() {
    const [tab, setTab] = useState('sql');
    const [flippedCard, setFlippedCard] = useState(null);

    const cards = {
        sql: [
            { id: 1, title: "Structure & Schema", front: "Structured columns, predetermined tables.", back: "Strict schemas avoid invalid data. Uses SQL dialect for relational mapping." },
            { id: 2, title: "Transactions & ACID", front: "Strong consistency, all-or-nothing queries.", back: "Ensures banking transfers or payments don't disappear in flight. Essential for financial ledgers." },
            { id: 3, title: "Relationships (JOINs)", front: "Easy queries spanning multiple normalized tables.", back: "Foreign keys link users to orders, to items. Normalized structure eliminates duplicates but gets slower at extreme scale." }
        ],
        nosql: [
            { id: 4, title: "Key-Value Stores", front: "Superfast dictionary lookups (Redis, DynamoDB).", back: "Sub-millisecond latency. Ideal for session caches, leaderboards, and rate limiters." },
            { id: 5, title: "Document Stores", front: "JSON structures (MongoDB). Flexible schemas.", back: "Store entire profiles in a single nested document. Trivial scaling and schema additions." },
            { id: 6, title: "Column-Family (Cassandra)", front: "High-performance writes across wide rows.", back: "Massive write loads (chat history, sensor logs, telemetry). Eventual consistency model." }
        ]
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>📊 Relational vs NoSQL Interactive Cards</div>
            
            {/* Tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
                <button style={{ ...tabStyle, background: tab === 'sql' ? 'var(--bg-surface)' : 'transparent', color: tab === 'sql' ? '#00d4aa' : 'var(--text-muted)' }} onClick={() => { setTab('sql'); setFlippedCard(null); }}>
                    Relational (SQL)
                </button>
                <button style={{ ...tabStyle, background: tab === 'nosql' ? 'var(--bg-surface)' : 'transparent', color: tab === 'nosql' ? '#a78bfa' : 'var(--text-muted)' }} onClick={() => { setTab('nosql'); setFlippedCard(null); }}>
                    NoSQL (Non-Relational)
                </button>
            </div>

            {/* Grid of Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {cards[tab].map(c => {
                    const isFlipped = flippedCard === c.id;
                    return (
                        <div key={c.id} onClick={() => setFlippedCard(isFlipped ? null : c.id)}
                            style={{
                                height: 160,
                                position: 'relative',
                                cursor: 'pointer',
                                perspective: 1000
                            }}
                        >
                            {/* Card Inner Container with 3D Flip Effect */}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                borderRadius: 16,
                                border: `1px solid ${tab === 'sql' ? 'rgba(0,212,170,0.25)' : 'rgba(139,92,246,0.25)'}`
                            }}>
                                {/* Front Face */}
                                <div style={{
                                    ...cardFaceStyle,
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)'
                                }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: tab === 'sql' ? '#00d4aa' : '#a78bfa', marginBottom: 8 }}>{c.title}</div>
                                    <div style={{ fontSize: 13.5, lineHeight: 1.5, textAlign: 'center', padding: '0 8px' }}>{c.front}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 12 }}>👉 Click to flip</div>
                                </div>

                                {/* Back Face */}
                                <div style={{
                                    ...cardFaceStyle,
                                    background: tab === 'sql' ? 'rgba(0,212,170,0.08)' : 'rgba(139,92,246,0.08)',
                                    transform: 'rotateY(180deg)',
                                    color: 'var(--text-light)'
                                }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: tab === 'sql' ? '#00d4aa' : '#a78bfa' }}>Deep Dive</div>
                                    <div style={{ fontSize: 13, lineHeight: 1.4, textAlign: 'center', padding: '0 8px' }}>{c.back}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const tabStyle = {
    flex: 1,
    padding: '10px 0',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 12.5,
    fontWeight: 700,
    transition: 'all 0.2s'
};

const cardFaceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    padding: 16
};


/* =========================================================================
   3. CacheHitMissWidget (animated cache hit/miss simulation)
   ========================================================================= */
function CacheHitMissWidget() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ hits: 0, total: 0 });
    const [animState, setAnimState] = useState('idle'); // idle, hit-flow, miss-flow
    const [speed, setSpeed] = useState(1);

    const triggerSimulation = (type) => {
        if (animState !== 'idle') return;
        
        setAnimState(type === 'hit' ? 'hit-flow' : 'miss-flow');
        
        const delay = 2000 / speed;

        setTimeout(() => {
            const isHit = type === 'hit';
            const latency = isHit ? '0.1 ms (RAM)' : '15.0 ms (Disk seek)';
            
            setStats(s => ({
                hits: s.hits + (isHit ? 1 : 0),
                total: s.total + 1
            }));

            setLogs(prev => [
                {
                    id: Date.now(),
                    type: isHit ? 'HIT' : 'MISS',
                    latency,
                    msg: isHit 
                        ? `✓ Requested key found in Redis cache. Returned instantly.` 
                        : `✗ Key not in Cache. Queried MySQL on disk, updated Cache, and returned.`
                },
                ...prev.slice(0, 4)
            ]);

            setAnimState('idle');
        }, delay);
    };

    const hitRate = stats.total > 0 ? Math.round((stats.hits / stats.total) * 100) : 0;

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>⚡ Cache Hit / Miss Simulation</div>

            {/* Dashboard stats */}
            <div style={{ display: 'flex', justifyItems: 'center', gap: 20, marginBottom: 20 }}>
                <div style={statBoxStyle}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#00d4aa' }}>{hitRate}%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cache Hit Rate</div>
                </div>
                <div style={statBoxStyle}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-light)' }}>{stats.hits} / {stats.total}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Hits / Total requests</div>
                </div>
            </div>

            {/* Animation Visualizer Box */}
            <div style={{ background: '#090d16', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 16px', minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 2 }}>
                    
                    {/* Client */}
                    <div style={nodeStyle}>
                        <div style={{ fontSize: 22 }}>💻</div>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>Client</div>
                    </div>

                    {/* Cache */}
                    <div style={{
                        ...nodeStyle,
                        borderColor: animState.includes('hit') ? '#00d4aa' : '#3b82f6',
                        background: animState.includes('hit') ? 'rgba(0,212,170,0.1)' : 'rgba(59,130,246,0.05)'
                    }}>
                        <div style={{ fontSize: 22 }}>⚡</div>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>Redis (Cache)</div>
                        <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>RAM: 0.1ms</div>
                    </div>

                    {/* DB */}
                    <div style={{
                        ...nodeStyle,
                        borderColor: animState === 'miss-flow' ? '#f59e0b' : 'var(--border)',
                        background: animState === 'miss-flow' ? 'rgba(245,158,11,0.1)' : 'transparent'
                    }}>
                        <div style={{ fontSize: 22 }}>🗄️</div>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>MySQL (DB)</div>
                        <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>SSD: 15ms</div>
                    </div>

                </div>

                {/* Animated traveling dots */}
                {animState === 'hit-flow' && (
                    <div style={{
                        position: 'absolute',
                        width: 14, height: 14, borderRadius: '50%', background: '#00d4aa',
                        left: '25%', top: '50%', transform: 'translateY(-50%)',
                        animation: `moveRightLeft ${2 / speed}s infinite linear`
                    }} />
                )}

                {animState === 'miss-flow' && (
                    <>
                        {/* Dot moving from Client to Cache */}
                        <div style={{
                            position: 'absolute',
                            width: 14, height: 14, borderRadius: '50%', background: '#f59e0b',
                            left: '25%', top: '50%', transform: 'translateY(-50%)',
                            animation: `moveClientToCache ${2 / speed}s infinite linear`
                        }} />
                    </>
                )}

                {/* Inline CSS animation styles */}
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes moveRightLeft {
                        0% { left: 20%; background: #00d4aa; }
                        50% { left: 50%; background: #00d4aa; }
                        100% { left: 20%; background: #28c840; }
                    }
                    @keyframes moveClientToCache {
                        0% { left: 20%; background: #3b82f6; }
                        30% { left: 50%; background: #ef4444; } /* Cache Miss warning color */
                        60% { left: 80%; background: #f59e0b; } /* Fetch from DB */
                        80% { left: 50%; background: #00d4aa; } /* Cache update */
                        100% { left: 20%; background: #00d4aa; }
                    }
                `}} />
            </div>

            {/* Trigger buttons */}
            <div style={{ display: 'flex', gap: 12, margin: '16px 0 16px', justifyContent: 'center' }}>
                <button style={{ ...btnStyle, background: 'rgba(0,212,170,0.15)', color: '#00d4aa' }} onClick={() => triggerSimulation('hit')} disabled={animState !== 'idle'}>
                    Simulate Cache Hit
                </button>
                <button style={{ ...btnStyle, background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }} onClick={() => triggerSimulation('miss')} disabled={animState !== 'idle'}>
                    Simulate Cache Miss
                </button>
            </div>

            {/* Adjust speed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Simulation Speed:</span>
                <input type="range" min="0.5" max="3" step="0.5" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#00d4aa' }} />
                <span style={{ fontSize: 12, color: 'var(--text-light)', minWidth: 30 }}>{speed}x</span>
            </div>

            {/* Live Logs */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Flow log history:</div>
                {logs.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>No events yet. Click one of the buttons above to query data.</div>
                ) : (
                    logs.map(log => (
                        <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                            <span style={{ color: log.type === 'HIT' ? '#00d4aa' : '#f59e0b', fontWeight: 800, marginRight: 8 }}>{log.type}</span>
                            <span style={{ color: 'var(--text-gray)', flex: 1 }}>{log.msg}</span>
                            <span style={{ color: 'var(--text-dim)', fontFamily: 'monospace' }}>{log.latency}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const nodeStyle = {
    width: 110,
    height: 70,
    borderRadius: 12,
    border: '1px solid var(--border)',
    background: 'var(--bg-surface)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s'
};

const statBoxStyle = {
    flex: 1,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 16,
    textAlign: 'center'
};


/* =========================================================================
   4. CdnGeoMapWidget (interactive geo-map simulation)
   ========================================================================= */
function CdnGeoMapWidget() {
    const [useCdn, setUseCdn] = useState(true);
    const [activeRequest, setActiveRequest] = useState(null); // null, 'UK', 'JP', 'AU'
    const [latencyLogs, setLatencyLogs] = useState([]);

    const runRequest = (region) => {
        if (activeRequest) return;
        setActiveRequest(region);

        // Latency details
        const details = {
            UK: { cdn: 15, origin: 110, cdnNode: "London Edge" },
            JP: { cdn: 28, origin: 180, cdnNode: "Tokyo Edge" },
            AU: { cdn: 35, origin: 240, cdnNode: "Sydney Edge" }
        };

        const target = details[region];
        const delay = useCdn ? 600 : 1800; // Visual delay representing server search time

        setTimeout(() => {
            const time = useCdn ? target.cdn : target.origin;
            setLatencyLogs(prev => [
                {
                    id: Date.now(),
                    region,
                    path: useCdn ? `${region} → CDN ${target.cdnNode}` : `${region} → US Origin Server`,
                    latency: `${time} ms`,
                    saved: useCdn ? `${target.origin - target.cdn} ms saved` : "Bypassed cache"
                },
                ...prev.slice(0, 3)
            ]);
            setActiveRequest(null);
        }, delay);
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🌍 Global CDN Cache Simulator</div>
            
            {/* Toggle CDN state */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 13.5, color: 'var(--text-light)', fontWeight: 600 }}>Enable CDN caching system:</span>
                <button onClick={() => setUseCdn(!useCdn)} style={{
                    ...btnStyle,
                    background: useCdn ? 'rgba(0,212,170,0.15)' : 'rgba(239,68,68,0.15)',
                    color: useCdn ? '#00d4aa' : '#ef4444',
                    border: 'none',
                    fontWeight: 800
                }}>
                    {useCdn ? 'CDN Status: ACTIVE' : 'CDN Status: DISABLED'}
                </button>
            </div>

            {/* World Network Layout */}
            <div style={{ background: '#0a0e1a', borderRadius: 20, border: '1px solid var(--border)', height: 200, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 20 }}>
                
                {/* US Origin */}
                <div style={{ position: 'absolute', left: '10%', top: '40%', textAlign: 'center' }}>
                    <div style={{ fontSize: 24 }}>🏢</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444' }}>US Origin Server</div>
                </div>

                {/* Region Client Rows */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginLeft: '30%', zIndex: 2 }}>
                    
                    {/* UK Client */}
                    <div style={clientNodeStyle(activeRequest === 'UK')}>
                        <div style={{ fontSize: 20 }}>🇬🇧</div>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>London Client</div>
                        {useCdn && <div style={cdnTagStyle}>London Edge Cache</div>}
                        <button style={requestBtnStyle} onClick={() => runRequest('UK')} disabled={!!activeRequest}>Request</button>
                    </div>

                    {/* Japan Client */}
                    <div style={clientNodeStyle(activeRequest === 'JP')}>
                        <div style={{ fontSize: 20 }}>🇯🇵</div>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>Tokyo Client</div>
                        {useCdn && <div style={cdnTagStyle}>Tokyo Edge Cache</div>}
                        <button style={requestBtnStyle} onClick={() => runRequest('JP')} disabled={!!activeRequest}>Request</button>
                    </div>

                    {/* Australia Client */}
                    <div style={clientNodeStyle(activeRequest === 'AU')}>
                        <div style={{ fontSize: 20 }}>🇦🇺</div>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>Sydney Client</div>
                        {useCdn && <div style={cdnTagStyle}>Sydney Edge Cache</div>}
                        <button style={requestBtnStyle} onClick={() => runRequest('AU')} disabled={!!activeRequest}>Request</button>
                    </div>

                </div>

                {/* SVG Visualizing Connection path */}
                {activeRequest && (
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                        <path 
                            d={activeRequest === 'UK' 
                                ? (useCdn ? "M 48% 50% Q 40% 40% 48% 50%" : "M 48% 50% C 30% 60% 20% 60% 15% 50%")
                                : activeRequest === 'JP'
                                ? (useCdn ? "M 68% 50% Q 65% 40% 68% 50%" : "M 68% 50% C 45% 65% 25% 65% 15% 50%")
                                : (useCdn ? "M 88% 50% Q 85% 40% 88% 50%" : "M 88% 50% C 55% 70% 30% 70% 15% 50%")
                            } 
                            fill="none" 
                            stroke="#00d4aa" 
                            strokeWidth="3" 
                            strokeDasharray="6 4"
                            style={{ animation: 'dash 1.5s infinite linear' }}
                        />
                    </svg>
                )}
            </div>

            {/* Latency Log output */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: 14, marginTop: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Network Latency Log:</div>
                {latencyLogs.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>No request data yet. Click a request button above.</div>
                ) : (
                    latencyLogs.map(log => (
                        <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                            <span style={{ color: '#00d4aa', fontWeight: 800 }}>{log.region}</span>
                            <span style={{ color: 'var(--text-gray)', flex: 1, marginLeft: 12 }}>{log.path}</span>
                            <span style={{ color: log.saved.includes('saved') ? '#28c840' : 'var(--text-dim)', marginRight: 12 }}>({log.saved})</span>
                            <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 700 }}>{log.latency}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const clientNodeStyle = (active) => ({
    width: 105,
    height: 125,
    borderRadius: 14,
    border: `1.5px solid ${active ? '#00d4aa' : 'var(--border)'}`,
    background: 'var(--bg-surface)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 4px',
    boxShadow: active ? '0 0 16px rgba(0,212,170,0.15)' : 'none',
    transition: 'all 0.3s'
});

const cdnTagStyle = {
    fontSize: 8.5,
    background: 'rgba(139,92,246,0.15)',
    color: '#a78bfa',
    border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: 4,
    padding: '2px 4px',
    fontWeight: 700,
    marginTop: 4,
    textAlign: 'center'
};

const requestBtnStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text-light)',
    fontSize: 9.5,
    fontWeight: 700,
    borderRadius: 6,
    padding: '4px 10px',
    cursor: 'pointer',
    width: '90%',
    transition: 'all 0.15s'
};


/* =========================================================================
   5. StatefulStatelessWidget (active interactive architecture diagram)
   ========================================================================= */
function StatefulStatelessWidget() {
    const [architecture, setArchitecture] = useState('stateful'); // stateful, stateless
    const [requestCount, setRequestCount] = useState(0);
    const [activeTarget, setActiveTarget] = useState(null); // 'server1' or 'server2'
    const [warning, setWarning] = useState('');
    const [sessions, setSessions] = useState({ server1: [], server2: [], redis: [] });
    const [scaleFactor] = useState(2); // 2 or 3 servers

    const sendRequest = (user) => {
        if (activeTarget) return;

        // Load balance request
        const nextServer = requestCount % scaleFactor === 0 ? 'server1' : 'server2';
        setActiveTarget(nextServer);
        setRequestCount(c => c + 1);

        setTimeout(() => {
            if (architecture === 'stateful') {
                // Stateful: Server needs user session in its local memory
                const hasSessionOnServer = sessions[nextServer].includes(user);
                
                if (hasSessionOnServer) {
                    setWarning(`✓ User ${user} request succeeded on ${nextServer === 'server1' ? 'Server 1' : 'Server 2'} (Session present in Local Memory)`);
                } else {
                    // Check if they have a session on any other server
                    const hasSessionAnywhere = Object.values(sessions).some(s => s.includes(user));
                    if (hasSessionAnywhere) {
                        setWarning(`❌ User ${user} request FAILED (401 Unauthorized) on ${nextServer === 'server1' ? 'Server 1' : 'Server 2'}! Session only exists in the other server's local memory. (Sticky session failure)`);
                    } else {
                        // Create new session locally
                        setSessions(prev => ({
                            ...prev,
                            [nextServer]: [...prev[nextServer], user]
                        }));
                        setWarning(`✓ New session created for User ${user} locally on ${nextServer === 'server1' ? 'Server 1' : 'Server 2'}.`);
                    }
                }
            } else {
                // Stateless: Session query goes to Redis
                const hasSessionInRedis = sessions.redis.includes(user);
                if (hasSessionInRedis) {
                    setWarning(`✓ User ${user} request succeeded on ${nextServer === 'server1' ? 'Server 1' : 'Server 2'}. Retrieved session from shared Redis store.`);
                } else {
                    // Create in Redis
                    setSessions(prev => ({
                        ...prev,
                        redis: [...prev.redis, user]
                    }));
                    setWarning(`✓ New session created for User ${user} in shared Redis cache store.`);
                }
            }
            setActiveTarget(null);
        }, 800);
    };

    const clearSessions = () => {
        setSessions({ server1: [], server2: [], redis: [] });
        setWarning('Cleared all user sessions.');
        setRequestCount(0);
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>⚙️ Stateful vs Stateless Architecture Simulation</div>

            {/* Architecture Selector */}
            <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
                <button style={{ ...tabStyle, background: architecture === 'stateful' ? 'var(--bg-surface)' : 'transparent', color: architecture === 'stateful' ? '#ef4444' : 'var(--text-muted)' }} onClick={() => { setArchitecture('stateful'); clearSessions(); }}>
                    Stateful Web Tier
                </button>
                <button style={{ ...tabStyle, background: architecture === 'stateless' ? 'var(--bg-surface)' : 'transparent', color: architecture === 'stateless' ? '#00d4aa' : 'var(--text-muted)' }} onClick={() => { setArchitecture('stateless'); clearSessions(); }}>
                    Stateless Web Tier (Shared Redis)
                </button>
            </div>

            {/* Interaction Buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, justifyContent: 'center' }}>
                <button style={{ ...btnStyle, background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }} onClick={() => sendRequest('Alice')}>
                    Send Request (Alice)
                </button>
                <button style={{ ...btnStyle, background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }} onClick={() => sendRequest('Bob')}>
                    Send Request (Bob)
                </button>
                <button style={{ ...btnStyle, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }} onClick={clearSessions}>
                    Clear Sessions
                </button>
            </div>

            {/* Status Warning Card */}
            {warning && (
                <div style={{
                    background: warning.includes('FAILED') ? 'rgba(239,68,68,0.1)' : 'rgba(0,212,170,0.08)',
                    border: `1.5px solid ${warning.includes('FAILED') ? '#ef4444' : '#00d4aa'}`,
                    borderRadius: 12, padding: 14, marginBottom: 20, fontSize: 13, color: 'var(--text-light)', lineHeight: 1.5
                }}>
                    {warning}
                </div>
            )}

            {/* Diagram */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, background: '#0a0e1a', padding: 20, borderRadius: 20, border: '1px solid var(--border)' }}>
                {/* Users / Clients Row */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 60 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20 }}>👩 Alice</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20 }}>👨 Bob</div>
                    </div>
                </div>

                {/* Load Balancer */}
                <div style={{ border: '1px solid var(--border)', background: 'var(--bg-elevated)', borderRadius: 10, padding: 8, alignSelf: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    🔀 Load Balancer (Round Robin)
                </div>

                {/* Server Tier */}
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: 20 }}>
                    
                    {/* Server 1 */}
                    <div style={serverCardStyle(activeTarget === 'server1')}>
                        <div style={{ fontSize: 22 }}>🖥️</div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>App Server 1</div>
                        {architecture === 'stateful' && (
                            <div style={{ marginTop: 8, width: '100%' }}>
                                <div style={{ fontSize: 8.5, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800 }}>Local Session Store:</div>
                                <div style={{ fontSize: 11, background: '#0d1117', padding: '4px 6px', borderRadius: 4, minHeight: 20, color: '#ef4444' }}>
                                    {sessions.server1.join(', ') || 'empty'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Server 2 */}
                    <div style={serverCardStyle(activeTarget === 'server2')}>
                        <div style={{ fontSize: 22 }}>🖥️</div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>App Server 2</div>
                        {architecture === 'stateful' && (
                            <div style={{ marginTop: 8, width: '100%' }}>
                                <div style={{ fontSize: 8.5, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800 }}>Local Session Store:</div>
                                <div style={{ fontSize: 11, background: '#0d1117', padding: '4px 6px', borderRadius: 4, minHeight: 20, color: '#ef4444' }}>
                                    {sessions.server2.join(', ') || 'empty'}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Redis Session Database (ONLY displayed in Stateless mode) */}
                {architecture === 'stateless' && (
                    <div style={{
                        marginTop: 10,
                        border: '2px dashed #00d4aa',
                        background: 'rgba(0,212,170,0.06)',
                        borderRadius: 16,
                        padding: 14,
                        textAlign: 'center',
                        alignSelf: 'center',
                        width: '70%'
                    }}>
                        <div style={{ fontSize: 22 }}>💾</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa' }}>Shared Redis Cache Store</div>
                        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>Sessions: {sessions.redis.join(', ') || 'none'}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

const serverCardStyle = (active) => ({
    flex: 1,
    background: 'var(--bg-surface)',
    border: `2px solid ${active ? '#00d4aa' : 'var(--border)'}`,
    boxShadow: active ? '0 0 16px rgba(0,212,170,0.2)' : 'none',
    borderRadius: 16,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.25s'
});


/* =========================================================================
   6. GeoDnsFailoverWidget (interactive map-based failover simulator)
   ========================================================================= */
function GeoDnsFailoverWidget() {
    const [usEastStatus, setUsEastStatus] = useState('HEALTHY'); // HEALTHY, DOWN
    const [routingLog, setRoutingLog] = useState([]);
    const [activeTraffic, setActiveTraffic] = useState(false);

    const triggerOutage = () => {
        setUsEastStatus(status => {
            const nextStatus = status === 'HEALTHY' ? 'DOWN' : 'HEALTHY';
            
            setRoutingLog(prev => [
                {
                    id: Date.now(),
                    event: nextStatus === 'DOWN' ? '💥 US-East region OUTAGE detected!' : '💚 US-East region restored.',
                    action: nextStatus === 'DOWN'
                        ? 'GeoDNS updated record TTL. Routing 100% of global user requests to US-West.'
                        : 'GeoDNS back to load-balanced routing: East Coast → US-East, West Coast → US-West.'
                },
                ...prev
            ]);

            return nextStatus;
        });
    };

    // Auto-generate visual traffic pulses
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTraffic(t => !t);
        }, 1200);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🗺️ Multi-Region GeoDNS Failover Simulator</div>

            {/* Outage controller */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 13.5, color: 'var(--text-light)', fontWeight: 600 }}>Region failure trigger:</span>
                <button onClick={triggerOutage} style={{
                    ...btnStyle,
                    background: usEastStatus === 'HEALTHY' ? '#ef4444' : '#28c840',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 800
                }}>
                    {usEastStatus === 'HEALTHY' ? 'Kill Region: US-East' : 'Revive Region: US-East'}
                </button>
            </div>

            {/* Map board */}
            <div style={{ background: '#080c16', border: '1px solid var(--border)', borderRadius: 20, height: 210, position: 'relative', overflow: 'hidden' }}>
                {/* DNS router */}
                <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 3 }}>
                    <div style={{ fontSize: 20 }}>🌍</div>
                    <div style={{ fontSize: 10, fontWeight: 800, background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 6, color: '#00d4aa' }}>GeoDNS Router</div>
                </div>

                {/* Clients (US East Coast & US West Coast) */}
                <div style={{ position: 'absolute', bottom: '15%', left: '15%', textAlign: 'center' }}>
                    <div style={{ fontSize: 18 }}>💻</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>US West Client</div>
                </div>
                <div style={{ position: 'absolute', bottom: '15%', right: '15%', textAlign: 'center' }}>
                    <div style={{ fontSize: 18 }}>💻</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>US East Client</div>
                </div>

                {/* Data Centers */}
                <div style={{ position: 'absolute', top: '45%', left: '20%', textAlign: 'center' }}>
                    <div style={{ fontSize: 26 }}>🏭</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#3b82f6' }}>US-West DC</div>
                    <div style={{ fontSize: 9, color: '#10b981', fontWeight: 700 }}>ACTIVE</div>
                </div>

                <div style={{ position: 'absolute', top: '45%', right: '20%', textAlign: 'center', transition: 'all 0.3s' }}>
                    <div style={{ fontSize: 26, opacity: usEastStatus === 'HEALTHY' ? 1 : 0.4 }}>🏭</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: usEastStatus === 'HEALTHY' ? '#3b82f6' : '#ef4444' }}>US-East DC</div>
                    <div style={{ fontSize: 9, color: usEastStatus === 'HEALTHY' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                        {usEastStatus === 'HEALTHY' ? 'ACTIVE' : 'CRASHED 💥'}
                    </div>
                </div>

                {/* SVG Connections showing failover routing */}
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                    {/* West Client → DNS Router */}
                    <line x1="20%" y1="75%" x2="50%" y2="25%" stroke="#334155" strokeWidth="2" />
                    {/* East Client → DNS Router */}
                    <line x1="80%" y1="75%" x2="50%" y2="25%" stroke="#334155" strokeWidth="2" />

                    {/* Router → West DC */}
                    <line x1="50%" y1="25%" x2="25%" y2="50%" stroke="#00d4aa" strokeWidth="3" strokeDasharray={activeTraffic ? "4 4" : "none"} />

                    {/* Router → East DC */}
                    {usEastStatus === 'HEALTHY' ? (
                        <line x1="50%" y1="25%" x2="75%" y2="50%" stroke="#00d4aa" strokeWidth="3" strokeDasharray={activeTraffic ? "4 4" : "none"} />
                    ) : (
                        <path d="M 50% 25% Q 37.5% 15% 25% 50%" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 3" />
                    )}
                </svg>
            </div>

            {/* Logs */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: 14, marginTop: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Failover Status Log:</div>
                {routingLog.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>System running healthy. Double data centers sharing geographical requests.</div>
                ) : (
                    routingLog.map(log => (
                        <div key={log.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                            <div style={{ color: log.event.includes('OUTAGE') ? '#ef4444' : '#28c840', fontWeight: 800, marginBottom: 2 }}>{log.event}</div>
                            <div style={{ color: 'var(--text-gray)' }}>{log.action}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


/* =========================================================================
   7. MessageQueueWidget (queue pipeline simulator)
   ========================================================================= */
function MessageQueueWidget() {
    const [queue, setQueue] = useState([]);
    const [workerSpeed, setWorkerSpeed] = useState(1);
    const [workerCount, setWorkerCount] = useState(2);
    const [stats, setStats] = useState({ processed: 0 });

    const pushTasks = () => {
        const newTasks = Array.from({ length: 6 }).map((_, i) => ({
            id: Date.now() + i,
            label: `Task-${Math.floor(Math.random() * 900) + 100}`
        }));
        setQueue(q => [...q, ...newTasks]);
    };

    // Consumer worker processing loop
    useEffect(() => {
        if (queue.length === 0) return;

        const intervalDelay = 1500 / (workerCount * workerSpeed);

        const timer = setInterval(() => {
            setQueue(q => {
                if (q.length === 0) return q;
                return q.slice(1);
            });
            setStats(s => ({ processed: s.processed + 1 }));
        }, intervalDelay);

        return () => clearInterval(timer);
    }, [queue, workerCount, workerSpeed]);

    // Backpressure color coding
    const getQueueBg = () => {
        if (queue.length > 12) return 'rgba(239,68,68,0.15)'; // dangerous backlog
        if (queue.length > 6) return 'rgba(245,158,11,0.12)';  // growing queue
        return 'rgba(0,212,170,0.06)';
    };

    const getQueueBorder = () => {
        if (queue.length > 12) return '#ef4444';
        if (queue.length > 6) return '#f59e0b';
        return '#00d4aa';
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>📥 Asynchronous Message Queue Simulator</div>

            {/* Top row actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
                <button style={{ ...btnStyle, background: 'linear-gradient(135deg,#00d4aa,#00a880)', color: '#000', border: 'none', fontWeight: 800 }} onClick={pushTasks}>
                    ⚡ Push 6 API Tasks (Producers)
                </button>
                <div style={{ ...statBoxStyle, padding: '10px 16px', background: 'var(--bg-elevated)', flex: 0, minWidth: 120 }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{stats.processed}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700 }}>TASKS PROCESSED</div>
                </div>
            </div>

            {/* Queue Board */}
            <div style={{
                background: getQueueBg(),
                border: `2px dashed ${getQueueBorder()}`,
                borderRadius: 20,
                minHeight: 80,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                overflowX: 'auto',
                marginBottom: 20,
                transition: 'all 0.3s'
            }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: getQueueBorder(), marginRight: 10 }}>Queue Queue</div>
                {queue.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Queue empty. Web servers idling. Push tasks to execute!</div>
                ) : (
                    queue.map(item => (
                        <div key={item.id} style={{
                            padding: '6px 12px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            color: 'var(--text-light)',
                            whiteSpace: 'nowrap',
                            animation: 'slideIn 0.3s ease'
                        }}>
                            📦 {item.label}
                        </div>
                    ))
                )}
            </div>

            {/* Adjust Consumer Workers sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 120 }}>Worker Threads (Consumers):</span>
                    <input type="range" min="1" max="5" step="1" value={workerCount} onChange={e => setWorkerCount(parseInt(e.target.value, 10))} style={{ flex: 1, accentColor: '#00d4aa' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 700 }}>{workerCount} Workers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 120 }}>Worker Power (Speed):</span>
                    <input type="range" min="0.5" max="3" step="0.5" value={workerSpeed} onChange={e => setWorkerSpeed(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#00d4aa' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 700 }}>{workerSpeed}x QPS</span>
                </div>
            </div>

            {/* Custom slideIn keyframes */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideIn {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}} />
        </div>
    );
}


/* =========================================================================
   8. ScalingTimelineWidget (Horizontal scaling timeline slider)
   ========================================================================= */
function ScalingTimelineWidget() {
    const [stageIndex, setStageIndex] = useState(0);

    const stages = [
        { label: "1 User", scale: "Single Server Setup", desc: "All components (Web, App, Database) live on a single hardware spindle. Simple, but crashes under any concurrent load.", components: ["User", "Single Server"] },
        { label: "Hundreds", scale: "Separating Tiers", desc: "Web server is separated from the database tier. Database queries run on a dedicated machine. Simple MySQL scaling.", components: ["User", "Web Server", "Database"] },
        { label: "Thousands", scale: "Load Balanced Servers", desc: "Added Load Balancer + multiple Web Servers. Traffic is distributed. If Server 1 dies, Server 2 carries the load.", components: ["User", "Load Balancer", "Web Server 1", "Web Server 2", "Database"] },
        { label: "10K", scale: "Database Replication", desc: "Introduced Master-Slave database replication. Master handles writes; slaves handle all read traffic, improving speeds 10x.", components: ["User", "Load Balancer", "Web Server 1", "Web Server 2", "Master DB (Write)", "Slave DB (Read)"] },
        { label: "100K", scale: "Caching & CDN integration", desc: "Static resources (images/video) cached globally on CDN edges. Dynamic rows cached in Redis. Removes 80% database load.", components: ["User", "CDN Edge", "Load Balancer", "Web Server 1", "Web Server 2", "Redis Cache", "Master DB (Write)", "Slave DB (Read)"] },
        { label: "1M", scale: "Stateless Web Architecture", desc: "User sessions migrated out of Web Server memory into shared Redis. Enables auto-scaling groups to shrink and grow dynamically.", components: ["User", "CDN Edge", "Load Balancer", "Web Server 1", "Web Server 2", "Web Server 3 (Auto-scale)", "Redis Cache", "Shared Session Store", "Master DB (Write)", "Slave DB (Read)"] },
        { label: "10M", scale: "Multi-Data Centers", desc: "GeoDNS routes users to closest server. Active-active setup mitigates local infrastructure failures (e.g. cloud outages).", components: ["User", "GeoDNS", "US DC", "EU DC", "CDN Edge"] },
        { label: "100M", scale: "Message Queues", desc: "Async processing buffer added. Decoupled microservices write tasks to message queues (Kafka). Consumer workers digest task backlogs.", components: ["User", "GeoDNS", "US DC", "EU DC", "CDN Edge", "Kafka Queue", "Workers"] },
        { label: "1B+", scale: "Database Sharding", desc: "Data tier split horizontally (sharded) across multiple databases by shard key. Eliminates write ceilings on database master.", components: ["User", "GeoDNS", "US DC", "EU DC", "CDN Edge", "Kafka Queue", "Workers", "Shard 1", "Shard 2", "Shard 3"] }
    ];

    const current = stages[stageIndex];

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🗺️ Capstone: Horizontal Scaling Timeline</div>

            {/* Stage Title */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#00d4aa', letterSpacing: '0.1em' }}>Scale Level: {current.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-light)', marginTop: 4 }}>{current.scale}</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-gray)', lineHeight: 1.5, marginTop: 8 }}>{current.desc}</p>
            </div>

            {/* Architecture Node Visualizer */}
            <div style={{ background: '#0a0d15', border: '1px solid var(--border)', borderRadius: 20, padding: 20, minHeight: 140, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
                {current.components.map(comp => (
                    <div key={comp} style={{
                        padding: '8px 16px',
                        background: 'rgba(0,212,170,0.08)',
                        border: '1.5px solid #00d4aa',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#00d4aa',
                        boxShadow: '0 0 12px rgba(0,212,170,0.15)',
                        animation: 'pulseGlow 1.2s infinite alternate',
                        whiteSpace: 'nowrap'
                    }}>
                        {comp}
                    </div>
                ))}
                
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes pulseGlow {
                        from { box-shadow: 0 0 4px rgba(0,212,170,0.1); }
                        to { box-shadow: 0 0 14px rgba(0,212,170,0.3); border-color: #28c840; }
                    }
                `}} />
            </div>

            {/* Timeline Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input 
                    type="range" 
                    min="0" 
                    max={stages.length - 1} 
                    step="1" 
                    value={stageIndex} 
                    onChange={e => setStageIndex(parseInt(e.target.value, 10))} 
                    style={{ width: '100%', accentColor: '#00d4aa', cursor: 'pointer' }}
                />
                
                {/* Labeled Marks */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', fontWeight: 800 }}>
                    {stages.map((st, i) => (
                        <span 
                            key={st.label} 
                            onClick={() => setStageIndex(i)}
                            style={{ cursor: 'pointer', color: stageIndex === i ? '#00d4aa' : 'var(--text-dim)' }}
                        >
                            {st.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}


/* =========================================================================
   9. LatencyBarChartWidget (Horizontal logarithmic bar chart)
   ========================================================================= */
function LatencyBarChartWidget() {
    const [isLogScale, setIsLogScale] = useState(true);
    const [hovered, setHovered] = useState(null);

    const latencies = [
        { name: "L1 Cache Reference", ns: 0.5, desc: "Fastest possible on-CPU fetch. Metaphor: Grabbing a book on your desk.", color: "#10b981" },
        { name: "Branch Mispredict", ns: 5, desc: "CPU predicted control path wrong; backtracks. Minor sync hit.", color: "#10b981" },
        { name: "L2 Cache Reference", ns: 7, desc: "Slightly farther off-CPU fetch. Metaphor: Grabbing book from shelf.", color: "#10b981" },
        { name: "Mutex Lock/Unlock", ns: 25, desc: "Thread synchronization locking overhead.", color: "#10b981" },
        { name: "Main Memory (RAM)", ns: 100, desc: "Fetch from RAM chips. 200x slower than L1 cache reference.", color: "#3b82f6" },
        { name: "Compress 1KB (Snappy)", ns: 3000, desc: "3µs. Highly recommended before network transport.", color: "#3b82f6" },
        { name: "Read 1MB sequentially from RAM", ns: 250000, desc: "0.25ms. Sequential RAM throughput is extremely fast.", color: "#3b82f6" },
        { name: "Read 4KB randomly from SSD", ns: 150000, desc: "0.15ms. NVMe SSD page fetch.", color: "#f59e0b" },
        { name: "Read 1MB sequentially from SSD", ns: 1000000, desc: "1.0ms. 4x slower than RAM sequence reads.", color: "#f59e0b" },
        { name: "Disk Seek (HDD)", ns: 10000000, desc: "10ms. Mechanical arm movement on platters. High latency.", color: "#ef4444" },
        { name: "Send packet same Datacenter", ns: 500000, desc: "0.5ms. Fiber optic latency within local building.", color: "#ef4444" },
        { name: "Roundtrip USA → Europe", ns: 150000000, desc: "150ms. Speed of light bounds across 9000km undersea fiber.", color: "#ef4444" }
    ];

    // Helper to calculate widths
    const getWidthPct = (ns) => {
        if (isLogScale) {
            // Log base 10 scale map
            const minLog = Math.log10(0.5);
            const maxLog = Math.log10(150000000);
            const logVal = Math.log10(ns);
            return ((logVal - minLog) / (maxLog - minLog)) * 90 + 10;
        } else {
            // Absolute linear map relative to Europe roundtrip
            return (ns / 150000000) * 100;
        }
    };

    const formatTime = (ns) => {
        if (ns < 1000) return `${ns} ns`;
        if (ns < 1000000) return `${(ns / 1000).toFixed(1)} µs`;
        return `${(ns / 1000000).toFixed(1)} ms`;
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>⏱️ Latency Numbers Every Programmer Should Know</div>

            {/* Toggle Scales */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Display bar scale:</span>
                <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    <button style={toggleBtnStyle(!isLogScale)} onClick={() => setIsLogScale(false)}>Linear (Absolute)</button>
                    <button style={toggleBtnStyle(isLogScale)} onClick={() => setIsLogScale(true)}>Logarithmic (Relative)</button>
                </div>
            </div>

            {/* Bar List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {latencies.map((lat, idx) => {
                    const widthPct = getWidthPct(lat.ns);
                    return (
                        <div key={lat.name} 
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            style={{ display: 'flex', flexDirection: 'column', cursor: 'help' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-light)', marginBottom: 4 }}>
                                <span style={{ fontWeight: 600 }}>{lat.name}</span>
                                <span style={{ fontFamily: 'monospace', color: lat.color }}>{formatTime(lat.ns)}</span>
                            </div>
                            
                            {/* Bar container */}
                            <div style={{ height: 16, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden', width: '100%' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${widthPct}%`,
                                    background: lat.color,
                                    borderRadius: 4,
                                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: hovered === idx ? 1 : 0.8
                                }} />
                            </div>

                            {/* Detail hover tooltip */}
                            {hovered === idx && (
                                <div style={{
                                    marginTop: 4, padding: 8, background: 'var(--bg-surface)', border: `1px solid ${lat.color}`,
                                    borderRadius: 6, fontSize: 11.5, color: 'var(--text-gray)', lineHeight: 1.4,
                                    animation: 'fadeIn 0.2s'
                                }}>
                                    {lat.desc}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const toggleBtnStyle = (active) => ({
    padding: '6px 12px',
    fontSize: 10,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    background: active ? '#00d4aa' : 'transparent',
    color: active ? '#000' : 'var(--text-muted)',
    transition: 'all 0.15s'
});


/* =========================================================================
   10. AvailabilityCalculatorWidget (Interactive availability calculator)
   ========================================================================= */
function AvailabilityCalculatorWidget() {
    const [nines, setNines] = useState(99.9);

    const calculateDowntime = (pct) => {
        const factor = (100 - pct) / 100;
        const yearSec = 365 * 24 * 60 * 60;
        const totalSec = yearSec * factor;

        const days = Math.floor(totalSec / (24 * 3600));
        const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = Math.round(totalSec % 60);

        return { days, hours, minutes, seconds };
    };

    const getUptimeLabel = (pct) => {
        if (pct >= 99.999) return "Five Nines (Telecom grade)";
        if (pct >= 99.99) return "Four Nines (High availability)";
        if (pct >= 99.9) return "Three Nines (Cloud platform standard)";
        return "Two Nines (Basic hosting)";
    };

    const getArchitectureRequirements = (pct) => {
        if (pct >= 99.999) {
            return [
                "Multi-region active-active deployments (sub-second failover)",
                "Zero maintenance windows (Fully online schema migrations)",
                "Chaos engineering testing (Simulate data center crashes daily)",
                "SRE teams monitoring 24/7/365 with automated alerting"
            ];
        }
        if (pct >= 99.99) {
            return [
                "Blue-Green or Canary deployment releases",
                "Automated failovers for DB primary database (Heartbeat triggers)",
                "Complete redundancy at all layers (multiple web, cache, queues)",
                "Zero planned downtime windows permitted"
            ];
        }
        if (pct >= 99.9) {
            return [
                "Basic load-balanced web servers",
                "Database replication (Master-Slave configurations)",
                "Manual failovers in case of critical database faults",
                "Slight downtime allowed for database schema migrations"
            ];
        }
        return [
            "Single web server + Single database layout",
            "No high availability structures",
            "Maintenance windows during off-peak hours",
            "Prone to single points of failure (SPOF)"
        ];
    };

    const dt = calculateDowntime(nines);

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🧮 Interactive SLA Availability Calculator</div>

            {/* Input Slider */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Target Uptime percentage:</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#00d4aa' }}>{nines}%</span>
                </div>
                <input 
                    type="range" 
                    min="90" 
                    max="99.999" 
                    step="0.001" 
                    value={nines} 
                    onChange={e => setNines(parseFloat(e.target.value))} 
                    style={{ width: '100%', accentColor: '#00d4aa' }}
                />
            </div>

            {/* Output details */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 16, padding: 18, border: '1px solid var(--border)', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#00d4aa', marginBottom: 4 }}>Tier Grade:</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-light)', marginBottom: 12 }}>{getUptimeLabel(nines)}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800 }}>Downtime per year:</div>
                        <div style={{ fontSize: 13.5, color: '#ef4444', fontWeight: 700, marginTop: 2 }}>
                            {dt.days > 0 ? `${dt.days}d ` : ''}
                            {dt.hours > 0 ? `${dt.hours}h ` : ''}
                            {dt.minutes > 0 ? `${dt.minutes}m ` : ''}
                            {dt.seconds}s
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800 }}>Downtime per month:</div>
                        <div style={{ fontSize: 13.5, color: '#ef4444', fontWeight: 700, marginTop: 2 }}>
                            {Math.round((dt.days * 24 + dt.hours) / 12 * 10) / 10} hours
                        </div>
                    </div>
                </div>
            </div>

            {/* Architecture guidelines */}
            <div>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Architectural Requirements:</div>
                {getArchitectureRequirements(nines).map((req, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--text-gray)' }}>
                        <span style={{ color: '#00d4aa' }}>✔</span>
                        <span>{req}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


/* =========================================================================
   11. TwitterEstimatorWidget (Interactive step-by-step estimator)
   ========================================================================= */
function TwitterEstimatorWidget() {
    const [dau, setDau] = useState(150); // Millions
    const [tweetsPerUser, setTweetsPerUser] = useState(2);
    const [mediaPct, setMediaPct] = useState(10);
    const [mediaSize, setMediaSize] = useState(1.0); // MB
    const [repFactor, setRepFactor] = useState(3);

    // Compute metrics
    const dailyTweets = dau * 1000000 * tweetsPerUser;
    const avgWriteQps = Math.round(dailyTweets / 86400);
    const peakWriteQps = avgWriteQps * 2;

    const dailyMediaStorageBytes = dailyTweets * (mediaPct / 100) * mediaSize * 1000000;
    const dailyStorageTB = Math.round((dailyMediaStorageBytes / (1000 * 1000 * 1000 * 1000)) * 10) / 10;
    const rawFiveYearStoragePB = Math.round((dailyStorageTB * 365 * 5 / 1000) * 10) / 10;
    const replicatedFiveYearStoragePB = Math.round((rawFiveYearStoragePB * repFactor) * 10) / 10;

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🧮 Live Back-of-the-Envelope Calculator</div>

            {/* Inputs grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
                
                <div style={inputContainerStyle}>
                    <label style={labelStyle}>DAU (Millions)</label>
                    <input type="number" value={dau} onChange={e => setDau(Math.max(1, parseInt(e.target.value, 10) || 0))} style={formInputStyle} />
                </div>

                <div style={inputContainerStyle}>
                    <label style={labelStyle}>Tweets/user/day</label>
                    <input type="number" value={tweetsPerUser} onChange={e => setTweetsPerUser(Math.max(1, parseInt(e.target.value, 10) || 0))} style={formInputStyle} />
                </div>

                <div style={inputContainerStyle}>
                    <label style={labelStyle}>Tweets w/ Media (%)</label>
                    <input type="number" value={mediaPct} onChange={e => setMediaPct(Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))} style={formInputStyle} />
                </div>

                <div style={inputContainerStyle}>
                    <label style={labelStyle}>Media Size (MB)</label>
                    <input type="number" step="0.1" value={mediaSize} onChange={e => setMediaSize(Math.max(0.1, parseFloat(e.target.value) || 0))} style={formInputStyle} />
                </div>

                <div style={inputContainerStyle}>
                    <label style={labelStyle}>Replication Factor</label>
                    <input type="number" min="1" max="5" value={repFactor} onChange={e => setRepFactor(Math.max(1, parseInt(e.target.value, 10) || 1))} style={formInputStyle} />
                </div>

            </div>

            {/* Calculations outputs step-by-step */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* QPS */}
                <div style={calcCardStyle}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase' }}>1. QPS Calculation</div>
                    <div style={mathFormulaStyle}>
                        QPS = ({dau}M DAU × {tweetsPerUser} tweets) ÷ 86,400 seconds
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
                        <span>Average Write QPS: <strong style={{ color: 'var(--text-light)' }}>{avgWriteQps.toLocaleString()}</strong></span>
                        <span>Peak Write QPS (2x): <strong style={{ color: '#ef4444' }}>{peakWriteQps.toLocaleString()}</strong></span>
                    </div>
                </div>

                {/* Storage */}
                <div style={calcCardStyle}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase' }}>2. Storage Calculation (Daily / 5-Year)</div>
                    <div style={mathFormulaStyle}>
                        Daily Media = {dau}M DAU × {tweetsPerUser} × {mediaPct}% × {mediaSize} MB
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, marginTop: 6 }}>
                        <div>Daily Media Storage: <strong style={{ color: 'var(--text-light)' }}>{dailyStorageTB} TB / day</strong></div>
                        <div>Raw 5-Year Storage: <strong style={{ color: 'var(--text-light)' }}>{rawFiveYearStoragePB} PB</strong></div>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4, color: '#28c840' }}>
                            Replicated 5-Year Storage ({repFactor}x): <strong>{replicatedFiveYearStoragePB} PB</strong>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const inputContainerStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
};

const labelStyle = {
    fontSize: 9.5,
    fontWeight: 800,
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
};

const formInputStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: 13.5,
    fontWeight: 700,
    outline: 'none',
    width: '100%'
};

const calcCardStyle = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: 14
};

const mathFormulaStyle = {
    fontSize: 11,
    fontFamily: 'monospace',
    color: 'var(--text-dim)',
    background: 'var(--bg-elevated)',
    padding: '6px 8px',
    borderRadius: 6,
    margin: '6px 0'
};


/* =========================================================================
   12. InterviewFrameworkWidget (Four-stage horizontal pipeline diagram)
   ========================================================================= */
function InterviewFrameworkWidget() {
    const [activeStage, setActiveStage] = useState(0);

    const stages = [
        {
            title: "Step 1: Understand & Scope",
            time: "3-10 minutes",
            goals: ["Gather requirements (functional & non-functional)", "Clarify features", "State constraints"],
            mistakes: ["Jumping directly into design", "Assuming scale targets", "Not asking clarifying questions"]
        },
        {
            title: "Step 2: High-Level Design",
            time: "10-15 minutes",
            goals: ["Draw main component boxes", "List endpoints", "Check back-of-envelope values"],
            mistakes: ["Over-engineering early", "Designing database keys", "Drawing without talking"]
        },
        {
            title: "Step 3: Deep Dive",
            time: "10-25 minutes",
            goals: ["Explore hot paths & bottlenecks", "Explain data models & partitioning", "Address Celebrity problems"],
            mistakes: ["Getting stuck on authentication", "Ignoring latency SLAs", "Not proposing trade-offs"]
        },
        {
            title: "Step 4: Wrap Up",
            time: "3-5 minutes",
            goals: ["Summarize core components", "Highlight future bottlenecks", "Outline operational monitoring"],
            mistakes: ["Saying 'the design is perfect'", "Avoiding failover topics", "Running out of time"]
        }
    ];

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>⏱️ System Design Interview 4-Step Pipeline</div>

            {/* Pipeline Stage Buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
                {stages.map((st, i) => (
                    <button key={st.title} onClick={() => setActiveStage(i)}
                        style={{
                            flex: 1,
                            padding: '12px 8px',
                            minWidth: 100,
                            borderRadius: 12,
                            border: `1.5px solid ${activeStage === i ? '#00d4aa' : 'var(--border)'}`,
                            background: activeStage === i ? 'rgba(0,212,170,0.1)' : 'var(--bg-surface)',
                            color: activeStage === i ? '#00d4aa' : 'var(--text-light)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>Step {i + 1}</div>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>{st.title.split(':')[1].trim()}</div>
                        <div style={{ fontSize: 9, opacity: 0.6, marginTop: 4 }}>{st.time}</div>
                    </button>
                ))}
            </div>

            {/* Stage content details card */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#00d4aa' }}>{stages[activeStage].title}</span>
                    <span style={{ fontSize: 10, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', padding: '2px 8px', borderRadius: 12, fontWeight: 800 }}>{stages[activeStage].time}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#28c840', textTransform: 'uppercase', marginBottom: 6 }}>✔ Targets & Goals:</div>
                        {stages[activeStage].goals.map(g => (
                            <div key={g} style={{ fontSize: 12.5, color: 'var(--text-gray)', marginBottom: 4 }}>• {g}</div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 6 }}>❌ Red Flags to Avoid:</div>
                        {stages[activeStage].mistakes.map(m => (
                            <div key={m} style={{ fontSize: 12.5, color: 'var(--text-gray)', marginBottom: 4 }}>• {m}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


/* =========================================================================
   13. DosAndDontsWidget (Two-column visual reference card)
   ========================================================================= */
function DosAndDontsWidget() {
    const dos = [
        "Ask clarifications (e.g. read-write ratios)",
        "Write down assumptions on the whiteboard",
        "Agree on High-Level Design before deep dives",
        "Suggest multiple approaches & outline trade-offs",
        "Estimate server & storage capacity"
    ];

    const donts = [
        "Jump directly to design box diagrams (Don't be Jimmy)",
        "Stay silent while thinking through logic",
        "Ignore hints and pushes from the interviewer",
        "Claim your architecture design is 100% perfect",
        "Fail to address regional database failover patterns"
    ];

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>📋 Interview Dos and Don'ts Checklist</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {/* DO column */}
                <div style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 16, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid rgba(0,212,170,0.2)', paddingBottom: 6 }}>
                        ✅ Interview DOs
                    </div>
                    {dos.map(item => (
                        <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.4 }}>
                            <span style={{ color: '#00d4aa', fontWeight: 800 }}>✔</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>

                {/* DONT column */}
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid rgba(239,68,68,0.2)', paddingBottom: 6 }}>
                        ❌ Interview DON'Ts
                    </div>
                    {donts.map(item => (
                        <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.4 }}>
                            <span style={{ color: '#ef4444', fontWeight: 800 }}>✘</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



/* =========================================================================
   Universal Widget Styles & Exports
   ========================================================================= */
const containerStyle = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 24,
    padding: '22px 24px',
    margin: '24px 0',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
};

const titleStyle = {
    fontSize: 14,
    fontWeight: 800,
    color: 'var(--text-light)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 16,
    borderLeft: '4px solid #00d4aa',
    paddingLeft: 10
};

const btnStyle = {
    padding: '8px 16px',
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--bg-elevated)',
    color: 'var(--text-light)',
    cursor: 'pointer',
    transition: 'all 0.15s'
};


/* =========================================================================
   14. RateLimiterSandbox (Algorithms Sandbox)
   ========================================================================= */
function RateLimiterSandbox({ initialAlgo = 'token-bucket', showComparison = false }) {
    const [algo, setAlgo] = useState(initialAlgo);
    const [tokens, setTokens] = useState(10);
    const [maxTokens] = useState(10);
    const [refillInterval] = useState(1000);
    const [queue, setQueue] = useState([]);
    const [maxQueue] = useState(5);
    const [logs, setLogs] = useState([]);
    const [fixedWindow, setFixedWindow] = useState(() => ({ count: 0, limit: 5, windowStart: Date.now() }));
    const [slidingLog, setSlidingLog] = useState([]);
    const [slidingCounter, setSlidingCounter] = useState(() => ({ prevCount: 3, currentCount: 0, limit: 5, startTime: Date.now() }));
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 500);
        return () => clearInterval(timer);
    }, []);

    // Refill tokens periodically for token-bucket
    useEffect(() => {
        const timer = setInterval(() => {
            if (algo === 'token-bucket') {
                setTokens(t => Math.min(maxTokens, t + 2));
            }
        }, refillInterval);
        return () => clearInterval(timer);
    }, [algo, maxTokens, refillInterval]);

    // Drain leaking bucket queue periodically
    useEffect(() => {
        const timer = setInterval(() => {
            if (algo === 'leaking-bucket') {
                setQueue(q => q.slice(1));
            }
        }, 1200);
        return () => clearInterval(timer);
    }, [algo]);

    // Fixed window timer reset
    useEffect(() => {
        const timer = setInterval(() => {
            if (algo === 'fixed-window') {
                setFixedWindow(fw => ({ ...fw, count: 0, windowStart: Date.now() }));
            }
        }, 3000);
        return () => clearInterval(timer);
    }, [algo]);

    const triggerRequest = () => {
        const now = Date.now();
        let allowed = false;
        let detail = '';

        if (algo === 'token-bucket') {
            if (tokens > 0) {
                setTokens(t => t - 1);
                allowed = true;
                detail = `Token consumed. Remaining tokens: ${tokens - 1}/${maxTokens}`;
            } else {
                allowed = false;
                detail = 'No tokens left in bucket! Rejected (429)';
            }
        } else if (algo === 'leaking-bucket') {
            if (queue.length < maxQueue) {
                setQueue(q => [...q, now]);
                allowed = true;
                detail = `Request queued. Current queue depth: ${queue.length + 1}/${maxQueue}`;
            } else {
                allowed = false;
                detail = 'Queue full! Leaking bucket overflow. Rejected (429)';
            }
        } else if (algo === 'fixed-window') {
            if (fixedWindow.count < fixedWindow.limit) {
                setFixedWindow(fw => ({ ...fw, count: fw.count + 1 }));
                allowed = true;
                detail = `Allowed in current fixed window. Count: ${fixedWindow.count + 1}/${fixedWindow.limit}`;
            } else {
                allowed = false;
                detail = `Rate limit exceeded in current fixed window! Blocked.`;
            }
        } else if (algo === 'sliding-window-log') {
            const oneWindowAgo = now - 3000;
            const validLogs = slidingLog.filter(t => t > oneWindowAgo);
            if (validLogs.length < 4) {
                setSlidingLog([...validLogs, now]);
                allowed = true;
                detail = `Request allowed. Log count in sliding window: ${validLogs.length + 1}/4`;
            } else {
                setSlidingLog([...validLogs]);
                allowed = false;
                detail = `Rate limit exceeded! Sliding log holds ${validLogs.length} events.`;
            }
        } else if (algo === 'sliding-window-counter') {
            const windowSize = 3000;
            const elapsedTime = now - slidingCounter.startTime;
            const prevWeight = Math.max(0, 1 - (elapsedTime / windowSize));
            const calculatedRequests = Math.floor(slidingCounter.prevCount * prevWeight) + slidingCounter.currentCount;
            
            if (calculatedRequests < slidingCounter.limit) {
                setSlidingCounter(sc => ({ ...sc, currentCount: sc.currentCount + 1 }));
                allowed = true;
                detail = `Weighted count: ${calculatedRequests + 1}/${slidingCounter.limit} (Prev weight: ${(prevWeight * 100).toFixed(0)}%)`;
            } else {
                allowed = false;
                detail = `Limit exceeded! Weighted sliding count: ${calculatedRequests}/${slidingCounter.limit}`;
            }
        }

        setLogs(l => [{ id: now, allowed, algo, detail }, ...l.slice(0, 3)]);
    };

    const resetSimulator = () => {
        setTokens(10);
        setQueue([]);
        setLogs([]);
        setFixedWindow({ count: 0, limit: 5, windowStart: Date.now() });
        setSlidingLog([]);
        setSlidingCounter({ prevCount: 3, currentCount: 0, limit: 5, startTime: Date.now() });
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🛡️ Rate Limiting Algorithm Sandbox</div>

            {/* Selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, background: 'var(--bg-elevated)', borderRadius: 12, padding: 6, marginBottom: 20 }}>
                {['token-bucket', 'leaking-bucket', 'fixed-window', 'sliding-window-log', 'sliding-window-counter'].map(a => (
                    <button key={a} onClick={() => { setAlgo(a); setLogs([]); }} style={{
                        flex: 1, padding: '8px 10px', fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                        background: algo === a ? 'var(--bg-surface)' : 'transparent',
                        color: algo === a ? '#00d4aa' : 'var(--text-muted)'
                    }}>
                        {a.replace('-', ' ').replace('-', ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Visualizer Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#0a0e1a', padding: 20, borderRadius: 20, border: '1px solid var(--border)', minHeight: 180, justifyContent: 'center' }}>
                {algo === 'token-bucket' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Refills 2 tokens every 1 second. Capacity: 10.</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {Array.from({ length: maxTokens }).map((_, idx) => (
                                <div key={idx} style={{
                                    width: 24, height: 24, borderRadius: '50%',
                                    background: idx < tokens ? 'rgba(0,212,170,0.8)' : '#1e293b',
                                    border: `2px solid ${idx < tokens ? '#00d4aa' : 'rgba(255,255,255,0.05)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#000', fontWeight: 900,
                                    transition: 'all 0.25s'
                                }}>
                                    {idx < tokens ? '●' : ''}
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: tokens > 0 ? '#00d4aa' : '#ef4444' }}>
                            Tokens Available: {tokens} / {maxTokens}
                        </div>
                    </div>
                )}

                {algo === 'leaking-bucket' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>FIFO Queue. Constant leak rate of 1 request/1.2s.</div>
                        <div style={{ width: 140, height: 160, border: '3px solid var(--border)', borderTop: 'none', borderBottomRightRadius: 16, borderBottomLeftRadius: 16, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-start', padding: 8, gap: 8, background: 'rgba(255,255,255,0.02)' }}>
                            {queue.map((q, idx) => (
                                <div key={idx} style={{
                                    height: 20, background: '#3b82f6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff',
                                    animation: 'pulse 1s infinite'
                                }}>
                                    Req {idx + 1}
                                </div>
                            ))}
                            {queue.length === 0 && (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-dim)' }}>Bucket Empty</div>
                            )}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: queue.length < maxQueue ? '#3b82f6' : '#ef4444' }}>
                            Queue Depth: {queue.length} / {maxQueue}
                        </div>
                    </div>
                )}

                {algo === 'fixed-window' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Resets count every 3 seconds. Limit: 5.</div>
                        <div style={{ width: '100%', maxWidth: 300, border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--bg-surface)', textAlign: 'center' }}>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>Current Window Count</div>
                            <div style={{ fontSize: 36, fontWeight: 900, color: fixedWindow.count < fixedWindow.limit ? '#00d4aa' : '#ef4444', margin: '8px 0' }}>
                                {fixedWindow.count} / {fixedWindow.limit}
                            </div>
                            <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: '#00d4aa', width: `${(fixedWindow.count / fixedWindow.limit) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                )}

                {algo === 'sliding-window-log' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Cleans logs older than 3 seconds. Limit: 4.</div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Timestamp Log:</div>
                            {slidingLog.length === 0 ? (
                                <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', padding: 12 }}>No requests in current sliding window.</div>
                            ) : (
                                slidingLog.map((t, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11.5, fontFamily: 'monospace' }}>
                                        <span style={{ color: '#00d4aa' }}>[Timestamp]</span>
                                        <span>{new Date(t).toISOString().slice(17, -1)}s</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {algo === 'sliding-window-counter' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Calculates weighted count using previous window + current window. Limit: 5.</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>PREV WINDOW (Weight: {Math.max(0, 1 - ((now - slidingCounter.startTime) / 3000)).toFixed(2)})</div>
                                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>{slidingCounter.prevCount}</div>
                            </div>
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>CURRENT WINDOW</div>
                                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6, color: '#00d4aa' }}>{slidingCounter.currentCount}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'center' }}>
                <button style={{ ...btnStyle, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.3)', padding: '10px 24px', fontSize: 13 }} onClick={triggerRequest}>
                    ⚡ Send Request
                </button>
                <button style={{ ...btnStyle, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }} onClick={resetSimulator}>
                    Reset Sandbox
                </button>
            </div>

            {/* Logs Output */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 16, padding: 14, marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Transaction Logs (Status):</div>
                {logs.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>No request transactions logged. Click 'Send Request'.</div>
                ) : (
                    logs.map(l => (
                        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                            <span style={{ color: l.allowed ? '#00d4aa' : '#ef4444', fontWeight: 800 }}>
                                {l.allowed ? '✓ ALLOWED (200 OK)' : '❌ BLOCKED (429)'}
                            </span>
                            <span style={{ color: 'var(--text-gray)', flex: 1, marginLeft: 16 }}>{l.detail}</span>
                        </div>
                    ))
                )}
            </div>

            {showComparison && (
                <div style={{ marginTop: 20, padding: 16, background: 'rgba(0,212,170,0.03)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase', marginBottom: 8 }}>Algorithms Cheat Sheet</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.5 }}>
                        • <strong>Token Bucket:</strong> Memory efficient, allows traffic bursts, good default.<br/>
                        • <strong>Leaking Bucket:</strong> Smooths out rate limiting to constant outflow, useful for batch exports.<br/>
                        • <strong>Fixed Window:</strong> Simplest, but susceptible to double limits at window boundaries.<br/>
                        • <strong>Sliding Log:</strong> 100% accurate, but has high memory overhead because it retains all timestamps.<br/>
                        • <strong>Sliding Counter:</strong> Low memory, approximates sliding window cleanly without timestamp logs.
                    </div>
                </div>
            )}
        </div>
    );
}


/* =========================================================================
   15. RateLimiterArchitecture (Topology & Configs)
   ========================================================================= */
function RateLimiterArchitecture({ mode = 'bouncer' }) {
    const [tab, setTab] = useState(mode);
    const [requestCount, setRequestCount] = useState(0);
    const [history, setHistory] = useState([]);
    const [rules, setRules] = useState(`{
  "rate_limit_rules": {
    "login_api": {
      "limit": 5,
      "window_seconds": 10
    },
    "default": {
      "limit": 100,
      "window_seconds": 60
    }
  }
}`);

    const simulateTraffic = (type) => {
        const time = Date.now();
        const clientIp = type === 'malicious' ? '192.168.10.15' : '203.45.67.89';
        
        let decision = 'ALLOW';
        let remaining = Math.max(0, 5 - (requestCount + 1));
        
        if (type === 'malicious') {
            decision = 'DENY';
            remaining = 0;
        } else {
            if (requestCount >= 5) {
                decision = 'DENY';
                remaining = 0;
            } else {
                setRequestCount(c => c + 1);
            }
        }

        setHistory(prev => [
            {
                id: time,
                ip: clientIp,
                type: type.toUpperCase(),
                status: decision === 'ALLOW' ? '200 OK' : '429 TOO MANY REQUESTS',
                headers: decision === 'ALLOW' 
                    ? `X-RateLimit-Limit: 5\nX-RateLimit-Remaining: ${remaining}`
                    : `X-RateLimit-Limit: 5\nX-RateLimit-Remaining: 0\nRetry-After: 9s`
            },
            ...prev.slice(0, 3)
        ]);
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>📁 System Architecture & Rate Limiter Location</div>

            {/* Menu */}
            <div style={{ display: 'flex', gap: 6, background: 'var(--bg-elevated)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
                {['bouncer', 'placement', 'middleware', 'rules', 'concurrency'].map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        flex: 1, padding: '8px', fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer',
                        background: tab === t ? 'var(--bg-surface)' : 'transparent',
                        color: tab === t ? '#00d4aa' : 'var(--text-muted)'
                    }}>
                        {t.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Sub-modes rendering */}
            {tab === 'bouncer' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>🔒 AVOID BOT FLOODS</div>
                        <p style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.4, margin: 0 }}>
                            Caps unauthenticated bot accounts from firing millions of requests. Protects server memory pools.
                        </p>
                    </div>
                    <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: 16, padding: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#eab308', marginBottom: 8 }}>💸 REDUCE API COST</div>
                        <p style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.4, margin: 0 }}>
                            Avoids paying thousands for pay-per-use external APIs (SMS, payment gateways) in case retry loops go rogue.
                        </p>
                    </div>
                    <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 16, padding: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#3b82f6', marginBottom: 8 }}>📣 NOISY NEIGHBOR</div>
                        <p style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.4, margin: 0 }}>
                            Prevents one massive enterprise client from hogging cluster threads and starving smaller customers.
                        </p>
                    </div>
                </div>
            )}

            {tab === 'placement' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Where should the rate limiter live? Standard options:</div>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                        <strong>1. Client-Side:</strong> Easy to bypass, unreliable since users control client apps.<br/>
                        <strong>2. Server-Side:</strong> Coded in app logic. Easy to write but adds burden to app servers.<br/>
                        <strong>3. API Gateway Middleware (Best Practice):</strong> Rate limiter lives on a reverse proxy gateway (e.g. Kong, Cloudflare). Keeps web application code clean and drops invalid packets early.
                    </div>
                </div>
            )}

            {tab === 'middleware' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button style={{ ...btnStyle, background: 'rgba(0,212,170,0.15)', color: '#00d4aa' }} onClick={() => simulateTraffic('normal')}>
                            Normal Traffic (Alice)
                        </button>
                        <button style={{ ...btnStyle, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }} onClick={() => simulateTraffic('malicious')}>
                            DDoS Flood Bot
                        </button>
                    </div>

                    <div style={{ background: '#090d16', border: '1px solid var(--border)', borderRadius: 20, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: 11, fontWeight: 700 }}>
                            <div style={{ textAlign: 'center' }}>💻 Client</div>
                            <div>➔</div>
                            <div style={{ border: '2px solid #00d4aa', borderRadius: 8, padding: 8, background: 'rgba(0,212,170,0.05)' }}>🛑 Gateway (Rate Limiter)</div>
                            <div>➔</div>
                            <div style={{ border: '1px dashed #3b82f6', borderRadius: 8, padding: 8 }}>💾 Redis Cache</div>
                            <div>➔</div>
                            <div style={{ textAlign: 'center' }}>🖥️ App Server</div>
                        </div>
                    </div>

                    {history.length > 0 && (
                        <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Gateway Responses:</div>
                            {history.map(h => (
                                <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                                    <div>
                                        <span style={{ color: h.type === 'MALICIOUS' ? '#ef4444' : '#00d4aa', fontWeight: 800 }}>[{h.type}]</span> IP: {h.ip}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ color: h.status.includes('200') ? '#00d4aa' : '#ef4444', fontWeight: 800 }}>{h.status}</span>
                                        <pre style={{ margin: '4px 0 0', fontSize: 10, color: 'var(--text-dim)', textAlign: 'left', background: '#090d16', padding: 6, borderRadius: 4 }}>{h.headers}</pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === 'rules' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Rules are typically defined in configuration files (YAML/JSON) and loaded into gateway memory.</div>
                    <textarea value={rules} onChange={e => setRules(e.target.value)} style={{
                        width: '100%', minHeight: 120, background: '#0a0e1a', color: '#ff79c6', fontFamily: 'monospace', border: '1px solid var(--border)', borderRadius: 12, padding: 14, outline: 'none'
                    }} />
                </div>
            )}

            {tab === 'concurrency' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Race Conditions in distributed rate limiting:</div>
                    <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: 16 }}>
                        <strong>The Problem:</strong> When two requests read Redis keys at the same time, both see `counter = 4` (under limit = 5). Both increment to 5. The actual count is now 6, bypassing the limit. This is a classic race condition.
                    </div>
                    <div style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 16, padding: 16 }}>
                        <strong>The Solution:</strong> Use **Redis Lua Scripts** or **Sorted Sets**. Lua scripts run atomically inside Redis, preventing concurrency collisions.
                    </div>
                </div>
            )}
        </div>
    );
}


/* =========================================================================
   16. ConsistentHashingRing (Consistent Hashing Simulator)
   ========================================================================= */
function ConsistentHashingRing({ mode = 'sandbox' }) {
    const [vnodes, setVnodes] = useState(mode === 'vnodes' ? 20 : 1);
    const [activeServers, setActiveServers] = useState(['s0', 's1', 's2', 's3']);
    const [keys] = useState([
        { id: 'k0', label: 'key0', angle: 30, color: '#a78bfa' },
        { id: 'k1', label: 'key1', angle: 100, color: '#a78bfa' },
        { id: 'k2', label: 'key2', angle: 190, color: '#a78bfa' },
        { id: 'k3', label: 'key3', angle: 290, color: '#a78bfa' }
    ]);
    const [hoveredKey, setHoveredKey] = useState(null);

    const serversList = [
        { id: 's0', label: 'Server 0', angle: 45, color: '#3b82f6' },
        { id: 's1', label: 'Server 1', angle: 135, color: '#ef4444' },
        { id: 's2', label: 'Server 2', angle: 225, color: '#10b981' },
        { id: 's3', label: 'Server 3', angle: 315, color: '#f59e0b' }
    ];

    // Compute key assignments
    const getMapping = (keyAngle) => {
        let nodesList = [];
        serversList.forEach(s => {
            if (!activeServers.includes(s.id)) return;
            if (vnodes === 1) {
                nodesList.push({ id: s.id, angle: s.angle, color: s.color, label: s.label });
            } else {
                for (let i = 0; i < vnodes; i++) {
                    const angleOffset = Math.round((s.angle + (i * (360 / vnodes))) % 360);
                    nodesList.push({ id: s.id, angle: angleOffset, color: s.color, label: `${s.label}#${i}` });
                }
            }
        });
        
        if (nodesList.length === 0) return null;
        nodesList.sort((a, b) => a.angle - b.angle);

        // Find nearest clockwise
        const match = nodesList.find(n => n.angle >= keyAngle);
        return match || nodesList[0];
    };

    const toggleServer = (sid) => {
        if (activeServers.includes(sid)) {
            if (activeServers.length > 1) {
                setActiveServers(activeServers.filter(s => s !== sid));
            }
        } else {
            setActiveServers([...activeServers, sid]);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>⭕ Consistent Hashing Ring Simulator</div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active Servers:</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {serversList.map(s => {
                            const active = activeServers.includes(s.id);
                            return (
                                <button key={s.id} onClick={() => toggleServer(s.id)} style={{
                                    ...btnStyle,
                                    background: active ? s.color : 'rgba(255,255,255,0.02)',
                                    color: active ? '#000' : 'var(--text-muted)',
                                    border: `1px solid ${active ? s.color : 'var(--border)'}`,
                                    fontWeight: 900
                                }}>
                                    {s.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Virtual Nodes per Server:</span>
                    <input type="range" min="1" max="60" value={vnodes} onChange={e => setVnodes(parseInt(e.target.value))} style={{ flex: 1, accentColor: '#00d4aa' }} />
                    <span style={{ fontSize: 13, color: '#00d4aa', fontWeight: 800, minWidth: 40 }}>{vnodes} Nodes</span>
                </div>
            </div>

            {/* Hashing Ring Diagram */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', background: '#0a0e1a', padding: 24, borderRadius: 20, border: '1px solid var(--border)' }}>
                {/* SVG Ring container */}
                <div style={{ position: 'relative', width: 280, height: 280 }}>
                    <svg width="280" height="280">
                        {/* Circle Space */}
                        <circle cx="140" cy="140" r="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                        
                        {/* Labeled Hash Start */}
                        <text x="140" y="28" fill="var(--text-dim)" fontSize="9" textAnchor="middle">0 / 2^160 - 1</text>
                        
                        {/* Render Virtual Nodes */}
                        {serversList.map(s => {
                            if (!activeServers.includes(s.id)) return null;
                            if (vnodes === 1) {
                                const rad = (s.angle * Math.PI) / 180;
                                const x = 140 + 100 * Math.cos(rad);
                                const y = 140 + 100 * Math.sin(rad);
                                return (
                                    <circle key={s.id} cx={x} cy={y} r="10" fill={s.color} stroke="#fff" strokeWidth="1.5">
                                        <title>{s.label}</title>
                                    </circle>
                                );
                            } else {
                                return Array.from({ length: vnodes }).map((_, idx) => {
                                    const localAngle = (s.angle + (idx * (360 / vnodes))) % 360;
                                    const rad = (localAngle * Math.PI) / 180;
                                    const x = 140 + 100 * Math.cos(rad);
                                    const y = 140 + 100 * Math.sin(rad);
                                    return (
                                        <circle key={`${s.id}-${idx}`} cx={x} cy={y} r="4" fill={s.color}>
                                            <title>{`${s.label} vnode #${idx}`}</title>
                                        </circle>
                                    );
                                });
                            }
                        })}

                        {/* Render Keys */}
                        {keys.map(k => {
                            const rad = (k.angle * Math.PI) / 180;
                            const x = 140 + 100 * Math.cos(rad);
                            const y = 140 + 100 * Math.sin(rad);
                            
                            // Get target mapping
                            const mapping = getMapping(k.angle);
                            let targetRad = 0;
                            if (mapping) {
                                targetRad = (mapping.angle * Math.PI) / 180;
                            }

                            const tx = 140 + 100 * Math.cos(targetRad);
                            const ty = 140 + 100 * Math.sin(targetRad);

                            const isHovered = hoveredKey === k.id;

                            return (
                                <g key={k.id} onMouseEnter={() => setHoveredKey(k.id)} onMouseLeave={() => setHoveredKey(null)}>
                                    {/* Arrow linking Key to Server */}
                                    {mapping && (isHovered || vnodes === 1) && (
                                        <line x1={x} y1={y} x2={tx} y2={ty} stroke={mapping.color} strokeWidth={isHovered ? "2.5" : "1.5"} strokeDasharray="4 2" />
                                    )}
                                    <polygon points={`${x},${y-6} ${x+6},${y} ${x},${y+6} ${x-6},${y}`} fill="#a78bfa" stroke="#fff" strokeWidth="1" cursor="pointer" />
                                    <text x={x} y={y - 10} fill="#a78bfa" fontSize="9" textAnchor="middle" fontWeight="bold">{k.label}</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Legend Panel */}
                <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Key Mapping:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {keys.map(k => {
                            const mapping = getMapping(k.angle);
                            return (
                                <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-elevated)', borderRadius: 10, fontSize: 12, border: '1px solid var(--border)' }}>
                                    <span style={{ color: '#a78bfa', fontWeight: 800 }}>{k.label}</span>
                                    <span style={{ color: 'var(--text-dim)' }}>➔</span>
                                    <span style={{ color: mapping ? mapping.color : 'var(--text-muted)', fontWeight: 700 }}>
                                        {mapping ? mapping.label : 'None'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}


/* =========================================================================
   17. HashingComparison (Modular vs Consistent Hashing Storms)
   ========================================================================= */
function HashingComparison() {
    const [offline, setOffline] = useState(false);

    const sampleKeys = [
        { id: 0, hash: 12, label: 'KeyA' },
        { id: 1, hash: 25, label: 'KeyB' },
        { id: 2, hash: 38, label: 'KeyC' },
        { id: 3, hash: 51, label: 'KeyD' },
        { id: 4, hash: 64, label: 'KeyE' },
        { id: 5, hash: 77, label: 'KeyF' },
        { id: 6, hash: 90, label: 'KeyG' },
        { id: 7, hash: 103, label: 'KeyH' }
    ];

    const getModularServer = (hash, sCount) => hash % sCount;

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>📉 Remapping comparison: Modular Hashing vs Consistent Hashing</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Simulate Server 1 going offline:</span>
                <button onClick={() => setOffline(!offline)} style={{
                    ...btnStyle,
                    background: offline ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,170,0.15)',
                    color: offline ? '#ef4444' : '#00d4aa',
                    border: 'none',
                    fontWeight: 800
                }}>
                    {offline ? 'Server 1: OFFLINE' : 'Server 1: ONLINE'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                {/* Modular Hashing Table */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 12 }}>
                        Traditional Modular Hashing (hash % N)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 800, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                            <span>KEY</span>
                            <span>BEFORE (N=4)</span>
                            <span>AFTER (N=3)</span>
                            <span>STATUS</span>
                        </div>
                        {sampleKeys.map(k => {
                            const b = getModularServer(k.hash, 4);
                            const a = getModularServer(k.hash, 3);
                            const changed = b !== a;
                            return (
                                <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontWeight: 700 }}>{k.label}</span>
                                    <span>Server {b}</span>
                                    <span>Server {offline ? a : b}</span>
                                    <span style={{ color: offline && changed ? '#ef4444' : '#00d4aa', fontWeight: 800 }}>
                                        {offline ? (changed ? '❌ MISS' : '✓ HIT') : '✓ HIT'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {offline && (
                        <div style={{ fontSize: 12, color: '#ef4444', marginTop: 12, fontWeight: 800, textAlign: 'center' }}>
                            75% cache miss storm triggered!
                        </div>
                    )}
                </div>

                {/* Consistent Hashing Table */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase', marginBottom: 12 }}>
                        Consistent Hashing (Ring Redistribution)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 800, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                            <span>KEY</span>
                            <span>BEFORE (N=4)</span>
                            <span>AFTER (N=3)</span>
                            <span>STATUS</span>
                        </div>
                        {sampleKeys.map(k => {
                            // Consistent Hashing mapping: only key1 is mapped to Server 1.
                            // So only key1 will remap if server 1 goes offline!
                            const b = k.label === 'KeyB' ? 1 : k.id % 4;
                            const a = k.label === 'KeyB' ? 2 : b; // Remap KeyB from Server 1 to Server 2
                            const changed = b !== a;
                            return (
                                <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontWeight: 700 }}>{k.label}</span>
                                    <span>Server {b}</span>
                                    <span>Server {offline ? a : b}</span>
                                    <span style={{ color: offline && changed ? '#f59e0b' : '#00d4aa', fontWeight: 800 }}>
                                        {offline ? (changed ? '⚡ REALLOC' : '✓ HIT') : '✓ HIT'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {offline && (
                        <div style={{ fontSize: 12, color: '#00d4aa', marginTop: 12, fontWeight: 800, textAlign: 'center' }}>
                            Only 1 key reallocated (12.5% rate)! No database crash.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   Chapter 6 + 7 Premium Learning Widgets
   ========================================================================= */
const vizPalette = ['#00d4aa', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

function VizHeader({ title, eyebrow = 'Interactive lab' }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap' }}>
            <div>
                <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00d4aa', marginBottom: 6 }}>{eyebrow}</div>
                <div style={{ fontSize: 16, fontWeight: 850, color: 'var(--text-light)', lineHeight: 1.25 }}>{title}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', borderRadius: 999, padding: '5px 10px' }}>
                click, slide, compare
            </div>
        </div>
    );
}

function MiniNode({ label, sub, color = '#00d4aa', active = false, down = false }) {
    return (
        <div style={{
            minWidth: 112,
            flex: '1 1 112px',
            padding: '14px 12px',
            borderRadius: 14,
            border: `1px solid ${down ? 'rgba(239,68,68,0.45)' : active ? color : 'var(--border)'}`,
            background: down ? 'rgba(239,68,68,0.08)' : active ? `${color}18` : 'var(--bg-elevated)',
            color: down ? '#ef4444' : active ? color : 'var(--text-gray)',
            textAlign: 'center',
            transition: 'all 0.25s ease',
            boxShadow: active ? `0 0 0 4px ${color}0f` : 'none',
        }}>
            <div style={{ fontSize: 13, fontWeight: 850, marginBottom: 4 }}>{label}</div>
            {sub && <div style={{ fontSize: 10.5, color: down ? '#fca5a5' : 'var(--text-muted)', lineHeight: 1.35 }}>{sub}</div>}
        </div>
    );
}

function MetricTile({ label, value, color = '#00d4aa' }) {
    return (
        <div style={{ background: `${color}0d`, border: `1px solid ${color}33`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>{label}</div>
        </div>
    );
}

function BitBar({ segments }) {
    const total = segments.reduce((sum, segment) => sum + segment.bits, 0);
    return (
        <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', height: 54 }}>
                {segments.map((segment) => (
                    <div key={segment.label} title={`${segment.label}: ${segment.bits} bits`} style={{
                        width: `${(segment.bits / total) * 100}%`,
                        minWidth: segment.bits <= 1 ? 14 : 42,
                        background: segment.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#071018',
                        fontSize: 10.5,
                        fontWeight: 900,
                        borderRight: '1px solid rgba(0,0,0,0.18)',
                        textAlign: 'center',
                        padding: '0 6px',
                    }}>
                        {segment.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

function KeyValueTableAnimator() {
    const baseRows = [
        ['user_42_session', '{id: 42, name: "Alice"}'],
        ['feature_dark_mode', 'true'],
        ['rate_limit:user:7:2024', '47'],
        ['product_img_4892', '[binary blob]'],
    ];
    const [rows, setRows] = useState(baseRows);
    const [selected, setSelected] = useState(0);
    const [putFlash, setPutFlash] = useState(false);

    const putRow = () => {
        const next = rows.length + 1;
        setRows([...rows, [`cart:user:${next}`, `{items: ${next}, updated: now}`]]);
        setSelected(rows.length);
        setPutFlash(true);
        setTimeout(() => setPutFlash(false), 700);
    };

    return (
        <div style={containerStyle}>
            <VizHeader title="Key-Value Table Animator" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', background: 'rgba(59,130,246,0.12)', color: '#93c5fd', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        <div style={{ padding: 12 }}>Key string</div>
                        <div style={{ padding: 12, borderLeft: '1px solid var(--border)' }}>Opaque value</div>
                    </div>
                    {rows.map((row, idx) => (
                        <button key={`${row[0]}-${idx}`} onClick={() => setSelected(idx)} style={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1.3fr',
                            textAlign: 'left',
                            border: 'none',
                            borderTop: '1px solid var(--border)',
                            background: selected === idx ? 'rgba(245,158,11,0.16)' : idx === rows.length - 1 && putFlash ? 'rgba(0,212,170,0.2)' : 'transparent',
                            color: 'var(--text-light)',
                            cursor: 'pointer',
                            animation: idx === rows.length - 1 && putFlash ? 'slideDown 0.35s ease' : 'none',
                        }}>
                            <div style={{ padding: 12, fontFamily: 'monospace', fontSize: 12 }}>{row[0]}</div>
                            <div style={{ padding: 12, borderLeft: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-gray)' }}>{row[1]}</div>
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button style={{ ...btnStyle, background: 'rgba(0,212,170,0.13)', color: '#00d4aa' }} onClick={putRow}>PUT new key</button>
                    <button style={{ ...btnStyle, background: 'rgba(245,158,11,0.13)', color: '#f59e0b' }} onClick={() => setSelected((selected + 1) % rows.length)}>GET next key</button>
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                        <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>Returned value</div>
                        <code style={{ fontSize: 12.5, color: 'var(--text-light)', lineHeight: 1.5 }}>{rows[selected]?.[1]}</code>
                        <div style={{ marginTop: 14, padding: '9px 10px', borderRadius: 10, background: 'rgba(0,212,170,0.1)', color: '#00d4aa', fontSize: 12, fontWeight: 800 }}>
                            O(1): direct hash lookup, no scan
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SingleServerMemoryFill() {
    const [usage, setUsage] = useState(64);
    const [tiered, setTiered] = useState(false);
    const [failed, setFailed] = useState(false);
    const visibleUsage = tiered ? Math.max(22, usage - 24) : usage;
    const cells = Array.from({ length: 40 }, (_, i) => i < Math.round((visibleUsage / 100) * 40));
    const color = failed ? '#334155' : visibleUsage >= 100 ? '#ef4444' : visibleUsage >= 80 ? '#f59e0b' : '#00d4aa';

    return (
        <div style={containerStyle}>
            <VizHeader title="Single Server Memory Fill" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                <div style={{ background: failed ? '#07090f' : 'var(--bg-elevated)', border: `1px solid ${failed ? '#ef4444' : 'var(--border)'}`, borderRadius: 16, padding: 18, transition: 'all 0.25s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <strong style={{ color: failed ? '#ef4444' : 'var(--text-light)' }}>Single Server</strong>
                        <span style={{ fontSize: 12, color }}>{failed ? 'All data lost' : `${Math.round(visibleUsage * 10.24)} GB / 1 TB`}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
                        {cells.map((filled, idx) => (
                            <div key={idx} style={{ height: 30, borderRadius: 7, background: failed ? 'rgba(239,68,68,0.08)' : filled ? color : 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', transition: 'all 0.2s' }} />
                        ))}
                    </div>
                    {tiered && !failed && (
                        <div style={{ marginTop: 14, border: '1px dashed rgba(59,130,246,0.45)', borderRadius: 14, padding: 12, color: '#93c5fd', fontSize: 12 }}>
                            Cold keys moved to SSD tier. Capacity improves, but fault tolerance is still zero.
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input type="range" min="10" max="110" value={usage} onChange={e => { setUsage(Number(e.target.value)); setFailed(false); }} style={{ width: '100%', accentColor: color }} />
                    <button style={btnStyle} onClick={() => setTiered(!tiered)}>{tiered ? 'Disable' : 'Enable'} Tiered Storage</button>
                    <button style={{ ...btnStyle, color: '#ef4444', background: 'rgba(239,68,68,0.1)' }} onClick={() => setFailed(!failed)}>{failed ? 'Recover Server' : 'Fail Server'}</button>
                    <MetricTile label={visibleUsage >= 80 ? 'Warning' : 'Status'} value={failed ? 'Down' : visibleUsage >= 100 ? 'Full' : visibleUsage >= 80 ? 'Pressure' : 'Healthy'} color={color} />
                </div>
            </div>
        </div>
    );
}

function CapTriangleWidget() {
    const [choice, setChoice] = useState('AP');
    const copy = {
        CP: ['Consistency + Partition tolerance', 'Reject or block some requests during a network split so reads never return stale data.', '#3b82f6'],
        AP: ['Availability + Partition tolerance', 'Accept reads/writes during the split, then reconcile conflicts after replicas can talk again.', '#00d4aa'],
        CA: ['Consistency + Availability', 'Only realistic when partitions are not part of the failure model. Distributed interviews usually dismiss this.', '#f59e0b'],
    };
    const active = copy[choice];
    return (
        <div style={containerStyle}>
            <VizHeader title="Interactive CAP Triangle" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'center' }}>
                <div style={{ position: 'relative', height: 260 }}>
                    {[
                        ['C', 'Consistency', '50%', 0],
                        ['A', 'Availability', '12%', 210],
                        ['P', 'Partition Tolerance', '88%', 210],
                    ].map(([letter, label, left, top]) => (
                        <button key={letter} onClick={() => setChoice(letter === 'C' ? 'CP' : letter === 'A' ? 'AP' : choice)} style={{
                            position: 'absolute',
                            left,
                            top,
                            transform: 'translate(-50%, -50%)',
                            width: 118,
                            height: 70,
                            borderRadius: 16,
                            border: `1px solid ${active[2]}`,
                            background: `${active[2]}12`,
                            color: 'var(--text-light)',
                            cursor: 'pointer',
                            fontWeight: 850,
                        }}>
                            <div style={{ fontSize: 22, color: active[2] }}>{letter}</div>
                            <div style={{ fontSize: 10 }}>{label}</div>
                        </button>
                    ))}
                    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                        <polygon points="50%,34 12%,210 88%,210" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    </svg>
                </div>
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {Object.keys(copy).map(key => <button key={key} onClick={() => setChoice(key)} style={{ ...btnStyle, background: choice === key ? `${copy[key][2]}22` : 'var(--bg-elevated)', color: choice === key ? copy[key][2] : 'var(--text-muted)' }}>{key}</button>)}
                    </div>
                    <div style={{ background: `${active[2]}12`, border: `1px solid ${active[2]}40`, borderRadius: 16, padding: 18 }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: active[2], marginBottom: 8 }}>{active[0]}</div>
                        <p style={{ color: 'var(--text-gray)', lineHeight: 1.55, margin: 0 }}>{active[1]}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RingReplicationWidget({ mode = 'partition' }) {
    const [replicas, setReplicas] = useState(3);
    const nodes = [
        { label: 'A', angle: -90, color: '#00d4aa' },
        { label: 'B', angle: -20, color: '#3b82f6' },
        { label: 'C', angle: 48, color: '#8b5cf6' },
        { label: 'D', angle: 130, color: '#f59e0b' },
        { label: 'E', angle: 205, color: '#ef4444' },
    ];
    const replicaSet = nodes.slice(1, 1 + replicas).map(n => n.label);
    const isReplica = (label) => replicaSet.includes(label);
    return (
        <div style={containerStyle}>
            <VizHeader title={mode === 'replication' ? 'N Replica Ring' : 'Consistent Hash Ring'} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 22, alignItems: 'center' }}>
                <svg width="300" height="300" viewBox="0 0 300 300">
                    <circle cx="150" cy="150" r="105" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <path d="M150 45 A105 105 0 0 1 241 98" fill="none" stroke={mode === 'replication' ? '#00d4aa' : '#f59e0b'} strokeWidth="7" strokeLinecap="round" strokeDasharray="8 8" />
                    <circle cx="150" cy="75" r="7" fill="#f59e0b" />
                    <text x="150" y="62" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="800">key hash</text>
                    {nodes.map((node) => {
                        const rad = node.angle * Math.PI / 180;
                        const x = 150 + 105 * Math.cos(rad);
                        const y = 150 + 105 * Math.sin(rad);
                        return (
                            <g key={node.label}>
                                <circle cx={x} cy={y} r={isReplica(node.label) ? 18 : 14} fill={isReplica(node.label) ? node.color : 'var(--bg-elevated)'} stroke={node.color} strokeWidth="2" />
                                <text x={x} y={y + 4} textAnchor="middle" fill={isReplica(node.label) ? '#081018' : node.color} fontSize="12" fontWeight="900">{node.label}</text>
                            </g>
                        );
                    })}
                </svg>
                <div style={{ display: 'grid', gap: 12 }}>
                    {mode === 'replication' && (
                        <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Replication factor N = {replicas}
                            <input type="range" min="1" max="4" value={replicas} onChange={e => setReplicas(Number(e.target.value))} style={{ width: '100%', accentColor: '#00d4aa', marginTop: 8 }} />
                        </label>
                    )}
                    <MetricTile label="Owner rule" value={mode === 'replication' ? `${replicaSet.join(', ')}` : 'first clockwise'} color="#00d4aa" />
                    <div style={{ color: 'var(--text-gray)', fontSize: 13.5, lineHeight: 1.6 }}>
                        Hash the key to a point on the ring. For partitioning, walk clockwise to the first node. For replication, keep walking clockwise until N distinct replicas are selected.
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuorumCalculatorWidget() {
    const [n, setN] = useState(3);
    const [w, setW] = useState(2);
    const [r, setR] = useState(2);
    const strong = w + r > n;
    return (
        <div style={containerStyle}>
            <VizHeader title="Quorum Calculator" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
                {[['N', n, setN, 1, 7], ['W', w, setW, 1, n], ['R', r, setR, 1, n]].map(([label, value, setter, min, max]) => (
                    <div key={label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontWeight: 850 }}><span>{label}</span><span>{value}</span></div>
                        <input type="range" min={min} max={max} value={value} onChange={e => setter(Number(e.target.value))} style={{ width: '100%', accentColor: '#00d4aa', marginTop: 10 }} />
                    </div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {Array.from({ length: n }, (_, idx) => <MiniNode key={idx} label={`Replica ${idx + 1}`} sub={idx < w ? 'write ack' : idx < r ? 'read target' : 'standby'} active={idx < Math.max(w, r)} color={idx < w ? '#00d4aa' : '#3b82f6'} />)}
            </div>
            <div style={{ marginTop: 16, borderRadius: 14, padding: 14, border: `1px solid ${strong ? '#00d4aa55' : '#f59e0b55'}`, background: strong ? 'rgba(0,212,170,0.09)' : 'rgba(245,158,11,0.09)', color: strong ? '#00d4aa' : '#f59e0b', fontWeight: 850 }}>
                W + R {strong ? '>' : '<='} N, so this configuration {strong ? 'can detect the latest committed write' : 'may read stale data'}.
            </div>
        </div>
    );
}

function ConsistencySpectrumWidget() {
    const [model, setModel] = useState(1);
    const models = [
        ['Strong', 'Every read sees the latest write. Higher coordination, higher latency.', '#3b82f6'],
        ['Eventual', 'Replicas converge after writes propagate. Great availability and scale.', '#00d4aa'],
        ['Weak', 'No guarantee that later reads observe earlier writes. Lowest coordination.', '#f59e0b'],
    ];
    return (
        <div style={containerStyle}>
            <VizHeader title="Consistency Model Spectrum" />
            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                {models.map((m, idx) => <button key={m[0]} style={{ ...btnStyle, flex: 1, background: idx === model ? `${m[2]}20` : 'var(--bg-elevated)', color: idx === model ? m[2] : 'var(--text-muted)' }} onClick={() => setModel(idx)}>{m[0]}</button>)}
            </div>
            <div style={{ height: 18, borderRadius: 999, background: 'linear-gradient(90deg,#3b82f6,#00d4aa,#f59e0b)', position: 'relative', margin: '30px 10px' }}>
                <div style={{ position: 'absolute', top: -9, left: `${model * 50}%`, width: 36, height: 36, borderRadius: '50%', background: models[model][2], border: '4px solid var(--bg-surface)', transform: 'translateX(-50%)', transition: 'left 0.25s' }} />
            </div>
            <div style={{ background: `${models[model][2]}12`, border: `1px solid ${models[model][2]}40`, borderRadius: 16, padding: 18 }}>
                <strong style={{ color: models[model][2], fontSize: 16 }}>{models[model][0]}</strong>
                <p style={{ color: 'var(--text-gray)', margin: '8px 0 0', lineHeight: 1.55 }}>{models[model][1]}</p>
            </div>
        </div>
    );
}

function VersioningTimelineWidget({ vector = false }) {
    const [step, setStep] = useState(0);
    const steps = vector
        ? [['Write A', '[A:1,B:0]', '#00d4aa'], ['Write B', '[A:1,B:1]', '#3b82f6'], ['Concurrent update', '[A:2,B:1] vs [A:1,B:2]', '#f59e0b'], ['Conflict shown to client', 'siblings returned', '#ef4444'], ['Client resolves', '[A:3,B:2]', '#00d4aa']]
        : [['v1', 'cart = milk', '#00d4aa'], ['v2a', 'cart = milk + eggs', '#3b82f6'], ['v2b', 'cart = milk + tea', '#f59e0b'], ['Conflict', 'two sibling values', '#ef4444']];
    return (
        <div style={containerStyle}>
            <VizHeader title={vector ? 'Vector Clock Step-Through' : 'Conflict Version Diagram'} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 18 }}>
                {steps.map((item, idx) => <button key={item[0]} onClick={() => setStep(idx)} style={{ ...btnStyle, minHeight: 82, background: idx <= step ? `${item[2]}18` : 'var(--bg-elevated)', color: idx === step ? item[2] : 'var(--text-muted)', borderColor: idx === step ? item[2] : 'var(--border)' }}><div>{item[0]}</div><div style={{ fontSize: 10, marginTop: 6, lineHeight: 1.25 }}>{item[1]}</div></button>)}
            </div>
            <div style={{ background: `${steps[step][2]}12`, border: `1px solid ${steps[step][2]}40`, borderRadius: 16, padding: 16, color: 'var(--text-gray)', lineHeight: 1.55 }}>
                {vector ? 'Vector clocks compare causality. If neither clock dominates, the updates are concurrent and must be resolved.' : 'Versioning preserves both branches instead of overwriting one silently, which makes lost updates visible.'}
            </div>
        </div>
    );
}

function FlowSimulationWidget({ kind = 'generic' }) {
    const [step, setStep] = useState(0);
    const libraries = {
        gossip: ['Node A heartbeat', 'A tells B and D', 'B tells C', 'Cluster converges'],
        sloppy: ['Replica B is down', 'Write goes to healthy node D', 'D stores a hint for B', 'B returns and receives handoff'],
        merkle: ['Hash leaves', 'Build parent hashes', 'Compare roots', 'Sync only differing range'],
        dc: ['DC-East active', 'Network partition', 'Route to DC-West', 'Replicate after recovery'],
        architecture: ['Client API', 'Coordinator node', 'Partition ring', 'Replicas + quorum', 'Repair paths'],
        write: ['Append commit log', 'Update memory table', 'Flush SSTable', 'Recover from log after crash'],
        read: ['Check memory cache', 'Ask Bloom filter', 'Read SSTable', 'Return value or null'],
        autoid: ['Single counter works', 'Multiple DBs collide', 'No global ordering', 'Distributed IDs required'],
        ticket: ['Request ID', 'Central counter increments', 'Ticket server fails', 'All writers blocked'],
        ha: ['Load balancer', 'Instance B fails', 'Traffic reroutes', 'Add new machine ID'],
        clock: ['Machine A drifts', 'IDs sort oddly', 'NTP corrects', 'Pause if clock moves backward'],
    };
    const labels = libraries[kind] || ['Input', 'Process', 'Replicate', 'Recover'];
    const color = vizPalette[step % vizPalette.length];
    return (
        <div style={containerStyle}>
            <VizHeader title={kind === 'write' ? 'Write Path Pipeline' : kind === 'read' ? 'Read Path Flow Diagram' : kind === 'ha' ? 'High Availability Architecture' : 'Distributed Systems Flow'} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 16 }}>
                {labels.map((label, idx) => <MiniNode key={label} label={label} sub={`Step ${idx + 1}`} active={idx === step} down={(kind === 'ticket' || kind === 'ha' || kind === 'sloppy') && idx === 2 && step === idx} color={idx === step ? color : '#00d4aa'} />)}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button style={btnStyle} onClick={() => setStep(Math.max(0, step - 1))}>Previous</button>
                <button style={{ ...btnStyle, background: `${color}18`, color }} onClick={() => setStep((step + 1) % labels.length)}>Next event</button>
            </div>
        </div>
    );
}

function SummaryMatrixWidget() {
    const [active, setActive] = useState(0);
    const rows = [
        ['Partitioning', 'Consistent hashing', 'Decides which node owns a key'],
        ['Replication', 'N replicas', 'Survives node and data center failures'],
        ['Consistency', 'Quorum N/W/R', 'Balances stale-read risk vs latency'],
        ['Conflicts', 'Vector clocks', 'Detects concurrent writes'],
        ['Repair', 'Merkle trees', 'Finds divergent key ranges cheaply'],
        ['Storage', 'Commit log + SSTable', 'Fast writes with durable recovery'],
    ];
    return (
        <div style={containerStyle}>
            <VizHeader title="Interactive Summary Table" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
                {rows.map((row, idx) => <button key={row[0]} onClick={() => setActive(idx)} style={{ textAlign: 'left', borderRadius: 14, border: `1px solid ${idx === active ? vizPalette[idx % vizPalette.length] : 'var(--border)'}`, background: idx === active ? `${vizPalette[idx % vizPalette.length]}12` : 'var(--bg-elevated)', padding: 14, color: 'var(--text-light)', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 900, color: vizPalette[idx % vizPalette.length], marginBottom: 5 }}>{row[0]}</div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{row[1]}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.35 }}>{row[2]}</div>
                </button>)}
            </div>
        </div>
    );
}

function IdApproachWidget({ mode = 'requirements' }) {
    const cards = {
        requirements: [['Numeric 64-bit', 'fits indexes and APIs'], ['Unique', 'no collisions across services'], ['Time sortable', 'debuggable event order'], ['No coordination', 'horizontal scale']],
        multimaster: [['DB A', '1, 3, 5'], ['DB B', '2, 4, 6'], ['Problem', 'hard to add masters and no true chronology']],
        uuid: [['128-bit', 'larger than requirement'], ['Random', 'poor B-tree locality'], ['UUID v7', 'sortable but still 128-bit']],
        ticket: [['Simple', 'one counter'], ['Bottleneck', 'network hop for every ID'], ['SPOF', 'central failure blocks writes']],
    };
    const list = cards[mode] || cards.requirements;
    return (
        <div style={containerStyle}>
            <VizHeader title={mode === 'uuid' ? 'UUID Analysis' : mode === 'ticket' ? 'Ticket Server Architecture' : mode === 'multimaster' ? 'Multi-Master ID Generation' : 'Requirements Table'} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
                {list.map((card, idx) => <MetricTile key={card[0]} label={card[0]} value={card[1]} color={vizPalette[idx % vizPalette.length]} />)}
            </div>
        </div>
    );
}

const SNOWFLAKE_EPOCH_MS = Date.UTC(2020, 0, 1);

function SnowflakeBitsWidget({ mode = 'layout' }) {
    const [seq, setSeq] = useState(0);
    const [dc, setDc] = useState(5);
    const [machine, setMachine] = useState(12);
    const [timestamp, setTimestamp] = useState(() => Date.now() - SNOWFLAKE_EPOCH_MS);
    const id = (BigInt(timestamp) << 22n) | (BigInt(dc) << 17n) | (BigInt(machine) << 12n) | BigInt(seq);
    const segments = [
        { label: 'Sign 1', bits: 1, color: '#94a3b8' },
        { label: mode === 'timestamp' ? 'Timestamp extract' : 'Timestamp 41', bits: 41, color: '#60a5fa' },
        { label: 'DC 5', bits: 5, color: '#34d399' },
        { label: 'Machine 5', bits: 5, color: '#a78bfa' },
        { label: mode === 'sequence' ? `Seq ${seq}` : 'Seq 12', bits: 12, color: '#fbbf24' },
    ];
    return (
        <div style={containerStyle}>
            <VizHeader title={mode === 'timestamp' ? 'Timestamp Timeline and Bit Extraction' : mode === 'sequence' ? 'Sequence Number Animation' : 'Snowflake Bit Layout'} />
            <BitBar segments={segments} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 16 }}>
                <MetricTile label="Datacenter" value={dc} color="#34d399" />
                <MetricTile label="Machine" value={machine} color="#a78bfa" />
                <MetricTile label="Sequence" value={seq} color="#f59e0b" />
                <MetricTile label="Generated ID" value={id.toString().slice(0, 16)} color="#60a5fa" />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                <button style={btnStyle} onClick={() => { setTimestamp(Date.now() - SNOWFLAKE_EPOCH_MS); setSeq((seq + 1) % 4096); }}>Generate ID</button>
                <button style={btnStyle} onClick={() => setDc((dc + 1) % 32)}>Change DC</button>
                <button style={btnStyle} onClick={() => setMachine((machine + 1) % 32)}>Change Machine</button>
            </div>
        </div>
    );
}

function SectionTuningWidget() {
    const [bits, setBits] = useState({ ts: 41, dc: 5, machine: 5, seq: 12 });
    const setPreset = (preset) => setBits(preset);
    const setField = (field, value) => {
        const next = { ...bits, [field]: value };
        const variable = next.ts + next.dc + next.machine + next.seq;
        if (variable !== 63) next.seq = Math.max(8, Math.min(16, next.seq + (63 - variable)));
        setBits(next);
    };
    const years = Math.round((2 ** bits.ts) / (1000 * 60 * 60 * 24 * 365));
    return (
        <div style={containerStyle}>
            <VizHeader title="Section Tuning Sliders" />
            <BitBar segments={[
                { label: 'Sign', bits: 1, color: '#94a3b8' },
                { label: `Time ${bits.ts}`, bits: bits.ts, color: '#60a5fa' },
                { label: `DC ${bits.dc}`, bits: bits.dc || 1, color: '#34d399' },
                { label: `Machine ${bits.machine}`, bits: bits.machine, color: '#a78bfa' },
                { label: `Seq ${bits.seq}`, bits: bits.seq, color: '#fbbf24' },
            ]} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginTop: 16 }}>
                {[['ts', 'Timestamp', 38, 45], ['dc', 'Datacenter', 0, 8], ['machine', 'Machine', 3, 10], ['seq', 'Sequence', 8, 16]].map(([key, label, min, max]) => (
                    <label key={key} style={{ color: 'var(--text-muted)', fontSize: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 14, padding: 12 }}>
                        <span style={{ display: 'flex', justifyContent: 'space-between' }}><b>{label}</b><b>{bits[key]}</b></span>
                        <input type="range" min={min} max={max} value={bits[key]} onChange={e => setField(key, Number(e.target.value))} style={{ width: '100%', accentColor: '#00d4aa', marginTop: 8 }} />
                    </label>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 14 }}>
                <MetricTile label="IDs/ms/machine" value={(2 ** bits.seq).toLocaleString()} />
                <MetricTile label="Years" value={years} color="#60a5fa" />
                <MetricTile label="Datacenters" value={2 ** bits.dc} color="#34d399" />
                <MetricTile label="Machines/DC" value={2 ** bits.machine} color="#a78bfa" />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                <button style={btnStyle} onClick={() => setPreset({ ts: 41, dc: 5, machine: 5, seq: 12 })}>Twitter Default</button>
                <button style={btnStyle} onClick={() => setPreset({ ts: 42, dc: 5, machine: 5, seq: 11 })}>Discord</button>
                <button style={btnStyle} onClick={() => setPreset({ ts: 41, dc: 0, machine: 10, seq: 12 })}>Single DC</button>
                <button style={btnStyle} onClick={() => setPreset({ ts: 39, dc: 5, machine: 5, seq: 14 })}>High Concurrency</button>
            </div>
        </div>
    );
}

function getSpecContentForTab(spec, tab) {
    if (!spec) return [];
    const keys = Object.keys(spec);
    const findKey = (patterns) => {
        return keys.find(k => {
            const kl = k.toLowerCase().replace(/[-_\s]/g, '');
            return patterns.some(p => kl === p || kl.includes(p));
        });
    };

    if (tab === 'concept') {
        const conceptKey = findKey(['concept']);
        if (conceptKey) {
            return [{ key: conceptKey, value: spec[conceptKey] }];
        }
        const conceptKeys = keys.filter(k => {
            const kl = k.toLowerCase();
            return kl.includes('type') || 
                   kl.includes('components') || 
                   kl.includes('layout') || 
                   kl.includes('elements') || 
                   kl.includes('diagram') || 
                   kl.includes('flow') || 
                   kl.includes('basics') ||
                   kl.includes('normal') ||
                   kl.includes('stateful') ||
                   kl.includes('before') ||
                   kl.includes('panel 1') ||
                   kl.includes('panel 2') ||
                   kl.includes('panel 3') ||
                   kl.includes('top section');
        });
        if (conceptKeys.length > 0) {
            return conceptKeys.map(k => ({ key: k, value: spec[k] }));
        }
        return keys.slice(0, 2).map(k => ({ key: k, value: spec[k] }));
    }

    if (tab === 'trade-off') {
        const tradeoffKey = findKey(['tradeoff', 'tradeoffs', 'trade-off', 'trade-offs']);
        if (tradeoffKey) {
            return [{ key: tradeoffKey, value: spec[tradeoffKey] }];
        }
        const tradeoffKeys = keys.filter(k => {
            const kl = k.toLowerCase();
            return kl.includes('priority') || 
                   kl.includes('limit') || 
                   kl.includes('cost') || 
                   kl.includes('fail') || 
                   kl.includes('spof') || 
                   kl.includes('break') || 
                   kl.includes('naive') ||
                   kl.includes('left') ||
                   kl.includes('without cdn') ||
                   kl.includes('problem') ||
                   kl.includes('conflict') ||
                   kl.includes('downtime') ||
                   kl.includes('hotspot');
        });
        if (tradeoffKeys.length > 0) {
            return tradeoffKeys.map(k => ({ key: k, value: spec[k] }));
        }
        const midIdx = Math.floor(keys.length / 2);
        return keys.slice(Math.max(0, midIdx - 1), Math.min(keys.length, midIdx + 1)).map(k => ({ key: k, value: spec[k] }));
    }

    if (tab === 'interview angle') {
        const interviewKey = findKey(['interviewangle', 'interview-angle', 'interview', 'angle', 'insight']);
        if (interviewKey) {
            return [{ key: interviewKey, value: spec[interviewKey] }];
        }
        const interviewKeys = keys.filter(k => {
            const kl = k.toLowerCase();
            return kl.includes('interaction') || 
                   kl.includes('animation') || 
                   kl.includes('scenario') || 
                   kl.includes('simulation') || 
                   kl.includes('interactive') || 
                   kl.includes('right') ||
                   kl.includes('with cdn') ||
                   kl.includes('stateless') ||
                   kl.includes('after') ||
                   kl.includes('highlight') ||
                   kl.includes('bonus') ||
                   kl.includes('option') ||
                   kl.includes('timeline') ||
                   kl.includes('chart') ||
                   kl.includes('scale') ||
                   kl.includes('calculator');
        });
        if (interviewKeys.length > 0) {
            return interviewKeys.map(k => ({ key: k, value: spec[k] }));
        }
        return keys.slice(-2).map(k => ({ key: k, value: spec[k] }));
    }

    return [];
}

function renderSpecValue(text) {
    if (!text) return null;
    const parts = text.split('→');
    const formattedParts = parts.map((part, idx) => {
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let segment = part.trim();
        const elementChunks = [];
        let lastIndex = 0;
        let match;
        
        while ((match = boldRegex.exec(segment)) !== null) {
            if (match.index > lastIndex) {
                elementChunks.push(segment.substring(lastIndex, match.index));
            }
            elementChunks.push(<strong key={match.index} style={{ color: '#ffffff', fontWeight: 700 }}>{match[1]}</strong>);
            lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < segment.length) {
            elementChunks.push(segment.substring(lastIndex));
        }
        
        return (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {idx > 0 && (
                    <span style={{ color: '#00d4aa', margin: '0 8px', fontWeight: 800, fontSize: 14 }}>
                        →
                    </span>
                )}
                <span style={{ verticalAlign: 'middle' }}>
                    {elementChunks.length > 0 ? elementChunks : segment}
                </span>
            </span>
        );
    });

    return <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px 0' }}>{formattedParts}</div>;
}

/* =========================================================================
   Custom Widget: Five Expandable Cards (Cache Considerations)
   ========================================================================= */
function FiveExpandableCardsWidget() {
    const [expandedCard, setExpandedCard] = useState(null);

    // States for Card 1 (TTL Slider)
    const [ttl, setTtl] = useState(600); // 5 (Short), 600 (Optimal), 86400 (Long)
    const [simulatingTtl, setSimulatingTtl] = useState(false);
    const [ttlLog, setTtlLog] = useState('');

    // States for Card 2 (Consistency Step-by-Step)
    const [raceStep, setRaceStep] = useState(0);

    // States for Card 3 (SPOF)
    const [cacheStatus, setCacheStatus] = useState('healthy'); // healthy, crashed
    const [failoverEnabled, setFailoverEnabled] = useState(false);
    const [sentinelState, setSentinelState] = useState('idle'); // idle, promoting, replica_active

    // States for Card 4 (Eviction Policy)
    const [evictionPolicy, setEvictionPolicy] = useState('LRU'); // LRU, LFU, FIFO
    const [cacheKeys, setCacheKeys] = useState([
        { name: 'Key A', frequency: 3, insertedAt: 1, accessedAt: 4 },
        { name: 'Key B', frequency: 1, insertedAt: 2, accessedAt: 3 },
        { name: 'Key C', frequency: 5, insertedAt: 3, accessedAt: 5 },
        { name: 'Key D', frequency: 2, insertedAt: 4, accessedAt: 2 },
    ]);
    const [timeCounter, setTimeCounter] = useState(6);
    const [lastEvicted, setLastEvicted] = useState(null);

    // States for Card 5 (Overprovisioning)
    const [buffer, setBuffer] = useState(120); // 100% to 200%
    const [spikeState, setSpikeState] = useState('idle'); // idle, spiking, crashed, stable
    const [spikeLoad, setSpikeLoad] = useState(40);

    // Card 1: TTL Helpers
    const getTtlLabel = (value) => {
        if (value <= 30) return 'Too Short (5s)';
        if (value <= 1800) return 'Balanced (10m)';
        return 'Too Long (24h)';
    };

    const getTtlMetrics = () => {
        if (ttl <= 30) {
            return { dbLoad: '98% (High)', loadColor: '#ef4444', staleRisk: '1% (Safe)', staleColor: '#00d4aa' };
        }
        if (ttl <= 1800) {
            return { dbLoad: '12% (Healthy)', loadColor: '#00d4aa', staleRisk: '8% (Low)', staleColor: '#34d399' };
        }
        return { dbLoad: '1% (Negligible)', loadColor: '#3b82f6', staleRisk: '95% (Critical)', staleColor: '#ef4444' };
    };

    const handleTtlTest = () => {
        if (simulatingTtl) return;
        setSimulatingTtl(true);
        setTtlLog('Simulating 1,000 active client requests...');
        setTimeout(() => {
            if (ttl <= 30) {
                setTtlLog('⚡ Simulation Log:\n- 1,000 requests received.\n- 980 cache misses (expired).\n- 980 relational DB queries triggered.\n⚠️ IMPACT: Database is hammered! CPU spiked to 98%. Latency is high.');
            } else if (ttl <= 1800) {
                setTtlLog('✓ Simulation Log:\n- 1,000 requests received.\n- 990 cache hits (RAM).\n- 10 cache misses (fetched from DB & cached).\n🎉 IMPACT: Cache took 99% of load. DB CPU load is 5%. Sub-millisecond speeds!');
            } else {
                setTtlLog('❌ Simulation Log:\n- 1,000 requests received.\n- 1,000 cache hits.\n- 0 database queries triggered.\n🛑 CRITICAL GAP: Client fetched stale price of $99 (flash sale updated it to $49). Marketing campaign is broken because data stays cached for 24h!');
            }
            setSimulatingTtl(false);
        }, 1200);
    };

    // Card 2: Consistency Helpers
    const desyncSteps = [
        {
            title: "Initial Synchronized State",
            desc: "Database and Cache both hold the value '$10'. System is in a clean, consistent state.",
            activePath: "init",
            stateLabel: "Cache: $10 | DB: $10"
        },
        {
            title: "Step 1: Write Request updates DB to $20",
            desc: "Client A updates the price to $20 in MySQL. Cache still holds the old value $10.",
            activePath: "write-db",
            stateLabel: "Cache: $10 | DB: $20 (Out of Sync)"
        },
        {
            title: "Step 2: Client A evicts Cache key",
            desc: "Under cache-aside, Client A deletes the key from Redis. The cache is now empty.",
            activePath: "evict-cache",
            stateLabel: "Cache: EMPTY | DB: $20"
        },
        {
            title: "Step 3: Client B Concurrent Read (Cache Miss)",
            desc: "Client B requests the price. It's a Cache Miss. Client B queries DB and reads $20. Its thread gets delayed before updating Cache.",
            activePath: "read-miss",
            stateLabel: "Cache: EMPTY | DB: $20 (Client B holds $20 in memory)"
        },
        {
            title: "Step 4: Client C writes DB to $30 & invalidates",
            desc: "Client C updates the DB to $30 and sends an invalidation request to Cache (which is already empty, so noop).",
            activePath: "write-c",
            stateLabel: "Cache: EMPTY | DB: $30"
        },
        {
            title: "Step 5: Delayed Client B writes stale $20 to Cache",
            desc: "Client B's slow thread finally wakes up and writes its read value $20 back to Cache. DB remains $30. The Cache is polluted with stale data forever!",
            activePath: "desync",
            stateLabel: "Cache: $20 | DB: $30 (Stale Data Polluted!)"
        }
    ];

    // Card 3: SPOF & Failover Helpers
    const triggerSPOFAction = () => {
        if (cacheStatus === 'healthy') {
            setCacheStatus('crashed');
            if (failoverEnabled) {
                setSentinelState('promoting');
                setTimeout(() => {
                    setSentinelState('replica_active');
                    setCacheStatus('healthy');
                }, 2200);
            }
        } else {
            setCacheStatus('healthy');
            setSentinelState('idle');
        }
    };

    // Card 4: Eviction Policy Helpers
    const handleEvictAndInsert = () => {
        let evictIdx = -1;
        if (evictionPolicy === 'FIFO') {
            let minTime = Infinity;
            for (let i = 0; i < cacheKeys.length; i++) {
                if (cacheKeys[i].insertedAt < minTime) {
                    minTime = cacheKeys[i].insertedAt;
                    evictIdx = i;
                }
            }
        } else if (evictionPolicy === 'LFU') {
            let minFreq = Infinity;
            let minAccessTime = Infinity;
            for (let i = 0; i < cacheKeys.length; i++) {
                const k = cacheKeys[i];
                if (k.frequency < minFreq) {
                    minFreq = k.frequency;
                    minAccessTime = k.accessedAt;
                    evictIdx = i;
                } else if (k.frequency === minFreq) {
                    if (k.accessedAt < minAccessTime) {
                        minAccessTime = k.accessedAt;
                        evictIdx = i;
                    }
                }
            }
        } else { // LRU
            let minAccess = Infinity;
            for (let i = 0; i < cacheKeys.length; i++) {
                if (cacheKeys[i].accessedAt < minAccess) {
                    minAccess = cacheKeys[i].accessedAt;
                    evictIdx = i;
                }
            }
        }

        if (evictIdx !== -1) {
            const evictedKey = cacheKeys[evictIdx];
            setLastEvicted(evictedKey.name);
            
            const keyLetters = ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
            const nextLetter = keyLetters[(timeCounter - 6) % keyLetters.length] || 'X';
            const newKeyName = `Key ${nextLetter}`;
            
            const newKeys = [...cacheKeys];
            newKeys[evictIdx] = {
                name: newKeyName,
                frequency: 1,
                insertedAt: timeCounter,
                accessedAt: timeCounter
            };
            setCacheKeys(newKeys);
            setTimeCounter(timeCounter + 1);
        }
    };

    const handleAccessKey = (index) => {
        const newKeys = [...cacheKeys];
        newKeys[index].frequency += 1;
        newKeys[index].accessedAt = timeCounter;
        setCacheKeys(newKeys);
        setTimeCounter(timeCounter + 1);
    };

    // Card 5: Overprovisioning Helpers
    const triggerSpike = () => {
        if (spikeState === 'spiking') return;
        setSpikeState('spiking');
        setSpikeLoad(40);
        
        let currentLoad = 40;
        const interval = setInterval(() => {
            currentLoad += 15;
            if (currentLoad >= 120) {
                clearInterval(interval);
                setSpikeLoad(120);
                setTimeout(() => {
                    const capacityLimit = buffer;
                    if (120 > capacityLimit) {
                        setSpikeState('crashed');
                        setSpikeLoad(120);
                    } else {
                        setSpikeState('stable');
                        setSpikeLoad(120);
                    }
                }, 1000);
            } else {
                setSpikeLoad(currentLoad);
            }
        }, 100);
    };

    const resetSpike = () => {
        setSpikeState('idle');
        setSpikeLoad(40);
    };

    // Style elements matching base design system
    const baseCardStyle = {
        background: 'rgba(23, 29, 43, 0.45)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 20,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
    };

    const expandedWrapperStyle = {
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: 24,
        marginTop: 18,
        animation: 'fadeIn 0.35s ease'
    };

    const dashboardTileStyle = {
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
    };

    const cardsData = [
        {
            id: 1,
            title: "Card 1: TTL & Expiration Policy",
            problem: "Set it too short and you hammer the database; set it too long and users see stale data.",
            solution: "Balanced TTL + Event-driven cache invalidation (Purge on write)."
        },
        {
            id: 2,
            title: "Card 2: Consistency & Desync",
            problem: "Concurrent writes and reads can leave the cache holding stale data indefinitely.",
            solution: "Cache-aside invalidation: Write to DB first, then delete key from Cache."
        },
        {
            id: 3,
            title: "Card 3: Single Point of Failure (SPOF)",
            problem: "If your cache server crashes, 100% of read traffic spikes your database, causing cascading failure.",
            solution: "Redis Cluster with Master/Replica replication and Sentinel auto-failover."
        },
        {
            id: 4,
            title: "Card 4: Eviction Policies",
            problem: "When cache memory fills up, which keys do you discard to make room for new ones?",
            solution: "LRU (Least Recently Used) for general cache, LFU (Least Frequently Used) for heavy hot keys."
        },
        {
            id: 5,
            title: "Card 5: Overprovisioning & Buffering",
            problem: "Sudden viral traffic spikes or DDoS attacks can double load, crashing unbuffered caches.",
            solution: "Overprovision to 150%+ capacity, shard keys, and implement Rate Limiting + circuit breakers."
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <VizHeader title="Five Interactive Expandable Cards" eyebrow="Cache Considerations Lab" />
            
            {/* Grid of 5 Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 16
            }}>
                {cardsData.map((c, index) => {
                    const isExpanded = expandedCard === c.id;
                    const gridSpan = index === 4 ? 'span 2' : 'span 1';
                    
                    return (
                        <div
                            key={c.id}
                            onClick={() => setExpandedCard(isExpanded ? null : c.id)}
                            style={{
                                ...baseCardStyle,
                                gridColumn: window.innerWidth > 768 ? gridSpan : 'auto',
                                borderColor: isExpanded ? '#00d4aa' : 'var(--border)',
                                boxShadow: isExpanded ? '0 0 20px rgba(0, 212, 170, 0.12)' : 'none',
                                transform: !isExpanded ? 'translateY(0)' : 'translateY(-2px)'
                            }}
                            onMouseEnter={(e) => {
                                if (!isExpanded) {
                                    e.currentTarget.style.borderColor = 'rgba(0, 212, 170, 0.45)';
                                    e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 212, 170, 0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isExpanded) {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ fontSize: 16, fontWeight: 900, color: isExpanded ? '#00d4aa' : '#ffffff' }}>
                                    {c.title}
                                </div>
                                <span style={{ fontSize: 16 }}>{isExpanded ? '▼' : '▶'}</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div>
                                    <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔴 The Problem:</span>
                                    <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.45 }}>{c.problem}</p>
                                </div>
                                
                                {isExpanded && (
                                    <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                                        <span style={{ color: '#34d399', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🟢 Recommended Approach:</span>
                                        <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#e2e8f0', lineHeight: 1.45 }}>{c.solution}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Render Expanded Simulator Panel */}
            {expandedCard !== null && (
                <div style={expandedWrapperStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa' }} />
                            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#ffffff' }}>
                                {cardsData.find(c => c.id === expandedCard)?.title} - Interactive Lab
                            </h3>
                        </div>
                        <button style={{ ...btnStyle, padding: '6px 12px', fontSize: 12, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} onClick={() => setExpandedCard(null)}>
                            Close Lab ✕
                        </button>
                    </div>

                    {/* Card 1 Simulator: TTL / Expiration Policy */}
                    {expandedCard === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                                <div style={dashboardTileStyle}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Database Load</span>
                                    <strong style={{ fontSize: 18, color: getTtlMetrics().loadColor }}>{getTtlMetrics().dbLoad}</strong>
                                </div>
                                <div style={dashboardTileStyle}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Stale Data Risk</span>
                                    <strong style={{ fontSize: 18, color: getTtlMetrics().staleColor }}>{getTtlMetrics().staleRisk}</strong>
                                </div>
                                <div style={dashboardTileStyle}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Configured TTL</span>
                                    <strong style={{ fontSize: 18, color: '#ffffff' }}>{getTtlLabel(ttl)}</strong>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 16, border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontSize: 13, fontWeight: 700 }}>
                                    <span>Drag to adjust TTL duration:</span>
                                    <span style={{ color: '#00d4aa' }}>{ttl}s</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="5" 
                                    max="86400" 
                                    step="5"
                                    value={ttl} 
                                    onChange={(e) => { setTtl(Number(e.target.value)); setTtlLog(''); }} 
                                    style={{ width: '100%', accentColor: '#00d4aa', cursor: 'pointer' }} 
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--text-muted)' }}>
                                    <span>5s (Too Short)</span>
                                    <span>10m (Balanced)</span>
                                    <span>24h (Too Long)</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <button 
                                    style={{ 
                                        ...btnStyle, 
                                        background: simulatingTtl ? 'rgba(255,255,255,0.05)' : 'rgba(0, 212, 170, 0.15)', 
                                        color: simulatingTtl ? 'var(--text-muted)' : '#00d4aa',
                                        flex: 1 
                                    }} 
                                    onClick={handleTtlTest}
                                    disabled={simulatingTtl}
                                >
                                    {simulatingTtl ? '⚡ Simulating Requests...' : 'Trigger Traffic Test (1000 users) 🚀'}
                                </button>
                                <button style={{ ...btnStyle, flex: 0.3 }} onClick={() => { setTtl(600); setTtlLog(''); }}>
                                    Reset Preset
                                </button>
                            </div>

                            {ttlLog && (
                                <pre style={{ 
                                    background: 'rgba(0,0,0,0.3)', 
                                    border: '1px solid var(--border)', 
                                    borderRadius: 14, 
                                    padding: 14, 
                                    fontSize: 12.5, 
                                    color: '#e2e8f0', 
                                    lineHeight: 1.6,
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'monospace'
                                }}>
                                    {ttlLog}
                                </pre>
                            )}
                        </div>
                    )}

                    {/* Card 2 Simulator: Consistency & Desync */}
                    {expandedCard === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Sequence Diagram Step Area */}
                            <div style={{ 
                                background: 'rgba(0,0,0,0.2)', 
                                border: '1px solid var(--border)', 
                                borderRadius: 16, 
                                padding: 20, 
                                minHeight: 220,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Step {raceStep + 1} of 6: {desyncSteps[raceStep].title}
                                    </span>
                                    <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 8, color: 'var(--text-light)', fontFamily: 'monospace' }}>
                                        {desyncSteps[raceStep].stateLabel}
                                    </span>
                                </div>

                                {/* Diagram Visualization */}
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: 110, position: 'relative' }}>
                                    {/* Client Threads */}
                                    <div style={{
                                        width: 100, height: 75, borderRadius: 12,
                                        background: raceStep >= 1 ? 'rgba(0,212,170,0.08)' : 'var(--bg-elevated)',
                                        border: `1px solid ${raceStep >= 1 ? '#00d4aa' : 'var(--border)'}`,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700
                                    }}>
                                        <div>👥 Clients</div>
                                        <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 4 }}>A, B, C</div>
                                    </div>

                                    {/* Cache Node */}
                                    <div style={{
                                        width: 100, height: 75, borderRadius: 12,
                                        background: (raceStep === 2 || raceStep === 3 || raceStep === 4) ? 'rgba(239, 68, 68, 0.08)' : raceStep === 5 ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-elevated)',
                                        border: `1px solid ${(raceStep === 2 || raceStep === 3 || raceStep === 4) ? '#ef4444' : raceStep === 5 ? '#f59e0b' : 'var(--border)'}`,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                                        boxShadow: raceStep === 5 ? '0 0 16px rgba(245, 158, 11, 0.2)' : 'none'
                                    }}>
                                        <div>⚡ Cache (Redis)</div>
                                        <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 4 }}>
                                            {raceStep === 0 ? '$10' : (raceStep === 1 ? '$10' : ((raceStep === 2 || raceStep === 3 || raceStep === 4) ? 'EMPTY' : '$20 (Stale)'))}
                                        </div>
                                    </div>

                                    {/* Database Node */}
                                    <div style={{
                                        width: 100, height: 75, borderRadius: 12,
                                        background: raceStep >= 1 ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-elevated)',
                                        border: `1px solid ${raceStep >= 1 ? '#3b82f6' : 'var(--border)'}`,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700
                                    }}>
                                        <div>🗄️ Database</div>
                                        <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 4 }}>
                                            {raceStep === 0 ? '$10' : (raceStep === 1 ? '$20' : (raceStep === 2 ? '$20' : (raceStep === 3 ? '$20' : '$30')))}
                                        </div>
                                    </div>

                                    {/* SVG Arrows to illustrate step flows */}
                                    <svg width="100%" height="100%" style={{ position: 'absolute', pointerEvents: 'none', inset: 0 }}>
                                        {raceStep === 1 && (
                                            <g>
                                                <path d="M 125 55 Q 225 90 325 55" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5 3" />
                                                <text x="210" y="85" fill="#3b82f6" fontSize="9.5" fontWeight="800">Write $20</text>
                                            </g>
                                        )}
                                        {raceStep === 2 && (
                                            <g>
                                                <line x1="125" y1="37" x2="225" y2="37" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 3" />
                                                <text x="145" y="30" fill="#ef4444" fontSize="9.5" fontWeight="800">Delete Key</text>
                                            </g>
                                        )}
                                        {raceStep === 3 && (
                                            <g>
                                                <path d="M 125 30 Q 225 5 325 30" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5 3" />
                                                <text x="200" y="15" fill="#3b82f6" fontSize="9.5" fontWeight="800">Read Miss → DB ($20)</text>
                                            </g>
                                        )}
                                        {raceStep === 4 && (
                                            <g>
                                                <path d="M 125 55 Q 225 90 325 55" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray="5 3" />
                                                <text x="180" y="85" fill="#a78bfa" fontSize="9.5" fontWeight="800">Client C Writes $30 & Evicts</text>
                                            </g>
                                        )}
                                        {raceStep === 5 && (
                                            <g>
                                                <line x1="125" y1="37" x2="225" y2="37" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />
                                                <text x="135" y="30" fill="#f59e0b" fontSize="9.5" fontWeight="800">Pollutes Cache ($20)</text>
                                            </g>
                                        )}
                                    </svg>
                                </div>

                                <p style={{ fontSize: 13.5, color: 'var(--text-gray)', lineHeight: 1.5, margin: '14px 0 0 0' }}>
                                    {desyncSteps[raceStep].desc}
                                </p>
                            </div>

                            {/* Stepper Controls */}
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                <button 
                                    style={btnStyle} 
                                    onClick={() => setRaceStep(Math.max(0, raceStep - 1))}
                                    disabled={raceStep === 0}
                                >
                                    ◀ Back
                                </button>
                                <button 
                                    style={{ ...btnStyle, background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }} 
                                    onClick={() => setRaceStep(0)}
                                >
                                    Reset Walkthrough
                                </button>
                                <button 
                                    style={btnStyle} 
                                    onClick={() => setRaceStep((raceStep + 1) % desyncSteps.length)}
                                    disabled={raceStep === desyncSteps.length - 1}
                                >
                                    Next Step ▶
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Card 3 Simulator: SPOF & Sentinel Replication */}
                    {expandedCard === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Failover Policy Toggle */}
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 14, border: '1px solid var(--border)' }}>
                                <input 
                                    type="checkbox" 
                                    id="failover_check" 
                                    checked={failoverEnabled} 
                                    onChange={(e) => {
                                        setFailoverEnabled(e.target.checked);
                                        setCacheStatus('healthy');
                                        setSentinelState('idle');
                                    }}
                                    style={{ width: 16, height: 16, accentColor: '#00d4aa', cursor: 'pointer' }}
                                />
                                <label htmlFor="failover_check" style={{ color: 'var(--text-light)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                    Enable Redis Sentinel Active Failover & Replication (Avoids SPOF)
                                </label>
                            </div>

                            {/* Dashboard Status */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                                <div style={dashboardTileStyle}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Primary Cache Node</span>
                                    <strong style={{ fontSize: 15, color: cacheStatus === 'healthy' ? '#00d4aa' : '#ef4444' }}>
                                        {cacheStatus === 'healthy' ? '⚡ ONLINE' : '❌ OFFLINE (CRASHED)'}
                                    </strong>
                                </div>
                                <div style={dashboardTileStyle}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Database CPU Load</span>
                                    <strong style={{ fontSize: 15, color: cacheStatus === 'healthy' ? '#34d399' : '#ef4444' }}>
                                        {cacheStatus === 'healthy' ? '5% (Healthy)' : '100% (CRITICAL OVERLOAD)'}
                                    </strong>
                                </div>
                                <div style={dashboardTileStyle}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Sentinel Failover Cluster</span>
                                    <strong style={{ fontSize: 15, color: sentinelState === 'promoting' ? '#fbbf24' : '#60a5fa' }}>
                                        {sentinelState === 'promoting' ? '🔄 PROMOTING REPLICA...' : sentinelState === 'replica_active' ? '✓ RECOVERY ACTIVE' : 'IDLE'}
                                    </strong>
                                </div>
                            </div>

                            {/* Node flow diagram */}
                            <div style={{ 
                                height: 160, 
                                border: '1px solid var(--border)', 
                                borderRadius: 16, 
                                background: 'rgba(0,0,0,0.15)',
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                position: 'relative'
                            }}>
                                {/* Client Node */}
                                <div style={{ width: 85, height: 60, borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700 }}>Clients</span>
                                </div>

                                {/* Cache Server */}
                                <div style={{ 
                                    width: 100, 
                                    height: 70, 
                                    borderRadius: 10, 
                                    background: cacheStatus === 'healthy' ? 'rgba(0, 212, 170, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                                    border: `2px dashed ${cacheStatus === 'healthy' ? '#00d4aa' : '#ef4444'}`,
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    zIndex: 2,
                                    opacity: cacheStatus === 'healthy' ? 1 : 0.4
                                }}>
                                    <span style={{ fontSize: 12, fontWeight: 800 }}>Redis Primary</span>
                                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{cacheStatus === 'healthy' ? 'Port 6379' : 'Crashed'}</span>
                                </div>

                                {/* Replica Cache Node (conditional on replication or failover) */}
                                {failoverEnabled && (
                                    <div style={{ 
                                        width: 100, 
                                        height: 70, 
                                        borderRadius: 10, 
                                        background: sentinelState === 'replica_active' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)', 
                                        border: `2px solid ${sentinelState === 'replica_active' ? '#3b82f6' : 'var(--border)'}`,
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        zIndex: 2
                                    }}>
                                        <span style={{ fontSize: 11, fontWeight: 800 }}>Redis Replica</span>
                                        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{sentinelState === 'replica_active' ? 'PROMOTED' : 'Syncing...'}</span>
                                    </div>
                                )}

                                {/* MySQL DB */}
                                <div style={{ 
                                    width: 85, 
                                    height: 60, 
                                    borderRadius: 10, 
                                    background: cacheStatus === 'healthy' ? 'rgba(255,255,255,0.02)' : 'rgba(239, 68, 68, 0.12)', 
                                    border: `2px solid ${cacheStatus === 'healthy' ? 'var(--border)' : '#ef4444'}`,
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    zIndex: 2
                                }}>
                                    <span style={{ fontSize: 12, fontWeight: 700 }}>MySQL DB</span>
                                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{cacheStatus === 'healthy' ? 'CPU 5%' : 'CPU 100%'}</span>
                                </div>

                                {/* Flow indicator paths */}
                                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                                    {cacheStatus === 'healthy' && sentinelState !== 'promoting' && (
                                        <g>
                                            {/* Clients to Cache */}
                                            <line x1="140" y1="80" x2="210" y2="80" stroke="#00d4aa" strokeWidth="2.5" strokeDasharray="5 3" />
                                            {/* Cache hits flow */}
                                            <line x1="310" y1="80" x2="410" y2="80" stroke="#34d399" strokeWidth="1.5" />
                                        </g>
                                    )}
                                    {cacheStatus === 'crashed' && sentinelState !== 'promoting' && !failoverEnabled && (
                                        <g>
                                            {/* Bypassing cache, straight to DB */}
                                            <path d="M 140 90 Q 280 140 410 90" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 3" />
                                            <text x="250" y="130" fill="#ef4444" fontSize="10.5" fontWeight="800">100% Cache Misses Hammering DB!</text>
                                        </g>
                                    )}
                                    {sentinelState === 'promoting' && (
                                        <g>
                                            <text x="180" y="30" fill="#fbbf24" fontSize="11" fontWeight="900" animate="pulse">🔄 Failover: Sentinel promoting Replica to Master...</text>
                                        </g>
                                    )}
                                </svg>
                            </div>

                            {/* Action Button */}
                            <button 
                                style={{ 
                                    ...btnStyle, 
                                    background: cacheStatus === 'healthy' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 212, 170, 0.15)', 
                                    color: cacheStatus === 'healthy' ? '#ef4444' : '#00d4aa' 
                                }} 
                                onClick={triggerSPOFAction}
                                disabled={sentinelState === 'promoting'}
                            >
                                {sentinelState === 'promoting' 
                                    ? 'Sentinels working...' 
                                    : cacheStatus === 'healthy' 
                                        ? '⚠️ Simulate Primary Cache Node Crash!' 
                                        : 'Restore Cache Server Node'}
                            </button>
                        </div>
                    )}

                    {/* Card 4 Simulator: Eviction Policy Queue */}
                    {expandedCard === 4 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Policy Selector tabs */}
                            <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4 }}>
                                {['LRU', 'LFU', 'FIFO'].map(policy => (
                                    <button 
                                        key={policy} 
                                        style={{ 
                                            ...tabStyle, 
                                            background: evictionPolicy === policy ? 'var(--bg-surface)' : 'transparent', 
                                            color: evictionPolicy === policy ? '#00d4aa' : 'var(--text-muted)' 
                                        }} 
                                        onClick={() => { setEvictionPolicy(policy); setLastEvicted(null); }}
                                    >
                                        {policy} Policy
                                    </button>
                                ))}
                            </div>

                            {/* Policy explanation */}
                            <div style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 12, border: '1px solid var(--border)' }}>
                                {evictionPolicy === 'LRU' && "🧠 LRU (Least Recently Used): Discards the key that hasn't been accessed for the longest period of time. Recommended for general usage."}
                                {evictionPolicy === 'LFU' && "📊 LFU (Least Frequently Used): Discards the key with the smallest total access count. Great for shielding persistent hot entries."}
                                {evictionPolicy === 'FIFO' && "⏱️ FIFO (First In First Out): Discards the oldest key based solely on when it entered the cache, ignoring access habits."}
                            </div>

                            {/* Active Cache Memory slots (Grid of 4) */}
                            <div>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
                                    Active Cache Memory (Capacity: 4 Slots)
                                </span>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                                    {cacheKeys.map((k, idx) => (
                                        <div 
                                            key={k.name} 
                                            onClick={() => handleAccessKey(idx)}
                                            style={{
                                                background: 'rgba(30, 41, 59, 0.4)',
                                                border: '1px dashed var(--border)',
                                                borderRadius: 14,
                                                padding: 12,
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.25s',
                                                position: 'relative'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00d4aa'}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                        >
                                            <div style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', marginBottom: 6 }}>{k.name}</div>
                                            <div style={{ fontSize: 10.5, color: '#00d4aa', fontWeight: 800 }}>Hits: {k.frequency}x</div>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Last: t={k.accessedAt}</div>
                                            <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 6 }}>👉 Click to GET</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Area */}
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <button 
                                    style={{ ...btnStyle, background: 'rgba(0, 212, 170, 0.15)', color: '#00d4aa', flex: 1 }} 
                                    onClick={handleEvictAndInsert}
                                >
                                    Insert Next Key (Simulate PUT Cache Miss) ➔
                                </button>
                                <button 
                                    style={btnStyle}
                                    onClick={() => {
                                        setCacheKeys([
                                            { name: 'Key A', frequency: 3, insertedAt: 1, accessedAt: 4 },
                                            { name: 'Key B', frequency: 1, insertedAt: 2, accessedAt: 3 },
                                            { name: 'Key C', frequency: 5, insertedAt: 3, accessedAt: 5 },
                                            { name: 'Key D', frequency: 2, insertedAt: 4, accessedAt: 2 },
                                        ]);
                                        setTimeCounter(6);
                                        setLastEvicted(null);
                                    }}
                                >
                                    Reset Queue
                                </button>
                            </div>

                            {/* Eviction logs */}
                            {lastEvicted && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: 12, borderRadius: 12, color: '#ef4444', fontSize: 12.5, fontWeight: 800 }}>
                                    💥 EVICTION TRIGGERED: Discarded [{lastEvicted}] to allocate memory slots for new key!
                                </div>
                            )}
                        </div>
                    )}

                    {/* Card 5 Simulator: Overprovisioning Buffer */}
                    {expandedCard === 5 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                                <div style={dashboardTileStyle}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Casing Capacity Limit</span>
                                    <strong style={{ fontSize: 18, color: '#ffffff' }}>{buffer}% Capacity</strong>
                                </div>
                                <div style={dashboardTileStyle}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Transient Spike Load</span>
                                    <strong style={{ fontSize: 18, color: spikeLoad > buffer ? '#ef4444' : '#00d4aa' }}>{spikeLoad}% Traffic Load</strong>
                                </div>
                                <div style={dashboardTileStyle}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Memory Protection status</span>
                                    <strong style={{ fontSize: 18, color: spikeState === 'crashed' ? '#ef4444' : spikeState === 'stable' ? '#00d4aa' : '#60a5fa' }}>
                                        {spikeState === 'idle' ? 'IDLE' : spikeState === 'spiking' ? '⚡ ABSORBING SPIKE...' : spikeState === 'crashed' ? '🛑 OUT OF MEMORY CRASH' : '✓ SPIKE ABSORBED'}
                                    </strong>
                                </div>
                            </div>

                            {/* Config buffer bar */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 16, border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontSize: 13, fontWeight: 700 }}>
                                    <span>Set Overprovision Capacity Buffer:</span>
                                    <span style={{ color: '#00d4aa' }}>{buffer}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="100" 
                                    max="200" 
                                    step="10"
                                    value={buffer} 
                                    onChange={(e) => { setBuffer(Number(e.target.value)); resetSpike(); }} 
                                    style={{ width: '100%', accentColor: '#00d4aa', cursor: 'pointer' }} 
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--text-muted)' }}>
                                    <span>100% (No Buffer)</span>
                                    <span>150% (Standard Overprovision)</span>
                                    <span>200% (High Resilience Sharded)</span>
                                </div>
                            </div>

                            {/* Interactive progress bar representing current spike capacity usage */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--text-light)' }}>
                                    <span>Live Memory Utilization:</span>
                                    <span>{Math.round((spikeLoad / buffer) * 100)}%</span>
                                </div>
                                <div style={{ width: '100%', height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ 
                                        width: `${Math.min(100, (spikeLoad / buffer) * 100)}%`, 
                                        height: '100%', 
                                        background: (spikeLoad / buffer) > 1.0 ? 'linear-gradient(90deg, #ef4444, #b91c1c)' : (spikeLoad / buffer) > 0.8 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #00d4aa, #34d399)',
                                        transition: 'width 0.15s ease'
                                    }} />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button 
                                    style={{ ...btnStyle, background: spikeState === 'spiking' ? 'var(--bg-elevated)' : 'rgba(0, 212, 170, 0.15)', color: '#00d4aa', flex: 1 }} 
                                    onClick={triggerSpike}
                                    disabled={spikeState === 'spiking'}
                                >
                                    {spikeState === 'spiking' ? '⚡ Spiking Load...' : 'Trigger Instant 1.2x Traffic Spike (Viral Post) 🚀'}
                                </button>
                                <button style={btnStyle} onClick={resetSpike}>
                                    Reset Simulation
                                </button>
                            </div>

                            {/* Visual Alert logs based on spikeState */}
                            {spikeState === 'crashed' && (
                                <div style={{ 
                                    background: 'rgba(239, 68, 68, 0.08)', 
                                    border: '1px solid rgba(239, 68, 68, 0.25)', 
                                    borderRadius: 14, 
                                    padding: 16, 
                                    color: '#ef4444', 
                                    lineHeight: 1.55 
                                }}>
                                    <strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>🚨 OUT OF MEMORY (OOM) CRITICAL ERROR!</strong>
                                    Cache had 100% capacity and was completely exhausted by the 120% surge. Primary node died, triggering database thrashing.
                                </div>
                            )}

                            {spikeState === 'stable' && (
                                <div style={{ 
                                    background: 'rgba(0, 212, 170, 0.08)', 
                                    border: '1px solid rgba(0, 212, 170, 0.25)', 
                                    borderRadius: 14, 
                                    padding: 16, 
                                    color: '#00d4aa', 
                                    lineHeight: 1.55 
                                }}>
                                    <strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>✓ SPIKE SUCCESSFULLY ABSORBED!</strong>
                                    Thanks to {buffer}% overprovisioning, memory usage peaked at {Math.round((120 / buffer) * 100)}%, remaining stable. No downtime.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function GenericVisualSpecWidget({ spec, type }) {
    const title = spec?.title || type || 'Interactive visualization';
    const [activeTab, setActiveTab] = useState('concept');
    const [openSpec, setOpenSpec] = useState(false);
    const [hoveredTab, setHoveredTab] = useState(null);

    const tabs = [
        { id: 'concept', label: 'Concept', sub: 'what it solves', color: '#00d4aa' },
        { id: 'trade-off', label: 'Trade-off', sub: 'what you pay', color: '#f59e0b' },
        { id: 'interview angle', label: 'Interview angle', sub: 'how to explain it', color: '#a78bfa' }
    ];

    const currentDetails = getSpecContentForTab(spec, activeTab);
    const rawDetails = Object.entries(spec || {}).filter(([key]) => !['title', 'type'].includes(key));

    return (
        <div style={containerStyle}>
            <VizHeader title={title} eyebrow="Spec-driven visual" />
            
            {/* Clickable Premium Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    const isHovered = hoveredTab === tab.id;
                    const tabColor = tab.color;
                    
                    return (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            onMouseEnter={() => setHoveredTab(tab.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                            style={{
                                minWidth: 112,
                                flex: '1 1 112px',
                                padding: '14px 12px',
                                borderRadius: 14,
                                border: `1px solid ${isActive ? tabColor : isHovered ? `${tabColor}66` : 'var(--border)'}`,
                                background: isActive ? `${tabColor}10` : isHovered ? `${tabColor}06` : 'var(--bg-elevated)',
                                color: isActive ? tabColor : isHovered ? '#ffffff' : 'var(--text-gray)',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                boxShadow: isActive ? `0 0 12px ${tabColor}15` : 'none',
                                transform: isHovered && !isActive ? 'translateY(-1px)' : 'none',
                            }}
                        >
                            <div style={{ fontSize: 13, fontWeight: 850, marginBottom: 4 }}>{tab.label}</div>
                            <div style={{ fontSize: 10.5, color: isActive ? `${tabColor}bb` : 'var(--text-muted)', lineHeight: 1.35 }}>
                                {tab.sub}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Dynamic Content Card */}
            <div style={{
                background: 'rgba(30, 41, 59, 0.3)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: 18,
                marginBottom: 16,
                animation: 'fadeIn 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: tabs.find(t => t.id === activeTab).color,
                        boxShadow: `0 0 8px ${tabs.find(t => t.id === activeTab).color}`
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: tabs.find(t => t.id === activeTab).color, letterSpacing: '0.05em' }}>
                        Selected Section: {activeTab}
                    </span>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                    {currentDetails.length > 0 ? (
                        currentDetails.map(({ key, value }) => (
                            <div key={key} style={{
                                background: 'var(--bg-elevated)',
                                border: '1px solid rgba(255,255,255,0.03)',
                                borderRadius: 12,
                                padding: 14,
                                transition: 'all 0.2s'
                            }}>
                                <div style={{ fontSize: 11, color: '#93c5fd', fontWeight: 800, textTransform: 'capitalize', marginBottom: 6 }}>
                                    {key.replace(/[-_]/g, ' ')}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5 }}>
                                    {renderSpecValue(String(value))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', padding: '10px 0' }}>
                            No specific parameters defined for this section.
                        </div>
                    )}
                </div>
            </div>

            {/* Debug Spec Dump Toggle */}
            <button style={btnStyle} onClick={() => setOpenSpec(!openSpec)}>
                {openSpec ? 'Hide' : 'Show'} raw visualization spec
            </button>
            {openSpec && (
                <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
                    {rawDetails.map(([key, value]) => (
                        <div key={key} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
                            <div style={{ fontSize: 10, color: '#00d4aa', fontWeight: 900, textTransform: 'uppercase', marginBottom: 5 }}>{key}</div>
                            <div style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.45 }}>{String(value)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


/* =========================================================================
   Export Master Router Component
   ========================================================================= */
export default function SystemDesignVisualizer({ type, spec }) {
    // Normalise casing and spacing
    const lowerType = type ? type.trim().toLowerCase() : '';
    const specTitle = spec?.title ? spec.title.trim().toLowerCase() : '';

    switch (lowerType) {
        case 'five interactive expandable cards':
            return <FiveExpandableCardsWidget />;
        case 'step-by-step request flow':
            return <RequestFlowWidget />;
        case 'cards/table comparison':
            return <RelationalNoSqlWidget />;
        case 'animated cache hit/miss simulation':
            return <CacheHitMissWidget />;
        case 'interactive geo-map simulation':
            return <CdnGeoMapWidget />;
        case 'active interactive architecture diagram':
            return <StatefulStatelessWidget />;
        case 'interactive map-based failover simulator':
            return <GeoDnsFailoverWidget />;
        case 'queue pipeline simulator':
            return <MessageQueueWidget />;
        case 'interactive horizontal scaling timeline slider':
            return <ScalingTimelineWidget />;
        case 'horizontal logarithmic bar chart':
            return <LatencyBarChartWidget />;
        case 'interactive availability calculator':
            return <AvailabilityCalculatorWidget />;
        case 'interactive step-by-step estimator':
            return <TwitterEstimatorWidget />;
        case 'four-stage horizontal pipeline diagram':
            return <InterviewFrameworkWidget />;
        case 'two-column visual reference card':
            return <DosAndDontsWidget />;

        // Rate Limiter Case Handlers (Chapter 4)
        case 'static three-panel illustration with hover tooltips':
            return <RateLimiterArchitecture mode="bouncer" />;
        case 'three-way animated topology layout':
            return <RateLimiterArchitecture mode="placement" />;
        case 'interactive input form':
            return <RateLimiterArchitecture mode="requirements" />;
        case 'interactive token counter sandbox':
            return <RateLimiterSandbox initialAlgo="token-bucket" />;
        case 'interactive queue pipeline simulator':
            return <RateLimiterSandbox initialAlgo="leaking-bucket" />;
        case 'interactive grid cell simulator':
            return <RateLimiterSandbox initialAlgo="fixed-window" />;
        case 'interactive timeline log simulator':
            return <RateLimiterSandbox initialAlgo="sliding-window-log" />;
        case 'interactive window grid simulator':
            return <RateLimiterSandbox initialAlgo="sliding-window-counter" />;
        case 'dynamic slider-based radar chart':
            return <RateLimiterSandbox initialAlgo="token-bucket" showComparison={true} />;
        case 'active client-server middleware diagram':
            return <RateLimiterArchitecture mode="middleware" />;
        case 'interactive syntax-highlighted rule configuration editor':
            return <RateLimiterArchitecture mode="rules" />;
        case 'interactive header and status code reference table':
            return <RateLimiterArchitecture mode="headers" />;
        case 'interactive concurrency simulation':
            return <RateLimiterArchitecture mode="concurrency" />;
        case 'distributed cluster mapping visualizer':
            return <RateLimiterArchitecture mode="concurrency" />;
        case 'performance dashboard simulator':
            return <RateLimiterArchitecture mode="concurrency" />;
        case 'live charts simulator':
            return <RateLimiterArchitecture mode="concurrency" />;
        case 'compare cards toggle':
            return <RateLimiterArchitecture mode="bouncer" />;
        case 'horizontal layer stack':
            return <RateLimiterArchitecture mode="placement" />;
        case 'two-column dashboard mock':
            return <RateLimiterArchitecture mode="placement" />;

        // Consistent Hashing Case Handlers (Chapter 5)
        case 'animated side-by-side table transformation':
            return <HashingComparison mode="modular-transform" />;
        case 'comparison stat card':
            return <HashingComparison mode="comparison-card" />;
        case 'two-step animated transformation':
            return <ConsistentHashingRing mode="bend" />;
        case 'static labeled ring diagram':
            return <ConsistentHashingRing mode="ring" />;
        case 'ring diagram with keys added to sub-topic 4\'s server ring':
            return <ConsistentHashingRing mode="keys" />;
        case 'interactive ring with animated clockwise arrows':
            return <ConsistentHashingRing mode="arrows" />;
        case 'animated ring with "add server" button':
            return <ConsistentHashingRing mode="add" />;
        case 'animated ring with "remove server" button':
            return <ConsistentHashingRing mode="remove" />;
        case 'two-ring side-by-side comparison':
            return <ConsistentHashingRing mode="hotspots" />;
        case 'interactive ring with virtual node slider':
            return <ConsistentHashingRing mode="vnodes" />;
        case 'interactive ring with "add server" and "remove server" buttons with arc highlighting':
            return <ConsistentHashingRing mode="sandbox" />;
        case 'three-card benefit showcase':
            return <HashingComparison mode="benefits" />;
        case 'five expandable cards, one per system':
            return <HashingComparison mode="real-world" />;

        // Session 3: Key-value store + distributed ID generation
        case 'animated demo table':
            return <KeyValueTableAnimator />;
        case 'animated capacity visualizer':
            return <SingleServerMemoryFill />;
        case 'clickable vertex triangle':
            return <CapTriangleWidget />;
        case 'side-by-side animated scenario':
            return <CapTriangleWidget />;
        case 'interactive hierarchical diagram':
            return <SummaryMatrixWidget />;
        case 'animated ring with datacenter overlay':
            return <RingReplicationWidget mode="replication" />;
        case 'interactive sliders with live visual':
            return <QuorumCalculatorWidget />;
        case 'interactive spectrum bar with system placement':
            return <ConsistencySpectrumWidget />;
        case 'animated before/after versioning flow':
            return <VersioningTimelineWidget />;
        case 'animated 5-step timeline with conflict highlight':
            return <VersioningTimelineWidget vector />;
        case 'animated propagating heartbeats':
            return <FlowSimulationWidget kind="gossip" />;
        case '3-step animated scenario':
            return <FlowSimulationWidget kind="sloppy" />;
        case '4-step interactive tree construction + sync comparison':
            return <FlowSimulationWidget kind="merkle" />;
        case 'animated multi-dc scenario':
            return <FlowSimulationWidget kind="dc" />;
        case 'clickable component diagram':
            return <FlowSimulationWidget kind="architecture" />;
        case 'animated 3-stage pipeline with crash recovery path':
            return <FlowSimulationWidget kind="write" />;
        case 'two-path animated flow':
            return <FlowSimulationWidget kind="read" />;
        case 'clickable, color-coded summary table':
            return <SummaryMatrixWidget />;
        case 'three-panel failure diagram (click to expand each)':
            return <FlowSimulationWidget kind="autoid" />;
        case 'annotated requirements table':
            return <IdApproachWidget mode="requirements" />;
        case 'animated dual-server id generation':
            return <IdApproachWidget mode="multimaster" />;
        case 'uuid breakdown with b-tree comparison':
            return <IdApproachWidget mode="uuid" />;
        case 'spof failure animation':
            return <IdApproachWidget mode="ticket" />;
        case '64-bit interactive id with live generator':
            return <SnowflakeBitsWidget />;
        case 'timeline with bit-shift demonstration':
            return <SnowflakeBitsWidget mode="timestamp" />;
        case 'millisecond-level counter animation':
            return <SnowflakeBitsWidget mode="sequence" />;
        case 'animated clock comparison':
            return <FlowSimulationWidget kind="clock" />;
        case 'interactive bit allocation editor':
            return <SectionTuningWidget />;
        case 'failure simulation with load balancer':
            return <FlowSimulationWidget kind="ha" />;

        default:
            if (specTitle.includes('consistent hash ring')) return <RingReplicationWidget />;
            if (spec) return <GenericVisualSpecWidget spec={spec} type={type} />;
            return null;
    }
}
