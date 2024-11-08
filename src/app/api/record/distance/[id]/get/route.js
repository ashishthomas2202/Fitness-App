// src/app/api/record/distance/[id]/get/route.js
import { authenticatedUser } from "@/lib/user";
import Distance from "@/db/models/Distance";
import connectDB from "@/db/db";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized User" }),
        { status: 401 }
      );
    }

    const record = await Distance.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!record) {
      return Response.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: record,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}