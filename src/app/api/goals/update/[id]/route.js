// src/app/api/goals/update/[id]/route.js
import Goal from "@/db/models/Goal";
import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized User" }), { status: 401 });
    }

    const {
      calorieGoal,
      weightGoal,
      stepsGoal,
      flightsClimbedGoal,
      distanceGoal,
      waterIntakeGoal,
      caloriesBurnedGoal,
    } = await req.json();

    const goal = await Goal.findById(params.id);

    if (!goal || goal.userId.toString() !== currentUser.id.toString()) {
      return new Response(JSON.stringify({ success: false, message: "Goal not found or unauthorized" }), { status: 404 });
    }

    // Update goal fields with new values
    goal.calorieGoal = calorieGoal || goal.calorieGoal;
    goal.weightGoal = weightGoal || goal.weightGoal;
    goal.stepsGoal = stepsGoal || goal.stepsGoal;
    goal.flightsClimbedGoal = flightsClimbedGoal || goal.flightsClimbedGoal;
    goal.distanceGoal = distanceGoal || goal.distanceGoal;
    goal.waterIntakeGoal = waterIntakeGoal || goal.waterIntakeGoal;
    goal.caloriesBurnedGoal = caloriesBurnedGoal || goal.caloriesBurnedGoal;

    await goal.save();

    return new Response(JSON.stringify({ success: true, goal }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Failed to update goal", error: error.message }), { status: 500 });
  }
}

