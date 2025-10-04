import { SOIL_TYPES } from './agronomicLogic';

const CROP_PARAMETERS = {
    wheat: {
        optimalTemp: { min: 15, max: 25 },
        waterNeeds: 45, // mm/day
        nutrientNeeds: { nitrogen: 150, phosphorus: 60, potassium: 60 },
        soilPH: { min: 6.0, max: 7.0 },
        growthStages: {
            germination: { duration: 7, sensitivity: 1.2 },
            vegetative: { duration: 30, sensitivity: 1.0 },
            reproductive: { duration: 21, sensitivity: 1.5 },
            maturation: { duration: 14, sensitivity: 0.8 }
        },
        pestSensitivity: 0.7,
        carbonFootprint: 0.6
    },
    rice: {
        optimalTemp: { min: 20, max: 30 },
        waterNeeds: 60,
        nutrientNeeds: { nitrogen: 100, phosphorus: 50, potassium: 50 },
        soilPH: { min: 5.5, max: 6.5 },
        growthStages: {
            germination: { duration: 5, sensitivity: 1.3 },
            vegetative: { duration: 35, sensitivity: 1.1 },
            reproductive: { duration: 25, sensitivity: 1.4 },
            maturation: { duration: 15, sensitivity: 0.7 }
        },
        pestSensitivity: 0.8,
        carbonFootprint: 0.8
    },
    corn: {
        optimalTemp: { min: 18, max: 28 },
        waterNeeds: 50,
        nutrientNeeds: { nitrogen: 180, phosphorus: 70, potassium: 70 },
        soilPH: { min: 5.8, max: 7.0 },
        growthStages: {
            germination: { duration: 6, sensitivity: 1.1 },
            vegetative: { duration: 40, sensitivity: 1.2 },
            reproductive: { duration: 28, sensitivity: 1.3 },
            maturation: { duration: 18, sensitivity: 0.9 }
        },
        pestSensitivity: 0.6,
        carbonFootprint: 0.7
    },
    soybeans: {
        optimalTemp: { min: 20, max: 30 },
        waterNeeds: 40,
        nutrientNeeds: { nitrogen: 0, phosphorus: 40, potassium: 60 },
        soilPH: { min: 6.0, max: 6.8 },
        growthStages: {
            germination: { duration: 5, sensitivity: 1.0 },
            vegetative: { duration: 35, sensitivity: 1.1 },
            reproductive: { duration: 25, sensitivity: 1.4 },
            maturation: { duration: 15, sensitivity: 0.9 }
        },
        pestSensitivity: 0.5,
        carbonFootprint: 0.4
    }
};

export function simulateCropGrowth(settings) {
    const crop = CROP_PARAMETERS[settings.cropType];
    const soil = SOIL_TYPES[settings.soilType];
    
    if (!crop || !soil) return null;

    // Calculate temperature stress (0-1, where 1 is optimal)
    const tempStress = calculateTemperatureStress(settings.temperature, crop.optimalTemp);
    
    // Calculate water stress
    const waterStress = calculateWaterStress(
        settings.rainfall,
        settings.irrigation,
        crop.waterNeeds,
        soil.waterRetention,
        soil.drainageRate
    );
    
    // Calculate nutrient stress based on fertilizer
    const nutrientStress = calculateNutrientStress(
        settings.fertilizer,
        soil.fertilizerRetention
    );
    
    // Get growth stage sensitivity
    const stageSensitivity = crop.growthStages[settings.cropStage].sensitivity;
    
    // Calculate overall growth score
    const growthScore = calculateGrowthScore(
        tempStress,
        waterStress,
        nutrientStress,
        stageSensitivity
    );
    
    // Generate recommendations
    const recommendations = generateRecommendations(
        settings,
        tempStress,
        waterStress,
        nutrientStress,
        soil
    );
    
    // Calculate advanced metrics
    const carbonFootprint = calculateCarbonFootprint(settings, crop);
    const biodiversityScore = calculateBiodiversityScore(settings, soil);
    const pestRisk = calculatePestRisk(settings, crop);
    const projectedYield = calculateProjectedYield(growthScore);
    const soilHealthScore = calculateSoilHealth(settings, soil);

    // Calculate sustainability score
    const sustainabilityScore = Math.round(
        (biodiversityScore * 0.3) +
        ((100 - carbonFootprint) * 0.3) +
        (soilHealthScore * 0.4)
    );

    // Add advanced recommendations based on new metrics
    if (carbonFootprint > 70) {
        recommendations.push("Consider reducing chemical inputs and implementing more sustainable practices");
    }
    if (biodiversityScore < 50) {
        recommendations.push("Implement crop rotation and increase organic matter to improve biodiversity");
    }
    if (pestRisk > 60) {
        recommendations.push("High pest risk detected. Consider integrated pest management strategies");
    }

    return {
        growthScore,
        stressFactors: {
            temperature: Math.round((1 - tempStress) * 100),
            water: Math.round((1 - waterStress) * 100),
            nutrients: Math.round((1 - nutrientStress) * 100)
        },
        advancedMetrics: {
            carbonFootprint,
            biodiversityScore,
            pestRisk,
            sustainabilityScore
        },
        recommendations,
        projectedYield,
        soilHealth: soilHealthScore,
        cropDetails: {
            ...crop,
            currentStage: settings.cropStage,
            daysToMaturity: Object.values(crop.growthStages).reduce((sum, stage) => sum + stage.duration, 0)
        }
    };
}

