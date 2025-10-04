import React from 'react';
import { motion } from 'framer-motion';

const getScoreData = (score) => {
  if (score >= 90) {
    return {
      icon: '🏆',
      message: 'Excellent farming decision! You\'re a master of sustainable agriculture!',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-500/10',
      progressColor: 'bg-yellow-500'
    };
  } else if (score >= 70) {
    return {
      icon: '🥇',
      message: 'Great work! Your farming practices are making a positive impact.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-500/10',
      progressColor: 'bg-blue-500'
    };
  } else if (score >= 50) {
    return {
      icon: '⚠️',
      message: 'Good effort, but you can optimize more. Try balancing resources.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-500/10',
      progressColor: 'bg-amber-500'
    };
  } else {
    return {
      icon: '❌',
      message: 'Rebalance resources for better results. Focus on sustainability.',
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-500/10',
      progressColor: 'bg-red-500'
    };
  }
};

const CircularProgress = ({ score, scoreData }) => (
  <div className="relative w-32 h-32">
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      {/* Background circle */}
      <circle
        className="stroke-current text-gray-200 dark:text-gray-700"
        strokeWidth="8"
        fill="transparent"
        r="42"
        cx="50"
        cy="50"
      />
      {/* Progress circle */}
      <motion.circle
        className={`stroke-current ${scoreData.color}`}
        strokeWidth="8"
        strokeLinecap="round"
        fill="transparent"
        r="42"
        cx="50"
        cy="50"
        initial={{ strokeDasharray: "0 264" }}
        animate={{ 
          strokeDasharray: `${(score / 100) * 264} 264`
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
    {/* Score text */}
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
    >
      <span className={`text-3xl font-bold ${scoreData.color}`}>{score}</span>
    </motion.div>
  </div>
);

const ScoreBar = ({ label, value, maxValue, scoreData, delay }) => (
  <div className="relative pt-1">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <span className={`text-xs font-bold ${value < 0 ? 'text-red-500' : scoreData.color}`}>
        {value >= 0 ? `+${value}` : value}
      </span>
    </div>
    <motion.div
      className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
    >
      <motion.div
        className={`h-full rounded-full ${value < 0 ? 'bg-red-500' : scoreData.progressColor}`}
        initial={{ width: "0%" }}
        animate={{ width: `${Math.abs(value / maxValue) * 100}%` }}
        transition={{ delay, duration: 0.5 }}
      />
    </motion.div>
  </div>
);

const FarmerScore = ({ score = 0, breakdown = {} }) => {
  const scoreData = getScoreData(score);
  const {
    yieldContribution = 0,
    sustainabilityContribution = 0,
    efficiencyBonus = 0,
    penalties = 0
  } = breakdown;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`relative p-6 rounded-xl ${scoreData.bgColor} transition-colors duration-300`}>
        {/* Icon Animation */}
        <motion.div
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl"
        >
          {scoreData.icon}
        </motion.div>

        <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
          {/* Circular Progress */}
          <div className="flex-shrink-0">
            <CircularProgress score={score} scoreData={scoreData} />
          </div>

          {/* Score Details */}
          <div className="flex-grow space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Farmer Score
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {scoreData.message}
              </p>
            </motion.div>

            {/* Score Breakdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <ScoreBar 
                label="Yield Impact" 
                value={yieldContribution} 
                maxValue={35} 
                scoreData={scoreData}
                delay={0.5}
              />
              <ScoreBar 
                label="Sustainability" 
                value={sustainabilityContribution} 
                maxValue={35} 
                scoreData={scoreData}
                delay={0.6}
              />
              <ScoreBar 
                label="Efficiency Bonus" 
                value={efficiencyBonus} 
                maxValue={30} 
                scoreData={scoreData}
                delay={0.7}
              />
              {penalties > 0 && (
                <ScoreBar 
                  label="Resource Penalties" 
                  value={-penalties} 
                  maxValue={30} 
                  scoreData={scoreData}
                  delay={0.8}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerScore;