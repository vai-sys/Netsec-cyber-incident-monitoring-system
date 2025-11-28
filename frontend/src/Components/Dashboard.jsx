// // Dashboard.jsx
// import React from "react";
// import axios from "axios";
// import {
//   PieChart,
//   BarChart3,
//   Globe,
//   Calendar,
//   TrendingUp,
//   Activity,
//   Clock,
//   Zap,
//   CheckCircle2,
// } from "lucide-react";

// /* ---------------------------
//   Helper: fetch wrapper to include optional token & cancellation
//    --------------------------- */
// async function fetchWithToken(url, opts = {}) {
//   const token = localStorage.getItem("token");
//   const headers = { ...(opts.headers || {}) };
//   if (token) headers.Authorization = `Bearer ${token}`;
//   const merged = { ...opts, headers };
//   return axios.get(url, merged);
// }

// /* ===========================
//    ResolutionMetrics Component
//    GET /api/incidents/kpi/resolution?range={range}
//    =========================== */
// function ResolutionMetrics({ baseUrl = "http://localhost:5000", range = 30 }) {
//   const [state, setState] = React.useState({ loading: true, error: null, data: null });

//   React.useEffect(() => {
//     const source = axios.CancelToken.source();
//     let mounted = true;
//     (async () => {
//       setState({ loading: true, error: null, data: null });
//       try {
//         const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/resolution`, {
//           params: { range },
//           timeout: 15000,
//           cancelToken: source.token,
//         });
//         if (!mounted) return;
//         setState({ loading: false, error: null, data: res.data });
//       } catch (err) {
//         if (!mounted) return;
//         if (!axios.isCancel(err)) console.error("ResolutionMetrics:", err);
//         setState({ loading: false, error: err.response?.data?.message || err.message || "Error", data: null });
//       }
//     })();
//     return () => {
//       mounted = false;
//       source.cancel("unmount");
//     };
//   }, [baseUrl, range]);

//   const { loading, error, data } = state;

//   if (loading) return <WidgetShell title="Resolution Metrics" loading />;
//   if (error) return <WidgetShell title="Resolution Metrics" error={error} />;

//   const total = data?.totalIncidents ?? 0;
//   const resolved = data?.resolvedIncidents ?? 0;
//   const rate = data?.resolutionRate ?? "0%";
//   const avgDays = data?.avgResolutionDays ?? "—";
//   const percent = total ? Math.round((resolved / total) * 100) : 0;

//   return (
//     <WidgetShell title="Resolution Metrics">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <Stat label="Total Incidents" value={total} />
//         <Stat label="Resolved" value={resolved} accent="green" />
//         <Stat label="Resolution Rate" value={rate} />
//       </div>

//       <div className="bg-gray-900/40 p-4 rounded-lg">
//         <div className="flex items-center justify-between">
//           <div className="flex-1">
//             <div className="flex items-center justify-between mb-2">
//               <div className="text-sm text-gray-400">Completion Progress</div>
//               <div className="text-sm font-bold text-green-400">{percent}%</div>
//             </div>
//             <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
//               <div style={{ width: `${percent}%` }} className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
//             </div>
//             <div className="mt-3 text-xs text-gray-400">Avg resolution: <span className="font-semibold text-white">{avgDays !== null ? `${avgDays} days` : "—"}</span></div>
//           </div>
//           <div className="ml-6 w-40 text-center">
//             <div className="text-xs text-gray-400 uppercase">Avg Resolution Time</div>
//             <div className="text-3xl font-bold text-white mt-2">{avgDays !== null ? avgDays : "—"}</div>
//             <div className="text-xs text-gray-500">days / incident</div>
//           </div>
//         </div>
//       </div>
//     </WidgetShell>
//   );
// }

// /* ===========================
//    VelocityMetrics Component
//    GET /api/incidents/kpi/velocity?range={range}
//    =========================== */
// function VelocityMetrics({ baseUrl = "http://localhost:5000", range = 30 }) {
//   const [state, setState] = React.useState({ loading: true, error: null, data: null });

//   React.useEffect(() => {
//     let mounted = true;
//     const source = axios.CancelToken.source();
//     (async () => {
//       setState({ loading: true, error: null, data: null });
//       try {
//         const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/velocity`, {
//           params: { range },
//           timeout: 15000,
//           cancelToken: source.token,
//         });
//         if (!mounted) return;
//         setState({ loading: false, error: null, data: res.data });
//       } catch (err) {
//         if (!mounted) return;
//         if (!axios.isCancel(err)) console.error("VelocityMetrics:", err);
//         setState({ loading: false, error: err.response?.data?.message || err.message || "Error", data: null });
//       }
//     })();
//     return () => { mounted = false; source.cancel("unmount"); };
//   }, [baseUrl, range]);

//   const { loading, error, data } = state;
//   if (loading) return <WidgetShell title="Incident Velocity" loading />;
//   if (error) return <WidgetShell title="Incident Velocity" error={error} />;

//   const daily = Array.isArray(data?.dailyVelocity) ? data.dailyVelocity : [];
//   const avg = data?.avgIncidentsPerDay ?? (daily.length ? (daily.reduce((s, d) => s + (d.count || 0), 0) / daily.length).toFixed(2) : "0");
//   const totalIncidents = data?.totalIncidents ?? daily.reduce((s, d) => s + (d.count || 0), 0);
//   const totalDays = data?.totalDays ?? daily.length;

