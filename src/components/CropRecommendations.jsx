import React from 'react';
import { FaSeedling } from 'react-icons/fa';
import CropRecommendationCard from './CropRecommendationCard';

function CropRecommendations({ recommendations }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <FaSeedling className="text-green-500" />
        Recommended Crops
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.slice(0, 3).map((rec, index) => (
          <CropRecommendationCard key={index} rec={rec} isBest={index === 0} />
        ))}
      </div>
    </div>
  );
}

export default CropRecommendations;