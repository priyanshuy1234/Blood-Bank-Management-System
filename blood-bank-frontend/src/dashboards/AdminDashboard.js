import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/DashboardContainer';

const AdminDashboard = ({ userId }) => {
  const [inventorySummary, setInventorySummary] = useState([]);
  const [bloodUnits, setBloodUnits] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]); // To populate the blood bank dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addUnitStatus, setAddUnitStatus] = useState('');
  const [addBankStatus, setAddBankStatus] = useState('');

  // Form data for adding new blood unit
  const [newUnitFormData, setNewUnitFormData] = useState({
    unitId: '',
    bloodGroup: 'A+', // Default
    componentType: 'Whole Blood', // Default
    collectionDate: '',
    expiryDate: '',
    bloodBankId: '', // Will be populated from fetched blood banks
    donorId: ''
  });

  // Form data for adding new blood bank
  const [newBankFormData, setNewBankFormData] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' }
  });

  const fetchInventoryData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }

    try {
      // Fetch Inventory Summary (accessible to all authenticated users)
      const summaryResponse = await fetch('http://localhost:5000/api/blood-units/inventory-summary');
      if (!summaryResponse.ok) {
        throw new Error('Failed to fetch inventory summary');
      }
      const summaryData = await summaryResponse.json();
      setInventorySummary(summaryData);

      // Fetch all Blood Units (requires bloodbank_staff, admin, supervisor role)
      const unitsResponse = await fetch('http://localhost:5000/api/blood-units', {
        headers: { 'x-auth-token': token }
      });
      if (!unitsResponse.ok) {
        const errorData = await unitsResponse.json();
        throw new Error(errorData.msg || 'Failed to fetch blood units');
      }
      const unitsData = await unitsResponse.json();
      setBloodUnits(unitsData);

      // Fetch Blood Banks (accessible to all authenticated users)
      const banksResponse = await fetch('http://localhost:5000/api/blood-banks');
      if (!banksResponse.ok) {
        throw new Error('Failed to fetch blood banks');
      }
      const banksData = await banksResponse.json();
      setBloodBanks(banksData);
      if (banksData.length > 0) {
        setNewUnitFormData(prev => ({ ...prev, bloodBankId: banksData[0]._id })); // Set default blood bank
      }

    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, [userId]); // Re-fetch data if user changes

  // Handle change for new unit form
  const handleNewUnitChange = (e) => {
    const { name, value } = e.target;
    setNewUnitFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle submission for new unit form
  const handleAddBloodUnit = async (e) => {
    e.preventDefault();
    setAddUnitStatus('Adding unit...');
    const token = localStorage.getItem('token');

    try {
      // Basic date validation: ensure expiryDate is after collectionDate
      if (new Date(newUnitFormData.expiryDate) <= new Date(newUnitFormData.collectionDate)) {
        throw new Error('Expiry Date must be after Collection Date.');
      }

      const response = await fetch('http://localhost:5000/api/blood-units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newUnitFormData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Failed to add blood unit');
      }

      setAddUnitStatus('Blood unit added successfully!');
      setNewUnitFormData({ // Reset form
        unitId: '',
        bloodGroup: 'A+',
        componentType: 'Whole Blood',
        collectionDate: '',
        expiryDate: '',
        bloodBankId: bloodBanks.length > 0 ? bloodBanks[0]._id : '',
        donorId: ''
      });
      fetchInventoryData(); // Re-fetch data to update lists
    } catch (err) {
      console.error('Error adding blood unit:', err);
      setAddUnitStatus(`Error: ${err.message}`);
    } finally {
      setTimeout(() => setAddUnitStatus(''), 3000);
    }
  };

  // Handle change for new blood bank form
  const handleNewBankChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setNewBankFormData(prevState => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value
        }
      }));
    } else {
      setNewBankFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle submission for new blood bank form
  const handleAddBloodBank = async (e) => {
    e.preventDefault();
    setAddBankStatus('Adding blood bank...');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/blood-banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newBankFormData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Failed to add blood bank');
      }

      setAddBankStatus('Blood bank added successfully!');
      setNewBankFormData({ // Reset form
        name: '', contactEmail: '', contactPhone: '',
        address: { street: '', city: '', state: '', zipCode: '', country: '' }
      });
      fetchInventoryData(); // Re-fetch data to update lists and dropdowns
    } catch (err) {
      console.error('Error adding blood bank:', err);
      setAddBankStatus(`Error: ${err.message}`);
    } finally {
      setTimeout(() => setAddBankStatus(''), 3000);
    }
  };


  if (loading) return <DashboardContainer title="Admin Dashboard"><p className="text-center">Loading inventory data...</p></DashboardContainer>;
  if (error) return <DashboardContainer title="Admin Dashboard"><p className="text-center text-red-500">Error: {error}</p></DashboardContainer>;


  return (
    <DashboardContainer title="Admin Dashboard">
      <p className="text-lg text-gray-700 mb-6">Welcome, Admin! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
      <p className="mt-4 text-gray-600 mb-8">Full control over user management, system configuration, and comprehensive reporting.</p>

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
      <div className="p-6 border border-gray-200 rounded-xl shadow-md">
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
    </DashboardContainer>
  );
};

export default AdminDashboard;
