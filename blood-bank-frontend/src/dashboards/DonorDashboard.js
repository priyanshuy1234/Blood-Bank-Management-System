import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/DashboardContainer';

const DonorDashboard = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' }
  });
  const [updateStatus, setUpdateStatus] = useState('');

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/profile/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token // Send the JWT token in the header
          }
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.msg || 'Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
        setFormData({ // Populate form data with fetched profile
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          contactNumber: data.contactNumber || '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            zipCode: data.address?.zipCode || '',
            country: data.address?.country || '',
          }
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]); // Re-fetch if userId changes (though typically it won't after login)

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Handle profile update submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateStatus('Updating...');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.user); // Update profile state with the new data
      setUpdateStatus('Profile updated successfully!');
      setEditMode(false); // Exit edit mode
    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateStatus(`Error: ${err.message}`);
    } finally {
      setTimeout(() => setUpdateStatus(''), 3000); // Clear status message after 3 seconds
    }
  };


  if (loading) return <DashboardContainer title="Donor Dashboard"><p className="text-center">Loading profile...</p></DashboardContainer>;
  if (error) return <DashboardContainer title="Donor Dashboard"><p className="text-center text-red-500">Error: {error}</p></DashboardContainer>;
  if (!profile) return <DashboardContainer title="Donor Dashboard"><p className="text-center">No profile data found.</p></DashboardContainer>;

  return (
    <DashboardContainer title="Donor Dashboard">
      <p className="text-lg text-gray-700 mb-4">Welcome, Donor! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h3>
        {!editMode ? (
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Contact:</strong> {profile.contactNumber || 'N/A'}</p>
            <p><strong>Address:</strong> {profile.address?.street}, {profile.address?.city}, {profile.address?.state}, {profile.address?.zipCode}, {profile.address?.country || 'N/A'}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-1">First Name</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-1">Last Name</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-gray-700 text-sm font-bold mb-1">Contact Number</label>
              <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {/* Address fields for update */}
            <div className="space-y-2 border p-3 rounded-lg">
              <h4 className="text-md font-semibold text-gray-800">Address</h4>
              <div>
                <label htmlFor="address.street" className="block text-gray-700 text-sm font-bold mb-1">Street</label>
                <input type="text" id="address.street" name="address.street" value={formData.address.street} onChange={handleFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="address.city" className="block text-gray-700 text-sm font-bold mb-1">City</label>
                <input type="text" id="address.city" name="address.city" value={formData.address.city} onChange={handleFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="address.state" className="block text-gray-700 text-sm font-bold mb-1">State</label>
                <input type="text" id="address.state" name="address.state" value={formData.address.state} onChange={handleFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="address.zipCode" className="block text-gray-700 text-sm font-bold mb-1">Zip Code</label>
                <input type="text" id="address.zipCode" name="address.zipCode" value={formData.address.zipCode} onChange={handleFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="address.country" className="block text-gray-700 text-sm font-bold mb-1">Country</label>
                <input type="text" id="address.country" name="address.country" value={formData.address.country} onChange={handleFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
            {updateStatus && (
              <p className={`mt-2 text-sm font-semibold ${updateStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{updateStatus}</p>
            )}
          </form>
        )}
      </div>

      <p className="mt-8 text-gray-600">Here you will find your donation history, upcoming appointments, and eligibility status.</p>
      {/* Future features: Donation History, Schedule Appointment, Eligibility Check */}
    </DashboardContainer>
  );
};

export default DonorDashboard;
