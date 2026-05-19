const palette = {
  green: '#00d4aa',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  red: '#ef4444',
  cyan: '#06b6d4',
  slate: '#64748b',
};

const chapterPalette = [palette.green, palette.blue, palette.purple, palette.amber, palette.cyan];

function chapterNumber(title = '') {
  return Number(title.match(/chapter\s+(\d+)/i)?.[1] || 0);
}

function normalize(value = '') {
  return value.toLowerCase();
}

function getVisualKind(chapterTitle = '', sectionTitle = '', sectionType = '') {
  const ch = chapterNumber(chapterTitle);
  const s = normalize(sectionTitle);
  const type = normalize(sectionType);

  if (s.includes('cross-chapter') || s.includes('embedding identity')) return 'identity';
  if (s.includes('recap') || s.includes('cheat sheet') || s.includes('self-check') || type.includes('recap') || type.includes('cheat')) return 'summary';

  if (ch === 1) {
    if (s.includes('single server')) return 'single-server';
    if (s.includes('separating web')) return 'web-data-tiers';
    if (s.includes('relational')) return 'database-choice';
    if (s.includes('vertical scaling')) return 'scaling';
    if (s.includes('load balancer')) return 'load-balancer';
    if (s.includes('replication')) return 'db-replication';
    if (s.includes('cache')) return 'cache';
    if (s.includes('cdn')) return 'cdn';
    if (s.includes('stateful')) return 'stateful';
    if (s.includes('data centers') || s.includes('geodns')) return 'geodns';
    if (s.includes('message queues')) return 'queue';
    if (s.includes('logging') || s.includes('metrics')) return 'observability';
    if (s.includes('sharding')) return 'sharding';
    if (s.includes('journey')) return 'scaling-journey';
  }

  if (ch === 2) {
    if (s.includes('power of two') || s.includes('data volume')) return 'data-units';
    if (s.includes('latency')) return 'latency';
    if (s.includes('availability') || s.includes('nines')) return 'availability';
    if (s.includes('twitter')) return 'twitter-estimate';
    if (s.includes('servers')) return 'server-estimate';
    if (s.includes('cache memory')) return 'cache-estimate';
    return 'estimation';
  }

  if (ch === 3) {
    if (s.includes('evaluating')) return 'interviewer';
    if (s.includes('mistakes') || s.includes('red flags')) return 'mistakes';
    if (s.includes('4-step') || s.includes('step 1') || s.includes('step 2') || s.includes('step 3') || s.includes('step 4')) return 'interview-framework';
    if (s.includes('dos') || s.includes('time management') || s.includes('foundation')) return 'interview-practice';
    return 'interview-framework';
  }

  if (ch === 4) {
    if (s.includes('where to place')) return 'rate-placement';
    if (s.includes('requirements')) return 'rate-requirements';
    if (s.includes('token bucket')) return 'token-bucket';
    if (s.includes('leaking bucket')) return 'leaking-bucket';
    if (s.includes('fixed window')) return 'fixed-window';
    if (s.includes('sliding window log')) return 'sliding-log';
    if (s.includes('sliding window counter')) return 'sliding-counter';
    if (s.includes('comparison')) return 'rate-comparison';
    if (s.includes('architecture') || s.includes('redis')) return 'rate-architecture';
    if (s.includes('rules')) return 'rate-rules';
    if (s.includes('handling rate-limited')) return 'rate-429';
    if (s.includes('race')) return 'race-condition';
    if (s.includes('synchronization')) return 'rate-sync';
    if (s.includes('performance') || s.includes('multi-dc')) return 'multi-dc-rate';
    if (s.includes('monitoring')) return 'rate-monitoring';
    if (s.includes('hard vs') || s.includes('soft')) return 'hard-soft';
    if (s.includes('osi')) return 'osi-layers';
    if (s.includes('client-side')) return 'client-backoff';
    return 'rate-limiter';
  }

  if (ch === 5) {
    if (s.includes('rehashing') || s.includes('modular')) return 'rehashing';
    if (s.includes('virtual nodes')) return 'virtual-nodes';
    if (s.includes('adding') || s.includes('removing') || s.includes('affected')) return 'ring-migration';
    if (s.includes('benefits')) return 'hashing-benefits';
    if (s.includes('real-world')) return 'hashing-systems';
    return 'ring';
  }

  if (ch === 6) {
    if (s.includes('what is a key-value')) return 'kv';
    if (s.includes('single server')) return 'single-server';
    if (s.includes('distributed key-value')) return 'distributed-kv';
    if (s.includes('cap')) return 'cap';
    if (s.includes('components') || s.includes('architecture diagram') || s.includes('full picture')) return 'kv-architecture';
    if (s.includes('partition') || s.includes('consistent hashing')) return 'ring';
    if (s.includes('replication')) return 'ring-replica';
    if (s.includes('quorum')) return 'quorum';
    if (s.includes('consistency models')) return 'consistency-spectrum';
    if (s.includes('versioning') || s.includes('vector clocks')) return 'conflict';
    if (s.includes('failure') || s.includes('gossip') || s.includes('sloppy') || s.includes('hinted') || s.includes('merkle') || s.includes('anti-entropy') || s.includes('data center outage')) return 'recovery';
    if (s.includes('write path')) return 'write-path';
    if (s.includes('read path')) return 'read-path';
    if (s.includes('summary table')) return 'kv-summary';
  }

  if (ch === 7) {
    if (s.includes('snowflake') || s.includes('timestamp') || s.includes('sequence') || s.includes('datacenter id') || s.includes('machine id') || s.includes('section tuning')) return 'snowflake';
    if (s.includes('clock') || s.includes('high availability') || s.includes('additional considerations')) return 'ha-clock';
    if (s.includes('auto-increment')) return 'auto-increment';
    if (s.includes('requirements')) return 'id-requirements';
    if (s.includes('multi-master')) return 'multi-master';
    if (s.includes('uuid')) return 'uuid';
    if (s.includes('ticket server')) return 'ticket-server';
    return 'id-approaches';
  }

  return 'concept-map';
}

