// src/app/api/photos/[id]/note/route.js
import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";
import mongoose from "mongoose";
import Photo from "@/db/models/Photo";

export async function PATCH(req, { params }) {
  try {
    const conn = await connectDB();
    const user = await authenticatedUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { note } = await req.json();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return Response.json({ success: false, message: "Invalid ID format" }, { status: 400 });
    }

    const photo = await Photo.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      { $set: { note } },
      { new: true }
    ).lean();

    if (!photo) return Response.json({ success: false, message: "Photo not found" }, { status: 404 });

    return Response.json({ success: true, data: photo });
  } catch (error) {
    console.error('Update note error:', error);
    return Response.json({ 
      success: false, 
      message: error.message || "Failed to update note" 
    }, { status: 500 });
  }
}