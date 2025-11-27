
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [threatLevelFilter, setThreatLevelFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("token");
        const queryParams = new URLSearchParams({
          page: page,
          limit: 10,
          search: searchTerm,
          threatLevel: threatLevelFilter,
          sector: sectorFilter,
        });

        const response = await fetch(
          `http://localhost:5000/api/incidents?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch incidents");
        }

        const data = await response.json();
        setIncidents(data.incidents);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching incidents:", error);
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [page, searchTerm, threatLevelFilter, sectorFilter]);

  const getThreatLevelColor = (level) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-orange-100 text-orange-800",
      Critical: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleThreatLevelChange = (e) => setThreatLevelFilter(e.target.value);
  const handleSectorChange = (e) => setSectorFilter(e.target.value);

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen bg-gray-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading Incidents...
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-500">Incidents</h1>

        {/* Search and Filter Section */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search incidents..."
              className="px-4 py-2 rounded bg-gray-800 text-white"
            />

            <select
              value={threatLevelFilter}
              onChange={handleThreatLevelChange}
              className="px-4 py-2 rounded bg-gray-800 text-white"
            >
              <option value="">Filter by Threat Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <select
              value={sectorFilter}
              onChange={handleSectorChange}
              className="px-4 py-2 rounded bg-gray-800 text-white"
            >
              <option value="">Filter by Sector</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Energy">Energy</option>
              {/* Add other sectors as needed */}
            </select>
          </div>
        </div>

        {/* Incident Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incidents.map((incident) => (
            <motion.div
              key={incident._id}
              className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => window.location.href = `/incidents/${incident._id}`}
            >
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getThreatLevelColor(
                    incident.Threat_Level
                  )}`}
                >
                  {incident.Threat_Level}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(incident.Date).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-green-400">{incident.Location}</h2>
              <p className="text-sm text-gray-300 mb-4">{incident.Incident_Type}</p>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin size={16} />
                  <span className="text-sm">{incident.Sector}</span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    incident.Incident_Solved ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {incident.Incident_Solved ? "Solved" : "Unsolved"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Incidents;

