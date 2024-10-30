// src/app/api/mealplan/[id]/route.js
import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import { authenticatedUser } from "@/lib/user";

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return Response.json({ success: false, message: "Invalid meal plan ID" }, { status: 400 });
  }

  try {
    await connectDB();

    // Authenticate user
    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return Response.json({ success: false, message: "Unauthorized User" }, { status: 401 });
    }

    // Find the meal plan to ensure it belongs to the authenticated user
    const plan = await MealPlan.findOne({ _id: id, userId: currentUser.id });
    if (!plan) {
      return Response.json({ success: false, message: "Meal plan not found" }, { status: 404 });
    }

    // Delete the meal plan
    await MealPlan.findByIdAndDelete(id);

    return Response.json({ success: true, message: "Meal plan deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to delete meal plan", error: error.message }, { status: 500 });
  }
}
