// // src/components/VelocityMetrics.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import PropTypes from "prop-types";

// /**
//  * VelocityMetrics
//  * GET {baseUrl}/api/incidents/kpi/velocity?range={range}
//  * Expected response:
//  * {
//  *   dailyVelocity: [{ date: "YYYY-MM-DD", count: Number }, ...],
//  *   avgIncidentsPerDay: "n.nn",
//  *   totalDays: Number,
//  *   totalIncidents: Number
//  * }
//  */

// const Card = ({ children }) => (
//   <div className="bg-gray-800 rounded-xl border border-gray-700/40 p-5 shadow-md">
//     {children}
//   </div>
// );

// const Bars = ({ data = [], height = 48, color = "#34D399" }) => {
//   if (!data || data.length === 0) return <div className="text-xs text-gray-400">No data</div>;
//   const max = Math.max(...data.map(d => d.count), 1);
//   const width = Math.max(4, Math.floor(100 / data.length));
//   return (
//     <div className="flex items-end gap-1 h-[48px]">
//       {data.map((d, i) => (
//         <div
//           key={i}
//           title={`${d.date}: ${d.count}`}
//           className="rounded-sm"
//           style={{
//             width: `${width}%`,
//             height: `${(d.count / max) * height}px`,
//             background: color,
//             opacity: 0.95,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default function VelocityMetrics({ baseUrl = "http://localhost:5000", range = 30 }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     const source = axios.CancelToken.source();

//     const fetchVelocity = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/velocity`, {
//           params: { range },
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//           timeout: 10000,
//           cancelToken: source.token,
//         });
//         if (!cancelled) setData(res.data || null);
//       } catch (err) {
//         if (!axios.isCancel(err) && !cancelled) {
//           console.error("VelocityMetrics error:", err);
//           setError(err.response?.data?.message || err.message || "Failed to load velocity");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     fetchVelocity();
//     return () => {
//       cancelled = true;
//       source.cancel("Component unmounted");
//     };
//   }, [baseUrl, range]);

//   if (loading) {
//     return (
//       <Card>
//         <div className="animate-pulse space-y-3">
//           <div className="h-5 w-40 bg-gray-700 rounded" />
//           <div className="h-12 bg-gray-700 rounded" />
//         </div>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card>
//         <div className="text-red-400 font-medium">Error loading velocity metric</div>
//         <div className="text-sm text-gray-400 mt-2">{error}</div>
//       </Card>
//     );
//   }

//   const daily = Array.isArray(data?.dailyVelocity) ? data.dailyVelocity : [];
//   const avg = data?.avgIncidentsPerDay ?? "0";
//   const totalDays = data?.totalDays ?? daily.length;
//   const totalIncidents = data?.totalIncidents ?? daily.reduce((s, d) => s + (d.count || 0), 0);

//   return (
//     <Card>
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h3 className="text-lg font-semibold text-white">Incident Velocity</h3>
//           <p className="text-xs text-gray-400">New incidents per day — last {range} days</p>
//         </div>

//         <div className="text-right">
//           <div className="text-sm text-gray-400">Avg / day</div>
//           <div className="text-2xl font-bold text-white">{avg}</div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//         <div className="col-span-2">
//           <div className="mb-2 text-xs text-gray-400">Daily counts</div>
//           <div className="p-3 bg-gray-900/30 rounded">
//             <Bars data={daily} height={48} color="#60A5FA" />
//           </div>
//         </div>

//         <div className="space-y-3">
//           <div className="p-3 bg-gray-900/30 rounded">
//             <div className="text-xs text-gray-400">Total incidents</div>
//             <div className="text-xl font-bold text-white">{totalIncidents}</div>
//           </div>
//           <div className="p-3 bg-gray-900/30 rounded">
//             <div className="text-xs text-gray-400">Days</div>
//             <div className="text-xl font-bold text-white">{totalDays}</div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4 text-xs text-gray-400">
//         Tip: click a day in the detailed view to see incidents for that date (you can add that drill-down later).
//       </div>
//     </Card>
//   );
// }

