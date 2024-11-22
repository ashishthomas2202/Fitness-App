import connectDB from "@/db/db";
import UserAchievement from "@/db/models/UserAchievement";
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

        const userAchievements = await UserAchievement.find({
            userId: currentUser.id,
        }).populate("achievementId");

        return new Response(
            JSON.stringify({ success: true, data: userAchievements }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user achievements:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch user achievements",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

