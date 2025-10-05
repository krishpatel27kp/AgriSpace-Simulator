import React from 'react';
import { Line } from 'react-chartjs-2';
import { FaChartLine } from 'react-icons/fa';

const WeatherPrediction = ({ data }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <FaChartLine className="text-blue-500" />
        30-Day Weather Forecast
      </h3>
      <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
        <h4 className="text-lg font-semibold text-blue-400 mb-2">Temperature (°C)</h4>
        <Line
          data={{
            labels: data.dailyPredictions.map((d, i) => `Day ${i + 1}`),
            datasets: [
              {
                label: 'Temperature (°C)',
                data: data.dailyPredictions.map(d => d.temperature),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59,130,246,0.2)',
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
      <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
        <h4 className="text-lg font-semibold text-green-400 mb-2">Rainfall (mm)</h4>
        <Line
          data={{
            labels: data.dailyPredictions.map((d, i) => `Day ${i + 1}`),
            datasets: [
              {
                label: 'Rainfall (mm)',
                data: data.dailyPredictions.map(d => d.rainfall),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16,185,129,0.2)',
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
      <div className="bg-gray-700/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Average Temperature</span>
          <span className="text-white font-semibold">{data.summary.averageTemp}°C</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Total Rainfall</span>
          <span className="text-white font-semibold">{data.summary.totalRainfall}mm</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Rain Days</span>
          <span className="text-white font-semibold">{data.summary.rainDays} days</span>
        </div>
      </div>
      <div className="mt-4 p-3 bg-green-900/50 rounded-lg text-green-200">
        <span className="font-semibold">Recommendation:</span>
        {data.summary.averageTemp > 30 ? " High temperature expected, ensure proper irrigation and shade for crops." :
        data.summary.averageTemp < 15 ? " Low temperature expected, consider protective measures for young plants." :
        data.summary.totalRainfall < 50 ? " Low rainfall predicted, plan for additional irrigation." :
        data.summary.rainDays > 20 ? " Many rainy days ahead, monitor for waterlogging and crop diseases." :
        " Weather conditions are favorable for most crops."}
      </div>
    </div>
  );
};

export default WeatherPrediction;