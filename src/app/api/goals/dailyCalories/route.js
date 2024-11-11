// import dbConnect from '@/lib/dbConnect';
import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";
import MealPlan from "@/models/MealPlan";

// export default async function handler(req, res) {
export async function GET(req) {
  // const { query } = req;
  try {
    await connectDB();
    const currentUser = await authenticatedUser(req);

    if (!currentUser) {
      return Response.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const mealPlans = await MealPlan.find({
      userId: currentUser.id,
      date: today,
    });

    const totalCalories = mealPlans.reduce(
      (sum, meal) => sum + meal.calories,
      0
    );
    return Response.json(
      {
        success: true,
        message: "Total calories fetched successfully",

        data: totalCalories,
      },
      { status: 200 }
    );
  } catch (error) {
    // res.status(400).json({ success: false, error: error.message });
    return Response.json(
      {
        success: false,
        message: "Error fetching total calories",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
