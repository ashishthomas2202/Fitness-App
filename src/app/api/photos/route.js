// src/app/api/photos/route.js
import { authenticatedUser } from "@/lib/user";
import Photo from "@/db/models/Photo";
import connectDB from "@/db/db";
import { uploadFile } from "@/integration/Imagekit"; 

export const revalidate = 60;

export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!file || !type) {
      return Response.json({
        success: false,
        message: "File and type are required"
      }, { status: 400 });
    }

    const imageUrl = await uploadFile(`/progress-photos/${user.id}`, file);

    const photo = new Photo({
      userId: user.id,
      imageUrl,
      type,
      date: new Date()
    });

    await photo.save();

    return Response.json({
      success: true,
      message: "Photo uploaded successfully",
      data: photo
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return Response.json({
      success: false,
      message: error.message || "Failed to upload photo"
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;

    const query = { userId: user.id };
    if (type) query.type = type;

    const photos = await Photo.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Photo.countDocuments(query);

    return Response.json({
      success: true,
      data: photos,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}