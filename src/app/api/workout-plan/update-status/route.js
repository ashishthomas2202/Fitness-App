import connectDB from "@/db/db";
import WorkoutPlan from "@/db/models/WorkoutPlan";
import { authenticatedUser } from "@/lib/user";

export async function PATCH(req) {
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

    const { planId, status } = await req.json();

    if (!planId || !["active", "inactive"].includes(status)) {
      return Response.json(
        {
          success: false,
          message: "Invalid plan ID or status",
        },
        { status: 400 }
      );
    }

    // If setting a plan to active, make sure all other plans are inactive
    if (status === "active") {
      await WorkoutPlan.updateMany(
        { userId: currentUser.id },
        { status: "inactive" }
      );
    }

    // Update the status of the specific plan
    const updatedPlan = await WorkoutPlan.findByIdAndUpdate(planId, { status });

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
        message: "Workout plan status updated successfully",
        data: updatedPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update workout plan status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
