import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts';

const SimulationResults = ({ data, dailyStats, environmentalData }) => {
  // Format daily stats for the area chart
  const growthData = dailyStats.map((stat, index) => ({
    day: index + 1,
    growth: stat.growth,
    health: stat.health,
    stress: stat.stress
  }));

  // Format environmental impact data for radar chart
  const environmentalMetrics = [
    { metric: 'Water Efficiency', value: environmentalData.waterEfficiency },
    { metric: 'Soil Health', value: environmentalData.soilHealth },
    { metric: 'Biodiversity', value: environmentalData.biodiversity },
    { metric: 'Carbon Impact', value: 100 - environmentalData.carbonFootprint },
    { metric: 'Pest Resistance', value: 100 - environmentalData.pestRisk }
  ];

  return (
    <div className="space-y-6">
      {/* Growth Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Growth Progress
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Area
                type="monotone"
                dataKey="growth"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="health"
                stackId="2"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="stress"
                stackId="3"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Environmental Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Environmental Impact
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={environmentalMetrics}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: '#6B7280' }}
              />
              <PolarRadiusAxis stroke="#6B7280" />
              <Radar
                name="Environmental Metrics"
                dataKey="value"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Yield Prediction
          </h4>
          <div className="text-3xl font-bold text-green-500">
            {data.yieldPrediction}%
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            of optimal yield
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Growth Stage
          </h4>
          <div className="text-2xl font-bold text-blue-500">
            {data.currentStage}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Day {data.dayInStage} of {data.stageDuration}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Health Status
          </h4>
          <div className="text-2xl font-bold text-yellow-500">
            {data.healthStatus}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {data.healthMessage}
          </p>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Recommendations
        </h3>
        <ul className="space-y-2">
          {data.recommendations.map((rec, index) => (
            <li
              key={index}
              className="flex items-start space-x-2 text-gray-600 dark:text-gray-300"
            >
              <span className="text-green-500">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default SimulationResults;