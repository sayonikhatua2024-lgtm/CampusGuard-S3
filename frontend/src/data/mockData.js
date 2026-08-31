import { theme } from "../theme";

export const initialIncidents = [
  {
    id: "INC-2024-0847",
    title: "Wi-Fi Network Downtime",
    severity: "critical",
    status: "active",
    location: "Building A — Floor 2",
    timestamp: "14:32:18",
    affectedSystems: 12,
    category: "Network",
    description:
      "Complete Wi-Fi outage detected affecting 450+ connected devices across Building A, second floor. Access point AP-A2-01 ceased responding to SNMP queries at 14:32. Packet loss at 100%. Users report full connectivity loss.",
    rootCause:
      "Main router SW-CORE-01 load exceeded 95% capacity triggering fail-safe shutdown. Secondary router RTR-BACKUP-01 failed to assume primary role due to misconfigured HSRP priority (set to 90 instead of 110).",
    aiConfidence: 92,
    estimatedRecovery: "5–10 min"
  },
  {
    id: "INC-2024-0846",
    title: "CCTV Camera Offline",
    severity: "high",
    status: "investigating",
    location: "Parking Lot B — Gate 3",
    timestamp: "13:58:44",
    affectedSystems: 3,
    category: "Physical Security",
    description:
      "Security camera CAM-PLB-003 at Parking Lot B Gate 3 went offline. No video feed. Adjacent cameras CAM-PLB-002 and CAM-PLB-004 remain operational. PoE switch SW-CCTV-02 shows port 12 in error-disabled state.",
    rootCause:
      "PoE switch port failure on SW-CCTV-02, port 12. Camera power draw spike of 18W detected 3 minutes before failure, exceeding the 15.4W 802.3af limit.",
    aiConfidence: 87,
    estimatedRecovery: "15–20 min"
  },
  {
    id: "INC-2024-0845",
    title: "High CPU Usage — SRV-RACK4-07",
    severity: "high",
    status: "investigating",
    location: "Server Room — Rack 4",
    timestamp: "13:21:05",
    affectedSystems: 1,
    category: "Server",
    description:
      "Server SRV-RACK4-07 reporting sustained CPU utilization of 97% for 23 minutes. Top process: java (PID 14882) consuming 94% CPU across all 8 cores. Student portal response times degraded to 12–18 seconds.",
    rootCause:
      "Infinite loop in student registration batch processing job triggered by malformed CSV input file. Missing null-check on optional field 'transfer_credits' causing repeated retry cycles.",
    aiConfidence: 96,
    estimatedRecovery: "2–5 min"
  },
  {
    id: "INC-2024-0844",
    title: "Database Connection Pool Exhausted",
    severity: "medium",
    status: "resolved",
    location: "Data Center — DB Cluster",
    timestamp: "12:47:33",
    affectedSystems: 8,
    category: "Database",
    description:
      "Intermittent connection timeouts to primary PostgreSQL cluster PG-CLUSTER-01. Applications experiencing 2–5 second delays on queries. HikariCP connection pool exhaustion observed on 3 application servers.",
    rootCause:
      "Missing index on student_records.enrollment_date column causing sequential scans on a 4.2M row table. Peak load from course registration window saturated the 200-connection pool.",
    aiConfidence: 89,
    estimatedRecovery: "Resolved"
  }
];

export const iotSensors = [
  { name: "Temperature Sensors", count: 48, online: 46, value: "22.4", unit: "°C", trend: "+0.2°C", status: "warning", color: theme.orange, icon: "Thermometer" },
  { name: "Smoke Detectors", count: 32, online: 32, value: "All Clear", unit: "", trend: "", status: "healthy", color: theme.green, icon: "Flame" },
  { name: "Water Leak Sensors", count: 24, online: 23, value: "No Leaks", unit: "", trend: "", status: "healthy", color: theme.cyan, icon: "Droplets" },
  { name: "Power Monitoring", count: 16, online: 15, value: "284.7", unit: "kW", trend: "−3.1 kW", status: "warning", color: theme.purple, icon: "Zap" }
];

export const healthDistribution = [
  { name: "Healthy", value: 98, color: theme.green },
  { name: "Warning", value: 18, color: theme.orange },
  { name: "Critical", value: 7, color: theme.red },
  { name: "Maintenance", value: 5, color: theme.purple }
];

export const playbooks = [
  { id: "PB-001", name: "Router Failover Automation", category: "Network", lastRun: "2 hrs ago", success: 47, status: "active" },
  { id: "PB-002", name: "High CPU Auto-Restart", category: "Server", lastRun: "1 day ago", success: 128, status: "active" },
  { id: "PB-003", name: "DB Connection Pool Reset", category: "Database", lastRun: "4 hrs ago", success: 34, status: "active" },
  { id: "PB-004", name: "PoE Port Cycle (CCTV)", category: "Physical", lastRun: "6 hrs ago", success: 19, status: "active" },
  { id: "PB-005", name: "IoT Sensor Re-enrollment", category: "IoT", lastRun: "3 days ago", success: 8, status: "draft" },
  { id: "PB-006", name: "Firewall Rule Rollback", category: "Security", lastRun: "Never", success: 0, status: "draft" }
];

export const pipelineStages = [
  { id: "detect", label: "Detect", status: "complete" },
  { id: "diagnose", label: "Diagnose", status: "complete" },
  { id: "simulate", label: "Simulate", status: "complete" },
  { id: "approve", label: "Approve", status: "current" },
  { id: "execute", label: "Execute", status: "pending" },
  { id: "verify", label: "Verify", status: "pending" }
];

export const severityConfig = {
  critical: { color: theme.red, bg: "rgba(255,77,109,0.1)", label: "Critical" },
  high: { color: theme.orange, bg: "rgba(255,140,66,0.1)", label: "High" },
  medium: { color: theme.yellow, bg: "rgba(255,214,10,0.1)", label: "Medium" },
  low: { color: theme.cyan, bg: "rgba(0,212,255,0.1)", label: "Low" }
};

export const statusConfig = {
  active: { color: theme.red, label: "● Active" },
  investigating: { color: theme.orange, label: "◌ Investigating" },
  resolved: { color: theme.green, label: "✓ Resolved" }
};

export const telemetryMetrics = [
  { label: "SW-CORE-01 CPU Utilization", value: "95%", status: "critical", trend: "↑" },
  { label: "Memory Usage (Cluster PG-01)", value: "88%", status: "warning", trend: "↑" },
  { label: "Core Switch Packet Loss", value: "100%", status: "critical", trend: "↑" },
  { label: "Backbone Latency (Ring 1)", value: "1.2ms", status: "healthy", trend: "↓" }
];

export const cctvCameras = [
  { id: "CAM-A1-001", location: "Building A — Main Entrance", zone: "Block A", status: "online", fps: 30, res: "4K", bitrate: "8.2 Mbps", latency: "42ms" },
  { id: "CAM-A2-004", location: "Building A — Floor 2 Corridor", zone: "Block A", status: "online", fps: 25, res: "1080p", bitrate: "4.1 Mbps", latency: "38ms" },
  { id: "CAM-PLB-003", location: "Parking Lot B — Gate 3", zone: "Block B", status: "offline", fps: 0, res: "4K", bitrate: "0 Mbps", latency: "—" },
  { id: "CAM-SRV-001", location: "Server Room — Primary Vault", zone: "Block C", status: "online", fps: 30, res: "4K", bitrate: "9.0 Mbps", latency: "29ms" }
];
