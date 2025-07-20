import React from 'react';

const StatCard = ({ value, label, icon }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="text-6xl mb-4 animate-bounce-in">{icon}</div>
    <div className="text-5xl font-extrabold text-red-600 mb-2">{value}</div>
    <p className="text-xl text-gray-700">{label}</p>
  </div>
);

export default StatCard;
