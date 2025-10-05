import React from 'react';
import { Line } from 'react-chartjs-2';

const WeatherChart = ({ data, label, color }) => (
  <Line
    data={{
      labels: data.dailyPredictions.map((d, i) => `Day ${i + 1}`),
      datasets: [{
        label,
        data: data.dailyPredictions.map(d => d[label.toLowerCase()]),
        borderColor: color,
        backgroundColor: `${color}33`,
        tension: 0.4
      }]
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
);

export default WeatherChart;