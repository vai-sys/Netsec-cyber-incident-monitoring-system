
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
//   ChevronDown,
//   RefreshCw
// } from "lucide-react";

// /* ---------------------------
//   Helper: fetch wrapper to include optional token & cancellation
//   --------------------------- */
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
// function ResolutionMetrics({ baseUrl = "http://localhost:5000", range = 30, highlight = false }) {
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

//   if (loading) return <WidgetShell title="Resolution Metrics" loading icon={<CheckCircle2 />} highlight={highlight} />;
//   if (error) return <WidgetShell title="Resolution Metrics" error={error} icon={<CheckCircle2 />} highlight={highlight} />;

//   const total = data?.totalIncidents ?? 0;
//   const resolved = data?.resolvedIncidents ?? 0;
//   const rate = data?.resolutionRate ?? "0%";
//   const avgDays = data?.avgResolutionDays ?? null;
//   const percent = total ? Math.round((resolved / total) * 100) : 0;

//   return (
//     <WidgetShell title="Resolution Metrics" icon={<CheckCircle2 />} highlight={highlight}>
//       <div className="flex flex-col h-full">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           <Stat label="Total Incidents" value={total} />
//           <Stat label="Resolved" value={resolved} accent="green" />
//           <Stat label="Resolution Rate" value={rate} />
//         </div>

//         <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/30 p-4 rounded-lg border border-slate-700/40 flex-1 flex items-center">
//           <div className="flex items-center justify-between w-full gap-4">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="text-sm text-gray-300">Completion Progress</div>
//                 <div className="text-sm font-semibold text-green-300">{percent}%</div>
//               </div>

//               <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
//                 <div
//                   style={{ width: `${percent}%` }}
//                   className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
//                 />
//               </div>

//               <div className="mt-3 text-xs text-gray-400">
//                 Avg resolution: <span className="font-semibold text-white">{avgDays !== null ? `${avgDays} days` : "—"}</span>
//               </div>
//             </div>

//             <div className="ml-6 w-36 text-center bg-slate-800/40 p-3 rounded-lg flex-shrink-0">
//               <div className="text-xs text-gray-300 uppercase">Avg Resolution Time</div>
//               <div className="text-3xl font-bold text-white mt-2">{avgDays !== null ? avgDays : "—"}</div>
//               <div className="text-xs text-gray-400">days / incident</div>
//             </div>
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
// function VelocityMetrics({ baseUrl = "http://localhost:5000", range = 30, highlight = false }) {
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
//   if (loading) return <WidgetShell title="Incident Velocity" loading icon={<Activity />} highlight={highlight} />;
//   if (error) return <WidgetShell title="Incident Velocity" error={error} icon={<Activity />} highlight={highlight} />;

//   const daily = Array.isArray(data?.dailyVelocity) ? data.dailyVelocity : [];
//   const avg = data?.avgIncidentsPerDay ?? (daily.length ? (daily.reduce((s, d) => s + (d.count || 0), 0) / daily.length).toFixed(2) : "0");
//   const totalIncidents = data?.totalIncidents ?? daily.reduce((s, d) => s + (d.count || 0), 0);
//   const totalDays = data?.totalDays ?? daily.length;

//   return (
//     <WidgetShell title="Incident Velocity" icon={<Activity />} highlight={highlight}>
//       <div className="flex flex-col h-full">
//         <div className="flex items-center justify-between mb-3">
//           <div className="text-sm text-gray-300">Daily incident count (last {range} days)</div>
//           <div className="text-right">
//             <div className="text-xs text-gray-400">Avg / day</div>
//             <div className="text-xl font-bold text-blue-300">{avg}</div>
//           </div>
//         </div>

//         <div className="bg-slate-800/50 p-3 rounded mb-3 flex-1 flex items-center">
//           <MiniBars series={daily} height={120} color="#60A5FA" />
//         </div>

//         <div className="grid grid-cols-3 gap-3 text-center">
//           <SmallStat label="Total" value={totalIncidents} />
//           <SmallStat label="Days" value={totalDays} />
//           <SmallStat label="Most recent" value={daily.length ? daily[daily.length - 1].count : "—"} />
//         </div>
//       </div>
//     </WidgetShell>
//   );
// }

// /* Tiny bars for velocity */
// function MiniBars({ series = [], height = 120, color = "#60A5FA" }) {
//   if (!series.length) return <div className="text-gray-400 text-sm">No data</div>;
//   const max = Math.max(...series.map(s => s.count || 0), 1);
//   return (
//     <div className="flex items-end gap-1 w-full" style={{ height }}>
//       {series.map((d, i) => (
//         <div
//           key={i}
//           title={`${d.date || d.day || i}: ${d.count}`}
//           className="flex-1 rounded-sm transition-transform transform hover:scale-y-110"
//           style={{
//             height: `${Math.max(4, (d.count / max) * height)}px`,
//             background: color,
//             opacity: 0.95,
//             minWidth: 4
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// /* ===========================
//    StatusPieChart Component
//    GET /api/incidents/kpi/status
//    =========================== */
// function StatusPieChart({ baseUrl = "http://localhost:5000", highlight = false }) {
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
//   if (loading) return <WidgetShell title="Status Breakdown" loading icon={<PieChart />} highlight={highlight} />;
//   if (error) return <WidgetShell title="Status Breakdown" error={error} icon={<PieChart />} highlight={highlight} />;

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
//     <WidgetShell title="Status Breakdown" icon={<PieChart />} highlight={highlight}>
//       <div className="flex flex-col h-full">
//         <div className="flex items-center gap-6 flex-1">
//           <div className="flex-shrink-0">
//             <svg width="200" height="200" className="mx-auto">
//               <g transform="translate(100,100) rotate(-90)">
//                 <circle r={radius} fill="none" stroke="#071026" strokeWidth="32" />
//                 {segments.map((s, i) => (
//                   <circle key={i}
//                     r={radius}
//                     fill="none"
//                     stroke={COLORS[s.status] || COLORS.Unknown}
//                     strokeWidth="32"
//                     strokeDasharray={`${s.dash} ${s.gap}`}
//                     strokeDashoffset={s.offset}
//                     strokeLinecap="round"
//                   />
//                 ))}
//               </g>
//             </svg>
//           </div>

//           <div className="flex-1 flex flex-col h-full">
//             <div className="text-2xl font-bold text-white">{total}</div>
//             <div className="text-xs text-gray-400 mb-3">Total incidents</div>

//             <div className="space-y-2 mt-2 overflow-auto">
//               {breakdown.map((b) => (
//                 <div key={b.status} className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <span style={{ background: COLORS[b.status] || COLORS.Unknown }} className="w-3 h-3 rounded-sm inline-block" />
//                     <div className="text-sm text-gray-200">{b.status}</div>
//                   </div>
//                   <div className="text-sm text-gray-400">{b.count}</div>
//                 </div>
//               ))}
//             </div>
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
//   if (loading) return <WidgetShell title="Category Distribution" loading icon={<TrendingUp />} />;
//   if (error) return <WidgetShell title="Category Distribution" error={error} icon={<TrendingUp />} />;

