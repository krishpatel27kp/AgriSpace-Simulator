// Advanced Crop Analysis with AI-powered predictions

// Soil type suitability for different crops
const SOIL_SUITABILITY = {
  wheat: ['loam', 'clay loam', 'sandy loam'],
  rice: ['clay', 'clay loam', 'silty clay'],
  corn: ['loam', 'sandy loam', 'silt loam'],
  soybeans: ['loam', 'clay loam', 'silt loam'],
  cotton: ['loam', 'sandy loam', 'clay loam'],
  sugarcane: ['loam', 'clay loam', 'sandy loam'],
  potatoes: ['sandy loam', 'loam', 'silt loam'],
  tomatoes: ['loam', 'sandy loam', 'silt loam']
};

// Temperature ranges for different crops (in °C)
const CROP_TEMP_RANGES = {
  wheat: { min: 15, max: 25 },
  rice: { min: 22, max: 32 },
  corn: { min: 20, max: 30 },
  soybeans: { min: 18, max: 30 },
  cotton: { min: 21, max: 35 },
  sugarcane: { min: 22, max: 38 },
  potatoes: { min: 15, max: 25 },
  tomatoes: { min: 20, max: 30 }
};

// Rainfall and water requirements for crops
// mm/month for rainfall, liters/hectare/month for water
const CROP_WATER_REQUIREMENTS = {
  wheat: { 
    rainfall: { min: 50, max: 100 },
    waterPerHectare: { min: 500000, max: 1000000 }, // 1mm rainfall = 10,000L per hectare
    irrigationFrequency: "Every 7-10 days"
  },
  rice: { 
    rainfall: { min: 150, max: 300 },
    waterPerHectare: { min: 1500000, max: 3000000 },
    irrigationFrequency: "Continuous flooding"
  },
  corn: { 
    rainfall: { min: 75, max: 150 },
    waterPerHectare: { min: 750000, max: 1500000 },
    irrigationFrequency: "Every 5-7 days"
  },
  soybeans: { 
    rainfall: { min: 70, max: 130 },
    waterPerHectare: { min: 700000, max: 1300000 },
    irrigationFrequency: "Every 7-10 days"
  },
  cotton: { 
    rainfall: { min: 80, max: 150 },
    waterPerHectare: { min: 800000, max: 1500000 },
    irrigationFrequency: "Every 10-14 days"
  },
  sugarcane: { 
    rainfall: { min: 150, max: 250 },
    waterPerHectare: { min: 1500000, max: 2500000 },
    irrigationFrequency: "Every 7-14 days"
  },
  potatoes: { 
    rainfall: { min: 50, max: 100 },
    waterPerHectare: { min: 500000, max: 1000000 },
    irrigationFrequency: "Every 5-7 days"
  },
  tomatoes: { 
    rainfall: { min: 60, max: 120 },
    waterPerHectare: { min: 600000, max: 1200000 },
    irrigationFrequency: "Every 3-5 days"
  }
};

