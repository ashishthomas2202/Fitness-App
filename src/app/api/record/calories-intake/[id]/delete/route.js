// src/app/api/record/calories-intake/[id]/delete/route.js
import { authenticatedUser } from "@/lib/user";
import CaloriesIntake from "@/db/models/CaloriesIntake";
import connectDB from "@/db/db";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized User" }),
        { status: 401 }
      );
    }

    const record = await CaloriesIntake.findOneAndDelete({
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
        message: "Calories intake record deleted successfully",
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