//   const maxCount = items.length ? Math.max(...items.map(i => i.count || 0)) : 1;
//   return (
//     <WidgetShell title="Category Distribution" icon={<TrendingUp />}>
//       <div className="flex flex-col h-full">
//         <div className="space-y-4 flex-1 overflow-auto">
//           {items.map((it, idx) => {
//             const pct = maxCount ? Math.round((it.count / maxCount) * 100) : 0;
//             return (
//               <div key={`${it.category}-${idx}`} className="p-3 bg-slate-800/40 rounded-lg">
//                 <div className="flex justify-between items-center mb-2">
//                   <div className="text-sm font-semibold text-white">{it.category || "Unknown"}</div>
//                   <div className="text-sm text-gray-400">{it.count}</div>
//                 </div>
//                 <div className="w-full bg-slate-900 h-3 rounded overflow-hidden">
//                   <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded transition-width duration-500" />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
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
//   if (loading) return <WidgetShell title="Month-over-Month Growth" loading icon={<Calendar />} />;
//   if (error) return <WidgetShell title="Month-over-Month Growth" error={error} icon={<Calendar />} />;

//   const counts = rows.map(r => r.count || 0);
//   const max = counts.length ? Math.max(...counts) : 1;

//   return (
//     <WidgetShell title="Month-over-Month Growth" icon={<Calendar />}>
//       <div className="flex flex-col h-full">
//         <div className="bg-slate-800/40 p-3 rounded mb-3 flex-1 flex items-end">
//           <div className="flex items-end gap-3 w-full h-36">
//             {rows.map(r => {
//               const h = max ? Math.round((r.count / max) * 100) : 0;
//               return <div key={r.month} className="flex-1 flex flex-col items-center">
//                 <div title={`${r.month}: ${r.count}`} className="w-full rounded-t-md" style={{ height: `${Math.max(6, h)}%`, background: "linear-gradient(180deg,#60A5FA,#3B82F6)" }} />
//                 <div className="text-xs text-gray-400 mt-2">{r.month}</div>
//               </div>;
//             })}
//           </div>
//         </div>

//         <div className="space-y-2">
//           {rows.map(r => (
//             <div key={r.month} className="flex items-center justify-between p-2 bg-slate-800/40 rounded">
//               <div className="text-sm text-white font-medium">{r.month}</div>
//               <div className="text-xs text-gray-400">{r.count} incidents · <span className={r.growth && r.growth.startsWith("-") ? "text-red-400" : "text-green-400"}>{r.growth ?? "—"}</span></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </WidgetShell>
//   );
// }

// /* ===========================
//    TypeTrends Component
//    GET /api/incidents/kpi/trends/types?range={range}
//    =========================== */
// function TypeTrends({ baseUrl = "http://localhost:5000", range = 90, topN = 4, highlight = false }) {
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
//   if (loading) return <WidgetShell title="Type Trends" loading icon={<Zap />} highlight={highlight} />;
//   if (error) return <WidgetShell title="Type Trends" error={error} icon={<Zap />} highlight={highlight} />;

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
//     <WidgetShell title="Incident Type Trends" icon={<Zap />} highlight={highlight}>
//       <div className="flex flex-col h-full">
//         <div className="space-y-4 flex-1 overflow-auto">
//           {top.length === 0 ? <div className="text-gray-400 text-sm">No trend data</div> : top.map((t, i) => (
//             <div key={t.type} className="p-3 bg-slate-800/40 rounded-lg">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="text-sm font-semibold text-white">{t.type}</div>
//                 <div className="text-xs text-gray-400">{t.total} total</div>
//               </div>
//               <div className="h-24 bg-slate-900/30 rounded p-2">
//                 <TinyLine points={t.series} color={["#60A5FA", "#34D399", "#F59E0B", "#F97316", "#A78BFA"][i % 5]} />
//               </div>
//             </div>
//           ))}
//         </div>
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
//   const id = `g-${Math.abs(hashCode(color))}`;
//   return (
//     <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
//       <defs>
//         <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
//           <stop offset="0%" stopColor={color} stopOpacity="0.25" />
//           <stop offset="100%" stopColor={color} stopOpacity="0.04" />
//         </linearGradient>
//       </defs>
//       <path d={fill} fill={`url(#${id})`} />
//       <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

// /* ===========================
//    GeographicHeatmap (DETAILED)
//    GET /api/incidents/kpi/heatmap?range={range}
//    - keeps backend calls unchanged
//    =========================== */
// function GeographicHeatmap({ baseUrl = "http://localhost:5000", range = 30, limit = 8 }) {
//   const [state, setState] = React.useState({ loading: true, error: null, rows: [] });
//   const [expanded, setExpanded] = React.useState({}); // track expanded rows by idx

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
//         // sort by incidentCount desc so we show biggest countries first
//         arr.sort((a,b) => (b.incidentCount || 0) - (a.incidentCount || 0));
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
//   if (loading) return <WidgetShell title="Geographic Heatmap" loading icon={<Globe />} />;
//   if (error) return <WidgetShell title="Geographic Heatmap" error={error} icon={<Globe />} />;

//   const max = rows.length ? Math.max(...rows.map(r => r.incidentCount || 0)) : 1;

//   return (
//     <WidgetShell title="Geographic Distribution" icon={<Globe />}>
//       <div className="flex flex-col h-full">
//         <div className="mb-3 flex items-center justify-between">
//           <div className="text-sm text-gray-300">Top countries by incidents</div>
//           <div className="text-xs text-gray-400">Range: {range} days</div>
//         </div>

//         <div className="space-y-3 flex-1 overflow-auto pr-2">
//           {rows.length === 0 ? (
//             <div className="text-gray-400 text-sm">No geographic data</div>
//           ) : rows.map((r, idx) => {
//             const pct = max ? Math.round((r.incidentCount / max) * 100) : 0;
//             const isOpen = !!expanded[idx];
//             return (
//               <div key={`${r.country || 'unknown'}-${idx}`} className="p-3 bg-slate-800/40 rounded-lg">
//                 <div className="flex items-start gap-3">
//                   {/* country + flag */}
//                   <div className="flex-shrink-0 w-12">
//                     <div className="flex items-center gap-2">
//                       <div className="w-10 h-10 rounded-md bg-slate-900/60 flex items-center justify-center text-lg">
//                         <span aria-hidden>{flagFromCountry(r.countryCode || r.iso2 || r.country)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* main content */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between">
//                       <div className="min-w-0">
//                         <div className="text-sm font-semibold text-white truncate">{r.country || "Unknown"}</div>
//                         <div className="text-xs text-gray-400 truncate">
//                           {r.uniqueTypes ?? 0} types · {r.uniqueCategories ?? 0} categories
//                         </div>
//                       </div>

