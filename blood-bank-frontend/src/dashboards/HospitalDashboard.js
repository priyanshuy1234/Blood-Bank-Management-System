import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/DashboardContainer';

const HospitalDashboard = ({ userId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRequestFormData, setNewRequestFormData] = useState({
    bloodGroup: 'A+',
    componentType: 'Whole Blood',
    quantity: 1,
    urgency: 'Normal',
    notes: '',
    doctorId: '' // Optional: to associate a doctor
  });
  const [requestStatus, setRequestStatus] = useState('');
  const [doctors, setDoctors] = useState([]); // To populate doctor dropdown

  const fetchHospitalData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }

    try {
      // Fetch requests made by this hospital
      const requestsResponse = await fetch('http://localhost:5000/api/blood-requests/my', {
        headers: { 'x-auth-token': token }
      });
      if (!requestsResponse.ok) {
        const errorData = await requestsResponse.json();
        throw new Error(errorData.msg || 'Failed to fetch requests');
      }
      const requestsData = await requestsResponse.json();
      setRequests(requestsData);

      // Fetch all doctors to populate dropdown (for associating with requests)
      // This route needs to be added to backend server.js if not already.
      // For now, let's assume a public route or a route accessible by hospitals.
      // If not, this part will fail or return empty.
      const doctorsResponse = await fetch('http://localhost:5000/api/users?role=doctor', {
        headers: { 'x-auth-token': token } // Assuming this route is protected
      });
      if (doctorsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData);
      } else {
        console.warn('Could not fetch doctors list. Doctor dropdown might be empty.');
      }

    } catch (err) {
      console.error('Error fetching hospital data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, [userId]);

  const handleNewRequestChange = (e) => {
    const { name, value } = e.target;
    setNewRequestFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setRequestStatus('Creating request...');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/blood-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newRequestFormData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Failed to create request');
      }

      setRequestStatus('Blood request created successfully!');
      setNewRequestFormData({ // Reset form
        bloodGroup: 'A+',
        componentType: 'Whole Blood',
        quantity: 1,
        urgency: 'Normal',
        notes: '',
        doctorId: ''
      });
      fetchHospitalData(); // Re-fetch requests to update list
    } catch (err) {
      console.error('Error creating request:', err);
      setRequestStatus(`Error: ${err.message}`);
    } finally {
      setTimeout(() => setRequestStatus(''), 3000);
    }
  };


  if (loading) return <DashboardContainer title="Hospital Dashboard"><p className="text-center">Loading hospital data...</p></DashboardContainer>;
  if (error) return <DashboardContainer title="Hospital Dashboard"><p className="text-center text-red-500">Error: {error}</p></DashboardContainer>;

  return (
    <DashboardContainer title="Hospital Dashboard">
      <p className="text-lg text-gray-700 mb-6">Welcome, Hospital! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>

      {/* Request Blood Form */}
      <div className="mb-8 p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Blood</h3>
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div>
            <label htmlFor="bloodGroup" className="block text-gray-700 text-sm font-bold mb-1">Blood Group</label>
            <select id="bloodGroup" name="bloodGroup" value={newRequestFormData.bloodGroup} onChange={handleNewRequestChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="componentType" className="block text-gray-700 text-sm font-bold mb-1">Component Type</label>
            <select id="componentType" name="componentType" value={newRequestFormData.componentType} onChange={handleNewRequestChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required>
              {['Whole Blood', 'Red Blood Cells', 'Plasma', 'Platelets', 'Cryoprecipitate'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-1">Quantity (Units)</label>
            <input type="number" id="quantity" name="quantity" value={newRequestFormData.quantity} onChange={handleNewRequestChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" min="1" required />
          </div>
          <div>
            <label htmlFor="urgency" className="block text-gray-700 text-sm font-bold mb-1">Urgency</label>
            <select id="urgency" name="urgency" value={newRequestFormData.urgency} onChange={handleNewRequestChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label htmlFor="doctorId" className="block text-gray-700 text-sm font-bold mb-1">Associate Doctor (Optional)</label>
            <select id="doctorId" name="doctorId" value={newRequestFormData.doctorId} onChange={handleNewRequestChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700">
              <option value="">-- Select Doctor --</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.firstName} {doc.lastName} ({doc.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-1">Notes (Optional)</label>
            <textarea id="notes" name="notes" value={newRequestFormData.notes} onChange={handleNewRequestChange} rows="3" className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"></textarea>
          </div>
          <button type="submit" className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-all duration-300">Submit Request</button>
          {requestStatus && <p className={`mt-2 text-sm font-semibold ${requestStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{requestStatus}</p>}
        </form>
      </div>

      {/* My Requests List */}
      <div className="p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">My Blood Requests</h3>
        {requests.length === 0 ? (
          <p className="text-gray-600">No blood requests made yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Request ID</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Blood Type</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Urgency</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Request Date</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Doctor</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Assigned Units</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-800">{req._id.slice(-6)}</td> {/* Shortened ID for display */}
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
                    <td className="py-2 px-4 text-sm text-gray-800">{new Date(req.requestDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{req.doctor ? `${req.doctor.firstName} ${req.doctor.lastName}` : 'N/A'}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      {req.assignedUnits && req.assignedUnits.length > 0
                        ? req.assignedUnits.map(unit => unit.unitId).join(', ')
                        : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardContainer>
  );
};

export default HospitalDashboard;
