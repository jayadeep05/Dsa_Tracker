// Backend Prep Roadmap — Structured content from content_w1w2.js + content_w3w7.js
// Phase/Week/Topic hierarchy with typed content blocks

export const PROJECT_MAP = {
  title: "Project Map — payment-wallet end state after Phase 1",
  description: "Read this before Day 1. Every file you write over the next 7 weeks lives somewhere in this structure. You are not building isolated exercises. You are building one real system.",
  packageRoot: "src/main/java/com/wallet/",
  structure: [
    "com.wallet",
    "├── PaymentWalletApplication.java          // entry point",
    "├── config/",
    "│   ├── SecurityConfig.java                // Spring Security + JWT filter chain",
    "│   └── AppConfig.java                     // ThreadPoolExecutor, WebClient beans",
    "├── controller/",
    "│   ├── AuthController.java                // /api/v1/auth/register, /login",
    "│   └── PaymentController.java             // /api/v1/payments",
    "├── service/",
    "│   ├── AuthService.java                   // registration, JWT generation",
    "│   ├── PaymentService.java                // core payment logic + @Transactional",
    "│   ├── BalanceManager.java                // thread-safe CAS balance operations",
    "│   ├── PaymentBatchProcessor.java         // CompletableFuture async pipeline",
    "│   ├── IdempotencyService.java            // dedup via idempotency keys",
    "│   └── ExternalPaymentGateway.java        // RestTemplate + retry logic",
    "├── repository/",
    "│   ├── UserRepository.java",
    "│   ├── WalletRepository.java",
    "│   └── TransactionRepository.java",
    "├── model/",
    "│   ├── User.java                          // JPA entity",
    "│   ├── Wallet.java                        // JPA entity, version field for optimistic lock",
    "│   └── Transaction.java                   // JPA entity, idempotency key, soft delete",
    "├── payment/",
    "│   ├── PaymentStrategy.java               // interface — Strategy pattern",
    "│   ├── UPIPayment.java                    // implements PaymentStrategy",
    "│   ├── CardPayment.java                   // implements PaymentStrategy",
    "│   └── PaymentContext.java                // holds current strategy — Context",
    "├── filter/",
    "│   ├── JwtAuthFilter.java                 // OncePerRequestFilter",
    "│   └── RequestIdFilter.java               // MDC correlation ID",
    "├── aspect/",
    "│   └── LoggingAspect.java                 // @Around service method timing",
    "├── exception/",
    "│   ├── GlobalExceptionHandler.java        // @RestControllerAdvice",
    "│   ├── InsufficientBalanceException.java",
    "│   └── IdempotencyConflictException.java",
    "└── dto/",
    "    ├── PaymentRequest.java                // Bean Validation annotations",
    "    └── PaymentResponse.java",
  ],
  testNote: "src/test/java/com/wallet/ mirrors the same structure. Every service class has a test class.",
  rootFiles: "Dockerfile, docker-compose.yml, .env.example, .gitignore, README.md",
  deliverables: [
    "User registers and logs in via JWT",
    "User has a wallet with a balance",
    "User can deposit and withdraw — thread-safe, idempotent",
    "All transactions are recorded with audit trail",
    "Concurrent requests handled correctly — no race conditions",
    "All endpoints protected by JWT auth",
    "Structured logging with correlation ID on every request",
    "Full Docker Compose setup — one command to run everything",
    "20+ tests covering core flows and edge cases",
  ],
};

export const PHASES = [
  {
    id: "phase1",
    title: "Phase 1 — Backend Engineering Foundations",
    weeks: ["w1", "w2", "w3", "w4", "w5", "w6", "w7"],
  },
];

