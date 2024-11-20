// src/app/api/photos/upload/route.js
import { authenticatedUser } from "@/lib/user";
import Photo from "@/db/models/Photo";
import connectDB from "@/db/db";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

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

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: `${Date.now()}-${file.name}`,
      folder: `/progress-photos/${user.id}`,
    });

    const photo = new Photo({
      userId: user.id,
      imageUrl: uploadResult.url,
      imageKitFileId: uploadResult.fileId,
      type
    });

    await photo.save();

    return Response.json({
      success: true,
      message: "Photo uploaded successfully",
      data: photo
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}