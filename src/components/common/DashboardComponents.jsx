import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../theme/colors';

export const DashboardCard = ({ title, subtitle, children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl ${className}`}
  >
    {title && (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    )}
    {children}
  </motion.div>
);

export const MetricCard = ({ icon: Icon, label, value, trend, className = '' }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 ${className}`}
  >
    <div className="flex items-center space-x-3">
      {Icon && <Icon className="text-xl text-gray-400" />}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && (
          <p className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

export const ProgressRing = ({ value, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (100 - value) * circumference / 100;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-green-400"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{value}%</span>
      </div>
    </div>
  );
};

export const Tooltip = ({ children, content }) => (
  <div className="group relative inline-block">
    {children}
    <div className="invisible group-hover:visible absolute z-10 w-48 p-2 mt-2 text-sm text-gray-100 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200">
      {content}
    </div>
  </div>
);