// VelocityMetrics.propTypes = {
//   baseUrl: PropTypes.string,
//   range: PropTypes.number,
// };





// VelocityMetrics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * VelocityMetrics
 * ----------------
 * Simple, easy-to-read component that fetches incident velocity:
 * GET {baseUrl}/api/incidents/kpi/velocity?range={range}
 *
 * Props:
 *  - baseUrl (string) default: "http://localhost:5000"
 *  - range   (number) default: 30   // days to request
 *
 * UI:
 *  - Small bar chart (pure CSS/SVG)
 *  - Avg/day, total incidents, days
 *  - Loading & error states
 */

const Card = ({ children }) => (
  <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow">
    {children}
  </div>
);

/* Very small, dependency-free bars component.
   Each bar has a title attribute so the browser shows a tooltip on hover. */
function Bars({ series = [], height = 100, barColor = "#60A5FA" }) {
  if (!series.length) {
    return <div className="text-gray-400 text-sm">No data available</div>;
  }

  const maxCount = Math.max(...series.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1" style={{ height: `${height}px` }}>
      {series.map((d, i) => {
        const h = (d.count / maxCount) * height;
        return (
          <div
            key={i}
            title={`${d.date}: ${d.count}`}
            className="flex-1 rounded-sm transition-transform duration-150"
            style={{
              height: `${Math.max(2, h)}px`,
              background: barColor,
              opacity: 0.95,
            }}
          />
        );
      })}
    </div>
  );
}

export default function VelocityMetrics({ baseUrl = "http://localhost:5000", range = 30 }) {
  const [metric, setMetric] = useState(null); // holds backend response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const source = axios.CancelToken.source();

    async function fetchVelocity() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // optional - set after login
        const res = await axios.get(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/velocity`, {
          params: { range },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          timeout: 10000,
          cancelToken: source.token,
        });

        if (!cancelled) {
          setMetric(res.data || null);
        }
      } catch (err) {
        if (!axios.isCancel(err) && !cancelled) {
          console.error("VelocityMetrics fetch error:", err);
          setError(err.response?.data?.message || err.message || "Failed to fetch velocity");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchVelocity();
    return () => {
      cancelled = true;
      source.cancel("Component unmounted");
    };
  }, [baseUrl, range]);

  // Loading state
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-40 bg-gray-700 rounded" />
          <div className="h-24 bg-gray-700 rounded" />
          <div className="h-6 w-28 bg-gray-700 rounded" />
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <div className="text-red-400 font-medium">Error</div>
        <div className="text-sm text-gray-300 mt-2">{error}</div>
      </Card>
    );
  }

  // Normal state: parse backend shape (safe defaults)
  const daily = Array.isArray(metric?.dailyVelocity) ? metric.dailyVelocity : [];
  const avgPerDay = metric?.avgIncidentsPerDay ?? (daily.length ? (daily.reduce((s, d) => s + (d.count || 0), 0) / daily.length).toFixed(2) : "0");
  const totalIncidents = metric?.totalIncidents ?? daily.reduce((s, d) => s + (d.count || 0), 0);
  const totalDays = metric?.totalDays ?? daily.length;

  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Incident Velocity</h3>
          <div className="text-xs text-gray-400">New incidents per day • last {range} days</div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400">Avg / day</div>
          <div className="text-xl font-bold text-blue-300">{avgPerDay}</div>
        </div>
      </div>

      <div className="p-3 bg-gray-900/40 rounded mb-3">
        <Bars series={daily} height={120} barColor="#60A5FA" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-xs text-gray-400">Total</div>
          <div className="text-lg font-bold text-white">{totalIncidents}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Days</div>
          <div className="text-lg font-bold text-white">{totalDays}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Most recent</div>
          <div className="text-lg font-bold text-white">{daily.length ? daily[daily.length - 1].count : "—"}</div>
        </div>
      </div>
    </Card>
  );
}
