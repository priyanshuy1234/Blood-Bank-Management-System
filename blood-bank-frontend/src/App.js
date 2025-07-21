import React, { useState, useEffect } from 'react';

// --- Import Reusable Components ---
import NavItem from './components/NavItem';
import DashboardContainer from './components/DashboardContainer';

// --- Import Public Page Components ---
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import LoginPage from './pages/LoginPage';
import FindBloodBanksPage from './pages/FindBloodBanksPage';

// --- Import Dashboard Components ---
import DonorDashboard from './dashboards/DonorDashboard';
import HospitalDashboard from './dashboards/HospitalDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import BloodBankStaffDashboard from './dashboards/BloodBankStaffDashboard';
import SupervisorDashboard from './dashboards/SupervisorDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

// NEW: Import Chatbot component
import Chatbot from './components/Chatbot';


// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // Stores { id, role }

  // Function to handle page navigation
  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false); // Close menu on navigation
  };

  // Effect to manage body overflow when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Effect to check for token in localStorage on app load and decode it
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload && payload.user && payload.user.id && payload.user.role) {
          setToken(storedToken);
          setUser({ id: payload.user.id, role: payload.user.role });
          if (!['home', 'about', 'contact', 'gallery', 'login', 'find-blood-banks'].includes(currentPage)) {
              navigateTo(payload.user.role + '_dashboard');
          }
        } else {
          console.error("Invalid token structure in localStorage.");
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to decode or parse token from localStorage:", e);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
  }, [currentPage]);

  // Function to handle user login (passed to LoginPage)
  const handleLogin = (jwtToken, userData) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    navigateTo(userData.role + '_dashboard');
    console.log('Logged in successfully, token stored. User role:', userData.role);
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigateTo('home');
    console.log('User logged out.');
  };

  // Conditional rendering for pages based on current page and user role
  const renderPage = () => {
    if (currentPage === 'login' && token) {
      return user ? renderDashboard(user.role) : <HomePage navigateTo={navigateTo} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'find-blood-banks':
        return <FindBloodBanksPage />;
      default:
        if (token && user) {
          return renderDashboard(user.role);
        }
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  // Helper function to render the correct dashboard component
  const renderDashboard = (role) => {
    switch (role) {
      case 'donor':
        return <DonorDashboard userId={user.id} />;
      case 'hospital':
        return <HospitalDashboard userId={user.id} />;
      case 'doctor':
        return <DoctorDashboard userId={user.id} />;
      case 'bloodbank_staff':
        return <BloodBankStaffDashboard userId={user.id} />;
      case 'supervisor':
        return <SupervisorDashboard userId={user.id} />;
      case 'admin':
        return <AdminDashboard userId={user.id} />;
      default:
        return <p className="text-center text-xl mt-20">Unknown User Role. Please contact support.</p>;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800 antialiased">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg rounded-b-xl px-4 py-3 md:px-8 transition-all duration-300 ease-in-out">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-4xl">🩸</span>
            <span className="text-xl font-bold text-red-600">BloodLink</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavItem onClick={() => navigateTo('home')} isActive={currentPage === 'home'}>Home</NavItem>
            <NavItem onClick={() => navigateTo('about')} isActive={currentPage === 'about'}>About Us</NavItem>
            <NavItem onClick={() => navigateTo('gallery')} isActive={currentPage === 'gallery'}>Gallery</NavItem>
            <NavItem onClick={() => navigateTo('contact')} isActive={currentPage === 'contact'}>Contact Us</NavItem>
            <NavItem onClick={() => navigateTo('find-blood-banks')} isActive={currentPage === 'find-blood-banks'}>Find Blood Banks</NavItem>
            {token ? (
              <>
                <NavItem onClick={() => navigateTo(user.role + '_dashboard')} isActive={currentPage.includes('_dashboard')}>
                  {user ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard` : 'Dashboard'}
                </NavItem>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white bg-opacity-95 flex flex-col items-center justify-center space-y-8 md:hidden animate-fade-in">
          <NavItem onClick={() => navigateTo('home')} isActive={currentPage === 'home'}>Home</NavItem>
          <NavItem onClick={() => navigateTo('about')} isActive={currentPage === 'about'}>About Us</NavItem>
          <NavItem onClick={() => navigateTo('gallery')} isActive={currentPage === 'gallery'}>Gallery</NavItem>
          <NavItem onClick={() => navigateTo('contact')} isActive={() => navigateTo('contact')}>Contact Us</NavItem>
          <NavItem onClick={() => navigateTo('find-blood-banks')} isActive={currentPage === 'find-blood-banks'}>Find Blood Banks</NavItem>
          {token ? (
            <>
              <NavItem onClick={() => navigateTo(user.role + '_dashboard')} isActive={currentPage.includes('_dashboard')}>
                {user ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard` : 'Dashboard'}
              </NavItem>
              <button
                onClick={handleLogout}
                className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Login / Register
            </button>
          )}
        </div>
      )}

      {/* Page Content */}
      <main className="pt-20 pb-16">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 rounded-t-xl px-4 md:px-8">
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
            <a href="#" className="hover:text-red-400 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-red-400 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-red-400 transition-colors duration-200">Sitemap</a>
          </div>
          <p>&copy; {new Date().getFullYear()} BloodLink. All rights reserved.</p>
        </div>
      </footer>

      {/* Chatbot Component */}
      <Chatbot /> {/* Integrated Chatbot */}
    </div>
  );
};


// Tailwind CSS Configuration and Custom Animations (included directly for Canvas)
const tailwindConfig = `
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          inter: ['Inter', 'sans-serif'],
        },
        colors: {
          red: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#EF4444',
            600: '#DC2626',
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
          },
        },
        keyframes: {
          'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { transform: 'translateY(0)' },
          },
          'bounce-in': {
            '0%': { transform: 'scale(0.3)', opacity: '0' },
            '50%': { transform: 'scale(1.05)', opacity: '1' },
            '70%': { transform: 'scale(0.9)' },
            '100%': { transform: 'scale(1)' },
          },
          'rotate-in': {
            '0%': { transform: 'rotate(-90deg) scale(0)', opacity: '0' },
            '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
          },
          // New animation for chatbot pop-up
          'fade-in-up-chat': {
            '0%': { opacity: '0', transform: 'translateY(20px) scale(0.9)' },
            '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          },
        },
        animation: {
          'fade-in': 'fade-in 0.5s ease-out forwards',
          'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
          'bounce-in': 'bounce-in 0.8s ease-out forwards',
          'rotate-in': 'rotate-in 0.6s ease-out forwards',
          'fade-in-up-chat': 'fade-in-up-chat 0.3s ease-out forwards',
        },
      },
    },
  };
</script>
`;

// Inject Tailwind config and font link
const HeadContent = () => {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>
        {`
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        /* Custom scrollbar for a modern look */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #DC2626;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #B91C1C;
        }
        `}
      </style>
      <div dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
    </>
  );
};

// Default export for the main App component
export default function BloodBankApp() {
  return (
    <>
      <HeadContent />
      <App />
    </>
  );
}
