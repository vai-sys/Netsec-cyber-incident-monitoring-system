// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { MapPin } from "lucide-react";
// import { Link } from "react-router-dom";

// const Incidents = () => {
//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // filters matching your backend
//   const [searchTerm, setSearchTerm] = useState("");
//   const [receiverCountry, setReceiverCountry] = useState("");
//   const [receiverCategory, setReceiverCategory] = useState("");
//   const [incidentType, setIncidentType] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   // Keep consistent limit
//   const LIMIT = 10;

//   useEffect(() => {
//     const fetchIncidents = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");

//         // build params and remove empty/undefined values
//         const params = {
//           page,
//           limit: LIMIT,
//           search: searchTerm || undefined,
//           receiver_country: receiverCountry || undefined,
//           receiver_category: receiverCategory || undefined,
//           incident_type: incidentType || undefined,
//           status: statusFilter || undefined,
//           startDate: startDate || undefined,
//           endDate: endDate || undefined,
//         };

//         // remove keys with undefined or empty strings (optional)
//         Object.keys(params).forEach((k) => {
//           if (params[k] === undefined || params[k] === "") {
//             delete params[k];
//           }
//         });

//         const headers = {};
//         if (token) headers.Authorization = `Bearer ${token}`;

//         const res = await axios.get("http://localhost:5000/api/incidents", {
//           headers,
//           params,
//         });

//         const data = res.data || {};

//         setIncidents(Array.isArray(data.incidents) ? data.incidents : []);
//         setTotalPages(
//           typeof data.totalPages === "number"
//             ? data.totalPages
//             : Math.max(1, Math.ceil((data.totalIncidents || 0) / LIMIT))
//         );
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching incidents:", err);
//         setIncidents([]);
//         setTotalPages(1);
//         setLoading(false);
//       }
//     };

//     fetchIncidents();
//   }, [
//     page,
//     searchTerm,
//     receiverCountry,
//     receiverCategory,
//     incidentType,
//     statusFilter,
//     startDate,
//     endDate,
//   ]);

//   // map "status" to styles (since Threat_Level isn't in schema)
//   const getStatusColor = (status) => {
//     const map = {
//       Open: "bg-yellow-100 text-yellow-800",
//       Investigating: "bg-orange-100 text-orange-800",
//       Resolved: "bg-green-100 text-green-800",
//       Closed: "bg-gray-100 text-gray-800",
//       Unknown: "bg-gray-100 text-gray-800",
//     };
//     return map[status] || "bg-gray-100 text-gray-800";
//   };

//   // handlers that also reset page to 1 when filters change
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setPage(1);
//   };
//   const handleReceiverCountryChange = (e) => {
//     setReceiverCountry(e.target.value);
//     setPage(1);
//   };
//   const handleReceiverCategoryChange = (e) => {
//     setReceiverCategory(e.target.value);
//     setPage(1);
//   };
//   const handleIncidentTypeChange = (e) => {
//     setIncidentType(e.target.value);
//     setPage(1);
//   };
//   const handleStatusChange = (e) => {
//     setStatusFilter(e.target.value);
//     setPage(1);
//   };
//   const handleStartDateChange = (e) => {
//     setStartDate(e.target.value);
//     setPage(1);
//   };
//   const handleEndDateChange = (e) => {
//     setEndDate(e.target.value);
//     setPage(1);
//   };

//   if (loading) {
//     return (
//       <motion.div
//         className="flex justify-center items-center h-screen bg-gray-900 text-white"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         Loading Incidents...
//       </motion.div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-green-500">Incidents</h1>

//         {/* Search and Filters */}
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex space-x-4">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               placeholder="Search by name, description, receiver, incident type..."
//               className="px-4 py-2 rounded bg-gray-800 text-white w-full"
//             />
//           </div>

//           <div className="flex space-x-2 justify-end">
//             <input
//               type="text"
//               value={receiverCountry}
//               onChange={handleReceiverCountryChange}
//               placeholder="Receiver country"
//               className="px-3 py-2 rounded bg-gray-800 text-white"
//             />
//             <input
//               type="text"
//               value={receiverCategory}
//               onChange={handleReceiverCategoryChange}
//               placeholder="Receiver category"
//               className="px-3 py-2 rounded bg-gray-800 text-white"
//             />
//             <select
//               value={incidentType}
//               onChange={handleIncidentTypeChange}
//               className="px-3 py-2 rounded bg-gray-800 text-white"
//             >
//               <option value="">All Incident Types</option>
//               <option value="Malware">Malware</option>
//               <option value="Phishing">Phishing</option>
//               <option value="Data Breach">Data Breach</option>
//               <option value="Ransomware">Ransomware</option>
//               <option value="Unknown">Unknown</option>
//               {/* add more incident types as needed */}
//             </select>

