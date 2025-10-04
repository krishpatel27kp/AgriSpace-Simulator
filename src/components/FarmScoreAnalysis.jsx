import React from 'react';

const MetricRow = ({ label, value, hint }) => {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <div>
        <div className="font-medium">{label}</div>
        {hint && <div className="text-xs text-gray-500">{hint}</div>}
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
};

const scoreColor = (score) => {
  if (score >= 90) return 'bg-green-500 text-white';
  if (score >= 80) return 'bg-teal-500 text-white';
  if (score >= 70) return 'bg-yellow-400 text-black';
  if (score >= 60) return 'bg-orange-400 text-black';
  return 'bg-red-500 text-white';
};

const ProgressBar = ({ value }) => {
  const pct = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
      <div
        className="h-4 rounded"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg, rgba(59,130,246,1), rgba(34,197,94,1))` }}
      />
    </div>
  );
};

const FarmScoreAnalysis = ({ data }) => {
  if (!data || !data.farmerScore) {
    return (
      <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
        <p className="text-yellow-700">No farm data available. Please submit farm data to see analysis.</p>
      </div>
    );
  }

  const {
    farmerScore = { score: 0, achievement: 'Not Rated' },
    yieldScore = 0,
    sustainabilityScore = 0,
    waterEfficiency = 0,
    fertilizerEfficiency = 0,
    growthProgression = 0,
    recommendations = [],
    environmentalConditions = {},
    cropType = 'Unknown'
  } = data;

  const overallHealth = Math.round((waterEfficiency + fertilizerEfficiency + sustainabilityScore) / 3);
  const productionEfficiency = Math.round((yieldScore + waterEfficiency) / 2);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Farm Analysis</h2>
            <p className="text-gray-600">Crop Type: {cropType}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold text-lg ${scoreColor(farmerScore.score)}`}>
            {farmerScore.score}%
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">{farmerScore.achievement}</span>
          </div>
          <ProgressBar value={farmerScore.score} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Production Metrics</h3>
            <MetricRow label="Yield Performance" value={`${yieldScore}%`} hint="Crop yield efficiency" />
            <MetricRow label="Growth Stage" value={`${growthProgression}%`} hint="Current development phase" />
            <MetricRow label="Production Efficiency" value={`${productionEfficiency}%`} />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Resource Management</h3>
            <MetricRow label="Water Usage" value={`${waterEfficiency}%`} hint="Water efficiency score" />
            <MetricRow label="Fertilizer Usage" value={`${fertilizerEfficiency}%`} hint="Nutrient efficiency" />
            <MetricRow label="Overall Health" value={`${overallHealth}%`} />
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Environmental Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-2 bg-white rounded border">
                <div className="text-sm text-gray-600">Temperature</div>
                <div className="font-medium">{environmentalConditions.temperature ?? 'N/A'}°C</div>
              </div>
              <div className="p-2 bg-white rounded border">
                <div className="text-sm text-gray-600">Rainfall</div>
                <div className="font-medium">{environmentalConditions.rainfall ?? 'N/A'} mm</div>
              </div>
              <div className="p-2 bg-white rounded border">
                <div className="text-sm text-gray-600">Irrigation</div>
                <div className="font-medium">{environmentalConditions.irrigation ?? 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg mt-4 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {recommendations && recommendations.length > 0 ? (
                recommendations.map((r, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{typeof r === 'string' ? r : r.message}</span>
                  </li>
                ))
              ) : (
                <li className="text-green-600 flex items-center">
                  <span className="mr-2">✓</span>
                  <span>No recommendations needed — everything looks good!</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmScoreAnalysis;