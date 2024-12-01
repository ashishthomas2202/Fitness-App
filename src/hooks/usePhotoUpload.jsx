// src/hooks/usePhotoUpload.js
import { useState, useCallback } from "react";

export function usePhotoUpload() {
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const uploadPhoto = useCallback(async (file, type) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploadProgress(0);
      setPreview(null);
    }
  }, []);

  return {
    preview,
    uploadProgress,
    error,
    handleFileSelect,
    uploadPhoto,
    resetUpload: () => {
      setPreview(null);
      setUploadProgress(0);
      setError(null);
    },
  };
}