function Shell({ title, caption, children }) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012))',
      border: '1px solid var(--border)',
      borderRadius: 22,
      padding: 20,
      margin: '0 0 24px',
      boxShadow: '0 14px 40px rgba(0,0,0,0.18)',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: palette.cyan, marginBottom: 6 }}>Book-style diagram</div>
          <h2 style={{ margin: 0, color: 'var(--text-light)', fontSize: 17, fontWeight: 850, lineHeight: 1.25 }}>{title}</h2>
        </div>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.45, maxWidth: 410 }}>{caption}</p>
      </div>
      {children}
    </section>
  );
}

function Card({ children, color = palette.green, style }) {
  return (
    <div style={{
      background: `${color}11`,
      border: `1px solid ${color}3d`,
      borderRadius: 14,
      padding: 14,
      minHeight: 76,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Label({ children, color = palette.green }) {
  return <div style={{ color, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7 }}>{children}</div>;
}

function Text({ children }) {
  return <div style={{ color: 'var(--text-light)', fontSize: 13, fontWeight: 780, lineHeight: 1.35 }}>{children}</div>;
}

function SubText({ children }) {
  return <div style={{ color: 'var(--text-muted)', fontSize: 11.5, lineHeight: 1.45, marginTop: 5 }}>{children}</div>;
}

function DiagramBox({ x, y, w = 112, h = 58, label, sub, color = palette.green }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <div style={{
        height: '100%',
        background: `${color}16`,
        border: `1px solid ${color}50`,
        borderRadius: 12,
        padding: '9px 10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{ color, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        {sub && <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 3, lineHeight: 1.2 }}>{sub}</div>}
      </div>
    </foreignObject>
  );
}

function Arrow({ x1, y1, x2, y2, color = 'rgba(255,255,255,0.35)', dashed = false }) {
  const id = `arrow-${Math.abs(Math.round(x1 + y1 + x2 + y2))}`;
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L7,3 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.2" strokeDasharray={dashed ? '6 6' : 'none'} markerEnd={`url(#${id})`} />
    </g>
  );
}

function Canvas({ children, height = 280, label }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 18, background: 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))', overflow: 'hidden' }}>
      <svg viewBox={`0 0 720 ${height}`} role="img" aria-label={label} style={{ width: '100%', display: 'block' }}>
        <rect x="0" y="0" width="720" height={height} fill="rgba(9,13,22,0.5)" />
        {children}
      </svg>
    </div>
  );
}

function FlowCards({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 12 }}>
      {items.map((item, index) => (
        <Card key={`${item.label}-${index}`} color={item.color}>
          <Label color={item.color}>{item.kicker || `Step ${index + 1}`}</Label>
          <Text>{item.label}</Text>
          <SubText>{item.sub}</SubText>
        </Card>
      ))}
    </div>
  );
}

