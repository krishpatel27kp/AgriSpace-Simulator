import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const MetricCard = ({ title, value, unit, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800 rounded-xl p-6 shadow-lg"
  >
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-gray-400 font-medium">{title}</h3>
    </div>
    <div className={`text-3xl font-bold ${color}`}>
      {value}
      <span className="text-base ml-1 text-gray-400">{unit}</span>
    </div>
  </motion.div>
);

const RecommendationCard = ({ title, recommendations }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800 rounded-xl p-6 shadow-lg"
  >
    <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
    <ul className="space-y-3">
      {recommendations.map((rec, index) => (
        <li key={index} className="flex items-start gap-3 text-gray-300">
          <span className="text-green-400">•</span>
          {rec}
        </li>
      ))}
    </ul>
  </motion.div>
);

const FarmResults = ({ data }) => {
  const {
    cropType,
    soilType,
    farmSize,
    sustainablePractices = [],
    yieldScore = 0,
    sustainabilityScore = 0,
    waterEfficiency = 0,
    recommendations = []
  } = data || {};

  const pieData = [
    { name: 'Yield Score', value: yieldScore, color: '#FCD34D' },
    { name: 'Sustainability', value: sustainabilityScore, color: '#34D399' },
    { name: 'Water Efficiency', value: waterEfficiency, color: '#60A5FA' }
  ];

  // Mock growth prediction data - replace with actual calculations
  const growthData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    predicted: Math.min(100, yieldScore * (1 + i * 0.1)),
    optimal: 85 + Math.sin(i * 0.5) * 10
  }));

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Farm Analysis Results</h2>
          <p className="text-gray-400">
            Detailed analysis and recommendations for your {farmSize} hectare {cropType} farm
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Farm Score"
            value={Math.round((yieldScore + sustainabilityScore + waterEfficiency) / 3)}
            unit="/100"
            icon="🌟"
            color="text-yellow-400"
          />
          <MetricCard
            title="Sustainability"
            value={sustainabilityScore}
            unit="%"
            icon="🌱"
            color="text-green-400"
          />
          <MetricCard
            title="Water Efficiency"
            value={waterEfficiency}
            unit="%"
            icon="💧"
            color="text-blue-400"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Performance Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Growth Prediction</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
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
                    dataKey="predicted"
                    stroke="#34D399"
                    name="Predicted Growth"
                  />
                  <Line
                    type="monotone"
                    dataKey="optimal"
                    stroke="#60A5FA"
                    name="Optimal Growth"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Farm Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Farm Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Crop Type:</span>
                <span className="font-medium text-white">{cropType}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Soil Type:</span>
                <span className="font-medium text-white">{soilType}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Farm Size:</span>
                <span className="font-medium text-white">{farmSize} hectares</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Sustainable Practices:</span>
                <span className="font-medium text-white">{sustainablePractices.length}</span>
              </div>
            </div>
          </motion.div>

          <RecommendationCard
            title="Recommendations"
            recommendations={recommendations}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.dispatchEvent(new CustomEvent('changePage', { detail: 'dashboard' }))}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.dispatchEvent(new CustomEvent('changePage', { detail: 'simulator' }))}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Run Simulation
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FarmResults;