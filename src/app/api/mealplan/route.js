import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    try {
        await connectDB();

        // Parse user token
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
        }

        // Extract date from request params
        const dateParam = new URL(req.url).searchParams.get('date');
        if (!dateParam) {
            return new Response(JSON.stringify({ success: false, message: "Date is required" }), { status: 400 });
        }

        // Convert the date string into a suitable format
        const selectedDate = new Date(dateParam);
        const dayString = selectedDate.toLocaleString("en-US", { weekday: "long" });

        // Query meal plans for the user on the specific day
        const mealPlan = await MealPlan.findOne({
            userId: token.sub,
            "days.day": dayString,
        }).populate({
            path: "days.meals.mealId",
            model: "Meal"
        });

        // Check if mealPlan exists and structure the response correctly
        if (!mealPlan) {
            return new Response(JSON.stringify({ success: true, data: [] }), { status: 200 });
        }

        // Ensure dates are valid ISO strings
        mealPlan.days.forEach(day => {
            day.meals.forEach(meal => {
                if (meal.date && !isNaN(new Date(meal.date))) {
                    meal.date = new Date(meal.date).toISOString(); // Only set if it's valid
                } else {
                    console.warn("Invalid date found in meal:", meal); // Log any invalid dates
                    meal.date = null; // Set to null or handle accordingly
                }
            });
        });

        return new Response(JSON.stringify({ success: true, data: mealPlan }), { status: 200 });
    } catch (error) {
        console.error("Error fetching meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
}

