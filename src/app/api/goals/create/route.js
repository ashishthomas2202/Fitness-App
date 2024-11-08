// src/app/api/goals/create/route.js
import connectDB from "@/db/db";
import Goal from "@/db/models/Goal";
import { authenticatedUser } from "@/lib/user";

export async function POST(req) {
    try {
        await connectDB();

        const currentUser = await authenticatedUser();
        if (!currentUser) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized User" }),
                { status: 401 }
            );
        }

        const {
            calorieGoal,
            weightGoal,
            stepsGoal,
            flightsClimbedGoal,
            distanceGoal,
            waterIntakeGoal,
            caloriesBurnedGoal,
        } = await req.json();

        const goal = new Goal({
            userId: currentUser.id,
            calorieGoal,
            weightGoal,
            stepsGoal,
            flightsClimbedGoal,
            distanceGoal,
            waterIntakeGoal,
            caloriesBurnedGoal,
        });

        await goal.save();
        console.log("Goal saved:", goal);

        return new Response(JSON.stringify({ success: true, goal }), { status: 201 });
    } catch (error) {
        console.error("Error creating goal:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Failed to create goal", error: error.message }),
            { status: 500 }
        );
    }
}

