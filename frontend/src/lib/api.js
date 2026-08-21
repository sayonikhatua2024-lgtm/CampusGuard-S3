const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const TOKEN_KEY = "campusguard_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    throw new ApiError("Session expired. Please sign in again.", 401);
  }
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {
      /* no-op: body wasn't JSON */
    }
    throw new ApiError(detail, res.status);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (username, password) =>
    request("/api/auth/login", { method: "POST", body: { username, password }, auth: false }),
  stats: () => request("/api/dashboard/stats"),
  services: () => request("/api/dashboard/services"),
  serviceMetrics: (serviceId, limit = 1) =>
    request(`/api/dashboard/services/${serviceId}/metrics?limit=${limit}`),
  incidents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/incidents${qs ? `?${qs}` : ""}`);
  },
  alerts: (limit = 20) => request(`/api/alerts?limit=${limit}`),
  ackAlert: (alertId) => request(`/api/alerts/${alertId}/ack`, { method: "POST" }),
  overrideIncident: (incidentId, action) =>
    request("/api/incidents/override", { method: "POST", body: { incident_id: incidentId, action } }),
};

export { ApiError };
