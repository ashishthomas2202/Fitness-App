// src/components/PhotoComparisonModal.jsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PhotoComparisonModal({ 
  isOpen, 
  onClose, 
  beforePhoto, 
  afterPhoto,
  onNavigate 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Photo Comparison</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Before</h3>
            {beforePhoto && (
              <img
                src={beforePhoto.imageUrl}
                alt="Before"
                className="w-full aspect-square object-cover rounded"
              />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">After</h3>
            {afterPhoto && (
              <img
                src={afterPhoto.imageUrl}
                alt="After"
                className="w-full aspect-square object-cover rounded"
              />
            )}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