//   return (
//     <WidgetShell title="Incident Velocity">
//       <div className="flex items-center justify-between mb-3">
//         <div className="text-sm text-gray-400">Daily incident count (last {range} days)</div>
//         <div className="text-right">
//           <div className="text-xs text-gray-400">Avg / day</div>
//           <div className="text-xl font-bold text-blue-300">{avg}</div>
//         </div>
//       </div>

//       <div className="bg-gray-900/40 p-3 rounded mb-3">
//         <MiniBars series={daily} height={120} color="#60A5FA" />
//       </div>

//       <div className="grid grid-cols-3 gap-3 text-center">
//         <SmallStat label="Total" value={totalIncidents} />
//         <SmallStat label="Days" value={totalDays} />
//         <SmallStat label="Most recent" value={daily.length ? daily[daily.length - 1].count : "—"} />
//       </div>
//     </WidgetShell>
//   );
// }

// /* Tiny bars for velocity */
// function MiniBars({ series = [], height = 120, color = "#60A5FA" }) {
//   if (!series.length) return <div className="text-gray-400 text-sm">No data</div>;
//   const max = Math.max(...series.map(s => s.count || 0), 1);
//   return (
//     <div className="flex items-end gap-1" style={{ height }}>
//       {series.map((d, i) => (
//         <div key={i} title={`${d.date}: ${d.count}`} className="flex-1 rounded-sm transition-transform" style={{
//           height: `${Math.max(2, (d.count / max) * height)}px`,
//           background: color,
//           opacity: 0.95
//         }}/>
//       ))}
//     </div>
//   );
// }

// /* ===========================
//    StatusPieChart Component
//    GET /api/incidents/kpi/status
//    =========================== */
// function StatusPieChart({ baseUrl = "http://localhost:5000" }) {
//   const [state, setState] = React.useState({ loading: true, error: null, breakdown: [], total: 0 });

//   React.useEffect(() => {
//     let mounted = true;
//     const source = axios.CancelToken.source();
//     (async () => {
//       try {
//         const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/status`, {
//           timeout: 15000,
//           cancelToken: source.token
//         });
//         if (!mounted) return;
//         setState({ loading: false, error: null, breakdown: res.data.breakdown || [], total: res.data.total || 0 });
//       } catch (err) {
//         if (!mounted) return;
//         if (!axios.isCancel(err)) console.error("StatusPieChart:", err);
//         setState({ loading: false, error: err.response?.data?.message || err.message || "Error", breakdown: [], total: 0 });
//       }
//     })();
//     return () => { mounted = false; source.cancel("unmount"); };
//   }, [baseUrl]);

//   const { loading, error, breakdown, total } = state;
//   if (loading) return <WidgetShell title="Status Breakdown" loading />;
//   if (error) return <WidgetShell title="Status Breakdown" error={error} />;

//   const COLORS = { Open: "#facc15", Investigating: "#fb923c", Resolved: "#22c55e", Closed: "#9ca3af", Unknown: "#6b7280" };
//   // compute segments
//   const radius = 80;
//   const circumference = 2 * Math.PI * radius;
//   let cumulative = 0;
//   const segments = breakdown.map((b) => {
//     const pct = total ? (b.count / total) : 0;
//     const dash = pct * circumference;
//     const seg = { ...b, dash, gap: circumference - dash, offset: cumulative };
//     cumulative -= dash;
//     return seg;
//   });

//   return (
//     <WidgetShell title="Status Breakdown">
//       <div className="flex items-center gap-6">
//         <div className="flex-shrink-0">
//           <svg width="200" height="200">
//             <g transform="translate(100,100) rotate(-90)">
//               <circle r={radius} fill="none" stroke="#0f172a" strokeWidth="32" />
//               {segments.map((s, i) => (
//                 <circle key={i}
//                   r={radius}
//                   fill="none"
//                   stroke={COLORS[s.status] || COLORS.Unknown}
//                   strokeWidth="32"
//                   strokeDasharray={`${s.dash} ${s.gap}`}
//                   strokeDashoffset={s.offset}
//                   strokeLinecap="round"
//                 />
//               ))}
//             </g>
//           </svg>
//         </div>

//         <div className="flex-1">
//           <div className="text-2xl font-bold text-white">{total}</div>
//           <div className="text-xs text-gray-400 mb-3">Total incidents</div>

//           <div className="space-y-2">
//             {breakdown.map((b) => (
//               <div key={b.status} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <span style={{ background: COLORS[b.status] || COLORS.Unknown }} className="w-3 h-3 rounded-sm inline-block" />
//                   <div className="text-sm text-gray-200">{b.status}</div>
//                 </div>
//                 <div className="text-sm text-gray-400">{b.count}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </WidgetShell>
//   );
// }

// /* ===========================
//    CategoryDistribution Component
//    GET /api/incidents/kpi/categories
//    =========================== */
// function CategoryDistribution({ baseUrl = "http://localhost:5000", limit = 8 }) {
//   const [state, setState] = React.useState({ loading: true, error: null, items: [] });

