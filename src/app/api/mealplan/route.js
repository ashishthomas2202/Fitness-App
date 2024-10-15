import { getServerAuthSession } from "@/lib/auth"; // Import your session handler
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

        console.log("Querying meal plan for userId:", userId);
        const mealPlan = await MealPlan.find({ userId }).populate("meals.meal");

        if (!mealPlan) {
            return new Response(
                JSON.stringify({ success: false, message: "Meal plan not found" }),
                { status: 404 }
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
