// TypeTrends.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Activity, TrendingUp, Clock, Sparkles } from "lucide-react";

/**
 * TypeTrends
 * Fetches: GET {baseUrl}/api/incidents/kpi/trends/types?range={range}
 *
 * Props:
 *  - baseUrl (string) default "http://localhost:5000"
 *  - range   (number) days to look back (default 90)
 *  - topN    (number) how many incident types to show (default 4)
 */

function Line({ points, stroke, width = 600, height = 120 }) {
  if (!points || points.length === 0) return null;
  const max = Math.max(...points.map(p => p.count), 1);
  const stepX = width / Math.max(points.length - 1, 1);

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${height - (p.count / max) * (height - 8)}`)
    .join(" ");

  const fillPath = `${d} L ${(points.length - 1) * stepX} ${height} L 0 ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={`gradient-${stroke}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.05" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path 
        d={fillPath} 
        fill={`url(#gradient-${stroke})`}
        opacity="0.6"
      />
      <path 
        d={d} 
        stroke={stroke} 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={i * stepX}
          cy={height - (p.count / max) * (height - 8)}
          r="3"
          fill={stroke}
          className="opacity-0 hover:opacity-100 transition-opacity duration-200"
        />
      ))}
    </svg>
  );
}

export default function TypeTrends({ baseUrl = "http://localhost:5000", range = 90, topN = 4 }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();

    async function fetchTrends() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/trends/types`, {
          params: { range },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          timeout: 15000,
          cancelToken: source.token,
        });
        if (!mounted) return;
        setRows(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!mounted) return;
        if (axios.isCancel(err)) return;
        console.error("TypeTrends fetch error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load type trends");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTrends();
    return () => {
      mounted = false;
      source.cancel("component-unmount");
    };
  }, [baseUrl, range]);

  const processed = useMemo(() => {
    // rows: [{ incidentType, week, count }]
    if (!rows || rows.length === 0) return { weeks: [], series: [] };

    // Collect unique weeks in sorted order
    const weeksSet = new Set(rows.map(r => r.week));
    const weeks = Array.from(weeksSet).sort(); // assumes ISO-like sortable week string

    // Group counts by type
    const map = {};
    rows.forEach(r => {
      const type = r.incidentType || r.incident_type || "Unknown";
      if (!map[type]) map[type] = {};
      map[type][r.week] = (map[type][r.week] || 0) + (r.count || 0);
    });

    // Build totals to pick topN
    const totals = Object.keys(map).map(type => ({
      type,
      total: Object.values(map[type]).reduce((s, v) => s + v, 0),
      series: weeks.map(w => ({ week: w, count: map[type][w] || 0 }))
    }));

    totals.sort((a, b) => b.total - a.total);
    const top = totals.slice(0, topN);

    // color palette (keeps it simple)
    const palette = ["#60A5FA", "#34D399", "#F59E0B", "#F97316", "#A78BFA", "#FB7185"];
    const series = top.map((t, i) => ({ ...t, color: palette[i % palette.length] }));

    return { weeks, series };
  }, [rows, topN]);

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
        <div className="relative animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-slate-700/50 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-56 bg-slate-700/50 rounded-lg" />
              <div className="h-3 w-40 bg-slate-700/50 rounded" />
            </div>
          </div>
          <div className="space-y-4 pt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-slate-700/50 rounded" />
                <div className="h-24 bg-slate-700/30 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-red-500/20 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
              <Activity className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-red-400 font-semibold text-lg">Unable to Load Data</div>
          </div>
          <div className="text-sm text-slate-300 bg-slate-800/40 p-4 rounded-lg border border-slate-700/50">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const { weeks, series } = processed;
  const totalIncidents = series.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl blur opacity-50" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                Incident Type Trends
              </h3>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Top {series.length} types over last {range} days
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{totalIncidents}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Total</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{weeks.length}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Periods
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          {series.map((s) => (
            <div key={s.type} className="flex items-center gap-2 group">
              <div 
                className="w-3 h-3 rounded-full shadow-lg transition-transform group-hover:scale-125"
                style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}40` }}
              />
              <span className="text-sm text-slate-300 font-medium">{s.type}</span>
              <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
                {s.total}
              </span>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {series.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-slate-600" />
              </div>
              <div className="text-slate-400 text-sm">No trend data available.</div>
            </div>
          ) : (
            series.map((s, idx) => (
              <div 
                key={s.type}
                className="group relative bg-slate-800/20 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
              >
                {/* Rank badge */}
                <div 
                  className="absolute -left-2 -top-2 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg border border-slate-600"
                  style={{ 
                    background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`,
                  }}
                >
                  #{idx + 1}
                </div>

                <div className="space-y-4">
                  {/* Type header */}
                  <div className="flex items-center justify-between pl-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }}
                      />
                      <div>
                        <div className="text-base font-semibold text-white flex items-center gap-2">
                          {s.type}
                          <Sparkles className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="text-xs text-slate-400">
                          {weeks.length} week period analysis
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{s.total}</div>
                      <div className="text-xs text-slate-400">total incidents</div>
                    </div>
                  </div>

                  {/* Chart area */}
                  <div className="relative h-32 bg-slate-900/40 rounded-lg border border-slate-700/30 p-3 overflow-hidden">
                    {/* Grid lines */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i}
                          className="absolute left-0 right-0 border-t border-slate-700/20"
                          style={{ top: `${(i + 1) * 25}%` }}
                        />
                      ))}
                    </div>
                    
                    <Line points={s.series} stroke={s.color} width={700} height={100} />
                  </div>

                  {/* Week labels */}
                  <div className="grid grid-cols-8 gap-1 text-xs text-slate-500">
                    {weeks.map((w, i) => (
                      <div key={w} className="text-center truncate">
                        {w.split('-W')[1] ? `W${w.split('-W')[1]}` : w}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <div className="text-slate-400">
              Data grouped by <span className="text-indigo-400 font-semibold">weekly intervals</span> from server response
            </div>
            <div className="text-slate-500 font-mono">
              Last updated: <span className="text-slate-400">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}