//   React.useEffect(() => {
//     let mounted = true;
//     const source = axios.CancelToken.source();
//     (async () => {
//       setState({ loading: true, error: null, items: [] });
//       try {
//         const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/categories`, {
//           params: { limit },
//           timeout: 15000,
//           cancelToken: source.token,
//         });
//         if (!mounted) return;
//         setState({ loading: false, error: null, items: Array.isArray(res.data) ? res.data : [] });
//       } catch (err) {
//         if (!mounted) return;
//         if (!axios.isCancel(err)) console.error("CategoryDistribution:", err);
//         setState({ loading: false, error: err.response?.data?.message || err.message || "Error", items: [] });
//       }
//     })();
//     return () => { mounted = false; source.cancel("unmount"); };
//   }, [baseUrl, limit]);

//   const { loading, error, items } = state;
//   if (loading) return <WidgetShell title="Category Distribution" loading />;
//   if (error) return <WidgetShell title="Category Distribution" error={error} />;

//   const maxCount = items.length ? Math.max(...items.map(i => i.count || 0)) : 1;
//   return (
//     <WidgetShell title="Category Distribution">
//       <div className="space-y-4">
//         {items.map((it, idx) => {
//           const pct = maxCount ? Math.round((it.count / maxCount) * 100) : 0;
//           return (
//             <div key={`${it.category}-${idx}`} className="p-3 bg-gray-900/30 rounded-lg">
//               <div className="flex justify-between items-center mb-2">
//                 <div className="text-sm font-semibold text-white">{it.category || "Unknown"}</div>
//                 <div className="text-sm text-gray-400">{it.count}</div>
//               </div>
//               <div className="w-full bg-gray-800 h-3 rounded overflow-hidden">
//                 <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded" />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </WidgetShell>
//   );
// }

// /* ===========================
//    GeographicHeatmap Component
//    GET /api/incidents/kpi/heatmap?range={range}
//    =========================== */
// function GeographicHeatmap({ baseUrl = "http://localhost:5000", range = 30, limit = 8 }) {
//   const [state, setState] = React.useState({ loading: true, error: null, rows: [] });

//   React.useEffect(() => {
//     let mounted = true;
//     const source = axios.CancelToken.source();
//     (async () => {
//       setState({ loading: true, error: null, rows: [] });
//       try {
//         const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/heatmap`, {
//           params: { range },
//           timeout: 15000,
//           cancelToken: source.token,
//         });
//         if (!mounted) return;
//         const arr = Array.isArray(res.data) ? res.data.slice(0, limit) : [];
//         setState({ loading: false, error: null, rows: arr });
//       } catch (err) {
//         if (!mounted) return;
//         if (!axios.isCancel(err)) console.error("GeographicHeatmap:", err);
//         setState({ loading: false, error: err.response?.data?.message || err.message || "Error", rows: [] });
//       }
//     })();
//     return () => { mounted = false; source.cancel("unmount"); };
//   }, [baseUrl, range, limit]);

//   const { loading, error, rows } = state;
//   if (loading) return <WidgetShell title="Geographic Heatmap" loading />;
//   if (error) return <WidgetShell title="Geographic Heatmap" error={error} />;

//   const max = rows.length ? Math.max(...rows.map(r => r.incidentCount || 0)) : 1;
//   return (
//     <WidgetShell title="Geographic Distribution">
//       <div className="space-y-3">
//         {rows.map((r, idx) => {
//           const pct = max ? Math.round((r.incidentCount / max) * 100) : 0;
//           return (
//             <div key={`${r.country}-${idx}`} className="p-3 bg-gray-900/30 rounded-lg flex items-center justify-between">
//               <div>
//                 <div className="text-sm font-semibold text-white">{r.country || "Unknown"}</div>
//                 <div className="text-xs text-gray-400">{r.uniqueTypes ?? 0} types · {r.uniqueCategories ?? 0} categories</div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="text-right mr-2">
//                   <div className="text-lg font-bold text-white">{r.incidentCount ?? 0}</div>
//                   <div className="text-xs text-gray-400">{pct}%</div>
//                 </div>
//                 <div className="w-40 h-3 bg-gray-800 rounded overflow-hidden">
//                   <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </WidgetShell>
//   );
// }

// /* ===========================
//    MoMGrowth Component
//    GET /api/incidents/kpi/growth?months={months}
//    =========================== */
// function MoMGrowth({ baseUrl = "http://localhost:5000", months = 6 }) {
//   const [state, setState] = React.useState({ loading: true, error: null, rows: [] });

//   React.useEffect(() => {
//     let mounted = true;
//     const source = axios.CancelToken.source();
//     (async () => {
//       setState({ loading: true, error: null, rows: [] });
//       try {
//         const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/growth`, {
//           params: { months },
//           timeout: 15000,
//           cancelToken: source.token
//         });
//         if (!mounted) return;
//         setState({ loading: false, error: null, rows: Array.isArray(res.data) ? res.data : [] });
//       } catch (err) {
//         if (!mounted) return;
//         if (!axios.isCancel(err)) console.error("MoMGrowth:", err);
//         setState({ loading: false, error: err.response?.data?.message || err.message || "Error", rows: [] });
//       }
//     })();
//     return () => { mounted = false; source.cancel("unmount"); };
//   }, [baseUrl, months]);

