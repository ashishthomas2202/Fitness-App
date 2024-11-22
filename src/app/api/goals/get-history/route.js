//src/app/api/goals/get-history/route.js
import GoalHistory from "@/db/models/GoalHistory";
import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";

export async function GET(req) {
    await connectDB();

    const currentUser = await authenticatedUser();
    if (!currentUser) {
        return new Response(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    try {
        const query = { userId: currentUser.id };

        // Add date filtering
        if (from || to) {
            query.date = {};
            if (from) query.date.$gte = new Date(from);
            if (to) query.date.$lte = new Date(to);
        }

        const history = await GoalHistory.find(query)
            .sort({ date: -1 })
            .select("userId date goals notes createdAt updatedAt"); // Explicitly include notes

        return new Response(JSON.stringify({ success: true, data: history }), {
            status: 200,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch history",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

