import React from 'react';
import FarmScoreAnalysis from './FarmScoreAnalysis';


const FarmScoreResults = ({ data, showAnalysis = true }) => {
  if (!data) {
    console.log('No data provided to FarmScoreResults');
    return null;
  }

  // Ensure we have the required score data with defaults
  const {
    farmerScore = { 
      score: 0, 
      achievement: 'Not Rated' 
    },
    yieldScore = 0,
    sustainabilityScore = 0,
    waterEfficiency = 0,
    fertilizerEfficiency = 0,
    cropType = 'Unknown',
    soilType = 'Unknown',
    environmentalConditions = {},
    recommendations = []
  } = data;

  // Log the complete data structure for debugging
  console.log('FarmScoreResults received data:', {
    farmerScore,
    yieldScore,
    sustainabilityScore,
    waterEfficiency,
    fertilizerEfficiency,
    cropType,
    soilType,
    environmentalConditions,
    recommendations
  });

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold">Farm Score: {data.farmerScore.score}</h2>
        <p>{data.farmerScore.achievement}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3>Yield Score</h3>
          <p>{data.yieldScore}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Sustainability Score</h3>
          <p>{data.sustainabilityScore}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Water Efficiency</h3>
          <p>{data.waterEfficiency}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Fertilizer Efficiency</h3>
          <p>{data.fertilizerEfficiency}%</p>
        </div>
      </div>
      {/* Analysis section (breakdown, metrics, recommendations) */}
      {showAnalysis && (
        <div className="mt-4">
          <FarmScoreAnalysis data={data} />
        </div>
      )}
    </div>
  );
};

export default FarmScoreResults;