// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Database, Globe, Activity, Zap } from 'lucide-react';

// // LeftCards component — fetches /api/left/cards and renders four metric cards
// // Usage: place <LeftCards apiBase="/api" /> inside any page. Tailwind CSS assumed.

// export default function LeftCards({ apiBase = process.env.REACT_APP_API_BASE || '/api' }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // helper to build urls consistently
//   const buildUrl = (path) => `${apiBase.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

//   useEffect(() => {
//     let mounted = true;

//     async function fetchData() {
//       try {
//         setLoading(true);
//         const res = await axios.get(buildUrl('/incidents/cards'));
//         if (!mounted) return;
//         setData(res.data);
//         setError(null);
//       } catch (err) {
//         if (!mounted) return;
//         console.error('Failed to load left cards', err);
//         setError(err.response?.data?.error || err.message || 'Unexpected error');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     fetchData();

//     return () => { mounted = false; };
//   }, [apiBase]);

//   if (loading) return (
//     <div className="flex items-center justify-center p-6">
//       <div className="animate-pulse space-y-2 w-full">
//         <div className="h-6 bg-slate-200 rounded w-1/3" />
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           <div className="h-28 bg-slate-200 rounded" />
//           <div className="h-28 bg-slate-200 rounded" />
//           <div className="h-28 bg-slate-200 rounded" />
//           <div className="h-28 bg-slate-200 rounded" />
//         </div>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div className="p-6">
//       <div className="text-red-600 font-medium">Error loading dashboard: {error}</div>
//     </div>
//   );

//   // safe destructure with fallbacks
//   const totalIncidents = data?.totalIncidents ?? 0;
//   const numberOfSectorsImpacted = data?.numberOfSectorsImpacted ?? 0;
//   const highestImpactedSector = data?.highestImpactedSector ?? { sector: null, count: 0 };
//   const topAttackType = data?.topAttackType ?? { incident_type: null, count: 0 };

//   const cards = [
//     {
//       key: 'total',
//       title: 'Total Incidents',
//       value: totalIncidents,
//       subtitle: 'All recorded incidents',
//       icon: <Database className="w-6 h-6" />
//     },
//     {
//       key: 'sectors',
//       title: 'Sectors Impacted',
//       value: numberOfSectorsImpacted,
//       subtitle: 'Unique sectors affected',
//       icon: <Globe className="w-6 h-6" />
//     },
//     {
//       key: 'highestSector',
//       title: 'Top Sector',
//       value: highestImpactedSector.sector || '—',
//       subtitle: `Incidents: ${highestImpactedSector.count || 0}`,
//       icon: <Activity className="w-6 h-6" />
//     },
//     {
//       key: 'topAttack',
//       title: 'Top Attack Type',
//       value: topAttackType.incident_type || '—',
//       subtitle: `Count: ${topAttackType.count || 0}`,
//       icon: <Zap className="w-6 h-6" />
//     }
//   ];

//   return (
//     <section className="p-4">
//       <h3 className="text-lg font-semibold mb-4">Overview</h3>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {cards.map(c => (
//           <div key={c.key} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex items-center gap-4">
//             <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700">
//               {c.icon}
//             </div>
//             <div className="flex-1">
//               <div className="text-sm text-slate-500 dark:text-slate-300">{c.title}</div>
//               <div className="mt-1 text-2xl font-bold">{c.value}</div>
//               <div className="text-xs text-slate-400 mt-1">{c.subtitle}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* small refresh button */}
//       <div className="mt-3 text-right">
//         <button
//           onClick={async () => {
//             try {
//               setLoading(true);
//               const res = await axios.get(buildUrl('/incidents/cards'));
//               setData(res.data);
//               setError(null);
//             } catch (err) {
//               console.error(err);
//               setError(err.response?.data?.error || err.message || 'Unexpected error');
//             } finally {
//               setLoading(false);
//             }
//           }}
//           className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
//         >
//           Refresh
//         </button>
//       </div>
//     </section>
//   );
// }



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Database, Globe, Activity, Zap } from 'lucide-react';

