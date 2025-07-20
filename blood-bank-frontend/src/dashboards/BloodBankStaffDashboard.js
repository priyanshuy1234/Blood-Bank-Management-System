import React from 'react';
import DashboardContainer from '../components/DashboardContainer';

const BloodBankStaffDashboard = ({ userId }) => (
  <DashboardContainer title="Blood Bank Staff Dashboard">
    <p className="text-lg text-gray-700">Welcome, Blood Bank Staff! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
    <p className="mt-4 text-gray-600">Manage blood inventory, process incoming and outgoing units, and handle requests.</p>
    {/* Future features: Inventory Management, Process Requests, Donor Management */}
  </DashboardContainer>
);

export default BloodBankStaffDashboard;
