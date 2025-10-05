import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const FertilizerRecommendations = ({ recommendations }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
      <FaShoppingCart className="text-purple-500" />
      Recommended Fertilizers
    </h3>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {recommendations.map((product, index) => (
        <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-white font-semibold">{product.name}</div>
              <div className="text-sm text-gray-400">{product.brand}</div>
              <div className="text-xs text-green-300 mt-1">{product.reason}</div>
            </div>
            <a
              href={`https://www.amazon.in/s?k=${encodeURIComponent(product.name + ' fertilizer')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Amazon India
            </a>
          </div>
          <div className="text-sm text-gray-300 mb-1">Composition: {product.composition}</div>
          <div className="text-sm text-gray-300">Rate: {product.applicationRate}</div>
        </div>
      ))}
    </div>
  </div>
);

export default FertilizerRecommendations;