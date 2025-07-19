import React, { useState, useEffect } from 'react';

// --- Reusable Components (defined first) ---

const NavItem = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`relative text-lg font-medium py-2 group transition-colors duration-300 ease-in-out
      ${isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-500'}
      focus:outline-none`}
  >
    {children}
    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : ''}`}></span>
  </button>
);

const StatCard = ({ value, label, icon }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="text-6xl mb-4 animate-bounce-in">{icon}</div>
    <div className="text-5xl font-extrabold text-red-600 mb-2">{value}</div>
    <p className="text-xl text-gray-700">{label}</p>
  </div>
);

const StepCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="text-5xl mb-6 animate-rotate-in">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, avatarText }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform hover:translate-y-[-5px] transition-transform duration-300 ease-in-out">
    <div className="w-20 h-20 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-3xl font-bold mb-4 border-4 border-red-200">
      {avatarText}
    </div>
    <p className="text-lg italic text-gray-700 mb-4">"{quote}"</p>
    <p className="font-semibold text-gray-800">- {author}</p>
  </div>
);

const TeamMemberCard = ({ name, role, bio, avatarText }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-5xl font-bold mb-4 border-4 border-red-100">
      {avatarText}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
    <p className="text-red-600 font-semibold mb-3">{role}</p>
    <p className="text-gray-600 text-sm">{bio}</p>
  </div>
);

const DashboardContainer = ({ title, children }) => (
  <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in">
    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-12">
      {title}
    </h1>
    <div className="bg-white p-8 rounded-xl shadow-lg">
      {children}
    </div>
  </div>
);


// --- Public Page Components ---

const HomePage = () => (
  <div className="container mx-auto px-4 py-12 md:py-24 text-center">
    <section className="hero-section mb-20 animate-fade-in-up">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
        Donate Blood, <span className="text-red-600">Save Lives</span>.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
        Every drop counts. Join our mission to connect donors with those in need and make a difference in the world.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <button className="px-8 py-4 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          Find a Donation Camp
        </button>
        <button className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 font-bold rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          Request Blood
        </button>
      </div>
    </section>

    <section className="stats-section grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
      <StatCard value="250K+" label="Lives Saved" icon="❤️" />
      <StatCard value="10K+" label="Donors Registered" icon="🤝" />
      <StatCard value="500+" label="Camps Organized" icon="📍" />
    </section>

    <section className="how-it-works-section mb-20">
      <h2 className="text-4xl font-bold text-gray-900 mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StepCard icon="📝" title="Register" description="Sign up as a donor, hospital, or doctor in minutes." />
        <StepCard icon="🗓️" title="Schedule" description="Donors can schedule appointments, hospitals can request blood." />
        <StepCard icon="🩸" title="Donate/Receive" description="Facilitating the vital connection between donors and recipients." />
      </div>
    </section>

    <section className="testimonials-section bg-red-50 rounded-xl p-8 md:p-12 mb-20">
      <h2 className="text-4xl font-bold text-gray-900 mb-12">What Our Community Says</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TestimonialCard
          quote="BloodLink made it incredibly easy to find a nearby blood donation camp. The process was smooth and I felt like I truly made a difference."
          author="Priya Sharma, Donor"
          avatarText="PS"
        />
        <TestimonialCard
          quote="As a hospital, managing blood requests used to be complex. BloodLink's dashboard has streamlined everything, allowing us to serve patients faster."
          author="Dr. Anand Singh, Hospital Admin"
          avatarText="AS"
        />
      </div>
    </section>
  </div>
);

const AboutPage = () => (
  <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in">
    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-12">About <span className="text-red-600">BloodLink</span></h1>

    <section className="mb-16 flex flex-col md:flex-row items-center md:space-x-12">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <img src="https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Our+Mission" alt="Our Mission" className="rounded-xl shadow-lg w-full h-auto object-cover transform hover:scale-102 transition-transform duration-300" />
      </div>
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          At BloodLink, our mission is to create a seamless and efficient ecosystem for blood donation and distribution. We aim to bridge the gap between voluntary blood donors and those in critical need, ensuring timely access to safe blood.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          We are committed to raising awareness about the importance of blood donation, simplifying the donation process, and providing robust tools for blood banks, hospitals, and medical professionals to manage their blood inventory effectively.
        </p>
      </div>
    </section>

    <section className="mb-16 flex flex-col-reverse md:flex-row items-center md:space-x-12">
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          To envision a world where no life is lost due to lack of blood. We strive to be the leading platform for blood management, fostering a community of compassionate donors and efficient healthcare providers.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Through continuous innovation and user-centric design, we aim to set new standards in blood bank operations, making a profound impact on public health globally.
        </p>
      </div>
      <div className="md:w-1/2 mb-8 md:mb-0">
        <img src="https://via.placeholder.com/600x400/6B6BFF/FFFFFF?text=Our+Vision" alt="Our Vision" className="rounded-xl shadow-lg w-full h-auto object-cover transform hover:scale-102 transition-transform duration-300" />
      </div>
    </section>

    <section className="team-section text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-12">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <TeamMemberCard
          name="Jane Doe"
          role="Founder & CEO"
          bio="Visionary leader passionate about healthcare technology."
          avatarText="JD"
        />
        <TeamMemberCard
          name="John Smith"
          role="Lead Developer"
          bio="Crafting robust and scalable solutions for impact."
          avatarText="JS"
        />
        <TeamMemberCard
          name="Emily White"
          role="Community Manager"
          bio="Connecting donors and promoting awareness."
          avatarText="EW"
        />
      </div>
    </section>
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    // Simulate API call
    setTimeout(() => {
      console.log('Form Data:', formData);
      setStatus('Message Sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-12">Get In <span className="text-red-600">Touch</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg transform hover:translate-y-[-5px] transition-transform duration-300 ease-in-out">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Subject of your message"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Your message here..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              {status === 'Sending...' ? 'Sending...' : 'Send Message'}
            </button>
            {status && status !== 'Sending...' && (
              <p className="mt-4 text-center text-green-600 font-semibold">{status}</p>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-red-600 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center transform hover:translate-y-[-5px] transition-transform duration-300 ease-in-out">
          <h2 className="text-3xl font-bold mb-8">Our Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeLineWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <div>
                <p className="font-semibold">Address:</p>
                <p>123 Blood Donor Lane, Lifesaving City, LS 12345</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <div>
                <p className="font-semibold">Phone:</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 4v7a2 2 0 002 2h14a2 2 0 002-2v-7m-18 0h18"></path></svg>
              <div>
                <p className="font-semibold">Email:</p>
                <p>info@bloodlink.org</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const images = [
    { src: "https://via.placeholder.com/600x400/FFD166/FFFFFF?text=Donation+Drive+1", alt: "Donation Drive 1", title: "Community Donation Drive" },
    { src: "https://via.placeholder.com/600x400/06D6A0/FFFFFF?text=Awareness+Event+2", alt: "Awareness Event 2", title: "Blood Awareness Campaign" },
    { src: "https://via.placeholder.com/600x400/118AB2/FFFFFF?text=Volunteer+Work+3", alt: "Volunteer Work 3", title: "Volunteers in Action" },
    { src: "https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Success+Story+4", alt: "Success Story 4", title: "Impactful Donations" },
    { src: "https://via.placeholder.com/600x400/6B6BFF/FFFFFF?text=Camp+Setup+5", alt: "Camp Setup 5", title: "Setting Up a Camp" },
    { src: "https://via.placeholder.com/600x400/FFD166/FFFFFF?text=Donor+Appreciation+6", alt: "Donor Appreciation 6", title: "Appreciating Our Donors" },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-12">Our <span className="text-red-600">Moments</span></h1>
      <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
        A visual journey through our blood donation drives, awareness programs, and the incredible impact of our community. Click on an image to view details.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-102 transition-transform duration-300 ease-in-out group"
            onClick={() => openModal(image)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{image.title}</h3>
              <p className="text-gray-600 text-sm">{image.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={closeModal} // Close modal when clicking outside image
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full relative transform scale-95 animate-scale-in"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
            <p className="text-gray-700">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
};


// LoginPage component updated to handle actual API calls
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


// --- Placeholder Dashboard Components ---
// These will be expanded in later phases

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

const HospitalDashboard = ({ userId }) => (
  <DashboardContainer title="Hospital Dashboard">
    <p className="text-lg text-gray-700">Welcome, Hospital! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
    <p className="mt-4 text-gray-600">View available blood stock, request specific blood types, and track previous transactions.</p>
    {/* Future features: View Stock, Request Blood, Track Requests */}
  </DashboardContainer>
);

const DoctorDashboard = ({ userId }) => (
  <DashboardContainer title="Doctor Dashboard">
    <p className="text-lg text-gray-700">Welcome, Doctor! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
    <p className="mt-4 text-gray-600">Access patient-related blood needs, approve/reject requests, and view hospital collaboration.</p>
    {/* Future features: Patient Needs, Approve Requests */}
  </DashboardContainer>
);

const BloodBankStaffDashboard = ({ userId }) => (
  <DashboardContainer title="Blood Bank Staff Dashboard">
    <p className="text-lg text-gray-700">Welcome, Blood Bank Staff! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
    <p className="mt-4 text-gray-600">Manage blood inventory, process incoming and outgoing units, and handle requests.</p>
    {/* Future features: Inventory Management, Process Requests, Donor Management */}
  </DashboardContainer>
);

const SupervisorDashboard = ({ userId }) => (
  <DashboardContainer title="Supervisor Dashboard">
    <p className="text-lg text-gray-700">Welcome, Supervisor! Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{userId}</span></p>
    <p className="mt-4 text-gray-600">Oversee operations, manage charges, and authorize critical actions.</p>
    {/* Future features: System Overview, Charges, Authorizations */}
  </DashboardContainer>
);

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
            <div><label htmlFor="bankAddressState" className="block text-gray-700 text-sm font-bold mb-1">State</label><input type="text" id="bankAddressState" name="address.state" value={newBankFormData.address.state} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required /></div>
            <div><label htmlFor="bankAddressZip" className="block text-gray-700 text-sm font-bold mb-1">Zip Code</label><input type="text" id="bankAddressZip" name="address.zipCode" value={newBankFormData.address.zipCode} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required /></div>
            <div><label htmlFor="bankAddressCountry" className="block text-gray-700 text-sm font-bold mb-1">Country</label><input type="text" id="bankAddressCountry" name="address.country" value={newBankFormData.address.country} onChange={handleNewBankChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" required /></div>
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
        // Basic JWT decode: get payload (middle part), base64 decode, then parse JSON
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload && payload.user && payload.user.id && payload.user.role) {
          setToken(storedToken);
          setUser({ id: payload.user.id, role: payload.user.role });
          // If a token exists and is valid, default to dashboard if not on a public page
          if (!['home', 'about', 'contact', 'gallery', 'login'].includes(currentPage)) {
              navigateTo(payload.user.role + '_dashboard'); // Navigate to their specific dashboard
          }
        } else {
          // Invalid token structure
          console.error("Invalid token structure in localStorage.");
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to decode or parse token from localStorage:", e);
        localStorage.removeItem('token'); // Clear invalid token
        setToken(null);
        setUser(null);
      }
    }
  }, []); // Run only once on component mount

  // Function to handle user login (passed to LoginPage)
  const handleLogin = (jwtToken, userData) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData); // Set user data { id, role }
    navigateTo(userData.role + '_dashboard'); // Redirect to their specific dashboard
    console.log('Logged in successfully, token stored. User role:', userData.role);
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigateTo('home'); // Redirect to home page after logout
    console.log('User logged out.');
  };

  // Conditional rendering for pages based on current page and user role
  const renderPage = () => {
    // If user is logged in, and tries to go to login page, redirect to their dashboard
    if (currentPage === 'login' && token) {
      return user ? renderDashboard(user.role) : <HomePage />; // Redirect to dashboard if user data is available
    }

    // Render public pages
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      default:
        // If logged in, try to render dashboard based on role
        if (token && user) {
          return renderDashboard(user.role);
        }
        // Fallback for unknown pages or not logged in
        return <HomePage />;
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
          <div className="hidden md:flex space-x-8 items-center">
            <NavItem onClick={() => navigateTo('home')} isActive={currentPage === 'home'}>Home</NavItem>
            <NavItem onClick={() => navigateTo('about')} isActive={currentPage === 'about'}>About Us</NavItem>
            <NavItem onClick={() => navigateTo('gallery')} isActive={currentPage === 'gallery'}>Gallery</NavItem>
            <NavItem onClick={() => navigateTo('contact')} isActive={currentPage === 'contact'}>Contact Us</NavItem>
            {token ? (
              <>
                {/* Dashboard link based on user role */}
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
      <main className="pt-20 pb-16"> {/* Adjust padding to accommodate fixed navbar and footer */}
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
    </div>
  );
};


// Tailwind CSS Configuration and Custom Animations (included directly for Canvas)
// In a real project, these would be in tailwind.config.js and a separate CSS file.
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
          'scale-in': {
            '0%': { transform: 'scale(0.9)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
        },
        animation: {
          'fade-in': 'fade-in 0.5s ease-out forwards',
          'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
          'bounce-in': 'bounce-in 0.8s ease-out forwards',
          'rotate-in': 'rotate-in 0.6s ease-out forwards',
          'scale-in': 'scale-in 0.3s ease-out forwards',
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