// Recommended fertilizer products with purchase links
const FERTILIZER_PRODUCTS = {
  nitrogen: [
    {
      name: 'Urea 46-0-0', brand: 'AgriPro', link: 'https://www.agripro.com/products/urea', composition: '46% N', applicationRate: '100-150 kg/ha'
    },
    {
      name: 'Ammonium Nitrate', brand: 'FarmGrow', link: 'https://www.farmgrow.com/ammonium-nitrate', composition: '34% N', applicationRate: '150-200 kg/ha'
    },
    {
      name: 'Calcium Ammonium Nitrate', brand: 'GreenGrow', link: 'https://www.greengrow.com/can', composition: '27% N', applicationRate: '120-180 kg/ha'
    }
  ],
  phosphorus: [
    {
      name: 'Triple Superphosphate', brand: 'CropMax', link: 'https://www.cropmax.com/tsp', composition: '46% P2O5', applicationRate: '80-120 kg/ha'
    },
    {
      name: 'Single Superphosphate', brand: 'PhosGrow', link: 'https://www.phosgrow.com/ssp', composition: '16% P2O5', applicationRate: '100-200 kg/ha'
    }
  ],
  potassium: [
    {
      name: 'Potassium Chloride', brand: 'GrowMore', link: 'https://www.growmore.com/kcl', composition: '60% K2O', applicationRate: '100-150 kg/ha'
    },
    {
      name: 'Potassium Sulfate', brand: 'K-Sulf', link: 'https://www.ksulf.com/potassium-sulfate', composition: '50% K2O', applicationRate: '80-120 kg/ha'
    }
  ],
  micronutrients: [
    {
      name: 'Micronutrient Mix', brand: 'PlantBoost', link: 'https://www.plantboost.com/micro-mix', composition: 'Zn, Fe, Mn, Cu, B', applicationRate: '20-30 kg/ha'
    },
    {
      name: 'Chelated Micronutrient', brand: 'MicroChel', link: 'https://www.microchel.com/chelated', composition: 'Zn, Fe, Mn, Cu', applicationRate: '10-20 kg/ha'
    }
  ]
};
// Recommend fertilizers based on crop type
const CROP_FERTILIZER_MAP = {
  wheat: ['nitrogen', 'phosphorus', 'potassium'],
  rice: ['nitrogen', 'phosphorus', 'potassium'],
  corn: ['nitrogen', 'phosphorus', 'potassium'],
  soybeans: ['phosphorus', 'potassium', 'micronutrients'],
  cotton: ['nitrogen', 'potassium', 'micronutrients'],
  sugarcane: ['nitrogen', 'potassium', 'micronutrients'],
  potatoes: ['nitrogen', 'phosphorus', 'potassium', 'micronutrients'],
  tomatoes: ['nitrogen', 'phosphorus', 'potassium', 'micronutrients']
};

export function calculateFertilizerNeeds(soilConditions, cropType, targetYield) {
  const crop = cropType?.toLowerCase();
  const fertilizerTypes = CROP_FERTILIZER_MAP[crop] || ['nitrogen', 'phosphorus', 'potassium'];
  let recommendations = [];
  fertilizerTypes.forEach(type => {
    FERTILIZER_PRODUCTS[type].forEach(product => {
      recommendations.push({
        type,
        ...product,
        reason: `Recommended for ${cropType} to improve ${type} levels.`
      });
    });
  });
  // Limit to top 3-4 most suitable products
  return recommendations.slice(0, 4);
}

// Helper functions
const evaluateTemperatureMatch = (crop, temperature) => {
  const range = CROP_TEMP_RANGES[crop.toLowerCase()];
  if (!range) return 0;
  
  if (temperature < range.min) {
    return Math.max(0, 100 - ((range.min - temperature) * 10));
  } else if (temperature > range.max) {
    return Math.max(0, 100 - ((temperature - range.max) * 10));
  }
  return 100;
};