function TopologyDiagram({ variant = 'single-server' }) {
  const variants = {
    'single-server': {
      h: 265,
      boxes: [
        [42, 95, 126, 62, 'User', 'browser/mobile', palette.cyan],
        [292, 55, 150, 150, 'Single server', 'web + app + db + cache', palette.red],
        [510, 78, 126, 54, 'CPU/RAM', 'shared ceiling', palette.amber],
        [510, 152, 126, 54, 'Failure', 'one crash = outage', palette.red],
      ],
      arrows: [[168, 126, 292, 126], [442, 105, 510, 105], [442, 178, 510, 178]],
    },
    'web-data-tiers': {
      h: 270,
      boxes: [
        [35, 104, 110, 58, 'Users', 'public internet', palette.cyan],
        [245, 50, 140, 66, 'Web tier', 'HTTP + logic', palette.blue],
        [245, 155, 140, 66, 'Web tier', 'scale horizontally', palette.blue],
        [520, 104, 135, 66, 'Data tier', 'private network', palette.green],
      ],
      arrows: [[145, 133, 245, 84], [145, 133, 245, 188], [385, 84, 520, 133], [385, 188, 520, 133]],
    },
    'load-balancer': {
      h: 280,
      boxes: [
        [42, 110, 112, 58, 'Clients', 'many requests', palette.cyan],
        [280, 110, 128, 58, 'Load balancer', 'health + routing', palette.amber],
        [540, 42, 118, 50, 'Server A', 'healthy', palette.green],
        [540, 114, 118, 50, 'Server B', 'healthy', palette.green],
        [540, 186, 118, 50, 'Server C', 'removed on fail', palette.red],
      ],
      arrows: [[154, 139, 280, 139], [408, 139, 540, 67], [408, 139, 540, 139], [408, 139, 540, 211]],
    },
    'db-replication': {
      h: 280,
      boxes: [
        [48, 62, 112, 58, 'Writes', 'users update', palette.cyan],
        [275, 62, 130, 62, 'Primary DB', 'accepts writes', palette.green],
        [530, 38, 126, 54, 'Replica 1', 'read traffic', palette.blue],
        [530, 116, 126, 54, 'Replica 2', 'read traffic', palette.blue],
        [48, 178, 112, 58, 'Reads', 'fan out', palette.purple],
      ],
      arrows: [[160, 91, 275, 91], [405, 91, 530, 65], [405, 91, 530, 143], [160, 207, 530, 143]],
    },
    cache: {
      h: 280,
      boxes: [
        [46, 108, 112, 58, 'Client', 'get key', palette.cyan],
        [255, 108, 126, 58, 'Cache', 'hot data', palette.green],
        [535, 108, 126, 58, 'Database', 'source of truth', palette.blue],
        [255, 196, 126, 48, 'TTL/Eviction', 'freshness control', palette.amber],
      ],
      arrows: [[158, 137, 255, 137], [381, 137, 535, 137], [535, 158, 381, 158], [318, 166, 318, 196]],
    },
    cdn: {
      h: 285,
      boxes: [
        [44, 115, 112, 58, 'User', 'nearby edge', palette.cyan],
        [244, 48, 130, 58, 'Edge POP', 'cached image', palette.green],
        [244, 184, 130, 58, 'Edge POP', 'regional cache', palette.green],
        [520, 115, 136, 58, 'Origin', 'fallback source', palette.blue],
      ],
      arrows: [[156, 144, 244, 77], [156, 144, 244, 213], [374, 77, 520, 144], [374, 213, 520, 144]],
    },
    queue: {
      h: 280,
      boxes: [
        [42, 110, 118, 58, 'Producer', 'web/API', palette.cyan],
        [270, 110, 132, 58, 'Queue', 'buffer + retry', palette.amber],
        [530, 55, 126, 54, 'Worker A', 'async job', palette.green],
        [530, 145, 126, 54, 'Worker B', 'async job', palette.green],
      ],
      arrows: [[160, 139, 270, 139], [402, 139, 530, 82], [402, 139, 530, 172]],
    },
    geodns: {
      h: 285,
      boxes: [
        [42, 45, 110, 54, 'US user', 'request', palette.cyan],
        [42, 185, 110, 54, 'EU user', 'request', palette.cyan],
        [275, 115, 126, 58, 'GeoDNS', 'nearest DC', palette.amber],
        [530, 45, 126, 54, 'US DC', 'low latency', palette.green],
        [530, 185, 126, 54, 'EU DC', 'low latency', palette.green],
      ],
      arrows: [[152, 72, 275, 132], [152, 212, 275, 158], [401, 132, 530, 72], [401, 158, 530, 212]],
    },
    'rate-architecture': {
      h: 285,
      boxes: [
        [42, 110, 112, 58, 'Client', 'API calls', palette.cyan],
        [235, 110, 132, 58, 'Middleware', 'check limit', palette.purple],
        [455, 48, 126, 58, 'Redis', 'counter state', palette.red],
        [455, 185, 126, 58, 'API service', 'allowed only', palette.green],
      ],
      arrows: [[154, 139, 235, 139], [367, 129, 455, 77], [455, 106, 367, 148], [367, 148, 455, 214]],
    },
    'kv-architecture': {
      h: 295,
      boxes: [
        [35, 118, 110, 58, 'Client', 'get/put', palette.cyan],
        [220, 118, 132, 58, 'Coordinator', 'hash + quorum', palette.blue],
        [505, 42, 126, 54, 'Node A', 'replica', palette.green],
        [505, 118, 126, 54, 'Node B', 'replica', palette.purple],
        [505, 194, 126, 54, 'Node C', 'replica', palette.amber],
        [220, 218, 132, 46, 'Repair loop', 'gossip + Merkle', palette.red],
      ],
      arrows: [[145, 147, 220, 147], [352, 147, 505, 69], [352, 147, 505, 145], [352, 147, 505, 221], [505, 221, 352, 241]],
    },
  };
  const data = variants[variant] || variants['single-server'];
  return (
    <Canvas height={data.h} label={`${variant} architecture diagram`}>
      {data.arrows.map((a, index) => <Arrow key={index} x1={a[0]} y1={a[1]} x2={a[2]} y2={a[3]} dashed={a[4]} />)}
      {data.boxes.map((b) => <DiagramBox key={b[4]} x={b[0]} y={b[1]} w={b[2]} h={b[3]} label={b[4]} sub={b[5]} color={b[6]} />)}
    </Canvas>
  );
}

function ComparisonDiagram({ left, right, centerLabel = 'vs' }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) 56px minmax(180px, 1fr)', gap: 12, alignItems: 'stretch' }}>
      <Card color={left.color}>
        <Label color={left.color}>{left.title}</Label>
        <Text>{left.main}</Text>
        <SubText>{left.sub}</SubText>
      </Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>{centerLabel}</div>
      <Card color={right.color}>
        <Label color={right.color}>{right.title}</Label>
        <Text>{right.main}</Text>
        <SubText>{right.sub}</SubText>
      </Card>
    </div>
  );
}

