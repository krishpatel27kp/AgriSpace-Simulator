import React from 'react';

function CropRecommendationCard({ rec, isBest }) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div
      className={`bg-gray-700/50 p-4 rounded-lg transition-all duration-300 ${isBest ? 'border-2 border-green-500 shadow-lg' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          {isBest && <span className="px-2 py-1 bg-green-600 text-white text-xs rounded mr-2">Best</span>}
          {rec.crop}
        </div>
        <button
          className="text-xs text-green-400 underline focus:outline-none"
          onClick={(e) => { e.stopPropagation(); setExpanded((x) => !x); }}
        >{expanded ? 'Hide Details' : 'Show Details'}</button>
      </div>
      <div className="text-sm text-gray-300 mb-2">Suitability Score: {rec.score}%</div>
      {expanded && (
        <ul className="text-sm text-gray-400">
          {rec.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-center gap-2 mb-1">
              <span className="w-1 h-1 rounded-full bg-green-500"></span>
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CropRecommendationCard;