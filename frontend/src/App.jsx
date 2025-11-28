


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './Components/Sidebar';
import AuthPage from './Components/AuthPage';
import Profile from './Components/Profile';
import Incidents from './Components/Incidents';
import IncidentDetails from './Components/IncidentDetail';

import SectorAnalysis from './Components/Sector';
import Reports from './Components/Reports';
import ReportCreationDark from './Components/Createreport';

// dashboard + modular KPI components
import Dashboard from './Components/Dashboard';
import ResolutionMetrics from './Components/ResolutionMetrics';
import VelocityMetrics from './Components/Velocity';
import StatusBreakdown from './Components/Status';
import CategoryDistribution from './Components/CategoryDistribution';
import TypeTrends from './Components/Trends';
import MoMGrowth from './Components/MOM';
import GeographicHeatmap from './Components/Map';

import './index.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-grow ml-64 p-8 bg-black">{children}</main>
    </div>
  ) : (
    <Navigate to="/auth" replace />
  );
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/incidents"
          element={
            <PrivateRoute>
              <Incidents />
            </PrivateRoute>
          }
        />

        <Route
          path="/incidents/:id"
          element={
            <PrivateRoute>
              <IncidentDetails />
            </PrivateRoute>
          }
        />


        <Route
          path="/sector"
          element={
            <PrivateRoute>
              <SectorAnalysis />
            </PrivateRoute>
          }
        />

        {/* KPI pages */}
        <Route
          path="/resolution"
          element={
            <PrivateRoute>
              <ResolutionMetrics />
            </PrivateRoute>
          }
        />

        <Route
          path="/velocity"
          element={
            <PrivateRoute>
              <VelocityMetrics />
            </PrivateRoute>
          }
        />

        <Route
          path="/status"
          element={
            <PrivateRoute>
              <StatusBreakdown />
            </PrivateRoute>
          }
        />

        <Route
          path="/trends"
          element={
            <PrivateRoute>
              <TypeTrends />
            </PrivateRoute>
          }
        />

        <Route
          path="/mom"
          element={
            <PrivateRoute>
              <MoMGrowth />
            </PrivateRoute>
          }
        />

        <Route
          path="/map"
          element={
            <PrivateRoute>
              <GeographicHeatmap />
            </PrivateRoute>
          }
        />

        <Route
          path="/category"
          element={
            <PrivateRoute>
              <CategoryDistribution />
            </PrivateRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />

        <Route
          path="/reports/create"
          element={
            <PrivateRoute>
              <ReportCreationDark />
            </PrivateRoute>
          }
        />

        {/* Root redirect */}
        <Route
          path="/"
          element={
            localStorage.getItem('token')
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/auth" replace />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
