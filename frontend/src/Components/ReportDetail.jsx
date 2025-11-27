import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';

const ReportsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Fetch report details (replace with actual API call)
    const mockReport = {
      id: 'RPT-1001',
      incidentType: 'Security Breach',
      location: 'Main Office',
      threatLevel: 'High',
      status: 'Under Investigation',
      description: 'Unauthorized access detected in server room',
      date: '2024-03-15',
      reporter: 'John Doe',
      additionalDetails: 'Surveillance cameras were bypassed. No physical damage detected.'
    };
    setReport(mockReport);
  }, [id]);

  if (!report) return <div className="bg-black text-green-400 min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="container mx-auto max-w-2xl">
        <div className={`
          bg-gray-900 border border-green-700 rounded-lg p-8
          transform transition duration-300 hover:scale-105 hover:shadow-2xl
        `}>
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => navigate('/reports')}
              className="text-green-500 hover:text-green-300 flex items-center"
            >
              <ArrowLeft className="mr-2" /> Back to Reports
            </button>
            <h1 className="text-3xl font-bold text-green-300">{report.id}</h1>
            <span className={`
              px-4 py-2 rounded-full text-sm font-bold
              ${report.status === 'Under Investigation' ? 'bg-yellow-600' : 
                report.status === 'Closed' ? 'bg-green-600' : 'bg-red-600'}
              text-white
            `}>
              {report.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-green-500 block mb-2">Incident Type</label>
              <p className="text-green-300 font-semibold">{report.incidentType}</p>
            </div>
            <div>
              <label className="text-green-500 block mb-2">Location</label>
              <p className="text-green-300 font-semibold">{report.location}</p>
            </div>
            <div>
              <label className="text-green-500 block mb-2">Threat Level</label>
              <p className={`
                font-bold
                ${report.threatLevel === 'High' ? 'text-red-500' : 
                  report.threatLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'}
              `}>
                {report.threatLevel}
              </p>
            </div>
            <div>
              <label className="text-green-500 block mb-2">Reported By</label>
              <p className="text-green-300 font-semibold">{report.reporter}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-green-500 block mb-2">Description</label>
            <p className="text-green-400 bg-gray-800 p-4 rounded">
              {report.description}
            </p>
          </div>

          <div>
            <label className="text-green-500 block mb-2">Additional Details</label>
            <p className="text-green-400 bg-gray-800 p-4 rounded">
              {report.additionalDetails}
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600 transition flex items-center"
              onClick={() => {/* Add edit functionality */}}
            >
              <Edit className="mr-2" /> Edit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDetail;