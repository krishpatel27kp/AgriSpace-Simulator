import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-blue-400">🌾</span> AgriSpace Simulator
            </h3>
            <p className="text-gray-300 text-sm max-w-sm">
              Empowering sustainable agriculture through NASA's POWER data and interactive simulation.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-200">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Documentation</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">NASA POWER API</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">About Project</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-200">Project Info</h4>
            <div className="space-y-2 text-gray-400">
              <p>Built for Hackathon 2025</p>
              <p>Powered by NASA POWER Data</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Demo</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © 2025 AgriSpace Simulator. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;