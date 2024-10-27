import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectDB();

        const { mealId, date, userId, mealType } = await req.json();

        if (!mealId || !date || !userId || !mealType) {
            return new Response(JSON.stringify({ success: false, message: "Invalid data provided" }), {
                status: 400,
            });
        }

        // Ensure the mealId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(mealId)) {
            return new Response(JSON.stringify({ success: false, message: "Invalid mealId format" }), {
                status: 400,
            });
        }

        const mealDate = new Date(date);
        mealDate.setHours(0, 0, 0, 0);

        // Find the specific day's meal plan for the user
        const mealPlan = await MealPlan.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            "days.day": mealDate,
        });

        if (!mealPlan) {
            return new Response(JSON.stringify({ success: false, message: "Meal plan not found" }), {
                status: 404,
            });
        }

        // Find the correct day entry and remove the meal from that day
        const dayEntry = mealPlan.days.find(day => day.day.getTime() === mealDate.getTime());

        if (dayEntry) {
            // Remove the meal from the day's meals array
            dayEntry.meals = dayEntry.meals.filter(
                meal => meal.mealId.toString() !== mealId || meal.mealType !== mealType
            );

            // If no meals remain for the day, remove the day entry from days array
            if (dayEntry.meals.length === 0) {
                mealPlan.days = mealPlan.days.filter(day => day.day.getTime() !== mealDate.getTime());
            }

            await mealPlan.save();
        }

        return new Response(JSON.stringify({ success: true, data: mealPlan }), { status: 200 });
    } catch (error) {
        console.error("Error removing meal from meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
            status: 500,
        });
    }
}