// LeftCards component — fetches /api/left/cards and renders four metric cards
// Usage: place <LeftCards apiBase="/api" /> inside any page. Tailwind CSS assumed.

export default function LeftCards({ apiBase = process.env.REACT_APP_API_BASE || '/api' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper to build urls consistently
  const buildUrl = (path) => `${apiBase.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await axios.get(buildUrl('/incidents/cards'));
        if (!mounted) return;
        setData(res.data);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to load left cards', err);
        setError(err.response?.data?.error || err.message || 'Unexpected error');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => { mounted = false; };
  }, [apiBase]);

  if (loading) return (
    <div className="flex items-center justify-center p-6 bg-black">
      <div className="animate-pulse space-y-2 w-full">
        <div className="h-6 bg-green-900/30 rounded w-1/3" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="h-28 bg-green-900/30 rounded border border-green-800/30" />
          <div className="h-28 bg-green-900/30 rounded border border-green-800/30" />
          <div className="h-28 bg-green-900/30 rounded border border-green-800/30" />
          <div className="h-28 bg-green-900/30 rounded border border-green-800/30" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6 bg-black">
      <div className="text-red-400 font-medium border border-red-800/30 bg-red-950/30 p-4 rounded-lg">
        Error loading dashboard: {error}
      </div>
    </div>
  );

  // safe destructure with fallbacks
  const totalIncidents = data?.totalIncidents ?? 0;
  const numberOfSectorsImpacted = data?.numberOfSectorsImpacted ?? 0;
  const highestImpactedSector = data?.highestImpactedSector ?? { sector: null, count: 0 };
  const topAttackType = data?.topAttackType ?? { incident_type: null, count: 0 };

  const cards = [
    {
      key: 'total',
      title: 'Total Incidents',
      value: totalIncidents,
      subtitle: 'All recorded incidents',
      icon: <Database className="w-6 h-6" />
    },
    {
      key: 'sectors',
      title: 'Sectors Impacted',
      value: numberOfSectorsImpacted,
      subtitle: 'Unique sectors affected',
      icon: <Globe className="w-6 h-6" />
    },
    {
      key: 'highestSector',
      title: 'Top Sector',
      value: highestImpactedSector.sector || '—',
      subtitle: `Incidents: ${highestImpactedSector.count || 0}`,
      icon: <Activity className="w-6 h-6" />
    },
    {
      key: 'topAttack',
      title: 'Top Attack Type',
      value: topAttackType.incident_type || '—',
      subtitle: `Count: ${topAttackType.count || 0}`,
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <section className="p-4 bg-black">
      <h3 className="text-lg font-semibold mb-4 text-green-400">Overview</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(c => (
          <div key={c.key} className="bg-gradient-to-br from-gray-900 to-black border border-green-800/30 rounded-xl shadow-lg p-5 flex items-center gap-4 hover:border-green-600/50 transition-all">
            <div className="p-3 rounded-xl bg-green-950/50 text-green-400 border border-green-800/30">
              {c.icon}
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider text-green-500/80 font-medium">{c.title}</div>
              <div className="mt-1 text-3xl font-bold text-green-400">{c.value}</div>
              <div className="text-xs text-green-600/70 mt-1">{c.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* small refresh button */}
      <div className="mt-4 text-right">
        <button
          onClick={async () => {
            try {
              setLoading(true);
              const res = await axios.get(buildUrl('/incidents/cards'));
              setData(res.data);
              setError(null);
            } catch (err) {
              console.error(err);
              setError(err.response?.data?.error || err.message || 'Unexpected error');
            } finally {
              setLoading(false);
            }
          }}
          className="text-sm px-4 py-2 rounded-lg bg-green-950/50 hover:bg-green-900/50 text-green-400 border border-green-800/30 hover:border-green-600/50 transition-all"
        >
          Refresh
        </button>
      </div>
    </section>
  );
}