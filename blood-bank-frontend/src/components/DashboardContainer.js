import React from 'react';

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

export default DashboardContainer;
