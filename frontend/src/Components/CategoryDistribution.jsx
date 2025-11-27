// // CategoryDistribution.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BarChart3 } from "lucide-react";

// /**
//  * CategoryDistribution
//  * --------------------
//  * Fetches: GET {baseUrl}/api/incidents/kpi/categories
//  * Response expected: [{ category, subcode, count }, ...]
//  *
//  * Props:
//  *  - baseUrl (string) default "http://localhost:5000"
//  *  - limit   (number) default 10
//  */

// export default function CategoryDistribution({ baseUrl = "http://localhost:5000", limit = 10 }) {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     const source = axios.CancelToken.source();

//     async function fetchCategories() {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/categories`, {
//           params: { limit },
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//           timeout: 10000,
//           cancelToken: source.token
//         });

//         if (!mounted) return;
//         // expect array of { category, subcode, count }
//         setItems(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         if (!mounted) return;
//         if (axios.isCancel(err)) return;
//         console.error("CategoryDistribution fetch error:", err);
//         setError(err.response?.data?.message || err.message || "Failed to load categories");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     fetchCategories();
//     return () => {
//       mounted = false;
//       source.cancel("component-unmount");
//     };
//   }, [baseUrl, limit]);

//   if (loading) {
//     return (
//       <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-sm">
//         <div className="animate-pulse space-y-3">
//           <div className="h-6 w-44 bg-gray-700 rounded" />
//           <div className="space-y-2">
//             {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-700 rounded" />)}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-gray-900 p-4 rounded-lg border border-red-800/40">
//         <div className="text-red-400 font-medium">Error</div>
//         <div className="text-sm text-gray-300 mt-2">{error}</div>
//       </div>
//     );
//   }

//   // compute max for scaling bars
//   const maxCount = items.length ? Math.max(...items.map(it => it.count || 0)) : 1;

//   return (
//     <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-sm">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
//             <BarChart3 className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-white">Category Distribution</h3>
//             <p className="text-xs text-gray-400">Top categories targeted (by count)</p>
//           </div>
//         </div>

//         <div className="text-sm text-gray-400">{items.length} shown</div>
//       </div>

//       {/* List of categories with horizontal bars */}
//       <div className="space-y-3">
//         {items.length === 0 && <div className="text-gray-400 text-sm">No categories found.</div>}

//         {items.map((it, idx) => {
//           const count = it.count || 0;
//           const widthPct = maxCount ? Math.round((count / maxCount) * 100) : 0;
//           return (
//             <div key={`${it.category}-${idx}`} className="space-y-1">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                   <div className="text-sm font-medium text-white">{it.category || "Unknown"}</div>
//                   {it.subcode && <div className="text-xs text-gray-400 px-2 py-0.5 rounded bg-gray-800/40">{it.subcode}</div>}
//                 </div>
//                 <div className="text-sm text-gray-400">{count}</div>
//               </div>

//               <div className="w-full bg-gray-800 h-3 rounded overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded"
//                   style={{ width: `${widthPct}%`, transition: "width 0.6s ease" }}
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Footer note */}
//       <div className="mt-4 text-xs text-gray-400">
//         Showing top {items.length} categories. Use <code className="bg-gray-800 px-1 rounded">limit</code> prop to control how many are fetched.
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, TrendingUp } from "lucide-react";

/**
 * CategoryDistribution
 * --------------------
 * Fetches: GET {baseUrl}/api/incidents/kpi/categories
 * Response expected: [{ category, subcode, count }, ...]
 *
 * Props:
 *  - baseUrl (string) default "http://localhost:5000"
 *  - limit   (number) default 10
 */

export default function CategoryDistribution({ baseUrl = "http://localhost:5000", limit = 10 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();

    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl.replace(/\/$/, "")}/api/incidents/kpi/categories`, {
          params: { limit },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          timeout: 10000,
          cancelToken: source.token
        });

        if (!mounted) return;
        // expect array of { category, subcode, count }
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!mounted) return;
        if (axios.isCancel(err)) return;
        console.error("CategoryDistribution fetch error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load categories");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCategories();
    return () => {
      mounted = false;
      source.cancel("component-unmount");
    };
  }, [baseUrl, limit]);

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
        <div className="relative animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-slate-700/50 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-48 bg-slate-700/50 rounded-lg" />
              <div className="h-3 w-32 bg-slate-700/50 rounded" />
            </div>
          </div>
          <div className="space-y-3 pt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-slate-700/50 rounded" />
                <div className="h-3 bg-slate-700/30 rounded" />
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
              <BarChart3 className="w-6 h-6 text-red-400" />
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

  // compute max for scaling bars
  const maxCount = items.length ? Math.max(...items.map(it => it.count || 0)) : 1;
  const totalCount = items.reduce((sum, it) => sum + (it.count || 0), 0);

  // Color palette for bars
  const colors = [
    'from-cyan-500 via-cyan-400 to-blue-400',
    'from-blue-500 via-blue-400 to-indigo-400',
    'from-indigo-500 via-indigo-400 to-purple-400',
    'from-purple-500 via-purple-400 to-pink-400',
    'from-pink-500 via-pink-400 to-rose-400',
    'from-emerald-500 via-emerald-400 to-teal-400',
    'from-teal-500 via-teal-400 to-cyan-400',
    'from-orange-500 via-orange-400 to-amber-400',
    'from-amber-500 via-amber-400 to-yellow-400',
    'from-violet-500 via-violet-400 to-fuchsia-400',
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl blur opacity-50" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                Category Distribution
              </h3>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Top targeted categories by incident count
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-white">{totalCount}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Total Incidents</div>
          </div>
        </div>

        {/* Categories list */}
        <div className="space-y-4">
          {items.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-slate-600" />
              </div>
              <div className="text-slate-400 text-sm">No categories found</div>
            </div>
          )}

          {items.map((it, idx) => {
            const count = it.count || 0;
            const widthPct = maxCount ? (count / maxCount) * 100 : 0;
            const percentage = totalCount ? ((count / totalCount) * 100).toFixed(1) : 0;
            const colorClass = colors[idx % colors.length];
            
            return (
              <div 
                key={`${it.category}-${idx}`} 
                className="group relative bg-slate-800/30 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                {/* Rank badge */}
                <div className="absolute -left-2 -top-2 w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg border border-slate-600">
                  #{idx + 1}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4 pl-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-base font-semibold text-white truncate">
                          {it.category || "Unknown"}
                        </div>
                        {it.subcode && (
                          <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20 font-medium">
                            {it.subcode}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {percentage}% of total incidents
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-white">{count}</div>
                      <div className="text-xs text-slate-400">incidents</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2.5 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                    <div
                      className={`h-full bg-gradient-to-r ${colorClass} rounded-full shadow-lg transition-all duration-700 ease-out`}
                      style={{ width: `${widthPct}%` }}
                    >
                      <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <div className="text-slate-400">
              Displaying <span className="text-cyan-400 font-semibold">{items.length}</span> of top <span className="text-cyan-400 font-semibold">{limit}</span> categories
            </div>
            <div className="text-slate-500 font-mono">
              Adjust <code className="bg-slate-800 px-2 py-1 rounded text-cyan-400">limit</code> prop
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}