import { CROP_PARAMETERS, SOIL_TYPES, optimizeParameters } from './agronomicLogic.js';

export const simulateFarming = ({
  cropType = 'wheat',
  soilType = 'loam',
  rainfall = 0,
  temperature = 20,
  solarRadiation,
  irrigation = 50,
  fertilizer = 50
}) => {
  try {
    // Get crop and soil parameters
    const crop = CROP_PARAMETERS[cropType.toLowerCase()];
    const soil = SOIL_TYPES[soilType.toLowerCase()];
    if (!crop) {
      throw new Error('Invalid crop type');
    }
    if (!soil) {
      throw new Error('Invalid soil type');
    }

    // Enhanced water calculations considering soil properties
    const irrigationWater = (irrigation / 100) * crop.waterNeed;
    const effectiveRainfall = rainfall * soil.waterRetention;
    const totalWater = effectiveRainfall + (irrigationWater * soil.waterRetention);
    const drainageRisk = Math.max(0, (totalWater / crop.waterNeed - 1) * soil.drainageRate * 100);

    // Temperature and solar radiation stress calculations
    let tempDiff;
    let temperatureEffect;
    let radiationEffect;
    if (temperature < crop.optimalTemp.min) {
      tempDiff = crop.optimalTemp.min - temperature;
      temperatureEffect = Math.max(0, 100 - (tempDiff / crop.tempRange) * 100);
    } else if (temperature > crop.optimalTemp.max) {
      tempDiff = temperature - crop.optimalTemp.max;
      temperatureEffect = Math.max(0, 100 - (tempDiff / crop.tempRange) * 100);
    } else {
      temperatureEffect = 100;
    }

    // Water effect calculations
    const waterEffect = Math.max(0, 100 - Math.abs(totalWater - crop.waterNeed) / crop.waterNeed * 100);

    // Solar radiation effect - normalized calculation with error handling
    radiationEffect = solarRadiation ? 
      Math.min(100, Math.max(0, (solarRadiation / 1000) * 100)) :
      85; // Default to 85% efficiency if no radiation data available

    // Fertilizer calculations considering soil properties
    const effectiveFertilizer = fertilizer * soil.fertilizerRetention;
    const fertilizerEffect = Math.max(0, 100 - Math.abs(effectiveFertilizer - crop.fertilizerNeed.nitrogen) / crop.fertilizerNeed.nitrogen * 100);

    // Calculate carbon footprint
    const carbonFootprint = (
      crop.carbonFootprint.baseEmission +
      (irrigationWater * crop.carbonFootprint.irrigationFactor) +
      (fertilizer * crop.carbonFootprint.fertilizerFactor)
    );

    // Calculate water usage efficiency (WUE)
    const waterEfficiency = Math.min(100, (crop.waterNeed / totalWater) * 100);

    // Generate recommendations
    const recommendations = [];

    // Temperature recommendations
    if (temperature < crop.optimalTemp.min) {
      recommendations.push({
        type: 'temperature_low',
        severity: tempDiff > 5 ? 'high' : 'medium',
        message: tempDiff > 5 
          ? `Critical: Protect crops from cold damage. Consider using frost protection methods. Plant when temperature is above ${crop.optimalTemp.min}°C.`
          : `Advisory: Monitor night temperatures. Consider using mulch to retain soil heat.`
      });
    } else if (temperature > crop.optimalTemp.max) {
      recommendations.push({
        type: 'temperature_high',
        severity: tempDiff > 5 ? 'high' : 'medium',
        message: tempDiff > 5
          ? `Critical: Use shade structures or cooling systems. Schedule irrigation for early morning. Consider heat-tolerant varieties.`
          : `Advisory: Increase irrigation frequency but reduce volume per session. Apply mulch to keep soil cool.`
      });
    }

    // Water recommendations
    const waterDeficit = crop.waterNeed - totalWater;
    if (waterDeficit > 0) {
      recommendations.push({
        type: 'water_deficit',
        severity: waterDeficit > crop.waterNeed * 0.3 ? 'high' : 'medium',
        message: waterDeficit > crop.waterNeed * 0.3
          ? `Critical: Increase irrigation by ${Math.round(waterDeficit)}mm. Install drip irrigation for better efficiency.`
          : `Advisory: Increase irrigation by ${Math.round(waterDeficit)}mm. Apply mulch to reduce evaporation.`
      });
    } else if (totalWater > crop.waterNeed * 1.3) {
      const excessWater = totalWater - crop.waterNeed;
      recommendations.push({
        type: 'water_excess',
        severity: 'high',
        message: `Critical: Reduce irrigation by ${Math.round(excessWater)}mm. Check field drainage to prevent root rot.`
      });
    }

    // Fertilizer recommendations
    const fertilizerDiff = crop.fertilizerNeed.nitrogen - fertilizer;
    if (Math.abs(fertilizerDiff) > 10) {
      recommendations.push({
        type: 'fertilizer_adjustment',
        severity: Math.abs(fertilizerDiff) > 20 ? 'high' : 'medium',
        message: fertilizerDiff > 0
          ? `Increase fertilizer by ${Math.round(fertilizerDiff)}kg/ha. Split into 2-3 applications.`
          : `Reduce fertilizer by ${Math.round(-fertilizerDiff)}kg/ha to prevent nutrient runoff.`
      });
    }

    // Soil-specific recommendations
    if (drainageRisk > 30) {
      recommendations.push({
        type: 'drainage_risk',
        severity: drainageRisk > 50 ? 'high' : 'medium',
        message: `${soil.description} Consider ${drainageRisk > 50 ? 'installing drainage systems' : 'reducing irrigation'} to prevent waterlogging.`
      });
    }

    // Solar radiation recommendations
    if (solarRadiation < crop.radiationNeed * 0.8) {
      recommendations.push({
        type: 'solar_radiation',
        severity: 'medium',
        message: 'Consider adjusting planting dates to match peak solar radiation periods.'
      });
    }

    // Calculate optimized parameters
    const optimized = optimizeParameters(cropType, soilType, {
      PRECTOTCORR: rainfall,
      TEMP2M: temperature,
      ALLSKY_SFC_SW_DWN: solarRadiation
    });

    // Calculate final scores with enhanced factors
    const yieldScore = Math.round((
      temperatureEffect * 0.3 + 
      waterEffect * 0.3 + 
      fertilizerEffect * 0.2 + 
      radiationEffect * 0.2
    ) * 100) / 100;

    const sustainabilityScore = Math.round((
      waterEfficiency * 0.4 +
      (100 - (carbonFootprint / 5) * 100) * 0.3 +
      (soil.fertilizerRetention * 100) * 0.3
    ));

    return {
      success: true,
      data: {
        cropType,
        soilType,
        yieldScore,
        waterUsed: totalWater,
        sustainabilityScore,
        carbonFootprint: Math.round(carbonFootprint * 100) / 100,
        waterEfficiency: Math.round(waterEfficiency),
        details: {
          temperatureEffect: Math.round(temperatureEffect),
          waterEffect: Math.round(waterEffect),
          fertilizerEffect: Math.round(fertilizerEffect),
          radiationEffect: Math.round(radiationEffect),
          drainageRisk: Math.round(drainageRisk)
        },
        recommendations,
        optimization: optimized
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
