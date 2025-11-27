// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { motion } from "framer-motion";

// const IncidentDetails = () => {
//   const { id } = useParams();
//   const [incident, setIncident] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchIncidentDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `http://localhost:5000/api/incidents/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch incident details");
//         }

//         const data = await response.json();
//         setIncident(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching incident details:", error);
//         setLoading(false);
//       }
//     };

//     fetchIncidentDetails();
//   }, [id]);

//   if (loading) {
//     return (
//       <motion.div
//         className="flex justify-center items-center h-screen bg-gray-900 text-white"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         Loading Incident Details...
//       </motion.div>
//     );
//   }

//   if (!incident) {
//     return <div>Incident not found</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold text-green-500">
//               Incident: {incident.Incident_ID}
//             </h1>
//             <span
//               className={`px-4 py-2 rounded-full text-sm font-bold ${
//                 incident.Incident_Solved
//                   ? "bg-green-100 text-green-800"
//                   : "bg-red-100 text-red-800"
//               }`}
//             >
//               {incident.Incident_Solved ? "Solved" : "Unsolved"}
//             </span>
//           </div>

//           <p className="text-gray-300">{incident.Description}</p>
//           <p className="text-gray-300">Date: {new Date(incident.Date).toLocaleString()}</p>
//           <p className="text-gray-300">Sector: {incident.Sector}</p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default IncidentDetails;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const IncidentDetails = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/incidents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch incident details");
        }

        const data = await response.json();
        setIncident(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching incident details:", error);
        setLoading(false);
      }
    };

    fetchIncidentDetails();
  }, [id]);

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen bg-gray-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading Incident Details...
      </motion.div>
    );
  }

  if (!incident) {
    return <div className="text-white">Incident not found</div>;
  }

  const getThreatLevelColor = (level) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-orange-100 text-orange-800",
      Critical: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Incident Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-500">
              Incident: {incident.Incident_ID}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${getThreatLevelColor(
                incident.Threat_Level
              )}`}
            >
              {incident.Threat_Level}
            </span>
          </div>

          {/* Incident Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-green-400 mb-2">Summary:</h2>
            <p className="text-gray-300">{incident.Summary}</p>
          </div>

          {/* Incident Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-green-400 mb-2">Description:</h2>
            <p className="text-gray-300">{incident.Description}</p>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-green-400">Incident Type:</h2>
              <p className="text-gray-300">{incident.Incident_Type}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-400">Sector:</h2>
              <p className="text-gray-300">{incident.Sector}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-400">Date:</h2>
              <p className="text-gray-300">{new Date(incident.Date).toLocaleString()}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-400">Location:</h2>
              <p className="text-gray-300">{incident.Location}</p>
            </div>
          </div>

          {/* Incident Status */}
          <div className="flex justify-start items-center">
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${incident.Incident_Solved
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
            >
              {incident.Incident_Solved ? "Solved" : "Unsolved"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IncidentDetails;
