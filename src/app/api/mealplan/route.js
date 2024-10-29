// src/app/api/mealplan/route.js

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

        const formattedDate = new Date(dateParam).toISOString().split('T')[0]; // Format date as YYYY-MM-DD

        const mealPlan = await MealPlan.findOne({
            userId: token.sub,
            "days.day": formattedDate,
        }).populate("days.meals.mealId");

        console.log("Fetched meal plan data:", mealPlan);

        if (!mealPlan) {
            return new Response(JSON.stringify({ success: true, data: [] }), { status: 200 });
        }

        return new Response(JSON.stringify({ success: true, data: mealPlan }), { status: 200 });
    } catch (error) {
        console.error("Error fetching meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
}
