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

    const activeMealPlan = await MealPlan.findOne({
      userId: currentUser.id,
      status: "in progress",
    })
      .populate({
        path: "days.meals.mealId",
        model: "Meal",
        select: "name macros calories",
      })
      .sort({ createdAt: -1 });

    if (!activeMealPlan) {
      return Response.json(
        {
          success: false,
          message: "No active meal plans found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Active meal plan retrieved successfully",
        data: activeMealPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to get active meal plan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
