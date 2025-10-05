import React, { useState } from 'react';import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';import { motion } from 'framer-motion';

import { CROP_DATA, calculateGrowthStage, calculateYieldPotential, calculateFarmerScore } from '../utils/growthStageLogic';import { simulateFarming } from '../utils/agronomicLogic';

import { ProgressBar, GrowthChart, FarmerBadge, SimulationSummary } from './SimulationComponents';import { CROP_DATA, calculateGrowthStage, calculateYieldPotential, generateGrowthSummary } from '../utils/growthStageLogic';

import GrowthStageProgress from './GrowthStageProgress';

const SimulationControls = ({ onSimulate, disabled = false }) => {import SimulationResults from './SimulationResults';

  const [settings, setSettings] = useState({

    temperature: 20,const SimulationControls = ({ onSimulate, disabled = false }) => {

    rainfall: 50,  const [settings, setSettings] = useState({

    cropType: 'wheat',    temperature: 20,

    soilType: 'loam',    rainfall: 50,

    irrigation: 50,    cropType: 'wheat',

    fertilizer: 50,    soilType: 'loam',

    days: 30,    irrigation: 50,

    soilHealth: 80,    fertilizer: 50,

    pestRisk: 20    days: 30,

  });    soilHealth: 80,

    pestRisk: 20

  const handleChange = (key, value) => {  });

    setSettings(prev => ({ ...prev, [key]: value }));

  };  const handleChange = (key, value) => {

    setSettings(prev => ({ ...prev, [key]: value }));

  return (  };

    <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">

      <h3 className="text-xl font-bold text-white">Simulation Controls</h3>  return (

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">

      {/* Crop Selection and Days */}      <h3 className="text-xl font-bold text-white mb-4">Simulation Controls</h3>

      <div className="space-y-4">      

        <div>      {/* Crop Selection */}

          <label className="block text-gray-300 text-sm font-medium mb-2">      <div className="mb-4">

            Crop Type        <label className="block text-gray-300 text-sm font-medium mb-2">

          </label>          Crop Type

          <select        </label>

            value={settings.cropType}        <select

            onChange={(e) => handleChange('cropType', e.target.value)}          value={settings.cropType}

            className="w-full bg-gray-700 text-white rounded-md p-2"          onChange={(e) => handleChange('cropType', e.target.value)}

          >          className="w-full bg-gray-700 text-white rounded-md p-2"

            {Object.entries(CROP_DATA).map(([value, data]) => (        >

              <option key={value} value={value}>{data.name}</option>          <option value="wheat">Wheat</option>

            ))}          <option value="rice">Rice</option>

          </select>          <option value="corn">Corn</option>

        </div>        </select>

      </div>

        <div>

          <label className="block text-gray-300 text-sm font-medium mb-2">      {/* Soil Type */}

            Simulation Days: {settings.days} days      <div className="mb-4">

          </label>        <label className="block text-gray-300 text-sm font-medium mb-2">

          <input          Soil Type

            type="range"        </label>

            min="0"        <select

            max="120"          value={settings.soilType}

            value={settings.days}          onChange={(e) => handleChange('soilType', e.target.value)}

            onChange={(e) => handleChange('days', Number(e.target.value))}          className="w-full bg-gray-700 text-white rounded-md p-2"

            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"        >

          />          <option value="loam">Loam (Balanced)</option>

          <div className="flex justify-between text-xs text-gray-400 mt-1">          <option value="clay">Clay (Water Retentive)</option>

            <span>Start</span>          <option value="sandy">Sandy (Well Draining)</option>

            <span>30d</span>        </select>

            <span>60d</span>      </div>

            <span>90d</span>

            <span>120d</span>      {/* Temperature Control */}

          </div>      <div className="mb-4">

        </div>        <label className="block text-gray-300 text-sm font-medium mb-2">

      </div>          Temperature (°C): {settings.temperature}°C

        </label>

      {/* Environmental Controls */}        <input

      <div className="space-y-4">          type="range"

        <div>          min="0"

          <label className="block text-gray-300 text-sm font-medium mb-2">          max="40"

            Temperature: {settings.temperature}°C          value={settings.temperature}

          </label>          onChange={(e) => handleChange('temperature', Number(e.target.value))}

          <input          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"

            type="range"        />

            min="0"        <div className="flex justify-between text-xs text-gray-400 mt-1">

            max="40"          <span>Cold</span>

            value={settings.temperature}          <span>Optimal</span>

            onChange={(e) => handleChange('temperature', Number(e.target.value))}          <span>Hot</span>

            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"        </div>

          />      </div>

        </div>

      {/* Rainfall Control */}

        <div>      <div className="mb-4">

          <label className="block text-gray-300 text-sm font-medium mb-2">        <label className="block text-gray-300 text-sm font-medium mb-2">

            Rainfall: {settings.rainfall}mm/day          Rainfall (mm/day): {settings.rainfall}mm

          </label>        </label>

          <input        <input

            type="range"          type="range"

            min="0"          min="0"

            max="100"          max="100"

            value={settings.rainfall}          value={settings.rainfall}

            onChange={(e) => handleChange('rainfall', Number(e.target.value))}          onChange={(e) => handleChange('rainfall', Number(e.target.value))}

            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"

          />        />

        </div>        <div className="flex justify-between text-xs text-gray-400 mt-1">

          <span>Dry</span>

        <div>          <span>Moderate</span>

          <label className="block text-gray-300 text-sm font-medium mb-2">          <span>Wet</span>

            Irrigation: {settings.irrigation}%        </div>

          </label>      </div>

          <input

            type="range"      {/* Irrigation Control */}

            min="0"      <div className="mb-4">

            max="100"        <label className="block text-gray-300 text-sm font-medium mb-2">

            value={settings.irrigation}          Irrigation Level: {settings.irrigation}%

            onChange={(e) => handleChange('irrigation', Number(e.target.value))}        </label>

            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"        <input

          />          type="range"

        </div>          min="0"

          max="100"

        <div>          value={settings.irrigation}

          <label className="block text-gray-300 text-sm font-medium mb-2">          onChange={(e) => handleChange('irrigation', Number(e.target.value))}

            Fertilizer: {settings.fertilizer}%          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"

          </label>        />

          <input      </div>

            type="range"

            min="0"      {/* Fertilizer Control */}

            max="100"      <div className="mb-4">

            value={settings.fertilizer}        <label className="block text-gray-300 text-sm font-medium mb-2">

            onChange={(e) => handleChange('fertilizer', Number(e.target.value))}          Fertilizer Amount: {settings.fertilizer}%

            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"        </label>

          />        <input

        </div>          type="range"

      </div>          min="0"

          max="100"

      {/* Current Growth Stage */}          value={settings.fertilizer}

      <div className="bg-gray-700 p-4 rounded-lg">          onChange={(e) => handleChange('fertilizer', Number(e.target.value))}

        <h4 className="text-gray-300 text-sm font-medium mb-2">Growth Stage</h4>          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"

        {(() => {        />

          const stage = calculateGrowthStage(settings.cropType, settings.days);      </div>

          return stage ? (

            <div className="flex items-center space-x-2">      {/* Days Slider */}

              <span className="text-2xl">{stage.icon}</span>      <div className="mb-6">

              <div>        <label className="block text-gray-300 text-sm font-medium mb-2">

                <p className="text-white font-medium">          Simulation Days: {settings.days} days

                  {stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1)}        </label>

                </p>        <input

                <p className="text-sm text-gray-400">          type="range"

                  Day {stage.daysInStage} of {stage.totalDays}          min="0"

                </p>          max="120"

              </div>          value={settings.days}

            </div>          onChange={(e) => handleChange('days', Number(e.target.value))}

          ) : (          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"

            <p className="text-gray-400">Select crop type and days</p>        />

          );        <div className="flex justify-between text-xs text-gray-400 mt-1">

        })()}          <span>Start</span>

      </div>          <span>30 days</span>

          <span>60 days</span>

      <button          <span>90 days</span>

        onClick={() => onSimulate(settings)}          <span>120 days</span>

        disabled={disabled}        </div>

        className={`w-full font-bold py-3 px-4 rounded transition-colors ${      </div>

          disabled 

            ? 'bg-gray-500 cursor-not-allowed text-gray-300'      {/* Growth Stage Display */}

            : 'bg-blue-600 hover:bg-blue-700 text-white'      <div className="mb-6 bg-gray-700 p-4 rounded-lg">

        }`}        <h4 className="text-gray-300 text-sm font-medium mb-2">Current Growth Stage</h4>

      >        {(() => {

        {disabled ? 'Simulating...' : 'Run Simulation'}          const stage = calculateGrowthStage(settings.cropType, settings.days);

      </button>          return stage ? (

    </div>            <div className="flex items-center space-x-2">

  );              <span className="text-2xl">{stage.icon}</span>

};              <div>

                <p className="text-white font-medium">{stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1)}</p>

const LoadingState = () => (                <p className="text-sm text-gray-400">Day {stage.daysInStage} of {stage.totalDays}</p>

  <motion.div               </div>

    initial={{ opacity: 0 }}            </div>

    animate={{ opacity: 1 }}          ) : (

    className="bg-gray-800 p-6 rounded-xl shadow-lg"            <p className="text-gray-400">Select crop type and days</p>

  >          );

    <h3 className="text-xl font-bold text-white mb-4">Running Simulation...</h3>        })()}

    <div className="flex items-center justify-center space-x-2">

      <motion.div      <button

        className="w-4 h-4 bg-blue-500 rounded-full"        onClick={handleSimulate}

        animate={{ scale: [1, 1.2, 1] }}        disabled={disabled}

        transition={{ repeat: Infinity, duration: 1 }}        className={`w-full font-bold py-2 px-4 rounded transition-colors ${

      />          disabled 

      <motion.div            ? 'bg-gray-500 cursor-not-allowed text-gray-300'

        className="w-4 h-4 bg-blue-500 rounded-full"            : 'bg-blue-600 hover:bg-blue-700 text-white'

        animate={{ scale: [1, 1.2, 1] }}        }`}

        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}      >

      />        {disabled ? 'Simulating...' : 'Run Simulation'}

      <motion.div      </button>

        className="w-4 h-4 bg-blue-500 rounded-full"    </div>

        animate={{ scale: [1, 1.2, 1] }}  );

        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}};

      />

    </div>const LoadingState = () => (

  </motion.div>  <div className="bg-gray-800 p-6 rounded-xl shadow-lg">

);    <h3 className="text-xl font-bold text-white mb-4">Running Simulation...</h3>

    <div className="flex items-center justify-center space-x-2">

const FarmSimulator = () => {      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>

  const [simulationData, setSimulationData] = useState(null);      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-150"></div>

  const [loading, setLoading] = useState(false);      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-300"></div>

  const [error, setError] = useState(null);    </div>

  </div>

  const runSimulation = async (params) => {);

    setLoading(true);

    setError(null);import { ProgressBar, GrowthChart, FarmerBadge, SimulationSummary } from './SimulationComponents';

    try {

      const dailyResults = [];const FarmSimulator = () => {

      const days = params.days;  const [simulationData, setSimulationData] = useState(null);

  const [loading, setLoading] = useState(false);

      for (let day = 1; day <= days; day++) {  const [error, setError] = useState(null);

        const yieldResult = calculateYieldPotential({

          ...params,  const runSimulation = async (params) => {

          daysElapsed: day    setLoading(true);

        });    setError(null);

    try {

        dailyResults.push({      // Validate input parameters

          day,      if (!params.cropType || !params.soilType) {

          growth: yieldResult.percentage,        throw new Error('Please select crop type and soil type');

          health: Math.min(100, (yieldResult.percentage + (params.soilHealth * 0.8)) / 2)      }

        });

      // Initialize daily results array for the chart

        // Add a small delay to show progress      const dailyResults = [];

        await new Promise(resolve => setTimeout(resolve, 20));      const days = 30; // Simulate 30 days

      }      

      // Run daily simulations

      const finalYield = calculateYieldPotential({      for (let day = 1; day <= days; day++) {

        ...params,        const result = simulateFarming({

        daysElapsed: days          ...params,

      });          dayNumber: day,

          // Add environmental factors

      const farmerScore = calculateFarmerScore({          temperature: params.temperature || 20,

        yieldPotential: finalYield.percentage,          rainfall: params.rainfall || 0,

        waterEfficiency: Math.min(100, (params.rainfall + params.irrigation) / 2),          irrigation: params.irrigation || 0,

        fertilizerEfficiency: params.fertilizer,          fertilizer: params.fertilizer || 0

        sustainabilityScore: 100 - params.pestRisk        });

      });

        if (result?.success && result?.data) {

      const currentStage = calculateGrowthStage(params.cropType, days);          dailyResults.push({

                  day: day,

      const results = {            growth: result.data.yieldScore || 0,

        dailyResults,            water: result.data.waterEfficiency || 0,

        yieldPrediction: finalYield,            health: result.data.sustainabilityScore || 0

        farmerScore,          });

        cropType: params.cropType,        } else {

        days,          console.warn(`Simulation failed for day ${day}:`, result);

        currentStage,        }

        harvestDate: new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toLocaleDateString(),

        healthScore: dailyResults[dailyResults.length - 1].health        // Add a small delay to show progress

      };        await new Promise(resolve => setTimeout(resolve, 50));

      }

      setSimulationData(results);

    } catch (error) {      // Calculate final results with accumulated data

      console.error('Simulation error:', error);      const finalResult = simulateFarming({

      setError(error.message || 'Failed to run simulation');        ...params,

    } finally {        dayNumber: days,

      setLoading(false);        accumulatedData: dailyResults

    }      });

  };      

      if (finalResult?.success && finalResult?.data) {

  return (        const simulationResults = {

    <div className="min-h-screen bg-gray-900 py-12">          ...finalResult.data,

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          dailyResults,

        <div className="text-center mb-12">          yieldEstimate: finalResult.data.yieldScore || 0,

          <h2 className="text-3xl font-bold text-white">Farm Simulation Lab</h2>          healthScore: finalResult.data.sustainabilityScore || 0,

          <p className="mt-2 text-gray-400">          waterEfficiency: finalResult.data.waterEfficiency || 0,

            Test different environmental conditions and see how they affect your crop growth          fertilizerEfficiency: finalResult.data.fertilizerEfficiency || 0,

          </p>          growthProgression: finalResult.data.growthProgression || 0,

        </div>          environmentalConditions: finalResult.data.environmentalConditions || {},

          recommendations: finalResult.data.recommendations?.map(rec => rec.message) || [],

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">          simulationDate: new Date().toISOString(),

          {/* Left Column - Controls */}          cropType: params.cropType,

          <SimulationControls onSimulate={runSimulation} disabled={loading} />          soilType: params.soilType,

          farmerScore: finalResult.data.farmerScore || { score: 0, achievement: 'Novice' }

          {/* Right Column - Results */}        };

          {loading ? (

            <LoadingState />        setSimulationData(simulationResults);

          ) : error ? (        return simulationResults;

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">      } else {

              <h3 className="text-xl font-bold text-red-500 mb-4">Simulation Error</h3>        throw new Error('Simulation failed to produce valid results');

              <p className="text-gray-400">{error}</p>      }

            </div>    } catch (error) {

          ) : simulationData ? (      console.error('Simulation error:', error);

            <motion.div       setError(error.message || 'Failed to run simulation');

              initial={{ opacity: 0, y: 20 }}      setSimulationData(null);

              animate={{ opacity: 1, y: 0 }}      return null;

              className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6"    } finally {

            >      setLoading(false);

              <h3 className="text-xl font-bold text-white mb-4">Simulation Results</h3>    }

                };

              <SimulationSummary

                cropType={CROP_DATA[simulationData.cropType].name}  return (

                days={simulationData.days}    <div className="min-h-screen bg-gray-900 py-12">

                yieldPrediction={simulationData.yieldPrediction.tons}      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                harvestDate={simulationData.harvestDate}        <div className="text-center mb-12">

              />          <h2 className="text-3xl font-bold text-white">Farm Simulation Lab</h2>

          <p className="mt-2 text-gray-400">

              <div className="space-y-4">            Test different environmental conditions and see how they affect your crop growth

                <div>          </p>

                  <h4 className="text-gray-300 text-sm font-medium mb-2">Yield Potential</h4>        </div>

                  <ProgressBar 

                    value={simulationData.yieldPrediction.percentage}         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    label={`${simulationData.yieldPrediction.tons.toFixed(1)} tons/ha`}          {/* Left Column - Controls */}

                  />          <SimulationControls onSimulate={runSimulation} disabled={loading} />

                </div>

          {/* Right Column - Results */}

                <div>          {loading ? (

                  <h4 className="text-gray-300 text-sm font-medium mb-2">Crop Health</h4>            <LoadingState />

                  <ProgressBar           ) : error ? (

                    value={simulationData.healthScore}             <div className="bg-gray-800 p-6 rounded-xl shadow-lg">

                    label={`${simulationData.healthScore}% healthy`}              <h3 className="text-xl font-bold text-red-500 mb-4">Simulation Error</h3>

                  />              <p className="text-gray-400">{error}</p>

                </div>            </div>

              </div>          ) : simulationData ? (

            <SimulationResults 

              <div>              data={{

                <h4 className="text-gray-300 text-sm font-medium mb-2">Growth Progress</h4>                yieldPrediction: simulationData.yieldEstimate,

                <GrowthChart data={simulationData.dailyResults} />                currentStage: simulationData.growthStage || 'Vegetative',

              </div>                dayInStage: simulationData.dayInStage || 1,

                stageDuration: simulationData.stageDuration || 30,

              <FarmerBadge {...simulationData.farmerScore} />                healthStatus: simulationData.healthScore >= 80 ? 'Excellent' : 

            </motion.div>                            simulationData.healthScore >= 60 ? 'Good' : 

          ) : (                            simulationData.healthScore >= 40 ? 'Fair' : 'Poor',

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">                healthMessage: `Current health score is ${simulationData.healthScore}%`,

              <h3 className="text-xl font-bold text-white mb-4">Simulation Results</h3>                recommendations: simulationData.recommendations || []

              <p className="text-gray-400">Configure parameters and run simulation to see results</p>              }}

            </div>              dailyStats={simulationData.dailyResults.map(day => ({

          )}                growth: day.growth,

        </div>                health: day.health || 0,

      </div>                stress: 100 - (day.health || 0)

    </div>              }))}

  );              environmentalData={{

};                waterEfficiency: simulationData.waterEfficiency || 0,

                soilHealth: simulationData.soilHealth || 0,

export default FarmSimulator;                biodiversity: simulationData.biodiversity || 0,
                carbonFootprint: simulationData.carbonFootprint || 0,
                pestRisk: simulationData.pestRisk || 0
              }}
            />
          ) : (
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Simulation Results</h3>
              <p className="text-gray-400">Configure parameters and run simulation to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmSimulator;