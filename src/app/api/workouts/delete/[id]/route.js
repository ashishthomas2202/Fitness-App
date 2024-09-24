import connectDB from "@/db/db";
import Workout from "@/db/models/Workout";

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return Response.json(
      {
        success: false,
        message: "Workout ID is required",
      },
      { status: 400 }
    );
  }

  console.log("Deleting workout with ID:", id);
  try {
    await connectDB();
    const workout = await Workout.findByIdAndDelete(id);

    if (!workout) {
      return Response.json(
        {
          success: false,
          message: "Workout not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Workout deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting workout:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to delete workout",
      },
      { status: 500 }
    );
  }
}
