// Dashboard.jsx
import React from "react";
import axios from "axios";
import {
  PieChart,
  BarChart3,
  Globe,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  Zap,
  CheckCircle2,
} from "lucide-react";

/* ---------------------------
  Helper: fetch wrapper to include optional token & cancellation
   --------------------------- */
async function fetchWithToken(url, opts = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const merged = { ...opts, headers };
  return axios.get(url, merged);
}

/* ===========================
   ResolutionMetrics Component
   GET /api/incidents/kpi/resolution?range={range}
   =========================== */
function ResolutionMetrics({ baseUrl = "http://localhost:5000", range = 30 }) {
  const [state, setState] = React.useState({ loading: true, error: null, data: null });

  React.useEffect(() => {
    const source = axios.CancelToken.source();
    let mounted = true;
    (async () => {
      setState({ loading: true, error: null, data: null });
      try {
        const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/resolution`, {
          params: { range },
          timeout: 15000,
          cancelToken: source.token,
        });
        if (!mounted) return;
        setState({ loading: false, error: null, data: res.data });
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) console.error("ResolutionMetrics:", err);
        setState({ loading: false, error: err.response?.data?.message || err.message || "Error", data: null });
      }
    })();
    return () => {
      mounted = false;
      source.cancel("unmount");
    };
  }, [baseUrl, range]);

  const { loading, error, data } = state;

  if (loading) return <WidgetShell title="Resolution Metrics" loading />;
  if (error) return <WidgetShell title="Resolution Metrics" error={error} />;

  const total = data?.totalIncidents ?? 0;
  const resolved = data?.resolvedIncidents ?? 0;
  const rate = data?.resolutionRate ?? "0%";
  const avgDays = data?.avgResolutionDays ?? "—";
  const percent = total ? Math.round((resolved / total) * 100) : 0;

  return (
    <WidgetShell title="Resolution Metrics">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Stat label="Total Incidents" value={total} />
        <Stat label="Resolved" value={resolved} accent="green" />
        <Stat label="Resolution Rate" value={rate} />
      </div>

      <div className="bg-gray-900/40 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Completion Progress</div>
              <div className="text-sm font-bold text-green-400">{percent}%</div>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div style={{ width: `${percent}%` }} className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
            </div>
            <div className="mt-3 text-xs text-gray-400">Avg resolution: <span className="font-semibold text-white">{avgDays !== null ? `${avgDays} days` : "—"}</span></div>
          </div>
          <div className="ml-6 w-40 text-center">
            <div className="text-xs text-gray-400 uppercase">Avg Resolution Time</div>
            <div className="text-3xl font-bold text-white mt-2">{avgDays !== null ? avgDays : "—"}</div>
            <div className="text-xs text-gray-500">days / incident</div>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}

/* ===========================
   VelocityMetrics Component
   GET /api/incidents/kpi/velocity?range={range}
   =========================== */
function VelocityMetrics({ baseUrl = "http://localhost:5000", range = 30 }) {
  const [state, setState] = React.useState({ loading: true, error: null, data: null });

  React.useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();
    (async () => {
      setState({ loading: true, error: null, data: null });
      try {
        const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/velocity`, {
          params: { range },
          timeout: 15000,
          cancelToken: source.token,
        });
        if (!mounted) return;
        setState({ loading: false, error: null, data: res.data });
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) console.error("VelocityMetrics:", err);
        setState({ loading: false, error: err.response?.data?.message || err.message || "Error", data: null });
      }
    })();
    return () => { mounted = false; source.cancel("unmount"); };
  }, [baseUrl, range]);

  const { loading, error, data } = state;
  if (loading) return <WidgetShell title="Incident Velocity" loading />;
  if (error) return <WidgetShell title="Incident Velocity" error={error} />;

  const daily = Array.isArray(data?.dailyVelocity) ? data.dailyVelocity : [];
  const avg = data?.avgIncidentsPerDay ?? (daily.length ? (daily.reduce((s, d) => s + (d.count || 0), 0) / daily.length).toFixed(2) : "0");
  const totalIncidents = data?.totalIncidents ?? daily.reduce((s, d) => s + (d.count || 0), 0);
  const totalDays = data?.totalDays ?? daily.length;

  return (
    <WidgetShell title="Incident Velocity">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-400">Daily incident count (last {range} days)</div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Avg / day</div>
          <div className="text-xl font-bold text-blue-300">{avg}</div>
        </div>
      </div>

      <div className="bg-gray-900/40 p-3 rounded mb-3">
        <MiniBars series={daily} height={120} color="#60A5FA" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <SmallStat label="Total" value={totalIncidents} />
        <SmallStat label="Days" value={totalDays} />
        <SmallStat label="Most recent" value={daily.length ? daily[daily.length - 1].count : "—"} />
      </div>
    </WidgetShell>
  );
}

