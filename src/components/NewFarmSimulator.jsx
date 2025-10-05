import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CROP_DATA, calculateGrowthStage, calculateYieldPotential, calculateFarmerScore } from '../utils/growthStageLogic';

// Helper function to determine current season
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};
import { analyzeCropConditions, getGrowthStageRecommendations } from '../utils/cropAnalysis';
import { CropPredictionCard } from './CropPredictionCard';
import AdvancedCropAnalysis from './AdvancedCropAnalysis';
import { LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { 
  FaThermometerHalf, 
  FaCloudRain,
  FaSeedling, 
  FaLeaf,
  FaChartLine,
  FaSun,
  FaInfoCircle,
  FaRobot
} from 'react-icons/fa';
import { DashboardCard, MetricCard } from './common/DashboardComponents';
import { LoadingSpinner, LoadingDots } from './common/LoadingAnimations';
import { theme } from '../theme/colors';
import FarmMap from './FarmMap';
import { fetchNasaData } from '../utils/nasaApi';
import SimulationControls from './SimulationControls';

const getNDVIRecommendation = (ndvi) => {
  if (ndvi >= 0.7) {
    return {
      message: "Excellent growth, maintain current conditions.",
      status: "excellent",
      color: "bg-green-500"
    };
  } else if (ndvi >= 0.5) {
    return {
      message: "Healthy crop, maintain irrigation schedule.",
      status: "good",
      color: "bg-blue-500"
    };
  } else if (ndvi >= 0.3) {
    return {
      message: "Early growth stage detected. Consider applying fertilizer to boost growth.",
      status: "moderate",
      color: "bg-yellow-500"
    };
  } else {
    return {
      message: "Crop growth appears weak. Check irrigation system and soil conditions.",
      status: "weak",
      color: "bg-red-500"
    };
  }
};

const NDVIChart = ({ data }) => {
  const latestNDVI = data[data.length - 1]?.ndvi || 0;
  const recommendation = getNDVIRecommendation(latestNDVI);

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis domain={[0, 1]} stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Legend />
            <RechartsLine 
              type="monotone" 
              dataKey="ndvi" 
              name="NDVI"
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className={`p-4 rounded-lg ${recommendation.color} bg-opacity-20 border border-${recommendation.color.replace('bg-', '')}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${recommendation.color}`}></div>
          <p className="text-white">{recommendation.message}</p>
        </div>
      </div>
    </div>
  );
};

const GrowthChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => `Day ${d.day}`),
    datasets: [
      {
        label: 'Growth',
        data: data.map(d => d.growth ?? d.value),
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34,197,94,0.2)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#9CA3AF' },
        grid: { color: 'rgba(75, 85, 99, 0.2)' }
      },
      x: {
        ticks: { 
          color: '#9CA3AF',
          maxRotation: 45,
          minRotation: 45
        },
        grid: { color: 'rgba(75, 85, 99, 0.2)' }
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

const FarmSimulator = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [farmAnalysis, setFarmAnalysis] = useState({
    alerts: [],
    recommendations: [],
    growthStage: null,
    healthStatus: null
  });
  const [farmParams, setFarmParams] = useState({
    farmSizeHectares: 5,
    soilType: 'medium'
  });

  const handleLocationSelect = async (selectedLocation) => {
    setLocation(selectedLocation);
    setIsWeatherLoading(true);
    try {
      const data = await fetchNasaData({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng
      });
      
      const weatherInfo = {
        ...data,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      };
      
      setWeatherData(weatherInfo);
      
      // Calculate crop predictions
      const cropAnalysis = analyzeCropConditions(weatherInfo, selectedCrop);
      setPredictions(cropAnalysis);

      // Process weather data for basic metrics
      setFarmParams({
        ...farmParams,
        temperature: data.temperature || 0,
        rainfall: data.rainfall || 0,
        solarRadiation: data.solarRadiation || 0
      });
    } catch (err) {
      setError("Failed to fetch weather data: " + err.message);
      setWeatherData(null);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async (params) => {
    if (!weatherData) {
      setError("Weather data not available. Please select a location first.");
      return;
    }

    setIsSimulating(true);
    setError(null);
    
    try {
      const { runSimulation } = await import('../utils/simulationEngine');
      const { CROP_DATA } = await import('../utils/growthStageLogic');
      
      // Normalize crop type and validate
      const cropType = params.cropType?.toLowerCase() || 'wheat';
      if (!CROP_DATA[cropType]) {
        throw new Error(`Invalid crop type: ${cropType}`);
      }

      const results = runSimulation({
        ...params,
        cropType,
        crop: CROP_DATA[cropType],
        ...params,
        days: params.days || 30,
        crop: params.crop,
        cropType: params.cropType,
        temperature: weatherData.temperature,
        rainfall: weatherData.rainfall,
        solarRadiation: weatherData.solarRadiation,
        soilHealth: params.soilHealth || 80,
        irrigationLevel: params.irrigation || 50,
        fertilizerLevel: params.fertilizer || 50
      });
      
      setSimulationResults(results);
      
      // Update predictions with simulation results
      setPredictions({
        ...predictions,
        ndviData: results.dailyData.map(d => ({ day: d.day, ndvi: d.ndvi })),
        growthData: results.dailyData.map(d => ({ day: d.day, growth: d.growth })),
        yieldPotential: results.summary.yieldPotential,
        farmerScore: results.summary.farmerScore
      });
      
      // Update farm analysis with alerts
      if (results.alerts && results.alerts.length > 0) {
        setFarmAnalysis(prev => ({
          ...prev,
          alerts: results.alerts
        }));
      }

      // Log success for debugging
      console.log("Simulation completed successfully:", results);
      
    } catch (err) {
      console.error("Simulation error:", err);
      setError(err.message || "Failed to run simulation");
    } finally {
      setIsSimulating(false);
    }
    setLoading(true);
    setError(null);
    try {
      const dailyResults = [];
      const days = params.days;

      // Generate daily simulation results
      for (let day = 1; day <= days; day++) {
        const yieldResult = calculateYieldPotential({
          ...params,
          daysElapsed: day
        });

        // Simulate NDVI based on growth and environmental factors
        const ndvi = Math.min(
          0.95, 
          (yieldResult.percentage / 100) * 0.8 + 
          (params.soilHealth / 100) * 0.2 + 
          (Math.random() * 0.1 - 0.05)  // Small random variation
        );

        dailyResults.push({
          day,
          growth: yieldResult.percentage,
          health: Math.min(100, (yieldResult.percentage + (params.soilHealth * 0.8)) / 2),
          ndvi: Math.max(0, ndvi)  // Ensure NDVI is not negative
        });

        // Small delay for animation
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      // Calculate final results
      const finalYield = calculateYieldPotential({
        ...params,
        daysElapsed: days
      });

      const farmerScore = calculateFarmerScore({
        yieldPotential: finalYield.percentage,
        waterEfficiency: Math.min(100, (params.rainfall + params.irrigation) / 2),
        fertilizerEfficiency: params.fertilizer,
        sustainabilityScore: 100 - (params.pestRisk || 0)
      });

      const results = {
  dailyResults,
  yieldPrediction: finalYield,
  farmerScore,
  cropType: params.cropType || 'wheat',
  days,
  stage: calculateGrowthStage(params.cropType?.toLowerCase() || 'wheat', days),
  harvestDate: new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toLocaleDateString()
      };

      setSimulationData(results);
    } catch (error) {
      console.error('Simulation error:', error);
      setError(error.message || 'Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulation = (params) => {
    // Update farm parameters when simulation starts
    setFarmParams({
      farmSizeHectares: params.farmSizeHectares,
      soilType: params.soilType || 'medium'
    });
    runSimulation({
      ...params,
      farmSizeHectares: params.farmSizeHectares
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">AgriSpace Simulator</h2>
          <p className="mt-2 text-gray-400">
            Test different environmental conditions and monitor crop growth
          </p>
        </div>

        <div className="mb-8">
          <DashboardCard title="Location Selection" subtitle="Click on the map to fetch local weather data">
            <FarmMap onLocationSelect={handleLocationSelect} selectedLocation={location} />
            {isWeatherLoading ? (
              <div className="mt-4 flex items-center justify-center">
                <LoadingDots />
                <span className="ml-2 text-gray-400">Fetching weather data...</span>
              </div>
            ) : weatherData ? (
              <div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <MetricCard
                    icon={FaThermometerHalf}
                    label="Temperature"
                    value={weatherData?.temperature ? `${weatherData.temperature.toFixed(1)}°C` : 'N/A'}
                    subtitle={weatherData?.temperature < 20 ? 'Cool' : weatherData?.temperature > 30 ? 'Hot' : 'Moderate'}
                  />
                  <MetricCard
                    icon={FaCloudRain}
                    label="Rainfall"
                    value={weatherData?.rainfall ? `${weatherData.rainfall.toFixed(1)} mm/day` : 'N/A'}
                    subtitle={weatherData?.rainfall < 5 ? 'Low' : weatherData?.rainfall > 20 ? 'High' : 'Moderate'}
                  />
                  <MetricCard
                    icon={FaSun}
                    label="Solar Radiation"
                    value={weatherData?.solarRadiation ? `${weatherData.solarRadiation.toFixed(1)} W/m²` : 'N/A'}
                    subtitle={weatherData?.solarRadiation < 100 ? 'Low' : weatherData?.solarRadiation > 300 ? 'High' : 'Moderate'}
                  />
                </motion.div>
                {weatherData?.coordinates && (
                  <div className="mt-4 text-gray-400 text-sm text-center">
                    <p>Location: {weatherData.coordinates.lat.toFixed(4)}°, {weatherData.coordinates.lng.toFixed(4)}°</p>
                  </div>
                )}
                {/* 30-day weather forecast under the map */}
                {weatherData?.dailyPredictions && (
                  <div className="mt-8">
                    <WeatherPrediction data={weatherData} />
                  </div>
                )}
              </div>
            ) : null}
          </DashboardCard>
        </div>

        {weatherData && (
          <div className="mt-8">
            <DashboardCard 
              title="Advanced AI Analysis" 
              subtitle="Comprehensive farming recommendations powered by AI"
              icon={FaRobot}
            >
              <AdvancedCropAnalysis 
                weatherData={{
                  current: weatherData,
                  historical: weatherData ? [weatherData] : []
                }}
                cropType={selectedCrop}
                soilConditions={{
                  type: farmParams.soilType,
                  nitrogen: 40,
                  phosphorus: 30,
                  potassium: 20,
                  ph: 6.5,
                  organicMatter: 3
                }}
              />
            </DashboardCard>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SimulationControls 
            onSimulate={handleStartSimulation}
            selectedCrop={selectedCrop}
            onCropSelect={setSelectedCrop}
            disabled={loading} 
            weatherData={weatherData}
          />

          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Running Simulation...</h3>
              <LoadingSpinner />
              <LoadingDots />
            </motion.div>
          ) : error ? (
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-red-500 mb-4">Simulation Error</h3>
              <p className="text-gray-400">{error}</p>
            </div>
          ) : simulationData ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Simulation Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-200 mb-3">Growth Progress</h4>
                  <GrowthChart data={simulationData.dailyResults} />
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-200 mb-3">NDVI Analysis</h4>
                  <NDVIChart data={simulationData.dailyResults} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <FaChartLine className="text-green-500 text-2xl" />
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">Yield Potential</span>
                  </div>
                  <div className="w-full flex flex-col items-center">
                    <span className="text-3xl font-bold text-green-600 mb-1">
                      {Number.isFinite(simulationData.yieldPrediction?.percentage)
                        ? `${simulationData.yieldPrediction.percentage.toFixed(1)}%`
                        : 'N/A'}
                    </span>
                    <span className="text-base text-gray-500 dark:text-gray-300 mb-2">
                      {Number.isFinite(simulationData.yieldPrediction?.tons)
                        ? `${(simulationData.yieldPrediction.tons / 2.47105).toFixed(2)} tons/acre`
                        : ''}
                    </span>
                    <div className="w-full mt-2">
                      <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="absolute top-0 left-0 h-4 rounded-full bg-green-500"
                          style={{ width: `${simulationData.yieldPrediction?.percentage ?? 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs text-gray-400">Trend:</span>
                    <span className="text-xs font-semibold text-green-500">{Number.isFinite(simulationData.yieldPrediction?.trend) ? simulationData.yieldPrediction.trend : 0}</span>
                  </div>
                </div>
                <MetricCard
                  icon={FaLeaf}
                  label="Farmer Score"
                  value={simulationData.farmerScore ? `${simulationData.farmerScore.toFixed(1)}%` : 'N/A'}
                />
              </div>
              {/* More actionable recommendations */}
              <div className="mt-8 bg-green-900/40 rounded-lg p-6">
                <h4 className="text-lg font-bold text-green-200 mb-2">Additional Recommendations</h4>
                <ul className="list-disc pl-6 text-green-100 space-y-2">
                  <li>Maintain regular irrigation, especially during dry spells.</li>
                  <li>Apply balanced fertilizer based on soil test results for optimal growth.</li>
                  <li>Monitor for pests and diseases; use integrated pest management if needed.</li>
                  <li>Check soil pH and organic matter; amend soil if values are outside ideal range.</li>
                  <li>Rotate crops next season to improve soil health and reduce pest risk.</li>
                  <li>Use mulch to conserve moisture and suppress weeds.</li>
                  <li>Keep records of farm activities for better planning and analysis.</li>
                </ul>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FarmSimulator;