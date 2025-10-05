import React, { useState } from 'react';
import { FaThermometerHalf, FaCloudRain, FaSeedling, FaInfoCircle } from 'react-icons/fa';
import { CROP_DATA } from '../utils/growthStageLogic';

function SimulationControls({ onSimulate, disabled, weatherData, selectedCrop, onCropSelect }) {
  const [settings, setSettings] = useState({
    days: 30,
    soilHealth: 80,
    irrigation: 50,
    fertilizer: 50,
    farmSizeAcres: 1
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleStartSimulation = () => {
    if (!weatherData) {
      alert("Please wait for NASA weather data to load!");
      return;
    }

    const cropKey = selectedCrop || 'wheat';
    if (!CROP_DATA[cropKey]) {
      alert(`No data available for crop: ${cropKey}`);
      return;
    }

    // Convert acres to hectares for calculations (1 acre = 0.404686 hectares)
    const farmSizeHectares = settings.farmSizeAcres * 0.404686;

    onSimulate({
      ...settings,
      farmSizeHectares,
      crop: CROP_DATA[cropKey],
      cropType: cropKey,
      cropName: CROP_DATA[cropKey].name,
      temperature: weatherData.temperature,
      rainfall: weatherData.rainfall,
      solarRadiation: weatherData.solarRadiation
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
      <h3 className="text-xl font-bold text-white">Simulation Settings</h3>
      
      {!weatherData && (
        <div className="text-yellow-400 text-sm mb-4">
          <FaInfoCircle className="inline mr-2" />
          Please select a location on the map to get weather data
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Farm Size (acres)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={settings.farmSizeAcres}
            onChange={(e) => handleChange('farmSizeAcres', Number(e.target.value))}
            className="w-full bg-gray-700 text-white rounded-md p-2"
            disabled={!weatherData}
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Crop Type
          </label>
          <select
            value={selectedCrop || 'wheat'}
            onChange={(e) => onCropSelect(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-md p-2"
            disabled={!weatherData}
          >
            {Object.entries(CROP_DATA).map(([key, data]) => (
              <option key={key} value={key}>{data.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Simulation Period: {settings.days} days
          </label>
          <input
            type="range"
            min="7"
            max="120"
            value={settings.days}
            onChange={(e) => handleChange('days', Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            disabled={!weatherData}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1w</span>
            <span>30d</span>
            <span>60d</span>
            <span>90d</span>
            <span>120d</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Irrigation Level: {settings.irrigation}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.irrigation}
            onChange={(e) => handleChange('irrigation', Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            disabled={!weatherData}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Fertilizer Application: {settings.fertilizer}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.fertilizer}
            onChange={(e) => handleChange('fertilizer', Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            disabled={!weatherData}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Soil Health Management: {settings.soilHealth}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.soilHealth}
            onChange={(e) => handleChange('soilHealth', Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            disabled={!weatherData}
          />
        </div>
      </div>

      {/* Management Tips */}
      {weatherData && (
        <div className="p-4 bg-gray-700/50 rounded-lg">
          <h4 className="text-gray-200 font-medium mb-2">Management Recommendations</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {weatherData.temperature > 30 && (
              <li className="flex items-center">
                <FaThermometerHalf className="text-red-400 mr-2" />
                High temperature detected - Consider increasing irrigation
              </li>
            )}
            {weatherData.rainfall < 10 && (
              <li className="flex items-center">
                <FaCloudRain className="text-blue-400 mr-2" />
                Low rainfall - Monitor soil moisture carefully
              </li>
            )}
            <li className="flex items-center">
              <FaSeedling className="text-green-400 mr-2" />
              Optimal {settings.cropType} growing conditions will be simulated
            </li>
          </ul>
        </div>
      )}

      <button
        onClick={handleStartSimulation}
        disabled={disabled || !weatherData}
        className={`w-full font-bold py-3 px-4 rounded transition-colors ${
          disabled || !weatherData
            ? 'bg-gray-500 cursor-not-allowed text-gray-300'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {disabled ? 'Simulating...' : weatherData ? 'Run Simulation' : 'Select Location First'}
      </button>
    </div>
  );
}

export default SimulationControls;