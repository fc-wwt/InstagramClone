# Health Endpoint Flow

This document provides a visual representation of how the health endpoint works.

## Request Flow

```mermaid
sequenceDiagram
    participant Client as Monitoring Service
    participant Health as Health Endpoint
    participant Firestore as Firestore DB
    participant Auth as Firebase Auth
    
    Client->>Health: GET /health
    activate Health
    
    Health->>Health: Initialize health check object
    
    par Firestore Check
        Health->>Firestore: Write test document
        alt Success
            Firestore-->>Health: Write successful
            Health->>Health: Set firestore: "healthy"
        else Failure
            Firestore-->>Health: Error
            Health->>Health: Set firestore: "unhealthy"
            Health->>Health: Set status: "degraded"
        end
    and Auth Check
        Health->>Auth: List users (limit 1)
        alt Success
            Auth-->>Health: Users retrieved
            Health->>Health: Set auth: "healthy"
        else Failure
            Auth-->>Health: Error
            Health->>Health: Set auth: "unhealthy"
            Health->>Health: Set status: "degraded"
        end
    end
    
    Health->>Health: Determine final status
    
    alt All Healthy
        Health-->>Client: 200 OK + health data
    else Degraded/Unhealthy
        Health-->>Client: 503 Service Unavailable + health data
    end
    
    deactivate Health
```

## Health Status State Machine

```mermaid
stateDiagram-v2
    [*] --> Checking: Request received
    
    Checking --> TestingFirestore: Initialize checks
    TestingFirestore --> TestingAuth: Firestore check complete
    
    TestingAuth --> EvaluatingStatus: Auth check complete
    
    EvaluatingStatus --> Healthy: All checks passed
    EvaluatingStatus --> Degraded: Some checks failed
    EvaluatingStatus --> Unhealthy: Critical error
    
    Healthy --> [*]: Return 200 OK
    Degraded --> [*]: Return 503
    Unhealthy --> [*]: Return 503
```

## Component Health Check Logic

```mermaid
flowchart TD
    Start([Health Check Request]) --> Init[Initialize Health Object]
    Init --> ParallelChecks{Run Parallel Checks}
    
    ParallelChecks --> FSCheck[Firestore Check]
    ParallelChecks --> AuthCheck[Auth Check]
    
    FSCheck --> FSWrite[Write Test Document]
    FSWrite --> FSSuccess{Success?}
    FSSuccess -->|Yes| FSHealthy[Set firestore: healthy]
    FSSuccess -->|No| FSUnhealthy[Set firestore: unhealthy]
    
    AuthCheck --> AuthList[List Users]
    AuthList --> AuthSuccess{Success?}
    AuthSuccess -->|Yes| AuthHealthy[Set auth: healthy]
    AuthSuccess -->|No| AuthUnhealthy[Set auth: unhealthy]
    
    FSHealthy --> Evaluate[Evaluate Overall Status]
    FSUnhealthy --> Evaluate
    AuthHealthy --> Evaluate
    AuthUnhealthy --> Evaluate
    
    Evaluate --> AllHealthy{All Healthy?}
    AllHealthy -->|Yes| Status200[Status: healthy<br/>Code: 200]
    AllHealthy -->|No| StatusDegraded[Status: degraded<br/>Code: 503]
    
    Status200 --> Response[Return JSON Response]
    StatusDegraded --> Response
    
    Response --> End([End])
    
    style Start fill:#4caf50
    style End fill:#4caf50
    style Status200 fill:#4caf50
    style StatusDegraded fill:#ff9800
    style FSUnhealthy fill:#f44336
    style AuthUnhealthy fill:#f44336
```

## Response Structure

```mermaid
classDiagram
    class HealthResponse {
        +String status
        +String timestamp
        +String service
        +String version
        +HealthChecks checks
        +String error
    }
    
    class HealthChecks {
        +String firestore
        +String auth
    }
    
    HealthResponse --> HealthChecks
    
    note for HealthResponse "status: 'healthy' | 'degraded' | 'unhealthy'"
    note for HealthChecks "Each check: 'healthy' | 'unhealthy' | 'unknown'"
```

## Monitoring Integration Flow

```mermaid
flowchart LR
    subgraph "Monitoring Service"
        A[UptimeRobot/Pingdom]
        B[Alert System]
    end
    
    subgraph "Instagram Clone Backend"
        C[Health Endpoint]
        D[Firestore]
        E[Firebase Auth]
    end
    
    subgraph "Notification Channels"
        F[Email]
        G[SMS]
        H[Slack]
        I[PagerDuty]
    end
    
    A -->|Poll every 1-5 min| C
    C -->|Check| D
    C -->|Check| E
    C -->|Response| A
    
    A -->|Status != 200| B
    A -->|Status != healthy| B
    
    B --> F
    B --> G
    B --> H
    B --> I
    
    style C fill:#4caf50
    style D fill:#ffa726
    style E fill:#ffa726
    style B fill:#f44336
```

## Error Handling Flow

```mermaid
flowchart TD
    Start([Request Received]) --> TryCatch{Try Block}
    
    TryCatch -->|Success| HealthChecks[Perform Health Checks]
    TryCatch -->|Exception| CatchBlock[Catch Block]
    
    HealthChecks --> CheckFS[Check Firestore]
    CheckFS --> FSError{Error?}
    FSError -->|Yes| FSCatch[Catch & Mark Unhealthy]
    FSError -->|No| FSSuccess[Mark Healthy]
    
    HealthChecks --> CheckAuth[Check Auth]
    CheckAuth --> AuthError{Error?}
    AuthError -->|Yes| AuthCatch[Catch & Mark Unhealthy]
    AuthError -->|No| AuthSuccess[Mark Healthy]
    
    FSCatch --> Evaluate[Evaluate Status]
    FSSuccess --> Evaluate
    AuthCatch --> Evaluate
    AuthSuccess --> Evaluate
    
    Evaluate --> Return200or503[Return 200 or 503]
    
    CatchBlock --> Return503[Return 503 Unhealthy]
    
    Return200or503 --> End([End])
    Return503 --> End
    
    style Start fill:#4caf50
    style End fill:#4caf50
    style CatchBlock fill:#f44336
    style Return503 fill:#f44336
    style FSCatch fill:#ff9800
    style AuthCatch fill:#ff9800
```

## Usage Examples

### Successful Health Check

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "instagram-clone-backend",
  "version": "1.0.0",
  "checks": {
    "firestore": "healthy",
    "auth": "healthy"
  }
}
```

### Degraded Service

```json
{
  "status": "degraded",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "instagram-clone-backend",
  "version": "1.0.0",
  "checks": {
    "firestore": "unhealthy",
    "auth": "healthy"
  }
}
```

### Complete Failure

```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "instagram-clone-backend",
  "error": "Unexpected error occurred"
}
```

## Performance Characteristics

- **Average Response Time**: < 500ms
- **Timeout**: 60s (Firebase Cloud Functions default)
- **Cold Start**: 1-3s (first request after idle)
- **Warm Response**: 100-300ms
- **Concurrent Requests**: Handled independently

## Best Practices

1. **Polling Interval**: 1-5 minutes for production
2. **Timeout Setting**: 10 seconds for monitoring tools
3. **Alert Threshold**: 2-3 consecutive failures before alerting
4. **Response Time Alert**: > 5 seconds
5. **Status Code Monitoring**: Alert on non-200 responses

---

For implementation details, see [HEALTH_ENDPOINT.md](HEALTH_ENDPOINT.md)
