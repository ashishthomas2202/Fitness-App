import axios from "axios";
import ImageKit from "imagekit";

// Authenticator function for ImageKit
const getImageKitAuth = async () => {
  try {
    const response = await axios.get("/api/auth/imagekit");
    if (response?.data?.success) {
      const { signature, expire, token } = response.data.data;
      return { signature, expire, token };
    } else {
      throw new Error("Failed to authenticate with ImageKit");
    }
  } catch (error) {
    throw new Error("ImageKit authentication failed.");
  }
};

// Initialize ImageKit without privateKey (frontend only needs public credentials)
const initializeImageKit = () => {
  console.log("called initializeImageKit");
  return new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  })
    .then((data) => {
      console.log("this is data");
      console.log("data", data);
    })
    .catch((err) => {
      console.log("this is an error");
      console.log("error", err);
    });
};

// Utility function to upload a single file
export const uploadFile = async (folderName, file) => {
  console.log("called uploadFile");
  try {
    const authData = await getImageKitAuth();
    console.log("authData", authData);
    // const imagekit = initializeImageKit();
    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });
    console.log("imagekit", imagekit);
    // Upload the file to the specified folder
    const uploadResponse = await imagekit.upload({
      file,
      fileName: `${new Date().toISOString()}-${file.name || "file"}`,
      folder: folderName,
      tags: ["user-upload"],
      useUniqueFileName: true,
      ...authData,
    });

    console.log("File uploaded:", uploadResponse); // Debugging step
    return uploadResponse.url; // Return the URL of the uploaded file
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("File upload failed.");
  }
};

// Utility function to upload multiple files
export const uploadFiles = async (folderName, filesArray) => {
  const authData = await getImageKitAuth();
  const imagekit = initializeImageKit();

  // Upload each file in sequence, preserving the original order
  const uploadPromises = filesArray.map(async (file) => {
    const uploadResponse = await imagekit.upload({
      file,
      fileName: `${new Date().toISOString()}-${file.name || "file"}`,
      folder: folderName,
      tags: ["user-upload"],
      useUniqueFileName: true,
      ...authData,
    });

    return {
      ...file,
      url: uploadResponse.url, // Add the new URL to the original file object
    };
  });

  // Wait for all uploads to complete
  const uploadedFilesWithUrls = await Promise.all(uploadPromises);
  return uploadedFilesWithUrls; // Return the array with new URLs
};