//             <select
//               value={statusFilter}
//               onChange={handleStatusChange}
//               className="px-3 py-2 rounded bg-gray-800 text-white"
//             >
//               <option value="">All Statuses</option>
//               <option value="Open">Open</option>
//               <option value="Investigating">Investigating</option>
//               <option value="Resolved">Resolved</option>
//               <option value="Closed">Closed</option>
//               <option value="Unknown">Unknown</option>
//             </select>
//           </div>
//         </div>

//         {/* Date range */}
//         <div className="mb-6 flex items-center space-x-4">
//           <label className="text-sm text-gray-300">Start</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={handleStartDateChange}
//             className="px-3 py-2 rounded bg-gray-800 text-white"
//           />
//           <label className="text-sm text-gray-300">End</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={handleEndDateChange}
//             className="px-3 py-2 rounded bg-gray-800 text-white"
//           />
//         </div>

//         {/* Incident Cards */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {incidents.length === 0 && (
//             <div className="text-gray-400">No incidents found.</div>
//           )}

//           {incidents.map((incident) => (
//             <Link key={incident._id} to={`/incidents/${incident._id}`}>
//               <motion.div
//                 className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer"
//                 whileHover={{ scale: 1.03 }}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
//                       incident.status
//                     )}`}
//                   >
//                     {incident.status || "Unknown"}
//                   </span>

//                   <span className="text-sm text-gray-400">
//                     {incident.start_date
//                       ? new Date(incident.start_date).toLocaleDateString()
//                       : incident.added_to_DB
//                       ? new Date(incident.added_to_DB).toLocaleDateString()
//                       : "—"}
//                   </span>
//                 </div>

//                 <h2 className="text-lg font-semibold text-green-400">
//                   {incident.name}
//                 </h2>

//                 <p className="text-sm text-gray-300 mb-2 line-clamp-3">
//                   {incident.description ||
//                     incident.inclusion_criteria ||
//                     "No description available."}
//                 </p>

//                 <p className="text-sm text-gray-400 mb-3">
//                   <strong>Type:</strong> {incident.incident_type || "Unknown"}
//                 </p>

//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center space-x-2 text-gray-400">
//                     <MapPin size={16} />
//                     <span className="text-sm">
//                       {Array.isArray(incident.receiver_country)
//                         ? incident.receiver_country.join(", ")
//                         : incident.receiver_country || "—"}
//                     </span>
//                   </div>

//                   <div className="text-right">
//                     <div className="text-sm text-gray-400">
//                       {Array.isArray(incident.receiver_category)
//                         ? incident.receiver_category.join(", ")
//                         : incident.receiver_category || "—"}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Sources:{" "}
//                       {Array.isArray(incident.sources_url) &&
//                       incident.sources_url.length > 0
//                         ? incident.sources_url.length
//                         : 0}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </Link>
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center mt-8 space-x-4">
//           <button
//             onClick={() => setPage((prev) => Math.max(1, prev - 1))}
//             disabled={page === 1}
//             className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50"
//           >
//             Previous
//           </button>

//           <span className="text-white">
//             Page {page} of {totalPages || 1}
//           </span>

