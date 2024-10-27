// src/app/api/mealplan/add/route.js
import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import Meal from "@/db/models/Meal";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectDB();

        const { mealId, date, mealType, userId, planName } = await req.json();

        // Check if all required fields are present
        if (!mealId || !date || !mealType || !userId || !planName) {
            return new Response(JSON.stringify({ success: false, message: "All fields are required" }), { status: 400 });
        }

        // Convert date to the name of the day
        const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

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
            order: 0, // or another default value if needed
            date: new Date(date).toISOString(), // Convert date to ISO string
        };

        // Update or create the meal plan document
        const mealPlan = await MealPlan.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), planName },
            {
                $setOnInsert: { userId: new mongoose.Types.ObjectId(userId), planName, startDate: new Date(date) },
                $set: { status: "in progress" },
                $addToSet: { days: { day: dayName, meals: [] } }, // Ensure the day entry exists
            },
            { upsert: true, new: true }
        );

        // Now push the meal to the specified day
        const updatedMealPlan = await MealPlan.findOneAndUpdate(
            {
                userId: new mongoose.Types.ObjectId(userId),
                planName,
                "days.day": dayName,
            },
            {
                $push: { "days.$.meals": mealData },
            },
            { new: true }
        );

        return new Response(JSON.stringify({ success: true, data: updatedMealPlan }), { status: 200 });
    } catch (error) {
        console.error("Error adding meal to meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
}
