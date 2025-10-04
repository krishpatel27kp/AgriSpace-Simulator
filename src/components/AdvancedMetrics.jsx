import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const AdvancedMetrics = ({ data }) => {
  const {
    carbonFootprint = 0,
    biodiversityScore = 0,
    pestRisk = 0,
    sustainabilityScore = 0
  } = data?.advancedMetrics || {};

  const radarData = [
    { metric: 'Carbon Efficiency', value: 100 - carbonFootprint },
    { metric: 'Biodiversity', value: biodiversityScore },
    { metric: 'Pest Resistance', value: 100 - pestRisk },
    { metric: 'Sustainability', value: sustainabilityScore },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Advanced Farm Metrics
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Carbon Footprint</p>
          <p className={`text-2xl font-bold ${getScoreColor(100 - carbonFootprint)}`}>
            {carbonFootprint.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Biodiversity</p>
          <p className={`text-2xl font-bold ${getScoreColor(biodiversityScore)}`}>
            {biodiversityScore.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Pest Risk</p>
          <p className={`text-2xl font-bold ${getScoreColor(100 - pestRisk)}`}>
            {pestRisk.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Sustainability</p>
          <p className={`text-2xl font-bold ${getScoreColor(sustainabilityScore)}`}>
            {sustainabilityScore.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Radar
              name="Farm Metrics"
              dataKey="value"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdvancedMetrics;