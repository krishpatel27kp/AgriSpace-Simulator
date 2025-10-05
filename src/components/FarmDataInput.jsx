import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InputField = ({ label, value, onChange, type = 'text', unit = '', min, max, tooltip }) => (
  <div className="mb-4 relative group">
    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 flex items-center">
      {label}
      {tooltip && (
        <div className="ml-2 relative">
          <span className="text-gray-400 cursor-help">ℹ️
            <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg w-48 z-10">
              {tooltip}
            </div>
          </span>
        </div>
      )}
    </label>
    <div className="flex items-center">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        min={min}
        max={max}
        className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
      />
      {unit && <span className="ml-2 text-gray-500 dark:text-gray-400">{unit}</span>}
    </div>
  </div>
);

const FarmDataInput = ({ onSubmit }) => {
  const [farmData, setFarmData] = useState({
    farmSizeAcres: 10,
    cropType: 'wheat',
    soilType: 'loam',
    currentIrrigation: '5',
    organicFertilizer: false,
    sustainablePractices: [],
  });
  
  const [error, setError] = useState('');

  // Convert acres to hectares
  const acresToHectares = (acres) => acres * 0.404686;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Convert farm size from acres to hectares for analysis
    const farmSizeHectares = acresToHectares(Number(farmData.farmSizeAcres));

    // Validate required numeric fields
    const numericFields = {
      farmSizeAcres: 'Farm Size',
      currentIrrigation: 'Current Irrigation'
    };

    for (const [field, label] of Object.entries(numericFields)) {
      const value = parseFloat(farmData[field]);
      if (isNaN(value) || value < 0) {
        setError(`Please enter a valid number for ${label}`);
        return;
      }
    }

    try {
      const farmSizeAcres = parseFloat(farmData.farmSizeAcres);
      if (isNaN(farmSizeAcres) || farmSizeAcres <= 0) {
        setError('Please enter a valid farm size greater than 0 acres');
        return;
      }

      const validatedData = {
        ...farmData,
        farmSizeAcres: farmSizeAcres,
        farmSizeHectares: acresToHectares(farmSizeAcres),
        currentIrrigation: parseFloat(farmData.currentIrrigation),
        soilType: farmData.soilType || 'loam',
        cropType: farmData.cropType || 'wheat',
        organicFertilizer: farmData.organicFertilizer || false,
        sustainablePractices: farmData.sustainablePractices || []
      };
      
      // Pass the data to parent component for processing
      onSubmit(validatedData);

      // Clear form
      setFarmData({
        farmSizeAcres: 10,
        cropType: 'wheat',
        soilType: 'loam',
        currentIrrigation: '5',
        organicFertilizer: false,
        sustainablePractices: []
      });
    } catch (err) {
      setError('Failed to process farm data. Please check your inputs.');
      console.error('Farm data processing error:', err);
    }
  };

  const toggleSustainablePractice = (practice) => {
    setFarmData(prev => ({
      ...prev,
      sustainablePractices: prev.sustainablePractices.includes(practice)
        ? prev.sustainablePractices.filter(p => p !== practice)
        : [...prev.sustainablePractices, practice]
    }));
  };

  const sustainablePractices = [
    'Crop Rotation',
    'Water Conservation',
    'Soil Testing',
    'Natural Pest Control'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <InputField
        label="Farm Size"
        value={farmData.farmSizeAcres}
        onChange={(value) => setFarmData(prev => ({ ...prev, farmSizeAcres: value }))}
        type="number"
        unit="acres"
        min={0.1}
        max={10000}
        tooltip="Enter your farm size in acres (1 acre = 0.404686 hectares)"
      />

      <div className="mb-4 relative group">
        <label className="flex text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 items-center">
          Crop Type
          <span className="ml-2 text-gray-400 cursor-help">ℹ️
            <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg w-48 z-10">
              Select the main crop you want to grow
            </div>
          </span>
        </label>
        <select
          value={farmData.cropType}
          onChange={(e) => setFarmData(prev => ({ ...prev, cropType: e.target.value }))}
          className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="wheat">Wheat</option>
          <option value="rice">Rice</option>
          <option value="corn">Corn</option>
        </select>
      </div>

      <InputField
        label="Farm Size"
        value={farmData.farmSizeAcres}
        onChange={(value) => setFarmData(prev => ({ ...prev, farmSizeAcres: value }))}
        type="number"
        unit="acres"
        min={0.1}
        max={10000}
        tooltip="Enter your farm size in acres (1 acre = 0.404686 hectares)"
      />

      <div className="mb-4 relative group">
        <label className="flex text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 items-center">
          Soil Type
          <span className="ml-2 text-gray-400 cursor-help">ℹ️
            <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg w-48 z-10">
              Choose your soil type for better recommendations
            </div>
          </span>
        </label>
        <select
          value={farmData.soilType}
          onChange={(e) => setFarmData(prev => ({ ...prev, soilType: e.target.value }))}
          className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="loam">Loam (Best Balance)</option>
          <option value="clay">Clay (Water Retentive)</option>
          <option value="sandy">Sandy (Well Draining)</option>
        </select>
      </div>

      <InputField
        label="Current Irrigation Level"
        value={farmData.currentIrrigation}
        onChange={(value) => setFarmData(prev => ({ ...prev, currentIrrigation: value }))}
        type="number"
        unit="mm/day"
        min={0}
        max={100}
        tooltip="How much water you currently use for irrigation"
      />

      <div className="mb-4 relative group">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={farmData.organicFertilizer}
            onChange={(e) => setFarmData(prev => ({ ...prev, organicFertilizer: e.target.checked }))}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">Using Organic Fertilizer</span>
          <span className="ml-2 text-gray-400 cursor-help">ℹ️
            <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg w-48 z-10">
              Check if you use organic fertilizers instead of synthetic ones
            </div>
          </span>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 items-center">
          Sustainable Practices
          <span className="ml-2 text-gray-400 cursor-help">ℹ️
            <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg w-48 z-10">
              Select the sustainable farming practices you currently use
            </div>
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sustainablePractices.map(practice => (
            <label key={practice} className="flex items-center bg-gray-50 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={farmData.sustainablePractices.includes(practice)}
                onChange={() => toggleSustainablePractice(practice)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">{practice}</span>
            </label>
          ))}
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
      >
        Calculate Farm Score
      </motion.button>
    </form>
  );
};

export default FarmDataInput;