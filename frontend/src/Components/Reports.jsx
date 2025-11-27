import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  FileText, 
  FileSpreadsheet,
  FilePlus, 
  BarChart2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReportsList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    incidentType: '',
    threatLevel: '',
  });
  const [loading, setLoading] = useState(false);
  const [incidentCount, setIncidentCount] = useState(0);

  
  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: 9,
          search: filters.search,
          incidentType: filters.incidentType,
          threatLevel: filters.threatLevel,
        }
      });

      setReports(response.data.reports);
      setFilteredReports(response.data.reports);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalReports: response.data.totalReports
      });
    } catch (error) {
      toast.error('Failed to fetch reports');
      console.error('Error fetching reports:', error);
    }
    setLoading(false);
  };

  
  const fetchIncidentCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/incidents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidentCount(response.data.totalIncidents);
    } catch (error) {
      toast.error('Failed to fetch incident count');
      console.error('Error fetching incidents:', error);
    }
  };

  
  useEffect(() => {
    fetchReports();
    fetchIncidentCount();
  }, [
    filters.search, 
    filters.incidentType, 
    filters.threatLevel
  ]);

  
  const downloadReports = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports/export', {
        headers: { Authorization: `Bearer ${token}` },
        params: { format },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `reports.${format}`;
      link.click();
      
      toast.success(`Reports downloaded in ${format.toUpperCase()} format`);
    } catch (error) {
      toast.error('Failed to download reports');
      console.error('Download error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <ToastContainer theme="dark" />
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-300">
              Incident Reports
            </h1>
            <p className="text-green-600">
              Total Reports: {pagination.totalReports}
            </p>
          </div>
          <div className="flex space-x-4">
            <button 
              className="bg-green-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-600 transition"
              onClick={() => navigate('/create-report')}
            >
              <FilePlus className="mr-2" /> New Report
            </button>
            <button 
              className="bg-gray-800 text-green-400 px-4 py-2 rounded-md flex items-center hover:bg-gray-700 transition"
              onClick={() => navigate('/incidents')}
            >
              <BarChart2 className="mr-2" /> 
              Incidents 
              <span className="ml-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs">
                {incidentCount}
              </span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search Input */}
          <div className="relative">
            <input 
              type="text"
              placeholder="Search reports..."
              className="w-full p-3 bg-gray-900 text-green-300 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <Search className="absolute right-3 top-4 text-green-500" />
          </div>

          {/* Incident Type Filter */}
          <select 
            className="p-3 bg-gray-900 text-green-300 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filters.incidentType}
            onChange={(e) => setFilters({...filters, incidentType: e.target.value})}
          >
            <option value="" className="bg-black">All Incident Types</option>
            <option value="Security Breach" className="bg-black">Security Breach</option>
            <option value="Equipment Damage" className="bg-black">Equipment Damage</option>
            <option value="Network Intrusion" className="bg-black">Network Intrusion</option>
          </select>

          {/* Threat Level Filter */}
          <select 
            className="p-3 bg-gray-900 text-green-300 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filters.threatLevel}
            onChange={(e) => setFilters({...filters, threatLevel: e.target.value})}
          >
            <option value="" className="bg-black">All Threat Levels</option>
            <option value="High" className="bg-black">High</option>
            <option value="Medium" className="bg-black">Medium</option>
            <option value="Low" className="bg-black">Low</option>
          </select>
        </div>

        {/* Download Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => downloadReports('pdf')}
            className="flex items-center bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            <FileText className="mr-2" /> Download PDF
          </button>
          <button
            onClick={() => downloadReports('csv')}
            className="flex items-center bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <FileSpreadsheet className="mr-2" /> Download CSV
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-green-400 py-10">
            Loading reports...
          </div>
        )}

        {/* Reports Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div 
                key={report._id}
                className={`
                  bg-gray-900 border border-green-700 rounded-lg p-6 
                  transform transition duration-300 hover:scale-105 hover:shadow-2xl
                  cursor-pointer
                `}
                onClick={() => navigate(`/reports/${report._id}`)}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-green-400">
                    {report.Report_ID || report._id}
                  </span>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${report.Threat_Level === 'High' ? 'bg-red-600' : 
                      report.Threat_Level === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'}
                    text-white
                  `}>
                    {report.Threat_Level}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-green-300 mb-2">
                  {report.Incident_Type}
                </h3>
                <p className="text-green-500 mb-4 truncate">
                  {report.Description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600">{report.Location}</span>
                  <span className="text-green-600">
                    {new Date(report.Date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsList;

