// src/components/PhotoComparisonView.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export function PhotoComparisonView({ isOpen, onClose }) {
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);

  const handlePhotoSelect = (type, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === "before") {
        setBeforePreview(reader.result);
        setBeforePhoto(file);
      } else {
        setAfterPreview(reader.result);
        setAfterPhoto(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCombinedDownload = async () => {
    if (!beforePreview || !afterPreview) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const [beforeImg, afterImg] = await Promise.all([
        loadImage(beforePreview),
        loadImage(afterPreview),
      ]);

      const maxHeight = Math.max(beforeImg.height, afterImg.height);
      const totalWidth = beforeImg.width + afterImg.width;

      canvas.width = totalWidth;
      canvas.height = maxHeight + 60; // Extra space for labels

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(beforeImg, 0, 60);
      ctx.drawImage(afterImg, beforeImg.width, 60);

      ctx.fillStyle = "black";
      ctx.font = "bold 32px Arial";
      ctx.fillText("Before", 10, 40);
      ctx.fillText("After", beforeImg.width + 10, 40);

      canvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `progress-comparison-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const resetSelection = () => {
    setBeforePhoto(null);
    setAfterPhoto(null);
    setBeforePreview(null);
    setAfterPreview(null);
  };

  const handleClose = () => {
    onClose();
    resetSelection();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Photo Comparison</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Before Photo</h3>
            <div className="relative aspect-square border-2 border-dashed rounded-lg overflow-hidden">
              {beforePreview ? (
                <div className="relative group">
                  <img
                    src={beforePreview}
                    alt="Before preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setBeforePhoto(null);
                        setBeforePreview(null);
                      }}
                    >
                      Remove Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="block w-full h-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handlePhotoSelect("before", e.target.files[0])
                    }
                  />
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-sm">Upload before photo</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">After Photo</h3>
            <div className="relative aspect-square border-2 border-dashed rounded-lg overflow-hidden">
              {afterPreview ? (
                <div className="relative group">
                  <img
                    src={afterPreview}
                    alt="After preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setAfterPhoto(null);
                        setAfterPreview(null);
                      }}
                    >
                      Remove Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="block w-full h-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handlePhotoSelect("after", e.target.files[0])
                    }
                  />
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-sm">Upload after photo</span>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {beforePreview && afterPreview && (
          <div className="mt-4">
            <div className="flex justify-center gap-4">
              <Button onClick={resetSelection} variant="outline">
                Reset Photos
              </Button>
              <Button
                onClick={handleCombinedDownload}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Comparison
              </Button>
              <Button onClick={handleClose} variant="default">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
