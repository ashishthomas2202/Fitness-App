// src/app/api/goals/delete/[id]/route.js
import Goal from "@/db/models/Goal";
import { NextResponse } from "next/server";
import connectDB from "@/db/db";

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = params; // Extract goal ID from the URL

  try {
    const deletedGoal = await Goal.findByIdAndDelete(id);

    if (!deletedGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Goal deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