function AxisDiagram({ labels }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {labels.map((item) => (
        <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 80px', gap: 12, alignItems: 'center' }}>
          <div style={{ color: item.color, fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>{item.label}</div>
          <div style={{ height: 12, borderRadius: 999, background: 'var(--bg-elevated)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ height: '100%', width: `${item.width}%`, background: item.color, borderRadius: 999 }} />
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11, textAlign: 'right' }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function RingDiagram({ replicas = false, virtual = false, migration = false }) {
  const nodes = [
    { id: 'A', angle: -88, color: palette.green },
    { id: 'B', angle: -14, color: palette.blue },
    { id: 'C', angle: 56, color: palette.purple },
    { id: 'D', angle: 138, color: palette.amber },
    { id: 'E', angle: 216, color: palette.red },
  ];
  const vnodeAngles = [-75, -58, -22, 8, 34, 72, 104, 126, 166, 198, 238, 282];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 330px) minmax(240px, 1fr)', gap: 18, alignItems: 'center' }}>
      <Canvas height={270} label="consistent hashing ring">
        <circle cx="360" cy="135" r="88" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="5" />
        <path d="M360 47 A88 88 0 0 1 442 104" fill="none" stroke={migration ? palette.red : palette.amber} strokeWidth="9" strokeLinecap="round" strokeDasharray="7 7" />
        <text x="360" y="34" fill={palette.amber} textAnchor="middle" fontSize="11" fontWeight="800">{migration ? 'affected key range' : 'key hash'}</text>
        {virtual && vnodeAngles.map((angle, index) => {
          const rad = angle * Math.PI / 180;
          return <circle key={angle} cx={360 + 88 * Math.cos(rad)} cy={135 + 88 * Math.sin(rad)} r="4" fill={chapterPalette[index % chapterPalette.length]} />;
        })}
        {nodes.map((node, index) => {
          const rad = node.angle * Math.PI / 180;
          const x = 360 + 88 * Math.cos(rad);
          const y = 135 + 88 * Math.sin(rad);
          const isReplica = replicas && index > 0 && index < 4;
          return (
            <g key={node.id}>
              <circle cx={x} cy={y} r={isReplica ? 17 : 13} fill={isReplica ? node.color : 'var(--bg-elevated)'} stroke={node.color} strokeWidth="2" />
              <text x={x} y={y + 4} fill={isReplica ? '#071018' : node.color} fontSize="12" fontWeight="900" textAnchor="middle">{node.id}</text>
            </g>
          );
        })}
      </Canvas>
      <FlowCards items={[
        { label: virtual ? 'Many positions' : 'Hash to ring', sub: virtual ? 'Virtual nodes smooth uneven ownership.' : 'Keys and servers share one hash space.', color: palette.amber },
        { label: replicas ? 'Pick N owners' : 'Clockwise owner', sub: replicas ? 'Keep walking clockwise for replicas.' : 'First server clockwise owns the key.', color: palette.green },
        { label: migration ? 'Only local movement' : 'Stable remap', sub: migration ? 'Adjacent range moves, not the full keyspace.' : 'Most keys stay put when the cluster changes.', color: palette.blue },
      ]} />
    </div>
  );
}

function CapDiagram() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 330px) minmax(240px, 1fr)', gap: 18, alignItems: 'center' }}>
      <Canvas height={260} label="CAP theorem triangle">
        <polygon points="360,36 205,220 515,220" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.13)" strokeWidth="2" />
        {[
          ['C', 'Consistency', 360, 48, palette.blue],
          ['A', 'Availability', 220, 220, palette.green],
          ['P', 'Partition tolerance', 500, 220, palette.amber],
        ].map(([letter, label, x, y, color]) => (
          <g key={letter}>
            <circle cx={x} cy={y} r="30" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <text x={x} y={y + 5} fill={color} textAnchor="middle" fontSize="22" fontWeight="900">{letter}</text>
            <text x={x} y={y + 47} fill="var(--text-muted)" textAnchor="middle" fontSize="10" fontWeight="750">{label}</text>
          </g>
        ))}
        <line x1="290" y1="132" x2="430" y2="132" stroke={palette.red} strokeWidth="3" strokeDasharray="8 8" />
        <text x="360" y="122" fill={palette.red} fontSize="11" fontWeight="850" textAnchor="middle">network split</text>
      </Canvas>
      <FlowCards items={[
        { label: 'CP', sub: 'Block some operations to protect correctness.', color: palette.blue },
        { label: 'AP', sub: 'Serve through the split and reconcile later.', color: palette.green },
        { label: 'Interview move', sub: 'Name the product requirement that chooses the side.', color: palette.purple },
      ]} />
    </div>
  );
}

function SnowflakeDiagram() {
  const segments = [
    ['Sign', 1, palette.slate],
    ['Timestamp', 41, palette.blue],
    ['DC', 5, palette.green],
    ['Machine', 5, palette.purple],
    ['Sequence', 12, palette.amber],
  ];
  const total = segments.reduce((sum, item) => sum + item[1], 0);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', height: 62 }}>
          {segments.map(([label, bits, color]) => (
            <div key={label} style={{
              width: `${(bits / total) * 100}%`,
              minWidth: bits <= 1 ? 24 : 58,
              background: color,
              color: '#071018',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 900,
              borderRight: '1px solid rgba(0,0,0,0.18)',
            }}>
              {label}<br />{bits}b
            </div>
          ))}
        </div>
      </div>
      <IdInlineDiagram />
    </div>
  );
}

function IdInlineDiagram() {
  return (
    <Canvas height={240} label="distributed ID generation">
      <DiagramBox x={44} y={94} w={118} h={58} label="App A" sub="machine=12" color={palette.green} />
      <DiagramBox x={44} y={166} w={118} h={48} label="App B" sub="machine=13" color={palette.purple} />
      <DiagramBox x={292} y={118} w={138} h={58} label="Snowflake" sub="local generator" color={palette.blue} />
      <DiagramBox x={540} y={118} w={132} h={58} label="Database" sub="insert known ID" color={palette.amber} />
      <Arrow x1={162} y1={123} x2={292} y2={139} />
      <Arrow x1={162} y1={190} x2={292} y2={147} />
      <Arrow x1={430} y1={147} x2={540} y2={147} />
      <text x="360" y="72" fill={palette.green} fontSize="12" fontWeight="850" textAnchor="middle">No central counter in the write path</text>
    </Canvas>
  );
}

