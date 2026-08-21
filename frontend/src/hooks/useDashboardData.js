import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api.js";

const POLL_MS = 5000;

export function useDashboardData() {
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [resourceHistory, setResourceHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const inFlight = useRef(false);

  const HISTORY_POINTS = 20;

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const [statsRes, servicesRes, incidentsRes, alertsRes] = await Promise.all([
        api.stats(),
        api.services(),
        api.incidents({ limit: 100 }),
        api.alerts(20),
      ]);

      // Attach latest metric snapshot to each service for the health table.
      const withMetrics = await Promise.all(
        servicesRes.map(async (svc) => {
          try {
            const m = await api.serviceMetrics(svc.id, 1);
            return { ...svc, latest_metric: m[0] || null };
          } catch {
            return { ...svc, latest_metric: null };
          }
        })
      );

      // Build an averaged CPU / Memory / Network(latency-normalized) series
      // across all services, aligned by recency index (ticks run in lockstep).
      const histories = await Promise.all(
        servicesRes.map((svc) => api.serviceMetrics(svc.id, HISTORY_POINTS).catch(() => []))
      );
      const maxLen = Math.max(0, ...histories.map((h) => h.length));
      const series = [];
      for (let i = 0; i < maxLen; i++) {
        let cpuSum = 0, memSum = 0, latSum = 0, n = 0;
        histories.forEach((h) => {
          const point = h[i];
          if (!point) return;
          cpuSum += point.cpu_usage ?? 0;
          memSum += point.memory_usage ?? 0;
          latSum += point.network_latency ?? 0;
          n += 1;
        });
        if (n === 0) continue;
        series.push({
          index: i,
          cpu: Math.round(cpuSum / n),
          memory: Math.round(memSum / n),
          // Normalize latency (ms) onto a 0-100 "network load" style scale for the chart.
          network: Math.min(100, Math.round((latSum / n / 500) * 100)),
        });
      }

      setStats(statsRes);
      setServices(withMetrics);
      setIncidents(incidentsRes);
      setAlerts(alertsRes);
      setResourceHistory(series);
      setError(null);
    } catch (e) {
      setError(e.message || "Failed to reach CampusGuard API");
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { stats, services, incidents, alerts, resourceHistory, error, loading, refresh };
}
