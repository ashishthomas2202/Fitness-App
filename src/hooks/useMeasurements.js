"use client";
import { useState, useEffect } from 'react';

export function useMeasurements() {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/measurements');
      const data = await response.json();
      if (data.success) {
        setMeasurements(data.data);
      }
    } catch (err) {
      setError('Failed to load measurements');
    } finally {
      setLoading(false);
    }
  };

  const addMeasurement = async (measurementData, selectedDate) => {
    try {
      const submitDate = new Date(selectedDate);
      submitDate.setHours(12, 0, 0, 0);
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          measurements: measurementData,
          date: submitDate.toISOString(),
          unit: 'in'
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchMeasurements();
        return true;
      }
      throw new Error(data.message);
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteMeasurement = async (id) => {
    try {
      const response = await fetch(`/api/record/measurements/${id}/delete`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchMeasurements();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete measurement error:', error);
      return false;
    }
  };

const updateMeasurement = async (id, field) => {
  try {
    console.log('Deleting field:', field, 'from measurement:', id); // Debug log
    const response = await fetch(`/api/record/measurements/${id}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field })
    });
    const data = await response.json();
    console.log('Update response:', data); // Debug log
    if (data.success) {
      await fetchMeasurements();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Update measurement error:', error);
    return false;
  }
};

  useEffect(() => {
    fetchMeasurements();
  }, []);

  return {
    measurements,
    loading,
    error,
    addMeasurement,
    deleteMeasurement,
    updateMeasurement,
    fetchMeasurements
  };
}