


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import AuthPage from './Components/AuthPage';
import Profile from './Components/Profile';
import Incidents from './Components/Incidents';

// import MapView from './Components/MapView';
import Timeline from './Components/Timeline';
import SectorAnalysis from './Components/Sector';
import IncidentDetails from './Components/IncidentDetail';
import './index.css';


import Dashboard from './Components/Dashboard'


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-grow ml-64 p-8 bg-black">{children}</main>
    </div>
  ) : (
    <Navigate to="/auth" />
  );
};

function App() {
  return (
    <Router>
      <Routes>
     
        <Route path="/auth" element={<AuthPage />} />

        
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
          path="/timeline"
          element={
            <PrivateRoute>
              <Timeline />
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
         

        
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

    
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;


