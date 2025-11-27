
// import React, { useState, useEffect } from 'react';
// import { 
//   LineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer 
// } from 'recharts';
// import { 
//   AlertTriangle, 
//   Clock, 
//   TrendingUp, 
//   ShieldQuestion, 
//   Activity 
// } from 'lucide-react';
// import { motion } from 'framer-motion';


// const COLORS = {
//   background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
//   primary: '#10B981',    // Emerald green
//   text: '#E2E8F0',       // Light slate text
//   gridColor: '#334155',  // Slate grid
//   threatColors: {
//     low: '#22C55E',      // Green
//     medium: '#EAB308',   // Yellow
//     high: '#F97316',     // Orange
//     critical: '#EF4444'  
//   }
// };

// const IncidentTimelineGraph = () => {
//   const [timelineData, setTimelineData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedThreatLevel, setSelectedThreatLevel] = useState(null);

//   useEffect(() => {
//     const fetchIncidentTimeline = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch('http://localhost:5000/api/incidents/advanced-timeline', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || 'Failed to fetch incident timeline');
//         }

//         // Process the timeline data
//         const processedData = processTimelineData(data.timeline);
//         setTimelineData(processedData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Detailed Error:', error);
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchIncidentTimeline();
//   }, []);

//   const processTimelineData = (timeline) => {
//     const monthlyIncidents = {};
    
//     timeline.forEach(incident => {
//       const date = new Date(incident.Date);
//       const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
//       if (!monthlyIncidents[monthKey]) {
//         monthlyIncidents[monthKey] = {
//           month: formatMonthYear(date),
//           totalIncidents: 0,
//           lowThreat: 0,
//           mediumThreat: 0,
//           highThreat: 0,
//           criticalThreat: 0
//         };
//       }
      
//       monthlyIncidents[monthKey].totalIncidents++;
      
//       switch(incident.Threat_Level) {
//         case 'Low':
//           monthlyIncidents[monthKey].lowThreat++;
//           break;
//         case 'Medium':
//           monthlyIncidents[monthKey].mediumThreat++;
//           break;
//         case 'High':
//           monthlyIncidents[monthKey].highThreat++;
//           break;
//         case 'Critical':
//           monthlyIncidents[monthKey].criticalThreat++;
//           break;
//       }
//     });

//     return Object.values(monthlyIncidents).sort((a, b) => {
//       const [aYear, aMonth] = a.month.split('-').map(Number);
//       const [bYear, bMonth] = b.month.split('-').map(Number);
//       return aYear - bYear || aMonth - bMonth;
//     });
//   };

//   const formatMonthYear = (date) => {
//     return date.toLocaleString('default', { month: 'short', year: 'numeric' });
//   };

//   const renderThreatLevelCard = (metrics) => {
//     const threatLevels = [
//       { 
//         name: 'Low', 
      
//         color: COLORS.threatColors.low,
//         icon: <Activity size={24} />
//       },
//       { 
//         name: 'Medium', 
      
//         color: COLORS.threatColors.medium,
//         icon: <AlertTriangle size={24} />
//       },
//       { 
//         name: 'High', 
       
//         color: COLORS.threatColors.high,
//         icon: <ShieldQuestion size={24} />
//       },
//       { 
//         name: 'Critical', 
        
//         color: COLORS.threatColors.critical,
//         icon: <Clock size={24} />
//       }
//     ];

