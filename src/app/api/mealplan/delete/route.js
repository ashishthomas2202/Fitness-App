// src/app/api/mealplan/delete/route.js
import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import { ObjectId } from "mongodb"; // Import ObjectId properly

export async function POST(req) {
    try {
        await connectDB();

        const { mealId, date, userId } = await req.json();

        if (!mealId || !date || !userId) {
            return new Response(JSON.stringify({ success: false, message: "Missing parameters" }), { status: 400 });
        }

        // Ensure mealId and userId are ObjectIds
        const mealPlan = await MealPlan.findOneAndUpdate(
            { userId: new ObjectId(userId), "days.day": date },
            { $pull: { "days.$.meals": { _id: new ObjectId(mealId) } } },
            { new: true }
        );

        if (!mealPlan) {
            return new Response(JSON.stringify({ success: false, message: "Meal or meal plan not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, data: mealPlan }), { status: 200 });
    } catch (error) {
        console.error("Error deleting meal from meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
}
