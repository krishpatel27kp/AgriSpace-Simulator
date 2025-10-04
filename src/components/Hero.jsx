import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-green-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AgriSpace Simulator
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience sustainable farming with NASA's climate data. Make smart decisions, grow crops,
            and learn about sustainable agriculture.
          </p>
          <div className="mt-10 flex justify-center">
            <button className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105">
              Start Game
            </button>
          </div>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-blue-600 text-2xl mb-4">🌡️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Climate Data</h3>
            <p className="text-gray-600">Using NASA's POWER API to simulate real weather conditions</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-green-600 text-2xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Crop Management</h3>
            <p className="text-gray-600">Make strategic decisions about irrigation and crop selection</p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-yellow-600 text-2xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability Score</h3>
            <p className="text-gray-600">Track your environmental impact and farming efficiency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;