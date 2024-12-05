import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import { authenticatedUser } from "@/lib/user";

export async function GET(req) {
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

    // Fetch meal plans for the current user
    const mealPlans = await MealPlan.find({ userId: currentUser.id })
      .populate({
        path: "days.meals",
        model: "Meal",
      })
      .sort({ status: 1, createdAt: -1 });

    return Response.json(
      {
        success: true,
        message: "Meal plans retrieved successfully",
        data: mealPlans,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving meal plans:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get meal plans",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
