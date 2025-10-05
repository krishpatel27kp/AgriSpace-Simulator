
import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { FaExclamationTriangle } from 'react-icons/fa';
import {
  calculateCropSuitability,
  calculatePlantingRisk,
  predictWeatherPatterns,
  calculateFertilizerNeeds,
  CROP_WATER_REQUIREMENTS
} from '../utils/advancedCropAnalysis';
import { calculateYieldPotential, calculateGrowthStage } from '../utils/growthStageLogic';
import RiskIndicator from './RiskIndicator';
import WeatherPrediction from './WeatherPrediction';
import CropRecommendations from './CropRecommendations';
import FertilizerRecommendations from './FertilizerRecommendations';

const AdvancedCropAnalysis = ({ weatherData, cropType, soilConditions }) => {
  // Farmer-friendly introduction text
  const cropRecommendations = calculateCropSuitability(weatherData, soilConditions);

  // Dynamic water consumption per acre for the top three recommended crops
  const localRainfall = weatherData?.current?.rainfall ?? 0; // mm/month
  const topThreeRecommendations = cropRecommendations.slice(0, 3).map(rec => rec.crop);
  const waterAnalysis = topThreeRecommendations.map(crop => {
    const waterReq = CROP_WATER_REQUIREMENTS[crop?.toLowerCase()];
    if (!waterReq) return null;
    const rainfallLitersPerHectare = localRainfall * 10000;
    const minAdjusted = Math.max(0, waterReq.waterPerHectare.min - rainfallLitersPerHectare);
    const maxAdjusted = Math.max(0, waterReq.waterPerHectare.max - rainfallLitersPerHectare);
    return {
      crop,
      min: Math.round(minAdjusted / 2.47105),
      max: Math.round(maxAdjusted / 2.47105),
      rainfall: localRainfall,
      irrigationFrequency: waterReq.irrigationFrequency
    };
  }).filter(Boolean);
  // Farmer-friendly introduction text
  const plantingRisk = calculatePlantingRisk(weatherData, cropType, soilConditions);
  const riskLabels = Object.keys(plantingRisk.details);
  const riskValues = Object.values(plantingRisk.details);
  const weatherPrediction = predictWeatherPatterns(weatherData.historical, weatherData.current);
  const fertilizerRecommendations = calculateFertilizerNeeds(soilConditions, cropType, 5); // 5 tons/ha target yield


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-green-900 rounded-xl p-6 shadow-lg mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Advanced AI Analysis for Farmers</h2>
        <p className="text-lg text-green-200 mb-2">
          This section uses advanced AI to help you make better decisions for your farm. You will find easy-to-understand advice about when to plant, which crops are best for your soil and weather, and what fertilizers to use for healthy growth.
        </p>
        <ul className="list-disc pl-6 text-green-100">
          <li>Planting Risk Assessment: See if it's a good time to plant and what risks you should watch out for.</li>
          <li>Weather Forecast: Get a simple 30-day weather outlook to plan your activities.</li>
          <li>Recommended Crops: Find out which crops will grow best on your land right now.</li>
          <li>Fertilizer Advice: Learn which fertilizers will help your crops grow strong and healthy.</li>
        </ul>
        <p className="mt-2 text-green-200">All recommendations are tailored for your farm's location and soil, so you can farm with confidence!</p>
      </div>

      {waterAnalysis.length > 0 && (
        <div className="bg-blue-900 rounded-xl p-6 shadow-lg mb-4">
          <h2 className="text-xl font-bold text-white mb-2">Water Consumption Analysis</h2>
          <p className="text-blue-200 mb-2">
            Estimated water usage per acre (monthly) for recommended crops:
          </p>
          {weatherData?.current?.dateRange && (
            <p className="text-xs text-blue-300 mb-2">
              Data averaged from NASA POWER for last 30 days: <br />
              <span className="font-mono">{weatherData.current.dateRange.start} to {weatherData.current.dateRange.end}</span>
            </p>
          )}
          <div className="space-y-2">
            {waterAnalysis.map((wa, idx) => (
              <div key={wa.crop} className="text-white">
                <span className="font-bold">{wa.crop}:</span> {wa.min.toLocaleString()} - {wa.max.toLocaleString()} liters/acre
                <span className="text-blue-300 text-base"> (after local rainfall: {wa.rainfall}mm)</span>
                <span className="block text-xs text-blue-200">Irrigation Frequency: {wa.irrigationFrequency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="mb-4">
            <Line
              data={{
                labels: riskLabels,
                datasets: [
                  {
                    label: 'Risk Score',
                    data: riskValues,
                    borderColor: '#F59E42',
                    backgroundColor: 'rgba(245,158,66,0.2)',
                    tension: 0.4
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: { legend: { labels: { color: '#fff' } } },
                scales: {
                  x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(75,85,99,0.2)' } },
                  y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(75,85,99,0.2)' } }
                }
              }}
            />
          </div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            Planting Risk Assessment (Easy Guide)
          </h3>
          <p className="text-green-200 mb-2">
            This section tells you if it is safe to plant your crops right now. The risk score below shows how risky it is to plant. A low score means it is safe, a high score means you should wait or take care.
          </p>
          <div className="mb-2">
            <span className="font-semibold text-white">Overall Planting Risk:</span>
            <RiskIndicator score={plantingRisk.score} />
          </div>
          <div className="mt-4 space-y-2">
            {Object.entries(plantingRisk.details).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-700/40 rounded-lg p-3 mb-2 shadow-sm border-l-4"
                style={{ borderColor: value < 30 ? '#14b8a6' : value < 60 ? '#fb923c' : '#fb7185' }}
              >
                <div className="flex items-center gap-2 mb-2 md:mb-0">
                  {key === 'frost' && <span className="text-blue-300 text-lg">❄️</span>}
                  {key === 'drought' && <span className="text-yellow-400 text-lg">🌵</span>}
                  {key === 'disease' && <span className="text-red-400 text-lg">🦠</span>}
                  {key === 'pests' && <span className="text-green-400 text-lg">🐛</span>}
                  {key === 'soil' && <span className="text-brown-400 text-lg">🌱</span>}
                  <span className="capitalize font-medium">
                    <span style={{ color: 'white' }}>
                      {
                        key === 'frost' ? 'Frost Risk (cold damage)' :
                        key === 'drought' ? 'Drought Risk (not enough rain)' :
                        key === 'disease' ? 'Disease Risk (crop sickness)' :
                        key === 'pests' ? 'Pest Risk (bugs and insects)' :
                        key === 'soil' ? 'Soil Risk (pH problem)' :
                        key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      }
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <RiskIndicator score={Number(value).toFixed(2)} />
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      value < 30 ? 'bg-teal-600 text-white' :
                      value < 60 ? 'bg-orange-400 text-white' :
                      'bg-rose-500 text-white'
                    }`}
                  >
                    {Number(value).toFixed(2)} - {
                      value < 30 ? 'Low risk (safe)' :
                      value < 60 ? 'Medium risk (be careful)' :
                      'High risk (watch out!)'
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
          {plantingRisk.recommendation && (
            <div className="mt-4 p-3 bg-green-900/50 rounded-lg text-green-200">
              <span className="font-semibold">Advice:</span> {plantingRisk.recommendation}
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <WeatherPrediction data={weatherPrediction} />
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <CropRecommendations recommendations={cropRecommendations} />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <FertilizerRecommendations recommendations={fertilizerRecommendations} />
      </div>
    </motion.div>
  );
};

export default AdvancedCropAnalysis;