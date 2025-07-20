import React from 'react';
import DashboardContainer from '../components/DashboardContainer';

const DoctorDashboard = ({ userId }) => (
  <DashboardContainer title="Doctor Dashboard">
    <p className="text-lg text-gray-700">Welcome, Doctor! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
    <p className="mt-4 text-gray-600">Access patient-related blood needs, approve/reject requests, and view hospital collaboration.</p>
    {/* Future features: Patient Needs, Approve Requests */}
  </DashboardContainer>
);

export default DoctorDashboard;
