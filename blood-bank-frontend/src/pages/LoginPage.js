import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor', // Changed from userType to role to match backend schema
    firstName: '', // Added for registration
    lastName: '',  // Added for registration
    contactNumber: '', // Added for registration
    address: { // Added for registration
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    }
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested address object
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Processing...');
    
    const url = isRegister ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
    
    // Prepare data based on whether it's register or login
    let dataToSend;
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        setStatus('Error: Passwords do not match!');
        return;
      }
      dataToSend = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        address: formData.address,
      };
    } else {
      dataToSend = {
        email: formData.email,
        password: formData.password,
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) { // Check if response status is 2xx
        setStatus(isRegister ? 'Registration Successful! Please log in.' : 'Login Successful! Redirecting...');
        if (data.token) {
          // Decode token to get user role and ID
          const decodedUser = JSON.parse(atob(data.token.split('.')[1]));
          onLogin(data.token, { id: decodedUser.user.id, role: decodedUser.user.role });
        }
      } else {
        // Handle API errors (e.g., user already exists, invalid credentials)
        setStatus(`Error: ${data.msg || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('API call error:', error);
      setStatus('Network Error: Could not connect to server.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full transform hover:scale-102 transition-transform duration-300 ease-in-out">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
          {isRegister ? 'Register' : 'Login'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              placeholder="Your Email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              placeholder="Your Password"
              required
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm Password"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Register As</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="donor">Donor</option>
                  <option value="hospital">Hospital</option>
                  <option value="doctor">Doctor</option>
                  {/* Blood Bank Staff and Supervisor would typically be registered by an admin */}
                </select>
              </div>
              {/* Additional registration fields */}
              <div>
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your First Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your Last Name"
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your Contact Number"
                />
              </div>
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">Address (Optional)</h3>
                <div>
                  <label htmlFor="address.street" className="block text-gray-700 text-sm font-bold mb-1">Street</label>
                  <input type="text" id="address.street" name="address.street" value={formData.address.street} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200" placeholder="Street Address" />
                </div>
                <div>
                  <label htmlFor="address.city" className="block text-gray-700 text-sm font-bold mb-1">City</label>
                  <input type="text" id="address.city" name="address.city" value={formData.address.city} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200" placeholder="City" />
                </div>
                <div>
                  <label htmlFor="address.state" className="block text-gray-700 text-sm font-bold mb-1">State</label>
                  <input type="text" id="address.state" name="address.state" value={formData.address.state} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200" placeholder="State" />
                </div>
                <div>
                  <label htmlFor="address.zipCode" className="block text-gray-700 text-sm font-bold mb-1">Zip Code</label>
                  <input type="text" id="address.zipCode" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200" placeholder="Zip Code" />
                </div>
                <div>
                  <label htmlFor="address.country" className="block text-gray-700 text-sm font-bold mb-1">Country</label>
                  <input type="text" id="address.country" name="address.country" value={formData.address.country} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200" placeholder="Country" />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            {status === 'Processing...' ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
          </button>

          {status && status !== 'Processing...' && (
            <p className="mt-4 text-center text-sm font-semibold" style={{ color: status.includes('Error') ? 'red' : 'green' }}>{status}</p>
            )}
          </form>

        <p className="mt-6 text-center text-gray-600">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setStatus(''); // Clear status on toggle
              setFormData(prev => ({ // Reset form data on toggle
                email: '',
                password: '',
                confirmPassword: '',
                role: 'donor',
                firstName: '',
                lastName: '',
                contactNumber: '',
                address: {
                  street: '', city: '', state: '', zipCode: '', country: '',
                }
              }));
            }}
            className="text-red-600 font-semibold hover:underline focus:outline-none"
          >
            {isRegister ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; // <-- THIS IS THE CRUCIAL LINE
