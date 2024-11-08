// src/app/api/goals/route.js
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

        const goals = await Goal.find({ userId: currentUser.id }).lean();

        return new Response(JSON.stringify({ success: true, data: goals }), { status: 200 });
    } catch (error) {
        console.error("Error fetching goals:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Failed to fetch goals", error: error.message }),
            { status: 500 }
        );
    }
}
