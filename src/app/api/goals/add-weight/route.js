// src/app/api/goals/add-weight/route.js
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

        const { weight, date } = await req.json();
        if (!weight || !date) {
            return new Response(
                JSON.stringify({ success: false, message: "Weight and date are required" }),
                { status: 400 }
            );
        }

        const userId = currentUser.id;
        const goal = await Goal.findOne({ userId });

        if (!goal) {
            return new Response(
                JSON.stringify({ success: false, message: "Goal not found" }),
                { status: 404 }
            );
        }

        // Check if there's an existing entry for the specified date
        const existingEntryIndex = goal.weightHistory.findIndex(
            (entry) => entry.date.toISOString().split("T")[0] === date
        );

        if (existingEntryIndex !== -1) {
            // Update existing entry
            goal.weightHistory[existingEntryIndex].weight = weight;
        } else {
            // Add new entry
            goal.weightHistory.push({ date, weight });
        }

        await goal.save();
        return new Response(
            JSON.stringify({ success: true, weightHistory: goal.weightHistory }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding/updating weight:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Failed to add/update weight" }),
            { status: 500 }
        );
    }
}
