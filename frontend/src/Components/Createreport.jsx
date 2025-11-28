// src/components/ReportCreationDark.jsx
import React, { useState } from "react";

/**
 * ReportCreationDark
 * - Tailwind-based dark themed report creation form
 * - Accent color: #0AFF9D
 * - Layout: centered card sized for dashboard content
 *
 * Usage:
 *   import ReportCreationDark from '@/components/ReportCreationDark';
 *   <ReportCreationDark />
 *
 * Notes:
 * - Fixed bugs (Authorization header template literal, robust response handling, nicer success id detection).
 * - Payload includes both camelCase and Title/Incident_Type fields to be compatible with different backends.
 * - Keeps form UX and validation as you designed.
 */
export default function ReportCreationDark() {
  const ACCENT = "#0AFF9D";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [location, setLocation] = useState("");
  const [useGeo, setUseGeo] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  const incidentOptions = [
    "Phishing",
    "Data Breach",
    "Malware",
    "DDoS",
    "Unauthorized Access",
    "Supply Chain",
    "Other",
  ];

  function validate() {
    if (!title.trim()) return { ok: false, msg: "Title is required" };
    if (!description.trim()) return { ok: false, msg: "Description is required" };
    if (!incidentType) return { ok: false, msg: "Incident Type is required" };
    if (!severity) return { ok: false, msg: "Severity is required" };
    if (useGeo) {
      if (!latitude || !longitude) return { ok: false, msg: "Latitude & Longitude required" };
      if (isNaN(Number(latitude)) || isNaN(Number(longitude)))
        return { ok: false, msg: "Coordinates must be numbers" };
    }
    return { ok: true };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const v = validate();
    if (!v.ok) {
      setError(v.msg);
      return;
    }

    setLoading(true);

    try {
      // Build payload with both camelCase and backend-friendly fields
      const payload = {
        // camelCase (frontend-convention)
        title: title.trim(),
        description: description.trim(),
        incidentType,
        severity,
        location: location.trim() || undefined,
        additionalNotes: additionalNotes.trim() || undefined,

        // also include fields matching your mongoose model if backend expects them
        Title: title.trim(),
        Description: description.trim(),
        Incident_Type: incidentType,
        Threat_Level: severity,
        Location: location.trim() || undefined,
        Additional_Notes: additionalNotes.trim() || undefined,
      };

      if (useGeo) {
        const lat = Number(latitude);
        const lon = Number(longitude);
        // include simple lat/lon
        payload.latitude = lat;
        payload.longitude = lon;
        // include GeoJSON style field (if backend supports it)
        payload.location_point = { type: "Point", coordinates: [lon, lat] };
      }

      const token = localStorage.getItem("token");

      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      // Try to parse JSON; fallback to text if not JSON
      let data;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = { message: text || (res.ok ? "OK" : "Unknown response") };
        }
      }

      if (!res.ok) {
        // prefer message from body
        throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
      }

      // backend might return different id fields — try several common ones
      const createdId =
        data?.report?.reportId ||
        data?.report?.Report_ID ||
        data?.reportId ||
        data?.Report_ID ||
        data?.id ||
        data?.insertedId ||
        null;

      setInfo({ msg: "Report created", id: createdId });
      // gently clear fields (keep incidentType to aid repeat reports)
      setTitle("");
      setDescription("");
      setLocation("");
      setAdditionalNotes("");
      setLatitude("");
      setLongitude("");
      setUseGeo(false);
    } catch (err) {
      console.error(err);
      setError(err?.message || String(err) || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-start justify-center px-4 py-8">
      <div
        className="w-full max-w-3xl rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, rgba(11,17,25,0.72), rgba(8,12,16,0.5))",
          border: "1px solid rgba(255,255,255,0.03)",
          boxShadow: "0 6px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: "#B7F7E0" }}>
              Create Report
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Submit a suspicious activity — admin will review and link to incidents.
            </p>
          </div>

          <div className="text-right">
            <div
              className="text-2xl font-bold"
              style={{ color: ACCENT, textShadow: "0 4px 18px rgba(10,255,157,0.08)" }}
            >
              {loading ? "Sending..." : "New"}
            </div>
            <div className="text-xs text-slate-500">Securely logged</div>
          </div>
        </div>

        {/* Error / Info */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/40 text-red-300 border border-red-800">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-900/30 text-green-200 border border-green-800">
            {info.msg} {info.id ? <strong className="ml-2">{info.id}</strong> : null}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-300">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary of the issue"
              className="mt-2 w-full bg-[#071018] rounded-lg border border-transparent focus:border-[#0aff9d55] focus:ring-0 px-4 py-3 text-slate-100 placeholder-slate-500"
              aria-required="true"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-300">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Explain what happened, evidence, links, timestamps..."
              className="mt-2 w-full bg-[#071018] rounded-lg border border-transparent focus:border-[#0aff9d55] focus:ring-0 px-4 py-3 text-slate-100 placeholder-slate-500"
              aria-required="true"
            />
          </div>

          {/* Grid row: type + severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Incident Type *</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="mt-2 w-full bg-[#071018] rounded-lg px-3 py-2 text-slate-100 border border-transparent focus:border-[#0aff9d55]"
                aria-required="true"
              >
                <option value="">— select —</option>
                {incidentOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Severity *</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="mt-2 w-full bg-[#071018] rounded-lg px-3 py-2 text-slate-100 border border-transparent focus:border-[#0aff9d55]"
                aria-required="true"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Location + geo toggle */}
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-300">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, asset, or short site"
                className="mt-2 w-full bg-[#071018] rounded-lg border border-transparent focus:border-[#0aff9d55] px-4 py-2 text-slate-100 placeholder-slate-500"
              />
            </div>

            <div className="text-right">
              <label className="text-sm font-medium text-slate-300 inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={useGeo}
                  onChange={() => setUseGeo(!useGeo)}
                  aria-checked={useGeo}
                />
                Add coords
              </label>
            </div>
          </div>

          {useGeo && (
            <div className="grid grid-cols-2 gap-4">
              <input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude e.g., 19.0760"
                className="bg-[#071018] rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 border border-transparent focus:border-[#0aff9d55]"
                aria-label="Latitude"
              />
              <input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude e.g., 72.8777"
                className="bg-[#071018] rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 border border-transparent focus:border-[#0aff9d55]"
                aria-label="Longitude"
              />
            </div>
          )}

          {/* Additional notes */}
          <div>
            <label className="text-sm font-medium text-slate-300">Additional Notes</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              placeholder="Optional — internal notes, context, reporter info"
              className="mt-2 w-full bg-[#071018] rounded-lg border border-transparent focus:border-[#0aff9d55] focus:ring-0 px-4 py-3 text-slate-100 placeholder-slate-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 bg-[#0aff9d] text-black font-semibold px-5 py-2 rounded-lg shadow hover:brightness-95 disabled:opacity-60"
                style={{ boxShadow: "0 8px 30px rgba(10,255,157,0.06)" }}
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin text-black" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : null}
                <span>{loading ? "Creating..." : "Create Report"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setIncidentType("");
                  setSeverity("Medium");
                  setLocation("");
                  setUseGeo(false);
                  setLatitude("");
                  setLongitude("");
                  setAdditionalNotes("");
                  setError(null);
                  setInfo(null);
                }}
                className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800"
              >
                Reset
              </button>
            </div>

            <div className="text-sm text-slate-500">
              <div>Need to attach evidence? Use the report detail page.</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
