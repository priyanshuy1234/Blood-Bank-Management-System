import React from 'react';
import DashboardContainer from '../components/DashboardContainer';

const HospitalDashboard = ({ userId }) => (
  <DashboardContainer title="Hospital Dashboard">
    <p className="text-lg text-gray-700">Welcome, Hospital! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
    <p className="mt-4 text-gray-600">View available blood stock, request specific blood types, and track previous transactions.</p>
    {/* Future features: View Stock, Request Blood, Track Requests */}
  </DashboardContainer>
);

export default HospitalDashboard;
