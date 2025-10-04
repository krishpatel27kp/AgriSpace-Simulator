export const CROP_PARAMETERS = {
  wheat: {
    optimalTemp: 20,
    optimalRainfall: 25,
    waterNeed: 60,
    fertilizerNeed: 50
  },
  corn: {
    optimalTemp: 25,
    optimalRainfall: 30,
    waterNeed: 70,
    fertilizerNeed: 60
  },
  rice: {
    optimalTemp: 28,
    optimalRainfall: 35,
    waterNeed: 80,
    fertilizerNeed: 55
  }
};

export const SOIL_TYPES = {
  clay: {
    waterRetention: 0.9,
    drainageRate: 0.3,
    fertilizerRetention: 0.8,
    description: "Clay soils retain water and nutrients well but have poor drainage."
  },
  loam: {
    waterRetention: 0.7,
    drainageRate: 0.6,
    fertilizerRetention: 0.7,
    description: "Loam soils offer balanced water retention and drainage."
  },
  sandy: {
    waterRetention: 0.3,
    drainageRate: 0.9,
    fertilizerRetention: 0.4,
    description: "Sandy soils drain quickly and need more frequent irrigation."
  }
};

export function calculateSoilHealthScore(p) {
  if (!p?.cropType || !p?.soilPH) return 0;
  const c = CROP_PARAMETERS[p.cropType.toLowerCase()];
  if (!c) return 0;
  return Math.round(100 - Math.min(100, Math.abs(p.soilPH - 6.5) / 6.5 * 100));
}

function getFarmerAchievement(score) {
  if (score >= 90) return "Master Farmer";
  if (score >= 80) return "Expert Farmer";
  if (score >= 70) return "Skilled Farmer";
  if (score >= 60) return "Developing Farmer";
  return "Novice Farmer";
}

export function calculateFarmerScore(p) {
  // Ensure we have all required metrics
  const w = Number(p?.waterEfficiency || 0);
  const f = Number(p?.fertilizerEfficiency || 0);
  const y = Number(p?.yieldScore || 0);
  const s = Number(p?.sustainabilityScore || 0);
  
  // Calculate weighted score
  const score = Math.round(y * 0.25 + s * 0.25 + ((w + f) / 2) * 0.5);
  
  // Ensure score is between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  return {
    score: normalizedScore,
    achievement: getFarmerAchievement(normalizedScore)
  };
}

export function simulateFarming({ 
  cropType = "wheat", 
  rainfall = 0, 
  temperature = 20, 
  irrigation = 50, 
  fertilizer = 50, 
  dayNumber = 1,
  soilType = "loam",
  accumulatedData = []
}) {
  try {
    // Validate inputs
    const crop = CROP_PARAMETERS[cropType.toLowerCase()];
    const soil = SOIL_TYPES[soilType.toLowerCase()];
    
    if (!crop || !soil) {
      return {
        success: false,
        error: !crop ? "Invalid crop type" : "Invalid soil type"
      };
    }

    // Calculate water availability with soil characteristics
    const totalWater = (rainfall * soil.waterRetention) + (irrigation / 100 * 50 * soil.drainageRate);
    const waterDeviation = Math.abs(totalWater - crop.waterNeed) / crop.waterNeed;
    const waterEfficiency = Math.max(0, 100 - (waterDeviation * 100));

    // Temperature impact with growth stage consideration
    const tempDeviation = Math.abs(temperature - crop.optimalTemp) / crop.optimalTemp;
    const growthStageFactor = dayNumber <= 10 ? 1.2 : dayNumber <= 20 ? 1.0 : 0.8;
    const tempEfficiency = Math.max(0, 100 - (tempDeviation * 100)) * growthStageFactor;

    // Fertilizer efficiency with soil retention
    const effectiveFertilizer = fertilizer * soil.fertilizerRetention;
    const fertilizerDeviation = Math.abs(effectiveFertilizer - crop.fertilizerNeed) / crop.fertilizerNeed;
    const fertilizerEfficiency = Math.max(0, 100 - (fertilizerDeviation * 100));

    // Calculate yield score with growth stage progression
    const baseYieldScore = (waterEfficiency * 0.4 + tempEfficiency * 0.3 + fertilizerEfficiency * 0.3);
    const growthProgression = Math.min(100, (dayNumber / 30) * 100);
    const yieldScore = (baseYieldScore * (growthProgression / 100));

    // Calculate sustainability scores
    const waterSustainability = 100 - Math.abs(irrigation - Math.max(0, crop.waterNeed - rainfall));
    const fertilizerSustainability = 100 - Math.abs(fertilizer - crop.fertilizerNeed);
    const sustainabilityScore = (waterSustainability * 0.5 + fertilizerSustainability * 0.5);

    // Generate recommendations
    const recommendations = [];
    
    if (waterEfficiency < 70) {
      if (irrigation > 70 && rainfall > crop.optimalRainfall) {
        recommendations.push({
          type: 'water',
          message: 'Consider reducing irrigation due to sufficient rainfall'
        });
      } else if (irrigation < 30 && rainfall < crop.optimalRainfall) {
        recommendations.push({
          type: 'water',
          message: `Increase irrigation to meet ${cropType}'s water needs`
        });
      }
    }

    if (tempEfficiency < 70) {
      recommendations.push({
        type: 'temperature',
        message: `Current temperature is not optimal for ${cropType}. Ideal temperature is around ${crop.optimalTemp}°C`
      });
    }

    if (fertilizerEfficiency < 70) {
      if (fertilizer > crop.fertilizerNeed * 1.2) {
        recommendations.push({
          type: 'fertilizer',
          message: 'Reduce fertilizer application to prevent waste and environmental impact'
        });
      } else if (fertilizer < crop.fertilizerNeed * 0.8) {
        recommendations.push({
          type: 'fertilizer',
          message: 'Consider increasing fertilizer to improve yield'
        });
      }
    }

    const farmerScore = calculateFarmerScore({
      waterEfficiency,
      fertilizerEfficiency,
      yieldScore,
      sustainabilityScore
    });

    return {
      success: true,
      data: {
        cropType,
        soilType,
        dayNumber,
        yieldScore: Math.round(yieldScore),
        sustainabilityScore: Math.round(sustainabilityScore),
        waterEfficiency: Math.round(waterEfficiency),
        fertilizerEfficiency: Math.round(fertilizerEfficiency),
        growthProgression: Math.round((dayNumber / 30) * 100),
        farmerScore,
        recommendations,
        environmentalConditions: {
          temperature,
          rainfall,
          irrigation,
          fertilizer
        }
      }
    };
  } catch (error) {
    console.error('Simulation calculation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to calculate simulation results'
    };
  }
}
