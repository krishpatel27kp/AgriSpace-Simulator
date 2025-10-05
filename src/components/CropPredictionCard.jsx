import React from 'react';
import { FaWater, FaSeedling, FaLeaf, FaSun, FaThermometerHalf } from 'react-icons/fa';

export const CropPredictionCard = ({ predictions, selectedCrop }) => {
  if (!predictions) return null;

  const getScoreColor = (score) => {
    if (score >= 0.8) return "text-green-500";
    if (score >= 0.6) return "text-blue-500";
    if (score >= 0.4) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaLeaf className="text-green-500" />
  Advanced AI Analysis
      </h3>

      {/* Irrigation Needs */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FaWater className="text-blue-500" />
          Water Requirements
        </h4>
        <div className="pl-6 space-y-2">
          <p className="text-sm">
            <span className="font-medium">Basic Estimate: </span>
            <span className="text-blue-600">{predictions.irrigationNeed} mm/day</span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Advanced Estimate: </span>
            <span className="text-blue-600">{predictions.advancedWaterNeed} mm/day</span>
          </p>
        </div>
      </div>

      {/* Crop Suitability */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FaSeedling className="text-green-500" />
          Crop Suitability Analysis
        </h4>
        <div className="pl-6 space-y-3">
          {predictions.allCropScores.map((crop) => (
            <div key={crop.name} className="flex items-center justify-between">
              <span className={`text-sm ${crop.name === selectedCrop ? 'font-semibold' : ''}`}>
                {crop.name}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <FaThermometerHalf className="text-gray-500" />
                  <span className={getScoreColor(crop.details.tempScore)}>
                    {(crop.details.tempScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <FaWater className="text-gray-500" />
                  <span className={getScoreColor(crop.details.rainScore)}>
                    {(crop.details.rainScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <FaSun className="text-gray-500" />
                  <span className={getScoreColor(crop.details.solarScore)}>
                    {(crop.details.solarScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2">Top Recommendations</h4>
        <p className="text-green-700 text-sm">
          Best suited crops for current conditions: {' '}
          <span className="font-semibold">
            {predictions.bestCrops.map(c => c.name).join(', ')}
          </span>
        </p>
      </div>
    </div>
  );
};