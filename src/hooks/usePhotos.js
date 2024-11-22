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
        const allPhotos = data.data.map(photo => ({
          id: photo._id,
          imageUrl: photo.imageUrl,
          type: photo.type,
          date: photo.date,
          note: photo.note,
          isActive: !photo.isDeleted
        }));
        
        const latestPhotos = {};
        allPhotos
          .filter(photo => photo.isActive)
          .forEach(photo => {
            if (!latestPhotos[photo.type] || new Date(photo.date) > new Date(latestPhotos[photo.type].date)) {
              latestPhotos[photo.type] = photo;
            }
          });
        
        setPhotos(latestPhotos);
        setPhotoHistory(allPhotos);
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (type, file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Upload failed');

      const newPhoto = {
        id: data.data._id,
        imageUrl: data.data.imageUrl,
        type: data.data.type,
        date: data.data.date,
        note: data.data.note,
        isActive: true
      };

      setPhotos(prev => ({
        ...prev,
        [type]: newPhoto
      }));

      setPhotoHistory(prev => [newPhoto, ...prev]);

      return true;
    } catch (err) {
      console.error('Failed to upload photo:', err);
      setError('Failed to upload photo');
      return false;
    }
  };

  const updatePhotoNote = async (photoId, note) => {
    try {
      const response = await fetch(`/api/photos/${photoId}/note`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      });
      
      if (!response.ok) throw new Error('Failed to update note');
      
      setPhotos(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].id === photoId) {
            updated[key] = { ...updated[key], note };
          }
        });
        return updated;
      });
      
      setPhotoHistory(prev => 
        prev.map(photo => 
          photo.id === photoId ? { ...photo, note } : photo
        )
      );
      
      return true;
    } catch (err) {
      console.error('Failed to update note:', err);
      return false;
    }
  };

  const deletePhoto = async (id, fromHistory = false) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true, fromHistory })
      });
      
      if (!response.ok) throw new Error('Failed to delete photo');
      
      // If deleting from main view, just mark as inactive
      if (!fromHistory) {
        setPhotos(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            if (updated[key].id === id) {
              delete updated[key];
            }
          });
          return updated;
        });
      } else {
        // If deleting from history, remove completely
        setPhotoHistory(prev => prev.filter(photo => photo.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return {
    photos,
    photoHistory,
    loading,
    error,
    handlePhotoUpload,
    deletePhoto,
    updatePhotoNote,
    refreshPhotos: fetchPhotos
  };
}