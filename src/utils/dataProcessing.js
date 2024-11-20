// src/utils/dataProcessing.js
export const processWeightData = (data) => {
    return data.map(record => ({
      date: format(new Date(record.date), 'yyyy-MM-dd'),
      weight: record.weight,
      unit: record.unit
    }));
  };
  
  export const processMeasurementData = (data) => {
    return data.map(record => ({
      date: format(new Date(record.date), 'yyyy-MM-dd'),
      ...record.measurements
    }));
  };