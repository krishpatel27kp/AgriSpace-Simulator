const API_BASE_URL = '/nasa-api/api/temporal/daily/point';

export const fetchNasaData = async ({ latitude, longitude }) => {
  try {
    if (!latitude || !longitude) {
      throw new Error("Missing required parameters: latitude or longitude");
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      throw new Error("Invalid latitude: must be between -90 and 90 degrees");
    }

    // Normalize longitude to [-180, 180] range
    let normalizedLong = longitude % 360;
    if (normalizedLong > 180) {
      normalizedLong = normalizedLong - 360;
    } else if (normalizedLong < -180) {
      normalizedLong = normalizedLong + 360;
    }

    // Get average data from last 30 days
    const today = new Date();
    const startDateObj = new Date();
    startDateObj.setDate(today.getDate() - 29); // 30 days ago
    const startStr = startDateObj.toISOString().split('T')[0].replace(/-/g, '');
    const endStr = today.toISOString().split('T')[0].replace(/-/g, '');

    const params = new URLSearchParams({
      parameters: 'T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN',
      community: 'AG',
      longitude: normalizedLong.toString(),
      latitude: latitude.toString(),
      start: startStr,
      end: endStr,
      format: 'JSON',
      temporal_average: 'DAILY'
    });

    const apiUrl = `${API_BASE_URL}?${params}`;
    console.log("Fetching NASA POWER data from:", apiUrl);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status} - ${await response.text()}`);
    }
    const data = await response.json();
    const params_data = data.properties?.parameter;
    if (!params_data || !params_data.T2M || !params_data.PRECTOTCORR) {
      throw new Error("NASA POWER API returned incomplete data");
    }

    // Extract and average the values (they are objects with date as key)
    const tempArr = Object.values(params_data.T2M).filter(v => v > -900);
    const rainArr = Object.values(params_data.PRECTOTCORR).filter(v => v > -900);
    const solarArr = Object.values(params_data.ALLSKY_SFC_SW_DWN).filter(v => v > -900);

    if (!tempArr.length || !rainArr.length || !solarArr.length) {
      throw new Error("NASA POWER returned invalid data for: temperature, rainfall, solar radiation. This location might not have complete data coverage. Please try a different location.");
    }

    const avgTemp = tempArr.reduce((a, b) => a + b, 0) / tempArr.length;
    const avgRain = rainArr.reduce((a, b) => a + b, 0) / rainArr.length;
    const avgSolar = solarArr.reduce((a, b) => a + b, 0) / solarArr.length;

    // Calculate soil moisture approximation using rainfall and solar radiation
    const soilMoisture = Math.min(100, Math.max(0, (avgRain * 10) / (1 + (avgSolar / 1000))));

    // Calculate trends (example using hardcoded baseline values)
    const baseTemp = 25;
    const baseRain = 2.5;
    const baseSolar = 10;
    const baseSoilMoisture = 50;

    const tempTrend = ((avgTemp - baseTemp) / baseTemp) * 100;
    const rainTrend = ((avgRain - baseRain) / baseRain) * 100;
    const solarTrend = ((avgSolar - baseSolar) / baseSolar) * 100;
    const soilMoistureTrend = ((soilMoisture - baseSoilMoisture) / baseSoilMoisture) * 100;

    const result = {
      temperature: Number(avgTemp.toFixed(1)),
      rainfall: Number(avgRain.toFixed(1)),
      solarRadiation: Number(avgSolar.toFixed(1)),
      soilMoisture: Number(soilMoisture.toFixed(1)),
      temperatureTrend: Number(tempTrend.toFixed(1)),
      rainfallTrend: Number(rainTrend.toFixed(1)),
      solarRadiationTrend: Number(solarTrend.toFixed(1)),
      soilMoistureTrend: Number(soilMoistureTrend.toFixed(1)),
      dateRange: {
        start: startDateObj.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      },
      coordinates: {
        lat: latitude,
        lng: longitude
      }
    };

    console.log("NASA API Response:", result);
    return result;

  } catch (error) {
    console.error('NASA POWER API Error:', error);
    throw error;
  }
};