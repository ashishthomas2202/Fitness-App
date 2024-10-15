import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectDB();

        const { mealId, date, userId } = await req.json();

        if (!mealId || !date || !userId) {
            return new Response(JSON.stringify({ success: false, message: "Invalid data provided" }), {
                status: 400,
            });
        }

        // Ensure the mealId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(mealId)) {
            return new Response(JSON.stringify({ success: false, message: "Invalid mealId format" }), {
                status: 400,
            });
        }

        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        // Find the meal plan for the week and user
        const mealPlan = await MealPlan.findOne({ userId, weekStartDate: startOfWeek });

        if (!mealPlan) {
            return new Response(JSON.stringify({ success: false, message: "Meal plan not found" }), {
                status: 404,
            });
        }

        // Remove the meal from the meal plan
        const updatedMeals = mealPlan.meals.filter(meal => meal.meal.toString() !== mealId);

        // Update the meal plan
        mealPlan.meals = updatedMeals;
        await mealPlan.save();

        return new Response(JSON.stringify({ success: true, data: mealPlan }), { status: 200 });
    } catch (error) {
        console.error("Error removing meal from meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
            status: 500,
        });
    }
}
