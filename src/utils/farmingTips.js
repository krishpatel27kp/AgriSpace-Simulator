// Collection of sustainable farming tips with emojis
export const farmingTips = [
  {
    id: 1,
    tip: "💧 Smart irrigation saves water! Too much irrigation can reduce yield and waste resources. Monitor soil moisture and only water when needed.",
    category: "water",
  },
  {
    id: 2,
    tip: "🌱 Crop rotation is key! Switching crops each season helps maintain soil health and naturally prevents pest problems.",
    category: "soil",
  },
  {
    id: 3,
    tip: "☀️ Work with the weather! Check temperature forecasts to optimize planting times and reduce water waste.",
    category: "climate",
  },
  {
    id: 4,
    tip: "🌿 Natural pest control works! Plant marigolds and lavender near crops to attract beneficial insects that eat harmful pests.",
    category: "pests",
  },
  {
    id: 5,
    tip: "💚 Less fertilizer, more nature! Using too much fertilizer can harm soil microbes. Start with less and adjust based on crop health.",
    category: "fertilizer",
  },
  {
    id: 6,
    tip: "🌧️ Catch the rain! Installing rain barrels and creating water catchment systems can reduce irrigation needs significantly.",
    category: "water",
  },
  {
    id: 7,
    tip: "🦋 Biodiversity boosts yields! Plant different crop varieties together to improve resilience and attract helpful pollinators.",
    category: "biodiversity",
  },
  {
    id: 8,
    tip: "🍂 Mulch matters! Adding organic mulch helps retain soil moisture, suppress weeds, and gradually enriches your soil.",
    category: "soil",
  },
  {
    id: 9,
    tip: "🌡️ Temperature tracking pays off! Most crops have optimal temperature ranges. Monitor weather patterns to maximize growth.",
    category: "climate",
  },
  {
    id: 10,
    tip: "🌱 Cover crops protect soil! Plant cover crops during off-seasons to prevent erosion and naturally add nutrients.",
    category: "soil",
  }
];

// Function to get a random tip
export const getRandomTip = () => {
  const randomIndex = Math.floor(Math.random() * farmingTips.length);
  return farmingTips[randomIndex];
};

// Function to get a relevant tip based on simulation results
export const getRelevantTip = (simulationData) => {
  // Logic to choose relevant tip based on simulation performance
  if (simulationData.waterUsed > 800000) {
    return farmingTips.find(tip => tip.category === 'water');
  }
  if (simulationData.sustainabilityScore < 60) {
    return farmingTips.find(tip => tip.category === 'soil');
  }
  if (simulationData.details?.temperatureEffect < 70) {
    return farmingTips.find(tip => tip.category === 'climate');
  }
  
  // Default to random tip if no specific conditions are met
  return getRandomTip();
};