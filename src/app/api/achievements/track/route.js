//src//app/api/achievements/track/route.js
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
                JSON.stringify({
                    success: false,
                    message: "Achievement key is required",
                }),
                { status: 400 }
            );
        }

        if (typeof progressIncrement !== "number" || progressIncrement <= 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid progress increment",
                }),
                { status: 400 }
            );
        }

        // Normalize the achievement key
        const normalizedKey = achievementKey.toLowerCase();

        // Find the achievement in the database
        const achievement = await Achievement.findOne({ title: achievementKey }); // Query by title directly
        if (!achievement) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Achievement not found",
                }),
                { status: 404 }
            );
        }
        // Find or initialize the user's achievement record
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
                lastUpdated: new Date(),
            });
        }

        // Handle streak resets if the last update was more than a day ago
        const now = new Date();
        const lastUpdated = new Date(userAchievement.lastUpdated || now);
        const differenceInDays = Math.floor(
            (now - lastUpdated) / (1000 * 60 * 60 * 24)
        );

        if (differenceInDays > 1) {
            userAchievement.progress = 0; // Reset streak
            console.log(
                `Streak reset for achievement "${achievement.title}" due to inactivity.`
            );
        }

        // Return early if achievement is already completed
        if (userAchievement.completed) {
            console.log(
                `Achievement "${achievement.title}" already completed for user ${currentUser.id}.`
            );
            return new Response(
                JSON.stringify({ success: true, data: userAchievement }),
                { status: 200 }
            );
        }

        // Increment progress and check for completion
        userAchievement.progress += progressIncrement;

        if (userAchievement.progress >= achievement.target) {
            userAchievement.progress = achievement.target;
            userAchievement.completed = true;
            console.log(
                `Achievement "${achievement.title}" completed for user ${currentUser.id}.`
            );
        }

        userAchievement.lastUpdated = now;
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
