import connectDB from "@/db/db";
import WorkoutPlan from "@/db/models/WorkoutPlan";
import { authenticatedUser } from "@/lib/user";

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return Response.json(
      { success: false, message: "Invalid plan ID" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Authenticate user
    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return Response.json(
        { success: false, message: "Unauthorized User" },
        { status: 401 }
      );
    }

    // Find the plan to ensure it belongs to the authenticated user
    const plan = await WorkoutPlan.findOne({ _id: id, userId: currentUser.id });

    if (!plan) {
      return Response.json(
        { success: false, message: "Plan not found" },
        { status: 404 }
      );
    }

    // Delete the plan
    await WorkoutPlan.findByIdAndDelete(id);

    return Response.json(
      { success: true, message: "Workout plan deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to delete workout plan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