const evaluateWaterRequirements = (crop, rainfall, areaInHectares = 1) => {
  const requirements = CROP_WATER_REQUIREMENTS[crop.toLowerCase()];
  if (!requirements) return { score: 0, waterNeeded: 0, recommendation: 'Crop data not available' };
  
  // Calculate water from rainfall (1mm rainfall = 10,000L per hectare)
  const waterFromRainfall = rainfall * 10000 * areaInHectares;
  
  // Calculate required water
  const minWaterNeeded = requirements.waterPerHectare.min * areaInHectares;
  const maxWaterNeeded = requirements.waterPerHectare.max * areaInHectares;
  const optimalWater = (minWaterNeeded + maxWaterNeeded) / 2;
  
  // Calculate additional water needed through irrigation
  const additionalWaterNeeded = Math.max(0, minWaterNeeded - waterFromRainfall);
  
  // Calculate score
  let score;
  if (waterFromRainfall < minWaterNeeded) {
    score = Math.max(0, 100 - ((minWaterNeeded - waterFromRainfall) / minWaterNeeded * 100));
  } else if (waterFromRainfall > maxWaterNeeded) {
    score = Math.max(0, 100 - ((waterFromRainfall - maxWaterNeeded) / maxWaterNeeded * 100));
  } else {
    score = 100;
  }

  // Generate recommendation
  let recommendation;
  if (additionalWaterNeeded > 0) {
    recommendation = `Need ${Math.round(additionalWaterNeeded).toLocaleString()} liters through irrigation. ${requirements.irrigationFrequency}.`;
  } else {
    recommendation = 'Sufficient rainfall. Monitor soil moisture.';
  }

  return {
    score,
    waterFromRainfall: Math.round(waterFromRainfall),
    waterNeeded: Math.round(optimalWater),
    additionalWaterNeeded: Math.round(additionalWaterNeeded),
    recommendedSchedule: requirements.irrigationFrequency,
    recommendation
  };
};

const evaluateSoilMatch = (crop, soil) => {
  const suitableSoils = SOIL_SUITABILITY[crop.toLowerCase()] || [];
  if (!soil.type) return 50;
  
  const soilType = soil.type.toLowerCase();
  if (suitableSoils.includes(soilType)) {
    return suitableSoils.indexOf(soilType) === 0 ? 100 : 80;
  }
  return 50;
};

// Calculate risk factors
const calculateFrostRisk = (weatherData) => {
  return Math.max(0, Math.min(100, 100 - (weatherData.current.temperature * 5)));
};

const calculateDroughtRisk = (weatherData) => {
  return Math.max(0, Math.min(100, 100 - (weatherData.current.rainfall / 2)));
};

const calculateDiseaseRisk = (weatherData, cropType) => {
  const humidity = weatherData.current.humidity || 60;
  const baseRisk = humidity > 80 ? 70 : humidity > 60 ? 40 : 20;
  return Math.min(100, baseRisk + (Math.random() * 20));
};

const calculatePestRisk = (weatherData, cropType) => {
  const temp = weatherData.current.temperature;
  const baseRisk = temp > 25 ? 60 : temp > 20 ? 40 : 20;
  return Math.min(100, baseRisk + (Math.random() * 20));
};

const evaluateSoilRisk = (soilConditions) => {
  const pH = soilConditions.ph || 7;
  return Math.max(0, Math.min(100, Math.abs(pH - 7) * 20));
};

// Weather prediction functions
const generateDailyPredictions = (trends, current, days = 30) => {
  const predictions = [];
  for (let i = 0; i < days; i++) {
    predictions.push({
      day: i + 1,
      temperature: current.temperature + (Math.random() * 4 - 2),
      rainfall: Math.max(0, current.rainfall * (Math.random() * 0.4 + 0.8)),
      humidity: Math.max(30, Math.min(90, (current.humidity || 60) + (Math.random() * 20 - 10)))
    });
  }
  return predictions;
};

