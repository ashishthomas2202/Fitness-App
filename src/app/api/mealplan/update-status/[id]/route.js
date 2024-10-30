// src/app/api/mealplan/[id]/status.js
import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import { authenticatedUser } from "@/lib/user";

export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const currentUser = await authenticatedUser();

        if (!currentUser) return Response.json({ success: false, message: "Unauthorized User" }, { status: 401 });

        const { id: planId } = params;
        const { status } = await req.json();

        if (!planId || !["complete", "in progress"].includes(status)) {
            return Response.json({ success: false, message: "Invalid plan ID or status" }, { status: 400 });
        }

        const updatedPlan = await MealPlan.findByIdAndUpdate(planId, { status });

        if (!updatedPlan) {
            return Response.json({ success: false, message: "Meal plan not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Meal plan status updated", data: updatedPlan }, { status: 200 });
    } catch (error) {
        return Response.json({ success: false, message: "Failed to update meal plan status", error: error.message }, { status: 500 });
    }
}
