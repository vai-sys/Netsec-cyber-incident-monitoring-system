// GeographicHeatmap.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Globe, TrendingUp, Zap } from "lucide-react";

/**
 * GeographicHeatmap
 * -----------------
 * Props:
 *  - baseUrl (string) default "http://localhost:5000"
 *  - range   (number) days to look back (default 30)
 *  - limit   (number) max countries to show (default 12)
 *
 * Backend: GET {baseUrl}/api/incidents/kpi/heatmap?range={range}
 * Expected response: [{ country, incidentCount, uniqueTypes, uniqueCategories }, ...]
 */

function MiniBars({ count, max, color }) {
  const pct = max ? Math.round((count / max) * 100) : 0;
  return (
    <div className="relative w-32 h-4 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/30">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div
        className={`h-full rounded-lg bg-gradient-to-r ${color} transition-all duration-700 ease-out shadow-lg`}
        style={{ width: `${pct}%` }}
      >
        <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent" />
      </div>
    </div>
  );
}

export default function GeographicHeatmap({
  baseUrl = "http://localhost:5000",
  range = 30,
  limit = 12,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();

    async function fetchHeatmap() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/heatmap`,
          {
            params: { range },
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            timeout: 15000,
            cancelToken: source.token,
          }
        );

        if (!mounted) return;
        // server expected to return array of { country, incidentCount, uniqueTypes, uniqueCategories }
        const data = Array.isArray(res.data) ? res.data.slice(0, limit) : [];
        setRows(data);
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) {
          console.error("GeographicHeatmap fetch error:", err);
          setError(err.response?.data?.message || err.message || "Failed to load geographic heatmap");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchHeatmap();

    return () => {
      mounted = false;
      source.cancel("component-unmount");
    };
  }, [baseUrl, range, limit]);

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
        <div className="relative animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 bg-slate-700/50 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-56 bg-slate-700/50 rounded-lg" />
              <div className="h-3 w-40 bg-slate-700/50 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700/30 rounded-lg" />
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
              <Globe className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-red-400 font-semibold text-lg">Error loading geographic data</div>
          </div>
          <div className="text-sm text-slate-300 bg-slate-800/40 p-4 rounded-lg border border-slate-700/50">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const maxCount = rows.length ? Math.max(...rows.map(r => r.incidentCount || 0)) : 1;
  const totalIncidents = rows.reduce((sum, r) => sum + (r.incidentCount || 0), 0);

  const colors = [
    'from-rose-500 via-rose-400 to-pink-400',
    'from-orange-500 via-orange-400 to-amber-400',
    'from-amber-500 via-amber-400 to-yellow-400',
    'from-emerald-500 via-emerald-400 to-teal-400',
    'from-cyan-500 via-cyan-400 to-blue-400',
    'from-blue-500 via-blue-400 to-indigo-400',
    'from-indigo-500 via-indigo-400 to-purple-400',
    'from-purple-500 via-purple-400 to-pink-400',
    'from-pink-500 via-pink-400 to-rose-400',
    'from-teal-500 via-teal-400 to-cyan-400',
  ];

  const countryFlags = {
    "United States": "🇺🇸",
    "China": "🇨🇳",
    "Russia": "🇷🇺",
    "Germany": "🇩🇪",
    "United Kingdom": "🇬🇧",
    "India": "🇮🇳",
    "Brazil": "🇧🇷",
    "Japan": "🇯🇵",
    "France": "🇫🇷",
    "South Korea": "🇰🇷",
    "Canada": "🇨🇦",
    "Australia": "🇦🇺",
    "Mexico": "🇲🇽",
    "Spain": "🇪🇸",
    "Italy": "🇮🇹",
    "Netherlands": "🇳🇱",
    "Sweden": "🇸🇪",
    "Poland": "🇵🇱",
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl blur opacity-50" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                Geographic Distribution
              </h3>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Top countries by incident activity (last {range} days)
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-white">{totalIncidents.toLocaleString()}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Total Incidents</div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{rows.length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Countries</div>
          </div>
          <div className="text-center border-x border-slate-700/50">
            <div className="text-2xl font-bold text-teal-400">
              {rows.length > 0 ? Math.max(...rows.map(r => r.uniqueTypes || 0)) : 0}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Max Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {rows.length > 0 ? Math.max(...rows.map(r => r.uniqueCategories || 0)) : 0}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Max Categories</div>
          </div>
        </div>

        {/* Country List */}
        <div className="space-y-3">
          {rows.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-slate-600" />
              </div>
              <div className="text-slate-400 text-sm">No geographic data available</div>
            </div>
          ) : (
            rows.map((r, idx) => {
              const percentage = totalIncidents ? ((r.incidentCount / totalIncidents) * 100).toFixed(1) : 0;
              const colorClass = colors[idx % colors.length];
              
              return (
                <div
                  key={`${r.country}-${idx}`}
                  className="group relative bg-slate-800/30 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer"
                >
                  {/* Rank badge */}
                  <div 
                    className="absolute -left-2 -top-2 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg border border-slate-600"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors[idx % colors.length].split(' ')[0].replace('from-', '')}, ${colors[idx % colors.length].split(' ')[2].replace('to-', '')})`,
                    }}
                  >
                    #{idx + 1}
                  </div>

                  <div className="flex items-center justify-between gap-4 pl-4">
                    {/* Country Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-2xl shadow-lg border border-slate-600">
                          {countryFlags[r.country] || <MapPin className="w-6 h-6 text-slate-300" />}
                        </div>
                        <div 
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
                        >
                          <Zap className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-base font-semibold text-white truncate">
                            {r.country || "Unknown"}
                          </div>
                          <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-medium">
                            {percentage}%
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            {r.uniqueTypes ?? 0} types
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            {r.uniqueCategories ?? 0} categories
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats and Bar */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          {(r.incidentCount ?? 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">incidents</div>
                      </div>
                      <MiniBars count={r.incidentCount ?? 0} max={maxCount} color={colorClass} />
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <div className="text-slate-400">
              Click any country to <span className="text-emerald-400 font-semibold">drill down</span> into detailed incidents
            </div>
            <div className="text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live data from last {range} days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}