//                       <div className="text-right ml-4">
//                         <div className="text-lg font-bold text-white">{r.incidentCount ?? 0}</div>
//                         <div className="text-xs text-gray-400">{pct}% of top</div>
//                       </div>
//                     </div>

//                     {/* small row: progress + sparkline */}
//                     <div className="mt-3 flex items-center gap-4">
//                       <div className="flex-1">
//                         <div className="w-full bg-slate-900 h-3 rounded overflow-hidden">
//                           <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded" />
//                         </div>
//                       </div>

//                       {/* optional sparkline if history exists */}
//                       <div className="w-36">
//                         {Array.isArray(r.history) && r.history.length > 0 ? (
//                           <TinySparkline points={r.history} height={28} />
//                         ) : (
//                           <div className="text-xs text-gray-400 text-right">no history</div>
//                         )}
//                       </div>
//                     </div>

//                     {/* details row (top cities + badge) */}
//                     <div className="mt-3 flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-xs">
//                         <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900/40 text-gray-300 text-[11px]">Types: {r.uniqueTypes ?? 0}</span>
//                         <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900/40 text-gray-300 text-[11px]">Cats: {r.uniqueCategories ?? 0}</span>
//                         {Array.isArray(r.topCategories) && r.topCategories.length > 0 && (
//                           <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900/40 text-gray-300 text-[11px]">Top: {r.topCategories.slice(0,2).join(", ")}</span>
//                         )}
//                       </div>

//                       <div className="flex items-center gap-2">
//                         {Array.isArray(r.topCities) && r.topCities.length > 0 && (
//                           <div className="text-xs text-gray-400 hidden sm:inline">Top city: <span className="text-sm text-white font-medium">{r.topCities[0].city} ({r.topCities[0].count})</span></div>
//                         )}
//                         <button
//                           onClick={() => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
//                           className="text-xs px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 text-gray-200"
//                         >
//                           {isOpen ? "Hide details" : "View details"}
//                         </button>
//                       </div>
//                     </div>

//                     {/* expanded details */}
//                     {isOpen && (
//                       <div className="mt-3 border-t border-slate-700/40 pt-3 text-sm text-gray-300">
//                         {Array.isArray(r.topCities) && r.topCities.length > 0 ? (
//                           <div className="mb-2">
//                             <div className="text-xs text-gray-400 mb-1">Top cities</div>
//                             <div className="flex flex-col gap-2">
//                               {r.topCities.slice(0,6).map((c, ci) => (
//                                 <div key={ci} className="flex items-center justify-between">
//                                   <div className="text-sm text-white">{c.city}</div>
//                                   <div className="text-xs text-gray-400">{c.count}</div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="text-xs text-gray-500 mb-2">No city breakdown available</div>
//                         )}

//                         {/* optional longer sparkline with axis labels if history exists */}
//                         {Array.isArray(r.history) && r.history.length > 0 && (
//                           <div>
//                             <div className="text-xs text-gray-400 mb-1">Trend</div>
//                             <div className="w-full h-20 bg-slate-900/30 rounded p-2">
//                               <TinyLine points={convertHistoryToPoints(r.history)} color="#34D399" height={48} width={400} />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </WidgetShell>
//   );
// }

// /* --------------------------
//    Helper: small sparkline (very compact)
//    Expects points: [{ date, count }, ...]
//    -------------------------- */
// function TinySparkline({ points = [], height = 28, width = 120 }) {
//   if (!points || !points.length) return null;
//   const counts = points.map(p => p.count || 0);
//   const max = Math.max(...counts, 1);
//   const step = width / Math.max(points.length - 1, 1);
//   const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${height - (p.count / max) * height}`).join(" ");
//   const fill = `${d} L ${width} ${height} L 0 ${height} Z`;
//   const id = `spark-${Math.abs(hashCode(String(points.length) + (points[0]?.date || "")))}`;
//   return (
//     <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-[28px]">
//       <defs>
//         <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
//           <stop offset="0%" stopColor="#34D399" stopOpacity="0.18" />
//           <stop offset="100%" stopColor="#34D399" stopOpacity="0.02" />
//         </linearGradient>
//       </defs>
//       <path d={fill} fill={`url(#${id})`} />
//       <path d={d} stroke="#34D399" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

// /* --------------------------
//    Small utilities used above
//    -------------------------- */
// function flagFromCountry(input) {
//   if (!input || typeof input !== "string") return "🌐";
//   // If iso2 provided (like "US", "IN"), map to regional indicator symbols
//   const iso = input.trim();
//   const code = iso.length === 2 ? iso.toUpperCase() : (iso.length > 2 ? iso.slice(0,2).toUpperCase() : iso.toUpperCase());
//   if (code.length !== 2 || /[^A-Z]/.test(code)) return "🌐";
//   const OFFSET = 0x1F1E6 - 65; // 'A' = 65
//   const first = code.charCodeAt(0) + OFFSET;
//   const second = code.charCodeAt(1) + OFFSET;
//   return String.fromCodePoint(first, second);
// }

// function convertHistoryToPoints(history) {
//   // convert history items to {count} points accepted by TinyLine
//   return (Array.isArray(history) ? history : []).map(h => ({ count: h.count || 0, week: h.date || h.day || "" }));
// }

// function hashCode(str) {
//   let h = 0;
//   for (let i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i);
//   return h;
// }

// /* ===========================
//    Tiny UI building blocks
//    =========================== */
// function WidgetShell({ title, loading = false, error = null, children, icon = null, highlight = false }) {
//   // highlight -> stronger border + glow
//   const highlightCls = highlight
//     ? "ring-1 ring-amber-400/25 shadow-[0_8px_30px_rgba(236,201,75,0.06)] border-amber-500/20"
//     : "border-slate-700/30";

//   return (
//     <div className={`bg-gradient-to-br from-slate-900/92 via-slate-900 to-slate-800 p-4 rounded-2xl ${highlightCls} shadow-xl h-full min-h-[240px] flex flex-col`}>
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <div className={`w-11 h-11 bg-slate-800/60 rounded-lg flex items-center justify-center border ${highlight ? 'border-amber-600/40' : 'border-slate-700/40'}`}>
//             {icon ?? <BarChart3 className="w-5 h-5 text-white" />}
//           </div>
//           <div>
//             <div className="text-sm font-semibold text-white">{title}</div>
//             <div className="text-xs text-slate-400">KPI widget</div>
//           </div>
//         </div>
//         <div className="text-xs text-slate-400">
//           {loading ? <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Loading</span> : (error ? "Error" : "Live")}
//         </div>
//       </div>

