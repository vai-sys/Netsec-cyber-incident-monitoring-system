

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateReport = () => {
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    incidentType: '',
    severity: '',
    location: '',
    additionalNotes: ''
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const INCIDENT_TYPES = [
    { value: 'safety', label: 'Safety Incident' },
    { value: 'security', label: 'Security Breach' },
    { value: 'operational', label: 'Operational Issue' },
    { value: 'environmental', label: 'Environmental Concern' },
    { value: 'other', label: 'Other' }
  ];

  const SEVERITY_LEVELS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const apiUrl =  'http://localhost:5000';

      const response = await axios.post(
        `${apiUrl}/api/reports`, 
        reportData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      navigate('/reports', { 
        state: { 
          message: `Report created successfully!`, 
          type: 'success' 
        } 
      });
    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.errors?.[0] || 
        err.message || 
        'Failed to submit report';
      
      setError(errorMessage);
      console.error('Report submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return reportData.title.trim() && 
           reportData.description.trim() && 
           reportData.incidentType && 
           reportData.severity;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Incident Report
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Title
            </label>
            <input
              type="text"
              name="title"
              value={reportData.title}
              onChange={handleInputChange}
              placeholder="Enter report title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Incident Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Type
            </label>
            <select
              name="incidentType"
              value={reportData.incidentType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Incident Type</option>
              {INCIDENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={reportData.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of the incident"
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level
            </label>
            <select
              name="severity"
              value={reportData.severity}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Severity</option>
              {SEVERITY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              name="location"
              value={reportData.location}
              onChange={handleInputChange}
              placeholder="Enter location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Additional Notes (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="additionalNotes"
              value={reportData.additionalNotes}
              onChange={handleInputChange}
              placeholder="Any additional information"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`
                w-full py-3 rounded-md text-white font-semibold transition-all
                ${isFormValid() && !isSubmitting 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? 'Submitting...' : 'Create Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;