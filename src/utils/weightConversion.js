// src/utils/weightConversion.js
export const convertWeight = {
    kgToLbs: (kg) => kg * 2.20462,
    lbsToKg: (lbs) => lbs / 2.20462
  };
  
  export const standardizeWeight = (weight, fromUnit) => {
    return fromUnit === 'lbs' ? convertWeight.lbsToKg(weight) : weight;
  };