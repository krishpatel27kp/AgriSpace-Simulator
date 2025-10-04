import React, { useState } from 'react';
import Navbar from './components/Navbar';
import NewFarmDashboard from './components/NewFarmDashboard';
import Footer from './components/Footer';
import FarmMap from './components/FarmMap';
import FarmResults from './components/FarmResults';
import FarmSimulator from './components/FarmSimulator';
import { simulateFarming } from './utils/agronomicLogic';
import { fetchNasaData } from './utils/nasaApi';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { isDarkMode } = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [farmResults, setFarmResults] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  
  const [farmSettings, setFarmSettings] = useState({
    irrigation: 50,
    fertilizer: 50,
    cropType: 'wheat',
    details: {
      temperatureEffect: 70,
      waterEffect: 75,
      fertilizerEffect: 80
    }
  });

  const handleSettingsChange = (newSettings) => {
    setFarmSettings(newSettings);
    const result = simulateFarming(newSettings, weatherData);
    setSimulationData(result);
  };

  const handleLocationSelect = async ({ latitude, longitude }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get dates in YYYY-MM-DD format
      const today = new Date();
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const result = await fetchNasaData({
        latitude,
        longitude,
        startDate: formatDate(oneWeekAgo),
        endDate: formatDate(today)
      });

      // Use fallback data if NASA API fails
      const weatherDataToUse = result.success ? result.data : {
        TEMP2M: 20,  // Default temperature 20°C
        PRECTOTCORR: 25,  // Default rainfall 25mm
        ALLSKY_SFC_SW_DWN: 200  // Default solar radiation
      };

      // Set weather data even if using fallback
      setWeatherData(weatherDataToUse);
      
      if (!result.success) {
        console.warn('Using fallback weather data due to NASA API error:', result.error);
      }

      // Run simulation with weather data (actual or fallback)
      const newSimulation = simulateFarming({
        cropType: farmSettings.cropType || 'wheat',
        rainfall: weatherDataToUse.PRECTOTCORR,
        temperature: weatherDataToUse.TEMP2M,
        irrigation: farmSettings.irrigation,
        fertilizer: farmSettings.fertilizer,
        soilType: 'loam'
      });

      if (newSimulation.success) {
        setSimulationData({
          ...newSimulation.data,
          details: {
            ...newSimulation.data.details,
            temperatureEffect: newSimulation.data.details?.temperatureEffect || 70,
            waterEffect: newSimulation.data.details?.waterEffect || 75,
            fertilizerEffect: newSimulation.data.details?.fertilizerEffect || 80
          }
        });
      } else {
        console.error('Simulation failed:', newSimulation.error);
        setError('Failed to simulate farm conditions');
      }
    } catch (err) {
      console.error('Location selection error:', err);
      setError('Failed to process location data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add event listener for page changes
  React.useEffect(() => {
    const handlePageChange = (event) => {
      setCurrentPage(event.detail);
    };
    window.addEventListener('changePage', handlePageChange);
    return () => {
      window.removeEventListener('changePage', handlePageChange);
    };
  }, []);

  const handleFarmDataSubmit = (data) => {
    // Process the farm data and generate results
    const results = simulateFarming({
      ...data,
      weatherData,
      settings: farmSettings
    });

    if (results.success) {
      setFarmResults({
        ...data,
        ...results.data,
        recommendations: results.data.recommendations?.map(rec => rec.message) || []
      });
      setCurrentPage('results');
    }
  };

  const renderContent = () => {
    if (currentPage === 'simulator') {
      return <FarmSimulator />;
    }
    
    if (currentPage === 'results' && farmResults) {
      return <FarmResults data={farmResults} />;
    }

    return (
      <>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          Farm Simulation Dashboard
        </h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Harness NASA's POWER data to optimize your farming decisions and promote sustainable agriculture
        </p>
        
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-blue-500">📍</span> Select Your Farm Location
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Click anywhere on the map to select your farm location and get real-time weather data from NASA's POWER API.
            </p>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <FarmMap
                onLocationSelect={handleLocationSelect}
                weatherData={weatherData}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>

        <NewFarmDashboard
          weatherData={weatherData}
          isLoading={isLoading}
          error={error}
          farmSettings={farmSettings}
          onSettingsChange={handleSettingsChange}
          simulationData={simulationData}
          onFarmDataSubmit={handleFarmDataSubmit}
        />
      </>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex-grow bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white transition-colors duration-200">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;