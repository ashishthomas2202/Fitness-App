// src/utils/measurements.js
export const calculateProgress = (current, previous) => {
    if (!previous) return { difference: 0, percentChange: 0 };
    const difference = current - previous;
    const percentChange = ((difference / previous) * 100).toFixed(1);
    return { difference, percentChange };
  };
  
  export const convertMeasurements = {
    inToCm: (inches) => inches * 2.54,
    cmToIn: (cm) => cm / 2.54
  };