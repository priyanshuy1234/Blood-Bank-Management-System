import React from 'react';
import StatCard from '../components/StatCard';
import StepCard from '../components/StepCard'; // Corrected import path
import TestimonialCard from '../components/TestimonialCard';

// HomePage now accepts a 'navigateTo' prop from App.js
const HomePage = ({ navigateTo }) => (
  <div className="container mx-auto px-4 py-12 md:py-24 text-center">
    <section className="hero-section mb-20 animate-fade-in-up">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
        Donate Blood, <span className="text-red-600">Save Lives</span>.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
        Every drop counts. Join our mission to connect donors with those in need and and make a difference in the world.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Button to navigate to Find Blood Banks page */}
        <button
          onClick={() => navigateTo('find-blood-banks')}
          className="px-8 py-4 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Find a Donation Camp
        </button>
        {/* Button to navigate to Login/Register page */}
        <button
          onClick={() => navigateTo('login')}
          className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 font-bold rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
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

export default HomePage;
