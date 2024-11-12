import connectDB from "@/db/db";
import WorkoutPlan from "@/db/models/WorkoutPlan";
import Workout from "@/db/models/Workout";
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

    const workoutPlan = await WorkoutPlan.findOne({
      userId: currentUser.id,
      status: "active",
    })
      .populate({
        path: "days.workouts.workoutId", // Path to the nested workoutId field
        model: "Workout", // Reference to the Workout model
      })
      .sort({ status: 1, createdAt: -1 });

    if (!workoutPlan) {
      return Response.json(
        {
          success: false,
          message: "No active workout plans found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Active Workout plans retrieved successfully",
        data: workoutPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to get active workout plans",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
