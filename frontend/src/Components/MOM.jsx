// MoMGrowth.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

/**
 * MoMGrowth
 * GET {baseUrl}/api/incidents/kpi/growth?months={months}
 *
 * Props:
 *  - baseUrl (string) default "http://localhost:5000"
 *  - months  (number) default 6
 */

export default function MoMGrowth({ baseUrl = "http://localhost:5000", months = 6 }) {
  const [rows, setRows] = useState([]); // [{ month, count, growth }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();

    async function fetchGrowth() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/growth`, {
          params: { months },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          timeout: 15000,
          cancelToken: source.token,
        });

        if (!mounted) return;
        // Expect array like [{ month: "2025-04", count: 12, growth: "5.00%" }, ...]
        setRows(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!mounted) return;
        if (!axios.isCancel(err)) {
          console.error("MoMGrowth fetch error:", err);
          setError(err.response?.data?.message || err.message || "Failed to load growth data");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchGrowth();
    return () => {
      mounted = false;
      source.cancel("component-unmount");
    };
  }, [baseUrl, months]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-sm">
        <div className="animate-pulse space-y-2">
          <div className="h-6 w-44 bg-gray-700 rounded" />
          <div className="h-28 bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-red-800/40">
        <div className="text-red-400 font-medium">Error</div>
        <div className="text-sm text-gray-300 mt-2">{error}</div>
      </div>
    );
  }

  // Prepare chart data
  const counts = rows.map(r => r.count || 0);
  const maxCount = counts.length ? Math.max(...counts) : 1;

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Month-over-Month Growth</h3>
            <p className="text-xs text-gray-400">Last {months} months</p>
          </div>
        </div>

        <div className="text-sm text-gray-400">{rows.length} periods</div>
      </div>

      {/* Bar chart */}
      <div className="bg-gray-800/40 p-3 rounded mb-3">
        <div className="flex items-end gap-3 h-36">
          {rows.length === 0 && (
            <div className="text-gray-400">No growth data</div>
          )}
          {rows.map((r, i) => {
            const h = maxCount ? Math.round((r.count / maxCount) * 100) : 0;
            return (
              <div key={r.month} className="flex-1 flex flex-col items-center">
                <div
                  title={`${r.month}: ${r.count}`}
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(6, h)}%`,
                    background: `linear-gradient(180deg, #60A5FA, #3B82F6)`,
                    boxShadow: "0 6px 18px rgba(59,130,246,0.12)",
                    width: "100%",
                    minHeight: 6
                  }}
                />
                <div className="text-xs text-gray-400 mt-2">{r.month}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table / details */}
      <div className="space-y-2">
        {rows.map((r) => {
          const growthRaw = r.growth;
          const positive = typeof growthRaw === "string" && growthRaw.startsWith("-");
          const growthValue = growthRaw ?? null;

          return (
            <div key={r.month} className="flex items-center justify-between p-2 rounded bg-gray-800/30 border border-gray-800/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-sm text-white font-medium">{r.month}</div>
                <div className="text-xs text-gray-400 truncate">{r.count} incidents</div>
              </div>

              <div className="flex items-center gap-3">
                {growthValue ? (
                  <div className={`flex items-center gap-1 text-xs font-semibold ${growthValue.startsWith("-") ? "text-red-400" : "text-green-400"}`}>
                    {growthValue.startsWith("-") ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    <span>{growthValue}</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">—</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 text-xs text-gray-400">
        Note: growth is month-over-month percentage calculated by the server. Null/empty when previous month had zero incidents.
      </div>
    </div>
  );
}
