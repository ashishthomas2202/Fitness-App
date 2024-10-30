// src/app/api/mealplan/index.js
import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import Meal from "@/db/models/Meal";
import { authenticatedUser } from "@/lib/user";

export async function GET(req) {
    try {
        await connectDB();
        const currentUser = await authenticatedUser();

        if (!currentUser) return Response.json({ success: false, message: "Unauthorized User" }, { status: 401 });

        const mealPlans = await MealPlan.find({ userId: currentUser.id })
            .populate({
                path: "days.meals.mealId",
                select: "name macros calories", // Include name, macros, and calories from the Meal document
            })
            .sort({ status: 1, createdAt: -1 });


        return Response.json({ success: true, message: "Meal plans retrieved", data: mealPlans }, { status: 200 });
    } catch (error) {
        return Response.json({ success: false, message: "Failed to get meal plans", error: error.message }, { status: 500 });
    }
}
