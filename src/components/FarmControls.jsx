import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { calculateFarmerScore } from '../utils/agronomicLogic';

const FarmControls = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    irrigation: 50,
    fertilizer: 50,
    waterEfficiency: 0,
    fertilizerEfficiency: 0,
    yieldScore: 0,
    sustainabilityScore: 0
  });

  const [performanceScore, setPerformanceScore] = useState(null);

  const calculateEfficiency = (value, optimal) => {
    const difference = Math.abs(value - optimal);
    return Math.max(0, 100 - (difference * 2));
  };

  const updateScores = (newSettings) => {
    // Calculate water efficiency based on irrigation level
    const waterEfficiency = calculateEfficiency(newSettings.irrigation, 60);
    
    // Calculate fertilizer efficiency based on fertilizer amount
    const fertilizerEfficiency = calculateEfficiency(newSettings.fertilizer, 55);
    
    // Calculate yield impact based on both factors
    const yieldScore = (waterEfficiency + fertilizerEfficiency) / 2;
    
    // Calculate sustainability score (penalize overuse)
    const sustainabilityScore = 100 - Math.max(
      0,
      ((newSettings.irrigation > 70 ? newSettings.irrigation - 70 : 0) +
       (newSettings.fertilizer > 65 ? newSettings.fertilizer - 65 : 0)) * 2
    );

    const updatedSettings = {
      ...newSettings,
      waterEfficiency,
      fertilizerEfficiency,
      yieldScore,
      sustainabilityScore
    };

    // Calculate overall farmer score
    const score = calculateFarmerScore(updatedSettings);
    setPerformanceScore(score);
    
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    updateScores(newSettings);
  };

  useEffect(() => {
    updateScores(settings);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-6">Farm Controls</h3>
        
        {/* Irrigation Control */}
        <div className="mb-6">
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
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low</span>
            <span>Optimal</span>
            <span>High</span>
          </div>
        </div>

        {/* Fertilizer Control */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Fertilizer Amount: {settings.fertilizer}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.fertilizer}
            onChange={(e) => handleChange('fertilizer', Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low</span>
            <span>Optimal</span>
            <span>High</span>
          </div>
        </div>

        {/* Current Settings Box */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Current Settings</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Water Efficiency:</span>
              <span className="text-blue-400">{Math.round(settings.waterEfficiency)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Fertilizer Efficiency:</span>
              <span className="text-green-400">{Math.round(settings.fertilizerEfficiency)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Rating Card */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-6">Performance Rating</h3>
        
        <div className="space-y-6">
          {/* Score Indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={performanceScore?.score}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center mb-6"
            >
              {performanceScore?.score >= 70 ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <CheckCircleIcon className="w-16 h-16 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <XCircleIcon className="w-16 h-16 text-red-500" />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Score Components */}
          <div className="space-y-4">
            <ScoreBar
              label="Yield Impact"
              value={settings.yieldScore}
              color="blue"
            />
            <ScoreBar
              label="Sustainability"
              value={settings.sustainabilityScore}
              color="green"
            />
            <ScoreBar
              label="Efficiency Bonus"
              value={(settings.waterEfficiency + settings.fertilizerEfficiency) / 2}
              color="purple"
            />
          </div>

          {/* Overall Score */}
          <div className="mt-6 text-center">
            <div className="text-gray-400 text-sm mb-2">Overall Score</div>
            <div className="text-4xl font-bold text-white">
              {performanceScore?.score || 0}
            </div>
            <div className={`text-sm mt-2 ${
              performanceScore?.achievement === 'Master' ? 'text-green-400' : 'text-blue-400'
            }`}>
              {performanceScore?.achievement || 'Novice'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-gray-400">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(value)}%` }}
          transition={{ duration: 0.5 }}
          className={`h-2 rounded-full ${colorClasses[color]}`}
        />
      </div>
    </div>
  );
};

export default FarmControls;