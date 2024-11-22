import connectDB from "@/db/db";
import Achievement from "@/db/models/Achievement";
import UserAchievement from "@/db/models/UserAchievement";
import { authenticatedUser } from "@/lib/user";

export async function POST(req) {
    try {
        await connectDB();

        const currentUser = await authenticatedUser();
        if (!currentUser) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { achievementKey, progressIncrement = 1 } = await req.json();

        if (!achievementKey) {
            return new Response(
                JSON.stringify({ success: false, message: "Achievement key is required" }),
                { status: 400 }
            );
        }

        if (typeof progressIncrement !== "number" || progressIncrement <= 0) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid progress increment" }),
                { status: 400 }
            );
        }

        // Normalize achievementKey for consistent queries (optional)
        const normalizedKey = achievementKey.toLowerCase();

        // Find the achievement by its key
        const achievement = await Achievement.findOne({ key: normalizedKey });
        if (!achievement) {
            return new Response(
                JSON.stringify({ success: false, message: "Achievement not found" }),
                { status: 404 }
            );
        }

        // Find or create the user's achievement progress
        let userAchievement = await UserAchievement.findOne({
            userId: currentUser.id,
            achievementId: achievement._id,
        });

        if (!userAchievement) {
            userAchievement = new UserAchievement({
                userId: currentUser.id,
                achievementId: achievement._id,
                progress: 0,
                completed: false,
            });
        }

        // Return early if already completed
        if (userAchievement.completed) {
            return new Response(
                JSON.stringify({ success: true, data: userAchievement }),
                { status: 200 }
            );
        }

        // Increment progress and mark as completed if target is reached
        userAchievement.progress += progressIncrement;
        if (userAchievement.progress >= achievement.target) {
            userAchievement.progress = achievement.target;
            userAchievement.completed = true;
        }

        await userAchievement.save();

        return new Response(
            JSON.stringify({ success: true, data: userAchievement }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating achievement progress:", error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}
