import React from 'react';
import { motion } from 'framer-motion';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GrowthStageProgress = ({ cropData, currentDay = 0, cropType = 'wheat' }) => {
  const stages = ['germination', 'vegetative', 'flowering', 'maturity'];
  const stageColors = {
    germination: 'bg-green-200',
    vegetative: 'bg-green-400',
    flowering: 'bg-yellow-400',
    maturity: 'bg-amber-600'
  };

  // Calculate total days and progress
  const totalDays = cropData?.totalGrowthDays || 120;
  const progress = (currentDay / totalDays) * 100;

  // Helper to get duration from start/end
  const getStageDuration = (stageData) => {
    if (!stageData) return 0;
    return (stageData.end - stageData.start + 1);
  };

  // Determine current stage
  const getCurrentStage = (day) => {
    for (const stage of stages) {
      const stageData = cropData?.growthStages[stage];
      if (!stageData) continue;
      if (day >= stageData.start && day <= stageData.end) return stage;
    }
    return 'maturity';
  };

  const currentStage = getCurrentStage(currentDay);

  // Generate growth data for chart
  const getGrowthData = () => {
    let data = [];
    let accumulatedDays = 0;
    let accumulatedGrowth = 0;

    stages.forEach(stage => {
      const stageData = cropData?.growthStages[stage];
      const duration = getStageDuration(stageData);
      const growthRate = stageData?.sensitivity || 1;
      for (let day = 1; day <= duration; day++) {
        accumulatedDays++;
        accumulatedGrowth += growthRate;
        if (accumulatedDays % 5 === 0 || accumulatedDays === totalDays) {
          data.push({
            day: accumulatedDays,
            growth: (accumulatedGrowth / totalDays) * 100
          });
        }
      }
    });
    return data;
  };

  const growthData = getGrowthData();

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Growth Progress</span>
          <span>{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
          {stages.map((stage, index) => {
            const stageData = cropData?.growthStages[stage];
            const stageWidth = ((getStageDuration(stageData)) / totalDays) * 100;
            return (
              <div
                key={stage}
                className={`h-full ${stageColors[stage]} ${
                  currentStage === stage ? 'relative overflow-hidden' : ''
                }`}
                style={{
                  width: `${stageWidth}%`,
                  float: 'left',
                  transition: 'all 0.3s ease'
                }}
              >
                {currentStage === stage && (
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    animate={{ x: ['0%', '100%'] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Information */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Current Stage: {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}
        </h3>
        <p className="text-gray-600 mb-3">
          {cropData?.growthStages[currentStage]?.description}
        </p>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Health Indicators:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
            {cropData?.growthStages[currentStage]?.healthIndicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              label={{ value: 'Days', position: 'bottom' }}
              stroke="#6b7280"
            />
            <YAxis
              label={{ value: 'Growth %', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}
            />
            <Line
              type="monotone"
              dataKey="growth"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthStageProgress;