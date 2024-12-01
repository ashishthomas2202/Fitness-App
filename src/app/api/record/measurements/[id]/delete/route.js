// src/app/api/measurements/[id]/route.js
import { authenticatedUser } from "@/lib/user";
import Measurement from "@/db/models/Measurement";
import connectDB from "@/db/db";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const measurement = await Measurement.findOneAndDelete({
      _id: id,
      userId: user.id,
    });

    if (!measurement) {
      return Response.json(
        {
          success: false,
          message: "Measurement not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Measurement deleted successfully",
    });
  } catch (error) {
    console.error("Delete measurement error:", error);
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
