// src/components/PhotoFullscreenView.jsx
"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function PhotoFullscreenView({ isOpen, onClose, photo }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img
          src={photo.imageUrl}
          alt="Progress Photo"
          className="max-w-full max-h-full object-contain"
        />

        {photo.note && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50">
            <p className="text-white text-sm max-w-4xl mx-auto">{photo.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
