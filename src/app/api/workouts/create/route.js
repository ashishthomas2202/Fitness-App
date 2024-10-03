import connectDB from "@/db/db";
import Workout from "@/db/models/Workout";
import { authenticatedAdmin } from "@/lib/user";
import * as Yup from "yup";

// Define the Yup validation schema
const workoutSchema = Yup.object().shape({
  name: Yup.string().required("Workout name is required"),
  type: Yup.array()
    .of(Yup.string())
    .min(1, "At least one workout type is required"),
  category: Yup.array()
    .of(Yup.string())
    .min(1, "At least one category is required"),
  muscle_groups: Yup.array()
    .of(Yup.string())
    .min(1, "At least one muscle group is required"),
  difficulty_level: Yup.string().required("Difficulty level is required"),
  equipment: Yup.array()
    .of(Yup.string())
    .required("Equipment information is required"),
  duration_min: Yup.number().positive().required("Duration is required"),
  calories_burned_per_min: Yup.number()
    .positive()
    .required("Calories burned per minute is required"),
  sets: Yup.number()
    .positive()
    .integer()
    .required("Number of sets is required"),
  reps: Yup.number()
    .positive()
    .integer()
    .required("Number of reps is required"),
  description: Yup.string(),
});

// Define the API route handler
export async function POST(req) {
  try {
    await connectDB();

    const admin = await authenticatedAdmin();

    if (!admin) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized User",
        }),
        { status: 401 }
      );
    }

    // Parse the request body
    const jsonData = await req.json();

    // Validate the workout data
    const { isValid, validatedData, errors } = await validateWorkoutData(
      jsonData
    );

    if (!isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Validation failed",
          errors,
        }),
        { status: 400 }
      );
    }

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
    } = validatedData;

    // Create the workout object
    const newWorkout = Workout({
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
    });

    // Save the new workout to the database
    await newWorkout.save();

    // Return a success response
    return Response.json(
      {
        success: true,
        message: "Workout added successfully",
        data: newWorkout,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors that occur during the request
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

async function validateWorkoutData(data) {
  try {
    const validatedData = await workoutSchema.validate(data, {
      abortEarly: false,
    });
    return { isValid: true, validatedData, errors: null };
  } catch (errors) {
    return { isValid: false, errors };
  }
}