//   const { loading, error, rows } = state;
//   if (loading) return <WidgetShell title="Month-over-Month Growth" loading />;
//   if (error) return <WidgetShell title="Month-over-Month Growth" error={error} />;

//   const counts = rows.map(r => r.count || 0);
//   const max = counts.length ? Math.max(...counts) : 1;

//   return (
//     <WidgetShell title="Month-over-Month Growth">
//       <div className="bg-gray-900/40 p-3 rounded mb-3">
//         <div className="flex items-end gap-3 h-36">
//           {rows.map(r => {
//             const h = max ? Math.round((r.count / max) * 100) : 0;
//             return <div key={r.month} className="flex-1 flex flex-col items-center">
//               <div title={`${r.month}: ${r.count}`} className="w-full rounded-t-md" style={{ height: `${Math.max(6, h)}%`, background: "linear-gradient(180deg,#60A5FA,#3B82F6)" }} />
//               <div className="text-xs text-gray-400 mt-2">{r.month}</div>
//             </div>;
//           })}
//         </div>
//       </div>

//       <div className="space-y-2">
//         {rows.map(r => (
//           <div key={r.month} className="flex items-center justify-between p-2 bg-gray-900/30 rounded">
//             <div className="text-sm text-white font-medium">{r.month}</div>
//             <div className="text-xs text-gray-400">{r.count} incidents · <span className={r.growth && r.growth.startsWith("-") ? "text-red-400" : "text-green-400"}>{r.growth ?? "—"}</span></div>
//           </div>
//         ))}
//       </div>
//     </WidgetShell>
//   );
// }

// /* ===========================
//    TypeTrends Component
//    GET /api/incidents/kpi/trends/types?range={range}
//    =========================== */
// function TypeTrends({ baseUrl = "http://localhost:5000", range = 90, topN = 4 }) {
//   const [state, setState] = React.useState({ loading: true, error: null, rows: [] });

//   React.useEffect(() => {
//     let mounted = true;
//     const source = axios.CancelToken.source();
//     (async () => {
//       setState({ loading: true, error: null, rows: [] });
//       try {
//         const res = await fetchWithToken(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/trends/types`, {
//           params: { range },
//           timeout: 20000,
//           cancelToken: source.token
//         });
//         if (!mounted) return;
//         setState({ loading: false, error: null, rows: Array.isArray(res.data) ? res.data : [] });
//       } catch (err) {
//         if (!mounted) return;
//         if (!axios.isCancel(err)) console.error("TypeTrends:", err);
//         setState({ loading: false, error: err.response?.data?.message || err.message || "Error", rows: [] });
//       }
//     })();
//     return () => { mounted = false; source.cancel("unmount"); };
//   }, [baseUrl, range]);

//   const { loading, error, rows } = state;
//   if (loading) return <WidgetShell title="Type Trends" loading />;
//   if (error) return <WidgetShell title="Type Trends" error={error} />;

//   // rows: [{ incidentType, week, count }]
//   // Build map => series per type
//   const weeks = Array.from(new Set(rows.map(r => r.week))).sort();
//   const map = {};
//   rows.forEach(r => {
//     const t = r.incidentType || r.incident_type || "Unknown";
//     if (!map[t]) map[t] = {};
//     map[t][r.week] = (map[t][r.week] || 0) + (r.count || 0);
//   });
//   const totals = Object.keys(map).map(t => ({ type: t, total: Object.values(map[t]).reduce((s, v) => s + v, 0), series: weeks.map(w => ({ week: w, count: map[t][w] || 0 })) }));
//   totals.sort((a, b) => b.total - a.total);
//   const top = totals.slice(0, topN);

//   return (
//     <WidgetShell title="Incident Type Trends">
//       <div className="space-y-4">
//         {top.length === 0 ? <div className="text-gray-400 text-sm">No trend data</div> : top.map((t, i) => (
//           <div key={t.type} className="p-3 bg-gray-900/30 rounded-lg">
//             <div className="flex items-center justify-between mb-2">
//               <div className="text-sm font-semibold text-white">{t.type}</div>
//               <div className="text-xs text-gray-400">{t.total} total</div>
//             </div>
//             <div className="h-24 bg-gray-800/40 rounded p-2">
//               <TinyLine points={t.series} color={["#60A5FA", "#34D399", "#F59E0B", "#F97316", "#A78BFA"][i % 5]} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </WidgetShell>
//   );
// }

// /* small line renderer (svg) */
// function TinyLine({ points = [], color = "#60A5FA", width = 600, height = 80 }) {
//   if (!points.length) return null;
//   const max = Math.max(...points.map(p => p.count || 0), 1);
//   const stepX = width / Math.max(points.length - 1, 1);
//   const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${height - (p.count / max) * (height - 6)}`).join(" ");
//   const fill = `${d} L ${(points.length - 1) * stepX} ${height} L 0 ${height} Z`;
//   return (
//     <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
//       <defs>
//         <linearGradient id={`g-${color.replace("#","")}`} x1="0%" y1="0%" x2="0%" y2="100%">
//           <stop offset="0%" stopColor={color} stopOpacity="0.25" />
//           <stop offset="100%" stopColor={color} stopOpacity="0.04" />
//         </linearGradient>
//       </defs>
//       <path d={fill} fill={`url(#g-${color.replace("#","")})`} />
//       <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

