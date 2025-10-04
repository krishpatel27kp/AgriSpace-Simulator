import React, { useState } from 'react';
import { simulateFarming } from '../utils/farmSimulator';

const FarmingDecisionPanel = ({ 
  onSimulate, 
  weatherData,
  settings,
  onSettingsChange 
}) => {
  const [result, setResult] = useState(null);

  const calculateYield = () => {
    if (!weatherData) {
      setResult({
        error: "Please select a location on the map to get weather data first."
      });
      return;
    }

    // Prepare parameters for simulation
    const params = {
      temperature: weatherData.TEMP2M || 20,
      rainfall: weatherData.PRECTOTCORR || 0,
      irrigation: settings.irrigation,
      fertilizer: settings.fertilizer
    };

    // Use the parent's onSimulate to ensure consistent state management
    let simulationResult;
    if (onSimulate) {
      simulationResult = onSimulate(params);
    } else {
      simulationResult = simulateFarming({
        ...params,
        cropType: 'wheat',
        soilType: 'loam'
      });
    }

    if (simulationResult.success) {
      const {
        yieldScore,
        sustainabilityScore,
        carbonFootprint,
        waterEfficiency,
        recommendations = [],
        details = {}
      } = simulationResult.data;
      
      // Determine severity color coding
      const getColorClasses = (severity) => {
        switch (severity) {
          case 'high':
            return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
          case 'medium':
            return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
          default:
            return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
        }
      };

      const processedRecommendations = recommendations.map(rec => ({
        ...rec,
        colorClasses: getColorClasses(rec.severity)
      }));

      setResult({
        yield: yieldScore,
        sustainabilityScore,
        waterEfficiency,
        carbonFootprint,
        scoreColor: sustainabilityScore >= 75 ? 'text-green-500 dark:text-green-400' :
                   sustainabilityScore >= 50 ? 'text-yellow-500 dark:text-yellow-400' :
                   'text-red-500 dark:text-red-400',
        recommendations: processedRecommendations,
        details
      });
    } else {
      setResult({
        error: simulationResult.error || "Failed to simulate farming conditions."
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 transition-colors duration-200">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Farming Decisions</h3>
      
      {/* Irrigation Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Irrigation Level: {settings.irrigation}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.irrigation}
          onChange={(e) => onSettingsChange({ ...settings, irrigation: parseInt(e.target.value) })}
          className="w-full slider-light dark:slider-dark"
        />
      </div>

      {/* Fertilizer Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Fertilizer Amount: {settings.fertilizer}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.fertilizer}
          onChange={(e) => onSettingsChange({ ...settings, fertilizer: parseInt(e.target.value) })}
          className="w-full slider-light dark:slider-dark"
        />
      </div>

      {/* Simulate Button */}
      <button
        onClick={calculateYield}
        className="w-full btn-primary-light dark:btn-primary-dark"
      >
        Simulate Yield
      </button>

      {/* Results Card */}
      {result && (
        <div className="mt-6 bg-gradient-to-br from-white dark:from-gray-800 to-gray-50 dark:to-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          {result.error ? (
            <div className="p-4">
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Error</h4>
                <p>{result.error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">Farming Simulation Results</h4>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500 dark:text-yellow-400">🌾</span>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Expected Yield</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {result.yield.toLocaleString()} 
                      <span className="text-base font-normal text-gray-500 dark:text-gray-400 ml-1">kg/ha</span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-500 dark:text-green-400">🌿</span>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sustainability Score</p>
                    </div>
                    <p className={`text-2xl font-bold flex items-center gap-2 ${result.scoreColor}`}>
                      {result.sustainabilityScore}%
                    </p>
                  </div>
                </div>

                {/* Specific Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                      Agronomic Recommendations
                    </h5>
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className={`p-4 rounded-lg ${rec.colorClasses || ''} transition-colors duration-200`}>
                        <div className="flex items-start gap-3">
                          <span className="text-xl mt-1">
                            {rec.severity === 'high' ? '⚠️' : rec.severity === 'medium' ? '💡' : 'ℹ️'}
                          </span>
                          <div>
                            <p className="font-medium mb-1">
                              {rec.type === 'temperature_high' && 'Temperature Too High'}
                              {rec.type === 'temperature_low' && 'Temperature Too Low'}
                              {rec.type === 'water_deficit' && 'Water Deficit'}
                              {rec.type === 'water_excess' && 'Excess Water'}
                              {rec.type === 'fertilizer_adjustment' && 'Fertilizer Adjustment Needed'}
                            </p>
                            <p className="text-sm">{rec.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmingDecisionPanel;