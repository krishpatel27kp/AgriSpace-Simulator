import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GrowthAnalysis = ({ farmSettings }) => {
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    // Generate growth data based on current settings
    const generateGrowthData = () => {
      const data = [];
      const weeks = 12; // 3 months simulation
      const baseGrowth = 100; // Maximum potential growth
      
      const waterImpact = farmSettings.waterEfficiency / 100;
      const fertilizerImpact = farmSettings.fertilizerEfficiency / 100;
      const overallEfficiency = (waterImpact + fertilizerImpact) / 2;

      for (let week = 0; week < weeks; week++) {
        // Calculate growth rate based on current settings
        const growthRate = baseGrowth * overallEfficiency;
        
        // Add random variation (±10%)
        const variation = (Math.random() * 0.2) - 0.1;
        
        // Calculate actual growth with S-curve pattern
        const normalizedTime = week / weeks;
        const sigmoid = 1 / (1 + Math.exp(-10 * (normalizedTime - 0.5)));
        const actualGrowth = growthRate * sigmoid * (1 + variation);

        // Calculate resource usage
        const waterUsage = farmSettings.irrigation * (1 + (Math.sin(week / 2) * 0.2));
        const nutrientLevel = farmSettings.fertilizer * (1 - (week / weeks) * 0.3);

        data.push({
          week: `Week ${week + 1}`,
          growth: Math.round(actualGrowth),
          waterUsage: Math.round(waterUsage),
          nutrientLevel: Math.round(nutrientLevel),
        });
      }

      setGrowthData(data);
    };

    generateGrowthData();
  }, [farmSettings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-white mb-6">Growth Analysis</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={growthData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="week"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
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
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Crop Growth"
            />
            <Line
              type="monotone"
              dataKey="waterUsage"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name="Water Usage"
            />
            <Line
              type="monotone"
              dataKey="nutrientLevel"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              name="Nutrient Level"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Growth Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <InsightCard
          title="Peak Growth"
          value={`${Math.max(...growthData.map(d => d.growth))}%`}
          color="green"
        />
        <InsightCard
          title="Avg Water Usage"
          value={`${Math.round(growthData.reduce((acc, d) => acc + d.waterUsage, 0) / growthData.length)}%`}
          color="blue"
        />
        <InsightCard
          title="Final Nutrient"
          value={`${growthData[growthData.length - 1]?.nutrientLevel || 0}%`}
          color="purple"
        />
      </div>
    </motion.div>
  );
};

const InsightCard = ({ title, value, color }) => {
  const colorClasses = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400'
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className={`text-xl font-bold ${colorClasses[color]}`}>{value}</div>
    </div>
  );
};

export default GrowthAnalysis;