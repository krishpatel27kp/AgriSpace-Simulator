// Crop growth stages and parameters
export const CROP_DATA = {
  wheat: {
    name: 'Wheat',
    totalGrowthDays: 120,
    optimalTemp: { min: 15, max: 25 },
    waterNeeds: 45, // mm/day
    expectedYield: 4.5, // tons/ha
    growthStages: {
      germination: {
        start: 0,
        end: 15,
        icon: '🌱',
        sensitivity: 1.2,
        waterNeed: 1.2,
        description: "Seeds absorbing water and beginning to sprout",
        healthIndicators: ["Uniform emergence", "Strong seedling vigor"]
      },
      vegetative: {
        start: 16,
        end: 45,
        icon: '🌿',
        sensitivity: 1.0,
        waterNeed: 1.0,
        description: "Leaf and stem development, tillering phase",
        healthIndicators: ["Dark green leaves", "Multiple tillers", "Strong stem"]
      },
      flowering: {
        start: 46,
        end: 90,
        icon: '🌾',
        sensitivity: 1.5,
        waterNeed: 1.3,
        description: "Head emergence and grain filling",
        healthIndicators: ["Full head emergence", "Proper pollination", "Good kernel development"]
      },
      maturity: {
        start: 91,
        end: 120,
        icon: '🌽',
        sensitivity: 0.8,
        waterNeed: 0.7,
        description: "Grain hardening and drying",
        healthIndicators: ["Golden color", "Dry kernels", "Ready for harvest"]
      }
    }
  },
  rice: {
    name: 'Rice',
    totalGrowthDays: 120,
    optimalTemp: { min: 20, max: 30 },
    waterNeeds: 60,
    expectedYield: 5.0,
    growthStages: {
      germination: { start: 0, end: 20, icon: '🌱', sensitivity: 1.2, waterNeed: 1.4 },
      vegetative: { start: 21, end: 55, icon: '🌿', sensitivity: 1.1, waterNeed: 1.2 },
      flowering: { start: 56, end: 95, icon: '🌾', sensitivity: 1.4, waterNeed: 1.3 },
      maturity: { start: 96, end: 120, icon: '🌽', sensitivity: 0.8, waterNeed: 0.9 }
    }
  },
  corn: {
    name: 'Corn',
    totalGrowthDays: 120,
    optimalTemp: { min: 18, max: 32 },
    waterNeeds: 50,
    expectedYield: 6.0,
    growthStages: {
      germination: { start: 0, end: 10, icon: '🌱', sensitivity: 1.3, waterNeed: 1.1 },
      vegetative: { start: 11, end: 40, icon: '🌿', sensitivity: 1.1, waterNeed: 1.0 },
      flowering: { start: 41, end: 85, icon: '🌾', sensitivity: 1.6, waterNeed: 1.4 },
      maturity: { start: 86, end: 120, icon: '🌽', sensitivity: 0.7, waterNeed: 0.8 }
    }
  }
};

// Calculate current growth stage based on days elapsed
export const calculateGrowthStage = (cropType, daysElapsed) => {
  const crop = CROP_DATA[cropType];
  if (!crop) return null;

  for (const [stageName, data] of Object.entries(crop.growthStages)) {
    if (daysElapsed >= data.start && daysElapsed <= data.end) {
      const totalDays = data.end - data.start;
      const daysInStage = daysElapsed - data.start;
      const progress = Math.min(100, (daysInStage / totalDays) * 100);
      
      return {
        stage: stageName,
        icon: data.icon,
        progress,
        description: data.description || `${stageName} stage`,
        healthIndicators: data.healthIndicators || [],
        daysInStage,
        totalDays,
        daysUntilNextStage: data.end - daysElapsed,
        sensitivity: data.sensitivity,
        waterNeed: data.waterNeed
      };
    }
  }
  
  return null;
};

// Calculate yield potential based on current conditions
export const calculateYieldPotential = (params) => {
  const {
    cropType,
    daysElapsed,
    temperature,
    rainfall,
    irrigation = 0,
    fertilizer = 50,
    soilHealth = 80,
    pestRisk = 20
  } = params;

  const cropKey = typeof cropType === 'string' ? cropType.toLowerCase() : '';
  const crop = CROP_DATA[cropKey];
  if (!crop) return { percentage: 0, tons: 0 };

  const growthStage = calculateGrowthStage(cropKey, daysElapsed);
  if (!growthStage) return { percentage: 0, tons: 0 };

  // Base factors
  const tempEffect = temperature >= crop.optimalTemp.min && temperature <= crop.optimalTemp.max
    ? 1.0
    : 1.0 - (Math.min(Math.abs(temperature - crop.optimalTemp.min), 
                      Math.abs(temperature - crop.optimalTemp.max)) / 10);

  // Combined water availability
  const totalWater = rainfall + irrigation;
  const waterEffect = Math.min(1.0, totalWater / (crop.waterNeeds * growthStage.waterNeed));

  // Growth stage sensitivity
  const stageFactor = growthStage.sensitivity || 1.0;

  // Calculate yield percentage
  const yieldPercentage = Math.min(100, Math.max(0,
    (tempEffect * 25 +
    waterEffect * 25 +
    (soilHealth / 100) * 20 +
    (fertilizer / 100) * 20 +
    (1 - pestRisk / 100) * 10) * stageFactor
  ));

  // Calculate actual yield in tons/ha
  const tons = (yieldPercentage / 100) * crop.expectedYield;

  return { percentage: yieldPercentage, tons };
};

// Calculate farmer score based on performance
export const calculateFarmerScore = (simulationData) => {
  const {
    yieldPotential,
    waterEfficiency = 0,
    fertilizerEfficiency = 0,
    sustainabilityScore = 0
  } = simulationData;
  
  return (
    (yieldPotential * 0.4) + 
    (waterEfficiency * 0.25) + 
    (fertilizerEfficiency * 0.2) + 
    (sustainabilityScore * 0.15)
  );

  // Calculate base score from 1-10
  let score = 0;
  
  // Yield contribution (up to 4 points)
  score += (yieldPotential / 100) * 4;
  
  // Water efficiency (up to 2 points)
  score += (waterEfficiency / 100) * 2;
  
  // Fertilizer efficiency (up to 2 points)
  score += (fertilizerEfficiency / 100) * 2;
  
  // Sustainability (up to 2 points)
  score += (sustainabilityScore / 100) * 2;

  // Round to nearest 0.5
  score = Math.round(score * 2) / 2;

  // Determine badge and level
  let badge = '🌱'; // Beginner
  let level = 'Beginner';

  if (score >= 9) {
    badge = '🏆';
    level = 'Expert';
  } else if (score >= 7) {
    badge = '🌟';
    level = 'Advanced';
  } else if (score >= 5) {
    badge = '🚜';
    level = 'Intermediate';
  }

  return { score, badge, level };
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