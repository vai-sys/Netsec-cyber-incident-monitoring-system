// src/pages/CreateReport.jsx
import React from 'react';
import ReportCreationDark from '../components/ReportCreationDark';

export default function CreateReport() {
  return (
    <div className="min-h-screen pl-64"> {/* adjust padding if your layout uses sidebar width */}
      <div className="p-6">
        <ReportCreationDark />
      </div>
    </div>
  );
}
