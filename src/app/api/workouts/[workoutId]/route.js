import connectDB from "@/db/db";
import Workout from "@/db/models/Workout";

export const revalidate = 60;
export async function GET(req, { params }) {
  const { workoutId } = params;

  try {
    await connectDB();
    const workout = await Workout.findOne({
      _id: workoutId,
    });

    console.log("Workout:", workout);
    return Response.json(
      {
        success: true,
        data: workout,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching workout:", error);
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
