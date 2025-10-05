import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const customIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map click handler component
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6))
      });
    },
  });
  return null;
};

// Weather data display component
const WeatherPopup = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-64 z-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-64 z-50">
        <div className="flex">
          <div className="flex-shrink-0">❌</div>
          <div className="ml-3 text-sm text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-64 z-50">
      <div className="text-center mb-2">
        <h3 className="font-semibold text-gray-800">Current Weather</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">🌡️ Temperature:</span>
          <span className="font-medium">{data.TEMP2M?.toFixed(1)}°C</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">🌧️ Rainfall:</span>
          <span className="font-medium">{data.PRECTOTCORR?.toFixed(1)} mm</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">☀️ Solar:</span>
          <span className="font-medium">{data.ALLSKY_SFC_SW_DWN?.toFixed(1)} kW⋅h/m²</span>
        </div>
      </div>
    </div>
  );
};

const FarmMap = ({ onLocationSelect, weatherData = null, isLoading = false, error = null }) => {
  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
      <WeatherPopup data={weatherData} isLoading={isLoading} error={error} />
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {weatherData && (
          <Marker position={[weatherData.lat, weatherData.lng]} icon={customIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-1">Selected Location</div>
                <div>Latitude: {weatherData.lat.toFixed(6)}°</div>
                <div>Longitude: {weatherData.lng.toFixed(6)}°</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default FarmMap;