import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <nav className="bg-gray-900 bg-opacity-90 text-white backdrop-blur-sm shadow-lg sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent flex items-center gap-2">
              <span className="transform hover:rotate-12 transition-transform duration-300">🌾</span>
              AgriSpace
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('changePage', { detail: 'dashboard' }))}
              className="inline-flex items-center px-3 py-2 text-lg text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200 rounded-lg"
            >
              Dashboard
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('changePage', { detail: 'simulator' }))}
              className="inline-flex items-center px-3 py-2 text-lg text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200 rounded-lg"
            >
              Simulator
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;