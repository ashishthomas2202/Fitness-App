import WorkoutPlan from "@/db/models/WorkoutPlan";
import connectDB from "@/db/db"; // DB connection utility
import * as yup from "yup";

// Workout Schema Validation using Yup
const workoutSchema = yup.object().shape({
  workoutId: yup.string().required("Workout ID is required"),
  order: yup
    .number()
    .min(1, "Order must be a positive integer")
    .required("Order is required"),
  sets: yup.number().min(1, "Sets must be at least 1").nullable(),
  reps: yup.number().min(1, "Reps must be at least 1").nullable(),
  durationMin: yup
    .number()
    .min(1, "Duration must be at least 1 minute")
    .nullable(),
});

const daySchema = yup.object().shape({
  day: yup.string().required("Day is required"),
  workouts: yup
    .array()
    .of(workoutSchema)
    .required("Workouts must be an array and cannot be empty"),
});

const workoutPlanSchema = yup.object().shape({
  userId: yup.string().required("User ID is required"),
  days: yup
    .array()
    .of(daySchema)
    .required("Days must be an array and cannot be empty"),
  status: yup.string().oneOf(["active", "inactive"]).default("active"),
  note: yup.string(),
});

export async function POST(req) {
  try {
    await connectDB();

    const jsonData = await req.json();

    // Validate the request body with Yup
    const { isValid, validatedData, errors } = await validateWorkoutPlanData(
      jsonData
    );

    if (!isValid) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    const { userId, days, status, note } = validatedData;

    // Save the workout plan to the database
    const workoutPlan = new WorkoutPlan({ userId, days, status, note });

    await workoutPlan.save();

    if (workoutPlan.status === "active") {
      // change status of all other workout plans to inactive
      const otherWorkoutPlans = await WorkoutPlan.updateMany(
        { userId, _id: { $ne: workoutPlan._id } },
        { status: "inactive" }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Workout plan created successfully",
        workoutPlan,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to create workout plan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function validateWorkoutPlanData(data) {
  try {
    await workoutPlanSchema.validate(data, { abortEarly: false });
    return { isValid: true, validatedData: data, errors: null };
  } catch (error) {
    return {
      isValid: false,
      errors: error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      })),
    };
  }
}
