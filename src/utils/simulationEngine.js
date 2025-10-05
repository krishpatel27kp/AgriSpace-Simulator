import { CROP_DATA } from './growthStageLogic';

// Calculate growth stage for a given crop and day
const calculateGrowthStage = (cropType, day) => {
  const crop = CROP_DATA[cropType];
  if (!crop) {
    console.warn(`No crop data found for ${cropType}, using default stage`);
    return {
      stage: 'unknown',
      icon: '🌱',
      progress: 0,
      sensitivity: 1.0,
      waterNeed: 1.0
    };
  }

  const stages = crop.growthStages;
  for (const [stageName, data] of Object.entries(stages)) {
    if (day >= data.start && day <= data.end) {
      const progress = ((day - data.start) / (data.end - data.start)) * 100;
      return {
        stage: stageName,
        icon: data.icon,
        progress: Math.min(100, progress),
        sensitivity: data.sensitivity,
        waterNeed: data.waterNeed
      };
    }
  }

  return {
    stage: 'mature',
    icon: '🌾',
    progress: 100,
    sensitivity: 0.8,
    waterNeed: 0.7
  };
};

// Utility function to normalize value between 0 and 1
const normalize = (value, min, max) => {
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
};

// Calculate temperature effect on growth (0-1)
const calculateTemperatureEffect = (temperature, crop) => {
  const { min, max } = crop.optimalTemp;
  if (temperature < min) return normalize(temperature, min - 10, min);
  if (temperature > max) return normalize(temperature, max, max + 10);
  return 1;
};

// Calculate rainfall/irrigation effect (0-1)
const calculateWaterEffect = (rainfall, irrigationLevel, crop) => {
  const totalWater = rainfall + (irrigationLevel / 100) * 10; // Convert irrigation % to mm
  const optimalWater = crop.waterNeeds;
  return normalize(totalWater, 0, optimalWater);
};

// Calculate solar radiation effect (0-1)
const calculateSolarEffect = (solarRadiation) => {
  // Optimal range for most crops: 8-30 MJ/m²/day (divide W/m² by 11.574 to get MJ/m²/day)
  const solarMJ = solarRadiation / 11.574;
  return normalize(solarMJ, 8, 30);
};

// Calculate daily growth factor
const calculateGrowthFactor = (params) => {
  const {
    temperature,
    rainfall,
    solarRadiation,
    irrigationLevel,
    fertilizerLevel,
    soilHealth,
    crop,
    currentStage
  } = params;

  // Base growth factors
  const tempEffect = calculateTemperatureEffect(temperature, crop);
  const waterEffect = calculateWaterEffect(rainfall, irrigationLevel, crop);
  const solarEffect = calculateSolarEffect(solarRadiation);
  
  // Stage sensitivity affects how much environmental factors impact growth
  const stageSensitivity = currentStage.sensitivity || 1;

  // Calculate base growth
  const baseGrowth = (
    (tempEffect * 0.4) +
    (waterEffect * 0.3) +
    (solarEffect * 0.3)
  ) * stageSensitivity;

  // Management factors
  const managementEffect = (
    (irrigationLevel + fertilizerLevel + soilHealth) / 300
  );

  return baseGrowth * managementEffect;
};

// Main simulation function
export const runSimulation = (params) => {
  const {
    days,
    crop,
    temperature,
    rainfall,
    solarRadiation,
    irrigationLevel,
    fertilizerLevel,
    soilHealth,
    initialNDVI = 0.3
  } = params;

  let ndvi = initialNDVI;
  let cumulativeGrowth = 0;
  const results = [];
  let lastGrowthFactor = 0;
  
  // Run daily simulation
  for (let day = 1; day <= days; day++) {
    // Get current growth stage
    const currentStage = calculateGrowthStage(params.cropType || 'wheat', day);
    
    // Calculate daily growth
    const growthFactor = calculateGrowthFactor({
      temperature,
      rainfall,
      solarRadiation,
      irrigationLevel,
      fertilizerLevel,
      soilHealth,
      crop,
      currentStage
    });

    // Update NDVI - it responds to growth conditions with some inertia
    ndvi = Math.min(0.9, Math.max(0.2, ndvi + (growthFactor - 0.5) * 0.02));
    
    // Accumulate growth progress
    cumulativeGrowth += growthFactor;
    const growthProgress = Math.min(100, (cumulativeGrowth / days) * 100);

    // Calculate daily yield potential based on growth and NDVI
    const dailyYieldPotential = (ndvi * growthProgress * 0.8);
    
    // Store daily results
    results.push({
      day,
      ndvi: Number(ndvi.toFixed(3)),
      growth: Number(growthProgress.toFixed(1)),
      growthFactor: Number(growthFactor.toFixed(3)),
      yieldPotential: Number(dailyYieldPotential.toFixed(1)),
      stage: currentStage.stage,
      stageIcon: currentStage.icon
    });

    lastGrowthFactor = growthFactor;
  }

  // Calculate final metrics
  const finalNDVI = results[results.length - 1].ndvi;
  const finalGrowth = results[results.length - 1].growth;
  const yieldPotential = (finalNDVI * finalGrowth * 0.8).toFixed(1);
  
  // Calculate farmer score
  const farmerScore = Math.min(100, (
    (irrigationLevel * 0.3) +
    (fertilizerLevel * 0.3) +
    (soilHealth * 0.2) +
    (Number(yieldPotential) * 0.2)
  )).toFixed(1);

  // Generate alerts based on simulation results
  const alerts = [];
  if (lastGrowthFactor < 0.4) {
    alerts.push({
      severity: 'high',
      message: 'Growth conditions are poor. Check water and nutrient levels.'
    });
  } else if (lastGrowthFactor < 0.6) {
    alerts.push({
      severity: 'medium',
      message: 'Growth conditions could be improved.'
    });
  }

  return {
    dailyData: results,
    summary: {
      finalNDVI,
      growthProgress: finalGrowth,
      yieldPotential: Number(yieldPotential),
      farmerScore: Number(farmerScore)
    },
    alerts
  };
};

// Export growth stage calculation from existing code
export { calculateGrowthStage } from './growthStageLogic';