function MetricDiagram({ kind }) {
  if (kind === 'latency') {
    return <AxisDiagram labels={[
      { label: 'L1 cache', width: 8, value: 'ns', color: palette.green },
      { label: 'Memory', width: 18, value: '100ns', color: palette.cyan },
      { label: 'SSD', width: 48, value: 'ms', color: palette.amber },
      { label: 'Network', width: 84, value: '10-100ms', color: palette.red },
    ]} />;
  }
  if (kind === 'availability') {
    return <AxisDiagram labels={[
      { label: '99%', width: 35, value: '3.65d down/yr', color: palette.red },
      { label: '99.9%', width: 55, value: '8.76h', color: palette.amber },
      { label: '99.99%', width: 75, value: '52.6m', color: palette.blue },
      { label: '99.999%', width: 94, value: '5.26m', color: palette.green },
    ]} />;
  }
  return <AxisDiagram labels={[
    { label: 'QPS', width: 70, value: 'requests/sec', color: palette.blue },
    { label: 'Storage', width: 84, value: 'bytes/day', color: palette.purple },
    { label: 'Bandwidth', width: 62, value: 'MB/sec', color: palette.cyan },
    { label: 'Cache', width: 46, value: 'hot set', color: palette.green },
  ]} />;
}

function RateAlgorithmDiagram({ kind }) {
  const configs = {
    'token-bucket': [
      { label: 'Refill tokens', sub: 'steady allowance enters bucket', color: palette.green },
      { label: 'Request spends token', sub: 'allowed while tokens remain', color: palette.blue },
      { label: 'Burst allowed', sub: 'capacity absorbs short spike', color: palette.purple },
    ],
    'leaking-bucket': [
      { label: 'Requests enter queue', sub: 'burst becomes backlog', color: palette.amber },
      { label: 'Drain at fixed rate', sub: 'smooths downstream traffic', color: palette.green },
      { label: 'Overflow drops', sub: 'queue limit protects service', color: palette.red },
    ],
    'fixed-window': [
      { label: 'Counter per window', sub: 'simple and cheap', color: palette.blue },
      { label: 'Boundary burst', sub: 'double spend near reset', color: palette.red },
      { label: 'Good enough?', sub: 'acceptable for coarse limits', color: palette.amber },
    ],
    'sliding-log': [
      { label: 'Store timestamps', sub: 'exact request history', color: palette.purple },
      { label: 'Remove old entries', sub: 'sliding window cutoff', color: palette.blue },
      { label: 'Accurate but memory heavy', sub: 'cost grows with traffic', color: palette.amber },
    ],
    'sliding-counter': [
      { label: 'Previous window', sub: 'weighted by overlap', color: palette.cyan },
      { label: 'Current window', sub: 'current count', color: palette.green },
      { label: 'Approximate total', sub: 'cheap and smooth', color: palette.blue },
    ],
  };
  return <FlowCards items={configs[kind] || configs['token-bucket']} />;
}

function ConsistencySpectrum() {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ height: 18, borderRadius: 999, background: `linear-gradient(90deg, ${palette.blue}, ${palette.green}, ${palette.amber})`, border: '1px solid var(--border)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <Card color={palette.blue}><Label color={palette.blue}>Strong</Label><Text>latest read</Text><SubText>more coordination</SubText></Card>
        <Card color={palette.green}><Label color={palette.green}>Eventual</Label><Text>converges later</Text><SubText>high availability</SubText></Card>
        <Card color={palette.amber}><Label color={palette.amber}>Weak</Label><Text>no guarantee</Text><SubText>lowest coordination</SubText></Card>
      </div>
    </div>
  );
}

function StoragePathDiagram({ read = false }) {
  return <FlowCards items={read ? [
    { label: 'Memory cache', sub: 'fast path for hot keys', color: palette.green },
    { label: 'Bloom filter', sub: 'skip disk if key cannot exist', color: palette.blue },
    { label: 'SSTables', sub: 'immutable sorted disk files', color: palette.purple },
    { label: 'Return value', sub: 'or null for missing key', color: palette.amber },
  ] : [
    { label: 'Commit log', sub: 'durability before ack', color: palette.red },
    { label: 'Memtable', sub: 'in-memory sorted writes', color: palette.green },
    { label: 'SSTable flush', sub: 'immutable disk segment', color: palette.blue },
    { label: 'Crash recovery', sub: 'replay log after restart', color: palette.purple },
  ]} />;
}

function SummaryDiagram({ chapter }) {
  const ch = chapterNumber(chapter?.title);
  const items = ch === 6
    ? [
      { label: 'Partition', sub: 'consistent hashing', color: palette.blue },
      { label: 'Replicate', sub: 'N replicas + quorum', color: palette.green },
      { label: 'Repair', sub: 'gossip + Merkle trees', color: palette.amber },
      { label: 'Serve', sub: 'read/write LSM paths', color: palette.purple },
    ]
    : ch === 7
      ? [
        { label: 'Avoid central counters', sub: 'no SPOF', color: palette.red },
        { label: 'Embed time', sub: 'sortable ID', color: palette.blue },
        { label: 'Embed machine', sub: 'unique namespace', color: palette.green },
        { label: 'Handle clocks', sub: 'pause on rollback', color: palette.amber },
      ]
      : [
        { label: 'Clarify', sub: 'requirements first', color: palette.blue },
        { label: 'Design', sub: 'simple to scalable', color: palette.green },
        { label: 'Trade off', sub: 'say what changes', color: palette.amber },
        { label: 'Verify', sub: 'risks and metrics', color: palette.purple },
      ];
  return <FlowCards items={items} />;
}

