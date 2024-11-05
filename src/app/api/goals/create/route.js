// src/app/api/goals/create/route.js
import connectDB from "@/db/db";
import Goal from "@/db/models/Goal";
import { authenticatedUser } from "@/lib/user";

export async function POST(req) {
    try {
        await connectDB();

        const currentUser = await authenticatedUser();
        if (!currentUser) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized User" }), { status: 401 });
        }

        const { calorieGoal, weightGoal, startDate, endDate } = await req.json();

        // Validate dates to ensure they’re valid before saving
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return new Response(JSON.stringify({ success: false, message: "Invalid start or end date" }), { status: 400 });
        }

        const goal = new Goal({
            userId: currentUser.id,
            calorieGoal,
            weightGoal,
            startDate: parsedStartDate, // Store directly as Date object
            endDate: parsedEndDate,      // Store directly as Date object
        });

        await goal.save();
        console.log("Goal saved:", goal);

        return new Response(JSON.stringify({ success: true, goal }), { status: 201 });
    } catch (error) {
        console.error("Error creating goal:", error);
        return new Response(JSON.stringify({ success: false, message: "Failed to create goal", error: error.message }), { status: 500 });
    }
}