//       {/* body area grows to fill available space */}
//       <div className="flex-1 overflow-hidden">
//         {loading ? (
//           <div className="animate-pulse space-y-2">
//             <div className="h-6 w-48 bg-slate-700 rounded" />
//             <div className="h-28 bg-slate-800 rounded" />
//           </div>
//         ) : error ? (
//           <div className="text-red-400">{String(error)}</div>
//         ) : (
//           /* ensure children can stretch vertically */
//           <div className="h-full">
//             {children}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function Stat({ label, value, accent = "blue" }) {
//   const accentClass = accent === "green" ? "text-green-400" : "text-blue-400";
//   return (
//     <div className="p-3 bg-slate-800/40 rounded-lg text-center">
//       <div className="text-xs text-gray-400">{label}</div>
//       <div className={`text-2xl font-bold ${accentClass}`}>{value}</div>
//     </div>
//   );
// }

// function SmallStat({ label, value }) {
//   return (
//     <div className="p-2 bg-slate-800/40 rounded">
//       <div className="text-xs text-gray-400">{label}</div>
//       <div className="text-lg font-bold text-white">{value}</div>
//     </div>
//   );
// }

// /* ===========================
//    Dashboard: layout that composes all widgets
//    - Top: TypeTrends (wide) + Velocity (highlight)
//    - Middle: Status + Resolution
//    - Bottom: Category + Geographic (detailed)
//    =========================== */
// export default function Dashboard({ baseUrl = "http://localhost:5000" }) {
//   const [range, setRange] = React.useState(30);
//   const [showRangeMenu, setShowRangeMenu] = React.useState(false);
//   const ranges = [7, 14, 30, 60, 90];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* header */}
//         <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Security Dashboard</h1>
//             <p className="text-sm text-gray-400 mt-1">Overview — KPIs from incidents API</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <button
//                 onClick={() => setShowRangeMenu(v => !v)}
//                 className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-slate-800"
//               >
//                 <Clock className="w-4 h-4" />
//                 <span>Last {range} days</span>
//                 <ChevronDown className="w-4 h-4 opacity-70" />
//               </button>

//               {showRangeMenu && (
//                 <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-20">
//                   {ranges.map(r => (
//                     <button
//                       key={r}
//                       onClick={() => { setRange(r); setShowRangeMenu(false); }}
//                       className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 ${r === range ? "bg-slate-800/40" : ""}`}
//                     >
//                       {r} days
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="text-sm text-gray-400">Updated: {new Date().toLocaleString()}</div>
//           </div>
//         </header>

//         {/* TOP: Trends (wide) + Velocity (highlight) */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
//           <div className="lg:col-span-2 h-full">
//             <TypeTrends baseUrl={baseUrl} range={Math.max(range, 30)} topN={5} highlight />
//           </div>

//           <div className="h-full">
//             <VelocityMetrics baseUrl={baseUrl} range={range} highlight />
//           </div>
//         </div>

//         {/* MIDDLE: Status + Resolution side-by-side, equal heights */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
//           <StatusPieChart baseUrl={baseUrl} />
//           <ResolutionMetrics baseUrl={baseUrl} range={range} />
//         </div>

//         {/* BOTTOM: Category + Geographic side-by-side, same height */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
//           <CategoryDistribution baseUrl={baseUrl} limit={6} />
//           <GeographicHeatmap baseUrl={baseUrl} range={range} limit={6} />
//         </div>
//       </div>
//     </div>
//   );
// }




// src/pages/Dashboard.jsx
import React from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";

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
  RefreshCw,
  AlertTriangle,
  Shield,
  Info,
  X,
  Map as MapIcon,
  Maximize2
} from "lucide-react";

/** Helper: small wrapper to call axios with provided opts (method, headers, params, etc.) */
async function fetchWithToken(url, opts = {}) {
  const cfg = {
    method: opts.method || "get",
    url,
    headers: { ...(opts.headers || {}) },
    params: opts.params || undefined,
    data: opts.data || undefined,
    timeout: opts.timeout || 0,
    cancelToken: opts.cancelToken || undefined
  };
  return axios.request(cfg);
}

const COUNTRY_COORDS = {
  US: [37.0902, -95.7129], CA: [56.1304, -106.3468], MX: [23.6345, -102.5528],
  BR: [-14.2350, -51.9253], AR: [-38.4161, -63.6167], CL: [-35.6751, -71.5430],
  GB: [55.3781, -3.4360], DE: [51.1657, 10.4515], FR: [46.2276, 2.2137],
  ES: [40.4637, -3.7492], IT: [41.8719, 12.5674], RU: [61.5240, 105.3188],
  CN: [35.8617, 104.1954], IN: [20.5937, 78.9629], JP: [36.2048, 138.2529],
  AU: [-25.2744, 133.7751], ZA: [-30.5595, 22.9375], EG: [26.8206, 30.8025],
  SA: [23.8859, 45.0792], AE: [23.4241, 53.8478], KR: [35.9078, 127.7669],
  NG: [9.0820, 8.6753], KE: [-0.0236, 37.9062], ID: [-0.7893, 113.9213],
  TR: [38.9637, 35.2433], IR: [32.4279, 53.6880], PK: [30.3753, 69.3451]
  // Add more as needed
};

function getCoordsFromCountry(code) {
  if (!code || typeof code !== 'string') return [0, 0];
  const c = code.trim().toUpperCase();
  return COUNTRY_COORDS[c] || [20, 0];
}