function renderVisual(kind, section) {
  switch (kind) {
    case 'single-server': return <TopologyDiagram variant="single-server" />;
    case 'web-data-tiers': return <TopologyDiagram variant="web-data-tiers" />;
    case 'load-balancer': return <TopologyDiagram variant="load-balancer" />;
    case 'db-replication': return <TopologyDiagram variant="db-replication" />;
    case 'cache': return <TopologyDiagram variant="cache" />;
    case 'cdn': return <TopologyDiagram variant="cdn" />;
    case 'queue': return <TopologyDiagram variant="queue" />;
    case 'geodns': return <TopologyDiagram variant="geodns" />;
    case 'rate-architecture': return <TopologyDiagram variant="rate-architecture" />;
    case 'kv-architecture': return <TopologyDiagram variant="kv-architecture" />;
    case 'database-choice': return <ComparisonDiagram left={{ title: 'SQL', main: 'joins + ACID', sub: 'structured schema', color: palette.blue }} right={{ title: 'NoSQL', main: 'scale by access pattern', sub: 'key-value, document, column', color: palette.green }} />;
    case 'scaling': return <ComparisonDiagram left={{ title: 'Vertical', main: 'bigger machine', sub: 'simple but capped', color: palette.amber }} right={{ title: 'Horizontal', main: 'more machines', sub: 'scales with load balancer', color: palette.green }} />;
    case 'stateful': return <ComparisonDiagram left={{ title: 'Stateful', main: 'session on server', sub: 'sticky routing required', color: palette.red }} right={{ title: 'Stateless', main: 'session in shared store', sub: 'any server can handle request', color: palette.green }} />;
    case 'observability': return <FlowCards items={[{ label: 'Logs', sub: 'what happened', color: palette.blue }, { label: 'Metrics', sub: 'how often/how much', color: palette.green }, { label: 'Alerts', sub: 'wake humans on symptoms', color: palette.amber }, { label: 'Automation', sub: 'deploy, scale, recover', color: palette.purple }]} />;
    case 'sharding': return <FlowCards items={[{ label: 'Shard key', sub: 'decides data placement', color: palette.blue }, { label: 'Even distribution', sub: 'avoid hot shards', color: palette.green }, { label: 'Resharding', sub: 'move ranges carefully', color: palette.amber }, { label: 'Denormalize', sub: 'avoid cross-shard joins', color: palette.purple }]} />;
    case 'scaling-journey': return <AxisDiagram labels={[{ label: '1 user', width: 10, value: 'single server', color: palette.green }, { label: '1k users', width: 35, value: 'tiers + cache', color: palette.blue }, { label: '1M users', width: 70, value: 'LB + CDN + replicas', color: palette.purple }, { label: 'global', width: 95, value: 'shards + multi-DC', color: palette.amber }]} />;
    case 'estimation': return <MetricDiagram />;
    case 'data-units': return <AxisDiagram labels={[{ label: 'KB', width: 15, value: '2^10', color: palette.green }, { label: 'MB', width: 35, value: '2^20', color: palette.blue }, { label: 'GB', width: 60, value: '2^30', color: palette.purple }, { label: 'TB', width: 86, value: '2^40', color: palette.amber }]} />;
    case 'latency': return <MetricDiagram kind="latency" />;
    case 'availability': return <MetricDiagram kind="availability" />;
    case 'twitter-estimate': return <MetricDiagram kind="twitter" />;
    case 'server-estimate': return <FlowCards items={[{ label: 'Target QPS', sub: 'peak traffic', color: palette.blue }, { label: 'Per-server QPS', sub: 'benchmark capacity', color: palette.green }, { label: 'Headroom', sub: '2x safety factor', color: palette.amber }, { label: 'Server count', sub: 'ceil(total/capacity)', color: palette.purple }]} />;
    case 'cache-estimate': return <FlowCards items={[{ label: 'Daily data', sub: 'bytes/day', color: palette.blue }, { label: 'Hot set', sub: '20 percent often enough', color: palette.green }, { label: 'TTL', sub: 'retention window', color: palette.amber }, { label: 'Memory', sub: 'hot set x overhead', color: palette.purple }]} />;
    case 'interviewer': return <FlowCards items={[{ label: 'Requirements', sub: 'ask first', color: palette.blue }, { label: 'Trade-offs', sub: 'reason clearly', color: palette.amber }, { label: 'Depth', sub: 'know bottlenecks', color: palette.green }, { label: 'Communication', sub: 'drive the room', color: palette.purple }]} />;
    case 'mistakes': return <ComparisonDiagram left={{ title: 'Red flag', main: 'jump to details', sub: 'no requirements, no trade-offs', color: palette.red }} right={{ title: 'Strong signal', main: 'structured evolution', sub: 'scope, sketch, deep dive, wrap up', color: palette.green }} />;
    case 'interview-framework': return <FlowCards items={[{ label: '1. Scope', sub: 'requirements + constraints', color: palette.blue }, { label: '2. High level', sub: 'boxes and APIs', color: palette.green }, { label: '3. Deep dive', sub: 'bottlenecks + data model', color: palette.amber }, { label: '4. Wrap up', sub: 'risks + improvements', color: palette.purple }]} />;
    case 'interview-practice': return <FlowCards items={[{ label: 'Do', sub: 'clarify and calculate', color: palette.green }, { label: 'Avoid', sub: 'premature complexity', color: palette.red }, { label: 'Timebox', sub: 'reserve deep dive time', color: palette.blue }, { label: 'Summarize', sub: 'close with trade-offs', color: palette.amber }]} />;
    case 'rate-limiter': return <TopologyDiagram variant="rate-architecture" />;
    case 'rate-placement': return <FlowCards items={[{ label: 'Client', sub: 'easy to bypass', color: palette.red }, { label: 'Middleware', sub: 'common API gateway choice', color: palette.green }, { label: 'Service', sub: 'business-specific limits', color: palette.blue }, { label: 'Infra layer', sub: 'network protection', color: palette.purple }]} />;
    case 'rate-requirements': return <FlowCards items={[{ label: 'Limit unit', sub: 'user/IP/token', color: palette.blue }, { label: 'Window', sub: 'second/minute/day', color: palette.green }, { label: 'Behavior', sub: 'drop, delay, or warn', color: palette.amber }, { label: 'Scale', sub: 'distributed state', color: palette.purple }]} />;
    case 'token-bucket':
    case 'leaking-bucket':
    case 'fixed-window':
    case 'sliding-log':
    case 'sliding-counter':
      return <RateAlgorithmDiagram kind={kind} />;
    case 'rate-comparison': return <AxisDiagram labels={[{ label: 'Token bucket', width: 82, value: 'burst friendly', color: palette.green }, { label: 'Leaking bucket', width: 68, value: 'smooth output', color: palette.blue }, { label: 'Fixed window', width: 44, value: 'simple', color: palette.amber }, { label: 'Sliding log', width: 91, value: 'accurate', color: palette.purple }]} />;
    case 'rate-rules': return <FlowCards items={[{ label: 'Rule store', sub: 'plan/user/endpoint', color: palette.blue }, { label: 'Runtime check', sub: 'middleware reads config', color: palette.green }, { label: 'Change safely', sub: 'roll out without deploy', color: palette.amber }]} />;
    case 'rate-429': return <FlowCards items={[{ label: '429 response', sub: 'Too Many Requests', color: palette.red }, { label: 'Headers', sub: 'limit, remaining, reset', color: palette.blue }, { label: 'Retry-After', sub: 'client backoff guidance', color: palette.green }]} />;
    case 'race-condition': return <FlowCards items={[{ label: 'Read count=9', sub: 'two nodes at once', color: palette.amber }, { label: 'Both allow', sub: 'limit exceeded', color: palette.red }, { label: 'Atomic update', sub: 'Lua/script/transaction', color: palette.green }]} />;
    case 'rate-sync': return <FlowCards items={[{ label: 'Shared Redis', sub: 'single state plane', color: palette.red }, { label: 'Local cache', sub: 'faster but stale', color: palette.amber }, { label: 'Eventual sync', sub: 'multi-DC compromise', color: palette.blue }]} />;
    case 'multi-dc-rate': return <TopologyDiagram variant="geodns" />;
    case 'rate-monitoring': return <FlowCards items={[{ label: 'Allowed', sub: 'normal traffic', color: palette.green }, { label: 'Blocked', sub: 'abuse signal', color: palette.red }, { label: 'Latency', sub: 'rate limiter overhead', color: palette.blue }, { label: 'False positives', sub: 'tune thresholds', color: palette.amber }]} />;
    case 'hard-soft': return <ComparisonDiagram left={{ title: 'Hard limit', main: 'strict deny', sub: 'protects capacity', color: palette.red }} right={{ title: 'Soft limit', main: 'warn or degrade', sub: 'better user experience', color: palette.green }} />;
    case 'osi-layers': return <AxisDiagram labels={[{ label: 'L3/L4', width: 40, value: 'IP/TCP', color: palette.blue }, { label: 'L7', width: 70, value: 'HTTP route/user', color: palette.green }, { label: 'App', width: 90, value: 'business quota', color: palette.purple }]} />;
    case 'client-backoff': return <FlowCards items={[{ label: 'Read headers', sub: 'reset + retry-after', color: palette.blue }, { label: 'Exponential backoff', sub: 'reduce pressure', color: palette.green }, { label: 'Jitter', sub: 'avoid synchronized retry', color: palette.amber }]} />;
    case 'rehashing': return <ComparisonDiagram left={{ title: 'hash % N', main: 'N changes everything', sub: 'cache storm risk', color: palette.red }} right={{ title: 'consistent hashing', main: 'only local range moves', sub: 'bounded migration', color: palette.green }} />;
    case 'ring': return <RingDiagram />;
    case 'ring-replica': return <RingDiagram replicas />;
    case 'virtual-nodes': return <RingDiagram virtual />;
    case 'ring-migration': return <RingDiagram migration />;
    case 'hashing-benefits': return <FlowCards items={[{ label: 'Less remapping', sub: 'K/N movement', color: palette.green }, { label: 'Easy scaling', sub: 'add/remove nodes safely', color: palette.blue }, { label: 'Fewer hot spots', sub: 'virtual nodes smooth load', color: palette.purple }]} />;
    case 'hashing-systems': return <FlowCards items={[{ label: 'Cassandra', sub: 'token ring', color: palette.blue }, { label: 'DynamoDB', sub: 'partition keys', color: palette.green }, { label: 'CDNs', sub: 'cache locality', color: palette.amber }, { label: 'Maglev', sub: 'stable routing', color: palette.purple }]} />;
    case 'kv': return <FlowCards items={[{ label: 'Key', sub: 'user:42:session', color: palette.cyan }, { label: 'Hash', sub: 'direct lookup address', color: palette.green }, { label: 'Value', sub: 'opaque blob', color: palette.purple }]} />;
    case 'distributed-kv': return <TopologyDiagram variant="kv-architecture" />;
    case 'cap': return <CapDiagram />;
    case 'quorum': return <FlowCards items={[{ label: 'N replicas', sub: 'how many copies exist', color: palette.purple }, { label: 'W writes', sub: 'acks before success', color: palette.green }, { label: 'R reads', sub: 'responses before return', color: palette.blue }, { label: 'W + R > N', sub: 'overlap detects freshness', color: palette.amber }]} />;
    case 'consistency-spectrum': return <ConsistencySpectrum />;
    case 'conflict': return <FlowCards items={[{ label: 'v1', sub: 'base value', color: palette.green }, { label: 'v2a', sub: 'write from replica A', color: palette.blue }, { label: 'v2b', sub: 'concurrent write from B', color: palette.amber }, { label: 'Resolve', sub: 'return siblings or merge', color: palette.purple }]} />;
    case 'recovery': return <FlowCards items={[{ label: 'Detect', sub: 'heartbeat/gossip', color: palette.red }, { label: 'Keep serving', sub: 'sloppy quorum', color: palette.amber }, { label: 'Remember', sub: 'hinted handoff', color: palette.blue }, { label: 'Repair', sub: 'Merkle anti-entropy', color: palette.green }]} />;
    case 'write-path': return <StoragePathDiagram />;
    case 'read-path': return <StoragePathDiagram read />;
    case 'kv-summary': return <SummaryDiagram chapter={{ title: 'chapter 6' }} />;
    case 'auto-increment': return <ComparisonDiagram left={{ title: 'Single DB', main: '1, 2, 3...', sub: 'simple but bottlenecked', color: palette.red }} right={{ title: 'Distributed writes', main: 'collisions + no ordering', sub: 'needs new ID strategy', color: palette.amber }} />;
    case 'id-requirements': return <FlowCards items={[{ label: '64-bit numeric', sub: 'fits indexes and APIs', color: palette.blue }, { label: 'Unique', sub: 'no collisions globally', color: palette.green }, { label: 'Sortable', sub: 'rough time order', color: palette.purple }, { label: 'Distributed', sub: 'no central SPOF', color: palette.amber }]} />;
    case 'multi-master': return <FlowCards items={[{ label: 'Master A', sub: '1, 3, 5...', color: palette.blue }, { label: 'Master B', sub: '2, 4, 6...', color: palette.green }, { label: 'Problem', sub: 'hard to scale and no true chronology', color: palette.red }]} />;
    case 'uuid': return <ComparisonDiagram left={{ title: 'UUID', main: '128-bit random', sub: 'simple, decentralized', color: palette.blue }} right={{ title: 'DB index', main: 'random inserts', sub: 'fragmented B-tree pages', color: palette.red }} />;
    case 'ticket-server': return <TopologyDiagram variant="rate-architecture" />;
    case 'id-approaches': return <FlowCards items={[{ label: 'Auto-increment', sub: 'central bottleneck', color: palette.red }, { label: 'UUID', sub: 'large and random', color: palette.amber }, { label: 'Ticket server', sub: 'simple SPOF', color: palette.blue }, { label: 'Snowflake', sub: 'distributed sortable ID', color: palette.green }]} />;
    case 'snowflake': return <SnowflakeDiagram />;
    case 'ha-clock': return <FlowCards items={[{ label: 'Multiple generators', sub: 'each has machine ID', color: palette.green }, { label: 'NTP sync', sub: 'keep clocks close', color: palette.blue }, { label: 'Clock rollback', sub: 'pause until safe', color: palette.amber }, { label: 'Inline generation', sub: 'zero network hop', color: palette.purple }]} />;
    case 'identity': return <ComparisonDiagram left={{ title: 'Key location', main: 'hash(key) -> server', sub: 'consistent hashing avoids directory lookup', color: palette.blue }} right={{ title: 'Record identity', main: 'time + machine + seq', sub: 'Snowflake avoids central counter', color: palette.green }} />;
    case 'summary': return <SummaryDiagram chapter={section?.chapter} />;
    default: return <SummaryDiagram />;
  }
}

