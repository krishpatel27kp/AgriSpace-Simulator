import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map click handler component
function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect({
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
      });
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="text-sm">
          <div className="font-semibold mb-1">Selected Location</div>
          <div>Latitude: {position[0].toFixed(6)}°</div>
          <div>Longitude: {position[1].toFixed(6)}°</div>
        </div>
      </Popup>
    </Marker>
  );
}

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

const FarmMap = ({ onLocationSelect, weatherData, isLoading, error }) => {
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
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default FarmMap;