//           <button
//             onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
//             disabled={page === totalPages || totalPages === 0}
//             className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Incidents;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Filter, Search, X, AlertCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // filters matching your backend
  const [searchTerm, setSearchTerm] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("");
  const [receiverCategory, setReceiverCategory] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const LIMIT = 10;

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const params = {
          page,
          limit: LIMIT,
          search: searchTerm || undefined,
          receiver_country: receiverCountry || undefined,
          receiver_category: receiverCategory || undefined,
          incident_type: incidentType || undefined,
          status: statusFilter || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        };

        Object.keys(params).forEach((k) => {
          if (params[k] === undefined || params[k] === "") {
            delete params[k];
          }
        });

        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await axios.get("http://localhost:5000/api/incidents", {
          headers,
          params,
        });

        const data = res.data || {};

        setIncidents(Array.isArray(data.incidents) ? data.incidents : []);
        setTotalPages(
          typeof data.totalPages === "number"
            ? data.totalPages
            : Math.max(1, Math.ceil((data.totalIncidents || 0) / LIMIT))
        );
        setLoading(false);
      } catch (err) {
        console.error("Error fetching incidents:", err);
        setIncidents([]);
        setTotalPages(1);
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [
    page,
    searchTerm,
    receiverCountry,
    receiverCategory,
    incidentType,
    statusFilter,
    startDate,
    endDate,
  ]);

  const getStatusConfig = (status) => {
    const map = {
      Open: { 
        bg: "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20", 
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        icon: AlertCircle
      },
      Investigating: { 
        bg: "bg-gradient-to-r from-orange-500/20 to-orange-600/20", 
        text: "text-orange-400",
        border: "border-orange-500/30",
        icon: Search
      },
      Resolved: { 
        bg: "bg-gradient-to-r from-green-500/20 to-green-600/20", 
        text: "text-green-400",
        border: "border-green-500/30",
        icon: Shield
      },
      Closed: { 
        bg: "bg-gradient-to-r from-gray-500/20 to-gray-600/20", 
        text: "text-gray-400",
        border: "border-gray-500/30",
        icon: X
      },
      Unknown: { 
        bg: "bg-gradient-to-r from-gray-500/20 to-gray-600/20", 
        text: "text-gray-400",
        border: "border-gray-500/30",
        icon: AlertCircle
      },
    };
    return map[status] || map.Unknown;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setReceiverCountry("");
    setReceiverCategory("");
    setIncidentType("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const activeFiltersCount = [receiverCountry, receiverCategory, incidentType, statusFilter, startDate, endDate].filter(f => f).length;

  if (loading) {
    return (
      <motion.div
        className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
        <p className="text-green-400 mt-4 text-lg font-medium">Loading Incidents...</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Header with gradient overlay */}
      <div className="bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Security Incidents
              </h1>
              <p className="text-gray-400 mt-2">Monitor and track security incidents in real-time</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">{incidents.length}</div>
              <div className="text-sm text-gray-400">Active Incidents</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 shadow-xl">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search incidents by name, description, receiver..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Filter size={20} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all flex items-center gap-2"
                >
                  <X size={20} />
                  Clear
                </button>
              )}
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="relative">
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Receiver Country</label>
                        <input
                          type="text"
                          value={receiverCountry}
                          onChange={(e) => { setReceiverCountry(e.target.value); setPage(1); }}
                          placeholder="e.g., Spain, USA, India"
                          className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Receiver Category</label>
                        <input
                          type="text"
                          value={receiverCategory}
                          onChange={(e) => { setReceiverCategory(e.target.value); setPage(1); }}
                          placeholder="e.g., Government, Healthcare"
                          className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        />
                      </div>
                      
                      <select
                        value={incidentType}
                        onChange={(e) => { setIncidentType(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="">All Types</option>
                        <option value="Malware">Malware</option>
                        <option value="Phishing">Phishing</option>
                        <option value="Data Breach">Data Breach</option>
                        <option value="Ransomware">Ransomware</option>
                        <option value="Unknown">Unknown</option>
                      </select>

                      <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Investigating">Investigating</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <Calendar className="text-gray-400" size={20} />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Incident Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incidents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <AlertCircle className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400 text-lg">No incidents found matching your criteria.</p>
            </motion.div>
          )}

          {incidents.map((incident, index) => {
            const statusConfig = getStatusConfig(incident.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Link key={incident._id} to={`/incidents/${incident._id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-5 border ${statusConfig.border} shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all cursor-pointer group`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} border ${statusConfig.border}`}>
                      <StatusIcon size={16} className={statusConfig.text} />
                      <span className={`text-sm font-medium ${statusConfig.text}`}>
                        {incident.status || "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} />
                      <span className="text-xs">
                        {incident.start_date
                          ? new Date(incident.start_date).toLocaleDateString()
                          : incident.added_to_DB
                          ? new Date(incident.added_to_DB).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                    {incident.name}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                    {incident.description ||
                      incident.inclusion_criteria ||
                      "No description available."}
                  </p>

                  {/* Type Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gray-700/50 rounded-lg text-xs text-gray-300 border border-gray-600/30">
                      {incident.incident_type || "Unknown Type"}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={16} className="text-green-500" />
                      <span className="text-sm">
                        {Array.isArray(incident.receiver_country)
                          ? incident.receiver_country.slice(0, 2).join(", ") + 
                            (incident.receiver_country.length > 2 ? "..." : "")
                          : incident.receiver_country || "—"}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {Array.isArray(incident.receiver_category)
                          ? incident.receiver_category[0]
                          : incident.receiver_category || "—"}
                      </div>
                      <div className="text-xs text-green-500 font-medium">
                        {Array.isArray(incident.sources_url) &&
                        incident.sources_url.length > 0
                          ? `${incident.sources_url.length} sources`
                          : "No sources"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center mt-12 gap-4"
        >
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-all font-medium border border-gray-700"
          >
            Previous
          </button>

          <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
            <span className="text-white font-medium">Page {page}</span>
            <span className="text-gray-400">of</span>
            <span className="text-white font-medium">{totalPages || 1}</span>
          </div>

          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-all font-medium border border-gray-700"
          >
            Next
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Incidents;
