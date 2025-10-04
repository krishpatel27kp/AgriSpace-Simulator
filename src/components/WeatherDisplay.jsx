import React from 'react';

const WeatherMetric = ({ icon, label, value, unit }) => (
  <div className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 transition-colors duration-200">
    <div className="text-2xl">{icon}</div>
    <div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
      <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {value.toFixed(1)} {unit}
      </div>
    </div>
  </div>
);

const WeatherDisplay = ({ data }) => {
  const metrics = [
    {
      icon: "🌡️",
      label: "Temperature",
      value: data.temperature,
      unit: "°C"
    },
    {
      icon: "🌧️",
      label: "Rainfall",
      value: data.rainfall,
      unit: "mm/day"
    },
    {
      icon: "☀️",
      label: "Solar Radiation",
      value: data.solarRadiation,
      unit: "kW⋅h/m²/day"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Weather Conditions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <WeatherMetric key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default WeatherDisplay;