export const WEEKS = {
  w1: {
    id: "w1", number: 1,
    title: "Java OOP Depth + Git + Maven + Testing Habit",
    goal: "Set up the project correctly. Understand OOP at the depth product companies test. Write your first real tests. Every concept broken deliberately before it is considered understood.",
    builds: [
      "payment-wallet project initialised on GitHub with clean structure",
      "PaymentStrategy interface + UPIPayment + CardPayment — Strategy pattern",
      "PaymentContext — holds and executes the current strategy",
      "Singleton JwtTokenProvider with volatile double-checked locking",
      "PaymentFactory — Factory pattern",
      "First 8 JUnit tests covering all classes built this week",
    ],
    days: ["w1d1","w1d2","w1d3","w1d4","w1d5","w1d6","w1d7"],
  },
  w2: {
    id: "w2", number: 2,
    title: "Java Internals: Collections + JVM Memory + LRU Cache",
    goal: "Understand how Java's core data structures work internally. Not just what they do — how they do it. Read the actual JDK source. Verify everything in code.",
    builds: [
      "HashMap collision demonstrator — verifies bucket behaviour",
      "LRUCache implementation using LinkedHashMap",
      "JVM memory analyser — heap vs stack demonstration",
      "Mockito introduced — all Week 1 service tests upgraded",
    ],
    days: ["w2d8","w2d9","w2d10","w2d11","w2d12","w2d13","w2d14"],
  },
  w3: {
    id: "w3", number: 3,
    title: "Java Concurrency Advanced + Docker Basics",
    goal: "Write thread-safe code confidently. Master ExecutorService, synchronized, volatile, CompletableFuture. Containerise the project with Docker so it runs anywhere.",
    builds: [
      "BalanceManager — thread-safe with AtomicLong",
      "PaymentBatchProcessor — CompletableFuture async pipeline",
      "Dockerfile + docker-compose.yml — MySQL + Redis locally",
      "Concurrency tests that verify thread safety",
    ],
    days: ["w3d15","w3d16","w3d17","w3d18","w3d19","w3d20","w3d21"],
  },
  w4: {
    id: "w4", number: 4,
    title: "HTTP Deep + Spring Boot Internals + JWT + AOP",
    goal: "Understand how Spring Boot works under the hood. Build the REST API. Add JWT auth. Wire AOP logging. Understand @Transactional failure modes.",
    builds: [
      "PaymentWalletApplication.java — Spring Boot entry point",
      "AuthController + PaymentController",
      "JwtAuthFilter + RequestIdFilter",
      "SecurityConfig",
      "LoggingAspect",
      "GlobalExceptionHandler",
    ],
    days: ["w4d22","w4d23","w4d24","w4d25","w4d26","w4d27","w4d28"],
  },
  w5: {
    id: "w5", number: 5,
    title: "JPA + SQL Depth + Indexes + Schema Patterns",
    goal: "Wire JPA entities. Build the real DB schema. Understand B-Tree indexes. Read EXPLAIN output. Apply all 4 fintech schema patterns. Measure real query performance.",
    builds: [
      "User, Account, Payment JPA entities",
      "Full production MySQL schema with indexes",
      "Optimistic locking via @Version",
      "Real performance numbers from EXPLAIN on 100k rows",
    ],
    days: ["w5d29","w5d30","w5d31","w5d32","w5d33","w5d34","w5d35"],
  },
  w6: {
    id: "w6", number: 6,
    title: "Redis Caching + Idempotency + Rate Limiting",
    goal: "Wire Redis into the Spring Boot API. Implement caching, idempotency, and rate limiting. All backed by real tests.",
    builds: [
      "AccountService — Redis cache on balance reads",
      "IdempotencyService — Redis-backed duplicate detection",
      "RateLimiterService — Redis Lua atomic rate limiting",
      "API consumption with WebClient + retry + timeout",
    ],
    days: ["w6d36","w6d37","w6d38","w6d39","w6d40","w6d41","w6d42"],
  },
  w7: {
    id: "w7", number: 7,
    title: "Integration Tests + Docker Polish + Phase 1 Checkpoint",
    goal: "Write integration tests with Testcontainers. Add the app to docker-compose. Write a professional README. Pass the Phase 1 checkpoint.",
    builds: [
      "Testcontainers integration tests",
      "Complete docker-compose with app + healthchecks",
      "Professional README with architecture diagram",
      "Phase 1 Final Checkpoint assessment",
    ],
    days: ["w7d43","w7d44","w7d45","w7d46","w7d47"],
  },
};

export const CHECKPOINT_ITEMS = {
  phase1: [
    { category: "Java Internals", items: [
      "Walk through HashMap.put() including treeification — 2 minutes",
      "Why ConcurrentHashMap does not allow null keys — 30 seconds",
      "LRU cache — code it from memory on paper — 15 minutes",
    ]},
    { category: "Concurrency", items: [
      "Race condition — show one in code, fix it three ways — 3 minutes",
      "CompletableFuture thenCompose vs thenCombine — when to use each — 1 minute",
      "Deadlock — what causes it, how you prevent it in a money transfer — 1 minute",
    ]},
    { category: "Spring Boot", items: [
      "@SpringBootApplication — what it expands to — 30 seconds",
      "Bean lifecycle — all steps in order — 2 minutes",
      "@Transactional 3 failure modes — name, explain, fix each — 3 minutes",
    ]},
    { category: "SQL", items: [
      "B-Tree index — how MySQL finds a row — 90 seconds",
      "EXPLAIN type=ALL — what it means, how to fix — 60 seconds",
      "Cursor pagination vs OFFSET — why OFFSET is dangerous — 60 seconds",
    ]},
    { category: "Project", items: [
      "docker-compose up — entire stack starts",
      "20+ tests pass with mvn clean test",
      "README explains every design decision",
      "POST /api/v1/payments works end to end with JWT",
    ]},
    { category: "System Design", items: [
      "Rate limiter design — deliver in 45 minutes using the 7-step framework",
    ]},
  ],
};

// Helper to get all topic IDs for a week
export function getWeekTopicIds(weekId) {
  return WEEKS[weekId]?.days || [];
}

// Helper to get all topic IDs for a phase
export function getPhaseTopicIds(phaseId) {
  const phase = PHASES.find(p => p.id === phaseId);
  if (!phase) return [];
  return phase.weeks.flatMap(wId => getWeekTopicIds(wId));
}

// Check if a week is unlocked based on progress
export function isWeekUnlocked(weekId, progress) {
  // All modules unlocked by default as requested
  return true;
}