function WidgetShell({
  title,
  loading = false,
  error = null,
  children,
  icon = null,
  highlight = false,
  summary = null,
  badge = null,
  description = "No description available."
}) {
  const [showInfo, setShowInfo] = React.useState(false);

  const borderClass = highlight
    ? "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
    : "border-slate-800 hover:border-slate-700";

  return (
    <div className={`relative bg-slate-900/90 backdrop-blur-xl rounded-xl border ${borderClass} flex flex-col h-full w-full transition-all duration-300 group overflow-hidden`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-800/60 flex items-start justify-between bg-slate-900/50">
        <div className="flex gap-4">
          <div className={`mt-0.5 p-2.5 rounded-lg h-fit ${highlight ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800/80 text-slate-400'}`}>
            {icon ? React.cloneElement(icon, { size: 20 }) : <BarChart3 size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-100 text-lg tracking-tight leading-none">{title}</h3>
              {badge}
            </div>
            {summary && <p className="text-xs text-slate-400 mt-1.5 font-medium">{summary}</p>}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 rounded-md text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Show Info"
          >
            <Info size={18} />
          </button>

          {loading && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
          {error && <AlertTriangle className="w-4 h-4 text-red-500" />}
          {!loading && !error && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
        </div>
      </div>

      {/* Info Overlay */}
      {showInfo && (
        <div className="absolute inset-0 z-[1000] bg-slate-950/95 backdrop-blur-sm p-8 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setShowInfo(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full"
          >
            <X size={20} />
          </button>
          <div className="mb-6 p-4 bg-slate-800 rounded-full text-cyan-400 border border-slate-700">
            <Info size={32} />
          </div>
          <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
          <p className="text-slate-300 text-base leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col min-h-0 relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-900/50 z-10">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
            <span className="text-xs text-cyan-500/80 uppercase tracking-widest font-semibold">Syncing Data...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center max-w-xs">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-red-200 font-medium">{String(error)}</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color = "slate", highlight = false }) {
  const colors = {
    slate: "bg-slate-800/40 border-slate-700/50 text-slate-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400"
  };

  return (
    <div className={`rounded-xl border p-4 flex flex-col justify-between h-full min-h-[100px] ${colors[color]} ${highlight ? 'ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-900/20' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">{label}</span>
        <span className="opacity-80 scale-110">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight truncate">
        {value}
      </div>
    </div>
  );
}

function CompactStat({ label, value, accent = false }) {
  return (
    <div className={`px-3 py-3 rounded-lg border text-center flex-1 ${accent ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-800/40 border-slate-700/40'}`}>
      <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">{label}</div>
      <div className={`text-xl font-bold ${accent ? 'text-cyan-400' : 'text-slate-200'}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ label, color = "blue" }) {
  const styles = {
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    red: "text-red-400 bg-red-400/10 border-red-400/20"
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${styles[color]} uppercase tracking-wider`}>
      {label}
    </span>
  );
}

function TrendBadge({ trend }) {
  if (trend === "up") return <StatusBadge label="High Activity" color="red" />;
  if (trend === "down") return <StatusBadge label="Cooling Down" color="emerald" />;
  return <StatusBadge label="Stable" color="blue" />;
}

function RealWorldMap({ baseUrl = "http://localhost:5000", range = 30, description }) {
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
        setState({ loading: false, error: null, rows: Array.isArray(res.data) ? res.data : [] });
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) console.error("RealWorldMap:", err);
        setState({ loading: false, error: err.response?.data?.message || err.message || "Error", rows: [] });
      }
    })();
    return () => { mounted = false; source.cancel("unmount"); };
  }, [baseUrl, range]);

  const { loading, error, rows } = state;
  if (loading) return <WidgetShell title="Global Incident Map" loading icon={<MapIcon />} description={description} />;
  if (error) return <WidgetShell title="Global Incident Map" error={error} icon={<MapIcon />} description={description} />;

  const total = rows.reduce((acc, r) => acc + (r.incidentCount || 0), 0);
  const max = Math.max(...rows.map(r => r.incidentCount || 0), 1);

  return (
    <WidgetShell
      title="Global Incident Map"
      icon={<MapIcon />}
      summary={`${rows.length} active regions • ${total} total events`}
      description={description}
    >
      <div className="h-full w-full rounded-xl overflow-hidden border border-slate-700/50 relative z-0">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#0f172a' }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          />

          {rows.map((r, idx) => {
            const countryCode = r.countryCode || r.iso2 || r.country;
            const safeCode = typeof countryCode === 'string' ? countryCode : String(countryCode || "");
            const coords = getCoordsFromCountry(safeCode);
            const count = r.incidentCount || 0;

            const size = Math.max(5, Math.min(30, (count / max) * 40));
            const color = count > (max * 0.7) ? "#ef4444" : count > (max * 0.3) ? "#f59e0b" : "#06b6d4";

            if (coords[0] === 0 && coords[1] === 0) return null;

            return (
              <CircleMarker
                key={`${safeCode}-${idx}`}
                center={coords}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.6, weight: 1 }}
                radius={size}
              >
                <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="text-center">
                    <strong className="text-sm">{r.country}</strong><br />
                    <span className="text-xs">{count} Incidents</span>
                  </div>
                </LeafletTooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </WidgetShell>
  );
}

/* SmartTrendGraph */
function SmartTrendGraph({ points = [], color = "#22d3ee", height = 120 }) {
  const [activeIndex, setActiveIndex] = React.useState(null);

  if (!points || points.length < 2) return null;

  const values = points.map(p => p.count || 0);
  const maxVal = Math.max(...values, 1);
  const currentVal = values[values.length - 1];
  const startVal = values[0];

  const sum = values.reduce((a, b) => a + b, 0);
  const avgVal = Math.round(sum / values.length) || 0;

  const peakIndex = values.indexOf(maxVal);
  const peakDate = points[peakIndex]?.week || points[peakIndex]?.date || "Unknown";

  const diff = currentVal - startVal;
  const isUp = diff > 0;

  const viewBoxW = 300;
  const viewBoxH = 100;
  const paddingX = 15;
  const paddingY = 20;

  const getX = (index) => paddingX + (index / (points.length - 1)) * (viewBoxW - (paddingX * 2));
  const getY = (val) => viewBoxH - paddingY - ((val / maxVal) * (viewBoxH - (paddingY * 2)));

  const thresholdY = getY(avgVal);

  const dPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.count || 0)}`).join(" ");
  const fillD = `${dPath} L ${getX(points.length - 1)} ${viewBoxH} L ${getX(0)} ${viewBoxH} Z`;

  return (
    <div className="w-full h-full flex flex-col justify-between group/graph">
      <div className="flex-1 w-full relative min-h-0">
        <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <line
            x1={paddingX} y1={thresholdY}
            x2={viewBoxW - paddingX} y2={thresholdY}
            stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"
          />
          <text x={viewBoxW - paddingX} y={thresholdY - 4} textAnchor="end" fill="#f59e0b" fontSize="9" fontWeight="bold">
            AVG: {avgVal}
          </text>

          <path d={fillD} fill={`url(#grad-${color.replace('#', '')})`} />
          <path d={dPath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => {
            const stepX = (viewBoxW - (paddingX * 2)) / (points.length - 1);
            return (
              <rect
                key={`hit-${i}`}
                x={getX(i) - (stepX / 2)}
                y={0}
                width={stepX}
                height={viewBoxH}
                fill="transparent"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{ cursor: 'crosshair' }}
              />
            );
          })}

          {activeIndex !== null && (
            <g>
              <line
                x1={getX(activeIndex)} y1={paddingY}
                x2={getX(activeIndex)} y2={viewBoxH}
                stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5"
              />
              <circle cx={getX(activeIndex)} cy={getY(values[activeIndex])} r="4" fill={color} stroke="white" strokeWidth="2" />
              <rect
                x={getX(activeIndex) - 25}
                y={getY(values[activeIndex]) - 25}
                width="50" height="18" rx="4"
                fill="#0f172a" stroke={color} strokeWidth="1"
              />
              <text
                x={getX(activeIndex)}
                y={getY(values[activeIndex]) - 13}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
                dominantBaseline="middle"
              >
                {values[activeIndex]}
              </text>
            </g>
          )}

          {activeIndex === null && (
            <circle cx={getX(peakIndex)} cy={getY(maxVal)} r="3" fill="#fff" stroke={color} strokeWidth="2" />
          )}
        </svg>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
        <div className="flex flex-col">
          <span className="text-slate-500 uppercase text-[9px] font-bold tracking-wider">Peak Date</span>
          <span className="text-slate-300 font-mono">{peakDate}</span>
        </div>
        <div className="text-right">
          <span className={`font-bold flex items-center justify-end gap-1 ${isUp ? 'text-red-400' : 'text-emerald-400'}`}>
            {isUp ? <TrendingUp size={14} /> : <Activity size={14} />}
            {diff > 0 ? `+${diff}` : diff}
          </span>
          <span className="text-slate-500 text-[10px]">vs start date</span>
        </div>
      </div>
    </div>
  );
}

