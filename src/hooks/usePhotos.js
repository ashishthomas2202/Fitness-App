// src/hooks/usePhotos.js
"use client";

import { useState, useEffect } from 'react';

export function usePhotos() {
  const [photos, setPhotos] = useState({});
  const [photoHistory, setPhotoHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/photos');
      const data = await response.json();
      
      if (data.success) {
        // Group latest photos by type
        const latestPhotos = {};
        const allPhotos = data.data;
        
        allPhotos.forEach(photo => {
          if (!latestPhotos[photo.type] || new Date(photo.date) > new Date(latestPhotos[photo.type].date)) {
            latestPhotos[photo.type] = photo;
          }
        });
        
        setPhotos(latestPhotos);
        setPhotoHistory(allPhotos);
      }
    } catch (err) {
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const uploadPhoto = async (type, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      await fetchPhotos(); // Refresh photos after successful upload
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletePhoto = async (id) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchPhotos(); // Refresh photos after deletion
      } else {
        throw new Error('Failed to delete photo');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    photos,
    photoHistory,
    loading,
    error,
    uploadPhoto,
    deletePhoto,
    refreshPhotos: fetchPhotos
  };
}