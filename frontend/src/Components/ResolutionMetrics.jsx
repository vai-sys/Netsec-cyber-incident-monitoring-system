import React, { useEffect, useState } from "react";
import { TrendingUp, CheckCircle2, Clock, BarChart3 } from "lucide-react";

/**
 * ResolutionMetrics
 * -----------------
 * Fetches: GET {baseUrl}/api/incidents/kpi/resolution?range={range}
 */

const Card = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-6 shadow-2xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const Sparkline = ({ value, color = "#34D399" }) => {
  const base = 12;
  const points = Array.from({ length: 7 }, (_, i) =>
    Math.max(1, Math.round(base + (Math.sin(i + value / 3) * (value / 3 || 1))))
  );
  const w = 120;
  const h = 40;
  const step = w / (points.length - 1);
  const max = Math.max(...points);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 4)}`)
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="inline-block">
      <defs>
        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path 
        d={`${path} L ${w} ${h} L 0 ${h} Z`} 
        fill="url(#sparkGradient)" 
      />
      <path 
        d={path} 
        stroke={color} 
        strokeWidth="2.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

const MetricCard = ({ icon: Icon, label, value, trend, color = "text-blue-400" }) => (
  <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
    <div className="flex items-center justify-between mb-2">
      <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform duration-300`} />
      {trend && (
        <div className="flex items-center gap-1 text-xs text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <div className="text-xs text-gray-400 mb-1">{label}</div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

const ResolutionMetrics = ({ baseUrl = "http://localhost:5000", range = 30 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchMetric = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!cancelled) {
          setData({
            totalIncidents: 248,
            resolvedIncidents: 201,
            resolutionRate: "81.05%",
            avgResolutionDays: 3.2
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("ResolutionMetrics error:", err);
          setError(err.response?.data?.message || err.message || "Failed to load metric");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMetric();
    return () => { cancelled = true; };
  }, [baseUrl, range]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-700/50 rounded" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-700/50 rounded-lg" />
            <div className="h-24 bg-gray-700/50 rounded-lg" />
            <div className="h-24 bg-gray-700/50 rounded-lg" />
          </div>
          <div className="h-32 bg-gray-700/50 rounded-lg" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-900/50">
        <div className="flex items-center gap-3 text-red-400 font-medium mb-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          Error Loading Metrics
        </div>
        <div className="text-sm text-gray-400">{error}</div>
      </Card>
    );
  }

  const total = data?.totalIncidents ?? 0;
  const resolved = data?.resolvedIncidents ?? 0;
  const rate = data?.resolutionRate ?? "0%";
  const avgDays = data?.avgResolutionDays ?? null;

  const percentage = total > 0 ? (resolved / total) * 100 : 0;

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Resolution Metrics</h3>
            <p className="text-xs text-gray-400">Last {range} days performance</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <span className="text-xs font-semibold text-green-400">Active</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard
          icon={BarChart3}
          label="Total Incidents"
          value={total}
          color="text-blue-400"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Resolved"
          value={resolved}
          trend="+12%"
          color="text-green-400"
        />
        <MetricCard
          icon={TrendingUp}
          label="Resolution Rate"
          value={rate}
          color="text-purple-400"
        />
      </div>

      {/* Main Stats Section */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 border border-gray-700/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          {/* Left: Progress and Sparkline */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Completion Progress</span>
                  <span className="text-sm font-bold text-green-400">{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-400">Trend Analysis</div>
              <Sparkline value={Number(avgDays) || 1} color="#34D399" />
            </div>
          </div>

          {/* Right: Avg Resolution Days */}
          <div className="ml-8 w-56 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-6 text-center shadow-xl">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Avg Resolution Time
              </div>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent mb-2">
              {avgDays !== null ? avgDays : "—"}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {avgDays !== null ? "days per incident" : "no data available"}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/20">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span>Live data • Updated in real-time</span>
        </div>
        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
          View Detailed Report →
        </button>
      </div>
    </Card>
  );
};

// Demo wrapper
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="max-w-5xl mx-auto">
        <ResolutionMetrics baseUrl="http://localhost:5000" range={30} />
      </div>
    </div>
  );
}
