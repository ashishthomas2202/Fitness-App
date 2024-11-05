// src/app/api/goals/weight-history/route.js
import connectDB from "@/db/db";
import Goal from "@/db/models/Goal";
import { authenticatedUser } from "@/lib/user";

export async function GET(req) {
    try {
        await connectDB();
        const currentUser = await authenticatedUser();
        if (!currentUser) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized User" }),
                { status: 401 }
            );
        }

        const userId = currentUser.id;
        const url = new URL(req.url);
        const date = url.searchParams.get("date");

        const goal = await Goal.findOne({ userId });
        if (!goal) {
            return new Response(
                JSON.stringify({ success: false, message: "Goal not found" }),
                { status: 404 }
            );
        }

        if (date) {
            // Fetch weight for a specific date
            const specificDateWeight = goal.weightHistory.find(
                (entry) => entry.date.toISOString().split("T")[0] === date
            );
            return new Response(
                JSON.stringify({
                    success: true,
                    weight: specificDateWeight ? specificDateWeight.weight : null,
                }),
                { status: 200 }
            );
        } else {
            // Return all weight history
            return new Response(
                JSON.stringify({ success: true, weightHistory: goal.weightHistory }),
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error fetching weight history:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Failed to fetch weight history" }),
            { status: 500 }
        );
    }
}
