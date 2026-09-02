import { theme } from "../theme";

export const aiBlockScenarios = [
  {
    id: "AI-BLOCK-CCTV-003",
    type: "CCTV_BLOCK",
    target: "CAM-PLB-003 (Parking Lot B — Gate 3)",
    title: "CCTV Stream Blocked — PoE Port Failure",
    category: "Physical Security",
    severity: "high",
    detectedAt: "Just now",
    errorSummary: "RTSP stream terminated at port 12. Power draw spike of 18W exceeded IEEE 802.3af limit.",
    aiDiagnosis: {
      model: "CampusGuard Vision-Telemetry Transformer v3.4",
      confidence: 94.8,
      rootCause: "PoE distribution switch SW-CCTV-02 tripped port 12 into error-disable state after an 18W inrush current.",
      blastRadius: "Parking Lot B perimeter camera blackout. Adjacent cameras CAM-PLB-002 and CAM-PLB-004 unaffected.",
    },
    aiSolution: {
      actionName: "Auto-Cycle PoE Port & Elevate to 802.3at (PoE+)",
      steps: [
        "Reset power state on PoE Switch SW-CCTV-02 Port 12",
        "Negotiate 802.3at Type 2 power allocation (up to 30W buffer)",
        "Re-establish RTSP encrypted feed stream to NVR cluster",
        "Verify FPS (30 FPS) and latency (<40ms)"
      ],
      estimatedRecovery: "15 seconds",
      safetyInvariant: "Continuous voltage monitoring enabled to prevent hardware surge."
    }
  },
  {
    id: "AI-BLOCK-API-084",
    type: "API_BLOCK",
    target: "POST /api/v1/students/registration",
    title: "API Gateway Circuit Breaker Blocked (503 Outage)",
    category: "Core API Services",
    severity: "critical",
    detectedAt: "Just now",
    errorSummary: "API Gateway rate-limiter & circuit breaker tripped. 420 requests/sec exceeding 200 pool capacity.",
    aiDiagnosis: {
      model: "CampusGuard AIOps Causal Predictor v3.2",
      confidence: 97.2,
      rootCause: "HikariCP database connection pool exhaustion caused by concurrent course registration surge and slow sequential scan.",
      blastRadius: "Student registration portal experiencing 100% 503 Gateway Timeout for 1,200 active students.",
    },
    aiSolution: {
      actionName: "Scale Connection Pool & Route to Read Replica",
      steps: [
        "Dynamically expand HikariCP max pool size from 200 to 450 connections",
        "Offload student catalog read queries to PostgreSQL Read Replica PG-REP-02",
        "Enable token-bucket surge queue with graceful admission throttling",
        "Flush cached registration routes and verify response time (<120ms)"
      ],
      estimatedRecovery: "8 seconds",
      safetyInvariant: "ACID transaction integrity validated; zero dropped payment/registration records."
    }
  },
  {
    id: "AI-BLOCK-WIFI-012",
    type: "NETWORK_BLOCK",
    target: "AP-A2-01 (Building A — Floor 2)",
    title: "Wi-Fi Uplink Blocked — Switch Congestion",
    category: "Campus Network",
    severity: "critical",
    detectedAt: "2 mins ago",
    errorSummary: "Packet loss reached 100%. Core Switch SW-CORE-01 dropped HSRP standby negotiation.",
    aiDiagnosis: {
      model: "CampusGuard Network Causal Engine",
      confidence: 96.4,
      rootCause: "Secondary router RTR-BACKUP-01 had misconfigured priority 90 vs primary 110 during CPU overload.",
      blastRadius: "450+ student devices disconnected across Building A Floor 2.",
    },
    aiSolution: {
      actionName: "Elevate HSRP Priority & Failover to RTR-BACKUP-01",
      steps: [
        "Issue SNMP payload setting RTR-BACKUP-01 HSRP priority to 120 (preempt active)",
        "Reroute default gateway traffic through redundant fiber trunk Ring-2",
        "Cycle DHCP lease table on AP-A2-01",
        "Verify zero-packet-loss ping response to gateway"
      ],
      estimatedRecovery: "12 seconds",
      safetyInvariant: "Safety Gate verified: isolated to Building A without campus-wide route flap."
    }
  }
];
