import connectDB from "@/db/db";
import GoalHistory from "@/db/models/GoalHistory";
import { authenticatedUser } from "@/lib/user";

export async function GET(req) {
    await connectDB();

    const currentUser = await authenticatedUser();
    if (!currentUser) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    try {
        const loggedGoals = await GoalHistory.find({ userId: currentUser.id })
            .distinct("name"); // Get only unique goal names
        return new Response(JSON.stringify({ success: true, loggedGoals }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "Failed to fetch logged goals", error: error.message }), { status: 500 });
    }
}
