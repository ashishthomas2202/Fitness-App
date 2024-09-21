import { db } from "@/lib/firebase"; // Import your Firebase or DB setup here
import * as Yup from "yup";

// Define the Yup validation schema
const workoutSchema = Yup.object().shape({
  name: Yup.string().required("Workout name is required"),
  type: Yup.array().of(Yup.string()).min(1, "At least one workout type is required"),
  category: Yup.array().of(Yup.string()).min(1, "At least one category is required"),
  muscle_groups: Yup.array().of(Yup.string()).min(1, "At least one muscle group is required"),
  difficulty_level: Yup.string().required("Difficulty level is required"),
  equipment: Yup.array().of(Yup.string()).required("Equipment information is required"),
  duration_min: Yup.number().positive().required("Duration is required"),
  calories_burned_per_min: Yup.number().positive().required("Calories burned per minute is required"),
  sets: Yup.number().positive().integer().required("Number of sets is required"),
  reps: Yup.number().positive().integer().required("Number of reps is required"),
});

// Define the API route handler
export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();

    // Validate the request body against the schema
    await workoutSchema.validate(body);

    // Destructure the validated fields from the body
    const {
      name,
      type,
      category,
      muscle_groups,
      difficulty_level,
      equipment,
      duration_min,
      calories_burned_per_min,
      sets,
      reps,
    } = body;

    // Create the workout object
    const newWorkout = {
      name,
      type,
      category,
      muscle_groups,
      difficulty_level,
      equipment,
      duration_min,
      calories_burned_per_min,
      sets,
      reps,
      createdAt: new Date().toISOString(),
    };

    // Add the new workout to Firestore (or your database)
    const workoutRef = await db.collection("workouts").add(newWorkout);

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      data: {
        id: workoutRef.id,
        ...newWorkout,
      },
    }), { status: 200 });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid workout data",
        errors: error.errors,
      }), { status: 400 });
    } else {
      // Handle database errors
      console.error("Database error:", error);
      return new Response(JSON.stringify({
        success: false,
        message: "Failed to add workout to the database",
        error: error.message,
      }), { status: 500 });
    }
  }
}
