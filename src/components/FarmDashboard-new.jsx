import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FarmControls from './FarmControls';
import GrowthAnalysis from './GrowthAnalysis';

const FarmDashboard = () => {
  const [farmSettings, setFarmSettings] = useState({
    irrigation: 50,
    fertilizer: 50,
    waterEfficiency: 0,
    fertilizerEfficiency: 0,
    yieldScore: 0,
    sustainabilityScore: 0
  });

  const [error, setError] = useState('');

  const handleSettingsChange = (newSettings) => {
    try {
      setFarmSettings(newSettings);
      setError('');
    } catch (err) {
      console.error('Error updating farm settings:', err);
      setError('An error occurred while updating farm settings. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Farm Management Dashboard
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-900/50 border border-red-500 text-red-100 p-4 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <FarmControls
          settings={farmSettings}
          onSettingsChange={handleSettingsChange}
        />
        
        <GrowthAnalysis farmSettings={farmSettings} />
      </div>
    </div>
  );
};

export default FarmDashboard;