/* TypeTrends */
function TypeTrends({ baseUrl = "http://localhost:5000", range = 90, topN = 4, highlight = false, description }) {
  const [state, setState] = React.useState({ loading: true, error: null, rows: [] });
  const [selectedTrend, setSelectedTrend] = React.useState(null);

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
  if (loading) return <WidgetShell title="Incident Type Trends" loading icon={<Zap />} highlight={highlight} description={description} />;
  if (error) return <WidgetShell title="Incident Type Trends" error={error} icon={<Zap />} highlight={highlight} description={description} />;

  const weeks = Array.from(new Set(rows.map(r => r.week))).sort();
  const map = {};
  rows.forEach(r => {
    const t = r.incidentType || r.incident_type || "Unknown";
    if (!map[t]) map[t] = {};
    map[t][r.week] = (map[t][r.week] || 0) + (r.count || 0);
  });
  const totals = Object.keys(map).map(t => ({
    type: t,
    total: Object.values(map[t]).reduce((s, v) => s + v, 0),
    series: weeks.map(w => ({ week: w, count: map[t][w] || 0 }))
  }));
  totals.sort((a, b) => b.total - a.total);
  const top = totals.slice(0, topN);
  const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];

  return (
    <WidgetShell
      title="Incident Type Trends"
      icon={<Zap />}
      highlight={highlight}
      summary={`Top ${topN} types detected over ${range} days`}
      description={description}
    >
      <div className="relative h-full">
        {selectedTrend && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedTrend.type}</h3>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <Activity size={14} /> Detailed analysis view
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedTrend(null); }}
                className="p-2 bg-slate-800 rounded-full hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors border border-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 w-full bg-slate-900/50 rounded-xl border border-slate-800 p-6 shadow-2xl relative flex flex-col">
              <div className="absolute top-4 right-4 bg-slate-800/90 px-4 py-2 rounded-lg border border-slate-700 text-white font-bold shadow-lg z-10">
                Total Events: {selectedTrend.total}
              </div>
              <SmartTrendGraph points={selectedTrend.series} color="#22d3ee" />
            </div>
          </div>
        )}

        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
          {top.length === 0 ? (
            <div className="text-slate-500 text-sm flex items-center justify-center h-full">No trend data available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {top.map((t, i) => (
                <div
                  key={`trend-${t.type}`}
                  onClick={() => setSelectedTrend(t)}
                  className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all cursor-pointer shadow-sm group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor]" style={{ color: colors[i % colors.length], backgroundColor: colors[i % colors.length] }} />
                      <div className="min-w-0">
                        <span className="text-base font-bold text-slate-100 block truncate max-w-[220px] group-hover:text-cyan-200 transition-colors" title={t.type}>{t.type}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Maximize2 size={10} /> Click to expand
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-white">{t.total}</span>
                  </div>

                  <div className="h-36 w-full">
                    <SmartTrendGraph points={t.series} color={colors[i % colors.length]} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WidgetShell>
  );
}

/* ResolutionMetrics */
function ResolutionMetrics({ baseUrl = "http://localhost:5000", range = 30, highlight = false, description }) {
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
    return () => { mounted = false; source.cancel("unmount"); };
  }, [baseUrl, range]);

  const { loading, error, data } = state;
  if (loading) return <WidgetShell title="Resolution Performance" loading icon={<CheckCircle2 />} highlight={highlight} description={description} />;
  if (error) return <WidgetShell title="Resolution Performance" error={error} icon={<CheckCircle2 />} highlight={highlight} description={description} />;

  const total = data?.totalIncidents ?? 0;
  const resolved = data?.resolvedIncidents ?? 0;
  const rate = data?.resolutionRate ?? "0%";
  const avgDays = data?.avgResolutionDays ?? null;
  const percent = total ? Math.round((resolved / total) * 100) : 0;
  const status = percent >= 80 ? "excellent" : percent >= 60 ? "good" : percent >= 40 ? "warning" : "critical";
  const statusConfig = {
    excellent: { color: "emerald", label: "Excellent" },
    good: { color: "blue", label: "Good" },
    warning: { color: "amber", label: "Needs Attention" },
    critical: { color: "red", label: "Critical" }
  };
  const currentStatus = statusConfig[status];

  return (
    <WidgetShell
      title="Resolution Performance"
      icon={<CheckCircle2 />}
      highlight={highlight}
      summary="Efficiency of incident closure"
      badge={<StatusBadge label={currentStatus.label} color={currentStatus.color} />}
      description={description}
    >
      <div className="flex flex-col h-full gap-5">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard label="Total" value={total} icon="📊" color="slate" />
          <MetricCard label="Resolved" value={resolved} icon="✓" color="emerald" highlight />
          <MetricCard label="Rate" value={rate} icon="📈" color="blue" />
        </div>

        <div className="flex-1 flex flex-col justify-end bg-slate-950/30 rounded-xl p-5 border border-slate-800">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completion</span>
              <div className="text-3xl font-bold text-white mt-1">{percent}%</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Time</span>
              <div className="text-2xl font-bold text-white mt-1">{avgDays !== null ? avgDays : "—"} <span className="text-sm font-normal text-slate-500">days</span></div>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${percent}%` }}
              className={`h-full bg-${currentStatus.color}-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out`}
            />
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}

/* VelocityMetrics */
function VelocityMetrics({ baseUrl = "http://localhost:5000", range = 30, highlight = false, description }) {
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
  if (loading) return <WidgetShell title="Incident Velocity" loading icon={<Activity />} highlight={highlight} description={description} />;
  if (error) return <WidgetShell title="Incident Velocity" error={error} icon={<Activity />} highlight={highlight} description={description} />;

  const daily = Array.isArray(data?.dailyVelocity) ? data.dailyVelocity : [];
  const avg = data?.avgIncidentsPerDay ?? (daily.length ? (daily.reduce((s, d) => s + (d.count || 0), 0) / daily.length).toFixed(1) : "0");
  const totalIncidents = data?.totalIncidents ?? daily.reduce((s, d) => s + (d.count || 0), 0);
  const mostRecent = daily.length ? daily[daily.length - 1].count : 0;
  const trend = mostRecent > parseFloat(avg) ? "up" : mostRecent < parseFloat(avg) ? "down" : "stable";

  return (
    <WidgetShell
      title="Incident Velocity"
      icon={<Activity />}
      highlight={highlight}
      summary={`Avg: ${avg}/day`}
      badge={<TrendBadge trend={trend} />}
      description={description}
    >
      <div className="flex flex-col h-full gap-5">
        <div className="flex-1 min-h-[140px] bg-slate-950/30 border border-slate-800 rounded-xl p-4 flex flex-col relative group">
          <MiniBars series={daily} height="100%" color="#06b6d4" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <CompactStat label="Total" value={totalIncidents} />
          <CompactStat label="Range" value={`${range}d`} />
          <CompactStat label="Latest" value={mostRecent} accent />
        </div>
      </div>
    </WidgetShell>
  );
}

/* MiniBars */
function MiniBars({ series = [], height = 120, color = "#60A5FA" }) {
  const [hoveredData, setHoveredData] = React.useState(null);

  if (!series.length) return <div className="text-slate-500 text-xs flex items-center justify-center h-full">No data available</div>;

  const max = Math.max(...series.map(s => s.count || 0), 1);

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="absolute top-0 right-0 text-right pointer-events-none z-10 h-6">
        {hoveredData ? (
          <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
            <span className="text-xs text-slate-400 mr-2 font-mono">{hoveredData.date || hoveredData.day}</span>
            <span className="text-sm font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 shadow-sm">
              {hoveredData.count} Events
            </span>
          </div>
        ) : (
          <div className="text-xs text-slate-600 font-medium italic opacity-50">
            Hover bars for details
          </div>
        )}
      </div>

      <div className="flex items-end gap-1.5 w-full h-full mt-6">
        {series.map((d, i) => {
          const pct = (d.count / max) * 100;
          const isHovered = hoveredData === d;

          return (
            <div
              key={`bar-${i}`}
              className="flex-1 relative flex flex-col justify-end h-full group"
              onMouseEnter={() => setHoveredData(d)}
              onMouseLeave={() => setHoveredData(null)}
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-200 min-w-[4px] cursor-pointer ${isHovered ? 'bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.8)] opacity-100 scale-y-105' : 'bg-cyan-500/40 opacity-80 hover:bg-cyan-400'}`}
                style={{ height: `${Math.max(5, pct)}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* StatusPieChart */
function StatusPieChart({ baseUrl = "http://localhost:5000", highlight = false, description }) {
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
  if (loading) return <WidgetShell title="Status Distribution" loading icon={<PieChart />} highlight={highlight} description={description} />;
  if (error) return <WidgetShell title="Status Distribution" error={error} icon={<PieChart />} highlight={highlight} description={description} />;

  const COLORS = {
    Open: "#f59e0b",
    Investigating: "#3b82f6",
    Resolved: "#10b981",
    Closed: "#6b7280",
    Unknown: "#64748b"
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;
  const segments = breakdown.map((b) => {
    const pct = total ? (b.count / total) : 0;
    const dash = pct * circumference;
    const seg = { ...b, dash, gap: circumference - dash, offset: cumulative, pct: Math.round(pct * 100) };
    cumulative -= dash;
    return seg;
  });

  return (
    <WidgetShell
      title="Status Distribution"
      icon={<PieChart />}
      highlight={highlight}
      summary="Lifecycle breakdown"
      description={description}
    >
      <div className="flex flex-col sm:flex-row items-center gap-8 h-full justify-center px-4">
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg width="100%" height="100%" viewBox="0 0 180 180" className="transform -rotate-90 filter drop-shadow-xl">
            <circle r={radius} cx="90" cy="90" fill="none" stroke="#1e293b" strokeWidth="22" />
            {segments.map((s, i) => (
              <circle key={`seg-${i}`} r={radius} cx="90" cy="90"
                fill="none" stroke={COLORS[s.status] || COLORS.Unknown} strokeWidth="22"
                strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={s.offset} strokeLinecap="round"
                className="transition-all duration-500 ease-out hover:opacity-80"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white tracking-tighter">{total}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Total</span>
          </div>
        </div>
        <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar h-48">
          <div className="space-y-2">
            {breakdown.map((b) => {
              const pct = total ? Math.round((b.count / total) * 100) : 0;
              return (
                <div key={`status-${b.status}`} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div style={{ background: COLORS[b.status] || COLORS.Unknown }} className="w-3 h-3 rounded-full shadow-sm" />
                    <span className="text-slate-300 font-medium">{b.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{b.count}</span>
                    <span className="text-slate-500 text-xs w-8 text-right font-mono">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}

/* CategoryDistribution */
function CategoryDistribution({ baseUrl = "http://localhost:5000", limit = 8, description }) {
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
  if (loading) return <WidgetShell title="Top Categories" loading icon={<TrendingUp />} description={description} />;
  if (error) return <WidgetShell title="Top Categories" error={error} icon={<TrendingUp />} description={description} />;

  const maxCount = items.length ? Math.max(...items.map(i => i.count || 0)) : 1;
  const colors = ['bg-cyan-500', 'bg-blue-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-amber-500', 'bg-emerald-500'];

  return (
    <WidgetShell
      title="Top Categories"
      icon={<TrendingUp />}
      summary={`Top ${items.length} categories`}
      description={description}
    >
      <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {items.map((it, idx) => {
            const pct = maxCount ? Math.round((it.count / maxCount) * 100) : 0;
            const colorClass = colors[idx % colors.length];
            return (
              <div key={`${it.category || 'unknown'}-${idx}`} className="group relative">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-[10px] font-mono text-slate-500 flex-shrink-0 bg-slate-900 px-1 rounded">0{idx + 1}</span>
                    <span className="text-sm font-semibold text-slate-200 truncate" title={it.category || "Unknown"}>
                      {it.category || "Unknown"}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white flex-shrink-0 ml-2">{it.count}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full ${colorClass} rounded-full opacity-80 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetShell>
  );
}

/* MoMGrowth */
function MoMGrowth({ baseUrl = "http://localhost:5000", months = 6, description }) {
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
  if (loading) return <WidgetShell title="Monthly Trends" loading icon={<Calendar />} description={description} />;
  if (error) return <WidgetShell title="Monthly Trends" error={error} icon={<Calendar />} description={description} />;

  const counts = rows.map(r => r.count || 0);
  const max = counts.length ? Math.max(...counts) : 1;

  return (
    <WidgetShell
      title="Monthly Trends"
      icon={<Calendar />}
      summary="Month-over-month growth"
      description={description}
    >
      <div className="flex flex-col h-full gap-4">
        <div className="h-40 flex items-end justify-between gap-3 px-2 pb-2 border-b border-slate-800">
          {rows.map((r) => {
            const h = max ? (r.count / max) * 100 : 0;
            const isGrowth = r.growth && !String(r.growth).startsWith("-");
            return (
              <div key={`month-${r.month}`} className="flex-1 flex flex-col justify-end items-center group h-full">
                <div
                  className={`${isGrowth ? 'bg-emerald-500' : 'bg-red-500'} w-full rounded-t-sm opacity-70 group-hover:opacity-100 transition-all duration-300`}
                  style={{ height: `${Math.max(5, h)}%` }}
                />
                <span className="text-[10px] text-slate-500 mt-2 font-mono uppercase">{String(r.month).slice(0, 3)}</span>
              </div>
            )
          })}
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-1">
            {rows.map((r) => {
              const isGrowth = r.growth && !String(r.growth).startsWith("-");
              return (
                <div key={`row-${r.month}`} className="flex justify-between items-center text-sm p-2 hover:bg-slate-800/30 rounded border border-transparent hover:border-slate-800/50">
                  <span className="text-slate-300">{r.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-mono">{r.count}</span>
                    <span className={`text-xs font-bold w-14 text-right ${isGrowth ? 'text-emerald-400' : 'text-red-400'}`}>
                      {r.growth || "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}

/* GeographicList */
function GeographicList({ baseUrl = "http://localhost:5000", range = 30, limit = 8, description }) {
  const [state, setState] = React.useState({ loading: true, error: null, rows: [] });
  const [expanded, setExpanded] = React.useState({});

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
        arr.sort((a, b) => (b.incidentCount || 0) - (a.incidentCount || 0));
        setState({ loading: false, error: null, rows: arr });
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) console.error("GeographicList:", err);
        setState({ loading: false, error: err.response?.data?.message || err.message || "Error", rows: [] });
      }
    })();
    return () => { mounted = false; source.cancel("unmount"); };
  }, [baseUrl, range, limit]);

  const { loading, error, rows } = state;
  if (loading) return <WidgetShell title="Geographic Distribution" loading icon={<Globe />} description={description} />;
  if (error) return <WidgetShell title="Geographic Distribution" error={error} icon={<Globe />} description={description} />;

  const max = rows.length ? Math.max(...rows.map(r => r.incidentCount || 0)) : 1;

  return (
    <WidgetShell
      title="Geographic Distribution"
      icon={<Globe />}
      summary={`${rows.length} active regions`}
      description={description}
    >
      <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-3">
          {rows.length === 0 ? (
            <div className="text-slate-400 text-sm text-center py-10">No geographic data available</div>
          ) : (
            rows.map((r, idx) => {
              const pct = max ? Math.round((r.incidentCount / max) * 100) : 0;
              const isOpen = !!expanded[idx];
              const countryCode = r.countryCode || r.iso2 || r.country;
              const safeCode = typeof countryCode === 'string' ? countryCode : String(countryCode || "");

              return (
                <div key={`${String(r.country || 'unknown')}-${idx}`} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center text-lg bg-slate-900 rounded">
                      {flagFromCountry(safeCode)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-semibold text-slate-200 truncate pr-2">{r.country || "Unknown"}</div>
                        <div className="font-bold text-white">{r.incidentCount}</div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden flex items-center">
                        <div style={{ width: `${pct}%` }} className="h-full bg-cyan-500 rounded-full" />
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      className="ml-2 text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-700/50 rounded"
                    >
                      {isOpen ? "Hide" : "View"}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-slate-500 block mb-1">Top City</span>
                          <span className="text-slate-300">
                            {r.topCities && r.topCities[0] ? `${r.topCities[0].city} (${r.topCities[0].count})` : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-1">Categories</span>
                          <span className="text-slate-300">{r.uniqueCategories || 0}</span>
                        </div>
                      </div>
                      {Array.isArray(r.history) && r.history.length > 0 && (
                        <div className="h-8 w-full opacity-70">
                          <TinySparkline points={r.history} width={300} height={32} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </WidgetShell>
  );
}

function TinySparkline({ points = [], height = 28, width = 120 }) {
  if (!points || !points.length) return null;
  const counts = points.map(p => p.count || 0);
  const max = Math.max(...counts, 1);
  const step = width / Math.max(points.length - 1, 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${height - (p.count / max) * (height - 4)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
      <path d={d} stroke="#06b6d4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Helpers */
function flagFromCountry(input) {
  if (!input || typeof input !== "string") return "🌐";
  const iso = input.trim();
  const code = iso.length === 2 ? iso.toUpperCase() : (iso.length > 2 ? iso.slice(0, 2).toUpperCase() : iso.toUpperCase());
  if (code.length !== 2 || /[^A-Z]/.test(code)) return "🌐";
  const OFFSET = 0x1F1E6 - 65;
  const first = code.charCodeAt(0) + OFFSET;
  const second = code.charCodeAt(1) + OFFSET;
  return String.fromCodePoint(first, second);
}

/* Main Dashboard Layout */
export default function Dashboard({ baseUrl = "http://localhost:5000" }) {
  const [range, setRange] = React.useState(30);
  const [showRangeMenu, setShowRangeMenu] = React.useState(false);
  const ranges = [7, 14, 30, 60, 90];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-[1800px] mx-auto space-y-8">

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950/30 border border-cyan-900/50 rounded-xl">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Security Operations</h1>
              <p className="text-slate-400 text-sm">Real-time incident analytics & KPI monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowRangeMenu(v => !v)}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Last {range} Days</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showRangeMenu ? 'rotate-180' : ''}`} />
              </button>

              {showRangeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  {ranges.map(r => (
                    <button
                      key={r}
                      onClick={() => { setRange(r); setShowRangeMenu(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-800 transition-colors ${r === range ? "text-cyan-400 bg-slate-800/50" : "text-slate-300"}`}
                    >
                      {r} Days
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              LIVE
            </div>
          </div>
        </header>

        <div className="w-full min-h-[400px]">
          <TypeTrends
            baseUrl={baseUrl}
            range={Math.max(range, 30)}
            topN={4}
            highlight
            description="Visualizes the volume trends for the most frequent incident types over the selected period."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[350px]">
          <div className="h-full">
            <VelocityMetrics
              baseUrl={baseUrl}
              range={range}
              highlight
              description="Shows how many new incidents occur each day. The bars represent daily activity, helping you spot sudden spikes or unusually busy days compared to the average."
            />
          </div>
          <div className="h-full">
            <RealWorldMap
              baseUrl={baseUrl}
              range={range}
              description="A map showing where security incidents are coming from around the world. Larger circles mean more attacks are originating from that specific location."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
          <div className="h-full">
            <StatusPieChart
              baseUrl={baseUrl}
              description="Shows the current status of all incidents. You can see how many are 'Open' (waiting), 'Investigating' (being worked on), or 'Resolved' (fixed), which helps track the team's workload."
            />
          </div>
          <div className="h-full">
            <ResolutionMetrics
              baseUrl={baseUrl}
              range={range}
              description="Key Performance Indicators regarding how efficiently incidents are being resolved."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[450px]">
          <div className="h-full">
            <MoMGrowth
              baseUrl={baseUrl}
              months={6}
              description="Shows the total number of incidents month by month."
            />
          </div>
          <div className="h-full">
            <GeographicList
              baseUrl={baseUrl}
              range={range}
              limit={8}
              description="A ranked list of the top countries and cities causing security alerts."
            />
          </div>
        </div>

        <div className="min-h-[350px]">
          <CategoryDistribution
            baseUrl={baseUrl}
            limit={12}
            description="Lists the most common categories of security issues."
          />
        </div>

        <footer className="pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
          SOC Dashboard v2.0 • Data refreshes automatically • {new Date().toLocaleDateString()}
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.5); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.5); }
      `}</style>
    </div>
  );
}

