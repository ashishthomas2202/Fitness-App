// src/app/api/record/measurements/[id]/update/route.js
import { authenticatedUser } from "@/lib/user";
import Measurement from "@/db/models/Measurement";
import connectDB from "@/db/db";

export async function PATCH(req, { params }) {
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
    const { field } = await req.json();

    const result = await Measurement.findOneAndUpdate(
      {
        _id: id,
        userId: user.id,
      },
      {
        $unset: { [`measurements.${field}`]: 1 },
      },
      {
        new: true,
        runValidators: false,
      }
    );

    if (!result) {
      return Response.json(
        {
          success: false,
          message: "Measurement not found",
        },
        { status: 404 }
      );
    }

    if (Object.keys(result.measurements || {}).length === 0) {
      await Measurement.findByIdAndDelete(id);
    }

    return Response.json({
      success: true,
      message: "Measurement updated successfully",
    });
  } catch (error) {
    console.error("Update measurement error:", error);
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
