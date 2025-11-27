import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart } from "lucide-react";

export default function StatusPieChart({ baseUrl = "http://localhost:5000" }) {
  const [breakdown, setBreakdown] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for statuses
  const COLORS = {
    Open: "#facc15",
    Investigating: "#fb923c",
    Resolved: "#22c55e",
    Closed: "#9ca3af",
    Unknown: "#6b7280",
  };

  // Fetch backend KPIs
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/status`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );

        setBreakdown(res.data.breakdown || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        setError("Failed to load status data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-gray-400 p-6 rounded-xl border border-gray-700">
        Loading status chart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-red-400 p-6 rounded-xl border border-red-700">
        {error}
      </div>
    );
  }

  // -------- PIE CHART CALCULATION --------
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = breakdown.map((item) => {
    const percentage = total ? (item.count / total) : 0;
    const dash = percentage * circumference;

    const segment = {
      ...item,
      dash,
      gap: circumference - dash,
      offset,
    };

    offset -= dash; // Move to next segment start
    return segment;
  });

  // -------- COMPONENT UI --------
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <PieChart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Status Breakdown</h3>
          <p className="text-xs text-gray-400">Distribution of all incidents</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="flex flex-col items-center">
        <svg width="200" height="200">
          <g transform="translate(100, 100)">
            {/* Background ring */}
            <circle
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="32"
            />

            {/* Each segment */}
            {segments.map((s, index) => (
              <circle
                key={index}
                r={radius}
                fill="none"
                stroke={COLORS[s.status] || COLORS.Unknown}
                strokeWidth="32"
                strokeDasharray={`${s.dash} ${s.gap}`}
                strokeDashoffset={s.offset}
                strokeLinecap="round"
                transform="rotate(-90)"
              />
            ))}
          </g>
        </svg>

        {/* Center text */}
        <div className="text-center mt-2">
          <div className="text-3xl font-bold text-white">{total}</div>
          <div className="text-xs text-gray-400">Total Incidents</div>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2 w-full">
          {breakdown.map((item) => (
            <div key={item.status} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ background: COLORS[item.status] }}
                />
                <span className="text-gray-300">{item.status}</span>
              </div>
              <span className="text-gray-400">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
