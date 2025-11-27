import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowLeft, ExternalLink, Shield, AlertCircle } from "lucide-react";

const getStatusConfig = (status) => {
  return {
    Open: { bg: "bg-yellow-100 text-yellow-800", badge: "Open", Icon: AlertCircle },
    Investigating: { bg: "bg-orange-100 text-orange-800", badge: "Investigating", Icon: AlertCircle },
    Resolved: { bg: "bg-green-100 text-green-800", badge: "Resolved", Icon: Shield },
    Closed: { bg: "bg-gray-100 text-gray-800", badge: "Closed", Icon: AlertCircle },
    Unknown: { bg: "bg-gray-100 text-gray-800", badge: "Unknown", Icon: AlertCircle },
  }[status] || { bg: "bg-gray-100 text-gray-800", badge: status || "Unknown", Icon: AlertCircle };
};

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIncident = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(`http://localhost:5000/api/incidents/${id}`, { headers });
        setIncident(res.data || null);
      } catch (err) {
        console.error("Error fetching incident:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch incident details"
        );
        setIncident(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchIncident();
  }, [id]);

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen bg-gray-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-green-300">Loading incident...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
            <h2 className="text-xl font-semibold">Incident not found</h2>
          </div>
          <p className="text-gray-400">No incident with that ID was found.</p>
        </div>
      </div>
    );
  }

  // Map schema fields to display variables (fallbacks)
  const {
    _id,
    name,
    description,
    inclusion_criteria,
    incident_type,
    start_date,
    end_date,
    receiver_country,
    receiver_category,
    sources_url,
    status,
    added_to_DB,
    updated_at,
  } = incident;

  const statusCfg = getStatusConfig(status);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-300 hover:text-white p-2 rounded-md"
                  aria-label="Back"
                >
                  <ArrowLeft />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{name || `Incident ${_id}`}</h1>
                  <div className="text-sm text-gray-400 mt-1">
                    {incident_type ? `${incident_type}` : "Type: Unknown"} ·{" "}
                    {start_date ? new Date(start_date).toLocaleString() : added_to_DB ? new Date(added_to_DB).toLocaleString() : "Date unknown"}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusCfg.bg}`}>
                <statusCfg.Icon size={16} className={statusCfg.bg ? "" : ""} />
                <span className="text-sm font-semibold">{statusCfg.badge}</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Updated: {updated_at ? new Date(updated_at).toLocaleString() : "—"}
              </div>
            </div>
          </div>

          {/* Summary / Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-400 mb-2">Description</h2>
            <p className="text-gray-300 leading-relaxed">
              {description || inclusion_criteria || "No description or inclusion criteria provided."}
            </p>
          </div>

          {/* Key details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm text-gray-400">Incident Type</h3>
              <p className="text-white font-medium">{incident_type || "Unknown"}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400">Date Range</h3>
              <p className="text-white font-medium">
                {start_date ? new Date(start_date).toLocaleString() : "—"}
                {start_date || end_date ? " → " : ""}
                {end_date ? new Date(end_date).toLocaleString() : "—"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400">Receiver Country</h3>
              <p className="text-white font-medium">
                {Array.isArray(receiver_country) && receiver_country.length > 0
                  ? receiver_country.join(", ")
                  : (receiver_country || "—")}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400">Receiver Category</h3>
              <p className="text-white font-medium">
                {Array.isArray(receiver_category) && receiver_category.length > 0
                  ? receiver_category.join(", ")
                  : (receiver_category || "—")}
              </p>
            </div>
          </div>

          {/* Sources */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-400 mb-2">Sources</h3>
            {Array.isArray(sources_url) && sources_url.length > 0 ? (
              <ul className="space-y-2">
                {sources_url.map((src, idx) => (
                  <li key={idx} className="text-sm">
                    <a
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-300 hover:underline inline-flex items-center gap-2"
                    >
                      <ExternalLink size={14} />
                      <span className="truncate max-w-md block">{src}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No sources available.</p>
            )}
          </div>

          {/* Inclusion criteria */}
          {inclusion_criteria && (
            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-2">Inclusion Criteria</h3>
              <p className="text-gray-300">{inclusion_criteria}</p>
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Incident ID: <span className="text-white font-mono">{_id}</span>
            </div>

            <div className="flex items-center gap-3">
             

              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-green-600 rounded-md text-sm text-white hover:bg-green-500 transition"
              >
                Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IncidentDetails;
