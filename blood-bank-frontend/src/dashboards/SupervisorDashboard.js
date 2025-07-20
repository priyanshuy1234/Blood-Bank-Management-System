import React from 'react';
import DashboardContainer from '../components/DashboardContainer';

const SupervisorDashboard = ({ userId }) => (
  <DashboardContainer title="Supervisor Dashboard">
    <p className="text-lg text-gray-700">Welcome, Supervisor! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
    <p className="mt-4 text-gray-600">Oversee operations, manage charges, and authorize critical actions.</p>
    {/* Future features: System Overview, Charges, Authorizations */}
  </DashboardContainer>
);

export default SupervisorDashboard;
