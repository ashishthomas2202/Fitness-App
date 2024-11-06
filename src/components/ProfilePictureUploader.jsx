"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IKContext, IKUpload } from "imagekitio-react";
import ImageKit from "imagekit";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { Loader2, UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProfilePictureUploader = ({ defaultURL, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState(
    defaultURL || "/default-user-icon.png"
  );
  const [selectedFile, setSelectedFile] = useState(null); // Store the selected file
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previousUrl, setPreviousUrl] = useState(null);

  // Authentication function for ImageKit
  const authenticator = async () => {
    try {
      const response = await axios.get("/api/auth/imagekit");
      if (response?.data?.success) {
        const { signature, expire, token } = response?.data?.data;
        return { signature, expire, token };
      } else {
        throw new Error("Failed to authenticate with ImageKit");
      }
    } catch (error) {
      setUploadError("Authentication failed.");
    }
  };

  useEffect(() => {
    setPreviousUrl(defaultURL);
    setImagePreview(defaultURL || "/default-user-icon.png");
  }, [defaultURL]);

  const handleFileUploadClick = () => {
    document.getElementById("ik-upload").click();
  };

  // Callback for upload errors
  const onError = (err) => {
    setUploadError("Image upload failed. Please try again.");
    setIsUploading(false);
  };

  const onSuccess = async (res) => {
    // Delete the previous image
    if (previousUrl?.includes("imagekit")) {
      const fileName = previousUrl.split("/").pop(); // Extract the file ID from the URL

      await axios
        .delete(`/api/auth/imagekit/delete/${fileName}`)
        .catch((error) => {
          return null;
        });
    }

    // Update the previousUrl to the newly uploaded image's URL
    setPreviousUrl(res?.url);

    setIsUploading(false);
    setImagePreview(res?.url); // Show the uploaded image

    if (onImageUpload) {
      onImageUpload(res?.url); // Pass the uploaded image URL to parent component
    }
  };

  return (
    <div className="h-52 w-52 relative mx-auto mb-10">
      <IKContext
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
        authenticator={authenticator}
      >
        {/* Display image preview */}
        <Image
          className="object-cover object-center rounded-full"
          src={imagePreview} // Fallback to default icon if no preview
          alt="Profile Picture"
          fill
          priority
        />

        {/* Hidden IKUpload component to handle the upload */}
        <IKUpload
          id="ik-upload"
          file={selectedFile}
          folder="/profile-pictures" // Folder to store the uploaded image
          fileName={`${new Date()}-${
            selectedFile?.name || "profile-picture.jpg"
          }`} // File name from the selected file
          onUploadStart={() => setIsUploading(true)}
          onError={onError}
          onSuccess={onSuccess}
          className="hidden" // Hide the actual IKUpload input
        />

        {/* Upload button */}
        <Button
          className={cn(
            "bottom-0 right-0 h-12 w-12 y-10 rounded-full absolute",
            isUploading ? "p-0" : "p-0 pb-1"
          )}
          type="button"
          // onClick={handleFileUploadClick} // Trigger file selection dialog on click
          onClick={handleFileUploadClick} // Trigger file selection on click
        >
          {isUploading ? (
            <Loader2 className="h-12 w-12 animate-spin" />
          ) : (
            <UploadIcon size={20} />
          )}
          {/* {isUploading ? "Uploading..." : "Upload"} */}
        </Button>

        {/* Display error if upload fails */}
        {uploadError && <p className="text-red-500">{uploadError}</p>}
      </IKContext>
    </div>
  );
};