function calculateCarbonFootprint(settings, crop) {
    const baseFootprint = crop.carbonFootprint;
    const fertilizerImpact = settings.fertilizer / 100 * 0.3;
    const irrigationImpact = settings.irrigation / 100 * 0.2;
    
    return (baseFootprint + fertilizerImpact + irrigationImpact) * 100;
}

function calculateBiodiversityScore(settings, soil) {
    const organicFarming = settings.organicPractices ? 1.2 : 1.0;
    const soilHealthImpact = soil.healthScore / 100;
    const chemicalUse = (100 - settings.fertilizer) / 100;
    
    return Math.round((organicFarming * soilHealthImpact * chemicalUse) * 100);
}

function calculatePestRisk(settings, crop) {
    const tempStress = calculateTemperatureStress(settings.temperature, crop.optimalTemp);
    const moistureLevel = (settings.rainfall + settings.irrigation) / crop.waterNeeds;
    const basePestRisk = crop.pestSensitivity;
    
    return Math.min(100, Math.round((
        (1 - tempStress) * 0.3 +
        (moistureLevel > 1.2 ? (moistureLevel - 1) * 0.4 : 0) +
        basePestRisk * 0.3
    ) * 100));
}

function calculateTemperatureStress(temp, optimal) {
    if (temp >= optimal.min && temp <= optimal.max) {
        return 1.0;
    }
    const distance = Math.min(
        Math.abs(temp - optimal.min),
        Math.abs(temp - optimal.max)
    );
    return Math.max(0, 1 - (distance / 10));
}

function calculateWaterStress(rainfall, irrigation, needs, retention, drainage) {
    const totalWater = (rainfall + (irrigation / 100 * 50)) * retention;
    const effectiveWater = totalWater * drainage;
    const ratio = effectiveWater / needs;
    return ratio > 1.5 ? 1 - ((ratio - 1.5) * 0.5) : // Too much water
           ratio < 0.5 ? ratio : // Too little water
           1 - Math.abs(1 - ratio); // Just right or close
}

function calculateNutrientStress(fertilizer, retention) {
    const effectiveFertilizer = (fertilizer / 100) * retention;
    return Math.min(1, effectiveFertilizer);
}

function calculateGrowthScore(tempStress, waterStress, nutrientStress, stageSensitivity) {
    const baseScore = (tempStress + waterStress + nutrientStress) / 3;
    return Math.round(baseScore * 100 * stageSensitivity);
}

function calculateProjectedYield(growthScore) {
    return Math.round((growthScore / 100) * (80 + Math.random() * 20));
}

function calculateSoilHealth(settings, soil) {
    const overIrrigation = Math.max(0, (settings.irrigation / 100) - soil.drainageRate);
    const overFertilization = Math.max(0, (settings.fertilizer / 100) - soil.fertilizerRetention);
    
    return Math.round(100 - (overIrrigation + overFertilization) * 50);
}

function generateRecommendations(settings, tempStress, waterStress, nutrientStress, soil) {
    const recommendations = [];
    
    if (tempStress < 0.7) {
        recommendations.push(settings.temperature > 25 ? 
            "Consider providing shade or cooling measures" :
            "Consider increasing temperature or providing protection from cold");
    }
    
    if (waterStress < 0.7) {
        if ((settings.rainfall + settings.irrigation) * soil.waterRetention > soil.drainageRate * 100) {
            recommendations.push("Reduce irrigation to prevent waterlogging");
        } else {
            recommendations.push("Increase irrigation to meet crop water needs");
        }
    }
    
    if (nutrientStress < 0.7) {
        if (settings.fertilizer > 70) {
            recommendations.push("Reduce fertilizer application to prevent nutrient runoff");
        } else {
            recommendations.push("Consider increasing fertilizer application");
        }
    }
    
    return recommendations;
}