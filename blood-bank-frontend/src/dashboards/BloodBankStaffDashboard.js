import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/DashboardContainer';

const BloodBankStaffDashboard = ({ userId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null); // For managing a specific request
  const [assignedUnitIds, setAssignedUnitIds] = useState(''); // For fulfilling request
  const [actionStatus, setActionStatus] = useState(''); // For status messages after actions

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/blood-requests', {
        headers: { 'x-auth-token': token }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch blood requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching blood requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]); // Re-fetch requests if userId changes

  const handleStatusUpdate = async (requestId, newStatus) => {
    setActionStatus('Updating status...');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/blood-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Failed to update status');
      }

      setActionStatus(`Request status updated to ${newStatus}!`);
      fetchRequests(); // Re-fetch all requests to update the list
    } catch (err) {
      console.error('Error updating status:', err);
      setActionStatus(`Error: ${err.message}`);
    } finally {
      setTimeout(() => setActionStatus(''), 3000);
    }
  };

  const handleFulfillRequest = async (e) => {
    e.preventDefault();
    setActionStatus('Fulfilling request...');
    const token = localStorage.getItem('token');

    if (!selectedRequest || !assignedUnitIds) {
      setActionStatus('Error: Please select a request and provide unit IDs.');
      setTimeout(() => setActionStatus(''), 3000);
      return;
    }

    const unitIdsArray = assignedUnitIds.split(',').map(id => id.trim()).filter(id => id);

    try {
      const response = await fetch(`http://localhost:5000/api/blood-requests/${selectedRequest._id}/fulfill`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ assignedUnitIds: unitIdsArray })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Failed to fulfill request');
      }

      setActionStatus('Request fulfilled successfully!');
      setSelectedRequest(null); // Close modal
      setAssignedUnitIds(''); // Clear input
      fetchRequests(); // Re-fetch all requests
    } catch (err) {
      console.error('Error fulfilling request:', err);
      setActionStatus(`Error: ${err.message}`);
    } finally {
      setTimeout(() => setActionStatus(''), 3000);
    }
  };

  if (loading) return <DashboardContainer title="Blood Bank Staff Dashboard"><p className="text-center">Loading requests...</p></DashboardContainer>;
  if (error) return <DashboardContainer title="Blood Bank Staff Dashboard"><p className="text-center text-red-500">Error: {error}</p></DashboardContainer>;

  return (
    <DashboardContainer title="Blood Bank Staff Dashboard">
      <p className="text-lg text-gray-700 mb-6">Welcome, Blood Bank Staff! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>

      {/* Action Status Message */}
      {actionStatus && (
        <div className={`mb-4 p-3 rounded-lg text-center font-semibold ${actionStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {actionStatus}
        </div>
      )}

      {/* All Blood Requests List */}
      <div className="p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">All Blood Requests</h3>
        {requests.length === 0 ? (
          <p className="text-gray-600">No blood requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Request ID</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Hospital</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Doctor</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Blood Type</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Urgency</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-800">{req._id.slice(-6)}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{req.hospital ? `${req.hospital.firstName} (${req.hospital.email})` : 'N/A'}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{req.doctor ? `${req.doctor.firstName} (${req.doctor.email})` : 'N/A'}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{req.bloodGroup} ({req.componentType})</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{req.quantity}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{req.urgency}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          req.status === 'Fulfilled' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-800 space-x-2">
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600">Approve</button>
                          <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600">Reject</button>
                        </>
                      )}
                      {req.status === 'Approved' && (
                        <button onClick={() => setSelectedRequest(req)} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600">Fulfill</button>
                      )}
                      {/* Optionally add Cancel button for any status before Fulfilled */}
                      {['Pending', 'Approved'].includes(req.status) && (
                         <button onClick={() => handleStatusUpdate(req._id, 'Cancelled')} className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs hover:bg-gray-600">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fulfill Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative transform scale-95 animate-scale-in">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold focus:outline-none"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fulfill Request (ID: {selectedRequest._id.slice(-6)})</h3>
            <p className="mb-2"><strong>Requested:</strong> {selectedRequest.bloodGroup} ({selectedRequest.componentType}) - {selectedRequest.quantity} Units</p>
            <p className="mb-4"><strong>Hospital:</strong> {selectedRequest.hospital?.email}</p>

            <form onSubmit={handleFulfillRequest} className="space-y-4">
              <div>
                <label htmlFor="assignedUnitIds" className="block text-gray-700 text-sm font-bold mb-1">Assigned Blood Unit IDs (comma-separated)</label>
                <textarea
                  id="assignedUnitIds"
                  name="assignedUnitIds"
                  value={assignedUnitIds}
                  onChange={(e) => setAssignedUnitIds(e.target.value)}
                  rows="3"
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                  placeholder="e.g., 65c8a..., 65c8b..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all duration-300">Fulfill Request</button>
            </form>
          </div>
        </div>
      )}
    </DashboardContainer>
  );
};

export default BloodBankStaffDashboard;