// /* ===========================
//    Tiny UI building blocks
//    =========================== */
// function WidgetShell({ title, loading = false, error = null, children }) {
//   return (
//     <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700/50 shadow-lg">
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
//             <BarChart3 className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <div className="text-sm font-semibold text-white">{title}</div>
//             <div className="text-xs text-slate-400">KPI widget</div>
//           </div>
//         </div>
//         <div className="text-xs text-slate-400">
//           {loading ? "Loading..." : (error ? "Error" : "Live")}
//         </div>
//       </div>

//       <div>
//         {loading ? (
//           <div className="animate-pulse space-y-2">
//             <div className="h-6 w-48 bg-gray-700 rounded" />
//             <div className="h-28 bg-gray-800 rounded" />
//           </div>
//         ) : error ? (
//           <div className="text-red-400">{String(error)}</div>
//         ) : (
//           children
//         )}
//       </div>
//     </div>
//   );
// }

// function Stat({ label, value, accent = "blue" }) {
//   const accentClass = accent === "green" ? "text-green-400" : "text-blue-400";
//   return (
//     <div className="p-3 bg-gray-900/30 rounded-lg text-center">
//       <div className="text-xs text-gray-400">{label}</div>
//       <div className={`text-2xl font-bold ${accentClass}`}>{value}</div>
//     </div>
//   );
// }

// function SmallStat({ label, value }) {
//   return (
//     <div className="p-2 bg-gray-900/30 rounded">
//       <div className="text-xs text-gray-400">{label}</div>
//       <div className="text-lg font-bold text-white">{value}</div>
//     </div>
//   );
// }

// /* ===========================
//    Dashboard: layout that composes all widgets
//    =========================== */
// export default function Dashboard({ baseUrl = "http://localhost:5000" }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* header */}
//         <header className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
//             <p className="text-sm text-gray-400 mt-1">Overview — KPIs from incidents API</p>
//           </div>
//           <div className="text-sm text-gray-400">Updated: {new Date().toLocaleString()}</div>
//         </header>

//         {/* Top row: Resolution, Velocity, Status */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <ResolutionMetrics baseUrl={baseUrl} range={30} />
//           <VelocityMetrics baseUrl={baseUrl} range={30} />
//           <StatusPieChart baseUrl={baseUrl} />
//         </div>

//         {/* Middle row: Categories, Geographic, MoM growth */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <CategoryDistribution baseUrl={baseUrl} limit={6} />
//           <GeographicHeatmap baseUrl={baseUrl} range={30} limit={6} />
//           <MoMGrowth baseUrl={baseUrl} months={6} />
//         </div>

