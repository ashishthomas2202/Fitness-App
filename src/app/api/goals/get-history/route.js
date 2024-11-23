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

        // Adjust `from` and `to` to include the entire day
        if (from || to) {
            query.completedAt = {};
            if (from) query.completedAt.$gte = new Date(`${from}T00:00:00.000Z`);
            if (to) query.completedAt.$lte = new Date(`${to}T23:59:59.999Z`);
        }


        const history = await GoalHistory.find(query)
            .sort({ completedAt: -1 })
            .select("userId completedAt name progress target isCompleted");


        return new Response(JSON.stringify({ success: true, data: history }), {
            status: 200,
        });
    } catch (error) {
        console.error("Failed to fetch goal history:", error);
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
