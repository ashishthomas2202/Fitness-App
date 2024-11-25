//src/app/achievements/all/route.js
import connectDB from "@/db/db";
import Achievement from "@/db/models/Achievement";
import UserAchievement from "@/db/models/UserAchievement";
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

    try {
        // Fetch all achievements
        const achievements = await Achievement.find({});

        // Fetch user progress for achievements
        const userAchievements = await UserAchievement.find({
            userId: currentUser.id,
        });

        // Merge achievements with user progress
        const achievementsWithProgress = achievements.map((ach) => {
            const userProgress = userAchievements.find(
                (ua) => ua.achievementId.toString() === ach._id.toString()
            );
            return {
                ...ach.toJSON(),
                progress: userProgress?.progress || 0,
                completed: userProgress?.completed || false,
            };
        });

        return new Response(
            JSON.stringify({ success: true, data: achievementsWithProgress }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}
