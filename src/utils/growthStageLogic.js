// Crop growth stages and parameters
export const CROP_DATA = {
  wheat: {
    name: 'Wheat',
    totalGrowthDays: 120,
    optimalTemp: { min: 15, max: 25 },
    waterNeeds: 45, // mm/day
    growthStages: {
      germination: {
        duration: 7,
        sensitivity: 1.2,
        waterNeed: 1.2,
        description: "Seeds absorbing water and beginning to sprout",
        healthIndicators: ["Uniform emergence", "Strong seedling vigor"]
      },
      vegetative: {
        duration: 45,
        sensitivity: 1.0,
        waterNeed: 1.0,
        description: "Leaf and stem development, tillering phase",
        healthIndicators: ["Dark green leaves", "Multiple tillers", "Strong stem"]
      },
      flowering: {
        duration: 30,
        sensitivity: 1.5,
        waterNeed: 1.3,
        description: "Head emergence and grain filling",
        healthIndicators: ["Full head emergence", "Proper pollination", "Good kernel development"]
      },
      maturity: {
        duration: 38,
        sensitivity: 0.8,
        waterNeed: 0.7,
        description: "Grain hardening and drying",
        healthIndicators: ["Golden color", "Dry kernels", "Ready for harvest"]
      }
    }
  },
  // Add other crops here...
};

// Calculate growth stage based on days elapsed
export const calculateGrowthStage = (cropType, daysElapsed) => {
  const crop = CROP_DATA[cropType];
  if (!crop) return null;

  let accumulatedDays = 0;
  for (const [stage, data] of Object.entries(crop.growthStages)) {
    accumulatedDays += data.duration;
    if (daysElapsed <= accumulatedDays) {
      const stageProgress = (daysElapsed - (accumulatedDays - data.duration)) / data.duration;
      return {
        stage,
        progress: Math.min(100, Math.round(stageProgress * 100)),
        description: data.description,
        healthIndicators: data.healthIndicators,
        daysInStage: daysElapsed - (accumulatedDays - data.duration)
      };
    }
  }
  
  return {
    stage: 'maturity',
    progress: 100,
    description: crop.growthStages.maturity.description,
    healthIndicators: crop.growthStages.maturity.healthIndicators,
    daysInStage: crop.growthStages.maturity.duration
  };
};

// Calculate yield potential based on growth conditions and stage
export const calculateYieldPotential = (params) => {
  const {
    cropType,
    daysElapsed,
    temperature,
    rainfall,
    soilHealth,
    pestRisk
  } = params;

  const crop = CROP_DATA[cropType];
  if (!crop) return 0;

  const growthStage = calculateGrowthStage(cropType, daysElapsed);
  const stageData = crop.growthStages[growthStage.stage];

  // Temperature effect
  const tempEffect = temperature >= crop.optimalTemp.min && temperature <= crop.optimalTemp.max
    ? 1.0
    : 1.0 - (Math.min(Math.abs(temperature - crop.optimalTemp.min), 
                      Math.abs(temperature - crop.optimalTemp.max)) / 10);

  // Water effect
  const waterEffect = Math.min(1.0, rainfall / (crop.waterNeeds * stageData.waterNeed));

  // Calculate base yield considering growth stage sensitivity
  const baseYield = (
    tempEffect * 0.3 +
    waterEffect * 0.3 +
    (soilHealth / 100) * 0.2 +
    (1 - pestRisk / 100) * 0.2
  ) * stageData.sensitivity;

  return Math.round(baseYield * 100);
};

// Generate detailed growth summary
export const generateGrowthSummary = (params) => {
  const {
    cropType,
    daysElapsed,
    temperature,
    rainfall,
    soilHealth,
    pestRisk,
    yieldPotential
  } = params;

  const growthStage = calculateGrowthStage(cropType, daysElapsed);
  const crop = CROP_DATA[cropType];

  // Calculate overall progress
  const totalProgress = (daysElapsed / crop.totalGrowthDays) * 100;

  // Generate status message
  let statusMessage = '';
  if (yieldPotential >= 80) {
    statusMessage = 'Excellent growth conditions. Crop is thriving.';
  } else if (yieldPotential >= 60) {
    statusMessage = 'Good growth conditions. Some room for optimization.';
  } else if (yieldPotential >= 40) {
    statusMessage = 'Fair growth conditions. Consider adjustments needed.';
  } else {
    statusMessage = 'Poor growth conditions. Immediate attention required.';
  }

  // Generate recommendations
  const recommendations = [];
  if (temperature < crop.optimalTemp.min) {
    recommendations.push('Temperature is below optimal range. Consider protective measures.');
  } else if (temperature > crop.optimalTemp.max) {
    recommendations.push('Temperature is above optimal range. Monitor for heat stress.');
  }

  if (rainfall < crop.waterNeeds) {
    recommendations.push('Insufficient water. Consider irrigation.');
  }

  if (soilHealth < 70) {
    recommendations.push('Soil health needs improvement. Consider soil amendments.');
  }

  if (pestRisk > 30) {
    recommendations.push('Elevated pest risk. Monitor and implement IPM strategies.');
  }

  return {
    currentStage: growthStage.stage,
    daysElapsed,
    daysRemaining: crop.totalGrowthDays - daysElapsed,
    progress: Math.min(100, Math.round(totalProgress)),
    stageProgress: growthStage.progress,
    yieldPotential,
    status: statusMessage,
    recommendations,
    healthIndicators: growthStage.healthIndicators
  };
};