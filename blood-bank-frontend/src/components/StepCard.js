import React from 'react';

const StepCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="text-5xl mb-6 animate-rotate-in">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default StepCard;
