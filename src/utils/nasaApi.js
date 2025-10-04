const formatDateForNasa = (date) => {
  return date.replace(/-/g, '');
};

export const fetchNasaData = async ({ latitude, longitude, startDate, endDate }) => {
  try {
    // Validate inputs
    if (!latitude || !longitude || !startDate || !endDate) {
      throw new Error('Missing required parameters');
    }

    // Format dates for NASA API
    const formattedStartDate = formatDateForNasa(startDate);
    const formattedEndDate = formatDateForNasa(endDate);

    const params = new URLSearchParams({
      parameters: 'T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN',
      community: 'AG',
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      start: formattedStartDate,
      end: formattedEndDate,
      format: 'JSON',
      api_key: 'Rq2QAfQeEHqfSOUj1q18nSedmXVxBrjT88vc8cKP'
    });

    const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?${params}`;
    // Use a CORS proxy to handle the request
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(nasaUrl)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`NASA API responded with status ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();

    if (!data) {
      throw new Error('Empty response from NASA POWER API');
    }

    if (!data.properties) {
      throw new Error('Missing properties in NASA POWER API response');
    }

    if (!data.properties.parameter) {
      throw new Error('Missing parameter data in NASA POWER API response');
    }

    const { parameter } = data.properties;

    // Log the data structure to help debug
    console.log('NASA API Response:', JSON.stringify(data, null, 2));

    // Check each parameter individually and provide specific error messages
    if (!parameter.T2M) {
      throw new Error('Temperature data (T2M) is missing from API response');
    }
    if (!parameter.PRECTOTCORR) {
      throw new Error('Precipitation data (PRECTOTCORR) is missing from API response');
    }
    if (!parameter.ALLSKY_SFC_SW_DWN) {
      throw new Error('Solar radiation data (ALLSKY_SFC_SW_DWN) is missing from API response');
    }

    // Get the latest date's data
    const latestDate = formatDateForNasa(endDate);
    
    // Verify data exists for the requested date
    if (!parameter.T2M[latestDate] || 
        !parameter.PRECTOTCORR[latestDate] || 
        !parameter.ALLSKY_SFC_SW_DWN[latestDate]) {
      throw new Error('No weather data available for the specified date');
    }

    const weatherData = {
      TEMP2M: Number(parameter.T2M[latestDate]),
      PRECTOTCORR: Number(parameter.PRECTOTCORR[latestDate]),
      ALLSKY_SFC_SW_DWN: Number(parameter.ALLSKY_SFC_SW_DWN[latestDate])
    };

    // Validate the numbers
    if (Object.values(weatherData).some(isNaN)) {
      throw new Error('Invalid numeric values in weather data');
    }

    return {
      success: true,
      data: weatherData
    };
  } catch (error) {
    console.error('NASA POWER API Error:', error);
    return {
      success: false,
      error: error.response?.data?.messages || error.message || 'Failed to fetch NASA POWER data'
    };
  }
};