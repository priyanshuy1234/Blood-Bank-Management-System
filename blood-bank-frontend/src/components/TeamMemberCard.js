import React from 'react';

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

export default TeamMemberCard;
