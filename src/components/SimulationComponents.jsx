import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';

const ProgressBar = ({ value, label }) => (
  <div className="w-full bg-gray-700 rounded-full h-4 my-2">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.5 }}
      className="h-full bg-green-500 rounded-full"
      style={{ width: `${value}%` }}
    />
    <p className="text-sm text-gray-400 mt-1">{label}</p>
  </div>
);

const GrowthChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => `Day ${d.day}`),
    datasets: [
      {
        label: 'Growth Progress',
        data: data.map(d => d.growth),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: '#374151'
        }
      },
      x: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: '#374151'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF'
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

const FarmerBadge = ({ score, badge, level }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="flex items-center space-x-2 bg-gray-700 p-4 rounded-lg"
  >
    <span className="text-4xl">{badge}</span>
    <div>
      <h4 className="text-white font-medium">{level} Farmer</h4>
      <p className="text-sm text-gray-400">Score: {score}/10</p>
    </div>
  </motion.div>
);

const SimulationSummary = ({ cropType, days, yieldPrediction, harvestDate }) => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <h4 className="text-white font-medium mb-2">Simulation Summary</h4>
    <p className="text-gray-300">
      At current settings, {cropType} will reach maturity in ~{days} days 
      with an expected yield of {yieldPrediction.toFixed(1)} tons/ha.
    </p>
    <p className="text-sm text-gray-400 mt-1">
      Estimated harvest: {harvestDate}
    </p>
  </div>
);

export { ProgressBar, GrowthChart, FarmerBadge, SimulationSummary };