import React from 'react';
import { motion } from 'framer-motion';

const InputSlider = ({ label, value, onChange, min = 0, max = 100, color = 'emerald' }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className={`text-sm font-semibold text-${color}-600 dark:text-${color}-400`}>
          {value}%
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 appearance-none cursor-pointer`}
          style={{
            '--range-color': `var(--${color}-500)`,
            background: `linear-gradient(to right, var(--range-color) 0%, var(--range-color) ${value}%, var(--tw-gray-200) ${value}%, var(--tw-gray-200) 100%)`
          }}
        />
        <motion.div
          className={`absolute -top-1 w-4 h-4 rounded-full bg-${color}-500 shadow-lg cursor-grab active:cursor-grabbing`}
          style={{ left: `calc(${value}% - 0.5rem)` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
      </div>
    </div>
  );
};

export default InputSlider;