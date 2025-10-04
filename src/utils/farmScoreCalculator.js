// Score weights for different factors
const SCORE_WEIGHTS = {
  sustainablePractices: 0.3,
  yieldEfficiency: 0.25,
  waterEfficiency: 0.2,
  soilHealth: 0.15,
  pesticides: 0.1
};

// Baseline yields for different crops (tons/ha)
const CROP_BASELINES = {
  wheat: 3.5,
  rice: 4.5,
  corn: 9.5,
  soybeans: 3.0,
  cotton: 2.5
};

// Optimal irrigation levels (mm/day)
const IRRIGATION_BASELINES = {
  wheat: 4.5,
  rice: 8.0,
  corn: 6.0,
  soybeans: 5.0,
  cotton: 5.5
};

// Soil quality factors
const SOIL_FACTORS = {
  loam: 1.0,
  clay: 0.85,
  sandy: 0.75,
  silt: 0.9,
  peat: 0.8
};

export const calculateFarmScore = (farmData) => {
  try {
    let score = 0;
    const details = {};
    
    // Input validation
    if (!farmData) {
      throw new Error('Farm data is required');
    }
    
    if (!CROP_BASELINES[farmData.cropType]) {
      throw new Error(`Invalid crop type: ${farmData.cropType}`);
    }
    
    if (!SOIL_FACTORS[farmData.soilType]) {
      throw new Error(`Invalid soil type: ${farmData.soilType}`);
    }

  // Calculate sustainable practices score (30%)
  let sustainableScore = (farmData.sustainablePractices.length / 10) * 100; // Updated for 10 total practices
  if (farmData.organicFertilizer) {
    sustainableScore += 10; // Adjusted bonus to maintain balance with more practices
  }
  details.sustainableScore = Math.min(100, sustainableScore);
  score += details.sustainableScore * SCORE_WEIGHTS.sustainablePractices;

  // Calculate yield efficiency score (25%)
  const baselineYield = CROP_BASELINES[farmData.cropType] || 3.5;
  const yieldRatio = farmData.lastYearYield / (baselineYield * SOIL_FACTORS[farmData.soilType]);
  details.yieldScore = Math.min(100, yieldRatio * 100);
  score += details.yieldScore * SCORE_WEIGHTS.yieldEfficiency;

  // Calculate water efficiency score (20%)
  const optimalIrrigation = IRRIGATION_BASELINES[farmData.cropType] || 5.0;
  const irrigationEfficiency = 100 - Math.min(100, Math.abs(farmData.currentIrrigation - optimalIrrigation) / optimalIrrigation * 100);
  details.waterScore = irrigationEfficiency;
  score += details.waterScore * SCORE_WEIGHTS.waterEfficiency;

  // Calculate soil health score (15%)
  const soilScore = farmData.organicFertilizer ? 100 : 70;
  details.soilScore = soilScore;
  score += soilScore * SCORE_WEIGHTS.soilHealth;

  // Calculate pesticide usage score (10%)
  // Lower pesticide usage is better (0-20 L/ha scale)
  const pesticideScore = Math.max(0, 100 - (farmData.pesticides / 0.2));
  details.pesticideScore = pesticideScore;
  score += pesticideScore * SCORE_WEIGHTS.pesticides;

  // Generate recommendations
  const recommendations = [];
  if (details.sustainableScore < 80) {
    recommendations.push("Consider adopting more sustainable farming practices");
  }
  if (details.yieldScore < 70) {
    recommendations.push("Your yield is below optimal. Consider soil testing and adjusting nutrients");
  }
  if (details.waterScore < 75) {
    recommendations.push("Optimize irrigation to match crop needs");
  }
  if (!farmData.organicFertilizer) {
    recommendations.push("Consider transitioning to organic fertilizers for better soil health");
  }
  if (details.pesticideScore < 60) {
    recommendations.push("Reduce pesticide usage and implement integrated pest management");
  }

  return {
    totalScore: Math.round(score),
    details,
    recommendations,
    metrics: {
      sustainablePractices: farmData.sustainablePractices.length,
      yieldRatio: yieldRatio.toFixed(2),
      irrigationEfficiency: irrigationEfficiency.toFixed(2),
      pesticideUsage: farmData.pesticides,
      isOrganic: farmData.organicFertilizer
    }
  };
} catch (error) {
  console.error('Error calculating farm score:', error);
  return {
    totalScore: 0,
    details: {},
    recommendations: ['Error calculating farm score. Please check your inputs and try again.'],
    metrics: {
      sustainablePractices: 0,
      yieldRatio: '0.00',
      irrigationEfficiency: '0.00',
      pesticideUsage: 0,
      isOrganic: false
    },
    error: error.message
  };
}
};