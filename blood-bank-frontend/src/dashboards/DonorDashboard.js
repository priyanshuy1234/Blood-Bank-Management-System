import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/DashboardContainer';

const DonorDashboard = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // For basic profile edit
  const [eligibilityMode, setEligibilityMode] = useState(false); // For eligibility questionnaire
  const [appointmentMode, setAppointmentMode] = useState(false); // For appointment booking
  const [profileFormData, setProfileFormData] = useState({ // For basic profile
    firstName: '',
    lastName: '',
    contactNumber: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' }
  });
  const [eligibilityFormData, setEligibilityFormData] = useState({ // For eligibility
    bloodType: '',
    lastDonationDate: '',
    medicalHistory: {
      hasChronicIllness: false,
      recentTravelToRiskArea: false,
      recentSurgery: false,
      onMedication: false,
      notes: ''
    }
  });
  const [newAppointmentFormData, setNewAppointmentFormData] = useState({ // For new appointment
    bloodBankId: '',
    appointmentDate: '',
    bloodGroup: '', // Prefill from profile if available
    notes: ''
  });
  const [appointments, setAppointments] = useState([]); // List of donor's appointments
  const [bloodBanks, setBloodBanks] = useState([]); // List of blood banks for dropdown

  const [updateStatus, setUpdateStatus] = useState(''); // For profile updates
  const [eligibilityStatusMessage, setEligibilityStatusMessage] = useState(''); // For eligibility updates
  const [appointmentStatusMessage, setAppointmentStatusMessage] = useState(''); // For appointment updates


  // Fetch all donor-related data on component mount
  useEffect(() => {
    const fetchDonorData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        // Fetch User Profile
        const profileResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/profile/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });
        if (!profileResponse.ok) {
          const errData = await profileResponse.json();
          throw new Error(errData.msg || 'Failed to fetch profile');
        }
        const profileData = await profileResponse.json();
        setProfile(profileData);
        setProfileFormData({ // Populate basic profile form
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          contactNumber: profileData.contactNumber || '',
          address: {
            street: profileData.address?.street || '',
            city: profileData.address?.city || '',
            state: profileData.address?.state || '',
            zipCode: profileData.address?.zipCode || '',
            country: profileData.address?.country || '',
          }
        });
        setEligibilityFormData({ // Populate eligibility form
          bloodType: profileData.bloodType || '',
          lastDonationDate: profileData.lastDonationDate ? new Date(profileData.lastDonationDate).toISOString().split('T')[0] : '',
          medicalHistory: {
            hasChronicIllness: profileData.medicalHistory?.hasChronicIllness || false,
            recentTravelToRiskArea: profileData.medicalHistory?.recentTravelToRiskArea || false,
            recentSurgery: profileData.medicalHistory?.recentSurgery || false,
            onMedication: profileData.medicalHistory?.onMedication || false,
            notes: profileData.medicalHistory?.notes || ''
          }
        });
        setNewAppointmentFormData(prev => ({ ...prev, bloodGroup: profileData.bloodType || '' })); // Prefill blood group for appointment

        // Fetch Donor's Appointments
        const appointmentsResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/appointments/my', {
            headers: { 'x-auth-token': token }
        });
        if (!appointmentsResponse.ok) {
            const errData = await appointmentsResponse.json();
            throw new Error(errData.msg || 'Failed to fetch appointments');
        }
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);

        // Fetch Blood Banks for dropdown
        const banksResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/blood-banks');
        if (!banksResponse.ok) {
            throw new Error('Failed to fetch blood banks');
        }
        const banksData = await banksResponse.json();
        setBloodBanks(banksData);
        if (banksData.length > 0) {
          setNewAppointmentFormData(prev => ({ ...prev, bloodBankId: banksData[0]._id })); // Set default blood bank for new appointment
        }

      } catch (err) {
        console.error('Error fetching donor data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [userId]);

  // Handle basic profile form field changes
  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileFormData(prevState => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Handle basic profile update submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateStatus('Updating profile...');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://blood-link-backend-02gi.onrender.com/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(profileFormData)
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

  // Handle eligibility form field changes
  const handleEligibilityFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('medicalHistory.')) {
      const medicalField = name.split('.')[1];
      setEligibilityFormData(prevState => ({
        ...prevState,
        medicalHistory: {
          ...prevState.medicalHistory,
          [medicalField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setEligibilityFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Handle eligibility submission
  const handleSubmitEligibility = async (e) => {
    e.preventDefault();
    setEligibilityStatusMessage('Submitting eligibility...');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://blood-link-backend-02gi.onrender.com/api/profile/eligibility', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(eligibilityFormData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Failed to submit eligibility');
      }

      const data = await response.json();
      setProfile(data.user); // Update profile with new eligibility status
      setEligibilityStatusMessage('Eligibility submitted successfully!');
      setEligibilityMode(false); // Exit eligibility mode
    } catch (err) {
      console.error('Error submitting eligibility:', err);
      setEligibilityStatusMessage(`Error: ${err.message}`);
    } finally {
      setTimeout(() => setEligibilityStatusMessage(''), 3000);
    }
  };

  // Handle new appointment form changes
  const handleNewAppointmentChange = (e) => {
    const { name, value } = e.target;
    setNewAppointmentFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle new appointment submission
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setAppointmentStatusMessage('Booking appointment...');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://blood-link-backend-02gi.onrender.com/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          bloodBank: newAppointmentFormData.bloodBankId,
          appointmentDate: newAppointmentFormData.appointmentDate,
          bloodGroup: newAppointmentFormData.bloodGroup,
          notes: newAppointmentFormData.notes
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Failed to book appointment');
      }

      setAppointmentStatusMessage('Appointment booked successfully!');
      setNewAppointmentFormData({ // Reset form
        bloodBankId: bloodBanks.length > 0 ? bloodBanks[0]._id : '',
        appointmentDate: '',
        bloodGroup: profile?.bloodType || '',
        notes: ''
      });
      // Re-fetch all donor data to update appointments list
      const updatedAppointmentsResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/appointments/my', {
        headers: { 'x-auth-token': token }
      });
      const updatedAppointmentsData = await updatedAppointmentsResponse.json();
      setAppointments(updatedAppointmentsData);

    } catch (err) {
      console.error('Error booking appointment:', err);
      setAppointmentStatusMessage(`Error: ${err.message}`);
    } finally {
      setTimeout(() => setAppointmentStatusMessage(''), 3000);
    }
  };

  // Handle cancelling an appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointmentStatusMessage('Cancelling appointment...');
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`https://blood-link-backend-02gi.onrender.com/api/appointments/${appointmentId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ status: 'Cancelled' })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.msg || 'Failed to cancel appointment');
        }

        setAppointmentStatusMessage('Appointment cancelled successfully!');
        // Re-fetch all donor data to update appointments list
        const updatedAppointmentsResponse = await fetch('https://blood-link-backend-02gi.onrender.com/api/appointments/my', {
            headers: { 'x-auth-token': token }
        });
        const updatedAppointmentsData = await updatedAppointmentsResponse.json();
        setAppointments(updatedAppointmentsData);
      } catch (err) {
        console.error('Error cancelling appointment:', err);
        setAppointmentStatusMessage(`Error: ${err.message}`);
      } finally {
        setTimeout(() => setAppointmentStatusMessage(''), 3000);
      }
    }
  };


  if (loading) return <DashboardContainer title="Donor Dashboard"><p className="text-center">Loading profile...</p></DashboardContainer>;
  if (error) return <DashboardContainer title="Donor Dashboard"><p className="text-center text-red-500">Error: {error}</p></DashboardContainer>;
  if (!profile) return <DashboardContainer title="Donor Dashboard"><p className="text-center">No profile data found.</p></DashboardContainer>;

  return (
    <DashboardContainer title="Donor Dashboard">
      <p className="text-lg text-gray-700 mb-4">Welcome, Donor! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>

      {/* Basic Profile Section */}
      <div className="mb-8 p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Basic Profile</h3>
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
              <input type="text" id="firstName" name="firstName" value={profileFormData.firstName} onChange={handleProfileFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-1">Last Name</label>
              <input type="text" id="lastName" name="lastName" value={profileFormData.lastName} onChange={handleProfileFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-gray-700 text-sm font-bold mb-1">Contact Number</label>
              <input type="text" id="contactNumber" name="contactNumber" value={profileFormData.contactNumber} onChange={handleProfileFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {/* Address fields for update */}
            <div className="space-y-2 border p-3 rounded-lg">
              <h4 className="text-md font-semibold text-gray-800">Address</h4>
              <div>
                <label htmlFor="address.street" className="block text-gray-700 text-sm font-bold mb-1">Street</label>
                <input type="text" id="address.street" name="address.street" value={profileFormData.address.street} onChange={handleProfileFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="address.city" className="block text-gray-700 text-sm font-bold mb-1">City</label>
                <input type="text" id="address.city" name="address.city" value={profileFormData.address.city} onChange={handleProfileFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="address.state" className="block text-gray-700 text-sm font-bold mb-1">State</label>
                <input type="text" id="address.state" name="address.state" value={profileFormData.address.state} onChange={handleProfileFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="address.zipCode" className="block text-gray-700 text-sm font-bold mb-1">Zip Code</label>
                <input type="text" id="address.zipCode" name="address.zipCode" value={profileFormData.address.zipCode} onChange={handleProfileFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="address.country" className="block text-gray-700 text-sm font-bold mb-1">Country</label>
                <input type="text" id="address.country" name="address.country" value={profileFormData.address.country} onChange={handleProfileFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

      {/* Donor Eligibility Section */}
      <div className="mb-6 p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Donor Eligibility Status</h3>
        <div className="space-y-2 text-gray-700 mb-4">
          <p><strong>Blood Type:</strong> {profile.bloodType || 'Not Set'}</p>
          <p><strong>Last Donation Date:</strong> {profile.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : 'Never'}</p>
          <p>
            <strong>Eligibility:</strong>{' '}
            <span className={`px-2 py-1 rounded-full text-sm font-semibold
              ${profile.eligibilityStatus === 'Eligible' ? 'bg-green-100 text-green-800' :
                profile.eligibilityStatus === 'Deferred' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'}`}>
              {profile.eligibilityStatus}
            </span>
          </p>
          {profile.eligibilityStatus === 'Deferred' && profile.medicalHistory?.notes && (
            <p className="text-sm text-red-600">Reason for deferral: {profile.medicalHistory.notes}</p>
          )}
        </div>
        {!eligibilityMode ? (
          <button
            onClick={() => setEligibilityMode(true)}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {profile.eligibilityStatus === 'Unknown' ? 'Complete Eligibility Questionnaire' : 'Update Eligibility'}
          </button>
        ) : (
          <form onSubmit={handleSubmitEligibility} className="space-y-4 mt-4">
            <div>
              <label htmlFor="bloodType" className="block text-gray-700 text-sm font-bold mb-1">Your Blood Type</label>
              <select id="bloodType" name="bloodType" value={eligibilityFormData.bloodType} onChange={handleEligibilityFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required>
                <option value="">Select Blood Type</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="lastDonationDate" className="block text-gray-700 text-sm font-bold mb-1">Last Donation Date (Optional)</label>
              <input type="date" id="lastDonationDate" name="lastDonationDate" value={eligibilityFormData.lastDonationDate} onChange={handleEligibilityFormChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="space-y-2 border p-3 rounded-lg">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Medical History Questions</h4>
              <div className="flex items-center">
                <input type="checkbox" id="hasChronicIllness" name="medicalHistory.hasChronicIllness" checked={eligibilityFormData.medicalHistory.hasChronicIllness} onChange={handleEligibilityFormChange} className="mr-2" />
                <label htmlFor="hasChronicIllness" className="text-gray-700 text-sm">Do you have any chronic illnesses?</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="recentTravelToRiskArea" name="medicalHistory.recentTravelToRiskArea" checked={eligibilityFormData.medicalHistory.recentTravelToRiskArea} onChange={handleEligibilityFormChange} className="mr-2" />
                <label htmlFor="recentTravelToRiskArea" className="text-gray-700 text-sm">Have you traveled to a risk area recently?</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="recentSurgery" name="medicalHistory.recentSurgery" checked={eligibilityFormData.medicalHistory.recentSurgery} onChange={handleEligibilityFormChange} className="mr-2" />
                <label htmlFor="recentSurgery" className="text-gray-700 text-sm">Have you had a major surgery recently?</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="onMedication" name="medicalHistory.onMedication" checked={eligibilityFormData.medicalHistory.onMedication} onChange={handleEligibilityFormChange} className="mr-2" />
                <label htmlFor="onMedication" className="text-gray-700 text-sm">Are you currently on any medication?</label>
              </div>
              <div>
                <label htmlFor="medicalNotes" className="block text-gray-700 text-sm font-bold mb-1">Additional Notes (e.g., reason for deferral)</label>
                <textarea id="medicalNotes" name="medicalHistory.notes" value={eligibilityFormData.medicalHistory.notes} onChange={handleEligibilityFormChange} rows="2" className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"></textarea>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Save Eligibility
              </button>
              <button
                type="button"
                onClick={() => setEligibilityMode(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
            {eligibilityStatusMessage && (
              <p className={`mt-2 text-sm font-semibold ${eligibilityStatusMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{eligibilityStatusMessage}</p>
            )}
          </form>
        )}
      </div>

      {/* Appointment Section */}
      <div className="p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">My Appointments</h3>
        {appointmentStatusMessage && (
          <div className={`mb-4 p-3 rounded-lg text-center font-semibold ${appointmentStatusMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {appointmentStatusMessage}
          </div>
        )}
        {!appointmentMode ? (
          <>
            <button
              onClick={() => setAppointmentMode(true)}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 mb-4"
            >
              Book New Appointment
            </button>

            {appointments.length === 0 ? (
              <p className="text-gray-600">No appointments booked yet.</p>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Blood Bank</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Blood Group</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(app => (
                      <tr key={app._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
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
                        <td className="py-2 px-4 text-sm text-gray-800">
                          {app.status === 'Scheduled' && (
                            <button onClick={() => handleCancelAppointment(app._id)} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600">Cancel</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleBookAppointment} className="space-y-4 mt-4">
            <div>
              <label htmlFor="appointmentBloodBank" className="block text-gray-700 text-sm font-bold mb-1">Select Blood Bank</label>
              <select id="appointmentBloodBank" name="bloodBankId" value={newAppointmentFormData.bloodBankId} onChange={handleNewAppointmentChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required>
                {bloodBanks.length > 0 ? (
                  bloodBanks.map(bank => (
                    <option key={bank._id} value={bank._id}>{bank.name} ({bank.address.city})</option>
                  ))
                ) : (
                  <option value="">No Blood Banks Available</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="appointmentDate" className="block text-gray-700 text-sm font-bold mb-1">Appointment Date & Time</label>
              <input type="datetime-local" id="appointmentDate" name="appointmentDate" value={newAppointmentFormData.appointmentDate} onChange={handleNewAppointmentChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required />
            </div>
            <div>
              <label htmlFor="appointmentBloodGroup" className="block text-gray-700 text-sm font-bold mb-1">Blood Group (Optional)</label>
              <select id="appointmentBloodGroup" name="bloodGroup" value={newAppointmentFormData.bloodGroup} onChange={handleNewAppointmentChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700">
                <option value="">Not Specified</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="appointmentNotes" className="block text-gray-700 text-sm font-bold mb-1">Notes (Optional)</label>
              <textarea id="appointmentNotes" name="notes" value={newAppointmentFormData.notes} onChange={handleNewAppointmentChange} rows="2" className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"></textarea>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={() => setAppointmentMode(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardContainer>
  );
};

export default DonorDashboard;
