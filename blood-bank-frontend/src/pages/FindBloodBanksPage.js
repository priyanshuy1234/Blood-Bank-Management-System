import React, { useState } from 'react';
import DashboardContainer from '../components/DashboardContainer'; // Reusing for consistent styling

const FindBloodBanksPage = () => {
  // State for general map search
  const [generalSearchLocation, setGeneralSearchLocation] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // IMPORTANT: Read API Key from environment variable
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Handle general map search
  const handleGeneralMapSearch = (e) => {
    e.preventDefault();
    if (!generalSearchLocation) {
      setStatusMessage('Please enter a location to search on the map.');
      return;
    }
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' || GOOGLE_MAPS_API_KEY === '') {
        setStatusMessage('Error: Google Maps API Key is missing or invalid. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file.');
        return;
    }

    setStatusMessage('Loading general map search results...');
    // Construct Google Maps Embed API URL for a search query
    // 'q' parameter is the search query, e.g., "blood banks in New Delhi"
    const query = encodeURIComponent(`blood banks in ${generalSearchLocation}`);
    const embedUrl = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_API_KEY}&q=${query}`;
    setMapEmbedUrl(embedUrl);
    setTimeout(() => setStatusMessage(''), 5000);
  };


  return (
    <DashboardContainer title="Find Blood Banks">
      <p className="text-lg text-gray-700 mb-6">Search for blood banks in any location using Google Maps directly.</p>

      {statusMessage && (
        <div className={`mb-4 p-3 rounded-lg text-center font-semibold ${statusMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {statusMessage}
        </div>
      )}

      {/* General Map Search Section */}
      <div className="p-6 border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Search on Google Maps</h3>
        <p className="text-gray-600 mb-4">Enter a city or specific location to find blood banks globally.</p>
        <form onSubmit={handleGeneralMapSearch} className="space-y-4">
          <div>
            <label htmlFor="generalSearchLocation" className="block text-gray-700 text-sm font-bold mb-1">City or Location</label>
            <input type="text" id="generalSearchLocation" name="generalSearchLocation" value={generalSearchLocation} onChange={(e) => setGeneralSearchLocation(e.target.value)} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" placeholder="e.g., New Delhi" required />
          </div>
          <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105">
            Search on Map
          </button>
        </form>

        {mapEmbedUrl && (
          <div className="mt-8">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Map Results:</h4>
            <div className="relative overflow-hidden rounded-lg shadow-lg" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="General Blood Bank Search Map"
              ></iframe>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              (Note: This map searches Google Maps directly. A valid API key is required for full functionality and to avoid potential rate limits.)
            </p>
          </div>
        )}
      </div>
    </DashboardContainer>
  );
};

export default FindBloodBanksPage;
