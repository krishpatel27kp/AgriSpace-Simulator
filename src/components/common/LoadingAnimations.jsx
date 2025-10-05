import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <motion.div
      className="h-16 w-16"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 360],
        borderRadius: ["50%", "25%", "50%"]
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      style={{
        background: "linear-gradient(to right, #00ff95, #0084ff)",
      }}
    />
  </div>
);

export const LoadingDots = () => (
  <div className="flex space-x-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-3 h-3 bg-green-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2
        }}
      />
    ))}
  </div>
);