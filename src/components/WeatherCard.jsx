import React, { useState } from 'react';
import { fetchNasaData } from '../utils/nasaApi';
import WeatherDisplay from './WeatherDisplay';

const WeatherCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateInputs = () => {
    if (!formData.latitude || !formData.longitude || !formData.startDate || !formData.endDate) {
      return 'All fields are required';
    }
    
    const lat = parseFloat(formData.latitude);
    const lon = parseFloat(formData.longitude);
    
    if (lat < -90 || lat > 90) {
      return 'Latitude must be between -90 and 90 degrees';
    }
    if (lon < -180 || lon > 180) {
      return 'Longitude must be between -180 and 180 degrees';
    }
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end < start) {
      return 'End date cannot be before start date';
    }
    
    const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      return 'Date range cannot exceed 1 year';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
    
    try {
      const result = await fetchNasaData(formData);
      
      if (result.success) {
        setWeatherData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error in handleSubmit:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="0.000001"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="0.000001"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
        >
          {loading ? 'Fetching Data...' : 'Get Weather Data'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              ❌
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error fetching weather data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {weatherData && <WeatherDisplay data={weatherData} />}
    </div>
  );
};

export default WeatherCard;