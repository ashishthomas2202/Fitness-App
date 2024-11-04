import ImageKit from "imagekit";
import formidable from "formidable";
import fs from "fs";
import { authenticatedUser } from "@/lib/user";
import { buffer } from "stream/consumers";

export async function POST(req) {
  // Initialize ImageKit with server-side credentials
  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  });

  try {
    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "You must be logged in to upload files",
        },
        { status: 401 }
      );
    }

    const data = await req.formData();
    // console.log("Data:", data);
    // Parse form data to get files
    const files = data.getAll("files") || [];

    // console.log("Files:", files);
    if (!files || !(files.length > 0)) {
      return Response.json(
        {
          success: false,
          message: "No files found in the request",
        },
        { status: 400 }
      );
    }

    // Define folder path based on user ID and current date
    const folderName =
      data?.get("folderName") ||
      `user/${currentUser.id}/${new Date().toISOString()}`;

    const uploadPromises = files.map(async (file) => {
      const fileBuffer = await buffer(file.stream()); // Convert each image stream to buffer
      // Upload the image buffer to ImageKit
      return imagekit.upload({
        file: fileBuffer, // Use the buffer for upload
        fileName: file.name, // Assuming 'name' holds the original filename
        folder: folderName,
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return Response.json(
      {
        success: true,
        message: "Files uploaded successfully",
        data: uploadedFiles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to upload files",
        error: error,
      },
      { status: 500 }
    );
  }
}
