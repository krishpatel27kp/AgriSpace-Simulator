import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { calculateFarmerScore } from '../utils/agronomicLogic.js';
import { simulateCropGrowth } from '../utils/simulationLogic.js';
import FarmDataInput from './FarmDataInput';
import FarmScoreResults from './FarmScoreResults';
import AdvancedMetrics from './AdvancedMetrics';
import GrowthStageProgress from './GrowthStageProgress';
import { CROP_DATA, calculateGrowthStage, calculateYieldPotential, generateGrowthSummary } from '../utils/growthStageLogic';

const COLORS = {
  yield: '#EAB308',
  water: '#0EA5E9',
  sustainability: '#22C55E',
  irrigation: '#3B82F6',
  rainfall: '#38BDF8',
  soilHealth: '#4ADE80',
};

const DashboardCard = ({ title, children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg backdrop-blur-sm backdrop-filter overflow-hidden transition-all duration-200 ${className}`}
  >
    <div className='p-6'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>{title}</h3>
      <div className='w-full'>{children}</div>
    </div>
  </motion.div>
);

// Helper function to determine achievement level
const getAchievementLevel = (score) => {
  if (score >= 90) return 'Master Farmer';
  if (score >= 80) return 'Expert Farmer';
  if (score >= 70) return 'Skilled Farmer';
  if (score >= 60) return 'Proficient Farmer';
  if (score >= 50) return 'Developing Farmer';
  return 'Novice Farmer';
};

const NewFarmDashboard = ({ weatherData, isLoading, error: apiError }) => {
  // State management
  const [growthDays, setGrowthDays] = useState(0);
  const [growthSimulation, setGrowthSimulation] = useState(null);
  const [farmSettings, setFarmSettings] = useState({
    irrigation: 50,
    fertilizer: 50,
    waterEfficiency: 0,
    fertilizerEfficiency: 0,
    yieldScore: 0,
    sustainabilityScore: 0
  });

  const [simulationData, setSimulationData] = useState({
    details: {
      temperatureEffect: 70,
      waterEfficiency: 75,
      optimalWater: 600,
      soilHealth: 80,
      organicPractices: 70,
      fertilizerEffect: 75
    },
    advancedMetrics: {
      carbonFootprint: 40,
      biodiversityScore: 75,
      pestRisk: 30,
      sustainabilityScore: 80
    },
    waterEfficiency: 75,
    yieldScore: 70,
    waterUsed: 500,
    sustainabilityScore: 80,
    carbonFootprint: 2,
    soilHealthScore: 80,
    organicPracticeScore: 70,
    farmerScore: { score: 75, achievement: "Novice" },
    farmData: {
      cropType: 'wheat',
      soilType: 'loam',
      soilPH: 6.5,
      nitrogenLevel: 40,
      phosphorusLevel: 30,
      potassiumLevel: 20,
      organicMatter: 3
    }
  });



  const [farmScoreData, setFarmScoreData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  // Effect for time progression
  useEffect(() => {
    let timer;
    if (showResults) {
      timer = setInterval(() => {
        setGrowthDays(prev => {
          const maxDays = CROP_DATA[farmSettings.cropType || 'wheat'].totalGrowthDays;
          return prev < maxDays ? prev + 1 : prev;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showResults, farmSettings.cropType]);

  // Effect for simulation updates
  useEffect(() => {
    if (weatherData && !isLoading && !apiError) {
      runSimulation();
    }
  }, [weatherData, isLoading, apiError, growthDays]);

  // Simulation logic
  const runSimulation = () => {
    try {
      // Default values for weather data
      const defaultWeatherData = {
        TEMP2M: 20,
        PRECTOTCORR: 25,
        ALLSKY_SFC_SW_DWN: 200
      };

      // Run the advanced simulation
      const simulationResult = simulateCropGrowth({
        cropType: simulationData?.farmData?.cropType ?? 'wheat',
        soilType: simulationData?.farmData?.soilType ?? 'loam',
        temperature: weatherData?.TEMP2M ?? defaultWeatherData.TEMP2M,
        rainfall: weatherData?.PRECTOTCORR ?? defaultWeatherData.PRECTOTCORR,
        irrigation: farmSettings?.irrigation ?? 50,
        fertilizer: farmSettings?.fertilizer ?? 50,
        soilPH: simulationData?.farmData?.soilPH ?? 6.5,
        nitrogenLevel: simulationData?.farmData?.nitrogenLevel ?? 40,
        phosphorusLevel: simulationData?.farmData?.phosphorusLevel ?? 30,
        potassiumLevel: simulationData?.farmData?.potassiumLevel ?? 20,
        organicMatter: simulationData?.farmData?.organicMatter ?? 3,
        cropStage: 'vegetative',
        organicPractices: true
      });

      if (!simulationResult) {
        throw new Error('Simulation failed to return results');
      }

      // Update farm score data and simulation data with new results
      setFarmScoreData({
        farmerScore: {
          score: simulationResult.growthScore,
          achievement: getAchievementLevel(simulationResult.growthScore)
        },
        yieldScore: simulationResult.projectedYield,
        sustainabilityScore: simulationResult.advancedMetrics.sustainabilityScore,
        waterEfficiency: 100 - simulationResult.stressFactors.water,
        fertilizerEfficiency: 100 - simulationResult.stressFactors.nutrients,
        cropType: simulationData?.farmData?.cropType ?? 'wheat',
        soilType: simulationData?.farmData?.soilType ?? 'loam',
        environmentalConditions: {
          temperature: weatherData?.TEMP2M ?? 20,
          rainfall: weatherData?.PRECTOTCORR ?? 25,
          solarRadiation: weatherData?.ALLSKY_SFC_SW_DWN ?? 200
        },
        recommendations: simulationResult.recommendations
      });

      setSimulationData(prevData => ({
        ...prevData,
        details: {
          temperatureEffect: simulationResult.stressFactors.temperature,
          waterEfficiency: 100 - simulationResult.stressFactors.water,
          fertilizerEffect: 100 - simulationResult.stressFactors.nutrients,
          soilHealth: simulationResult.soilHealth
        },
        advancedMetrics: simulationResult.advancedMetrics,
        recommendations: simulationResult.recommendations,
        yieldScore: simulationResult.projectedYield,
        cropDetails: simulationResult.cropDetails
      }));

      // Calculate water efficiency
      const optimalWater = params.cropType === 'wheat' ? 450 : params.cropType === 'rice' ? 900 : 600;
      const waterUsed = (params.irrigation * 5) + (params.rainfall * 10);
      const waterEfficiency = Math.max(0, 100 - Math.abs(waterUsed - optimalWater) / (optimalWater / 100));

      // Calculate yield score based on water and fertilizer balance
      const optimalFertilizer = 60;
      const fertilizerEffect = Math.max(0, 100 - Math.abs(params.fertilizer - optimalFertilizer) * 2);
      const yieldScore = Math.round((waterEfficiency + fertilizerEffect) / 2);

      // Calculate sustainability score
      const excessWater = Math.max(0, (waterUsed - optimalWater) / optimalWater);
      const excessFertilizer = Math.max(0, (params.fertilizer - optimalFertilizer) / optimalFertilizer);
      const sustainabilityScore = Math.round(100 - ((excessWater + excessFertilizer) * 50));

      // Calculate carbon footprint (simplified)
      const carbonFootprint = (excessFertilizer * 3) + (excessWater * 2);

      const newSimulationData = {
        yieldScore,
        waterUsed,
        sustainabilityScore,
        carbonFootprint,
        waterEfficiency,
        details: {
          ...simulationData.details,
          temperatureEffect: Math.round(100 - Math.abs(params.temperature - 25) * 3),
          waterEfficiency,
          fertilizerEffect,
          optimalWater,
          carbonFootprint
        }
      };

      setSimulationData(prev => ({
        ...prev,
        ...newSimulationData,
        farmerScore: calculateFarmerScore({
          yieldScore: newSimulationData.yieldScore,
          sustainabilityScore: newSimulationData.sustainabilityScore,
          waterEfficiency: newSimulationData.waterEfficiency,
          fertilizerEfficiency: newSimulationData.details.fertilizerEffect / 100
        })
      }));

      setError('');
    } catch (err) {
      console.error('Simulation error:', err);
      setError('Failed to run simulation. Please try again.');
    }
  };

  // Effect to run simulation when farm settings change
  useEffect(() => {
    runSimulation();
  }, [farmSettings]);

  // Farm data submission handler
  const handleFarmDataSubmit = (farmData) => {
    try {
      setError('');
      const newSettings = {
        ...farmSettings,
        cropType: farmData.cropType,
        soilType: farmData.soilType
      };
      setFarmSettings(newSettings);
      setSimulationData(prev => ({
        ...prev,
        farmData: {
          ...prev.farmData,
          ...farmData
        }
      }));
      setShowResults(true);
    } catch (err) {
      console.error('Error processing farm data:', err);
      setError('An error occurred while processing your farm data. Please try again.');
      setShowResults(false);
    }
  };

  // Default values for weather data
  const defaultRainfall = 25; // Default rainfall in mm
  const baseRainfall = weatherData?.PRECTOTCORR ?? defaultRainfall;

  // Data for charts
  const waterUsageData = [
    { name: 'Jan', rainfall: baseRainfall, irrigation: farmSettings.irrigation },
    { name: 'Feb', rainfall: baseRainfall * 0.8, irrigation: farmSettings.irrigation * 1.2 },
    { name: 'Mar', rainfall: baseRainfall * 1.2, irrigation: farmSettings.irrigation * 0.8 },
    { name: 'Apr', rainfall: baseRainfall * 1.1, irrigation: farmSettings.irrigation * 0.9 },
  ];

  const sustainabilityData = [
    { name: 'Temperature Effect', value: simulationData?.details?.temperatureEffect ?? 70 },
    { name: 'Water Efficiency', value: simulationData?.waterEfficiency ?? 75 },
    { name: 'Carbon Impact', value: Math.max(0, 100 - (simulationData?.carbonFootprint ?? 2) * 20) },
  ];

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <header className='bg-white dark:bg-gray-800 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
            Smart Farming Dashboard
          </h1>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Farm Data Input Section */}
          <DashboardCard title="Farm Data Input" className="lg:col-span-1">
            <FarmDataInput 
              onSubmit={handleFarmDataSubmit} 
              currentSettings={farmSettings}
              onSettingsChange={setFarmSettings}
            />
          </DashboardCard>

          {/* Score Results Section */}
          <DashboardCard title="Farm Score Analysis" className="lg:col-span-2">
            {error ? (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            ) : showResults && farmScoreData ? (
              <FarmScoreResults 
                data={farmScoreData}
                showAnalysis={true}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Submit farm data to see analysis
                </p>
              </div>
            )}
          </DashboardCard>

          {/* Charts Section */}
          {showResults && (
            <>
              <DashboardCard title="Water Usage Trends" className="lg:col-span-3">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waterUsageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
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
                        dataKey="rainfall" 
                        stroke={COLORS.rainfall}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="irrigation" 
                        stroke={COLORS.irrigation}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              <DashboardCard title="Sustainability Metrics" className="lg:col-span-3">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sustainabilityData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {sustainabilityData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={Object.values(COLORS)[index]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: '#F3F4F6'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              {/* Advanced Metrics Section */}
              <DashboardCard title="Advanced Farm Analytics" className="lg:col-span-3">
                <AdvancedMetrics data={simulationData} />
              </DashboardCard>

              {/* Growth Stage Progress Section */}
              <DashboardCard title="Crop Growth Progress" className="lg:col-span-3">
                <GrowthStageProgress 
                  cropData={CROP_DATA[farmSettings.cropType || 'wheat']}
                  currentDay={growthDays}
                  cropType={farmSettings.cropType || 'wheat'}
                />
                {growthSimulation && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Growth Summary
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {growthSimulation.status}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Days Elapsed</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {growthSimulation.daysElapsed}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Days Remaining</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {growthSimulation.daysRemaining}
                        </p>
                      </div>
                    </div>
                    {growthSimulation.recommendations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Recommendations:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                          {growthSimulation.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </DashboardCard>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewFarmDashboard;