import WorkoutPlan from "@/db/models/WorkoutPlan";
import connectDB from "@/db/db"; // DB connection utility
import * as yup from "yup";
import { authenticatedUser } from "@/lib/user";

// Workout Schema Validation using Yup (reused from create API)
const workoutSchema = yup.object().shape({
  workoutId: yup.string().required("Workout ID is required"),
  order: yup
    .number()
    .min(0, "Order must be a positive integer")
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
  planName: yup.string().required("Plan name is required"),
  days: yup
    .array()
    .of(daySchema)
    .required("Days must be an array and cannot be empty"),
  status: yup.string().oneOf(["active", "inactive"]).default("active"),
  note: yup.string(),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().nullable(),
  color: yup.string().required("Color is required"),
});

export async function PUT(req, { params }) {
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

    const { id } = params;

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Workout plan ID is required",
        },
        { status: 400 }
      );
    }

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

    const { planName, days, note, startDate, endDate, status, color } =
      validatedData;

    // Find and update the workout plan by ID
    const workoutPlan = await WorkoutPlan.findOneAndUpdate(
      { _id: id, userId: currentUser.id },
      { planName, days, note, startDate, endDate, status, color },
      { new: true, runValidators: true }
    );

    if (!workoutPlan) {
      return Response.json(
        {
          success: false,
          message:
            "Workout plan not found or you are not authorized to update it",
        },
        { status: 404 }
      );
    }

    // If status is "active", make other workout plans inactive
    if (workoutPlan.status === "active") {
      await WorkoutPlan.updateMany(
        { userId: currentUser.id, _id: { $ne: workoutPlan._id } },
        { status: "inactive" }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Workout plan updated successfully",
        workoutPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update workout plan",
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

// import connectDB from "@/db/db";
// import WorkoutPlan from "@/db/models/WorkoutPlan";
// import { authenticatedUser } from "@/lib/user";

// export async function PATCH(req) {
//   try {
//     await connectDB();

//     const currentUser = await authenticatedUser();

//     if (!currentUser) {
//       return Response.json(
//         {
//           success: false,
//           message: "Unauthorized User",
//         },
//         { status: 401 }
//       );
//     // }

//     const { planId, status } = await req.json();

//     if (!planId || !["active", "inactive"].includes(status)) {
//       return Response.json(
//         {
//           success: false,
//           message: "Invalid plan ID or status",
//         },
//         { status: 400 }
//       );
//     }

//     // If setting a plan to active, make sure all other plans are inactive
//     if (status === "active") {
//       await WorkoutPlan.updateMany(
//         { userId: currentUser.id },
//         { status: "inactive" }
//       );
//     }

//     // Update the status of the specific plan
//     const updatedPlan = await WorkoutPlan.findByIdAndUpdate(planId, { status });

//     if (!updatedPlan) {
//       return Response.json(
//         {
//           success: false,
//           message: "Workout plan not found",
//         },
//         { status: 404 }
//       );
//     }

//     return Response.json(
//       {
//         success: true,
//         message: "Workout plan status updated successfully",
//         data: updatedPlan,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return Response.json(
//       {
//         success: false,
//         message: "Failed to update workout plan status",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
