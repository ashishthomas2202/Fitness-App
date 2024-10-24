import connectDB from "@/db/db";
import WorkoutPlan from "@/db/models/WorkoutPlan";
import WorkoutPlans from "@/db/models/WorkoutPlan";
import { authenticatedUser } from "@/lib/user";

export async function GET(req) {
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

    const workoutPlan = await WorkoutPlan.find({
      userId: currentUser.id,
    }).sort("-updatedAt");

    return Response.json(
      {
        success: true,
        message: "Workout plans retrieved successfully",
        data: workoutPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to get workout plans",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
