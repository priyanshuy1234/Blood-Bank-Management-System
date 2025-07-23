import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/DashboardContainer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AdminDashboard = ({ userId }) => {
  const [inventorySummary, setInventorySummary] = useState([]);
  const [bloodUnits, setBloodUnits] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]); // To populate the blood bank dropdown
  const [requests, setRequests] = useState([]); // State for blood requests
  const [appointments, setAppointments] = useState([]); // State for appointments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addUnitStatus, setAddUnitStatus] = useState('');
  const [addBankStatus, setAddBankStatus] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedUnitsForFulfillment, setSelectedUnitsForFulfillment] = useState([]);

  // Form data for adding new blood unit
  const [newUnitFormData, setNewUnitFormData] = useState({
    unitId: '', bloodGroup: 'A+', componentType: 'Whole Blood', collectionDate: '', expiryDate: '', bloodBankId: '', donorId: ''
  });
  // Form data for adding new blood bank
  const [newBankFormData, setNewBankFormData] = useState({
    name: '', contactEmail: '', contactPhone: '', address: { street: '', city: '', state: '', zipCode: '', country: '' }
  });

  // --- Example Static Data for Charts (These will be replaced by fetched data later if backend analytics are implemented) ---
  // Moved inside the component where they are used
  const bloodGroupChartData = [
    { bloodGroup: 'A+', count: 400 }, { bloodGroup: 'A-', count: 200 }, // Changed 'name' to 'bloodGroup', 'units' to 'count' for consistency with backend
    { bloodGroup: 'B+', count: 300 }, { bloodGroup: 'B-', count: 150 },
    { bloodGroup: 'AB+', count: 100 }, { bloodGroup: 'AB-', count: 50 },
    { bloodGroup: 'O+', count: 500 }, { bloodGroup: 'O-', count: 250 },
  ];
  const requestStatusData = [
    { name: 'Pending', count: 15 },
    { name: 'Approved', count: 8 },
    { name: 'Fulfilled', count: 25 },
    { name: 'Rejected', count: 3 },
    { name: 'Cancelled', count: 2 },
  ];
  const bloodTrendChartData = [ // Renamed from monthlyDonationData for clarity
    { month: 'Jan', added: 30, used: 15 }, { month: 'Feb', added: 45, used: 20 }, // Added 'added' and 'used' for line chart
    { month: 'Mar', added: 60, used: 30 }, { month: 'Apr', added: 50, used: 25 },
    { month: 'May', added: 75, used: 40 }, { month: 'Jun', added: 90, used: 50 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57'];
  // --- End Example Static Data ---


  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }

    try {
      // Fetch Inventory Summary
      const summaryResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/blood-units/inventory-summary');
      if (!summaryResponse.ok) {
        throw new Error('Failed to fetch inventory summary');
      }
      const summaryData = await summaryResponse.json();
      setInventorySummary(summaryData);

      // Fetch all Blood Units
      const unitsResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/blood-units', {
        headers: { 'x-auth-token': token }
      });
      if (!unitsResponse.ok) {
        const errorData = await unitsResponse.json();
        throw new Error(errorData.msg || 'Failed to fetch blood units');
      }
      const unitsData = await unitsResponse.json();
      setBloodUnits(unitsData);
      setSelectedUnitsForFulfillment([]);


      // Fetch Blood Banks
      const banksResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/blood-banks');
      if (!banksResponse.ok) {
        throw new Error('Failed to fetch blood banks');
      }
      const banksData = await banksResponse.json();
      setBloodBanks(banksData);
      if (banksData.length > 0) {
        setNewUnitFormData(prev => ({ ...prev, bloodBankId: banksData[0]._id }));
      }

      // Fetch all Blood Requests
      const requestsResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/blood-requests', {
        headers: { 'x-auth-token': token }
      });
      if (!requestsResponse.ok) {
        const errorData = await requestsResponse.json();
        throw new Error(errorData.msg || 'Failed to fetch blood requests');
      }
      const requestsData = await requestsResponse.json();
      setRequests(requestsData);

      // Fetch all Appointments
      const appointmentsResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/appointments', {
        headers: { 'x-auth-token': token }
      });
      if (!appointmentsResponse.ok) {
        const errorData = await appointmentsResponse.json();
        throw new Error(errorData.msg || 'Failed to fetch appointments');
      }
      const appointmentsData = await appointmentsResponse.json();
      setAppointments(appointmentsData);

      // --- Fetch Analytics Data (uncomment and use if backend routes are functional) ---
      // These lines are commented out because we are using the static data defined above.
      // If you implement the backend analytics routes, you would uncomment these and remove the static data.
      /*
      const bloodGroupChartResponse = await fetch('http://localhost:5000/api/analytics/blood-units-by-group', {
        headers: { 'x-auth-token': token }
      });
      if (bloodGroupChartResponse.ok) {
        const data = await bloodGroupChartResponse.json();
        setBloodGroupChartData(data);
      }

      const requestStatusChartResponse = await fetch('http://localhost:5000/api/analytics/requests-by-status', {
        headers: { 'x-auth-token': token }
      });
      if (requestStatusChartResponse.ok) {
        const data = await requestStatusChartResponse.json();
        setRequestStatusChartData(data);
      }

      const bloodTrendChartResponse = await fetch('http://localhost:5000/api/analytics/blood-units-over-time?period=6months', {
        headers: { 'x-auth-token': token }
      });
      if (bloodTrendChartResponse.ok) {
        const data = await bloodTrendChartResponse.json();
        setBloodTrendChartData(data);
      }
      */


    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userId]);

  // Handle forms (unchanged)
  const handleNewUnitChange = (e) => {
    const { name, value } = e.target;
    setNewUnitFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleAddBloodUnit = async (e) => {
    e.preventDefault();
    setAddUnitStatus('Adding unit...');
    const token = localStorage.getItem('token');
    try {
      if (new Date(newUnitFormData.expiryDate) <= new Date(newUnitFormData.collectionDate)) {
        throw new Error('Expiry Date must be after Collection Date.');
      }
      const response = await fetch('https://blood-link-backend-02gi.onrender.com/api/blood-units', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify(newUnitFormData)
      });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.msg || 'Failed to add blood unit'); }
      setAddUnitStatus('Blood unit added successfully!');
      setNewUnitFormData({ unitId: '', bloodGroup: 'A+', componentType: 'Whole Blood', collectionDate: '', expiryDate: '', bloodBankId: bloodBanks.length > 0 ? bloodBanks[0]._id : '', donorId: '' });
      fetchAdminData();
    } catch (err) { console.error('Error adding blood unit:', err); setAddUnitStatus(`Error: ${err.message}`); } finally { setTimeout(() => setAddUnitStatus(''), 3000); }
  };

  const handleNewBankChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setNewBankFormData(prevState => ({ ...prevState, address: { ...prevState.address, [addressField]: value } }));
    } else {
      setNewBankFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleAddBloodBank = async (e) => {
    e.preventDefault();
    setAddBankStatus('Adding blood bank...');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://blood-link-backend-02gi.onrender.com/api/blood-banks', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify(newBankFormData)
      });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.msg || 'Failed to add blood bank'); }
      setAddBankStatus('Blood bank added successfully!');
      setNewBankFormData({ name: '', contactEmail: '', contactPhone: '', address: { street: '', city: '', state: '', zipCode: '', country: '' } });
      fetchAdminData();
    } catch (err) { console.error('Error adding blood bank:', err); setAddBankStatus(`Error: ${err.message}`); } finally { setTimeout(() => setAddBankStatus(''), 3000); }
  };

  const handleRequestStatusUpdate = async (requestId, newStatus) => {
    setActionStatus('Updating request status...');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://blood-link-backend-02gi.onrender.com/api/blood-requests/${requestId}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.msg || 'Failed to update status'); }
      setActionStatus(`Request status updated to ${newStatus}!`);
      fetchAdminData();
    } catch (err) { console.error('Error updating status:', err); setActionStatus(`Error: ${err.message}`); } finally { setTimeout(() => setActionStatus(''), 3000); }
  };

  const handleFulfillRequest = async (e) => {
    e.preventDefault();
    setActionStatus('Fulfilling request...');
    const token = localStorage.getItem('token');
    if (!selectedRequest || selectedUnitsForFulfillment.length === 0) {
      setActionStatus('Error: Please select a request and at least one unit.'); setTimeout(() => setActionStatus(''), 3000); return;
    }
    try {
      const response = await fetch(`https://blood-link-backend-02gi.onrender.com/api/blood-requests/${selectedRequest._id}/fulfill`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify({ assignedUnitIds: selectedUnitsForFulfillment })
      });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.msg || 'Failed to fulfill request'); }
      setActionStatus('Request fulfilled successfully!');
      setSelectedRequest(null); setSelectedUnitsForFulfillment([]); fetchAdminData();
    } catch (err) { console.error('Error fulfilling request:', err); setActionStatus(`Error: ${err.message}`); } finally { setTimeout(() => setActionStatus(''), 3000); }
  };

  const handleAppointmentStatusUpdate = async (appointmentId, newStatus) => {
    setActionStatus('Updating appointment status...');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://blood-link-backend-02gi.onrender.com/api/appointments/${appointmentId}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.msg || 'Failed to update appointment status'); }
      setActionStatus(`Appointment status updated to ${newStatus}!`);
      fetchAdminData();
    } catch (err) { console.error('Error updating appointment status:', err); setActionStatus(`Error: ${err.message}`); } finally { setTimeout(() => setActionStatus(''), 3000); }
  };


  if (loading) return <DashboardContainer title="Admin Dashboard"><p className="text-center">Loading admin data...</p></DashboardContainer>;
  if (error) return <DashboardContainer title="Admin Dashboard"><p className="text-center text-red-500">Error: {error}</p></DashboardContainer>;


  return (
    <DashboardContainer title="Admin Dashboard">
      <p className="text-lg text-gray-700 mb-6">Welcome, Admin! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
      <p className="mt-4 text-gray-600 mb-8">Full control over user management, system configuration, and comprehensive reporting.</p>

      {/* Action Status Message */}
      {actionStatus && (
        <div className={`mb-4 p-3 rounded-lg text-center font-semibold ${actionStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {actionStatus}
        </div>
      )}

      {/* Analytics and Reporting Section */}
      <div className="mb-8 p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Reports</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blood Group Distribution Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Blood Group Distribution (Available Units)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bloodGroupChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bloodGroup" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Request Status Overview Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Request Status Overview</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Blood Units Trend Over Time Chart */}
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Blood Units Trend (Last 6 Months)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bloodTrendChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="added" stroke="#0088FE" name="Units Added" />
                <Line type="monotone" dataKey="used" stroke="#FF8042" name="Units Used" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* Add Blood Bank Section */}
      <div className="mb-8 p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Add New Blood Bank</h3>
        <form onSubmit={handleAddBloodBank} className="space-y-4">
          <div>
            <label htmlFor="bankName" className="block text-gray-700 text-sm font-bold mb-1">Blood Bank Name</label>
            <input type="text" id="bankName" name="name" value={newBankFormData.name} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required />
          </div>
          <div>
            <label htmlFor="bankEmail" className="block text-gray-700 text-sm font-bold mb-1">Contact Email</label>
            <input type="email" id="bankEmail" name="contactEmail" value={newBankFormData.contactEmail} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required />
          </div>
          <div>
            <label htmlFor="bankPhone" className="block text-gray-700 text-sm font-bold mb-1">Contact Phone</label>
            <input type="text" id="bankPhone" name="contactPhone" value={newBankFormData.contactPhone} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="space-y-2 border p-3 rounded-lg">
            <h4 className="text-md font-semibold text-gray-800">Address</h4>
            <div><label htmlFor="bankAddressStreet" className="block text-gray-700 text-sm font-bold mb-1">Street</label><input type="text" id="bankAddressStreet" name="address.street" value={newBankFormData.address.street} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required /></div>
            <div><label htmlFor="bankAddressCity" className="block text-gray-700 text-sm font-bold mb-1">City</label><input type="text" id="bankAddressCity" name="address.city" value={newBankFormData.address.city} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required /></div>
            <div><label htmlFor="bankAddressState" className="block text-gray-700 text-sm font-bold mb-1">State</label><input type="text" id="address.state" name="address.state" value={newBankFormData.address.state} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required /></div>
            <div><label htmlFor="bankAddressZip" className="block text-gray-700 text-sm font-bold mb-1">Zip Code</label><input type="text" id="address.zipCode" name="address.zipCode" value={newBankFormData.address.zipCode} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required /></div>
            <div><label htmlFor="bankAddressCountry" className="block text-gray-700 text-sm font-bold mb-1">Country</label><input type="text" id="address.country" name="address.country" value={newBankFormData.address.country} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required /></div>
          </div>
          <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:bg-purple-700 transition-all duration-300">Add Blood Bank</button>
          {addBankStatus && <p className={`mt-2 text-sm font-semibold ${addBankStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{addBankStatus}</p>}
        </form>
      </div>

      {/* Current Blood Inventory Summary */}
      <div className="mb-8 p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Current Blood Inventory Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {inventorySummary.map((item, index) => (
            <div key={index} className="bg-red-50 p-4 rounded-lg text-center shadow-sm">
              <p className="text-xl font-bold text-red-700">{item.bloodGroup}</p>
              <p className="text-lg text-gray-800">{item.count} Units</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Blood Unit Form */}
      <div className="mb-8 p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Add New Blood Unit</h3>
        <form onSubmit={handleAddBloodUnit} className="space-y-4">
          <div>
            <label htmlFor="unitId" className="block text-gray-700 text-sm font-bold mb-1">Unit ID</label>
            <input type="text" id="unitId" name="unitId" value={newUnitFormData.unitId} onChange={handleNewUnitChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required />
          </div>
          <div>
            <label htmlFor="bloodGroup" className="block text-gray-700 text-sm font-bold mb-1">Blood Group</label>
            <select id="bloodGroup" name="bloodGroup" value={newUnitFormData.bloodGroup} onChange={handleNewUnitChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="componentType" className="block text-gray-700 text-sm font-bold mb-1">Component Type</label>
            <select id="componentType" name="componentType" value={newUnitFormData.componentType} onChange={handleNewUnitChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required>
              {['Whole Blood', 'Red Blood Cells', 'Plasma', 'Platelets', 'Cryoprecipitate'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="collectionDate" className="block text-gray-700 text-sm font-bold mb-1">Collection Date</label>
            <input type="date" id="collectionDate" name="collectionDate" value={newUnitFormData.collectionDate} onChange={handleNewUnitChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-1">Expiry Date</label>
            <input type="date" id="expiryDate" name="expiryDate" value={newUnitFormData.expiryDate} onChange={handleNewUnitChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required />
          </div>
          <div>
            <label htmlFor="bloodBankId" className="block text-gray-700 text-sm font-bold mb-1">Associated Blood Bank</label>
            <select id="bloodBankId" name="bloodBankId" value={newUnitFormData.bloodBankId} onChange={handleNewUnitChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required>
              {bloodBanks.length > 0 ? (
                bloodBanks.map(bank => (
                  <option key={bank._id} value={bank._id}>{bank.name} ({bank.address.city})</option>
                ))
              ) : (
                <option value="">No Blood Banks Available (Admin needs to add one)</option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="donorId" className="block text-gray-700 text-sm font-bold mb-1">Donor User ID (Optional)</label>
            <input type="text" id="donorId" name="donorId" value={newUnitFormData.donorId} onChange={handleNewUnitChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" placeholder="e.g., 65c8a... or leave empty" />
          </div>
          <button type="submit" className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-all duration-300">Add Unit</button>
          {addUnitStatus && <p className={`mt-2 text-sm font-semibold ${addUnitStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{addUnitStatus}</p>}
        </form>
      </div>

      {/* Detailed Blood Unit List */}
      <div className="mb-8 p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Blood Unit List</h3>
        {bloodUnits.length === 0 ? (
          <p className="text-gray-600">No blood units found. Add some above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Unit ID</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Group</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Component</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Collection Date</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Expiry Date</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Blood Bank</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Donor</th>
                </tr>
              </thead>
              <tbody>
                {bloodUnits.map(unit => (
                  <tr key={unit._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-800">{unit.unitId}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{unit.bloodGroup}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{unit.componentType}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{new Date(unit.collectionDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{new Date(unit.expiryDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${unit.status === 'Available' ? 'bg-green-100 text-green-800' :
                          unit.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' :
                          unit.status === 'Used' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'}`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-800">{unit.bloodBank?.name || 'N/A'}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{unit.donor ? `${unit.donor.firstName} ${unit.donor.lastName}` : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Blood Requests List for Admin */}
      <div className="p-6 border border-gray-200 rounded-xl shadow-md mt-8">
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
                          <button onClick={() => handleRequestStatusUpdate(req._id, 'Approved')} className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600">Approve</button>
                          <button onClick={() => handleRequestStatusUpdate(req._id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600">Reject</button>
                        </>
                      )}
                      {req.status === 'Approved' && (
                        <button onClick={() => {
                          console.log('Fulfill button clicked for request:', req._id); // Debug log
                          setSelectedRequest(req);
                        }} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600">Fulfill</button>
                      )}
                      {/* Optionally add Cancel button for any status before Fulfilled */}
                      {['Pending', 'Approved'].includes(req.status) && (
                         <button onClick={() => handleRequestStatusUpdate(req._id, 'Cancelled')} className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs hover:bg-gray-600">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Appointments List for Admin */}
      <div className="p-6 border border-gray-200 rounded-xl shadow-md mt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">All Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Donor</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Blood Bank</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Blood Group</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-800">{app.donor ? `${app.donor.firstName} (${app.donor.email})` : 'N/A'}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{new Date(app.appointmentDate).toLocaleString()}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{app.bloodBank?.name || 'N/A'}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{app.bloodGroup || 'Not specified'}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${app.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-800 space-x-2">
                      {app.status === 'Scheduled' && (
                        <>
                          <button onClick={() => handleAppointmentStatusUpdate(app._id, 'Completed')} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600">Mark Complete</button>
                          <button onClick={() => handleAppointmentStatusUpdate(app._id, 'Cancelled')} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600">Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fulfill Request Modal (same as BloodBankStaffDashboard) */}
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
                <label htmlFor="assignedUnitIds" className="block text-gray-700 text-sm font-bold mb-1">Select Available Blood Units</label>
                <select
                  id="assignedUnitIds"
                  name="assignedUnitIds"
                  multiple // Allows multiple selections
                  value={selectedUnitsForFulfillment}
                  onChange={(e) => {
                    // Handle multi-select: get all selected options' values
                    const options = [...e.target.options];
                    const values = options.filter(option => option.selected).map(option => option.value);
                    setSelectedUnitsForFulfillment(values);
                  }}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 h-32" // Increased height for multi-select
                  required
                >
                  {bloodUnits // Use bloodUnits from AdminDashboard's state
                    .filter(unit =>
                      unit.status === 'Available' &&
                      unit.bloodGroup === selectedRequest.bloodGroup &&
                      unit.componentType === selectedRequest.componentType
                    )
                    .map(unit => (
                      <option key={unit._id} value={unit._id}>
                        {unit.unitId} ({unit.bloodGroup} {unit.componentType}) - {unit.bloodBank?.name}
                      </option>
                    ))}
                </select>
                {bloodUnits.filter(unit =>
                      unit.status === 'Available' &&
                      unit.bloodGroup === selectedRequest.bloodGroup &&
                      unit.componentType === selectedRequest.componentType
                    ).length === 0 && (
                  <p className="text-sm text-red-500 mt-1">No matching available units found.</p>
                )}
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all duration-300">Fulfill Request</button>
            </form>
          </div>
        </div>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;
