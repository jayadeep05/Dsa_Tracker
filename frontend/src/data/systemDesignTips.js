export const SYSTEM_DESIGN_TIPS = [
  {
    id: 1,
    category: "Latency",
    title: "L1 Cache Access Speed",
    content: "L1 cache access latency is around 0.5 nanoseconds. Always design data structures with CPU cache line alignment in mind to avoid expensive hardware cache misses.",
    axiom: "Keep core processing logic compact and cache-friendly."
  },
  {
    id: 2,
    category: "Latency",
    title: "L2 Cache Access & Pointer Chasing",
    content: "L2 cache access latency is around 7 nanoseconds. Avoid excessive pointer chasing (like heavily nested linked lists) in critical loops; use arrays for contiguous memory layout.",
    axiom: "Contiguous arrays outperform pointer-heavy linked data structures."
  },
  {
    id: 3,
    category: "Latency",
    title: "RAM vs. CPU Cache Speeds",
    content: "Main memory (RAM) access latency is ~100 nanoseconds. While fast, RAM is over 200x slower than L1 CPU cache. Minimize hopping to memory by caching hot data in registers or L1/L2.",
    axiom: "Even RAM is slow compared to local registers and CPU caches."
  },
  {
    id: 4,
    category: "Latency",
    title: "SSD Random I/O Latency",
    content: "Solid State Drive (SSD) random read latency is around 150 microseconds (150,000 ns). While much faster than HDDs, random flash reads require physical lookup phases.",
    axiom: "Prefer sequential I/O operations to maximize SSD throughput."
  },
  {
    id: 5,
    category: "Latency",
    title: "Datacenter Round Trip Latency",
    content: "A round trip within a modern datacenter takes ~500 microseconds. Consolidate chatty microservice API calls into batches to reduce RPC handshaking and connection overhead.",
    axiom: "Chatty RPCs destroy microservice response performance."
  },
  {
    id: 6,
    category: "Latency",
    title: "Global WAN Round Trip (NY to London)",
    content: "A transatlantic network round trip takes ~150 milliseconds. Use content delivery networks (CDNs) and edge server deployments to serve static and dynamic content closer to users.",
    axiom: "Speed of light in fiber dictates global network latency."
  },
  {
    id: 7,
    category: "Scalability",
    title: "Read vs. Write Ratios",
    content: "Always clarify the read-heavy vs. write-heavy nature of your system first. A 99:1 read-to-write ratio calls for aggressive caching, while 1:1 requires high-throughput databases.",
    axiom: "Your query mix dictates your entire storage architecture."
  },
  {
    id: 8,
    category: "Scalability",
    title: "Consistent Hashing Principle",
    content: "Consistent Hashing minimizes key redistribution when cache nodes are added or removed. In a normal hash ring, adding 1 node invalidates almost all keys; consistent hashing invalidates only K/N keys.",
    axiom: "Essential for elastic distributed caching without cold starts."
  },
  {
    id: 9,
    category: "Scalability",
    title: "Consistent Hashing - Virtual Nodes",
    content: "Use virtual nodes (vnodes) in consistent hashing to map a single physical server to multiple slots on the hash ring. This ensures a balanced keyspace distribution across all servers.",
    axiom: "Virtual nodes mitigate hot spots on physical servers."
  },
  {
    id: 10,
    category: "Load Balancing",
    title: "Least Connections Routing",
    content: "Best suited for long-lived client connections (e.g., WebSockets, gRPC streams). Routes incoming requests to the server with the fewest active sessions to prevent overload.",
    axiom: "Dynamic load tracking is superior to stateless round-robin."
  },
  {
    id: 11,
    category: "Load Balancing",
    title: "IP Hash Routing Protocol",
    content: "Hashes the client's IP address to map them to a specific backend server. Great for keeping state (sticky sessions), but risks massive load imbalances if many users share an IP gateway.",
    axiom: "Sticky sessions simplify state but compromise scalability."
  },
  {
    id: 12,
    category: "Scalability",
    title: "CDN - Edge Static Caching",
    content: "Store high-bandwidth static assets (images, CSS, JS, videos) at edge servers. This offloads up to 90% of traffic from your origin servers, minimizing your hosting compute bills.",
    axiom: "The cheapest request is the one that never reaches your origin."
  },
  {
    id: 13,
    category: "Caching",
    title: "Cache-Aside Pattern",
    content: "The application queries the cache first. On a miss, it fetches data from the database, writes it to the cache, and returns it. Easy to implement and resilient to cache failures.",
    axiom: "Keeps the cache decoupled from direct database writes."
  },
  {
    id: 14,
    category: "Caching",
    title: "Write-Through Caching",
    content: "The application writes directly to the cache, which synchronously writes to the database. Guarantees cache-DB consistency, but increases write latency because of synchronous dual-writes.",
    axiom: "Ensures fresh cache reads at the cost of slower writes."
  },
  {
    id: 15,
    category: "Caching",
    title: "Write-Behind (Write-Back) Caching",
    content: "The application writes to the cache, which immediately acknowledges and queues an asynchronous write to the database. Extremely fast, but risks data loss if the cache server crashes.",
    axiom: "Use only when write performance is critical and soft loss is tolerable."
  },
  {
    id: 16,
    category: "Caching",
    title: "Cache Penetration Attacks",
    content: "Occurs when requests query keys that do not exist, bypassing the cache and hitting the database every time. Prevent this by using Bloom Filters or caching empty/null values with a short TTL.",
    axiom: "Protect database resources from non-existent key lookups."
  },
  {
    id: 17,
    category: "Caching",
    title: "Cache Stampede (Thundering Herd)",
    content: "When a highly popular key expires, thousands of concurrent requests miss the cache and hit the database simultaneously. Prevent this using mutex locks (single flight) or background refreshes.",
    axiom: "Do not let a single cache expiration bring down your database."
  },
  {
    id: 18,
    category: "Caching",
    title: "Cache Eviction - Least Recently Used",
    content: "LRU evicts the key that hasn't been accessed for the longest period. It is implemented using a hash map combined with a doubly linked list to achieve O(1) read/write complexity.",
    axiom: "The industry standard for general-purpose cache recycling."
  },
  {
    id: 19,
    category: "Caching",
    title: "Cache Eviction - Least Frequently Used",
    content: "LFU keeps track of access frequency counts and evicts the key accessed the least number of times. Excellent for caching static resources that stay popular over long periods.",
    axiom: "Prevents caching items that were only accessed in a brief burst."
  },
  {
    id: 20,
    category: "Reliability",
    title: "CAP Theorem Breakdown",
    content: "In a distributed network partition (P), a system must trade off between Consistency (C) (all nodes show same data) and Availability (A) (all nodes respond without errors). You cannot have both.",
    axiom: "Network splits are inevitable; decide how your system fails."
  },
  {
    id: 21,
    category: "Reliability",
    title: "PACELC Theorem Extension",
    content: "If there is a Partition (P), CAP applies: choose Availability (A) or Consistency (C). Else (E), when the network is healthy, choose between Latency (L) and Consistency (C).",
    axiom: "Even healthy distributed systems trade consistency for speed."
  },
  {
    id: 22,
    category: "Reliability",
    title: "Strong Consistency Tradeoff",
    content: "Ensures all database replicas return the absolute latest write. Requires distributed locks or consensus protocols (e.g., Paxos, Raft), which increase write latency and fail if quorum is lost.",
    axiom: "Strong consistency guarantees correctness but limits performance."
  },
  {
    id: 23,
    category: "Reliability",
    title: "Eventual Consistency Advantages",
    content: "Replicas converge to the same state over time without synchronous locks. Achieves maximum availability and sub-millisecond writes, but readers may briefly see older data states.",
    axiom: "Perfect for social media feeds, checkouts, and non-financial data."
  },
  {
    id: 24,
    category: "Databases",
    title: "ACID Transaction Guarantees",
    content: "Atomicity (all-or-nothing), Consistency (state rules met), Isolation (no transaction interference), Durability (written to disk). Crucial for banking and transactional operations.",
    axiom: "Relational database index systems enforce safety via strict logging."
  },
  {
    id: 25,
    category: "Databases",
    title: "BASE Database Properties",
    content: "Basically Available (system functions under failure), Soft State (data can drift without locks), Eventual Consistency (converges). Common in distributed NoSQL storage like DynamoDB.",
    axiom: "Trade transaction isolation to achieve horizontal scalability."
  },
  {
    id: 26,
    category: "Databases",
    title: "B-Tree Indexes",
    content: "B-Tree indexes are optimized for random read/write lookups and fast range queries. They maintain sorted, balanced nodes on disk, providing consistent O(log N) lookup time.",
    axiom: "The default indexing mechanism for relational DBs (MySQL, Postgres)."
  },
  {
    id: 27,
    category: "Databases",
    title: "LSM-Tree Indexes",
    content: "Log-Structured Merge-Trees write first to memory buffers (MemTable), then flush sequentially to immutable files (SSTables) on disk. Extremely high write throughput.",
    axiom: "The storage engine behind Cassandra, RocksDB, and Bigtable."
  },
  {
    id: 28,
    category: "Databases",
    title: "Database Sharding - Range-Based",
    content: "Splitting data across shards using key ranges (e.g., Usernames A-D on Shard 1, E-H on Shard 2). Simple to reason about, but creates massive hot spots on popular letters.",
    axiom: "Avoid range sharding if data distribution is highly skewed."
  },
  {
    id: 29,
    category: "Databases",
    title: "Database Sharding - Hash-Based",
    content: "Hashes the shard key and uses modulo arithmetic to determine the target database server. Provides uniform data distribution, but adding new shards requires full data re-sharding.",
    axiom: "Use consistent hashing instead of simple modulo if shards scale dynamically."
  },
  {
    id: 30,
    category: "Databases",
    title: "Master-Slave (Read Replicas)",
    content: "All writes go to a single Master node; reads are offloaded to multiple slave replicas. Excellent for read-heavy sites, but slave lag means reads can return stale data.",
    axiom: "Offload database reads to slaves to scale relational databases."
  },
  {
    id: 31,
    category: "Databases",
    title: "Multi-Master Replication Conflicts",
    content: "Allows multiple database servers to accept writes, replicating changes bidirectionally. Eliminates single write bottlenecks but introduces nightmare clock-drift and data conflict resolution.",
    axiom: "Avoid multi-master setups unless absolutely necessary."
  },
  {
    id: 32,
    category: "Databases",
    title: "Write-Ahead Log (WAL)",
    content: "Before any database page is modified on disk, the change is written sequentially to an append-only log. This ensures durability in the event of a power cut or crash.",
    axiom: "Sequentially appending transactions is the core of database crash recovery."
  },
  {
    id: 33,
    category: "Databases",
    title: "NoSQL Document Stores",
    content: "Stores semi-structured data as JSON/BSON documents. Ideal for flexible schemas, catalogs, and rapid development where relations between entities are minimal.",
    axiom: "Choose document stores (MongoDB) for agile schemas and nested data."
  },
  {
    id: 34,
    category: "Databases",
    title: "NoSQL Key-Value Stores",
    content: "Optimized for storing simple key-value pairs with sub-millisecond lookup speeds. Best for storing temporary user sessions, authentication tokens, and shopping carts.",
    axiom: "Maximum speed for isolated key access patterns."
  },
  {
    id: 35,
    category: "Databases",
    title: "NoSQL Wide-Column Stores",
    content: "Stores data in column families instead of rows. Allows querying massive amounts of sparse data across thousands of commodity servers with no single point of failure.",
    axiom: "Ideal for time-series, log ingestion, and big data analysis (Cassandra)."
  },
  {
    id: 36,
    category: "Databases",
    title: "NoSQL Graph Databases",
    content: "Uses nodes, edges, and properties to represent and store connected data. Designed to perform deep traversal queries (friends of friends, fraud rings) in constant time.",
    axiom: "Use graphs (Neo4j) when relationships are as important as the data."
  },
  {
    id: 37,
    category: "Rate Limiting",
    title: "Token Bucket Algorithm",
    content: "A bucket holds tokens up to a limit. Tokens are added at a constant rate. Requests consume a token to pass. It naturally allows bursts of traffic while enforcing a strict long-term rate.",
    axiom: "The standard algorithm for handling traffic spikes gracefully."
  },
  {
    id: 38,
    category: "Rate Limiting",
    title: "Leaky Bucket Algorithm",
    content: "Requests are queued in a bucket that leaks at a constant, steady rate. Smooths out bursts into a uniform output flow. However, it can delay request execution under sudden traffic spikes.",
    axiom: "Excellent for traffic shaping and protecting downstream APIs from bursts."
  },
  {
    id: 39,
    category: "Rate Limiting",
    title: "Sliding Window Counter",
    content: "Combines the low-memory footprint of fixed-window limiting with the accuracy of sliding logs. Uses weighted counts from the current and previous window to block boundary attacks.",
    axiom: "Highly accurate rate limiting with minimal memory footprint."
  },
  {
    id: 40,
    category: "Messaging",
    title: "Fan-Out Messaging Pattern",
    content: "A message publisher broadcasts a single event to a message broker, which automatically duplicates and pushes it to multiple distinct subscriber queues for parallel consumption.",
    axiom: "Enables effortless addition of new consumer microservices without core edits."
  },
  {
    id: 41,
    category: "Messaging",
    title: "Exactly-Once Message Delivery",
    content: "Exactly-once is mathematically impossible without end-to-end coordination. We achieve this by combining 'At-Least-Once' delivery with strict 'Idempotent' consumer logic.",
    axiom: "Design consumer systems to handle duplicate messages safely."
  },
  {
    id: 42,
    category: "Messaging",
    title: "Dead Letter Queue (DLQ)",
    content: "When a message repeatedly fails to be processed due to a parsing or business logic bug, route it to a Dead Letter Queue instead of retrying forever and blocking the main pipeline.",
    axiom: "Isolate toxic messages to preserve message queue throughput."
  },
  {
    id: 43,
    category: "Messaging",
    title: "Kafka Topic Partitions",
    content: "Kafka splits topics into multiple physical partitions stored on different brokers. This design enables horizontal scale, as multiple consumers can read partitions concurrently.",
    axiom: "Partitions are the atomic unit of scaling in Kafka."
  },
  {
    id: 44,
    category: "Protocols",
    title: "TCP vs. UDP Core Choice",
    content: "TCP uses a 3-way handshake to guarantee ordered, lossless data delivery. UDP is connectionless and fast but permits packet loss. Choose UDP for gaming, voice, and live video streaming.",
    axiom: "Trade reliability for speed in real-time streaming contexts."
  },
  {
    id: 45,
    category: "Protocols",
    title: "HTTP/2 Multiplexing",
    content: "Unlike HTTP/1.1 which requires separate TCP connections for concurrent downloads, HTTP/2 allows multiplexing multiple requests and responses over a single TCP connection, eliminating bottlenecks.",
    axiom: "Solves browser head-of-line blocking natively."
  },
  {
    id: 46,
    category: "Protocols",
    title: "gRPC & Protocol Buffers",
    content: "gRPC uses binary serialization (Protobuf) over HTTP/2 instead of text-based JSON over HTTP/1. It is 5x to 10x faster, strictly typed, and supports bidirectional streaming.",
    axiom: "The gold standard for internal microservice-to-microservice RPCs."
  },
  {
    id: 47,
    category: "Protocols",
    title: "WebSockets vs. HTTP",
    content: "WebSockets establish a persistent, full-duplex, bi-directional TCP connection. Perfect for real-time applications, bypassing the overhead of repeatedly sending heavy HTTP request headers.",
    axiom: "Use WebSockets when clients require instant, bi-directional event streaming."
  },
  {
    id: 48,
    category: "Protocols",
    title: "HTTP Long Polling Efficiency",
    content: "In long polling, the server keeps the HTTP request open until new data is available. Reduces client polling frequency, but holding thousands of open idle connections consumes server memory.",
    axiom: "A lightweight alternative to WebSockets when data changes infrequently."
  },
  {
    id: 49,
    category: "Protocols",
    title: "Server-Sent Events (SSE)",
    content: "SSE provides a persistent, one-way push stream from the server to the client over standard HTTP. It has automatic reconnection support and is lighter than WebSockets.",
    axiom: "Use SSE when you only need one-way data streaming (e.g., dashboards, feeds)."
  },
  {
    id: 50,
    category: "Reliability",
    title: "The Saga Pattern",
    content: "Sagas manage distributed transactions across microservices by executing a chain of local transactions. If one step fails, the Saga orchestrates compensating rollback transactions.",
    axiom: "Solves distributed consistency without relying on blocking database locks."
  },
  {
    id: 51,
    category: "Reliability",
    title: "Circuit Breaker Pattern",
    content: "Monitors outbound calls to external services. If failures cross a threshold, the breaker trips (opens), immediately failing subsequent calls to protect resources and allow the service to recover.",
    axiom: "Fail fast to prevent cascading system-wide crashes."
  },
  {
    id: 52,
    category: "Reliability",
    title: "Bulkhead Architecture Pattern",
    content: "Isolates resources (like thread pools, CPU, or database connections) into isolated compartments. A failure or traffic spike in one pool cannot consume resources in another.",
    axiom: "Keep service failures contained to prevent complete ship-wide sinking."
  },
  {
    id: 53,
    category: "Reliability",
    title: "Exponential Backoff & Jitter",
    content: "When retrying failed network calls, double the delay between retries to prevent hammering a recovering database. Always add a random offset (jitter) to prevent synchronized retry storms.",
    axiom: "Never retry failed API requests on a fixed interval."
  },
  {
    id: 54,
    category: "Reliability",
    title: "Graceful Degradation Strategy",
    content: "Under extreme load, dynamically disable secondary non-critical features (like recommended items or live feed widgets) to ensure primary operations (checkout, login) survive.",
    axiom: "A partially degraded system is infinitely better than a crashed one."
  },
  {
    id: 55,
    category: "Scalability",
    title: "Designing Idempotent APIs",
    content: "Ensure duplicate HTTP requests produce the same side-effect. Implement this by tracking unique client-submitted 'Idempotency Keys' in a fast Redis cache, blocking double charges.",
    axiom: "Essential for reliable networks where packets can duplicate."
  },
  {
    id: 56,
    category: "Scalability",
    title: "Stateless App Servers",
    content: "Store zero session state on application servers. Offload user sessions to a shared, high-availability Redis cache. This allows you to auto-scale servers up or down instantly.",
    axiom: "Statelessness is the foundation of modern cloud auto-scaling."
  },
  {
    id: 57,
    category: "Networking",
    title: "Anycast DNS Routing",
    content: "Anycast DNS routes client queries to the topologically nearest physical server sharing the same IP address. This distributes global DNS query loads and reduces connection latency.",
    axiom: "Slashes name resolution times globally."
  },
  {
    id: 58,
    category: "Scalability",
    title: "Sticky Sessions Cache Risk",
    content: "Sticky sessions route a user's requests to the same server to utilize local memory. However, if that server crashes, the user loses their session, and load distribution is highly uneven.",
    axiom: "Avoid sticky sessions; use shared external session stores instead."
  },
  {
    id: 59,
    category: "Scalability",
    title: "Back-of-the-Envelope Math Rule",
    content: "Keep these ratios memorized: 1 Million requests per day is ~12 requests/second. 100 Million requests/day is ~1,150 requests/second. Knowing these saves hours in system design interviews.",
    axiom: "Convert total daily volumes to RPS first to choose your scaling tiers."
  },
  {
    id: 60,
    category: "Storage",
    title: "Object Storage vs. Block Storage",
    content: "Object storage (S3) stores files flat without a directory tree, making it infinitely scalable and cheap. Block storage (EBS) is mapped like a raw hard drive, enabling ultra-fast random access.",
    axiom: "Use object storage for static media; use block storage for database engines."
  },
  {
    id: 61,
    category: "Scalability",
    title: "Hot Spot Sharding Mitigation",
    content: "If a celebrity user (like a major brand account) generates 99% of database traffic, append a random two-digit salt to their partition key to distribute their data across multiple shards.",
    axiom: "High-cardinality shard keys prevent single-server write hot spots."
  },
  {
    id: 62,
    category: "Caching",
    title: "Read-Through Cache Pattern",
    content: "The cache sits directly between the application and the database. The application talks only to the cache. On a miss, the cache fetches from the database, updating itself transparently.",
    axiom: "Abstracts cache updating logic away from core application code."
  },
  {
    id: 63,
    category: "Caching",
    title: "Bloom Filters Explained",
    content: "A space-efficient probabilistic data structure. It tells you if an item is 'definitely not' in a set or 'might be'. Uses zero false negatives, protecting your DB from redundant lookups.",
    axiom: "Filter out non-existent keys before they ever query your primary database."
  },
  {
    id: 64,
    category: "Databases",
    title: "Relational Index Cost Tradeoffs",
    content: "Indexes drastically speed up `SELECT` read queries but degrade `INSERT`, `UPDATE`, and `DELETE` speeds because the database must keep the underlying index trees (B-Trees) balanced.",
    axiom: "Do not blindly index every column; select based on query frequency."
  },
  {
    id: 65,
    category: "Databases",
    title: "Intentional Data Denormalization",
    content: "In NoSQL or high-scale relational systems, replicate critical fields across tables to avoid expensive multi-table joins. This trades storage space and write simplicity for ultra-fast reads.",
    axiom: "Disk space is cheap; query latency is expensive."
  },
  {
    id: 66,
    category: "Databases",
    title: "Optimistic Concurrency Control (OCC)",
    content: "Uses a version number column. Before updating, checks if the version matches the read version. If it does, increments the version. If not, rejects the update. Highly scalable.",
    axiom: "Best for read-heavy systems with low write collision risk."
  },
  {
    id: 67,
    category: "Databases",
    title: "Pessimistic Row-Level Locking",
    content: "Strictly locks database rows (e.g., using `SELECT FOR UPDATE`) to prevent concurrent modification. Guarantees absolute safety, but degrades system throughput and causes deadlocks under load.",
    axiom: "Use only when financial correctness outweighs system scale."
  },
  {
    id: 68,
    category: "Scalability",
    title: "API Gateway Roles",
    content: "Acts as a single entry point for client traffic. Consolidates cross-cutting concerns like OAuth2 authentication, rate limiting, SSL termination, request routing, and metric collection.",
    axiom: "Shield internal microservices from direct internet exposure."
  },
  {
    id: 69,
    category: "Reliability",
    title: "Service Mesh vs. API Gateway",
    content: "An API Gateway manages external client-to-server traffic (North-South). A Service Mesh (like Istio or Linkerd) manages internal microservice-to-microservice traffic (East-West).",
    axiom: "Use gateways for external security; use service meshes for internal networking."
  },
  {
    id: 70,
    category: "Databases",
    title: "CQRS Architectural Pattern",
    content: "Command Query Responsibility Segregation separates read models from write models. Writes write to a normalized database, which asynchronously syncs to a highly indexed read-only datastore.",
    axiom: "Decouple read and write paths to optimize performance independently."
  },
  {
    id: 71,
    category: "Reliability",
    title: "Active-Passive DB Failovers",
    content: "The primary database (Active) handles writes and streams updates to a secondary database (Passive). If the active node crashes, the secondary node must be promoted to master.",
    axiom: "Automated failovers require robust heartbeats to prevent split-brain issues."
  },
  {
    id: 72,
    category: "Reliability",
    title: "Active-Active DB Replication",
    content: "Both database nodes accept concurrent read and write operations, syncing updates asynchronously. High write availability, but resolving conflicting writes is extremely complex.",
    axiom: "Use conflicts-free replicated data types (CRDTs) to handle dual-write overlaps."
  },
  {
    id: 73,
    category: "Reliability",
    title: "Heartbeat Fault Detection",
    content: "Workers or secondary servers send lightweight, periodic health packets to the cluster coordinator. If a worker misses multiple consecutive heartbeats, the coordinator reschedules its jobs.",
    axiom: "The foundational mechanism for automated distributed failure recovery."
  },
  {
    id: 74,
    category: "Reliability",
    title: "The Split-Brain Nightmare",
    content: "Occurs when a cluster network partitions, and both isolated halves elect a separate master, corrupting the database. Prevent this by enforcing strict quorum rules (consensus of > 50% nodes).",
    axiom: "A partition requires a majority quorum to elect a leader."
  },
  {
    id: 75,
    category: "Networking",
    title: "Gossip Protocol Scaling",
    content: "A peer-to-peer communication protocol where nodes share cluster metadata randomly with a few neighbors. Information spreads exponentially, like a virus, ensuring high decentralized scale.",
    axiom: "Enables multi-thousand-node databases (like Cassandra) to sync state without a central coordinator."
  },
  {
    id: 76,
    category: "Reliability",
    title: "SLA vs. SLO vs. SLI Metrics",
    content: "SLA is the legal uptime agreement with users (e.g., 99.9%). SLO is the internal engineering goal (e.g., 99.95%). SLI is the actual real-time measurement of system uptime.",
    axiom: "SLOs must always be stricter than SLAs to catch issues before legal penalties trigger."
  },
  {
    id: 77,
    category: "Reliability",
    title: "The Cost of High Availability (Uptime 9s)",
    content: "99% availability allows 3.65 days of downtime/year. 99.999% ('Five 9s') allows only 5.26 minutes of downtime/year. Moving up a single decimal place exponentially increases design complexity.",
    axiom: "Only design for 99.999% if human lives or massive financial assets depend on it."
  },
  {
    id: 78,
    category: "Reliability",
    title: "Health vs. Readiness Probes",
    content: "A Health probe checks if a container is running (if it fails, Kubernetes restarts it). A Readiness probe checks if a service is initialized and ready to handle active customer traffic.",
    axiom: "Do not send customer traffic to containers before readiness checks pass."
  },
  {
    id: 79,
    category: "Reliability",
    title: "Chaos Engineering in Production",
    content: "The practice of intentionally injecting real-world failures (like randomly killing VM nodes, blocking network ports, or introducing network latency) to verify system resilience.",
    axiom: "Verify system self-healing under safe, controlled failure simulations."
  },
  {
    id: 80,
    category: "Reliability",
    title: "Distributed Tracing Architecture",
    content: "Injects a unique `Trace-ID` header at the API gateway. As the request cascades across dozens of downstream microservices, the tracer logs execution spans, exposing latency bottlenecks.",
    axiom: "Essential for debugging latency across complex microservice networks."
  },
  {
    id: 81,
    category: "Latency",
    title: "P99 and P99.9 Tail Latencies",
    content: "Never optimize based on average latency (P50). A low average can mask a terrible experience for 1% of your users. Monitor the P99 or P99.9 percentiles to capture heavy-user issues.",
    axiom: "The P99.9 tail latency is what kills customer satisfaction."
  },
  {
    id: 82,
    category: "Security",
    title: "Single Sign-On (SSO) Flow",
    content: "SSO delegates authentication to an Identity Provider (IdP). Upon login, the IdP issues a signed token (OIDC/SAML) that downstream apps verify cryptographically without seeing user passwords.",
    axiom: "Centralize credential storage to minimize corporate security attack surfaces."
  },
  {
    id: 83,
    category: "Security",
    title: "JWT Token Revocation Risks",
    content: "JSON Web Tokens are stateless and signed, meaning services can verify them without hitting a database. However, this makes them impossible to easily revoke before their expiration date.",
    axiom: "Keep JWT lifetimes short and use database-backed refresh tokens."
  },
  {
    id: 84,
    category: "Databases",
    title: "Horizontal Partitioning (Sharding)",
    content: "Horizontal partitioning splits rows of a table across multiple database engines. This keeps indexes small, prevents single-server disk limits, and parallelizes query executions.",
    axiom: "The ultimate pathway for scaling massive write volumes."
  },
  {
    id: 85,
    category: "Databases",
    title: "Vertical Table Partitioning",
    content: "Splits a table's columns into separate tables. For example, moving raw, multi-megabyte user biographies out of the core users table into a separate table to keep the main user index slim.",
    axiom: "Keep database pages packed with frequently read fields."
  },
  {
    id: 86,
    category: "Databases",
    title: "Change Data Capture (CDC)",
    content: "CDC monitors database transaction logs (WAL) in real-time, streaming insert/update operations directly to downstream systems like elasticsearch indexes or distributed caches.",
    axiom: "Sync indexes and caches asynchronously without complicating application logic."
  },
  {
    id: 87,
    category: "Messaging",
    title: "Push vs. Pull Queue Models",
    content: "Push models stream messages to consumers immediately, giving lowest latency but risking crashing slow workers. Pull models let consumers fetch messages when they have free capacity.",
    axiom: "Use pull-based message queues to handle highly variable consumer workloads."
  },
  {
    id: 88,
    category: "Databases",
    title: "Covering Indexes",
    content: "A covering index is a composite index that contains all the columns requested in the query's `SELECT` clause, allowing the database to return data without performing a disk seek on the main table.",
    axiom: "Covering indexes reduce database disk seek times to absolute zero."
  },
  {
    id: 89,
    category: "Databases",
    title: "The N+1 Query Problem",
    content: "Occurs when an app fetches a parent list (1 query) and then loops through it to execute a query for each child (N queries). Solve by pre-fetching relations using active table joins.",
    axiom: "Combine queries using joins to prevent network overhead bottlenecks."
  },
  {
    id: 90,
    category: "Networking",
    title: "DNS Propagation Cache Delays",
    content: "DNS records are heavily cached by operating systems, local routers, and ISP name servers. When updating IP addresses, expect traffic to trickle to the old server until the TTL expires.",
    axiom: "Lower DNS TTLs hours before performing major server migrations."
  },
  {
    id: 91,
    category: "Networking",
    title: "Pull CDN vs. Push CDN",
    content: "A Pull CDN automatically fetches and caches assets from your origin server on the first client request. A Push CDN requires your deployment pipeline to actively upload files to edge servers.",
    axiom: "Use Pull for automatic asset management; use Push for giant, scheduled releases."
  },
  {
    id: 92,
    category: "Networking",
    title: "GeoDNS Routing Mechanics",
    content: "GeoDNS inspects the incoming client's IP subnet during name resolution, returning different IP addresses mapped to the nearest physical datacenter region to reduce latency.",
    axiom: "Route traffic at the DNS layer to minimize user transit times."
  },
  {
    id: 93,
    category: "Caching",
    title: "Distributed Cache Replicas",
    content: "Replicating cache keys across multiple server nodes increases read performance and cluster reliability, but requires complex cache invalidation to prevent stale data drift.",
    axiom: "Replicated caches provide high availability but complicate data consistency."
  },
  {
    id: 94,
    category: "Scalability",
    title: "Highly Cardinal Shard Keys",
    content: "Always choose a partition key with high cardinality (many unique values, e.g., `transactionId`) instead of low cardinality (few unique values, e.g., `countryCode`) to avoid hot shard bottlenecks.",
    axiom: "High key variance is essential for balanced distributed scaling."
  },
  {
    id: 95,
    category: "Scalability",
    title: "The Serverless Cold Start Problem",
    content: "In Serverless computing (Lambda), a cold start occurs when an idle container is initialized to handle a request. Runtimes with light memory footprints (Go, Node) cold start much faster than Java.",
    axiom: "Keep container weights small to minimize initial function execution lag."
  },
  {
    id: 96,
    category: "Reliability",
    title: "Geographical Data Redundancy",
    content: "Store multiple redundant copies of critical databases across physically separated Availability Zones (AZs) and geographical regions to survive full datacenter power grids collapse.",
    axiom: "Redundancy across multiple fault domains is the baseline of high availability."
  },
  {
    id: 97,
    category: "Reliability",
    title: "Event Sourcing Pattern",
    content: "Instead of storing just the current state of a database row, event sourcing records every state change as an immutable stream of events. Allows perfect historical audits and rollbacks.",
    axiom: "Store events as the single source of truth; compute current state dynamically."
  },
  {
    id: 98,
    category: "Reliability",
    title: "Two-Phase Commit (2PC) Performance",
    content: "A distributed algorithm that coordinates multiple nodes to commit a transaction. It guarantees absolute consistency but degrades throughput due to blocking locks during execution.",
    axiom: "Avoid 2PC in high-scale systems; use eventual consistency Sagas instead."
  },
  {
    id: 99,
    category: "Scalability",
    title: "Backpressure Traffic Shaping",
    content: "A mechanism where a downstream service signals upstream callers to throttle their request emissions when its queues or buffers are saturated, protecting it from crashing.",
    axiom: "Enforce backpressure upstream to prevent cascading queue collapses."
  },
  {
    id: 100,
    category: "Scalability",
    title: "Amdahl's Law of Parallelization",
    content: "States that the speedup of a program from parallel processing is strictly limited by the sequential (non-parallelizable) portion of the code. Adding 1000 cores won't help if 20% of work is sequential.",
    axiom: "Identify and eliminate serial execution bottlenecks before scaling hardware."
  }
];
