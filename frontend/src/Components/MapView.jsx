import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker 
} from 'react-simple-maps';

// Threat level color mapping with improved palette
const THREAT_COLORS = {
  'Low': '#4CAF50',      // Green
  'Medium': '#FFC107',   // Amber
  'High': '#FF9800',     // Orange
  'Critical': '#F44336'  // Red
};

const MapView = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // Replace with your actual backend endpoint
        const response = await axios.get('/api/incidents');
        setIncidents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const renderIncidentMarkers = () => {
    return incidents.map(incident => {
      // Ensure coordinates are valid
      const coordinates = incident.Coordinates?.coordinates || [0, 0];
      
      return (
        <Marker 
          key={incident._id}
          coordinates={coordinates}
          onMouseEnter={() => setSelectedIncident(incident)}
          onMouseLeave={() => setSelectedIncident(null)}
        >
          <circle 
            r={8} 
            fill={THREAT_COLORS[incident.Threat_Level] || '#999'} 
            stroke="#fff" 
            strokeWidth={2} 
            className="cursor-pointer transition-all hover:scale-125"
          />
        </Marker>
      );
    });
  };

  if (loading) return <div className="text-center p-4">Loading incidents...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="w-full h-[700px] p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Incident Monitoring Dashboard
      </h2>
      
      <div className="flex">
        {/* Incident List */}
        <div className="w-1/4 bg-white shadow-md rounded-lg p-4 mr-4 overflow-y-auto max-h-[600px]">
          <h3 className="font-semibold text-xl mb-3">Incident List</h3>
          {incidents.map(incident => (
            <div 
              key={incident._id} 
              className={`p-2 mb-2 rounded cursor-pointer 
                ${selectedIncident?._id === incident._id ? 'bg-blue-100' : 'hover:bg-gray-100'}
                border-l-4 
                ${incident.Threat_Level === 'Low' ? 'border-green-500' : 
                  incident.Threat_Level === 'Medium' ? 'border-yellow-500' : 
                  incident.Threat_Level === 'High' ? 'border-orange-500' : 
                  'border-red-500'}`}
              onClick={() => setSelectedIncident(incident)}
            >
              <p className="font-bold">{incident.Incident_ID}</p>
              <p className="text-sm text-gray-600">{incident.Location}</p>
              <span className={`text-xs px-2 py-1 rounded 
                ${incident.Threat_Level === 'Low' ? 'bg-green-100 text-green-800' : 
                  incident.Threat_Level === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                  incident.Threat_Level === 'High' ? 'bg-orange-100 text-orange-800' : 
                  'bg-red-100 text-red-800'}`}>
                {incident.Threat_Level}
              </span>
            </div>
          ))}
        </div>

        {/* Map Container */}
        <div className="w-3/4">
          <ComposableMap 
            projection="geoMercator"
            projectionConfig={{
              center: [0, 20],
              scale: 200
            }}
            className="w-full h-[600px]"
          >
            <Geographies geography="/world-110m.json">
              {({ geographies }) => 
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#E0E0E0"
                    stroke="#A0A0A0"
                    strokeWidth={0.5}
                    className="hover:fill-gray-300 transition-colors"
                  />
                ))
              }
            </Geographies>
            
            {renderIncidentMarkers()}
          </ComposableMap>
        </div>
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 
          bg-white shadow-lg p-6 rounded-lg z-10 w-96 border">
          <h3 className="text-xl font-bold mb-3 pb-2 border-b">
            Incident Details
          </h3>
          <div className="space-y-2">
            <p><strong>Incident ID:</strong> {selectedIncident.Incident_ID}</p>
            <p><strong>Platform:</strong> {selectedIncident.Platform}</p>
            <p><strong>Sector:</strong> {selectedIncident.Sector}</p>
            <p><strong>Type:</strong> {selectedIncident.Incident_Type}</p>
            <p><strong>Location:</strong> {selectedIncident.Location}</p>
            <p><strong>Date:</strong> {new Date(selectedIncident.Date).toLocaleDateString()}</p>
            <p><strong>Source:</strong> {selectedIncident.Source}</p>
            <p className="mt-2"><strong>Description:</strong> {selectedIncident.Description}</p>
            <div className="mt-3">
              <span className={`px-3 py-1 rounded text-sm 
                ${selectedIncident.Incident_Solved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {selectedIncident.Incident_Solved ? 'Solved' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;