// Main analysis functions
const calculateCropSuitability = (weatherData, soilConditions, areaInHectares = 1) => {
  const crops = Object.keys(CROP_TEMP_RANGES);
  
  return crops.map(crop => {
    const tempScore = evaluateTemperatureMatch(crop, weatherData.current.temperature);
    const waterAnalysis = evaluateWaterRequirements(crop, weatherData.current.rainfall, areaInHectares);
    const soilScore = evaluateSoilMatch(crop, soilConditions);

    const score = Math.round((tempScore * 0.4) + (waterAnalysis.score * 0.3) + (soilScore * 0.3));

    const reasons = [];
    // Temperature reason
    if (tempScore > 85) {
      reasons.push(`Excellent temperature match (${weatherData.current.temperature}°C is ideal for ${crop})`);
    } else if (tempScore > 70) {
      reasons.push(`Good temperature match (${weatherData.current.temperature}°C is suitable for ${crop})`);
    } else {
      reasons.push(`Temperature is less optimal (${weatherData.current.temperature}°C, preferred: ${CROP_TEMP_RANGES[crop].min}-${CROP_TEMP_RANGES[crop].max}°C)`);
    }
    // Water reason
    if (waterAnalysis.score > 85) {
      reasons.push(`Excellent water availability (rainfall: ${weatherData.current.rainfall}mm, matches crop needs)`);
    } else if (waterAnalysis.score > 70) {
      reasons.push(`Adequate water availability (rainfall: ${weatherData.current.rainfall}mm)`);
    } else {
      reasons.push(`Water may be insufficient (rainfall: ${weatherData.current.rainfall}mm, needs: ${CROP_WATER_REQUIREMENTS[crop].rainfall.min}-${CROP_WATER_REQUIREMENTS[crop].rainfall.max}mm)`);
    }
    // Soil reason
    if (soilScore > 85) {
      reasons.push(`Soil type (${soilConditions.type}) is excellent for ${crop}`);
    } else if (soilScore > 70) {
      reasons.push(`Soil type (${soilConditions.type}) is suitable for ${crop}`);
    } else {
      reasons.push(`Soil type (${soilConditions.type}) is less optimal for ${crop}`);
    }

    return {
      crop,
      score,
      reasons,
      waterRequirements: {
        totalNeeded: waterAnalysis.waterNeeded,
        fromRainfall: waterAnalysis.waterFromRainfall,
        additionalNeeded: waterAnalysis.additionalWaterNeeded,
        irrigationSchedule: waterAnalysis.recommendedSchedule,
        recommendation: waterAnalysis.recommendation
      }
    };
  }).sort((a, b) => b.score - a.score);
};

const calculatePlantingRisk = (weatherData, cropType, soilConditions) => {
  const risks = {
    frost: calculateFrostRisk(weatherData),
    drought: calculateDroughtRisk(weatherData),
    disease: calculateDiseaseRisk(weatherData, cropType),
    pests: calculatePestRisk(weatherData, cropType),
    soil: evaluateSoilRisk(soilConditions)
  };

  const score = Math.round(
    Object.values(risks).reduce((acc, val) => acc + val, 0) / Object.keys(risks).length
  );

  const recommendation = score > 60 
    ? "High risk conditions. Consider delaying planting or implementing protective measures."
    : score > 30
    ? "Moderate risk. Monitor conditions and prepare mitigation strategies."
    : "Favorable conditions for planting.";

  return { score, details: risks, recommendation };
};

const predictWeatherPatterns = (historicalData, currentConditions) => {
  const dailyPredictions = generateDailyPredictions(currentConditions, currentConditions);
  
  const averageTemp = dailyPredictions.reduce((sum, day) => sum + day.temperature, 0) / 30;
  const totalRainfall = dailyPredictions.reduce((sum, day) => sum + day.rainfall, 0);
  const rainDays = dailyPredictions.filter(day => day.rainfall > 1).length;
  
  const extremeWeatherRisk = [];
  if (averageTemp > 30) extremeWeatherRisk.push("Risk of heat stress");
  if (averageTemp < 10) extremeWeatherRisk.push("Risk of cold damage");
  if (totalRainfall > 200) extremeWeatherRisk.push("Risk of waterlogging");
  if (totalRainfall < 50) extremeWeatherRisk.push("Risk of drought");

  return {
    dailyPredictions,
    summary: {
      averageTemp: Math.round(averageTemp * 10) / 10,
      totalRainfall: Math.round(totalRainfall),
      rainDays,
      extremeWeatherRisk
    }
  };
};


export {
  calculateCropSuitability,
  calculatePlantingRisk,
  predictWeatherPatterns,
  FERTILIZER_PRODUCTS,
  CROP_WATER_REQUIREMENTS
};