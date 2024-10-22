import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import Meal from "@/db/models/Meal";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectDB();

        const { mealId, date, mealType, userId } = await req.json();
        console.log("Incoming Meal ID:", mealId);
        console.log("Incoming data:", { mealId, date, mealType, userId });

        if (!mealId || !mealType || !date || !userId) {
            return new Response(JSON.stringify({ success: false, message: "Invalid meal selection or missing data" }), {
                status: 400,
            });
        }

        // Ensure the mealId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(mealId)) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid mealId format" }),
                { status: 400 }
            );
        }

        // Find the meal by its ID in the database
        const meal = await Meal.findById(mealId);
        if (!meal) {
            return new Response(JSON.stringify({ success: false, message: "Meal not found" }), {
                status: 404,
            });
        }

        // Get start of the week date (Monday)
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay();
        const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust if Sunday
        startOfWeek.setDate(startOfWeek.getDate() - distanceToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        // Find or create the meal plan for the week
        const mealPlan = await MealPlan.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), weekStartDate: startOfWeek },
            { $setOnInsert: { userId: new mongoose.Types.ObjectId(userId), weekStartDate: startOfWeek, meals: [] } },
            { upsert: true, new: true }
        );

        // Add the mealId and other meal plan details to the meal plan
        mealPlan.meals.push({
            meal: meal._id,
            mealType,
            date,
        });

        await mealPlan.save();

        return new Response(
            JSON.stringify({ success: true, data: mealPlan.meals[mealPlan.meals.length - 1] }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding meal to meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
            status: 500,
        });
    }
}