function captionFor(kind) {
  const captions = {
    'single-server': 'Start with the simplest topology, then notice the capacity and failure boundary.',
    'web-data-tiers': 'Separating tiers lets each layer scale and fail independently.',
    'database-choice': 'Choose the storage model from access patterns and correctness needs, not from fashion.',
    scaling: 'Vertical scaling buys time; horizontal scaling changes the architecture.',
    'load-balancer': 'A load balancer turns many servers into one stable service endpoint.',
    'db-replication': 'Replication separates write authority from read scale and failure recovery.',
    cache: 'A cache is a fast shortcut with freshness and invalidation trade-offs.',
    cdn: 'CDNs move static content close to users and fall back to origin on miss.',
    queue: 'Queues decouple producers from slower or bursty background work.',
    geodns: 'Geo routing chooses the nearest healthy data center for each user.',
    ring: 'The ring gives deterministic ownership while minimizing remapping.',
    'ring-replica': 'Replicas are found by continuing around the ring to N distinct nodes.',
    cap: 'During a partition, the system must choose between refusing stale answers or staying available.',
    quorum: 'Quorum settings tune the balance between latency, availability, and freshness.',
    conflict: 'Versioning keeps concurrent updates visible so the app can resolve them safely.',
    recovery: 'Good distributed stores assume nodes fail and build repair loops.',
    snowflake: 'Snowflake IDs are not magic; the useful structure is visible in the bit layout.',
    'ha-clock': 'Distributed ID generators are operationally simple until clocks misbehave.',
    summary: 'Use this as a visual memory hook for interview recall.',
  };
  return captions[kind] || 'This diagram focuses the topic into its core moving parts, trade-off, and interview hook.';
}

export default function SystemDesignIllustration({ chapter, section }) {
  const kind = getVisualKind(chapter?.title, section?.title, section?.type);
  const title = section?.title || 'System Design Concept';
  const visualSection = { ...section, chapter };

  return (
    <Shell title={title} caption={captionFor(kind)}>
      {renderVisual(kind, visualSection)}
    </Shell>
  );
}