//         {/* Bottom row: Type trends */}
//         <div className="grid grid-cols-1 gap-6">
//           <TypeTrends baseUrl={baseUrl} range={90} topN={4} />
//         </div>
//       </div>
//     </div>
//   );
// }





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
  ChevronDown,
  RefreshCw
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
function ResolutionMetrics({ baseUrl = "http://localhost:5000", range = 30, highlight = false }) {
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

  if (loading) return <WidgetShell title="Resolution Metrics" loading icon={<CheckCircle2 />} highlight={highlight} />;
  if (error) return <WidgetShell title="Resolution Metrics" error={error} icon={<CheckCircle2 />} highlight={highlight} />;

  const total = data?.totalIncidents ?? 0;
  const resolved = data?.resolvedIncidents ?? 0;
  const rate = data?.resolutionRate ?? "0%";
  const avgDays = data?.avgResolutionDays ?? null;
  const percent = total ? Math.round((resolved / total) * 100) : 0;

  return (
    <WidgetShell title="Resolution Metrics" icon={<CheckCircle2 />} highlight={highlight}>
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Stat label="Total Incidents" value={total} />
          <Stat label="Resolved" value={resolved} accent="green" />
          <Stat label="Resolution Rate" value={rate} />
        </div>

        <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/30 p-4 rounded-lg border border-slate-700/40 flex-1 flex items-center">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-300">Completion Progress</div>
                <div className="text-sm font-semibold text-green-300">{percent}%</div>
              </div>

              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${percent}%` }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
                />
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Avg resolution: <span className="font-semibold text-white">{avgDays !== null ? `${avgDays} days` : "—"}</span>
              </div>
            </div>

            <div className="ml-6 w-36 text-center bg-slate-800/40 p-3 rounded-lg flex-shrink-0">
              <div className="text-xs text-gray-300 uppercase">Avg Resolution Time</div>
              <div className="text-3xl font-bold text-white mt-2">{avgDays !== null ? avgDays : "—"}</div>
              <div className="text-xs text-gray-400">days / incident</div>
            </div>
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
function VelocityMetrics({ baseUrl = "http://localhost:5000", range = 30, highlight = false }) {
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
  if (loading) return <WidgetShell title="Incident Velocity" loading icon={<Activity />} highlight={highlight} />;
  if (error) return <WidgetShell title="Incident Velocity" error={error} icon={<Activity />} highlight={highlight} />;

  const daily = Array.isArray(data?.dailyVelocity) ? data.dailyVelocity : [];
  const avg = data?.avgIncidentsPerDay ?? (daily.length ? (daily.reduce((s, d) => s + (d.count || 0), 0) / daily.length).toFixed(2) : "0");
  const totalIncidents = data?.totalIncidents ?? daily.reduce((s, d) => s + (d.count || 0), 0);
  const totalDays = data?.totalDays ?? daily.length;

  return (
    <WidgetShell title="Incident Velocity" icon={<Activity />} highlight={highlight}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-300">Daily incident count (last {range} days)</div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Avg / day</div>
            <div className="text-xl font-bold text-blue-300">{avg}</div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded mb-3 flex-1 flex items-center">
          <MiniBars series={daily} height={120} color="#60A5FA" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <SmallStat label="Total" value={totalIncidents} />
          <SmallStat label="Days" value={totalDays} />
          <SmallStat label="Most recent" value={daily.length ? daily[daily.length - 1].count : "—"} />
        </div>
      </div>
    </WidgetShell>
  );
}

/* Tiny bars for velocity */
function MiniBars({ series = [], height = 120, color = "#60A5FA" }) {
  if (!series.length) return <div className="text-gray-400 text-sm">No data</div>;
  const max = Math.max(...series.map(s => s.count || 0), 1);
  return (
    <div className="flex items-end gap-1 w-full" style={{ height }}>
      {series.map((d, i) => (
        <div
          key={i}
          title={`${d.date || d.day || i}: ${d.count}`}
          className="flex-1 rounded-sm transition-transform transform hover:scale-y-110"
          style={{
            height: `${Math.max(4, (d.count / max) * height)}px`,
            background: color,
            opacity: 0.95,
            minWidth: 4
          }}
        />
      ))}
    </div>
  );
}

/* ===========================
   StatusPieChart Component
   GET /api/incidents/kpi/status
   =========================== */
function StatusPieChart({ baseUrl = "http://localhost:5000", highlight = false }) {
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
  if (loading) return <WidgetShell title="Status Breakdown" loading icon={<PieChart />} highlight={highlight} />;
  if (error) return <WidgetShell title="Status Breakdown" error={error} icon={<PieChart />} highlight={highlight} />;

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
    <WidgetShell title="Status Breakdown" icon={<PieChart />} highlight={highlight}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-6 flex-1">
          <div className="flex-shrink-0">
            <svg width="200" height="200" className="mx-auto">
              <g transform="translate(100,100) rotate(-90)">
                <circle r={radius} fill="none" stroke="#071026" strokeWidth="32" />
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

          <div className="flex-1 flex flex-col h-full">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-gray-400 mb-3">Total incidents</div>

            <div className="space-y-2 mt-2 overflow-auto">
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
  if (loading) return <WidgetShell title="Category Distribution" loading icon={<TrendingUp />} />;
  if (error) return <WidgetShell title="Category Distribution" error={error} icon={<TrendingUp />} />;

  const maxCount = items.length ? Math.max(...items.map(i => i.count || 0)) : 1;
  return (
    <WidgetShell title="Category Distribution" icon={<TrendingUp />}>
      <div className="flex flex-col h-full">
        <div className="space-y-4 flex-1 overflow-auto">
          {items.map((it, idx) => {
            const pct = maxCount ? Math.round((it.count / maxCount) * 100) : 0;
            return (
              <div key={`${it.category}-${idx}`} className="p-3 bg-slate-800/40 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-semibold text-white">{it.category || "Unknown"}</div>
                  <div className="text-sm text-gray-400">{it.count}</div>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded overflow-hidden">
                  <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded transition-width duration-500" />
                </div>
              </div>
            );
          })}
        </div>
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
  if (loading) return <WidgetShell title="Month-over-Month Growth" loading icon={<Calendar />} />;
  if (error) return <WidgetShell title="Month-over-Month Growth" error={error} icon={<Calendar />} />;

  const counts = rows.map(r => r.count || 0);
  const max = counts.length ? Math.max(...counts) : 1;

  return (
    <WidgetShell title="Month-over-Month Growth" icon={<Calendar />}>
      <div className="flex flex-col h-full">
        <div className="bg-slate-800/40 p-3 rounded mb-3 flex-1 flex items-end">
          <div className="flex items-end gap-3 w-full h-36">
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
            <div key={r.month} className="flex items-center justify-between p-2 bg-slate-800/40 rounded">
              <div className="text-sm text-white font-medium">{r.month}</div>
              <div className="text-xs text-gray-400">{r.count} incidents · <span className={r.growth && r.growth.startsWith("-") ? "text-red-400" : "text-green-400"}>{r.growth ?? "—"}</span></div>
            </div>
          ))}
        </div>
      </div>
    </WidgetShell>
  );
}

/* ===========================
   TypeTrends Component
   GET /api/incidents/kpi/trends/types?range={range}
   =========================== */
function TypeTrends({ baseUrl = "http://localhost:5000", range = 90, topN = 4, highlight = false }) {
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
  if (loading) return <WidgetShell title="Type Trends" loading icon={<Zap />} highlight={highlight} />;
  if (error) return <WidgetShell title="Type Trends" error={error} icon={<Zap />} highlight={highlight} />;

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
    <WidgetShell title="Incident Type Trends" icon={<Zap />} highlight={highlight}>
      <div className="flex flex-col h-full">
        <div className="space-y-4 flex-1 overflow-auto">
          {top.length === 0 ? <div className="text-gray-400 text-sm">No trend data</div> : top.map((t, i) => (
            <div key={t.type} className="p-3 bg-slate-800/40 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-white">{t.type}</div>
                <div className="text-xs text-gray-400">{t.total} total</div>
              </div>
              <div className="h-24 bg-slate-900/30 rounded p-2">
                <TinyLine points={t.series} color={["#60A5FA", "#34D399", "#F59E0B", "#F97316", "#A78BFA"][i % 5]} />
              </div>
            </div>
          ))}
        </div>
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
  const id = `g-${Math.abs(hashCode(color))}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${id})`} />
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ===========================
   GeographicHeatmap (DETAILED)
   GET /api/incidents/kpi/heatmap?range={range}
   - keeps backend calls unchanged
   =========================== */
function GeographicHeatmap({ baseUrl = "http://localhost:5000", range = 30, limit = 8 }) {
  const [state, setState] = React.useState({ loading: true, error: null, rows: [] });
  const [expanded, setExpanded] = React.useState({}); // track expanded rows by idx

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
        // sort by incidentCount desc so we show biggest countries first
        arr.sort((a,b) => (b.incidentCount || 0) - (a.incidentCount || 0));
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
  if (loading) return <WidgetShell title="Geographic Heatmap" loading icon={<Globe />} />;
  if (error) return <WidgetShell title="Geographic Heatmap" error={error} icon={<Globe />} />;

  const max = rows.length ? Math.max(...rows.map(r => r.incidentCount || 0)) : 1;

  return (
    <WidgetShell title="Geographic Distribution" icon={<Globe />}>
      <div className="flex flex-col h-full">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-gray-300">Top countries by incidents</div>
          <div className="text-xs text-gray-400">Range: {range} days</div>
        </div>

        <div className="space-y-3 flex-1 overflow-auto pr-2">
          {rows.length === 0 ? (
            <div className="text-gray-400 text-sm">No geographic data</div>
          ) : rows.map((r, idx) => {
            const pct = max ? Math.round((r.incidentCount / max) * 100) : 0;
            const isOpen = !!expanded[idx];
            return (
              <div key={`${r.country || 'unknown'}-${idx}`} className="p-3 bg-slate-800/40 rounded-lg">
                <div className="flex items-start gap-3">
                  {/* country + flag */}
                  <div className="flex-shrink-0 w-12">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md bg-slate-900/60 flex items-center justify-center text-lg">
                        <span aria-hidden>{flagFromCountry(r.countryCode || r.iso2 || r.country)}</span>
                      </div>
                    </div>
                  </div>

                  {/* main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{r.country || "Unknown"}</div>
                        <div className="text-xs text-gray-400 truncate">
                          {r.uniqueTypes ?? 0} types · {r.uniqueCategories ?? 0} categories
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-white">{r.incidentCount ?? 0}</div>
                        <div className="text-xs text-gray-400">{pct}% of top</div>
                      </div>
                    </div>

                    {/* small row: progress + sparkline */}
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-slate-900 h-3 rounded overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded" />
                        </div>
                      </div>

                      {/* optional sparkline if history exists */}
                      <div className="w-36">
                        {Array.isArray(r.history) && r.history.length > 0 ? (
                          <TinySparkline points={r.history} height={28} />
                        ) : (
                          <div className="text-xs text-gray-400 text-right">no history</div>
                        )}
                      </div>
                    </div>

                    {/* details row (top cities + badge) */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900/40 text-gray-300 text-[11px]">Types: {r.uniqueTypes ?? 0}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900/40 text-gray-300 text-[11px]">Cats: {r.uniqueCategories ?? 0}</span>
                        {Array.isArray(r.topCategories) && r.topCategories.length > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900/40 text-gray-300 text-[11px]">Top: {r.topCategories.slice(0,2).join(", ")}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {Array.isArray(r.topCities) && r.topCities.length > 0 && (
                          <div className="text-xs text-gray-400 hidden sm:inline">Top city: <span className="text-sm text-white font-medium">{r.topCities[0].city} ({r.topCities[0].count})</span></div>
                        )}
                        <button
                          onClick={() => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
                          className="text-xs px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 text-gray-200"
                        >
                          {isOpen ? "Hide details" : "View details"}
                        </button>
                      </div>
                    </div>

                    {/* expanded details */}
                    {isOpen && (
                      <div className="mt-3 border-t border-slate-700/40 pt-3 text-sm text-gray-300">
                        {Array.isArray(r.topCities) && r.topCities.length > 0 ? (
                          <div className="mb-2">
                            <div className="text-xs text-gray-400 mb-1">Top cities</div>
                            <div className="flex flex-col gap-2">
                              {r.topCities.slice(0,6).map((c, ci) => (
                                <div key={ci} className="flex items-center justify-between">
                                  <div className="text-sm text-white">{c.city}</div>
                                  <div className="text-xs text-gray-400">{c.count}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 mb-2">No city breakdown available</div>
                        )}

                        {/* optional longer sparkline with axis labels if history exists */}
                        {Array.isArray(r.history) && r.history.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Trend</div>
                            <div className="w-full h-20 bg-slate-900/30 rounded p-2">
                              <TinyLine points={convertHistoryToPoints(r.history)} color="#34D399" height={48} width={400} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetShell>
  );
}

/* --------------------------
   Helper: small sparkline (very compact)
   Expects points: [{ date, count }, ...]
   -------------------------- */
function TinySparkline({ points = [], height = 28, width = 120 }) {
  if (!points || !points.length) return null;
  const counts = points.map(p => p.count || 0);
  const max = Math.max(...counts, 1);
  const step = width / Math.max(points.length - 1, 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${height - (p.count / max) * height}`).join(" ");
  const fill = `${d} L ${width} ${height} L 0 ${height} Z`;
  const id = `spark-${Math.abs(hashCode(String(points.length) + (points[0]?.date || "")))}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-[28px]">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${id})`} />
      <path d={d} stroke="#34D399" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --------------------------
   Small utilities used above
   -------------------------- */
