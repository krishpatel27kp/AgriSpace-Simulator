import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { simulateFarming } from '../utils/agronomicLogic';
import { CROP_DATA, calculateGrowthStage, calculateYieldPotential, generateGrowthSummary } from '../utils/growthStageLogic';
import GrowthStageProgress from './GrowthStageProgress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const SimulationControls = ({ onSimulate, disabled = false }) => {
  const [settings, setSettings] = useState({
    temperature: 20,
    rainfall: 50,
    cropType: 'wheat',
    soilType: 'loam',
    irrigation: 50,
    fertilizer: 50,
    soilPH: 6.5,
    nitrogenLevel: 40,
    phosphorusLevel: 30,
    potassiumLevel: 20,
    organicMatter: 3,
    organicPractices: false,
    pestManagement: 'integrated',
    simulationSpeed: 1
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSimulate = () => {
    onSimulate(settings);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Simulation Controls</h3>
      
      {/* Crop Selection */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Crop Type
        </label>
        <select
          value={settings.cropType}
          onChange={(e) => handleChange('cropType', e.target.value)}
          className="w-full bg-gray-700 text-white rounded-md p-2"
        >
          <option value="wheat">Wheat</option>
          <option value="rice">Rice</option>
          <option value="corn">Corn</option>
        </select>
      </div>

      {/* Soil Type */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Soil Type
        </label>
        <select
          value={settings.soilType}
          onChange={(e) => handleChange('soilType', e.target.value)}
          className="w-full bg-gray-700 text-white rounded-md p-2"
        >
          <option value="loam">Loam (Balanced)</option>
          <option value="clay">Clay (Water Retentive)</option>
          <option value="sandy">Sandy (Well Draining)</option>
        </select>
      </div>

      {/* Temperature Control */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Temperature (°C): {settings.temperature}°C
        </label>
        <input
          type="range"
          min="0"
          max="40"
          value={settings.temperature}
          onChange={(e) => handleChange('temperature', Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Cold</span>
          <span>Optimal</span>
          <span>Hot</span>
        </div>
      </div>

      {/* Rainfall Control */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Rainfall (mm/day): {settings.rainfall}mm
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.rainfall}
          onChange={(e) => handleChange('rainfall', Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Dry</span>
          <span>Moderate</span>
          <span>Wet</span>
        </div>
      </div>

      {/* Irrigation Control */}
      <div className="mb-4">
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
      </div>

      {/* Fertilizer Control */}
      <div className="mb-4">
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
      </div>

      {/* Growth Stage */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Growth Stage
        </label>
        <select
          value={settings.cropStage}
          onChange={(e) => handleChange('cropStage', e.target.value)}
          className="w-full bg-gray-700 text-white rounded-md p-2"
        >
          <option value="germination">Germination</option>
          <option value="vegetative">Vegetative Growth</option>
          <option value="reproductive">Reproductive</option>
          <option value="maturation">Maturation</option>
        </select>
      </div>

      <button
        onClick={handleSimulate}
        disabled={disabled}
        className={`w-full font-bold py-2 px-4 rounded transition-colors ${
          disabled 
            ? 'bg-gray-500 cursor-not-allowed text-gray-300'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {disabled ? 'Simulating...' : 'Run Simulation'}
      </button>
    </div>
  );
};

const SimulationResults = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Running Simulation...</h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-150"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-red-500 mb-4">Simulation Error</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Simulation Results</h3>
        <p className="text-gray-400">Configure parameters and run simulation to see results</p>
      </div>
    );
  }

  const chartData = data.dailyResults || [];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Simulation Results</h3>
      
      {/* Growth Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="growth"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name="Plant Growth"
            />
            <Line
              type="monotone"
              dataKey="water"
              stroke="#34D399"
              strokeWidth={2}
              dot={false}
              name="Water Level"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-gray-300 text-sm font-medium">Yield Estimate</h4>
          <p className="text-2xl font-bold text-blue-400">{data.yieldEstimate || 0}%</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-gray-300 text-sm font-medium">Health Score</h4>
          <p className="text-2xl font-bold text-green-400">{data.healthScore || 0}%</p>
        </div>
      </div>

      {/* Recommendations */}
      {data.recommendations?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3">Recommendations</h4>
          <ul className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <li
                key={index}
                className="bg-gray-700 p-3 rounded-lg text-gray-300 text-sm"
              >
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const FarmSimulator = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSimulation = async (params) => {
    setLoading(true);
    setError(null);
    try {
      // Validate input parameters
      if (!params.cropType || !params.soilType) {
        throw new Error('Please select crop type and soil type');
      }

      // Initialize daily results array for the chart
      const dailyResults = [];
      const days = 30; // Simulate 30 days
      
      // Run daily simulations
      for (let day = 1; day <= days; day++) {
        const result = simulateFarming({
          ...params,
          dayNumber: day,
          // Add environmental factors
          temperature: params.temperature || 20,
          rainfall: params.rainfall || 0,
          irrigation: params.irrigation || 0,
          fertilizer: params.fertilizer || 0
        });

        if (result?.success && result?.data) {
          dailyResults.push({
            day: day,
            growth: result.data.yieldScore || 0,
            water: result.data.waterEfficiency || 0,
            health: result.data.sustainabilityScore || 0
          });
        } else {
          console.warn(`Simulation failed for day ${day}:`, result);
        }

        // Add a small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Calculate final results with accumulated data
      const finalResult = simulateFarming({
        ...params,
        dayNumber: days,
        accumulatedData: dailyResults
      });
      
      if (finalResult?.success && finalResult?.data) {
        const simulationResults = {
          ...finalResult.data,
          dailyResults,
          yieldEstimate: finalResult.data.yieldScore || 0,
          healthScore: finalResult.data.sustainabilityScore || 0,
          waterEfficiency: finalResult.data.waterEfficiency || 0,
          fertilizerEfficiency: finalResult.data.fertilizerEfficiency || 0,
          growthProgression: finalResult.data.growthProgression || 0,
          environmentalConditions: finalResult.data.environmentalConditions || {},
          recommendations: finalResult.data.recommendations?.map(rec => rec.message) || [],
          simulationDate: new Date().toISOString(),
          cropType: params.cropType,
          soilType: params.soilType,
          farmerScore: finalResult.data.farmerScore || { score: 0, achievement: 'Novice' }
        };

        setSimulationData(simulationResults);
        return simulationResults;
      } else {
        throw new Error('Simulation failed to produce valid results');
      }
    } catch (error) {
      console.error('Simulation error:', error);
      setError(error.message || 'Failed to run simulation');
      setSimulationData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Farm Simulation Lab</h2>
          <p className="mt-2 text-gray-400">
            Test different environmental conditions and see how they affect your crop growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <SimulationControls onSimulate={runSimulation} disabled={loading} />

          {/* Right Column - Results */}
          <SimulationResults 
            data={simulationData} 
            loading={loading} 
            error={error} 
          />
        </div>
      </div>
    </div>
  );
};

export default FarmSimulator;