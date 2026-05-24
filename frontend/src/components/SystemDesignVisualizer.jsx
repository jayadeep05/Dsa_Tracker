import { useState, useEffect, useRef } from 'react';

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
                        <line x1="15%" y1="50%" x2="40%" y2="50%" stroke={steps[step].activePath.includes('dns') ? '#00d4aa' : 'var(--text-dim)'} strokeWidth="3" strokeDasharray={steps[step].activePath.includes('dns') ? "6 4" : "none"} />
                        {/* Browser to Web Server */}
                        <path d="M 15% 55% Q 30% 85% 65% 55%" fill="none" stroke={steps[step].activePath === 'browser-to-web' || steps[step].activePath === 'web-to-browser' ? '#00d4aa' : 'var(--text-dim)'} strokeWidth="3" strokeDasharray={steps[step].activePath === 'browser-to-web' || steps[step].activePath === 'web-to-browser' ? "6 4" : "none"} />
                        {/* Web Server to DB */}
                        <line x1="65%" y1="50%" x2="90%" y2="50%" stroke={steps[step].activePath.includes('db') ? '#00d4aa' : 'var(--text-dim)'} strokeWidth="3" strokeDasharray={steps[step].activePath.includes('db') ? "6 4" : "none"} />
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
    const [flippedCard, setFlippedCard] = useState(null);

    const nosqlCards = [
        {
            id: 1,
            title: "🔑 Key-Value Stores",
            products: "Redis, Amazon DynamoDB, Memcached",
            front: "Superfast dictionary lookups using a key.",
            back: "Sub-millisecond latency. Ideal for user session caches, shopping carts, and rate limiters.",
            color: "#3b82f6"
        },
        {
            id: 2,
            title: "📄 Document Stores",
            products: "MongoDB, CouchDB",
            front: "Store data as flexible, schema-free JSON/BSON documents.",
            back: "Elegantly handles variable user attributes and content catalogs. Supports rich query APIs.",
            color: "#00d4aa"
        },
        {
            id: 3,
            title: "📊 Column-Family Stores",
            products: "Apache Cassandra, HBase",
            front: "Store columns of data together, optimized for writes.",
            back: "Massive write performance at petabyte scale (IoT logs, chat history, Netflix viewing metrics).",
            color: "#f59e0b"
        },
        {
            id: 4,
            title: "🕸️ Graph Stores",
            products: "Neo4j, Amazon Neptune",
            front: "Store nodes and edges (relationships) as primary entities.",
            back: "Blazing fast for relationship-heavy data (social graphs, recommendation engines, fraud rings).",
            color: "#a78bfa"
        }
    ];

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>📊 Relational vs NoSQL Interactive Lab</div>

            {/* Static Comparison Table */}
            <div style={{ overflowX: 'auto', marginBottom: 24, border: '1px solid var(--border)', borderRadius: 16, background: 'var(--bg-elevated)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: 'var(--text-light)', minWidth: 600 }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,212,170,0.05)' }}>
                            <th style={{ padding: 12, textAlign: 'left', color: '#00d4aa', fontWeight: 800 }}>Feature</th>
                            <th style={{ padding: 12, textAlign: 'left', color: '#00d4aa', fontWeight: 800 }}>Relational (SQL)</th>
                            <th style={{ padding: 12, textAlign: 'left', color: '#a78bfa', fontWeight: 800 }}>Non-Relational (NoSQL)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: 10, fontWeight: 700, color: 'var(--text-gray)' }}>Data Model</td>
                            <td style={{ padding: 10 }}>Structured tables (Rows & Columns)</td>
                            <td style={{ padding: 10 }}>Flexible (Key-Value, Document, Column, Graph)</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: 10, fontWeight: 700, color: 'var(--text-gray)' }}>Schema</td>
                            <td style={{ padding: 10 }}>Strict, predefined (Schema-on-write)</td>
                            <td style={{ padding: 10 }}>Flexible, dynamic (Schema-on-read)</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: 10, fontWeight: 700, color: 'var(--text-gray)' }}>JOINs Support</td>
                            <td style={{ padding: 10, color: '#00d4aa' }}>Native, powerful support</td>
                            <td style={{ padding: 10, color: '#ef4444' }}>Generally not supported (De-normalize)</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: 10, fontWeight: 700, color: 'var(--text-gray)' }}>Transactions</td>
                            <td style={{ padding: 10, color: '#00d4aa' }}>ACID compliant (Strongly consistent)</td>
                            <td style={{ padding: 10, color: '#f59e0b' }}>BASE model (Eventually consistent)</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: 10, fontWeight: 700, color: 'var(--text-gray)' }}>Scaling</td>
                            <td style={{ padding: 10 }}>Vertical (Horizontal requires sharding)</td>
                            <td style={{ padding: 10, color: '#a78bfa' }}>Horizontal (Native scale-out support)</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 10, fontWeight: 700, color: 'var(--text-gray)' }}>Best For</td>
                            <td style={{ padding: 10 }}>Ledgers, E-commerce, rigid structures</td>
                            <td style={{ padding: 10 }}>Real-time feeds, big data, fast changes</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-light)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                🗂️ Explore the 4 Types of NoSQL Databases:
            </div>

            {/* Grid of Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {nosqlCards.map(c => {
                    const isFlipped = flippedCard === c.id;
                    return (
                        <div key={c.id} onClick={() => setFlippedCard(isFlipped ? null : c.id)}
                            style={{
                                height: 180,
                                position: 'relative',
                                cursor: 'pointer',
                                perspective: 1000
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                borderRadius: 16,
                                border: `1px solid ${isFlipped ? c.color : 'var(--border)'}`,
                                boxShadow: isFlipped ? `0 0 16px ${c.color}25` : 'none'
                            }}>
                                {/* Front Face */}
                                <div style={{
                                    ...cardFaceStyle,
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)'
                                }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: c.color, marginBottom: 8 }}>{c.title}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-gray)', fontStyle: 'italic', marginBottom: 12 }}>{c.products}</div>
                                    <div style={{ fontSize: 13, lineHeight: 1.5, textAlign: 'center', padding: '0 8px' }}>{c.front}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 12 }}>👉 Click to flip for Deep Dive</div>
                                </div>

                                {/* Back Face */}
                                <div style={{
                                    ...cardFaceStyle,
                                    background: `${c.color}08`,
                                    transform: 'rotateY(180deg)',
                                    color: 'var(--text-light)'
                                }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: c.color, marginBottom: 8 }}>⚡ Practical Insights</div>
                                    <div style={{ fontSize: 12.8, lineHeight: 1.45, textAlign: 'center', padding: '0 8px' }}>{c.back}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 12 }}>👈 Click to flip back</div>
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
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 16px', minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
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
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', height: 200, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 20 }}>
                
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, background: 'var(--bg-elevated)', padding: 20, borderRadius: 20, border: '1px solid var(--border)' }}>
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
                                <div style={{ fontSize: 11, background: 'var(--code-bg)', padding: '4px 6px', borderRadius: 4, minHeight: 20, color: '#ef4444' }}>
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
                                <div style={{ fontSize: 11, background: 'var(--code-bg)', padding: '4px 6px', borderRadius: 4, minHeight: 20, color: '#ef4444' }}>
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
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, height: 210, position: 'relative', overflow: 'hidden' }}>
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
                    <line x1="20%" y1="75%" x2="50%" y2="25%" stroke="var(--text-dim)" strokeWidth="2" />
                    {/* East Client → DNS Router */}
                    <line x1="80%" y1="75%" x2="50%" y2="25%" stroke="var(--text-dim)" strokeWidth="2" />

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
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, minHeight: 140, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
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
    const [baseSeconds, setBaseSeconds] = useState(1); // Baseline L1 Cache speed in seconds for proportional simulation

    const latencies = [
        { 
            name: "L1 Cache Reference", 
            ns: 0.5, 
            desc: "Fastest possible on-CPU data fetch. Highly optimized registers and silicon.",
            metaphor: "Grabbing a book that is already open on your desk.",
            scaleSpeed: "0.5 seconds",
            proportionalText: "1 second"
        },
        { 
            name: "Branch Mispredict", 
            ns: 5, 
            desc: "CPU guessed the next instruction path wrong; must flush pipeline and backtrack.",
            metaphor: "Making a simple spelling error and pressing backspace once.",
            scaleSpeed: "5 seconds",
            proportionalText: "10 seconds"
        },
        { 
            name: "L2 Cache Reference", 
            ns: 7, 
            desc: "Slightly farther off-core CPU cache lookup.",
            metaphor: "Reaching out to grab a book from a shelf next to your desk.",
            scaleSpeed: "7 seconds",
            proportionalText: "14 seconds"
        },
        { 
            name: "Mutex Lock/Unlock", 
            ns: 25, 
            desc: "Thread synchronization locking overhead. Avoid locks in hot codepaths.",
            metaphor: "Opening a locked cash box on your desk to store a note.",
            scaleSpeed: "25 seconds",
            proportionalText: "50 seconds"
        },
        { 
            name: "Main Memory (RAM)", 
            ns: 100, 
            desc: "Fetching data from RAM chips. 200x slower than L1 cache!",
            metaphor: "Walking down the hallway to the local office library.",
            scaleSpeed: "1.6 minutes",
            proportionalText: "3.3 minutes"
        },
        { 
            name: "Compress 1KB (Snappy)", 
            ns: 3000, 
            desc: "Fast CPU compression. Strongly recommended before transmitting large payloads over network.",
            metaphor: "Neatly folding a shirt and packaging it inside a small box.",
            scaleSpeed: "50 minutes",
            proportionalText: "1.6 hours"
        },
        { 
            name: "Read 1MB sequentially from RAM", 
            ns: 250000, 
            desc: "Sequential memory access is incredibly fast due to caching prefetchers.",
            metaphor: "Reading an entire page of a book very carefully and taking detailed notes.",
            scaleSpeed: "2.9 days",
            proportionalText: "5.8 days"
        },
        { 
            name: "Read 4KB randomly from SSD", 
            ns: 150000, 
            desc: "Fetching a small chunk from NVMe flash storage.",
            metaphor: "Walking across town to the city public library to check one reference.",
            scaleSpeed: "1.7 days",
            proportionalText: "3.5 days"
        },
        { 
            name: "Send packet in same Datacenter", 
            ns: 500000, 
            desc: "Network packet roundtrip within the same local building or availability zone.",
            metaphor: "A local courier driving a document across town to a warehouse.",
            scaleSpeed: "5.8 days",
            proportionalText: "11.6 days"
        },
        { 
            name: "Read 1MB sequentially from SSD", 
            ns: 1000000, 
            desc: "Fast sequential NVMe SSD reads. 4x slower than RAM sequence reads.",
            metaphor: "Driving out of town to a university campus library.",
            scaleSpeed: "11.5 days",
            proportionalText: "23 days"
        },
        { 
            name: "Disk Seek (Mechanical HDD)", 
            ns: 10000000, 
            desc: "Mechanical platter seek arm moving. Extremely slow, avoid for real-time traffic.",
            metaphor: "Taking a cross-continental flight to look up a book in a foreign country.",
            scaleSpeed: "115 days (almost 4 months!)",
            proportionalText: "231 days"
        },
        { 
            name: "Roundtrip USA → Europe", 
            ns: 150000000, 
            desc: "Speed of light in fiber optic glass limits across undersea cabling. Multi-region latency.",
            metaphor: "Boarding a spacecraft, flying to the Moon, and returning to Earth.",
            scaleSpeed: "4.8 years",
            proportionalText: "9.5 years!"
        }
    ];

    // Get color dynamically based on exact latency ranges
    const getLatencyStyle = (ns) => {
        if (ns < 100) {
            // Under 100 ns: Ultra Fast (Green)
            return {
                color: "#00d4aa",
                gradient: "linear-gradient(90deg, #00d4aa, #05bca0)",
                badge: "Ultra Fast (ns range)"
            };
        } else if (ns < 1000) {
            // 100ns to 1µs: Fast (Greenish-Blue)
            return {
                color: "#10b981",
                gradient: "linear-gradient(90deg, #10b981, #0d9488)",
                badge: "CPU/RAM (ns range)"
            };
        } else if (ns < 1000000) {
            // 1µs to 1ms: Microseconds (Yellow/Gold)
            return {
                color: "#f59e0b",
                gradient: "linear-gradient(90deg, #f59e0b, #d97706)",
                badge: "SSD/Local (µs range)"
            };
        } else if (ns < 50000000) {
            // 1ms to 50ms: Milliseconds (Orange)
            return {
                color: "#ff7a00",
                gradient: "linear-gradient(90deg, #ff7a00, #ea580c)",
                badge: "Storage Seek (ms range)"
            };
        } else {
            // > 50ms: Slow Cross-Region (Red)
            return {
                color: "#ef4444",
                gradient: "linear-gradient(90deg, #ef4444, #b91c1c)",
                badge: "Cross-Region (ms range)"
            };
        }
    };

    const getWidthPct = (ns) => {
        if (isLogScale) {
            const minLog = Math.log10(0.5);
            const maxLog = Math.log10(150000000);
            const logVal = Math.log10(ns);
            return ((logVal - minLog) / (maxLog - minLog)) * 85 + 15;
        } else {
            return (ns / 150000000) * 100;
        }
    };

    const formatTime = (ns) => {
        if (ns < 1000) return `${ns} ns`;
        if (ns < 1000000) return `${(ns / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} µs`;
        return `${(ns / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })} ms`;
    };

    const calculateProportionalTime = (ns) => {
        // baseSeconds is the value assigned to L1 Cache (0.5 ns)
        const ratio = ns / 0.5;
        const totalSeconds = ratio * baseSeconds;

        if (totalSeconds < 60) return `${totalSeconds.toFixed(1)} sec`;
        if (totalSeconds < 3600) return `${(totalSeconds / 60).toFixed(1)} min`;
        if (totalSeconds < 86400) return `${(totalSeconds / 3600).toFixed(1)} hours`;
        if (totalSeconds < 31536000) return `${(totalSeconds / 86400).toFixed(1)} days`;
        return `${(totalSeconds / 31536000).toFixed(1)} years`;
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>⏱️ Latency Numbers Every Programmer Should Know</div>
            
            <p style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5, margin: '-8px 0 16px 0' }}>
                Computer operations differ by up to **nine orders of magnitude**. Toggle absolute scale vs logarithmic scale to visualize the physical chasm between CPU cache accesses and remote network queries.
            </p>

            {/* Toggle Scales & Baseline Slider */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>Bar Scale Mode:</span>
                    <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-surface)' }}>
                        <button style={toggleBtnStyle(!isLogScale)} onClick={() => setIsLogScale(false)}>Linear (Absolute)</button>
                        <button style={toggleBtnStyle(isLogScale)} onClick={() => setIsLogScale(true)}>Logarithmic (Relative)</button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>
                        If L1 Cache took:
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <select 
                            value={baseSeconds} 
                            onChange={e => setBaseSeconds(parseFloat(e.target.value))} 
                            style={{ 
                                background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: '#00d4aa',
                                borderRadius: 6, padding: '4px 8px', fontSize: 12, fontWeight: 700, outline: 'none', cursor: 'pointer'
                            }}
                        >
                            <option value="1">1 Second</option>
                            <option value="5">5 Seconds</option>
                            <option value="10">10 Seconds</option>
                            <option value="60">1 Minute</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bar List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {latencies.map((lat, idx) => {
                    const widthPct = getWidthPct(lat.ns);
                    const latStyle = getLatencyStyle(lat.ns);
                    const isHovered = hovered === idx;

                    return (
                        <div key={lat.name} 
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            style={{ 
                                display: 'flex', flexDirection: 'column', cursor: 'pointer',
                                padding: '6px 8px', borderRadius: 8, transition: 'all 0.2s',
                                background: isHovered ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                                border: `1.5px solid ${isHovered ? 'rgba(255,255,255,0.06)' : 'transparent'}`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-light)', marginBottom: 5 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontWeight: 700, color: isHovered ? '#00d4aa' : 'var(--text-light)', transition: 'color 0.2s' }}>{lat.name}</span>
                                    <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.04)', color: 'var(--text-dim)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
                                        {latStyle.badge}
                                    </span>
                                </div>
                                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: latStyle.color }}>{formatTime(lat.ns)}</span>
                            </div>
                            
                            {/* Bar Container */}
                            <div style={{ height: 18, background: 'var(--bg-elevated)', borderRadius: 6, overflow: 'hidden', width: '100%', position: 'relative' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${widthPct}%`,
                                    background: latStyle.gradient,
                                    borderRadius: 6,
                                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: isHovered ? 1 : 0.85,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Pulse traveling glare animation */}
                                    {isHovered && (
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                                            animation: 'glare-pulse 1.5s infinite linear',
                                            transform: 'skewX(-20deg)'
                                        }} />
                                    )}
                                </div>
                                
                                {/* Micro linear scale tiny label inside absolute scale mode */}
                                {!isLogScale && widthPct < 2 && (
                                    <span style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', fontSize: 8.5, color: '#ff3b30', fontWeight: 800 }}>
                                        Invisible (sub-ns)
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Metaphor Spotlight Card & Scaled Comparison panel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                
                {/* Spotlight Metaphor Card */}
                <div style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 16,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 120,
                    boxShadow: hovered !== null ? `0 4px 20px ${getLatencyStyle(latencies[hovered].ns).color}15` : 'none',
                    borderColor: hovered !== null ? getLatencyStyle(latencies[hovered].ns).color : 'var(--border)',
                    transition: 'all 0.3s ease'
                }}>
                    {hovered !== null ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: getLatencyStyle(latencies[hovered].ns).color }}>
                                    🔎 METAPHOR SPOTLIGHT
                                </div>
                                <span style={{ fontSize: 10, background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-muted)' }}>
                                    {formatTime(latencies[hovered].ns)}
                                </span>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-light)', marginBottom: 4 }}>
                                {latencies[hovered].name}
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.45, margin: '0 0 8px 0' }}>
                                {latencies[hovered].desc}
                            </p>
                            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#00d4aa', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>📚 Metaphor:</span>
                                <span style={{ fontStyle: 'italic', color: 'var(--text-light)' }}>"{latencies[hovered].metaphor}"</span>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '10px 0' }}>
                            <span style={{ fontSize: 24 }}>💡</span>
                            <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 6 }}>Hover over any latency operation above!</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>See detailed real-world metaphors and design impacts.</div>
                        </div>
                    )}
                </div>

                {/* Proportional Scale Simulator */}
                <div style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 16,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa', marginBottom: 6 }}>
                            ⚡ HUMAN SCALE PROPORTIONS
                        </div>
                        <p style={{ fontSize: 11.5, color: 'var(--text-gray)', lineHeight: 1.4, margin: 0 }}>
                            If we scale the speed of **L1 Cache ({latencies[0].ns} ns)** to equal **{baseSeconds} second(s)**, computer speeds translate to human comprehensible units:
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '12px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Main Memory (RAM) takes:</span>
                            <strong style={{ color: '#00d4aa' }}>{calculateProportionalTime(100)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>NVMe SSD page read takes:</span>
                            <strong style={{ color: '#f59e0b' }}>{calculateProportionalTime(150000)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Mechanical Disk seek takes:</span>
                            <strong style={{ color: '#ff7a00' }}>{calculateProportionalTime(10000000)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0' }}>
                            <span style={{ color: 'var(--text-muted)' }}>USA-to-Europe Network takes:</span>
                            <strong style={{ color: '#ef4444' }}>{calculateProportionalTime(150000000)}</strong>
                        </div>
                    </div>
                </div>

            </div>

            {/* CSS Animation Keyframes for Glare Pulse */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes glare-pulse {
                    0% { transform: translateX(-100%) skewX(-20deg); }
                    100% { transform: translateX(200%) skewX(-20deg); }
                }
            `}} />
        </div>
    );
}

const toggleBtnStyle = (active) => ({
    padding: '6px 14px',
    fontSize: 10.5,
    fontWeight: 800,
    border: 'none',
    cursor: 'pointer',
    background: active ? '#00d4aa' : 'transparent',
    color: active ? '#000' : 'var(--text-muted)',
    transition: 'all 0.2s',
    outline: 'none'
});


/* =========================================================================
   10. AvailabilityCalculatorWidget (Interactive availability calculator)
   ========================================================================= */
function AvailabilityCalculatorWidget() {
    const [nines, setNines] = useState(99.9);
    const [outageActive, setOutageActive] = useState(false);
    const [crashedNode, setCrashedNode] = useState(null); // id of crashed server
    const [trafficLogs, setTrafficLogs] = useState([]);
    const [simTime, setSimTime] = useState(0);

    // Dynamic SLA stats calculations
    const calculateDowntime = (pct) => {
        const factor = (100 - pct) / 100;
        const yearSec = 365.25 * 24 * 3600;
        
        return {
            year: yearSec * factor,
            month: (yearSec / 12) * factor,
            day: 24 * 3600 * factor
        };
    };

    const formatDuration = (totalSec) => {
        if (totalSec <= 0) return "0s";
        if (totalSec < 0.1) return "sub-millisecond";
        
        const days = Math.floor(totalSec / (24 * 3600));
        const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = Math.round(totalSec % 60);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
        return parts.join(" ");
    };

    const getUptimeGrade = (pct) => {
        if (pct >= 99.999) return { label: "Five Nines (Telecom Grade)", badgeColor: "#10b981", bg: "rgba(16,185,129,0.1)", desc: "Requires global active-active replication, sub-second auto failovers, and absolute zero-downtime database migrations." };
        if (pct >= 99.99) return { label: "Four Nines (Enterprise Standard)", badgeColor: "#3b82f6", bg: "rgba(59,130,246,0.1)", desc: "Requires multi-AZ redundancy, automated failovers (heartbeat checkers), and no-downtime blue-green deployments." };
        if (pct >= 99.9) return { label: "Three Nines (Cloud Standard)", badgeColor: "#f59e0b", bg: "rgba(245,158,11,0.1)", desc: "Standard SLA. Tolerates small maintenance windows. Local load balancers and warm standby replication." };
        return { label: "Two Nines (Basic Hosting)", badgeColor: "#ef4444", bg: "rgba(239,68,68,0.1)", desc: "Single server setups. Any server freeze or database corruption results in a hard system-wide blackout." };
    };

    const getArchRequirements = (pct) => {
        if (pct >= 99.999) {
            return [
                "Multi-Region active-active dynamic traffic routing.",
                "Real-time cross-region multi-master DB replication.",
                "Continuous Chaos Engineering (crashing regions automatically to verify resilience).",
                "Fully automated sub-second failover recovery pipelines."
            ];
        }
        if (pct >= 99.99) {
            return [
                "Redundant hardware tiers spread across multiple physical Availability Zones (AZs).",
                "Automated DB master election & heartbeat load balancers.",
                "Zero planned maintenance downtime (Canary and Blue-Green deployment steps).",
                "Proactive automated healing and capacity auto-scaling."
            ];
        }
        if (pct >= 99.9) {
            return [
                "Basic active-active redundant web servers behind a load balancer.",
                "Master-Replica database structure (requires manual promotion on crash).",
                "Off-peak maintenance windows for schema updates.",
                "Daily automated disk snapshots and off-site backup storage."
            ];
        }
        return [
            "Single Monolithic Server hosting database, logic, and assets.",
            "No load balancer, caching layers, or database standby nodes.",
            "Planned downtime required for server patches and releases.",
            "High vulnerability to single points of failure (SPOF)."
        ];
    };

    const dt = calculateDowntime(nines);
    const grade = getUptimeGrade(nines);

    // Live Simulator ticks
    useEffect(() => {
        const interval = setInterval(() => {
            setSimTime(t => t + 1);

            // Periodically check nodes health
            // Auto crash random node under low SLAs to show instability
            if (nines < 99.9) {
                // Two nines
                if (Math.random() < 0.15) {
                    setCrashedNode(1); // Monolith server goes offline
                    addLog("🚨 SERVER CRASHED: CPU lockup on primary VM. 100% of incoming user requests are failing!", "error");
                } else if (Math.random() < 0.2 && crashedNode) {
                    setCrashedNode(null);
                    addLog("✓ SERVER RECOVERED: Manual hardware reboot completed. System restored.", "success");
                }
            } else if (nines < 99.99) {
                // Three nines
                if (Math.random() < 0.08 && !crashedNode) {
                    const node = Math.random() < 0.5 ? 1 : 2;
                    setCrashedNode(node);
                    addLog(`⚠️ NODE DOWN: Server ${node} failed health check. Load Balancer is rerouting remaining traffic.`, "warning");
                } else if (Math.random() < 0.15 && crashedNode) {
                    addLog(`✓ NODE RESTORED: Server ${crashedNode} rejoined cluster after automated reboot.`, "success");
                    setCrashedNode(null);
                }
            } else if (nines < 99.999) {
                // Four nines
                if (Math.random() < 0.04 && !crashedNode) {
                    const node = Math.floor(Math.random() * 4) + 1;
                    setCrashedNode(node);
                    addLog(`⚠️ INSTANCE FAILURE: AZ-A VM instance #${node} crashed. Hot backup spun up. Zero packets lost.`, "info");
                } else if (Math.random() < 0.1 && crashedNode) {
                    setCrashedNode(null);
                }
            } else {
                // Five nines
                if (Math.random() < 0.02 && !crashedNode) {
                    setCrashedNode(9); // Region US-East outage mock
                    addLog("🌐 REGION DOWN (US-EAST): Primary region disconnected due to transit provider sever. GeoDNS redirecting all traffic to EU-WEST instantly.", "warning");
                } else if (Math.random() < 0.05 && crashedNode) {
                    addLog("✓ REGION RESTORED: US-East network recovered. Re-establishing replication logs.", "success");
                    setCrashedNode(null);
                }
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [nines, crashedNode]);

    const addLog = (msg, type) => {
        setTrafficLogs(prev => [
            { id: Date.now() + Math.random(), msg, type, time: new Date().toLocaleTimeString() },
            ...prev.slice(0, 4)
        ]);
    };

    const triggerManualOutage = () => {
        if (nines < 99.9) {
            setCrashedNode(1);
            addLog("🚨 DISASTER TRIGGERED: Monolithic Server completely crashed! Database connection pools locked. Code 503 Service Unavailable.", "error");
        } else if (nines < 99.99) {
            setCrashedNode(1); // Crash server 1
            addLog("🚨 DISASTER TRIGGERED: Server 1 crashed! Load balancer taking 8 seconds to flag heartbeat. User experiencing timeouts.", "error");
        } else if (nines < 99.999) {
            setCrashedNode(3); // Crash a whole availability zone
            addLog("🚨 DISASTER TRIGGERED: AZ-A Power distribution unit failed. Load balancer immediately reroutes 100% of traffic to AZ-B.", "warning");
        } else {
            setCrashedNode(99); // Crash whole region
            addLog("🚨 DISASTER TRIGGERED: US-East Datacenter flooded! Dynamic geo-failover executed. EU-West datacenter scaling replica pods to absorb load.", "success");
        }
        setOutageActive(true);
        setTimeout(() => {
            setOutageActive(false);
            setCrashedNode(null);
            addLog("✓ AUTOMATED SELF-HEALING: Outage cleared. Health checks returning healthy status.", "success");
        }, 6000);
    };

    const handlePresetSelect = (pct) => {
        setNines(pct);
        setCrashedNode(null);
        setOutageActive(false);
        addLog(`🔧 Preset swapped: SLA target updated to ${pct}% uptime.`, "info");
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🧮 High-Availability Cluster Simulator</div>

            <p style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5, margin: '-8px 0 16px 0' }}>
                Availability measures system uptime. A "nine" added translates to exponentially complex architecture: from a single server to multi-region synchronized failover nodes.
            </p>

            {/* Presets Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                {[99.0, 99.9, 99.99, 99.999].map(pct => {
                    const active = nines === pct;
                    const presetLabel = pct === 99.0 ? "2 Nines" : pct === 99.9 ? "3 Nines" : pct === 99.99 ? "4 Nines" : "5 Nines";
                    return (
                        <button 
                            key={pct}
                            onClick={() => handlePresetSelect(pct)}
                            style={{
                                padding: '10px 6px', fontSize: 11, fontWeight: 800, borderRadius: 10, cursor: 'pointer',
                                border: `1.5px solid ${active ? '#00d4aa' : 'var(--border)'}`,
                                background: active ? 'rgba(0,212,170,0.1)' : 'var(--bg-elevated)',
                                color: active ? '#00d4aa' : 'var(--text-muted)',
                                transition: 'all 0.2s', outline: 'none'
                            }}
                        >
                            <div style={{ fontSize: 12 }}>{presetLabel}</div>
                            <div style={{ fontSize: 9, opacity: 0.8, marginTop: 2 }}>{pct}%</div>
                        </button>
                    );
                })}
            </div>

            {/* Fine Grained Slider */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>Custom Snapping Slider:</span>
                    <strong style={{ fontSize: 16, color: '#00d4aa' }}>{nines.toFixed(3)}%</strong>
                </div>
                <input 
                    type="range" 
                    min="99.0" 
                    max="99.999" 
                    step="0.001" 
                    value={nines} 
                    onChange={e => {
                        setNines(parseFloat(e.target.value));
                        setCrashedNode(null);
                    }} 
                    style={{ width: '100%', accentColor: '#00d4aa', cursor: 'pointer' }}
                />
            </div>

            {/* SLA Dashboard Stats Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
                
                {/* SLA Grade */}
                <div style={{ background: grade.bg, border: `1.5px solid ${grade.badgeColor}33`, borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: grade.badgeColor, letterSpacing: '0.04em' }}>SLA Tier Classification</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-light)', marginTop: 4 }}>{grade.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 6, lineHeight: 1.4 }}>{grade.desc}</div>
                    </div>
                </div>

                {/* Live Downtime breakdown */}
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#ff7a00', letterSpacing: '0.04em', marginBottom: 8 }}>Max Downtime Budget</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Per Day:</span>
                            <strong style={{ color: '#ef4444' }}>{formatDuration(dt.day)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Per Month:</span>
                            <strong style={{ color: '#ef4444' }}>{formatDuration(dt.month)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Per Year:</span>
                            <strong style={{ color: '#ef4444', fontSize: 12 }}>{formatDuration(dt.year)}</strong>
                        </div>
                    </div>
                </div>

            </div>

            {/* HIGH FIDELITY SIMULATOR CANVAS */}
            <div style={{
                background: '#0a0f1d', border: '1.5px solid var(--border)', borderRadius: 20, padding: 20,
                position: 'relative', overflow: 'hidden', minHeight: 210, marginBottom: 20,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 900, color: '#00d4aa', background: 'rgba(0,212,170,0.1)', padding: '4px 8px', borderRadius: 6 }}>
                        🛰️ CLUSTER TOPOLOGY MAPPING
                    </span>
                    <button 
                        onClick={triggerManualOutage}
                        disabled={outageActive}
                        style={{
                            background: outageActive ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.2)',
                            color: '#ef4444', border: '1px solid #ef444455', borderRadius: 8,
                            padding: '4px 10px', fontSize: 9.5, fontWeight: 800, cursor: 'pointer',
                            transition: 'all 0.2s', outline: 'none'
                        }}
                    >
                        {outageActive ? '💥 Outage Active' : '⚡ Trigger Disaster Crash'}
                    </button>
                </div>

                {/* Cluster Visualizer SVGs & nodes */}
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '20px 0', minHeight: 110, position: 'relative' }}>
                    
                    {/* Client Node */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                        <div style={{ fontSize: 24, padding: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '50%' }}>💻</div>
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-light)', marginTop: 4 }}>End Users</span>
                    </div>

                    {/* SVG Connector lines */}
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 2 }}>
                        {/* Connecting client to LB or servers */}
                        {nines >= 99.9 ? (
                            <>
                                {/* Client to Load Balancer */}
                                <line x1="15%" y1="50%" x2="45%" y2="50%" stroke={crashedNode === 1 && nines < 99.99 ? '#ef4444' : '#00d4aa'} strokeWidth="2" strokeDasharray="5 5" />
                                
                                {/* Load Balancer to servers */}
                                {nines < 99.99 ? (
                                    <>
                                        <line x1="55%" y1="50%" x2="80%" y2="25%" stroke={crashedNode === 1 ? '#ef4444' : '#00d4aa'} strokeWidth="1.5" />
                                        <line x1="55%" y1="50%" x2="80%" y2="75%" stroke={crashedNode === 2 ? '#ef4444' : '#00d4aa'} strokeWidth="1.5" />
                                    </>
                                ) : nines < 99.999 ? (
                                    <>
                                        {/* Multi AZ */}
                                        <line x1="55%" y1="50%" x2="72%" y2="20%" stroke={crashedNode === 1 ? '#ef4444' : '#00d4aa'} strokeWidth="1.5" />
                                        <line x1="55%" y1="50%" x2="72%" y2="40%" stroke={crashedNode === 2 ? '#ef4444' : '#00d4aa'} strokeWidth="1.5" />
                                        <line x1="55%" y1="50%" x2="72%" y2="60%" stroke={crashedNode === 3 ? '#ef4444' : '#00d4aa'} strokeWidth="1.5" />
                                        <line x1="55%" y1="50%" x2="72%" y2="80%" stroke={crashedNode === 4 ? '#ef4444' : '#00d4aa'} strokeWidth="1.5" />
                                    </>
                                ) : (
                                    <>
                                        {/* Multi Region */}
                                        <line x1="15%" y1="50%" x2="75%" y2="25%" stroke={crashedNode === 99 || crashedNode === 9 ? '#ef4444' : '#10b981'} strokeWidth="1.5" />
                                        <line x1="15%" y1="50%" x2="75%" y2="75%" stroke="#10b981" strokeWidth="1.5" />
                                    </>
                                )}
                            </>
                        ) : (
                            /* Monolith Client to Server */
                            <line x1="15%" y1="50%" x2="80%" y2="50%" stroke={crashedNode === 1 ? '#ef4444' : '#00d4aa'} strokeWidth="2" strokeDasharray={crashedNode === 1 ? 'none' : '6 4'} />
                        )}
                    </svg>

                    {/* Gateway Load Balancer (Rendered for SLA >= 99.9%) */}
                    {nines >= 99.9 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, background: '#111827', padding: '6px 10px', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 16 }}>🔀</div>
                            <span style={{ fontSize: 8.5, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', marginTop: 2 }}>
                                {nines >= 99.999 ? "GeoDNS Route" : "Proxy LB"}
                            </span>
                        </div>
                    )}

                    {/* Servers Array Visual Container */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10, minWidth: 120 }}>
                        {nines < 99.9 ? (
                            /* Monolith Server Setup */
                            <div style={{
                                padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${crashedNode === 1 ? '#ef4444' : '#00d4aa'}`,
                                background: crashedNode === 1 ? 'rgba(239,68,68,0.1)' : 'rgba(0,212,170,0.03)',
                                textAlign: 'center', animation: crashedNode === 1 ? 'shake 0.4s infinite' : 'none'
                            }}>
                                <div style={{ fontSize: 18 }}>🗄️</div>
                                <div style={{ fontSize: 9.5, fontWeight: 800, color: crashedNode === 1 ? '#ef4444' : '#00d4aa' }}>
                                    {crashedNode === 1 ? 'SPOF MONOLITH DOWN' : 'Monolith Active'}
                                </div>
                                <div style={{ fontSize: 7.5, color: 'var(--text-dim)', marginTop: 2 }}>Hosting DB + App</div>
                            </div>
                        ) : nines < 99.99 ? (
                            /* Three nines: 2 web servers behind load balancer */
                            <>
                                {[1, 2].map(nodeId => {
                                    const isDead = crashedNode === nodeId;
                                    return (
                                        <div key={nodeId} style={{
                                            padding: '4px 10px', borderRadius: 8, border: `1px solid ${isDead ? '#ef4444' : '#3b82f6'}`,
                                            background: isDead ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.05)',
                                            display: 'flex', alignItems: 'center', gap: 6, opacity: isDead ? 0.7 : 1
                                        }}>
                                            <span style={{ fontSize: 11 }}>⚙️</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: 9, fontWeight: 700, color: isDead ? '#ef4444' : 'var(--text-light)' }}>
                                                    Server {nodeId} {isDead ? '(CRASHED)' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        ) : nines < 99.999 ? (
                            /* Four nines: 4 nodes spread across 2 Availability Zones */
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                {[1, 2, 3, 4].map(nodeId => {
                                    const isDead = crashedNode === nodeId;
                                    const az = nodeId <= 2 ? "AZ-A" : "AZ-B";
                                    return (
                                        <div key={nodeId} style={{
                                            padding: '4px 6px', borderRadius: 8, border: `1px solid ${isDead ? '#ef4444' : '#10b981'}`,
                                            background: isDead ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.05)',
                                            textAlign: 'center', opacity: isDead ? 0.6 : 1
                                        }}>
                                            <span style={{ fontSize: 10 }}>⚙️</span>
                                            <div style={{ fontSize: 7.5, color: 'var(--text-dim)' }}>{az} node#{nodeId}</div>
                                            {isDead && <div style={{ fontSize: 7, color: '#ef4444', fontWeight: 800 }}>DOWN</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Five nines: 2 regional data centers with active-active databases */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{
                                    padding: '6px 12px', borderRadius: 8, border: `1px solid ${crashedNode === 9 || crashedNode === 99 ? '#ef4444' : '#10b981'}`,
                                    background: crashedNode === 9 || crashedNode === 99 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.05)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 10, fontWeight: 900, color: crashedNode === 9 || crashedNode === 99 ? '#ef4444' : '#10b981' }}>🇺🇸 Region (US East)</div>
                                    <span style={{ fontSize: 7.5, color: 'var(--text-dim)' }}>Active Active Replica</span>
                                </div>
                                <div style={{
                                    padding: '6px 12px', borderRadius: 8, border: '1px solid #10b981',
                                    background: 'rgba(16,185,129,0.05)', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 10, fontWeight: 900, color: '#10b981' }}>🇪🇺 Region (EU West)</div>
                                    <span style={{ fontSize: 7.5, color: 'var(--text-dim)' }}>Active Active Replica</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Outage Failure Overlay notification */}
                {crashedNode !== null && (
                    <div style={{
                        position: 'absolute', bottom: 10, left: 10, right: 10,
                        background: crashedNode === 99 || crashedNode === 9 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        border: `1px solid ${crashedNode === 99 || crashedNode === 9 ? '#f59e0b55' : '#ef444455'}`,
                        borderRadius: 10, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        backdropFilter: 'blur(8px)', animation: 'slideIn 0.3s cubic-bezier(0, 0, 0.2, 1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ animation: 'pulse 1s infinite' }}>💥</span>
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: crashedNode === 99 || crashedNode === 9 ? '#f59e0b' : '#ef4444' }}>
                                {crashedNode === 99 || crashedNode === 9 
                                    ? "US datacenter crashed! Auto DNS router successfully rerouted users to EU datacenter."
                                    : nines < 99.9 
                                        ? "Monolith Offline: 100% of user traffic is down! SLA failure active." 
                                        : `Redundancy Active: Server crashed. Traffic balance adjusting.`
                                }
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Architecture checklist requirements card */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 16, padding: 16, border: '1px solid var(--border)', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.04em' }}>
                    🔧 Mandatory Architectural Checklist
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {getArchRequirements(nines).map((req, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.45 }}>
                            <span style={{ color: '#00d4aa', fontWeight: 800 }}>✔</span>
                            <span>{req}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logs display output */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
                <div style={{ fontSize: 9.5, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                    🚦 SYSTEM EVENT FEED LOGS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 90, fontFamily: 'monospace' }}>
                    {trafficLogs.length === 0 ? (
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic', padding: '20px 0', textAlign: 'center' }}>
                            Simulator running. Event logs stream dynamically on hardware failures.
                        </div>
                    ) : (
                        trafficLogs.map(log => (
                            <div key={log.id} style={{ display: 'flex', gap: 8, fontSize: 10.5, lineHeight: 1.35, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <span style={{ color: 'var(--text-dim)' }}>[{log.time}]</span>
                                <span style={{ 
                                    color: log.type === 'error' ? '#ef4444' : log.type === 'warning' ? '#f59e0b' : log.type === 'success' ? '#10b981' : '#3b82f6',
                                    fontWeight: 800 
                                }}>
                                    {log.type.toUpperCase()}:
                                </span>
                                <span style={{ color: 'var(--text-light)' }}>{log.msg}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
            `}} />
        </div>
    );
}


/* =========================================================================
   11. TwitterEstimatorWidget (Interactive step-by-step estimator)
   ========================================================================= */
function TwitterEstimatorWidget() {
    const [wizardStep, setWizardStep] = useState(0); // 0: Assumptions, 1: QPS, 2: Storage, 3: Infra
    const [dau, setDau] = useState(250); // Millions (default 250 DAU)
    const [tweetsPerUser, setTweetsPerUser] = useState(2);
    const [mediaPct, setMediaPct] = useState(10); // 10% tweets contain media
    const [mediaSize, setMediaSize] = useState(1.0); // 1.0 MB average
    const [repFactor, setRepFactor] = useState(3); // 3x replication factor
    const [years, setYears] = useState(5); // 5 years storage limit

    // Live Math Computations
    const dailyTweets = dau * 1000000 * tweetsPerUser;
    const avgWriteQps = Math.round(dailyTweets / 86400);
    const peakWriteQps = avgWriteQps * 2;

    // Read QPS is usually much higher (e.g. 10x read ratio for social media platforms)
    const avgReadQps = avgWriteQps * 10;
    const peakReadQps = avgReadQps * 2;

    const dailyMediaStorageBytes = dailyTweets * (mediaPct / 100) * mediaSize * 1024 * 1024;
    const dailyStorageTB = Math.round((dailyMediaStorageBytes / (1024 * 1024 * 1024 * 1024)) * 10) / 10;
    const rawStoragePB = Math.round((dailyStorageTB * 365.25 * years / 1024) * 10) / 10;
    const replicatedStoragePB = Math.round((rawStoragePB * repFactor) * 10) / 10;

    // Infrastructure Calculations
    const singleDriveUsableTB = 10.9; // 12TB Enterprise drive usable
    const totalDrivesNeeded = Math.ceil((replicatedStoragePB * 1024) / singleDriveUsableTB);
    const serverCapacityQps = 8000; // Single server handles 8K QPS
    const writeServersNeeded = Math.ceil(peakWriteQps / serverCapacityQps);
    const readServersNeeded = Math.ceil(peakReadQps / serverCapacityQps);
    const totalServersNeeded = writeServersNeeded + readServersNeeded;

    // Equivalency calculations
    const librariesOfCongressPerDay = (dailyStorageTB / 15).toFixed(1); // 1 Library of Congress = 15TB
    const hdMoviesPerDay = Math.round((dailyStorageTB * 1024) / 4); // 4GB per HD movie

    const steps = [
        { label: "1. Core Assumptions", icon: "📋" },
        { label: "2. Throughput QPS", icon: "⚡" },
        { label: "3. Storage footprint", icon: "💾" },
        { label: "4. Infrastructure", icon: "🛰️" }
    ];

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🧮 Back-of-the-Envelope Estimation Wizard</div>

            <p style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5, margin: '-8px 0 16px 0' }}>
                Walk through the classic system design interview worked example for **Twitter QPS and storage needs**. Modify inputs to see resource estimations update in real time.
            </p>

            {/* Wizard Navigation Header */}
            <div style={{ display: 'flex', borderBottom: '1.5px solid var(--border)', paddingBottom: 10, marginBottom: 20, overflowX: 'auto', gap: 10 }}>
                {steps.map((st, idx) => {
                    const active = wizardStep === idx;
                    return (
                        <button
                            key={st.label}
                            onClick={() => setWizardStep(idx)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8,
                                border: 'none', background: active ? 'rgba(0,212,170,0.1)' : 'transparent',
                                color: active ? '#00d4aa' : 'var(--text-muted)', cursor: 'pointer',
                                fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap', transition: 'all 0.15s', outline: 'none'
                            }}
                        >
                            <span>{st.icon}</span>
                            <span>{st.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* STEP 1: INPUT ASSUMPTIONS PANEL */}
            {wizardStep === 0 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-light)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        📋 Define your system-wide assumptions:
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
                        {/* DAU */}
                        <div style={inputContainerStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={labelStyle}>Daily Active Users (DAU)</label>
                                <strong style={{ color: '#00d4aa', fontSize: 12 }}>{dau}M</strong>
                            </div>
                            <input 
                                type="range" min="10" max="1000" step="10" value={dau} 
                                onChange={e => setDau(parseInt(e.target.value, 10))} 
                                style={{ width: '100%', accentColor: '#00d4aa', cursor: 'pointer', margin: '8px 0' }}
                            />
                            <span style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>Baseline scale of your active subscriber base.</span>
                        </div>

                        {/* Tweets per User */}
                        <div style={inputContainerStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={labelStyle}>Tweets per User per Day</label>
                                <strong style={{ color: '#00d4aa', fontSize: 12 }}>{tweetsPerUser}</strong>
                            </div>
                            <input 
                                type="range" min="1" max="10" step="1" value={tweetsPerUser} 
                                onChange={e => setTweetsPerUser(parseInt(e.target.value, 10))} 
                                style={{ width: '100%', accentColor: '#00d4aa', cursor: 'pointer', margin: '8px 0' }}
                            />
                            <span style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>Average posting rate of active tweeters.</span>
                        </div>

                        {/* Media Percent */}
                        <div style={inputContainerStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={labelStyle}>Tweets with Media (%)</label>
                                <strong style={{ color: '#a78bfa', fontSize: 12 }}>{mediaPct}%</strong>
                            </div>
                            <input 
                                type="range" min="0" max="50" step="5" value={mediaPct} 
                                onChange={e => setMediaPct(parseInt(e.target.value, 10))} 
                                style={{ width: '100%', accentColor: '#a78bfa', cursor: 'pointer', margin: '8px 0' }}
                            />
                            <span style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>Percentage of tweets with photos or videos.</span>
                        </div>

                        {/* Media Size */}
                        <div style={inputContainerStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={labelStyle}>Avg Media File Size (MB)</label>
                                <strong style={{ color: '#a78bfa', fontSize: 12 }}>{mediaSize.toFixed(1)} MB</strong>
                            </div>
                            <input 
                                type="range" min="0.1" max="5.0" step="0.1" value={mediaSize} 
                                onChange={e => setMediaSize(parseFloat(e.target.value))} 
                                style={{ width: '100%', accentColor: '#a78bfa', cursor: 'pointer', margin: '8px 0' }}
                            />
                            <span style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>Average compressed disk size of photos/video payloads.</span>
                        </div>

                        {/* Years */}
                        <div style={inputContainerStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={labelStyle}>Data Retention Years</label>
                                <strong style={{ color: '#ff7a00', fontSize: 12 }}>{years} Years</strong>
                            </div>
                            <input 
                                type="range" min="1" max="10" step="1" value={years} 
                                onChange={e => setYears(parseInt(e.target.value, 10))} 
                                style={{ width: '100%', accentColor: '#ff7a00', cursor: 'pointer', margin: '8px 0' }}
                            />
                            <span style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>How long storage logs are kept fully warm.</span>
                        </div>

                        {/* Replication factor */}
                        <div style={inputContainerStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={labelStyle}>Replication Multiplier</label>
                                <strong style={{ color: '#ff7a00', fontSize: 12 }}>{repFactor}×</strong>
                            </div>
                            <input 
                                type="range" min="1" max="5" step="1" value={repFactor} 
                                onChange={e => setRepFactor(parseInt(e.target.value, 10))} 
                                style={{ width: '100%', accentColor: '#ff7a00', cursor: 'pointer', margin: '8px 0' }}
                            />
                            <span style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>SLA redundancy factor (e.g. primary + 2 replicas).</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={() => setWizardStep(1)}
                            style={{ ...btnStyle, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: '1px solid #00d4aa44' }}
                        >
                            Next: Calculate QPS →
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: THROUGHPUT QPS CALCULATIONS */}
            {wizardStep === 1 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-light)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        ⚡ Live Read/Write Throughput Rates (QPS):
                    </div>

                    {/* Math Formula Card */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1.5px dashed var(--border)', borderRadius: 16, padding: 14, marginBottom: 16 }}>
                        <div style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mathematical Equation:</div>
                        <div style={{ fontSize: 12.5, fontFamily: 'monospace', color: '#00d4aa', margin: '6px 0', wordBreak: 'break-all' }}>
                            Daily Tweets = {dau}M DAU × {tweetsPerUser} tweets/user = <span style={{ color: 'var(--text-light)' }}>{dailyTweets.toLocaleString()} tweets/day</span>
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#a78bfa', wordBreak: 'break-all' }}>
                            Average Write QPS = {dailyTweets.toLocaleString()} ÷ 86,400 seconds/day = <strong style={{ color: 'var(--text-light)' }}>{avgWriteQps.toLocaleString()} QPS</strong>
                        </div>
                    </div>

                    {/* QPS Dashboard dials */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                        {/* Write QPS */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#00d4aa', textTransform: 'uppercase' }}>✏️ Write Throughput (Publishing)</div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-light)', margin: '8px 0 4px 0' }}>
                                {avgWriteQps.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>avg QPS</span>
                            </div>
                            <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 700 }}>
                                {peakWriteQps.toLocaleString()} <span style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--text-dim)' }}>peak QPS (2× spike)</span>
                            </div>
                            {peakWriteQps > 8000 && (
                                <div style={{ fontSize: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid #ef444444', color: '#ef4444', borderRadius: 4, padding: '4px 6px', marginTop: 8 }}>
                                    ⚠️ High Write Volume: Exceeds single instance ceiling. Database horizontal sharding is mandatory!
                                </div>
                            )}
                        </div>

                        {/* Read QPS */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase' }}>📖 Read Throughput (Timeline Feeds)</div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-light)', margin: '8px 0 4px 0' }}>
                                {avgReadQps.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>avg QPS</span>
                            </div>
                            <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 700 }}>
                                {peakReadQps.toLocaleString()} <span style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--text-dim)' }}>peak QPS (2× spike)</span>
                            </div>
                            <div style={{ fontSize: 9, background: 'rgba(59,130,246,0.08)', border: '1px solid #3b82f644', color: '#3b82f6', borderRadius: 4, padding: '4px 6px', marginTop: 8 }}>
                                💡 Read-Heavy Platform (10:1 Ratio). Highly optimized cache layers (Redis) must front the database tier!
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button onClick={() => setWizardStep(0)} style={btnStyle}>◀ Back</button>
                        <button 
                            onClick={() => setWizardStep(2)}
                            style={{ ...btnStyle, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: '1px solid #00d4aa44' }}
                        >
                            Next: Calculate Storage →
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: STORAGE FOOTPRINT CALCULATIONS */}
            {wizardStep === 2 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-light)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        💾 Data Storage Footprint Allocations:
                    </div>

                    {/* Equation board */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1.5px dashed var(--border)', borderRadius: 16, padding: 14, marginBottom: 16 }}>
                        <div style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Storage Equations:</div>
                        <div style={{ fontSize: 12.5, fontFamily: 'monospace', color: '#a78bfa', margin: '4px 0', wordBreak: 'break-all' }}>
                            Daily Media = {dau}M DAU × {tweetsPerUser} × {mediaPct}% w/media × {mediaSize} MB = <span style={{ color: 'var(--text-light)' }}>{dailyStorageTB} TB/day</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 12, fontFamily: 'monospace', color: '#ff7a00', wordBreak: 'break-all' }}>
                            <div>Raw {years}-Year Storage = {dailyStorageTB} TB × 365 × {years} = <strong style={{ color: 'var(--text-light)' }}>{rawStoragePB} PB</strong></div>
                            <div style={{ color: '#28c840' }}>Replicated {years}-Year Storage ({repFactor}x) = {rawStoragePB} PB × {repFactor} = <strong style={{ color: '#28c840' }}>{replicatedStoragePB} PB</strong></div>
                        </div>
                    </div>

                    {/* Storage comparisons grids */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#a78bfa', textTransform: 'uppercase' }}>💾 Capacity Summary</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                                <div style={{ fontSize: 12 }}>Daily Storage: <strong style={{ color: 'var(--text-light)' }}>{dailyStorageTB} TB / day</strong></div>
                                <div style={{ fontSize: 12 }}>Raw 5-Yr Storage: <strong style={{ color: 'var(--text-light)' }}>{rawStoragePB} PB</strong></div>
                                <div style={{ fontSize: 13, borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4, color: '#28c840', fontWeight: 800 }}>
                                    {repFactor}x Replicated: {replicatedStoragePB} PB
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#ff7a00', textTransform: 'uppercase', marginBottom: 6 }}>🌍 Physical Scale Equivalents</div>
                            <div style={{ fontSize: 11.5, color: 'var(--text-gray)', lineHeight: 1.45 }}>
                                Your ingest speed is equivalent to storing **{librariesOfCongressPerDay} Libraries of Congress** or absorbing **{hdMoviesPerDay.toLocaleString()} HD movies** every single day!
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button onClick={() => setWizardStep(1)} style={btnStyle}>◀ Back</button>
                        <button 
                            onClick={() => setWizardStep(3)}
                            style={{ ...btnStyle, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: '1px solid #00d4aa44' }}
                        >
                            Next: Infrastructure Needs →
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: INFRASTRUCTURE HARDWARE ESTIMATIONS */}
            {wizardStep === 3 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-light)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        🛰️ Hardware Infrastructure Resource Estimates:
                    </div>

                    {/* Hard Drive Stack & Server Array Calculations */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
                        
                        {/* Server Capacity Grid */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 900, color: '#00d4aa', textTransform: 'uppercase' }}>🖥️ Server Compute Estimates</div>
                                <p style={{ fontSize: 11, color: 'var(--text-dim)', margin: '4px 0 10px 0', lineHeight: 1.35 }}>
                                    Assuming 1 high-spec API node handles **8,000 QPS** before performance saturation limits:
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Write Servers (Publishing):</span>
                                        <strong style={{ color: 'var(--text-light)' }}>{writeServersNeeded} Node(s)</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Read Servers (Feeds):</span>
                                        <strong style={{ color: 'var(--text-light)' }}>{readServersNeeded} Node(s)</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4 }}>
                                        <span style={{ color: '#00d4aa', fontWeight: 800 }}>Total Cluster Capacity:</span>
                                        <strong style={{ color: '#00d4aa' }}>{totalServersNeeded} Instances</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Physical Enterprise Hard Drives Stack */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#a78bfa', textTransform: 'uppercase', marginBottom: 4 }}>🗄️ Physical Hard Drive Array</div>
                            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                                To store **{replicatedStoragePB} PB** on standard **12TB (10.9TB Net) Enterprise SAS Drives**:
                            </span>
                            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-light)', margin: '8px 0 12px 0' }}>
                                {totalDrivesNeeded.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>Hard Drives</span>
                            </div>

                            {/* Hard drive stack visual blocks */}
                            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxHeight: 60, overflowY: 'hidden', padding: 6, background: '#0a0f1d', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                {Array.from({ length: Math.min(36, totalDrivesNeeded) }).map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        style={{ 
                                            width: 14, height: 8, borderRadius: 2, background: '#1e293b', border: '1px solid #475569',
                                            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 2
                                        }}
                                        title="Enterprise HDD SAS"
                                    >
                                        {/* Pulsing server LED */}
                                        <div style={{ width: 2, height: 2, borderRadius: '50%', background: '#28c840', animation: 'pulse 1s infinite' }} />
                                    </div>
                                ))}
                                {totalDrivesNeeded > 36 && (
                                    <span style={{ fontSize: 9, color: 'var(--text-dim)', alignSelf: 'center', marginLeft: 4 }}>+{totalDrivesNeeded - 36} drives...</span>
                                )}
                            </div>
                        </div>

                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button onClick={() => setWizardStep(2)} style={btnStyle}>◀ Back</button>
                        <button 
                            onClick={() => {
                                setDau(250);
                                setTweetsPerUser(2);
                                setMediaPct(10);
                                setMediaSize(1.0);
                                setRepFactor(3);
                                setYears(5);
                                setWizardStep(0);
                            }} 
                            style={btnStyle}
                        >
                            🔄 Reset Calculator
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const inputContainerStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 4
};

const labelStyle = {
    fontSize: 10,
    fontWeight: 800,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
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
    margin: '4px 0 0 0'
};



/* =========================================================================
   12. InterviewFrameworkWidget (Four-stage horizontal pipeline diagram)
   ========================================================================= */
function InterviewFrameworkWidget() {
    const [currentTime, setCurrentTime] = useState(0); // 0 to 45 minutes
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeStage, setActiveStage] = useState(0);

    const stages = [
        {
            title: "Step 1: Understand & Scope",
            time: "3-10 minutes",
            goals: ["Gather requirements (functional & non-functional)", "Clarify features", "State constraints"],
            mistakes: ["Jumping directly into design", "Assuming scale targets", "Not asking clarifying questions"],
            min: 0,
            max: 8,
            color: "#10b981",
            bg: "rgba(16, 185, 129, 0.1)"
        },
        {
            title: "Step 2: High-Level Design",
            time: "10-15 minutes",
            goals: ["Draw main component boxes", "List endpoints", "Check back-of-envelope values"],
            mistakes: ["Over-engineering early", "Designing database keys", "Drawing without talking"],
            min: 9,
            max: 20,
            color: "#3b82f6",
            bg: "rgba(59, 130, 246, 0.1)"
        },
        {
            title: "Step 3: Deep Dive",
            time: "10-25 minutes",
            goals: ["Explore hot paths & bottlenecks", "Explain data models & partitioning", "Address Celebrity problems"],
            mistakes: ["Getting stuck on authentication", "Ignoring latency SLAs", "Not proposing trade-offs"],
            min: 21,
            max: 40,
            color: "#ff7a00",
            bg: "rgba(255, 122, 0, 0.1)"
        },
        {
            title: "Step 4: Wrap Up",
            time: "3-5 minutes",
            goals: ["Summarize core components", "Highlight future bottlenecks", "Outline operational monitoring"],
            mistakes: ["Saying 'the design is perfect'", "Avoiding failover topics", "Running out of time"],
            min: 41,
            max: 45,
            color: "#ef4444",
            bg: "rgba(239, 68, 68, 0.1)"
        }
    ];

    const simulationEvents = [
        { minute: 0, speaker: "System", text: "⏱️ Interview starts. You have exactly 45 minutes to design a highly scalable rate limiter.", type: "system" },
        { minute: 2, speaker: "Candidate", text: "Let's clarify the scope first: Are we rate-limiting by user IP address, auth tokens, or API endpoints?", type: "do" },
        { minute: 4, speaker: "Interviewer", text: "Let's assume rate limiting is per auth token, and the system handles 100M active tokens globally.", type: "interviewer" },
        { minute: 6, speaker: "Candidate", text: "Understood. The non-functional constraints are: <5ms lookup overhead, active-active high availability, and standard 429 status code returns.", type: "do" },
        { minute: 9, speaker: "System", text: "⚡ Scope locked! Advancing to Step 2: High-Level Design.", type: "system" },
        { minute: 11, speaker: "Candidate", text: "Here is the high-level plan: Client calls go through a GeoDNS route to an API Gateway, which checks the lookup token cache before forwarding to the web tier.", type: "do" },
        { minute: 14, speaker: "Interviewer", text: "Where will you store the rate-limit count? How does the database layer absorb 100K write queries per second?", type: "interviewer" },
        { minute: 17, speaker: "Candidate", text: "We will use an in-memory database like Redis for the write-intensive lookup table. We will cache counts with short-lived TTLs.", type: "do" },
        { minute: 21, speaker: "System", text: "⚡ High-level design approved! Moving to Step 3: Design Deep Dive.", type: "system" },
        { minute: 23, speaker: "Candidate", text: "For the sliding window log algorithm, we can use Redis sorted sets (ZADD) with key timestamps to reject queries dynamically.", type: "do" },
        { minute: 27, speaker: "Interviewer", text: "What happens if there's high network latency between datacenters and Redis? Do requests fail or get permitted?", type: "interviewer" },
        { minute: 30, speaker: "Candidate", text: "We'll apply a fail-open resiliency pattern with local memory fallback if Redis times out. Performance is prioritized over absolute strict limits.", type: "do" },
        { minute: 34, speaker: "Interviewer", text: "How do we prevent concurrent requests from triggering race conditions (double ZADD calls)?", type: "interviewer" },
        { minute: 37, speaker: "Candidate", text: "We will execute atomic Lua scripts directly inside the Redis engine so the 'fetch-and-decrement' is fully isolated.", type: "do" },
        { minute: 41, speaker: "System", text: "⚡ Deep dive completed! Finalizing with Step 4: Wrap Up.", type: "system" },
        { minute: 42, speaker: "Candidate", text: "To recap, we built a token-bucket lookup engine backed by active-active geo-replicated Redis, protected by local thread fallbacks.", type: "do" },
        { minute: 44, speaker: "Candidate", text: "For future scaling, we can move the lookup logic further to edge CDN locations (Cloudflare Workers) to shield our datacenters completely.", type: "do" },
        { minute: 45, speaker: "System", text: "🎉 Interview concluded! Feedback: COLLABORATIVE & PRAGMATIC. Strong Hire recommendation.", type: "success" }
    ];

    // Simulator clock ticking
    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setInterval(() => {
                setCurrentTime(t => {
                    if (t >= 45) {
                        setIsPlaying(false);
                        return 45;
                    }
                    return t + 1;
                });
            }, 600);
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    // Automatically synchronize activeStage with currentTime
    useEffect(() => {
        let currentStage = 0;
        if (currentTime <= 8) currentStage = 0;
        else if (currentTime <= 20) currentStage = 1;
        else if (currentTime <= 40) currentStage = 2;
        else currentStage = 3;
        setActiveStage(currentStage);
    }, [currentTime]);

    const activeEvents = simulationEvents.filter(ev => ev.minute <= currentTime);

    const handleSliderChange = (e) => {
        setCurrentTime(parseInt(e.target.value, 10));
        setIsPlaying(false);
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>⏱️ Interactive 45-Minute Interview Simulator</div>
            <p style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5, margin: '-8px 0 16px 0' }}>
                A standard system design interview lasts **45 minutes**. Slide the timeline to visualize optimal time budgeting and play a fast-forward simulation with realistic candidate dialogue.
            </p>

            {/* PIPELINE CONNECTING NODES (SVG + CSS) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 8px', background: '#0a0f1d', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                <svg style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, pointerEvents: 'none', zIndex: 1 }}>
                    <defs>
                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="33%" stopColor="#3b82f6" />
                            <stop offset="66%" stopColor="#ff7a00" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                    </defs>
                    <path d="M 12% 50% L 88% 50%" fill="none" stroke="url(#gradient-line)" strokeWidth="3" strokeOpacity="0.15" />
                    {/* Glowing active path based on current active step */}
                    <path 
                        d={`M 12% 50% L ${12 + activeStage * 25.3}% 50%`} 
                        fill="none" 
                        stroke="url(#gradient-line)" 
                        strokeWidth="3.5" 
                        strokeDasharray="4 2"
                        style={{ transition: 'all 0.5s ease' }} 
                    />
                </svg>

                {stages.map((st, idx) => {
                    const isActive = activeStage === idx;
                    const isPassed = activeStage > idx;
                    const stageColor = st.color;

                    return (
                        <div 
                            key={st.title} 
                            onClick={() => {
                                setCurrentTime(st.min);
                                setIsPlaying(false);
                            }}
                            style={{ 
                                display: 'flex', flexDirection: 'column', alignItems: 'center', 
                                flex: 1, zIndex: 2, cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Circle Node */}
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: `2px solid ${isActive ? stageColor : isPassed ? stageColor : 'var(--border)'}`,
                                background: isActive ? stageColor : isPassed ? `${stageColor}22` : '#111827',
                                color: isActive ? '#000' : isPassed ? stageColor : 'var(--text-muted)',
                                fontWeight: 800, fontSize: 12, transition: 'all 0.3s ease',
                                boxShadow: isActive ? `0 0 15px ${stageColor}66` : 'none'
                            }}>
                                {idx + 1}
                            </div>
                            <div style={{
                                fontSize: 10.5, fontWeight: isActive ? 800 : 600,
                                color: isActive ? 'var(--text-light)' : 'var(--text-muted)',
                                marginTop: 6, textAlign: 'center', transition: 'all 0.3s ease'
                            }}>
                                {st.title.split(':')[1].trim()}
                            </div>
                            <div style={{ fontSize: 8.5, color: isActive ? stageColor : 'var(--text-dim)', marginTop: 2, fontWeight: 700 }}>
                                {st.time}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* INTERACTION AND TIMELINE SLIDER AREA */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 18, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{
                                background: isPlaying ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 212, 170, 0.15)',
                                color: isPlaying ? '#ef4444' : '#00d4aa',
                                border: `1.5px solid ${isPlaying ? '#ef444455' : '#00d4aa55'}`,
                                borderRadius: 10, padding: '6px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', outline: 'none'
                            }}
                        >
                            <span>{isPlaying ? '⏸️ Pause Sim' : '▶ Play Simulation'}</span>
                        </button>
                        <button 
                            onClick={() => {
                                setCurrentTime(0);
                                setIsPlaying(false);
                            }}
                            style={{
                                background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)',
                                borderRadius: 10, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.2s', outline: 'none'
                            }}
                        >
                            🔄 Reset
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>Elapsed Time:</span>
                        <strong style={{ fontSize: 18, color: '#00d4aa', fontFamily: 'monospace' }}>{currentTime}</strong>
                        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 700 }}>/ 45 Mins</span>
                    </div>
                </div>

                {/* Timeline slider tracker */}
                <div style={{ position: 'relative', height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.04)', marginBottom: 8, display: 'flex', overflow: 'hidden' }}>
                    <div style={{ flex: 8, background: '#10b98122', borderRight: '1px solid #10b98133', height: '100%' }} />
                    <div style={{ flex: 12, background: '#3b82f622', borderRight: '1px solid #3b82f633', height: '100%' }} />
                    <div style={{ flex: 20, background: '#ff7a0022', borderRight: '1px solid #ff7a0033', height: '100%' }} />
                    <div style={{ flex: 5, background: '#ef444422', height: '100%' }} />

                    {/* Progress indicator overlay inside track */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        width: `${(currentTime / 45) * 100}%`,
                        background: 'linear-gradient(90deg, #10b981, #3b82f6, #ff7a00, #ef4444)',
                        opacity: 0.35, pointerEvents: 'none', transition: 'width 0.1s linear'
                    }} />
                </div>
                <input 
                    type="range" min="0" max="45" value={currentTime} onChange={handleSliderChange}
                    style={{ width: '100%', accentColor: '#00d4aa', cursor: 'pointer', outline: 'none' }}
                />
            </div>

            {/* TWO-COLUMN DETAILS BOARD */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                
                {/* Step Goals and Red Flags Card */}
                <div style={{
                    background: 'var(--bg-elevated)', border: `1.5px solid ${stages[activeStage].color}33`,
                    borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    boxShadow: `0 4px 20px ${stages[activeStage].color}05`
                }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 900, color: stages[activeStage].color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Active Focus Area
                            </span>
                            <span style={{ fontSize: 9.5, background: stages[activeStage].bg, color: stages[activeStage].color, padding: '2px 8px', borderRadius: 12, fontWeight: 800 }}>
                                {stages[activeStage].time}
                            </span>
                        </div>
                        
                        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-light)', marginBottom: 12 }}>
                            {stages[activeStage].title}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.02em' }}>
                                    ✔ Target Achievements:
                                </div>
                                {stages[activeStage].goals.map(g => (
                                    <div key={g} style={{ fontSize: 12, color: 'var(--text-gray)', marginBottom: 4, display: 'flex', gap: 6 }}>
                                        <span style={{ color: '#10b981' }}>•</span>
                                        <span>{g}</span>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.02em' }}>
                                    ⚠️ Critical Mistakes / Red Flags:
                                </div>
                                {stages[activeStage].mistakes.map(m => (
                                    <div key={m} style={{ fontSize: 12, color: 'var(--text-gray)', marginBottom: 4, display: 'flex', gap: 6 }}>
                                        <span style={{ color: '#ef4444' }}>•</span>
                                        <span>{m}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PLAYABLE SIMULATION EVENT LOGS & CHAT DIALOGUE */}
                <div style={{ background: '#0a0f1d', border: '1.5px solid var(--border)', borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 250 }}>
                    <div>
                        <div style={{ fontSize: 10.5, fontWeight: 900, color: '#00d4aa', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            💬 Interactive Dialogue Feed
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 180, overflowY: 'auto', paddingRight: 4 }}>
                            {activeEvents.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '40px 0', fontSize: 12, fontStyle: 'italic' }}>
                                    Simulation inactive. Move the slider or play the simulator to feed interview interactions in real time.
                                </div>
                            ) : (
                                activeEvents.map((ev, i) => {
                                    const isCandidate = ev.speaker === "Candidate";
                                    const isSystem = ev.speaker === "System";
                                    
                                    return (
                                        <div key={i} style={{ 
                                            display: 'flex', flexDirection: 'column', 
                                            alignSelf: isSystem ? 'center' : isCandidate ? 'flex-end' : 'flex-start',
                                            maxWidth: '90%', 
                                            background: isSystem ? 'rgba(255,255,255,0.02)' : isCandidate ? 'rgba(0, 212, 170, 0.08)' : 'rgba(59, 130, 246, 0.08)',
                                            border: `1px solid ${isSystem ? 'rgba(255,255,255,0.06)' : isCandidate ? 'rgba(0, 212, 170, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                                            borderRadius: 12, padding: '8px 12px',
                                            animation: 'slideIn 0.3s ease-out'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                <span style={{ 
                                                    fontSize: 9.5, fontWeight: 900, 
                                                    color: isSystem ? '#ff7a00' : isCandidate ? '#00d4aa' : '#3b82f6',
                                                    textTransform: 'uppercase' 
                                                }}>
                                                    {ev.speaker}
                                                </span>
                                                <span style={{ fontSize: 8.5, color: 'var(--text-dim)' }}>Min {ev.minute}</span>
                                            </div>
                                            <p style={{ fontSize: 11.5, color: 'var(--text-light)', lineHeight: 1.4, margin: 0 }}>
                                                {ev.text}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}


/* =========================================================================
   13. DosAndDontsWidget (Two-column visual reference card)
   ========================================================================= */
function DosAndDontsWidget() {
    const [activeTab, setActiveTab] = useState('evaluator'); // 'evaluator' or 'guide'
    
    // Quiz/Evaluator state
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState(null); // 'do' or 'dont'
    const [showFeedback, setShowFeedback] = useState(false);
    const [shakeError, setShakeError] = useState(false);
    const [pulseSuccess, setPulseSuccess] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    
    // Cheat Sheet/Guide state
    const [expandedDo, setExpandedDo] = useState(null);
    const [expandedDont, setExpandedDont] = useState(null);
    
    const scenarios = [
        {
            title: "Database Choice: 'Perfect NoSQL'",
            situation: "The interviewer asks you to pick a database for a high-write chat application. You select MongoDB and declare: 'MongoDB is the ultimate database. It has zero flaws, is infinitely scalable, and is 100% perfect for our chat system.'",
            isDo: false, // It's a DON'T
            explanation: "Never claim any technology is 'flawless' or '100% perfect'. In system design, every choice is a trade-off. Expressing overconfidence indicates a lack of real-world production experience where systems fail in unique ways.",
            bestScript: "A more collaborative and realistic answer would be: 'I'll choose MongoDB for its flexible schema and ease of horizontal scaling through sharding. However, we'll need to monitor our index memory usage carefully and plan for replica set failover latency, which can cause temporary write stalls.'",
            icon: "💾"
        },
        {
            title: "Whiteboard Block: The Silent Treatment",
            situation: "While designing a distributed rate limiter, you encounter a complex race condition with concurrent Redis queries. You stand silently in front of the whiteboard for 3 minutes, working out the logic in your head without speaking.",
            isDo: false, // It's a DON'T
            explanation: "Silence in a system design interview is a major red flag. The interviewer cannot evaluate your thought process. Treat the session as a collaborative design meeting: think out loud and discuss options.",
            bestScript: "Instead of staying silent, say: 'I'm thinking about how concurrent requests might read stale values from Redis before a decrement completes. We could resolve this using Redis Lua scripts for atomic updates, or transactional locks. Let me draw out the Lua script flow to see if that fits.'",
            icon: "🧠"
        },
        {
            title: "Scope Clarification: Active Boundaries",
            situation: "The interviewer asks you to design 'YouTube'. Before drawing any boxes, you ask: 'What is our Daily Active User target? What is the average size/length of a video? Do we need to support live streaming, or can we focus on on-demand uploads first?'",
            isDo: true, // It's a DO
            explanation: "This is a perfect example of scoping. Clarifying functional and non-functional requirements shows structured thinking and prevents you from designing the wrong system or over-engineering early.",
            bestScript: "You successfully bounded the problem! 'Let's write down our constraints: 100M active users, average 50MB video size, focusing on text metadata and video streaming. This helps us estimate that we need about 5PB of raw storage per day, directing us toward object storage rather than database BLOBs.'",
            icon: "🔍"
        },
        {
            title: "Interviewer Hint: The Resilient Pivot",
            situation: "You propose a single-master SQL server for financial transactions. The interviewer hints: 'What happens if a major power outage shuts down the primary datacenter?' You thank them and immediately discuss multi-region replication and active-passive failover SLAs.",
            isDo: true, // It's a DO
            explanation: "An interview is a cooperative dialogue. Interviewers give hints to guide you away from critical flaws. Accepting feedback gracefully and pivoting demonstrates high coachability and strong engineering maturity.",
            bestScript: "Excellent response: 'That's a vital point. To survive datacenter outages, we need a multi-region active-passive setup. We can replicate transactions asynchronously to a standby region, acknowledging that we trade off minor replication lag (RPO) for high disaster-recovery availability (RTO).'",
            icon: "💡"
        },
        {
            title: "The Whiteboard Rush: The Box Builder",
            situation: "The interviewer asks you to design a news feed service. You immediately draw four large boxes: 'Client', 'Server', 'Database', and 'Cache', and proudly say, 'Here is the architecture. Now let's dive into database table structures!'",
            isDo: false, // It's a DON'T
            explanation: "Jumping straight into drawing boxes without scoping or agreeing on core API features is a major mistake (often called the 'Box Builder' trap). You must understand the data model, scale, and access patterns first.",
            bestScript: "Instead, start with: 'Before we draw the high-level architecture, let's list the core APIs we need, such as feed generation and publishing. Once we establish the data flows, we can outline the components and map out how cache and database interact to meet our latency SLA.'",
            icon: "✏️"
        }
    ];

    const dos = [
        {
            title: "Ask clarifications (e.g. read-write ratios)",
            desc: "Clarifying constraints prevents you from building a system that either underperforms or is over-engineered.",
            script: "\"To tailor our resource allocation, could you tell me the active user base and the estimated write-to-read ratio? For instance, is this a write-heavy telemetry system or a read-heavy news feed?\"",
            reaction: "Interviewers appreciate that you don't make assumptions and instead design with precise data bounds in mind.",
            icon: "❓"
        },
        {
            title: "Write down assumptions on the whiteboard",
            desc: "Keeping numbers and features visible keeps both you and the interviewer on the same page.",
            script: "\"I'll write down our agreed bounds: 10M DAU, 100 million read requests/day, 10 million write requests/day, with a 10KB average payload size. This gives us about 1TB of write storage per day.\"",
            reaction: "Clear communication on whiteboards shows structured thinking and makes it easy to refer back to capacity limits during deep dives.",
            icon: "📝"
        },
        {
            title: "Agree on High-Level Design before deep dives",
            desc: "Prevents wasting valuable minutes detailing a component that the interviewer doesn't care about or thinks is in the wrong place.",
            script: "\"Here is the high-level outline: client to API Gateway, cached lookups, and asynchronous processing. Before we zoom into the database schemas or replication strategies, does this high-level layout look reasonable?\"",
            reaction: "Shows strong project management and collaborative design alignment, mimicking real engineering planning.",
            icon: "🤝"
        },
        {
            title: "Suggest multiple approaches & outline trade-offs",
            desc: "There is no single 'correct' answer in system design. Showing multiple options demonstrates breadth of knowledge.",
            script: "\"For real-time notifications, we could use WebSockets for low-latency bidirectional streams, or Server-Sent Events (SSE) for lighter uni-directional updates. WebSockets require stateful servers, while SSE is simpler to scale.\"",
            reaction: "Demonstrates seniority by acknowledging that every architectural decision has positive and negative trade-offs.",
            icon: "⚖️"
        },
        {
            title: "Estimate server & storage capacity",
            desc: "Back-of-the-envelope calculations justify your choice of database, cache, or bandwidth limits.",
            script: "\"With 1TB of raw media daily and a 3-way replication scheme, we will need 3TB of raw block storage per day. Over 3 years, that's roughly 3.3 Petabytes. We should definitely look at blob storage like S3 with cold-storage lifecycle policies.\"",
            reaction: "Proves you can ground abstract concepts into realistic hardware and cost constraints.",
            icon: "📊"
        }
    ];

    const donts = [
        {
            title: "Jump directly to design box diagrams (Don't be Jimmy)",
            desc: "Drawing boxes without context shows a lack of structured thinking and represents a high failure rate.",
            script: "\"Okay, I'll draw a user box, an app server box, a database box, and a cache box. We're done with high-level design!\" (Avoid this shortcut!)",
            reaction: "A huge red flag. It indicates the candidate solves problems by rote memorization instead of critical scoping.",
            icon: "📦"
        },
        {
            title: "Stay silent while thinking through logic",
            desc: "Leaves the interviewer in the dark and makes the interview feel like a silent test rather than a collaborative session.",
            script: "*Stands silently in front of the board for 3 minutes without saying a word, furrowing brow.* (Avoid this!)",
            reaction: "Makes the interviewer feel disconnected and unable to help or evaluate your problem-solving flow.",
            icon: "🔇"
        },
        {
            title: "Ignore hints and pushes from the interviewer",
            desc: "Interviewers often try to save you when they see you going down a rabbit hole. Missing these prompts is catastrophic.",
            script: "\"I understand you asked about database bottlenecks, but I really want to finish detailing this OAuth token validation flow first.\" (Avoid this stubbornness!)",
            reaction: "Signals stubbornness and lack of coachability, which are strong signals for a 'No Hire'.",
            icon: "⚠️"
        },
        {
            title: "Claim your architecture design is 100% perfect",
            desc: "Declaring a system is flawless shows lack of experience, since every system breaks under different scale conditions.",
            script: "\"This rate limiter is absolutely bulletproof. It will never fail, has zero latency, and Redis will never run out of memory.\" (Avoid this overclaim!)",
            reaction: "Indicates lack of real-world production experience. Real systems always fail in unexpected ways.",
            icon: "🏆"
        },
        {
            title: "Fail to address regional database failover patterns",
            desc: "Ignoring high availability and disaster recovery makes the system a toy design.",
            script: "\"If the database goes down, we just wait for it to reboot. The database doesn't fail often anyway.\" (Avoid this neglect!)",
            reaction: "Shows lack of understanding of web-scale reliability expectations and service level agreements (SLAs).",
            icon: "🌐"
        }
    ];

    const handleVote = (voteDo) => {
        if (userAnswer !== null) return; // Answered already
        
        const currentScenario = scenarios[currentIdx];
        const isCorrect = (voteDo && currentScenario.isDo) || (!voteDo && !currentScenario.isDo);
        
        setUserAnswer(voteDo ? 'do' : 'dont');
        setShowFeedback(true);
        
        if (isCorrect) {
            setScore(prev => prev + 1);
            setPulseSuccess(true);
            setTimeout(() => setPulseSuccess(false), 1000);
        } else {
            setShakeError(true);
            setTimeout(() => setShakeError(false), 1000);
        }
    };

    const handleNext = () => {
        setUserAnswer(null);
        setShowFeedback(false);
        if (currentIdx < scenarios.length - 1) {
            setCurrentIdx(prev => prev + 1);
        } else {
            setQuizFinished(true);
        }
    };

    const handleReset = () => {
        setCurrentIdx(0);
        setScore(0);
        setUserAnswer(null);
        setShowFeedback(false);
        setQuizFinished(false);
        setShakeError(false);
        setPulseSuccess(false);
    };

    // Styling helpers
    const tabButtonStyle = (isActive) => ({
        padding: '10px 20px',
        fontSize: 12,
        fontWeight: 800,
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: isActive ? 'var(--bg-elevated)' : 'transparent',
        color: isActive ? '#00d4aa' : 'var(--text-gray)',
        border: isActive ? '1px solid rgba(0, 212, 170, 0.3)' : '1px solid transparent',
        boxShadow: isActive ? '0 4px 12px rgba(0, 212, 170, 0.1)' : 'none',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6
    });

    return (
        <div style={containerStyle}>
            {/* Tab Header Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <div style={titleStyle}>📋 System Design Interview Playbook</div>
                <div style={{ display: 'flex', gap: 8, background: '#0a0f1d', padding: 4, borderRadius: 14, border: '1px solid var(--border)' }}>
                    <button onClick={() => setActiveTab('evaluator')} style={tabButtonStyle(activeTab === 'evaluator')}>
                        🎯 Scenario Evaluator
                    </button>
                    <button onClick={() => setActiveTab('guide')} style={tabButtonStyle(activeTab === 'guide')}>
                        📖 Detailed Guide
                    </button>
                </div>
            </div>

            {/* TAB 1: SCENARIO EVALUATOR */}
            {activeTab === 'evaluator' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    {!quizFinished ? (
                        <div style={{
                            background: 'var(--bg-elevated)',
                            borderRadius: 20,
                            border: shakeError 
                                ? '1.5px solid #ef4444' 
                                : pulseSuccess 
                                ? '1.5px solid #00d4aa' 
                                : '1px solid var(--border)',
                            padding: 20,
                            boxShadow: shakeError 
                                ? '0 0 20px rgba(239, 68, 68, 0.25)' 
                                : pulseSuccess 
                                ? '0 0 20px rgba(0, 212, 170, 0.25)' 
                                : '0 4px 20px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            animation: shakeError ? 'shake 0.5s ease-in-out' : pulseSuccess ? 'pulse-green 1s ease-in-out' : ''
                        }}>
                            {/* Quiz Header & Progress Bar */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Scenario {currentIdx + 1} of {scenarios.length}
                                </span>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: '#00d4aa', fontWeight: 800 }}>Score: {score}</span>
                                </div>
                            </div>

                            {/* Segmented Progress Tracker */}
                            <div style={{ display: 'flex', gap: 4, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.03)', marginBottom: 20, overflow: 'hidden' }}>
                                {scenarios.map((_, idx) => {
                                    const isDone = idx < currentIdx;
                                    const isCurrent = idx === currentIdx;
                                    return (
                                        <div key={idx} style={{
                                            flex: 1,
                                            height: '100%',
                                            background: isDone ? '#00d4aa' : isCurrent ? 'linear-gradient(90deg, #00d4aa, #3b82f6)' : 'rgba(255,255,255,0.05)',
                                            borderRadius: 3,
                                            transition: 'all 0.3s ease'
                                        }} />
                                    );
                                })}
                            </div>

                            {/* Scenario Content */}
                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 18 }}>
                                <div style={{ fontSize: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 16, width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {scenarios[currentIdx].icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-light)', margin: '0 0 6px 0' }}>
                                        {scenarios[currentIdx].title}
                                    </h4>
                                    <p style={{ fontSize: 13.5, color: '#ff7a00', background: 'rgba(255,122,0,0.05)', border: '1px solid rgba(255,122,0,0.15)', padding: '12px 14px', borderRadius: 12, lineHeight: 1.5, margin: 0 }}>
                                        <strong>Situation:</strong> {scenarios[currentIdx].situation}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {userAnswer === null ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                                    <button 
                                        onClick={() => handleVote(true)}
                                        style={{
                                            padding: '12px 20px', fontSize: 13, fontWeight: 800, borderRadius: 12, cursor: 'pointer',
                                            background: 'rgba(0, 212, 170, 0.08)', color: '#00d4aa', border: '1px solid rgba(0, 212, 170, 0.25)',
                                            transition: 'all 0.2s', outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 212, 170, 0.15)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(0,212,170,0.15)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 212, 170, 0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        ✅ This is a "DO"
                                    </button>
                                    <button 
                                        onClick={() => handleVote(false)}
                                        style={{
                                            padding: '12px 20px', fontSize: 13, fontWeight: 800, borderRadius: 12, cursor: 'pointer',
                                            background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)',
                                            transition: 'all 0.2s', outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(239,68,68,0.15)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        ❌ This is a "DON'T"
                                    </button>
                                </div>
                            ) : null}

                            {/* Feedback Overlay */}
                            {showFeedback && (
                                <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, animation: 'slideIn 0.3s ease-out' }}>
                                    {/* Verdict Banner */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 14px', borderRadius: 10,
                                        background: ((userAnswer === 'do' && scenarios[currentIdx].isDo) || (userAnswer === 'dont' && !scenarios[currentIdx].isDo))
                                            ? 'rgba(0, 212, 170, 0.1)' 
                                            : 'rgba(239, 68, 68, 0.1)',
                                        border: `1.5px solid ${((userAnswer === 'do' && scenarios[currentIdx].isDo) || (userAnswer === 'dont' && !scenarios[currentIdx].isDo)) ? '#00d4aa' : '#ef4444'}`,
                                        color: ((userAnswer === 'do' && scenarios[currentIdx].isDo) || (userAnswer === 'dont' && !scenarios[currentIdx].isDo)) ? '#00d4aa' : '#ef4444',
                                        fontSize: 14, fontWeight: 900, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em'
                                    }}>
                                        {((userAnswer === 'do' && scenarios[currentIdx].isDo) || (userAnswer === 'dont' && !scenarios[currentIdx].isDo)) ? (
                                            <>✨ Correct Decision! +10 XP</>
                                        ) : (
                                            <>⚠️ Interview Red Flag! Incorrect</>
                                        )}
                                    </div>

                                    {/* Detailed breakdown */}
                                    <p style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                                        {scenarios[currentIdx].explanation}
                                    </p>

                                    {/* Ideal response block */}
                                    <div style={{
                                        background: '#0a0f1d', border: '1px solid var(--border)', borderRadius: 14, padding: 14, marginBottom: 18
                                    }}>
                                        <div style={{ fontSize: 10, fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                                            💬 Recommended Candidate Script:
                                        </div>
                                        <p style={{ fontSize: 12.5, color: 'var(--text-light)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                                            {scenarios[currentIdx].bestScript}
                                        </p>
                                    </div>

                                    <button 
                                        onClick={handleNext}
                                        style={{
                                            width: '100%', padding: '12px 20px', fontSize: 13, fontWeight: 800, borderRadius: 12, cursor: 'pointer',
                                            background: '#3b82f6', color: '#fff', border: 'none', transition: 'all 0.2s', outline: 'none'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.boxShadow = '0 0 16px rgba(59,130,246,0.4)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        {currentIdx < scenarios.length - 1 ? "Next Scenario ➔" : "Complete & View Score ➔"}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Quiz Finished Score Card */
                        <div style={{
                            background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: 30, textAlign: 'center',
                            animation: 'scaleUp 0.3s ease-out', boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ fontSize: 50, marginBottom: 12 }}>
                                {score === scenarios.length ? "👑" : score >= 3 ? "🥈" : "⚡"}
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-light)', margin: '0 0 8px 0' }}>
                                Evaluation Completed!
                            </h3>
                            <p style={{ fontSize: 14, color: 'var(--text-gray)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                                You correctly labeled **{score} out of {scenarios.length}** interview behaviors.
                            </p>

                            {/* Performance Meter */}
                            <div style={{ background: '#0a0f1d', borderRadius: 16, border: '1px solid var(--border)', padding: 18, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8 }}>
                                    <span>Interview Standing</span>
                                    <span style={{ color: score === scenarios.length ? '#00d4aa' : score >= 3 ? '#ff7a00' : '#ef4444' }}>
                                        {score === scenarios.length ? "Strong Hire" : score >= 3 ? "Lean Hire" : "No Hire"}
                                    </span>
                                </div>
                                <div style={{ height: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 5, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(score / scenarios.length) * 100}%`,
                                        height: '100%',
                                        background: score === scenarios.length ? '#00d4aa' : score >= 3 ? '#ff7a00' : '#ef4444',
                                        borderRadius: 5,
                                        transition: 'width 0.5s ease-out'
                                    }} />
                                </div>
                            </div>

                            <button 
                                onClick={handleReset}
                                style={{
                                    padding: '10px 24px', fontSize: 12, fontWeight: 800, borderRadius: 12, cursor: 'pointer',
                                    background: 'transparent', color: '#00d4aa', border: '1px solid rgba(0, 212, 170, 0.4)',
                                    transition: 'all 0.2s', outline: 'none'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,170,0.05)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                                🔄 Retry Scenario Sandbox
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: DETAILED CHEAT SHEET REFERENCE GUIDE */}
            {activeTab === 'guide' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, animation: 'fadeIn 0.3s ease-out' }}>
                    {/* DO Column */}
                    <div style={{
                        background: 'rgba(0, 212, 170, 0.02)',
                        border: '1.5px solid rgba(0, 212, 170, 0.15)',
                        borderRadius: 20,
                        padding: 18,
                        boxShadow: '0 4px 20px rgba(0, 212, 170, 0.02)'
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#00d4aa', borderBottom: '1px solid rgba(0,212,170,0.1)', paddingBottom: 8, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            ✅ Core Interview DOs
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {dos.map((item, idx) => {
                                const isExpanded = expandedDo === idx;
                                return (
                                    <div 
                                        key={idx}
                                        style={{
                                            border: `1px solid ${isExpanded ? 'rgba(0, 212, 170, 0.3)' : 'var(--border)'}`,
                                            background: isExpanded ? 'rgba(0, 212, 170, 0.04)' : 'var(--bg-elevated)',
                                            borderRadius: 14,
                                            padding: 12,
                                            cursor: 'pointer',
                                            transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
                                        }}
                                        onClick={() => setExpandedDo(isExpanded ? null : idx)}
                                        onMouseEnter={(e) => { if(!isExpanded) e.currentTarget.style.borderColor = 'rgba(0,212,170,0.2)'; }}
                                        onMouseLeave={(e) => { if(!isExpanded) e.currentTarget.style.borderColor = 'var(--border)'; }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 16 }}>{item.icon}</span>
                                                <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-light)', lineHeight: 1.4 }}>
                                                    {item.title}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: 10, color: 'var(--text-dim)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                                ▼
                                            </span>
                                        </div>

                                        {isExpanded && (
                                            <div style={{ marginTop: 12, borderTop: '1px solid rgba(0, 212, 170, 0.1)', paddingTop: 10, animation: 'slideDown 0.25s ease-out' }}>
                                                <p style={{ fontSize: 11.5, color: 'var(--text-gray)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                                                    {item.desc}
                                                </p>
                                                
                                                {/* What to Say */}
                                                <div style={{ background: '#0a0f1d', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: 8 }}>
                                                    <span style={{ fontSize: 9, fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                                                        💬 Recommended Script:
                                                    </span>
                                                    <span style={{ fontSize: 11.5, color: 'var(--text-light)', fontStyle: 'italic', lineHeight: 1.4 }}>
                                                        {item.script}
                                                    </span>
                                                </div>

                                                {/* Interviewer response */}
                                                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', padding: '2px 4px' }}>
                                                    <span style={{ fontSize: 11 }}>💡</span>
                                                    <span style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 }}>
                                                        <strong>Evaluator Lens:</strong> {item.reaction}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* DONT Column */}
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.02)',
                        border: '1.5px solid rgba(239, 68, 68, 0.15)',
                        borderRadius: 20,
                        padding: 18,
                        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.02)'
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#ef4444', borderBottom: '1px solid rgba(239,68,68,0.1)', paddingBottom: 8, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            ❌ Core Interview DON'Ts
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {donts.map((item, idx) => {
                                const isExpanded = expandedDont === idx;
                                return (
                                    <div 
                                        key={idx}
                                        style={{
                                            border: `1px solid ${isExpanded ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)'}`,
                                            background: isExpanded ? 'rgba(239, 68, 68, 0.04)' : 'var(--bg-elevated)',
                                            borderRadius: 14,
                                            padding: 12,
                                            cursor: 'pointer',
                                            transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
                                        }}
                                        onClick={() => setExpandedDont(isExpanded ? null : idx)}
                                        onMouseEnter={(e) => { if(!isExpanded) e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
                                        onMouseLeave={(e) => { if(!isExpanded) e.currentTarget.style.borderColor = 'var(--border)'; }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 16 }}>{item.icon}</span>
                                                <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-light)', lineHeight: 1.4 }}>
                                                    {item.title}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: 10, color: 'var(--text-dim)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                                ▼
                                            </span>
                                        </div>

                                        {isExpanded && (
                                            <div style={{ marginTop: 12, borderTop: '1px solid rgba(239, 68, 68, 0.1)', paddingTop: 10, animation: 'slideDown 0.25s ease-out' }}>
                                                <p style={{ fontSize: 11.5, color: 'var(--text-gray)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                                                    {item.desc}
                                                </p>
                                                
                                                {/* What to Say */}
                                                <div style={{ background: '#0a0f1d', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: 8 }}>
                                                    <span style={{ fontSize: 9, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                                                        ⚠️ Red Flag Script:
                                                    </span>
                                                    <span style={{ fontSize: 11.5, color: 'var(--text-light)', fontStyle: 'italic', lineHeight: 1.4 }}>
                                                        {item.script}
                                                    </span>
                                                </div>

                                                {/* Interviewer response */}
                                                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', padding: '2px 4px' }}>
                                                    <span style={{ fontSize: 11 }}>💡</span>
                                                    <span style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 }}>
                                                        <strong>Evaluator Lens:</strong> {item.reaction}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Core Animations */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; max-height: 0px; overflow: hidden; }
                    to { opacity: 1; max-height: 500px; }
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.97); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-6px); }
                    40%, 80% { transform: translateX(6px); }
                }
                @keyframes pulse-green {
                    0% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.4); }
                    70% { box-shadow: 0 0 0 12px rgba(0, 212, 170, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0); }
                }
                .shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}} />
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
    const [capacity, setCapacity] = useState(10);
    const [refillRate, setRefillRate] = useState(2); // tokens/sec

    const [queue, setQueue] = useState([]);
    const [queueCapacity, setQueueCapacity] = useState(5);
    const [leakRate, setLeakRate] = useState(1); // drips/sec
    const lastLeakTime = useRef(Date.now());

    const [fixedWindow, setFixedWindow] = useState({ count: 0, limit: 5, windowStart: Date.now() });
    const [fixedWindowLimit, setFixedWindowLimit] = useState(5);

    const [slidingLog, setSlidingLog] = useState([]);
    const [slidingLogLimit, setSlidingLogLimit] = useState(4);

    const [slidingCounter, setSlidingCounter] = useState({ prevCount: 3, currentCount: 0, startTime: Date.now() });
    const [slidingCounterLimit, setSlidingCounterLimit] = useState(5);

    const [now, setNow] = useState(Date.now());
    const [logs, setLogs] = useState([]);
    const [benchmarkLogs, setBenchmarkLogs] = useState([]);

    // Keep active algorithm state in sync if parent prop changes
    useEffect(() => {
        setAlgo(initialAlgo);
        setLogs([]);
        setBenchmarkLogs([]);
    }, [initialAlgo]);

    // Single unified ticking timer loop (continuous delta states)
    useEffect(() => {
        const timer = setInterval(() => {
            const time = Date.now();
            setNow(time);

            // Token Bucket Refill
            setTokens(t => {
                if (algo === 'token-bucket') {
                    return Math.min(capacity, t + (refillRate * 0.1));
                }
                return t;
            });

            // Leaking Bucket Leak
            if (algo === 'leaking-bucket') {
                const elapsedLeak = time - lastLeakTime.current;
                const leakInterval = 1000 / leakRate;
                if (elapsedLeak >= leakInterval) {
                    setQueue(q => q.slice(1));
                    lastLeakTime.current = time;
                }
            }

            // Fixed Window Reset
            setFixedWindow(fw => {
                if (algo === 'fixed-window') {
                    if (time - fw.windowStart >= 3000) {
                        return { count: 0, limit: fixedWindowLimit, windowStart: time };
                    }
                }
                return { ...fw, limit: fixedWindowLimit };
            });

            // Sliding Window Log Sweep
            setSlidingLog(sl => {
                if (algo === 'sliding-window-log') {
                    const oneWindowAgo = time - 3000;
                    return sl.filter(t => t > oneWindowAgo);
                }
                return sl;
            });

            // Sliding Window Counter Reset
            setSlidingCounter(sc => {
                if (algo === 'sliding-window-counter') {
                    if (time - sc.startTime >= 3000) {
                        return { prevCount: sc.currentCount, currentCount: 0, startTime: time };
                    }
                }
                return sc;
            });

        }, 100);

        return () => clearInterval(timer);
    }, [algo, capacity, refillRate, leakRate, fixedWindowLimit]);

    const triggerRequest = () => {
        const time = Date.now();
        let allowed = false;
        let detail = '';

        if (algo === 'token-bucket') {
            if (tokens >= 1) {
                setTokens(t => t - 1);
                allowed = true;
                detail = `Consumed 1 token. Available: ${Math.floor(tokens - 1)}/${capacity}`;
            } else {
                allowed = false;
                detail = `Rate Limited (429). 0 tokens available in bucket.`;
            }
        } else if (algo === 'leaking-bucket') {
            if (queue.length < queueCapacity) {
                setQueue(q => [...q, time]);
                allowed = true;
                detail = `Request buffered in queue (Depth: ${queue.length + 1}/${queueCapacity})`;
            } else {
                allowed = false;
                detail = `Rate Limited (429). Leaking bucket overflowed! Buffer capacity reached.`;
            }
        } else if (algo === 'fixed-window') {
            if (fixedWindow.count < fixedWindowLimit) {
                setFixedWindow(fw => ({ ...fw, count: fw.count + 1 }));
                allowed = true;
                detail = `Allowed. Window slot count: ${fixedWindow.count + 1}/${fixedWindowLimit}`;
            } else {
                allowed = false;
                detail = `Rate Limited (429). Window slot full (${fixedWindow.count}/${fixedWindowLimit}).`;
            }
        } else if (algo === 'sliding-window-log') {
            const oneWindowAgo = time - 3000;
            const validLogs = slidingLog.filter(t => t > oneWindowAgo);
            if (validLogs.length < slidingLogLimit) {
                setSlidingLog([...validLogs, time]);
                allowed = true;
                detail = `Allowed. Current Sliding Window Log size: ${validLogs.length + 1}/${slidingLogLimit}`;
            } else {
                setSlidingLog([...validLogs]);
                allowed = false;
                detail = `Rate Limited (429). Window holds maximum log capacity (${validLogs.length}/${slidingLogLimit}).`;
            }
        } else if (algo === 'sliding-window-counter') {
            const windowSize = 3000;
            const elapsedTime = time - slidingCounter.startTime;
            const prevWeight = Math.max(0, 1 - (elapsedTime / windowSize));
            const calculatedRequests = Math.floor(slidingCounter.prevCount * prevWeight) + slidingCounter.currentCount;

            if (calculatedRequests < slidingCounterLimit) {
                setSlidingCounter(sc => ({ ...sc, currentCount: sc.currentCount + 1 }));
                allowed = true;
                detail = `Allowed. Weighted total count: ${calculatedRequests + 1}/${slidingCounterLimit}`;
            } else {
                allowed = false;
                detail = `Rate Limited (429). Weighted sliding window limit breached (${calculatedRequests}/${slidingCounterLimit}).`;
            }
        }

        setLogs(l => [{ id: time, allowed, algo, detail }, ...l.slice(0, 4)]);
    };

    const triggerBenchmarkBroadcast = () => {
        const time = Date.now();
        
        // 1. Token Bucket
        const tbAllowed = tokens >= 1;
        if (tbAllowed) setTokens(t => t - 1);

        // 2. Leaking Bucket
        const lbAllowed = queue.length < queueCapacity;
        if (lbAllowed) setQueue(q => [...q, time]);

        // 3. Fixed Window
        const fwAllowed = fixedWindow.count < fixedWindowLimit;
        if (fwAllowed) setFixedWindow(fw => ({ ...fw, count: fw.count + 1 }));

        // 4. Sliding Window Log
        const oneWindowAgo = time - 3000;
        const validLogs = slidingLog.filter(t => t > oneWindowAgo);
        const slAllowed = validLogs.length < slidingLogLimit;
        if (slAllowed) setSlidingLog([...validLogs, time]);

        // 5. Sliding Window Counter
        const windowSize = 3000;
        const elapsedTime = time - slidingCounter.startTime;
        const prevWeight = Math.max(0, 1 - (elapsedTime / windowSize));
        const calculatedRequests = Math.floor(slidingCounter.prevCount * prevWeight) + slidingCounter.currentCount;
        const scAllowed = calculatedRequests < slidingCounterLimit;
        if (scAllowed) setSlidingCounter(sc => ({ ...sc, currentCount: sc.currentCount + 1 }));

        setBenchmarkLogs(prev => [
            {
                id: time,
                tb: tbAllowed ? '✓ ALLOW (200)' : '❌ DENY (429)',
                lb: lbAllowed ? '✓ QUEUE (200)' : '❌ DENY (429)',
                fw: fwAllowed ? '✓ ALLOW (200)' : '❌ DENY (429)',
                sl: slAllowed ? '✓ ALLOW (200)' : '❌ DENY (429)',
                sc: scAllowed ? '✓ ALLOW (200)' : '❌ DENY (429)'
            },
            ...prev.slice(0, 4)
        ]);
    };

    const resetSimulator = () => {
        setTokens(capacity);
        setQueue([]);
        setLogs([]);
        setBenchmarkLogs([]);
        setFixedWindow({ count: 0, limit: fixedWindowLimit, windowStart: Date.now() });
        setSlidingLog([]);
        setSlidingCounter({ prevCount: 3, currentCount: 0, startTime: Date.now() });
    };

    const formattedAlgoName = (name) => {
        return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    return (
        <div style={containerStyle} id="rate-limiter-sandbox-container">
            <div style={titleStyle}>🛡️ Rate Limiting Algorithm Laboratory</div>

            {/* Selector Grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, background: 'var(--bg-elevated)', borderRadius: 16, padding: 6, marginBottom: 20 }}>
                {['token-bucket', 'leaking-bucket', 'fixed-window', 'sliding-window-log', 'sliding-window-counter'].map(a => (
                    <button key={a} onClick={() => { setAlgo(a); setLogs([]); }} style={{
                        flex: '1 1 120px', padding: '10px 12px', fontSize: 11, fontWeight: 800, border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                        background: algo === a ? 'var(--bg-surface)' : 'transparent',
                        color: algo === a ? '#00d4aa' : 'var(--text-muted)',
                        boxShadow: algo === a ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                        border: algo === a ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent'
                    }}>
                        {a.replace(/-/g, ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Main Interactive Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                
                {/* Visualizer Frame */}
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ⚙️ Live Simulator & SVG Engine ({formattedAlgoName(algo)})
                    </div>

                    {/* Simulation Subsystems */}
                    {algo === 'token-bucket' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Bucket capacity (Max Tokens): <strong>{capacity}</strong></span>
                                    <input type="range" min="5" max="20" value={capacity} onChange={e => { setCapacity(Number(e.target.value)); setTokens(t => Math.min(Number(e.target.value), t)); }} style={{ width: 120, accentColor: '#00d4aa' }} />
                                </label>
                                <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Refill speed: <strong>{refillRate} tokens/s</strong></span>
                                    <input type="range" min="1" max="5" step="0.5" value={refillRate} onChange={e => setRefillRate(Number(e.target.value))} style={{ width: 120, accentColor: '#00d4aa' }} />
                                </label>
                            </div>

                            {/* SVG Bucket Animation */}
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                                <svg width="220" height="180" viewBox="0 0 220 180" style={{ filter: 'drop-shadow(0 4px 20px rgba(0,212,170,0.15))' }}>
                                    {/* Bucket Outlines */}
                                    <path d="M 60 20 L 40 140 Q 40 160 60 160 L 160 160 Q 180 160 180 140 L 160 20" fill="rgba(255,255,255,0.02)" stroke="var(--border-strong)" strokeWidth="3" />
                                    {/* Glass reflection */}
                                    <path d="M 62 25 L 45 130" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                                    
                                    {/* Liquid/Token fill glow background */}
                                    <rect x="50" y={150 - (tokens / capacity) * 110} width="120" height={(tokens / capacity) * 110} fill="rgba(0,212,170,0.08)" style={{ transition: 'all 0.1s' }} />

                                    {/* Dynamic floating tokens */}
                                    {Array.from({ length: Math.ceil(tokens) }).map((_, idx) => {
                                        const col = idx % 4;
                                        const row = Math.floor(idx / 4);
                                        const cx = 75 + col * 23 + (row % 2) * 8;
                                        const cy = 145 - row * 22;
                                        return (
                                            <circle key={idx} cx={cx} cy={cy} r="8" fill="url(#tokenGlow)" stroke="#00d4aa" strokeWidth="1.5" style={{ transition: 'all 0.3s ease-out' }} />
                                        );
                                    })}
                                    
                                    {/* Empty Indicator */}
                                    {tokens < 1 && (
                                        <text x="110" y="90" fill="#ef4444" fontSize="12" fontWeight="900" textAnchor="middle">⚠️ BUCKET EMPTY</text>
                                    )}

                                    {/* Defs for glossy tokens */}
                                    <defs>
                                        <radialGradient id="tokenGlow" cx="40%" cy="40%" r="60%">
                                            <stop offset="0%" stopColor="#86efac" />
                                            <stop offset="70%" stopColor="#00d4aa" />
                                            <stop offset="100%" stopColor="#047857" />
                                        </radialGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#00d4aa', textAlign: 'center' }}>
                                Available Token Balance: {Math.floor(tokens)} / {capacity}
                            </div>
                        </div>
                    )}

                    {algo === 'leaking-bucket' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Buffer Capacity (Max Queue): <strong>{queueCapacity}</strong></span>
                                    <input type="range" min="3" max="8" value={queueCapacity} onChange={e => { setQueueCapacity(Number(e.target.value)); setQueue(q => q.slice(0, Number(e.target.value))); }} style={{ width: 120, accentColor: '#3b82f6' }} />
                                </label>
                                <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Leak dripping speed: <strong>{leakRate} req/s</strong></span>
                                    <input type="range" min="0.5" max="3" step="0.5" value={leakRate} onChange={e => setLeakRate(Number(e.target.value))} style={{ width: 120, accentColor: '#3b82f6' }} />
                                </label>
                            </div>

                            {/* Leaking Bucket Funnel SVG */}
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                                <svg width="220" height="180" viewBox="0 0 220 180" style={{ filter: 'drop-shadow(0 4px 20px rgba(59,130,246,0.15))' }}>
                                    {/* Funnel Bucket Outlines */}
                                    <path d="M 50 20 L 60 120 L 100 150 L 100 165 L 120 165 L 120 150 L 160 120 L 170 20" fill="rgba(255,255,255,0.02)" stroke="var(--border-strong)" strokeWidth="3" />
                                    
                                    {/* Fluid fill inside funnel */}
                                    {queue.length > 0 && (
                                        <path d={`M ${55} ${120 - (queue.length / queueCapacity) * 80} L ${60} 120 L 102 148 L 118 148 L 160 120 L ${165} ${120 - (queue.length / queueCapacity) * 80} Z`} fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth="1.5" style={{ transition: 'all 0.3s' }} />
                                    )}

                                    {/* Dripping Drop animation */}
                                    <circle cx="110" cy={165 + ((now % 1000) / 1000) * 15} r="3" fill="#3b82f6" opacity={queue.length > 0 ? 1 : 0} />

                                    {/* Fluid Depth representation */}
                                    {Array.from({ length: queue.length }).map((_, idx) => (
                                        <rect key={idx} x={75} y={112 - idx * 16} width="70" height="12" rx="4" fill="rgba(59,130,246,0.4)" stroke="#60a5fa" strokeWidth="1" />
                                    ))}

                                    {queue.length === 0 && (
                                        <text x="110" y="80" fill="var(--text-dim)" fontSize="11.5" textAnchor="middle">📭 BUFFER EMPTY</text>
                                    )}
                                </svg>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#3b82f6', textAlign: 'center' }}>
                                Queued Buffer Depth: {queue.length} / {queueCapacity}
                            </div>
                        </div>
                    )}

                    {algo === 'fixed-window' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Rate threshold limit: <strong>{fixedWindowLimit}</strong></span>
                                    <input type="range" min="2" max="10" value={fixedWindowLimit} onChange={e => setFixedWindowLimit(Number(e.target.value))} style={{ width: 120, accentColor: '#ff7a00' }} />
                                </label>
                            </div>

                            {/* Timeline with Sweep Scanning */}
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 800 }}>
                                    <span>WINDOW START</span>
                                    <span>3000ms BLOCK DURATION</span>
                                </div>

                                {/* ProgressBar */}
                                <div style={{ height: 10, background: 'var(--bg-elevated)', borderRadius: 6, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
                                    <div style={{
                                        position: 'absolute', top: 0, bottom: 0, left: 0,
                                        width: `${Math.min(100, ((now - fixedWindow.windowStart) / 3000) * 100)}%`,
                                        background: 'rgba(255,122,0,0.15)', borderRight: '2px solid #ff7a00'
                                    }} />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-light)' }}>
                                        Slots Consumed: <strong style={{ color: fixedWindow.count >= fixedWindowLimit ? '#ef4444' : '#ff7a00' }}>{fixedWindow.count} / {fixedWindowLimit}</strong>
                                    </span>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                        Reset in: {Math.max(0, (3 - (now - fixedWindow.windowStart) / 1000).toFixed(1))}s
                                    </span>
                                </div>
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-dim)', background: 'rgba(255,122,0,0.05)', padding: 10, borderRadius: 10, border: '1px solid rgba(255,122,0,0.15)' }}>
                                ⚠️ <strong>Edge Burst Risk</strong>: Fixed Window allows maximum limit at the end of Window A and immediately at the start of Window B, allowing a 2x rate burst!
                            </div>
                        </div>
                    )}

                    {algo === 'sliding-window-log' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Log limit boundary: <strong>{slidingLogLimit}</strong></span>
                                    <input type="range" min="2" max="6" value={slidingLogLimit} onChange={e => setSlidingLogLimit(Number(e.target.value))} style={{ width: 120, accentColor: '#8b5cf6' }} />
                                </label>
                            </div>

                            {/* Sliding Log Timeline */}
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                                    ⏳ Live Sliding Window Log (Rolling 3s Window)
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 90, justifyContent: 'center' }}>
                                    {slidingLog.length === 0 ? (
                                        <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center' }}>No log timestamps in active window.</div>
                                    ) : (
                                        slidingLog.map((t, idx) => {
                                            const ageMs = now - t;
                                            const percent = Math.min(100, (ageMs / 3000) * 100);
                                            return (
                                                <div key={idx} style={{
                                                    display: 'flex', justifyContent: 'space-between', padding: '6px 12px',
                                                    background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8,
                                                    fontSize: 11, fontFamily: 'monospace', opacity: Math.max(0.2, 1 - (ageMs / 3000)),
                                                    transform: `scale(${Math.max(0.9, 1 - (ageMs / 10000))})`,
                                                    transition: 'all 0.1s'
                                                }}>
                                                    <span style={{ color: '#8b5cf6' }}>➔ Request {idx + 1}</span>
                                                    <span>-{(ageMs / 1000).toFixed(1)}s ago (Age)</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#8b5cf6', textAlign: 'center' }}>
                                Active Timestamps in Log: {slidingLog.length} / {slidingLogLimit}
                            </div>
                        </div>
                    )}

                    {algo === 'sliding-window-counter' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Weighted limit threshold: <strong>{slidingCounterLimit}</strong></span>
                                    <input type="range" min="3" max="8" value={slidingCounterLimit} onChange={e => setSlidingCounterLimit(Number(e.target.value))} style={{ width: 120, accentColor: '#00d4aa' }} />
                                </label>
                            </div>

                            {/* Dual Cylinder Cylinder Layout */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 10, textAlign: 'center' }}>
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800 }}>PREV WINDOW</div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-dim)', margin: '4px 0' }}>{slidingCounter.prevCount}</div>
                                    <div style={{ fontSize: 10, color: '#ff7a00', fontWeight: 700 }}>
                                        Weight: {Math.max(0, 1 - ((now - slidingCounter.startTime) / 3000)).toFixed(2)}
                                    </div>
                                </div>
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 10, textAlign: 'center' }}>
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800 }}>CURRENT WINDOW</div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: '#00d4aa', margin: '4px 0' }}>{slidingCounter.currentCount}</div>
                                    <div style={{ fontSize: 10, color: '#00d4aa', fontWeight: 700 }}>
                                        Weight: {(1 - Math.max(0, 1 - ((now - slidingCounter.startTime) / 3000))).toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Equation Engine Display */}
                            <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 12, border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                                    🔬 Mathematical Formula Model
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-light)', lineHeight: 1.5 }}>
                                    Calculated Count = <br />
                                    ({slidingCounter.prevCount} × {Math.max(0, 1 - ((now - slidingCounter.startTime) / 3000)).toFixed(2)}) + {slidingCounter.currentCount} = <br />
                                    <strong style={{ fontSize: 13, color: '#00d4aa' }}>
                                        {Math.floor(slidingCounter.prevCount * Math.max(0, 1 - ((now - slidingCounter.startTime) / 3000))) + slidingCounter.currentCount} / {slidingCounterLimit}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Trigger Controls */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                        <button onClick={triggerRequest} style={{
                            ...btnStyle, flex: 2, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.3)',
                            padding: '12px 16px', fontSize: 12, borderRadius: 12
                        }} id="sandbox-send-request-btn">
                            ⚡ Send Request packet
                        </button>
                        <button onClick={resetSimulator} style={{
                            ...btnStyle, flex: 1, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)',
                            padding: '12px 10px', fontSize: 11, borderRadius: 12
                        }} id="sandbox-reset-btn">
                            Reset Lab
                        </button>
                    </div>

                </div>

                {/* Right Side Logs Monitor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    
                    {/* Live Request Logger */}
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                            🗂️ Live Transaction Logger
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 180 }}>
                            {logs.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>
                                    No requests fired yet.<br />Click "Send Request packet" to trigger.
                                </div>
                            ) : (
                                logs.map(l => (
                                    <div key={l.id} style={{
                                        display: 'flex', flexDirection: 'column', padding: 10, background: 'var(--bg-surface)',
                                        border: '1px solid var(--border)', borderRadius: 10, gap: 4, transition: 'all 0.25s'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{
                                                fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                                                background: l.allowed ? 'rgba(0,212,170,0.12)' : 'rgba(239,68,68,0.12)',
                                                color: l.allowed ? '#00d4aa' : '#ef4444'
                                            }}>
                                                {l.allowed ? '✓ ALLOW (200)' : '❌ DENY (429)'}
                                            </span>
                                            <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                                                {new Date(l.id).toISOString().slice(17, -1)}s
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 11.5, color: 'var(--text-light)', lineHeight: 1.4 }}>{l.detail}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Benchmark Sandbox Broadcast tool */}
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                                🏁 Head-to-Head Benchmark Suite
                            </div>
                            <button onClick={triggerBenchmarkBroadcast} style={{
                                ...btnStyle, fontSize: 10.5, padding: '6px 12px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)'
                            }} id="benchmark-broadcast-btn">
                                🚀 Broadcast packet to all algos
                            </button>
                        </div>

                        {benchmarkLogs.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', fontSize: 8.5, fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 4, borderBottom: '1px solid var(--border)' }}>
                                    <span>TOKEN</span>
                                    <span>LEAK</span>
                                    <span>FIXED</span>
                                    <span>SL-LOG</span>
                                    <span>SL-COUNT</span>
                                </div>
                                {benchmarkLogs.map(bl => (
                                    <div key={bl.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', fontSize: 10, textAlign: 'center', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <span style={{ color: bl.tb.includes('✓') ? '#00d4aa' : '#ef4444', fontWeight: 800 }}>{bl.tb.split(' ')[0]}</span>
                                        <span style={{ color: bl.lb.includes('✓') ? '#3b82f6' : '#ef4444', fontWeight: 800 }}>{bl.lb.split(' ')[0]}</span>
                                        <span style={{ color: bl.fw.includes('✓') ? '#ff7a00' : '#ef4444', fontWeight: 800 }}>{bl.fw.split(' ')[0]}</span>
                                        <span style={{ color: bl.sl.includes('✓') ? '#8b5cf6' : '#ef4444', fontWeight: 800 }}>{bl.sl.split(' ')[0]}</span>
                                        <span style={{ color: bl.sc.includes('✓') ? '#00d4aa' : '#ef4444', fontWeight: 800 }}>{bl.sc.split(' ')[0]}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ fontSize: 10.5, color: 'var(--text-dim)', textAlign: 'center', padding: '10px 0' }}>
                                Broadcast requests to benchmark all algorithms side-by-side!
                            </div>
                        )}
                    </div>

                </div>

            </div>

            {/* Platform comparison Cheat Sheet */}
            {(showComparison || true) && (
                <div style={{ marginTop: 20, padding: 16, background: 'rgba(0,212,170,0.03)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase', marginBottom: 8 }}>
                        💡 Core Algorithm Characteristics Cheat Sheet
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, fontSize: 11.5, color: 'var(--text-gray)', lineHeight: 1.5 }}>
                        <div>
                            <strong style={{ color: '#00d4aa' }}>Token Bucket</strong>: Extremely memory efficient; native support for sudden spikes/bursts of valid traffic.
                        </div>
                        <div>
                            <strong style={{ color: '#3b82f6' }}>Leaking Bucket</strong>: Enforces a steady, smooth outbound rate; excellent for batch API jobs.
                        </div>
                        <div>
                            <strong style={{ color: '#ff7a00' }}>Fixed Window</strong>: Super simple, but vulnerable to boundary double-limit burst exploits.
                        </div>
                        <div>
                            <strong style={{ color: '#8b5cf6' }}>Sliding Log</strong>: 100% accurate sliding checks, but high memory cost from storing timestamps.
                        </div>
                        <div>
                            <strong style={{ color: '#00d4aa' }}>Sliding Counter</strong>: Low memory footprint approximation of sliding log; scale-resilient.
                        </div>
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

    // Bouncer States
    const [bouncerShield, setBouncerShield] = useState(true);
    const [bouncerCpu, setBouncerCpu] = useState(8);
    const [bouncerLogs, setBouncerLogs] = useState([]);
    
    // Placement States
    const [placementSelection, setPlacementSelection] = useState(null);

    // Requirements States
    const [reqs, setReqs] = useState({
        lowLatency: true,
        distributed: false,
        headers: true,
        faultTolerant: false,
        hardCap: true,
        globalSync: false
    });

    // Middleware States
    const [mwAliceCount, setMwAliceCount] = useState(0);
    const [mwBotCount, setMwBotCount] = useState(0);
    const [mwHistory, setMwHistory] = useState([]);

    // Rules States
    const [rulesInput, setRulesInput] = useState(`{
  "rate_limit_rules": {
    "login_endpoint": {
      "limit": 5,
      "window_seconds": 10
    },
    "profile_endpoint": {
      "limit": 60,
      "window_seconds": 60
    }
  }
}`);
    const [rulesLog, setRulesLog] = useState("✓ Rules parsed and loaded. Redis key slots initialized.");
    const [rulesCount, setRulesCount] = useState(0);

    // Headers States
    const [headerSpike, setHeaderSpike] = useState(false);
    const [headerLimitRemaining, setHeaderLimitRemaining] = useState(10);
    const [headerHistory, setHeaderHistory] = useState([]);

    // Concurrency States
    const [concurrencyMode, setConcurrencyMode] = useState('naive'); // naive vs lua
    const [concurrencyLogs, setConcurrencyLogs] = useState([]);
    const [concurrencyCounter, setConcurrencyCounter] = useState(4);

    // Distributed Sync States
    const [syncModel, setSyncModel] = useState('centralized'); // local vs centralized
    const [syncCounters, setSyncCounters] = useState({ nodeA: 0, nodeB: 0, redis: 0 });
    const [syncLogs, setSyncLogs] = useState([]);

    // Multi DC States
    const [multiDcModel, setMultiDcModel] = useState('centralized'); // centralized vs local-async
    const [multiDcActivePacket, setMultiDcActivePacket] = useState(null);
    const [multiDcLatency, setMultiDcLatency] = useState(0);

    // Monitoring States
    const [monitoringLoad, setMonitoringLoad] = useState(30); // 0 - 100
    const [monitoringLogs, setMonitoringLogs] = useState([]);

    // Hard vs Soft States
    const [hardSoftStrategy, setHardSoftStrategy] = useState('hard'); // hard vs soft
    const [hardSoftLogs, setHardSoftLogs] = useState([]);
    const [softQueue, setSoftQueue] = useState([]);

    // OSI Layer States
    const [activeOsiLayer, setActiveOsiLayer] = useState(7);

    // Client Practices States
    const [backoffBase, setBackoffBase] = useState(100); // ms
    const [backoffMaxAttempts, setBackoffMaxAttempts] = useState(4);
    const [backoffRunning, setBackoffRunning] = useState(false);
    const [backoffLogs, setBackoffLogs] = useState([]);

    // Synced parent prop trigger
    useEffect(() => {
        setTab(mode);
    }, [mode]);

    // Keep bouncer CPU in sync
    useEffect(() => {
        if (!bouncerShield && bouncerLogs.some(l => l.type === 'BOT FLOOD')) {
            const timer = setInterval(() => {
                setBouncerCpu(c => Math.min(98, c + Math.floor(Math.random() * 10) + 15));
            }, 300);
            return () => clearInterval(timer);
        } else {
            setBouncerCpu(c => Math.max(8, c - 8));
        }
    }, [bouncerShield, bouncerLogs]);

    // Bouncer Trigger Traffic Handler
    const triggerBouncerTraffic = (type) => {
        const time = Date.now();
        let allowed = true;
        let details = '';

        if (type === 'USER') {
            allowed = true;
            details = 'Normal profile fetch from web browser.';
        } else {
            // Bot Flood
            if (bouncerShield) {
                allowed = false;
                details = 'DDoS attack blocked at API Gateway Layer. CPU unaffected.';
            } else {
                allowed = true;
                details = 'Unchecked bot flood directly hits server CPU! Buffer pool exhausted!';
            }
        }

        setBouncerLogs(prev => [
            { id: time, type, allowed, details, timeStr: new Date(time).toISOString().slice(17, -1) + 's' },
            ...prev.slice(0, 3)
        ]);
    };

    // Requirements spec draft generator
    const generateRequirementsDraft = () => {
        return `rate_limiter_config:
  engine: "redis-cluster"
  latency_overhead: ${reqs.lowLatency ? "< 5ms (In-Memory)" : "N/A (Standard DB Check)"}
  distributed_sync: ${reqs.distributed ? "true (Lua Atomic Lock)" : "false (Single Node)"}
  http_headers:
    enabled: ${reqs.headers ? "true" : "false"}
    spec: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "Retry-After"]
  fault_tolerant:
    fallback_strategy: ${reqs.faultTolerant ? "bypass_allow_log" : "throw_500_gateway_error"}
  capping_policy: ${reqs.hardCap ? "HARD_CAP_DROP" : "SOFT_QUEUE_LEAK"}
  global_replication: ${reqs.globalSync ? "active_active_multi_region" : "eventual_consistency"}`;
    };

    // Middleware packet trigger simulation
    const triggerMiddlewarePacket = (type) => {
        const time = Date.now();
        let status = '200 OK';
        let remaining = 5;

        if (type === 'ALICE') {
            setMwAliceCount(c => c + 1);
            status = '200 OK';
            remaining = Math.max(0, 5 - (mwAliceCount + 1));
        } else {
            setMwBotCount(c => c + 1);
            status = '429 TOO MANY REQUESTS';
            remaining = 0;
        }

        setMwHistory(prev => [
            {
                id: time,
                sender: type,
                status,
                route: type === 'ALICE' 
                    ? 'Alice ➔ API Gateway ➔ Redis [Check Counter] ➔ App Server (Allowed)'
                    : `Botnet ➔ API Gateway ➔ Redis [Limit reached: 5/5] ➔ 429 Reject!`,
                remaining
            },
            ...prev.slice(0, 3)
        ]);
    };

    // Rules parser simulator
    const applyRulesText = () => {
        try {
            const parsed = JSON.parse(rulesInput);
            if (parsed.rate_limit_rules) {
                setRulesLog(`✓ Rules updated successfully. Redis cluster memory slot updated! Endpoint limit established.`);
            } else {
                setRulesLog(`⚠️ Warning: JSON parsed but "rate_limit_rules" block was not found.`);
            }
        } catch(e) {
            setRulesLog(`❌ Compilation Syntax Error: Invalid JSON structure! Please check braces and quotes.`);
        }
    };

    const callRulesEndpoint = () => {
        const time = Date.now();
        let currentLimit = 5;
        try {
            const parsed = JSON.parse(rulesInput);
            currentLimit = parsed.rate_limit_rules?.login_endpoint?.limit || 5;
        } catch(e) {}

        setRulesCount(c => {
            const nextCount = c + 1;
            const allowed = nextCount <= currentLimit;
            setRulesLog(prev => 
                `[${new Date(time).toISOString().slice(17, -1)}s] Call /login API ➔ ` +
                (allowed ? `✓ ALLOWED (${nextCount}/${currentLimit})` : `❌ RATE LIMITED (429 Too Many Requests - Limit ${currentLimit} breached)`) +
                `\n` + prev.slice(0, 300)
            );
            return nextCount;
        });
    };

    // Headers Action handler
    const triggerHeaderRequest = (spike) => {
        const time = Date.now();
        setHeaderSpike(spike);

        if (spike) {
            setHeaderLimitRemaining(0);
            setHeaderHistory(prev => [
                {
                    id: time,
                    status: '429 Too Many Requests',
                    headers: {
                        'X-RateLimit-Limit': '10',
                        'X-RateLimit-Remaining': '0',
                        'Retry-After': '30'
                    }
                },
                ...prev.slice(0, 2)
            ]);
        } else {
            setHeaderLimitRemaining(r => {
                const nextRemaining = Math.max(0, r - 1);
                setHeaderHistory(prev => [
                    {
                        id: time,
                        status: '200 OK',
                        headers: {
                            'X-RateLimit-Limit': '10',
                            'X-RateLimit-Remaining': String(nextRemaining),
                            'Retry-After': 'N/A'
                        }
                    },
                    ...prev.slice(0, 2)
                ]);
                return nextRemaining;
            });
        }
    };

    // Concurrency simulator
    const triggerConcurrencyTest = () => {
        const time = Date.now();
        if (concurrencyMode === 'naive') {
            setConcurrencyLogs([
                { id: time + 1, event: '➔ Thread A: READS Redis counter. Value is 4.' },
                { id: time + 2, event: '➔ Thread B: READS Redis counter. Value is 4.' },
                { id: time + 3, event: '⚙️ Thread A: Checks 4 < 5. Allowed!' },
                { id: time + 4, event: '⚙️ Thread B: Checks 4 < 5. Allowed! (Race condition collision)' },
                { id: time + 5, event: '💾 Thread A: WRITES counter + 1 = 5 to Redis.' },
                { id: time + 6, event: '💾 Thread B: WRITES counter + 1 = 5 to Redis.' },
                { id: time + 7, event: '⚠️ BREACH: Two requests allowed simultaneously, but Redis counter is 5. LIMIT EXCEEDED!' }
            ]);
            setConcurrencyCounter(5);
        } else {
            // Lua Atomic
            setConcurrencyLogs([
                { id: time + 1, event: '➔ Thread A & B dispatch Lua script to Redis engine.' },
                { id: time + 2, event: '🔒 Redis Single-Thread Lock engaged.' },
                { id: time + 3, event: '✓ Thread A Lua: Reads 4, increments to 5, returns ALLOWED.' },
                { id: time + 4, event: '❌ Thread B Lua: Reads 5, limit is 5, returns BLOCKED (429).' },
                { id: time + 5, event: '🔓 Redis Single-Thread Lock disengaged.' },
                { id: time + 6, event: '✓ Clean enforcement: 1 request allowed, 1 request dropped.' }
            ]);
            setConcurrencyCounter(5);
        }
    };

    // Distributed Sync Simulation
    const triggerSyncRequest = (server) => {
        const time = Date.now();
        if (syncModel === 'local') {
            setSyncCounters(prev => {
                const nextVal = prev[server] + 1;
                const allowed = nextVal <= 3;
                setSyncLogs(l => [
                    {
                        id: time,
                        event: `[Server ${server.slice(-1).toUpperCase()}] Received request. Local Counter = ${nextVal}/3. Status: ${allowed ? '✓ ALLOW (200)' : '❌ DENY (429)'}`
                    },
                    ...l.slice(0, 3)
                ]);
                return { ...prev, [server]: nextVal };
            });
        } else {
            // Centralized Redis
            setSyncCounters(prev => {
                const nextRedis = prev.redis + 1;
                const allowed = nextRedis <= 3;
                setSyncLogs(l => [
                    {
                        id: time,
                        event: `[Server ${server.slice(-1).toUpperCase()} ➔ REDIS Central] Query check. Redis counter = ${nextRedis}/3. Status: ${allowed ? '✓ ALLOW (200)' : '❌ DENY (429)'}`
                    },
                    ...l.slice(0, 3)
                ]);
                return { ...prev, redis: nextRedis };
            });
        }
    };

    // Multi-DC Simulator
    const triggerMultiDcPacket = (origin) => {
        setMultiDcActivePacket(origin);
        if (multiDcModel === 'centralized') {
            setMultiDcLatency(120);
            setMultiDcLatency(l => {
                return 120;
            });
        } else {
            setMultiDcLatency(5);
        }
        setTimeout(() => {
            setMultiDcActivePacket(null);
        }, 1200);
    };

    // Monitoring simulated loop
    useEffect(() => {
        const timer = setInterval(() => {
            const time = Date.now();
            const spikeChance = Math.random() * 100 < monitoringLoad;
            if (spikeChance) {
                setMonitoringLogs(prev => [
                    {
                        id: time,
                        type: Math.random() > 0.4 ? 'ALLOW' : 'DENIED_429',
                        path: ['/api/v1/auth', '/api/v1/search', '/api/v1/checkout'][Math.floor(Math.random() * 3)],
                        ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`
                    },
                    ...prev.slice(0, 3)
                ]);
            }
        }, 800);
        return () => clearInterval(timer);
    }, [monitoringLoad]);

    // Hard vs Soft Simulation
    const triggerHardSoftBurst = () => {
        const time = Date.now();
        setHardSoftLogs([]);
        setSoftQueue([]);

        if (hardSoftStrategy === 'hard') {
            // Drop immediately
            const logsArray = Array.from({ length: 8 }).map((_, idx) => {
                const allowed = idx < 3;
                return {
                    id: time + idx,
                    req: `Request #${idx + 1}`,
                    status: allowed ? '✓ 200 OK (Processed)' : '❌ 429 Too Many Requests (DROPPED INSTANTLY)'
                };
            });
            setHardSoftLogs(logsArray);
        } else {
            // Soft limits - queue
            const logsArray = Array.from({ length: 8 }).map((_, idx) => {
                const allowed = idx < 3;
                return {
                    id: time + idx,
                    req: `Request #${idx + 1}`,
                    status: allowed ? '✓ 200 OK (Processed)' : '⏳ 200 OK (DELAYED / BUFFERED IN MESSAGE QUEUE)'
                };
            });
            setHardSoftLogs(logsArray);
            
            // Populate soft queue to drain slowly
            setSoftQueue(Array.from({ length: 5 }).map((_, i) => `Request #${i + 4}`));
        }
    };

    // Drain soft queue gradually
    useEffect(() => {
        if (softQueue.length > 0) {
            const timer = setTimeout(() => {
                setSoftQueue(q => q.slice(1));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [softQueue]);

    // Client Practices - Exponential backoff execution loop
    const runClientBackoff = async () => {
        if (backoffRunning) return;
        setBackoffRunning(true);
        setBackoffLogs([]);

        let currentDelay = backoffBase;
        
        for (let attempt = 1; attempt <= backoffMaxAttempts; attempt++) {
            const time = Date.now();
            const isLast = attempt === backoffMaxAttempts;
            const jitter = Math.floor(Math.random() * 50) + 10;
            const finalWait = currentDelay + jitter;

            setBackoffLogs(prev => [
                ...prev,
                {
                    id: time,
                    attempt,
                    math: `Delay = ${backoffBase}ms × 2^${attempt - 1} + ${jitter}ms (jitter) = ${finalWait}ms`,
                    status: isLast ? '✓ Attempt SUCCESS (200 OK)' : '❌ Attempt FAILED (429 Rate Limited)'
                }
            ]);

            if (isLast) break;

            // Wait
            await new Promise(resolve => setTimeout(resolve, finalWait));
            currentDelay *= 2;
        }

        setBackoffRunning(false);
    };


    return (
        <div style={containerStyle} id="rate-limiter-architecture-lab">
            <div style={titleStyle}>📁 Chapter 4 System Architecture Laboratory</div>

            {/* Menu Tabs Grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, background: 'var(--bg-elevated)', borderRadius: 16, padding: 6, marginBottom: 20 }}>
                {[
                    { id: 'bouncer', label: '🛡️ Protection' },
                    { id: 'placement', label: '📍 Placement' },
                    { id: 'requirements', label: '📋 Reqs' },
                    { id: 'middleware', label: '⚙️ Gateway Flow' },
                    { id: 'rules', label: '📝 Rules Config' },
                    { id: 'headers', label: '✉️ HTTP Headers' },
                    { id: 'concurrency', label: '⚡ Concurrency' },
                    { id: 'sync', label: '🔄 Node Sync' },
                    { id: 'multi-dc', label: '🌍 Multi-DC' },
                    { id: 'monitoring', label: '📊 Dashboard' },
                    { id: 'hard-vs-soft', label: '⚖️ Hard vs Soft' },
                    { id: 'osi-layers', label: '🥞 OSI Layer' },
                    { id: 'client-practices', label: '🚀 Client Backoff' }
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                        flex: '1 1 110px', padding: '8px 10px', fontSize: 10, fontWeight: 800, border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                        background: tab === t.id ? 'var(--bg-surface)' : 'transparent',
                        color: tab === t.id ? '#00d4aa' : 'var(--text-muted)',
                        border: tab === t.id ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent'
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Sub-modes rendering */}

            {/* 1. BOUNCER PROTECTION PANEL */}
            {tab === 'bouncer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: 16, transition: 'all 0.3s' }}>
                            <div style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', marginBottom: 6 }}>🔒 DDoS BOTNET ATTACK</div>
                            <p style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.4, margin: 0 }}>
                                Unauthorized script bots hammering endpoints at 5,000 reqs/sec trying to exhaust system thread pools.
                            </p>
                        </div>
                        <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: 16, padding: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 900, color: '#eab308', marginBottom: 6 }}>💸 ROGUE THIRD-PARTY API CALLS</div>
                            <p style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.4, margin: 0 }}>
                                High-frequency pay-per-use external APIs (like SMS or bank gateways) running wild and raising bills.
                            </p>
                        </div>
                        <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 16, padding: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 900, color: '#3b82f6', marginBottom: 6 }}>📣 NOISY NEIGHBOR ISOLATION</div>
                            <p style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.4, margin: 0 }}>
                                A single massive client hogging cluster capacity and starving other small application tenants.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {/* Interactive panel */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase' }}>🛡️ Rate Limiter Shield State</span>
                                <button onClick={() => setBouncerShield(!bouncerShield)} style={{
                                    ...btnStyle,
                                    background: bouncerShield ? 'rgba(0,212,170,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: bouncerShield ? '#00d4aa' : '#ef4444',
                                    borderColor: bouncerShield ? 'rgba(0,212,170,0.3)' : 'rgba(239,68,68,0.3)',
                                    fontSize: 10
                                }}>
                                    {bouncerShield ? '✓ SHIELD ACTIVE' : '❌ BYPASSED / INACTIVE'}
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => triggerBouncerTraffic('USER')} style={{ ...btnStyle, flex: 1, padding: 10, background: 'rgba(0,212,170,0.1)', color: '#00d4aa' }}>
                                    ⚡ Fire Normal Request
                                </button>
                                <button onClick={() => triggerBouncerTraffic('BOT FLOOD')} style={{ ...btnStyle, flex: 1, padding: 10, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                    🚨 Attack with Bot Flood
                                </button>
                            </div>

                            {/* Threat logs */}
                            <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 12, border: '1px solid var(--border)', minHeight: 90 }}>
                                <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 6 }}>SYSTEM TRAFFIC AUDIT:</div>
                                {bouncerLogs.length === 0 ? (
                                    <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', paddingTop: 20 }}>No logs compiled. Fire simulated traffic packets.</div>
                                ) : (
                                    bouncerLogs.map(l => (
                                        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderBottom: '1px solid rgba(255,255,255,0.02)', padding: '4px 0' }}>
                                            <span style={{ color: l.type === 'BOT FLOOD' ? '#ef4444' : '#00d4aa', fontWeight: 800 }}>[{l.type}]</span>
                                            <span style={{ color: l.allowed ? '#00d4aa' : '#ef4444', fontWeight: 700 }}>{l.allowed ? '200 ALLOW' : '429 DENY'}</span>
                                            <span style={{ color: 'var(--text-dim)', fontSize: 9 }}>{l.timeStr}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* CPU Monitor Graph */}
                        <div style={{
                            background: 'var(--bg-elevated)', border: `2px solid ${bouncerCpu > 70 ? '#ef4444' : 'var(--border)'}`,
                            animation: bouncerCpu > 70 ? 'pulse-hotspot 1s infinite' : 'none',
                            borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)' }}>DOWNSTREAM SERVER POOL LOAD</div>
                            <div style={{ fontSize: 44, fontWeight: 900, color: bouncerCpu > 70 ? '#ef4444' : '#00d4aa', fontFamily: 'monospace' }}>
                                {bouncerCpu}%
                            </div>
                            <div style={{ width: '100%', height: 10, background: 'var(--bg-surface)', borderRadius: 5, overflow: 'hidden' }}>
                                <div style={{ width: `${bouncerCpu}%`, height: '100%', background: bouncerCpu > 70 ? '#ef4444' : '#00d4aa', transition: 'width 0.2s' }} />
                            </div>
                            <span style={{ fontSize: 11, color: bouncerCpu > 70 ? '#ef4444' : 'var(--text-dim)', fontWeight: 800, textAlign: 'center' }}>
                                {bouncerCpu > 70 ? '⚠️ ALERT: STARVATION DETECTED!' : '✓ Status: Stable green thread pool'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. PLACEMENT PATH FINDER */}
            {tab === 'placement' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase' }}>🧩 Flowchart Challenge: Choose the best location</div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
                        {[
                            { id: 'client', title: '1. Client-Side (Apps)', desc: 'Inspect & intercept requests inside the React web app or iOS mobile binary.' },
                            { id: 'server', title: '2. Application Server (Code)', desc: 'Handle checks directly in spring-boot Java/Node controllers.' },
                            { id: 'gateway', title: '3. API Gateway Middleware', desc: 'Deploy a reverse proxy node (Nginx, Kong, Cloudflare Edge) in front of cluster.' }
                        ].map(c => (
                            <div key={c.id} onClick={() => setPlacementSelection(c.id)} style={{
                                background: placementSelection === c.id ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                                border: placementSelection === c.id ? '2.5px solid #00d4aa' : '1px solid var(--border)',
                                borderRadius: 16, padding: 16, cursor: 'pointer', transition: 'all 0.2s'
                            }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: placementSelection === c.id ? '#00d4aa' : 'var(--text-light)', marginBottom: 6 }}>{c.title}</div>
                                <p style={{ fontSize: 11, color: 'var(--text-dim)', margin: 0, lineHeight: 1.4 }}>{c.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Explanatory Resolution block */}
                    {placementSelection && (
                        <div style={{
                            background: 'var(--bg-elevated)', borderRadius: 16, padding: 18, border: '1px solid var(--border)',
                            borderLeft: `5px solid ${placementSelection === 'gateway' ? '#00d4aa' : placementSelection === 'server' ? '#ff7a00' : '#ef4444'}`
                        }}>
                            {placementSelection === 'client' && (
                                <div>
                                    <strong style={{ color: '#ef4444', fontSize: 13 }}>❌ High Risk! Client-Side Bypass:</strong>
                                    <p style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.4, margin: '8px 0 0' }}>
                                        Client rate limiting is completely bypassable! Malicious actors can bypass the UI code and call the HTTP API directly via curl. Relying on client checks is a major anti-pattern.
                                    </p>
                                </div>
                            )}
                            {placementSelection === 'server' && (
                                <div>
                                    <strong style={{ color: '#ff7a00', fontSize: 13 }}>⚠️ Suboptimal: Application-Level Overhead:</strong>
                                    <p style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.4, margin: '8px 0 0' }}>
                                        Putting rate limiter code in servers adds CPU bloat. Rogue traffic is parsed, costing server resources before getting dropped. State synchronization across nodes also gets complex.
                                    </p>
                                </div>
                            )}
                            {placementSelection === 'gateway' && (
                                <div>
                                    <strong style={{ color: '#00d4aa', fontSize: 13 }}>✓ Optimal: API Gateway Middleware:</strong>
                                    <p style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.4, margin: '8px 0 0' }}>
                                        Perfect architecture! Drops malicious request payloads early, completely decouples limiting rules from app logic, and coordinates checks inside low-latency database nodes like Redis.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SVGs Placement Topology */}
                    <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--bg-elevated)', padding: 16, borderRadius: 16, border: '1px solid var(--border)' }}>
                        <svg width="400" height="90" viewBox="0 0 400 90">
                            {/* Connection Lines */}
                            <line x1="80" y1="45" x2="160" y2="45" stroke={placementSelection === 'client' ? '#ef4444' : '#00d4aa'} strokeWidth="2.5" strokeDasharray="3 3" />
                            <line x1="240" y1="45" x2="320" y2="45" stroke={placementSelection === 'server' ? '#ff7a00' : '#00d4aa'} strokeWidth="2.5" strokeDasharray="3 3" />

                            {/* Client Box */}
                            <rect x="10" y="20" width="70" height="50" rx="8" fill="rgba(255,255,255,0.02)" stroke={placementSelection === 'client' ? '#ef4444' : 'var(--border)'} strokeWidth="2" />
                            <text x="45" y="48" fill="var(--text-light)" fontSize="10" textAnchor="middle" fontWeight="bold">📱 Client</text>

                            {/* API Gateway */}
                            <rect x="160" y="20" width="80" height="50" rx="8" fill="rgba(0,212,170,0.03)" stroke={placementSelection === 'gateway' ? '#00d4aa' : 'var(--border)'} strokeWidth="2" />
                            <text x="200" y="44" fill={placementSelection === 'gateway' ? '#00d4aa' : 'var(--text-light)'} fontSize="10" textAnchor="middle" fontWeight="bold">🛡️ Gateway</text>
                            <text x="200" y="58" fill="var(--text-dim)" fontSize="8" textAnchor="middle">Filter Node</text>

                            {/* Server */}
                            <rect x="320" y="20" width="70" height="50" rx="8" fill="rgba(255,255,255,0.02)" stroke={placementSelection === 'server' ? '#ff7a00' : 'var(--border)'} strokeWidth="2" />
                            <text x="355" y="48" fill="var(--text-light)" fontSize="10" textAnchor="middle" fontWeight="bold">🖥️ Server</text>
                        </svg>
                    </div>
                </div>
            )}

            {/* 3. REQUIREMENTS DRAFT COMPILER */}
            {tab === 'requirements' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase' }}>🔧 Architectural Constraints Checklist</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { key: 'lowLatency', label: '🚀 Ultra-low latency overhead (< 10ms per check)' },
                                { key: 'distributed', label: '🔄 Distributed environment consistency (lock sync)' },
                                { key: 'headers', label: '✉️ Explicit HTTP response headers (IETF draft)' },
                                { key: 'faultTolerant', label: '🛡️ Fault tolerance (graceful failure fallbacks)' },
                                { key: 'hardCap', label: '🚫 Hard limits (Drop 429) vs Soft queuing' },
                                { key: 'globalSync', label: '🌍 Global multi-datacenter active-active sync' }
                            ].map(item => (
                                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-gray)', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={reqs[item.key]} onChange={e => setReqs(prev => ({ ...prev, [item.key]: e.target.checked }))} style={{ accentColor: '#00d4aa' }} />
                                    <span>{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* YAML Compiler */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>⚙️ Generated Gateway Specification (YAML)</div>
                        <pre style={{
                            flex: 1, margin: 0, padding: 14, background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: 14,
                            color: '#a78bfa', fontSize: 11, fontFamily: 'monospace', lineHeight: 1.5, whiteSpace: 'pre-wrap'
                        }}>
                            {generateRequirementsDraft()}
                        </pre>
                    </div>
                </div>
            )}

            {/* 4. GATEWAY MIDDLEWARE PACKET FLOW */}
            {tab === 'middleware' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => triggerMiddlewarePacket('ALICE')} style={{ ...btnStyle, flex: 1, padding: 12, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', borderColor: 'rgba(0,212,170,0.3)' }}>
                            🟢 Send Request (Normal User Alice)
                        </button>
                        <button onClick={() => triggerMiddlewarePacket('BOT')} style={{ ...btnStyle, flex: 1, padding: 12, background: 'rgba(239,68,68,0.15)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                            🔴 Send Attacking Request (Botnet)
                        </button>
                    </div>

                    {/* Animated Flow Track */}
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, padding: 20, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: 11, fontWeight: 800 }}>
                            <div style={{ textAlign: 'center', minWidth: 60 }}>💻 Client</div>
                            <div style={{ color: '#00d4aa' }}>➔</div>
                            <div style={{ border: '2px solid #00d4aa', borderRadius: 8, padding: 8, background: 'rgba(0,212,170,0.05)', textAlign: 'center' }}>
                                ⚙️ API Gateway<br/><span style={{ fontSize: 9, color: 'var(--text-dim)' }}>[Check Local Sync]</span>
                            </div>
                            <div style={{ color: '#3b82f6' }}>➔</div>
                            <div style={{ border: '1px dashed #3b82f6', borderRadius: 8, padding: 8, textAlign: 'center' }}>💾 Redis<br/><span style={{ fontSize: 9, color: '#3b82f6' }}>Store Counter</span></div>
                            <div style={{ color: '#00d4aa' }}>➔</div>
                            <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8, textAlign: 'center', minWidth: 70 }}>🖥️ App Server</div>
                        </div>
                    </div>

                    {/* Output History Logs */}
                    <div style={{ background: 'var(--bg-surface)', padding: 14, borderRadius: 14, border: '1px solid var(--border)', minHeight: 120 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>📨 LIVE PACKET STREAM ROUTE LOGS</div>
                        {mwHistory.length === 0 ? (
                            <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', paddingTop: 30 }}>Send request packets to animate the gateway track.</div>
                        ) : (
                            mwHistory.map(h => (
                                <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: 11 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 800, color: h.sender === 'ALICE' ? '#00d4aa' : '#ef4444' }}>
                                            [{h.sender}]
                                        </span>
                                        <span style={{ fontWeight: 800, color: h.status.includes('200') ? '#00d4aa' : '#ef4444' }}>
                                            {h.status}
                                        </span>
                                    </div>
                                    <div style={{ fontFamily: 'monospace', color: 'var(--text-dim)', fontSize: 10.5 }}>{h.route}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* 5. DYNAMIC RULES COMPILER */}
            {tab === 'rules' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase' }}>📝 Configuration Code IDE (Edit Rule Values!)</div>
                        <textarea value={rulesInput} onChange={e => setRulesInput(e.target.value)} style={{
                            flex: 1, minHeight: 180, background: 'var(--code-bg)', color: 'var(--text-primary)', fontFamily: 'monospace',
                            border: '1px solid var(--border)', borderRadius: 14, padding: 14, outline: 'none', fontSize: 11.5, lineHeight: 1.5
                        }} />
                        <button onClick={applyRulesText} style={{ ...btnStyle, background: 'rgba(167,139,250,0.15)', color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)', padding: 12 }}>
                            🔄 Compile & Apply rules to Redis Gateway
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>🖥️ Compiled Gateway Memory logs</div>
                        
                        <pre style={{
                            flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 14,
                            padding: 14, margin: 0, fontSize: 11, fontFamily: 'monospace', color: '#00d4aa', overflow: 'auto', whiteSpace: 'pre-wrap'
                        }}>
                            {rulesLog}
                        </pre>

                        <button onClick={callRulesEndpoint} style={{ ...btnStyle, padding: 12, background: 'rgba(0,212,170,0.15)', color: '#00d4aa' }}>
                            ⚡ Call Endpoint (/login API)
                        </button>
                    </div>
                </div>
            )}

            {/* 6. HTTP HEADERS VISUALIZER */}
            {tab === 'headers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => triggerHeaderRequest(false)} style={{ ...btnStyle, flex: 1, padding: 12, background: 'rgba(0,212,170,0.15)', color: '#00d4aa' }}>
                            ⚡ Call API (Safe Traffic Rate)
                        </button>
                        <button onClick={() => triggerHeaderRequest(true)} style={{ ...btnStyle, flex: 1, padding: 12, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                            🚨 Call API (Simulate Spike Overflow)
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {/* Status panel */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', justify: 'center', gap: 14 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>📟 Live Client Response Headers</div>
                            
                            {headerHistory.length === 0 ? (
                                <div style={{ fontSize: 11.5, color: 'var(--text-dim)', textAlign: 'center', paddingTop: 40 }}>Trigger an API call above to fetch packets.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: headerSpike ? '#ef4444' : '#00d4aa' }}>
                                        HTTP/1.1 {headerHistory[0].status}
                                    </div>
                                    <div style={{ background: 'var(--code-bg)', padding: 12, borderRadius: 10, fontFamily: 'monospace', fontSize: 11, color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <div>X-RateLimit-Limit: <span style={{ color: '#00d4aa' }}>{headerHistory[0].headers['X-RateLimit-Limit']}</span></div>
                                        <div>X-RateLimit-Remaining: <span style={{ color: '#3b82f6' }}>{headerHistory[0].headers['X-RateLimit-Remaining']}</span></div>
                                        <div>Retry-After: <span style={{ color: '#ff7a00' }}>{headerHistory[0].headers['Retry-After']}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Explained Headers Cheat card */}
                        <div style={{ background: 'rgba(0,212,170,0.03)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 20, padding: 20, fontSize: 12, lineHeight: 1.5 }}>
                            <div style={{ fontSize: 11, fontWeight: 900, color: '#00d4aa', marginBottom: 8, textTransform: 'uppercase' }}>💡 IETF Rate Limiting Headers explained</div>
                            <ul style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--text-gray)' }}>
                                <li><strong>X-RateLimit-Limit</strong>: The maximum number of allowed requests in the active rolling window period.</li>
                                <li><strong>X-RateLimit-Remaining</strong>: The number of remaining request credits left for the current window.</li>
                                <li><strong>Retry-After</strong>: Standard HTTP header telling rate limited clients how many seconds they must wait before sending next packet retry.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* 7. CONCURRENCY COLLISION PANEL */}
            {tab === 'concurrency' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', borderRadius: 12, padding: 4 }}>
                        <button onClick={() => { setConcurrencyMode('naive'); setConcurrencyLogs([]); }} style={{
                            flex: 1, padding: 8, fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer',
                            background: concurrencyMode === 'naive' ? 'rgba(239,68,68,0.12)' : 'transparent',
                            color: concurrencyMode === 'naive' ? '#ef4444' : 'var(--text-muted)'
                        }}>
                            ❌ Naive Read-then-Write (Concurrency Risk)
                        </button>
                        <button onClick={() => { setConcurrencyMode('lua'); setConcurrencyLogs([]); }} style={{
                            flex: 1, padding: 8, fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer',
                            background: concurrencyMode === 'lua' ? 'rgba(0,212,170,0.12)' : 'transparent',
                            color: concurrencyMode === 'lua' ? '#00d4aa' : 'var(--text-muted)'
                        }}>
                            ✓ Atomic Lua Scripts (Safe Enforce)
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>🛡️ Redis Memory Node (Counter State)</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Redis key `/login:counter` =</span>
                                <strong style={{ fontSize: 24, color: concurrencyCounter >= 5 ? '#ef4444' : '#00d4aa', fontFamily: 'monospace' }}>{concurrencyCounter} / 5</strong>
                            </div>
                            <button onClick={triggerConcurrencyTest} style={{ ...btnStyle, padding: 12, background: concurrencyMode === 'naive' ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,170,0.15)', color: concurrencyMode === 'naive' ? '#ef4444' : '#00d4aa' }}>
                                ⚡ Simulate Concurrent Calls
                            </button>
                        </div>

                        {/* Event step logger */}
                        <div style={{ background: 'var(--bg-surface)', padding: 14, borderRadius: 14, border: '1px solid var(--border)', minHeight: 140 }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>🕵️ Distributed Lock Sync Step Auditor</div>
                            {concurrencyLogs.length === 0 ? (
                                <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', paddingTop: 40 }}>Click "Simulate Concurrent Calls" to trigger events.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {concurrencyLogs.map(l => (
                                        <div key={l.id} style={{ fontSize: 10.5, fontFamily: 'monospace', color: l.event.includes('BREACH') ? '#ef4444' : l.event.includes('Lua') ? '#a78bfa' : 'var(--text-light)' }}>
                                            {l.event}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 8. DISTRIBUTED NODES SYNCHRONIZATION */}
            {tab === 'sync' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', borderRadius: 12, padding: 4 }}>
                        <button onClick={() => { setSyncModel('local'); setSyncLogs([]); setSyncCounters({ nodeA: 0, nodeB: 0, redis: 0 }); }} style={{
                            flex: 1, padding: 8, fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer',
                            background: syncModel === 'local' ? 'rgba(239,68,68,0.12)' : 'transparent',
                            color: syncModel === 'local' ? '#ef4444' : 'var(--text-muted)'
                        }}>
                            ❌ In-Memory Local Cache (Out of Sync)
                        </button>
                        <button onClick={() => { setSyncModel('centralized'); setSyncLogs([]); setSyncCounters({ nodeA: 0, nodeB: 0, redis: 0 }); }} style={{
                            flex: 1, padding: 8, fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer',
                            background: syncModel === 'centralized' ? 'rgba(0,212,170,0.12)' : 'transparent',
                            color: syncModel === 'centralized' ? '#00d4aa' : 'var(--text-muted)'
                        }}>
                            ✓ Centralized Redis Cluster (Always Synced)
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {/* Server Cluster Grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>🖥️ Server Cluster Topology</div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Server Node A</div>
                                    <div style={{ fontSize: 20, fontWeight: 800, margin: '6px 0', color: syncModel === 'local' ? '#ff7a00' : '#00d4aa' }}>
                                        {syncModel === 'local' ? `${syncCounters.nodeA} / 3` : 'Proxy'}
                                    </div>
                                    <button onClick={() => triggerSyncRequest('nodeA')} style={{ ...btnStyle, width: '100%', fontSize: 9 }}>Call Node A</button>
                                </div>
                                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Server Node B</div>
                                    <div style={{ fontSize: 20, fontWeight: 800, margin: '6px 0', color: syncModel === 'local' ? '#ff7a00' : '#00d4aa' }}>
                                        {syncModel === 'local' ? `${syncCounters.nodeB} / 3` : 'Proxy'}
                                    </div>
                                    <button onClick={() => triggerSyncRequest('nodeB')} style={{ ...btnStyle, width: '100%', fontSize: 9 }}>Call Node B</button>
                                </div>
                            </div>

                            {syncModel === 'centralized' && (
                                <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                                    <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 800 }}>💾 CENTRALIZED REDIS CORE</div>
                                    <div style={{ fontSize: 22, fontWeight: 950, color: syncCounters.redis >= 3 ? '#ef4444' : '#3b82f6', margin: '4px 0' }}>
                                        {syncCounters.redis} / 3 Requests
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cluster synchronization logs */}
                        <div style={{ background: 'var(--bg-surface)', padding: 14, borderRadius: 14, border: '1px solid var(--border)', minHeight: 140 }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>📡 Real-time Sync Sync Event Tracker</div>
                            {syncLogs.length === 0 ? (
                                <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', paddingTop: 50 }}>Click a node button to trigger network packets.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {syncLogs.map(l => (
                                        <div key={l.id} style={{ fontSize: 10.5, fontFamily: 'monospace', color: 'var(--text-light)', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 4 }}>
                                            {l.event}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 9. MULTI-DC LATENCY ROUTER */}
            {tab === 'multi-dc' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', borderRadius: 12, padding: 4 }}>
                        <button onClick={() => { setMultiDcModel('centralized'); setMultiDcLatency(0); }} style={{
                            flex: 1, padding: 8, fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer',
                            background: multiDcModel === 'centralized' ? 'rgba(239,68,68,0.12)' : 'transparent',
                            color: multiDcModel === 'centralized' ? '#ef4444' : 'var(--text-muted)'
                        }}>
                            ❌ Centralized US-East Sync (+120ms Latency Hop)
                        </button>
                        <button onClick={() => { setMultiDcModel('local-async'); setMultiDcLatency(0); }} style={{
                            flex: 1, padding: 8, fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer',
                            background: multiDcModel === 'local-async' ? 'rgba(0,212,170,0.12)' : 'transparent',
                            color: multiDcModel === 'local-async' ? '#00d4aa' : 'var(--text-muted)'
                        }}>
                            ✓ Edge Checking + Local Async Replication (&lt; 5ms check)
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {/* Latency diagram */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>🌍 Drag/Click request dispatch origin</div>
                            
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => triggerMultiDcPacket('SF')} style={{ ...btnStyle, flex: 1 }}>🇺🇸 San Francisco Node</button>
                                <button onClick={() => triggerMultiDcPacket('FRA')} style={{ ...btnStyle, flex: 1 }}>🇩🇪 Frankfurt Node</button>
                            </div>

                            <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
                                <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>ROUNDTRIP INTERCEPT TIME:</div>
                                <div style={{ fontSize: 26, fontWeight: 900, color: multiDcLatency > 50 ? '#ef4444' : '#00d4aa', fontFamily: 'monospace', margin: '4px 0' }}>
                                    {multiDcLatency} ms
                                </div>
                                <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>
                                    {multiDcLatency > 50 ? '⚠️ High Latency Overhead! Network bottleneck' : '✓ Zero overhead edge verification'}
                                </span>
                            </div>
                        </div>

                        {/* Interactive SVG World Map Grid */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <svg width="280" height="150" viewBox="0 0 280 150">
                                {/* Continents outlines placeholder */}
                                <rect x="10" y="20" width="260" height="110" rx="10" fill="rgba(255,255,255,0.01)" stroke="var(--border)" strokeWidth="1" />
                                
                                {/* Central DB Node US East */}
                                <circle cx="100" cy="70" r="10" fill="#3b82f6" stroke="#fff" strokeWidth="1.5">
                                    <title>US-East Central Redis Core</title>
                                </circle>
                                <text x="100" y="94" fill="#3b82f6" fontSize="8" textAnchor="middle" fontWeight="bold">US-EAST (DB)</text>

                                {/* SF Node */}
                                <circle cx="40" cy="60" r="7" fill={multiDcActivePacket === 'SF' ? '#00d4aa' : '#a78bfa'} stroke="#fff" strokeWidth="1">
                                    <title>SF Edge Node</title>
                                </circle>
                                <text x="40" y="80" fill="var(--text-dim)" fontSize="7" textAnchor="middle">SF Edge</text>

                                {/* Frankfurt Node */}
                                <circle cx="210" cy="50" r="7" fill={multiDcActivePacket === 'FRA' ? '#00d4aa' : '#a78bfa'} stroke="#fff" strokeWidth="1">
                                    <title>Frankfurt Edge Node</title>
                                </circle>
                                <text x="210" y="70" fill="var(--text-dim)" fontSize="7" textAnchor="middle">Frankfurt Edge</text>

                                {/* Connecting pathways */}
                                {multiDcActivePacket === 'SF' && multiDcModel === 'centralized' && (
                                    <line x1="40" y1="60" x2="100" y2="70" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                                )}
                                {multiDcActivePacket === 'FRA' && multiDcModel === 'centralized' && (
                                    <line x1="210" y1="50" x2="100" y2="70" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                                )}
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* 10. SYSTEM TUNING DASHBOARD */}
            {tab === 'monitoring' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 18, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 800 }}>⚙️ SIMULATED TRAFFIC PRESSURE KNOB:</span>
                        <input type="range" min="10" max="100" value={monitoringLoad} onChange={e => setMonitoringLoad(Number(e.target.value))} style={{ flex: 1, maxWidth: 220, accentColor: '#00d4aa' }} />
                        <strong style={{ fontSize: 14, color: '#00d4aa', fontFamily: 'monospace', minWidth: 60 }}>{monitoringLoad * 50} r/s</strong>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                        {/* Metric 1 */}
                        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>CPU SYSTEM OVERHEAD</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: monitoringLoad > 70 ? '#ef4444' : '#00d4aa', margin: '6px 0' }}>
                                {Math.floor(monitoringLoad * 0.8) + 8}%
                            </div>
                            <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${Math.floor(monitoringLoad * 0.8) + 8}%`, height: '100%', background: monitoringLoad > 70 ? '#ef4444' : '#00d4aa' }} />
                            </div>
                        </div>

                        {/* Metric 2 */}
                        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>REDIS KEY STORAGE MEMORY</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: '#3b82f6', margin: '6px 0' }}>
                                {Math.floor(monitoringLoad * 12.3)} Keys
                            </div>
                            <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>Memory Pool: 142 KB</span>
                        </div>

                        {/* Metric 3 */}
                        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>HTTP 429 SHIELD DENIED %</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: '#ff7a00', margin: '6px 0' }}>
                                {monitoringLoad > 50 ? `${Math.floor((monitoringLoad - 50) * 1.2)}%` : '0%'}
                            </div>
                            <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>Healthy drop filtering</span>
                        </div>
                    </div>

                    {/* Live Logging Monitor */}
                    <div style={{ background: 'var(--code-bg)', padding: 12, borderRadius: 12, border: '1px solid var(--border)', minHeight: 90 }}>
                        <div style={{ fontSize: 9, fontWeight: 900, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>📟 Real-time Monitoring Graph Log Stream:</div>
                        {monitoringLogs.map(l => (
                            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontFamily: 'monospace', color: l.type === 'ALLOW' ? '#00d4aa' : '#ef4444', borderBottom: '1px solid rgba(255,255,255,0.02)', padding: '2px 0' }}>
                                <span>[{l.type}] Client IP: {l.ip}</span>
                                <span>Target endpoint: {l.path}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 11. HARD VS SOFT RATE LIMITING */}
            {tab === 'hard-vs-soft' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', borderRadius: 12, padding: 4 }}>
                        <button onClick={() => { setHardSoftStrategy('hard'); setHardSoftLogs([]); }} style={{
                            flex: 1, padding: 8, fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer',
                            background: hardSoftStrategy === 'hard' ? 'rgba(239,68,68,0.12)' : 'transparent',
                            color: hardSoftStrategy === 'hard' ? '#ef4444' : 'var(--text-muted)'
                        }}>
                            🚫 Hard Rate Limiting (Reject instantly with 429)
                        </button>
                        <button onClick={() => { setHardSoftStrategy('soft'); setHardSoftLogs([]); }} style={{
                            flex: 1, padding: 8, fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer',
                            background: hardSoftStrategy === 'soft' ? 'rgba(0,212,170,0.12)' : 'transparent',
                            color: hardSoftStrategy === 'soft' ? '#00d4aa' : 'var(--text-muted)'
                        }}>
                            ⏳ Soft Rate Limiting (Queue and drip bursty traffic)
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {/* Control Sandbox */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>🛡️ Strategy Sandbox controller</div>
                            <button onClick={triggerHardSoftBurst} style={{ ...btnStyle, padding: 12, background: 'rgba(0,212,170,0.15)', color: '#00d4aa' }}>
                                ⚡ Send Sudden Burst (8 Simultaneous Requests)
                            </button>

                            {hardSoftStrategy === 'soft' && (
                                <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12, padding: 12 }}>
                                    <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 800, marginBottom: 4 }}>📨 Message Queue Buffer:</div>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        {softQueue.length === 0 ? (
                                            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Queue drained. Steady state.</span>
                                        ) : (
                                            softQueue.map((q, idx) => (
                                                <span key={idx} style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontFamily: 'monospace' }}>
                                                    {q}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Audit Logs */}
                        <div style={{ background: 'var(--bg-surface)', padding: 14, borderRadius: 14, border: '1px solid var(--border)', minHeight: 140 }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>📋 Burst Traffic Audit logs</div>
                            {hardSoftLogs.length === 0 ? (
                                <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', paddingTop: 50 }}>Trigger the sudden burst simulation.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {hardSoftLogs.map(l => (
                                        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, borderBottom: '1px solid rgba(255,255,255,0.02)', padding: '2px 0' }}>
                                            <span style={{ fontWeight: 800 }}>{l.req}</span>
                                            <span style={{ color: l.status.includes('✓') ? '#00d4aa' : l.status.includes('⏳') ? '#3b82f6' : '#ef4444', fontWeight: 800 }}>{l.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 12. OSI STACK LAYER DIAGRAM */}
            {tab === 'osi-layers' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase' }}>🥞 Select OSI Layer Stack Filter</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { layer: 7, label: 'Layer 7 (Application)', sub: 'HTTP / API Gateway (Headers, tokens, cookies, routes)' },
                                { layer: 4, label: 'Layer 4 (Transport)', sub: 'TCP Connection capping (SYN flood protection)' },
                                { layer: 3, label: 'Layer 3 (Network)', sub: 'IP Layer filtering (iptables blacklists, geo-blocking)' }
                            ].map(item => (
                                <div key={item.layer} onClick={() => setActiveOsiLayer(item.layer)} style={{
                                    background: activeOsiLayer === item.layer ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                                    border: activeOsiLayer === item.layer ? '2.5px solid #00d4aa' : '1px solid var(--border)',
                                    borderRadius: 14, padding: 14, cursor: 'pointer', transition: 'all 0.15s'
                                }}>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: activeOsiLayer === item.layer ? '#00d4aa' : 'var(--text-light)', marginBottom: 4 }}>{item.label}</div>
                                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{item.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Explanatory description card */}
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 900, color: '#a78bfa', textTransform: 'uppercase' }}>💡 Layer {activeOsiLayer} Implementation detail</div>
                        
                        {activeOsiLayer === 7 && (
                            <p style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.5, margin: 0 }}>
                                Application level limits allow rich contexts! We filter requests based on HTTP Headers, active API keys, JSON payloads, or dynamic authorization cookies. This is extremely granular and flexible, usually implemented inside <strong>Nginx</strong>, <strong>Kong</strong>, or custom web middleware.
                            </p>
                        )}
                        {activeOsiLayer === 4 && (
                            <p style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.5, margin: 0 }}>
                                Transport level caps are based on raw TCP connections. Excellent for blocking DOS handshaking loops. Leverages kernel tweaks, TCP backlogs, or standard proxy configurations to drop connections before the payload is loaded.
                            </p>
                        )}
                        {activeOsiLayer === 3 && (
                            <p style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.5, margin: 0 }}>
                                IP level rate limiting drops raw packets at the routing level. Extremely fast and memory efficient. Useful for blocking botnet blacklists, using standard Linux firewall tools like <strong>iptables</strong> or edge scrubbers (AWS WAF / Cloudflare Magic Transit).
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* 13. CLIENT-SIDE RETRIES & RETRY BACKOFF */}
            {tab === 'client-practices' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase' }}>⚙️ Client-Side Backoff Parameters</div>
                        
                        <label style={{ fontSize: 11.5, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Base Retry Delay: <strong>{backoffBase}ms</strong></span>
                            <input type="range" min="50" max="250" step="50" value={backoffBase} onChange={e => setBackoffBase(Number(e.target.value))} style={{ width: 120, accentColor: '#00d4aa' }} />
                        </label>
                        <label style={{ fontSize: 11.5, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Maximum Retry Attempts: <strong>{backoffMaxAttempts}</strong></span>
                            <input type="range" min="2" max="5" value={backoffMaxAttempts} onChange={e => setBackoffMaxAttempts(Number(e.target.value))} style={{ width: 120, accentColor: '#00d4aa' }} />
                        </label>

                        <button onClick={runClientBackoff} disabled={backoffRunning} style={{
                            ...btnStyle, padding: 12, background: backoffRunning ? 'var(--bg-surface)' : 'rgba(0,212,170,0.15)',
                            color: backoffRunning ? 'var(--text-dim)' : '#00d4aa', cursor: backoffRunning ? 'not-allowed' : 'pointer'
                        }}>
                            {backoffRunning ? '⏳ Backoff retrying loops executing...' : '🚀 Run Retries with Jitter'}
                        </button>
                    </div>

                    {/* Backoff execution logger */}
                    <div style={{ background: 'var(--bg-surface)', padding: 14, borderRadius: 14, border: '1px solid var(--border)', minHeight: 140 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>📋 Client Console Output</div>
                        {backoffLogs.length === 0 ? (
                            <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', paddingTop: 50 }}>Click "Run Retries with Jitter" to execute loops.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {backoffLogs.map((l, idx) => (
                                    <div key={l.id} style={{ fontSize: 10.5, fontFamily: 'monospace', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 4 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: 800, color: l.status.includes('SUCCESS') ? '#00d4aa' : '#ef4444' }}>
                                                Attempt #{l.attempt}
                                            </span>
                                            <span style={{ color: l.status.includes('SUCCESS') ? '#00d4aa' : '#ef4444' }}>{l.status}</span>
                                        </div>
                                        <div style={{ color: 'var(--text-dim)', fontSize: 9.5 }}>{l.math}</div>
                                    </div>
                                ))}
                            </div>
                        )}
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
    // 1. Core Component States
    const [vnodes, setVnodes] = useState(
        mode === 'vnodes' ? 30 : mode === 'sandbox' ? 12 : 1
    );
    const [activeServers, setActiveServers] = useState(['s0', 's1', 's2', 's3']);
    const [addedS3, setAddedS3] = useState(false);
    const [removedS1, setRemovedS1] = useState(false);
    const [hoveredKey, setHoveredKey] = useState(null);

    // Bending Animation state
    const [t, setT] = useState(mode === 'bend' ? 0 : 1);
    const [isBent, setIsBent] = useState(mode !== 'bend');
    const [isBendingAnimating, setIsBendingAnimating] = useState(false);

    // Clockwise Search Sweep state
    const [activeKeyId, setActiveKeyId] = useState(null);
    const [sweepAngle, setSweepAngle] = useState(null);
    const [isSweeping, setIsSweeping] = useState(false);
    const [lookupResult, setLookupResult] = useState(null);

    // Sandbox and Custom Keys
    const [sandboxKeys, setSandboxKeys] = useState([
        { id: 'k0', label: 'key0', angle: 30, color: '#c084fc' },
        { id: 'k1', label: 'key1', angle: 100, color: '#c084fc' },
        { id: 'k2', label: 'key2', angle: 190, color: '#c084fc' },
        { id: 'k3', label: 'key3', angle: 290, color: '#c084fc' }
    ]);

    const [logs, setLogs] = useState([
        "System: Consistent Hashing Ring initialized.",
        "System: Click on the ring to map custom client keys!"
    ]);

    const svgRef = useRef(null);

    // Set initial servers according to modes
    useEffect(() => {
        if (mode === 'add') {
            setActiveServers(['s0', 's1', 's2']);
            setAddedS3(false);
        } else if (mode === 'remove') {
            setActiveServers(['s0', 's1', 's2', 's3']);
            setRemovedS1(false);
        } else if (mode === 'hotspots') {
            setActiveServers(['s0', 's1', 's2', 's3']);
        } else {
            setActiveServers(['s0', 's1', 's2', 's3']);
        }
    }, [mode]);

    // Cleanup sweep interval on unmount
    useEffect(() => {
        return () => {
            setIsSweeping(false);
        };
    }, []);

    // 2. Base Servers Definition
    const serversList = [
        { id: 's0', label: 'Server 0', angle: 45, color: '#3b82f6', hash: '0x20000000' },
        { id: 's1', label: 'Server 1', angle: 135, color: '#ef4444', hash: '0x60000000' },
        { id: 's2', label: 'Server 2', angle: 225, color: '#10b981', hash: '0xA0000000' },
        { id: 's3', label: 'Server 3', angle: 315, color: '#f59e0b', hash: '0xE0000000' }
    ];

    // Additional sandbox servers
    const extraServers = [
        { id: 's4', label: 'Server 4', angle: 90, color: '#8b5cf6', hash: '0x40000000' },
        { id: 's5', label: 'Server 5', angle: 270, color: '#ec4899', hash: '0xC0000000' }
    ];

    const allServers = [...serversList, ...extraServers];

    // Helper: deterministic hash mapping to angle
    const hashStringToAngle = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % 360;
    };

    // Helper: retrieve nearest clockwise node
    const getMapping = (keyAngle, overrideActive = activeServers) => {
        let nodesList = [];
        allServers.forEach(s => {
            if (!overrideActive.includes(s.id)) return;
            if (vnodes === 1) {
                nodesList.push({ id: s.id, angle: s.angle, color: s.color, label: s.label });
            } else {
                for (let i = 0; i < vnodes; i++) {
                    const angleOffset = hashStringToAngle(`${s.id}-vn-${i}`);
                    nodesList.push({ id: s.id, angle: angleOffset, color: s.color, label: `${s.label}#${i}` });
                }
            }
        });

        if (nodesList.length === 0) return null;
        nodesList.sort((a, b) => a.angle - b.angle);

        // Find clockwise
        const match = nodesList.find(n => n.angle >= keyAngle);
        return match || nodesList[0];
    };

    // Calculate standard deviation of server partition allocations
    const getStdDev = () => {
        let nodesList = [];
        allServers.forEach(s => {
            if (!activeServers.includes(s.id)) return;
            for (let i = 0; i < vnodes; i++) {
                const angle = hashStringToAngle(`${s.id}-vn-${i}`);
                nodesList.push({ parentId: s.id, angle });
            }
        });

        if (nodesList.length === 0) return '0.0';
        nodesList.sort((a, b) => a.angle - b.angle);

        let loads = {};
        activeServers.forEach(sid => { loads[sid] = 0; });

        for (let i = 0; i < nodesList.length; i++) {
            const current = nodesList[i];
            const prev = nodesList[i === 0 ? nodesList.length - 1 : i - 1];
            const size = (current.angle - prev.angle + 360) % 360;
            if (loads[current.parentId] !== undefined) {
                loads[current.parentId] += size;
            }
        }

        const activeCount = activeServers.length;
        if (activeCount === 0) return '0.0';

        const percentages = activeServers.map(sid => (loads[sid] / 360) * 100);
        const mean = 100 / activeCount;
        const variance = percentages.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / activeCount;
        return Math.sqrt(variance).toFixed(1);
    };

    // Get partition allocation percent for a single physical server
    const getLoadPercentage = (sid) => {
        let nodesList = [];
        allServers.forEach(s => {
            if (!activeServers.includes(s.id)) return;
            for (let i = 0; i < vnodes; i++) {
                const angle = hashStringToAngle(`${s.id}-vn-${i}`);
                nodesList.push({ parentId: s.id, angle });
            }
        });

        if (nodesList.length === 0) return 0;
        nodesList.sort((a, b) => a.angle - b.angle);

        let totalSize = 0;
        let serverSize = 0;
        for (let i = 0; i < nodesList.length; i++) {
            const current = nodesList[i];
            const prev = nodesList[i === 0 ? nodesList.length - 1 : i - 1];
            const size = (current.angle - prev.angle + 360) % 360;
            if (current.parentId === sid) {
                serverSize += size;
            }
            totalSize += size;
        }
        return totalSize > 0 ? Math.round((serverSize / totalSize) * 100) : 0;
    };

    // Coordinate helpers
    const getCoord = (angle, radius = 90) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        return {
            x: 140 + radius * Math.cos(rad),
            y: 140 + radius * Math.sin(rad)
        };
    };

    // Interpolation coordinate helper for linear bending
    const getInterpolatedCoord = (angle, radius = 90) => {
        const xLine = 20 + (angle / 360) * 240;
        const yLine = 140;

        const rad = ((angle - 90) * Math.PI) / 180;
        const xCircle = 140 + radius * Math.cos(rad);
        const yCircle = 140 + radius * Math.sin(rad);

        return {
            x: (1 - t) * xLine + t * xCircle,
            y: (1 - t) * yLine + t * yCircle
        };
    };

    // Trigger line bending animation
    const triggerBending = () => {
        if (isBendingAnimating) return;
        setIsBendingAnimating(true);
        const target = isBent ? 0 : 1;
        let curT = t;
        const step = target === 1 ? 0.05 : -0.05;

        const interval = setInterval(() => {
            curT += step;
            if ((step > 0 && curT >= 1) || (step < 0 && curT <= 0)) {
                setT(target);
                setIsBent(target === 1);
                setIsBendingAnimating(false);
                clearInterval(interval);
            } else {
                setT(curT);
            }
        }, 20);
    };

    // Start glowing clockwise search sweep animation
    const startClockwiseSweep = (keyId, keyAngle) => {
        if (isSweeping) return;
        setActiveKeyId(keyId);
        setSweepAngle(keyAngle);
        setIsSweeping(true);
        setLookupResult(null);

        const targetNode = getMapping(keyAngle);
        if (!targetNode) {
            setIsSweeping(false);
            return;
        }

        let currentSweep = keyAngle;
        const interval = setInterval(() => {
            currentSweep = (currentSweep + 3) % 360;
            setSweepAngle(currentSweep);

            const targetAngle = targetNode.angle;
            let reached = false;
            // Sweep checks
            if (keyAngle <= targetAngle) {
                reached = currentSweep >= targetAngle || currentSweep < keyAngle;
            } else {
                reached = currentSweep >= targetAngle && currentSweep < keyAngle;
            }

            if (reached) {
                setSweepAngle(targetAngle);
                setLookupResult(targetNode);
                setIsSweeping(false);
                clearInterval(interval);
            }
        }, 12);
    };

    // Click SVG ring to create custom user key
    const handleRingClick = (e) => {
        if (mode !== 'sandbox' && mode !== 'arrows') return;
        if (!svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const x = e.clientX - rect.left - cx;
        const y = e.clientY - rect.top - cy;

        let clickedAngle = Math.round((Math.atan2(y, x) * 180) / Math.PI + 90);
        if (clickedAngle < 0) clickedAngle += 360;

        if (mode === 'arrows') {
            const tempKeyId = `temp_${Date.now()}`;
            const tempKey = { id: tempKeyId, label: 'temp_key', angle: clickedAngle, color: '#f472b6' };
            setSandboxKeys([tempKey]);
            startClockwiseSweep(tempKeyId, clickedAngle);
        } else {
            // Sandbox mode: add new key
            const keyNum = sandboxKeys.length;
            const newKey = {
                id: `usr_${Date.now()}`,
                label: `key_${keyNum}`,
                angle: clickedAngle,
                color: '#ec4899'
            };
            setSandboxKeys(prev => [...prev, newKey]);
            const target = getMapping(clickedAngle);
            setLogs(prev => [
                `Mapped custom '${newKey.label}' at ${clickedAngle}° clockwise to server node '${target ? target.label : 'None'}'`,
                ...prev.slice(0, 8)
            ]);
            startClockwiseSweep(newKey.id, clickedAngle);
        }
    };

    const drawSweepArc = (start, end) => {
        if (start === null || end === null) return null;
        const r = 90;
        const startRad = ((start - 90) * Math.PI) / 180;
        const endRad = ((end - 90) * Math.PI) / 180;

        const x1 = 140 + r * Math.cos(startRad);
        const y1 = 140 + r * Math.sin(startRad);
        const x2 = 140 + r * Math.cos(endRad);
        const y2 = 140 + r * Math.sin(endRad);

        const diff = (end - start + 360) % 360;
        const largeArcFlag = diff > 180 ? 1 : 0;

        return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    };

    const toggleServerCheckbox = (sid) => {
        if (activeServers.includes(sid)) {
            if (activeServers.length > 1) {
                setActiveServers(prev => prev.filter(s => s !== sid));
                setLogs(prev => [`System: Server ${sid.toUpperCase()} set offline. Redistribution active.`, ...prev.slice(0, 8)]);
            }
        } else {
            setActiveServers(prev => [...prev, sid]);
            setLogs(prev => [`System: Server ${sid.toUpperCase()} added to hashing ring.`, ...prev.slice(0, 8)]);
        }
    };

    // Mode Titles
    const getModeMeta = () => {
        switch (mode) {
            case 'bend': return { title: "Line Bending into Ring Space", desc: "Watch linear hash coordinates smoothly morph into a circular 360-degree hashing ring." };
            case 'ring': return { title: "Static Server Placements", desc: "Hashing servers maps them directly to specific coordinates [0 to 2^32 - 1] represented radially." };
            case 'keys': return { title: "Server and Key Co-habitation", desc: "Both clients/keys and server node resources are hashed into the exact same spatial coordinate circle." };
            case 'arrows': return { title: "Clockwise Server Lookup Rule", desc: "A client request searches clockwise starting from its coordinate until it hits the first active server." };
            case 'add': return { title: "Adding Server (Minimal Redistribution)", desc: "Adding Server 3 only redirects key3's lookup partition. S0, S1, S2 keys remain completely unaffected." };
            case 'remove': return { title: "Removing Server (Minimal Redistribution)", desc: "Crashing Server 1 only forces key1 to re-hash clockwise to Server 2. Other keys remain cached." };
            case 'hotspots': return { title: "Partition Imbalance & Hotspots", desc: "Without uniform spacing, a single server node can end up serving a disproportionate amount of request space." };
            case 'vnodes': return { title: "Virtual Nodes Partition Balancer", desc: "By dividing physical servers into many small virtual node coordinates, hash space distributions achieve perfect equity." };
            case 'sandbox':
            default:
                return { title: "Consistent Hashing Sandbox Lab", desc: "Add/remove servers, scale virtual nodes, and click on the ring to simulate dynamic key distributions!" };
        }
    };

    const meta = getModeMeta();

    return (
        <div style={containerStyle}>
            <VizHeader eyebrow="Consistent Hashing Ring Lab" title={meta.title} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.4 }}>{meta.desc}</p>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
                
                {/* 1. Side-by-Side Comparison for Hotspots Mode */}
                {mode === 'hotspots' ? (
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
                        {/* Clustered Ring A */}
                        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(239,68,68,0.03)', padding: 18, borderRadius: 20, border: '1px solid rgba(239,68,68,0.15)' }}>
                            <div style={{ fontSize: 12, fontWeight: 900, color: '#ef4444', marginBottom: 12, letterSpacing: '0.05em' }}>A. CLUSTERED RING (NO VIRTUAL NODES)</div>
                            <svg width="280" height="280">
                                <circle cx="140" cy="140" r="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                                {/* Clustered servers close to each other */}
                                <circle cx="203" cy="203" r="10" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" /> {/* S0 at 135 */}
                                <circle cx="221" cy="176" r="10" fill="#ef4444" stroke="#fff" strokeWidth="1.5" /> {/* S1 at 115 */}
                                <circle cx="227" cy="140" r="10" fill="#10b981" stroke="#fff" strokeWidth="1.5" /> {/* S2 at 90 */}
                                
                                <text x="203" y="222" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">S0</text>
                                <text x="241" y="180" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">S1</text>
                                <text x="247" y="144" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">S2</text>

                                {/* Scattered keys that all map clockwise to S2 (huge empty partition sweeps clockwise) */}
                                {[
                                    { label: 'k0', angle: 0 },
                                    { label: 'k1', angle: 260 },
                                    { label: 'k2', angle: 290 },
                                    { label: 'k3', angle: 330 }
                                ].map(k => {
                                    const coord = getCoord(k.angle, 90);
                                    // S2 is at 90 degrees. All these keys (0, 260, 290, 330) are larger than 90, so they wrap clockwise to S2 at 90!
                                    const sCoord = getCoord(90, 90);
                                    return (
                                        <g key={k.label}>
                                            <line x1={coord.x} y1={coord.y} x2={sCoord.x} y2={sCoord.y} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                                            <polygon points={`${coord.x},${coord.y-5} ${coord.x+5},${coord.y} ${coord.x},${coord.y+5} ${coord.x-5},${coord.y}`} fill="#a78bfa" stroke="#fff" strokeWidth="0.8" />
                                            <text x={coord.x} y={coord.y - 8} fill="#a78bfa" fontSize="9" textAnchor="middle" fontWeight="bold">{k.label}</text>
                                        </g>
                                    );
                                })}
                                {/* Giant glowing warning arc representing S2's overloaded partition */}
                                <path d={drawSweepArc(91, 90)} fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="6" strokeDasharray="4 2" />
                            </svg>
                            <div style={{ width: '100%', padding: '10px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, marginTop: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#ef4444', fontWeight: 900 }}>
                                    <span>⚠️ SERVER 2 OVERLOAD</span>
                                    <span>85% Load</span>
                                </div>
                                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '85%', background: '#ef4444' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Uniform Ring B */}
                        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(16,185,129,0.03)', padding: 18, borderRadius: 20, border: '1px solid rgba(16,185,129,0.15)' }}>
                            <div style={{ fontSize: 12, fontWeight: 900, color: '#10b981', marginBottom: 12, letterSpacing: '0.05em' }}>B. BALANCED SPACING (UNIFORM)</div>
                            <svg width="280" height="280">
                                <circle cx="140" cy="140" r="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                                {/* Spaced servers */}
                                {serversList.map(s => {
                                    const coord = getCoord(s.angle, 90);
                                    return (
                                        <g key={s.id}>
                                            <circle cx={coord.x} cy={coord.y} r="10" fill={s.color} stroke="#fff" strokeWidth="1.5" />
                                            <text x={coord.x} y={coord.y > 140 ? coord.y + 18 : coord.y - 12} fill={s.color} fontSize="10" fontWeight="bold" textAnchor="middle">{s.label.split(' ')[1]}</text>
                                        </g>
                                    );
                                })}

                                {/* Keys route evenly */}
                                {[
                                    { label: 'k0', angle: 30, tServer: serversList[0] }, // S0 (45)
                                    { label: 'k1', angle: 100, tServer: serversList[1] }, // S1 (135)
                                    { label: 'k2', angle: 190, tServer: serversList[2] }, // S2 (225)
                                    { label: 'k3', angle: 290, tServer: serversList[3] }  // S3 (315)
                                ].map(k => {
                                    const coord = getCoord(k.angle, 90);
                                    const sCoord = getCoord(k.tServer.angle, 90);
                                    return (
                                        <g key={k.label}>
                                            <line x1={coord.x} y1={coord.y} x2={sCoord.x} y2={sCoord.y} stroke={k.tServer.color} strokeWidth="1" strokeDasharray="3 3" />
                                            <polygon points={`${coord.x},${coord.y-5} ${coord.x+5},${coord.y} ${coord.x},${coord.y+5} ${coord.x-5},${coord.y}`} fill="#a78bfa" stroke="#fff" strokeWidth="0.8" />
                                            <text x={coord.x} y={coord.y - 8} fill="#a78bfa" fontSize="9" textAnchor="middle" fontWeight="bold">{k.label}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                            <div style={{ width: '100%', padding: '10px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, marginTop: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#10b981', fontWeight: 900 }}>
                                    <span>✓ UNIFORM TRAFFIC BALANCE</span>
                                    <span>~25% Load Per Node</span>
                                </div>
                                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '25%', background: '#10b981' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    
                    /* 2. Standard Ring / Sandbox Layout */
                    <>
                        <div style={{ position: 'relative', width: 280, height: 280, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                            <svg width="280" height="280" ref={svgRef} onClick={handleRingClick} style={{ cursor: (mode === 'sandbox' || mode === 'arrows') ? 'crosshair' : 'default' }}>
                                
                                {/* A. Ring Space (Line or Circle) */}
                                {mode === 'bend' ? (
                                    // Bending line representation
                                    t < 0.98 ? (
                                        <g>
                                            <line x1="20" y1="140" x2="260" y2="140" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                            {/* Glow path representation */}
                                            <line x1="20" y1="140" x2="260" y2="140" stroke="#00d4aa" strokeWidth="1" opacity={1 - t} />
                                        </g>
                                    ) : (
                                        <circle cx="140" cy="140" r="90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                                    )
                                ) : (
                                    <circle cx="140" cy="140" r="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                                )}

                                {isBent && mode !== 'bend' && (
                                    <text x="140" y="28" fill="var(--text-dim)" fontSize="9" textAnchor="middle" letterSpacing="0.05em">0 / 2^32 - 1</text>
                                )}

                                {/* B. Glowing Active Sweep Arc */}
                                {isSweeping && sweepAngle !== null && activeKeyId && (
                                    <path 
                                        d={drawSweepArc(
                                            sandboxKeys.find(k => k.id === activeKeyId)?.angle || 0, 
                                            sweepAngle
                                        )} 
                                        fill="none" 
                                        stroke="#f472b6" 
                                        strokeWidth="4" 
                                        strokeLinecap="round"
                                        style={{ filter: 'drop-shadow(0 0 4px #ec4899)' }}
                                    />
                                )}

                                {/* C. Render Virtual Nodes */}
                                {mode === 'vnodes' && vnodes > 1 && (
                                    allServers.map(s => {
                                        if (!activeServers.includes(s.id)) return null;
                                        return Array.from({ length: vnodes }).map((_, idx) => {
                                            const angle = hashStringToAngle(`${s.id}-vn-${idx}`);
                                            const coord = getCoord(angle, 90);
                                            return (
                                                <circle 
                                                    key={`${s.id}-${idx}`} 
                                                    cx={coord.x} 
                                                    cy={coord.y} 
                                                    r="3" 
                                                    fill={s.color}
                                                    opacity="0.8"
                                                >
                                                    <title>{s.label} Virtual Node #{idx}</title>
                                                </circle>
                                            );
                                        });
                                    })
                                )}

                                {/* D. Render Physical Servers */}
                                {mode !== 'vnodes' && allServers.map(s => {
                                    const active = activeServers.includes(s.id);
                                    if (mode === 'add' && s.id === 's3' && !addedS3) return null;
                                    if (mode === 'remove' && s.id === 's1' && removedS1) {
                                        // Grayed out dead server
                                        const coord = getCoord(s.angle, 90);
                                        return (
                                            <g key={s.id} opacity="0.25">
                                                <circle cx={coord.x} cy={coord.y} r="10" fill="#475569" stroke="#fff" strokeWidth="1" />
                                                <text x={coord.x} y={coord.y - 14} fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontWeight="bold">S1 (Offline)</text>
                                            </g>
                                        );
                                    }
                                    if (!active && mode !== 'add') return null;

                                    // Coordinate based on bending ratio
                                    const coord = mode === 'bend' ? getInterpolatedCoord(s.angle, 90) : getCoord(s.angle, 90);

                                    return (
                                        <g key={s.id}>
                                            <circle 
                                                cx={coord.x} 
                                                cy={coord.y} 
                                                r={10} 
                                                fill={s.color} 
                                                stroke="#fff" 
                                                strokeWidth="1.5"
                                                style={{ filter: `drop-shadow(0 0 5px ${s.color}66)`, transition: 'all 0.3s ease' }}
                                            />
                                            {isBent && (
                                                <text 
                                                    x={coord.x} 
                                                    y={coord.y > 140 ? coord.y + 18 : coord.y - 13} 
                                                    fill={s.color} 
                                                    fontSize="10" 
                                                    fontWeight="bold" 
                                                    textAnchor="middle"
                                                >
                                                    {s.label.split(' ')[1]}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}

                                {/* E. Render Keys (Client Mappings) */}
                                {mode !== 'ring' && (mode === 'sandbox' ? sandboxKeys : [
                                    { id: 'k0', label: 'key0', angle: 30 },
                                    { id: 'k1', label: 'key1', angle: 100 },
                                    { id: 'k2', label: 'key2', angle: 190 },
                                    { id: 'k3', label: 'key3', angle: 290 }
                                ]).map(k => {
                                    if (mode === 'bend' && !isBent) {
                                        // Render linear key indicator
                                        const coord = getInterpolatedCoord(k.angle, 90);
                                        return (
                                            <g key={k.id}>
                                                <line x1={coord.x} y1={coord.y} x2={coord.x} y2={coord.y - 12} stroke="#c084fc" strokeWidth="2" />
                                                <text x={coord.x} y={coord.y - 16} fill="#c084fc" fontSize="9" textAnchor="middle" fontWeight="bold">{k.label}</text>
                                            </g>
                                        );
                                    }

                                    // Mapping logic
                                    let activeList = activeServers;
                                    if (mode === 'add' && addedS3) activeList = ['s0', 's1', 's2', 's3'];
                                    if (mode === 'remove' && removedS1) activeList = ['s0', 's2', 's3'];

                                    const mapping = getMapping(k.angle, activeList);
                                    const coord = getCoord(k.angle, 90);
                                    const isHovered = hoveredKey === k.id;
                                    const isSweepTarget = activeKeyId === k.id;

                                    return (
                                        <g 
                                            key={k.id} 
                                            onMouseEnter={() => setHoveredKey(k.id)} 
                                            onMouseLeave={() => setHoveredKey(null)}
                                        >
                                            {/* Link line mapping */}
                                            {mapping && isBent && (isHovered || mode !== 'arrows' || isSweepTarget) && (
                                                <line 
                                                    x1={coord.x} 
                                                    y1={coord.y} 
                                                    x2={getCoord(mapping.angle, 90).x} 
                                                    y2={getCoord(mapping.angle, 90).y} 
                                                    stroke={mapping.color} 
                                                    strokeWidth={isHovered ? "2.5" : "1.2"} 
                                                    strokeDasharray="4 3" 
                                                    opacity="0.85"
                                                    style={{ transition: 'all 0.2s' }}
                                                />
                                            )}

                                            <polygon 
                                                points={`${coord.x},${coord.y-6} ${coord.x+6},${coord.y} ${coord.x},${coord.y+6} ${coord.x-6},${coord.y}`} 
                                                fill="#c084fc" 
                                                stroke="#fff" 
                                                strokeWidth="1" 
                                                cursor="pointer" 
                                                style={{ filter: isHovered ? 'drop-shadow(0 0 6px #c084fc)' : 'none' }}
                                            />
                                            <text 
                                                x={coord.x} 
                                                y={coord.y - 11} 
                                                fill="#c084fc" 
                                                fontSize="9.5" 
                                                textAnchor="middle" 
                                                fontWeight="bold"
                                            >
                                                {k.label}
                                            </text>
                                        </g>
                                    );
                                })}

                            </svg>
                            {/* Hover info helper overlay */}
                            {mode === 'arrows' && isSweeping && (
                                <div style={{ position: 'absolute', bottom: 10, background: 'rgba(0,0,0,0.8)', padding: '6px 12px', borderRadius: 8, fontSize: 11, color: '#f472b6', border: '1px solid #ec489955', animation: 'pulse 1.5s infinite' }}>
                                    Sweeping Clockwise (Angle: {Math.round(sweepAngle)}°)...
                                </div>
                            )}
                            {mode === 'arrows' && lookupResult && (
                                <div style={{ position: 'absolute', bottom: 10, background: 'rgba(16,185,129,0.95)', padding: '6px 12px', borderRadius: 8, fontSize: 11.5, color: '#fff', border: '1px solid #10b981', fontWeight: 800 }}>
                                    🎉 Found Server: {lookupResult.label} (Angle: {lookupResult.angle}°)
                                </div>
                            )}
                        </div>

                        {/* 3. Dynamic Educational Controls per Mode */}
                        <div style={{ flex: '1 1 240px', minWidth: 240, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            
                            {/* BEND Controls */}
                            {mode === 'bend' && (
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 900, color: '#00d4aa', textTransform: 'uppercase', marginBottom: 10 }}>Bending Simulator</div>
                                    <button 
                                        onClick={triggerBending} 
                                        style={{ ...btnStyle, width: '100%', background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: 'none', fontWeight: 800, padding: 12 }}
                                    >
                                        {isBendingAnimating ? "Morphing..." : isBent ? "🔄 Straighten into Line" : "⭕ Bend into Circular Ring"}
                                    </button>
                                    <div style={{ fontSize: 11.5, color: 'var(--text-gray)', marginTop: 12, lineHeight: 1.4 }}>
                                        Consistent hashing maps nodes and keys to a continuous space. Linear ranges `[0, 2^32 - 1]` wrap around on themselves to form a mathematical ring.
                                    </div>
                                </div>
                            )}

                            {/* RING Controls */}
                            {mode === 'ring' && (
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Node Hash Mappings</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {serversList.map(s => (
                                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 10, fontSize: 12, border: `1px solid ${s.color}33` }}>
                                                <span style={{ color: s.color, fontWeight: 900 }}>{s.label}</span>
                                                <code style={{ fontSize: 10.5, color: 'var(--text-gray)' }}>{s.hash} ({s.angle}°)</code>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* KEYS Controls */}
                            {mode === 'keys' && (
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 900, color: '#c084fc', textTransform: 'uppercase', marginBottom: 10 }}>Key Locations</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {[
                                            { label: 'key0', angle: 30 },
                                            { label: 'key1', angle: 100 },
                                            { label: 'key2', angle: 190 },
                                            { label: 'key3', angle: 290 }
                                        ].map(k => (
                                            <div key={k.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-elevated)', borderRadius: 10, fontSize: 12, border: '1px solid var(--border)' }}>
                                                <span style={{ color: '#c084fc', fontWeight: 800 }}>{k.label}</span>
                                                <span style={{ color: 'var(--text-gray)' }}>Hash Coordinate: {k.angle}°</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ARROWS Controls */}
                            {mode === 'arrows' && (
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 900, color: '#f472b6', textTransform: 'uppercase', marginBottom: 10 }}>Clockwise Lookup sweep</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {[
                                            { id: 'k0', label: 'Lookup key0 (30°)', angle: 30 },
                                            { id: 'k1', label: 'Lookup key1 (100°)', angle: 100 },
                                            { id: 'k2', label: 'Lookup key2 (190°)', angle: 190 },
                                            { id: 'k3', label: 'Lookup key3 (290°)', angle: 290 }
                                        ].map(k => (
                                            <button 
                                                key={k.id}
                                                onClick={() => startClockwiseSweep(k.id, k.angle)}
                                                disabled={isSweeping}
                                                style={{
                                                    ...btnStyle,
                                                    width: '100%',
                                                    background: activeKeyId === k.id ? 'rgba(244,114,182,0.18)' : 'var(--bg-elevated)',
                                                    borderColor: activeKeyId === k.id ? '#f472b6' : 'var(--border)',
                                                    color: activeKeyId === k.id ? '#f472b6' : 'var(--text-light)',
                                                    fontWeight: 800,
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <span>{k.label}</span>
                                                <span>➔</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ADD Controls */}
                            {mode === 'add' && (
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 10 }}>Dynamic Addition</div>
                                    <button 
                                        onClick={() => {
                                            setAddedS3(true);
                                            // Animate key3 sweeping to S3
                                            startClockwiseSweep('k3', 290);
                                        }}
                                        disabled={addedS3}
                                        style={{
                                            ...btnStyle,
                                            width: '100%',
                                            background: addedS3 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                            color: addedS3 ? '#10b981' : '#f59e0b',
                                            border: 'none',
                                            fontWeight: 900,
                                            padding: 11
                                        }}
                                    >
                                        {addedS3 ? "✓ Server 3 Active!" : "➕ Add Server 3 (315°)"}
                                    </button>
                                    
                                    {addedS3 ? (
                                        <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)', fontSize: 12, color: '#10b981', lineHeight: 1.4 }}>
                                            <strong>✓ Cache Safety:</strong> Only <strong>key3</strong> remapped clockwise from Server 0 to Server 3! key0, key1, key2 remained completely stationary.
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: 11.5, color: 'var(--text-gray)', marginTop: 12, lineHeight: 1.4 }}>
                                            Notice that key3 (290°) currently maps past S2 (225°) all the way to S0 (45°). Click Add Server to balance this segment.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* REMOVE Controls */}
                            {mode === 'remove' && (
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', marginBottom: 10 }}>Crash Simulation</div>
                                    <button 
                                        onClick={() => {
                                            setRemovedS1(true);
                                            // Animate key1 sweeping to S2
                                            startClockwiseSweep('k1', 100);
                                        }}
                                        disabled={removedS1}
                                        style={{
                                            ...btnStyle,
                                            width: '100%',
                                            background: removedS1 ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.15)',
                                            color: '#ef4444',
                                            border: 'none',
                                            fontWeight: 900,
                                            padding: 11
                                        }}
                                    >
                                        {removedS1 ? "🛑 Server 1 Offline" : "💥 Crash Server 1 (135°)"}
                                    </button>

                                    {removedS1 ? (
                                        <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)', fontSize: 12, color: '#f59e0b', lineHeight: 1.4 }}>
                                            <strong>⚡ Redistribution:</strong> Only <strong>key1</strong> (previously on S1) remapped clockwise to Server 2. S0, S2, S3 were entirely unaffected.
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: 11.5, color: 'var(--text-gray)', marginTop: 12, lineHeight: 1.4 }}>
                                            Click Crash Server to see how consistent hashing handles sudden database failures with minimal disruption.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* VNODES Controls */}
                            {mode === 'vnodes' && (
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 900, color: '#00d4aa', textTransform: 'uppercase', marginBottom: 8 }}>Virtual Nodes Count</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <input 
                                                type="range" 
                                                min="1" 
                                                max="120" 
                                                value={vnodes} 
                                                onChange={e => setVnodes(parseInt(e.target.value))} 
                                                style={{ flex: 1, accentColor: '#00d4aa', cursor: 'pointer' }} 
                                            />
                                            <span style={{ fontSize: 13, color: '#00d4aa', fontWeight: 800 }}>{vnodes} vnodes</span>
                                        </div>
                                    </div>

                                    <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 12, border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, marginBottom: 6 }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Load Std Dev (σ):</span>
                                            <span style={{ color: parseFloat(getStdDev()) > 15 ? '#ef4444' : '#10b981', fontWeight: 900 }}>
                                                {getStdDev()}% {parseFloat(getStdDev()) > 15 ? '⚠️ High' : '✓ Excellent'}
                                            </span>
                                        </div>
                                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${Math.min(100, Math.max(5, getStdDev() * 2))}%`, background: parseFloat(getStdDev()) > 15 ? '#ef4444' : '#10b981', transition: 'width 0.2s' }}></div>
                                        </div>
                                    </div>

                                    {/* Physical Server Allocations */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {serversList.map(s => {
                                            const pct = getLoadPercentage(s.id);
                                            return (
                                                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                                        <span style={{ color: s.color, fontWeight: 700 }}>{s.label} Share:</span>
                                                        <span style={{ color: 'var(--text-light)', fontWeight: 800 }}>{pct}%</span>
                                                    </div>
                                                    <div style={{ height: 5, background: 'rgba(255,255,255,0.03)', borderRadius: 99, overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${pct}%`, background: s.color, transition: 'width 0.2s' }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* SANDBOX Controls */}
                            {mode === 'sandbox' && (
                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div>
                                        <div style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Vnodes Per Server</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <input 
                                                type="range" 
                                                min="1" 
                                                max="60" 
                                                value={vnodes} 
                                                onChange={e => setVnodes(parseInt(e.target.value))} 
                                                style={{ flex: 1, accentColor: '#00d4aa', cursor: 'pointer' }} 
                                            />
                                            <span style={{ fontSize: 12, color: '#00d4aa', fontWeight: 800 }}>{vnodes} Nodes</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Active Nodes</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                                            {allServers.map(s => {
                                                const active = activeServers.includes(s.id);
                                                return (
                                                    <button 
                                                        key={s.id} 
                                                        onClick={() => toggleServerCheckbox(s.id)}
                                                        style={{
                                                            ...btnStyle,
                                                            padding: '6px 4px',
                                                            fontSize: 10.5,
                                                            background: active ? `${s.color}1c` : 'rgba(255,255,255,0.01)',
                                                            borderColor: active ? s.color : 'var(--border)',
                                                            color: active ? s.color : 'var(--text-dim)',
                                                            fontWeight: 900
                                                        }}
                                                    >
                                                        {s.label.split(' ')[1]}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    {/* Glassmorphic console logs */}
                                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: 12, padding: 10, fontFamily: 'monospace', fontSize: 10.5, minHeight: 90, maxHeight: 110, overflowY: 'auto' }}>
                                        <div style={{ color: '#00d4aa', fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 4, marginBottom: 4 }}>LOG CONSOLE:</div>
                                        {logs.map((log, idx) => (
                                            <div key={idx} style={{ color: log.startsWith('Mapped') ? '#ec4899' : log.startsWith('System') ? '#00d4aa' : 'var(--text-dim)', marginBottom: 3, lineHeight: 1.25 }}>
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

/* =========================================================================
   17. HashingComparison (Modular vs Consistent Hashing Storms)
   ========================================================================= */
function HashingComparison({ mode = 'modular-transform' }) {
    const [offline, setOffline] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);

    const sampleKeys = [
        { id: 0, hash: 12, label: 'KeyA (Session)' },
        { id: 1, hash: 25, label: 'KeyB (Profile)' },
        { id: 2, hash: 38, label: 'KeyC (Cart)' },
        { id: 3, hash: 51, label: 'KeyD (Token)' },
        { id: 4, hash: 64, label: 'KeyE (Settings)' },
        { id: 5, hash: 77, label: 'KeyF (History)' },
        { id: 6, hash: 90, label: 'KeyG (Prefs)' },
        { id: 7, hash: 103, label: 'KeyH (Assets)' }
    ];

    const getModularServer = (hash, sCount) => hash % sCount;

    return (
        <div style={containerStyle}>
            {/* 1. MODULAR TRANSFORM MODE */}
            {mode === 'modular-transform' && (
                <div>
                    <VizHeader eyebrow="Sharding Performance Storms" title="Modular Hashing vs Consistent Hashing" />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '12px 18px', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 20 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Simulate crashing <strong>Server 1</strong>:</span>
                        <button 
                            onClick={() => setOffline(!offline)} 
                            style={{
                                ...btnStyle,
                                background: offline ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,170,0.15)',
                                color: offline ? '#ef4444' : '#00d4aa',
                                borderColor: offline ? '#ef444433' : '#00d4aa33',
                                fontWeight: 900
                            }}
                        >
                            {offline ? "💥 Server 1: CRASHED (OFFLINE)" : "🟢 Server 1: HEALTHY (ONLINE)"}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {/* Modular Hashing */}
                        <div style={{ background: 'rgba(239,68,68,0.02)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 20, padding: 18, position: 'relative' }}>
                            <div style={{ fontSize: 12, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>
                                Traditional Modular Hashing (hash % N)
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 900, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                                    <span>KEY</span>
                                    <span>BEFORE (N=4)</span>
                                    <span>AFTER (N=3)</span>
                                    <span>STATUS</span>
                                </div>
                                {sampleKeys.map(k => {
                                    const b = getModularServer(k.hash, 4);
                                    // When server 1 goes offline, N drops to 3
                                    const a = getModularServer(k.hash, 3);
                                    const changed = b !== a;
                                    return (
                                        <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--text-light)' }}>{k.label.split(' ')[0]}</span>
                                            <span style={{ color: b === 1 ? '#ef4444' : 'var(--text-muted)' }}>Node {b}</span>
                                            <span style={{ color: offline ? (a === 1 ? '#ef4444' : 'var(--text-light)') : 'var(--text-muted)' }}>
                                                {offline ? `Node ${a}` : `Node ${b}`}
                                            </span>
                                            <span style={{ color: offline ? (changed ? '#ef4444' : '#10b981') : '#10b981', fontWeight: 900, fontSize: 11 }}>
                                                {offline ? (changed ? '❌ MISS' : '✓ HIT') : '✓ HIT'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            {offline && (
                                <div style={{ fontSize: 12, color: '#ef4444', marginTop: 14, fontWeight: 800, textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: 10, borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)', animation: 'pulse 2s infinite' }}>
                                    🛑 75% CACHE MISS STORM! (6/8 keys remapped. Massive DB read spike triggered!)
                                </div>
                            )}
                        </div>

                        {/* Consistent Hashing */}
                        <div style={{ background: 'rgba(16,185,129,0.02)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 20, padding: 18 }}>
                            <div style={{ fontSize: 12, fontWeight: 900, color: '#10b981', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>
                                Consistent Hashing Ring (Radius search)
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 900, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                                    <span>KEY</span>
                                    <span>BEFORE (N=4)</span>
                                    <span>AFTER (N=3)</span>
                                    <span>STATUS</span>
                                </div>
                                {sampleKeys.map(k => {
                                    // With consistent hashing: only KeyB and KeyF were mapped to Server 1.
                                    // When Server 1 goes offline, only those two keys shift clockwise to Server 2.
                                    const b = (k.label.includes('KeyB') || k.label.includes('History')) ? 1 : k.id % 4;
                                    const a = b === 1 ? 2 : b;
                                    const changed = b !== a;
                                    return (
                                        <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--text-light)' }}>{k.label.split(' ')[0]}</span>
                                            <span style={{ color: b === 1 ? '#ef4444' : 'var(--text-muted)' }}>Node {b}</span>
                                            <span style={{ color: offline ? (a === 1 ? '#ef4444' : 'var(--text-light)') : 'var(--text-muted)' }}>
                                                {offline ? `Node ${a}` : `Node ${b}`}
                                            </span>
                                            <span style={{ color: offline ? (changed ? '#f59e0b' : '#10b981') : '#10b981', fontWeight: 900, fontSize: 11 }}>
                                                {offline ? (changed ? '⚡ REALLOC' : '✓ HIT') : '✓ HIT'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            {offline && (
                                <div style={{ fontSize: 12, color: '#10b981', marginTop: 14, fontWeight: 800, textAlign: 'center', background: 'rgba(16,185,129,0.1)', padding: 10, borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)' }}>
                                    ✓ Safe: Only 12.5% cache reallocated! Ring re-routing absorbed node failure.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. COMPARISON CARD MODE */}
            {mode === 'comparison-card' && (
                <div>
                    <VizHeader eyebrow="Structural Comparison Metrics" title="Traditional Sharding vs Consistent Hashing" />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 12 }}>
                        {/* Traditional Card */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 24, padding: 22 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></div>
                                <h3 style={{ fontSize: 14, fontWeight: 850, margin: 0, color: 'var(--text-light)' }}>Modular Sharding (hash % N)</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <MetricTile label="Remapping overhead on resize" value="O(K) - 100% disruption" color="#ef4444" />
                                <div style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.4 }}>
                                    • <strong>Symptom:</strong> Modulo value changes when N fluctuates. Almost every single key resolves to a brand new index.
                                </div>
                                <div style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.4 }}>
                                    • <strong>DB Risk:</strong> Causes massive downstream databases to collapse under immediate cache misses (stampede storm).
                                </div>
                                <div style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.4 }}>
                                    • <strong>Ideal For:</strong> Completely static, non-resizable environments only.
                                </div>
                            </div>
                        </div>

                        {/* Consistent Hashing Card */}
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 24, padding: 22, boxShadow: '0 0 24px rgba(0,212,170,0.1)' }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00d4aa' }}></div>
                                <h3 style={{ fontSize: 14, fontWeight: 850, margin: 0, color: '#00d4aa' }}>Consistent Hashing Ring</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <MetricTile label="Remapping overhead on resize" value="O(K/N) - Minimal disruption" color="#00d4aa" />
                                <div style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.4 }}>
                                    • <strong>Symptom:</strong> Keys are distributed on a ring. Only the immediate neighboring segment shifts.
                                </div>
                                <div style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.4 }}>
                                    • <strong>DB Risk:</strong> Database remains completely stable. Remapped partition is smoothly warm-fetched on-demand.
                                </div>
                                <div style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.4 }}>
                                    • <strong>Ideal For:</strong> Highly dynamic, elastic production services (Redis/Memcached clusters, scalable databases).
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. BENEFITS MODE */}
            {mode === 'benefits' && (
                <div>
                    <VizHeader eyebrow="Key Architectural Advantages" title="Consistent Hashing Benefits" />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                        {[
                            {
                                id: 'b1',
                                title: "⚡ Minimal Re-hashing & Disruption",
                                sub: "Guarantees that when the server cluster scales, only O(K/N) keys move.",
                                desc: "Under traditional modulo sharding, adding a 10th server to a 9-server cluster forces ~90% of your keys to change server mappings. Consistent Hashing reduces this to exactly 10%, keeping 90% of your cached entries completely valid and hot."
                            },
                            {
                                id: 'b2',
                                title: "📈 Elastic Horizontal Scalability",
                                sub: "Enables seamless server additions and removals on-the-fly.",
                                desc: "No complex data migrations, lockups, or full-system maintenance windows are required. New servers can be spun up during traffic spikes to immediately start absorbing a uniform portion of the load without impact."
                            },
                            {
                                id: 'b3',
                                title: "🎯 Load Hot-Spot Mitigation",
                                sub: "Utilizes Virtual Nodes to smooth partition variances and distribute weight.",
                                desc: "By scattering multiple virtual coordinates representing the same physical hardware across the ring, data distribution perfectly matches a uniform bell curve, solving the risk of clustered hotspots or single-server hardware exhaustion."
                            }
                        ].map(b => {
                            const isExpanded = expandedCard === b.id;
                            return (
                                <div 
                                    key={b.id} 
                                    onClick={() => setExpandedCard(isExpanded ? null : b.id)}
                                    style={{
                                        background: isExpanded ? 'rgba(0,212,170,0.03)' : 'var(--bg-elevated)',
                                        border: `1px solid ${isExpanded ? '#00d4aa55' : 'var(--border)'}`,
                                        borderRadius: 16,
                                        padding: 16,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 13.5, fontWeight: 850, color: isExpanded ? '#00d4aa' : 'var(--text-light)' }}>{b.title}</div>
                                            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{b.sub}</div>
                                        </div>
                                        <span style={{ color: isExpanded ? '#00d4aa' : 'var(--text-dim)', fontSize: 16, fontWeight: 900 }}>
                                            {isExpanded ? '▼' : '▶'}
                                        </span>
                                    </div>
                                    {isExpanded && (
                                        <div style={{ fontSize: 12.5, color: 'var(--text-gray)', marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12, lineHeight: 1.5, animation: 'fadeIn 0.25s' }}>
                                            {b.desc}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 4. REAL-WORLD PRODUCTION CASES */}
            {mode === 'real-world' && (
                <div>
                    <VizHeader eyebrow="Consistent Hashing in Action" title="Production Case Studies" />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                        {[
                            {
                                id: 'rc1',
                                icon: "💾",
                                title: "Amazon DynamoDB",
                                usage: "Data Partitioning & Token Allocation",
                                details: "Amazon's foundational Dynamo paper popularized consistent hashing. It uses a token ring where partition boundaries map specific hash spaces to storage nodes. Virtual nodes ('vnodes') balance hardware capacity by assigning more tokens to faster storage hardware."
                            },
                            {
                                id: 'rc2',
                                icon: "🍃",
                                title: "Apache Cassandra",
                                usage: "Distributed Peer-to-Peer Storage",
                                details: "Cassandra uses consistent hashing to assign data ranges to nodes in its circular cluster ring. The cluster partitioner converts key values into tokens, which are searched clockwise to determine write ownership. Vnodes (usually 256 per node) guarantee write load balancing."
                            },
                            {
                                id: 'rc3',
                                icon: "💬",
                                title: "Discord Guild Routers",
                                usage: "User Session & Voice Gateway Mapping",
                                details: "Discord scales to millions of concurrent voice connections by mapping server guilds to back-end voice/text coordinator nodes. Ring hashing routes messages deterministically. If a node crashes, only its active guilds are smoothly reallocated to the nearest survivors."
                            },
                            {
                                id: 'rc4',
                                icon: "📡",
                                title: "Akamai CDN Proxy Caches",
                                usage: "Web Proxy Routing & Hotspot Prevention",
                                details: "Akamai caches petabytes of content globally. Consistent hashing avoids cache thrashing when proxy servers go offline or are added. It guarantees that client request paths hash to the same proxy node, maximizing local cache hit ratios."
                            },
                            {
                                id: 'rc5',
                                icon: "⚙️",
                                title: "LinkedIn Voldemort",
                                usage: "Dynamic Sharding Key-Value Store",
                                details: "Voldemort, LinkedIn's distributed key-value store, employs standard consistent hashing to handle node resizing without data loss. It coordinates ring replication structures, allocating replicas clockwise to the next N physical servers on the ring."
                            }
                        ].map(c => {
                            const isExpanded = expandedCard === c.id;
                            return (
                                <div 
                                    key={c.id} 
                                    onClick={() => setExpandedCard(isExpanded ? null : c.id)}
                                    style={{
                                        background: isExpanded ? 'rgba(59,130,246,0.03)' : 'var(--bg-elevated)',
                                        border: `1px solid ${isExpanded ? '#3b82f655' : 'var(--border)'}`,
                                        borderRadius: 16,
                                        padding: 16,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                        <div style={{ fontSize: 24, padding: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>{c.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13.5, fontWeight: 950, color: isExpanded ? '#3b82f6' : 'var(--text-light)' }}>{c.title}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.usage}</div>
                                        </div>
                                        <span style={{ color: isExpanded ? '#3b82f6' : 'var(--text-dim)', fontSize: 14 }}>
                                            {isExpanded ? '▼' : '▶'}
                                        </span>
                                    </div>
                                    {isExpanded && (
                                        <div style={{ fontSize: 12.5, color: 'var(--text-gray)', marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12, lineHeight: 1.5, animation: 'fadeIn 0.2s' }}>
                                            {c.details}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
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
                <div style={{ background: failed ? 'rgba(239,68,68,0.08)' : 'var(--bg-elevated)', border: `1px solid ${failed ? '#ef4444' : 'var(--border)'}`, borderRadius: 16, padding: 18, transition: 'all 0.25s' }}>
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


/* =========================================================================
   18. DistributedIdFailureWidget (Section 1: Why Auto-Increment Fails)
   ========================================================================= */
function DistributedIdFailureWidget() {
    const [activePanel, setActivePanel] = useState(0);
    const [syncState, setSyncState] = useState('idle');
    
    const panels = [
        {
            title: "Database Sync Latency",
            desc: "Multi-datacenter replication delay over WAN makes real-time coordination impossible.",
            explanation: "In a global system, waiting for databases in US-East and EU-West to synchronize their auto-increment numbers takes hundreds of milliseconds, defeating low latency requirements."
        },
        {
            title: "Replication Lag & ID Collision",
            desc: "Writes to Master are read from Replica before sync completes, leading to duplicate ID allocation.",
            explanation: "When client requests hit separate nodes, concurrent writes read the same outdated database sequence counter, resulting in identical IDs generated across different user records."
        },
        {
            title: "Split-Brain Partition",
            desc: "Isolated datacenter clusters generate conflicting IDs without realizing their connection is broken.",
            explanation: "During a network partition, both clusters remain active. Since neither can consult a central master, they concurrently allocate identical auto-increment IDs (e.g. ID 102), causing fatal collisions upon network reconciliation."
        }
    ];

    useEffect(() => {
        let timer;
        if (activePanel === 0) {
            setSyncState('idle');
            timer = setInterval(() => {
                setSyncState(s => s === 'idle' ? 'syncing' : 'idle');
            }, 2500);
        } else {
            setSyncState('idle');
        }
        return () => clearInterval(timer);
    }, [activePanel]);

    return (
        <div style={containerStyle}>
            <style>{`
                @keyframes partition-flash {
                    0% { opacity: 0.3; }
                    100% { opacity: 1; }
                }
            `}</style>
            <VizHeader title="The Auto-Increment Counter Bottleneck" eyebrow="Why Auto-Increment Fails in Distributed Systems" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginBottom: 20 }}>
                {panels.map((p, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => setActivePanel(idx)}
                        style={{
                            background: activePanel === idx ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                            border: activePanel === idx ? '1px solid #00d4aa' : '1px solid var(--border)',
                            borderRadius: 14,
                            padding: 14,
                            cursor: 'pointer',
                            transition: 'all 0.25s ease'
                        }}
                    >
                        <div style={{ fontSize: 13, fontWeight: 900, color: activePanel === idx ? '#00d4aa' : 'var(--text-light)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ background: activePanel === idx ? '#00d4aa' : 'rgba(255,255,255,0.08)', color: '#071018', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900 }}>{idx + 1}</span>
                            {p.title}
                        </div>
                        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{p.desc}</p>
                    </div>
                ))}
            </div>

            {/* Animation Area */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, minHeight: 180, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
                {activePanel === 0 && (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28 }}>🇺🇸</div>
                            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-light)', marginTop: 4 }}>US-East Master</div>
                            <div style={{ fontSize: 10, color: '#00d4aa', background: 'rgba(0,212,170,0.08)', padding: '2px 6px', borderRadius: 4, marginTop: 4, fontFamily: 'monospace' }}>Value: 101</div>
                        </div>
                        <div style={{ flexGrow: 1, height: 3, margin: '0 20px', background: 'var(--border)', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: '#00d4aa',
                                top: -3,
                                left: syncState === 'syncing' ? '90%' : '0%',
                                transition: 'left 2.2s linear',
                                boxShadow: '0 0 8px #00d4aa'
                            }} />
                            <div style={{ position: 'absolute', width: '100%', textAlign: 'center', fontSize: 9, color: 'var(--text-muted)', top: 8, fontWeight: 700 }}>
                                {syncState === 'syncing' ? "⚡ Syncing WAN Latency (150ms)..." : "⏳ Awaiting replication packet"}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28 }}>🇪🇺</div>
                            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-light)', marginTop: 4 }}>EU-West Replica</div>
                            <div style={{ fontSize: 10, color: syncState === 'syncing' ? 'var(--text-muted)' : '#00d4aa', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: 4, marginTop: 4, fontFamily: 'monospace' }}>
                                Value: {syncState === 'syncing' ? "100" : "101"}
                            </div>
                        </div>
                    </div>
                )}

                {activePanel === 1 && (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <div style={{ border: '1px dashed #3b82f6', background: 'rgba(59,130,246,0.05)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 900, textTransform: 'uppercase' }}>MASTER (DB-A)</div>
                            <div style={{ fontSize: 20, margin: '4px 0' }}>🗄️</div>
                            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#00d4aa' }}>Value: 405</div>
                            <span style={{ fontSize: 9, color: '#00d4aa' }}>✅ ID 405 allocated</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ fontSize: 18, color: '#f59e0b', animation: 'spin 6s linear infinite' }}>🔄</div>
                            <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 800, marginTop: 4 }}>Replication Lag</div>
                        </div>
                        <div style={{ border: '1px dashed #ef4444', background: 'rgba(239,68,68,0.05)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 900, textTransform: 'uppercase' }}>REPLICA (DB-B)</div>
                            <div style={{ fontSize: 20, margin: '4px 0' }}>📂</div>
                            <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>Value: 404</div>
                            <span style={{ fontSize: 9, color: '#ef4444' }}>❌ Collision Risk!</span>
                        </div>
                    </div>
                )}

                {activePanel === 2 && (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <div style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>DC-East Segment</div>
                            <div style={{ fontSize: 20 }}>💻</div>
                            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '2px 6px', borderRadius: 4, marginTop: 4 }}>Allocated ID: 102</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, animation: 'partition-flash 0.5s infinite alternate', color: '#ef4444', fontWeight: 900 }}>⚡ 🪓 ⚡</div>
                            <div style={{ fontSize: 9, color: '#ef4444', fontWeight: 900, textTransform: 'uppercase', marginTop: 4 }}>Network Partition</div>
                        </div>
                        <div style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>DC-West Segment</div>
                            <div style={{ fontSize: 20 }}>💻</div>
                            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '2px 6px', borderRadius: 4, marginTop: 4 }}>Allocated ID: 102</div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 14, padding: 12, background: 'rgba(0, 212, 170, 0.04)', borderLeft: '3px solid #00d4aa', borderRadius: 8, fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.45 }}>
                <strong>Interview Lens:</strong> {panels[activePanel].explanation}
            </div>
        </div>
    );
}

/* =========================================================================
   19. DistributedIdRequirementsWidget (Section 2: Requirements Table)
   ========================================================================= */
function DistributedIdRequirementsWidget() {
    const [selectedReq, setSelectedReq] = useState(0);

    const reqs = [
        { name: "Uniqueness", target: "No duplicate IDs ever", desc: "IDs must be absolutely unique globally across multiple service instances.", uuid: "✅ Yes", snowflake: "✅ Yes", ticket: "✅ Yes" },
        { name: "Time Sortable", target: "Ordered by timestamp", desc: "IDs must increase chronologically over time so records sort cleanly naturally.", uuid: "❌ No (v4 is random)", snowflake: "✅ Yes", ticket: "✅ Yes" },
        { name: "Numeric 64-bit", target: "Fits standard database index", desc: "64-bit integer values fit perfectly into standard database numeric index layouts.", uuid: "❌ No (128-bit string)", snowflake: "✅ Yes", ticket: "✅ Yes" },
        { name: "High Availability", target: "No SPOF bottlenecks", desc: "The ID generation system must continue operating even during local node or datacenter outages.", uuid: "✅ Yes (Stateless)", snowflake: "✅ Yes (Independent)", ticket: "❌ No (Single Ticket SPOF)" },
        { name: "Throughput", target: ">= 10,000 IDs/sec", desc: "Highly performant, generating thousands of IDs per millisecond with zero distributed consensus locks.", uuid: "✅ Yes", snowflake: "✅ Yes", ticket: "⚠️ Slow (Requires network hops)" }
    ];

    return (
        <div style={containerStyle}>
            <VizHeader title="Distributed ID Requirements Matrix" eyebrow="System Design Requirements Clarification" />

            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 14, background: 'rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Requirement</th>
                            <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>UUID Pattern</th>
                            <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Central Ticket Server</th>
                            <th style={{ padding: '12px 14px', color: '#00d4aa' }}>Twitter Snowflake</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reqs.map((r, idx) => (
                            <tr 
                                key={idx} 
                                onClick={() => setSelectedReq(idx)}
                                style={{
                                    borderBottom: '1px solid var(--border)',
                                    background: selectedReq === idx ? 'rgba(0, 212, 170, 0.05)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <td style={{ padding: '12px 14px', fontWeight: '800', color: selectedReq === idx ? '#00d4aa' : 'var(--text-light)' }}>{r.name}</td>
                                <td style={{ padding: '12px 14px', color: r.uuid.includes('❌') ? '#ef4444' : '#e2e8f0' }}>{r.uuid}</td>
                                <td style={{ padding: '12px 14px', color: r.ticket.includes('❌') ? '#ef4444' : r.ticket.includes('⚠️') ? '#f59e0b' : '#e2e8f0' }}>{r.ticket}</td>
                                <td style={{ padding: '12px 14px', color: '#00d4aa', fontWeight: '800' }}>{r.snowflake}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Requirement Detail Overlay */}
            <div style={{ marginTop: 16, padding: 14, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '10px', fontWeight: '900', color: '#00d4aa', textTransform: 'uppercase' }}>Focus details</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Target: {reqs[selectedReq].target}</span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '13.5px', color: 'var(--text-light)' }}>{reqs[selectedReq].name} Description</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{reqs[selectedReq].desc}</p>
            </div>
        </div>
    );
}

/* =========================================================================
   20. MultiMasterIdGeneratorWidget (Section 3: Multi-Master ID Generation)
   ========================================================================= */
function MultiMasterIdGeneratorWidget() {
    const [idsA, setIdsA] = useState([1, 3, 5]);
    const [idsB, setIdsB] = useState([2, 4, 6]);
    const [drift, setDrift] = useState(0); 
    const [generatedIds, setGeneratedIds] = useState([]);
    const [dbCount, setDbCount] = useState(2); 

    const triggerWrite = () => {
        const timeNow = Date.now();
        const latencyOffset = drift;
        const newIdA = dbCount === 2 
            ? idsA[idsA.length - 1] + 2 
            : idsA[idsA.length - 1] + 3;
        const newIdB = dbCount === 2 
            ? idsB[idsB.length - 1] + 2 
            : idsB[idsB.length - 1] + 3;

        setTimeout(() => {
            setIdsA(prev => [...prev.slice(-3), newIdA]);
            setGeneratedIds(prev => [{ id: newIdA, server: 'Master DB A', time: 'T1', order: timeNow + latencyOffset }, ...prev].slice(0, 6));
        }, latencyOffset);

        setIdsB(prev => [...prev.slice(-3), newIdB]);
        setGeneratedIds(prev => [{ id: newIdB, server: 'Master DB B', time: 'T2', order: timeNow }, ...prev].slice(0, 6));
    };

    const resetWidget = () => {
        if (dbCount === 2) {
            setIdsA([1, 3, 5]);
            setIdsB([2, 4, 6]);
        } else {
            setIdsA([1, 4, 7]);
            setIdsB([2, 5, 8]);
        }
        setGeneratedIds([]);
    };

    return (
        <div style={containerStyle}>
            <VizHeader title="Incremental Steps & Order Latency Drift" eyebrow="Approach 1: Multi-Master Replication" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 18 }}>
                
                {/* Server A Node */}
                <div style={{ background: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 900, textTransform: 'uppercase' }}>Database Master A (k=odd)</div>
                    <div style={{ fontSize: 24, margin: '6px 0' }}>🗄️</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        {idsA.slice(-3).map((val, idx) => (
                            <span key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace' }}>{val}</span>
                        ))}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>Increment: +{dbCount}</div>
                </div>

                {/* Server B Node */}
                <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#10b981', fontWeight: 900, textTransform: 'uppercase' }}>Database Master B (k=even)</div>
                    <div style={{ fontSize: 24, margin: '6px 0' }}>🗄️</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        {idsB.slice(-3).map((val, idx) => (
                            <span key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace' }}>{val}</span>
                        ))}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>Increment: +{dbCount}</div>
                </div>

            </div>

            {/* Drift and DB count selectors */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, marginBottom: 18 }}>
                <div style={{ flex: '1 1 180px' }}>
                    <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span><b>Server A Latency Delay:</b></span>
                        <span style={{ color: drift > 0 ? '#ef4444' : '#00d4aa', fontWeight: '800' }}>{drift} ms</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="2000" 
                        step="100"
                        value={drift} 
                        onChange={e => setDrift(Number(e.target.value))} 
                        style={{ width: '100%', accentColor: '#00d4aa' }} 
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Increment Step (K)</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => { setDbCount(2); resetWidget(); }} style={{ ...btnStyle, background: dbCount === 2 ? 'rgba(0,212,170,0.1)' : 'transparent', color: dbCount === 2 ? '#00d4aa' : 'var(--text-muted)', fontSize: 11.5 }}>2 Masters</button>
                        <button onClick={() => { setDbCount(3); resetWidget(); }} style={{ ...btnStyle, background: dbCount === 3 ? 'rgba(0,212,170,0.1)' : 'transparent', color: dbCount === 3 ? '#00d4aa' : 'var(--text-muted)', fontSize: 11.5 }}>3 Masters</button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                <button onClick={triggerWrite} style={{ ...btnStyle, background: '#00d4aa12', color: '#00d4aa' }}>Trigger Parallel Writes</button>
                <button onClick={resetWidget} style={btnStyle}>Reset Counters</button>
            </div>

            {/* Console */}
            <div style={{ background: '#071018', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Sequence Logs (Chronology checks)</div>
                <div style={{ minHeight: 90, maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'monospace', fontSize: 11.5 }}>
                    {generatedIds.length === 0 && <span style={{ color: 'var(--text-dim)' }}>No events. Trigger write requests above.</span>}
                    {generatedIds.map((item, idx) => {
                        const isOutofOrder = idx > 0 && item.id < generatedIds[idx - 1].id;
                        return (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px', background: isOutofOrder ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.01)', borderRadius: 6, borderLeft: isOutofOrder ? '3px solid #ef4444' : '3px solid #00d4aa' }}>
                                <span>🟢 Counter: <strong>{item.id}</strong> ({item.server})</span>
                                <span style={{ color: isOutofOrder ? '#ef4444' : 'var(--text-muted)' }}>
                                    {isOutofOrder ? "⚠️ Chronology Out-Of-Order Event!" : "OK"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   21. UuidBtreeComparisonWidget (Section 4: UUID Breakdown)
   ========================================================================= */
function UuidBtreeComparisonWidget() {
    const [uuidType, setUuidType] = useState('v4');
    const [btreeNodes, setBtreeNodes] = useState([
        { id: 1, items: [10, 20], max: 4, split: false },
        { id: 2, items: [30, 40], max: 4, split: false }
    ]);
    const [splitAlert, setSplitAlert] = useState(false);

    const triggerInsert = () => {
        if (uuidType === 'v7') {
            setBtreeNodes(nodes => {
                const nextNodes = JSON.parse(JSON.stringify(nodes));
                const lastNode = nextNodes[nextNodes.length - 1];
                if (lastNode.items.length < lastNode.max) {
                    const nextVal = lastNode.items[lastNode.items.length - 1] + 5;
                    lastNode.items.push(nextVal);
                } else {
                    const nextVal = lastNode.items[lastNode.items.length - 1] + 5;
                    nextNodes.push({ id: nextNodes.length + 1, items: [nextVal], max: 4, split: false });
                }
                return nextNodes;
            });
        } else {
            setBtreeNodes(nodes => {
                const nextNodes = JSON.parse(JSON.stringify(nodes));
                const targetIdx = Math.floor(Math.random() * nextNodes.length);
                const targetNode = nextNodes[targetIdx];

                if (targetNode.items.length < targetNode.max) {
                    const insertVal = Math.floor(Math.random() * 100);
                    targetNode.items.push(insertVal);
                    targetNode.items.sort((a,b)=>a-b);
                } else {
                    setSplitAlert(true);
                    targetNode.split = true;
                    setTimeout(() => {
                        setBtreeNodes(currNodes => {
                            const cleanNodes = currNodes.map(n => ({ ...n, split: false }));
                            const tNode = cleanNodes.find(n => n.id === targetNode.id);
                            if (tNode) {
                                const allItems = [...tNode.items, Math.floor(Math.random() * 100)];
                                allItems.sort((a,b)=>a-b);
                                const mid = Math.floor(allItems.length / 2);
                                tNode.items = allItems.slice(0, mid);
                                const newId = Math.max(...cleanNodes.map(n=>n.id)) + 1;
                                cleanNodes.push({ id: newId, items: allItems.slice(mid), max: 4, split: false });
                            }
                            setSplitAlert(false);
                            return cleanNodes;
                        });
                    }, 650);
                }
                return nextNodes;
            });
        }
    };

    const resetBtree = () => {
        setBtreeNodes([
            { id: 1, items: [10, 20], max: 4, split: false },
            { id: 2, items: [30, 40], max: 4, split: false }
        ]);
        setSplitAlert(false);
    };

    return (
        <div style={containerStyle}>
            <VizHeader title="UUID Structure & B-Tree Page Split Simulator" eyebrow="Approach 2: UUID & Index Performance" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 18 }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 12, borderRadius: 12 }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                        <button onClick={() => { setUuidType('v4'); resetBtree(); }} style={{ ...btnStyle, background: uuidType === 'v4' ? 'rgba(239,68,68,0.1)' : 'transparent', color: uuidType === 'v4' ? '#ef4444' : 'var(--text-muted)', fontSize: 11.5 }}>UUID v4 (Random)</button>
                        <button onClick={() => { setUuidType('v7'); resetBtree(); }} style={{ ...btnStyle, background: uuidType === 'v7' ? 'rgba(0,212,170,0.1)' : 'transparent', color: uuidType === 'v7' ? '#00d4aa' : 'var(--text-muted)', fontSize: 11.5 }}>UUID v7 (Time-Ordered)</button>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.45 }}>
                        {uuidType === 'v4' 
                            ? "Random 128-bit hex string. Leads to severe database key sharding and random B-tree leaf fragmentation on high write load." 
                            : "Time-ordered 128-bit timestamp-first layout. Ensures strictly sequential indexes and zero page allocation splits."}
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 12, borderRadius: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#00d4aa', textTransform: 'uppercase', marginBottom: 6 }}>128-Bit String Breakdown</div>
                    <div style={{ display: 'flex', width: '100%', height: 20, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {uuidType === 'v4' ? (
                            <>
                                <div style={{ width: '90%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 900, color: '#000000' }}>122 bits: Random Noise</div>
                                <div style={{ width: '10%', background: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 900, color: '#000000' }}>Ver</div>
                            </>
                        ) : (
                            <>
                                <div style={{ width: '45%', background: '#00d4aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 900, color: '#000000' }}>48b Time</div>
                                <div style={{ width: '15%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 900, color: '#000000' }}>1 Ver</div>
                                <div style={{ width: '40%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 900, color: '#000000' }}>Random</div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* B-tree Canvas */}
            <div style={{ background: 'rgba(15, 23, 42, 0.3)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, position: 'relative' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>B-Tree Index Leaf Pages</div>
                
                {splitAlert && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 6, padding: '2px 8px', fontSize: 10, color: '#ef4444', fontWeight: 900 }}>
                        💥 B-Tree Page Split!
                    </div>
                )}

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', minHeight: 110 }}>
                    {btreeNodes.map(node => (
                        <div 
                            key={node.id} 
                            style={{
                                width: 110,
                                background: node.split ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.01)',
                                border: node.split ? '2px solid #ef4444' : '1px solid var(--border)',
                                borderRadius: 12,
                                padding: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6,
                                transform: node.split ? 'scale(1.04)' : 'scale(1)',
                                transition: 'all 0.25s ease'
                            }}
                        >
                            <div style={{ fontSize: 9.5, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Page {node.id}</span>
                                <span style={{ fontWeight: 800, color: node.items.length >= node.max ? '#ef4444' : '#00d4aa' }}>{node.items.length}/{node.max}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {node.items.map((val, idx) => (
                                    <div key={idx} style={{ background: '#071018', border: '1px solid var(--border)', padding: '2px', borderRadius: 4, fontSize: 11, fontFamily: 'monospace', textAlign: 'center' }}>
                                        {val}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
                    <button onClick={triggerInsert} style={{ ...btnStyle, background: uuidType === 'v7' ? '#00d4aa12' : '#ef444412', color: uuidType === 'v7' ? '#00d4aa' : '#ef4444' }}>
                        📥 Insert UUID Index
                    </button>
                    <button onClick={resetBtree} style={btnStyle}>Reset Index</button>
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   22. TicketServerSpofWidget (Section 5: Ticket Server)
   ========================================================================= */
function TicketServerSpofWidget() {
    const [healthy, setHealthy] = useState(true);
    const [counter, setCounter] = useState(1001);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState(["Flickr Ticket Server Cluster online."]);

    const requestUniqueId = () => {
        if (loading) return;
        setLoading(true);

        const newLog = healthy 
            ? `Client fetch ID -> central Ticket Server returned: ID ${counter}` 
            : `Client fetch ID -> ❌ connection Timeout! Ticket Server Offline (SPOF) Outage!`;

        setLogs(prev => [newLog, ...prev].slice(0, 4));

        setTimeout(() => {
            if (healthy) {
                setCounter(c => c + 1);
            }
            setLoading(false);
        }, 300);
    };

    return (
        <div style={containerStyle}>
            <VizHeader title="Single Point of Failure (SPOF) Lab" eyebrow="Approach 3: Central Ticket Server" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 18 }}>
                
                {/* Control */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 12, borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12.5, fontWeight: '800' }}>Ticket Server State:</span>
                        <button 
                            onClick={() => setHealthy(!healthy)} 
                            style={{
                                ...btnStyle,
                                background: healthy ? 'rgba(0,212,170,0.1)' : 'rgba(239,68,68,0.1)',
                                color: healthy ? '#00d4aa' : '#ef4444',
                                borderColor: healthy ? '#00d4aa' : '#ef4444',
                                fontSize: 11
                            }}
                        >
                            {healthy ? "🟢 ONLINE" : "💥 CRASHED"}
                        </button>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        If the single ticket database cluster encounters an outage, ID requests globally time out instantly, shutting down all writer operations.
                    </div>
                </div>

                {/* Diagram */}
                <div style={{ background: 'rgba(15,23,42,0.3)', border: '1px solid var(--border)', padding: 12, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: '700' }}>Clients</div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>API 1</div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>API 2</div>
                        </div>

                        <div style={{ width: 30, height: 2, background: healthy ? '#00d4aa' : '#ef4444' }} />

                        {/* Central DB node */}
                        <div style={{
                            background: healthy ? 'rgba(0, 212, 170, 0.04)' : 'rgba(239,68,68,0.08)',
                            border: healthy ? '1.5px solid #00d4aa' : '1.5px dashed #ef4444',
                            borderRadius: 12,
                            padding: 10,
                            textAlign: 'center',
                            width: 100
                        }}>
                            <div style={{ fontSize: 9.5, color: healthy ? '#00d4aa' : '#ef4444', fontWeight: '800' }}>TICKET DB</div>
                            <div style={{ fontSize: 20, margin: '2px 0' }}>🗄️</div>
                            <div style={{ fontSize: 11.5, fontFamily: 'monospace' }}>Count: {counter}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                <button onClick={requestUniqueId} style={{ ...btnStyle, background: healthy ? '#00d4aa12' : '#ef444412', color: healthy ? '#00d4aa' : '#ef4444' }}>
                    {loading ? "Fetch ID..." : "📥 Request ID"}
                </button>
                <button onClick={() => { setCounter(1001); setLogs(["Server reset."]); }} style={btnStyle}>Reset DB</button>
            </div>

            {/* logs */}
            <div style={{ background: '#071018', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Active Logs</div>
                <div style={{ minHeight: 80, display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'monospace', fontSize: 11.5 }}>
                    {logs.map((log, idx) => (
                        <div key={idx} style={{ padding: '4px 8px', background: log.includes('❌') ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.01)', borderRadius: 6, borderLeft: log.includes('❌') ? '3px solid #ef4444' : '3px solid #00d4aa' }}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   23. TwitterSnowflakeLab (Section 6, 7, 8: 64-bit Layout, Bit Shifts, Sequence)
   ========================================================================= */
function TwitterSnowflakeLab({ mode = 'layout' }) {
    const [activeTab, setActiveTab] = useState(mode === 'timestamp' ? 1 : mode === 'sequence' ? 2 : 0);
    const [datacenter, setDatacenter] = useState(5);
    const [machine, setMachine] = useState(12);
    const [sequence, setSequence] = useState(0);
    const [customEpoch] = useState(1577836800000); 
    const [liveTime, setLiveTime] = useState(() => Date.now() - customEpoch);
    const [shiftAnimation, setShiftAnimation] = useState(false);
    const [burstCount, setBurstCount] = useState(0);
    const [overflowWarning, setOverflowWarning] = useState(false);

    const generatedId = (BigInt(liveTime) << 22n) | (BigInt(datacenter) << 17n) | (BigInt(machine) << 12n) | BigInt(sequence);

    const triggerGenerate = () => {
        setLiveTime(Date.now() - customEpoch);
        setSequence(s => (s + 1) % 4096);
    };

    const triggerBurst = () => {
        if (burstCount >= 8) {
            setOverflowWarning(true);
            setTimeout(() => setOverflowWarning(false), 2000);
            return;
        }
        setBurstCount(prev => prev + 1);
        setSequence(prev => Math.min(4095, prev + 600));
    };

    useEffect(() => {
        if (burstCount > 0) {
            const timer = setTimeout(() => {
                setBurstCount(0);
                setSequence(0);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [burstCount]);

    const segments = [
        { label: 'Unused Sign Bit', bits: 1, color: '#64748b' },
        { label: 'Timestamp (Custom Epoch)', bits: 41, color: '#3b82f6' },
        { label: 'Datacenter ID', bits: 5, color: '#10b981' },
        { label: 'Machine ID', bits: 5, color: '#8b5cf6' },
        { label: 'Sequence Counter', bits: 12, color: '#f59e0b' }
    ];

    return (
        <div style={containerStyle}>
            <VizHeader title="Snowflake 64-Bit Interactive Laboratory" eyebrow="Approach 4: Twitter Snowflake Architecture" />

            <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border)', padding: 4, borderRadius: 12, marginBottom: 18 }}>
                {["64-Bit Structure", "Bit Shifting Demonstrator", "Sequence Limit"].map((tab, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setActiveTab(idx)}
                        style={{
                            ...btnStyle,
                            background: activeTab === idx ? 'rgba(0, 212, 170, 0.1)' : 'transparent',
                            color: activeTab === idx ? '#00d4aa' : 'var(--text-muted)',
                            border: 'none',
                            flexGrow: 1,
                            justifyContent: 'center',
                            fontSize: 11.5
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ background: 'rgba(15,23,42,0.3)', border: '1px solid var(--border)', padding: 14, borderRadius: 14, marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Layout (Total: 64 bits)</div>
                <BitBar segments={segments} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-around', fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>
                    <span>⬜ Sign Bit (1b)</span>
                    <span style={{ color: '#3b82f6' }}>🟦 Timestamp (41b)</span>
                    <span style={{ color: '#10b981' }}>🟩 Datacenter (5b)</span>
                    <span style={{ color: '#8b5cf6' }}>🟪 Machine (5b)</span>
                    <span style={{ color: '#f59e0b' }}>🟧 Sequence (12b)</span>
                </div>
            </div>

            {activeTab === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                        <MetricTile label="Unique ID (Dec)" value={generatedId.toString().slice(0, 16)} color="#00d4aa" />
                        <MetricTile label="DC Block (5 bits)" value={datacenter} color="#10b981" />
                        <MetricTile label="Machine Block (5 bits)" value={machine} color="#8b5cf6" />
                        <MetricTile label="Sequence Block (12 bits)" value={sequence} color="#f59e0b" />
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button onClick={triggerGenerate} style={{ ...btnStyle, background: '#00d4aa12', color: '#00d4aa' }}>Generate Snowflake ID</button>
                        <button onClick={() => setDatacenter(d => (d + 1) % 32)} style={btnStyle}>Change DC ({datacenter})</button>
                        <button onClick={() => setMachine(m => (m + 1) % 32)} style={btnStyle}>Change Machine ({machine})</button>
                    </div>
                </div>
            )}

            {activeTab === 1 && (
                <div>
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: 13.5 }}>Epoch Offsetting & Bitwise Shifts</h4>
                        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            Subtracting a custom epoch from current time compresses milliseconds, allowing 41 bits to span over 69 years instead of exhausting integer bounds.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#071018', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'monospace' }}>
                            <span>1. Raw Unix Epoch:</span>
                            <span style={{ color: '#3b82f6' }}>{Date.now()} ms</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'monospace' }}>
                            <span>2. Custom Epoch (2020-01-01):</span>
                            <span style={{ color: '#10b981' }}>-{customEpoch} ms</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'monospace', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                            <span>3. Delta Time:</span>
                            <span style={{ color: '#00d4aa', fontWeight: '800' }}>{liveTime} ms</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Segment Left-Shift (time &lt;&lt; 22)</div>
                            <div style={{ display: 'flex', background: '#020617', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', height: 20, position: 'relative' }}>
                                <div style={{
                                    width: '60%',
                                    background: '#3b82f6',
                                    color: '#000000',
                                    fontWeight: '900',
                                    fontSize: 8.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    height: '100%',
                                    left: shiftAnimation ? '0%' : '35%',
                                    transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
                                }}>
                                    41 Bits Delta Time
                                </div>
                                <div style={{
                                    width: '35%',
                                    background: 'rgba(255,255,255,0.02)',
                                    color: 'var(--text-muted)',
                                    fontSize: 8.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    height: '100%',
                                    right: 0,
                                    borderLeft: '1px dashed var(--border)'
                                }}>
                                    22 bits cleared
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShiftAnimation(!shiftAnimation)} style={{ ...btnStyle, marginTop: 12, background: '#3b82f612', color: '#3b82f6', fontSize: 11.5 }}>
                        🔄 {shiftAnimation ? "Reset" : "Shift Timestamp 22 Bits Left"}
                    </button>
                </div>
            )}

            {activeTab === 2 && (
                <div>
                    {overflowWarning && (
                        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b', borderRadius: 10, padding: 10, color: '#f59e0b', fontSize: 11.5, fontWeight: '800', marginBottom: 12 }}>
                            ⚠️ Sequence Overflow! 12 bits exceeded (4095/ms). Generator automatically sleeps until next millisecond.
                        </div>
                    )}
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: 13.5 }}>Millisecond Sequence Restarter</h4>
                        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            Every single millisecond, the 12-bit sequence counter restarts at `0`. Max sequence capacity is $4095/ms$. If hit, Snowflake sleeps/pauses requests until the next millisecond.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 14 }}>
                        <MetricTile label="Millisecond Clock" value={`${liveTime} ms`} color="#3b82f6" />
                        <MetricTile label="Active Sequence" value={sequence} color="#f59e0b" />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={triggerBurst} style={{ ...btnStyle, background: '#f59e0b12', color: '#f59e0b', fontSize: 11.5 }}>⚡ Send Burst Requests</button>
                        <button onClick={() => { setSequence(0); setBurstCount(0); }} style={{ ...btnStyle, fontSize: 11.5 }}>Reset</button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =========================================================================
   24. ClockSyncComparisonWidget (Section 10: Clock Synchronization)
   ========================================================================= */
function ClockSyncComparisonWidget() {
    const [isDrifted, setIsDrifted] = useState(false);
    const [logs, setLogs] = useState(["Clocks fully synchronized using local NTP daemon."]);
    const [genState, setGenState] = useState('idle');

    const triggerGenerate = () => {
        if (isDrifted) {
            setGenState('blocked');
            setLogs(prev => ["❌ Exception: Clock drift detected! Request rejected to prevent duplicate ID collision.", ...prev]);
        } else {
            setGenState('success');
            setLogs(prev => [`✅ ID generated successfully at time: ${Date.now()}`, ...prev]);
            setTimeout(() => setGenState('idle'), 600);
        }
    };

    return (
        <div style={containerStyle}>
            <VizHeader title="Snowflake Machine Clock Drift Checker" eyebrow="Clock Synchronization & Safety Boundaries" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 20 }}>
                
                {/* Server 1 */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 900, textTransform: 'uppercase' }}>Snowflake Machine A (NTP Sync)</div>
                    <div style={{ fontSize: 24, margin: '6px 0' }}>💻⏰</div>
                    <div style={{ fontSize: 14, fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-light)' }}>Time: synchronized</div>
                </div>

                {/* Server 2 */}
                <div style={{ 
                    background: isDrifted ? 'rgba(239,68,68,0.03)' : 'rgba(255,255,255,0.01)', 
                    border: isDrifted ? '1px solid #ef4444' : '1px solid var(--border)', 
                    borderRadius: 14, 
                    padding: 14, 
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: 10, color: isDrifted ? '#ef4444' : 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase' }}>Snowflake Machine B (NTP Sync)</div>
                    <div style={{ fontSize: 24, margin: '6px 0' }}>💻⏰</div>
                    <div style={{ fontSize: 14, fontWeight: '800', fontFamily: 'monospace', color: isDrifted ? '#ef4444' : 'var(--text-light)' }}>
                        {isDrifted ? "Time: -15ms DRIFT" : "Time: synchronized"}
                    </div>
                </div>

            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, marginBottom: 18, alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Simulate system clock drifting backward:</span>
                <button 
                    onClick={() => { setIsDrifted(!isDrifted); setLogs(prev => [!isDrifted ? "⚠️ Machine B NTP clock drifted 15ms backward!" : "🟢 Machine B resynchronized with NTP.", ...prev]); }}
                    style={{
                        ...btnStyle,
                        background: isDrifted ? 'rgba(239,68,68,0.1)' : 'rgba(0,212,170,0.1)',
                        color: isDrifted ? '#ef4444' : '#00d4aa',
                        borderColor: isDrifted ? '#ef4444' : '#00d4aa',
                        fontSize: 11.5
                    }}
                >
                    {isDrifted ? "Drift Clock Backward" : "Clocks Synchronized"}
                </button>
            </div>

            <button 
                onClick={triggerGenerate} 
                style={{ 
                    ...btnStyle, 
                    background: genState === 'blocked' ? '#ef444412' : genState === 'success' ? '#00d4aa12' : '#3b82f612',
                    color: genState === 'blocked' ? '#ef4444' : genState === 'success' ? '#00d4aa' : '#3b82f6',
                    marginBottom: 18,
                    fontSize: 11.5
                }}
            >
                Generate ID from Machine B
            </button>

            {/* audit console */}
            <div style={{ background: '#071018', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Security Audit Console</div>
                <div style={{ minHeight: 90, display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'monospace', fontSize: 11.5 }}>
                    {logs.map((log, idx) => (
                        <div key={idx} style={{ padding: '4px 10px', background: log.includes('❌') ? 'rgba(239,68,68,0.05)' : log.includes('⚠️') ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.01)', borderRadius: 6, borderLeft: log.includes('❌') ? '3px solid #ef4444' : log.includes('⚠️') ? '3px solid #f59e0b' : '3px solid #00d4aa' }}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   25. SnowflakeBitTuningWidget (Section 10: Section Tuning)
   ========================================================================= */
function SnowflakeBitTuningWidget() {
    const [bits, setBits] = useState({ ts: 41, dc: 5, machine: 5, seq: 12 });

    const setPreset = (preset) => setBits(preset);

    const setField = (field, value) => {
        const next = { ...bits, [field]: value };
        const totalAllocated = next.ts + next.dc + next.machine;
        const remaining = 63 - totalAllocated;

        if (remaining >= 8 && remaining <= 18) {
            next.seq = remaining;
            setBits(next);
        } else {
            const forcedSeq = Math.max(8, Math.min(18, next.seq));
            const newTs = 63 - (forcedSeq + next.dc + next.machine);
            setBits({ ts: newTs, dc: next.dc, machine: next.machine, seq: forcedSeq });
        }
    };

    const yearsOfLifespan = Math.round((2 ** bits.ts) / (1000 * 60 * 60 * 24 * 365));
    const idsPerMs = 2 ** bits.seq;
    const datacentersMax = 2 ** bits.dc;
    const machinesMax = 2 ** bits.machine;

    return (
        <div style={containerStyle}>
            <VizHeader title="Bit Allocation Customizer Simulator" eyebrow="Advanced Section Tuning & Configurations" />

            <div style={{ background: 'rgba(15,23,42,0.3)', border: '1px solid var(--border)', padding: 14, borderRadius: 14, marginBottom: 18 }}>
                <BitBar segments={[
                    { label: 'Sign', bits: 1, color: '#64748b' },
                    { label: 'Timestamp', bits: bits.ts, color: '#3b82f6' },
                    { label: 'Datacenter ID', bits: bits.dc || 1, color: '#10b981' },
                    { label: 'Machine ID', bits: bits.machine, color: '#8b5cf6' },
                    { label: 'Sequence ID', bits: bits.seq, color: '#f59e0b' }
                ]} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
                    <span>⬜ Sign (1b)</span>
                    <span style={{ color: '#3b82f6' }}>🟦 Time ({bits.ts}b)</span>
                    <span style={{ color: '#10b981' }}>🟩 DC ({bits.dc}b)</span>
                    <span style={{ color: '#8b5cf6' }}>🟪 Worker ({bits.machine}b)</span>
                    <span style={{ color: '#f59e0b' }}>🟧 Seq ({bits.seq}b)</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 18 }}>
                {[
                    { key: 'ts', label: 'Timestamp Bits', min: 38, max: 45 },
                    { key: 'dc', label: 'Datacenter Bits', min: 0, max: 8 },
                    { key: 'machine', label: 'Machine Bits', min: 3, max: 10 }
                ].map(slider => (
                    <div key={slider.key} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 10, borderRadius: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: '800', marginBottom: 4 }}>
                            <span>{slider.label}</span>
                            <span style={{ color: '#00d4aa' }}>{bits[slider.key]}b</span>
                        </div>
                        <input 
                            type="range" 
                            min={slider.min} 
                            max={slider.max} 
                            value={bits[slider.key]} 
                            onChange={e => setField(slider.key, Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#00d4aa' }} 
                        />
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 18 }}>
                <MetricTile label="System Lifespan" value={`${yearsOfLifespan} Yrs`} color="#3b82f6" />
                <MetricTile label="IDs/ms/Node" value={idsPerMs.toLocaleString()} color="#f59e0b" />
                <MetricTile label="Max DCs" value={datacentersMax} color="#10b981" />
                <MetricTile label="Max Workers/DC" value={machinesMax} color="#8b5cf6" />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <button onClick={() => setPreset({ ts: 41, dc: 5, machine: 5, seq: 12 })} style={{ ...btnStyle, fontSize: 11 }}>Twitter Default</button>
                <button onClick={() => setPreset({ ts: 42, dc: 4, machine: 6, seq: 11 })} style={{ ...btnStyle, fontSize: 11 }}>Discord Custom</button>
                <button onClick={() => setPreset({ ts: 39, dc: 5, machine: 5, seq: 14 })} style={{ ...btnStyle, fontSize: 11 }}>High Concurrency</button>
                <button onClick={() => setPreset({ ts: 41, dc: 0, machine: 10, seq: 12 })} style={{ ...btnStyle, fontSize: 11 }}>Single DC Worker</button>
            </div>
        </div>
    );
}

/* =========================================================================
   26. HaLoadBalancerWidget (Section 10: High Availability & Load Balancer)
   ========================================================================= */
function HaLoadBalancerWidget() {
    const [genAOnline, setGenAOnline] = useState(true);
    const [logs, setLogs] = useState(["Gateway router online. Snowflake A and B ready."]);
    const [seq, setSeq] = useState(0);

    const fireRequest = () => {
        const timeNow = Date.now();
        setSeq(s => s + 1);

        if (genAOnline) {
            setLogs(prev => [
                `📥 Gateway routed to Snowflake-A -> Generated ID: ${(BigInt(timeNow) << 22n) | (1n << 12n) | BigInt(seq % 1000)} (Machine 1)`,
                ...prev
            ].slice(0, 4));
        } else {
            setLogs(prev => [
                `📥 Snowflake-A crashed! Rerouted to Snowflake-B -> Generated ID: ${(BigInt(timeNow) << 22n) | (2n << 12n) | BigInt(seq % 1000)} (Machine 2)`,
                ...prev
            ].slice(0, 4));
        }
    };

    return (
        <div style={containerStyle}>
            <VizHeader title="Distributed Failover Load Balancer Laboratory" eyebrow="High Availability & Fault Resilience" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 18 }}>
                
                {/* Control */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 12, borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12.5, fontWeight: '800' }}>Snowflake-A State:</span>
                        <button 
                            onClick={() => { setGenAOnline(!genAOnline); setLogs(prev => [!genAOnline ? "🟢 Snowflake-A online." : "💥 Snowflake-A failed! Gateway rerouter triggered.", ...prev]); }}
                            style={{
                                ...btnStyle,
                                background: genAOnline ? 'rgba(0,212,170,0.1)' : 'rgba(239,68,68,0.1)',
                                color: genAOnline ? '#00d4aa' : '#ef4444',
                                borderColor: genAOnline ? '#00d4aa' : '#ef4444',
                                fontSize: 11
                            }}
                        >
                            {genAOnline ? "🟢 ONLINE" : "💥 CRASHED"}
                        </button>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        Because independent generators use distinct worker Machine IDs (1 vs 2), failover requires zero consensus synchronization. Resilient horizontal scale!
                    </div>
                </div>

                {/* Graphical */}
                <div style={{ background: 'rgba(15,23,42,0.3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: 9.5, color: '#00d4aa', fontWeight: '800', marginBottom: 8 }}>API GATEWAY LOAD BALANCER</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
                        <div style={{
                            background: genAOnline ? 'rgba(0,212,170,0.04)' : 'rgba(239,68,68,0.08)',
                            border: genAOnline ? '1px solid #00d4aa' : '1.5px dashed #ef4444',
                            borderRadius: 8,
                            padding: 8,
                            textAlign: 'center',
                            width: 80
                        }}>
                            <div style={{ fontSize: 9, color: genAOnline ? '#00d4aa' : '#ef4444', fontWeight: '950' }}>SNOWFLAKE-A</div>
                            <div style={{ fontSize: 14 }}>💻</div>
                            <div style={{ fontSize: 8.5, color: 'var(--text-muted)', marginTop: 2 }}>Machine 1</div>
                        </div>

                        <div style={{ fontSize: 12, animation: 'spin 6s linear infinite' }}>🔀</div>

                        <div style={{
                            background: 'rgba(59,130,246,0.04)',
                            border: '1px solid #3b82f6',
                            borderRadius: 8,
                            padding: 8,
                            textAlign: 'center',
                            width: 80
                        }}>
                            <div style={{ fontSize: 9, color: '#3b82f6', fontWeight: '950' }}>SNOWFLAKE-B</div>
                            <div style={{ fontSize: 14 }}>💻</div>
                            <div style={{ fontSize: 8.5, color: 'var(--text-muted)', marginTop: 2 }}>Machine 2</div>
                        </div>
                    </div>
                </div>

            </div>

            <button onClick={fireRequest} style={{ ...btnStyle, background: '#00d4aa12', color: '#00d4aa', marginBottom: 18, fontSize: 11.5 }}>
                ⚡ Send Request Stream
            </button>

            {/* Console */}
            <div style={{ background: '#071018', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Gateway Output</div>
                <div style={{ minHeight: 90, display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'monospace', fontSize: 11.5 }}>
                    {logs.map((log, idx) => (
                        <div key={idx} style={{ padding: '4px 10px', background: log.includes('failed') ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.01)', borderRadius: 6, borderLeft: log.includes('failed') ? '3px solid #f59e0b' : '3px solid #00d4aa' }}>
                            {log}
                        </div>
                    ))}
                </div>
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
   2b. WebDataSeparationWidget (Before/After separation of Web & Database tiers)
   ========================================================================= */
function WebDataSeparationWidget() {
    const [mode, setMode] = useState('before'); // 'before' or 'after'
    const [traffic, setTraffic] = useState(10); // req/s
    const [simulating, setSimulating] = useState(false);
    const [packetState, setPacketState] = useState('idle'); // 'idle', 'sending', 'done'

    // Resource calculations
    const beforeCpu = Math.min(100, Math.round(30 + traffic * 0.7));
    const beforeRam = Math.min(100, Math.round(45 + traffic * 0.5));
    const beforeDisk = Math.min(100, Math.round(20 + traffic * 0.8));
    const collision = beforeCpu > 80 || beforeRam > 80 || beforeDisk > 80;

    const afterWebCpu = Math.min(100, Math.round(15 + traffic * 0.3));
    const afterDbCpu = Math.min(100, Math.round(10 + traffic * 0.4));

    const triggerRequest = () => {
        if (mode !== 'after' || simulating) return;
        setSimulating(true);
        setPacketState('sending');
        setTimeout(() => {
            setPacketState('done');
            setTimeout(() => {
                setPacketState('idle');
                setSimulating(false);
            }, 1000);
        }, 1500);
    };

    return (
        <div style={containerStyle}>
            <style>{`
                @keyframes pulse-warning {
                    0%, 100% { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); }
                    50% { border-color: #ef4444; box-shadow: 0 0 25px rgba(239, 68, 68, 0.6); }
                }
                @keyframes flow-packet {
                    0% { stroke-dashoffset: 100; opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 0.8; }
                }
            `}</style>
            
            <div style={titleStyle}>🌐 Web and Data Tier Separation Lab</div>

            {/* Subtitle / Explanation */}
            <p style={{ fontSize: 13.5, color: 'var(--text-gray)', lineHeight: 1.5, marginBottom: 18 }}>
                Initially, everything sits on a single server. As traffic rises, database queries and web request handling fight for the exact same CPU, RAM, and Disk resources, leading to server lockups. Separation isolates these workloads.
            </p>

            {/* Slider to scale traffic */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontSize: 13.5, fontWeight: 700, marginBottom: 8 }}>
                    <span>Simulated Global Traffic:</span>
                    <span style={{ color: collision && mode === 'before' ? '#ef4444' : '#00d4aa', fontWeight: 800 }}>
                        {traffic} req/second
                    </span>
                </div>
                <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={traffic} 
                    onChange={(e) => setTraffic(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: collision && mode === 'before' ? '#ef4444' : '#00d4aa', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>Low Traffic (10 req/s)</span>
                    <span>Medium Traffic</span>
                    <span>High Traffic (100 req/s)</span>
                </div>
            </div>

            {/* Tabs for Before/After */}
            <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
                <button 
                    style={{ 
                        ...tabStyle, 
                        background: mode === 'before' ? 'rgba(239, 68, 68, 0.12)' : 'transparent', 
                        color: mode === 'before' ? '#ef4444' : 'var(--text-muted)' 
                    }} 
                    onClick={() => setMode('before')}
                >
                    Before: Single Server (All-in-One)
                </button>
                <button 
                    style={{ 
                        ...tabStyle, 
                        background: mode === 'after' ? 'rgba(0, 212, 170, 0.12)' : 'transparent', 
                        color: mode === 'after' ? '#00d4aa' : 'var(--text-muted)' 
                    }} 
                    onClick={() => setMode('after')}
                >
                    After: Separated Tiers (Isolated Tiers)
                </button>
            </div>

            {/* Architecture diagram container */}
            {mode === 'before' ? (
                <div style={{
                    padding: 24,
                    borderRadius: 20,
                    border: `2px solid ${collision ? '#ef4444' : 'var(--border)'}`,
                    background: collision ? 'rgba(239, 68, 68, 0.03)' : 'var(--bg-surface)',
                    animation: collision ? 'pulse-warning 2s infinite' : 'none',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: collision ? '#ef4444' : 'var(--text-light)', marginBottom: 12 }}>
                        🖥️ Single Server VM (10.0.0.1)
                    </div>
                    {collision && (
                        <div style={{ background: '#ef444415', border: '1px solid #ef444433', borderRadius: 8, padding: 8, fontSize: 12, color: '#ef4444', fontWeight: 700, marginBottom: 16 }}>
                            ⚠️ RESOURCE CRITICAL COLLISION! DB queries blocking CPU and Disk I/O.
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '20px 0' }}>
                        <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: 20 }}>🌐</span>
                            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>Web Server</div>
                            <div style={{ fontSize: 11, color: beforeCpu > 80 ? '#ef4444' : 'var(--text-gray)', fontWeight: 800 }}>CPU: {beforeCpu}%</div>
                        </div>
                        <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: 20 }}>💾</span>
                            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>Local Cache</div>
                            <div style={{ fontSize: 11, color: beforeRam > 80 ? '#ef4444' : 'var(--text-gray)', fontWeight: 800 }}>RAM: {beforeRam}%</div>
                        </div>
                        <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: 20 }}>🗄️</span>
                            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>Database</div>
                            <div style={{ fontSize: 11, color: beforeDisk > 80 ? '#ef4444' : 'var(--text-gray)', fontWeight: 800 }}>Disk I/O: {beforeDisk}%</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: 220, position: 'relative', border: '1px solid var(--border)', borderRadius: 20, background: 'var(--bg-elevated)', padding: 20 }}>
                        
                        {/* Web Tier Server Box */}
                        <div style={{
                            width: 130,
                            padding: 16,
                            borderRadius: 16,
                            border: '2px solid #00d4aa',
                            background: 'var(--bg-surface)',
                            textAlign: 'center',
                            boxShadow: '0 0 15px rgba(0, 212, 170, 0.15)'
                        }}>
                            <span style={{ fontSize: 28 }}>🖥️</span>
                            <div style={{ fontSize: 13, fontWeight: 800, marginTop: 6, color: '#00d4aa' }}>Web Server</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0' }}>10.0.0.5</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-light)' }}>CPU: {afterWebCpu}%</div>
                        </div>

                        {/* Interactive Connection arrow with SVGs */}
                        <div style={{ flex: 1, position: 'relative', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="100%" height="80" style={{ pointerEvents: 'none' }}>
                                <line 
                                    x1="5%" y1="50%" x2="95%" y2="50%" 
                                    stroke="var(--border)" 
                                    strokeWidth="4" 
                                />
                                {packetState === 'sending' && (
                                    <line 
                                        x1="5%" y1="50%" x2="95%" y2="50%" 
                                        stroke="#00d4aa" 
                                        strokeWidth="4" 
                                        strokeDasharray="20 10" 
                                        style={{ animation: 'flow-packet 1.5s linear infinite' }} 
                                    />
                                )}
                            </svg>
                            {packetState === 'sending' && (
                                <div style={{ position: 'absolute', background: '#00d4aa', color: '#000', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 20, top: 12 }}>
                                    ⚡ Querying DB
                                </div>
                            )}
                            {packetState === 'done' && (
                                <div style={{ position: 'absolute', background: '#a78bfa', color: '#000', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 20, top: 12 }}>
                                    ✓ Data Returned
                                </div>
                            )}
                        </div>

                        {/* Database Tier Server Box */}
                        <div style={{
                            width: 130,
                            padding: 16,
                            borderRadius: 16,
                            border: '2px solid #a78bfa',
                            background: 'var(--bg-surface)',
                            textAlign: 'center',
                            boxShadow: '0 0 15px rgba(167, 139, 250, 0.15)'
                        }}>
                            <span style={{ fontSize: 28 }}>🗄️</span>
                            <div style={{ fontSize: 13, fontWeight: 800, marginTop: 6, color: '#a78bfa' }}>DB Server</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0' }}>10.0.0.10</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-light)' }}>Disk I/O: {afterDbCpu}%</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <button 
                            style={{ 
                                ...btnStyle, 
                                background: simulating ? 'transparent' : 'rgba(0, 212, 170, 0.12)', 
                                color: '#00d4aa',
                                borderColor: '#00d4aa'
                            }} 
                            onClick={triggerRequest}
                            disabled={simulating}
                        >
                            {simulating ? 'Processing isolated requests...' : 'Simulate Private Network DB Queries 🚀'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


/* =========================================================================
   2c. VerticalHorizontalScalingWidget (Scale Up vs Scale Out Animated Lab)
   ========================================================================= */
function VerticalHorizontalScalingWidget() {
    const [vertSize, setVertSize] = useState(2); // cores: 2, 8, 32, 128
    const [horizServers, setHorizServers] = useState(1); // 1, 2, 3, 4
    const [crashedNode, setCrashedNode] = useState(null); // horizontal node index
    const [vertCrashed, setVertCrashed] = useState(false);

    // Costs
    const vertCost = Math.round(vertSize === 2 ? 10 : vertSize === 8 ? 80 : vertSize === 32 ? 640 : 8192);
    const horizCost = Math.round(horizServers * 20);

    const triggerVertCrash = () => {
        setVertCrashed(true);
        setTimeout(() => setVertCrashed(false), 4000);
    };

    const toggleHorizCrash = (index) => {
        if (crashedNode === index) {
            setCrashedNode(null);
        } else {
            setCrashedNode(index);
        }
    };

    return (
        <div style={containerStyle}>
            <style>{`
                @keyframes hardware-ceiling {
                    0%, 100% { border-color: rgba(239, 68, 68, 0.4); }
                    50% { border-color: #ef4444; }
                }
                @keyframes traffic-pulse {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
            `}</style>
            
            <div style={titleStyle}>⚖️ Vertical vs Horizontal Scaling Sandbox</div>

            <p style={{ fontSize: 13.5, color: 'var(--text-gray)', lineHeight: 1.5, marginBottom: 20 }}>
                <strong>Vertical (Scale Up)</strong> buys a bigger machine. It is simple but has hard physical ceilings and no redundancy (SPOF). <strong>Horizontal (Scale Out)</strong> adds more machines, allowing infinite scaling and built-in failover capabilities.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                
                {/* Left Panel - Vertical Scaling */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 18, background: 'rgba(255,255,255,0.01)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 13.5, fontWeight: 900, color: '#f59e0b', marginBottom: 4 }}>📈 VERTICAL SCALING (Scale Up)</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>Upgrade a Single Server Box</div>

                        {/* VM Scale Visual */}
                        <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 12, background: '#00000020', overflow: 'hidden' }}>
                            {/* Ceiling line */}
                            <div style={{ position: 'absolute', top: 20, left: 0, width: '100%', borderTop: '2px dashed #ef4444', opacity: 0.7, zIndex: 3 }}>
                                <span style={{ position: 'absolute', right: 10, top: -14, color: '#ef4444', fontSize: 9, fontWeight: 900 }}>HARD HARDWARE CEILING</span>
                            </div>

                            {vertCrashed ? (
                                <div style={{ zIndex: 4, background: 'rgba(0,0,0,0.85)', position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ef4444', padding: 12 }}>
                                    <span style={{ fontSize: 32 }}>🛑</span>
                                    <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>SYSTEM DEAD (SPOF CRASH)</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>Single server failed. Complete application downtime.</div>
                                </div>
                            ) : (
                                <div style={{
                                    width: vertSize === 2 ? 80 : vertSize === 8 ? 100 : vertSize === 32 ? 120 : 135,
                                    height: vertSize === 2 ? 80 : vertSize === 8 ? 100 : vertSize === 32 ? 120 : 135,
                                    border: `2px solid ${vertSize === 128 ? '#ef4444' : '#f59e0b'}`,
                                    borderRadius: 16,
                                    background: vertSize === 128 ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: vertSize === 128 ? '0 0 25px rgba(239,68,68,0.4)' : '0 0 15px rgba(245,158,11,0.2)'
                                }}>
                                    <span style={{ fontSize: vertSize === 2 ? 24 : vertSize === 8 ? 32 : vertSize === 32 ? 40 : 48 }}>🖥️</span>
                                    <div style={{ fontSize: 11.5, fontWeight: 900, marginTop: 2, color: 'var(--text-light)' }}>{vertSize} Cores</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{vertSize === 128 ? '1028GB RAM' : `${vertSize * 4}GB RAM`}</div>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div style={{ marginTop: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-light)', fontWeight: 700, marginBottom: 6 }}>
                                <span>Upgrade CPU/RAM Tier:</span>
                                <span style={{ color: '#f59e0b' }}>${vertCost}/month</span>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {[2, 8, 32, 128].map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => { setVertSize(size); setVertCrashed(false); }}
                                        style={{
                                            flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11.5, border: '1px solid var(--border)',
                                            background: vertSize === size ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-elevated)',
                                            color: vertSize === size ? '#f59e0b' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 800, transition: 'all 0.15s'
                                        }}
                                    >
                                        {size === 128 ? 'Max Up' : `${size}C`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 14 }}>
                        <button 
                            style={{ ...btnStyle, background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', borderColor: '#ef444425', width: '100%', marginTop: 8 }}
                            onClick={triggerVertCrash}
                        >
                            💥 Trigger VM SPOF Crash
                        </button>
                    </div>
                </div>

                {/* Right Panel - Horizontal Scaling */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 18, background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 13.5, fontWeight: 900, color: '#00d4aa', marginBottom: 4 }}>📈 HORIZONTAL SCALING (Scale Out)</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>Scale Out commodity node pool</div>

                        {/* Node Pool Scale Visual */}
                        <div style={{ height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 12, background: '#00000020', padding: 8 }}>
                            {/* Load Balancer */}
                            <div style={{ alignSelf: 'center', background: 'rgba(0, 212, 170, 0.12)', border: '1px solid #00d4aa', borderRadius: 8, padding: '4px 12px', fontSize: 10.5, fontWeight: 800, color: '#00d4aa', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ animation: 'traffic-pulse 1.5s infinite' }}>⚖️</span> Load Balancer Gateway
                            </div>

                            {/* Node Array Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${horizServers}, 1fr)`, gap: 8 }}>
                                {Array.from({ length: horizServers }).map((_, idx) => {
                                    const isDead = crashedNode === idx;
                                    return (
                                        <div 
                                            key={idx}
                                            onClick={() => toggleHorizCrash(idx)}
                                            style={{
                                                height: 70, border: `1.5px solid ${isDead ? '#ef4444' : '#00d4aa'}`, borderRadius: 10,
                                                background: isDead ? 'rgba(239,68,68,0.06)' : 'var(--bg-surface)',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', transition: 'all 0.25s', position: 'relative'
                                            }}
                                        >
                                            {isDead ? (
                                                <div style={{ fontSize: 10, fontWeight: 900, color: '#ef4444', textAlign: 'center' }}>
                                                    ❌ DEAD
                                                </div>
                                            ) : (
                                                <>
                                                    <span style={{ fontSize: 18 }}>🖥️</span>
                                                    <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-light)' }}>Node {idx + 1}</div>
                                                    <div style={{ fontSize: 8.5, color: 'var(--text-muted)' }}>2C/4GB</div>
                                                </>
                                            )}
                                            <span style={{ position: 'absolute', top: 2, right: 4, fontSize: 7, color: 'var(--text-muted)' }}>Tap</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Controls */}
                        <div style={{ marginTop: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-light)', fontWeight: 700, marginBottom: 6 }}>
                                <span>Scale Nodes Pool:</span>
                                <span style={{ color: '#00d4aa' }}>${horizCost}/month</span>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {[1, 2, 3, 4].map(nodes => (
                                    <button 
                                        key={nodes}
                                        onClick={() => { setHorizServers(nodes); setCrashedNode(null); }}
                                        style={{
                                            flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11.5, border: '1px solid var(--border)',
                                            background: horizServers === nodes ? 'rgba(0, 212, 170, 0.15)' : 'var(--bg-elevated)',
                                            color: horizServers === nodes ? '#00d4aa' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 800, transition: 'all 0.15s'
                                        }}
                                    >
                                        {nodes} Node{nodes > 1 ? 's' : ''}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 14 }}>
                        <div style={{ background: horizServers > 1 && crashedNode !== null ? 'rgba(0, 212, 170, 0.08)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, fontSize: 11, textAlign: 'center', color: horizServers > 1 && crashedNode !== null ? '#00d4aa' : 'var(--text-gray)' }}>
                            {horizServers > 1 && crashedNode !== null 
                                ? '✓ Graceful Failover: Load balancer routed traffic around crashed node!' 
                                : '💡 Click nodes in the horizontal layout to simulate local hardware faults.'}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


/* =========================================================================
   2d. LoadBalancerWidget (Public IP Gateway and Failover Sandbox)
   ========================================================================= */
function LoadBalancerWidget() {
    const [crashedServers, setCrashedServers] = useState([]); // indices of crashed servers: 0, 1, 2
    const [serverPoolSize, setServerPoolSize] = useState(2); // 2 or 3
    const [logs, setLogs] = useState(["[LB Gateway Initialization]: Active Round Robin listening..."]);
    const [lbCrashed, setLbCrashed] = useState(false);
    const [standbyActive, setStandbyActive] = useState(false);

    const toggleServerCrash = (idx) => {
        if (crashedServers.includes(idx)) {
            setCrashedServers(crashedServers.filter(s => s !== idx));
            setLogs(prev => [`[HEALTH OK]: Server ${idx + 1} recovered! Rerouting traffic back.`, ...prev.slice(0, 7)]);
        } else {
            setCrashedServers([...crashedServers, idx]);
            setLogs(prev => [`[HEALTH DEAD]: Server ${idx + 1} went offline! Evicting node from pool.`, ...prev.slice(0, 7)]);
        }
    };

    const addServer = () => {
        if (serverPoolSize >= 3) return;
        setServerPoolSize(3);
        setLogs(prev => ["[LB CONFIG UPDATED]: Spawned Web Server 3 and auto-balanced round robin weights.", ...prev.slice(0, 7)]);
    };

    const simulateRequest = () => {
        if (lbCrashed && !standbyActive) {
            setLogs(prev => ["🛑 [CLIENT ERROR]: HTTP Connection timeout! Load balancer SPOF crash.", ...prev.slice(0, 7)]);
            return;
        }

        const activeServers = [];
        for (let i = 0; i < serverPoolSize; i++) {
            if (!crashedServers.includes(i)) {
                activeServers.push(i + 1);
            }
        }

        if (activeServers.length === 0) {
            setLogs(prev => ["❌ [503 SERVICE UNAVAILABLE]: All backend servers down! Gateway error.", ...prev.slice(0, 7)]);
            return;
        }

        // Simulating Round Robin distribution
        const target = activeServers[Math.floor(Math.random() * activeServers.length)];
        const lbLabel = standbyActive ? "Standby LB (VIP 1.2.3.4)" : "Primary LB (IP 1.2.3.4)";
        setLogs(prev => [`✓ [SUCCESS 200]: Client Request -> routed via ${lbLabel} -> Web Server ${target}`, ...prev.slice(0, 7)]);
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>⚖️ Public Load Balancer Gateway Lab</div>

            <p style={{ fontSize: 13.5, color: 'var(--text-gray)', lineHeight: 1.5, marginBottom: 18 }}>
                The Load Balancer accepts client queries at a single public IP, distributes them across healthy servers using round robin algorithms, and continuously monitors node health to support instant failover.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 18 }}>
                
                {/* Visualizer Frame */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 16, background: '#00000015', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', position: 'relative' }}>
                    
                    {/* Top line mapping Client */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <div style={{ padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 10, background: 'var(--bg-surface)', textAlign: 'center', fontSize: 12, fontWeight: 700 }}>
                            💻 Client Browsers
                        </div>

                        <div style={{ fontSize: 16 }}>➔</div>

                        {/* LB Nodes */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                            <div 
                                onClick={() => {
                                    setLbCrashed(!lbCrashed);
                                    if (!lbCrashed) setStandbyActive(false);
                                }}
                                style={{
                                    padding: '8px 14px', border: `2px solid ${lbCrashed ? '#ef4444' : '#00d4aa'}`, borderRadius: 10,
                                    background: lbCrashed ? 'rgba(239,68,68,0.05)' : 'rgba(0,212,170,0.05)',
                                    fontSize: 11, fontWeight: 800, cursor: 'pointer', textAlign: 'center', color: lbCrashed ? '#ef4444' : '#00d4aa',
                                    boxShadow: lbCrashed ? 'none' : '0 0 10px rgba(0, 212, 170, 0.15)'
                                }}
                            >
                                {lbCrashed ? '🛑 Primary LB (OFFLINE)' : '⚖️ Primary LB (1.2.3.4)'}
                            </div>
                            {lbCrashed && (
                                <div 
                                    onClick={() => setStandbyActive(!standbyActive)}
                                    style={{
                                        padding: '6px 12px', border: `1.5px solid ${standbyActive ? '#3b82f6' : 'var(--border)'}`, borderRadius: 8,
                                        background: standbyActive ? 'rgba(59,130,246,0.1)' : 'var(--bg-elevated)',
                                        fontSize: 10, fontWeight: 700, cursor: 'pointer', textAlign: 'center', color: standbyActive ? '#3b82f6' : 'var(--text-muted)'
                                    }}
                                >
                                    {standbyActive ? '✓ Standby Active (Keepalived)' : '👉 Activate Standby Backup LB'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', fontSize: 16 }}>⬇</div>

                    {/* Backend Server Array */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
                        {Array.from({ length: serverPoolSize }).map((_, idx) => {
                            const isCrashed = crashedServers.includes(idx);
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => toggleServerCrash(idx)}
                                    style={{
                                        flex: 1, maxWidth: 100, height: 75, border: `2px solid ${isCrashed ? '#ef4444' : '#a78bfa'}`, borderRadius: 12,
                                        background: isCrashed ? 'rgba(239,68,68,0.05)' : 'var(--bg-surface)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
                                    }}
                                >
                                    {isCrashed ? (
                                        <div style={{ fontSize: 9.5, fontWeight: 900, color: '#ef4444', textAlign: 'center' }}>
                                            ⚠️ DEAD (500)
                                        </div>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: 18 }}>🖥️</span>
                                            <div style={{ fontSize: 9.5, fontWeight: 800 }}>Server {idx + 1}</div>
                                            <div style={{ fontSize: 8.5, color: 'var(--text-muted)' }}>10.0.0.{idx + 1}</div>
                                        </>
                                    )}
                                    <span style={{ position: 'absolute', top: 2, right: 3, fontSize: 6.5, color: 'var(--text-muted)' }}>Fault</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Live Console Logs */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 12, background: 'rgba(0,0,0,0.35)', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 10, color: '#00d4aa', fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>📜 Gateway Access Logs</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 160, overflowY: 'auto' }}>
                            {logs.map((log, index) => (
                                <div key={index} style={{ fontSize: 10.5, color: log.startsWith('🛑') || log.startsWith('❌') ? '#ef4444' : log.startsWith('✓') ? '#34d399' : 'var(--text-gray)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 4 }}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4 }}>
                        * Click servers or Primary LB to toggle hardware faults.
                    </div>
                </div>

            </div>

            {/* Buttons for interactive events */}
            <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ ...btnStyle, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', borderColor: '#00d4aa33', flex: 1.5 }} onClick={simulateRequest}>
                    🚀 Dispatch 1 Mock Request
                </button>
                {serverPoolSize < 3 && (
                    <button style={{ ...btnStyle, flex: 1 }} onClick={addServer}>
                        ➕ Provision Server 3
                    </button>
                )}
                <button 
                    style={{ ...btnStyle, flex: 1, borderColor: '#ef444444' }} 
                    onClick={() => {
                        setCrashedServers([]);
                        setLbCrashed(false);
                        setStandbyActive(false);
                        setLogs(["[LB SYSTEM RESET]: Recovered all gateway elements to normal state."]);
                    }}
                >
                    🔄 Reset Sandbox
                </button>
            </div>
        </div>
    );
}


/* =========================================================================
   2e. DbReplicationWidget (Master-Slave Active/Passive Architecture Lab)
   ========================================================================= */
function DbReplicationWidget() {
    const [scenario, setScenario] = useState('normal'); // 'normal', 'slave_down', 'master_down'
    const [masterState, setMasterState] = useState('healthy'); // 'healthy', 'crashed'
    const [slaveStates, setSlaveStates] = useState(['healthy', 'healthy', 'healthy']);
    const [logs, setLogs] = useState(["[REPLICATION SETTING]: Master replica cluster initialized. Replication sync delay: ~1ms"]);

    const handleScenarioChange = (scen) => {
        setScenario(scen);
        if (scen === 'normal') {
            setMasterState('healthy');
            setSlaveStates(['healthy', 'healthy', 'healthy']);
            setLogs(["✓ [NORMAL STATE]: Writes go to Master database, Reads scale across Slaves 1-3."]);
        } else if (scen === 'slave_down') {
            setMasterState('healthy');
            setSlaveStates(['healthy', 'crashed', 'healthy']);
            setLogs(["⚠️ [SLAVE FAILURE DETECTED]: Slave 2 is down. Routing read queries to Slave 1 and Slave 3 only."]);
        } else if (scen === 'master_down') {
            setMasterState('crashed');
            setSlaveStates(['healthy', 'healthy', 'healthy']);
            setLogs(["🛑 [CRITICAL SPOF]: Master Database crashed! Writes are completely blocked. Action required."]);
        }
    };

    const triggerWrite = () => {
        if (masterState === 'crashed') {
            setLogs(prev => ["❌ [500 DATABASE WRITE ERROR]: INSERT blocked! Primary node is offline.", ...prev.slice(0, 5)]);
            return;
        }
        setLogs(prev => [
            "✓ [WRITE RECEIVED]: INSERT user row successfully in Master DB.",
            "🔄 [ASYNC REPLICATOR]: Pulsing replication binlogs to all active Slaves...",
            "✓ [SYNC COMPLETE]: Replica counters in alignment.",
            ...prev.slice(0, 5)
        ]);
    };

    const triggerRead = () => {
        const activeSlaves = [];
        slaveStates.forEach((st, idx) => {
            if (st === 'healthy') activeSlaves.push(idx + 1);
        });

        if (activeSlaves.length === 0) {
            setLogs(prev => ["❌ [503 SELECT QUERY ERROR]: No read replicas online.", ...prev.slice(0, 5)]);
            return;
        }

        const target = activeSlaves[Math.floor(Math.random() * activeSlaves.length)];
        setLogs(prev => [`✓ [READ SUCCESS 200]: Distributed query load -> routed to Slave DB ${target}`, ...prev.slice(0, 5)]);
    };

    const promoteSlave = () => {
        setMasterState('healthy');
        setSlaveStates(['crashed', 'healthy', 'healthy']); // Slave 1 becomes Master, so it is removed from slave pool
        setScenario('normal');
        setLogs(prev => [
            "⚡ [FAILOVER ACTIVATED]: Slave DB 1 promoted to new MASTER Database!",
            "✓ [ROUTING CONFIGURED]: Replication streams updated. Slaves 2 and 3 synced to new primary.",
            "✓ [STATUS GREEN]: Application full Write functionality restored.",
            ...prev.slice(0, 5)
        ]);
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🗄️ Database Replication & Failover Sandbox</div>

            <p style={{ fontSize: 13.5, color: 'var(--text-gray)', lineHeight: 1.5, marginBottom: 20 }}>
                Writing to databases takes heavy I/O compute. By routing **Writes** solely to a Master node and asynchronously copying updates to a pool of **Slave replicas** for **Reads**, we scale reading performance and add solid hardware failovers.
            </p>

            {/* Scenario buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <button 
                    style={{ ...btnStyle, flex: 1, background: scenario === 'normal' && masterState === 'healthy' && slaveStates[0] === 'healthy' ? 'rgba(0,212,170,0.12)' : 'var(--bg-elevated)', color: scenario === 'normal' && masterState === 'healthy' && slaveStates[0] === 'healthy' ? '#00d4aa' : 'var(--text-light)' }} 
                    onClick={() => handleScenarioChange('normal')}
                >
                    Normal Operation
                </button>
                <button 
                    style={{ ...btnStyle, flex: 1, background: scenario === 'slave_down' ? 'rgba(245,158,11,0.12)' : 'var(--bg-elevated)', color: scenario === 'slave_down' ? '#f59e0b' : 'var(--text-light)' }} 
                    onClick={() => handleScenarioChange('slave_down')}
                >
                    Slave Node Down
                </button>
                <button 
                    style={{ ...btnStyle, flex: 1, background: scenario === 'master_down' ? 'rgba(239,68,68,0.12)' : 'var(--bg-elevated)', color: scenario === 'master_down' ? '#ef4444' : 'var(--text-light)' }} 
                    onClick={() => handleScenarioChange('master_down')}
                >
                    Master Node Down (SPOF)
                </button>
            </div>

            {/* Visualizer Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 18 }}>
                
                {/* Visualizer Flow Box */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 16, background: '#00000015', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                    
                    {/* Master DB */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            width: 140, padding: 10, border: `2.5px solid ${masterState === 'crashed' ? '#ef4444' : '#00d4aa'}`, borderRadius: 12,
                            background: masterState === 'crashed' ? 'rgba(239,68,68,0.05)' : 'rgba(0,212,170,0.05)', textAlign: 'center', position: 'relative'
                        }}>
                            <span style={{ fontSize: 24 }}>🗄️</span>
                            <div style={{ fontSize: 11.5, fontWeight: 900, color: masterState === 'crashed' ? '#ef4444' : '#00d4aa' }}>
                                {masterState === 'crashed' ? '❌ MASTER DOWN' : '👑 Master (Writes Only)'}
                            </div>
                            <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 2 }}>Primary DB Server</div>
                        </div>
                    </div>

                    {/* Replication Dashes */}
                    <div style={{ display: 'flex', justifyContent: 'center', height: 40 }}>
                        <svg width="100%" height="40">
                            {masterState === 'healthy' && (
                                <g>
                                    <line x1="50%" y1="0%" x2="20%" y2="100%" stroke="#00d4aa" strokeWidth="2" strokeDasharray="4 4" />
                                    <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#00d4aa" strokeWidth="2" strokeDasharray="4 4" />
                                    <line x1="50%" y1="0%" x2="80%" y2="100%" stroke="#00d4aa" strokeWidth="2" strokeDasharray="4 4" />
                                </g>
                            )}
                        </svg>
                    </div>

                    {/* Slave DB pool */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', gap: 8 }}>
                        {slaveStates.map((st, idx) => {
                            const isCrashed = st === 'crashed';
                            return (
                                <div key={idx} style={{
                                    flex: 1, padding: 8, border: `1.5px solid ${isCrashed ? '#ef4444' : '#a78bfa'}`, borderRadius: 10,
                                    background: isCrashed ? 'rgba(239,68,68,0.05)' : 'var(--bg-surface)', textAlign: 'center'
                                }}>
                                    <span style={{ fontSize: 18 }}>🗄️</span>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: isCrashed ? '#ef4444' : '#a78bfa' }}>
                                        {isCrashed ? '❌ Slave Offline' : `Slave ${idx + 1}`}
                                    </div>
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Reads Only</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Failover Button Prompt inside Master Down scenario */}
                    {scenario === 'master_down' && masterState === 'crashed' && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
                            <span style={{ fontSize: 24 }}>🚨</span>
                            <div style={{ color: '#ef4444', fontWeight: 800, fontSize: 13, textAlign: 'center', marginBottom: 10 }}>CRITICAL MASTER FAILURE OCCURRED!</div>
                            <button 
                                onClick={promoteSlave}
                                style={{ ...btnStyle, background: 'rgba(59,130,246,0.2)', color: '#3b82f6', borderColor: '#3b82f655', fontWeight: 850, padding: '10px 18px' }}
                            >
                                ⚡ PROMOTE SLAVE 1 TO MASTER
                            </button>
                        </div>
                    )}
                </div>

                {/* Console Logs */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 12, background: 'rgba(0,0,0,0.35)', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>📜 Replication Engine logs</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {logs.map((log, index) => (
                                <div key={index} style={{ fontSize: 10.5, color: log.startsWith('🛑') || log.startsWith('❌') ? '#ef4444' : log.startsWith('✓') ? '#34d399' : 'var(--text-gray)', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 4 }}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Read/Write control triggers */}
            <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ ...btnStyle, flex: 1, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', borderColor: '#00d4aa33' }} onClick={triggerWrite}>
                    ✍️ Simulate Write Operation (Insert User Profile)
                </button>
                <button style={{ ...btnStyle, flex: 1, background: 'rgba(167,139,250,0.15)', color: '#a78bfa', borderColor: '#a78bfa33' }} onClick={triggerRead}>
                    📖 Simulate Read Operation (Select user)
                </button>
            </div>
        </div>
    );
}


/* =========================================================================
   2f. LoggingMetricsCdWidget (Observability & CI/CD pipeline Lab)
   ========================================================================= */
function LoggingMetricsCdWidget() {
    const [cpu, setCpu] = useState(24);
    const [cacheHitRate, setCacheHitRate] = useState(82);
    const [logs, setLogs] = useState([
        "2026-05-23T00:58:14Z [INFO] GET /api/v1/feed - 200 OK (8ms)",
        "2026-05-23T00:58:16Z [INFO] Cache hit for key 'feed:feed_items'",
        "2026-05-23T00:58:19Z [INFO] GET /api/v1/profile/jayadeep - 200 OK (4ms)",
        "2026-05-23T00:58:22Z [WARN] Database query latency high on shard-2: 125ms"
    ]);
    const [pipelineState, setPipelineState] = useState('idle'); // 'idle', 'running', 'success', 'failed'
    const [activeStage, setActiveStage] = useState(0); // 0 to 4
    const [errorRate, setErrorRate] = useState(0);

    const pipelineStages = [
        "Commit check",
        "Docker Build",
        "Unit test",
        "E2E Integration",
        "Prod Canary roll"
    ];

    // Observability stats update simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setCpu(c => {
                const variation = Math.floor(Math.random() * 9) - 4;
                return Math.max(10, Math.min(95, c + variation));
            });
            setCacheHitRate(h => {
                const variation = Math.floor(Math.random() * 5) - 2;
                return Math.max(70, Math.min(98, h + variation));
            });
            
            // Add a casual log
            const mockLogs = [
                "GET /api/v1/users/info - 200 OK (3ms)",
                "POST /api/v1/tracker/event - 201 Created",
                "Cache hit for key 'metadata:v2'",
                "Slow query SELECT * FROM algorithms - 90ms"
            ];
            const logEntry = mockLogs[Math.floor(Math.random() * mockLogs.length)];
            const time = new Date().toISOString().split('T')[1].substring(0, 8);
            setLogs(prev => [`${time} [INFO] ${logEntry}`, ...prev.slice(0, 8)]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const triggerErrorFlood = () => {
        setErrorRate(45);
        const time = new Date().toISOString().split('T')[1].substring(0, 8);
        setLogs(prev => [
            `🚨 ${time} [FATAL ERROR] OUT OF MEMORY (OOM) inside database worker-4`,
            `🚨 ${time} [ERROR 500] Database Connection pool exhausted! Latency: 2500ms`,
            `🚨 ${time} [ERROR] Failover cluster attempting heartbeat recovery...`,
            ...prev.slice(0, 5)
        ]);
        setTimeout(() => {
            setErrorRate(0);
        }, 5000);
    };

    const runCdPipeline = () => {
        if (pipelineState === 'running') return;
        setPipelineState('running');
        setActiveStage(0);
        
        let current = 0;
        const interval = setInterval(() => {
            current += 1;
            if (current >= pipelineStages.length) {
                clearInterval(interval);
                setPipelineState('success');
            } else {
                setActiveStage(current);
            }
        }, 1200);
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>📊 Production Observability & Delivery Sandbox</div>

            <p style={{ fontSize: 13.5, color: 'var(--text-gray)', lineHeight: 1.5, marginBottom: 20 }}>
                High-volume architectures cannot operate blindly. **Logging** aggregates live operations text, **Metrics** track hardware utilization, and **CI/CD Automation** pipelines guarantee rapid, safe canary upgrades.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
                
                {/* Panel 1: Logging stream */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 14, background: 'rgba(0,0,0,0.3)', fontFamily: 'monospace' }}>
                    <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 900, textTransform: 'uppercase', marginBottom: 10 }}>📜 Live Log Aggregator</div>
                    <div style={{ height: 160, overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {logs.map((log, index) => (
                            <div key={index} style={{ fontSize: 10, color: log.includes('ERROR') || log.includes('FATAL') ? '#ef4444' : log.includes('WARN') ? '#f59e0b' : 'var(--text-gray)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {log}
                            </div>
                        ))}
                    </div>
                    <button style={{ ...btnStyle, width: '100%', padding: '6px 0', fontSize: 10, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: '#ef444433', marginTop: 10 }} onClick={triggerErrorFlood}>
                        🔥 Inject 500 DB Crash Event
                    </button>
                </div>

                {/* Panel 2: Live Metrics */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 14, background: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: 10, color: '#00d4aa', fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>📈 Real-Time Metrics</div>
                    
                    <div style={{ display: 'grid', gap: 12 }}>
                        {/* CPU Gauge bar */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text-light)' }}>
                                <span>Core Server CPU:</span>
                                <span style={{ color: cpu > 80 || errorRate > 0 ? '#ef4444' : '#00d4aa' }}>{errorRate > 0 ? 98 : cpu}%</span>
                            </div>
                            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
                                <div style={{ width: `${errorRate > 0 ? 98 : cpu}%`, height: '100%', background: cpu > 80 || errorRate > 0 ? '#ef4444' : '#00d4aa', transition: 'width 0.3s ease' }} />
                            </div>
                        </div>

                        {/* Cache hit rate */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text-light)' }}>
                                <span>Cache Hit Rate:</span>
                                <span style={{ color: '#a78bfa' }}>{cacheHitRate}%</span>
                            </div>
                            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
                                <div style={{ width: `${cacheHitRate}%`, height: '100%', background: '#a78bfa', transition: 'width 0.3s ease' }} />
                            </div>
                        </div>

                        {/* HTTP Error rate */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text-light)' }}>
                                <span>HTTP Error Rate (5xx):</span>
                                <span style={{ color: errorRate > 0 ? '#ef4444' : 'var(--text-muted)' }}>{errorRate}%</span>
                            </div>
                            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
                                <div style={{ width: `${errorRate}%`, height: '100%', background: '#ef4444', transition: 'width 0.3s ease' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel 3: CI/CD Pipeline */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 14, background: 'rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 900, textTransform: 'uppercase', marginBottom: 10 }}>🚀 GitOps Deploy Pipeline</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {pipelineStages.map((stage, idx) => {
                                const isCurrent = pipelineState === 'running' && activeStage === idx;
                                const isPassed = pipelineState === 'success' || (pipelineState === 'running' && activeStage > idx);
                                return (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                                        <span style={{
                                            color: isPassed ? '#34d399' : isCurrent ? '#a78bfa' : 'var(--text-muted)',
                                            fontWeight: 800
                                        }}>
                                            {isPassed ? '✓' : isCurrent ? '⚡' : '○'}
                                        </span>
                                        <span style={{ color: isPassed ? 'var(--text-light)' : isCurrent ? '#a78bfa' : 'var(--text-muted)' }}>
                                            {stage}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button 
                        style={{ 
                            ...btnStyle, 
                            width: '100%', 
                            padding: '6px 0', 
                            fontSize: 10.5, 
                            background: pipelineState === 'running' ? 'rgba(255,255,255,0.05)' : 'rgba(167, 139, 250, 0.15)', 
                            color: '#a78bfa', 
                            borderColor: '#a78bfa33',
                            cursor: pipelineState === 'running' ? 'not-allowed' : 'pointer'
                        }} 
                        onClick={runCdPipeline}
                        disabled={pipelineState === 'running'}
                    >
                        {pipelineState === 'running' ? '🚀 Deploying Canary v1.4...' : 'Canary Deploy New Release 🚀'}
                    </button>
                </div>

            </div>
        </div>
    );
}


/* =========================================================================
   2g. DbShardingWidget (Database Horizontal Partitioning Sandbox)
   ========================================================================= */
function DbShardingWidget() {
    const [subTab, setSubTab] = useState('calc'); // 'calc', 'migrate', 'hotspot'
    const [inputVal, setInputVal] = useState('10052');
    const [shardingLog, setShardingLog] = useState([]);
    
    // Resharding simulator states
    const [shardNodes, setShardNodes] = useState(4); // 4 or 8
    const [migrating, setMigrating] = useState(false);

    // Hotspot states
    const [celebritySpike, setCelebritySpike] = useState(false);
    const [cachedFix, setCachedFix] = useState(false);
    const [droppedRequests, setDroppedRequests] = useState(0);

    const runModuloHash = (val) => {
        let numericId = parseInt(val, 10);
        if (isNaN(numericId)) {
            // String fallback simple hashing
            let sum = 0;
            for (let i = 0; i < val.length; i++) sum += val.charCodeAt(i);
            numericId = sum;
        }
        
        const targetShard = numericId % shardNodes;
        return { numericId, targetShard };
    };

    const handleCalculate = (val) => {
        const valueToUse = val || inputVal;
        const { numericId, targetShard } = runModuloHash(valueToUse);
        setShardingLog(prev => [
            `✓ [APPLICATION QUERY]: Request user_id = ${valueToUse}`,
            `⚙️ [ROUTER RESOLUTION]: hash(${valueToUse}) modulo ${shardNodes} nodes = Shard ${targetShard}`,
            `🗄️ [ROUTING TRAFFIC]: Query dispatched to Database Node ${targetShard}!`,
            ...prev.slice(0, 5)
        ]);
    };

    const triggerResharding = () => {
        setMigrating(true);
        setTimeout(() => {
            setShardNodes(8);
            setMigrating(false);
        }, 3000);
    };

    const triggerCelebritySpike = () => {
        setCelebritySpike(true);
        setDroppedRequests(0);
        let intervalCount = 0;
        const interval = setInterval(() => {
            intervalCount += 1;
            if (intervalCount >= 10) {
                clearInterval(interval);
            }
            if (!cachedFix) {
                setDroppedRequests(d => d + Math.floor(Math.random() * 8) + 4);
            }
        }, 500);
    };

    return (
        <div style={containerStyle}>
            <style>{`
                @keyframes pulse-hotspot {
                    0%, 100% { background: rgba(239, 68, 68, 0.05); border-color: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
                    50% { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; box-shadow: 0 0 25px rgba(239, 68, 68, 0.8); }
                }
            `}</style>
            
            <div style={titleStyle}>🗄️ Database Horizontal Partitioning (Sharding) Lab</div>

            <p style={{ fontSize: 13.5, color: 'var(--text-gray)', lineHeight: 1.5, marginBottom: 18 }}>
                Horizontal scaling of relational databases is achieved via **Sharding**. We divide a large table into smaller parts and route traffic to individual database nodes based on a **Partition Key** calculation.
            </p>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4, marginBottom: 18 }}>
                <button style={{ ...tabStyle, background: subTab === 'calc' ? 'var(--bg-surface)' : 'transparent', color: subTab === 'calc' ? '#00d4aa' : 'var(--text-muted)' }} onClick={() => setSubTab('calc')}>
                    Interactive Hash Router
                </button>
                <button style={{ ...tabStyle, background: subTab === 'migrate' ? 'var(--bg-surface)' : 'transparent', color: subTab === 'migrate' ? '#a78bfa' : 'var(--text-muted)' }} onClick={() => setSubTab('migrate')}>
                    Scale: Shard Splitter (Resharding)
                </button>
                <button style={{ ...tabStyle, background: subTab === 'hotspot' ? 'var(--bg-surface)' : 'transparent', color: subTab === 'hotspot' ? '#f59e0b' : 'var(--text-muted)' }} onClick={() => setSubTab('hotspot')}>
                    Problem: Celebrity Hotspots
                </button>
            </div>

            {/* Sharding Hash Router Calculator */}
            {subTab === 'calc' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-light)', marginBottom: 8 }}>Input User ID or Username:</div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                            <input 
                                type="text"
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                style={{
                                    flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10,
                                    padding: '8px 12px', fontSize: 12.5, color: 'var(--text-light)'
                                }}
                            />
                            <button style={{ ...btnStyle, background: 'rgba(0,212,170,0.15)', color: '#00d4aa', borderColor: '#00d4aa33' }} onClick={() => handleCalculate()}>
                                Route Key 🚀
                            </button>
                        </div>

                        {/* Suggestions */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                            {['1002', 'jayadeep', '8910042', 'admin_node'].map(sug => (
                                <span 
                                    key={sug}
                                    onClick={() => { setInputVal(sug); handleCalculate(sug); }}
                                    style={{
                                        fontSize: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20,
                                        padding: '4px 10px', cursor: 'pointer', color: 'var(--text-gray)', transition: 'all 0.15s'
                                    }}
                                >
                                    {sug}
                                </span>
                            ))}
                        </div>

                        {/* Dotted Logs */}
                        <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 12, background: 'rgba(0,0,0,0.2)', minHeight: 120, fontFamily: 'monospace' }}>
                            <div style={{ fontSize: 9.5, color: '#00d4aa', fontWeight: 900, marginBottom: 8, textTransform: 'uppercase' }}>Router Action Log</div>
                            {shardingLog.length === 0 ? (
                                <div style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic' }}>Submit a query ID to observe sharding router mapping.</div>
                            ) : (
                                shardingLog.map((log, i) => (
                                    <div key={i} style={{ fontSize: 10, color: 'var(--text-gray)', marginBottom: 4 }}>
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Nodes Array Grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                            {Array.from({ length: shardNodes }).map((_, idx) => {
                                const isMatched = shardingLog.length > 0 && shardingLog[1].includes(`Shard ${idx}`);
                                return (
                                    <div key={idx} style={{
                                        padding: 12, border: `1.5px solid ${isMatched ? '#00d4aa' : 'var(--border)'}`, borderRadius: 10,
                                        background: isMatched ? 'rgba(0,212,170,0.05)' : 'var(--bg-surface)', textAlign: 'center',
                                        transition: 'all 0.25s', boxShadow: isMatched ? '0 0 12px rgba(0,212,170,0.15)' : 'none'
                                    }}>
                                        <span style={{ fontSize: 18 }}>🗄️</span>
                                        <div style={{ fontSize: 11, fontWeight: 800, color: isMatched ? '#00d4aa' : 'var(--text-light)' }}>Shard {idx}</div>
                                        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>ID % {shardNodes} == {idx}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Shard Splitter Resharding */}
            {subTab === 'migrate' && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${shardNodes}, 1fr)`, gap: 10, marginBottom: 20 }}>
                        {Array.from({ length: shardNodes }).map((_, idx) => (
                            <div key={idx} style={{
                                padding: 12, border: '1.5px solid var(--border)', borderRadius: 12,
                                background: migrating ? 'rgba(167,139,250,0.03)' : 'var(--bg-surface)'
                            }}>
                                <span style={{ fontSize: 20 }}>🗄️</span>
                                <div style={{ fontSize: 11, fontWeight: 800 }}>Shard DB {idx}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Capacity:</div>
                                    <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ width: migrating ? '49%' : shardNodes === 4 ? '98%' : '49%', height: '100%', background: migrating ? '#a78bfa' : shardNodes === 4 ? '#ef4444' : '#00d4aa', transition: 'width 2s' }} />
                                    </div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: migrating ? '#a78bfa' : shardNodes === 4 ? '#ef4444' : '#00d4aa' }}>
                                        {migrating ? '🔄 Rebalancing' : shardNodes === 4 ? '⚠️ 98% FULL' : '✓ 49% Healthy'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {migrating && (
                        <div style={{ color: '#a78bfa', fontSize: 12.5, fontWeight: 800, marginBottom: 12, animation: 'pulse 1s infinite' }}>
                            ⚡ RESHARDING ACTIVE: Transferring partitions to new database allocation units...
                        </div>
                    )}

                    {shardNodes === 4 ? (
                        <button 
                            style={{ ...btnStyle, background: 'rgba(167,139,250,0.15)', color: '#a78bfa', borderColor: '#a78bfa33' }}
                            onClick={triggerResharding}
                            disabled={migrating}
                        >
                            ⚡ Cluster Emergency: Split Shards from 4 to 8 Nodes
                        </button>
                    ) : (
                        <button 
                            style={{ ...btnStyle }}
                            onClick={() => { setShardNodes(4); }}
                        >
                            🔄 Reset back to 4 Shards
                        </button>
                    )}
                </div>
            )}

            {/* Celebrity Hotspot Problem */}
            {subTab === 'hotspot' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
                        {Array.from({ length: 4 }).map((_, idx) => {
                            const isHot = idx === 1 && celebritySpike;
                            const isSafe = isHot && cachedFix;
                            
                            return (
                                <div 
                                    key={idx} 
                                    style={{
                                        padding: 12, border: '1.5px solid var(--border)', borderRadius: 12,
                                        background: 'var(--bg-surface)',
                                        animation: isHot && !isSafe ? 'pulse-hotspot 1.5s infinite' : 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <span style={{ fontSize: 20 }}>🗄️</span>
                                    <div style={{ fontSize: 11, fontWeight: 800 }}>Shard 10.0.0.{idx}</div>
                                    <div style={{ fontSize: 9.5, color: 'var(--text-gray)', marginTop: 4 }}>
                                        {idx === 1 ? '🌟 Taylor Swift (ID: 1002)' : 'Normal Users'}
                                    </div>
                                    
                                    <div style={{ fontSize: 10.5, fontWeight: 800, marginTop: 8, color: isHot ? (isSafe ? '#00d4aa' : '#ef4444') : 'var(--text-muted)' }}>
                                        {isHot ? (isSafe ? '⚡ Cached: 10% CPU' : '🛑 OVERLOAD: 100% CPU') : 'Idle (2% CPU)'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 14, marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <input 
                                    type="checkbox" 
                                    id="cache_fix_check"
                                    checked={cachedFix}
                                    onChange={(e) => setCachedFix(e.target.checked)}
                                    style={{ width: 16, height: 16, accentColor: '#00d4aa', cursor: 'pointer' }}
                                />
                                <label htmlFor="cache_fix_check" style={{ color: 'var(--text-light)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
                                    Enable In-Memory Caching (Redis) for Hot Keys
                                </label>
                            </div>
                            <span style={{ fontSize: 12, color: droppedRequests > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                                Dropped requests: <strong>{droppedRequests}</strong>
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                            style={{ ...btnStyle, flex: 1.5, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderColor: '#f59e0b33' }}
                            onClick={triggerCelebritySpike}
                        >
                            🚀 Trigger Celebrity Traffic Flood (Taylor Swift Tweets!)
                        </button>
                        <button 
                            style={{ ...btnStyle, flex: 1 }}
                            onClick={() => {
                                setCelebritySpike(false);
                                setCachedFix(false);
                                setDroppedRequests(0);
                            }}
                        >
                            🔄 Reset
                        </button>
                    </div>
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
        case 'five interactive expandable cards, one per system':
            return <FiveExpandableCardsWidget />;
        case 'step-by-step request flow':
        case 'animated step-by-step flow diagram':
            return <RequestFlowWidget />;
        case 'before/after comparison diagram':
            return <WebDataSeparationWidget />;
        case 'cards/table comparison':
        case 'comparison table + four nosql type cards':
            return <RelationalNoSqlWidget />;
        case 'side-by-side animated comparison':
            return <VerticalHorizontalScalingWidget />;
        case 'animated flow diagram with failover scenario':
            return <LoadBalancerWidget />;
        case 'architecture diagram with failure scenario callouts':
            return <DbReplicationWidget />;
        case 'animated cache hit/miss simulation':
        case 'animated dual-path flow diagram':
            return <CacheHitMissWidget />;
        case 'interactive geo-map simulation':
        case 'world map with request flow animation':
            return <CdnGeoMapWidget />;
        case 'active interactive architecture diagram':
        case 'two side-by-side architecture diagrams':
            return <StatefulStatelessWidget />;
        case 'interactive map-based failover simulator':
        case 'world map with data center failover animation':
            return <GeoDnsFailoverWidget />;
        case 'queue pipeline simulator':
        case 'animated producer-consumer flow diagram with scaling simulation':
            return <MessageQueueWidget />;
        case 'three-panel section':
            return <LoggingMetricsCdWidget />;
        case 'three diagrams':
            return <DbShardingWidget />;
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
        case 'interactive decision tree / flowchart':
            return <RateLimiterArchitecture mode="placement" />;
        case 'interactive input form':
        case 'requirements checklist / two-column card layout':
            return <RateLimiterArchitecture mode="requirements" />;
        case 'interactive token counter sandbox':
        case 'interactive algorithm simulator':
            return <RateLimiterSandbox initialAlgo="token-bucket" />;
        case 'interactive queue pipeline simulator':
        case 'animated side-by-side comparison (token bucket vs. leaking bucket)':
            return <RateLimiterSandbox initialAlgo="leaking-bucket" />;
        case 'interactive grid cell simulator':
        case 'timeline animation with edge burst demonstration':
            return <RateLimiterSandbox initialAlgo="fixed-window" />;
        case 'interactive timeline log simulator':
        case 'animated sliding window timeline':
            return <RateLimiterSandbox initialAlgo="sliding-window-log" />;
        case 'interactive window grid simulator':
        case 'interactive formula visualizer with live slider':
            return <RateLimiterSandbox initialAlgo="sliding-window-counter" />;
        case 'dynamic slider-based radar chart':
        case 'interactive comparison table with expand and head-to-head compare':
            return <RateLimiterSandbox initialAlgo="token-bucket" showComparison={true} />;
        case 'active client-server middleware diagram':
        case 'animated flow diagram with clickable components':
            return <RateLimiterArchitecture mode="middleware" />;
        case 'interactive syntax-highlighted rule configuration editor':
        case 'annotated code block + flow diagram':
            return <RateLimiterArchitecture mode="rules" />;
        case 'interactive header and status code reference table':
        case 'split-panel diagram':
            return <RateLimiterArchitecture mode="headers" />;
        case 'interactive concurrency simulation':
        case 'side-by-side timeline diagram with animation':
            return <RateLimiterArchitecture mode="concurrency" />;
        case 'distributed cluster mapping visualizer':
        case 'three-panel comparison diagram':
            return <RateLimiterArchitecture mode="sync" />;
        case 'performance dashboard simulator':
        case 'world map with edge nodes and latency comparison':
            return <RateLimiterArchitecture mode="multi-dc" />;
        case 'live charts simulator':
        case 'dashboard mockup with metric cards':
            return <RateLimiterArchitecture mode="monitoring" />;
        case 'compare cards toggle':
        case 'side-by-side comparison cards':
            return <RateLimiterArchitecture mode="hard-vs-soft" />;
        case 'horizontal layer stack':
        case 'layered osi stack diagram':
            return <RateLimiterArchitecture mode="osi-layers" />;
        case 'two-column dashboard mock':
        case 'code snippet card + behavior comparison':
            return <RateLimiterArchitecture mode="client-practices" />;

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
            return <DistributedIdFailureWidget />;
        case 'annotated requirements table':
            return <DistributedIdRequirementsWidget />;
        case 'animated dual-server id generation':
            return <MultiMasterIdGeneratorWidget />;
        case 'uuid breakdown with b-tree comparison':
            return <UuidBtreeComparisonWidget />;
        case 'spof failure animation':
            return <TicketServerSpofWidget />;
        case '64-bit interactive id with live generator':
            return <TwitterSnowflakeLab mode="layout" />;
        case 'timeline with bit-shift demonstration':
            return <TwitterSnowflakeLab mode="timestamp" />;
        case 'millisecond-level counter animation':
            return <TwitterSnowflakeLab mode="sequence" />;
        case 'animated clock comparison':
            return <ClockSyncComparisonWidget />;
        case 'interactive bit allocation editor':
            return <SnowflakeBitTuningWidget />;
        case 'failure simulation with load balancer':
            return <HaLoadBalancerWidget />;

        default:
            if (specTitle.includes('consistent hash ring')) return <RingReplicationWidget />;
            if (spec) return <GenericVisualSpecWidget spec={spec} type={type} />;
            return null;
    }
}
