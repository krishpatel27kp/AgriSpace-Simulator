import React from 'react';
import { getRelevantTip } from '../utils/farmingTips';

const TipCard = ({ simulationData }) => {
  const tip = getRelevantTip(simulationData);

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg shadow-md p-4 border-l-4 border-green-400 dark:border-green-500 transition-colors duration-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-2xl">💡</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Farming Tip</h3>
          <p className="text-gray-600 dark:text-gray-300">{tip.tip}</p>
        </div>
      </div>
    </div>
  );
};

export default TipCard;