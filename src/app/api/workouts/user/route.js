import connectDB from "@/db/db";
import Workout from "@/db/models/Workout";
import { authenticatedUser } from "@/lib/user";

export const revalidate = 60;
export async function GET(req) {
  try {
    // console.log("Current user:", currentUser);

    await connectDB();
    const user = await authenticatedUser();
    const workouts = await Workout.find({ createdBy: user.id });

    return Response.json(
      {
        success: true,
        data: workouts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching workouts:", error);
    // console.error("Error fetching workout:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch workout",
      },
      { status: 500 }
    );
  }
}
