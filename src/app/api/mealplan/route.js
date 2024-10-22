import { getServerAuthSession } from "@/lib/auth";
import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";

export async function GET(req, res) {
    try {
        console.log("Connecting to the database...");
        await connectDB();

        // Use getServerAuthSession to get the session
        const session = await getServerAuthSession(req, res);
        console.log("Session details:", session);

        if (!session || !session.user) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const dateParam = new URL(req.url).searchParams.get('date');
        const selectedDate = new Date(dateParam);

        console.log("Querying meal plan for userId:", userId, "on date:", selectedDate);

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const mealPlan = await MealPlan.find({
            userId,
            "meals.date": { $gte: startOfDay, $lte: endOfDay },
        }).populate("meals.meal");

        if (!mealPlan || mealPlan.length === 0) {
            return new Response(
                JSON.stringify({ success: true, data: [] }),
                { status: 200 }
            );
        }

        console.log("Meal plan fetched:", mealPlan);
        return new Response(
            JSON.stringify({ success: true, data: mealPlan }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching meal plan:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