function flagFromCountry(input) {
  if (!input || typeof input !== "string") return "🌐";
  // If iso2 provided (like "US", "IN"), map to regional indicator symbols
  const iso = input.trim();
  const code = iso.length === 2 ? iso.toUpperCase() : (iso.length > 2 ? iso.slice(0,2).toUpperCase() : iso.toUpperCase());
  if (code.length !== 2 || /[^A-Z]/.test(code)) return "🌐";
  const OFFSET = 0x1F1E6 - 65; // 'A' = 65
  const first = code.charCodeAt(0) + OFFSET;
  const second = code.charCodeAt(1) + OFFSET;
  return String.fromCodePoint(first, second);
}

function convertHistoryToPoints(history) {
  // convert history items to {count} points accepted by TinyLine
  return (Array.isArray(history) ? history : []).map(h => ({ count: h.count || 0, week: h.date || h.day || "" }));
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i);
  return h;
}

/* ===========================
   Tiny UI building blocks
   =========================== */
function WidgetShell({ title, loading = false, error = null, children, icon = null, highlight = false }) {
  // highlight -> stronger border + glow
  const highlightCls = highlight
    ? "ring-1 ring-amber-400/25 shadow-[0_8px_30px_rgba(236,201,75,0.06)] border-amber-500/20"
    : "border-slate-700/30";

  return (
    <div className={`bg-gradient-to-br from-slate-900/92 via-slate-900 to-slate-800 p-4 rounded-2xl ${highlightCls} shadow-xl h-full min-h-[240px] flex flex-col`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 bg-slate-800/60 rounded-lg flex items-center justify-center border ${highlight ? 'border-amber-600/40' : 'border-slate-700/40'}`}>
            {icon ?? <BarChart3 className="w-5 h-5 text-white" />}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="text-xs text-slate-400">KPI widget</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          {loading ? <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Loading</span> : (error ? "Error" : "Live")}
        </div>
      </div>

      {/* body area grows to fill available space */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-6 w-48 bg-slate-700 rounded" />
            <div className="h-28 bg-slate-800 rounded" />
          </div>
        ) : error ? (
          <div className="text-red-400">{String(error)}</div>
        ) : (
          /* ensure children can stretch vertically */
          <div className="h-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent = "blue" }) {
  const accentClass = accent === "green" ? "text-green-400" : "text-blue-400";
  return (
    <div className="p-3 bg-slate-800/40 rounded-lg text-center">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`text-2xl font-bold ${accentClass}`}>{value}</div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="p-2 bg-slate-800/40 rounded">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
}

/* ===========================
   Dashboard: layout that composes all widgets
   - Top: TypeTrends (wide) + Velocity (highlight)
   - Middle: Status + Resolution
   - Bottom: Category + Geographic (detailed)
   =========================== */
export default function Dashboard({ baseUrl = "http://localhost:5000" }) {
  const [range, setRange] = React.useState(30);
  const [showRangeMenu, setShowRangeMenu] = React.useState(false);
  const ranges = [7, 14, 30, 60, 90];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Security Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Overview — KPIs from incidents API</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowRangeMenu(v => !v)}
                className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-slate-800"
              >
                <Clock className="w-4 h-4" />
                <span>Last {range} days</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {showRangeMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-20">
                  {ranges.map(r => (
                    <button
                      key={r}
                      onClick={() => { setRange(r); setShowRangeMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 ${r === range ? "bg-slate-800/40" : ""}`}
                    >
                      {r} days
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-400">Updated: {new Date().toLocaleString()}</div>
          </div>
        </header>

        {/* TOP: Trends (wide) + Velocity (highlight) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 h-full">
            <TypeTrends baseUrl={baseUrl} range={Math.max(range, 30)} topN={5} highlight />
          </div>

          <div className="h-full">
            <VelocityMetrics baseUrl={baseUrl} range={range} highlight />
          </div>
        </div>

        {/* MIDDLE: Status + Resolution side-by-side, equal heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <StatusPieChart baseUrl={baseUrl} />
          <ResolutionMetrics baseUrl={baseUrl} range={range} />
        </div>

        {/* BOTTOM: Category + Geographic side-by-side, same height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <CategoryDistribution baseUrl={baseUrl} limit={6} />
          <GeographicHeatmap baseUrl={baseUrl} range={range} limit={6} />
        </div>
      </div>
    </div>
  );
}


