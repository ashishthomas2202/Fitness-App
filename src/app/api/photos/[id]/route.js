// src/app/api/photos/[id]/route.js
import { authenticatedUser } from "@/lib/user";
import Photo from "@/db/models/Photo";
import connectDB from "@/db/db";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export const revalidate = 60;

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user)
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const photo = await Photo.findOne({ _id: params.id, userId: user.id });
    if (!photo)
      return Response.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );

    return Response.json({ success: true, data: photo });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user)
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { isDeleted, fromHistory } = await req.json();

    if (fromHistory) {
      const photo = await Photo.findOne({ _id: params.id, userId: user.id });
      if (photo) {
        try {
          await imagekit.deleteFile(photo.imageKitFileId);
        } catch (imagekitError) {
          console.error("ImageKit deletion failed:", imagekitError);
        }
        await Photo.deleteOne({ _id: params.id, userId: user.id });
      }
    } else {
      // Mark as deleted if from main view
      await Photo.findOneAndUpdate(
        { _id: params.id, userId: user.id },
        { $set: { isDeleted } }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete photo error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to delete photo",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user)
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const photo = await Photo.findOne({ _id: params.id, userId: user.id });
    if (!photo)
      return Response.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );

    try {
      await imagekit.deleteFile(photo.imageKitFileId);
    } catch (imagekitError) {
      console.error("ImageKit deletion failed:", imagekitError);
    }

    await Photo.deleteOne({ _id: params.id });

    return Response.json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Photo deletion error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to delete photo",
      },
      { status: 500 }
    );
  }
}
