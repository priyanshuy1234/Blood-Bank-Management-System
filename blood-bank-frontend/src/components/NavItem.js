import React from 'react';

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

export default NavItem;
