import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
  }, [id]);

  async function fetchReport() {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(res.data);
    } catch (err) {
      console.error("Fetch report error:", err?.response?.data || err.message || err);
      setError((err?.response?.data && (err.response.data.message || JSON.stringify(err.response.data))) || 'Failed to load report');
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-white p-6">Loading report...</div>;
  if (error) return (
    <div className="p-6 text-red-400">
      {error}
      <div className="mt-4">
        <button onClick={() => navigate(-1)} className="px-3 py-2 rounded border text-white">Go Back</button>
      </div>
    </div>
  );
  if (!report) return <div className="text-white p-6">No report found.</div>;

  return (
    <div className="min-h-screen p-6 bg-black text-green-400">
      <ToastContainer theme="dark" />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-green-300 hover:text-green-100 mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <h1 className="text-3xl font-bold text-green-300">{report.Title}</h1>
            <div className="text-sm text-green-200 mt-1">
              Report ID: <span className="font-medium text-green-100">{report.Report_ID || report._id}</span>
              {" • "}Reported: <span className="font-medium text-green-100">{new Date(report.Date).toLocaleString()}</span>
            </div>
            <div className="text-sm text-green-200">Reporter: {report.Reporter?.name || 'N/A'} ({report.Reporter?.email || '—'})</div>
          </div>

          <div className="flex items-center gap-3">
            {report.incidentRef ? (
              <button
                onClick={() => {
                  const incId = (report.incidentRef && (report.incidentRef._id || report.incidentRef)) || report.incidentID_raw;
                  if (incId) navigate(`/incidents/${incId}`);
                }}
                className="px-3 py-2 rounded bg-transparent border border-green-700 text-green-200 hover:bg-green-900/20 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Open linked incident
              </button>
            ) : (
              <div className="px-3 py-2 rounded bg-green-900/10 text-green-200 text-sm">Not linked</div>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-900 p-6 rounded-lg border border-green-800/20 shadow-md">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-green-200 mb-2">Summary</h3>
            <p className="text-green-100 whitespace-pre-wrap">{report.Description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-200 mt-4">
            <div className="space-y-2">
              <div><strong className="text-green-100">Type:</strong> {report.Incident_Type || '—'}</div>
              <div><strong className="text-green-100">Severity:</strong> {report.Threat_Level || '—'}</div>
              <div><strong className="text-green-100">Location:</strong> {report.Location || 'N/A'}</div>
              <div><strong className="text-green-100">Reporter:</strong> {report.Reporter?.name || 'N/A'}</div>
            </div>

            <div className="space-y-2">
              <div><strong className="text-green-100">Status:</strong> <span className="text-green-300 font-semibold ml-2">{report.Status}</span></div>
              <div><strong className="text-green-100">Incident Link:</strong> {report.incidentRef ? (report.incidentRef.Incident_ID || (report.incidentRef._id || report.incidentID_raw)) : 'Not linked'}</div>
              <div><strong className="text-green-100">Created:</strong> {new Date(report.createdAt || report.Date).toLocaleString()}</div>
              <div><strong className="text-green-100">Updated:</strong> {new Date(report.updatedAt || report.Date).toLocaleString()}</div>
            </div>
          </div>

          {report.Additional_Notes && (
            <div className="mt-6">
              <h4 className="text-sm text-green-200 font-semibold">Additional Notes</h4>
              <p className="text-green-100">{report.Additional_Notes}</p>
            </div>
          )}

          {/* Attachments (if any) */}
          {report.attachments && report.attachments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm text-green-200 font-semibold">Attachments</h4>
              <ul className="mt-2 space-y-2">
                {report.attachments.map((a, idx) => (
                  <li key={idx}>
                    <a href={a.url} target="_blank" rel="noreferrer" className="text-green-300 hover:underline">
                      {a.filename || `Attachment ${idx + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
