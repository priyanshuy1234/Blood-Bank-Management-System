import React from 'react';

const TestimonialCard = ({ quote, author, avatarText }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform hover:translate-y-[-5px] transition-transform duration-300 ease-in-out">
    <div className="w-20 h-20 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-3xl font-bold mb-4 border-4 border-red-200">
      {avatarText}
    </div>
    <p className="text-lg italic text-gray-700 mb-4">"{quote}"</p>
    <p className="font-semibold text-gray-800">- {author}</p>
  </div>
);

export default TestimonialCard;
