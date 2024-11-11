import connectDB from "@/db/db";
import WorkoutPlan from "@/db/models/WorkoutPlan";
import { authenticatedUser } from "@/lib/user";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized User",
        },
        { status: 401 }
      );
    }

    const { id: planId } = params;
    const { color } = await req.json();

    if (!planId) {
      return Response.json(
        {
          success: false,
          message: "Invalid plan ID",
        },
        { status: 400 }
      );
    }

    // Update the color of the specific plan
    const updatedPlan = await WorkoutPlan.findByIdAndUpdate(planId, { color });

    if (!updatedPlan) {
      return Response.json(
        {
          success: false,
          message: "Workout plan not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Workout plan color updated successfully",
        data: updatedPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update workout plan color",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