/* Tiny bars for velocity */
function MiniBars({ series = [], height = 120, color = "#60A5FA" }) {
  if (!series.length) return <div className="text-gray-400 text-sm">No data</div>;
  const max = Math.max(...series.map(s => s.count || 0), 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {series.map((d, i) => (
        <div key={i} title={`${d.date}: ${d.count}`} className="flex-1 rounded-sm transition-transform" style={{
          height: `${Math.max(2, (d.count / max) * height)}px`,
          background: color,
          opacity: 0.95
        }}/>
      ))}
    </div>
  );
}

/* ===========================
   StatusPieChart Component
   GET /api/incidents/kpi/status
   =========================== */
function StatusPieChart({ baseUrl = "http://localhost:5000" }) {
  const [state, setState] = React.useState({ loading: true, error: null, breakdown: [], total: 0 });

  React.useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();
    (async () => {
      try {
        const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/status`, {
          timeout: 15000,
          cancelToken: source.token
        });
        if (!mounted) return;
        setState({ loading: false, error: null, breakdown: res.data.breakdown || [], total: res.data.total || 0 });
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) console.error("StatusPieChart:", err);
        setState({ loading: false, error: err.response?.data?.message || err.message || "Error", breakdown: [], total: 0 });
      }
    })();
    return () => { mounted = false; source.cancel("unmount"); };
  }, [baseUrl]);

  const { loading, error, breakdown, total } = state;
  if (loading) return <WidgetShell title="Status Breakdown" loading />;
  if (error) return <WidgetShell title="Status Breakdown" error={error} />;

  const COLORS = { Open: "#facc15", Investigating: "#fb923c", Resolved: "#22c55e", Closed: "#9ca3af", Unknown: "#6b7280" };
  // compute segments
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;
  const segments = breakdown.map((b) => {
    const pct = total ? (b.count / total) : 0;
    const dash = pct * circumference;
    const seg = { ...b, dash, gap: circumference - dash, offset: cumulative };
    cumulative -= dash;
    return seg;
  });

  return (
    <WidgetShell title="Status Breakdown">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <svg width="200" height="200">
            <g transform="translate(100,100) rotate(-90)">
              <circle r={radius} fill="none" stroke="#0f172a" strokeWidth="32" />
              {segments.map((s, i) => (
                <circle key={i}
                  r={radius}
                  fill="none"
                  stroke={COLORS[s.status] || COLORS.Unknown}
                  strokeWidth="32"
                  strokeDasharray={`${s.dash} ${s.gap}`}
                  strokeDashoffset={s.offset}
                  strokeLinecap="round"
                />
              ))}
            </g>
          </svg>
        </div>

        <div className="flex-1">
          <div className="text-2xl font-bold text-white">{total}</div>
          <div className="text-xs text-gray-400 mb-3">Total incidents</div>

          <div className="space-y-2">
            {breakdown.map((b) => (
              <div key={b.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ background: COLORS[b.status] || COLORS.Unknown }} className="w-3 h-3 rounded-sm inline-block" />
                  <div className="text-sm text-gray-200">{b.status}</div>
                </div>
                <div className="text-sm text-gray-400">{b.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}

/* ===========================
   CategoryDistribution Component
   GET /api/incidents/kpi/categories
   =========================== */
function CategoryDistribution({ baseUrl = "http://localhost:5000", limit = 8 }) {
  const [state, setState] = React.useState({ loading: true, error: null, items: [] });

  React.useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();
    (async () => {
      setState({ loading: true, error: null, items: [] });
      try {
        const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/categories`, {
          params: { limit },
          timeout: 15000,
          cancelToken: source.token,
        });
        if (!mounted) return;
        setState({ loading: false, error: null, items: Array.isArray(res.data) ? res.data : [] });
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) console.error("CategoryDistribution:", err);
        setState({ loading: false, error: err.response?.data?.message || err.message || "Error", items: [] });
      }
    })();
    return () => { mounted = false; source.cancel("unmount"); };
  }, [baseUrl, limit]);

  const { loading, error, items } = state;
  if (loading) return <WidgetShell title="Category Distribution" loading />;
  if (error) return <WidgetShell title="Category Distribution" error={error} />;

  const maxCount = items.length ? Math.max(...items.map(i => i.count || 0)) : 1;
  return (
    <WidgetShell title="Category Distribution">
      <div className="space-y-4">
        {items.map((it, idx) => {
          const pct = maxCount ? Math.round((it.count / maxCount) * 100) : 0;
          return (
            <div key={`${it.category}-${idx}`} className="p-3 bg-gray-900/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-semibold text-white">{it.category || "Unknown"}</div>
                <div className="text-sm text-gray-400">{it.count}</div>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded overflow-hidden">
                <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded" />
              </div>
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
}

/* ===========================
   GeographicHeatmap Component
   GET /api/incidents/kpi/heatmap?range={range}
   =========================== */
function GeographicHeatmap({ baseUrl = "http://localhost:5000", range = 30, limit = 8 }) {
  const [state, setState] = React.useState({ loading: true, error: null, rows: [] });

  React.useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();
    (async () => {
      setState({ loading: true, error: null, rows: [] });
      try {
        const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/heatmap`, {
          params: { range },
          timeout: 15000,
          cancelToken: source.token,
        });
        if (!mounted) return;
        const arr = Array.isArray(res.data) ? res.data.slice(0, limit) : [];
        setState({ loading: false, error: null, rows: arr });
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) console.error("GeographicHeatmap:", err);
        setState({ loading: false, error: err.response?.data?.message || err.message || "Error", rows: [] });
      }
    })();
    return () => { mounted = false; source.cancel("unmount"); };
  }, [baseUrl, range, limit]);

  const { loading, error, rows } = state;
  if (loading) return <WidgetShell title="Geographic Heatmap" loading />;
  if (error) return <WidgetShell title="Geographic Heatmap" error={error} />;

  const max = rows.length ? Math.max(...rows.map(r => r.incidentCount || 0)) : 1;
  return (
    <WidgetShell title="Geographic Distribution">
      <div className="space-y-3">
        {rows.map((r, idx) => {
          const pct = max ? Math.round((r.incidentCount / max) * 100) : 0;
          return (
            <div key={`${r.country}-${idx}`} className="p-3 bg-gray-900/30 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">{r.country || "Unknown"}</div>
                <div className="text-xs text-gray-400">{r.uniqueTypes ?? 0} types · {r.uniqueCategories ?? 0} categories</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right mr-2">
                  <div className="text-lg font-bold text-white">{r.incidentCount ?? 0}</div>
                  <div className="text-xs text-gray-400">{pct}%</div>
                </div>
                <div className="w-40 h-3 bg-gray-800 rounded overflow-hidden">
                  <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
}

/* ===========================
   MoMGrowth Component
   GET /api/incidents/kpi/growth?months={months}
   =========================== */
function MoMGrowth({ baseUrl = "http://localhost:5000", months = 6 }) {
  const [state, setState] = React.useState({ loading: true, error: null, rows: [] });

  React.useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();
    (async () => {
      setState({ loading: true, error: null, rows: [] });
      try {
        const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/growth`, {
          params: { months },
          timeout: 15000,
          cancelToken: source.token
        });
        if (!mounted) return;
        setState({ loading: false, error: null, rows: Array.isArray(res.data) ? res.data : [] });
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) console.error("MoMGrowth:", err);
        setState({ loading: false, error: err.response?.data?.message || err.message || "Error", rows: [] });
      }
    })();
    return () => { mounted = false; source.cancel("unmount"); };
  }, [baseUrl, months]);

  const { loading, error, rows } = state;
  if (loading) return <WidgetShell title="Month-over-Month Growth" loading />;
  if (error) return <WidgetShell title="Month-over-Month Growth" error={error} />;

  const counts = rows.map(r => r.count || 0);
  const max = counts.length ? Math.max(...counts) : 1;

  return (
    <WidgetShell title="Month-over-Month Growth">
      <div className="bg-gray-900/40 p-3 rounded mb-3">
        <div className="flex items-end gap-3 h-36">
          {rows.map(r => {
            const h = max ? Math.round((r.count / max) * 100) : 0;
            return <div key={r.month} className="flex-1 flex flex-col items-center">
              <div title={`${r.month}: ${r.count}`} className="w-full rounded-t-md" style={{ height: `${Math.max(6, h)}%`, background: "linear-gradient(180deg,#60A5FA,#3B82F6)" }} />
              <div className="text-xs text-gray-400 mt-2">{r.month}</div>
            </div>;
          })}
        </div>
      </div>

      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.month} className="flex items-center justify-between p-2 bg-gray-900/30 rounded">
            <div className="text-sm text-white font-medium">{r.month}</div>
            <div className="text-xs text-gray-400">{r.count} incidents · <span className={r.growth && r.growth.startsWith("-") ? "text-red-400" : "text-green-400"}>{r.growth ?? "—"}</span></div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

/* ===========================
   TypeTrends Component
   GET /api/incidents/kpi/trends/types?range={range}
   =========================== */
function TypeTrends({ baseUrl = "http://localhost:5000", range = 90, topN = 4 }) {
  const [state, setState] = React.useState({ loading: true, error: null, rows: [] });

  React.useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();
    (async () => {
      setState({ loading: true, error: null, rows: [] });
      try {
        const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/trends/types`, {
          params: { range },
          timeout: 20000,
          cancelToken: source.token
        });
        if (!mounted) return;
        setState({ loading: false, error: null, rows: Array.isArray(res.data) ? res.data : [] });
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) console.error("TypeTrends:", err);
        setState({ loading: false, error: err.response?.data?.message || err.message || "Error", rows: [] });
      }
    })();
    return () => { mounted = false; source.cancel("unmount"); };
  }, [baseUrl, range]);

  const { loading, error, rows } = state;
  if (loading) return <WidgetShell title="Type Trends" loading />;
  if (error) return <WidgetShell title="Type Trends" error={error} />;

  // rows: [{ incidentType, week, count }]
  // Build map => series per type
  const weeks = Array.from(new Set(rows.map(r => r.week))).sort();
  const map = {};
  rows.forEach(r => {
    const t = r.incidentType || r.incident_type || "Unknown";
    if (!map[t]) map[t] = {};
    map[t][r.week] = (map[t][r.week] || 0) + (r.count || 0);
  });
  const totals = Object.keys(map).map(t => ({ type: t, total: Object.values(map[t]).reduce((s, v) => s + v, 0), series: weeks.map(w => ({ week: w, count: map[t][w] || 0 })) }));
  totals.sort((a, b) => b.total - a.total);
  const top = totals.slice(0, topN);

  return (
    <WidgetShell title="Incident Type Trends">
      <div className="space-y-4">
        {top.length === 0 ? <div className="text-gray-400 text-sm">No trend data</div> : top.map((t, i) => (
          <div key={t.type} className="p-3 bg-gray-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-white">{t.type}</div>
              <div className="text-xs text-gray-400">{t.total} total</div>
            </div>
            <div className="h-24 bg-gray-800/40 rounded p-2">
              <TinyLine points={t.series} color={["#60A5FA", "#34D399", "#F59E0B", "#F97316", "#A78BFA"][i % 5]} />
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

/* small line renderer (svg) */
function TinyLine({ points = [], color = "#60A5FA", width = 600, height = 80 }) {
  if (!points.length) return null;
  const max = Math.max(...points.map(p => p.count || 0), 1);
  const stepX = width / Math.max(points.length - 1, 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${height - (p.count / max) * (height - 6)}`).join(" ");
  const fill = `${d} L ${(points.length - 1) * stepX} ${height} L 0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={`g-${color.replace("#","")}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#g-${color.replace("#","")})`} />
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ===========================
   Tiny UI building blocks
   =========================== */
function WidgetShell({ title, loading = false, error = null, children }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="text-xs text-slate-400">KPI widget</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          {loading ? "Loading..." : (error ? "Error" : "Live")}
        </div>
      </div>

      <div>
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-6 w-48 bg-gray-700 rounded" />
            <div className="h-28 bg-gray-800 rounded" />
          </div>
        ) : error ? (
          <div className="text-red-400">{String(error)}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent = "blue" }) {
  const accentClass = accent === "green" ? "text-green-400" : "text-blue-400";
  return (
    <div className="p-3 bg-gray-900/30 rounded-lg text-center">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`text-2xl font-bold ${accentClass}`}>{value}</div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="p-2 bg-gray-900/30 rounded">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
}

/* ===========================
   Dashboard: layout that composes all widgets
   =========================== */
export default function Dashboard({ baseUrl = "http://localhost:5000" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Overview — KPIs from incidents API</p>
          </div>
          <div className="text-sm text-gray-400">Updated: {new Date().toLocaleString()}</div>
        </header>

        {/* Top row: Resolution, Velocity, Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ResolutionMetrics baseUrl={baseUrl} range={30} />
          <VelocityMetrics baseUrl={baseUrl} range={30} />
          <StatusPieChart baseUrl={baseUrl} />
        </div>

        {/* Middle row: Categories, Geographic, MoM growth */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategoryDistribution baseUrl={baseUrl} limit={6} />
          <GeographicHeatmap baseUrl={baseUrl} range={30} limit={6} />
          <MoMGrowth baseUrl={baseUrl} months={6} />
        </div>

        {/* Bottom row: Type trends */}
        <div className="grid grid-cols-1 gap-6">
          <TypeTrends baseUrl={baseUrl} range={90} topN={4} />
        </div>
      </div>
    </div>
  );
}
