// src/app/api/mealplan/today/route.js

import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import { format } from "date-fns";  

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        console.log("Received userId:", userId);

        if (!userId) {
            return Response.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const today = new Date();
        const todayName = format(today, "EEEE"); 

        const mealPlans = await MealPlan.find({
            userId,
            "days.day": todayName,  
        });

        console.log("Meal Plans for today:", mealPlans);

        let totalCalories = 0;

        //loop through each meal plan
        mealPlans.forEach((plan) => {
            plan.days.forEach((dayPlan) => {
                if (dayPlan.day === todayName) {

                    dayPlan.meals.forEach((meal) => {
                        totalCalories += meal.calories;
                    });
                }
            });
        });

        console.log("Total calories for today after calculation:", totalCalories);

        return Response.json({ success: true, calories: totalCalories }, { status: 200 });
    } catch (error) {
        console.error("Error in /api/mealplan/today:", error);
        return Response.json({ success: false, message: "Failed to retrieve meal plan data", error: error.message }, { status: 500 });
    }
}
