// src/app/api/goals/update/[id]/route.js
import Goal from "@/db/models/Goal";
import { NextResponse } from "next/server";
import connectDB from "@/db/db";

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params; // Extract goal ID from the URL
  const { calorieGoal, weightGoal } = await request.json();

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      {
        calorieGoal,
        weightGoal,
        $push: { weightHistory: { weight: weightGoal } }
      },
      { new: true } // Return the updated document
    );

    if (!updatedGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(updatedGoal, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
