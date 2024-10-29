// src/app/api/mealplan/add/route.js
import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import Meal from "@/db/models/Meal";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectDB();

        const { mealId, date, mealType, userId, planName } = await req.json();

        if (!mealId || !date || !mealType || !userId || !planName) {
            return new Response(JSON.stringify({ success: false, message: "All fields are required" }), { status: 400 });
        }

        // Convert date to ISO format string without time
        const dateOnly = new Date(date).toISOString().split("T")[0];

        // Retrieve meal details by mealId
        const meal = await Meal.findById(mealId);
        if (!meal) {
            return new Response(JSON.stringify({ success: false, message: "Meal not found" }), { status: 404 });
        }

        const mealData = {
            mealId: meal._id,
            mealType,
            name: meal.name,
            category: meal.category,
            diet: meal.diet,
            macros: meal.macros,
            calories: meal.calories,
            ingredients: meal.ingredients,
            steps: meal.steps.map((step) => ({ description: step.description })),
            preparation_time_min: meal.preparation_time_min,
            order: 0,
            date: dateOnly,
        };

        // Check if the meal plan exists for the user and plan name
        const mealPlan = await MealPlan.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), planName },
            { $setOnInsert: { userId: new mongoose.Types.ObjectId(userId), planName, status: "in progress" } },
            { upsert: true, new: true }
        );

        // Check if the day already exists in the `days` array
        const existingDay = mealPlan.days.find((dayEntry) => dayEntry.day === dateOnly);

        if (existingDay) {
            // If the day exists, push the meal to the existing day's meals array
            existingDay.meals.push(mealData);
        } else {
            // If the day doesn't exist, add a new day object to the `days` array
            mealPlan.days.push({ day: dateOnly, meals: [mealData] });
        }

        // Save the updated meal plan
        await mealPlan.save();

        return new Response(JSON.stringify({ success: true, data: mealPlan }), { status: 200 });
    } catch (error) {
        console.error("Error adding meal to meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
}
