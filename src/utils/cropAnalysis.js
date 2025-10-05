// Crop data constants
export const CROP_DATA = {
  Wheat: {
    baseWaterNeed: 4.0,
    tempRange: [10, 25],
    rainRange: [1, 5],
    solarRange: [150, 300]
  },
  Rice: {
    baseWaterNeed: 6.0,
    tempRange: [20, 35],
    rainRange: [5, 15],
    solarRange: [150, 400]
  },
  Maize: {
    baseWaterNeed: 5.0,
    tempRange: [18, 30],
    rainRange: [2, 8],
    solarRange: [200, 350]
  },
  Soybean: {
    baseWaterNeed: 4.5,
    tempRange: [15, 30],
    rainRange: [1, 6],
    solarRange: [180, 320]
  }
};

/**
 * Calculate water requirements and crop suitability based on weather conditions
 */
export function analyzeCropConditions(weather, selectedCrop) {
  const { temperature, rainfall, solarRadiation } = weather;

  // Calculate irrigation need for selected crop
  const baseWaterNeed = CROP_DATA[selectedCrop]?.baseWaterNeed || 0;
  const irrigationNeed = Math.max(baseWaterNeed - rainfall, 0).toFixed(1);

  // Calculate advanced water need using Hargreaves equation (simplified)
  // Note: This is an estimate as we don't have min/max temperature
  const estimatedTempRange = 10; // Assumed average daily temperature range
  const advancedWaterNeed = (
    0.0023 * 
    (temperature + 17.8) * 
    Math.sqrt(estimatedTempRange) * 
    (solarRadiation / 24) // Convert daily radiation to hourly
  ) - rainfall;

  // Analyze suitability for all crops
  const suitability = Object.entries(CROP_DATA).map(([cropName, data]) => {
    // Temperature score (0-1)
    const tempScore = temperature >= data.tempRange[0] && temperature <= data.tempRange[1] 
      ? 1 
      : 1 - Math.min(
          Math.abs(temperature - data.tempRange[0]), 
          Math.abs(temperature - data.tempRange[1])
        ) / 10;

    // Rainfall score (0-1)
    const rainScore = rainfall >= data.rainRange[0] && rainfall <= data.rainRange[1]
      ? 1
      : 1 - Math.min(
          Math.abs(rainfall - data.rainRange[0]),
          Math.abs(rainfall - data.rainRange[1])
        ) / data.rainRange[1];

    // Solar radiation score (0-1)
    const solarScore = solarRadiation >= data.solarRange[0] && solarRadiation <= data.solarRange[1]
      ? 1
      : 1 - Math.min(
          Math.abs(solarRadiation - data.solarRange[0]),
          Math.abs(solarRadiation - data.solarRange[1])
        ) / data.solarRange[1];

    const totalScore = (tempScore + rainScore + solarScore) / 3;

    return {
      name: cropName,
      score: totalScore,
      details: {
        tempScore: tempScore.toFixed(2),
        rainScore: rainScore.toFixed(2),
        solarScore: solarScore.toFixed(2)
      }
    };
  });

  // Sort by score and get top recommendations
  const bestCrops = suitability
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  return {
    irrigationNeed,
    advancedWaterNeed: Math.max(advancedWaterNeed, 0).toFixed(1),
    bestCrops,
    allCropScores: suitability
  };
}

/**
 * Get growth stage specific recommendations
 */
export function getGrowthStageRecommendations(stage, weather, crop) {
  const recommendations = {
    tips: [],
    warnings: []
  };

  const { temperature, rainfall } = weather;
  const cropData = CROP_DATA[crop];

  if (!cropData) return recommendations;

  // Temperature checks
  if (temperature < cropData.tempRange[0]) {
    recommendations.warnings.push("Temperature is below optimal range. Consider protective measures.");
  } else if (temperature > cropData.tempRange[1]) {
    recommendations.warnings.push("Temperature is above optimal range. Ensure adequate irrigation.");
  }

  // Rainfall checks
  if (rainfall < cropData.rainRange[0]) {
    recommendations.tips.push("Low rainfall detected. Increase irrigation frequency.");
  } else if (rainfall > cropData.rainRange[1]) {
    recommendations.warnings.push("High rainfall detected. Check for proper drainage.");
  }

  // Stage specific recommendations
  switch(stage.toLowerCase()) {
    case 'germination':
      if (temperature < cropData.tempRange[0]) {
        recommendations.tips.push("Consider using mulch to maintain soil temperature.");
      }
      break;
    case 'vegetative':
      if (rainfall < cropData.rainRange[0]) {
        recommendations.tips.push("Critical growth phase - maintain consistent soil moisture.");
      }
      break;
    case 'flowering':
      if (temperature > cropData.tempRange[1]) {
        recommendations.tips.push("Protect flowers from heat stress with adequate irrigation.");
      }
      break;
    case 'harvest':
      if (rainfall > cropData.rainRange[1]) {
        recommendations.warnings.push("High moisture may affect harvest quality. Plan harvest timing carefully.");
      }
      break;
  }

  return recommendations;
}