// src/app/api/record/steps/[id]/delete/route.js
import { authenticatedUser } from "@/lib/user";
import Steps from "@/db/models/Steps";
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

    const record = await Steps.findOneAndDelete({
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
        message: "Steps record deleted successfully",
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