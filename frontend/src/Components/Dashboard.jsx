import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Kibana = ({ dashboardId }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`/api/kibana/dashboard`, {
          params: { id: dashboardId },
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard:', err.message);
        setError('Failed to load dashboard');
      }
    };

    fetchDashboard();
  }, [dashboardId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Kibana Dashboard</h1>
      {dashboardData ? (
        <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Kibana;



