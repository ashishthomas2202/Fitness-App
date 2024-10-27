import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    try {
        await connectDB();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
        }

        const dateParam = new URL(req.url).searchParams.get("date");
        if (!dateParam) {
            return new Response(JSON.stringify({ success: false, message: "Date is required" }), { status: 400 });
        }

        const selectedDate = new Date(dateParam);
        const dayString = selectedDate.toLocaleString("en-US", { weekday: "long" });

        const mealPlan = await MealPlan.findOne({
            userId: token.sub,
            "days.day": dayString,
        }).populate("days.meals.mealId");

        if (!mealPlan || mealPlan.length === 0) {
            return new Response(JSON.stringify({ success: true, data: [] }), { status: 200 });
        }

        return new Response(JSON.stringify({ success: true, data: mealPlan }), { status: 200 });
    } catch (error) {
        console.error("Error fetching meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
}

