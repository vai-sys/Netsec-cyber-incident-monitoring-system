import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, AlertOctagon } from 'lucide-react';

const SectorThreatPieDashboard = () => {
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectorThreatAnalysis = async () => {
      try {
        const mockData = [
          {
            sector: "Energy",
            totalSectorIncidents: 95,
            criticalIncidents: 22,
            threatData: [
              { level: "High", totalLevelIncidents: 22 },
              { level: "Medium", totalLevelIncidents: 43 },
              { level: "Low", totalLevelIncidents: 30 }
            ],
            keyThreats: [
              "Grid infrastructure vulnerabilities",
              "Cyber attacks on power distribution systems",
              "IoT device security gaps"
            ]
          },
          {
            sector: "Transportation",
            totalSectorIncidents: 78,
            criticalIncidents: 15,
            threatData: [
              { level: "High", totalLevelIncidents: 15 },
              { level: "Medium", totalLevelIncidents: 35 },
              { level: "Low", totalLevelIncidents: 28 }
            ],
            keyThreats: [
              "Traffic management system breaches",
              "GPS spoofing risks",
              "Autonomous vehicle network intrusions"
            ]
          },
          {
            sector: "Banking and Finance",
            totalSectorIncidents: 120,
            criticalIncidents: 35,
            threatData: [
              { level: "High", totalLevelIncidents: 35 },
              { level: "Medium", totalLevelIncidents: 55 },
              { level: "Low", totalLevelIncidents: 30 }
            ],
            keyThreats: [
              "Financial transaction fraud",
              "Banking malware attacks",
              "Cryptocurrency wallet exploits"
            ]
          },
          {
            sector: "Telecommunications",
            totalSectorIncidents: 85,
            criticalIncidents: 20,
            threatData: [
              { level: "High", totalLevelIncidents: 20 },
              { level: "Medium", totalLevelIncidents: 40 },
              { level: "Low", totalLevelIncidents: 25 }
            ],
            keyThreats: [
              "Network infrastructure vulnerabilities",
              "Mobile network interception",
              "DDoS attacks on communication networks"
            ]
          },
          {
            sector: "Defense",
            totalSectorIncidents: 65,
            criticalIncidents: 25,
            threatData: [
              { level: "High", totalLevelIncidents: 25 },
              { level: "Medium", totalLevelIncidents: 30 },
              { level: "Low", totalLevelIncidents: 10 }
            ],
            keyThreats: [
              "Military communication interception",
              "Classified information breaches",
              "Satellite communication vulnerabilities"
            ]
          },
          {
            sector: "Space",
            totalSectorIncidents: 45,
            criticalIncidents: 12,
            threatData: [
              { level: "High", totalLevelIncidents: 12 },
              { level: "Medium", totalLevelIncidents: 20 },
              { level: "Low", totalLevelIncidents: 13 }
            ],
            keyThreats: [
              "Satellite hacking attempts",
              "Space communication disruption",
              "Ground station cyber threats"
            ]
          },
          {
            sector: "Government Services",
            totalSectorIncidents: 110,
            criticalIncidents: 30,
            threatData: [
              { level: "High", totalLevelIncidents: 30 },
              { level: "Medium", totalLevelIncidents: 50 },
              { level: "Low", totalLevelIncidents: 30 }
            ],
            keyThreats: [
              "Citizen data privacy breaches",
              "Government system infiltrations",
              "E-governance platform vulnerabilities"
            ]
          }
        ];

        setAnalysisData(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sector threat analysis:", error);
        setLoading(false);
      }
    };

    fetchSectorThreatAnalysis();
  }, []);

  const getThreatLevelColor = (level) => {
    switch(level) {
      case 'High': return 'text-red-500 bg-red-900/30';
      case 'Medium': return 'text-yellow-500 bg-yellow-900/30';
      case 'Low': return 'text-green-500 bg-green-900/30';
      default: return 'text-gray-500 bg-gray-900/30';
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-3xl font-bold text-green-500 animate-pulse">
          Scanning National Cyber Infrastructure...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-green-300 min-h-screen p-8">
      <div className="container mx-auto">
        <header className="flex items-center justify-between mb-10 border-b border-green-800 pb-4">
          <h1 className="text-4xl font-bold flex items-center">
            <ShieldCheck className="mr-4 text-green-500" size={48} />
            NCIIPC Sector Threat Analysis
          </h1>
          <div className="text-sm text-green-600">
            Last Updated: {new Date().toLocaleDateString()}
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {analysisData.map((sector, index) => (
            <div 
              key={index} 
              className={`
                border border-green-800 rounded-2xl p-6 
                transition-all duration-300 
                hover:border-green-600 hover:shadow-2xl
                hover:scale-[1.02]
                ${getThreatLevelColor(
                  sector.criticalIncidents / sector.totalSectorIncidents > 0.3 ? 'High' : 
                  sector.criticalIncidents / sector.totalSectorIncidents > 0.15 ? 'Medium' : 'Low'
                )}
              `}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-green-300">
                  {sector.sector} Sector
                </h2>
                <AlertOctagon 
                  className={`
                    ${sector.criticalIncidents / sector.totalSectorIncidents > 0.3 ? 'text-red-500' : 
                      sector.criticalIncidents / sector.totalSectorIncidents > 0.15 ? 'text-yellow-500' : 'text-green-500'}
                  `} 
                  size={32}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                <div className="bg-black/40 rounded-lg p-3">
                  <p className="text-xs uppercase text-green-600 mb-1">Total Incidents</p>
                  <p className="text-xl font-bold text-green-400">{sector.totalSectorIncidents}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3">
                  <p className="text-xs uppercase text-green-600 mb-1">Critical Incidents</p>
                  <p className="text-xl font-bold text-red-500">{sector.criticalIncidents}</p>
                </div>
              </div>

              <div className="bg-black/40 rounded-lg p-4 mb-6">
                <p className="text-sm uppercase text-green-600 mb-3">Threat Level Distribution</p>
                <div className="flex justify-between items-center space-x-2">
                  {sector.threatData.map((threat, tIndex) => (
                    <div key={tIndex} className="flex-1">
                      <div 
                        className={`
                          h-2 w-full rounded-full 
                          ${threat.level === 'High' ? 'bg-red-900' : 
                            threat.level === 'Medium' ? 'bg-yellow-900' : 'bg-green-900'}
                        `}
                      >
                        <div 
                          className={`
                            h-full rounded-full 
                            ${threat.level === 'High' ? 'bg-red-600' : 
                              threat.level === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'}
                          `}
                          style={{
                            width: `${(threat.totalLevelIncidents / sector.totalSectorIncidents) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-green-700">{threat.level}</span>
                        <span className="text-xs text-green-500">
                          {threat.totalLevelIncidents}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 rounded-lg p-4">
                <p className="text-sm uppercase text-green-600 mb-3">Key Threats</p>
                <ul className="space-y-2">
                  {sector.keyThreats.map((threat, tIndex) => (
                    <li 
                      key={tIndex} 
                      className="text-xs text-green-400 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-green-600"
                    >
                      {threat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-black/50 border border-green-800 rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-6 flex items-center text-green-300">
            <TrendingUp className="mr-4 text-green-500" size={32} />
            Strategic Cyber Infrastructure Insights
          </h3>
          <ul className="space-y-4 text-green-400">
            {[
              "Multi-sector cyber vulnerabilities detected",
              "Critical infrastructure requires enhanced security protocols",
              "Proactive cross-sector threat mitigation strategies needed",
              "Continuous monitoring and adaptive response critical"
            ].map((insight, index) => (
              <li 
                key={index} 
                className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-green-600"
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectorThreatPieDashboard;



// import React, { useState, useEffect } from 'react';
// import { ShieldCheck, TrendingUp, AlertOctagon } from 'lucide-react';

// const SectorThreatPieDashboard = () => {
//   const [analysisData, setAnalysisData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSectorThreatAnalysis = async () => {
//       try {
//         const mockData = [
//           {
//             sector: "Finance",
//             totalSectorIncidents: 120,
//             totalUnsolvedIncidents: 45,
//             correlationIndex: 0.375,
//             threatData: [
//               { level: "High", totalLevelIncidents: 30 },
//               { level: "Medium", totalLevelIncidents: 50 },
//               { level: "Low", totalLevelIncidents: 40 }
//             ]
//           },
//           {
//             sector: "Technology",
//             totalSectorIncidents: 95,
//             totalUnsolvedIncidents: 35,
//             correlationIndex: 0.368,
//             threatData: [
//               { level: "High", totalLevelIncidents: 25 },
//               { level: "Medium", totalLevelIncidents: 40 },
//               { level: "Low", totalLevelIncidents: 30 }
//             ]
//           }
//         ];

//         setAnalysisData(mockData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching sector threat analysis:", error);
//         setLoading(false);
//       }
//     };

//     fetchSectorThreatAnalysis();
//   }, []);

//   const getThreatColor = (correlationIndex) => {
//     if (correlationIndex > 0.5) return 'text-red-500';
//     if (correlationIndex > 0.3) return 'text-yellow-500';
//     return 'text-green-500';
//   };

//   const getCorrelationBackground = (correlationIndex) => {
//     if (correlationIndex > 0.5) return 'bg-red-900/30';
//     if (correlationIndex > 0.3) return 'bg-yellow-900/30';
//     return 'bg-green-900/30';
//   };

//   if (loading) {
//     return (
//       <div className="bg-black min-h-screen flex items-center justify-center">
//         <div className="text-3xl font-bold text-green-500 animate-pulse">
//           Scanning Threat Landscape...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-black text-green-300 min-h-screen p-8">
//       <div className="container mx-auto">
//         <header className="flex items-center justify-between mb-10 border-b border-green-800 pb-4">
//           <h1 className="text-4xl font-bold flex items-center">
//             <ShieldCheck className="mr-4 text-green-500" size={48} />
//             Sector Threat Analysis
//           </h1>
//           <div className="text-sm text-green-600">
//             Last Updated: {new Date().toLocaleDateString()}
//           </div>
//         </header>

//         <div className="grid md:grid-cols-2 gap-8">
//           {analysisData.map((sector, index) => (
//             <div 
//               key={index} 
//               className={`
//                 ${getCorrelationBackground(sector.correlationIndex)}
//                 border border-green-800 rounded-2xl p-6 
//                 transition-all duration-300 
//                 hover:border-green-600 hover:shadow-2xl
//                 hover:scale-[1.02]
//               `}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-green-300">
//                   {sector.sector} Sector
//                 </h2>
//                 <AlertOctagon 
//                   className={`
//                     ${getThreatColor(sector.correlationIndex)}
//                   `} 
//                   size={32}
//                 />
//               </div>

//               <div className="grid grid-cols-3 gap-4 text-center mb-6">
//                 {[
//                   { 
//                     label: "Total Incidents", 
//                     value: sector.totalSectorIncidents,
//                     color: "text-green-400"
//                   },
//                   { 
//                     label: "Unsolved", 
//                     value: sector.totalUnsolvedIncidents,
//                     color: "text-yellow-500"
//                   },
//                   { 
//                     label: "Correlation", 
//                     value: `${(sector.correlationIndex * 100).toFixed(1)}%`,
//                     color: getThreatColor(sector.correlationIndex)
//                   }
//                 ].map((stat, statIndex) => (
//                   <div key={statIndex} className="bg-black/40 rounded-lg p-3">
//                     <p className="text-xs uppercase text-green-600 mb-1">{stat.label}</p>
//                     <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
//                   </div>
//                 ))}
//               </div>

//               <div className="bg-black/40 rounded-lg p-4">
//                 <p className="text-sm uppercase text-green-600 mb-3">Threat Level Distribution</p>
//                 <div className="flex justify-between items-center space-x-2">
//                   {sector.threatData.map((threat, tIndex) => (
//                     <div key={tIndex} className="flex-1">
//                       <div 
//                         className={`
//                           h-2 w-full rounded-full 
//                           ${threat.level === 'High' ? 'bg-red-900' : 
//                             threat.level === 'Medium' ? 'bg-yellow-900' : 'bg-green-900'}
//                         `}
//                       >
//                         <div 
//                           className={`
//                             h-full rounded-full 
//                             ${threat.level === 'High' ? 'bg-red-600' : 
//                               threat.level === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'}
//                           `}
//                           style={{
//                             width: `${(threat.totalLevelIncidents / sector.totalSectorIncidents) * 100}%`
//                           }}
//                         ></div>
//                       </div>
//                       <div className="flex justify-between mt-1">
//                         <span className="text-xs text-green-700">{threat.level}</span>
//                         <span className="text-xs text-green-500">
//                           {threat.totalLevelIncidents}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

        
//       </div>
//     </div>
//   );
// };

// export default SectorThreatPieDashboard;