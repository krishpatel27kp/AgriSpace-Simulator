import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const RiskIndicator = ({ score }) => {
  const getColor = (score) => {
    if (score < 30) return 'green';
    if (score < 60) return 'yellow';
    return 'red';
  };
  
  return (
    <div className={`flex items-center gap-2 text-${getColor(score)}-500`}>
      <FaExclamationTriangle />
      <span className="font-semibold">{score}% Risk</span>
    </div>
  );
};

export default RiskIndicator;