//     return (
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         {threatLevels.map((level, index) => (
//           <motion.div 
//             key={index}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setSelectedThreatLevel(
//               selectedThreatLevel === level.name ? null : level.name
//             )}
//             className={`p-4 rounded-lg shadow-lg transition-all duration-300 cursor-pointer
//               ${selectedThreatLevel === level.name 
//                 ? 'ring-4 ring-opacity-50' 
//                 : 'hover:bg-slate-800/50'}`}
//             style={{ 
//               backgroundColor: `${level.color}10`, 
//               borderColor: level.color,
//               color: COLORS.text,
//               borderWidth: selectedThreatLevel === level.name ? '2px' : '0px'
//             }}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 {React.cloneElement(level.icon, { color: level.color })}
//                 <span className="font-semibold">{level.name}</span>
//               </div>
//               <span className="text-2xl font-bold" style={{ color: level.color }}>
//                 {level.count}
//               </span>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     );
//   };

//   // Custom Tooltip
//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div 
//           className="bg-slate-800 p-4 rounded-lg shadow-2xl border border-slate-700"
//           style={{ color: COLORS.text }}
//         >
//           <p className="font-bold text-lg mb-2">{data.month}</p>
//           <div className="space-y-1">
//             {[
//               { key: 'totalIncidents', label: 'Total Incidents', color: COLORS.primary },
//               { key: 'lowThreat', label: 'Low Threat', color: COLORS.threatColors.low },
//               { key: 'mediumThreat', label: 'Medium Threat', color: COLORS.threatColors.medium },
//               { key: 'highThreat', label: 'High Threat', color: COLORS.threatColors.high },
//               { key: 'criticalThreat', label: 'Critical Threat', color: COLORS.threatColors.critical }
//             ].map((item) => (
//               <div key={item.key} className="flex justify-between">
//                 <span style={{ color: item.color }}>{item.label}</span>
//                 <span className="ml-4 font-semibold">{data[item.key]}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (loading) return (
//     <div 
//       className="flex items-center justify-center h-screen"
//       style={{ background: COLORS.background, color: COLORS.text }}
//     >
//       <motion.div
//         animate={{ rotate: 360 }}
//         transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//       >
//         <TrendingUp size={64} color={COLORS.primary} />
//       </motion.div>
//     </div>
//   );

//   if (error) return (
//     <div 
//       className="flex items-center justify-center h-screen flex-col"
//       style={{ background: COLORS.background, color: COLORS.text }}
//     >
//       <AlertTriangle size={64} color={COLORS.threatColors.critical} />
//       <p className="mt-4 text-xl">{error}</p>
//     </div>
//   );

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen p-8"
//       style={{ 
//         background: COLORS.background,
//         color: COLORS.text 
//       }}
//     >
//       <div className="container mx-auto">
//         <h1 
//           className="text-4xl font-bold mb-8 text-center flex items-center justify-center"
//           style={{ color: COLORS.primary }}
//         >
//           <TrendingUp className="mr-4" />
//           Incident Timeline Analysis
//         </h1>

//         {renderThreatLevelCard(timelineData[timelineData.length - 1] || {})}

//         <div 
//           className="bg-slate-800/50 rounded-xl p-6 shadow-2xl border border-slate-700"
//         >
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={timelineData}>
//               <CartesianGrid 
//                 strokeDasharray="3 3" 
//                 stroke={COLORS.gridColor} 
//               />
//               <XAxis 
//                 dataKey="month" 
//                 stroke={COLORS.primary} 
//                 tick={{ fill: COLORS.text }}
//               />
//               <YAxis 
//                 stroke={COLORS.primary} 
//                 tick={{ fill: COLORS.text }}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend 
//                 wrapperStyle={{ color: COLORS.text }}
//                 iconType="circle"
//               />
              
//               {/* Conditionally render lines based on selected threat level */}
//               {(!selectedThreatLevel || selectedThreatLevel === 'Total') && (
//                 <Line 
//                   type="monotone" 
//                   dataKey="totalIncidents" 
//                   stroke={COLORS.primary} 
//                   strokeWidth={3}
//                   name="Total Incidents"
//                 />
//               )}
//               {(!selectedThreatLevel || selectedThreatLevel === 'Low') && (
//                 <Line 
//                   type="monotone" 
//                   dataKey="lowThreat" 
//                   stroke={COLORS.threatColors.low} 
//                   strokeWidth={2}
//                   name="Low Threat"
//                 />
//               )}
//               {(!selectedThreatLevel || selectedThreatLevel === 'Medium') && (
//                 <Line 
//                   type="monotone" 
//                   dataKey="mediumThreat" 
//                   stroke={COLORS.threatColors.medium} 
//                   strokeWidth={2}
//                   name="Medium Threat"
//                 />
//               )}
//               {(!selectedThreatLevel || selectedThreatLevel === 'High') && (
//                 <Line 
//                   type="monotone" 
//                   dataKey="highThreat" 
//                   stroke={COLORS.threatColors.high} 
//                   strokeWidth={2}
//                   name="High Threat"
//                 />
//               )}
//               {(!selectedThreatLevel || selectedThreatLevel === 'Critical') && (
//                 <Line 
//                   type="monotone" 
//                   dataKey="criticalThreat" 
//                   stroke={COLORS.threatColors.critical} 
//                   strokeWidth={2}
//                   name="Critical Threat"
//                 />
//               )}
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default IncidentTimelineGraph;






import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ShieldQuestion, 
  Activity,
  PieChart as PieChartIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = {
  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
  primary: '#10B981',    // Emerald green
  text: '#E2E8F0',       // Light slate text
  gridColor: '#334155',  // Slate grid
  threatColors: {
    low: '#22C55E',      // Green
    medium: '#EAB308',   // Yellow
    high: '#F97316',     // Orange
    critical: '#EF4444'  // Red
  },
  sectorColors: {
    'Technology': '#3B82F6',    // Blue
    'Finance': '#10B981',        // Green
    'Healthcare': '#F43F5E',     // Rose
    'Energy': '#F59E0B',         
    'Government': '#6366F1',     
    'Other': '#8B5CF6'           
  }
};

const IncidentTimelineGraph = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThreatLevel, setSelectedThreatLevel] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [metrics, setMetrics] = useState({
    totalIncidents: 0,
    threatLevelBreakdown: {}
  });

  useEffect(() => {
    const fetchIncidentTimeline = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/incidents/advanced-timeline', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch incident timeline');
        }

        // Process the timeline data
        const processedData = processTimelineData(data.timeline);
        setTimelineData(processedData);

        // Process sector data for pie chart
        const processedSectorData = processSectorData(data.metrics.sectorBreakdown);
        setSectorData(processedSectorData);

        // Set metrics
        setMetrics(data.metrics);

        setLoading(false);
      } catch (error) {
        console.error('Detailed Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchIncidentTimeline();
  }, []);

  const processSectorData = (sectorBreakdown) => {
    return Object.entries(sectorBreakdown)
      .map(([name, value]) => ({
        name, 
        value,
        color: COLORS.sectorColors[name] || COLORS.sectorColors['Other']
      }))
      .filter(sector => sector.value > 0)  // Remove sectors with zero incidents
      .sort((a, b) => b.value - a.value);  // Sort in descending order
  };

  const processTimelineData = (timeline) => {
    const monthlyIncidents = {};
    
    timeline.forEach(incident => {
      const date = new Date(incident.Date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyIncidents[monthKey]) {
        monthlyIncidents[monthKey] = {
          month: formatMonthYear(date),
          totalIncidents: 0,
          lowThreat: 0,
          mediumThreat: 0,
          highThreat: 0,
          criticalThreat: 0
        };
      }
      
      monthlyIncidents[monthKey].totalIncidents++;
      
      switch(incident.Threat_Level) {
        case 'Low':
          monthlyIncidents[monthKey].lowThreat++;
          break;
        case 'Medium':
          monthlyIncidents[monthKey].mediumThreat++;
          break;
        case 'High':
          monthlyIncidents[monthKey].highThreat++;
          break;
        case 'Critical':
          monthlyIncidents[monthKey].criticalThreat++;
          break;
      }
    });

    return Object.values(monthlyIncidents).sort((a, b) => {
      const [aYear, aMonth] = a.month.split('-').map(Number);
      const [bYear, bMonth] = b.month.split('-').map(Number);
      return aYear - bYear || aMonth - bMonth;
    });
  };

  const formatMonthYear = (date) => {
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const renderThreatLevelCard = () => {
    const threatLevels = [
      { 
        name: 'Low', 
        color: COLORS.threatColors.low,
        icon: <Activity size={24} />,
        count: metrics.threatLevelBreakdown['Low'] || 0
      },
      { 
        name: 'Medium', 
        color: COLORS.threatColors.medium,
        icon: <AlertTriangle size={24} />,
        count: metrics.threatLevelBreakdown['Medium'] || 0
      },
      { 
        name: 'High', 
        color: COLORS.threatColors.high,
        icon: <ShieldQuestion size={24} />,
        count: metrics.threatLevelBreakdown['High'] || 0
      },
      { 
        name: 'Critical', 
        color: COLORS.threatColors.critical,
        icon: <Clock size={24} />,
        count: metrics.threatLevelBreakdown['Critical'] || 0
      }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {threatLevels.map((level, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedThreatLevel(
              selectedThreatLevel === level.name ? null : level.name
            )}
            className={`p-4 rounded-lg shadow-lg transition-all duration-300 cursor-pointer
              ${selectedThreatLevel === level.name 
                ? 'ring-4 ring-opacity-50' 
                : 'hover:bg-slate-800/50'}`}
            style={{ 
              backgroundColor: `${level.color}10`, 
              borderColor: level.color,
              color: COLORS.text,
              borderWidth: selectedThreatLevel === level.name ? '2px' : '0px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {React.cloneElement(level.icon, { color: level.color })}
                <span className="font-semibold">{level.name}</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: level.color }}>
                {level.count}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderTimelineChart = () => {
    const filteredData = selectedThreatLevel
      ? timelineData.map(item => ({
          ...item,
          totalIncidents: item[`${selectedThreatLevel.toLowerCase()}Threat`] || 0
        }))
      : timelineData;

    return (
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <h2 
          className="text-2xl font-semibold mb-4 flex items-center"
          style={{ color: COLORS.primary }}
        >
          <TrendingUp className="mr-2" /> Monthly Incident Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridColor} />
            <XAxis 
              dataKey="month" 
              stroke={COLORS.text} 
              interval="preserveStartEnd" 
            />
            <YAxis 
              stroke={COLORS.text} 
              label={{ 
                value: 'Total Incidents', 
                angle: -90, 
                position: 'insideLeft',
                fill: COLORS.text 
              }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                color: COLORS.text 
              }}
              labelStyle={{ color: COLORS.primary }}
            />
            <Line 
              type="monotone" 
              dataKey="totalIncidents" 
              stroke={COLORS.primary} 
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderSectorPieChart = () => {
    const filteredSectorData = selectedThreatLevel
      ? sectorData.filter(sector => {
          // Add logic to filter sectors based on threat level if needed
          return sector.value > 0;
        })
      : sectorData;

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="text-xs font-bold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 
          className="text-2xl font-semibold mb-4 flex items-center"
          style={{ color: COLORS.primary }}
        >
          <PieChartIcon className="mr-2" /> Incidents by Sector
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredSectorData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {filteredSectorData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  onClick={() => setSelectedSector(
                    selectedSector === entry.name ? null : entry.name
                  )}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                color: COLORS.text 
              }}
              formatter={(value, name) => [
                value, 
                <span style={{ color: COLORS.text }}>{name}</span>
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              iconSize={12}
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: COLORS.text }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderErrorOrLoading = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "linear" 
            }}
          >
            <TrendingUp size={48} color={COLORS.primary} />
          </motion.div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-8">
          <h2 className="text-2xl mb-4">Error Loading Data</h2>
          <p>{error}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8"
      style={{ 
        background: COLORS.background,
        color: COLORS.text 
      }}
    >
      <div className="container mx-auto">
        <h1 
          className="text-4xl font-bold mb-8 text-center flex items-center justify-center"
          style={{ color: COLORS.primary }}
        >
          <TrendingUp className="mr-4" />
          Incident Timeline Analysis
        </h1>

        {loading || error ? (
          renderErrorOrLoading()
        ) : (
          <>
            {renderThreatLevelCard()}
            
            <div className="grid md:grid-cols-2 gap-6">
              {renderTimelineChart()}
              {renderSectorPieChart()}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default IncidentTimelineGraph;